import React from 'react';
import {
  UserRoundCheck,
  CalendarCheck,
  Clock,
  Glasses,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Eye,
  FileText
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function DashboardView({
  doctors = [],
  schedules = [],
  appointments = [],
  products = [],
  onNavigate,
  onOpenBookModal,
  onOpenAddScheduleModal,
  onOpenAddDoctorModal,
  onOpenAddProductModal,
  onSelectAppointmentForNotes
}) {
  const availableSlots = schedules.filter(s => !s.booked);
  const scheduledCount = appointments.filter(a => a.status === 'SCHEDULED').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.25rem 2.5rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(30, 41, 59, 0.7) 100%)',
          borderColor: 'rgba(6, 182, 212, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '9999px', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '1rem', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            <Sparkles size={14} />
            <span>Vision Express Optometry & Clinical Suite</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>
            Next-Generation Eye Care & Optical Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Seamlessly orchestrate specialist doctor appointments, real-time schedule slot allocation, clinical consultation notes, and luxury eyewear inventory through high-performance Spring Boot APIs.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={onOpenBookModal} className="btn btn-primary">
              <Calendar size={18} />
              <span>Book Doctor Appointment</span>
            </button>
            <button onClick={() => onNavigate('appointments')} className="btn btn-secondary">
              <span>View All Appointments</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Decorative background glow circle */}
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            top: '-60px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          title="Specialist Doctors"
          value={doctors.length}
          icon={<UserRoundCheck size={24} />}
          change={`${doctors.length} Registered Optometrists`}
          accentColor="var(--accent-cyan)"
        />
        <StatCard
          title="Available Schedule Slots"
          value={availableSlots.length}
          icon={<Clock size={24} />}
          change={`${schedules.length} Total Slots Defined`}
          accentColor="var(--accent-teal)"
        />
        <StatCard
          title="Patient Appointments"
          value={appointments.length}
          icon={<CalendarCheck size={24} />}
          change={`${scheduledCount} Active / Scheduled`}
          accentColor="var(--accent-indigo)"
        />
        <StatCard
          title="Eyewear Catalog Items"
          value={products.length}
          icon={<Glasses size={24} />}
          change="Frames & Lens Options"
          accentColor="var(--accent-amber)"
        />
      </div>

      {/* Quick Actions Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem 1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#f8fafc' }}>Quick Clinical Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <button
            onClick={onOpenBookModal}
            className="btn btn-secondary interactive-card"
            style={{ justifyContent: 'flex-start', padding: '1rem' }}
          >
            <CalendarCheck size={18} color="var(--accent-cyan)" />
            <span>Book Appointment</span>
          </button>
          <button
            onClick={onOpenAddScheduleModal}
            className="btn btn-secondary interactive-card"
            style={{ justifyContent: 'flex-start', padding: '1rem' }}
          >
            <Clock size={18} color="var(--accent-teal)" />
            <span>Add Schedule Slot</span>
          </button>
          <button
            onClick={onOpenAddDoctorModal}
            className="btn btn-secondary interactive-card"
            style={{ justifyContent: 'flex-start', padding: '1rem' }}
          >
            <UserRoundCheck size={18} color="var(--accent-indigo)" />
            <span>Register Doctor</span>
          </button>
          <button
            onClick={onOpenAddProductModal}
            className="btn btn-secondary interactive-card"
            style={{ justifyContent: 'flex-start', padding: '1rem' }}
          >
            <Glasses size={18} color="var(--accent-amber)" />
            <span>Catalog New Eyewear</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent Appointments & Doctors On-Duty */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Appointments */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Patient Appointments</h3>
            <button onClick={() => onNavigate('appointments')} className="btn btn-outline btn-sm">
              View All
            </button>
          </div>

          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No appointments booked yet. Click "Book Appointment" to create one.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Member</th>
                    <th>Doctor</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 5).map((appt) => {
                    const doc = doctors.find(d => d.doctorId === appt.doctorId);
                    const statusClass = (appt.status || 'scheduled').toLowerCase();
                    return (
                      <tr key={appt.doctorAppointmentId}>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                            #{appt.doctorAppointmentId}
                          </span>
                        </td>
                        <td>Member #{appt.memberId}</td>
                        <td>{doc ? doc.name || `Dr. (ID: ${doc.doctorId})` : `Doctor #${appt.doctorId}`}</td>
                        <td>
                          <span className={`status-pill ${statusClass}`}>
                            {appt.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => onSelectAppointmentForNotes(appt)}
                            className="btn btn-icon"
                            title="View/Edit Consultation Notes"
                          >
                            <FileText size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Specialists On-Duty Overview */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Active Medical Specialists</h3>
            <button onClick={() => onNavigate('doctors')} className="btn btn-outline btn-sm">
              Manage Doctors
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {doctors.slice(0, 4).map((doc) => {
              const docSlots = schedules.filter(s => s.doctorId === doc.doctorId && !s.booked);
              return (
                <div
                  key={doc.doctorId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--accent-cyan)'
                      }}
                    >
                      {doc.avatar ? (
                        <img src={doc.avatar} alt={doc.name || 'Doctor'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                          <UserRoundCheck size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.925rem' }}>
                        {doc.name || `Doctor #${doc.doctorId}`}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {doc.specialization} &bull; {doc.licenseNumber}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '3px 9px',
                      borderRadius: '9999px',
                      backgroundColor: docSlots.length > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      color: docSlots.length > 0 ? '#6ee7b7' : 'var(--text-subtle)',
                      border: `1px solid ${docSlots.length > 0 ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                      fontWeight: 600
                    }}
                  >
                    {docSlots.length} open slots
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
