import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {

  const [online, setOnline] = useState(navigator.onLine);


  // =========================
  // ONLINE / OFFLINE DETECTION
  // =========================

  useEffect(() => {

    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
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


  return (
    <aside className="sidebar">


      {/* =========================
          LOGO
      ========================= */}

      <div className="logo-section">

        <div className="logo-icon">
          🌊
        </div>

        <div className="logo-text">

          <h2>
            Reloc8
          </h2>

          <p>
            AI Emergency System
          </p>

        </div>

      </div>


      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="sidebar-nav">


        {/* =========================
            DASHBOARD
        ========================= */}

        <NavLink
          to="/"
          end
          className="nav-link"
        >

          <span className="nav-icon">
            📊
          </span>

          <span className="nav-label">
            Dashboard
          </span>

        </NavLink>


        {/* =========================
            RISK ASSESSMENT
        ========================= */}

        <NavLink
          to="/risk"
          className="nav-link"
        >

          <span className="nav-icon">
            ⚠️
          </span>

          <span className="nav-label">
            Risk Assessment
          </span>

        </NavLink>


        {/* =========================
            RELIEF SHELTERS
        ========================= */}

        <NavLink
          to="/shelters"
          className="nav-link"
        >

          <span className="nav-icon">
            🏠
          </span>

          <span className="nav-label">
            Relief Shelters
          </span>

        </NavLink>


        {/* =========================
            EVACUATION
        ========================= */}

        <NavLink
          to="/evacuation"
          className="nav-link"
        >

          <span className="nav-icon">
            🚨
          </span>

          <span className="nav-label">
            Evacuation
          </span>

        </NavLink>


        {/* =========================
            ANIMAL RESCUE
        ========================= */}

        <NavLink
          to="/animals"
          className="nav-link"
        >

          <span className="nav-icon">
            🐾
          </span>

          <span className="nav-label">
            Animal Rescue
          </span>

        </NavLink>


        {/* =========================
            EMERGENCY
            ONLY VISIBLE OFFLINE
        ========================= */}

        {!online && (

          <NavLink
            to="/emergency"
            className="nav-link emergency-nav-link"
          >

            <span className="nav-icon">
              🆘
            </span>

            <span className="nav-label">
              Emergency
            </span>

          </NavLink>

        )}

      </nav>


      {/* =========================
          SIDEBAR STATUS
      ========================= */}

      <div className="sidebar-bottom">

        <div className="emergency-box">


          <div className="emergency-box-title">

            <span className="status-dot"></span>

            <strong>
              Emergency Status
            </strong>

          </div>


          <span className="emergency-status-text">

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