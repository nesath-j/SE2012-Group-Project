import React, { useState } from 'react';
import { Layers, Plus, Search, Edit3, Trash2, RefreshCw, AlertTriangle, CheckCircle2, PackageCheck, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';
import { createProduct, updateProduct, deleteProduct, updateStock } from '../services/api';

const PRODUCT_CATEGORIES = [
  'Sunglasses',
  'Prescription Glasses',
  'Designer Frames',
  'Blue Light Blocking',
  'Contact Lenses',
  'Accessories'
];

export default function InventoryAdmin({
  products,
  loading,
  onRefresh,
  onNotify
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Prescription Glasses',
    price: '',
    stockQuantity: '',
    description: '',
    pic: ''
  });

  const [saving, setSaving] = useState(false);

  // Stock update loading tracker
  const [stockUpdatingId, setStockUpdatingId] = useState(null);

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery.trim() ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'All' || p.category?.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Inventory stats
  const totalItems = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (Number(p.stockQuantity) || 0), 0);
  const lowStockCount = products.filter(p => Number(p.stockQuantity) <= 10).length;
  const outOfStockCount = products.filter(p => Number(p.stockQuantity) <= 0).length;

  const openAddModal = () => {
    setFormData({
      name: '',
      category: 'Prescription Glasses',
      price: '',
      stockQuantity: '',
      description: '',
      pic: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80'
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || 'Prescription Glasses',
      price: String(product.price || ''),
      stockQuantity: String(product.stockQuantity || ''),
      description: product.description || '',
      pic: product.pic || ''
    });
  };

  // Add Product Submit (POST /api/products/add)
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        description: formData.description.trim(),
        pic: formData.pic.trim()
      };

      await createProduct(payload);
      onNotify('success', 'Product Created', `Added "${payload.name}" to inventory.`);
      setIsAddModalOpen(false);
      onRefresh();
    } catch (err) {
      onNotify('error', 'Add Failed', err.message || 'Could not save product.');
    } finally {
      setSaving(false);
    }
  };

  // Update Product Submit (PUT /api/products/update/{id})
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        description: formData.description.trim(),
        pic: formData.pic.trim()
      };

      await updateProduct(editingProduct.productId, payload);
      onNotify('success', 'Product Updated', `Saved changes to "${payload.name}".`);
      setEditingProduct(null);
      onRefresh();
    } catch (err) {
      onNotify('error', 'Update Failed', err.message || 'Could not update product.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Product Submit (DELETE /api/products/delete/{id})
  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.productId);
      onNotify('success', 'Product Deleted', `Removed "${deletingProduct.name}" from catalog.`);
      setDeletingProduct(null);
      onRefresh();
    } catch (err) {
      onNotify('error', 'Delete Failed', err.message || 'Could not delete product.');
    }
  };

  // Quick Stock Update (PATCH /api/products/{id}/stock?qty=...)
  const handleQuickStock = async (product, delta) => {
    const current = Number(product.stockQuantity) || 0;
    const nextQty = Math.max(current + delta, 0);
    setStockUpdatingId(product.productId);
    try {
      await updateStock(product.productId, nextQty);
      onNotify('success', 'Stock Adjusted', `${product.name} stock changed to ${nextQty}.`);
      onRefresh();
    } catch (err) {
      onNotify('error', 'Stock Error', err.message || 'Failed to update stock quantity.');
    } finally {
      setStockUpdatingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            Eyewear & Product Catalog Admin
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Manage optical inventory, adjust stock levels via PATCH /api/products/{'{id}'}/stock, and add designer frames.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onRefresh} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={15} className={loading ? 'pulse' : ''} />
            <span>Reload</span>
          </button>
          <button onClick={openAddModal} className="btn-primary">
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8', marginBottom: '8px' }}>
            <Layers size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Total SKUs</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalItems}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Active optical catalog models</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399', marginBottom: '8px' }}>
            <PackageCheck size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Units in Stock</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalStockUnits}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Across all categories</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fbbf24', marginBottom: '8px' }}>
            <AlertTriangle size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Low Stock Notice</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: lowStockCount > 0 ? '#fbbf24' : '#f8fafc' }}>
            {lowStockCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Items with ≤ 10 units</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fb7185', marginBottom: '8px' }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Out of Stock</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: outOfStockCount > 0 ? '#fb7185' : '#f8fafc' }}>
            {outOfStockCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Require supplier reorder</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: '40px', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', alignItems: 'center' }}>
          <button
            onClick={() => setFilterCategory('All')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: filterCategory === 'All' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
              color: filterCategory === 'All' ? '#fff' : '#94a3b8'
            }}
          >
            All
          </button>
          {PRODUCT_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: filterCategory === cat ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
                color: filterCategory === cat ? '#fff' : '#94a3b8'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <Layers size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No Inventory Records Found</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Try searching another keyword or click "Add New Product" to populate the database.</p>
          <button onClick={openAddModal} className="btn-primary">Add Product</button>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.6)', borderBottom: '1px solid var(--border-subtle)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px 20px' }}>Item & Image</th>
                  <th style={{ padding: '16px 20px' }}>Category</th>
                  <th style={{ padding: '16px 20px' }}>Price</th>
                  <th style={{ padding: '16px 20px' }}>Stock Quantity (PATCH)</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const isLow = Number(p.stockQuantity) <= 10 && Number(p.stockQuantity) > 0;
                  const isOut = Number(p.stockQuantity) <= 0;
                  const isStockUpdating = stockUpdatingId === p.productId;

                  return (
                    <tr
                      key={p.productId}
                      style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={p.pic || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'}
                            alt={p.name}
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: '#0f172a' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: #{p.productId}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span className="badge badge-info">{p.category}</span>
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 800, color: '#38bdf8', fontSize: '1rem' }}>
                        ${Number(p.price).toFixed(2)}
                      </td>

                      {/* Stock Quantity with Quick PATCH buttons */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleQuickStock(p, -1)}
                            disabled={isStockUpdating || isOut}
                            className="btn-icon"
                            style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                            title="Decrement stock (-1)"
                          >
                            -
                          </button>
                          <span style={{
                            fontWeight: 800,
                            minWidth: '36px',
                            textAlign: 'center',
                            fontSize: '0.95rem',
                            color: isOut ? '#fb7185' : isLow ? '#fbbf24' : '#34d399'
                          }}>
                            {p.stockQuantity}
                          </span>
                          <button
                            onClick={() => handleQuickStock(p, +1)}
                            disabled={isStockUpdating}
                            className="btn-icon"
                            style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                            title="Increment stock (+1)"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleQuickStock(p, +10)}
                            disabled={isStockUpdating}
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(255,255,255,0.06)',
                              color: '#94a3b8'
                            }}
                            title="Restock +10"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        {isOut ? (
                          <span className="badge badge-danger">Out of Stock</span>
                        ) : isLow ? (
                          <span className="badge badge-warning">Low Stock</span>
                        ) : (
                          <span className="badge badge-success">Sufficient</span>
                        )}
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => openEditModal(p)}
                            className="btn-icon"
                            title="Edit Product (PUT /api/products/update/{id})"
                          >
                            <Edit3 size={15} color="#38bdf8" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(p)}
                            className="btn-icon"
                            title="Delete Product (DELETE /api/products/delete/{id})"
                          >
                            <Trash2 size={15} color="#fb7185" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal (POST /api/products/add) */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '6px' }}>Spring Boot REST API</span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Add Optical Product</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="btn-icon">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ray-Ban Wayfarer Polarized"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', height: '42px' }}
                  >
                    {PRODUCT_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Unit Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="185.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Initial Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="20"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.pic}
                  onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Product Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Handcrafted acetate optical frames with anti-reflective coating..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Adding to DB...' : 'Create Product (POST /api/products/add)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal (PUT /api/products/update/{id}) */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '6px' }}>Update Record</span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Edit Product #{editingProduct.productId}</h2>
              </div>
              <button onClick={() => setEditingProduct(null)} className="btn-icon">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', height: '42px' }}
                  >
                    {PRODUCT_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Unit Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.pic}
                  onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Product Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Updating...' : 'Save Changes (PUT)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (DELETE /api/products/delete/{id}) */}
      {deletingProduct && (
        <div className="modal-overlay" onClick={() => setDeletingProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fb7185', marginBottom: '16px' }}>
              <AlertTriangle size={28} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Confirm Deletion</h3>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: '#f8fafc' }}>"{deletingProduct.name}"</strong> (ID #{deletingProduct.productId}) from the catalog? This calls <code style={{ color: '#fb7185' }}>DELETE /api/products/delete/{deletingProduct.productId}</code>.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeletingProduct(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
