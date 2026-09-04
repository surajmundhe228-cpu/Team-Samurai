export default function VillageDetailCard({ village, onClose, onRouteClick }) {
  if (!village) return null;

  return (
    <div style={{
      position: "absolute",
      top: "14px",
      right: "14px",
      zIndex: 1000,
      background: "#ffffff",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      width: "280px",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ margin: "0 0 2px 0", fontSize: "16px", color: "#0f172a" }}>{village.village}</h3>
          <span style={{ fontSize: "11px", color: "#64748b" }}>{village.district} District</span>
        </div>
        <button 
          onClick={onClose}
          style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", fontWeight: "bold" }}
        >
          &times;
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <span style={{ 
          display: "inline-block", 
          padding: "3px 8px", 
          borderRadius: "6px", 
          fontSize: "11px", 
          fontWeight: "bold", 
          color: "#fff",
          background: village.risk_level === "CRITICAL" ? "#dc2626" : village.risk_level === "HIGH" ? "#ea580c" : "#ca8a04"
        }}>
          {village.risk_level || "HIGH"} Priority
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px", background: "#f8fafc", padding: "10px", borderRadius: "8px" }}>
        <div>
          <span style={{ display: "block", fontSize: "10px", color: "#64748b" }}>Population</span>
          <strong style={{ fontSize: "14px", color: "#0f172a" }}>{village.population || "~"}</strong>
        </div>
        <div>
          <span style={{ display: "block", fontSize: "10px", color: "#64748b" }}>Rainfall</span>
          <strong style={{ fontSize: "14px", color: "#0284c7" }}>{village.rainfall_mm ? `${village.rainfall_mm} mm` : "N/A"}</strong>
        </div>
      </div>

      <div style={{ marginTop: "12px", fontSize: "12px", color: "#334155" }}>
        <ul style={{ margin: 0, paddingLeft: "16px", lineHeight: "1.5" }}>
          <li>River Dist: <strong>{village.distance_from_river_km ? `${village.distance_from_river_km} km` : "N/A"}</strong></li>
          <li>Elevation: <strong>{village.elevation_m ? `${village.elevation_m} m` : "N/A"}</strong></li>
          <li>Risk Score: <strong>{village.risk_score || "N/A"}</strong></li>
        </ul>
      </div>

      <button 
        onClick={onRouteClick}
        style={{
          width: "100%",
          marginTop: "14px",
          background: "#16a34a",
          color: "#fff",
          border: "none",
          padding: "8px",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "12px"
        }}
      >
        Match Shelter & Plan Route
      </button>
    </div>
  );
}