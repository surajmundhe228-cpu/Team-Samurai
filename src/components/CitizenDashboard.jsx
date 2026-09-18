import { useState, useMemo, useRef, useEffect } from "react";

import {
  Map,
  Home,
  MessageSquare,
  Download,
  User,
  Menu,
  Bell,
  ArrowRight,
  ShieldAlert,
  HeartHandshake,
  Sparkles,
  X,
  Send,
  HeartPulse,
} from "lucide-react";

import "./CitizenDashboard.css";

import MedicalSOS from "./MedicalSOS";
import FamilyCheckInHub from "./FamilyCheckInHub";

/* =========================================================
   FLOOD TELEMETRY
========================================================= */

const villagesTelemetry = [
  {
    village: "Rampur",
    district: "Supaul",
    risk_level: "CRITICAL",
    rainfall_mm: 112.0,
    river_dist: 1.2,
  },
  {
    village: "Bishanpur",
    district: "Supaul",
    risk_level: "CRITICAL",
    rainfall_mm: 108.0,
    river_dist: 2.5,
  },
  {
    village: "Jorgama",
    district: "Madhepura",
    risk_level: "CRITICAL",
    rainfall_mm: 105.5,
    river_dist: 1.8,
  },
  {
    village: "Pratapganj",
    district: "Supaul",
    risk_level: "CRITICAL",
    rainfall_mm: 110.0,
    river_dist: 2.0,
  },
  {
    village: "Udakishunganj",
    district: "Madhepura",
    risk_level: "CRITICAL",
    rainfall_mm: 107.0,
    river_dist: 1.5,
  },
];

/* =========================================================
   CITIZEN DASHBOARD
========================================================= */

export default function CitizenDashboard({
  citizenUser,
  onBack,
  onNavigate,
}) {
  const isLoggedIn = !!citizenUser;
  const displayName = citizenUser?.name || "Citizen";

  /* =======================================================
     MODAL STATES
  ======================================================= */

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // NEW: Family Safety / Check-In Hub
  const [isFamilyHubOpen, setIsFamilyHubOpen] = useState(false);

  /* =======================================================
     AI STATES
  ======================================================= */

  const [aiInput, setAiInput] = useState("");

  const [aiChat, setAiChat] = useState([
    {
      id: 1,
      sender: "ai",
      text: `Hello ${displayName}! I'm Reloc8 Assistant. Ask me anything about safe zones, water levels, emergency contacts, or flood survival.`,
    },
  ]);

  const chatEndRef = useRef(null);

  /* =======================================================
     AUTO SCROLL AI CHAT
  ======================================================= */

  useEffect(() => {
    if (isAiOpen) {
      chatEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [aiChat, isAiOpen]);

  /* =======================================================
     CRITICAL VILLAGES
  ======================================================= */

  const activeCriticalVillages = useMemo(() => {
    return villagesTelemetry.filter(
      (v) => v.risk_level === "CRITICAL"
    );
  }, []);

  /* =======================================================
     HIGHEST RAINFALL
  ======================================================= */

  const highestRainfallVillage = useMemo(() => {
    if (!activeCriticalVillages.length) {
      return {
        village: "None",
        rainfall_mm: 0,
        district: "",
      };
    }

    return activeCriticalVillages.reduce(
      (max, curr) =>
        curr.rainfall_mm > max.rainfall_mm
          ? curr
          : max,
      activeCriticalVillages[0]
    );
  }, [activeCriticalVillages]);

  /* =======================================================
     AI SEND
  ======================================================= */

  const handleSendAi = (e) => {
    e.preventDefault();

    if (!aiInput.trim()) return;

    const userQuestion = aiInput.trim();

    /* Add user message */
    setAiChat((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: userQuestion,
      },
    ]);

    setAiInput("");

    /* Generate local assistant response */
    setTimeout(() => {
      let reply =
        "Stay on high ground. Tap the Risk Map on your dashboard to view verified evacuation routes.";

      const query = userQuestion.toLowerCase();

      /* Water / Flood / Rain */
      if (
        query.includes("water") ||
        query.includes("flood") ||
        query.includes("rain")
      ) {
        reply = `Critical rainfall (${highestRainfallVillage.rainfall_mm} mm) detected in ${highestRainfallVillage.village}. Avoid low roads and prepare for relocation.`;
      }

      /* Emergency Contact */
      else if (
        query.includes("contact") ||
        query.includes("help") ||
        query.includes("helpline")
      ) {
        reply =
          "Emergency Flood Control Room: 1070 | NDRF/SDRF Helpline: 112 / 1078.";
      }

      /* Shelter */
      else if (
        query.includes("shelter") ||
        query.includes("safe")
      ) {
        reply =
          "Designated safe relocation shelters are active near the Government Higher Secondary School.";
      }

      /* Food / Donation */
      else if (
        query.includes("food") ||
        query.includes("donate")
      ) {
        reply =
          "Community relief kitchen tokens are available in the Donation card starting from ₹20.";
      }

      /* Family */
      else if (
        query.includes("family") ||
        query.includes("check in") ||
        query.includes("checkin")
      ) {
        reply =
          "Open Family Safety from Quick Access to check your family members' safety status and notify authorities if someone needs help.";
      }

      /* Add AI response */
      setAiChat((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: reply,
        },
      ]);
    }, 400);
  };

  /* =======================================================
     OPEN FAMILY SAFETY
  ======================================================= */

  const openFamilySafety = () => {
    setIsFamilyHubOpen(true);
  };

  /* =======================================================
     CLOSE FAMILY SAFETY
  ======================================================= */

  const closeFamilySafety = () => {
    setIsFamilyHubOpen(false);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="dashboard-page-wrapper">

      <div className="dashboard-mobile-frame">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="dashboard-header">

          {/* Menu / Settings */}
          <button
            className="icon-btn"
            onClick={() =>
              onNavigate &&
              onNavigate("settings")
            }
            title="Settings Menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <h2
            onClick={onBack}
            style={{ cursor: "pointer" }}
          >
            Reloc8
          </h2>

          {/* Alerts */}
          <button
            className="icon-btn"
            title="Alerts"
            onClick={() =>
              setIsAlertsOpen(
                (prev) => !prev
              )
            }
          >
            <Bell
              size={22}
              color="#dc2626"
            />
          </button>

        </div>

        {/* =================================================
            SCROLLABLE DASHBOARD CONTENT
        ================================================== */}

        <div className="dashboard-content">

          {/* =================================================
              USER GREETING
          ================================================== */}

          <div className="user-greeting">

            <h3>
              Hello, {displayName}
            </h3>

            <p>
              {isLoggedIn
                ? "Account verified • Live disaster sync active"
                : "Stay safe, stay connected."}
            </p>

          </div>

          {/* =================================================
              CRITICAL FLOOD WARNING
          ================================================== */}

          {activeCriticalVillages.length > 0 && (
            <div className="warning-banner-card">

              <div className="warning-banner-top">

                <div className="warning-banner-left">

                  <ShieldAlert
                    size={18}
                    color="#dc2626"
                  />

                  <span className="warning-banner-title">
                    CRITICAL FLOOD WARNING
                  </span>

                </div>

                <span className="warning-banner-pill">
                  {highestRainfallVillage.rainfall_mm} mm Rain
                </span>

              </div>

              <p className="warning-banner-desc">

                Severe water level surge detected in{" "}
                <strong>
                  {highestRainfallVillage.village}
                </strong>{" "}
                and surrounding habitations (
                {activeCriticalVillages
                  .map((v) => v.village)
                  .slice(0, 3)
                  .join(", ")}
                ).

                Immediate high-ground relocation advisory
                in effect.

              </p>

              <button
                className="evac-map-action-btn"
                onClick={() =>
                  onNavigate &&
                  onNavigate("map")
                }
              >

                <span>
                  Evacuation Map
                </span>

                <ArrowRight size={14} />

              </button>

            </div>
          )}

          {/* =================================================
              QUICK ACCESS
          ================================================== */}

          <div className="quick-access-section">

            <h4 className="section-title">
              Quick Access
            </h4>

            <div className="grid-menu">

              {/* =================================================
                  RISK MAP
              ================================================== */}

              <div
                className="menu-card"
                onClick={() =>
                  onNavigate &&
                  onNavigate("map")
                }
              >

                <div className="card-icon green-icon">
                  <Map size={28} />
                </div>

                <span>
                  Risk Map
                </span>

              </div>

              {/* =================================================
                  INFORMATION EXCHANGE
              ================================================== */}

              <div
                className="menu-card"
                onClick={() =>
                  onNavigate &&
                  onNavigate("infoExchange")
                }
              >

                <div className="card-icon chat-icon">
                  <MessageSquare size={28} />
                </div>

                <span>
                  Information Exchange
                </span>

              </div>

              {/* =================================================
                  OFFLINE CENTER
              ================================================== */}

              <div
                className="menu-card"
                onClick={() =>
                  onNavigate &&
                  onNavigate("offlineScreen")
                }
              >

                <div className="card-icon dark-green-icon">
                  <Download size={28} />
                </div>

                <span>
                  Offline Center
                </span>

              </div>

              {/* =================================================
                  DONATION
              ================================================== */}

              <div
                className="menu-card"
                onClick={() =>
                  onNavigate &&
                  onNavigate("donation")
                }
                style={{
                  gridColumnStart: 1,
                }}
              >

                <div className="card-icon orange-icon">
                  <HeartHandshake size={28} />
                </div>

                <span>
                  Donation
                </span>

              </div>

              {/* =================================================
                  MEDICAL SOS
              ================================================== */}

              <div
                className="menu-card medical-sos-card"
                onClick={() =>
                  setIsSOSOpen(true)
                }
              >

                <div className="card-icon medical-sos-icon">
                  <HeartPulse size={28} />
                </div>

                <span>
                  Medical SOS
                </span>

              </div>

              {/* =================================================
                  FAMILY SAFETY
              ================================================== */}

              <div
                className="menu-card family-safety-card"
                onClick={openFamilySafety}
              >

                <div className="card-icon family-safety-icon">
                  👨‍👩‍👧
                </div>

                <span>
                  Family Safety
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            ALERT POPUP
        ================================================== */}

        {isAlertsOpen && (

          <div
            className="ai-modal-overlay"
            onClick={() =>
              setIsAlertsOpen(false)
            }
          >

            <div
              className="ai-modal-card"
              style={{
                height: "42%",
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="ai-modal-header">

                <h4
                  style={{
                    margin: 0,
                  }}
                >
                  Active Emergency Alerts
                </h4>

                <button
                  onClick={() =>
                    setIsAlertsOpen(false)
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>

              </div>

              <div className="ai-modal-body">

                <div
                  style={{
                    padding: "12px",
                    background: "#fee2e2",
                    borderRadius: "8px",
                    borderLeft:
                      "4px solid #dc2626",
                  }}
                >

                  <strong
                    style={{
                      color: "#991b1b",
                      fontSize: "13px",
                    }}
                  >
                    Red Alert: Supaul & Madhepura
                  </strong>

                  <p
                    style={{
                      margin:
                        "4px 0 0 0",
                      fontSize: "12px",
                      color: "#7f1d1d",
                    }}
                  >
                    River levels in Kosi basin
                    exceeding danger thresholds.
                    Avoid low roads, maintain
                    communication devices, and
                    keep safe kits ready.
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* =================================================
            FLOATING AI BUTTON
        ================================================== */}

        <button
          className="floating-ai-btn"
          onClick={() =>
            setIsAiOpen(true)
          }
          title="Ask Reloc8 AI"
        >

          <div className="floating-ai-inner">

            <Sparkles
              size={22}
              color="#0ea5e9"
            />

          </div>

        </button>

        {/* =================================================
            AI CHAT MODAL
        ================================================== */}

        {isAiOpen && (

          <div
            className="ai-modal-overlay"
            onClick={() =>
              setIsAiOpen(false)
            }
          >

            <div
              className="ai-modal-card"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* AI Header */}

              <div className="ai-modal-header">

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >

                  <Sparkles
                    size={18}
                    color="#38bdf8"
                  />

                  <h4
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: 800,
                    }}
                  >
                    Reloc8 AI
                  </h4>

                </div>

                <button
                  onClick={() =>
                    setIsAiOpen(false)
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>

              </div>

              {/* Chat */}

              <div className="ai-modal-body">

                {aiChat.map((msg) => (

                  <div
                    key={msg.id}
                    className={`ai-bubble ${msg.sender}`}
                  >
                    {msg.text}
                  </div>

                ))}

                <div
                  ref={chatEndRef}
                />

              </div>

              {/* Input */}

              <form
                onSubmit={handleSendAi}
                className="ai-input-bar"
              >

                <input
                  type="text"
                  placeholder="Ask about water levels, shelter, helpline..."
                  value={aiInput}
                  onChange={(e) =>
                    setAiInput(e.target.value)
                  }
                  className="ai-text-input"
                />

                <button
                  type="submit"
                  className="ai-send-btn"
                  disabled={
                    !aiInput.trim()
                  }
                >
                  <Send size={15} />
                </button>

              </form>

            </div>

          </div>

        )}

        {/* =================================================
            MEDICAL SOS MODAL
        ================================================== */}

        {isSOSOpen && (

          <MedicalSOS
            citizenUser={citizenUser}
            onClose={() =>
              setIsSOSOpen(false)
            }
          />

        )}

        {/* =================================================
            FAMILY SAFETY / CHECK-IN HUB
        ================================================== */}

        {isFamilyHubOpen && (

          <FamilyCheckInHub
            isOpen={isFamilyHubOpen}
            onClose={closeFamilySafety}
          />

        )}

        {/* =================================================
            BOTTOM NAVIGATION
        ================================================== */}

        <div className="bottom-nav">

          {/* HOME */}

          <div
            className="nav-item active"
            onClick={() =>
              onNavigate &&
              onNavigate(
                "citizenDashboard"
              )
            }
          >

            <Home size={18} />

            <span>
              Home
            </span>

          </div>

          {/* MAP */}

          <div
            className="nav-item"
            onClick={() =>
              onNavigate &&
              onNavigate("map")
            }
          >

            <Map size={18} />

            <span>
              Map
            </span>

          </div>

          {/* EXCHANGE */}

          <div
            className="nav-item"
            onClick={() =>
              onNavigate &&
              onNavigate(
                "infoExchange"
              )
            }
          >

            <MessageSquare
              size={18}
            />

            <span>
              Exchange
            </span>

          </div>

          {/* PROFILE */}

          <div
            className="nav-item"
            onClick={() =>
              onNavigate &&
              onNavigate("settings")
            }
          >

            <User size={18} />

            <span>
              Profile
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}