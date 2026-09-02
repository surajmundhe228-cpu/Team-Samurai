import React from "react";

function Navbar({ darkMode, setDarkMode }) {

  return (
    <header className="navbar">

      <div>
        <h2>Reloc8</h2>
        <span>Flood & Emergency Management System</span>
      </div>

      <div className="navbar-right">

        <div className="status-dot"></div>

        <span>System Online</span>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode((previous) => !previous)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

      </div>

    </header>
  );
}

export default Navbar;