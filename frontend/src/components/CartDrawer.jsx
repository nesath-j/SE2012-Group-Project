import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, FileText, CheckCircle2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { createOrder } from '../services/api';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  onNotify
}) {
  const [prescriptionAttached, setPrescriptionAttached] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalDiscount = Math.min(Number(discountValue) || 0, subtotal);
  const finalTotal = Math.max(subtotal - finalDiscount, 0);

  const applyPromoCode = (e) => {
    e.preventDefault();
    const code = discountCode.trim().toUpperCase();
    if (code === 'VISION20' || code === 'LOYALTY20') {
      const disc = Math.round(subtotal * 0.20 * 100) / 100;
      setDiscountValue(disc);
      onNotify('success', 'Promo Applied', `20% Loyalty discount ($${disc.toFixed(2)}) applied!`);
    } else if (code === 'VISION10') {
      const disc = Math.round(subtotal * 0.10 * 100) / 100;
      setDiscountValue(disc);
      onNotify('success', 'Promo Applied', `10% First Order discount ($${disc.toFixed(2)}) applied!`);
    } else if (code === 'FREESHIP') {
      setDiscountValue(15);
      onNotify('success', 'Promo Applied', '$15 Shipping credit applied!');
    } else {
      onNotify('error', 'Invalid Code', 'Try promo codes: VISION20 or VISION10');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      // Build order payload matching backend com.VisionExpress.demo.model.Order
      const payload = {
        orderDate: new Date().toISOString(),
        totalAmount: subtotal,
        discountAmount: finalDiscount,
        orderStatus: 'Processing',
        prescriptionAttached: prescriptionAttached,
        orderItems: cartItems.map(item => ({
          quantity: item.quantity,
          unitPrice: item.price
        }))
      };

      const res = await createOrder(payload);
      setPlacedOrder(res.data);
      onClearCart();
      onNotify('success', 'Order Created', `Order #${res.data.orderId} successfully registered with VisionExpress API.`);
    } catch (err) {
      onNotify('error', 'Checkout Failed', err.message || 'Unable to place order at this time.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100vh',
          borderRadius: '24px 0 0 24px',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.96)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid var(--border-active)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.6)',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="#38bdf8" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Your Optical Cart</h2>
            <span className="badge badge-info">{cartItems.length} items</span>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Placed Order Success Modal Inside Drawer */}
        {placedOrder ? (
          <div style={{ padding: '32px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#34d399'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
              Order Confirmed!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '24px' }}>
              Your order has been registered into the VisionExpress Spring Boot database.
            </p>

            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: '#94a3b8' }}>Order Number:</span>
                <strong style={{ color: '#38bdf8' }}>#{placedOrder.orderId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: '#94a3b8' }}>Status:</span>
                <span className="badge badge-warning">{placedOrder.orderStatus || 'Processing'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: '#94a3b8' }}>Prescription:</span>
                <span style={{ color: placedOrder.prescriptionAttached ? '#34d399' : '#94a3b8' }}>
                  {placedOrder.prescriptionAttached ? '✓ Attached' : 'None Attached'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: 700 }}>Final Total:</span>
                <strong style={{ fontSize: '1.2rem', color: '#10b981' }}>
                  ${(Number(placedOrder.totalAmount) - Number(placedOrder.discountAmount || 0)).toFixed(2)}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  onOrderPlaced(placedOrder, 'delivery');
                  onClose();
                }}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Dispatch with Courier Now <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  onOrderPlaced(placedOrder, 'orders');
                  onClose();
                }}
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                View in Orders Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Drawer Body: Items list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '1rem', marginBottom: '8px' }}>Your optical cart is empty</p>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Explore our catalog to add designer frames or contact lenses.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cartItems.map(item => (
                    <div
                      key={item.productId}
                      style={{
                        display: 'flex',
                        gap: '14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '14px',
                        padding: '12px'
                      }}
                    >
                      <img
                        src={item.pic || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'}
                        alt={item.name}
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                          background: '#0f172a'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400, marginLeft: '6px' }}>
                            (${item.price.toFixed(2)} ea)
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(0,0,0,0.4)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-subtle)'
                          }}>
                            <button
                              onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                              style={{ padding: '4px 8px', color: '#94a3b8' }}
                            >
                              <Minus size={13} />
                            </button>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                              style={{ padding: '4px 8px', color: '#94a3b8' }}
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.productId)}
                            style={{ color: '#fda4af', padding: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Prescription Attachment Checkbox */}
                  <div style={{
                    background: 'rgba(2, 132, 199, 0.08)',
                    border: '1px solid rgba(14, 165, 233, 0.25)',
                    borderRadius: '14px',
                    padding: '14px',
                    marginTop: '8px'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prescriptionAttached}
                        onChange={(e) => setPrescriptionAttached(e.target.checked)}
                        style={{ marginTop: '3px', accentColor: '#0284c7', width: '16px', height: '16px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FileText size={15} /> Attach Optical Prescription
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>
                          Enables our optometrists to customize lens curvature, pupillary distance (PD), and sphere/cylinder values.
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Discount / Loyalty Code */}
                  <form onSubmit={applyPromoCode} style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Tag size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        placeholder="Promo (VISION20 or VISION10)"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        style={{ width: '100%', paddingLeft: '34px', fontSize: '0.85rem', height: '38px' }}
                      />
                    </div>
                    <button type="submit" className="btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                      Apply
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Drawer Footer: Order Summary & Place Order */}
            {cartItems.length > 0 && (
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid var(--border-subtle)',
                background: 'rgba(11, 16, 29, 0.9)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px' }}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {finalDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#34d399', marginBottom: '8px' }}>
                    <span>Loyalty Discount:</span>
                    <span>-${finalDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px' }}>
                  <span>Final Total:</span>
                  <span style={{ color: '#38bdf8' }}>${finalTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700 }}
                >
                  {isSubmitting ? 'Placing Order in Spring Boot...' : `Place Order ($${finalTotal.toFixed(2)})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
