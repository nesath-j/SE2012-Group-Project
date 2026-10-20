import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  doctorsApi,
  serviceAppointmentsApi,
  ordersApi,
  productsApi,
  staffApi
} from '../services/api';
import {
  Check,
  ShieldCheck,
  Stethoscope,
  Wrench,
  CheckCircle2,
  Plus,
  Trash2,
  Edit,
  Save,
  Truck,
  Award,
  AlertCircle
} from 'lucide-react';

export default function StaffPortal({ onNavigateTab }) {
  const { user, role, isDoctor, isEmployee, isManager, isAdmin, isStaff, showToast, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  // Determine authorized default tab
  const getDefaultTab = () => {
    if (role === 'DOCTOR') return 'doctor';
    if (role === 'EMPLOYEE') return 'technician';
    return 'admin';
  };

  // Active workspace tab: 'doctor' | 'technician' | 'admin'
  const [staffTab, setStaffTab] = useState(getDefaultTab());

  // Keep tab restricted if user changes
  useEffect(() => {
    if (role === 'DOCTOR') setStaffTab('doctor');
    else if (role === 'EMPLOYEE') setStaffTab('technician');
    else if (role === 'MANAGER' || role === 'ADMIN') {
      if (staffTab !== 'admin' && staffTab !== 'technician' && staffTab !== 'doctor') {
        setStaffTab('admin');
      }
    }
  }, [role]);

  // -------------------------------------------------------------
  // Doctor Portal States
  // -------------------------------------------------------------
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [consultNotesText, setConsultNotesText] = useState('');
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotStart, setNewSlotStart] = useState('09:00:00');
  const [newSlotEnd, setNewSlotEnd] = useState('09:45:00');

  // -------------------------------------------------------------
  // Technician Portal States
  // -------------------------------------------------------------
  const [serviceAppointments, setServiceAppointments] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [selectedCourierId, setSelectedCourierId] = useState(1);
  const [dispatchOrderId, setDispatchOrderId] = useState('');

  // -------------------------------------------------------------
  // Admin Portal States
  // -------------------------------------------------------------
  const [allOrders, setAllOrders] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState('Eyeglasses');
  const [newProdPrice, setNewProdPrice] = useState(150);
  const [newProdStock, setNewProdStock] = useState(25);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPic, setNewProdPic] = useState('https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllStaffData();
  }, [staffTab]);

  const loadAllStaffData = async () => {
    setLoading(true);
    try {
      if (staffTab === 'doctor') {
        const docId = user?.role === 'DOCTOR' ? user.userId : 4;
        const appts = await doctorsApi.getAppointmentsByDoctor(docId);
        setDoctorAppointments(appts);
      } else if (staffTab === 'technician') {
        const list = await serviceAppointmentsApi.getAll();
        setServiceAppointments(list);
        const c = await staffApi.getCouriers();
        setCouriers(c);
        if (c.length > 0) setSelectedCourierId(c[0].courierId);
      } else if (staffTab === 'admin') {
        const orders = await ordersApi.getAll();
        setAllOrders(orders);
        const prods = await productsApi.search('');
        setCatalogProducts(prods);
        const emps = await staffApi.getEmployees();
        setStaffList(emps);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Doctor Handlers
  // -------------------------------------------------------------
  const handleSaveNotes = async (appointmentId) => {
    try {
      await doctorsApi.updateNotes(appointmentId, consultNotesText);
      showToast('Consultation notes saved successfully!', 'success');
      setEditingNotesId(null);
      loadAllStaffData();
    } catch (err) {
      showToast(err.message || 'Failed to update consultation notes.', 'error');
    }
  };

  const handleUpdateDoctorStatus = async (appointmentId, status) => {
    try {
      await doctorsApi.updateStatus(appointmentId, status);
      showToast(`Appointment status updated to ${status}.`, 'success');
      loadAllStaffData();
    } catch (err) {
      showToast(err.message || 'Status update failed.', 'error');
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!newSlotDate) return;
    try {
      const docId = user?.role === 'DOCTOR' ? user.userId : 4;
      await doctorsApi.createSchedule({
        doctorId: docId,
        availableDate: newSlotDate,
        startTime: newSlotStart,
        endTime: newSlotEnd,
      });
      showToast('New clinical schedule slot opened!', 'success');
      setNewSlotDate('');
    } catch (err) {
      showToast(err.message || 'Failed to create slot.', 'error');
    }
  };

  // -------------------------------------------------------------
  // Technician Handlers
  // -------------------------------------------------------------
  const handleCompleteService = async (serviceId) => {
    try {
      await serviceAppointmentsApi.complete(serviceId);
      showToast(`Service #${serviceId} marked as Completed!`, 'success');
      loadAllStaffData();
    } catch (err) {
      showToast(err.message || 'Failed to mark service complete.', 'error');
    }
  };

  const handleUpdateServiceStatus = async (serviceId, status) => {
    try {
      await serviceAppointmentsApi.updateStatus(serviceId, status);
      showToast(`Status updated to ${status}.`, 'success');
      loadAllStaffData();
    } catch (err) {
      showToast(err.message || 'Failed to update status.', 'error');
    }
  };

  const handleDispatchCourier = async (e) => {
    e.preventDefault();
    if (!dispatchOrderId) return;
    try {
      const res = await staffApi.dispatchDelivery(Number(dispatchOrderId), Number(selectedCourierId));
      showToast(`Order #${dispatchOrderId} dispatched with tracking #${res.trackingNumber || 'GENERATED'}!`, 'success');
      setDispatchOrderId('');
      loadAllStaffData();
    } catch (err) {
      showToast(err.message || 'Dispatch failed.', 'error');
    }
  };

  // -------------------------------------------------------------
  // Admin Handlers
  // -------------------------------------------------------------
  const handleConfirmOrderPayment = async (orderId) => {
    try {
      await ordersApi.confirmPayment(orderId);
      showToast(`Payment confirmed for Order #${orderId}. Loyalty points automatically awarded!`, 'success');
      loadAllStaffData();
    } catch (err) {
      showToast(err.message || 'Payment confirmation failed.', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      showToast(`Order #${orderId} status set to ${newStatus}.`, 'success');
      loadAllStaffData();
    } catch (err) {
      showToast(err.message || 'Failed to update order status.', 'error');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await productsApi.add({
        name: newProdName,
        category: newProdCat,
        price: Number(newProdPrice),
        stockQuantity: Number(newProdStock),
        description: newProdDesc,
        pic: newProdPic,
      });
      showToast(`Product "${newProdName}" added to catalog!`, 'success');
      setIsAddingProduct(false);
      setNewProdName('');
      setNewProdDesc('');
      loadAllStaffData();
    } catch (err) {
      showToast(err.message || 'Failed to add product.', 'error');
    }
  };

  const handleUpdateStock = async (prodId, currentStock) => {
    const raw = prompt('Enter new stock quantity:', currentStock);
    if (raw === null) return;
    const qty = parseInt(raw, 10);
    if (isNaN(qty)) return;
    try {
      await productsApi.updateStock(prodId, qty);
      showToast(`Stock updated to ${qty} units.`, 'success');
      loadAllStaffData();
    } catch (err) {
      showToast(err.message || 'Stock update failed.', 'error');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!confirm('Are you sure you want to remove this product from the catalog?')) return;
    try {
      await productsApi.delete(prodId);
      showToast('Product deleted.', 'info');
      loadAllStaffData();
    } catch (err) {
      showToast(err.message || 'Delete failed.', 'error');
    }
  };

  if (!user || !isStaff) {
    return (
      <div className="container animate-fade-in" style={{ paddingTop: '4rem', paddingBottom: '5rem', maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '3.5rem 2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}>
            <AlertCircle size={38} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: '#0f172a' }}>
            Staff Access Restricted (403)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            {user
              ? `You are signed in as a Customer Member (${user.firstName} ${user.lastName}). Internal clinic, technician, managerial, and administrative portals are restricted to authorized employees.`
              : 'You must be signed in with an authorized Doctor, Optical Technician, Manager, or Administrator account to access the internal staff portal.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {!user ? (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="btn btn-primary"
              >
                Sign In with Staff Account
              </button>
            ) : null}
            <button
              onClick={() => onNavigateTab && onNavigateTab('shop')}
              className="btn btn-secondary"
            >
              Return to Eyewear Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Staff Workspace Header */}
      <div style={{
        backgroundColor: '#090e17',
        borderRadius: '20px',
        padding: '2rem 2.5rem',
        color: '#ffffff',
        marginBottom: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        border: '1px solid #1e293b',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span style={{
              background: '#0284c7',
              color: '#ffffff',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}>
              Internal Operations Desk
            </span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Connected to Spring Boot Port 8081
            </span>
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '1.85rem', margin: 0 }}>
            Vision Express Staff Management Workspace
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Active Staff Member: <strong style={{ color: '#38bdf8' }}>{user.firstName} {user.lastName}</strong> (Role: <span className="badge badge-primary">{role}</span>)
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs - Strictly restricted by backend role */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '2rem',
        overflowX: 'auto',
      }}>
        {/* Doctor Desk: Visible to DOCTOR or ADMIN */}
        {(isDoctor || isAdmin) && (
          <button
            onClick={() => setStaffTab('doctor')}
            style={{
              padding: '0.85rem 1.4rem',
              fontSize: '0.95rem',
              fontWeight: staffTab === 'doctor' ? 700 : 500,
              color: staffTab === 'doctor' ? '#0284c7' : '#64748b',
              borderBottom: `3px solid ${staffTab === 'doctor' ? '#0284c7' : 'transparent'}`,
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
            }}
          >
            <Stethoscope size={18} />
            <span>Doctor Consultation Desk</span>
          </button>
        )}

        {/* Technician Desk: Visible to EMPLOYEE, MANAGER, or ADMIN */}
        {(isEmployee || isManager || isAdmin) && (
          <button
            onClick={() => setStaffTab('technician')}
            style={{
              padding: '0.85rem 1.4rem',
              fontSize: '0.95rem',
              fontWeight: staffTab === 'technician' ? 700 : 500,
              color: staffTab === 'technician' ? '#0284c7' : '#64748b',
              borderBottom: `3px solid ${staffTab === 'technician' ? '#0284c7' : 'transparent'}`,
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
            }}
          >
            <Wrench size={18} />
            <span>Optical Technician & Dispatch</span>
          </button>
        )}

        {/* Admin Desk: Visible to ADMIN or MANAGER */}
        {(isAdmin || isManager) && (
          <button
            onClick={() => setStaffTab('admin')}
            style={{
              padding: '0.85rem 1.4rem',
              fontSize: '0.95rem',
              fontWeight: staffTab === 'admin' ? 700 : 500,
              color: staffTab === 'admin' ? '#0284c7' : '#64748b',
              borderBottom: `3px solid ${staffTab === 'admin' ? '#0284c7' : 'transparent'}`,
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
            }}
          >
            <ShieldCheck size={18} />
            <span>{isAdmin ? 'Admin Payments & Inventory' : 'Store & Inventory Management'}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <span className="spinner spinner-primary" style={{ width: '32px', height: '32px' }} />
        </div>
      ) : staffTab === 'doctor' ? (
        /* =======================================================
           DOCTOR WORKSPACE TAB
           ======================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Add schedule slot bar */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Open Clinical Schedule Slot</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Publish new consultation availability slots to the public booking calendar (<code>POST /api/doctor-schedules</code>).
            </p>

            <form onSubmit={handleCreateSlot} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '180px' }}>
                <label className="form-label">Available Date</label>
                <input
                  type="date"
                  required
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0, width: '130px' }}>
                <label className="form-label">Start Time</label>
                <input
                  type="text"
                  required
                  value={newSlotStart}
                  onChange={(e) => setNewSlotStart(e.target.value)}
                  placeholder="09:00:00"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0, width: '130px' }}>
                <label className="form-label">End Time</label>
                <input
                  type="text"
                  required
                  value={newSlotEnd}
                  onChange={(e) => setNewSlotEnd(e.target.value)}
                  placeholder="09:45:00"
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
                <Plus size={16} />
                <span>Open Slot</span>
              </button>
            </form>
          </div>

          {/* Patient Consultations Queue */}
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Patient Consultations Queue</h3>
            {doctorAppointments.length === 0 ? (
              <div style={{
                padding: '3rem',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px dashed #cbd5e1',
              }}>
                <Stethoscope size={36} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                <p style={{ color: '#64748b' }}>No patient appointments assigned to this doctor currently.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {doctorAppointments.map((app) => (
                  <div key={app.doctorAppointmentId} className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      marginBottom: '1rem',
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Consultation #{app.doctorAppointmentId}</h4>
                          <span className={`badge ${
                            app.status === 'COMPLETED' ? 'badge-emerald' : app.status === 'CANCELLED' ? 'badge-rose' : 'badge-primary'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          Patient (Member ID): <strong>#{app.memberId}</strong> • Date: <strong>{app.appointmentDate?.replace('T', ' ')}</strong>
                        </div>
                      </div>

                      {/* Status actions */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {app.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateDoctorStatus(app.doctorAppointmentId, 'COMPLETED')}
                            className="btn btn-outline btn-sm"
                            style={{ color: '#059669', borderColor: '#a7f3d0' }}
                          >
                            <CheckCircle2 size={16} />
                            <span>Mark Completed</span>
                          </button>
                        )}
                        {app.status !== 'CANCELLED' && app.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateDoctorStatus(app.doctorAppointmentId, 'CANCELLED')}
                            className="btn btn-outline btn-sm"
                            style={{ color: '#f43f5e', borderColor: '#fecdd3' }}
                          >
                            <X size={16} />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Consultation Notes Section */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569' }}>
                          CLINICAL CONSULTATION NOTES (PUT /api/doctor-appointments/{'{id}'}/notes)
                        </span>
                        {editingNotesId !== app.doctorAppointmentId && (
                          <button
                            onClick={() => {
                              setEditingNotesId(app.doctorAppointmentId);
                              setConsultNotesText(app.consultationNotes || '');
                            }}
                            style={{ color: '#0284c7', fontSize: '0.785rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                          >
                            <Edit size={14} />
                            <span>Edit Notes</span>
                          </button>
                        )}
                      </div>

                      {editingNotesId === app.doctorAppointmentId ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <textarea
                            rows={3}
                            value={consultNotesText}
                            onChange={(e) => setConsultNotesText(e.target.value)}
                            placeholder="Enter refractive evaluation, prescription details, corneal findings..."
                            className="form-textarea"
                          />
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="btn btn-secondary btn-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNotes(app.doctorAppointmentId)}
                              className="btn btn-primary btn-sm"
                            >
                              <Save size={14} />
                              <span>Save Notes</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.875rem', color: app.consultationNotes ? '#1e293b' : '#94a3b8', fontStyle: app.consultationNotes ? 'normal' : 'italic' }}>
                          {app.consultationNotes || 'No consultation notes entered yet. Click "Edit Notes" to add patient vision evaluation.'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : staffTab === 'technician' ? (
        /* =======================================================
           TECHNICIAN & DISPATCH TAB
           ======================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Delivery Dispatch Desk */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <Truck size={24} color="#0284c7" />
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Courier Dispatch Desk</h3>
                <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>
                  Assign order shipment to registered courier partner (<code>POST /api/deliveries/dispatch</code>)
                </p>
              </div>
            </div>

            <form onSubmit={handleDispatchCourier} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '180px' }}>
                <label className="form-label">Order Number</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1"
                  value={dispatchOrderId}
                  onChange={(e) => setDispatchOrderId(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '220px' }}>
                <label className="form-label">Select Logistics Courier</label>
                <select
                  value={selectedCourierId}
                  onChange={(e) => setSelectedCourierId(e.target.value)}
                  className="form-select"
                >
                  {couriers.map((c) => (
                    <option key={c.courierId} value={c.courierId}>
                      {c.companyName} ({c.serviceType})
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
                <Truck size={16} />
                <span>Dispatch Shipment</span>
              </button>
            </form>
          </div>

          {/* Service Appointments Queue */}
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Optical Services Work Orders</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {serviceAppointments.map((app) => (
                <div key={app.serviceAppointmentId} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{app.serviceType}</h4>
                        <span className={`badge ${
                          app.serviceStatus === 'Completed' ? 'badge-emerald' : app.serviceStatus === 'Cancelled' ? 'badge-rose' : 'badge-primary'
                        }`}>
                          {app.serviceStatus}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Work Order #{app.serviceAppointmentId} • Member #{app.memberId} • Assigned Tech #{app.employeeId}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#475569', marginTop: '0.25rem' }}>
                        Scheduled Time: <strong>{app.appointmentDate?.replace('T', ' ')}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {app.serviceStatus === 'Scheduled' && (
                        <button
                          onClick={() => handleUpdateServiceStatus(app.serviceAppointmentId, 'In-Progress')}
                          className="btn btn-secondary btn-sm"
                        >
                          <span>Move to In-Progress</span>
                        </button>
                      )}

                      {app.serviceStatus !== 'Completed' && app.serviceStatus !== 'Cancelled' && (
                        <button
                          onClick={() => handleCompleteService(app.serviceAppointmentId)}
                          className="btn btn-primary btn-sm"
                        >
                          <CheckCircle2 size={16} />
                          <span>Complete Work Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* =======================================================
           ADMIN & MANAGER WORKSPACE TAB
           ======================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Section 1: Order & Payment Confirmation */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <Award size={24} color="#0284c7" />
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Payment Slip Review & Loyalty Confirmation</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Confirming payment updates status and automatically awards loyalty points to Member (<code>PATCH /api/orders/{'{id}'}/confirm-payment</code>).
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.785rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Order ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Member ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total Amount</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Payment Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Order Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((ord) => {
                    const isConfirmed = ord.paymentStatus === 'CONFIRMED';
                    return (
                      <tr key={ord.orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.85rem 1rem' }}><strong>#{ord.orderId}</strong></td>
                        <td style={{ padding: '0.85rem 1rem' }}>Member #{ord.memberId}</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>${ord.totalAmount?.toFixed(2)}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span className={`badge ${
                            isConfirmed ? 'badge-emerald' : ord.paymentStatus === 'TO_BE_CONFIRMED' ? 'badge-primary' : 'badge-amber'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span className="badge badge-silver">{ord.orderStatus}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          {!isConfirmed ? (
                            isAdmin ? (
                              <button
                                onClick={() => handleConfirmOrderPayment(ord.orderId)}
                                className="btn btn-primary btn-sm"
                              >
                                <CheckCircle2 size={14} />
                                <span>Confirm Payment</span>
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                                Admin Authorization Required
                              </span>
                            )
                          ) : (
                            <span style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Check size={14} /> Confirmed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Catalog Inventory Management */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Product Inventory Management</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Manage eyeglasses, lenses, and optical frames in Spring Boot (<code>/api/products/*</code>)
                </p>
              </div>

              <button
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} />
                <span>{isAddingProduct ? 'Cancel' : 'Add New Product'}</span>
              </button>
            </div>

            {/* Add product form */}
            {isAddingProduct && (
              <form onSubmit={handleCreateProduct} style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}>
                <h4 style={{ marginBottom: '1rem' }}>Add Optical Frame or Lenses</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gucci Square Frame"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={newProdCat}
                      onChange={(e) => setNewProdCat(e.target.value)}
                      className="form-select"
                    >
                      <option value="Eyeglasses">Eyeglasses</option>
                      <option value="Sunglasses">Sunglasses</option>
                      <option value="Contact Lenses">Contact Lenses</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Frame materials, lens index, tint, and finish..."
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newProdPic}
                    onChange={(e) => setNewProdPic(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Save to Spring Boot Catalog
                </button>
              </form>
            )}

            {/* Inventory table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.785rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Product</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.75rem 1rem' }}>In Stock</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalogProducts.map((p) => (
                    <tr key={p.productId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>#{p.productId}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img src={p.pic} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                          <strong>{p.name}</strong>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className="badge badge-primary">{p.category}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>${p.price?.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <button
                          onClick={() => handleUpdateStock(p.productId, p.stockQuantity)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                          title="Click to update stock quantity"
                        >
                          {p.stockQuantity} units ✎
                        </button>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <button
                          onClick={() => handleDeleteProduct(p.productId)}
                          style={{ color: '#f43f5e', cursor: 'pointer', padding: '4px' }}
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Staff & Management Directory */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Staff Directory</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Retrieved from Spring Boot <code>/api/employees</code> & <code>/api/managers</code>:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {staffList.map((emp) => (
                <div key={emp.employeeId} style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {emp.firstName} {emp.lastName}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#0284c7', fontWeight: 600 }}>
                    {emp.roleTitle}
                  </div>
                  <div style={{ fontSize: '0.785rem', color: '#64748b' }}>
                    Dept: {emp.assignedDepartment || 'Optical Laboratory'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
