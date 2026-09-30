import React, { useState } from 'react';
import { 
  User, 
  Award, 
  FileText, 
  Truck, 
  Upload, 
  CheckCircle, 
  Save, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  Clock,
  Eye
} from 'lucide-react';
import { usersApi } from '../api/api';

export default function MemberDashboard({ currentUser, onUpdateUser, onNotify }) {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phone || ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Loyalty Points State (MemberService logic)
  const [loyaltyPoints, setLoyaltyPoints] = useState(420);
  const [redeemInput, setRedeemInput] = useState(100);
  const [redeemedValue, setRedeemedValue] = useState(0);

  // Prescription records state (MemberService.uploadPrescription)
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'RX-9821',
      date: '2026-08-14',
      doctor: 'Dr. Amanda Silva',
      fileName: 'Prescription_August_2026.pdf',
      odSphere: '-1.50',
      osSphere: '-1.75',
      cylinder: '-0.50',
      axis: '90°',
      pd: '63mm',
      expiry: '2027-08-14'
    }
  ]);
  const [newPrescriptionFile, setNewPrescriptionFile] = useState(null);

  // Orders State (MemberService.trackOrder)
  const [orders, setOrders] = useState([
    {
      orderId: 74829,
      date: '2026-09-28',
      item: 'Ray-Ban Aviator Classic (Transitions Gen 8)',
      amount: '$185.00',
      status: 'In-Transit',
      trackingCode: 'VX-TRK-74829',
      estimatedArrival: 'October 1, 2026',
      progress: 65
    },
    {
      orderId: 72104,
      date: '2026-07-12',
      item: 'Anti-Reflective Single Vision Lenses',
      amount: '$95.00',
      status: 'Delivered',
      trackingCode: 'VX-TRK-72104',
      estimatedArrival: 'July 14, 2026',
      progress: 100
    }
  ]);

  // Handle Profile Update via PUT /api/users/profile/{userId}
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSavingProfile(true);

    try {
      const res = await usersApi.updateProfile(currentUser.userId, profileForm);
      if (res.success) {
        onUpdateUser({
          ...currentUser,
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone
        });
        onNotify('success', 'Profile Updated', res.message || 'Changes saved successfully to Spring Boot database.');
      }
    } catch (err) {
      onNotify('error', 'Update Failed', err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Points Redemption (MemberService.redeemPoints)
  const handleRedeemPoints = () => {
    const pointsToUse = parseInt(redeemInput);
    if (isNaN(pointsToUse) || pointsToUse <= 0) {
      onNotify('error', 'Invalid Points', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (pointsToUse > loyaltyPoints) {
      onNotify('error', 'Insufficient Balance', 'You do not have enough points.');
      return;
    }

    const discountAmount = pointsToUse * 0.01; // $1 per 100 points
    setLoyaltyPoints(prev => prev - pointsToUse);
    setRedeemedValue(prev => prev + discountAmount);
    onNotify('success', 'Points Redeemed', `Redeemed ${pointsToUse} points for $${discountAmount.toFixed(2)} store credit.`);
  };

  // Handle Prescription Upload
  const handleUploadPrescription = (e) => {
    e.preventDefault();
    if (!newPrescriptionFile) {
      onNotify('error', 'No File Selected', 'Please choose a file or image of your prescription.');
      return;
    }

    const newRx = {
      id: `RX-${Math.floor(Math.random() * 8999 + 1000)}`,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Verified Clinic Optometrist',
      fileName: newPrescriptionFile.name,
      odSphere: '-2.00',
      osSphere: '-2.25',
      cylinder: '-0.75',
      axis: '180°',
      pd: '64mm',
      expiry: '2027-09-29'
    };

    setPrescriptions([newRx, ...prescriptions]);
    setNewPrescriptionFile(null);
    onNotify('success', 'Prescription Uploaded', `${newPrescriptionFile.name} securely registered to your member profile.`);
  };

  // Determine Tier
  const getTier = (points) => {
    if (points >= 1000) return { name: 'Platinum', discount: '15%', min: 1000, next: 1500, color: '#c084fc' };
    if (points >= 500) return { name: 'Gold', discount: '10%', min: 500, next: 1000, color: '#fbbf24' };
    if (points >= 250) return { name: 'Silver', discount: '5%', min: 250, next: 500, color: '#94a3b8' };
    return { name: 'Bronze', discount: '0%', min: 0, next: 250, color: '#d97706' };
  };

  const currentTier = getTier(loyaltyPoints);

  return (
    <section className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="section-header">
        <span className="section-pretitle">Member Portal</span>
        <h2 className="section-title">Welcome Back, {currentUser?.firstName || 'Valued Member'}</h2>
        <p className="section-subtitle">
          Manage your optical profile, view your active prescriptions, monitor loyalty rewards, and track custom eyewear shipments.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Sidebar Nav */}
        <div className="dashboard-sidebar">
          <button 
            className={`sidebar-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile Details</span>
          </button>

          <button 
            className={`sidebar-tab-btn ${activeTab === 'loyalty' ? 'active' : ''}`}
            onClick={() => setActiveTab('loyalty')}
          >
            <Award size={18} />
            <span>Loyalty Points & Tiers</span>
          </button>

          <button 
            className={`sidebar-tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            <FileText size={18} />
            <span>Prescription Vault</span>
          </button>

          <button 
            className={`sidebar-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Truck size={18} />
            <span>Track Orders</span>
          </button>

          {/* Quick info card */}
          <div className="glass-card" style={{ padding: '16px', marginTop: '16px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
              Connected Backend ID
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              User #{currentUser?.userId || 1}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '4px' }}>
              {currentUser?.email || 'member@visionexpress.com'}
            </div>
          </div>
        </div>

        {/* Tab Content Panes */}
        <div>
          {/* TAB 1: Profile Edit (PUT /api/users/profile/{userId}) */}
          {activeTab === 'profile' && (
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem' }}>Personal Optical Profile</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    Calls Spring Boot backend: <code style={{ color: '#38bdf8' }}>PUT /api/users/profile/{currentUser?.userId || 1}</code>
                  </p>
                </div>
                <span className="badge badge-blue">{currentUser?.userType || 'Member'}</span>
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>First Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      required 
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Last Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      required 
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Email Address (Registered)</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      disabled 
                      value={currentUser?.email || ''} 
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      className="input-field" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-primary" disabled={isSavingProfile}>
                    <Save size={16} />
                    <span>{isSavingProfile ? 'Saving via API...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Loyalty Rewards (MemberService.viewLoyaltyPoints & redeemPoints) */}
          {activeTab === 'loyalty' && (
            <div>
              <div className="loyalty-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <span className="badge badge-amber" style={{ color: currentTier.color, borderColor: currentTier.color, marginBottom: '8px' }}>
                      {currentTier.name} Status
                    </span>
                    <h3 style={{ fontSize: '1.8rem', marginTop: '4px' }}>{loyaltyPoints} Points Available</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      Current Tier Discount: <strong style={{ color: '#38bdf8' }}>{currentTier.discount} OFF</strong> on all eyewear frames and lenses.
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Redeemed Credit</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>${redeemedValue.toFixed(2)}</div>
                  </div>
                </div>

                {/* Progress bar towards next tier */}
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(100, ((loyaltyPoints - currentTier.min) / (currentTier.next - currentTier.min)) * 100)}%` }} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8' }}>
                  <span>{currentTier.name} ({currentTier.min} pts)</span>
                  <span>Next Tier: {currentTier.next} pts</span>
                </div>
              </div>

              {/* Redeem points box */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#fbbf24" />
                  <span>Redeem Loyalty Points for Store Credit</span>
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
                  MemberService formula: 100 Points = $1.00 Instant Cash Discount applied at checkout.
                </p>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    className="input-field" 
                    style={{ maxWidth: '160px' }} 
                    min="50" 
                    step="50"
                    max={loyaltyPoints}
                    value={redeemInput}
                    onChange={(e) => setRedeemInput(e.target.value)}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    = <strong>${(parseInt(redeemInput || 0) * 0.01).toFixed(2)}</strong> discount
                  </span>
                  <button className="btn-accent" onClick={handleRedeemPoints}>
                    Redeem Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Prescription Vault (MemberService.uploadPrescription) */}
          {activeTab === 'prescriptions' && (
            <div>
              {/* Upload New Rx */}
              <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Upload New Clinical Prescription</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
                  Upload a photo or PDF from your optometrist. Our optical technicians will verify sphere, cylinder, and axis values.
                </p>

                <form onSubmit={handleUploadPrescription} style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                    <Upload size={16} />
                    <span>{newPrescriptionFile ? newPrescriptionFile.name : 'Choose Prescription Document'}</span>
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg" 
                      style={{ display: 'none' }}
                      onChange={(e) => setNewPrescriptionFile(e.target.files[0])}
                    />
                  </label>
                  <button type="submit" className="btn-primary" disabled={!newPrescriptionFile}>
                    <CheckCircle size={16} />
                    <span>Upload & Link to Account</span>
                  </button>
                </form>
              </div>

              {/* Existing Prescriptions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {prescriptions.map(rx => (
                  <div key={rx.id} className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ fontSize: '1.15rem' }}>{rx.id}</h4>
                          <span className="badge badge-green">Verified Active</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                          Prescribed by: {rx.doctor} • Examined: {rx.date} • Valid until: {rx.expiry}
                        </div>
                      </div>
                      <div className="badge badge-blue">{rx.fileName}</div>
                    </div>

                    {/* Prescription Values Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>OD (Right Eye)</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{rx.odSphere}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>OS (Left Eye)</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{rx.osSphere}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>CYL (Cylinder)</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{rx.cylinder}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>AXIS</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{rx.axis}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>PD (Pupillary Dist)</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{rx.pd}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Order & Delivery Tracking (MemberService.trackOrder) */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map(order => (
                <div key={order.orderId} className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ fontSize: '1.2rem' }}>Order #{order.orderId}</h4>
                        <span className={`badge ${order.status === 'Delivered' ? 'badge-green' : 'badge-blue'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                        Placed on {order.date} • Total: <strong style={{ color: '#fff' }}>{order.amount}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Spring Boot Tracking Code</div>
                      <code style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 700 }}>{order.trackingCode}</code>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', marginBottom: '16px', color: '#e2e8f0' }}>
                    {order.item}
                  </p>

                  {/* Progress bar */}
                  <div className="progress-track" style={{ height: '8px', margin: '10px 0' }}>
                    <div className="progress-fill" style={{ width: `${order.progress}%` }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <span>Order Placed</span>
                    <span>Lab Edging & Coating</span>
                    <span>Out for Courier</span>
                    <span style={{ color: order.status === 'Delivered' ? '#10b981' : '#38bdf8' }}>
                      Estimated: {order.estimatedArrival}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
