import React from 'react';

export default function StatCard({ title, value, icon, change, accentColor = 'var(--accent-cyan)' }) {
  return (
    <div
      className="glass-panel interactive-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Accent Strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: accentColor
        }}
      />

      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {title}
        </span>
        <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem', color: '#fff', letterSpacing: '-0.03em' }}>
          {value}
        </div>
        {change && (
          <div style={{ fontSize: '0.775rem', marginTop: '0.35rem', color: 'var(--accent-teal)' }}>
            {change}
          </div>
        )}
      </div>

      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `rgba(6, 182, 212, 0.12)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accentColor,
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        {icon}
      </div>
    </div>
  );
}
