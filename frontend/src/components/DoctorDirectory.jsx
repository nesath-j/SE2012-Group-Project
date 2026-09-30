import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle, 
  Sparkles, 
  MapPin, 
  PhoneCall, 
  UserCheck 
} from 'lucide-react';
import { usersApi, DEFAULT_DOCTORS } from '../api/api';

export default function DoctorDirectory({ onNotify, currentUser }) {
  const [doctors, setDoctors] = useState(DEFAULT_DOCTORS);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    date: '2026-10-05',
    timeSlot: '10:30 AM',
    patientName: currentUser ? `${currentUser.firstName} ${currentUser.lastName || ''}` : '',
    patientPhone: currentUser ? currentUser.phone || '' : '',
    reason: 'Comprehensive Eye Examination & Vision Check'
  });

  useEffect(() => {
    async function loadDoctors() {
      try {
        // Calls backend GET /api/users/doctors
        const docStrings = await usersApi.getDoctorProfiles();
        console.log('Loaded doctor profiles from backend:', docStrings);
      } catch (err) {
        console.warn('Could not reach backend doctors API:', err);
      }
    }
    loadDoctors();
  }, []);

  const handleOpenBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingSuccess(false);
    if (currentUser) {
      setAppointmentForm(prev => ({
        ...prev,
        patientName: `${currentUser.firstName} ${currentUser.lastName || ''}`,
        patientPhone: currentUser.phone || ''
      }));
    }
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    onNotify(
      'success',
      'Appointment Confirmed',
      `Your consultation with ${selectedDoctor.name} on ${appointmentForm.date} at ${appointmentForm.timeSlot} is scheduled.`
    );
  };

  return (
    <section className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="section-header">
        <span className="section-pretitle">Clinical Staff & Optometrists</span>
        <h2 className="section-title">Consult Our Eye Care Specialists</h2>
        <p className="section-subtitle">
          From pediatric vision therapy to specialized laser surgery consultations, our licensed optometrists and ophthalmologists provide world-class clinical care.
        </p>
      </div>

      <div className="doctors-grid">
        {doctors.map(doctor => (
          <div key={doctor.id} className="glass-card glass-card-hover doctor-card">
            <div className="doctor-header">
              <div className="doctor-avatar-box">
                <img src={doctor.avatar} alt={doctor.name} className="doctor-avatar-img" />
              </div>
              <div className="doctor-meta-col">
                <h3 className="doctor-name-text">{doctor.name}</h3>
                <span className="doctor-title-text">{doctor.title}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{doctor.degrees}</span>
              </div>
            </div>

            <div className="doctor-info-list">
              <div className="doctor-info-row">
                <Award size={16} color="#38bdf8" />
                <span><strong>Specialty:</strong> {doctor.specialization}</span>
              </div>
              <div className="doctor-info-row">
                <Clock size={16} color="#10b981" />
                <span><strong>Experience:</strong> {doctor.experience}</span>
              </div>
              <div className="doctor-info-row">
                <Calendar size={16} color="#f59e0b" />
                <span><strong>Clinic Hours:</strong> {doctor.availability}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px' }}>
              <span className="badge badge-green">Accepting Patients</span>
              <button className="btn-primary" onClick={() => handleOpenBooking(doctor)}>
                <Calendar size={15} />
                <span>Book Visit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Booking Modal */}
      {selectedDoctor && (
        <div className="modal-overlay" onClick={() => setSelectedDoctor(null)}>
          <div 
            className="glass-card" 
            style={{ maxWidth: '520px', width: '100%', padding: '32px', background: '#0f172a' }} 
            onClick={e => e.stopPropagation()}
          >
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={36} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Appointment Scheduled</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Confirmation ref #VE-DOC-{Math.floor(Math.random() * 89999 + 10000)} sent to your phone.
                </p>
                <div className="glass-card" style={{ padding: '16px', textAlign: 'left', marginBottom: '24px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Doctor: <strong style={{ color: '#fff' }}>{selectedDoctor.name}</strong></div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Date & Time: <strong style={{ color: '#38bdf8' }}>{appointmentForm.date} at {appointmentForm.timeSlot}</strong></div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Patient: <strong style={{ color: '#fff' }}>{appointmentForm.patientName}</strong></div>
                </div>
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => setSelectedDoctor(null)}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <img src={selectedDoctor.avatar} alt={selectedDoctor.name} style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem' }}>Book with {selectedDoctor.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#38bdf8' }}>{selectedDoctor.title}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Full Patient Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      required 
                      value={appointmentForm.patientName}
                      onChange={(e) => setAppointmentForm({...appointmentForm, patientName: e.target.value})}
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Preferred Date</label>
                      <input 
                        type="date" 
                        className="input-field" 
                        required 
                        value={appointmentForm.date}
                        onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Time Slot</label>
                      <select 
                        className="input-field"
                        value={appointmentForm.timeSlot}
                        onChange={(e) => setAppointmentForm({...appointmentForm, timeSlot: e.target.value})}
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="01:15 PM">01:15 PM</option>
                        <option value="03:45 PM">03:45 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Mobile Phone</label>
                    <input 
                      type="tel" 
                      className="input-field" 
                      required 
                      value={appointmentForm.patientPhone}
                      onChange={(e) => setAppointmentForm({...appointmentForm, patientPhone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Primary Concern / Service</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={appointmentForm.reason}
                      onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setSelectedDoctor(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <UserCheck size={16} />
                    <span>Confirm Booking</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
