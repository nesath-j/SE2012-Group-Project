import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  PlusCircle, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  PowerOff, 
  RotateCcw, 
  Save, 
  Terminal,
  PackagePlus
} from 'lucide-react';
import { adminApi, productsApi } from '../api/api';

export default function AdminDashboard({ onNotify, onProductAdded }) {
  const [activeAdminTab, setActiveAdminTab] = useState('users');

  // Sample Users state for user account management
  const [userList, setUserList] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Member', status: 'Active' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', role: 'Member', status: 'Active' },
    { id: 3, name: 'Dr. Nimal Perera', email: 'nimal.doc@visionexpress.com', role: 'Doctor', status: 'Active' },
    { id: 4, name: 'Alex Morgan', email: 'alex.m@optical.com', role: 'Employee', status: 'Inactive_Employee' }
  ]);

  const [targetUserId, setTargetUserId] = useState('');
  const [customAction, setCustomAction] = useState('DEACTIVATE');
  const [apiResponseLog, setApiResponseLog] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Payment configuration state
  const [paymentConfig, setPaymentConfig] = useState({
    gateway: 'Stripe Direct',
    merchantId: 'acct_1Nx82VisionExpress',
    currency: 'USD',
    environment: 'Sandbox / Test',
    enable3DSecure: true,
    webhookSecret: 'whsec_9b2e3f4a180c',
    taxCalculation: 'Automated 7.5%'
  });
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  // Add Product State (POST /api/products/add)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Frames',
    price: '',
    stock_quantity: 25,
    description: '',
    pic: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80'
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Handle User Account Management via POST /api/admin/users/{userId}/manage?action=...
  const handleManageUser = async (userId, action) => {
    setIsProcessingAction(true);
    try {
      const res = await adminApi.manageUserAccount(userId, action);
      setApiResponseLog(`[${new Date().toLocaleTimeString()}] HTTP 200: ${res.message}`);
      
      // Update local state list
      setUserList(prev => {
        if (action === 'DELETE') {
          return prev.filter(u => u.id !== userId);
        } else if (action === 'DEACTIVATE') {
          return prev.map(u => u.id === userId ? { ...u, status: 'Inactive' } : u);
        } else if (action === 'ACTIVATE') {
          return prev.map(u => u.id === userId ? { ...u, status: 'Active' } : u);
        }
        return prev;
      });

      onNotify('success', 'Admin Action Executed', res.message);
    } catch (err) {
      setApiResponseLog(`[${new Date().toLocaleTimeString()}] ERROR: ${err.message}`);
      onNotify('error', 'Action Failed', err.message);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handle Payment System Configuration via POST /api/admin/payment-config
  const handleSavePaymentConfig = async (e) => {
    e.preventDefault();
    setIsSavingPayment(true);
    try {
      const configPayload = JSON.stringify(paymentConfig, null, 2);
      const res = await adminApi.configurePaymentSystem(configPayload);
      setApiResponseLog(`[${new Date().toLocaleTimeString()}] Payment Config Response: ${res.message}`);
      onNotify('success', 'Payment Configuration Stored', res.message);
    } catch (err) {
      onNotify('error', 'Payment Config Error', err.message);
    } finally {
      setIsSavingPayment(false);
    }
  };

  // Handle Add Product via POST /api/products/add
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      onNotify('error', 'Validation Error', 'Name and Price are required.');
      return;
    }

    setIsAddingProduct(true);
    try {
      const res = await productsApi.addProduct(newProduct);
      if (res.success) {
        onNotify('success', 'Product Published', `Added ${newProduct.name} to catalog via Spring Boot ProductController.`);
        if (onProductAdded) onProductAdded(res.product);
        setNewProduct({
          name: '',
          category: 'Frames',
          price: '',
          stock_quantity: 20,
          description: '',
          pic: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'
        });
      }
    } catch (err) {
      onNotify('error', 'Product Creation Failed', err.message);
    } finally {
      setIsAddingProduct(false);
    }
  };

  return (
    <section className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="#38bdf8" />
          <span className="section-pretitle">Administrative Controls</span>
        </div>
        <h2 className="section-title">Optical System Administration</h2>
        <p className="section-subtitle">
          Direct management of backend endpoints: <code style={{ color: '#38bdf8' }}>AdminController</code> (User lifecycle & Payment configurations) and <code style={{ color: '#38bdf8' }}>ProductController</code> (Inventory insertion).
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Sidebar Tabs */}
        <div className="dashboard-sidebar">
          <button 
            className={`sidebar-tab-btn ${activeAdminTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('users')}
          >
            <Users size={18} />
            <span>Manage User Accounts</span>
          </button>

          <button 
            className={`sidebar-tab-btn ${activeAdminTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('payment')}
          >
            <CreditCard size={18} />
            <span>Payment System Config</span>
          </button>

          <button 
            className={`sidebar-tab-btn ${activeAdminTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('products')}
          >
            <PackagePlus size={18} />
            <span>Add Catalog Product</span>
          </button>

          {/* Live API Console Log Box */}
          <div className="glass-card" style={{ padding: '16px', marginTop: '16px', background: '#050811' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
              <Terminal size={14} color="#10b981" />
              <span>Spring Boot Console Feedback</span>
            </div>
            <pre style={{ fontSize: '0.72rem', color: '#34d399', whiteSpace: 'pre-wrap', maxHeight: '140px', overflowY: 'auto' }}>
              {apiResponseLog || 'Awaiting API interactions...'}
            </pre>
          </div>
        </div>

        {/* Content Tabs */}
        <div>
          {/* TAB 1: User Account Lifecycle (POST /api/admin/users/{userId}/manage?action=...) */}
          {activeAdminTab === 'users' && (
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem' }}>User Account Management</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    Invokes <code style={{ color: '#38bdf8' }}>POST /api/admin/users/{`{userId}`}/manage?action=ACTIVATE|DEACTIVATE|DELETE</code>
                  </p>
                </div>
              </div>

              {/* Direct ID Action Dispatcher */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '140px' }}>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Target User ID</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="e.g. 1" 
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                  />
                </div>

                <div style={{ flex: 1, minWidth: '140px' }}>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Action</label>
                  <select 
                    className="input-field"
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value)}
                  >
                    <option value="DEACTIVATE">DEACTIVATE</option>
                    <option value="ACTIVATE">ACTIVATE</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                <button 
                  className="btn-primary" 
                  disabled={!targetUserId || isProcessingAction}
                  onClick={() => handleManageUser(parseInt(targetUserId), customAction)}
                >
                  <span>Dispatch Action</span>
                </button>
              </div>

              {/* User Accounts Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                      <th style={{ padding: '12px' }}>ID</th>
                      <th style={{ padding: '12px' }}>Name & Email</th>
                      <th style={{ padding: '12px' }}>Role</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px', fontWeight: 700 }}>#{u.id}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{u.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span className="badge badge-blue">{u.role}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span className={`badge ${u.status === 'Active' ? 'badge-green' : 'badge-amber'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            {u.status === 'Active' ? (
                              <button 
                                className="btn-secondary" 
                                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                                title="Deactivate Account"
                                onClick={() => handleManageUser(u.id, 'DEACTIVATE')}
                              >
                                <PowerOff size={14} color="#f59e0b" />
                                <span>Deactivate</span>
                              </button>
                            ) : (
                              <button 
                                className="btn-secondary" 
                                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                                title="Activate Account"
                                onClick={() => handleManageUser(u.id, 'ACTIVATE')}
                              >
                                <RotateCcw size={14} color="#10b981" />
                                <span>Activate</span>
                              </button>
                            )}
                            <button 
                              className="btn-danger" 
                              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                              title="Delete Account"
                              onClick={() => handleManageUser(u.id, 'DELETE')}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Payment Configuration (POST /api/admin/payment-config) */}
          {activeAdminTab === 'payment' && (
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.3rem' }}>Payment Gateway Configuration</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  Invokes <code style={{ color: '#38bdf8' }}>POST /api/admin/payment-config</code> with string payload.
                </p>
              </div>

              <form onSubmit={handleSavePaymentConfig}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Payment Gateway Provider</label>
                    <select 
                      className="input-field"
                      value={paymentConfig.gateway}
                      onChange={(e) => setPaymentConfig({...paymentConfig, gateway: e.target.value})}
                    >
                      <option value="Stripe Direct">Stripe Direct Connect</option>
                      <option value="PayPal Commerce">PayPal Commerce Platform</option>
                      <option value="Authorize.Net">Authorize.Net AIM</option>
                      <option value="Square Optical">Square Optical Payments</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Operational Mode</label>
                    <select 
                      className="input-field"
                      value={paymentConfig.environment}
                      onChange={(e) => setPaymentConfig({...paymentConfig, environment: e.target.value})}
                    >
                      <option value="Sandbox / Test">Sandbox / Test Mode</option>
                      <option value="Live / Production">Live / Production</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Merchant Account ID</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={paymentConfig.merchantId}
                      onChange={(e) => setPaymentConfig({...paymentConfig, merchantId: e.target.value})}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Settlement Currency</label>
                    <select 
                      className="input-field"
                      value={paymentConfig.currency}
                      onChange={(e) => setPaymentConfig({...paymentConfig, currency: e.target.value})}
                    >
                      <option value="USD">USD ($ - United States Dollar)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                      <option value="LKR">LKR (Rs - Sri Lankan Rupee)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Webhook Signing Secret</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    value={paymentConfig.webhookSecret}
                    onChange={(e) => setPaymentConfig({...paymentConfig, webhookSecret: e.target.value})}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={paymentConfig.enable3DSecure}
                      onChange={(e) => setPaymentConfig({...paymentConfig, enable3DSecure: e.target.checked})}
                    />
                    <span style={{ fontSize: '0.9rem', color: '#ffffff' }}>Enforce 3D-Secure 2.0 Strong Customer Authentication (SCA)</span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-primary" disabled={isSavingPayment}>
                    <Save size={16} />
                    <span>{isSavingPayment ? 'Saving Configuration...' : 'Save Payment Configuration'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Add Product (POST /api/products/add) */}
          {activeAdminTab === 'products' && (
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.3rem' }}>Register New Optical Product</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  Invokes Spring Boot <code style={{ color: '#38bdf8' }}>POST /api/products/add</code> to save product entity in database.
                </p>
              </div>

              <form onSubmit={handleAddProductSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Product Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      required 
                      placeholder="e.g. Prada Linear Titanium (Frames)"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Category</label>
                    <select 
                      className="input-field"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option value="Frames">Frames</option>
                      <option value="Sunglasses">Sunglasses</option>
                      <option value="Lenses">Lenses</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Retail Price ($ USD)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="input-field" 
                      required 
                      placeholder="189.00"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Initial Stock Quantity</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={newProduct.stock_quantity}
                      onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Image URL</label>
                  <input 
                    type="url" 
                    className="input-field" 
                    placeholder="https://..."
                    value={newProduct.pic}
                    onChange={(e) => setNewProduct({...newProduct, pic: e.target.value})}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Product Description</label>
                  <textarea 
                    className="input-field" 
                    rows="3" 
                    placeholder="Detailed lens specs, frame material, UV rating..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-primary" disabled={isAddingProduct}>
                    <PlusCircle size={16} />
                    <span>{isAddingProduct ? 'Adding via API...' : 'Add Product to Spring Boot'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
