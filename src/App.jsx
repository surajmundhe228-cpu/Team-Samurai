
import { useState } from "react";
import Map from "./components/Map";
import ReportIncidentModal from "./components/ReportIncidentModal";

function App() {
  const [userRole, setUserRole] = useState("Authority"); // "Citizen" or "Authority"
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      width: "100vw", 
      overflow: "hidden",
      backgroundColor: "#0f172a",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Top Header Banner */}
      <header style={{
        height: "70px",
        backgroundColor: "#1e293b",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        zIndex: 1001
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: "1.4rem", 
            fontWeight: "700", 
            letterSpacing: "1px", 
            color: "#38bdf8" 
          }}>
            RELOC8
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: "0.8rem", 
            color: "#94a3b8" 
          }}>
            Disaster Decision-Support Platform
          </p>
        </div>

        {/* Mode Switcher & Report Action */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Role Switcher Toggle */}
          <div style={{
            display: "flex",
            background: "#0f172a",
            padding: "3px",
            borderRadius: "8px",
            border: "1px solid #334155"
          }}>
            <button
              onClick={() => setUserRole("Citizen")}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                background: userRole === "Citizen" ? "#0284c7" : "transparent",
                color: userRole === "Citizen" ? "#fff" : "#94a3b8"
              }}
            >
              Citizen View
            </button>
            <button
              onClick={() => setUserRole("Authority")}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                background: userRole === "Authority" ? "#16a34a" : "transparent",
                color: userRole === "Authority" ? "#fff" : "#94a3b8"
              }}
            >
              Authority View
            </button>
          </div>

          {/* Quick Incident Report Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            style={{
              padding: "7px 14px",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            + Report Incident
          </button>
        </div>
      </header>

      {/* Main Map Canvas */}
      <main style={{ flex: 1, position: "relative" }}>
        <Map userRole={userRole} />
      </main>

      {/* Member 5 Incident Reporting Modal */}
      <ReportIncidentModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />
    </div>
  );
}

export default App;