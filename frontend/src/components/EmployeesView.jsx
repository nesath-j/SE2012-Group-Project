import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Users2,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Briefcase,
  Building2,
  X,
  Search,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

export const EmployeesView = () => {
  const { addToast } = useApp();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    roleTitle: '',
    assignedDepartment: 'Clinical Optometry',
  });

  const loadEmployees = async () => {
    setLoading(true);
    try {
      let data = [];
      if (departmentFilter !== 'ALL') {
        data = await api.employees.getByDepartment(departmentFilter);
      } else {
        data = await api.employees.getAll();
      }
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast('error', err.message || 'Failed to load staff list', 'Data Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [departmentFilter]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.roleTitle.trim()) {
      addToast('error', 'Employee ID and Role Title are required.', 'Validation Error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        employeeId: Number(formData.employeeId),
        roleTitle: formData.roleTitle.trim(),
        assignedDepartment: formData.assignedDepartment.trim(),
      };

      const created = await api.employees.create(payload);
      addToast('success', `Staff member #${created.employeeId} registered successfully!`, 'Employee Registered');
      setIsAddModalOpen(false);
      setFormData({ employeeId: '', roleTitle: '', assignedDepartment: 'Clinical Optometry' });
      loadEmployees();
    } catch (err) {
      addToast('error', err.message || 'Failed to register employee', 'Registration Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      employeeId: emp.employeeId,
      roleTitle: emp.roleTitle,
      assignedDepartment: emp.assignedDepartment || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    setSubmitting(true);
    try {
      const payload = {
        roleTitle: formData.roleTitle.trim(),
        assignedDepartment: formData.assignedDepartment.trim(),
      };

      const updated = await api.employees.update(selectedEmployee.employeeId, payload);
      addToast('success', `Staff member #${updated.employeeId} updated successfully!`, 'Employee Updated');
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
      loadEmployees();
    } catch (err) {
      addToast('error', err.message || 'Failed to update employee', 'Update Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove staff member #${id} (${title})?`)) return;

    try {
      await api.employees.delete(id);
      addToast('info', `Staff member #${id} has been removed.`, 'Employee Removed');
      setEmployees(prev => prev.filter(e => e.employeeId !== id));
    } catch (err) {
      addToast('error', err.message || 'Failed to delete employee', 'Deletion Error');
    }
  };

  // Filter by search
  const filteredEmployees = employees.filter((e) =>
    e.roleTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.assignedDepartment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(e.employeeId).includes(searchTerm)
  );

  const availableDepartments = Array.from(
    new Set(employees.map((e) => e.assignedDepartment).filter(Boolean))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>
            Clinic Staff &amp; Optometrists
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Manage clinic specialists, lab technicians, and dispensing opticians assigned to service appointments.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            id="refresh-employees-btn"
            className="btn btn-secondary"
            onClick={loadEmployees}
            disabled={loading}
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
          <button
            id="open-add-employee-btn"
            className="btn btn-primary"
            onClick={() => {
              setFormData({ employeeId: '', roleTitle: '', assignedDepartment: 'Clinical Optometry' });
              setIsAddModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              id="search-employees-input"
              type="text"
              placeholder="Search by ID, role, department..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', height: '36px', fontSize: '0.8125rem' }}
            />
          </div>

          {/* Department Filter (GET /api/employees/department/{dept}) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Department:
            </span>
            <select
              id="filter-employee-dept-select"
              className="form-control"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ width: '220px', height: '36px', fontSize: '0.8125rem', padding: '4px 10px' }}
            >
              <option value="ALL">All Departments</option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      {loading ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading clinic staff members...
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Users2 size={36} color="var(--text-dim)" style={{ marginBottom: '10px' }} />
          <p style={{ margin: 0, fontWeight: 600 }}>No employees match your search criteria</p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddModalOpen(true)}
            style={{ marginTop: '12px' }}
          >
            <Plus size={14} />
            <span>Add Staff Member</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredEmployees.map((emp) => (
            <div
              key={emp.employeeId}
              id={`employee-card-${emp.employeeId}`}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.2))',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: '#10b981',
                      }}
                    >
                      #{emp.employeeId}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                        {emp.roleTitle}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Staff ID: {emp.employeeId}
                      </span>
                    </div>
                  </div>

                  <span className="badge badge-scheduled" style={{ fontSize: '0.6875rem' }}>
                    Active Staff
                  </span>
                </div>

                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                    <Building2 size={14} color="var(--accent-cyan)" />
                    <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{emp.assignedDepartment || 'General Practice'}</strong>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                }}
              >
                <button
                  id={`edit-employee-btn-${emp.employeeId}`}
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleEditOpen(emp)}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  id={`delete-employee-btn-${emp.employeeId}`}
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(emp.employeeId, emp.roleTitle)}
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users2 size={20} color="var(--accent-cyan)" />
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Register Clinic Staff Member</h3>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={() => setIsAddModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="form-emp-id">Employee ID *</label>
                  <input
                    id="form-emp-id"
                    type="number"
                    className="form-control"
                    placeholder="e.g. 106"
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Primary Key in Spring Boot backend (matches user foreign key).
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="form-emp-role">Role Title *</label>
                  <input
                    id="form-emp-role"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Senior Optometrist, Lens Grinder, Clinic Director"
                    required
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="form-emp-dept">Assigned Department *</label>
                  <input
                    id="form-emp-dept"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Clinical Optometry, Lens Fabrication, Patient Care"
                    required
                    value={formData.assignedDepartment}
                    onChange={(e) => setFormData({ ...formData, assignedDepartment: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button id="submit-add-employee-btn" type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit2 size={18} color="var(--accent-cyan)" />
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>
                  Edit Staff Member #{selectedEmployee?.employeeId}
                </h3>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={() => setIsEditModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Employee ID (Fixed)</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={selectedEmployee?.employeeId || ''}
                    style={{ opacity: 0.6 }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-emp-role">Role Title *</label>
                  <input
                    id="edit-emp-role"
                    type="text"
                    className="form-control"
                    required
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-emp-dept">Assigned Department *</label>
                  <input
                    id="edit-emp-dept"
                    type="text"
                    className="form-control"
                    required
                    value={formData.assignedDepartment}
                    onChange={(e) => setFormData({ ...formData, assignedDepartment: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button id="submit-edit-employee-btn" type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
