import { useEffect, useState } from 'react';
import {
  Menu,
  Bell,
  LogOut,
  ShieldCheck,
  HeartPulse,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import './AuthorityDashboard.css';

export default function AuthorityDashboard({ user, onBack, onLogout }) {
  const officerName = user?.email
    ? user.email.split('@')[0]
    : 'Authority';

  const [sosAlerts, setSosAlerts] = useState([]);

  // Load SOS alerts from Citizen Dashboard
  useEffect(() => {
    const loadSOS = () => {
      const alerts =
        JSON.parse(localStorage.getItem('reloc8SOSAlerts')) || [];

      setSosAlerts(alerts);
    };

    loadSOS();

    // Check for new SOS every second
    const interval = setInterval(loadSOS, 1000);

    return () => clearInterval(interval);
  }, []);

  // Accept SOS
  const handleAccept = (id) => {
    const updated = sosAlerts.map((item) =>
      item.id === id
        ? { ...item, status: 'ACCEPTED' }
        : item
    );

    setSosAlerts(updated);

    localStorage.setItem(
      'reloc8SOSAlerts',
      JSON.stringify(updated)
    );
  };

  // Resolve SOS
  const handleResolve = (id) => {
    const updated = sosAlerts.filter(
      (item) => item.id !== id
    );

    setSosAlerts(updated);

    localStorage.setItem(
      'reloc8SOSAlerts',
      JSON.stringify(updated)
    );
  };

  return (
    <div className="mobile-frame">
      <div className="auth-dash-container">

        {/* HEADER */}
        <div className="auth-dash-header">

          <button
            className="icon-btn"
            onClick={onBack}
            title="Back"
          >
            <Menu size={22} />
          </button>

          <h2
            onClick={onBack}
            style={{ cursor: 'pointer' }}
          >
            Reloc8
          </h2>

          <div className="header-actions">

            <button
              className="icon-btn"
              title="Alerts"
            >
              <Bell size={22} />
            </button>

            <button
              className="icon-btn logout-icon"
              onClick={onLogout}
              title="Logout Authority"
            >
              <LogOut size={20} />
            </button>

          </div>
        </div>

        {/* CONTENT */}
        <div className="auth-dash-content">

          {/* WELCOME BOX */}
          <div className="authority-greeting-box">

            <div className="shield-icon-wrapper">
              <ShieldCheck
                size={48}
                color="#065f46"
              />
            </div>

            <h3>
              Welcome, {officerName}
            </h3>

            <p>
              Official Authority Portal Active
            </p>

          </div>

          {/* MEDICAL SOS ALERTS */}
          {sosAlerts.length > 0 && (
            <div className="authority-sos-section">

              <div className="authority-sos-heading">

                <div>
                  <h3>
                    <HeartPulse size={19} />
                    Medical SOS Alerts
                  </h3>

                  <p>
                    {sosAlerts.length} emergency request
                    {sosAlerts.length > 1 ? 's' : ''} received
                  </p>
                </div>

                <span className="sos-live-badge">
                  LIVE
                </span>

              </div>

              {/* SOS CARDS */}
              {sosAlerts.map((alert) => (

                <div
                  className="authority-sos-card"
                  key={alert.id}
                >

                  <div className="authority-sos-card-top">

                    <div className="authority-patient">

                      <HeartPulse size={18} />

                      <strong>
                        {alert.patientName}
                      </strong>

                    </div>

                    <span className="pending-badge">
                      {alert.status}
                    </span>

                  </div>

                  <div className="authority-sos-details">

                    <div>
                      <Phone size={14} />
                      {alert.phone}
                    </div>

                    <div>
                      <MapPin size={14} />
                      {alert.location}
                    </div>

                    <div>
                      <AlertTriangle size={14} />
                      {alert.emergencyType}
                    </div>

                    {alert.description && (
                      <p>
                        {alert.description}
                      </p>
                    )}

                    <small>
                      <Clock size={12} />
                      {alert.createdAt}
                    </small>

                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="authority-sos-actions">

                    {alert.status !== 'ACCEPTED' && (
                      <button
                        className="accept-sos-btn"
                        onClick={() =>
                          handleAccept(alert.id)
                        }
                      >
                        <CheckCircle size={15} />
                        Accept
                      </button>
                    )}

                    <button
                      className="resolve-sos-btn"
                      onClick={() =>
                        handleResolve(alert.id)
                      }
                    >
                      Resolve
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}