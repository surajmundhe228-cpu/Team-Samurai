import { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Home, 
  Map, 
  MessageSquare, 
  User, 
  Wifi, 
  Clock, 
  BookOpen, 
  RefreshCw 
} from 'lucide-react';
import './OfflineScreen.css';

export default function OfflineScreen({ onBack, onNavigate }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState('04:39 AM Today');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date();
      const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSyncTime(`${formatted} Today`);
      setIsSyncing(false);
      alert('Offline cache updated with latest satellite map tiles and safety guidelines.');
    }, 1200);
  };

  const handleOpenGuidelines = () => {
    alert(
      "Flood Survival Guidelines (Cached):\n\n" +
      "1. Move immediately to verified high ground or RCC roof structure.\n" +
      "2. Turn off primary electricity mains and gas cylinders before water enters.\n" +
      "3. Do not walk or drive through moving water deeper than 15 cm (6 inches).\n" +
      "4. Drink only boiled, bottled, or chlorine-purified water."
    );
  };

  return (
    <div className="offline-page-wrapper">
      <div className="offline-mobile-frame">

        {/* 1. Header Bar */}
        <div className="offline-top-header">
          <button className="offline-nav-icon-btn" onClick={() => onNavigate('settings')} title="Menu">
            <Menu size={22} />
          </button>
          <h2 className="offline-header-title" onClick={onBack}>Reloc8</h2>
          <button className="offline-nav-icon-btn" onClick={() => onNavigate('map')} title="Notifications">
            <Bell size={22} color="#dc2626" />
          </button>
        </div>

        {/* 2. Scrollable Body Content */}
        <div className="offline-scroll-area">
          
          {/* Top Connectivity Pill */}
          <div className="offline-status-pill">
            <Wifi size={14} />
            <span>Internet Connected - Ready to Sync</span>
          </div>

          {/* Wi-Fi Circle Graphic */}
          <div className="offline-circle-badge">
            <Wifi size={46} />
          </div>

          {/* Cache Status */}
          <h3 className="offline-cache-title">Online Cache Available</h3>
          <p className="offline-cache-desc">
            You can view cached data or sync the latest server updates.
          </p>

          {/* Last Synced Blue Badge */}
          <div className="offline-synced-badge">
            <Clock size={14} />
            <span>Last Synced: {syncTime}</span>
          </div>

          {/* Available Offline Label */}
          <div className="offline-section-label">Available Offline</div>

          {/* 2-Card Grid: Map & Guidelines Only */}
          <div className="offline-cards-grid">
            {/* Map Card */}
            <div className="offline-action-card" onClick={() => onNavigate('map')}>
              <div className="offline-icon-box-green">
                <Map size={32} />
              </div>
              <span>Map</span>
            </div>

            {/* Guidelines Card */}
            <div className="offline-action-card" onClick={handleOpenGuidelines}>
              <div className="offline-icon-box-orange">
                <BookOpen size={32} />
              </div>
              <span>Guidelines</span>
            </div>
          </div>

          {/* Sync Button */}
          <button className="offline-sync-btn" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw size={16} className={isSyncing ? 'spin-animation' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync When Online'}</span>
          </button>

        </div>

        {/* 3. Bottom Navigation Bar */}
        <div className="offline-bottom-bar">
          <div className="offline-bar-item" onClick={() => onNavigate('citizenDashboard')}>
            <Home size={18} />
            <span>Home</span>
          </div>

          <div className="offline-bar-item" onClick={() => onNavigate('map')}>
            <Map size={18} />
            <span>Map</span>
          </div>

          <div className="offline-bar-item" onClick={() => onNavigate('infoExchange')}>
            <MessageSquare size={18} />
            <span>Exchange</span>
          </div>

          <div className="offline-bar-item" onClick={() => onNavigate('settings')}>
            <User size={18} />
            <span>Profile</span>
          </div>
        </div>

      </div>
    </div>
  );
}