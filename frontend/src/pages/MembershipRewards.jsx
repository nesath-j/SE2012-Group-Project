import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { memberApi, loyaltyTiersApi } from '../services/api';
import {
  Award,
  Sparkles,
  Gift,
  FileText,
  Upload,
  CheckCircle2,
  TrendingUp,
  Percent,
  Shield,
  HelpCircle,
  Coins
} from 'lucide-react';

export default function MembershipRewards() {
  const { user, role, showToast, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  const [points, setPoints] = useState(650);
  const [totalPoints, setTotalPoints] = useState(650);
  const [tier, setTier] = useState('Silver');
  const [discount, setDiscount] = useState(5.0);
  const [tiers, setTiers] = useState([]);
  const [redeemInput, setRedeemInput] = useState(200);
  const [redemptionValue, setRedemptionValue] = useState(10.0);
  const [prescriptionPath, setPrescriptionPath] = useState('');
  const [newPrescriptionFile, setNewPrescriptionFile] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUpdatingRx, setIsUpdatingRx] = useState(false);

  useEffect(() => {
    loadMembershipData();
  }, [user]);

  const loadMembershipData = async () => {
    setLoading(true);
    try {
      const allTiers = await loyaltyTiersApi.getAll();
      setTiers(allTiers);

      if (user && role === 'MEMBER') {
        const pts = await memberApi.getPoints(user.userId);
        const total = await memberApi.getTotalPoints(user.userId);
        const t = await memberApi.getTier(user.userId);
        const d = await memberApi.getDiscount(user.userId);
        setPoints(pts);
        setTotalPoints(total);
        setTier(t || user.tier || 'Silver');
        setDiscount(d || user.discountPercentage || 5.0);
        setPrescriptionPath(user.prescriptionDocPath || '/uploads/prescriptions/rx_user_1.pdf');
      } else {
        // Fallback default sample stats
        setPoints(user?.loyaltyPoints || 650);
        setTotalPoints(user?.totalEarnedPoints || 650);
        setTier(user?.tier || 'Silver');
        setDiscount(user?.discountPercentage || 5.0);
        setPrescriptionPath('/uploads/prescriptions/rx_sample.pdf');
      }

      handleCalculateRedemption(200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateRedemption = async (ptsToRedeem) => {
    try {
      const val = await memberApi.redeem(user?.userId || 1, ptsToRedeem);
      setRedemptionValue(val);
    } catch (err) {
      setRedemptionValue(Number((ptsToRedeem * 0.05).toFixed(2)));
    }
  };

  const handleRedeemChange = (e) => {
    const val = Number(e.target.value);
    setRedeemInput(val);
    handleCalculateRedemption(val);
  };

  const handleUploadPrescription = async (e) => {
    e.preventDefault();
    if (!newPrescriptionFile.trim()) {
      showToast('Please specify a prescription document path or name.', 'error');
      return;
    }
    setIsUpdatingRx(true);
    try {
      await memberApi.uploadPrescription(user.userId, newPrescriptionFile.trim());
      setPrescriptionPath(newPrescriptionFile.trim());
      setNewPrescriptionFile('');
      showToast('Prescription reference successfully registered in member vault!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update prescription.', 'error');
    } finally {
      setIsUpdatingRx(false);
    }
  };

  // Tier progress metrics
  const nextTierPoints = tier === 'Bronze' ? 500 : tier === 'Silver' ? 1500 : tier === 'Gold' ? 3000 : 3000;
  const progressPercent = tier === 'Platinum' ? 100 : Math.min(100, Math.round((points / nextTierPoints) * 100));

  const tierGradients = {
    Bronze: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
    Silver: 'linear-gradient(135deg, #334155 0%, #64748b 100%)',
    Gold: 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)',
    Platinum: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
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
          Vision Express Exclusive Rewards
        </div>
        <h2>Membership Rewards & Loyalty Tiers</h2>
        <p style={{ maxWidth: '650px', fontSize: '0.95rem' }}>
          Every purchase automatically earns points into your member profile. Redeem points directly on optical orders and unlock higher tier discounts on eyewear and clinical consultations.
        </p>
      </div>

      {/* Main Stats Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem',
      }}>
        {/* Tier Digital Card */}
        <div style={{
          background: tierGradients[tier] || tierGradients.Silver,
          borderRadius: '20px',
          padding: '2rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '220px',
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            opacity: 0.15,
            transform: 'rotate(25deg)',
          }}>
            <Award size={180} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
                VISION EXPRESS VIP CLUB
              </span>
              <span className={`badge badge-${tier.toLowerCase()}`} style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
                {tier} Member
              </span>
            </div>

            <h3 style={{ color: '#ffffff', fontSize: '1.85rem', marginBottom: '0.25rem' }}>
              {user ? `${user.firstName} ${user.lastName}` : 'Guest Member'}
            </h3>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)' }}>
              Member ID: #{user?.userId || 1} • {discount}% Storewide Tier Discount
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.785rem', marginBottom: '0.4rem', color: 'rgba(255,255,255,0.9)' }}>
              <span>Progress to {tier === 'Platinum' ? 'Max Tier' : 'Next Tier'}</span>
              <span><strong>{points}</strong> / {nextTierPoints} pts ({progressPercent}%)</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Available Points Card */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <Coins size={18} color="#f59e0b" />
              <span>AVAILABLE REWARD POINTS</span>
            </div>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '0.5rem' }}>
              {points.toLocaleString()} <span style={{ fontSize: '1.2rem', fontWeight: 500, color: '#64748b' }}>pts</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#475569' }}>
              Lifetime Points Earned: <strong>{totalPoints.toLocaleString()} pts</strong>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            fontSize: '0.85rem',
            marginTop: '1.5rem',
          }}>
            <span style={{ color: '#0284c7', fontWeight: 600 }}>Automatic Earning: </span>
            Every $100 spent on confirmed orders automatically awards points into your account!
          </div>
        </div>
      </div>

      {/* Grid: Points Redemption Simulator & Prescription Vault */}
      <div className="grid-2" style={{ marginBottom: '3rem' }}>
        {/* Points Redemption Simulator */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Gift size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Points Redemption Calculator</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                Test backend endpoint /api/members/{'{id}'}/redeem
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.5rem' }}>
            Use the slider below to calculate immediate checkout discount credits available from your loyalty points balance:
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
              <span>Points to Redeem:</span>
              <strong style={{ color: '#0284c7' }}>{redeemInput} pts</strong>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(points, 500)}
              step="50"
              value={redeemInput}
              onChange={handleRedeemChange}
              style={{ width: '100%', accentColor: '#0284c7' }}
            />
          </div>

          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '0.785rem', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
                Instant Order Discount Value
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d' }}>
                ${redemptionValue.toFixed(2)} OFF
              </div>
            </div>
            <CheckCircle2 size={32} color="#16a34a" />
          </div>
        </div>

        {/* Prescription Document Vault */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
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
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Optical Prescription Vault</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                Spring Boot /api/members/{'{id}'}/prescription
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.25rem',
          }}>
            <div style={{ fontSize: '0.785rem', color: '#64748b', marginBottom: '0.2rem' }}>
              Current Active Prescription Reference:
            </div>
            <strong style={{ fontSize: '0.9rem', color: '#0f172a', wordBreak: 'break-all' }}>
              {prescriptionPath || 'No prescription currently on file.'}
            </strong>
          </div>

          <form onSubmit={handleUploadPrescription}>
            <div className="form-group">
              <label className="form-label">Update Prescription File Reference</label>
              <input
                type="text"
                placeholder="e.g. /uploads/prescriptions/rx_user_2026.pdf"
                value={newPrescriptionFile}
                onChange={(e) => setNewPrescriptionFile(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingRx}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', borderColor: '#0284c7', color: '#0284c7' }}
            >
              {isUpdatingRx ? <span className="spinner spinner-primary" /> : (
                <>
                  <Upload size={16} />
                  <span>Update Prescription Reference</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Loyalty Tiers Comparison Table */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Loyalty Tiers Structure</h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
          Live configuration retrieved from Spring Boot backend entity <code>LoyaltyTier</code>:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.785rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Tier Level</th>
                <th style={{ padding: '0.75rem 1rem' }}>Minimum Points</th>
                <th style={{ padding: '0.75rem 1rem' }}>Storewide Discount</th>
                <th style={{ padding: '0.75rem 1rem' }}>Exclusive Clinical Perks</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((t) => (
                <tr
                  key={t.tierId}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: tier === t.tierName ? '#f0f9ff' : 'transparent',
                    fontWeight: tier === t.tierName ? 700 : 400,
                  }}
                >
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge badge-${t.tierName.toLowerCase()}`}>
                      {t.tierName}
                    </span>
                    {tier === t.tierName && (
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#0284c7' }}>
                        (Current)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>{t.minPoints} pts</td>
                  <td style={{ padding: '1rem', color: '#059669', fontWeight: 700 }}>
                    {t.discountPercentage}% OFF
                  </td>
                  <td style={{ padding: '1rem', color: '#475569' }}>
                    {t.tierName === 'Bronze' && 'Standard optical warranties'}
                    {t.tierName === 'Silver' && 'Complimentary frame adjustments & 5% order discount'}
                    {t.tierName === 'Gold' && 'Free ultrasonic repairs, 10% discount & priority doctor slots'}
                    {t.tierName === 'Platinum' && 'VIP 15% discount, free emergency repair, bespoke styling session'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
