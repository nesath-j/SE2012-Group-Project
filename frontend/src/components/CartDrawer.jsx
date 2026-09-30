import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  Truck
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  currentUser, 
  onNotify 
}) {
  const [useLoyaltyDiscount, setUseLoyaltyDiscount] = useState(false);
  const [checkoutCompleteOrder, setCheckoutCompleteOrder] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.customPrice || item.price;
    return acc + (itemPrice * (item.quantity || 1));
  }, 0);

  const discountRate = useLoyaltyDiscount ? 0.10 : 0; // 10% Gold tier discount
  const discountAmount = subtotal * discountRate;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const generatedOrderId = Math.floor(Math.random() * 89999 + 10000);
      const order = {
        orderId: generatedOrderId,
        trackingCode: `VX-TRK-${generatedOrderId}`,
        total: grandTotal,
        date: new Date().toLocaleDateString(),
        estimatedArrival: '2-3 Business Days'
      };
      setCheckoutCompleteOrder(order);
      setIsCheckingOut(false);
      onClearCart();
      onNotify('success', 'Order Placed', `Order #${order.orderId} processed via MemberService.`);
    }, 1000);
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.2rem' }}>Optical Bag ({cartItems.length})</h3>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {checkoutCompleteOrder ? (
          <div style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <CheckCircle size={38} color="#10b981" />
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Order Confirmed!</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '24px' }}>
              Thank you for trusting VisionExpress. Your optical prescription order is now in our precision lens surfacing lab.
            </p>

            <div className="glass-card" style={{ width: '100%', padding: '18px', textAlign: 'left', marginBottom: '24px', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Order Reference:</span>
                <strong>#{checkoutCompleteOrder.orderId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Tracking Number:</span>
                <code style={{ color: '#38bdf8', fontWeight: 700 }}>{checkoutCompleteOrder.trackingCode}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Estimated Delivery:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{checkoutCompleteOrder.estimatedArrival}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', fontSize: '0.95rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>Amount Paid:</span>
                <strong style={{ color: '#38bdf8' }}>${checkoutCompleteOrder.total.toFixed(2)}</strong>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%' }}
              onClick={() => {
                setCheckoutCompleteOrder(null);
                onClose();
              }}
            >
              Continue Browsing
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
            <ShoppingBag size={52} color="#475569" style={{ marginBottom: '16px' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Your Bag is Empty</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
              Explore our designer frames, sunglasses, and custom prescription lenses.
            </p>
            <button className="btn-secondary" onClick={onClose}>
              Explore Catalog
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Item List */}
            <div className="cart-items-scroll">
              {cartItems.map((item, index) => {
                const itemPrice = item.customPrice || item.price;
                return (
                  <div key={`${item.id}-${index}`} className="cart-item-card">
                    <img src={item.image || item.pic} alt={item.name} className="cart-item-thumb" />
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>{item.name}</h4>
                        <button 
                          onClick={() => onRemoveItem(index)}
                          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {item.configuredLens && (
                        <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '2px', background: 'rgba(56,189,248,0.1)', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>
                          {item.configuredLens.lensType || item.configuredLens.tint || 'Customized Lens'}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
                          ${(itemPrice * (item.quantity || 1)).toFixed(2)}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '2px 6px' }}>
                          <button 
                            onClick={() => onUpdateQuantity(index, (item.quantity || 1) - 1)}
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.quantity || 1}</span>
                          <button 
                            onClick={() => onUpdateQuantity(index, (item.quantity || 1) + 1)}
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Footer */}
            <div className="cart-footer">
              {/* Member Tier Loyalty Discount Toggle */}
              {currentUser && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="#10b981" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>Apply Member Reward (10% Off)</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Redeem member points balance</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={useLoyaltyDiscount} 
                    onChange={(e) => setUseLoyaltyDiscount(e.target.checked)}
                    style={{ accentColor: '#10b981', transform: 'scale(1.2)', cursor: 'pointer' }}
                  />
                </div>
              )}

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#fff' }}>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                    <span>Member Tier Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Optical Courier</span>
                  <span style={{ color: shipping === 0 ? '#10b981' : '#fff' }}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', fontSize: '1.1rem', fontWeight: 800 }}>
                  <span>Total</span>
                  <span style={{ color: '#38bdf8' }}>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                disabled={isCheckingOut}
                onClick={handleCheckout}
              >
                <span>{isCheckingOut ? 'Surfacing Order...' : 'Proceed to Optical Checkout'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
