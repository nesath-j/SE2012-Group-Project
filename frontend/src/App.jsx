import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCatalog from './components/ProductCatalog';
import DoctorDirectory from './components/DoctorDirectory';
import OpticalServices from './components/OpticalServices';
import VirtualTryOn from './components/VirtualTryOn';
import MemberDashboard from './components/MemberDashboard';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import { checkBackendConnection, DEFAULT_CATALOG } from './api/api';
import './App.css';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth state (persisted in localStorage for convenience)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vx_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('vx_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Backend connection status
  const [backendConnected, setBackendConnected] = useState(false);

  // Ping backend on mount and periodically
  useEffect(() => {
    let isMounted = true;
    async function verifyBackend() {
      const isUp = await checkBackendConnection();
      if (isMounted) {
        setBackendConnected(isUp);
      }
    }
    verifyBackend();
    const interval = setInterval(verifyBackend, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('vx_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Save user to local storage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('vx_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('vx_user');
      }
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [currentUser]);

  // Toast notification trigger
  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id && JSON.stringify(item.configuredLens) === JSON.stringify(product.configuredLens));
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity = (updated[existingIdx].quantity || 1) + 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (index, newQty) => {
    setCart(prev => {
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast('info', 'Item Removed', 'Product removed from your optical bag.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.userType?.toLowerCase().includes('admin')) {
      setActiveTab('admin');
    } else {
      setActiveTab('member');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('catalog');
    showToast('info', 'Signed Out', 'You have been signed out.');
  };

  // Hero search handler
  const handleHeroSearch = (term) => {
    setSearchQuery(term);
    setActiveTab('catalog');
    // Smooth scroll down to catalog if on hero
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        backendConnected={backendConnected}
      />

      {/* Main View Area */}
      <main style={{ flex: 1 }}>
        {/* Render HeroBanner on main tabs */}
        {activeTab === 'catalog' && (
          <HeroBanner
            onSearch={handleHeroSearch}
            onExplore={() => {
              setSearchQuery('');
              window.scrollTo({ top: 520, behavior: 'smooth' });
            }}
            onBookAppointment={() => setActiveTab('doctors')}
            onLaunchTryOn={() => setActiveTab('tryon')}
          />
        )}

        {/* Tab 1: Product Catalog (GET /api/users/products/search & POST /api/products/add) */}
        {activeTab === 'catalog' && (
          <ProductCatalog
            onAddToCart={handleAddToCart}
            currentUser={currentUser}
            onOpenAddProduct={() => setActiveTab('admin')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNotify={showToast}
          />
        )}

        {/* Tab 2: Doctor Directory (GET /api/users/doctors) */}
        {activeTab === 'doctors' && (
          <DoctorDirectory
            onNotify={showToast}
            currentUser={currentUser}
          />
        )}

        {/* Tab 3: Optical Services (GET /api/users/services) */}
        {activeTab === 'services' && (
          <OpticalServices
            onSelectService={(service) => {
              setActiveTab('doctors');
            }}
            onNotify={showToast}
          />
        )}

        {/* Tab 4: Virtual 3D Try-On */}
        {activeTab === 'tryon' && (
          <VirtualTryOn
            onAddToCart={handleAddToCart}
            onNotify={showToast}
          />
        )}

        {/* Tab 5: Member Dashboard (PUT /api/users/profile/{userId}, Loyalty, Prescriptions) */}
        {activeTab === 'member' && (
          currentUser ? (
            <MemberDashboard
              currentUser={currentUser}
              onUpdateUser={setCurrentUser}
              onNotify={showToast}
            />
          ) : (
            <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
              <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '40px' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Member Sign In Required</h3>
                <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '0.9rem' }}>
                  Please sign in or create an account to view your prescriptions, loyalty points, and order history.
                </p>
                <button className="btn-primary" onClick={() => setIsAuthOpen(true)}>
                  Sign In / Create Account
                </button>
              </div>
            </div>
          )
        )}

        {/* Tab 6: Admin Portal (POST /api/admin/users/{userId}/manage, POST /api/admin/payment-config, POST /api/products/add) */}
        {activeTab === 'admin' && (
          <AdminDashboard
            onNotify={showToast}
            onProductAdded={(newProd) => {
              showToast('success', 'Catalog Updated', `${newProd.name} is now visible in the catalog.`);
            }}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onNotify={showToast}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onNotify={showToast}
      />

      {/* Global Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
