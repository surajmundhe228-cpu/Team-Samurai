import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  HeartHandshake,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  Package,
  ChevronRight,
  X
} from 'lucide-react';
import './DonationScreen.css';

const reliefItemsData = [
  {
    id: "water",
    name: "Clean Drinking Water",
    price: 20,
    icon: "💧",
    description: "Provides 1 person safe packaged drinking water in camp.",
    required: 500,
    sponsored: 320
  },
  {
    id: "meal",
    name: "Warm Shelter Meal",
    price: 50,
    icon: "🍛",
    description: "1 fresh nutritious hot meal served at relief shelter.",
    required: 300,
    sponsored: 185
  },
  {
    id: "child-kit",
    name: "Child Milk & Biscuit Kit",
    price: 100,
    icon: "👶",
    description: "Boiled milk pouches and glucose biscuit packs for infants.",
    required: 150,
    sponsored: 72
  },
  {
    id: "hygiene",
    name: "Sanitization & Soap Pack",
    price: 150,
    icon: "🧼",
    description: "Antiseptic soap, tooth powder, and sanitary essentials.",
    required: 200,
    sponsored: 94
  }
];

const reliefCentres = [
  { id: "supaul", name: "Supaul Relief Centre", district: "Supaul", priority: "HIGH" },
  { id: "madhepura", name: "Madhepura Relief Centre", district: "Madhepura", priority: "HIGH" },
  { id: "pune-hub", name: "Pune Central Disaster Cell", district: "Pune", priority: "ACTIVE" }
];

export default function DonationScreen({ onBack, citizenUser }) {
  const displayName = citizenUser?.name || 'Citizen';

  // Selection states
  const [selectedItems, setSelectedItems] = useState([]);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedCentre, setSelectedCentre] = useState("supaul");

  // Modal views and active donation receipt
  const [showSummary, setShowSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastDonation, setLastDonation] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Lazy initialize state directly from localStorage (avoids cascading render warning)
  const [historyList, setHistoryList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("reloc8Donations")) || [];
    } catch {
      return [];
    }
  });

  // Toggle item selection
  const toggleItem = (item) => {
    if (selectedItems.some(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Dynamic calculations
  const itemTotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.price, 0);
  }, [selectedItems]);

  const finalTotal = useMemo(() => {
    return itemTotal + Number(customAmount || 0);
  }, [itemTotal, customAmount]);

  // Execute demo payment, update resource counts, and sync history
  const handleConfirmDonation = () => {
    if (finalTotal <= 0) return;

    const centreObj = reliefCentres.find(c => c.id === selectedCentre);

    const newDonation = {
      id: `RLX-${Date.now().toString().slice(-6)}`,
      donor_name: displayName,
      amount: finalTotal,
      currency: "INR",
      centre: centreObj ? centreObj.name : "Central Relief Camp",
      items: selectedItems.map(i => ({ id: i.id, name: i.name, price: i.price })),
      status: "COMPLETED",
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2026' })
    };

    // 1. Update reloc8Donations in localStorage and React state
    const existing = JSON.parse(localStorage.getItem("reloc8Donations")) || [];
    const updated = [newDonation, ...existing];
    localStorage.setItem("reloc8Donations", JSON.stringify(updated));
    setHistoryList(updated);

    // 2. Update resource allocation counters for Authority view
    const currentResources = JSON.parse(localStorage.getItem("reloc8ReliefResources")) || {};
    selectedItems.forEach(item => {
      currentResources[item.id] = (currentResources[item.id] || 0) + 1;
    });
    localStorage.setItem("reloc8ReliefResources", JSON.stringify(currentResources));

    setLastDonation(newDonation);
    setShowSummary(false);
    setShowSuccess(true);
    setSelectedItems([]);
    setCustomAmount("");
  };

  return (
    <div className="donation-page-wrapper">
      <div className="donation-frame">

        {/* Top Header */}
        <div className="donation-header">
          <button className="back-circle-btn" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <div className="header-title-box">
            <h3>Relief Resource Allocation</h3>
            <p>Direct Essentials for Evacuated Families</p>
          </div>
          <button 
            className="history-nav-btn" 
            onClick={() => setShowHistory(true)}
            title="My Contributions"
          >
            <Clock size={19} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="donation-body">

          {/* Greeting Banner */}
          <div className="impact-banner">
            <div className="banner-top">
              <span className="badge-pill">🤝 Direct Relief</span>
              <span className="donor-tag">Hello, {displayName} 👋</span>
            </div>
            <h4>Sponsor Evacuation Essentials</h4>
            <p>
              Citizens relocated to municipal shelters urgently need daily essentials. Sponsor items starting from ₹20.
            </p>
          </div>

          {/* Section 1: Choose Relief Centre */}
          <div className="form-section">
            <label className="section-label">
              <MapPin size={16} color="#059669" />
              <span>Select Designated Relief Shelter</span>
            </label>
            <div className="centre-selector-grid">
              {reliefCentres.map((centre) => (
                <div
                  key={centre.id}
                  className={`centre-card ${selectedCentre === centre.id ? 'active' : ''}`}
                  onClick={() => setSelectedCentre(centre.id)}
                >
                  <div className="centre-info">
                    <strong>{centre.name}</strong>
                    <span className="priority-tag">{centre.priority} NEED</span>
                  </div>
                  <div className={`radio-dot ${selectedCentre === centre.id ? 'checked' : ''}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Choose Relief Items */}
          <div className="form-section">
            <div className="section-title-row">
              <label className="section-label">
                <Package size={16} color="#059669" />
                <span>Select Items to Sponsor</span>
              </label>
              <span className="selection-count">{selectedItems.length} selected</span>
            </div>

            <div className="relief-items-list">
              {reliefItemsData.map((item) => {
                const isSelected = selectedItems.some(i => i.id === item.id);
                const pct = Math.round((item.sponsored / item.required) * 100);

                return (
                  <div
                    key={item.id}
                    className={`relief-item-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleItem(item)}
                  >
                    <div className="item-main-row">
                      <div className="item-icon-wrap">{item.icon}</div>
                      <div className="item-text-wrap">
                        <div className="item-title-row">
                          <span className="item-title">{item.name}</span>
                          <span className="item-price">₹{item.price}</span>
                        </div>
                        <p className="item-desc">{item.description}</p>
                      </div>
                      <div className={`checkbox-box ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <CheckCircle2 size={18} color="#ffffff" />}
                      </div>
                    </div>

                    {/* Needs Progress Bar */}
                    <div className="item-progress-section">
                      <div className="progress-labels">
                        <span>{item.sponsored} / {item.required} sponsored</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Custom Amount Addition */}
          <div className="form-section custom-amount-card">
            <label className="section-label">Additional Relief Support</label>
            <div className="custom-input-wrapper">
              <span className="currency-prefix">₹</span>
              <input
                type="number"
                placeholder="Enter custom amount (e.g. 50)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="0"
              />
            </div>
            <div className="quick-chip-row">
              {[20, 50, 100, 250].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className="quick-chip"
                  onClick={() => setCustomAmount(String(amt))}
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Action Bar */}
        <div className="donation-bottom-bar">
          <div className="total-breakdown">
            <span className="total-label">Total Allocation</span>
            <span className="total-number">₹{finalTotal}</span>
          </div>
          <button
            className="donate-action-btn"
            disabled={finalTotal <= 0}
            onClick={() => setShowSummary(true)}
          >
            <span>Confirm & Sponsor</span>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Modal: Summary Confirmation */}
        {showSummary && (
          <div className="modal-backdrop">
            <div className="summary-sheet">
              <div className="modal-top">
                <h4>Confirm Contribution</h4>
                <button className="close-btn" onClick={() => setShowSummary(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="summary-centre-info">
                <MapPin size={16} color="#059669" />
                <span>Destination: <strong>{reliefCentres.find(c => c.id === selectedCentre)?.name}</strong></span>
              </div>

              <div className="summary-items-list">
                {selectedItems.map((item) => (
                  <div key={item.id} className="summary-row">
                    <span>{item.icon} {item.name}</span>
                    <strong>₹{item.price}</strong>
                  </div>
                ))}
                {Number(customAmount) > 0 && (
                  <div className="summary-row">
                    <span>✨ General Relief Fund</span>
                    <strong>₹{customAmount}</strong>
                  </div>
                )}
                <div className="summary-divider" />
                <div className="summary-row total-row">
                  <span>Grand Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <button className="confirm-upi-btn" onClick={handleConfirmDonation}>
                <span>Proceed via UPI / Demo Pay (₹{finalTotal})</span>
                <ShieldCheck size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Modal: Success Screen */}
        {showSuccess && lastDonation && (
          <div className="modal-backdrop">
            <div className="success-dialog-card">
              <div className="success-check-icon">
                <CheckCircle2 size={48} color="#059669" />
              </div>
              <h3>Contribution Recorded!</h3>
              <div className="success-amount-pill">₹{lastDonation.amount} Allocated</div>
              <p className="success-note">
                Your sponsored relief essentials have been earmarked for distribution at <strong>{lastDonation.centre}</strong>.
              </p>

              <div className="receipt-box">
                <div className="receipt-line">
                  <span>Donation ID:</span>
                  <code>{lastDonation.id}</code>
                </div>
                <div className="receipt-line">
                  <span>Status:</span>
                  <span className="status-green">✓ Completed</span>
                </div>
                <div className="receipt-line">
                  <span>Date:</span>
                  <span>{lastDonation.date}</span>
                </div>
              </div>

              <div className="success-btn-group">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowSuccess(false);
                    setShowHistory(true);
                  }}
                >
                  View History
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setShowSuccess(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Donation History Drawer */}
        {showHistory && (
          <div className="modal-backdrop">
            <div className="history-sheet">
              <div className="modal-top">
                <h4>My Contributions</h4>
                <button className="close-btn" onClick={() => setShowHistory(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="history-scroll-list">
                {historyList.length === 0 ? (
                  <div className="empty-history">
                    <HeartHandshake size={36} color="#94a3b8" />
                    <p>No contributions made yet.</p>
                  </div>
                ) : (
                  historyList.map((item, idx) => (
                    <div key={idx} className="history-card">
                      <div className="history-head">
                        <strong>₹{item.amount}</strong>
                        <span className="history-status">✓ Completed</span>
                      </div>
                      <div className="history-centre">📍 {item.centre}</div>
                      <div className="history-meta">
                        <span>ID: {item.id}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}