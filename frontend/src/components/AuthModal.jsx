import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Phone, CheckCircle, ShieldCheck } from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await login(email, password);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      await register({ firstName, lastName, email, password, phone });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Header Modal Bar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => { setAuthModalMode('login'); setErrorMessage(''); }}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: authModalMode === 'login' ? 700 : 500,
                color: authModalMode === 'login' ? '#0284c7' : '#64748b',
                backgroundColor: authModalMode === 'login' ? '#ffffff' : 'transparent',
                boxShadow: authModalMode === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthModalMode('register'); setErrorMessage(''); }}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: authModalMode === 'register' ? 700 : 500,
                color: authModalMode === 'register' ? '#0284c7' : '#64748b',
                backgroundColor: authModalMode === 'register' ? '#ffffff' : 'transparent',
                boxShadow: authModalMode === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Register Member
            </button>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            style={{
              color: '#64748b',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem' }}>
          {errorMessage && (
            <div style={{
              backgroundColor: '#ffe4e6',
              color: '#9f1239',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mode 1: Login Form */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>Vision Express Portal</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Sign in with your verified credentials (Members, Doctors, Technicians, Managers, Admins)
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah.e@example.com"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                {loading ? <span className="spinner" /> : 'Sign In'}
              </button>

              <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.825rem', color: '#64748b' }}>
                New customer?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalMode('register'); setErrorMessage(''); }}
                  style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  Create a Member account
                </button>
              </div>
            </form>
          )}

          {/* Mode 2: Registration Form */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>Join Vision Express</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Create your customer member profile to unlock rewards, prescriptions, and clinic appointments
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="074 000 0000"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password (min. 8 characters)</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                {loading ? <span className="spinner" /> : 'Register Member Account'}
              </button>

              <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.825rem', color: '#64748b' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalMode('login'); setErrorMessage(''); }}
                  style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
