import { Users, Building2, ChevronRight, RefreshCw, ArrowLeft } from 'lucide-react';
import './RoleSelection.css';

export default function RoleSelection({ onSelectRole, onBack }) {
  return (
    <div className="mobile-frame">
      <div className="role-container">
        
        {/* Top Navigation Bar with Back Button */}
        <div className="role-top-bar">
          <button className="back-btn" onClick={onBack} aria-label="Go Back">
            <ArrowLeft size={22} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="role-content">
          {/* Header */}
          <div className="role-header">
            <h2>Who are you?</h2>
            <p>Select your role to continue</p>
          </div>

          {/* Options */}
          <div className="role-cards">
            {/* Citizen Card */}
            <div 
              className="role-card citizen-card" 
              onClick={() => onSelectRole('citizen')}
            >
              <div className="role-icon citizen-icon">
                <Users size={40} />
              </div>
              <div className="role-info">
                <h3>Citizen</h3>
                <p>Stay informed, report incidents and get help</p>
              </div>
              <ChevronRight className="arrow-icon" size={20} />
            </div>

            {/* Authority Card */}
            <div 
              className="role-card authority-card" 
              onClick={() => onSelectRole('authority')}
            >
              <div className="role-icon authority-icon">
                <Building2 size={40} />
              </div>
              <div className="role-info">
                <h3>Authority</h3>
                <p>Monitor, manage and take action</p>
              </div>
              <ChevronRight className="arrow-icon" size={20} />
            </div>
          </div>

          {/* Footer Note */}
          <div className="role-footer-note">
            <RefreshCw size={18} className="note-icon" />
            <span>You can switch role anytime from profile</span>
          </div>
        </div>

      </div>
    </div>
  );
}