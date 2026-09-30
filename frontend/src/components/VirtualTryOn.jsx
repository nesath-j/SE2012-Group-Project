import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  ShoppingBag, 
  Camera, 
  Sliders, 
  Check, 
  Glasses, 
  Maximize2 
} from 'lucide-react';

export default function VirtualTryOn({ onAddToCart, onNotify }) {
  const [selectedFrame, setSelectedFrame] = useState({
    id: 'tryon-1',
    name: 'VisionExpress Alpha Aviator',
    price: 195,
    style: 'Aviator',
    bridgeType: 'Double Bridge'
  });

  const [frameColor, setFrameColor] = useState('#2563eb'); // Default blue
  const [lensTint, setLensTint] = useState('rgba(14, 165, 233, 0.25)'); // Light blue tint
  const [frameScale, setFrameScale] = useState(1);
  const [modelIndex, setModelIndex] = useState(0);

  const models = [
    {
      name: 'Male Model 1',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80'
    },
    {
      name: 'Female Model 1',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80'
    },
    {
      name: 'Male Model 2',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80'
    }
  ];

  const frameOptions = [
    { name: 'Alpha Aviator', price: 195, style: 'Aviator' },
    { name: 'Metropolitan Square', price: 180, style: 'Square' },
    { name: 'Heritage Round', price: 175, style: 'Round' },
    { name: 'Ultralight Rimless', price: 220, style: 'Rimless' }
  ];

  const colorSwatches = [
    { name: 'Cobalt Blue', value: '#2563eb' },
    { name: 'Onyx Black', value: '#0f172a' },
    { name: 'Champagne Gold', value: '#d97706' },
    { name: 'Rose Titanium', value: '#e11d48' },
    { name: 'Brushed Silver', value: '#94a3b8' }
  ];

  const lensTints = [
    { name: 'Clear AR', value: 'rgba(255, 255, 255, 0.1)', desc: 'Transparent' },
    { name: 'Blue-Blocker Amber', value: 'rgba(245, 158, 11, 0.25)', desc: 'Screen Guard' },
    { name: 'G-15 Emerald', value: 'rgba(16, 185, 129, 0.35)', desc: 'Solar UV' },
    { name: 'Transition Smoke', value: 'rgba(30, 41, 59, 0.65)', desc: 'Adaptive' }
  ];

  const handleAddToCart = () => {
    const customFrame = {
      id: Date.now(),
      name: `${selectedFrame.name} (Custom Virtual Fit)`,
      category: 'Frames',
      price: selectedFrame.price,
      image: models[modelIndex].image,
      description: `Custom fitted in ${colorSwatches.find(c => c.value === frameColor)?.name || 'Custom Color'} with ${lensTints.find(t => t.value === lensTint)?.name || 'Custom Lens'}.`,
      configuredLens: {
        tint: lensTints.find(t => t.value === lensTint)?.name,
        color: colorSwatches.find(c => c.value === frameColor)?.name
      }
    };
    onAddToCart(customFrame);
    onNotify('success', 'Custom Fit Added', `${customFrame.name} was added to your bag.`);
  };

  return (
    <section className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="section-header">
        <span className="section-pretitle">Interactive 3D Simulation</span>
        <h2 className="section-title">Virtual Eyewear Studio & Try-On</h2>
        <p className="section-subtitle">
          Test silhouettes, lens coatings, and frame hues on realistic models before ordering. Find your perfect millimeter fit.
        </p>
      </div>

      <div className="tryon-container">
        {/* Left: Viewport */}
        <div>
          <div className="tryon-viewport">
            <img 
              src={models[modelIndex].image} 
              alt="Virtual Model" 
              className="tryon-model-image"
            />

            {/* Simulated Frame Overlay SVG */}
            <div 
              className="tryon-overlay-frame"
              style={{
                transform: `scale(${frameScale})`,
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.85))'
              }}
            >
              <svg viewBox="0 0 400 140" style={{ width: '100%', height: 'auto' }}>
                <defs>
                  {/* Lens Tint Gradient */}
                  <linearGradient id="lensGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={lensTint} />
                    <stop offset="100%" stopColor={lensTint} />
                  </linearGradient>
                </defs>

                {/* Left Lens Glass */}
                <ellipse cx="110" cy="70" rx="70" ry="50" fill="url(#lensGrad)" />
                {/* Right Lens Glass */}
                <ellipse cx="290" cy="70" rx="70" ry="50" fill="url(#lensGrad)" />

                {/* Frame Rim Left */}
                <ellipse 
                  cx="110" 
                  cy="70" 
                  rx="72" 
                  ry="52" 
                  fill="none" 
                  stroke={frameColor} 
                  strokeWidth="8" 
                />

                {/* Frame Rim Right */}
                <ellipse 
                  cx="290" 
                  cy="70" 
                  rx="72" 
                  ry="52" 
                  fill="none" 
                  stroke={frameColor} 
                  strokeWidth="8" 
                />

                {/* Top Brow Bar & Bridge */}
                <path 
                  d="M 180 50 Q 200 45 220 50" 
                  fill="none" 
                  stroke={frameColor} 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 182 68 Q 200 62 218 68" 
                  fill="none" 
                  stroke={frameColor} 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                />

                {/* Left Temple Joint */}
                <path d="M 38 65 L 10 58" stroke={frameColor} strokeWidth="7" strokeLinecap="round" />
                {/* Right Temple Joint */}
                <path d="M 362 65 L 390 58" stroke={frameColor} strokeWidth="7" strokeLinecap="round" />

                {/* Realistic Lens Glare Reflection */}
                <path d="M 65 40 Q 85 30 115 32" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 245 40 Q 265 30 295 32" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Model switcher pill */}
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.78rem', background: 'rgba(0,0,0,0.6)' }}
                onClick={() => setModelIndex((modelIndex + 1) % models.length)}
              >
                <RefreshCw size={13} />
                <span>Switch Face Model</span>
              </button>

              <div className="badge badge-blue" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
                3D Live Overlay
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customization Controls */}
        <div className="tryon-controls-panel">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.4rem' }}>{selectedFrame.name}</h3>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>${selectedFrame.price}.00</div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Premium handcrafted frame with dynamic virtual alignment. Adjust shape, frame hue, and lens tints in real time.
            </p>
          </div>

          {/* Frame Style Select */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              1. Frame Silhouette
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {frameOptions.map(f => (
                <button
                  key={f.name}
                  className={`btn-secondary ${selectedFrame.name === f.name ? 'active' : ''}`}
                  style={{
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderColor: selectedFrame.name === f.name ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                    background: selectedFrame.name === f.name ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)'
                  }}
                  onClick={() => setSelectedFrame(f)}
                >
                  <span style={{ fontSize: '0.85rem' }}>{f.name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>${f.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frame Color Swatches */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              2. Frame Colorway
            </label>
            <div className="color-swatch-list">
              {colorSwatches.map(color => (
                <button
                  key={color.name}
                  className={`color-swatch-btn ${frameColor === color.value ? 'active' : ''}`}
                  style={{ background: color.value }}
                  onClick={() => setFrameColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Lens Tint Options */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              3. Lens Technology / Tint
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {lensTints.map(t => (
                <button
                  key={t.name}
                  className="btn-secondary"
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '8px 12px',
                    borderColor: lensTint === t.value ? '#10b981' : 'rgba(255,255,255,0.08)',
                    background: lensTint === t.value ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)'
                  }}
                  onClick={() => setLensTint(t.value)}
                >
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>{t.name}</span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scale Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
              <span>Frame Scale Adjustment</span>
              <span>{Math.round(frameScale * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0.8" 
              max="1.25" 
              step="0.01" 
              value={frameScale} 
              onChange={(e) => setFrameScale(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb' }}
            />
          </div>

          {/* Add to Cart CTA */}
          <button className="btn-primary" style={{ padding: '14px 24px', fontSize: '1rem', marginTop: '10px' }} onClick={handleAddToCart}>
            <ShoppingBag size={18} />
            <span>Add Custom Fit to Cart (${selectedFrame.price}.00)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
