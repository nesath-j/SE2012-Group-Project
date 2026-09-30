import {
  initialDoctors,
  initialSchedules,
  initialAppointments,
  initialProducts
} from '../data/mockInitialData';

const BASE_URL = ''; // Relative path leverages Vite dev server proxy to http://localhost:8081

// LocalStorage cache helpers for seamless demo mode & persistence
const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(`vision_express_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    localStorage.setItem(`vision_express_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
};

// Initialize local mock store
if (!localStorage.getItem('vision_express_doctors')) setStored('doctors', initialDoctors);
if (!localStorage.getItem('vision_express_schedules')) setStored('schedules', initialSchedules);
if (!localStorage.getItem('vision_express_appointments')) setStored('appointments', initialAppointments);
if (!localStorage.getItem('vision_express_products')) setStored('products', initialProducts);

// Global state for live backend connectivity
let isLiveBackend = true;

export const setLiveMode = (enabled) => {
  isLiveBackend = enabled;
};

export const getLiveMode = () => isLiveBackend;

// Health check to test if Spring Boot backend is responding on port 8081
export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${BASE_URL}/api/doctors`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok || res.status === 200;
  } catch (err) {
    return false;
  }
};

/* =========================================================================
   DOCTORS API (/api/doctors) - DoctorController.java
   ========================================================================= */

export const getDoctors = async () => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctors`);
      if (res.ok) {
        const data = await res.json();
        setStored('doctors', data);
        return { data, isLive: true };
      }
    } catch (e) {
      console.warn("Backend not reachable, serving local store", e);
    }
  }
  return { data: getStored('doctors', initialDoctors), isLive: false };
};

export const getDoctorById = async (id) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctors/${id}`);
      if (res.ok) return { data: await res.json(), isLive: true };
    } catch (e) {
      console.warn(e);
    }
  }
  const doctors = getStored('doctors', initialDoctors);
  const found = doctors.find(d => d.doctorId === Number(id));
  return { data: found || null, isLive: false };
};

export const createDoctor = async (doctorData) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Falling back to local simulation", e);
    }
  }
  // Local fallback
  const doctors = getStored('doctors', initialDoctors);
  const newDoctor = {
    doctorId: Date.now(),
    ...doctorData
  };
  doctors.push(newDoctor);
  setStored('doctors', doctors);
  return newDoctor;
};

export const updateDoctor = async (id, doctorData) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
  }
  const doctors = getStored('doctors', initialDoctors);
  const idx = doctors.findIndex(d => d.doctorId === Number(id));
  if (idx !== -1) {
    doctors[idx] = { ...doctors[idx], ...doctorData };
    setStored('doctors', doctors);
    return doctors[idx];
  }
  throw new Error("Doctor not found");
};

export const deleteDoctor = async (id) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctors/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const doctors = getStored('doctors', initialDoctors).filter(d => d.doctorId !== Number(id));
        setStored('doctors', doctors);
        return true;
      }
    } catch (e) {
      console.warn(e);
    }
  }
  const doctors = getStored('doctors', initialDoctors).filter(d => d.doctorId !== Number(id));
  setStored('doctors', doctors);
  return true;
};

/* =========================================================================
   SCHEDULES API (/api/doctor-schedules) - DoctorScheduleController.java
   ========================================================================= */

export const getAllSchedules = async () => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-schedules`);
      if (res.ok) {
        const data = await res.json();
        setStored('schedules', data);
        return { data, isLive: true };
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return { data: getStored('schedules', initialSchedules), isLive: false };
};

export const getDoctorSchedules = async (doctorId) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-schedules/doctor/${doctorId}`);
      if (res.ok) return { data: await res.json(), isLive: true };
    } catch (e) {
      console.warn(e);
    }
  }
  const schedules = getStored('schedules', initialSchedules);
  return { data: schedules.filter(s => s.doctorId === Number(doctorId)), isLive: false };
};

export const getAvailableDoctorSchedules = async (doctorId) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-schedules/doctor/${doctorId}/available`);
      if (res.ok) return { data: await res.json(), isLive: true };
    } catch (e) {
      console.warn(e);
    }
  }
  const schedules = getStored('schedules', initialSchedules);
  return {
    data: schedules.filter(s => s.doctorId === Number(doctorId) && !s.booked),
    isLive: false
  };
};

export const createSchedule = async (scheduleData) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
  }
  const schedules = getStored('schedules', initialSchedules);
  const newSchedule = {
    scheduleId: Date.now(),
    booked: false,
    ...scheduleData
  };
  schedules.push(newSchedule);
  setStored('schedules', schedules);
  return newSchedule;
};

export const updateSchedule = async (id, scheduleData) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-schedules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
  }
  const schedules = getStored('schedules', initialSchedules);
  const idx = schedules.findIndex(s => s.scheduleId === Number(id));
  if (idx !== -1) {
    schedules[idx] = { ...schedules[idx], ...scheduleData };
    setStored('schedules', schedules);
    return schedules[idx];
  }
  throw new Error("Schedule not found");
};

export const deleteSchedule = async (id) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-schedules/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const schedules = getStored('schedules', initialSchedules).filter(s => s.scheduleId !== Number(id));
        setStored('schedules', schedules);
        return true;
      }
    } catch (e) {
      console.warn(e);
    }
  }
  const schedules = getStored('schedules', initialSchedules).filter(s => s.scheduleId !== Number(id));
  setStored('schedules', schedules);
  return true;
};

/* =========================================================================
   APPOINTMENTS API (/api/doctor-appointments) - DoctorAppointmentController.java
   ========================================================================= */

export const bookAppointment = async (appointmentData) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });
      if (res.ok) {
        const created = await res.json();
        // Update local cache
        const appointments = getStored('appointments', initialAppointments);
        appointments.unshift(created);
        setStored('appointments', appointments);
        return created;
      }
    } catch (e) {
      console.warn("Backend unavailable, booking locally", e);
    }
  }
  // Local fallback: mark slot as booked and save appointment
  const schedules = getStored('schedules', initialSchedules);
  const slotIdx = schedules.findIndex(s => s.scheduleId === Number(appointmentData.scheduleId));
  if (slotIdx !== -1) {
    schedules[slotIdx].booked = true;
    setStored('schedules', schedules);
  }

  const appointments = getStored('appointments', initialAppointments);
  const newAppointment = {
    doctorAppointmentId: Date.now(),
    status: 'SCHEDULED',
    consultationNotes: appointmentData.consultationNotes || '',
    ...appointmentData
  };
  appointments.unshift(newAppointment);
  setStored('appointments', appointments);
  return newAppointment;
};

export const getAppointmentsByDoctor = async (doctorId) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-appointments/doctor/${doctorId}`);
      if (res.ok) return { data: await res.json(), isLive: true };
    } catch (e) {
      console.warn(e);
    }
  }
  const appointments = getStored('appointments', initialAppointments);
  return {
    data: appointments.filter(a => a.doctorId === Number(doctorId)),
    isLive: false
  };
};

export const getAppointmentsByMember = async (memberId) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-appointments/member/${memberId}`);
      if (res.ok) return { data: await res.json(), isLive: true };
    } catch (e) {
      console.warn(e);
    }
  }
  const appointments = getStored('appointments', initialAppointments);
  return {
    data: appointments.filter(a => a.memberId === Number(memberId)),
    isLive: false
  };
};

export const updateAppointmentNotes = async (id, notes) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-appointments/${id}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
  }
  const appointments = getStored('appointments', initialAppointments);
  const idx = appointments.findIndex(a => a.doctorAppointmentId === Number(id));
  if (idx !== -1) {
    appointments[idx].consultationNotes = notes;
    setStored('appointments', appointments);
    return appointments[idx];
  }
  throw new Error("Appointment not found");
};

export const updateAppointmentStatus = async (id, status) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
  }
  const appointments = getStored('appointments', initialAppointments);
  const idx = appointments.findIndex(a => a.doctorAppointmentId === Number(id));
  if (idx !== -1) {
    appointments[idx].status = status;
    setStored('appointments', appointments);
    return appointments[idx];
  }
  throw new Error("Appointment not found");
};

export const getAllAppointments = async () => {
  // Spring Boot controller doesn't have an unparameterized GET /api/doctor-appointments,
  // so we aggregate or retrieve stored appointments
  return { data: getStored('appointments', initialAppointments), isLive: false };
};

/* =========================================================================
   PRODUCT API (/add) - ProductController.java
   ========================================================================= */

export const addProduct = async (productData) => {
  if (isLiveBackend) {
    try {
      const res = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const saved = await res.json();
        const products = getStored('products', initialProducts);
        products.unshift(saved);
        setStored('products', products);
        return saved;
      }
    } catch (e) {
      console.warn(e);
    }
  }
  const products = getStored('products', initialProducts);
  const newProduct = {
    id: Date.now(),
    ...productData
  };
  products.unshift(newProduct);
  setStored('products', products);
  return newProduct;
};

export const getProducts = async () => {
  return { data: getStored('products', initialProducts), isLive: false };
};
