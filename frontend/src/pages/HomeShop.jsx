import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsApi } from '../services/api';
import {
  Search,
  SlidersHorizontal,
  Eye,
  Plus,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  Award,
  ArrowRight,
  X,
  Filter
} from 'lucide-react';

export default function HomeShop({ onNavigateTab }) {
  const { addToCart, showToast } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', 'Eyeglasses', 'Sunglasses', 'Contact Lenses', 'Accessories'];

  useEffect(() => {
    loadProducts();
  }, [searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productsApi.search(searchQuery);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'All') return true;
    return p.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #090e17 0%, #0f172a 50%, #0c4a6e 100%)',
        color: '#ffffff',
        padding: '4.5rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Optical glowing orb backdrop */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(14, 165, 233, 0) 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1100px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.95rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '0.825rem',
            fontWeight: 600,
            color: '#38bdf8',
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={16} />
            <span>2026 High-Definition Optical Collections & Clinical Eye Care</span>
          </div>

          <h1 style={{
            color: '#ffffff',
            fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            maxWidth: '850px',
          }}>
            Flawless Vision Crafted for Your Unique Perspective.
          </h1>

          <p style={{
            color: '#cbd5e1',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            maxWidth: '680px',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
          }}>
            Experience medical precision eye examinations with board-certified optometrists, luxury designer acetate frames, anti-blue light progressive lenses, and tiered loyalty membership rewards.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-primary btn-lg"
              style={{
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.4)',
              }}
            >
              <span>Explore Eyewear Catalog</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => onNavigateTab('doctors')}
              className="btn btn-secondary btn-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Clock size={18} />
              <span>Book Doctor Consultation</span>
            </button>
          </div>

          {/* Quick value cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginTop: '3.5rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(14, 165, 233, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '0.925rem', color: '#ffffff' }}>100% Prescription Guarantee</strong>
                <div style={{ fontSize: '0.785rem', color: '#94a3b8' }}>Free 30-day lens accuracy warranty</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Award size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '0.925rem', color: '#ffffff' }}>Loyalty Tier Rewards</strong>
                <div style={{ fontSize: '0.785rem', color: '#94a3b8' }}>Earn points on every dollar spent</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Clock size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '0.925rem', color: '#ffffff' }}>Precision Repair Lab</strong>
                <div style={{ fontSize: '0.785rem', color: '#94a3b8' }}>Same-day frame fitting & alignment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="catalog-section" className="container" style={{ paddingTop: '3.5rem' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}>
          <div>
            <div style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#0284c7',
              marginBottom: '0.25rem',
            }}>
              Curated Eyewear & Optics
            </div>
            <h2>Optical Product Catalog</h2>
          </div>

          {/* Search Bar & Filter Controls */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
              <input
                type="text"
                placeholder="Search by frame model, brand, or lens type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.6rem', borderRadius: '9999px' }}
              />
              <Search
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    color: selectedCategory === cat ? '#ffffff' : '#475569',
                    backgroundColor: selectedCategory === cat ? '#0284c7' : '#ffffff',
                    border: `1px solid ${selectedCategory === cat ? '#0284c7' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: selectedCategory === cat ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <span className="spinner spinner-primary" style={{ width: '32px', height: '32px' }} />
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Searching catalog from Spring Boot 8081...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1',
          }}>
            <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '0.5rem' }}>No products found matching "{searchQuery}"</p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Try adjusting your search keyword or clearing the filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="btn btn-outline btn-sm"
              style={{ marginTop: '1rem' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid-4">
            {filteredProducts.map((product) => (
              <div
                key={product.productId}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Product Thumbnail */}
                <div style={{
                  position: 'relative',
                  paddingTop: '65%',
                  backgroundColor: '#f1f5f9',
                  overflow: 'hidden',
                }}>
                  <img
                    src={product.pic}
                    alt={product.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />

                  <span
                    className="badge badge-primary"
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(4px)',
                      color: '#0369a1',
                      border: '1px solid #bae6fd',
                    }}
                  >
                    {product.category}
                  </span>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                    }}
                    title="Quick Details"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    marginBottom: '0.35rem',
                    color: '#0f172a',
                  }}>
                    {product.name}
                  </h3>

                  <p style={{
                    fontSize: '0.825rem',
                    color: '#64748b',
                    marginBottom: '1rem',
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1,
                  }}>
                    {product.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #f1f5f9',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>PRICE</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                        Rs {product.price.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.6rem 0.75rem' }}
                    >
                      <Plus size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Details Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '640px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}>
              <span className="badge badge-primary">{selectedProduct.category}</span>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{ color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.75rem' }}>
              <div style={{
                height: '240px',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#f1f5f9',
                marginBottom: '1.5rem',
              }}>
                <img
                  src={selectedProduct.pic}
                  alt={selectedProduct.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{selectedProduct.name}</h2>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0284c7', marginBottom: '1rem' }}>
                Rs {selectedProduct.price.toFixed(2)}
              </div>

              <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: '#475569', marginBottom: '1.5rem' }}>
                {selectedProduct.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                backgroundColor: '#f8fafc',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
              }}>
                <div>
                  <span style={{ color: '#64748b' }}>Stock Status: </span>
                  <strong style={{ color: selectedProduct.stockQuantity > 0 ? '#10b981' : '#f43f5e' }}>
                    {selectedProduct.stockQuantity > 0 ? `In Stock (${selectedProduct.stockQuantity} units)` : 'Out of Stock'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Prescription Compatibility: </span>
                  <strong>Single & Progressive</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>UV Rating: </span>
                  <strong>UV400 Category 3</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Fitting Guarantee: </span>
                  <strong>Complimentary In-Store</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(selectedProduct, 1);
                  setSelectedProduct(null);
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <Plus size={18} />
                <span>Add to Shopping Cart (Rs {selectedProduct.price.toFixed(2)})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
