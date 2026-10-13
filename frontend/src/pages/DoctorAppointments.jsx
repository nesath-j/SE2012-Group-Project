import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doctorsApi } from '../services/api';
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  Star,
  ChevronRight,
  Info
} from 'lucide-react';

export default function DoctorAppointments() {
  const { user, role, showToast, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [memberAppointments, setMemberAppointments] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('book'); // 'book' | 'my-appointments'

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      loadDoctorSchedules(selectedDoctor.doctorId);
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (user && activeSubTab === 'my-appointments') {
      loadMemberAppointments();
    }
  }, [user, activeSubTab]);

  const loadDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const list = await doctorsApi.getAll();
      setDoctors(list);
      if (list.length > 0) {
        setSelectedDoctor(list[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const loadDoctorSchedules = async (doctorId) => {
    setLoadingSchedules(true);
    setSelectedSchedule(null);
    try {
      const slots = await doctorsApi.getSchedules(doctorId);
      setSchedules(slots);
      if (slots.length > 0) {
        setSelectedSchedule(slots[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const loadMemberAppointments = async () => {
    if (!user) return;
    setLoadingAppointments(true);
    try {
      const list = await doctorsApi.getAppointmentsByMember(user.userId);
      setMemberAppointments(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please log in to schedule a clinical consultation.', 'info');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    if (!selectedDoctor || !selectedSchedule) {
      showToast('Please select a doctor and an available time slot.', 'error');
      return;
    }

    setIsBooking(true);
    try {
      // Backend expects: appointmentDate format e.g. "2026-10-15T10:00:00"
      const appointmentDateStr = `${selectedSchedule.availableDate}T${selectedSchedule.startTime}`;

      const payload = {
        memberId: user.userId,
        doctorId: selectedDoctor.doctorId,
        scheduleId: selectedSchedule.scheduleId,
        appointmentDate: appointmentDateStr,
      };

      const result = await doctorsApi.bookAppointment(payload);
      showToast(`Appointment booked with Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}!`, 'success');
      
      // Refresh available schedules
      loadDoctorSchedules(selectedDoctor.doctorId);
      setActiveSubTab('my-appointments');
    } catch (err) {
      showToast(err.message || 'Appointment booking failed.', 'error');
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this consultation?')) return;
    try {
      await doctorsApi.cancelAppointment(appointmentId);
      showToast('Appointment cancelled successfully.', 'info');
      loadMemberAppointments();
      if (selectedDoctor) loadDoctorSchedules(selectedDoctor.doctorId);
    } catch (err) {
      showToast(err.message || 'Failed to cancel appointment.', 'error');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        <div>
          <div style={{
            fontSize: '0.825rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#0284c7',
            marginBottom: '0.25rem',
          }}>
            Vision Express Clinical Department
          </div>
          <h2>Doctor Eye Consultations</h2>
          <p style={{ maxWidth: '650px', fontSize: '0.95rem' }}>
            Book comprehensive examinations with accredited optometrists and ophthalmologists. Every appointment includes refraction testing, intraocular pressure check, and cornea evaluation.
          </p>
        </div>

        {/* Tab switchers */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          padding: '0.35rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <button
            onClick={() => setActiveSubTab('book')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: activeSubTab === 'book' ? 700 : 500,
              backgroundColor: activeSubTab === 'book' ? '#ffffff' : 'transparent',
              color: activeSubTab === 'book' ? '#0284c7' : '#64748b',
              boxShadow: activeSubTab === 'book' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
            }}
          >
            Book New Consultation
          </button>
          <button
            onClick={() => setActiveSubTab('my-appointments')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: activeSubTab === 'my-appointments' ? 700 : 500,
              backgroundColor: activeSubTab === 'my-appointments' ? '#ffffff' : 'transparent',
              color: activeSubTab === 'my-appointments' ? '#0284c7' : '#64748b',
              boxShadow: activeSubTab === 'my-appointments' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
            }}
          >
            My Appointments
          </button>
        </div>
      </div>

      {activeSubTab === 'book' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}>
          {/* Step 1: Select Doctor */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#0284c7',
                color: '#fff',
                fontSize: '0.825rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>1</span>
              <span>Select Optometrist / Doctor</span>
            </h3>

            {loadingDoctors ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <span className="spinner spinner-primary" />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {doctors.map((doc) => {
                  const isSelected = selectedDoctor?.doctorId === doc.doctorId;
                  return (
                    <div
                      key={doc.doctorId}
                      onClick={() => setSelectedDoctor(doc)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '16px',
                        border: `2px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                        backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                        boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.15)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#e0f2fe',
                        color: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}>
                        {doc.firstName?.[0]}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.05rem' }}>
                            Dr. {doc.firstName} {doc.lastName}
                          </h4>
                          <span className="badge badge-primary" style={{ fontSize: '0.675rem' }}>
                            {doc.licenseNumber}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {doc.specialization}
                        </div>
                        <div style={{ fontSize: '0.785rem', color: '#64748b' }}>
                          {doc.bio || 'Comprehensive eye refractions and clinical diagnosis.'}
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 size={22} color="#0284c7" style={{ flexShrink: 0 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Choose Slot & Book */}
          <div className="glass-card" style={{ padding: '1.75rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#0284c7',
                color: '#fff',
                fontSize: '0.825rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>2</span>
              <span>Available Time Slots</span>
            </h3>

            {selectedDoctor && (
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.2rem' }}>
                  Booking Consultation With:
                </div>
                <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </strong>
                <div style={{ fontSize: '0.825rem', color: '#0369a1' }}>
                  {selectedDoctor.specialization}
                </div>
              </div>
            )}

            {loadingSchedules ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <span className="spinner spinner-primary" />
              </div>
            ) : schedules.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px dashed #cbd5e1',
                marginBottom: '1.5rem',
              }}>
                <Clock size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  No unbooked slots available for this doctor right now.
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  Please select another doctor or check back shortly.
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                  Select Examination Slot:
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.65rem',
                }}>
                  {schedules.map((slot) => {
                    const isSelected = selectedSchedule?.scheduleId === slot.scheduleId;
                    return (
                      <button
                        key={slot.scheduleId}
                        type="button"
                        onClick={() => setSelectedSchedule(slot)}
                        style={{
                          padding: '0.75rem 0.5rem',
                          borderRadius: '10px',
                          border: `1.5px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                          backgroundColor: isSelected ? '#e0f2fe' : '#ffffff',
                          color: isSelected ? '#0369a1' : '#1e293b',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.25rem',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Calendar size={14} />
                        <span>{slot.availableDate}</span>
                        <strong style={{ fontSize: '0.775rem' }}>
                          {slot.startTime?.slice(0, 5)} - {slot.endTime?.slice(0, 5)}
                        </strong>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <form onSubmit={handleBookAppointment}>
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '0.825rem',
                color: '#166534',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                <span>Consultation fee waived for Silver, Gold & Platinum members!</span>
              </div>

              <button
                type="submit"
                disabled={isBooking || !selectedSchedule || schedules.length === 0}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem' }}
              >
                {isBooking ? <span className="spinner" /> : (
                  <>
                    <Calendar size={18} />
                    <span>Confirm Consultation Appointment</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* SubTab 2: My Doctor Consultations */
        <div>
          {!user ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
            }}>
              <User size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <h3>Please Log In to View Your Consultations</h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Your appointments history is linked to your member profile.
              </p>
              <button
                onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                className="btn btn-primary"
              >
                Log In
              </button>
            </div>
          ) : loadingAppointments ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <span className="spinner spinner-primary" />
            </div>
          ) : memberAppointments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px dashed #cbd5e1',
            }}>
              <Calendar size={40} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
              <h3>No Appointments Booked Yet</h3>
              <p style={{ color: '#64748b', marginBottom: '1.25rem' }}>
                Schedule a consultation with our licensed optometry team today.
              </p>
              <button
                onClick={() => setActiveSubTab('book')}
                className="btn btn-primary btn-sm"
              >
                Book Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {memberAppointments.map((app) => {
                const doc = doctors.find(d => d.doctorId === app.doctorId);
                const isCancelled = app.status === 'CANCELLED';
                const isCompleted = app.status === 'COMPLETED';
                return (
                  <div
                    key={app.doctorAppointmentId}
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1.25rem',
                      opacity: isCancelled ? 0.7 : 1,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>
                          Dr. {doc ? `${doc.firstName} ${doc.lastName}` : `Doctor #${app.doctorId}`}
                        </h4>
                        <span className={`badge ${
                          isCompleted ? 'badge-emerald' : isCancelled ? 'badge-rose' : 'badge-primary'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {doc?.specialization || 'Clinical Optometry'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                        <Calendar size={16} color="#0284c7" />
                        <span>Date & Time: <strong>{app.appointmentDate?.replace('T', ' ')}</strong></span>
                      </div>

                      {/* Consultation notes written by doctor */}
                      {app.consultationNotes && (
                        <div style={{
                          marginTop: '0.85rem',
                          backgroundColor: '#f8fafc',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          borderLeft: '3px solid #0284c7',
                          fontSize: '0.85rem',
                        }}>
                          <strong style={{ color: '#0f172a' }}>Doctor Consultation Notes: </strong>
                          <span style={{ color: '#475569' }}>{app.consultationNotes}</span>
                        </div>
                      )}
                    </div>

                    {!isCancelled && !isCompleted && (
                      <button
                        onClick={() => handleCancelAppointment(app.doctorAppointmentId)}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#f43f5e', borderColor: '#fecdd3' }}
                      >
                        <Trash2 size={16} />
                        <span>Cancel Consultation</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
