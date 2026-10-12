import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Eye, Check, AlertTriangle, ShieldCheck, Sparkles, RefreshCw, Glasses } from 'lucide-react';


const CATEGORIES = [
  'All',
  'Sunglasses',
  'Prescription Glasses',
  'Designer Frames',
  'Blue Light Blocking',
  'Contact Lenses'
];

export default function ProductCatalog({
  products,
  loading,
  searchKeyword,
  setSearchKeyword,
  onSearch,
  onAddToCart,
  onRefresh
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory === 'All') return true;
      return p.category?.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [products, selectedCategory]);

  const handleAddToCart = (product) => {
    onAddToCart(product);
    setAddedAnimationId(product.productId);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '48px 40px',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.9) 60%, rgba(99, 102, 241, 0.2) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          position: 'absolute',
          right: '-40px',
          top: '-40px',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '720px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '6px 14px',
            borderRadius: '20px',
            color: '#38bdf8',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <Sparkles size={15} /> Precision Optics & Curated Frames
          </div>

          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ffffff 30%, #93c5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            See The World With Unmatched Clarity.
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Explore physician-graded prescription eyewear, Italian designer frames, and UV400 polarized optics. Backed by seamless Spring Boot order processing and live courier tracking.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <ShieldCheck size={18} color="#34d399" /> 100% Prescription Verified
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <Sparkles size={18} color="#38bdf8" /> Anti-Reflective Coating
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <Check size={18} color="#a78bfa" /> Free Courier Tracking
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}>
          {/* Search bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); onSearch(searchKeyword); }}
            style={{
              position: 'relative',
              flex: '1 1 360px',
              maxWidth: '520px'
            }}
          >
            <Search
              size={18}
              color="#94a3b8"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search products by title (e.g. Aviator, Gucci, Oasys)..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                onSearch(e.target.value);
              }}
              style={{
                width: '100%',
                paddingLeft: '44px',
                paddingRight: '40px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.95rem'
              }}
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => { setSearchKeyword(''); onSearch(''); }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  padding: '4px'
                }}
              >
                Clear
              </button>
            )}
          </form>

          {/* Quick Refresh */}
          <button
            onClick={onRefresh}
            className="btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Refresh product list from /api/products/search"
          >
            <RefreshCw size={15} className={loading ? 'pulse' : ''} />
            <span>Reload Products</span>
          </button>
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {CATEGORIES.map(category => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  background: isActive ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  border: isActive ? '1px solid transparent' : '1px solid var(--border-subtle)',
                  boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none'
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading or Empty State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div className="pulse" style={{ display: 'inline-block', marginBottom: '12px' }}>
            <Glasses size={48} color="#0284c7" />
          </div>
          <p>Syncing product catalog with VisionExpress API...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', margin: '20px 0' }}>
          <AlertTriangle size={48} color="#f59e0b" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No Optical Products Found</h3>
          <p style={{ color: '#94a3b8', maxWidth: '440px', margin: '0 auto 20px' }}>
            We couldn't find any items matching "{searchKeyword}". Try checking another keyword or switch category filters.
          </p>
          <button
            onClick={() => { setSearchKeyword(''); setSelectedCategory('All'); onSearch(''); }}
            className="btn-primary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredProducts.map(product => {
            const isOutOfStock = Number(product.stockQuantity) <= 0;
            const isLowStock = Number(product.stockQuantity) > 0 && Number(product.stockQuantity) <= 10;
            const isJustAdded = addedAnimationId === product.productId;

            return (
              <div
                key={product.productId}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.4)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.4), 0 0 15px rgba(2, 132, 199, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                {/* Product Image Area */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '210px',
                  background: 'linear-gradient(180deg, #162035 0%, #0d1424 100%)',
                  overflow: 'hidden'
                }}>
                  <img
                    src={product.pic || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    onError={(e) => {
                      // Fallback image if image URL fails
                      e.target.src = 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  {/* Category Pill Tag */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#38bdf8'
                  }}>
                    {product.category || 'Eyewear'}
                  </div>

                  {/* Stock Pill Badge */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    {isOutOfStock ? (
                      <span className="badge badge-danger">Out of Stock</span>
                    ) : isLowStock ? (
                      <span className="badge badge-warning">Only {product.stockQuantity} left</span>
                    ) : (
                      <span className="badge badge-success">In Stock ({product.stockQuantity})</span>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                    lineHeight: 1.3
                  }}>
                    {product.name}
                  </h3>

                  <p style={{
                    fontSize: '0.85rem',
                    color: '#94a3b8',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description || "Precision engineered eyewear with superior optical clarity and durable lightweight materials."}
                  </p>

                  {/* Price & Action row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-subtle)',
                    marginTop: 'auto'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                        Price
                      </div>
                      <div style={{
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: '#f8fafc',
                        fontFamily: 'var(--font-heading)'
                      }}>
                        ${Number(product.price).toFixed(2)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="btn-icon"
                        title="View Specifications"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock}
                        className={isJustAdded ? "btn-secondary" : "btn-primary"}
                        style={{
                          padding: '8px 14px',
                          fontSize: '0.85rem',
                          opacity: isOutOfStock ? 0.4 : 1,
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isJustAdded ? (
                          <>
                            <Check size={16} color="#34d399" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={16} />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '0', maxWidth: '640px' }}
          >
            <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
              <img
                src={selectedProduct.pic || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'}
                alt={selectedProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.65)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span className="badge badge-info" style={{ marginBottom: '8px' }}>
                    {selectedProduct.category}
                  </span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedProduct.name}</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>
                    ${Number(selectedProduct.price).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Stock: {selectedProduct.stockQuantity} units
                  </div>
                </div>
              </div>

              <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '20px' }}>
                {selectedProduct.description}
              </p>

              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                  OPTICAL PRODUCT METADATA
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                  <div><strong style={{ color: '#94a3b8' }}>Product ID:</strong> #{selectedProduct.productId}</div>
                  <div><strong style={{ color: '#94a3b8' }}>Availability:</strong> {selectedProduct.stockQuantity > 0 ? 'Ready for Dispatch' : 'Backorder'}</div>
                  <div><strong style={{ color: '#94a3b8' }}>Prescription:</strong> Supported</div>
                  <div><strong style={{ color: '#94a3b8' }}>Warranty:</strong> 1 Year Premium Optical</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedProduct(null)} className="btn-secondary">
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={selectedProduct.stockQuantity <= 0}
                  className="btn-primary"
                >
                  <ShoppingBag size={18} />
                  Add to Cart (${Number(selectedProduct.price).toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
