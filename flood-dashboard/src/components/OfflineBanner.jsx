import React, { useEffect, useState } from "react";

function OfflineBanner() {

  const [online, setOnline] = useState(
    navigator.onLine
  );

  const [showRestored, setShowRestored] = useState(false);


  useEffect(() => {

    function handleOnline() {

      setOnline(true);
      setShowRestored(true);

      setTimeout(() => {
        setShowRestored(false);
      }, 4000);

    }


    function handleOffline() {

      setOnline(false);
      setShowRestored(false);

    }


    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );


    return () => {

      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );

    };

  }, []);


  // Show restored message temporarily
  if (showRestored) {

    return (
      <div className="offline-banner connection-restored">

        <span>🟢</span>

        <div>
          <strong>Connection Restored</strong>

          <p>
            Reloc8 is back online.
          </p>
        </div>

      </div>
    );

  }


  // Show offline banner
  if (!online) {

    return (
      <div className="offline-banner">

        <span>🔴</span>

        <div>
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