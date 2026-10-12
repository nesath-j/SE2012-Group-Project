import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  ShoppingBag,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Package,
  Layers,
  Sparkles,
  X,
  ExternalLink,
  Glasses
} from 'lucide-react';

export const ProductsView = () => {
  const { addToast } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Eyeglasses',
    price: '',
    stock_quantity: '',
    description: '',
    pic: '',
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.products.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast('error', err.message || 'Failed to load products', 'Data Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.stock_quantity) {
      addToast('error', 'Product name, price, and stock quantity are required.', 'Validation Error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity, 10),
        description: formData.description.trim(),
        pic:
          formData.pic.trim() ||
          'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80',
      };

      await api.products.add(payload);
      addToast('success', `Product "${payload.name}" added to catalog via /api/products/add!`, 'Product Created');
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        category: 'Eyeglasses',
        price: '',
        stock_quantity: '',
        description: '',
        pic: '',
      });
      loadProducts();
    } catch (err) {
      addToast('error', err.message || 'Failed to add product', 'Creation Error');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['ALL', 'Eyeglasses', 'Sunglasses', 'Sport Performance', 'Contact Lenses', 'Luxury Eyewear'];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>
            Eyewear &amp; Optical Catalog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Browse designer frames, sunglasses, lenses and add new inventory via the Spring Boot Product endpoint.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            id="refresh-products-btn"
            className="btn btn-secondary"
            onClick={loadProducts}
            disabled={loading}
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
          <button
            id="open-add-product-btn"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add Eyewear</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid',
                  fontSize: '0.78125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: selectedCategory === cat ? 'var(--accent-cyan)' : 'transparent',
                  borderColor: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              id="search-products-input"
              type="text"
              placeholder="Search frames, lenses, brands..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', height: '36px', fontSize: '0.8125rem' }}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading optical catalog...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <ShoppingBag size={36} color="var(--text-dim)" style={{ marginBottom: '10px' }} />
          <p style={{ margin: 0, fontWeight: 600 }}>No eyewear products found</p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddModalOpen(true)}
            style={{ marginTop: '12px' }}
          >
            <Plus size={14} />
            <span>Add Product</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredProducts.map((product, idx) => (
            <div
              key={idx}
              id={`product-card-${idx}`}
              className="glass-card glass-card-interactive"
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Product Image */}
              <div
                style={{
                  height: '180px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={
                    product.pic ||
                    'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--accent-cyan-light)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                  }}
                >
                  {product.category}
                </span>

                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: product.stock_quantity < 10 ? 'rgba(244, 63, 94, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  {product.stock_quantity} in stock
                </span>
              </div>

              {/* Product Info */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                    {product.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.description || 'Authentic designer eyewear from VisionExpress official partners.'}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.875rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Price</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan-light)' }}>
                      ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                    </div>
                  </div>

                  <span className="badge badge-scheduled" style={{ fontSize: '0.75rem' }}>
                    <Package size={12} />
                    <span>Optical SKU</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal (POST /api/products/add) */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={20} color="var(--accent-cyan)" />
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Add Eyewear via Spring Boot API</h3>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={() => setIsAddModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-name">Product Name *</label>
                  <input
                    id="prod-name"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Prada PR 17WS Rectangular Sunglasses"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-category">Category *</label>
                    <select
                      id="prod-category"
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Eyeglasses">Eyeglasses</option>
                      <option value="Sunglasses">Sunglasses</option>
                      <option value="Sport Performance">Sport Performance</option>
                      <option value="Contact Lenses">Contact Lenses</option>
                      <option value="Luxury Eyewear">Luxury Eyewear</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-price">Price ($) *</label>
                    <input
                      id="prod-price"
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="185.00"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prod-stock">Stock Quantity *</label>
                  <input
                    id="prod-stock"
                    type="number"
                    className="form-control"
                    placeholder="25"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prod-pic">Image URL</label>
                  <input
                    id="prod-pic"
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.pic}
                    onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    High resolution optical photo link or leave blank for default image.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prod-desc">Description</label>
                  <textarea
                    id="prod-desc"
                    className="form-control"
                    placeholder="Frame materials, lens coating, UV protection specifications..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button id="submit-add-product-btn" type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Post to /api/products/add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
