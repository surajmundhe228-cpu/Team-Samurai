import React, { useEffect, useState } from "react";

function ConnectionStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`connection-status ${
        online ? "online" : "offline"
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="connection-status-indicator">
        {online ? "🟢" : "🔴"}
      </span>

      <span className="connection-status-text">
        {online ? "System Online" : "Offline Mode"}
      </span>
    </div>
  );
}

export default ConnectionStatus;