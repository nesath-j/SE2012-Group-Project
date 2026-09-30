import React, { useState } from 'react';
import {
  Glasses,
  Plus,
  Search,
  Tag,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export default function ProductsView({
  products = [],
  onOpenAddProductModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = ['ALL', 'Prescription Frames', 'Eyeglasses', 'Sunglasses', 'Contact Lenses'];

  const filteredProducts = products.filter((p) => {
    const pCat = p.category || p.Category || '';
    const pName = p.name || p.Name || '';
    const pDesc = p.description || p.Description || '';

    if (categoryFilter !== 'ALL' && pCat.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return pName.toLowerCase().includes(term) || pDesc.toLowerCase().includes(term) || pCat.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc' }}>
            Eyewear & Optical Catalog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Spring Boot Endpoint: <code style={{ color: 'var(--accent-cyan)' }}>POST /add</code> (Product Controller)
          </p>
        </div>

        <button onClick={onOpenAddProductModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isSelected = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat === 'ALL' ? 'All Collections' : cat}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
          <input
            type="text"
            placeholder="Search eyewear & lenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
        {filteredProducts.map((prod, idx) => {
          const name = prod.name || prod.Name || 'Optical Item';
          const cat = prod.category || prod.Category || 'General';
          const price = prod.price || prod.Price || 0;
          const stock = prod.stock_quantity ?? prod.Stock_quantity ?? 0;
          const desc = prod.description || prod.Description || '';
          const pic = prod.pic || prod.Pic || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80';

          return (
            <div
              key={prod.id || idx}
              className="glass-panel interactive-card"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Product Image */}
              <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
                <img
                  src={pic}
                  alt={name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '4px 10px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--accent-cyan)',
                    border: '1px solid rgba(6, 182, 212, 0.3)'
                  }}
                >
                  {cat}
                </span>

                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    padding: '4px 10px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#6ee7b7',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  ${Number(price).toFixed(2)}
                </span>
              </div>

              {/* Product Info */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '0.4rem' }}>
                    {name}
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {desc}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-subtle)' }}>
                    <Package size={14} color="var(--accent-cyan)" />
                    <span>In Stock: <strong style={{ color: stock > 10 ? '#6ee7b7' : '#fda4af' }}>{stock} units</strong></span>
                  </div>

                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                    VisionExpress Collection
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
