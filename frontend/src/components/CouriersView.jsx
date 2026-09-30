import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Truck,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Phone,
  Package,
  X,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CouriersView = () => {
  const { addToast } = useApp();
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    contactNumber: '',
    serviceType: 'Express Delivery',
  });

  const loadCouriers = async () => {
    setLoading(true);
    try {
      let data = [];
      if (serviceTypeFilter !== 'ALL') {
        data = await api.couriers.getByServiceType(serviceTypeFilter);
      } else {
        data = await api.couriers.getAll();
      }
      setCouriers(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast('error', err.message || 'Failed to load couriers', 'Data Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCouriers();
  }, [serviceTypeFilter]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.contactNumber.trim() || !formData.serviceType.trim()) {
      addToast('error', 'All fields are required.', 'Validation Error');
      return;
    }

    setSubmitting(true);
    try {
      const created = await api.couriers.create(formData);
      addToast('success', `Courier "${created.companyName}" added successfully!`, 'Courier Registered');
      setIsAddModalOpen(false);
      setFormData({ companyName: '', contactNumber: '', serviceType: 'Express Delivery' });
      loadCouriers();
    } catch (err) {
      addToast('error', err.message || 'Failed to add courier', 'Creation Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = (courier) => {
    setSelectedCourier(courier);
    setFormData({
      companyName: courier.companyName,
      contactNumber: courier.contactNumber,
      serviceType: courier.serviceType,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourier) return;

    setSubmitting(true);
    try {
      const updated = await api.couriers.update(selectedCourier.courierId, formData);
      addToast('success', `Courier "${updated.companyName}" updated successfully!`, 'Courier Updated');
      setIsEditModalOpen(false);
      setSelectedCourier(null);
      loadCouriers();
    } catch (err) {
      addToast('error', err.message || 'Failed to update courier', 'Update Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove courier partner "${name}"?`)) return;

    try {
      await api.couriers.delete(id);
      addToast('info', `Courier "${name}" has been removed.`, 'Courier Deleted');
      setCouriers(prev => prev.filter(c => c.courierId !== id));
    } catch (err) {
      addToast('error', err.message || 'Failed to delete courier', 'Deletion Error');
    }
  };

  // Filtered by search
  const filteredCouriers = couriers.filter((c) =>
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactNumber?.includes(searchTerm)
  );

  const availableServiceTypes = Array.from(
    new Set(couriers.map((c) => c.serviceType).filter(Boolean))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>
            Courier Logistics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Manage delivery companies transporting prescription lenses, frames, and optical goods.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            id="refresh-couriers-btn"
            className="btn btn-secondary"
            onClick={loadCouriers}
            disabled={loading}
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
          <button
            id="open-add-courier-btn"
            className="btn btn-primary"
            onClick={() => {
              setFormData({ companyName: '', contactNumber: '', serviceType: 'Express Delivery' });
              setIsAddModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add Courier</span>
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
              id="search-couriers-input"
              type="text"
              placeholder="Search courier name, phone..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', height: '36px', fontSize: '0.8125rem' }}
            />
          </div>

          {/* Filter by service type (GET /api/couriers/service-type/{type}) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Service Type:
            </span>
            <select
              id="filter-courier-service-type"
              className="form-control"
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              style={{ width: '200px', height: '36px', fontSize: '0.8125rem', padding: '4px 10px' }}
            >
              <option value="ALL">All Service Types</option>
              {availableServiceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Couriers Cards Grid */}
      {loading ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading courier partners...
        </div>
      ) : filteredCouriers.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Truck size={36} color="var(--text-dim)" style={{ marginBottom: '10px' }} />
          <p style={{ margin: 0, fontWeight: 600 }}>No couriers match your search criteria</p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddModalOpen(true)}
            style={{ marginTop: '12px' }}
          >
            <Plus size={14} />
            <span>Add Courier</span>
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
          {filteredCouriers.map((courier) => (
            <div
              key={courier.courierId}
              id={`courier-card-${courier.courierId}`}
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
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Truck size={20} color="#818cf8" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                        {courier.companyName}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Partner ID: #{courier.courierId}
                      </span>
                    </div>
                  </div>

                  <span className="badge badge-purple" style={{ fontSize: '0.6875rem' }}>
                    {courier.serviceType}
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
                    <Phone size={14} color="var(--accent-cyan)" />
                    <span style={{ fontWeight: 600 }}>{courier.contactNumber}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
                  id={`edit-courier-btn-${courier.courierId}`}
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleEditOpen(courier)}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  id={`delete-courier-btn-${courier.courierId}`}
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(courier.courierId, courier.companyName)}
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Courier Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={20} color="var(--accent-cyan)" />
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Add Courier Partner</h3>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={() => setIsAddModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="form-company-name">Company Name *</label>
                  <input
                    id="form-company-name"
                    type="text"
                    className="form-control"
                    placeholder="e.g. DHL Express Optics"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="form-contact-number">Contact Number *</label>
                  <input
                    id="form-contact-number"
                    type="text"
                    className="form-control"
                    placeholder="e.g. +94 11 234 5678"
                    required
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="form-courier-service-type">Service Type *</label>
                  <input
                    id="form-courier-service-type"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Express Delivery, Same Day Optical, Temperature Controlled"
                    required
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button id="submit-add-courier-btn" type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register Courier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Courier Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit2 size={18} color="var(--accent-cyan)" />
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>
                  Edit Courier #{selectedCourier?.courierId}
                </h3>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={() => setIsEditModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-company-name">Company Name *</label>
                  <input
                    id="edit-company-name"
                    type="text"
                    className="form-control"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-contact-number">Contact Number *</label>
                  <input
                    id="edit-contact-number"
                    type="text"
                    className="form-control"
                    required
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-courier-service-type">Service Type *</label>
                  <input
                    id="edit-courier-service-type"
                    type="text"
                    className="form-control"
                    required
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button id="submit-edit-courier-btn" type="submit" className="btn btn-primary" disabled={submitting}>
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
