import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  CalendarCheck2,
  Plus,
  Filter,
  Search,
  RefreshCw,
  X,
  Clock,
  User,
  BadgeCheck,
  Ban,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wrench,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

const VALID_SERVICES = ["Frame Adjustment", "Lens Fitting", "Repair"];
const VALID_STATUSES = ["Scheduled", "In-Progress", "Completed", "Cancelled"];

export const AppointmentsView = () => {
  const { addToast } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('ALL');
  
  // Specific filters
  const [memberIdFilter, setMemberIdFilter] = useState('');
  const [employeeIdFilter, setEmployeeIdFilter] = useState('');

  // Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    memberId: '',
    employeeId: '',
    serviceType: 'Frame Adjustment',
    appointmentDate: '',
  });

  const loadAppointments = async () => {
    setLoading(true);
    try {
      let data = [];
      if (memberIdFilter.trim()) {
        data = await api.appointments.getByMember(Number(memberIdFilter.trim()));
      } else if (employeeIdFilter.trim()) {
        data = await api.appointments.getByEmployee(Number(employeeIdFilter.trim()));
      } else {
        data = await api.appointments.getAll();
      }
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast('error', err.message || 'Failed to load appointments', 'Data Fetch Error');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await api.employees.getAll();
      setEmployees(Array.isArray(data) ? data : []);
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    loadAppointments();
    loadEmployees();
  }, []);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!formData.memberId || !formData.employeeId || !formData.appointmentDate) {
      addToast('error', 'Please fill in Member ID, Staff ID, and Appointment Date', 'Validation Error');
      return;
    }

    setSubmitting(true);
    try {
      // Ensure ISO format e.g. "2026-10-15T14:30:00"
      const dateIso = new Date(formData.appointmentDate).toISOString().slice(0, 19);

      const payload = {
        memberId: Number(formData.memberId),
        employeeId: Number(formData.employeeId),
        serviceType: formData.serviceType,
        appointmentDate: dateIso,
      };

      const created = await api.appointments.book(payload);
      addToast('success', `Appointment #${created.serviceAppointmentId || 'VE'} successfully scheduled!`, 'Appointment Booked');
      setIsBookModalOpen(false);
      setFormData({
        memberId: '',
        employeeId: '',
        serviceType: 'Frame Adjustment',
        appointmentDate: '',
      });
      loadAppointments();
    } catch (err) {
      addToast('error', err.message || 'Could not schedule appointment', 'Booking Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.appointments.updateStatus(id, newStatus);
      addToast('success', `Appointment #${id} updated to ${newStatus}`, 'Status Updated');
      setAppointments(prev =>
        prev.map(a => a.serviceAppointmentId === id ? { ...a, serviceStatus: newStatus } : a)
      );
    } catch (err) {
      addToast('error', err.message || 'Failed to update status', 'Update Error');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm(`Are you sure you want to cancel appointment #${id}?`)) return;

    try {
      await api.appointments.cancel(id);
      addToast('info', `Appointment #${id} has been marked as Cancelled.`, 'Appointment Cancelled');
      setAppointments(prev =>
        prev.map(a => a.serviceAppointmentId === id ? { ...a, serviceStatus: 'Cancelled' } : a)
      );
    } catch (err) {
      addToast('error', err.message || 'Failed to cancel appointment', 'Cancel Error');
    }
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== 'ALL' && apt.serviceStatus !== statusFilter) return false;
    if (serviceTypeFilter !== 'ALL' && apt.serviceType !== serviceTypeFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>
            Service Appointments
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Book optical services, assign certified staff, and track progress through the clinic workflow.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            id="refresh-appointments-btn"
            className="btn btn-secondary"
            onClick={loadAppointments}
            disabled={loading}
            title="Refresh appointments"
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
          <button
            id="open-book-modal-btn"
            className="btn btn-primary"
            onClick={() => setIsBookModalOpen(true)}
          >
            <Plus size={16} />
            <span>Book Service</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Status filter tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'Scheduled', 'In-Progress', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                id={`filter-status-${status.toLowerCase()}`}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid',
                  fontSize: '0.78125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: statusFilter === status ? 'var(--accent-cyan)' : 'transparent',
                  borderColor: statusFilter === status ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  color: statusFilter === status ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Service type filter & direct member/staff filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <select
              id="filter-service-type-select"
              className="form-control"
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              style={{ width: '160px', height: '36px', padding: '4px 10px', fontSize: '0.8125rem' }}
            >
              <option value="ALL">All Service Types</option>
              {VALID_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Direct Member ID filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                id="filter-member-id-input"
                type="number"
                placeholder="Member ID"
                className="form-control"
                value={memberIdFilter}
                onChange={(e) => setMemberIdFilter(e.target.value)}
                style={{ width: '110px', height: '36px', padding: '4px 8px', fontSize: '0.8125rem' }}
              />
              <button
                id="filter-by-member-btn"
                className="btn btn-secondary btn-sm"
                onClick={loadAppointments}
                title="Filter by Member ID"
              >
                Find
              </button>
              {memberIdFilter && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setMemberIdFilter(''); loadAppointments(); }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="table-container">
        <table className="custom-table" id="appointments-table">
          <thead>
            <tr>
              <th>ID &amp; Service</th>
              <th>Member</th>
              <th>Assigned Staff</th>
              <th>Appointment Date &amp; Time</th>
              <th>Current Status</th>
              <th>Update Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Loading service appointments...
                </td>
              </tr>
            ) : filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <CalendarCheck2 size={36} color="var(--text-dim)" />
                    <p style={{ margin: 0, fontWeight: 600 }}>No service appointments found</p>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
                      Adjust your filters or book a new appointment.
                    </p>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setIsBookModalOpen(true)}
                      style={{ marginTop: '8px' }}
                    >
                      <Plus size={14} />
                      <span>Book Appointment</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAppointments.map((apt) => {
                const statusClass =
                  apt.serviceStatus === 'Scheduled'
                    ? 'badge-scheduled'
                    : apt.serviceStatus === 'In-Progress'
                    ? 'badge-in-progress'
                    : apt.serviceStatus === 'Completed'
                    ? 'badge-completed'
                    : 'badge-cancelled';

                const formattedDate = apt.appointmentDate
                  ? new Date(apt.appointmentDate).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'N/A';

                const isCancelled = apt.serviceStatus === 'Cancelled';
                const isCompleted = apt.serviceStatus === 'Completed';

                return (
                  <tr key={apt.serviceAppointmentId} id={`apt-row-${apt.serviceAppointmentId}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            background: 'rgba(14, 165, 233, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {apt.serviceType === 'Repair' ? (
                            <Wrench size={16} color="var(--accent-cyan)" />
                          ) : (
                            <Eye size={16} color="var(--accent-cyan)" />
                          )}
                        </div>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                            {apt.serviceType}
                          </span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            ID: #{apt.serviceAppointmentId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} color="var(--text-muted)" />
                        <span style={{ fontWeight: 600 }}>Member #{apt.memberId}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--accent-cyan-light)' }}>
                          Staff #{apt.employeeId}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                        <Clock size={13} color="var(--text-dim)" />
                        <span>{formattedDate}</span>
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${statusClass}`} id={`apt-status-badge-${apt.serviceAppointmentId}`}>
                        {apt.serviceStatus}
                      </span>
                    </td>

                    {/* PATCH /api/service-appointments/{id}/status */}
                    <td>
                      <select
                        id={`update-status-select-${apt.serviceAppointmentId}`}
                        className="form-control"
                        value={apt.serviceStatus}
                        onChange={(e) => handleStatusChange(apt.serviceAppointmentId, e.target.value)}
                        disabled={isCancelled}
                        style={{
                          height: '32px',
                          padding: '2px 8px',
                          fontSize: '0.75rem',
                          width: '130px',
                        }}
                      >
                        {VALID_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* PUT /api/service-appointments/{id}/cancel */}
                    <td style={{ textAlign: 'right' }}>
                      {!isCancelled && !isCompleted && (
                        <button
                          id={`cancel-apt-btn-${apt.serviceAppointmentId}`}
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(apt.serviceAppointmentId)}
                          title="Cancel appointment"
                        >
                          <Ban size={13} />
                          <span>Cancel</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBookModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalendarCheck2 size={20} color="var(--accent-cyan)" />
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Book Optical Service</h3>
              </div>
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => setIsBookModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleBookSubmit}>
              <div className="modal-body">
                {/* Member ID */}
                <div className="form-group">
                  <label className="form-label" htmlFor="form-member-id">
                    Member ID *
                  </label>
                  <input
                    id="form-member-id"
                    type="number"
                    className="form-control"
                    placeholder="e.g. 1001"
                    required
                    value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Numeric identifier for the customer or registered member.
                  </span>
                </div>

                {/* Staff / Employee ID */}
                <div className="form-group">
                  <label className="form-label" htmlFor="form-employee-id">
                    Assigned Optometrist / Staff ID *
                  </label>
                  {employees.length > 0 ? (
                    <select
                      id="form-employee-id"
                      className="form-control"
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    >
                      <option value="">Select an optometrist / staff member</option>
                      {employees.map((emp) => (
                        <option key={emp.employeeId} value={emp.employeeId}>
                          ID {emp.employeeId} - {emp.roleTitle} ({emp.assignedDepartment})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="form-employee-id"
                      type="number"
                      className="form-control"
                      placeholder="e.g. 101"
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    />
                  )}
                </div>

                {/* Service Type */}
                <div className="form-group">
                  <label className="form-label" htmlFor="form-service-type">
                    Service Type *
                  </label>
                  <select
                    id="form-service-type"
                    className="form-control"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  >
                    {VALID_SERVICES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Must match clinic validation: Frame Adjustment, Lens Fitting, or Repair.
                  </span>
                </div>

                {/* Appointment Date & Time */}
                <div className="form-group">
                  <label className="form-label" htmlFor="form-appointment-date">
                    Appointment Date &amp; Time *
                  </label>
                  <input
                    id="form-appointment-date"
                    type="datetime-local"
                    className="form-control"
                    required
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsBookModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  id="submit-book-apt-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
