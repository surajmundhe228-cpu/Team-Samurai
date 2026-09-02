import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {

  return (
    <aside className="sidebar">

      <div className="logo-section">

        <div className="logo-icon">
          🌊
        </div>

        <div>
          <h2>Reloc8</h2>
          <p>AI Emergency System</p>
        </div>

      </div>

      <nav>

        <NavLink to="/" className="nav-link">
          📊 Dashboard
        </NavLink>

        <NavLink to="/risk" className="nav-link">
          ⚠️ Risk Assessment
        </NavLink>

        <NavLink to="/shelters" className="nav-link">
          🏠 Relief Shelters
        </NavLink>

        <NavLink to="/evacuation" className="nav-link">
          🚨 Evacuation Plan
        </NavLink>

      </nav>

      <div className="sidebar-bottom">

        <div className="emergency-box">
          <strong>Emergency Status</strong>
          <span>Monitoring Active</span>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;