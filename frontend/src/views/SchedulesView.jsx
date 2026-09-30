import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  User,
  AlertCircle
} from 'lucide-react';
import Modal from '../components/Modal';

export default function SchedulesView({
  schedules = [],
  doctors = [],
  initialDoctorFilter = 'ALL',
  onCreateSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onOpenAddScheduleModal
}) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorFilter);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  // Edit Schedule Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formDoctorId, setFormDoctorId] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formStartTime, setFormStartTime] = useState('');
  const [formEndTime, setFormEndTime] = useState('');
  const [formBooked, setFormBooked] = useState(false);

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const openEditModal = (sched) => {
    setEditingSchedule(sched);
    setFormDoctorId(sched.doctorId);
    setFormDate(sched.availableDate);
    setFormStartTime(sched.startTime);
    setFormEndTime(sched.endTime);
    setFormBooked(Boolean(sched.booked));
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingSchedule) return;
    await onUpdateSchedule(editingSchedule.scheduleId, {
      doctorId: Number(formDoctorId),
      availableDate: formDate,
      startTime: formStartTime,
      endTime: formEndTime,
      booked: formBooked
    });
    setEditModalOpen(false);
  };

  const confirmDelete = (sched) => {
    setScheduleToDelete(sched);
    setDeleteModalOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!scheduleToDelete) return;
    await onDeleteSchedule(scheduleToDelete.scheduleId);
    setDeleteModalOpen(false);
  };

  // Filtered schedules
  const filteredSchedules = schedules.filter((s) => {
    if (selectedDoctorId !== 'ALL' && s.doctorId !== Number(selectedDoctorId)) {
      return false;
    }
    if (availableOnly && s.booked) {
      return false;
    }
    if (dateFilter && s.availableDate !== dateFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc' }}>
            Doctor Schedules & Time Slots
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Spring Boot Endpoints: <code style={{ color: 'var(--accent-cyan)' }}>/api/doctor-schedules</code>
          </p>
        </div>

        <button onClick={onOpenAddScheduleModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Schedule Slot</span>
        </button>
      </div>

      {/* Filter Toolbar */}
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Doctor Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Doctor:</span>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Doctors ({schedules.length} slots)</option>
              {doctors.map(d => (
                <option key={d.doctorId} value={d.doctorId}>
                  {d.name || `Dr. (ID: ${d.doctorId})`}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Available Only Toggle (/api/doctor-schedules/doctor/{id}/available) */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            userSelect: 'none',
            color: availableOnly ? 'var(--accent-cyan)' : 'var(--text-muted)'
          }}
        >
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
          />
          <span>Available Only (isBooked = false)</span>
        </label>
      </div>

      {/* Schedules Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Schedule ID</th>
                <th>Doctor</th>
                <th>Available Date</th>
                <th>Time Window</th>
                <th>Booking Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No schedule slots found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((sched) => {
                  const doc = doctors.find(d => d.doctorId === sched.doctorId);
                  const isSlotBooked = Boolean(sched.booked);

                  return (
                    <tr key={sched.scheduleId}>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                          #{sched.scheduleId}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{doc?.name || `Doctor #${sched.doctorId}`}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{doc?.specialization}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="var(--accent-teal)" />
                          <span>{sched.availableDate}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          <Clock size={14} color="var(--accent-cyan)" />
                          <span>{sched.startTime} &rarr; {sched.endTime}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${isSlotBooked ? 'booked' : 'available'}`}>
                          {isSlotBooked ? 'Booked' : 'Available'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => openEditModal(sched)}
                            className="btn btn-icon"
                            title="Edit Schedule (PUT /api/doctor-schedules/{id})"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => confirmDelete(sched)}
                            className="btn btn-icon"
                            style={{ color: '#f43f5e' }}
                            title="Delete Schedule (DELETE /api/doctor-schedules/{id})"
                          >
                            <Trash2 size={15} />
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

      {/* Edit Schedule Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Schedule Slot #${editingSchedule?.scheduleId}`}
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Doctor *</label>
            <select
              value={formDoctorId}
              onChange={(e) => setFormDoctorId(e.target.value)}
              className="form-select"
              required
            >
              {doctors.map(d => (
                <option key={d.doctorId} value={d.doctorId}>
                  {d.name || `Dr. (ID: ${d.doctorId})`} — {d.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Available Date *</label>
            <input
              type="date"
              required
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Start Time * (HH:mm:ss)</label>
              <input
                type="text"
                required
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
                placeholder="09:00:00"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time * (HH:mm:ss)</label>
              <input
                type="text"
                required
                value={formEndTime}
                onChange={(e) => setFormEndTime(e.target.value)}
                placeholder="10:00:00"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={formBooked}
                onChange={(e) => setFormBooked(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
              />
              <span>Mark as Booked (isBooked = true)</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Schedule Slot
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Schedule Deletion"
        maxWidth="440px"
      >
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Are you sure you want to delete Schedule Slot <strong style={{ color: '#fff' }}>#{scheduleToDelete?.scheduleId}</strong>?
            This will trigger <code style={{ color: 'var(--accent-rose)' }}>DELETE /api/doctor-schedules/{scheduleToDelete?.scheduleId}</code>.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={() => setDeleteModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleExecuteDelete} className="btn btn-danger">
              Delete Schedule
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
