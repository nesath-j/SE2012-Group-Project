import React, { useState } from 'react';
import { Package, Search, Filter, RefreshCw, FileText, ChevronRight, Tag, Truck, Eye, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { updateOrderStatus, applyOrderDiscount, fetchOrderById } from '../services/api';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];

export default function OrdersView({
  orders,
  loading,
  onRefresh,
  onDispatchOrder,
  onTrackOrder,
  onNotify
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [discountModalOrder, setDiscountModalOrder] = useState(null);
  const [discountInput, setDiscountInput] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesFilter = filterStatus === 'All' || o.orderStatus?.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = searchId.trim() === '' || String(o.orderId).includes(searchId.trim());
    return matchesFilter && matchesSearch;
  });

  // Handle status update via PATCH /api/orders/{id}/status
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      onNotify('success', 'Order Updated', `Order #${orderId} status changed to ${newStatus}.`);
      onRefresh();
    } catch (err) {
      onNotify('error', 'Update Failed', err.message || 'Could not update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle discount update via PATCH /api/orders/{id}/discount
  const handleApplyDiscountSubmit = async (e) => {
    e.preventDefault();
    if (!discountModalOrder) return;
    const disc = parseFloat(discountInput);
    if (isNaN(disc) || disc < 0) {
      onNotify('error', 'Invalid Value', 'Please enter a valid discount amount.');
      return;
    }

    try {
      await applyOrderDiscount(discountModalOrder.orderId, disc);
      onNotify('success', 'Discount Applied', `Loyalty discount of $${disc.toFixed(2)} applied to Order #${discountModalOrder.orderId}.`);
      setDiscountModalOrder(null);
      setDiscountInput('');
      onRefresh();
    } catch (err) {
      onNotify('error', 'Discount Error', err.message || 'Could not apply discount.');
    }
  };

  // Inspect order details via GET /api/orders/{id}
  const handleViewOrder = async (order) => {
    try {
      const res = await fetchOrderById(order.orderId);
      setSelectedOrder(res.data);
    } catch {
      setSelectedOrder(order);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> {status}</span>;
      case 'dispatched':
        return <span className="badge badge-info"><Truck size={12} /> {status}</span>;
      case 'processing':
      case 'confirmed':
        return <span className="badge badge-warning"><Clock size={12} /> {status}</span>;
      case 'cancelled':
        return <span className="badge badge-danger"><AlertCircle size={12} /> {status}</span>;
      default:
        return <span className="badge badge-warning">{status || 'Pending'}</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Top Header */}
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
            Customer Orders Management
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Process optical orders, apply loyalty tier discounts, and dispatch orders to couriers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onRefresh}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={16} className={loading ? 'pulse' : ''} />
            <span>Refresh Orders</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 280px', maxWidth: '400px' }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. 101)..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ width: '100%', height: '40px', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Status:
          </span>
          <button
            onClick={() => setFilterStatus('All')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: filterStatus === 'All' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
              color: filterStatus === 'All' ? '#fff' : '#94a3b8'
            }}
          >
            All ({orders.length})
          </button>
          {ORDER_STATUSES.map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: filterStatus === st ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
                color: filterStatus === st ? '#fff' : '#94a3b8'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div className="pulse" style={{ display: 'inline-block', marginBottom: '12px' }}>
            <Package size={48} color="#0284c7" />
          </div>
          <p>Querying /api/orders from Spring Boot backend...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <Package size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No Orders Found</h3>
          <p style={{ fontSize: '0.9rem' }}>Try clearing filters or checkout items from the catalog.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.6)', borderBottom: '1px solid var(--border-subtle)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px 20px' }}>Order ID</th>
                  <th style={{ padding: '16px 20px' }}>Date</th>
                  <th style={{ padding: '16px 20px' }}>Prescription</th>
                  <th style={{ padding: '16px 20px' }}>Items</th>
                  <th style={{ padding: '16px 20px' }}>Gross Total</th>
                  <th style={{ padding: '16px 20px' }}>Loyalty Disc.</th>
                  <th style={{ padding: '16px 20px' }}>Net Final</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const gross = Number(order.totalAmount || 0);
                  const disc = Number(order.discountAmount || 0);
                  const net = Math.max(gross - disc, 0);
                  const isUpdating = updatingId === order.orderId;

                  return (
                    <tr
                      key={order.orderId}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#38bdf8' }}>
                        #{order.orderId}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Today'}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {order.prescriptionAttached ? (
                          <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600 }}>
                            <FileText size={14} /> Attached
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.82rem' }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>
                        {order.orderItems?.length || 1} item(s)
                      </td>
                      <td style={{ padding: '16px 20px', color: '#94a3b8' }}>
                        ${gross.toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 20px', color: disc > 0 ? '#34d399' : '#64748b' }}>
                        {disc > 0 ? `-$${disc.toFixed(2)}` : '$0.00'}
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 800, color: '#f8fafc', fontSize: '0.98rem' }}>
                        ${net.toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getStatusBadge(order.orderStatus)}
                          {/* Inline Status Dropdown */}
                          <select
                            value={order.orderStatus || 'Pending'}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                            style={{
                              fontSize: '0.75rem',
                              padding: '4px 6px',
                              background: 'rgba(0,0,0,0.5)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            {ORDER_STATUSES.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {/* Apply Discount Button */}
                          <button
                            onClick={() => {
                              setDiscountModalOrder(order);
                              setDiscountInput(String(order.discountAmount || ''));
                            }}
                            className="btn-icon"
                            title="Apply Loyalty Discount (PATCH /api/orders/{id}/discount)"
                          >
                            <Tag size={15} color="#34d399" />
                          </button>

                          {/* Dispatch Courier Button */}
                          <button
                            onClick={() => onDispatchOrder(order)}
                            className="btn-icon"
                            title="Dispatch Order to Courier (POST /api/deliveries/dispatch)"
                          >
                            <Truck size={15} color="#38bdf8" />
                          </button>

                          {/* View Order Modal Button */}
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="btn-icon"
                            title="View Full Order Items (GET /api/orders/{id})"
                          >
                            <Eye size={15} />
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

      {/* Order Details Modal (GET /api/orders/{id}) */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '6px' }}>Spring Boot Order</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Order Details #{selectedOrder.orderId}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn-icon">✕</button>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              fontSize: '0.85rem'
            }}>
              <div>
                <div style={{ color: '#94a3b8' }}>Order Status:</div>
                <div style={{ marginTop: '4px' }}>{getStatusBadge(selectedOrder.orderStatus)}</div>
              </div>
              <div>
                <div style={{ color: '#94a3b8' }}>Prescription:</div>
                <strong style={{ color: selectedOrder.prescriptionAttached ? '#34d399' : '#94a3b8' }}>
                  {selectedOrder.prescriptionAttached ? '✓ Attached' : 'None'}
                </strong>
              </div>
              <div>
                <div style={{ color: '#94a3b8' }}>Order Date:</div>
                <strong>{selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString() : 'N/A'}</strong>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Order Items:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {(selectedOrder.orderItems || []).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.88rem'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600 }}>{item.name || `Eyewear Item #${item.orderItemId || idx + 1}`}</span>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Qty: {item.quantity} × ${Number(item.unitPrice).toFixed(2)}</div>
                  </div>
                  <strong style={{ color: '#38bdf8' }}>
                    ${(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem' }}>
                <span>Gross Subtotal:</span>
                <span>${Number(selectedOrder.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontSize: '0.9rem' }}>
                <span>Loyalty Discount:</span>
                <span>-${Number(selectedOrder.discountAmount || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginTop: '8px' }}>
                <span>Net Total:</span>
                <span style={{ color: '#38bdf8' }}>
                  ${Math.max(Number(selectedOrder.totalAmount || 0) - Number(selectedOrder.discountAmount || 0), 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  const o = selectedOrder;
                  setSelectedOrder(null);
                  onDispatchOrder(o);
                }}
                className="btn-primary"
              >
                <Truck size={16} /> Dispatch for Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Discount Modal (PATCH /api/orders/{id}/discount) */}
      {discountModalOrder && (
        <div className="modal-overlay" onClick={() => setDiscountModalOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Apply Loyalty Discount</h3>
              <button onClick={() => setDiscountModalOrder(null)} className="btn-icon">✕</button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '20px' }}>
              Updating discount for <strong>Order #{discountModalOrder.orderId}</strong>. Calls domain business logic <code style={{ color: '#38bdf8' }}>order.applyLoyaltyDiscount()</code>.
            </p>

            <form onSubmit={handleApplyDiscountSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                  Discount Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={discountModalOrder.totalAmount}
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  placeholder="e.g. 25.00"
                  required
                  style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setDiscountModalOrder(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
