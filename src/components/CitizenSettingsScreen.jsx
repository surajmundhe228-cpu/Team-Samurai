import { 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  Globe, 
  DownloadCloud, 
  HelpCircle, 
  Info, 
  ChevronRight, 
  LogOut, 
  LogIn,
  Home,
  Map,
  PlusCircle,
  MessageSquare
} from 'lucide-react';
import './CitizenSettingsScreen.css';

export default function CitizenSettingsScreen({ 
  citizenUser, 
  onBack, 
  onOpenAuth, 
  onLogout,
  onNavigate 
}) {
  return (
    <div className="mobile-frame">
      <div className="settings-container">
        
        {/* Header */}
        <div className="settings-header">
          <button className="icon-btn" onClick={onBack} title="Back">
            <ArrowLeft size={22} />
          </button>
          <h2>Settings</h2>
          <div style={{ width: 22 }}></div>
        </div>

        {/* Content */}
        <div className="settings-content">
          
          {/* User Profile Card */}
          {citizenUser ? (
            <div className="profile-card">
              <div className="avatar-circle">
                <User size={36} color="#064e3b" />
              </div>
              <div className="profile-details">
                <h3>{citizenUser.name || 'Citizen'}</h3>
                <span className="role-tag">Citizen</span>
                <p className="profile-email">{citizenUser.email}</p>
              </div>
            </div>
          ) : (
            <div className="guest-card" onClick={onOpenAuth}>
              <div className="avatar-circle guest-avatar">
                <LogIn size={28} color="#064e3b" />
              </div>
              <div className="guest-details">
                <h3>Sign In / Register</h3>
                <p>Tap to log in as a citizen</p>
              </div>
              <ChevronRight size={20} color="#94a3b8" />
            </div>
          )}

          {/* Menu Items List */}
          <div className="settings-list">
            <div className="settings-item" onClick={() => alert('Edit Profile clicked')}>
              <div className="item-left">
                <User size={18} />
                <span>Edit Profile</span>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

            <div className="settings-item" onClick={() => alert('Change Password clicked')}>
              <div className="item-left">
                <Lock size={18} />
                <span>Change Password</span>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

            <div className="settings-item" onClick={() => alert('Notification preferences')}>
              <div className="item-left">
                <Bell size={18} />
                <span>Notifications</span>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

            <div className="settings-item" onClick={() => alert('Language selection')}>
              <div className="item-left">
                <Globe size={18} />
                <span>Language</span>
              </div>
              <div className="item-right">
                <span className="sub-text">English</span>
                <ChevronRight size={18} color="#94a3b8" />
              </div>
            </div>

            <div className="settings-item" onClick={() => onNavigate('offlineScreen')}>
              <div className="item-left">
                <DownloadCloud size={18} />
                <span>Offline Settings</span>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

            <div className="settings-item" onClick={() => alert('Help & Disaster Support helpline')}>
              <div className="item-left">
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

            <div className="settings-item" onClick={() => alert('Reloc8 Disaster Platform v1.0.0')}>
              <div className="item-left">
                <Info size={18} />
                <span>About Reloc8</span>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>
          </div>

          {/* Logout Button */}
          {citizenUser && (
            <button className="logout-box-btn" onClick={onLogout}>
              <LogOut size={18} color="#dc2626" />
              <span>Logout</span>
            </button>
          )}

        </div>

        {/* Bottom Navigation Bar */}
        <div className="bottom-nav">
          <div className="nav-item" onClick={() => onNavigate('citizenDashboard')}>
            <Home size={20} />
            <span>Home</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate('citizenDashboard')}>
            <Map size={20} />
            <span>Map</span>
          </div>
          <div className="nav-item report-btn" onClick={() => onNavigate('citizenDashboard')}>
            <PlusCircle size={36} />
            <span>Report</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate('citizenDashboard')}>
            <MessageSquare size={20} />
            <span>Exchange</span>
          </div>
          <div className="nav-item active">
            <User size={20} />
            <span>Profile</span>
          </div>
        </div>

      </div>
    </div>
  );
}