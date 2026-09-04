import { MapPinOff } from 'lucide-react';
import './WelcomePage.css';

export default function WelcomePage({ onLogin, onContinueOffline }) {
  return (
    <div className="splash-container">
      <div className="splash-overlay">
        
        {/* Logo & Header */}
        <div className="logo-section">
          <h1 className="logo-title">
            Rel<span className="orange-accent">oc8</span>
          </h1>
          <p className="logo-tagline">Safer Today, Stronger Tomorrow</p>
        </div>

        {/* Subtitle Information */}
        <div className="info-section">
          <h2>Disaster Risk & Relocation</h2>
          <h3>Support System</h3>
        </div>

        {/* Primary Buttons */}
        <div className="actions-section">
          <button 
            className="btn btn-primary" 
            onClick={onLogin}
          >
            Login / Sign In
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onContinueOffline}
          >
            <MapPinOff size={18} />
            <span>Continue Offline</span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="footer-text">
          Working together for a safer future
        </p>

      </div>
    </div>
  );
}