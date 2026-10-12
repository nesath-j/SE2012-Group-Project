import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck2,
  Truck,
  Users2,
  ShoppingBag,
  Terminal,
  Activity,
  ChevronRight
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, stats } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'appointments',
      label: 'Service Appointments',
      icon: CalendarCheck2,
      badge: stats.scheduledAppointments ? `${stats.scheduledAppointments} active` : null,
      badgeColor: 'badge-cyan',
    },
    {
      id: 'couriers',
      label: 'Courier Logistics',
      icon: Truck,
      badge: stats.couriersCount ? `${stats.couriersCount}` : null,
    },
    {
      id: 'employees',
      label: 'Clinic Staff',
      icon: Users2,
      badge: stats.employeesCount ? `${stats.employeesCount}` : null,
    },
    {
      id: 'products',
      label: 'Eyewear & Products',
      icon: ShoppingBag,
      badge: null,
    },
    {
      id: 'api-explorer',
      label: 'REST API Console',
      icon: Terminal,
      badge: 'Live',
      badgeColor: 'badge-purple',
    },
  ];

  return (
    <aside
      style={{
        width: '270px',
        borderRight: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1rem',
        flexShrink: 0,
      }}
    >
      <div>
        <div style={{ padding: '0 0.75rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Main Navigation
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.15), rgba(99, 102, 241, 0.05))'
                    : 'transparent',
                  color: isActive ? 'var(--accent-cyan-light)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                }}
                className="sidebar-item"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon
                    size={18}
                    color={isActive ? 'var(--accent-cyan)' : 'currentColor'}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span>{item.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.badge && (
                    <span
                      className={`badge ${item.badgeColor || 'badge-cyan'}`}
                      style={{ fontSize: '0.6875rem', padding: '1px 6px' }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={14} color="var(--accent-cyan)" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System info footer card */}
      <div
        className="glass-card"
        style={{
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Activity size={14} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            System Architecture
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.4 }}>
          Spring Boot 4.x Backend (Port 8081) + React 18 &amp; Vite (Port 5173).
        </p>
      </div>

      <style>{`
        .sidebar-item:hover {
          background: rgba(148, 163, 184, 0.08) !important;
          color: var(--text-main) !important;
        }
      `}</style>
    </aside>
  );
};
