import React, { useState } from 'react';
import { Eye, Activity, RefreshCw, PlusCircle, CheckCircle, AlertTriangle, Layers } from 'lucide-react';
import { setLiveMode, getLiveMode } from '../api/visionExpressApi';

export default function Navbar({ isBackendOnline, checkingHealth, onRefreshHealth, onOpenBookModal }) {
  const [liveToggled, setLiveToggled] = useState(getLiveMode());

  const handleToggleMode = () => {
    const next = !liveToggled;
    setLiveToggled(next);
    setLiveMode(next);
  };

  return (
    <header
      style={{
        height: '74px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'rgba(10, 15, 29, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)'
          }}
        >
          <Eye size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              VISION EXPRESS
            </span>
            <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', borderRadius: '4px', border: '1px solid rgba(6, 182, 212, 0.3)', fontWeight: 700 }}>
              v2.0
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            Clinical Appointments & Eyewear System
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Backend Connectivity Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: isBackendOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${isBackendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            fontSize: '0.8rem',
            fontWeight: 500
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isBackendOnline ? '#10b981' : '#f59e0b',
              boxShadow: isBackendOnline ? '0 0 10px #10b981' : '0 0 10px #f59e0b'
            }}
          />
          <span style={{ color: isBackendOnline ? '#6ee7b7' : '#fcd34d' }}>
            {checkingHealth ? 'Checking Backend...' : isBackendOnline ? 'Spring Boot: 8081 Active' : 'Standalone Demo Mode'}
          </span>
          <button
            onClick={onRefreshHealth}
            disabled={checkingHealth}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              opacity: checkingHealth ? 0.5 : 0.8
            }}
            title="Ping Spring Boot Backend"
          >
            <RefreshCw size={12} className={checkingHealth ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Quick Book Appointment Button */}
        <button
          onClick={onOpenBookModal}
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
        >
          <PlusCircle size={16} />
          <span>Book Appointment</span>
        </button>
      </div>
    </header>
  );
}
