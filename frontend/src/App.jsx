import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';

import HomeShop from './pages/HomeShop';
import DoctorAppointments from './pages/DoctorAppointments';
import OpticalServices from './pages/OpticalServices';
import MembershipRewards from './pages/MembershipRewards';
import MyOrders from './pages/MyOrders';
import StaffPortal from './pages/StaffPortal';

function MainLayout() {
  const { user, isStaff, isMember } = useAuth();
  const [activeTab, setActiveTab] = useState('shop');

  // If user logs out while in protected tab, bounce back to public shop
  React.useEffect(() => {
    if (!user) {
      if (activeTab === 'orders' || activeTab === 'rewards' || activeTab === 'staff') {
        setActiveTab('shop');
      }
    } else if (isStaff && (activeTab === 'orders' || activeTab === 'rewards')) {
      setActiveTab('staff');
    }
  }, [user, isStaff, activeTab]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Sticky Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dynamic View Content */}
      <main style={{ flex: 1, width: '100%' }}>
        {activeTab === 'shop' && (
          <HomeShop onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'doctors' && (
          <DoctorAppointments onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'services' && (
          <OpticalServices onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'rewards' && (
          <MembershipRewards />
        )}
        {activeTab === 'orders' && (
          <MyOrders onNavigateShop={() => setActiveTab('shop')} />
        )}
        {activeTab === 'staff' && (
          <StaffPortal onNavigateTab={setActiveTab} />
        )}
      </main>

      {/* Global Modals & Slide-in Drawers */}
      <CartDrawer onNavigateOrders={() => setActiveTab('orders')} />
      <AuthModal />
      <Toast />

      {/* Optical Retail Footer */}
      <Footer onNavigateTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
