import React from 'react';
import { Glasses, ShoppingBag, Package, Truck, Layers, Wifi, WifiOff, Sparkles } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  backendOnline,
  useMock,
  onToggleMock
}) {
  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('catalog')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
          }}>
            <Glasses size={24} color="#ffffff" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.3rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #f8fafc, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              VisionExpress
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'rgba(14, 165, 233, 0.2)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                letterSpacing: '0.05em'
              }}>PRO</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '0.02em' }}>
              Optical Suite & Order Care
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '5px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              background: activeTab === 'catalog' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'catalog' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'catalog' ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none'
            }}
          >
            <ShoppingBag size={17} />
            <span>Store Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              background: activeTab === 'orders' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'orders' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'orders' ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none'
            }}
          >
            <Package size={17} />
            <span>Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              background: activeTab === 'delivery' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'delivery' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'delivery' ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none'
            }}
          >
            <Truck size={17} />
            <span>Delivery & Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              background: activeTab === 'inventory' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'inventory' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'inventory' ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none'
            }}
          >
            <Layers size={17} />
            <span>Inventory Admin</span>
          </button>
        </nav>

        {/* Right side: Backend status indicator & Cart Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Server status pill */}
          <div
            onClick={onToggleMock}
            title={backendOnline ? "Spring Boot backend running on :8081 (Click to force demo mode)" : "Backend offline - running in demo mode (Click to retry connection)"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: backendOnline && !useMock ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: `1px solid ${backendOnline && !useMock ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              color: backendOnline && !useMock ? '#34d399' : '#fbbf24',
              transition: 'all 0.2s'
            }}
          >
            {backendOnline && !useMock ? (
              <>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span>API :8081 Active</span>
              </>
            ) : (
              <>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
                <span>{useMock ? 'Demo Mode' : 'Demo / Standby'}</span>
              </>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(99, 102, 241, 0.15))',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              padding: '10px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span style={{
                background: 'var(--accent-gradient)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                minWidth: '20px',
                height: '20px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 5px'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
