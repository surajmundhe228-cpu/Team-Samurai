import React from "react";

function VillageDetailCard({ village, onClose, onRouteClick }) {
  if (!village) return null;

  return (
    <div style={{
      position: "absolute",
      top: "70px",
      right: "24px",
      zIndex: 1000,
      background: "#ffffff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      width: "320px",
      maxWidth: "calc(100vw - 48px)",
      maxHeight: "calc(100vh - 100px)",
      overflowY: "auto",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", color: "#0f172a" }}>{village.village}</h2>
          <span style={{ fontSize: "12px", color: "#64748b" }}>{village.district} District</span>
        </div>
        <button 
          onClick={onClose}
          style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontWeight: "bold" }}
        >
          &times;
        </button>
      </div>

      <div style={{ marginTop: "12px" }}>
        <span style={{ 
          display: "inline-block", 
          padding: "4px 10px", 
          borderRadius: "6px", 
          fontSize: "11px", 
          fontWeight: "bold", 
          color: "#fff",
          background: village.risk_level === "CRITICAL" ? "#dc2626" : village.risk_level === "HIGH" ? "#ea580c" : "#ca8a04"
        }}>
          {village.risk_level || "HIGH"} Relocation Priority
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "16px", background: "#f8fafc", padding: "12px", borderRadius: "8px" }}>
        <div>
          <span style={{ display: "block", fontSize: "11px", color: "#64748b" }}>Estimated Pop.</span>
          <strong style={{ fontSize: "16px", color: "#0f172a" }}>{village.population || "~"}</strong>
        </div>
        <div>
          <span style={{ display: "block", fontSize: "11px", color: "#64748b" }}>Recent Rainfall</span>
          <strong style={{ fontSize: "16px", color: "#0284c7" }}>{village.rainfall_mm ? `${village.rainfall_mm} mm` : "N/A"}</strong>
        </div>
      </div>

      <div style={{ marginTop: "16px", fontSize: "13px", color: "#334155" }}>
        <strong style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>Decision Criteria</strong>
        <ul style={{ margin: 0, paddingLeft: "16px", lineHeight: "1.6" }}>
          <li>River Distance: <strong>{village.distance_from_river_km != null ? `${village.distance_from_river_km} km` : "N/A"}</strong></li>
          <li>Elevation: <strong>{village.elevation_m != null ? `${village.elevation_m} m` : "N/A"}</strong></li>
          <li>Flood History: <strong>{village.flood_history || "Standard"}</strong></li>
          <li>Risk Score: <strong>{village.risk_score || "N/A"}</strong></li>
        </ul>
      </div>

      <button 
        onClick={onRouteClick}
        style={{
          width: "100%",
          marginTop: "20px",
          background: "#16a34a",
          color: "#fff",
          border: "none",
          padding: "10px",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "13px"
        }}
      >
        Match Safe Shelter & Plan Route
      </button>
    </div>
  );
}

export default VillageDetailCard;