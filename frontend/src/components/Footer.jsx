import React from 'react';
import { Glasses, Phone, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

export default function Footer({ onNavigateTab }) {
  return (
    <footer style={{
      backgroundColor: '#090e17',
      color: '#94a3b8',
      borderTop: '1px solid #1e293b',
      marginTop: 'auto',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Col 1: Brand & Clinical Guarantee */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1rem',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Glasses size={20} />
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#ffffff',
              }}>
                VISION<span style={{ color: '#0ea5e9' }}>EXPRESS</span>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '1.25rem' }}>
              Sri Lanka's leading optical care institution providing high-precision vision examinations, luxury eyewear collections, lens fitting laboratories, and tiered loyalty rewards.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#38bdf8' }}>
              <ShieldCheck size={18} />
              <span>Accredited Doctors & Opticians</span>
            </div>
          </div>

          {/* Col 2: Optical Services & Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.975rem', marginBottom: '1rem', letterSpacing: '0.02em' }}>
              CLINICAL SERVICES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <button
                  onClick={() => onNavigateTab('doctors')}
                  style={{ color: '#94a3b8', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Doctor Eye Consultations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('services')}
                  style={{ color: '#94a3b8', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Precision Frame Adjustment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('services')}
                  style={{ color: '#94a3b8', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Digital Lens Fitting & Edging
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('services')}
                  style={{ color: '#94a3b8', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Ultrasonic Cleaning & Repair
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Rewards & Management */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.975rem', marginBottom: '1rem', letterSpacing: '0.02em' }}>
              MEMBER & STAFF
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <button
                  onClick={() => onNavigateTab('rewards')}
                  style={{ color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Loyalty Tiers (Bronze to Platinum)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('orders')}
                  style={{ color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Payment Slip Upload & Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('staff')}
                  style={{ color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Doctor Consultation Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('staff')}
                  style={{ color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Admin Payment Confirmation
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Hours & Contact */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.975rem', marginBottom: '1rem', letterSpacing: '0.02em' }}>
              STORE & CLINIC
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <Clock size={18} color="#0ea5e9" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#e2e8f0' }}>Mon – Sat:</strong> 9:00 AM – 7:30 PM<br />
                  <strong style={{ color: '#e2e8f0' }}>Sunday:</strong> 10:00 AM – 5:00 PM
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <MapPin size={18} color="#0ea5e9" style={{ flexShrink: 0 }} />
                <span>No. 142 Galle Road, Colombo 03, Sri Lanka</span>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <Phone size={18} color="#0ea5e9" style={{ flexShrink: 0 }} />
                <span>+94 11 257 8940 (Optical Care Hotline)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
        }}>
          <div>
            © 2026 Vision Express Management System. Built with React Vite & Spring Boot 8081.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Optical Standards Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
