import React from "react";

function Navbar() {

  return (
    <header className="navbar">

      {/* =========================
          BRAND
      ========================= */}

      <div className="navbar-brand">

        <div className="navbar-logo">
          🌊
        </div>

        <div className="navbar-title">

          <h2>
            Reloc8
          </h2>

          <span>
            Flood & Emergency Management System
          </span>

        </div>

      </div>


      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className="navbar-right">

        {/* SYSTEM STATUS */}

        <div className="navbar-status">

          <span className="status-dot"></span>

          <span>
            System Online
          </span>

        </div>

      </div>

    </header>
  );
}

export default Navbar;