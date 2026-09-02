import React from "react";

function StatCard({ title, value, subtitle, icon, type }) {

  return (
    <div className={`stat-card ${type || ""}`}>

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">

        <p>{title}</p>

        <h2>{value}</h2>

        {subtitle && (
          <span>{subtitle}</span>
        )}

      </div>

    </div>
  );
}

export default StatCard;