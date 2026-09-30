import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ShoppingCart, 
  Eye, 
  Sparkles, 
  Check, 
  CheckCircle,
  Tag,
  Star,
  Package
} from 'lucide-react';
import { usersApi, DEFAULT_CATALOG } from '../api/api';

export default function ProductCatalog({ 
  onAddToCart, 
  currentUser, 
  onOpenAddProduct, 
  searchQuery, 
  setSearchQuery,
  onNotify
}) {
  const [products, setProducts] = useState(DEFAULT_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [prescriptionOptions, setPrescriptionOptions] = useState({
    lensType: 'Standard Anti-Reflective',
    odSphere: '-1.25',
    osSphere: '-1.50',
    pupillaryDistance: '63mm',
    blueLightFilter: true
  });
  const [isSearching, setIsSearching] = useState(false);

  // Search when searchQuery changes
  useEffect(() => {
    async function performSearch() {
      if (!searchQuery || searchQuery.trim() === '') {
        setProducts(DEFAULT_CATALOG);
        return;
      }

      setIsSearching(true);
      try {
        // Call backend GET /api/users/products/search?keyword=...
        const searchResults = await usersApi.searchProducts(searchQuery);
        
        // Filter or map results
        const filtered = DEFAULT_CATALOG.filter(p => {
          const inSearch = searchResults.some(str => str.toLowerCase().includes(p.name.toLowerCase()));
          const inDirect = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
          return inSearch || inDirect;
        });

        setProducts(filtered.length > 0 ? filtered : []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const categories = ['All', 'Frames', 'Sunglasses', 'Lenses'];

  const displayedProducts = products.filter(product => {
    if (selectedCategory === 'All') return true;
    return product.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleOpenConfigureModal = (product) => {
    setActiveProductModal(product);
  };

  const handleAddToCartWithPrescription = () => {
    if (!activeProductModal) return;
    
    const configuredItem = {
      ...activeProductModal,
      configuredLens: activeProductModal.category === 'Lenses' || activeProductModal.category === 'Frames' ? prescriptionOptions : null,
      customPrice: activeProductModal.price + (prescriptionOptions.blueLightFilter && activeProductModal.category === 'Frames' ? 25 : 0)
    };

    onAddToCart(configuredItem);
    onNotify('success', 'Added to Cart', `${activeProductModal.name} was added to your optical bag.`);
    setActiveProductModal(null);
  };

  return (
    <section className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Section Header */}
      <div className="section-header" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="section-pretitle">Precision Collection</span>
          <h2 className="section-title">Optical Eyewear & Specialized Lenses</h2>
          <p className="section-subtitle">
            Curated designer frames, polarized sunglasses, and custom precision lenses. Built to medical-grade optical standards.
          </p>
        </div>

        {currentUser?.userType?.toLowerCase().includes('admin') && (
          <button className="btn-primary" onClick={onOpenAddProduct}>
            <Plus size={18} />
            <span>Add New Product (Admin API)</span>
          </button>
        )}
      </div>

      {/* Controls Bar: Search & Category Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        {/* Category Tabs */}
        <div className="category-tabs-wrapper" style={{ marginBottom: 0 }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter / Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Filter products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px', paddingRight: '12px', height: '42px' }}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isSearching ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <Sparkles className="animate-spin" size={32} style={{ margin: '0 auto 12px' }} />
          <p>Querying Spring Boot /api/users/products/search...</p>
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px', margin: '20px 0' }}>
          <Package size={48} color="#64748b" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ marginBottom: '8px' }}>No Products Found</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
            No products matched keyword "{searchQuery}". Try searching for "Ray-Ban", "Oakley", or "Lenses".
          </p>
          <button className="btn-secondary" onClick={() => setSearchQuery('')}>
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {displayedProducts.map(product => (
            <div key={product.id || product.name} className="product-card glass-card">
              <div className="product-image-box">
                <img 
                  src={product.image || product.pic || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'} 
                  alt={product.name} 
                  className="product-img" 
                />
                <div className="product-tag-float">
                  <span className={`badge ${product.category === 'Lenses' ? 'badge-purple' : product.category === 'Sunglasses' ? 'badge-amber' : 'badge-blue'}`}>
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="product-body">
                <div className="product-cat-label">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description-text">{product.description}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Star size={14} fill="#fbbf24" />
                    <span>{product.rating || '4.9'}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>({product.reviews || 42} reviews)</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    {product.stock || product.stock_quantity || 15} in stock
                  </span>
                </div>

                <div className="product-footer-row">
                  <div>
                    <span className="product-price-val">${Number(product.price).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '8px 12px' }}
                      title="Quick Configure & Prescribe"
                      onClick={() => handleOpenConfigureModal(product)}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px' }}
                      onClick={() => {
                        onAddToCart(product);
                        onNotify('success', 'Added to Cart', `${product.name} added to cart.`);
                      }}
                    >
                      <ShoppingCart size={15} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescription / Lens Customizer Modal */}
      {activeProductModal && (
        <div className="modal-overlay" onClick={() => setActiveProductModal(null)}>
          <div className="glass-card" style={{ maxWidth: '580px', width: '100%', padding: '32px', position: 'relative', background: '#0f172a' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
              <img 
                src={activeProductModal.image || activeProductModal.pic} 
                alt={activeProductModal.name} 
                style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '12px' }} 
              />
              <div>
                <span className="badge badge-blue">{activeProductModal.category}</span>
                <h3 style={{ fontSize: '1.4rem', marginTop: '6px' }}>{activeProductModal.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{activeProductModal.description}</p>
                <div style={{ marginTop: '8px', fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>
                  ${Number(activeProductModal.price).toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#38bdf8" />
                <span>Lens Specification & Prescription Fit</span>
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>OD Right Eye (Sphere)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={prescriptionOptions.odSphere}
                    onChange={(e) => setPrescriptionOptions({...prescriptionOptions, odSphere: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>OS Left Eye (Sphere)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={prescriptionOptions.osSphere}
                    onChange={(e) => setPrescriptionOptions({...prescriptionOptions, osSphere: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Lens Coating / Technology</label>
                <select 
                  className="input-field"
                  value={prescriptionOptions.lensType}
                  onChange={(e) => setPrescriptionOptions({...prescriptionOptions, lensType: e.target.value})}
                >
                  <option value="Standard Anti-Reflective">Standard Multi-Coat Anti-Reflective (Included)</option>
                  <option value="Transitions Gen 8">Transitions® Signature Gen 8 (Light Adaptive)</option>
                  <option value="High-Index 1.67 Ultrathin">High-Index 1.67 Ultrathin Precision</option>
                  <option value="Polarized Sunglass Tint">Custom Polarized Sunglass Tint</option>
                </select>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <input 
                  type="checkbox" 
                  checked={prescriptionOptions.blueLightFilter}
                  onChange={(e) => setPrescriptionOptions({...prescriptionOptions, blueLightFilter: e.target.checked})}
                />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Add Blue-Light Screen Defense (+ $25)</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reduces digital ocular fatigue from monitors and smartphone screens.</div>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => setActiveProductModal(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddToCartWithPrescription}>
                <CheckCircle size={16} />
                <span>Confirm & Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
