import React from 'react';
import { 
  Glasses, 
  ShoppingBag, 
  User as UserIcon, 
  Stethoscope, 
  Sparkles, 
  ShieldCheck, 
  LogOut, 
  Activity,
  Layers
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onOpenCart, 
  currentUser, 
  onOpenAuth, 
  onLogout,
  backendConnected 
}) {
  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => setActiveTab('catalog')}>
          <div className="brand-icon-wrapper">
            <Glasses size={24} />
          </div>
          <div>
            <div className="brand-text-name">
              Vision<span style={{ color: '#38bdf8' }}>Express</span>
            </div>
            <div className="brand-tagline">Clinical Optics & Eyewear</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'catalog' ? 'active' : ''}`}
                onClick={() => setActiveTab('catalog')}
              >
                <Glasses size={16} />
                <span>Eyewear & Lenses</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'doctors' ? 'active' : ''}`}
                onClick={() => setActiveTab('doctors')}
              >
                <Stethoscope size={16} />
                <span>Doctors</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                <Activity size={16} />
                <span>Services</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'tryon' ? 'active' : ''}`}
                onClick={() => setActiveTab('tryon')}
              >
                <Sparkles size={16} />
                <span>Virtual Try-On</span>
              </button>
            </li>

            {currentUser && (
              <li>
                <button 
                  className={`nav-link-btn ${activeTab === 'member' ? 'active' : ''}`}
                  onClick={() => setActiveTab('member')}
                >
                  <Layers size={16} />
                  <span>Member Hub</span>
                </button>
              </li>
            )}

            {currentUser?.userType?.toLowerCase().includes('admin') && (
              <li>
                <button 
                  className={`nav-link-btn ${activeTab === 'admin' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admin')}
                >
                  <ShieldCheck size={16} />
                  <span>Admin Portal</span>
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Backend Connection Indicator */}
          <div 
            className="backend-badge" 
            title={backendConnected ? 'Connected to Spring Boot API on port 8081' : 'Backend offline - Local simulation active'}
          >
            <span 
              className="backend-pulse-dot" 
              style={{ background: backendConnected ? '#10b981' : '#f59e0b', boxShadow: backendConnected ? '0 0 8px #10b981' : '0 0 8px #f59e0b' }} 
            />
            <span>{backendConnected ? 'Spring Boot: 8081' : 'Demo Mode'}</span>
          </div>

          {/* Cart Icon Button */}
          <button 
            className="cart-icon-btn" 
            onClick={onOpenCart}
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="cart-counter">{cartCount}</span>}
          </button>

          {/* User Account Controls */}
          {currentUser ? (
            <div className="user-menu-pill" onClick={() => setActiveTab(currentUser.userType?.toLowerCase().includes('admin') ? 'admin' : 'member')}>
              <div className="user-avatar-circle">
                {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <span className="user-name-label">{currentUser.firstName} {currentUser.lastName || ''}</span>
                <span className="user-role-label">{currentUser.userType || 'Member'}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onLogout();
                }} 
                title="Logout"
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={onOpenAuth}>
              <UserIcon size={16} />
              <span>Sign In / Join</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
