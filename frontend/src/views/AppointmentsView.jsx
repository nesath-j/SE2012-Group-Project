import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import Modal from '../components/Modal';

export default function AppointmentsView({
  appointments = [],
  doctors = [],
  schedules = [],
  onBookAppointment,
  onUpdateNotes,
  onUpdateStatus,
  onOpenBookModal,
  selectedAppointmentForNotes,
  setSelectedAppointmentForNotes
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [memberFilterInput, setMemberFilterInput] = useState('');

  // Consultation Notes Modal State
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [notesText, setNotesText] = useState('');

  // Status Change Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('SCHEDULED');

  const openNotesModal = (appt) => {
    setActiveAppointment(appt);
    setNotesText(appt.consultationNotes || '');
    setNotesModalOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!activeAppointment) return;
    await onUpdateNotes(activeAppointment.doctorAppointmentId, notesText);
    setNotesModalOpen(false);
  };

  const openStatusModal = (appt) => {
    setActiveAppointment(appt);
    setSelectedStatus(appt.status || 'SCHEDULED');
    setStatusModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!activeAppointment) return;
    await onUpdateStatus(activeAppointment.doctorAppointmentId, selectedStatus);
    setStatusModalOpen(false);
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((appt) => {
    // Doctor Filter
    if (doctorFilter !== 'ALL' && appt.doctorId !== Number(doctorFilter)) {
      return false;
    }
    // Status Filter
    if (statusFilter !== 'ALL' && appt.status !== statusFilter) {
      return false;
    }
    // Member Filter
    if (memberFilterInput.trim() !== '' && String(appt.memberId) !== memberFilterInput.trim()) {
      return false;
    }
    // Search Term (ID, doctor name, notes)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const doc = doctors.find(d => d.doctorId === appt.doctorId);
      const docName = (doc?.name || '').toLowerCase();
      const notes = (appt.consultationNotes || '').toLowerCase();
      const idStr = String(appt.doctorAppointmentId);
      const memberStr = String(appt.memberId);
      return idStr.includes(term) || memberStr.includes(term) || docName.includes(term) || notes.includes(term);
    }
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc' }}>
            Doctor Appointments Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Spring Boot Endpoints: <code style={{ color: 'var(--accent-cyan)' }}>/api/doctor-appointments</code>
          </p>
        </div>

        <button onClick={onOpenBookModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search by ID, member, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Doctor filter dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Doctor:</span>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Doctors</option>
              {doctors.map(d => (
                <option key={d.doctorId} value={d.doctorId}>
                  {d.name || `Dr. (ID: ${d.doctorId})`}
                </option>
              ))}
            </select>
          </div>

          {/* Member ID Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Member ID:</span>
            <input
              type="text"
              placeholder="e.g. 501"
              value={memberFilterInput}
              onChange={(e) => setMemberFilterInput(e.target.value)}
              className="form-input"
              style={{ width: '90px', padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
            />
          </div>

          {/* Status filter dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Appt ID</th>
                <th>Member ID</th>
                <th>Doctor</th>
                <th>Schedule Slot ID</th>
                <th>Appointment Date & Time</th>
                <th>Status</th>
                <th>Consultation Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No appointments found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => {
                  const doc = doctors.find(d => d.doctorId === appt.doctorId);
                  const statusClass = (appt.status || 'scheduled').toLowerCase();
                  const dateStr = appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleString() : 'N/A';

                  return (
                    <tr key={appt.doctorAppointmentId}>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                          #{appt.doctorAppointmentId}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <User size={13} color="var(--text-subtle)" />
                          Member #{appt.memberId}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{doc?.name || `Doctor #${appt.doctorId}`}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{doc?.specialization}</div>
                      </td>
                      <td>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          Slot #{appt.scheduleId}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={13} color="var(--accent-cyan)" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => openStatusModal(appt)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          title="Click to update status"
                        >
                          <span className={`status-pill ${statusClass}`}>
                            {appt.status}
                          </span>
                        </button>
                      </td>
                      <td style={{ maxWidth: '240px' }}>
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: appt.consultationNotes ? 'var(--text-main)' : 'var(--text-subtle)',
                            fontSize: '0.85rem'
                          }}
                        >
                          {appt.consultationNotes || <em>No notes recorded yet</em>}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => openNotesModal(appt)}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '4px' }}
                            title="Edit Consultation Notes (PUT /api/doctor-appointments/{id}/notes)"
                          >
                            <FileText size={14} />
                            <span>Notes</span>
                          </button>
                          <button
                            onClick={() => openStatusModal(appt)}
                            className="btn btn-outline btn-sm"
                            style={{ gap: '4px' }}
                            title="Update Status (PUT /api/doctor-appointments/{id}/status)"
                          >
                            <span>Status</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Consultation Notes Modal */}
      <Modal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        title={`Consultation Notes — Appointment #${activeAppointment?.doctorAppointmentId}`}
      >
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Updating clinical notes via endpoint: <code style={{ color: 'var(--accent-cyan)' }}>PUT /api/doctor-appointments/{activeAppointment?.doctorAppointmentId}/notes</code>
          </p>
          <div className="form-group">
            <label className="form-label">Clinical Examination & Prescription Notes</label>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="e.g. Visual acuity: OD 20/20, OS 20/30. Prescribed anti-reflective coating lenses. Follow-up in 6 months."
              className="form-textarea"
              style={{ minHeight: '140px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={() => setNotesModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveNotes} className="btn btn-primary">
              Save Consultation Notes
            </button>
          </div>
        </div>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Appointment Status #${activeAppointment?.doctorAppointmentId}`}
      >
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Updating status via endpoint: <code style={{ color: 'var(--accent-cyan)' }}>PUT /api/doctor-appointments/{activeAppointment?.doctorAppointmentId}/status</code>
          </p>
          <div className="form-group">
            <label className="form-label">Select New Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
            >
              <option value="SCHEDULED">SCHEDULED (Awaiting Patient)</option>
              <option value="CONFIRMED">CONFIRMED (Patient Confirmed)</option>
              <option value="COMPLETED">COMPLETED (Examination Done)</option>
              <option value="CANCELLED">CANCELLED (Slot Forfeited)</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button onClick={() => setStatusModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveStatus} className="btn btn-primary">
              Update Status
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
