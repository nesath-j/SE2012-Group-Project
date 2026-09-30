import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Glasses, 
  Sparkles, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { usersApi, DEFAULT_SERVICES } from '../api/api';

export default function OpticalServices({ onSelectService, onNotify }) {
  const [services, setServices] = useState(DEFAULT_SERVICES);

  useEffect(() => {
    async function loadServices() {
      try {
        // Calls backend GET /api/users/services
        const serviceList = await usersApi.getServices();
        console.log('Loaded optical services from backend:', serviceList);
      } catch (err) {
        console.warn('Backend services API error:', err);
      }
    }
    loadServices();
  }, []);

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Eye': return <Eye size={24} />;
      case 'Glasses': return <Glasses size={24} />;
      case 'Sparkles': return <Sparkles size={24} />;
      case 'Wrench': return <Wrench size={24} />;
      default: return <Eye size={24} />;
    }
  };

  return (
    <section className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="section-header">
        <span className="section-pretitle">Clinical Care & Diagnostics</span>
        <h2 className="section-title">Comprehensive Optical Services</h2>
        <p className="section-subtitle">
          Advanced diagnostic imaging, optical fitting, digital corneal topography, and rapid precision lens mounting done on-site.
        </p>
      </div>

      <div className="services-grid">
        {services.map(svc => (
          <div key={svc.id} className="glass-card glass-card-hover service-card">
            <div className="service-icon-box">
              {getServiceIcon(svc.icon)}
            </div>

            <span className="badge badge-blue" style={{ width: 'fit-content', marginBottom: '10px' }}>
              {svc.category}
            </span>

            <h3 className="service-title-text">{svc.name}</h3>
            <p className="service-desc-text">{svc.description}</p>

            <div className="service-footer-row">
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} />
                  <span>{svc.duration}</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                  {svc.price}
                </div>
              </div>

              <button 
                className="btn-primary" 
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => {
                  if (onSelectService) onSelectService(svc);
                  onNotify('info', 'Service Selected', `Please select your preferred specialist to schedule ${svc.name}.`);
                }}
              >
                <span>Book Service</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="glass-card" style={{ marginTop: '48px', padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.7))' }}>
        <div style={{ display: 'flex', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', flexShrink: 0 }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Certified Optical Lab</h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>All prescription lenses are shaped and inspected under ISO optical standards.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', flexShrink: 0 }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>100% Fit Guarantee</h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Complimentary lifelong nosepad replacements and temple adjustments.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', flexShrink: 0 }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Digital Retinal Imaging</h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Ultra-widefield fundus photography for proactive glaucoma and macular detection.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
