import { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Home, 
  Map, 
  MessageSquare, 
  User, 
  Droplet, 
  Utensils, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import './DonationScreen.css';

const MICRO_PACKS = [
  {
    id: 'water',
    title: 'Clean Drinking Water (2L)',
    desc: 'Provides 1 person safe packaged water in camp.',
    amount: 20,
    icon: Droplet
  },
  {
    id: 'meal',
    title: 'Warm Shelter Meal Token',
    desc: '1 fresh hot meal (Dal-Khichdi) at municipal relief camp.',
    amount: 50,
    icon: Utensils
  },
  {
    id: 'child_milk',
    title: 'Child Milk & Biscuit Kit',
    desc: 'Boiled milk and glucose packs for infants in transition shelter.',
    amount: 100,
    icon: Sparkles
  },
  {
    id: 'hygiene',
    title: 'Sanitization & Soap Pack',
    desc: 'Antiseptic soap, tooth powder, and sanitary pads.',
    amount: 150,
    icon: ShieldCheck
  }
];

export default function DonationScreen({ citizenUser, onBack, onNavigate }) {
  const [selectedPack, setSelectedPack] = useState(MICRO_PACKS[0]);
  const [customAmount, setCustomAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const displayName = citizenUser?.name || 'Citizen';

  const handleSelectPack = (pack) => {
    setSelectedPack(pack);
    setCustomAmount('');
    setIsSuccess(false);
  };

  const handleSelectChip = (amt) => {
    setCustomAmount(amt.toString());
    setSelectedPack(null);
    setIsSuccess(false);
  };

  const handleDonate = (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? customAmount : selectedPack?.amount;
    if (!finalAmount || Number(finalAmount) <= 0) return;

    setSuccessMsg(`Thank you! Your micro-contribution of ₹${finalAmount} has been assigned to the Rampur Post-Flood Relief Center.`);
    setIsSuccess(true);
    setCustomAmount('');
  };

  return (
    <div className="donation-page-wrapper">
      <div className="donation-mobile-frame">

        {/* 1. Header matching exact app theme */}
        <div className="donation-top-header">
          <button className="donation-nav-icon-btn" onClick={() => onNavigate('settings')} title="Menu">
            <Menu size={22} />
          </button>
          <h2 className="donation-header-title" onClick={onBack}>Reloc8</h2>
          <button className="donation-nav-icon-btn" onClick={() => onNavigate('map')} title="Notifications">
            <Bell size={22} color="#dc2626" />
          </button>
        </div>

        {/* 2. Scrollable Body */}
        <div className="donation-scroll-area">

          {/* User Greeting */}
          <div className="donation-user-greeting">
            <h3>Hello, {displayName} 👋</h3>
            <p>Every Small Help Counts for Safe Families</p>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="donation-success-popup">
              <CheckCircle2 size={18} color="#059669" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Community Rebuilding Note */}
          <div className="donation-banner-card">
            <h4 className="donation-banner-title">
              <HeartHandshake size={16} /> Direct Relief to Evacuated People
            </h4>
            <p className="donation-banner-desc">
              Citizens moved to safe high-ground relief centers need quick daily essentials. Sponsor single micro-items starting from ₹20.
            </p>
          </div>

          {/* 1-Tap Micro Packs */}
          <div className="donation-section-title">
            <span>Sponsor Essential Micro-Help</span>
            <span className="donation-section-tag">Direct Delivery</span>
          </div>

          <div className="donation-packs-list">
            {MICRO_PACKS.map((pack) => {
              const IconComp = pack.icon;
              const isSelected = selectedPack?.id === pack.id && !customAmount;
              return (
                <div 
                  key={pack.id} 
                  className={`donation-pack-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectPack(pack)}
                >
                  <div className="donation-pack-left">
                    <div className="donation-pack-icon">
                      <IconComp size={20} />
                    </div>
                    <div className="donation-pack-info">
                      <h4>{pack.title}</h4>
                      <p>{pack.desc}</p>
                    </div>
                  </div>
                  <button type="button" className="donation-pack-price-btn">
                    ₹{pack.amount}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Or Choose Small Preset Amounts */}
          <div className="donation-section-title" style={{ marginTop: '20px' }}>
            <span>Custom Micro Amount</span>
          </div>

          <div className="donation-chips-row">
            {[20, 50, 100, 250].map((amt) => (
              <button
                key={amt}
                type="button"
                className={`donation-chip ${customAmount === amt.toString() ? 'active' : ''}`}
                onClick={() => handleSelectChip(amt)}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          {/* Checkout / Contribution Card */}
          <form onSubmit={handleDonate} className="donation-action-card">
            <input
              type="number"
              placeholder="Or enter custom amount (e.g. ₹75)"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedPack(null);
                setIsSuccess(false);
              }}
              className="donation-custom-input"
              min="10"
            />

            <button type="submit" className="donation-submit-btn">
              <span>Donate ₹{customAmount || selectedPack?.amount || 20} via UPI</span>
              <ArrowRight size={14} />
            </button>
          </form>

        </div>

        {/* 3. Bottom Navigation matching the dashboard */}
        <div className="donation-bottom-bar">
          <div className="donation-bar-item" onClick={() => onNavigate('citizenDashboard')}>
            <Home size={18} />
            <span>Home</span>
          </div>

          <div className="donation-bar-item" onClick={() => onNavigate('map')}>
            <Map size={18} />
            <span>Map</span>
          </div>

          <div className="donation-bar-item" onClick={() => onNavigate('infoExchange')}>
            <MessageSquare size={18} />
            <span>Exchange</span>
          </div>

          <div className="donation-bar-item" onClick={() => onNavigate('settings')}>
            <User size={18} />
            <span>Profile</span>
          </div>
        </div>

      </div>
    </div>
  );
}