import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProductCatalog from './components/ProductCatalog';
import CartDrawer from './components/CartDrawer';
import OrdersView from './components/OrdersView';
import DeliveryView from './components/DeliveryView';
import InventoryAdmin from './components/InventoryAdmin';
import Toast from './components/Toast';
import {
  fetchProducts,
  fetchAllOrders,
  checkBackendHealth,
  isMockModeExplicit,
  setMockModeExplicit
} from './services/api';
import { Glasses, Database, Server, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [backendOnline, setBackendOnline] = useState(false);
  const [useMock, setUseMock] = useState(isMockModeExplicit());

  // Products State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Cart State
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ve_cart') || '[]');
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Delivery Navigation Pre-fill
  const [prefilledOrderId, setPrefilledOrderId] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showNotification = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('ve_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Check backend server health
  const checkHealth = useCallback(async () => {
    const isOnline = await checkBackendHealth();
    setBackendOnline(isOnline);
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 12000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // Toggle between live backend and demo mode
  const handleToggleMock = () => {
    const nextVal = !useMock;
    setUseMock(nextVal);
    setMockModeExplicit(nextVal);
    showNotification(
      'info',
      nextVal ? 'Demo Mode Active' : 'Live API Mode Active',
      nextVal
        ? 'Using local responsive mock data for demonstration.'
        : 'Connecting directly to Spring Boot backend at http://localhost:8081.'
    );
    loadProducts();
    loadOrders();
  };

  // Load products from GET /api/products/search?keyword=
  const loadProducts = useCallback(async (keyword = '') => {
    setProductsLoading(true);
    try {
      const res = await fetchProducts(keyword);
      setProducts(res.data || []);
    } catch (err) {
      showNotification('error', 'Products Fetch Failed', err.message);
    } finally {
      setProductsLoading(false);
    }
  }, [showNotification]);

  // Load orders from GET /api/orders
  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetchAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      showNotification('error', 'Orders Fetch Failed', err.message);
    } finally {
      setOrdersLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, [loadProducts, loadOrders]);

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product.productId);
      if (existing) {
        return prev.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification('success', 'Added to Cart', `Added ${product.name} to optical cart.`);
  };

  const handleUpdateQty = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Transition after order placement
  const handleOrderPlaced = (order, targetTab) => {
    setPrefilledOrderId(order.orderId);
    setActiveTab(targetTab);
    loadOrders();
  };

  // Dispatch transition from Orders View
  const handleDispatchOrder = (order) => {
    setPrefilledOrderId(order.orderId);
    setActiveTab('delivery');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        backendOnline={backendOnline}
        useMock={useMock}
        onToggleMock={handleToggleMock}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {activeTab === 'catalog' && (
          <ProductCatalog
            products={products}
            loading={productsLoading}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            onSearch={(kw) => loadProducts(kw)}
            onAddToCart={handleAddToCart}
            onRefresh={() => loadProducts(searchKeyword)}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            orders={orders}
            loading={ordersLoading}
            onRefresh={loadOrders}
            onDispatchOrder={handleDispatchOrder}
            onTrackOrder={(order) => {
              setPrefilledOrderId(order.orderId);
              setActiveTab('delivery');
            }}
            onNotify={showNotification}
          />
        )}

        {activeTab === 'delivery' && (
          <DeliveryView
            orders={orders}
            prefilledOrderId={prefilledOrderId}
            onNotify={showNotification}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryAdmin
            products={products}
            loading={productsLoading}
            onRefresh={() => loadProducts(searchKeyword)}
            onNotify={showNotification}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        onNotify={showNotification}
      />

      {/* Floating Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer style={{
        background: 'rgba(11, 15, 25, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '36px 24px',
        color: '#64748b',
        fontSize: '0.85rem'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Glasses size={18} />
            </div>
            <div>
              <strong style={{ color: '#f8fafc' }}>VisionExpress Optical Portal</strong>
              <div style={{ fontSize: '0.75rem' }}>OOAD Project SE2012 Group Project Frontend</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server size={14} color="#38bdf8" /> Backend: Spring Boot (:8081)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={14} color="#34d399" /> DB: MySQL (VisionExpress)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#a78bfa" /> Vite React Client (:5173)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
