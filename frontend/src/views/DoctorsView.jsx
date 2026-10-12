import React, { useState } from 'react';
import {
  UserRoundCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Award,
  ShieldCheck,
  Mail,
  User,
  ExternalLink
} from 'lucide-react';
import Modal from '../components/Modal';

export default function DoctorsView({
  doctors = [],
  schedules = [],
  onCreateDoctor,
  onUpdateDoctor,
  onDeleteDoctor,
  onViewDoctorSchedules,
  onOpenAddDoctorModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('ALL');

  // Edit Doctor Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formUserId, setFormUserId] = useState('');
  const [formSpecialization, setFormSpecialization] = useState('');
  const [formLicenseNumber, setFormLicenseNumber] = useState('');
  const [formName, setFormName] = useState('');

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const openEditModal = (doc) => {
    setEditingDoctor(doc);
    setFormUserId(doc.userId || '');
    setFormSpecialization(doc.specialization || '');
    setFormLicenseNumber(doc.licenseNumber || '');
    setFormName(doc.name || '');
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingDoctor) return;
    await onUpdateDoctor(editingDoctor.doctorId, {
      userId: Number(formUserId),
      specialization: formSpecialization,
      licenseNumber: formLicenseNumber,
      name: formName
    });
    setEditModalOpen(false);
  };

  const confirmDelete = (doc) => {
    setDoctorToDelete(doc);
    setDeleteModalOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!doctorToDelete) return;
    await onDeleteDoctor(doctorToDelete.doctorId);
    setDeleteModalOpen(false);
  };

  // Extract unique specializations for filter dropdown
  const specializations = Array.from(new Set(doctors.map(d => d.specialization))).filter(Boolean);

  const filteredDoctors = doctors.filter((doc) => {
    if (specializationFilter !== 'ALL' && doc.specialization !== specializationFilter) {
      return false;
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const name = (doc.name || '').toLowerCase();
      const spec = (doc.specialization || '').toLowerCase();
      const lic = (doc.licenseNumber || '').toLowerCase();
      const idStr = String(doc.doctorId);
      return name.includes(term) || spec.includes(term) || lic.includes(term) || idStr.includes(term);
    }
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc' }}>
            Eye Care Specialists Roster
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Spring Boot Endpoints: <code style={{ color: 'var(--accent-cyan)' }}>/api/doctors</code>
          </p>
        </div>

        <button onClick={onOpenAddDoctorModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Register New Doctor</span>
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
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
          <input
            type="text"
            placeholder="Search doctor by name, license, specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Specialization:</span>
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Specializations ({doctors.length})</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredDoctors.map((doc) => {
          const docSchedules = schedules.filter(s => s.doctorId === doc.doctorId);
          const availableCount = docSchedules.filter(s => !s.booked).length;

          return (
            <div
              key={doc.doctorId}
              className="glass-panel interactive-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Doctor Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: 'var(--bg-tertiary)',
                        border: '2px solid rgba(6, 182, 212, 0.4)',
                        flexShrink: 0
                      }}
                    >
                      {doc.avatar ? (
                        <img src={doc.avatar} alt={doc.name || 'Doctor'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                          <UserRoundCheck size={28} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>
                          {doc.name || `Dr. (ID: ${doc.doctorId})`}
                        </h3>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--accent-cyan)', fontWeight: 500, marginTop: '2px' }}>
                        {doc.specialization}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      color: 'var(--text-subtle)'
                    }}
                  >
                    ID #{doc.doctorId}
                  </span>
                </div>

                {/* Details List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={15} color="var(--accent-teal)" />
                    <span>License: <strong style={{ color: '#f8fafc' }}>{doc.licenseNumber}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={15} color="var(--accent-indigo)" />
                    <span>System User ID: <strong style={{ color: '#f8fafc' }}>{doc.userId}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} color="var(--accent-cyan)" />
                    <span>Availability: <span style={{ color: availableCount > 0 ? '#6ee7b7' : '#fda4af', fontWeight: 600 }}>{availableCount} slots open</span> ({docSchedules.length} total)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  marginTop: '0.5rem'
                }}
              >
                <button
                  onClick={() => onViewDoctorSchedules(doc.doctorId)}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Calendar size={14} />
                  <span>Schedules</span>
                </button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => openEditModal(doc)}
                    className="btn btn-icon"
                    title="Edit Doctor (PUT /api/doctors/{id})"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => confirmDelete(doc)}
                    className="btn btn-icon"
                    style={{ color: '#f43f5e' }}
                    title="Delete Doctor (DELETE /api/doctors/{id})"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Doctor Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Doctor #${editingDoctor?.doctorId}`}
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Dr. Arthur Pendelton"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">User ID (FK to user table) *</label>
            <input
              type="number"
              required
              value={formUserId}
              onChange={(e) => setFormUserId(e.target.value)}
              placeholder="e.g. 101"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization *</label>
            <input
              type="text"
              required
              value={formSpecialization}
              onChange={(e) => setFormSpecialization(e.target.value)}
              placeholder="e.g. Ophthalmology & Refractive Surgery"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">License Number *</label>
            <input
              type="text"
              required
              value={formLicenseNumber}
              onChange={(e) => setFormLicenseNumber(e.target.value)}
              placeholder="e.g. DOC-LIC-98442"
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Doctor
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Doctor Deletion"
        maxWidth="440px"
      >
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Are you sure you want to delete <strong style={{ color: '#fff' }}>{doctorToDelete?.name || `Doctor #${doctorToDelete?.doctorId}`}</strong>?
            This will trigger <code style={{ color: 'var(--accent-rose)' }}>DELETE /api/doctors/{doctorToDelete?.doctorId}</code>.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={() => setDeleteModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleExecuteDelete} className="btn btn-danger">
              Delete Doctor
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
