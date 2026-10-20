import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Glasses,
  ShoppingBag,
  Calendar,
  Wrench,
  Award,
  Package,
  ShieldCheck,
  Stethoscope,
  User,
  LogOut,
  Menu,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const {
    user,
    role,
    isStaff,
    isMember,
    isDoctor,
    isEmployee,
    isManager,
    isAdmin,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    cartCount,
    setIsCartOpen,
    isBackendOnline
  } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Generate dynamic navigation items based on the active role and backend limitations
  const getNavItems = () => {
    if (isDoctor) {
      return [
        { id: 'staff', label: 'Doctor Consultation Desk', icon: Stethoscope, highlight: true },
        { id: 'doctors', label: 'Doctor Clinic & Directory', icon: Calendar },
        { id: 'shop', label: 'Eyewear Catalog', icon: Glasses },
      ];
    }
    if (isEmployee) {
      return [
        { id: 'staff', label: 'Technician & Dispatch Desk', icon: Wrench, highlight: true },
        { id: 'services', label: 'Optical Services', icon: Layers },
        { id: 'shop', label: 'Eyewear Catalog', icon: Glasses },
      ];
    }
    if (isManager) {
      return [
        { id: 'staff', label: 'Manager Operations Desk', icon: ShieldCheck, highlight: true },
        { id: 'services', label: 'Technician Services', icon: Wrench },
        { id: 'shop', label: 'Eyewear Catalog', icon: Glasses },
      ];
    }
    if (isAdmin) {
      return [
        { id: 'staff', label: 'Administrator Command', icon: ShieldCheck, highlight: true },
        { id: 'doctors', label: 'Clinical Schedules', icon: Calendar },
        { id: 'services', label: 'Optical Services', icon: Wrench },
        { id: 'shop', label: 'Product Catalog', icon: Glasses },
      ];
    }
    if (isMember) {
      return [
        { id: 'shop', label: 'Eyewear & Shop', icon: Glasses },
        { id: 'doctors', label: 'Doctor Clinic', icon: Calendar },
        { id: 'services', label: 'Optical Services', icon: Wrench },
        { id: 'rewards', label: 'Loyalty Rewards', icon: Award },
        { id: 'orders', label: 'My Orders', icon: Package },
      ];
    }
    // Guest (Unauthenticated)
    return [
      { id: 'shop', label: 'Eyewear & Shop', icon: Glasses },
      { id: 'doctors', label: 'Doctor Clinic', icon: Calendar },
      { id: 'services', label: 'Optical Services', icon: Wrench },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  const getRoleBadgeStyle = (userRole) => {
    switch (userRole) {
      case 'ADMIN':
        return { backgroundColor: '#ffe4e6', color: '#e11d48', border: '1px solid #fecdd3' };
      case 'MANAGER':
        return { backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' };
      case 'DOCTOR':
        return { backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd' };
      case 'EMPLOYEE':
        return { backgroundColor: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' };
      case 'MEMBER':
        return { backgroundColor: '#f3e8ff', color: '#9333ea', border: '1px solid #e9d5ff' };
      default:
        return { backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' };
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
    }}>
      {/* Top micro bar: Backend Connection status and Authenticated Session State */}
      <div style={{
        background: '#090e17',
        color: '#94a3b8',
        fontSize: '0.785rem',
        padding: '0.4rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isBackendOnline ? '#10b981' : '#f59e0b',
              boxShadow: isBackendOnline ? '0 0 8px #10b981' : 'none',
            }} />
            <strong style={{ color: '#e2e8f0' }}>Backend (Port 8081):</strong>
            <span style={{ color: isBackendOnline ? '#34d399' : '#fbbf24' }}>
              {isBackendOnline ? 'Live & Connected' : 'Connecting...'}
            </span>
          </span>
          <span style={{ color: '#334155' }}>|</span>
          <span>Vision Express Role Security System</span>
        </div>

        {/* Real User Status Info (Read-only, strictly authentic) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ color: '#64748b' }}>Signed in:</span>
              <strong style={{ color: '#f8fafc' }}>{user.firstName} {user.lastName}</strong>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                ...getRoleBadgeStyle(role)
              }}>
                {role}
              </span>
            </div>
          ) : (
            <span style={{ color: '#64748b' }}>
              Guest Mode • Browse Eyewear & Clinic Directory
            </span>
          )}
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.5rem',
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('shop')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
          }}>
            <Glasses size={24} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              lineHeight: 1.1,
            }}>
              VISION<span style={{ color: '#0284c7' }}>EXPRESS</span>
            </div>
            <div style={{
              fontSize: '0.675rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: '#64748b',
              textTransform: 'uppercase',
            }}>
              Precision Eye Care & Luxury
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.25rem',
        }} className="desktop-nav">
          <style>{`
            @media (min-width: 900px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 0.95rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0284c7' : item.highlight ? '#0369a1' : '#475569',
                  backgroundColor: isActive ? '#e0f2fe' : item.highlight ? '#f0f9ff' : 'transparent',
                  border: item.highlight ? '1px dashed #bae6fd' : 'none',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span style={{
                    fontSize: '0.65rem',
                    background: '#0284c7',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '1px 5px',
                    fontWeight: 700
                  }}>
                    Staff Area
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons: Cart & Profile / Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Shopping Cart button - Only shown for Customers (Members or Guests) */}
          {(!user || isMember) && (
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                position: 'relative',
                background: '#f1f5f9',
                color: '#0f172a',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                transition: 'all 0.15s ease',
              }}
              title="View Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)',
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Login */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isStaff
                    ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                    : 'linear-gradient(135deg, #9333ea, #7e22ce)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}>
                  {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div style={{ fontSize: '0.675rem', color: '#64748b' }}>
                    {user.role}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: 'none',
                }}
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '9999px' }}
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '9999px' }}
              >
                <span>Register</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-toggle"
            style={{
              padding: '0.5rem',
              color: '#0f172a',
              display: 'inline-flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
            }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.925rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0284c7' : '#1e293b',
                  backgroundColor: isActive ? '#f0f9ff' : 'transparent',
                  textAlign: 'left',
                  border: 'none',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
