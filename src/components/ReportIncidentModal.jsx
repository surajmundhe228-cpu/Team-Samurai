import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export default function ReportIncidentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    type: "Disaster Alert",
    village: "",
    affectedCount: "",
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Field Report Payload:", formData);

    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Backend Response Success:", result);

      alert("Incident successfully reported to command center!");
      onClose();
    } catch (err) {
      console.error("Failed to push report to backend:", err);
      alert("Submission failed. Ensure FastAPI server is running on port 8000.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 2000
    }}>
      <div style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "12px",
        width: "360px",
        fontFamily: "system-ui, sans-serif"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, color: "#0f172a" }}>Report Field Incident</h3>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Incident Category</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px" }}
            >
              <option value="Disaster Alert">Flood / Water Rise</option>
              <option value="Road Blocked">Corridor / Road Blockage</option>
              <option value="Animal Distress">Livestock Distress (Pashu Rescue)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Village / Location</label>
            <input
              type="text"
              required
              placeholder="e.g., Bishanpur"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Approx Affected Count</label>
            <input
              type="text"
              placeholder="e.g., ~20-25"
              value={formData.affectedCount}
              onChange={(e) => setFormData({ ...formData, affectedCount: e.target.value })}
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Landmark Details</label>
            <textarea
              rows={3}
              placeholder="Near bridge / school embankment..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "10px",
              background: submitting ? "#94a3b8" : "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: submitting ? "not-allowed" : "pointer",
              marginTop: "8px"
            }}
          >
            {submitting ? "Sending to Center..." : "Submit Urgent Report"}
          </button>
        </form>
      </div>
    </div>
  );
}