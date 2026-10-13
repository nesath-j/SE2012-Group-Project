import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Modal from './components/Modal';

import DashboardView from './views/DashboardView';
import AppointmentsView from './views/AppointmentsView';
import DoctorsView from './views/DoctorsView';
import SchedulesView from './views/SchedulesView';
import ProductsView from './views/ProductsView';
import ApiExplorerView from './views/ApiExplorerView';

import * as api from './api/visionExpressApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState({ message: null, type: 'info' });
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Core Data Collections
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [products, setProducts] = useState([]);
  const [scheduleDoctorFilter, setScheduleDoctorFilter] = useState('ALL');

  // Global Modals State
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [addDoctorModalOpen, setAddDoctorModalOpen] = useState(false);
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);

  // Book Appointment Form State
  const [bookDoctorId, setBookDoctorId] = useState('');
  const [bookMemberId, setBookMemberId] = useState('');
  const [bookScheduleId, setBookScheduleId] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [bookNotes, setBookNotes] = useState('');
  const [availableSlotsForDoctor, setAvailableSlotsForDoctor] = useState([]);

  // Add Doctor Form State
  const [newDoctorUserId, setNewDoctorUserId] = useState('');
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpecialization, setNewDoctorSpecialization] = useState('');
  const [newDoctorLicense, setNewDoctorLicense] = useState('');

  // Add Schedule Form State
  const [newScheduleDoctorId, setNewScheduleDoctorId] = useState('');
  const [newScheduleDate, setNewScheduleDate] = useState('');
  const [newScheduleStart, setNewScheduleStart] = useState('09:00:00');
  const [newScheduleEnd, setNewScheduleEnd] = useState('10:00:00');

  // Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Prescription Frames');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPic, setNewProdPic] = useState('https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80');

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: null, type: 'info' });
    }, 4500);
  };

  // Initial Load & Ping Backend
  const refreshAllData = async () => {
    setCheckingHealth(true);
    const online = await api.checkBackendHealth();
    setIsBackendOnline(online);
    setCheckingHealth(false);

    const docRes = await api.getDoctors();
    setDoctors(docRes.data || []);

    const schedRes = await api.getAllSchedules();
    setSchedules(schedRes.data || []);

    const apptRes = await api.getAllAppointments();
    setAppointments(apptRes.data || []);

    const prodRes = await api.getProducts();
    setProducts(prodRes.data || []);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // When bookDoctorId changes in Book Modal, fetch available slots for that doctor
  useEffect(() => {
    if (bookDoctorId) {
      api.getAvailableDoctorSchedules(bookDoctorId).then(res => {
        setAvailableSlotsForDoctor(res.data || []);
        if (res.data && res.data.length > 0) {
          const first = res.data[0];
          setBookScheduleId(first.scheduleId);
          setBookDate(`${first.availableDate}T${first.startTime}`);
        } else {
          setBookScheduleId('');
        }
      });
    } else {
      setAvailableSlotsForDoctor([]);
      setBookScheduleId('');
    }
  }, [bookDoctorId]);

  // Navigate to schedules with a specific doctor preselected
  const handleViewDoctorSchedules = (doctorId) => {
    setScheduleDoctorFilter(String(doctorId));
    setActiveTab('schedules');
  };

  /* =========================================================================
     ACTION HANDLERS (Connected to API)
     ========================================================================= */

  // 1. Book Appointment (POST /api/doctor-appointments)
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!bookDoctorId || !bookMemberId || !bookScheduleId) {
      showToast('Please select a doctor, member ID, and an open schedule slot.', 'error');
      return;
    }

    try {
      const payload = {
        memberId: Number(bookMemberId),
        doctorId: Number(bookDoctorId),
        scheduleId: Number(bookScheduleId),
        appointmentDate: bookDate || new Date().toISOString(),
        status: 'SCHEDULED',
        consultationNotes: bookNotes
      };

      const result = await api.bookAppointment(payload);
      showToast(`Appointment #${result.doctorAppointmentId} successfully booked!`, 'success');
      setBookModalOpen(false);
      // Reset form
      setBookDoctorId('');
      setBookMemberId('');
      setBookScheduleId('');
      setBookNotes('');
      // Refresh state
      await refreshAllData();
      setActiveTab('appointments');
    } catch (err) {
      showToast(`Booking error: ${err.message}`, 'error');
    }
  };

  // 2. Update Appointment Notes (PUT /api/doctor-appointments/{id}/notes)
  const handleUpdateNotes = async (appointmentId, notes) => {
    try {
      await api.updateAppointmentNotes(appointmentId, notes);
      showToast(`Clinical notes saved for Appointment #${appointmentId}`, 'success');
      await refreshAllData();
    } catch (err) {
      showToast(`Failed to update notes: ${err.message}`, 'error');
    }
  };

  // 3. Update Appointment Status (PUT /api/doctor-appointments/{id}/status)
  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await api.updateAppointmentStatus(appointmentId, status);
      showToast(`Appointment #${appointmentId} status changed to ${status}`, 'success');
      await refreshAllData();
    } catch (err) {
      showToast(`Failed to update status: ${err.message}`, 'error');
    }
  };

  // 4. Create Doctor (POST /api/doctors)
  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: Number(newDoctorUserId),
        specialization: newDoctorSpecialization,
        licenseNumber: newDoctorLicense,
        name: newDoctorName || `Dr. ${newDoctorSpecialization.split(' ')[0]}`
      };
      const created = await api.createDoctor(payload);
      showToast(`Dr. ${created.name || created.doctorId} registered successfully!`, 'success');
      setAddDoctorModalOpen(false);
      setNewDoctorUserId('');
      setNewDoctorName('');
      setNewDoctorSpecialization('');
      setNewDoctorLicense('');
      await refreshAllData();
      setActiveTab('doctors');
    } catch (err) {
      showToast(`Failed to register doctor: ${err.message}`, 'error');
    }
  };

  // 5. Update Doctor (PUT /api/doctors/{id})
  const handleUpdateDoctor = async (id, data) => {
    try {
      await api.updateDoctor(id, data);
      showToast(`Doctor #${id} details updated.`, 'success');
      await refreshAllData();
    } catch (err) {
      showToast(`Update error: ${err.message}`, 'error');
    }
  };

  // 6. Delete Doctor (DELETE /api/doctors/{id})
  const handleDeleteDoctor = async (id) => {
    try {
      await api.deleteDoctor(id);
      showToast(`Doctor #${id} removed from roster.`, 'success');
      await refreshAllData();
    } catch (err) {
      showToast(`Deletion error: ${err.message}`, 'error');
    }
  };

  // 7. Create Schedule Slot (POST /api/doctor-schedules)
  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        doctorId: Number(newScheduleDoctorId),
        availableDate: newScheduleDate,
        startTime: newScheduleStart,
        endTime: newScheduleEnd,
        booked: false
      };
      const created = await api.createSchedule(payload);
      showToast(`New consultation slot #${created.scheduleId} created!`, 'success');
      setAddScheduleModalOpen(false);
      setNewScheduleDoctorId('');
      setNewScheduleDate('');
      await refreshAllData();
      setActiveTab('schedules');
    } catch (err) {
      showToast(`Failed to add schedule: ${err.message}`, 'error');
    }
  };

  // 8. Update Schedule Slot (PUT /api/doctor-schedules/{id})
  const handleUpdateSchedule = async (id, data) => {
    try {
      await api.updateSchedule(id, data);
      showToast(`Schedule slot #${id} updated.`, 'success');
      await refreshAllData();
    } catch (err) {
      showToast(`Failed to update schedule: ${err.message}`, 'error');
    }
  };

  // 9. Delete Schedule Slot (DELETE /api/doctor-schedules/{id})
  const handleDeleteSchedule = async (id) => {
    try {
      await api.deleteSchedule(id);
      showToast(`Schedule slot #${id} deleted.`, 'success');
      await refreshAllData();
    } catch (err) {
      showToast(`Failed to delete schedule: ${err.message}`, 'error');
    }
  };

  // 10. Add Product (POST /add)
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newProdName,
        category: newProdCategory,
        price: parseFloat(newProdPrice),
        stock_quantity: parseInt(newProdStock, 10),
        description: newProdDesc,
        pic: newProdPic
      };
      await api.addProduct(payload);
      showToast(`"${newProdName}" added to eyewear catalog!`, 'success');
      setAddProductModalOpen(false);
      setNewProdName('');
      setNewProdPrice('');
      setNewProdDesc('');
      await refreshAllData();
      setActiveTab('products');
    } catch (err) {
      showToast(`Failed to save product: ${err.message}`, 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null, type: 'info' })}
      />

      {/* Main Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Top Navigation */}
        <Navbar
          isBackendOnline={isBackendOnline}
          checkingHealth={checkingHealth}
          onRefreshHealth={refreshAllData}
          onOpenBookModal={() => setBookModalOpen(true)}
        />

        {/* Content Body with Sidebar */}
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={{
              appointments: appointments.length,
              doctors: doctors.length,
              schedules: schedules.filter(s => !s.booked).length,
              products: products.length
            }}
          />

          <main className="main-content">
            <div className="page-content">
              {activeTab === 'dashboard' && (
                <DashboardView
                  doctors={doctors}
                  schedules={schedules}
                  appointments={appointments}
                  products={products}
                  onNavigate={setActiveTab}
                  onOpenBookModal={() => setBookModalOpen(true)}
                  onOpenAddScheduleModal={() => setAddScheduleModalOpen(true)}
                  onOpenAddDoctorModal={() => setAddDoctorModalOpen(true)}
                  onOpenAddProductModal={() => setAddProductModalOpen(true)}
                  onSelectAppointmentForNotes={(appt) => {
                    setActiveTab('appointments');
                  }}
                />
              )}

              {activeTab === 'appointments' && (
                <AppointmentsView
                  appointments={appointments}
                  doctors={doctors}
                  schedules={schedules}
                  onBookAppointment={handleBookAppointment}
                  onUpdateNotes={handleUpdateNotes}
                  onUpdateStatus={handleUpdateStatus}
                  onOpenBookModal={() => setBookModalOpen(true)}
                />
              )}

              {activeTab === 'doctors' && (
                <DoctorsView
                  doctors={doctors}
                  schedules={schedules}
                  onCreateDoctor={handleCreateDoctor}
                  onUpdateDoctor={handleUpdateDoctor}
                  onDeleteDoctor={handleDeleteDoctor}
                  onViewDoctorSchedules={handleViewDoctorSchedules}
                  onOpenAddDoctorModal={() => setAddDoctorModalOpen(true)}
                />
              )}

              {activeTab === 'schedules' && (
                <SchedulesView
                  schedules={schedules}
                  doctors={doctors}
                  initialDoctorFilter={scheduleDoctorFilter}
                  onCreateSchedule={handleCreateSchedule}
                  onUpdateSchedule={handleUpdateSchedule}
                  onDeleteSchedule={handleDeleteSchedule}
                  onOpenAddScheduleModal={() => setAddScheduleModalOpen(true)}
                />
              )}

              {activeTab === 'products' && (
                <ProductsView
                  products={products}
                  onOpenAddProductModal={() => setAddProductModalOpen(true)}
                />
              )}

              {activeTab === 'api-explorer' && (
                <ApiExplorerView />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* =========================================================================
         GLOBAL MODALS
         ========================================================================= */}

      {/* 1. Book Appointment Modal (POST /api/doctor-appointments) */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title="Book Doctor Appointment"
        maxWidth="580px"
      >
        <form onSubmit={handleBookAppointment}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Books slot via <code style={{ color: 'var(--accent-cyan)' }}>POST /api/doctor-appointments</code> and marks schedule slot as booked.
          </p>

          <div className="form-group">
            <label className="form-label">Select Specialist Doctor *</label>
            <select
              required
              value={bookDoctorId}
              onChange={(e) => setBookDoctorId(e.target.value)}
              className="form-select"
            >
              <option value="">-- Choose Eye Specialist --</option>
              {doctors.map(d => (
                <option key={d.doctorId} value={d.doctorId}>
                  {d.name || `Dr. (ID: ${d.doctorId})`} &bull; {d.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Member ID (Patient ID) *</label>
            <input
              type="number"
              required
              placeholder="e.g. 501"
              value={bookMemberId}
              onChange={(e) => setBookMemberId(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Open Schedule Slot (from /available) *</label>
            <select
              required
              disabled={!bookDoctorId}
              value={bookScheduleId}
              onChange={(e) => {
                setBookScheduleId(e.target.value);
                const chosen = availableSlotsForDoctor.find(s => s.scheduleId === Number(e.target.value));
                if (chosen) setBookDate(`${chosen.availableDate}T${chosen.startTime}`);
              }}
              className="form-select"
            >
              {!bookDoctorId ? (
                <option>First choose a doctor above</option>
              ) : availableSlotsForDoctor.length === 0 ? (
                <option value="">No open slots available for this doctor</option>
              ) : (
                availableSlotsForDoctor.map(slot => (
                  <option key={slot.scheduleId} value={slot.scheduleId}>
                    Slot #{slot.scheduleId}: {slot.availableDate} from {slot.startTime} to {slot.endTime}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Appointment ISO Date Time *</label>
            <input
              type="text"
              required
              value={bookDate}
              onChange={(e) => setBookDate(e.target.value)}
              placeholder="2026-10-02T10:30:00"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Consultation Notes / Symptoms</label>
            <textarea
              placeholder="e.g. Blurry peripheral vision, requests new prescription eyeglasses"
              value={bookNotes}
              onChange={(e) => setBookNotes(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setBookModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={!bookScheduleId} className="btn btn-primary">
              Confirm & Book Appointment
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Add Doctor Modal (POST /api/doctors) */}
      <Modal
        isOpen={addDoctorModalOpen}
        onClose={() => setAddDoctorModalOpen(false)}
        title="Register Eye Specialist Doctor"
      >
        <form onSubmit={handleCreateDoctor}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Endpoint: <code style={{ color: 'var(--accent-cyan)' }}>POST /api/doctors</code>
          </p>

          <div className="form-group">
            <label className="form-label">Doctor Full Name</label>
            <input
              type="text"
              placeholder="e.g. Dr. Arthur Vance"
              value={newDoctorName}
              onChange={(e) => setNewDoctorName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">User ID (FK to user table) *</label>
            <input
              type="number"
              required
              placeholder="e.g. 105"
              value={newDoctorUserId}
              onChange={(e) => setNewDoctorUserId(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Specialization *</label>
            <input
              type="text"
              required
              placeholder="e.g. Pediatric Optometry & Strabismus"
              value={newDoctorSpecialization}
              onChange={(e) => setNewDoctorSpecialization(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">License Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. DOC-OPT-88192"
              value={newDoctorLicense}
              onChange={(e) => setNewDoctorLicense(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setAddDoctorModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Doctor
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Add Schedule Slot Modal (POST /api/doctor-schedules) */}
      <Modal
        isOpen={addScheduleModalOpen}
        onClose={() => setAddScheduleModalOpen(false)}
        title="Add Doctor Schedule Time Slot"
      >
        <form onSubmit={handleCreateSchedule}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Endpoint: <code style={{ color: 'var(--accent-cyan)' }}>POST /api/doctor-schedules</code>
          </p>

          <div className="form-group">
            <label className="form-label">Select Doctor *</label>
            <select
              required
              value={newScheduleDoctorId}
              onChange={(e) => setNewScheduleDoctorId(e.target.value)}
              className="form-select"
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map(d => (
                <option key={d.doctorId} value={d.doctorId}>
                  {d.name || `Dr. (ID: ${d.doctorId})`} &bull; {d.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Available Date *</label>
            <input
              type="date"
              required
              value={newScheduleDate}
              onChange={(e) => setNewScheduleDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Start Time (HH:mm:ss) *</label>
              <input
                type="text"
                required
                value={newScheduleStart}
                onChange={(e) => setNewScheduleStart(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time (HH:mm:ss) *</label>
              <input
                type="text"
                required
                value={newScheduleEnd}
                onChange={(e) => setNewScheduleEnd(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setAddScheduleModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Schedule Slot
            </button>
          </div>
        </form>
      </Modal>

      {/* 4. Add Product Modal (POST /add) */}
      <Modal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        title="Catalog New Eyewear Product"
      >
        <form onSubmit={handleCreateProduct}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Endpoint: <code style={{ color: 'var(--accent-cyan)' }}>POST /add</code> (Product Controller)
          </p>

          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. UltraVue Polarized Titanium"
              value={newProdName}
              onChange={(e) => setNewProdName(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={newProdCategory}
                onChange={(e) => setNewProdCategory(e.target.value)}
                className="form-select"
              >
                <option value="Prescription Frames">Prescription Frames</option>
                <option value="Eyeglasses">Eyeglasses</option>
                <option value="Sunglasses">Sunglasses</option>
                <option value="Contact Lenses">Contact Lenses</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="199.99"
                value={newProdPrice}
                onChange={(e) => setNewProdPrice(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                required
                placeholder="25"
                value={newProdStock}
                onChange={(e) => setNewProdStock(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                value={newProdPic}
                onChange={(e) => setNewProdPic(e.target.value)}
                placeholder="https://..."
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Description</label>
            <textarea
              placeholder="High-index polycarbonate anti-glare scratch-resistant..."
              value={newProdDesc}
              onChange={(e) => setNewProdDesc(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setAddProductModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add to Catalog
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
