import React, { useState } from 'react';
import { Truck, Search, CheckCircle2, Clock, MapPin, Send, ArrowRight, RefreshCw, AlertCircle, Shield, Building2 } from 'lucide-react';
import { COURIERS } from '../data/mockData';
import { dispatchDelivery, trackDelivery, updateDeliveryStatus, getStoredDeliveries } from '../services/api';

const STATUS_STEPS = ['DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export default function DeliveryView({
  orders,
  prefilledOrderId,
  onNotify
}) {
  const [trackOrderIdInput, setTrackOrderIdInput] = useState(prefilledOrderId ? String(prefilledOrderId) : '');
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);

  // Dispatch Form State
  const [dispatchOrderId, setDispatchOrderId] = useState(prefilledOrderId ? String(prefilledOrderId) : '');
  const [dispatchCourierId, setDispatchCourierId] = useState(1);
  const [dispatchLoading, setDispatchLoading] = useState(false);

  // Courier Status Update Form State
  const [updateTrackingNo, setUpdateTrackingNo] = useState('');
  const [updateStatusVal, setUpdateStatusVal] = useState('IN_TRANSIT');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Local deliveries list
  const [deliveriesList, setDeliveriesList] = useState(getStoredDeliveries());

  // Track order by ID via GET /api/deliveries/track/{orderId}
  const handleTrackSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!trackOrderIdInput.trim()) return;

    setTrackLoading(true);
    setTrackResult(null);

    try {
      const res = await trackDelivery(trackOrderIdInput.trim());
      setTrackResult({
        rawString: res.data,
        deliveryObj: res.deliveryObj,
        orderId: trackOrderIdInput.trim()
      });
      onNotify('success', 'Tracking Retrieved', `Found tracking record for Order #${trackOrderIdInput.trim()}`);
    } catch (err) {
      onNotify('error', 'Tracking Not Found', err.message || `No tracking found for Order #${trackOrderIdInput}`);
      setTrackResult({
        error: true,
        message: err.message || `No active delivery found for Order #${trackOrderIdInput}. Dispatch this order first.`
      });
    } finally {
      setTrackLoading(false);
    }
  };

  // Dispatch order via POST /api/deliveries/dispatch?orderId={orderId}&courierId={courierId}
  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    if (!dispatchOrderId) return;

    setDispatchLoading(true);
    try {
      const res = await dispatchDelivery(dispatchOrderId, dispatchCourierId);
      const delivery = res.data;
      onNotify('success', 'Order Dispatched!', `Tracking No: ${delivery.trackingNo} assigned to Courier #${dispatchCourierId}`);

      setDeliveriesList(getStoredDeliveries());
      setTrackOrderIdInput(String(dispatchOrderId));
      setUpdateTrackingNo(delivery.trackingNo);

      // Auto-trigger track to show the new delivery
      setTimeout(() => {
        handleTrackSubmit();
      }, 200);
    } catch (err) {
      onNotify('error', 'Dispatch Failed', err.message || 'Could not dispatch order.');
    } finally {
      setDispatchLoading(false);
    }
  };

  // Update status via PATCH /api/deliveries/status?trackingNumber={trackingNumber}&status={status}
  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateTrackingNo.trim()) return;

    setUpdateLoading(true);
    try {
      await updateDeliveryStatus(updateTrackingNo.trim(), updateStatusVal);
      onNotify('success', 'Shipment Status Updated', `${updateTrackingNo} marked as ${updateStatusVal}`);
      setDeliveriesList(getStoredDeliveries());

      // If currently tracked item matches, re-track
      if (trackResult?.deliveryObj?.trackingNo === updateTrackingNo.trim() || trackResult?.rawString?.includes(updateTrackingNo.trim())) {
        handleTrackSubmit();
      }
    } catch (err) {
      onNotify('error', 'Status Update Failed', err.message || 'Could not update shipment status.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Determine active step index from status
  const getStepIndex = (statusStr) => {
    if (!statusStr) return 0;
    const s = statusStr.toUpperCase();
    if (s.includes('DELIVERED')) return 3;
    if (s.includes('OUT_FOR_DELIVERY') || s.includes('OUT FOR DELIVERY')) return 2;
    if (s.includes('IN_TRANSIT') || s.includes('IN TRANSIT') || s.includes('TRANSIT')) return 1;
    return 0; // DISPATCHED
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Courier Dispatch & Shipment Tracking
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Real-time logistics console connected to VisionExpress Delivery APIs. Dispatch packages, query tracking timelines, and update courier transit milestones.
        </p>
      </div>

      {/* Main Grid: Track & Dispatch */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        marginBottom: '36px'
      }}>
        {/* Track Shipment Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(14, 165, 233, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Search size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Track Shipment</h2>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Calls GET /api/deliveries/track/{'{orderId}'}
              </div>
            </div>
          </div>

          <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="number"
              placeholder="Enter Order ID (e.g. 101, 102)..."
              value={trackOrderIdInput}
              onChange={(e) => setTrackOrderIdInput(e.target.value)}
              required
              style={{ flex: 1, height: '44px' }}
            />
            <button
              type="submit"
              disabled={trackLoading}
              className="btn-primary"
              style={{ padding: '0 20px', height: '44px' }}
            >
              {trackLoading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Quick Order Selector for convenience */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Quick Select Available Orders:</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {orders.slice(0, 5).map(o => (
                <button
                  key={o.orderId}
                  type="button"
                  onClick={() => {
                    setTrackOrderIdInput(String(o.orderId));
                    setDispatchOrderId(String(o.orderId));
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: trackOrderIdInput === String(o.orderId) ? 'rgba(14, 165, 233, 0.3)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#cbd5e1',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  Order #{o.orderId}
                </button>
              ))}
            </div>
          </div>

          {/* Tracking Result Display */}
          {trackResult && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '20px',
              animation: 'fadeIn 0.25s ease-out'
            }}>
              {trackResult.error ? (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#fb7185' }}>
                  <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Tracking Unavailable</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{trackResult.message}</div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                    <div>
                      <span className="badge badge-info" style={{ marginBottom: '4px' }}>Verified Tracking</span>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc' }}>Order #{trackResult.orderId}</div>
                    </div>
                    <button
                      onClick={handleTrackSubmit}
                      className="btn-icon"
                      title="Re-fetch tracking status"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>

                  {/* Backend Raw String Box */}
                  <div style={{
                    background: 'rgba(2, 132, 199, 0.1)',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                    color: '#38bdf8',
                    fontFamily: 'monospace',
                    marginBottom: '20px'
                  }}>
                    {trackResult.rawString}
                  </div>

                  {/* Visual Stepper Timeline */}
                  {(() => {
                    const currentStep = getStepIndex(trackResult.rawString);
                    return (
                      <div style={{ padding: '10px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                          {/* Connecting background line */}
                          <div style={{
                            position: 'absolute',
                            left: '5%',
                            right: '5%',
                            top: '16px',
                            height: '3px',
                            background: 'rgba(255,255,255,0.1)',
                            zIndex: 0
                          }} />
                          {/* Active fill line */}
                          <div style={{
                            position: 'absolute',
                            left: '5%',
                            width: `${(currentStep / 3) * 90}%`,
                            top: '16px',
                            height: '3px',
                            background: 'linear-gradient(90deg, #0284c7, #10b981)',
                            zIndex: 1,
                            transition: 'width 0.4s ease'
                          }} />

                          {STATUS_STEPS.map((step, idx) => {
                            const isPastOrCurrent = idx <= currentStep;
                            const isCurrent = idx === currentStep;

                            return (
                              <div
                                key={step}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  zIndex: 2,
                                  width: '70px',
                                  textAlign: 'center'
                                }}
                              >
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: isCurrent ? '#0284c7' : isPastOrCurrent ? '#10b981' : '#1e293b',
                                  border: `2px solid ${isCurrent ? '#38bdf8' : isPastOrCurrent ? '#34d399' : '#334155'}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#fff',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  marginBottom: '8px',
                                  boxShadow: isCurrent ? '0 0 12px rgba(56, 189, 248, 0.6)' : 'none'
                                }}>
                                  {isPastOrCurrent ? <CheckCircle2 size={16} /> : idx + 1}
                                </div>
                                <div style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 600,
                                  color: isCurrent ? '#38bdf8' : isPastOrCurrent ? '#e2e8f0' : '#64748b',
                                  textTransform: 'uppercase'
                                }}>
                                  {step.replace(/_/g, ' ')}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dispatch Order Card (POST /api/deliveries/dispatch) */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <Send size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Dispatch Order with Courier</h2>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Calls POST /api/deliveries/dispatch?orderId=&courierId=
              </div>
            </div>
          </div>

          <form onSubmit={handleDispatchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Select Order ID to Dispatch
              </label>
              <select
                value={dispatchOrderId}
                onChange={(e) => setDispatchOrderId(e.target.value)}
                required
                style={{ width: '100%', height: '44px' }}
              >
                <option value="">-- Choose an Order --</option>
                {orders.map(o => (
                  <option key={o.orderId} value={o.orderId}>
                    Order #{o.orderId} - Total: ${(Number(o.totalAmount) - Number(o.discountAmount || 0)).toFixed(2)} ({o.orderStatus})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Select Partner Courier
              </label>
              <select
                value={dispatchCourierId}
                onChange={(e) => setDispatchCourierId(Number(e.target.value))}
                style={{ width: '100%', height: '44px' }}
              >
                {COURIERS.map(c => (
                  <option key={c.courierId} value={c.courierId}>
                    {c.name} — {c.service} ({c.contact})
                  </option>
                ))}
              </select>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: '#94a3b8',
              lineHeight: 1.5
            }}>
              <Building2 size={15} style={{ verticalAlign: 'middle', marginRight: '6px', color: '#38bdf8' }} />
              Dispatches package via employee portal, generating a unique UUID tracking number and setting initial status to <strong style={{ color: '#38bdf8' }}>DISPATCHED</strong>.
            </div>

            <button
              type="submit"
              disabled={dispatchLoading || !dispatchOrderId}
              className="btn-primary"
              style={{ height: '44px', marginTop: '4px' }}
            >
              {dispatchLoading ? 'Dispatching...' : 'Dispatch Package Now'}
            </button>
          </form>
        </div>
      </div>

      {/* Courier Shipment Status Updater (PATCH /api/deliveries/status) */}
      <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Courier Shipment Status Updater</h2>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Calls PATCH /api/deliveries/status?trackingNumber=&status=
            </div>
          </div>
          <span className="badge badge-info">Courier Fleet Portal</span>
        </div>

        <form onSubmit={handleStatusUpdateSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Tracking Number
            </label>
            <input
              type="text"
              placeholder="e.g. TRK-98B2E4A1"
              value={updateTrackingNo}
              onChange={(e) => setUpdateTrackingNo(e.target.value)}
              required
              style={{ width: '100%', height: '42px', fontFamily: 'monospace' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              New Milestone Status
            </label>
            <select
              value={updateStatusVal}
              onChange={(e) => setUpdateStatusVal(e.target.value)}
              style={{ width: '100%', height: '42px' }}
            >
              {STATUS_STEPS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={updateLoading || !updateTrackingNo}
            className="btn-primary"
            style={{ height: '42px' }}
          >
            {updateLoading ? 'Updating...' : 'Update Shipment Status'}
          </button>
        </form>
      </div>

      {/* Deliveries Registry Table */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={18} color="#38bdf8" /> Recent Dispatched Consignments
        </h3>

        {deliveriesList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
            No consignments dispatched yet. Dispatch an order above to create tracking records.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ color: '#94a3b8', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Tracking No</th>
                  <th style={{ padding: '12px 16px' }}>Order ID</th>
                  <th style={{ padding: '12px 16px' }}>Courier Partner</th>
                  <th style={{ padding: '12px 16px' }}>Dispatched Date</th>
                  <th style={{ padding: '12px 16px' }}>Delivery Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveriesList.map(del => {
                  const courier = COURIERS.find(c => c.courierId === del.courierId) || COURIERS[0];
                  return (
                    <tr key={del.deliveryId || del.trackingNo} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                        {del.trackingNo}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                        #{del.orderId}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                        {courier.name}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#94a3b8' }}>
                        {del.dispatchDate ? new Date(del.dispatchDate).toLocaleDateString() : 'Today'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${del.deliveryStatus === 'DELIVERED' ? 'badge-success' : 'badge-warning'}`}>
                          {del.deliveryStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setTrackOrderIdInput(String(del.orderId));
                            setUpdateTrackingNo(del.trackingNo);
                            trackDelivery(del.orderId).then(res => {
                              setTrackResult({
                                rawString: res.data,
                                deliveryObj: del,
                                orderId: del.orderId
                              });
                            });
                          }}
                          className="btn-secondary btn-sm"
                        >
                          Inspect Tracking
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
