import React, { useEffect, useState } from "react";

function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    let restoredTimer;

    function handleOnline() {
      setOnline(true);
      setShowRestored(true);

      restoredTimer = setTimeout(() => {
        setShowRestored(false);
      }, 4000);
    }

    function handleOffline() {
      setOnline(false);
      setShowRestored(false);

      if (restoredTimer) {
        clearTimeout(restoredTimer);
      }
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if (restoredTimer) {
        clearTimeout(restoredTimer);
      }
    };
  }, []);

  /* =========================
     CONNECTION RESTORED
  ========================= */

  if (showRestored) {
    return (
      <div
        className="offline-banner connection-restored"
        role="status"
        aria-live="polite"
      >
        <div className="offline-banner-icon">
          🟢
        </div>

        <div className="offline-banner-content">
          <strong>Connection Restored</strong>

          <p>
            Reloc8 is back online.
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     OFFLINE MODE
  ========================= */

  if (!online) {
    return (
      <div
        className="offline-banner"
        role="alert"
        aria-live="assertive"
      >
        <div className="offline-banner-icon">
          🔴
        </div>

        <div className="offline-banner-content">
          <strong>OFFLINE MODE</strong>

          <p>
            Internet connection unavailable.
            Cached Reloc8 data and the Emergency
            Guide remain available.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default OfflineBanner;