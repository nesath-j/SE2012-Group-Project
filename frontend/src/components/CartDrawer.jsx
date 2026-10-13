import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../services/api';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  FileCheck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function CartDrawer({ onNavigateOrders }) {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    user,
    role,
    showToast,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useAuth();

  const [prescriptionAttached, setPrescriptionAttached] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isCartOpen) return null;

  // Calculate discount if member has a tier discount
  const discountRate = user?.discountPercentage ? user.discountPercentage / 100 : 0;
  const discountAmount = Number((cartTotal * discountRate).toFixed(2));
  const finalTotal = Number((cartTotal - discountAmount).toFixed(2));

  const handleCheckout = async () => {
    if (!user) {
      showToast('Please log in as a Member to place your order.', 'info');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    if (role !== 'MEMBER') {
      showToast('Only Members can place optical orders. Please switch to a Member persona.', 'error');
      return;
    }

    if (!cart.length) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        orderItems: cart.map(item => ({
          product: { productId: item.product.productId },
          quantity: item.quantity,
        })),
        prescriptionAttached,
      };

      const result = await ordersApi.create(orderPayload);
      setCreatedOrder(result);
      clearCart();
      showToast(`Order #${result.orderId} created successfully!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to create order.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 2000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.2)',
        position: 'relative',
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              background: '#e0f2fe',
              color: '#0284c7',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Shopping Cart</h3>
              <p style={{ fontSize: '0.775rem', margin: 0, color: '#64748b' }}>
                {cart.length} unique item{cart.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => { setIsCartOpen(false); setCreatedOrder(null); }}
            style={{
              color: '#64748b',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {createdOrder ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#d1fae5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h3>Order Successfully Placed!</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                Your order <strong>#{createdOrder.orderId}</strong> is now registered. Please submit your bank payment receipt in the Orders portal to initiate optical processing & courier dispatch.
              </p>

              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                width: '100%',
                textAlign: 'left',
                fontSize: '0.875rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#64748b' }}>Order Number:</span>
                  <strong>#{createdOrder.orderId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#64748b' }}>Payment Status:</span>
                  <span className="badge badge-amber">{createdOrder.paymentStatus || 'PENDING'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Final Total:</span>
                  <strong style={{ color: '#0284c7' }}>${(createdOrder.totalAmount || finalTotal).toFixed(2)}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCreatedOrder(null);
                  if (onNavigateOrders) onNavigateOrders();
                }}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Go to My Orders & Upload Slip <ArrowRight size={16} />
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#94a3b8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <ShoppingBag size={48} strokeWidth={1.5} />
              <p style={{ fontSize: '1rem', color: '#64748b' }}>Your optical shopping bag is currently empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn btn-outline btn-sm"
              >
                Browse Frames & Lenses
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item) => (
                <div
                  key={item.product.productId}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <img
                    src={item.product.pic}
                    alt={item.product.name}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: '#f1f5f9',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontSize: '0.925rem',
                      fontWeight: 600,
                      marginBottom: '0.2rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.product.name}
                    </h4>
                    <span className="badge badge-primary" style={{ fontSize: '0.675rem', marginBottom: '0.4rem' }}>
                      {item.product.category}
                    </span>
                    <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a' }}>
                      ${item.product.price.toFixed(2)}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}>
                    <button
                      onClick={() => removeFromCart(item.product.productId)}
                      style={{ color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}>
                      <button
                        onClick={() => updateCartQuantity(item.product.productId, -1)}
                        style={{ padding: '0.2rem 0.4rem', cursor: 'pointer', background: '#f8fafc' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0.1rem 0.5rem', fontSize: '0.825rem', fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.productId, 1)}
                        style={{ padding: '0.2rem 0.4rem', cursor: 'pointer', background: '#f8fafc' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Prescription Attachment Toggle */}
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                marginTop: '0.5rem',
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}>
                  <input
                    type="checkbox"
                    checked={prescriptionAttached}
                    onChange={(e) => setPrescriptionAttached(e.target.checked)}
                    style={{ marginTop: '0.2rem' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: '#0369a1' }}>Attach Stored Prescription</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Optical technicians will craft lenses according to your verified doctor prescription file.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer / Checkout Summary */}
        {!createdOrder && cart.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              <span style={{ color: '#64748b' }}>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            {discountRate > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem', color: '#059669' }}>
                <span>Loyalty Discount ({user.tier} - {user.discountPercentage}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#0f172a',
              paddingTop: '0.65rem',
              borderTop: '1px solid #e2e8f0',
              marginBottom: '1rem',
            }}>
              <span>Final Total:</span>
              <span style={{ color: '#0284c7' }}>${finalTotal.toFixed(2)}</span>
            </div>

            {role !== 'MEMBER' && user && (
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                color: '#92400e',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.775rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <ShieldAlert size={16} />
                <span>Backend requirement: Switch to Member role to place orders.</span>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {isSubmitting ? <span className="spinner" /> : (
                <>
                  <CreditCard size={18} />
                  <span>Place Order (${finalTotal.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
