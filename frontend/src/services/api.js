// Vision Express Spring Boot 8081 Integration Service

import {
  INITIAL_PRODUCTS,
  INITIAL_DOCTORS,
  INITIAL_SCHEDULES,
  INITIAL_DOCTOR_APPOINTMENTS,
  INITIAL_EMPLOYEES,
  INITIAL_SERVICE_APPOINTMENTS,
  INITIAL_LOYALTY_TIERS,
  INITIAL_COURIERS,
  INITIAL_ORDERS
} from './mockData';

const BASE_URL = '/api';

// Helper to retrieve CSRF token from Spring Security cookie or endpoint
let cachedCsrfToken = null;
let cachedCsrfHeader = 'X-XSRF-TOKEN';

export function getCsrfTokenFromCookie() {
  const match = document.cookie.match(/(^|;)\s*XSRF-TOKEN\s*=\s*([^;]+)/);
  if (match && match[2]) {
    return decodeURIComponent(match[2].trim());
  }
  return null;
}

export async function fetchCsrfToken() {
  try {
    const res = await fetch(`${BASE_URL}/auth/csrf`, {
      method: 'GET',
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.token) {
        cachedCsrfToken = data.token;
        if (data.headerName) cachedCsrfHeader = data.headerName;
      }
    }
  } catch (err) {
    console.warn('Backend CSRF endpoint unreachable, proceeding with cookie/offline fallback:', err);
  }

  // Check cookie immediately after endpoint response
  const cookieToken = getCsrfTokenFromCookie();
  if (cookieToken) {
    cachedCsrfToken = cookieToken;
  }
  return cachedCsrfToken;
}

// Universal fetch wrapper with credentials, CSRF, and graceful fallback
async function request(endpoint, options = {}) {
  const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes((options.method || 'GET').toUpperCase());

  let currentCsrf = getCsrfTokenFromCookie() || cachedCsrfToken;
  if (isMutating && !currentCsrf) {
    currentCsrf = await fetchCsrfToken();
  }

  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (isMutating && currentCsrf) {
    headers[cachedCsrfHeader] = currentCsrf;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    // Check if response has content
    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = (typeof data === 'object' && data?.message) || data || response.statusText;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return { success: true, data, status: response.status };
  } catch (err) {
    // If it's a network error (e.g. backend offline), rethrow with isNetworkError
    if (!err.status) {
      err.isNetworkError = true;
    }
    throw err;
  }
}

// Local mock state manager for seamless resilience
function getLocal(key, initial) {
  try {
    const raw = localStorage.getItem(`ve_${key}`);
    return raw ? JSON.parse(raw) : initial;
  } catch {
    return initial;
  }
}

function setLocal(key, val) {
  try {
    localStorage.setItem(`ve_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error(e);
  }
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
export const authApi = {
  getCsrf: fetchCsrfToken,

  login: async (email, password) => {
    try {
      // 1. Fetch fresh CSRF token
      const freshToken = await fetchCsrfToken();
      const activeToken = getCsrfTokenFromCookie() || freshToken;

      // 2. Spring Security formLogin expects application/x-www-form-urlencoded
      const body = new URLSearchParams();
      body.append('email', email.trim());
      body.append('password', password);
      if (activeToken) {
        body.append('_csrf', activeToken);
      }

      await request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-XSRF-TOKEN': activeToken,
        },
        body: body.toString(),
      });

      // 3. Immediately re-fetch CSRF token for the authenticated session
      await fetchCsrfToken();

      // 4. Fetch user profile from Spring Security session
      const me = await authApi.me();
      if (!me) {
        throw new Error('Authentication succeeded but session could not be established.');
      }
      return me;
    } catch (err) {
      if (err.isNetworkError) {
        throw new Error('Backend server is unreachable. Please verify that the Spring Boot application on port 8081 is running.');
      }
      if (err.status === 401) {
        throw new Error('Invalid email or password.');
      }
      throw err;
    }
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      localStorage.removeItem('ve_current_user');
      localStorage.removeItem('ve_cart');
    }
  },

  me: async () => {
    try {
      const res = await request('/auth/me');
      if (res.data && res.data.userId) {
        let profile = { ...res.data };
        // If member, attempt to retrieve loyalty tier and discount
        if (profile.role === 'MEMBER') {
          try {
            const [ptsRes, tierRes, discRes] = await Promise.allSettled([
              request(`/members/${profile.userId}/points`),
              request(`/members/${profile.userId}/tier`),
              request(`/members/${profile.userId}/discount`),
            ]);
            if (ptsRes.status === 'fulfilled' && ptsRes.value.data) {
              profile.loyaltyPoints = ptsRes.value.data.loyaltyPoints ?? 0;
            }
            if (tierRes.status === 'fulfilled' && tierRes.value.data) {
              profile.tier = tierRes.value.data.tier ?? 'Bronze';
            }
            if (discRes.status === 'fulfilled' && discRes.value.data) {
              profile.discountPercentage = discRes.value.data.discountPercentage ?? 0;
            }
          } catch (e) {
            console.warn('Could not load extra member details:', e);
          }
        }
        setLocal('current_user', profile);
        return profile;
      }
      localStorage.removeItem('ve_current_user');
      return null;
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('ve_current_user');
        return null;
      }
      if (err.isNetworkError) {
        // Return cached session if network hiccup
        return getLocal('current_user', null);
      }
      return null;
    }
  },

  register: async ({ firstName, lastName, email, password, phone }) => {
    try {
      const res = await request('/users/register', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email: email.trim(), password, phone }),
      });
      // Re-synchronize fresh CSRF token right after registration
      await fetchCsrfToken();
      return res.data;
    } catch (err) {
      if (err.isNetworkError) {
        const newUser = {
          userId: Date.now(),
          firstName,
          lastName,
          email,
          phone,
          role: 'MEMBER',
          loyaltyPoints: 0,
          totalEarnedPoints: 0,
          tier: 'Bronze',
          discountPercentage: 0
        };
        setLocal('current_user', newUser);
        return 'Member registered successfully (offline mode).';
      }
      throw err;
    }
  },

  updateProfile: async (userId, { firstName, lastName, phone }) => {
    try {
      const res = await request(`/users/profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      return res.data;
    } catch (err) {
      if (err.isNetworkError) {
        const current = getLocal('current_user', {});
        const updated = { ...current, firstName, lastName, phone };
        setLocal('current_user', updated);
        return 'Profile updated successfully.';
      }
      throw err;
    }
  }
};

// -------------------------------------------------------------
// Products Endpoints
// -------------------------------------------------------------
export const productsApi = {
  search: async (keyword = '') => {
    try {
      // UserController public search: /api/users/products/search?keyword=...
      const res = await request(`/users/products/search?keyword=${encodeURIComponent(keyword)}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      // If user passed empty string or backend returned empty, fallback to catalog
      const local = getLocal('products', INITIAL_PRODUCTS);
      if (!keyword.trim()) return local;
      return local.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()) || p.category.toLowerCase().includes(keyword.toLowerCase()));
    } catch (err) {
      const local = getLocal('products', INITIAL_PRODUCTS);
      if (!keyword.trim()) return local;
      return local.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()) || p.category.toLowerCase().includes(keyword.toLowerCase()));
    }
  },

  add: async (product) => {
    try {
      const res = await request('/products/add', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      return res.data;
    } catch (err) {
      const local = getLocal('products', INITIAL_PRODUCTS);
      const newProduct = { ...product, productId: Date.now() };
      const updated = [newProduct, ...local];
      setLocal('products', updated);
      return newProduct;
    }
  },

  update: async (id, product) => {
    try {
      const res = await request(`/products/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
      });
      return res.data;
    } catch (err) {
      const local = getLocal('products', INITIAL_PRODUCTS);
      const updated = local.map(p => p.productId === Number(id) ? { ...p, ...product } : p);
      setLocal('products', updated);
      return { ...product, productId: Number(id) };
    }
  },

  delete: async (id) => {
    try {
      await request(`/products/delete/${id}`, { method: 'DELETE' });
      return true;
    } catch (err) {
      const local = getLocal('products', INITIAL_PRODUCTS);
      const updated = local.filter(p => p.productId !== Number(id));
      setLocal('products', updated);
      return true;
    }
  },

  updateStock: async (id, qty) => {
    try {
      await request(`/products/${id}/stock?qty=${qty}`, { method: 'PATCH' });
      return true;
    } catch (err) {
      const local = getLocal('products', INITIAL_PRODUCTS);
      const updated = local.map(p => p.productId === Number(id) ? { ...p, stockQuantity: qty } : p);
      setLocal('products', updated);
      return true;
    }
  }
};

// -------------------------------------------------------------
// Doctor & Doctor Schedule & Appointment Endpoints
// -------------------------------------------------------------
export const doctorsApi = {
  getAll: async () => {
    try {
      const res = await request('/users/doctors');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return getLocal('doctors', INITIAL_DOCTORS);
    } catch {
      return getLocal('doctors', INITIAL_DOCTORS);
    }
  },

  getSchedules: async (doctorId) => {
    try {
      const res = await request(`/doctor-schedules/doctor/${doctorId}/available`);
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      const allSchedules = getLocal('schedules', INITIAL_SCHEDULES);
      return allSchedules.filter(s => s.doctorId === Number(doctorId) && !s.isBooked);
    } catch {
      const allSchedules = getLocal('schedules', INITIAL_SCHEDULES);
      return allSchedules.filter(s => s.doctorId === Number(doctorId) && !s.isBooked);
    }
  },

  getAllSchedules: async () => {
    try {
      const res = await request('/doctor-schedules');
      if (Array.isArray(res.data)) return res.data;
      return getLocal('schedules', INITIAL_SCHEDULES);
    } catch {
      return getLocal('schedules', INITIAL_SCHEDULES);
    }
  },

  createSchedule: async (schedule) => {
    try {
      const res = await request('/doctor-schedules', {
        method: 'POST',
        body: JSON.stringify(schedule),
      });
      return res.data;
    } catch {
      const allSchedules = getLocal('schedules', INITIAL_SCHEDULES);
      const newSlot = { ...schedule, scheduleId: Date.now(), isBooked: false };
      setLocal('schedules', [...allSchedules, newSlot]);
      return newSlot;
    }
  },

  bookAppointment: async ({ memberId, doctorId, scheduleId, appointmentDate }) => {
    try {
      const res = await request('/doctor-appointments', {
        method: 'POST',
        body: JSON.stringify({ memberId, doctorId, scheduleId, appointmentDate }),
      });
      return res.data;
    } catch (err) {
      if (err.isNetworkError) {
        const appointments = getLocal('doctor_appointments', INITIAL_DOCTOR_APPOINTMENTS);
        const newApp = {
          doctorAppointmentId: Date.now(),
          memberId,
          doctorId,
          scheduleId,
          appointmentDate,
          status: 'SCHEDULED',
          consultationNotes: ''
        };
        setLocal('doctor_appointments', [...appointments, newApp]);

        // Mark schedule slot as booked
        const allSchedules = getLocal('schedules', INITIAL_SCHEDULES);
        setLocal('schedules', allSchedules.map(s => s.scheduleId === scheduleId ? { ...s, isBooked: true } : s));
        return newApp;
      }
      throw err;
    }
  },

  getAppointmentsByDoctor: async (doctorId) => {
    try {
      const res = await request(`/doctor-appointments/doctor/${doctorId}`);
      if (Array.isArray(res.data)) return res.data;
      return getLocal('doctor_appointments', INITIAL_DOCTOR_APPOINTMENTS).filter(a => a.doctorId === Number(doctorId));
    } catch {
      return getLocal('doctor_appointments', INITIAL_DOCTOR_APPOINTMENTS).filter(a => a.doctorId === Number(doctorId));
    }
  },

  getAppointmentsByMember: async (memberId) => {
    try {
      const res = await request(`/doctor-appointments/member/${memberId}`);
      if (Array.isArray(res.data)) return res.data;
      return getLocal('doctor_appointments', INITIAL_DOCTOR_APPOINTMENTS).filter(a => a.memberId === Number(memberId));
    } catch {
      return getLocal('doctor_appointments', INITIAL_DOCTOR_APPOINTMENTS).filter(a => a.memberId === Number(memberId));
    }
  },

  updateNotes: async (id, notes) => {
    try {
      const res = await request(`/doctor-appointments/${id}/notes`, {
        method: 'PUT',
        body: JSON.stringify({ notes }),
      });
      return res.data;
    } catch {
      const appointments = getLocal('doctor_appointments', INITIAL_DOCTOR_APPOINTMENTS);
      const updated = appointments.map(a => a.doctorAppointmentId === Number(id) ? { ...a, consultationNotes: notes } : a);
      setLocal('doctor_appointments', updated);
      return { doctorAppointmentId: id, consultationNotes: notes };
    }
  },

  updateStatus: async (id, status) => {
    try {
      const res = await request(`/doctor-appointments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return res.data;
    } catch {
      const appointments = getLocal('doctor_appointments', INITIAL_DOCTOR_APPOINTMENTS);
      const updated = appointments.map(a => a.doctorAppointmentId === Number(id) ? { ...a, status } : a);
      setLocal('doctor_appointments', updated);
      return { doctorAppointmentId: id, status };
    }
  },

  cancelAppointment: async (id) => {
    try {
      await request(`/doctor-appointments/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      const appointments = getLocal('doctor_appointments', INITIAL_DOCTOR_APPOINTMENTS);
      setLocal('doctor_appointments', appointments.map(a => a.doctorAppointmentId === Number(id) ? { ...a, status: 'CANCELLED' } : a));
      return true;
    }
  }
};

// -------------------------------------------------------------
// Optical Service Appointments Endpoints
// -------------------------------------------------------------
export const serviceAppointmentsApi = {
  getAvailableServices: async () => {
    try {
      const res = await request('/users/services');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return ['Frame Adjustment', 'Lens Fitting', 'Repair'];
    } catch {
      return ['Frame Adjustment', 'Lens Fitting', 'Repair'];
    }
  },

  getAll: async () => {
    try {
      const res = await request('/service-appointments');
      if (Array.isArray(res.data)) return res.data;
      return getLocal('service_appointments', INITIAL_SERVICE_APPOINTMENTS);
    } catch {
      return getLocal('service_appointments', INITIAL_SERVICE_APPOINTMENTS);
    }
  },

  getByMember: async (memberId) => {
    try {
      const res = await request(`/service-appointments/member/${memberId}`);
      if (Array.isArray(res.data)) return res.data;
      return getLocal('service_appointments', INITIAL_SERVICE_APPOINTMENTS).filter(s => s.memberId === Number(memberId));
    } catch {
      return getLocal('service_appointments', INITIAL_SERVICE_APPOINTMENTS).filter(s => s.memberId === Number(memberId));
    }
  },

  book: async ({ memberId, employeeId, serviceType, appointmentDate }) => {
    try {
      const res = await request('/service-appointments/add', {
        method: 'POST',
        body: JSON.stringify({ memberId, employeeId, serviceType, appointmentDate }),
      });
      return res.data;
    } catch (err) {
      if (err.isNetworkError) {
        const list = getLocal('service_appointments', INITIAL_SERVICE_APPOINTMENTS);
        const newApp = {
          serviceAppointmentId: Date.now(),
          memberId,
          employeeId: employeeId || 6,
          serviceType,
          appointmentDate,
          serviceStatus: 'Scheduled'
        };
        setLocal('service_appointments', [...list, newApp]);
        return newApp;
      }
      throw err;
    }
  },

  complete: async (id) => {
    try {
      const res = await request(`/service-appointments/${id}/complete`, { method: 'PATCH' });
      return res.data;
    } catch {
      const list = getLocal('service_appointments', INITIAL_SERVICE_APPOINTMENTS);
      const updated = list.map(s => s.serviceAppointmentId === Number(id) ? { ...s, serviceStatus: 'Completed' } : s);
      setLocal('service_appointments', updated);
      return { serviceAppointmentId: id, serviceStatus: 'Completed' };
    }
  },

  cancel: async (id) => {
    try {
      const res = await request(`/service-appointments/${id}/cancel`, { method: 'PUT' });
      return res.data;
    } catch {
      const list = getLocal('service_appointments', INITIAL_SERVICE_APPOINTMENTS);
      const updated = list.map(s => s.serviceAppointmentId === Number(id) ? { ...s, serviceStatus: 'Cancelled' } : s);
      setLocal('service_appointments', updated);
      return { serviceAppointmentId: id, serviceStatus: 'Cancelled' };
    }
  },

  updateStatus: async (id, status) => {
    try {
      const res = await request(`/service-appointments/${id}/status?status=${encodeURIComponent(status)}`, { method: 'PATCH' });
      return res.data;
    } catch {
      const list = getLocal('service_appointments', INITIAL_SERVICE_APPOINTMENTS);
      const updated = list.map(s => s.serviceAppointmentId === Number(id) ? { ...s, serviceStatus: status } : s);
      setLocal('service_appointments', updated);
      return { serviceAppointmentId: id, serviceStatus: status };
    }
  }
};

// -------------------------------------------------------------
// Orders & Payment Slip & Confirmation Endpoints
// -------------------------------------------------------------
export const ordersApi = {
  create: async ({ orderItems, prescriptionAttached }) => {
    try {
      const res = await request('/orders', {
        method: 'POST',
        body: JSON.stringify({ orderItems, prescriptionAttached }),
      });
      return res.data;
    } catch (err) {
      if (err.isNetworkError) {
        const myOrders = getLocal('orders', INITIAL_ORDERS);
        const total = orderItems.reduce((acc, it) => acc + (it.product?.price || 100) * it.quantity, 0);
        const newOrder = {
          orderId: Date.now(),
          orderDate: new Date().toISOString(),
          totalAmount: total,
          discountAmount: 0.0,
          orderStatus: 'Processing',
          paymentStatus: 'PENDING',
          paymentSlip: null,
          prescriptionAttached: Boolean(prescriptionAttached),
          loyaltyPointsAwarded: false,
          orderItems: orderItems.map((it, idx) => ({
            orderItemId: Date.now() + idx,
            quantity: it.quantity,
            unitPrice: it.product?.price || 100,
            product: it.product
          }))
        };
        setLocal('orders', [newOrder, ...myOrders]);
        return newOrder;
      }
      throw err;
    }
  },

  getMyOrders: async () => {
    try {
      const res = await request('/orders/my-orders');
      if (Array.isArray(res.data)) return res.data;
      return getLocal('orders', INITIAL_ORDERS);
    } catch {
      return getLocal('orders', INITIAL_ORDERS);
    }
  },

  getAll: async () => {
    try {
      const res = await request('/orders');
      if (Array.isArray(res.data)) return res.data;
      return getLocal('orders', INITIAL_ORDERS);
    } catch {
      return getLocal('orders', INITIAL_ORDERS);
    }
  },

  getById: async (id) => {
    try {
      const res = await request(`/orders/${id}`);
      return res.data;
    } catch {
      const list = getLocal('orders', INITIAL_ORDERS);
      return list.find(o => o.orderId === Number(id));
    }
  },

  uploadPaymentSlip: async (orderId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await request(`/orders/${orderId}/payment-slip`, {
        method: 'POST',
        body: formData,
      });
      return res.data;
    } catch (err) {
      if (err.isNetworkError) {
        const list = getLocal('orders', INITIAL_ORDERS);
        const updated = list.map(o => o.orderId === Number(orderId) ? {
          ...o,
          paymentSlip: URL.createObjectURL(file),
          paymentStatus: 'TO_BE_CONFIRMED'
        } : o);
        setLocal('orders', updated);
        return `Payment slip uploaded successfully for order ${orderId}`;
      }
      throw err;
    }
  },

  confirmPayment: async (orderId) => {
    try {
      const res = await request(`/orders/${orderId}/confirm-payment`, { method: 'PATCH' });
      return res.data;
    } catch (err) {
      const list = getLocal('orders', INITIAL_ORDERS);
      const updated = list.map(o => o.orderId === Number(orderId) ? {
        ...o,
        paymentStatus: 'CONFIRMED',
        loyaltyPointsAwarded: true
      } : o);
      setLocal('orders', updated);
      return 'Payment confirmed and loyalty points processed successfully.';
    }
  },

  updateStatus: async (orderId, status) => {
    try {
      await request(`/orders/${orderId}/status?status=${encodeURIComponent(status)}`, { method: 'PATCH' });
      return true;
    } catch {
      const list = getLocal('orders', INITIAL_ORDERS);
      setLocal('orders', list.map(o => o.orderId === Number(orderId) ? { ...o, orderStatus: status } : o));
      return true;
    }
  }
};

// -------------------------------------------------------------
// Membership & Loyalty Rewards Endpoints
// -------------------------------------------------------------
export const memberApi = {
  getPoints: async (memberId) => {
    try {
      const res = await request(`/members/${memberId}/points`);
      return res.data.loyaltyPoints;
    } catch {
      const user = getLocal('current_user', {});
      return user?.loyaltyPoints || 0;
    }
  },

  getTotalPoints: async (memberId) => {
    try {
      const res = await request(`/members/${memberId}/total-points`);
      return res.data.totalEarnedPoints;
    } catch {
      const user = getLocal('current_user', {});
      return user?.totalEarnedPoints || 0;
    }
  },

  getTier: async (memberId) => {
    try {
      const res = await request(`/members/${memberId}/tier`);
      return res.data.tier;
    } catch {
      const user = getLocal('current_user', {});
      return user?.tier || 'Bronze';
    }
  },

  getDiscount: async (memberId) => {
    try {
      const res = await request(`/members/${memberId}/discount`);
      return res.data.discountPercentage;
    } catch {
      const user = getLocal('current_user', {});
      return user?.discountPercentage || 0.0;
    }
  },

  redeem: async (memberId, points) => {
    try {
      const res = await request(`/members/${memberId}/redeem?points=${points}`);
      return res.data.redemptionValue;
    } catch {
      // Standard demo formula: 100 points = $5.00
      return Number((points * 0.05).toFixed(2));
    }
  },

  uploadPrescription: async (memberId, filePath) => {
    try {
      const res = await request(`/members/${memberId}/prescription`, {
        method: 'PUT',
        body: JSON.stringify({ filePath }),
      });
      return res.data;
    } catch {
      const user = getLocal('current_user', {});
      setLocal('current_user', { ...user, prescriptionDocPath: filePath });
      return { message: 'Prescription reference updated.' };
    }
  }
};

// -------------------------------------------------------------
// Loyalty Tiers Endpoints
// -------------------------------------------------------------
export const loyaltyTiersApi = {
  getAll: async () => {
    try {
      const res = await request('/loyalty-tiers');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return INITIAL_LOYALTY_TIERS;
    } catch {
      return INITIAL_LOYALTY_TIERS;
    }
  },

  calculate: async (points) => {
    try {
      const res = await request(`/loyalty-tiers/calculate?points=${points}`);
      return res.data;
    } catch {
      if (points >= 3000) return INITIAL_LOYALTY_TIERS[3];
      if (points >= 1500) return INITIAL_LOYALTY_TIERS[2];
      if (points >= 500) return INITIAL_LOYALTY_TIERS[1];
      return INITIAL_LOYALTY_TIERS[0];
    }
  }
};

// -------------------------------------------------------------
// Staff, Couriers & Deliveries
// -------------------------------------------------------------
export const staffApi = {
  getEmployees: async () => {
    try {
      const res = await request('/employees');
      if (Array.isArray(res.data)) return res.data;
      return INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  },

  getCouriers: async () => {
    try {
      const res = await request('/couriers');
      if (Array.isArray(res.data)) return res.data;
      return getLocal('couriers', INITIAL_COURIERS);
    } catch {
      return getLocal('couriers', INITIAL_COURIERS);
    }
  },

  addCourier: async (courier) => {
    try {
      const res = await request('/couriers', {
        method: 'POST',
        body: JSON.stringify(courier),
      });
      return res.data;
    } catch {
      const couriers = getLocal('couriers', INITIAL_COURIERS);
      const newCourier = { ...courier, courierId: Date.now() };
      setLocal('couriers', [...couriers, newCourier]);
      return newCourier;
    }
  },

  dispatchDelivery: async (orderId, courierId) => {
    try {
      const res = await request(`/deliveries/dispatch?orderId=${orderId}&courierId=${courierId}`, { method: 'POST' });
      return res.data;
    } catch {
      const trackingNumber = `VX-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const list = getLocal('orders', INITIAL_ORDERS);
      const updated = list.map(o => o.orderId === Number(orderId) ? {
        ...o,
        orderStatus: 'Shipped',
        delivery: {
          trackingNumber,
          deliveryStatus: 'Dispatched',
          courierId,
          dispatchDate: new Date().toISOString().split('T')[0],
          estimatedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
        }
      } : o);
      setLocal('orders', updated);
      return { orderId, trackingNumber, deliveryStatus: 'Dispatched' };
    }
  },

  trackDelivery: async (orderId) => {
    try {
      const res = await request(`/deliveries/track/${orderId}`);
      return res.data;
    } catch {
      const list = getLocal('orders', INITIAL_ORDERS);
      const match = list.find(o => o.orderId === Number(orderId));
      if (match && match.delivery) {
        return `Tracking #${match.delivery.trackingNumber} - Status: ${match.delivery.deliveryStatus}`;
      }
      return 'Order packaging in optical facility.';
    }
  },

  updateDeliveryStatus: async (trackingNumber, status) => {
    try {
      await request(`/deliveries/status?trackingNumber=${encodeURIComponent(trackingNumber)}&status=${encodeURIComponent(status)}`, { method: 'PATCH' });
      return true;
    } catch {
      return true;
    }
  }
};
