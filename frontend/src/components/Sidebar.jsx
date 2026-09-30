import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  UserRoundCheck,
  Clock,
  Glasses,
  Code2,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts = {} }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={19} />,
      badge: null
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <CalendarCheck size={19} />,
      badge: counts.appointments || null
    },
    {
      id: 'doctors',
      label: 'Doctors',
      icon: <UserRoundCheck size={19} />,
      badge: counts.doctors || null
    },
    {
      id: 'schedules',
      label: 'Doctor Schedules',
      icon: <Clock size={19} />,
      badge: counts.schedules || null
    },
    {
      id: 'products',
      label: 'Eyewear & Products',
      icon: <Glasses size={19} />,
      badge: counts.products || null
    },
    {
      id: 'api-explorer',
      label: 'API Explorer',
      icon: <Code2 size={19} />,
      badge: 'DOCS'
    }
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0c1222',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1rem',
        minHeight: 'calc(100vh - 74px)',
        flexShrink: 0
      }}
    >
      {/* Navigation Links */}
      <div>
        <div style={{ padding: '0 0.75rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Clinical Operations
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%',
                  borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: isActive ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? '#fff' : 'var(--text-subtle)',
                      fontWeight: 600
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '4px' }}>
          <Building2 size={14} color="var(--accent-cyan)" />
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>Colombo Central Branch</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
          <ShieldCheck size={13} color="var(--accent-teal)" />
          <span>Role: System Admin & Optician</span>
        </div>
      </div>
    </aside>
  );
}
