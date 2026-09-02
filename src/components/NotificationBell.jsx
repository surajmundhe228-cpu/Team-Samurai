import React, { useState, useEffect } from 'react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch notifications from FastAPI backend
    fetch('http://127.0.0.1:8000/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setUnreadCount(data.length);
      })
      .catch((err) => console.error('Error fetching notifications:', err));
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell Icon Button */}
      <button 
        onClick={toggleDropdown} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', position: 'relative' }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-5px', right: '-5px',
            background: 'red', color: 'white', borderRadius: '50%',
            padding: '2px 6px', fontSize: '10px', fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute', right: 0, marginTop: '8px', width: '300px',
          background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 1000, padding: '12px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #334155', paddingBottom: '8px', fontSize: '14px' }}>
            Disaster Alerts
          </h4>
          {notifications.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>No new notifications</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '250px', overflowY: 'auto' }}>
              {notifications.map((notif, index) => (
                <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #334155', fontSize: '12px' }}>
                  <strong style={{ color: '#38bdf8' }}>{notif.title || "Alert"}</strong>
                  <p style={{ margin: '4px 0 0 0', color: '#cbd5e1' }}>{notif.message || notif.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;