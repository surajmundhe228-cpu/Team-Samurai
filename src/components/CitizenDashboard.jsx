import { useState, useMemo } from 'react';
import { 
  Map, 
  Home, 
  PawPrint, 
  AlertTriangle, 
  MessageSquare, 
  Download, 
  User, 
  PlusCircle, 
  Menu, 
  Bell,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import ReportIncidentModal from './ReportIncidentModal';
import './CitizenDashboard.css';

// Embedded village telemetry to calculate live alerts automatically
const villagesTelemetry = [
  { village: "Rampur", district: "Supaul", risk_level: "CRITICAL", rainfall_mm: 112.0, river_dist: 1.2 },
  { village: "Bishanpur", district: "Supaul", risk_level: "CRITICAL", rainfall_mm: 108.0, river_dist: 2.5 },
  { village: "Jorgama", district: "Madhepura", risk_level: "CRITICAL", rainfall_mm: 105.5, river_dist: 1.8 },
  { village: "Pratapganj", district: "Supaul", risk_level: "CRITICAL", rainfall_mm: 110.0, river_dist: 2.0 },
  { village: "Udakishunganj", district: "Madhepura", risk_level: "CRITICAL", rainfall_mm: 107.0, river_dist: 1.5 },
];

export default function CitizenDashboard({ citizenUser, onBack, onNavigate }) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const displayName = citizenUser?.name || 'Citizen';

  // Compute the highest priority alert dynamically from the data
  const activeCriticalVillages = useMemo(() => {
    return villagesTelemetry.filter(v => v.risk_level === "CRITICAL");
  }, []);

  const highestRainfallVillage = useMemo(() => {
    return activeCriticalVillages.reduce((max, curr) => 
      curr.rainfall_mm > max.rainfall_mm ? curr : max, activeCriticalVillages[0]
    );
  }, [activeCriticalVillages]);

  return (
    <div className="mobile-frame">
      <div className="dashboard-container">
        
        {/* Header Bar */}
        <div className="dashboard-header">
          <button 
            className="icon-btn" 
            onClick={() => onNavigate('settings')} 
            title="Settings Menu"
          >
            <Menu size={22} />
          </button>
          <h2 onClick={onBack} style={{ cursor: 'pointer' }}>Reloc8</h2>
          <button className="icon-btn" title="Alerts & Notifications" onClick={() => onNavigate('map')}>
            <Bell size={22} color="#dc2626" />
          </button>
        </div>

        {/* Dashboard Main Content */}
        <div className="dashboard-content">
          
          {/* User Greeting */}
          <div className="user-greeting">
            <h3>Hello, {displayName} 👋</h3>
            <p>Stay safe, stay connected.</p>
          </div>

          {/* ======================================================== */}
          {/* DYNAMIC TELEMETRY FLOOD ALERT BANNER                     */}
          {/* ======================================================== */}
          {activeCriticalVillages.length > 0 && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderLeft: '5px solid #dc2626',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={20} color="#dc2626" />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Critical Flood Warning
                  </span>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#ffffff',
                  background: '#dc2626',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {highestRainfallVillage.rainfall_mm} mm Rain
                </span>
              </div>

              <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#7f1d1d', lineHeight: '1.4' }}>
                Severe water level surge detected in <strong>{highestRainfallVillage.village}</strong> and surrounding habitations ({activeCriticalVillages.map(v => v.village).slice(0, 3).join(', ')}). Immediate high-ground relocation advisory in effect.
              </p>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={() => onNavigate('map')}
                  style={{
                    flex: 1,
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <span>Evacuation Map</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => onNavigate('shelters')}
                  style={{
                    background: '#ffffff',
                    color: '#991b1b',
                    border: '1px solid #fecaca',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Nearby Shelters
                </button>
              </div>
            </div>
          )}

          {/* Quick Access Menu Grid */}
          <div className="quick-access-section">
            <h4 className="section-title">Quick Access</h4>
            
            <div className="grid-menu">
              {/* 1. Risk Map Card */}
              <div className="menu-card" onClick={() => onNavigate('map')}>
                <div className="card-icon green-icon">
                  <Map size={28} />
                </div>
                <span>Risk Map</span>
              </div>

              {/* 2. Shelters Card */}
              <div className="menu-card" onClick={() => onNavigate('shelters')}>
                <div className="card-icon blue-icon">
                  <Home size={28} />
                </div>
                <span>Nearby Shelters</span>
              </div>

              {/* 3. Animal Info Card */}
              <div className="menu-card" onClick={() => onNavigate('animalInfo')}>
                <div className="card-icon purple-icon">
                  <PawPrint size={28} />
                </div>
                <span>Animal Info</span>
              </div>

              {/* 4. Report Incident Card */}
              <div className="menu-card" onClick={() => setIsReportOpen(true)}>
                <div className="card-icon red-icon">
                  <AlertTriangle size={28} />
                </div>
                <span>Report Incident</span>
              </div>

              {/* 5. Information Exchange Card */}
              <div className="menu-card" onClick={() => onNavigate('infoExchange')}>
                <div className="card-icon chat-icon">
                  <MessageSquare size={28} />
                </div>
                <span>Information Exchange</span>
              </div>

              {/* 6. Offline Center Card */}
              <div className="menu-card" onClick={() => onNavigate('offlineScreen')}>
                <div className="card-icon dark-green-icon">
                  <Download size={28} />
                </div>
                <span>Offline Center</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <div className="nav-item active" onClick={() => onNavigate('citizenDashboard')}>
            <Home size={20} />
            <span>Home</span>
          </div>

          <div className="nav-item" onClick={() => onNavigate('map')}>
            <Map size={20} />
            <span>Map</span>
          </div>

          <div className="nav-item report-btn" onClick={() => setIsReportOpen(true)}>
            <PlusCircle size={36} />
            <span>Report</span>
          </div>

          <div className="nav-item" onClick={() => onNavigate('infoExchange')}>
            <MessageSquare size={20} />
            <span>Exchange</span>
          </div>

          <div className="nav-item" onClick={() => onNavigate('settings')}>
            <User size={20} />
            <span>Profile</span>
          </div>
        </div>

        {/* Incident Reporting Modal */}
        <ReportIncidentModal 
          isOpen={isReportOpen} 
          onClose={() => setIsReportOpen(false)} 
        />

      </div>
    </div>
  );
}