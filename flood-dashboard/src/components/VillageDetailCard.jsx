import React from "react";

function VillageDetailCard({
  village,
  onClose,
  onRouteClick,
}) {
  if (!village) {
    return null;
  }

  const riskLevel =
    village.risk_level || "UNKNOWN";

  const riskClass =
    riskLevel.toLowerCase();

  return (
    <div
      className={`village-detail-card ${riskClass}`}
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        width: "320px",
        maxWidth: "calc(100% - 40px)",
        background: "#ffffff",
        borderRadius: "14px",
        padding: "20px",
        zIndex: 1100,
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.2)",
        fontFamily:
          "system-ui, sans-serif",
      }}
    >

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          marginBottom: "16px",
        }}
      >

        <div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#64748b",
              textTransform: "uppercase",
            }}
          >
            Village Details
          </span>

          <h2
            style={{
              margin:
                "4px 0 2px",
              fontSize: "21px",
              color: "#0f172a",
            }}
          >
            📍 {village.village}
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            {village.district ||
              "District unavailable"}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "#f1f5f9",
            color: "#475569",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "18px",
          }}
          aria-label="Close village details"
        >
          ×
        </button>

      </div>

      {/* Risk */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          background: "#f8fafc",
          borderRadius: "10px",
          padding: "12px",
          marginBottom: "12px",
        }}
      >

        <div>
          <span
            style={{
              display: "block",
              fontSize: "11px",
              color: "#64748b",
              textTransform:
                "uppercase",
            }}
          >
            Risk Score
          </span>

          <strong
            style={{
              fontSize: "24px",
              color: "#0f172a",
            }}
          >
            {village.risk_score ??
              "--"}
            <small
              style={{
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              /100
            </small>
          </strong>
        </div>

        <span
          style={{
            padding:
              "6px 10px",
            borderRadius: "999px",
            background:
              riskLevel ===
              "CRITICAL"
                ? "#fee2e2"
                : riskLevel ===
                  "HIGH"
                ? "#ffedd5"
                : "#dcfce7",
            color:
              riskLevel ===
              "CRITICAL"
                ? "#b91c1c"
                : riskLevel ===
                  "HIGH"
                ? "#c2410c"
                : "#15803d",
            fontSize: "11px",
            fontWeight: "700",
          }}
        >
          {riskLevel}
        </span>

      </div>

      {/* Information */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "10px",
          marginBottom: "16px",
        }}
      >

        <div
          style={{
            background: "#f8fafc",
            padding: "10px",
            borderRadius: "9px",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            Population
          </span>

          <strong
            style={{
              fontSize: "14px",
              color: "#1e293b",
            }}
          >
            {village.population ??
              village.population_range ??
              "--"}
          </strong>
        </div>

        <div
          style={{
            background: "#f8fafc",
            padding: "10px",
            borderRadius: "9px",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            Rainfall
          </span>

          <strong
            style={{
              fontSize: "14px",
              color: "#1e293b",
            }}
          >
            {village.rainfall_mm ??
              "--"}{" "}
            mm
          </strong>
        </div>

        <div
          style={{
            background: "#f8fafc",
            padding: "10px",
            borderRadius: "9px",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            River Distance
          </span>

          <strong
            style={{
              fontSize: "14px",
              color: "#1e293b",
            }}
          >
            {village.distance_from_river_km ??
              "--"}{" "}
            km
          </strong>
        </div>

        <div
          style={{
            background: "#f8fafc",
            padding: "10px",
            borderRadius: "9px",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            Coordinates
          </span>

          <strong
            style={{
              fontSize: "12px",
              color: "#1e293b",
            }}
          >
            {village.latitude ??
              "--"}
            ,{" "}
            {village.longitude ??
              "--"}
          </strong>
        </div>

      </div>

      {/* Route Button */}
      <button
        onClick={onRouteClick}
        style={{
          width: "100%",
          border: "none",
          background: "#dc2626",
          color: "#ffffff",
          padding: "12px",
          borderRadius: "9px",
          fontWeight: "700",
          fontSize: "13px",
          cursor: "pointer",
        }}
      >
        🚨 Find Evacuation Shelter
      </button>

    </div>
  );
}

export default VillageDetailCard;