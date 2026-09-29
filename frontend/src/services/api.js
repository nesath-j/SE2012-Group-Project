import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_DELIVERIES } from '../data/mockData';

// API base URL - uses relative path so Vite proxy forwards to http://localhost:8081 without CORS issues
const API_BASE = '';


// Local storage keys for offline/demo mode state persistence
const STORAGE_KEYS = {
  PRODUCTS: 've_products',
  ORDERS: 've_orders',
  DELIVERIES: 've_deliveries',
  USE_MOCK: 've_use_mock_mode'
};

// Initialize localStorage with mock data if not already present
function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DELIVERIES)) {
    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(INITIAL_DELIVERIES));
  }
}
initLocalStorage();

// Helper to check backend health
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    // Attempt to ping orders or search endpoint
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res.status >= 200 && res.status < 500;
  } catch {
    return false;
  }
}

export function isMockModeExplicit() {
  return localStorage.getItem(STORAGE_KEYS.USE_MOCK) === 'true';
}

export function setMockModeExplicit(val) {
  localStorage.setItem(STORAGE_KEYS.USE_MOCK, val ? 'true' : 'false');
}

// -------------------------------------------------------------
// PRODUCT ENDPOINTS (/api/products)
// -------------------------------------------------------------

// GET /api/products/search?keyword=
export async function fetchProducts(keyword = '') {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/products/search?keyword=${encodeURIComponent(keyword)}`);
      if (res.ok) {
        const data = await res.json();
        // If backend returned results (or empty list if empty db), return it
        return { data, source: 'backend' };
      }
    } catch {
      // Backend unavailable; silently fall back to mock
    }
  }

  // Fallback to local storage mock data
  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  const filtered = keyword.trim() === ''
    ? localList
    : localList.filter(p => p.name?.toLowerCase().includes(keyword.toLowerCase()) || p.category?.toLowerCase().includes(keyword.toLowerCase()));
  return { data: filtered, source: 'mock' };
}

// POST /api/products/add
export async function createProduct(productData) {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const data = await res.json();
        return { data, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  // Local storage fallback
  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  const newProduct = {
    ...productData,
    productId: Date.now(),
    price: Number(productData.price),
    stockQuantity: Number(productData.stockQuantity)
  };
  localList.unshift(newProduct);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(localList));
  return { data: newProduct, source: 'mock' };
}

// PUT /api/products/update/{id}
export async function updateProduct(id, productData) {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/products/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const data = await res.json();
        return { data, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  // Local storage fallback
  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  const index = localList.findIndex(p => String(p.productId) === String(id));
  if (index !== -1) {
    localList[index] = {
      ...localList[index],
      ...productData,
      productId: Number(id),
      price: Number(productData.price),
      stockQuantity: Number(productData.stockQuantity)
    };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(localList));
    return { data: localList[index], source: 'mock' };
  }
  throw new Error(`Product ID ${id} not found`);
}

// DELETE /api/products/delete/{id}
export async function deleteProduct(id) {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/products/delete/${id}`, {
        method: 'DELETE'
      });
      if (res.ok || res.status === 204) {
        return { success: true, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  // Local storage fallback
  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  const updatedList = localList.filter(p => String(p.productId) !== String(id));
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedList));
  return { success: true, source: 'mock' };
}

// PATCH /api/products/{id}/stock?qty={qty}
export async function updateStock(id, qty) {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}/stock?qty=${Number(qty)}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        return { success: true, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  // Local storage fallback
  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  const index = localList.findIndex(p => String(p.productId) === String(id));
  if (index !== -1) {
    localList[index].stockQuantity = Number(qty);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(localList));
    return { success: true, source: 'mock' };
  }
  throw new Error(`Product ${id} not found`);
}

// -------------------------------------------------------------
// ORDER ENDPOINTS (/api/orders)
// -------------------------------------------------------------

// POST /api/orders
export async function createOrder(orderData) {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        const data = await res.json();
        return { data, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  // Local storage fallback
  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  const newOrder = {
    ...orderData,
    orderId: Math.floor(100 + Math.random() * 900),
    orderDate: new Date().toISOString(),
    orderStatus: orderData.orderStatus || 'Pending',
    totalAmount: Number(orderData.totalAmount || 0),
    discountAmount: Number(orderData.discountAmount || 0),
    prescriptionAttached: Boolean(orderData.prescriptionAttached),
    orderItems: (orderData.orderItems || []).map((item, idx) => ({
      ...item,
      orderItemId: idx + 1
    }))
  };
  localList.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(localList));
  return { data: newOrder, source: 'mock' };
}

// GET /api/orders
export async function fetchAllOrders() {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/orders`);
      if (res.ok) {
        const data = await res.json();
        return { data, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  return { data: localList, source: 'mock' };
}

// GET /api/orders/{id}
export async function fetchOrderById(id) {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        return { data, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  const found = localList.find(o => String(o.orderId) === String(id));
  if (found) {
    return { data: found, source: 'mock' };
  }
  throw new Error(`Order #${id} not found`);
}

// PATCH /api/orders/{id}/status?status=
export async function updateOrderStatus(id, status) {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}/status?status=${encodeURIComponent(status)}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        return { success: true, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  const index = localList.findIndex(o => String(o.orderId) === String(id));
  if (index !== -1) {
    localList[index].orderStatus = status;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(localList));
    return { success: true, source: 'mock' };
  }
  throw new Error(`Order #${id} not found`);
}

// PATCH /api/orders/{id}/discount?discount=
export async function applyOrderDiscount(id, discount) {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}/discount?discount=${Number(discount)}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const data = await res.json();
        return { data, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  const index = localList.findIndex(o => String(o.orderId) === String(id));
  if (index !== -1) {
    localList[index].discountAmount = Number(discount);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(localList));
    return { data: localList[index], source: 'mock' };
  }
  throw new Error(`Order #${id} not found`);
}

// -------------------------------------------------------------
// DELIVERY ENDPOINTS (/api/deliveries)
// -------------------------------------------------------------

// POST /api/deliveries/dispatch?orderId={orderId}&courierId={courierId}
export async function dispatchDelivery(orderId, courierId) {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/deliveries/dispatch?orderId=${orderId}&courierId=${courierId}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        return { data, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERIES) || '[]');
  const trackingNo = `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const now = new Date();
  const estDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const newDelivery = {
    deliveryId: Date.now(),
    orderId: Number(orderId),
    courierId: Number(courierId),
    trackingNo,
    deliveryStatus: 'DISPATCHED',
    dispatchDate: now.toISOString(),
    estimatedDeliveryDate: estDate.toISOString()
  };

  localList.unshift(newDelivery);
  localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(localList));

  // Also update corresponding order status if in local orders
  try {
    await updateOrderStatus(orderId, 'Dispatched');
  } catch {
    // Ignore
  }

  return { data: newDelivery, source: 'mock' };
}

// GET /api/deliveries/track/{orderId}
export async function trackDelivery(orderId) {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/deliveries/track/${orderId}`);
      if (res.ok) {
        const text = await res.text();
        return { data: text, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERIES) || '[]');
  const found = localList.find(d => String(d.orderId) === String(orderId));
  if (found) {
    const text = `Tracking No: ${found.trackingNo} | Status: ${found.deliveryStatus} | Estimated Delivery: ${found.estimatedDeliveryDate ? new Date(found.estimatedDeliveryDate).toLocaleDateString() : 'N/A'}`;
    return { data: text, deliveryObj: found, source: 'mock' };
  }
  throw new Error(`No delivery found for Order #${orderId}`);
}

// PATCH /api/deliveries/status?trackingNumber={trackingNumber}&status={status}
export async function updateDeliveryStatus(trackingNumber, status) {
  if (!isMockModeExplicit()) {
    try {
      const res = await fetch(`${API_BASE}/api/deliveries/status?trackingNumber=${encodeURIComponent(trackingNumber)}&status=${encodeURIComponent(status)}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        return { success: true, source: 'backend' };
      }
    } catch {
      // Fallback
    }
  }

  const localList = JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERIES) || '[]');
  const index = localList.findIndex(d => d.trackingNo === trackingNumber);
  if (index !== -1) {
    localList[index].deliveryStatus = status;
    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(localList));
    return { success: true, source: 'mock' };
  }
  throw new Error(`Tracking Number ${trackingNumber} not found`);
}

// Helper to get all local deliveries for the delivery dashboard
export function getStoredDeliveries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.DELIVERIES) || '[]');
}
