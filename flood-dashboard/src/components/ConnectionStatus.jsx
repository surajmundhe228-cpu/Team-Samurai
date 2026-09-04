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
      className={
        online
          ? "connection-status online"
          : "connection-status offline"
      }
    >
      <span>{online ? "🟢" : "🔴"}</span>

      <span>
        {online ? "System Online" : "Offline Mode"}
      </span>
    </div>
  );
}

export default ConnectionStatus;