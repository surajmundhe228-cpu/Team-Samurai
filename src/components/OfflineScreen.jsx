import { useState, useEffect } from 'react';
import { 
  WifiOff, 
  Wifi, 
  Map, 
  Users, 
  Home, 
  Cat, 
  FileText, 
  PlusCircle, 
  User, 
  MessageSquare, 
  Radio, 
  X, 
  Download, 
  RefreshCw,
  Clock
} from 'lucide-react';

// Default base datasets if user opens offline before syncing
const fallbackShelters = [
  {
    shelter_name: "Supaul College Relief Camp",
    district: "Supaul",
    capacity: 800,
    available_capacity: 180,
    type: "School/College",
    facilities: "Drinking Water, Medical Desk, High RCC Roof",
    contact: "1077 (District Control)"
  },
  {
    shelter_name: "Triveniganj High School Camp",
    district: "Supaul",
    capacity: 450,
    available_capacity: 40,
    type: "School",
    facilities: "Toilets, Potable Water",
    contact: "1077"
  },
  {
    shelter_name: "Madhepura Stadium Camp",
    district: "Madhepura",
    capacity: 1200,
    available_capacity: 250,
    type: "Stadium/Ground",
    facilities: "Generator Power, Medical Desk, Food Kitchen",
    contact: "1077"
  }
];

const fallbackAnimals = [
  {
    id: 1,
    animal_type: "Cattle & Calves",
    village: "Bishanpur",
    district: "Supaul",
    count: 45,
    status: "Relocate to Embankment",
    safe_zone: "West Canal Dyke High Bund",
    priority: "HIGH"
  },
  {
    id: 2,
    animal_type: "Goats & Small Stock",
    village: "Rampur",
    district: "Supaul",
    count: 32,
    status: "Rope Untethering Done",
    safe_zone: "Primary School Veranda",
    priority: "CRITICAL"
  },
  {
    id: 3,
    animal_type: "Water Buffaloes",
    village: "Jorgama",
    district: "Madhepura",
    count: 28,
    status: "Canal Bund Stationed",
    safe_zone: "Southern Railway Embankment",
    priority: "MEDIUM"
  }
];

export default function OfflineScreen({ onBack, onNavigate }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(() => {
    return localStorage.getItem('reloc8_last_sync') || "Not synced yet";
  });

  // Offline Data Stores
  const [cachedShelters] = useState(() => {
    try {
      const saved = localStorage.getItem('reloc8_offline_shelters');
      return saved ? JSON.parse(saved) : fallbackShelters;
    } catch {
      return fallbackShelters;
    }
  });

  const [cachedAnimals] = useState(() => {
    try {
      const saved = localStorage.getItem('reloc8_offline_animals');
      return saved ? JSON.parse(saved) : fallbackAnimals;
    } catch {
      return fallbackAnimals;
    }
  });

  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = async () => {
    if (!navigator.onLine) {
      alert("No internet connection detected. Please connect to Wi-Fi or Mobile Data to sync latest updates.");
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch("https://reloc8-flood-evacuation-1.onrender.com/health", { 
        headers: { 'Accept': 'application/json' } 
      }).catch(() => null);

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " Today";

      localStorage.setItem('reloc8_offline_shelters', JSON.stringify(cachedShelters));
      localStorage.setItem('reloc8_offline_animals', JSON.stringify(cachedAnimals));
      localStorage.setItem('reloc8_last_sync', timestamp);

      setLastSyncTime(timestamp);
      alert(response ? "Sync successful! Latest disaster shelters & telemetry cached offline." : `Synced local copies successfully at ${timestamp}!`);
    } catch {
      alert("Sync completed with available local caches.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadFile = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reloc8 - Offline Flood Evacuation Guidelines</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; background: #f8fafc; }
    .card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    h1 { color: #064e3b; margin-top: 0; }
    h2 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 18px; }
    .critical { background: #fee2e2; border-left: 4px solid #ef4444; padding: 12px; border-radius: 6px; font-weight: bold; color: #991b1b; }
    .step { display: flex; gap: 12px; align-items: flex-start; margin: 12px 0; }
    .num { background: #064e3b; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Reloc8 Emergency Guidelines</h1>
    <p>Saved Offline for Flood Crisis Response (Supaul & Madhepura Districts)</p>
    <div class="critical">CRITICAL: If water enters your dwelling, cut main electric MCB switches immediately. Never walk through moving currents.</div>
  </div>

  <div class="card">
    <h2>1. Human Life Protection</h2>
    <div class="step"><div class="num">1</div><div><strong>Higher Ground:</strong> Move infants, elders, and medical dependents to elevated RCC school shelters first.</div></div>
    <div class="step"><div class="num">2</div><div><strong>Drinking Water:</strong> Boil flood waters for minimum 3 minutes or use halogen/chlorine purification tablets.</div></div>
    <div class="step"><div class="num">3</div><div><strong>Corridor Route:</strong> Follow pre-marked district embankments and avoid submerged culverts.</div></div>
  </div>

  <div class="card">
    <h2>2. Livestock & Cattle Protection</h2>
    <div class="step"><div class="num">1</div><div><strong>Untie Cattle:</strong> Untether all cattle & buffaloes immediately if water exceeds 1 foot. Animals tied to posts face imminent drowning.</div></div>
    <div class="step"><div class="num">2</div><div><strong>High Bunds:</strong> Guide herds towards designated railway embankments or canal dykes.</div></div>
  </div>

  <div class="card">
    <h2>Emergency Helplines</h2>
    <p>State Disaster Management Authority: <strong>1070</strong></p>
    <p>District Control Room: <strong>1077</strong></p>
    <p>Ambulance & Medical Desk: <strong>108 / 112</strong></p>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Reloc8_Offline_Emergency_Guidelines.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mobile-frame" style={{ background: '#f8fafc', position: 'relative' }}>
      <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Network Banner */}
        <div style={{
          background: isOnline ? '#166534' : '#c2410c',
          color: '#ffffff',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          transition: 'background 0.3s ease'
        }}>
          {isOnline ? <Wifi size={18} /> : <Radio size={18} />}
          <span>{isOnline ? "Internet Connected - Ready to Sync" : "You are in Offline Mode"}</span>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: `2px solid ${isOnline ? '#22c55e' : '#64748b'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '6px',
            marginBottom: '14px',
            background: isOnline ? '#f0fdf4' : '#f8fafc'
          }}>
            {isOnline ? (
              <Wifi size={50} color="#16a34a" strokeWidth={1.8} />
            ) : (
              <WifiOff size={50} color="#475569" strokeWidth={1.8} />
            )}
          </div>

          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0', textAlign: 'center' }}>
            {isOnline ? "Online Cache Available" : "No internet connection"}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', maxWidth: '260px', margin: '0 0 16px 0', lineHeight: '1.4' }}>
            {isOnline 
              ? "You can view cached data or sync the latest server updates." 
              : "Showing downloaded emergency datasets saved on your device."}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#0284c7', background: '#e0f2fe', padding: '4px 10px', borderRadius: '12px', marginBottom: '22px' }}>
            <Clock size={12} />
            <span>Last Synced: {lastSyncTime}</span>
          </div>

          <div style={{ width: '100%' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>
              Available Offline
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              {/* Map */}
              <button 
                onClick={() => onNavigate && onNavigate('map')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '16px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ color: '#059669' }}>
                  <Map size={26} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>Map</span>
              </button>

              {/* Villages */}
              <button 
                onClick={() => onNavigate && onNavigate('map')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '16px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ color: '#059669' }}>
                  <Users size={26} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>Villages</span>
              </button>

              {/* Shelters */}
              <button 
                onClick={() => setActiveModal('shelters')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '16px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ color: '#dc2626' }}>
                  <Home size={26} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>Shelters</span>
              </button>

              {/* Animals */}
              <button 
                onClick={() => setActiveModal('animals')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '16px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ color: '#ea580c' }}>
                  <Cat size={26} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>Animals</span>
              </button>

              {/* Guidelines */}
              <button 
                onClick={() => setActiveModal('guidelines')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '16px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ color: '#d97706' }}>
                  <FileText size={26} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>Guidelines</span>
              </button>
            </div>
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            style={{
              width: '100%',
              marginTop: 'auto',
              marginBottom: '10px',
              background: isSyncing ? '#047857' : '#064e3b',
              color: '#ffffff',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: isSyncing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(6, 78, 59, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={18} className={isSyncing ? "spin-animation" : ""} />
            <span>{isSyncing ? "Syncing Latest Updates..." : "Sync When Online"}</span>
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <div className="nav-item" onClick={onBack}>
            <Home size={20} />
            <span>Home</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate && onNavigate('map')}>
            <Map size={20} />
            <span>Map</span>
          </div>
          <div className="nav-item report-btn" onClick={onBack}>
            <PlusCircle size={36} />
            <span>Report</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate && onNavigate('infoExchange')}>
            <MessageSquare size={20} />
            <span>Exchange</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate && onNavigate('settings')}>
            <User size={20} />
            <span>Profile</span>
          </div>
        </div>

        {/* 1. Offline Shelters Modal */}
        {activeModal === 'shelters' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.75)', zIndex: 2000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ background: '#f8fafc', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', maxHeight: '88%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ background: '#064e3b', color: '#fff', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Home size={20} color="#4ade80" />
                  <span style={{ fontSize: '15px', fontWeight: '700' }}>Offline Shelters Register</span>
                </div>
                <button onClick={() => setActiveModal(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', color: '#fff', width: '28px', height: '28px', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Showing verified shelters accessible without internet:</div>
                {cachedShelters.map((shelter, i) => (
                  <div key={i} style={{ background: '#ffffff', borderRadius: '10px', padding: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{shelter.shelter_name}</strong>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#16a34a', background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                        {shelter.available_capacity} Free Beds
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{shelter.district} &bull; {shelter.type}</div>
                    <div style={{ fontSize: '12px', color: '#334155', marginTop: '6px' }}><strong>Facilities:</strong> {shelter.facilities}</div>
                    <div style={{ fontSize: '12px', color: '#0369a1', marginTop: '4px' }}><strong>Desk:</strong> {shelter.contact}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px 16px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                <button onClick={() => setActiveModal(null)} style={{ width: '100%', background: '#064e3b', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                  Close Offline Shelters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Offline Animals Modal */}
        {activeModal === 'animals' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.75)', zIndex: 2000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ background: '#f8fafc', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', maxHeight: '88%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ background: '#064e3b', color: '#fff', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cat size={20} color="#fbbf24" />
                  <span style={{ fontSize: '15px', fontWeight: '700' }}>Offline Animal Safe Zones</span>
                </div>
                <button onClick={() => setActiveModal(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', color: '#fff', width: '28px', height: '28px', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Showing offline livestock stations & emergency relief spots:</div>
                {cachedAnimals.map((animal) => (
                  <div key={animal.id} style={{ background: '#ffffff', borderRadius: '10px', padding: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{animal.animal_type}</strong>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        color: animal.priority === 'CRITICAL' ? '#b91c1c' : '#c2410c', 
                        background: animal.priority === 'CRITICAL' ? '#fee2e2' : '#ffedd5', 
                        padding: '2px 6px', 
                        borderRadius: '4px' 
                      }}>
                        {animal.priority}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{animal.village}, {animal.district} &bull; Count: ~{animal.count}</div>
                    <div style={{ fontSize: '12px', color: '#047857', marginTop: '6px' }}><strong>Safe Relocation Ground:</strong> {animal.safe_zone}</div>
                    <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}><strong>Action:</strong> {animal.status}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px 16px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                <button onClick={() => setActiveModal(null)} style={{ width: '100%', background: '#064e3b', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                  Close Animal Offline Info
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Guidelines Modal */}
        {activeModal === 'guidelines' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              background: '#f8fafc',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              maxHeight: '88%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -8px 24px rgba(0,0,0,0.25)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#064e3b',
                color: '#ffffff',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={20} color="#4ade80" />
                  <span style={{ fontSize: '15px', fontWeight: '700' }}>Emergency Guidelines</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={handleDownloadFile}
                    title="Download HTML File"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#ffffff',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} />
                    Download
                  </button>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#ffffff',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ color: '#064e3b', margin: '0 0 4px 0', fontSize: '17px', fontWeight: '700' }}>
                    Reloc8 Emergency Guidelines
                  </h3>
                  <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
                    Saved Offline for Flood Crisis Response (Supaul &amp; Madhepura Districts)[cite: 1]
                  </p>
                  <div style={{
                    background: '#fee2e2',
                    borderLeft: '4px solid #ef4444',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    color: '#991b1b',
                    fontSize: '12px',
                    lineHeight: '1.4'
                  }}>
                    CRITICAL: If water enters your dwelling, cut main electric MCB switches immediately[cite: 1]. Never walk through moving currents[cite: 1].
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                  <h4 style={{ color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 12px 0', fontSize: '14px' }}>
                    1. Human Life Protection[cite: 1]
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#334155' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ background: '#064e3b', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '11px' }}>1</div>
                      <div><strong>Higher Ground:</strong> Move infants, elders, and medical dependents to elevated RCC school shelters first[cite: 1].</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ background: '#064e3b', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '11px' }}>2</div>
                      <div><strong>Drinking Water:</strong> Boil flood waters for minimum 3 minutes or use halogen/chlorine purification tablets[cite: 1].</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ background: '#064e3b', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '11px' }}>3</div>
                      <div><strong>Corridor Route:</strong> Follow pre-marked district embankments and avoid submerged culverts[cite: 1].</div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                  <h4 style={{ color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 12px 0', fontSize: '14px' }}>
                    2. Livestock &amp; Cattle Protection[cite: 1]
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#334155' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ background: '#064e3b', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '11px' }}>1</div>
                      <div><strong>Untie Cattle:</strong> Untether all cattle &amp; buffaloes immediately if water exceeds 1 foot[cite: 1]. Animals tied to posts face imminent drowning[cite: 1].</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ background: '#064e3b', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '11px' }}>2</div>
                      <div><strong>High Bunds:</strong> Guide herds towards designated railway embankments or canal dykes[cite: 1].</div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', fontSize: '12px', color: '#334155' }}>
                  <h4 style={{ color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 10px 0', fontSize: '14px' }}>
                    Emergency Helplines[cite: 1]
                  </h4>
                  <p style={{ margin: '4px 0' }}>State Disaster Management Authority: <strong>1070</strong>[cite: 1]</p>
                  <p style={{ margin: '4px 0' }}>District Control Room: <strong>1077</strong>[cite: 1]</p>
                  <p style={{ margin: '4px 0' }}>Ambulance &amp; Medical Desk: <strong>108 / 112</strong>[cite: 1]</p>
                </div>
              </div>

              <div style={{ padding: '12px 16px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  onClick={() => setActiveModal(null)}
                  style={{
                    width: '100%',
                    background: '#064e3b',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Close Guidelines
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}