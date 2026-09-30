import React from 'react';
import { Glasses, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{ background: '#050811', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '60px 0 30px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', cursor: 'pointer' }} onClick={() => onNavigate('catalog')}>
              <div className="brand-icon-wrapper" style={{ width: '36px', height: '36px' }}>
                <Glasses size={20} />
              </div>
              <span className="brand-text-name" style={{ fontSize: '1.2rem' }}>
                Vision<span style={{ color: '#38bdf8' }}>Express</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '16px' }}>
              Comprehensive optometry, precision digital refraction, and curated luxury eyewear. Committed to optimal ocular wellness.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#10b981' }}>
              <ShieldCheck size={16} />
              <span>Certified ISO 9001 Optical Dispensary</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', color: '#fff' }}>Optical Care</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>
                <a href="#catalog" onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Designer Frames & Sunglasses
                </a>
              </li>
              <li>
                <a href="#doctors" onClick={(e) => { e.preventDefault(); onNavigate('doctors'); }} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Board-Certified Doctors
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); onNavigate('services'); }} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Clinical Eye Examination
                </a>
              </li>
              <li>
                <a href="#tryon" onClick={(e) => { e.preventDefault(); onNavigate('tryon'); }} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Virtual 3D Frame Mirror
                </a>
              </li>
            </ul>
          </div>

          {/* Clinic Hours */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', color: '#fff' }}>Clinic Schedule</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.83rem', color: '#94a3b8' }}>
              <div><strong>Monday - Friday:</strong> 08:30 AM – 07:00 PM</div>
              <div><strong>Saturday:</strong> 09:00 AM – 05:00 PM</div>
              <div><strong>Sunday:</strong> 10:00 AM – 03:00 PM</div>
              <div style={{ marginTop: '8px', color: '#38bdf8' }}>Emergency Triage: 24/7 on call</div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', color: '#fff' }}>Get in Touch</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.83rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#38bdf8" />
                <span>450 Optical Boulevard, Suite 100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#10b981" />
                <span>+1 (800) 555-VISION</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#fbbf24" />
                <span>appointments@visionexpress.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem', color: '#64748b' }}>
          <div>
            © 2026 VisionExpress Optical Systems. All rights reserved.
          </div>
          <div>
            Spring Boot API Integration: <code style={{ color: '#38bdf8' }}>http://localhost:8081</code>
          </div>
        </div>
      </div>
    </footer>
  );
}
