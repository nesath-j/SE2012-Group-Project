import React, { useState } from 'react';
import { Search, Sparkles, Shield, Award, Calendar, ArrowRight } from 'lucide-react';

export default function HeroBanner({ onSearch, onExplore, onBookAppointment, onLaunchTryOn }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        {/* Left Column: Copy & Search */}
        <div>
          <div className="hero-pill-badge">
            <Sparkles size={14} />
            <span>2026 High-Definition Optical Technology</span>
          </div>

          <h1 className="hero-title">
            Precision Vision. <br />
            <span className="gradient-text">Exceptional Eyewear.</span>
          </h1>

          <p className="hero-description">
            Experience bespoke optometric care and luxury eyewear engineered for clarity. 
            From state-of-the-art retinal examinations to custom Transitions® and blue-blocking optics.
          </p>

          {/* Quick Search Form */}
          <form className="hero-search-bar" onSubmit={handleSearchSubmit}>
            <Search size={18} color="#94a3b8" style={{ marginRight: '8px' }} />
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search frames, lenses, sunglasses (e.g. Ray-Ban, Oakley)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              Search
            </button>
          </form>

          {/* Call to Actions */}
          <div className="hero-cta-group">
            <button className="btn-primary" onClick={onExplore}>
              <span>Browse Catalog</span>
              <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={onBookAppointment}>
              <Calendar size={16} />
              <span>Book Eye Exam</span>
            </button>
            <button className="btn-secondary" onClick={onLaunchTryOn} style={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}>
              <Sparkles size={16} color="#38bdf8" />
              <span>Virtual 3D Try-On</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <div className="hero-stat-num">100%</div>
              <div className="hero-stat-desc">UV400 Certified</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-num">3+</div>
              <div className="hero-stat-desc">Board Specialists</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-num">Same-Day</div>
              <div className="hero-stat-desc">Digital Edging</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-num">Up to 15%</div>
              <div className="hero-stat-desc">Tier Member Rewards</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Showcase Card */}
        <div className="hero-showcase-container">
          <div className="hero-showcase-card animate-float">
            <div className="showcase-badge-floating">
              <span className="badge badge-blue">Featured Collection</span>
            </div>

            <div className="showcase-image-wrap">
              <img 
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=700&q=80" 
                alt="Ray-Ban Aviator Classic" 
                className="showcase-main-img"
              />
            </div>

            <div className="showcase-info-row">
              <div>
                <h3 className="showcase-item-title">Ray-Ban Aviator Classic</h3>
                <p className="showcase-item-subtitle">High-grade gold frame with G-15 crystal glass lenses</p>
              </div>
              <div className="showcase-price-tag">
                $185.00
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
