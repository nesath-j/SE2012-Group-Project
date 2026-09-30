import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { usersApi } from '../api/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, onNotify }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    userType: 'Member'
  });

  if (!isOpen) return null;

  // Handle Login via POST /api/users/login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await usersApi.login(loginEmail, loginPassword);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onNotify('success', 'Welcome Back', `Logged in as ${res.user.firstName || res.user.email} (${res.user.userType || 'Member'}).`);
        onClose();
      }
    } catch (err) {
      onNotify('error', 'Login Failed', err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Registration via POST /api/users/register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await usersApi.register(registerData);
      if (res.success) {
        onNotify('success', 'Registration Complete', res.message || 'Account created successfully!');
        if (res.user) {
          onLoginSuccess(res.user);
        }
        onClose();
      }
    } catch (err) {
      onNotify('error', 'Registration Error', err.message || 'Could not register account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Logins
  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setLoginEmail('admin@visionexpress.com');
      setLoginPassword('admin123');
    } else {
      setLoginEmail('member@visionexpress.com');
      setLoginPassword('member123');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-card" 
        style={{ maxWidth: '460px', width: '100%', padding: '32px', background: '#0b1120', position: 'relative' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
          <button 
            className={`category-tab-btn ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthMode('login')}
            style={{ flex: 1, textAlign: 'center' }}
          >
            Sign In
          </button>
          <button 
            className={`category-tab-btn ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => setAuthMode('register')}
            style={{ flex: 1, textAlign: 'center' }}
          >
            Create Account
          </button>
        </div>

        {/* One-Click Demo Helper */}
        <div style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(59,130,246,0.2)', padding: '10px 14px', borderRadius: '10px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Sparkles size={13} color="#38bdf8" />
            <span>Fast Evaluation Preset</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              className="btn-secondary" 
              style={{ flex: 1, padding: '5px 8px', fontSize: '0.75rem' }}
              onClick={() => handleQuickDemo('member')}
            >
              Member Preset
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              style={{ flex: 1, padding: '5px 8px', fontSize: '0.75rem', borderColor: 'rgba(168,85,247,0.3)' }}
              onClick={() => handleQuickDemo('admin')}
            >
              Admin Preset
            </button>
          </div>
        </div>

        {/* Form: LOGIN */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    className="input-field" 
                    required 
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    className="input-field" 
                    required 
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isSubmitting}>
              <LogIn size={16} />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        ) : (
          /* Form: REGISTER */
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>First Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    required 
                    placeholder="John"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Last Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    required 
                    placeholder="Doe"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email</label>
                <input 
                  type="email" 
                  className="input-field" 
                  required 
                  placeholder="john.doe@example.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Phone</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  placeholder="+1 (555) 000-0000"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Password</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    required 
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Role</label>
                  <select 
                    className="input-field"
                    value={registerData.userType}
                    onChange={(e) => setRegisterData({...registerData, userType: e.target.value})}
                  >
                    <option value="Member">Member</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isSubmitting}>
              <UserPlus size={16} />
              <span>{isSubmitting ? 'Registering with Spring Boot...' : 'Create Account'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
