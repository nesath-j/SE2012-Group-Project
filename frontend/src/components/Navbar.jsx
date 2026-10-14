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
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Radio,
  Sparkles
} from 'lucide-react';
import { DEMO_PRESET_USERS } from '../services/mockData';

export default function Navbar({ activeTab, setActiveTab }) {
  const {
    user,
    role,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    switchDemoUser,
    cartCount,
    setIsCartOpen,
    isBackendOnline
  } = useAuth();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'shop', label: 'Eyewear & Shop', icon: Glasses },
    { id: 'doctors', label: 'Doctor Clinic', icon: Calendar },
    { id: 'services', label: 'Optical Services', icon: Wrench },
    { id: 'rewards', label: 'Loyalty Rewards', icon: Award },
    { id: 'orders', label: 'My Orders', icon: Package, authOnly: true },
    { id: 'staff', label: 'Staff Workspace', icon: ShieldCheck, highlight: true },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
    }}>
      {/* Top micro bar: Spring Boot 8081 Status + Quick Role Switcher */}
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
            <strong style={{ color: '#e2e8f0' }}>Spring Boot (Port 8081):</strong>
            <span style={{ color: isBackendOnline ? '#34d399' : '#fbbf24' }}>
              {isBackendOnline ? 'Live & Connected' : 'Ready (Auto-sync Enabled)'}
            </span>
          </span>
          <span style={{ color: '#334155' }}>|</span>
          <span style={{ display: 'none', md: 'inline' }}>
            Vision Express Central Management System
          </span>
        </div>

        {/* Instant Role Previewer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
          <span style={{ color: '#64748b' }}>Current Persona:</span>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '0.2rem 0.55rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
              }}
            >
              <span style={{
                color: role === 'ADMIN' ? '#f43f5e' : role === 'DOCTOR' ? '#0ea5e9' : role === 'EMPLOYEE' ? '#10b981' : '#f59e0b'
              }}>●</span>
              {user ? `${user.firstName} (${role})` : 'Guest'}
              <ChevronDown size={12} />
            </button>

            {isRoleDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  borderRadius: '10px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                  border: '1px solid #e2e8f0',
                  width: '260px',
                  padding: '0.5rem',
                  zIndex: 2000,
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', padding: '0.4rem 0.6rem', textTransform: 'uppercase' }}>
                  Switch Test Role
                </div>
                {DEMO_PRESET_USERS.map((preset) => (
                  <button
                    key={preset.userId}
                    onClick={() => {
                      switchDemoUser(preset);
                      setIsRoleDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.6rem',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontSize: '0.825rem',
                      color: user?.email === preset.email ? '#0284c7' : '#1e293b',
                      backgroundColor: user?.email === preset.email ? '#f0f9ff' : 'transparent',
                      fontWeight: user?.email === preset.email ? 700 : 500,
                      border: 'none',
                    }}
                  >
                    <div>
                      <div>{preset.firstName} {preset.lastName}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{preset.email}</div>
                    </div>
                    <span className={`badge badge-${preset.role === 'ADMIN' ? 'rose' : preset.role === 'DOCTOR' ? 'primary' : preset.role === 'EMPLOYEE' ? 'emerald' : 'amber'}`}>
                      {preset.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
                    Staff
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons: Cart & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Shopping Cart button */}
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

          {/* User Profile / Login */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => handleNavClick('rewards')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}>
                  {user.firstName[0]}
                </div>
                <div style={{ textAlign: 'left', display: 'none', md: 'block' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                    {user.firstName}
                  </div>
                  <div style={{ fontSize: '0.675rem', color: '#64748b' }}>
                    {user.role}
                  </div>
                </div>
              </button>

              <button
                onClick={logout}
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: '9999px' }}
            >
              <User size={16} />
              <span>Log In</span>
            </button>
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
