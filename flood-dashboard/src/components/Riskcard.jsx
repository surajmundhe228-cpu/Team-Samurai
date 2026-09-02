import React from "react";

function RiskCard({ village }) {

  return (
    <div className="risk-card">

      <div className="risk-card-header">

        <div>
          <h3>{village.village}</h3>
          <p>{village.district}</p>
        </div>

        <span
          className={`risk-badge ${village.risk_level.toLowerCase()}`}
        >
          {village.risk_level}
        </span>

      </div>

      <div className="risk-score">

        <strong>{village.risk_score}</strong>

        <span>/100 Risk Score</span>

      </div>

      <div className="risk-details">

        <div>
          <span>Population</span>
          <strong>{village.population}</strong>
        </div>

        <div>
          <span>Rainfall</span>
          <strong>{village.rainfall_mm} mm</strong>
        </div>

        <div>
          <span>River Distance</span>
          <strong>{village.distance_from_river_km} km</strong>
        </div>

      </div>

    </div>
  );
}

export default RiskCard;