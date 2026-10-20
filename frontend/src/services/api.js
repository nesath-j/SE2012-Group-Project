// Vision Express Spring Boot 8081 Integration Service - Direct SQL Database Connectivity Only

const BASE_URL = '/api';

// Remove legacy mock data keys from browser localStorage
if (typeof window !== 'undefined' && window.localStorage) {
  ['products', 'doctors', 'schedules', 'doctor_appointments', 'service_appointments', 'orders', 'couriers'].forEach(key => {
    try {
      localStorage.removeItem(`ve_${key}`);
    } catch {}
  });
}

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
    console.warn('Backend CSRF endpoint unreachable:', err);
  }

  // Check cookie immediately after endpoint response
  const cookieToken = getCsrfTokenFromCookie();
  if (cookieToken) {
    cachedCsrfToken = cookieToken;
  }
  return cachedCsrfToken;
}

// Universal fetch wrapper with credentials and CSRF
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
    if (!err.status) {
      err.isNetworkError = true;
    }
    throw err;
  }
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
export const authApi = {
  getCsrf: fetchCsrfToken,

  login: async (email, password) => {
    try {
      const freshToken = await fetchCsrfToken();
      const activeToken = getCsrfTokenFromCookie() || freshToken;

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

      await fetchCsrfToken();

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
        localStorage.setItem('ve_current_user', JSON.stringify(profile));
        return profile;
      }
      localStorage.removeItem('ve_current_user');
      return null;
    } catch {
      localStorage.removeItem('ve_current_user');
      return null;
    }
  },

  register: async ({ firstName, lastName, email, password, phone }) => {
    const res = await request('/users/register', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email: email.trim(), password, phone }),
    });
    await fetchCsrfToken();
    return res.data;
  },

  updateProfile: async (userId, { firstName, lastName, phone }) => {
    const res = await request(`/users/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ firstName, lastName, phone }),
    });
    return res.data;
  }
};

// -------------------------------------------------------------
// Products Endpoints (Direct SQL database connectivity)
// -------------------------------------------------------------
export const productsApi = {
  search: async (keyword = '') => {
    try {
      const res = await request(`/users/products/search?keyword=${encodeURIComponent(keyword)}`);
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err) {
      console.error('Error fetching products from SQL database:', err);
      return [];
    }
  },

  getAll: async () => {
    try {
      const res = await request('/products');
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      const fallback = await request('/users/products/search?keyword=');
      if (Array.isArray(fallback?.data)) return fallback.data;
      return [];
    }
  },

  add: async (product) => {
    const res = await request('/products/add', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return res.data;
  },

  update: async (id, product) => {
    const res = await request(`/products/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
    return res.data;
  },

  delete: async (id) => {
    await request(`/products/delete/${id}`, { method: 'DELETE' });
    return true;
  },

  updateStock: async (id, qty) => {
    await request(`/products/${id}/stock?qty=${qty}`, { method: 'PATCH' });
    return true;
  }
};

// -------------------------------------------------------------
// Doctor & Doctor Schedule & Appointment Endpoints
// -------------------------------------------------------------
export const doctorsApi = {
  getAll: async () => {
    try {
      const res = await request('/users/doctors');
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching doctors from SQL database:', err);
      return [];
    }
  },

  getSchedules: async (doctorId) => {
    try {
      const res = await request(`/doctor-schedules/doctor/${doctorId}/available`);
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching doctor schedules from SQL database:', err);
      return [];
    }
  },

  getAllSchedules: async () => {
    try {
      const res = await request('/doctor-schedules');
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching all schedules from SQL database:', err);
      return [];
    }
  },

  createSchedule: async (schedule) => {
    const res = await request('/doctor-schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
    return res.data;
  },

  bookAppointment: async ({ memberId, doctorId, scheduleId, appointmentDate }) => {
    const res = await request('/doctor-appointments', {
      method: 'POST',
      body: JSON.stringify({ memberId, doctorId, scheduleId, appointmentDate }),
    });
    return res.data;
  },

  getAppointmentsByDoctor: async (doctorId) => {
    try {
      const res = await request(`/doctor-appointments/doctor/${doctorId}`);
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching doctor appointments from SQL database:', err);
      return [];
    }
  },

  getAppointmentsByMember: async (memberId) => {
    try {
      const res = await request(`/doctor-appointments/member/${memberId}`);
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching member appointments from SQL database:', err);
      return [];
    }
  },

  updateNotes: async (id, notes) => {
    const res = await request(`/doctor-appointments/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await request(`/doctor-appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return res.data;
  },

  cancelAppointment: async (id) => {
    await request(`/doctor-appointments/${id}`, { method: 'DELETE' });
    return true;
  }
};

// -------------------------------------------------------------
// Optical Service Appointments Endpoints
// -------------------------------------------------------------
export const serviceAppointmentsApi = {
  getAvailableServices: async () => {
    try {
      const res = await request('/users/services');
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching optical services from SQL database:', err);
      return [];
    }
  },

  getAll: async () => {
    try {
      const res = await request('/service-appointments');
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching service appointments from SQL database:', err);
      return [];
    }
  },

  getByMember: async (memberId) => {
    try {
      const res = await request(`/service-appointments/member/${memberId}`);
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching member service appointments from SQL database:', err);
      return [];
    }
  },

  book: async ({ memberId, employeeId, serviceType, appointmentDate }) => {
    const res = await request('/service-appointments/add', {
      method: 'POST',
      body: JSON.stringify({ memberId, employeeId, serviceType, appointmentDate }),
    });
    return res.data;
  },

  complete: async (id) => {
    const res = await request(`/service-appointments/${id}/complete`, { method: 'PATCH' });
    return res.data;
  },

  cancel: async (id) => {
    const res = await request(`/service-appointments/${id}/cancel`, { method: 'PUT' });
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await request(`/service-appointments/${id}/status?status=${encodeURIComponent(status)}`, { method: 'PATCH' });
    return res.data;
  }
};

// -------------------------------------------------------------
// Orders & Payment Slip & Confirmation Endpoints
// -------------------------------------------------------------
export const ordersApi = {
  create: async ({ orderItems, prescriptionAttached }) => {
    const res = await request('/orders', {
      method: 'POST',
      body: JSON.stringify({ orderItems, prescriptionAttached }),
    });
    return res.data;
  },

  getMyOrders: async () => {
    try {
      const res = await request('/orders/my-orders');
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching my orders from SQL database:', err);
      return [];
    }
  },

  getAll: async () => {
    try {
      const res = await request('/orders');
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching all orders from SQL database:', err);
      return [];
    }
  },

  getById: async (id) => {
    const res = await request(`/orders/${id}`);
    return res.data;
  },

  uploadPaymentSlip: async (orderId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await request(`/orders/${orderId}/payment-slip`, {
      method: 'POST',
      body: formData,
    });
    return res.data;
  },

  confirmPayment: async (orderId) => {
    const res = await request(`/orders/${orderId}/confirm-payment`, { method: 'PATCH' });
    return res.data;
  },

  updateStatus: async (orderId, status) => {
    await request(`/orders/${orderId}/status?status=${encodeURIComponent(status)}`, { method: 'PATCH' });
    return true;
  }
};

// -------------------------------------------------------------
// Membership & Loyalty Rewards Endpoints
// -------------------------------------------------------------
export const memberApi = {
  getPoints: async (memberId) => {
    try {
      const res = await request(`/members/${memberId}/points`);
      return res.data?.loyaltyPoints ?? 0;
    } catch {
      return 0;
    }
  },

  getTotalPoints: async (memberId) => {
    try {
      const res = await request(`/members/${memberId}/total-points`);
      return res.data?.totalEarnedPoints ?? 0;
    } catch {
      return 0;
    }
  },

  getTier: async (memberId) => {
    try {
      const res = await request(`/members/${memberId}/tier`);
      return res.data?.tier ?? 'Bronze';
    } catch {
      return 'Bronze';
    }
  },

  getDiscount: async (memberId) => {
    try {
      const res = await request(`/members/${memberId}/discount`);
      return res.data?.discountPercentage ?? 0.0;
    } catch {
      return 0.0;
    }
  },

  redeem: async (memberId, points) => {
    const res = await request(`/members/${memberId}/redeem?points=${points}`);
    return res.data?.redemptionValue ?? 0;
  },

  uploadPrescription: async (memberId, filePath) => {
    const res = await request(`/members/${memberId}/prescription`, {
      method: 'PUT',
      body: JSON.stringify({ filePath }),
    });
    return res.data;
  }
};

// -------------------------------------------------------------
// Loyalty Tiers Endpoints
// -------------------------------------------------------------
export const loyaltyTiersApi = {
  getAll: async () => {
    try {
      const res = await request('/loyalty-tiers');
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching loyalty tiers from SQL database:', err);
      return [];
    }
  },

  calculate: async (points) => {
    const res = await request(`/loyalty-tiers/calculate?points=${points}`);
    return res.data;
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
      return [];
    } catch (err) {
      console.error('Error fetching employees from SQL database:', err);
      return [];
    }
  },

  getCouriers: async () => {
    try {
      const res = await request('/couriers');
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (err) {
      console.error('Error fetching couriers from SQL database:', err);
      return [];
    }
  },

  addCourier: async (courier) => {
    const res = await request('/couriers', {
      method: 'POST',
      body: JSON.stringify(courier),
    });
    return res.data;
  },

  dispatchDelivery: async (orderId, courierId) => {
    const res = await request(`/deliveries/dispatch?orderId=${orderId}&courierId=${courierId}`, { method: 'POST' });
    return res.data;
  },

  trackDelivery: async (orderId) => {
    const res = await request(`/deliveries/track/${orderId}`);
    return res.data;
  },

  updateDeliveryStatus: async (trackingNumber, status) => {
    await request(`/deliveries/status?trackingNumber=${encodeURIComponent(trackingNumber)}&status=${encodeURIComponent(status)}`, { method: 'PATCH' });
    return true;
  }
};
