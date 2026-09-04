import { 
  Menu, 
  Bell, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import './AuthorityDashboard.css';

export default function AuthorityDashboard({ user, onBack, onLogout }) {
  // Extract officer name or fallback to "Authority"
  const officerName = user?.email ? user.email.split('@')[0] : 'Authority';

  return (
    <div className="mobile-frame">
      <div className="auth-dash-container">
        
        {/* Top Header */}
        <div className="auth-dash-header">
          <button className="icon-btn" onClick={onBack} title="Back">
            <Menu size={22} />
          </button>
          <h2 onClick={onBack} style={{ cursor: 'pointer' }}>Reloc8</h2>
          
          <div className="header-actions">
            <button className="icon-btn" title="Alerts">
              <Bell size={22} />
            </button>
            <button className="icon-btn logout-icon" onClick={onLogout} title="Logout Authority">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Content Area - Only Welcome Message */}
        <div className="auth-dash-content">
          <div className="authority-greeting-box">
            <div className="shield-icon-wrapper">
              <ShieldCheck size={48} color="#065f46" />
            </div>
            <h3>Welcome, {officerName}</h3>
            <p>Official Authority Portal Active</p>
          </div>
        </div>

      </div>
    </div>
  );
}