import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Glasses,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  RefreshCw,
  Search,
  PlusCircle,
  Database
} from 'lucide-react';

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    backendOnline,
    checkingBackend,
    pingBackend,
    searchQuery,
    setSearchQuery,
    setActiveTab
  } = useApp();

  return (
    <header
      style={{
        height: '70px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
      }}
    >
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)',
            }}
          >
            <Glasses size={22} color="#ffffff" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                Vision<span style={{ color: 'var(--accent-cyan)' }}>Express</span>
              </span>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: 'rgba(14, 165, 233, 0.15)',
                  color: 'var(--accent-cyan-light)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid rgba(14, 165, 233, 0.25)',
                }}
              >
                PRO
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: 0 }}>
              Optical Practice Management
            </p>
          </div>
        </div>
      </div>

      {/* Global Quick Search */}
      <div style={{ flex: 1, maxWidth: '420px', margin: '0 2rem' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
            }}
          />
          <input
            id="global-search-input"
            type="text"
            className="form-control"
            placeholder="Search appointments, couriers, staff, or eyewear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '38px',
              height: '38px',
              borderRadius: '20px',
              fontSize: '0.8125rem',
            }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Backend Connectivity Status Badge */}
        <div
          id="backend-status-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: backendOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${backendOnline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
          title={
            backendOnline
              ? 'Connected to Spring Boot REST API at localhost:8081'
              : 'Spring Boot offline. Active Demo/Mock state enabled with persistent storage.'
          }
        >
          <span
            className={`pulse-indicator ${backendOnline ? 'pulse-green' : 'pulse-amber'}`}
          />
          <span style={{ color: backendOnline ? 'var(--color-success)' : 'var(--color-warning)' }}>
            {backendOnline ? 'API Connected (8081)' : 'Demo / Offline Store'}
          </span>
          <button
            id="ping-backend-btn"
            onClick={pingBackend}
            disabled={checkingBackend}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              padding: '2px',
            }}
            title="Refresh backend connection"
          >
            <RefreshCw
              size={12}
              style={{
                animation: checkingBackend ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </button>
        </div>

        {/* Quick Action: New Appointment */}
        <button
          id="nav-quick-book-btn"
          className="btn btn-primary btn-sm"
          onClick={() => setActiveTab('appointments')}
        >
          <PlusCircle size={15} />
          <span>Book Service</span>
        </button>

        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="btn btn-secondary btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={17} color="#fbbf24" />
          ) : (
            <Moon size={17} color="#6366f1" />
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};
