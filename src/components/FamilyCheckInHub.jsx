
import { useMemo, useState } from "react";
import familyData from "../data/family_checkins.json";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

function getStatusStyle(status) {
  switch (status) {
    case "Safe":
      return {
        background: "#dcfce7",
        color: "#166534",
        border: "#86efac"
      };

    case "Need Help":
      return {
        background: "#fef3c7",
        color: "#92400e",
        border: "#fcd34d"
      };

    case "Trapped":
      return {
        background: "#fee2e2",
        color: "#991b1b",
        border: "#fca5a5"
      };

    default:
      return {
        background: "#e2e8f0",
        color: "#334155",
        border: "#cbd5e1"
      };
  }
}

function formatDate(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function FamilyCheckInHub({ isOpen, onClose }) {
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [families, setFamilies] = useState(familyData);
  const [sendingId, setSendingId] = useState(null);
  const [message, setMessage] = useState("");

  const summary = useMemo(() => {
    return {
      total: families.length,
      safe: families.filter((family) => family.group_status === "Safe").length,
      help: families.filter(
        (family) => family.group_status === "Need Help"
      ).length,
      trapped: families.filter(
        (family) => family.group_status === "Trapped"
      ).length
    };
  }, [families]);

  if (!isOpen) {
    return null;
  }

  const notifyAuthority = async (family) => {
    setSendingId(family.id);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: `Family Assistance Required: ${family.family_name}`,
          message: `${family.family_name} requires assistance. Group status: ${family.group_status}. Village: ${family.village}, District: ${family.district}.`,
          type: "Family Safety",
          severity: family.group_status === "Trapped" ? "CRITICAL" : "HIGH",
          district: family.district,
          village: family.village,
          latitude: family.latitude,
          longitude: family.longitude,
          source: "Family Check-In Hub"
        })
      });

      if (!response.ok) {
        throw new Error("Notification request failed");
      }

      setFamilies((currentFamilies) =>
        currentFamilies.map((item) =>
          item.id === family.id
            ? { ...item, notified_authority: true }
            : item
        )
      );

      setSelectedFamily((current) =>
        current && current.id === family.id
          ? { ...current, notified_authority: true }
          : current
      );

      setMessage(`Authority notified for ${family.family_name}.`);
    } catch (error) {
      console.error("Family notification error:", error);
      setMessage(
        "Could not notify the authority. Please check the backend connection."
      );
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
        padding: "20px"
      }}
    >
      <div
        style={{
          width: "min(1000px, 96vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#0f172a",
          color: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #334155",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)"
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px"
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                color: "#38bdf8"
              }}
            >
              👨‍👩‍👧 Family Safety / Check-In Hub
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#94a3b8",
                fontSize: "13px"
              }}
            >
              Track family safety status and notify authorities when help is
              needed.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#334155",
              color: "#ffffff",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "18px"
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
            padding: "16px 20px"
          }}
        >
          <SummaryCard label="Total Families" value={summary.total} />
          <SummaryCard label="Safe" value={summary.safe} />
          <SummaryCard label="Need Help" value={summary.help} />
          <SummaryCard label="Trapped" value={summary.trapped} />
        </div>

        {message && (
          <div
            style={{
              margin: "0 20px 15px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "#172554",
              border: "1px solid #2563eb",
              color: "#bfdbfe",
              fontSize: "13px"
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            padding: "0 20px 20px",
            display: "grid",
            gridTemplateColumns:
              selectedFamily ? "minmax(0, 1fr) minmax(300px, 0.9fr)" : "1fr",
            gap: "15px"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            {families.map((family) => {
              const statusStyle = getStatusStyle(family.group_status);
              const isSelected = selectedFamily?.id === family.id;

              return (
                <button
                  key={family.id}
                  onClick={() => setSelectedFamily(family)}
                  style={{
                    textAlign: "left",
                    padding: "15px",
                    background: isSelected ? "#1e293b" : "#111827",
                    color: "#ffffff",
                    border: isSelected
                      ? "1px solid #38bdf8"
                      : "1px solid #334155",
                    borderRadius: "10px",
                    cursor: "pointer"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <strong style={{ fontSize: "15px" }}>
                      {family.family_name}
                    </strong>

                    <span
                      style={{
                        padding: "4px 9px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: "700",
                        background: statusStyle.background,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`
                      }}
                    >
                      {family.group_status}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: "7px",
                      color: "#94a3b8",
                      fontSize: "12px"
                    }}
                  >
                    📍 {family.village}, {family.district}
                  </div>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#64748b",
                      fontSize: "11px"
                    }}
                  >
                    {family.members.length} member
                    {family.members.length !== 1 ? "s" : ""}
                    {family.notified_authority && " • 🚨 Authority notified"}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedFamily && (
            <div
              style={{
                background: "#111827",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "16px",
                height: "fit-content"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  alignItems: "flex-start"
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px" }}>
                    {selectedFamily.family_name}
                  </h3>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#94a3b8",
                      fontSize: "12px"
                    }}
                  >
                    Head: {selectedFamily.head_name}
                  </p>
                </div>

                <span
                  style={{
                    padding: "5px 9px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: "700",
                    ...getStatusStyle(selectedFamily.group_status)
                  }}
                >
                  {selectedFamily.group_status}
                </span>
              </div>

              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  background: "#0f172a",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#cbd5e1"
                }}
              >
                <div>📍 {selectedFamily.village}</div>
                <div style={{ marginTop: "5px" }}>
                  District: {selectedFamily.district}
                </div>

                <div style={{ marginTop: "5px" }}>
                  🏠 Shelter:{" "}
                  {selectedFamily.shelter_id || "Not assigned"}
                </div>
              </div>

              <h4
                style={{
                  margin: "18px 0 10px",
                  fontSize: "14px"
                }}
              >
                Family Members
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px"
                }}
              >
                {selectedFamily.members.map((member, index) => {
                  const memberStyle = getStatusStyle(member.status);

                  return (
                    <div
                      key={`${selectedFamily.id}-${index}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px",
                        background: "#0f172a",
                        borderRadius: "7px"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "600" }}>
                          {member.name}
                        </div>

                        <div
                          style={{
                            marginTop: "3px",
                            fontSize: "10px",
                            color: "#64748b"
                          }}
                        >
                          Last check-in: {formatDate(member.last_update)}
                        </div>
                      </div>

                      <span
                        style={{
                          padding: "4px 7px",
                          borderRadius: "6px",
                          fontSize: "10px",
                          fontWeight: "700",
                          background: memberStyle.background,
                          color: memberStyle.color
                        }}
                      >
                        {member.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {selectedFamily.group_status !== "Safe" && (
                <button
                  onClick={() => notifyAuthority(selectedFamily)}
                  disabled={
                    selectedFamily.notified_authority ||
                    sendingId === selectedFamily.id
                  }
                  style={{
                    width: "100%",
                    marginTop: "16px",
                    padding: "11px",
                    border: "none",
                    borderRadius: "8px",
                    background: selectedFamily.notified_authority
                      ? "#166534"
                      : "#dc2626",
                    color: "#ffffff",
                    fontWeight: "700",
                    cursor: selectedFamily.notified_authority
                      ? "default"
                      : "pointer",
                    opacity:
                      sendingId === selectedFamily.id ? 0.7 : 1
                  }}
                >
                  {sendingId === selectedFamily.id
                    ? "Notifying..."
                    : selectedFamily.notified_authority
                    ? "✓ Authority Already Notified"
                    : "🚨 Notify Authority"}
                </button>
              )}

              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${selectedFamily.latitude},${selectedFamily.longitude}`,
                    "_blank"
                  )
                }
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "9px",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  background: "#1e293b",
                  color: "#e2e8f0",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                📍 View Family Location
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #334155",
        borderRadius: "9px",
        padding: "12px"
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: "11px"
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: "4px",
          fontSize: "21px",
          fontWeight: "700"
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default FamilyCheckInHub;