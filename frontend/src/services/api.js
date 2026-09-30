/**
 * VisionExpress API Client
 * Interacts with Spring Boot backend at http://localhost:8081
 * Includes seamless mock fallback if the backend or database is offline.
 */

const API_BASE = '/api';

// Initial fallback mock data for testing and offline resilience
const initialMockData = {
  couriers: [
    { courierId: 1, companyName: "DHL Express Healthcare", contactNumber: "+94 11 245 8899", serviceType: "Express Delivery" },
    { courierId: 2, companyName: "FedEx Optical Cargo", contactNumber: "+94 77 345 6789", serviceType: "Temperature Controlled" },
    { courierId: 3, companyName: "Speedy Parcel Logistics", contactNumber: "+94 71 890 1234", serviceType: "Standard Ground" },
    { courierId: 4, companyName: "CityLink Prime Couriers", contactNumber: "+94 76 555 4321", serviceType: "Same Day Optical" }
  ],
  employees: [
    { employeeId: 101, roleTitle: "Senior Optometrist", assignedDepartment: "Clinical Optometry" },
    { employeeId: 102, roleTitle: "Dispensing Optician", assignedDepartment: "Eyewear & Dispensing" },
    { employeeId: 103, roleTitle: "Laboratory Technician", assignedDepartment: "Lens Fabrication" },
    { employeeId: 104, roleTitle: "Clinic Coordinator", assignedDepartment: "Patient Services" },
    { employeeId: 105, roleTitle: "Ophthalmic Assistant", assignedDepartment: "Clinical Optometry" }
  ],
  appointments: [
    {
      serviceAppointmentId: 1,
      memberId: 1001,
      employeeId: 101,
      serviceType: "Frame Adjustment",
      appointmentDate: "2026-10-02T10:30:00",
      serviceStatus: "Scheduled"
    },
    {
      serviceAppointmentId: 2,
      memberId: 1002,
      employeeId: 103,
      serviceType: "Lens Fitting",
      appointmentDate: "2026-10-02T14:00:00",
      serviceStatus: "In-Progress"
    },
    {
      serviceAppointmentId: 3,
      memberId: 1003,
      employeeId: 102,
      serviceType: "Repair",
      appointmentDate: "2026-10-01T11:15:00",
      serviceStatus: "Completed"
    },
    {
      serviceAppointmentId: 4,
      memberId: 1004,
      employeeId: 101,
      serviceType: "Frame Adjustment",
      appointmentDate: "2026-10-03T16:00:00",
      serviceStatus: "Scheduled"
    }
  ],
  products: [
    {
      name: "Ray-Ban Wayfarer Classic",
      category: "Sunglasses",
      price: 185.00,
      stock_quantity: 24,
      description: "Iconic square acetate frame with signature G-15 crystal green lenses.",
      pic: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Silhouette Titan Minimal Art",
      category: "Eyeglasses",
      price: 340.00,
      stock_quantity: 15,
      description: "Ultra-lightweight rimless high-tech titanium frame for ultimate everyday comfort.",
      pic: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Oakley Holbrook Prizm",
      category: "Sport Performance",
      price: 168.00,
      stock_quantity: 32,
      description: "O-Matter lightweight frame with Prizm polarized lens technology.",
      pic: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Acuvue Oasys HydraLuxe (30 Pack)",
      category: "Contact Lenses",
      price: 46.50,
      stock_quantity: 110,
      description: "Daily disposable silicone hydrogel contact lenses with tear-infused design.",
      pic: "https://images.unsplash.com/photo-1582142839970-2b9daac17235?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Gucci Geometric Optical Frame",
      category: "Luxury Eyewear",
      price: 495.00,
      stock_quantity: 8,
      description: "Gold-toned geometric metal frame with signature interlocking GG temple motifs.",
      pic: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80"
    }
  ]
};

// Local storage persistent fallback store
const loadLocalStore = () => {
  try {
    const raw = localStorage.getItem('visionexpress_mock_data');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read from localStorage', e);
  }
  return initialMockData;
};

const saveLocalStore = (data) => {
  try {
    localStorage.setItem('visionexpress_mock_data', JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
};

let store = loadLocalStore();

// Generic fetch wrapper with timeout
const request = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(id);

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = `Server error (${res.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.message || errorText;
      } catch {
        if (errorText) errorMsg = errorText;
      }
      throw new Error(errorMsg);
    }

    if (res.status === 204) {
      return null;
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return await res.text();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export const api = {
  // Check backend health
  async checkConnection() {
    try {
      const res = await fetch(`${API_BASE}/couriers`, { method: 'GET', signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // ==========================================
  // Courier Endpoints (/api/couriers)
  // ==========================================
  couriers: {
    async getAll() {
      try {
        return await request('/couriers');
      } catch (err) {
        console.warn('Using mock fallback for couriers.getAll:', err.message);
        return store.couriers;
      }
    },

    async getById(id) {
      try {
        return await request(`/couriers/${id}`);
      } catch (err) {
        const item = store.couriers.find(c => c.courierId === Number(id));
        if (!item) throw new Error(`Courier #${id} not found`);
        return item;
      }
    },

    async getByServiceType(serviceType) {
      try {
        return await request(`/couriers/service-type/${encodeURIComponent(serviceType)}`);
      } catch (err) {
        return store.couriers.filter(c => c.serviceType.toLowerCase() === serviceType.toLowerCase());
      }
    },

    async create(courierData) {
      try {
        return await request('/couriers', {
          method: 'POST',
          body: JSON.stringify(courierData)
        });
      } catch (err) {
        console.warn('Using mock store for courier creation:', err.message);
        const newId = store.couriers.length ? Math.max(...store.couriers.map(c => c.courierId || 0)) + 1 : 1;
        const newCourier = { courierId: newId, ...courierData };
        store.couriers = [newCourier, ...store.couriers];
        saveLocalStore(store);
        return newCourier;
      }
    },

    async update(id, courierData) {
      try {
        return await request(`/couriers/${id}`, {
          method: 'PUT',
          body: JSON.stringify(courierData)
        });
      } catch (err) {
        console.warn('Using mock store for courier update:', err.message);
        const idx = store.couriers.findIndex(c => c.courierId === Number(id));
        if (idx === -1) throw new Error(`Courier #${id} not found`);
        const updated = { ...store.couriers[idx], ...courierData, courierId: Number(id) };
        store.couriers[idx] = updated;
        saveLocalStore(store);
        return updated;
      }
    },

    async delete(id) {
      try {
        return await request(`/couriers/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Using mock store for courier delete:', err.message);
        store.couriers = store.couriers.filter(c => c.courierId !== Number(id));
        saveLocalStore(store);
        return null;
      }
    }
  },

  // ==========================================
  // Employee Endpoints (/api/employees)
  // ==========================================
  employees: {
    async getAll() {
      try {
        return await request('/employees');
      } catch (err) {
        console.warn('Using mock fallback for employees.getAll:', err.message);
        return store.employees;
      }
    },

    async getById(id) {
      try {
        return await request(`/employees/${id}`);
      } catch (err) {
        const item = store.employees.find(e => e.employeeId === Number(id));
        if (!item) throw new Error(`Employee #${id} not found`);
        return item;
      }
    },

    async getByDepartment(department) {
      try {
        return await request(`/employees/department/${encodeURIComponent(department)}`);
      } catch (err) {
        return store.employees.filter(e => e.assignedDepartment.toLowerCase() === department.toLowerCase());
      }
    },

    async create(employeeData) {
      try {
        return await request('/employees', {
          method: 'POST',
          body: JSON.stringify(employeeData)
        });
      } catch (err) {
        console.warn('Using mock store for employee create:', err.message);
        const newEmployee = {
          employeeId: Number(employeeData.employeeId) || (store.employees.length ? Math.max(...store.employees.map(e => e.employeeId || 0)) + 1 : 101),
          roleTitle: employeeData.roleTitle,
          assignedDepartment: employeeData.assignedDepartment
        };
        store.employees = [newEmployee, ...store.employees];
        saveLocalStore(store);
        return newEmployee;
      }
    },

    async update(id, employeeData) {
      try {
        return await request(`/employees/${id}`, {
          method: 'PUT',
          body: JSON.stringify(employeeData)
        });
      } catch (err) {
        console.warn('Using mock store for employee update:', err.message);
        const idx = store.employees.findIndex(e => e.employeeId === Number(id));
        if (idx === -1) throw new Error(`Employee #${id} not found`);
        const updated = { ...store.employees[idx], ...employeeData, employeeId: Number(id) };
        store.employees[idx] = updated;
        saveLocalStore(store);
        return updated;
      }
    },

    async delete(id) {
      try {
        return await request(`/employees/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Using mock store for employee delete:', err.message);
        store.employees = store.employees.filter(e => e.employeeId !== Number(id));
        saveLocalStore(store);
        return null;
      }
    }
  },

  // ==========================================
  // Service Appointment Endpoints (/api/service-appointments)
  // ==========================================
  appointments: {
    async getAll() {
      try {
        return await request('/service-appointments');
      } catch (err) {
        console.warn('Using mock fallback for appointments.getAll:', err.message);
        return store.appointments;
      }
    },

    async getById(id) {
      try {
        return await request(`/service-appointments/${id}`);
      } catch (err) {
        const item = store.appointments.find(a => a.serviceAppointmentId === Number(id));
        if (!item) throw new Error(`Appointment #${id} not found`);
        return item;
      }
    },

    async getByMember(memberId) {
      try {
        return await request(`/service-appointments/member/${memberId}`);
      } catch (err) {
        return store.appointments.filter(a => a.memberId === Number(memberId));
      }
    },

    async getByEmployee(employeeId) {
      try {
        return await request(`/service-appointments/employee/${employeeId}`);
      } catch (err) {
        return store.appointments.filter(a => a.employeeId === Number(employeeId));
      }
    },

    async book(appointmentData) {
      // Validate service type matching ServiceAppointmentService VALID_SERVICES
      const validServices = ["Frame Adjustment", "Lens Fitting", "Repair"];
      if (!validServices.includes(appointmentData.serviceType)) {
        throw new Error("Invalid service type. Must be 'Frame Adjustment', 'Lens Fitting', or 'Repair'.");
      }

      try {
        return await request('/service-appointments/add', {
          method: 'POST',
          body: JSON.stringify(appointmentData)
        });
      } catch (err) {
        console.warn('Using mock store for booking appointment:', err.message);
        const newId = store.appointments.length ? Math.max(...store.appointments.map(a => a.serviceAppointmentId || 0)) + 1 : 1;
        const newAppointment = {
          serviceAppointmentId: newId,
          memberId: Number(appointmentData.memberId),
          employeeId: Number(appointmentData.employeeId),
          serviceType: appointmentData.serviceType,
          appointmentDate: appointmentData.appointmentDate,
          serviceStatus: "Scheduled"
        };
        store.appointments = [newAppointment, ...store.appointments];
        saveLocalStore(store);
        return newAppointment;
      }
    },

    async updateStatus(id, newStatus) {
      const validStatuses = ["Scheduled", "In-Progress", "Completed", "Cancelled"];
      if (!validStatuses.includes(newStatus)) {
        throw new Error("Invalid status. Must be 'Scheduled', 'In-Progress', 'Completed', or 'Cancelled'.");
      }

      try {
        return await request(`/service-appointments/${id}/status?status=${encodeURIComponent(newStatus)}`, {
          method: 'PATCH'
        });
      } catch (err) {
        console.warn('Using mock store for updateStatus:', err.message);
        const idx = store.appointments.findIndex(a => a.serviceAppointmentId === Number(id));
        if (idx === -1) throw new Error(`Appointment #${id} not found`);
        store.appointments[idx] = { ...store.appointments[idx], serviceStatus: newStatus };
        saveLocalStore(store);
        return store.appointments[idx];
      }
    },

    async cancel(id) {
      try {
        return await request(`/service-appointments/${id}/cancel`, {
          method: 'PUT'
        });
      } catch (err) {
        console.warn('Using mock store for cancel appointment:', err.message);
        const idx = store.appointments.findIndex(a => a.serviceAppointmentId === Number(id));
        if (idx === -1) throw new Error(`Appointment #${id} not found`);
        store.appointments[idx] = { ...store.appointments[idx], serviceStatus: "Cancelled" };
        saveLocalStore(store);
        return store.appointments[idx];
      }
    }
  },

  // ==========================================
  // Product Endpoints (/api/products)
  // ==========================================
  products: {
    async getAll() {
      // Backend only exposes POST /api/products/add, so client maintains store
      return store.products;
    },

    async add(productData) {
      try {
        const saved = await request('/products/add', {
          method: 'POST',
          body: JSON.stringify(productData)
        });
        store.products = [productData, ...store.products];
        saveLocalStore(store);
        return saved;
      } catch (err) {
        console.warn('Backend unavailable, saving product to local store:', err.message);
        store.products = [productData, ...store.products];
        saveLocalStore(store);
        return productData;
      }
    }
  },

  // Reset to sample initial state
  resetMockData() {
    store = JSON.parse(JSON.stringify(initialMockData));
    saveLocalStore(store);
    return store;
  }
};
