import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {

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
    <aside className="sidebar">

      {/* =========================
          LOGO
      ========================= */}

      <div className="logo-section">

        <div className="logo-icon">
          🌊
        </div>

        <div>
          <h2>Reloc8</h2>
          <p>AI Emergency System</p>
        </div>

      </div>


      {/* =========================
          NAVIGATION
      ========================= */}

      <nav>

        <NavLink
          to="/"
          className="nav-link"
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/risk"
          className="nav-link"
        >
          ⚠️ Risk Assessment
        </NavLink>

        <NavLink
          to="/shelters"
          className="nav-link"
        >
          🏠 Relief Shelters
        </NavLink>

        <NavLink
          to="/evacuation"
          className="nav-link"
        >
          🚨 Evacuation Plan
        </NavLink>


        {/* =========================
            OFFLINE EMERGENCY GUIDE
        ========================= */}

        {!online && (
          <NavLink
            to="/emergency"
            className="nav-link emergency-nav-link"
          >
            🆘 Emergency Guide
          </NavLink>
        )}

      </nav>


      {/* =========================
          SIDEBAR BOTTOM
      ========================= */}

      <div className="sidebar-bottom">

        <div className="emergency-box">

          <strong>
            Emergency Status
          </strong>

          <span>
            {online
              ? "Monitoring Active"
              : "Offline Emergency Mode"}
          </span>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;