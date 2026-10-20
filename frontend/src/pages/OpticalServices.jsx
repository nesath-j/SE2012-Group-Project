import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { serviceAppointmentsApi, staffApi } from '../services/api';
import {
  Wrench,
  Sliders,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  Sparkles,
  Layers
} from 'lucide-react';

export default function OpticalServices({ onNavigateTab }) {
  const { user, role, isEmployee, isManager, isAdmin, showToast, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  const [services, setServices] = useState(['Frame Adjustment', 'Lens Fitting', 'Repair']);
  const [selectedService, setSelectedService] = useState('Frame Adjustment');
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('10:30');
  const [memberAppointments, setMemberAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'my-services'
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tomorrow's date formatted as default minimum
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  useEffect(() => {
    loadServicesAndTechs();
  }, []);

  useEffect(() => {
    if (user && activeTab === 'my-services') {
      loadMemberServiceAppointments();
    }
  }, [user, activeTab]);

  const loadServicesAndTechs = async () => {
    try {
      const s = await serviceAppointmentsApi.getAvailableServices();
      setServices(s);
      const e = await staffApi.getEmployees();
      setTechnicians(e);
      if (e.length > 0) setSelectedTechnicianId(e[0].employeeId);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMemberServiceAppointments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await serviceAppointmentsApi.getByMember(user.userId);
      setMemberAppointments(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in as a Customer Member to schedule an optical service.', 'info');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    if (role !== 'MEMBER') {
      showToast('Optical service appointments can only be booked by Customer Members. Staff can manage service orders in the Staff Workspace.', 'error');
      return;
    }

    if (!appointmentDate) {
      showToast('Please select an appointment date.', 'error');
      return;
    }

    const fullDateTime = `${appointmentDate}T${appointmentTime}:00`;
    const selectedDateTimeObj = new Date(fullDateTime);
    if (selectedDateTimeObj <= new Date()) {
      showToast('Appointment date and time must be in the future.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        memberId: user.userId,
        employeeId: Number(selectedTechnicianId),
        serviceType: selectedService,
        appointmentDate: fullDateTime,
      };

      await serviceAppointmentsApi.book(payload);
      showToast(`${selectedService} appointment booked successfully!`, 'success');
      setActiveTab('my-services');
    } catch (err) {
      showToast(err.message || 'Service appointment booking failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelService = async (serviceId) => {
    if (!confirm('Are you sure you want to cancel this optical service booking?')) return;
    try {
      await serviceAppointmentsApi.cancel(serviceId);
      showToast('Service appointment cancelled.', 'info');
      loadMemberServiceAppointments();
    } catch (err) {
      showToast(err.message || 'Failed to cancel appointment.', 'error');
    }
  };

  const serviceDescriptions = {
    'Frame Adjustment': {
      title: 'Precision Frame Adjustment & Ergonomics',
      desc: 'Expert temple tensioning, nose pad replacement, bridge realignment, and pantoscopic tilt correction for maximum comfort.',
      duration: '20 Mins',
      price: 'Free for Members (Rs 200 non-members)',
      icon: Sliders
    },
    'Lens Fitting': {
      title: 'Digital High-Index Lens Fitting & Edging',
      desc: 'Custom computerized lens tracing and edging, optical center bevel alignment, and anti-reflective inspection in our optical cleanroom.',
      duration: '45 Mins',
      price: 'Complimentary with Lens Purchase',
      icon: Layers
    },
    'Repair': {
      title: 'Ultrasonic Optical Restoration & Repair',
      desc: 'Hinge micro-soldering, stripped screw extraction, ultrasonic sonic bath cleaning, and full acetate frame buffing and shine polish.',
      duration: '30 Mins',
      price: 'Free for Gold/Platinum Members (Rs 500 standard)',
      icon: Wrench
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {(isEmployee || isManager || isAdmin) && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '16px',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Wrench size={24} color="#0284c7" />
            <div>
              <strong style={{ color: '#1e40af' }}>Staff Operations Notice:</strong>
              <span style={{ color: '#1e3a8a', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                You are signed in as {user.firstName} {user.lastName} ({role}). To fulfill service requests and complete technician work orders, use your internal Technician & Dispatch Desk.
              </span>
            </div>
          </div>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('staff')}
              className="btn btn-primary btn-sm"
            >
              Open Technician Desk
            </button>
          )}
        </div>
      )}

      {/* Top Header */}
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
            Optical Laboratory & Repair Desk
          </div>
          <h2>Optical Care & Fitting Services</h2>
          <p style={{ maxWidth: '650px', fontSize: '0.95rem' }}>
            Book in-store service sessions with our optical technicians. We uphold a strict daily limit of 10 slots to guarantee meticulous manual precision for every pair of eyewear.
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
            onClick={() => setActiveTab('book')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'book' ? 700 : 500,
              backgroundColor: activeTab === 'book' ? '#ffffff' : 'transparent',
              color: activeTab === 'book' ? '#0284c7' : '#64748b',
              boxShadow: activeTab === 'book' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
            }}
          >
            Book Optical Service
          </button>
          <button
            onClick={() => setActiveTab('my-services')}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'my-services' ? 700 : 500,
              backgroundColor: activeTab === 'my-services' ? '#ffffff' : 'transparent',
              color: activeTab === 'my-services' ? '#0284c7' : '#64748b',
              boxShadow: activeTab === 'my-services' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
            }}
          >
            My Service Bookings
          </button>
        </div>
      </div>

      {activeTab === 'book' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}>
          {/* Service Cards */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Select Required Service</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {services.map((svc) => {
                const isSelected = selectedService === svc;
                const info = serviceDescriptions[svc] || {
                  title: svc,
                  desc: 'Comprehensive optical technician service.',
                  duration: '30 mins',
                  price: 'Member Exclusive',
                  icon: Wrench,
                };
                const Icon = info.icon;
                return (
                  <div
                    key={svc}
                    onClick={() => setSelectedService(svc)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '16px',
                      border: `2px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                      backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                      boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.15)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      gap: '1rem',
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#0284c7' : '#e0f2fe',
                      color: isSelected ? '#ffffff' : '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={22} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{info.title}</h4>
                        {isSelected && <CheckCircle2 size={20} color="#0284c7" />}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                        {info.desc}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.785rem', fontWeight: 600 }}>
                        <span style={{ color: '#0369a1' }}>⏱ Est: {info.duration}</span>
                        <span style={{ color: '#059669' }}>★ {info.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking Form */}
          <div className="glass-card" style={{ padding: '1.75rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Service Booking Details</h3>

            <form onSubmit={handleBookService}>
              <div className="form-group">
                <label className="form-label">Chosen Optical Service</label>
                <input
                  type="text"
                  disabled
                  value={selectedService}
                  className="form-input"
                  style={{ backgroundColor: '#f1f5f9', fontWeight: 600, color: '#0284c7' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assign Technician / Optician</label>
                <select
                  value={selectedTechnicianId}
                  onChange={(e) => setSelectedTechnicianId(e.target.value)}
                  className="form-select"
                >
                  {technicians.map((t) => (
                    <option key={t.employeeId} value={t.employeeId}>
                      {t.firstName} {t.lastName} ({t.roleTitle || 'Technician'})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Appointment Date</label>
                  <input
                    type="date"
                    required
                    min={tomorrow}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time</label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="form-select"
                  >
                    <option value="09:30">09:30 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:15">11:15 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:30">03:30 PM</option>
                    <option value="16:45">04:45 PM</option>
                  </select>
                </div>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '0.8rem',
                color: '#64748b',
                marginBottom: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 600, marginBottom: '0.2rem' }}>
                  <ShieldCheck size={16} color="#0284c7" />
                  <span>Spring Boot Capacity Verification</span>
                </div>
                The backend enforces a maximum of 10 service slots per day to maintain strict benchwork tolerances.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem' }}
              >
                {isSubmitting ? <span className="spinner" /> : (
                  <>
                    <Calendar size={18} />
                    <span>Confirm Service Slot</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* SubTab: My Service Bookings */
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
              <h3>Please Log In to View Your Service Bookings</h3>
              <button
                onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Log In
              </button>
            </div>
          ) : loading ? (
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
              <Wrench size={40} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
              <h3>No Service Appointments Found</h3>
              <p style={{ color: '#64748b', marginBottom: '1.25rem' }}>
                Book frame adjustment, lens fitting, or optical repairs with our bench technicians.
              </p>
              <button
                onClick={() => setActiveTab('book')}
                className="btn btn-primary btn-sm"
              >
                Schedule Service
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {memberAppointments.map((app) => {
                const isCompleted = app.serviceStatus === 'Completed';
                const isCancelled = app.serviceStatus === 'Cancelled';
                return (
                  <div
                    key={app.serviceAppointmentId}
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
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{app.serviceType}</h4>
                        <span className={`badge ${
                          isCompleted ? 'badge-emerald' : isCancelled ? 'badge-rose' : 'badge-primary'
                        }`}>
                          {app.serviceStatus}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.25rem' }}>
                        Assigned Technician ID: <strong>#{app.employeeId}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                        <Calendar size={16} color="#0284c7" />
                        <span>Scheduled: <strong>{app.appointmentDate?.replace('T', ' ')}</strong></span>
                      </div>
                    </div>

                    {!isCompleted && !isCancelled && (
                      <button
                        onClick={() => handleCancelService(app.serviceAppointmentId)}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#f43f5e', borderColor: '#fecdd3' }}
                      >
                        <Trash2 size={16} />
                        <span>Cancel Booking</span>
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
