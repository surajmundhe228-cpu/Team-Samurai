import React from "react";

function RiskCard({ village }) {
  const riskLevel =
    village.risk_level?.toLowerCase() || "low";

  return (
    <div className={`risk-card risk-card-${riskLevel}`}>

      {/* Header */}
      <div className="risk-card-header">

        <div className="risk-location">
          <div className="risk-location-icon">
            📍
          </div>

          <div>
            <h3>{village.village}</h3>
            <p>{village.district}</p>
          </div>
        </div>

        <span
          className={`risk-badge ${riskLevel}`}
        >
          {village.risk_level}
        </span>

      </div>

      {/* Risk Score */}
      <div className="risk-score">

        <div className="risk-score-value">
          <strong>{village.risk_score}</strong>
          <span>/100</span>
        </div>

        <span className="risk-score-label">
          Risk Score
        </span>

      </div>

      {/* Risk Progress */}
      <div className="risk-progress">
        <div
          className={`risk-progress-bar ${riskLevel}`}
          style={{
            width: `${Math.min(
              Math.max(
                Number(village.risk_score) || 0,
                0
              ),
              100
            )}%`,
          }}
        ></div>
      </div>

      {/* Details */}
      <div className="risk-details">

        <div className="risk-detail-item">
          <span className="risk-detail-icon">
            👥
          </span>

          <div>
            <span>Population</span>
            <strong>
              {village.population}
            </strong>
          </div>
        </div>

        <div className="risk-detail-item">
          <span className="risk-detail-icon">
            🌧️
          </span>

          <div>
            <span>Rainfall</span>
            <strong>
              {village.rainfall_mm} mm
            </strong>
          </div>
        </div>

        <div className="risk-detail-item">
          <span className="risk-detail-icon">
            🌊
          </span>

          <div>
            <span>River Distance</span>
            <strong>
              {village.distance_from_river_km} km
            </strong>
          </div>
        </div>

      </div>

    </div>
  );
}

export default RiskCard;