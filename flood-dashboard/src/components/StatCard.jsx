import React from "react";

function StatCard({
  title,
  value,
  subtitle,
  icon,
  type,
}) {

  return (
    <div
      className={`stat-card ${type || ""}`}
    >

      {/* =========================
          ICON
      ========================= */}

      <div className="stat-icon">
        {icon}
      </div>


      {/* =========================
          CONTENT
      ========================= */}

      <div className="stat-content">

        <p className="stat-title">
          {title}
        </p>

        <h2 className="stat-value">
          {value}
        </h2>

        {subtitle && (
          <span className="stat-subtitle">
            {subtitle}
          </span>
        )}

      </div>

    </div>
  );
}

export default StatCard;