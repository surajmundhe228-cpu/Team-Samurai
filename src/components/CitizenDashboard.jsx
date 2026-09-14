
import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Map,
  Home,
  MessageSquare,
  Download,
  User,
  Menu,
  Bell,
  ArrowRight,
  ShieldAlert,
  HeartHandshake,
  Sparkles,
  X,
  Send,
  HeartPulse
} from 'lucide-react';
import './CitizenDashboard.css';
import MedicalSOS from './MedicalSOS';

const villagesTelemetry = [
  { village: "Rampur", district: "Supaul", risk_level: "CRITICAL", rainfall_mm: 112.0, river_dist: 1.2 },
  { village: "Bishanpur", district: "Supaul", risk_level: "CRITICAL", rainfall_mm: 108.0, river_dist: 2.5 },
  { village: "Jorgama", district: "Madhepura", risk_level: "CRITICAL", rainfall_mm: 105.5, river_dist: 1.8 },
  { village: "Pratapganj", district: "Supaul", risk_level: "CRITICAL", rainfall_mm: 110.0, river_dist: 2.0 },
  { village: "Udakishunganj", district: "Madhepura", risk_level: "CRITICAL", rainfall_mm: 107.0, river_dist: 1.5 },
];

export default function CitizenDashboard({ citizenUser, onBack, onNavigate }) {
  const isLoggedIn = !!citizenUser;
  const displayName = citizenUser?.name || 'Citizen';

  // AI Assistant Chatbot State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiChat, setAiChat] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${displayName}! I'm Reloc8 Assistant. Ask me anything about safe zones, water levels, emergency contacts, or flood survival.`
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isAiOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChat, isAiOpen]);

  const activeCriticalVillages = useMemo(() => {
    return villagesTelemetry.filter(v => v.risk_level === "CRITICAL");
  }, []);

  const highestRainfallVillage = useMemo(() => {
    return activeCriticalVillages.reduce((max, curr) =>
      curr.rainfall_mm > max.rainfall_mm ? curr : max,
      activeCriticalVillages[0]
    );
  }, [activeCriticalVillages]);

  const handleSendAi = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userQuestion = aiInput.trim();

    setAiChat(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: userQuestion
      }
    ]);

    setAiInput('');

    setTimeout(() => {
      let reply = "Stay on high ground. Tap the Risk Map on your dashboard to view verified evacuation routes.";
      const query = userQuestion.toLowerCase();

      if (
        query.includes('water') ||
        query.includes('flood') ||
        query.includes('rain')
      ) {
        reply = `Critical rainfall (${highestRainfallVillage.rainfall_mm} mm) detected in ${highestRainfallVillage.village}. Avoid low roads and prepare for relocation.`;
      } else if (
        query.includes('contact') ||
        query.includes('help') ||
        query.includes('helpline')
      ) {
        reply = "Emergency Flood Control Room: 1070 | NDRF/SDRF Helpline: 112 / 1078.";
      } else if (
        query.includes('shelter') ||
        query.includes('safe')
      ) {
        reply = "Designated safe relocation shelters are active near the Government Higher Secondary School.";
      } else if (
        query.includes('food') ||
        query.includes('donate')
      ) {
        reply = "Community relief kitchen tokens are available in the Donation card starting from ₹20.";
      }

      setAiChat(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: reply
        }
      ]);
    }, 400);
  };

  return (
    <div className="dashboard-page-wrapper">
      <div className="dashboard-mobile-frame">

        {/* Header Bar */}
        <div className="dashboard-header">
          <button
            className="icon-btn"
            onClick={() => onNavigate('settings')}
            title="Settings Menu"
          >
            <Menu size={22} />
          </button>

          <h2 onClick={onBack} style={{ cursor: 'pointer' }}>
            Reloc8
          </h2>

          <button
            className="icon-btn"
            title="Alerts"
            onClick={() => onNavigate('map')}
          >
            <Bell size={22} color="#dc2626" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="dashboard-content">

          {/* User Greeting */}
          <div className="user-greeting">
            <h3>Hello,{displayName}</h3>

            <p>
              {isLoggedIn
                ? 'Account verified • Live disaster sync active'
                : 'Stay safe, stay connected.'}
            </p>
          </div>

          {/* Red Flood Warning Banner */}
          {activeCriticalVillages.length > 0 && (
            <div className="warning-banner-card">

              <div className="warning-banner-top">

                <div className="warning-banner-left">
                  <ShieldAlert size={18} color="#dc2626" />
                  <span className="warning-banner-title">
                    CRITICAL FLOOD WARNING
                  </span>
                </div>

                <span className="warning-banner-pill">
                  {highestRainfallVillage.rainfall_mm} mm Rain
                </span>

              </div>

              <p className="warning-banner-desc">
                Severe water level surge detected in{' '}
                <strong>{highestRainfallVillage.village}</strong>{' '}
                and surrounding habitations (
                {activeCriticalVillages
                  .map(v => v.village)
                  .slice(0, 3)
                  .join(', ')}
                ). Immediate high-ground relocation advisory in effect.
              </p>

              <button
                className="evac-map-action-btn"
                onClick={() => onNavigate('map')}
              >
                <span>Evacuation Map</span>
                <ArrowRight size={14} />
              </button>

            </div>
          )}

          {/* Quick Access Cards */}
          <div className="quick-access-section">

            <h4 className="section-title">
              Quick Access
            </h4>

            <div className="grid-menu">

              {/* Row 1, Column 1: Risk Map */}
              <div
                className="menu-card"
                onClick={() => onNavigate('map')}
              >
                <div className="card-icon green-icon">
                  <Map size={28} />
                </div>

                <span>Risk Map</span>
              </div>

              {/* Row 1, Column 2: Information Exchange */}
              <div
                className="menu-card"
                onClick={() => onNavigate('infoExchange')}
              >
                <div className="card-icon chat-icon">
                  <MessageSquare size={28} />
                </div>

                <span>Information Exchange</span>
              </div>

              {/* Row 1, Column 3: Offline Center */}
              <div
                className="menu-card"
                onClick={() => onNavigate('offlineScreen')}
              >
                <div className="card-icon dark-green-icon">
                  <Download size={28} />
                </div>

                <span>Offline Center</span>
              </div>

              {/* Row 2, Column 1: Donation */}
              <div
                className="menu-card"
                onClick={() => onNavigate('donation')}
                style={{ gridColumnStart: 1 }}
              >
                <div className="card-icon orange-icon">
                  <HeartHandshake size={28} />
                </div>

                <span>Donation</span>
              </div>

              {/* Row 2, Column 2: Medical SOS */}
              <div
                className="menu-card medical-sos-card"
                onClick={() => setIsSOSOpen(true)}
              >
                <div className="card-icon medical-sos-icon">
                  <HeartPulse size={28} />
                </div>

                <span>Medical SOS</span>
              </div>

            </div>
          </div>

        </div>

        {/* Floating AI Button */}
        <button
          className="floating-ai-btn"
          onClick={() => setIsAiOpen(true)}
          title="Ask Reloc8 AI"
        >
          <div className="floating-ai-inner">
            <Sparkles size={22} color="#0ea5e9" />
          </div>
        </button>

        {/* AI Pop-up Chat Modal */}
        {isAiOpen && (
          <div className="ai-modal-overlay">

            <div className="ai-modal-card">

              <div className="ai-modal-header">

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={18} color="#38bdf8" />

                  <h4
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: 800
                    }}
                  >
                    Reloc8 AI
                  </h4>
                </div>

                <button
                  onClick={() => setIsAiOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <X size={20} />
                </button>

              </div>

              <div className="ai-modal-body">

                {aiChat.map((msg) => (
                  <div
                    key={msg.id}
                    className={`ai-bubble ${msg.sender}`}
                  >
                    {msg.text}
                  </div>
                ))}

                <div ref={chatEndRef} />

              </div>

              <form
                onSubmit={handleSendAi}
                className="ai-input-bar"
              >

                <input
                  type="text"
                  placeholder="Ask about water levels, shelter, helpline..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="ai-text-input"
                />

                <button
                  type="submit"
                  className="ai-send-btn"
                  disabled={!aiInput.trim()}
                >
                  <Send size={15} />
                </button>

              </form>

            </div>

          </div>
        )}

        {/* Medical SOS Modal */}
        {isSOSOpen && (
          <MedicalSOS
            citizenUser={citizenUser}
            onClose={() => setIsSOSOpen(false)}
          />
        )}

        {/* Bottom Navigation */}
        <div className="bottom-nav">

          <div
            className="nav-item active"
            onClick={() => onNavigate('citizenDashboard')}
          >
            <Home size={18} />
            <span>Home</span>
          </div>

          <div
            className="nav-item"
            onClick={() => onNavigate('map')}
          >
            <Map size={18} />
            <span>Map</span>
          </div>

          <div
            className="nav-item"
            onClick={() => onNavigate('infoExchange')}
          >
            <MessageSquare size={18} />
            <span>Exchange</span>
          </div>

          <div
            className="nav-item"
            onClick={() => onNavigate('settings')}
          >
            <User size={18} />
            <span>Profile</span>
          </div>

        </div>

      </div>
    </div>
  );
}
