import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersApi, staffApi } from '../services/api';
import {
  Package,
  FileText,
  Upload,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Calendar,
  CreditCard,
  User,
  ShieldCheck,
  ChevronDown,
  X
} from 'lucide-react';

export default function MyOrders({ onNavigateShop }) {
  const { user, role, showToast, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState(null);
  const [slipFile, setSlipFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState({});

  useEffect(() => {
    if (user && role === 'MEMBER') {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user, role]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackDelivery = async (orderId) => {
    try {
      const info = await staffApi.trackDelivery(orderId);
      setTrackingInfo(prev => ({ ...prev, [orderId]: info }));
      showToast(info, 'info');
    } catch (err) {
      showToast('Delivery tracking details unavailable.', 'error');
    }
  };

  const handleUploadPaymentSlip = async (e) => {
    e.preventDefault();
    if (!selectedOrderForSlip || !slipFile) {
      showToast('Please select a payment slip document or image.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      await ordersApi.uploadPaymentSlip(selectedOrderForSlip.orderId, slipFile);
      showToast(`Payment slip uploaded for Order #${selectedOrderForSlip.orderId}. Awaiting Admin confirmation!`, 'success');
      setSelectedOrderForSlip(null);
      setSlipFile(null);
      loadOrders();
    } catch (err) {
      showToast(err.message || 'Payment slip upload failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontSize: '0.825rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#0284c7',
          marginBottom: '0.25rem',
        }}>
          Member Orders & Fulfillment
        </div>
        <h2>My Optical Orders & Tracking</h2>
        <p style={{ maxWidth: '650px', fontSize: '0.95rem' }}>
          Monitor your eyewear orders, upload bank deposit receipts, track courier shipments (DHL, FedEx, UPS), and review loyalty points credited.
        </p>
      </div>

      {!user ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}>
          <User size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3>Please Log In as a Member</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Only authenticated members can view personal order records and submit payment slips.
          </p>
          <button
            onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
            className="btn btn-primary"
          >
            Sign In
          </button>
        </div>
      ) : role !== 'MEMBER' ? (
        <div style={{
          padding: '3rem 2rem',
          backgroundColor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '20px',
          textAlign: 'center',
          color: '#92400e',
          maxWidth: '650px',
          margin: '0 auto',
        }}>
          <AlertCircle size={40} style={{ marginBottom: '1rem', color: '#d97706' }} />
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Staff Account Active ({role})</h3>
          <p style={{ marginBottom: '1.5rem', color: '#b45309', lineHeight: 1.6 }}>
            Personal order history is reserved for registered Customer Members. As a staff member, you can oversee customer orders, dispatch deliveries, or confirm payments in the Staff Workspace.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={onNavigateShop}
              className="btn btn-secondary btn-sm"
            >
              Browse Eyewear Catalog
            </button>
          </div>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <span className="spinner spinner-primary" style={{ width: '32px', height: '32px' }} />
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px dashed #cbd5e1',
        }}>
          <Package size={44} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
          <h3>No Orders Placed Yet</h3>
          <p style={{ color: '#64748b', marginBottom: '1.25rem' }}>
            Browse our optical collection and place your first eyewear order today.
          </p>
          <button
            onClick={onNavigateShop}
            className="btn btn-primary btn-sm"
          >
            Explore Frames
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const isConfirmed = order.paymentStatus === 'CONFIRMED';
            const isPending = order.paymentStatus === 'PENDING';
            const isToBeConfirmed = order.paymentStatus === 'TO_BE_CONFIRMED';
            const isRejected = order.paymentStatus === 'REJECTED';

            return (
              <div
                key={order.orderId}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Order Meta Header */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #f1f5f9',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Package size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.15rem' }}>Order #{order.orderId}</h4>
                      <div style={{ fontSize: '0.785rem', color: '#64748b' }}>
                        Placed on {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className={`badge ${
                      isConfirmed ? 'badge-emerald' : isToBeConfirmed ? 'badge-primary' : isRejected ? 'badge-rose' : 'badge-amber'
                    }`}>
                      Payment: {order.paymentStatus || 'PENDING'}
                    </span>

                    <span className="badge badge-silver">
                      Status: {order.orderStatus || 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(order.orderItems || []).map((item, idx) => (
                    <div
                      key={item.orderItemId || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                      }}
                    >
                      <div>
                        <strong>{item.product?.name || `Product ID #${item.product?.productId || 'Item'}`}</strong>
                        <div style={{ fontSize: '0.785rem', color: '#64748b' }}>
                          Quantity: {item.quantity} × ${(item.unitPrice || item.product?.price || 100).toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        ${((item.quantity || 1) * (item.unitPrice || item.product?.price || 100)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary & Loyalty Indicator */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                }}>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div>
                      Total Amount: <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>${order.totalAmount?.toFixed(2)}</strong>
                    </div>
                    {order.loyaltyPointsAwarded && (
                      <div style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                        <ShieldCheck size={16} />
                        <span>Loyalty Points Awarded (+{Math.floor(order.totalAmount / 100)} pts)</span>
                      </div>
                    )}
                  </div>

                  {/* Actions: Upload Slip or Track Delivery */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {(isPending || isRejected) && (
                      <button
                        onClick={() => setSelectedOrderForSlip(order)}
                        className="btn btn-primary btn-sm"
                      >
                        <Upload size={16} />
                        <span>Upload Payment Slip</span>
                      </button>
                    )}

                    {isToBeConfirmed && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.825rem',
                        color: '#0284c7',
                        fontWeight: 600,
                        backgroundColor: '#f0f9ff',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '9999px',
                        border: '1px solid #bae6fd',
                      }}>
                        <Clock size={16} />
                        <span>Slip Submitted - Pending Admin Review</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleTrackDelivery(order.orderId)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Truck size={16} />
                      <span>Track Shipment</span>
                    </button>
                  </div>
                </div>

                {/* Tracking Drawer / Status */}
                {trackingInfo[order.orderId] && (
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    fontSize: '0.85rem',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}>
                    <Truck size={18} />
                    <span>{trackingInfo[order.orderId]}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Slip Upload Modal */}
      {selectedOrderForSlip && (
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
            maxWidth: '480px',
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
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
                Upload Bank Slip for Order #{selectedOrderForSlip.orderId}
              </h3>
              <button
                onClick={() => setSelectedOrderForSlip(null)}
                style={{ color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadPaymentSlip} style={{ padding: '1.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
                Please attach your bank deposit receipt, wire slip, or online transfer confirmation. Once submitted, our administrators will confirm the transfer and credit your loyalty reward points.
              </p>

              <div className="form-group">
                <label className="form-label">Payment Slip File (PDF, PNG, JPG)</label>
                <input
                  type="file"
                  required
                  accept="image/*,application/pdf"
                  onChange={(e) => setSlipFile(e.target.files[0])}
                  className="form-input"
                  style={{ padding: '0.5rem' }}
                />
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.8rem',
                color: '#64748b',
                marginBottom: '1.5rem',
              }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Backend Target: </span>
                <code>POST /api/orders/{'{orderId}'}/payment-slip</code>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {isUploading ? <span className="spinner" /> : (
                  <>
                    <Upload size={18} />
                    <span>Submit Payment Receipt</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
