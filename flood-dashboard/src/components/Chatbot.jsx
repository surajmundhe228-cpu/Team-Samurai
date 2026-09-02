import React, { useState } from "react";

const API = "http://127.0.0.1:8000";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm Reloc8 Assistant. Ask me about flood risk, shelters, evacuation or flood safety."
    }
  ]);

  const askBot = async (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: text
      }
    ]);

    setMessage("");

    try {
      const [dashboardResponse, shelterResponse] = await Promise.all([
        fetch(`${API}/api/dashboard`),
        fetch(`${API}/api/shelters`)
      ]);

      if (!dashboardResponse.ok) {
        throw new Error("Dashboard API error");
      }

      if (!shelterResponse.ok) {
        throw new Error("Shelter API error");
      }

      const dashboard = await dashboardResponse.json();
      const shelterData = await shelterResponse.json();

      const risks = dashboard.risk_assessment || [];
      const evacuationPlan = dashboard.evacuation_plan || [];
      const shelters = shelterData.shelters || [];

      const q = text.toLowerCase().trim();

      let reply = "";

      // ==========================================
      // HIGHEST RISK
      // ==========================================

      if (
        q.includes("highest risk") ||
        q.includes("highest") ||
        q.includes("critical village") ||
        q.includes("critical")
      ) {
        if (risks.length > 0) {
          const highestRisk = [...risks].sort(
            (a, b) =>
              Number(b.risk_score || 0) -
              Number(a.risk_score || 0)
          )[0];

          reply =
            `${highestRisk.village} has the highest flood risk. ` +
            `Risk score: ${highestRisk.risk_score}. ` +
            `Priority: ${highestRisk.priority || "Critical"}.`;
        } else {
          reply = "No risk assessment data is currently available.";
        }
      }

      // ==========================================
      // RISK SCORE
      // ==========================================

      else if (
        q.includes("risk score") ||
        q.includes("risk level") ||
        q.includes("flood risk")
      ) {
        if (risks.length > 0) {
          const riskInfo = risks
            .map(
              (v) =>
                `${v.village}: ${v.risk_score} (${v.priority || v.risk_level})`
            )
            .join(" | ");

          reply = `Current village risk levels: ${riskInfo}`;
        } else {
          reply = "Risk assessment data is not available.";
        }
      }

      // ==========================================
      // SHELTERS
      // ==========================================

      else if (
        q.includes("shelter") ||
        q.includes("relief centre") ||
        q.includes("relief center")
      ) {
        reply = `There are ${shelters.length} relief shelters available in the system.`;
      }

      // ==========================================
      // SHELTER CAPACITY
      // ==========================================

      else if (
        q.includes("capacity") ||
        q.includes("available space") ||
        q.includes("empty space")
      ) {
        const availableCapacity = shelters.reduce(
          (sum, shelter) =>
            sum + Number(shelter.available_capacity || 0),
          0
        );

        const totalCapacity = shelters.reduce(
          (sum, shelter) =>
            sum + Number(shelter.capacity || 0),
          0
        );

        reply =
          `There are ${availableCapacity.toLocaleString()} ` +
          `available spaces out of a total shelter capacity of ` +
          `${totalCapacity.toLocaleString()}.`;
      }

      // ==========================================
      // BEST / MOST AVAILABLE SHELTER
      // ==========================================

      else if (
        q.includes("best shelter") ||
        q.includes("most space") ||
        q.includes("largest shelter")
      ) {
        if (shelters.length > 0) {
          const bestShelter = [...shelters].sort(
            (a, b) =>
              Number(b.available_capacity || 0) -
              Number(a.available_capacity || 0)
          )[0];

          reply =
            `${bestShelter.shelter_name} currently has the most ` +
            `available space: ${bestShelter.available_capacity} people.`;
        } else {
          reply = "Shelter information is not available.";
        }
      }

      // ==========================================
      // EVACUATION
      // ==========================================

      else if (
        q.includes("evacuation") ||
        q.includes("evacuated") ||
        q.includes("evacuate")
      ) {
        if (evacuationPlan.length > 0) {
          const totalEvacuated = evacuationPlan.reduce(
            (sum, item) =>
              sum +
              Number(
                item.evacuated_population ??
                item.evacuated ??
                item.total_evacuated ??
                0
              ),
            0
          );

          const totalUnassigned = evacuationPlan.reduce(
            (sum, item) =>
              sum +
              Number(
                item.unassigned_population ??
                item.unassigned ??
                0
              ),
            0
          );

          reply =
            `${totalEvacuated.toLocaleString()} people are currently ` +
            `assigned/evacuated according to the evacuation plan. ` +
            `${totalUnassigned.toLocaleString()} people remain unassigned.`;
        } else {
          reply = "No evacuation plan is currently available.";
        }
      }

      // ==========================================
      // FLOOD SAFETY
      // ==========================================

      else if (
        q.includes("flood safety") ||
        q.includes("what should i do") ||
        q.includes("during flood") ||
        q.includes("flood")
      ) {
        reply =
          "During a flood, move to higher ground, follow official evacuation instructions, " +
          "avoid walking or driving through floodwater, keep emergency supplies with you, " +
          "and stay updated through official alerts.";
      }

      // ==========================================
      // HELLO
      // ==========================================

      else if (
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("hey")
      ) {
        reply =
          "Hello! I can help you with flood risks, shelters, shelter capacity, evacuation plans and flood safety.";
      }

      // ==========================================
      // HELP
      // ==========================================

      else if (
        q.includes("help") ||
        q.includes("what can you do")
      ) {
        reply =
          "I can provide information about the highest-risk village, flood risk levels, relief shelters, available shelter capacity, evacuation status and flood safety.";
      }

      // ==========================================
      // UNKNOWN QUESTION
      // ==========================================

      else {
        reply =
          "I can help with flood risk, shelters, shelter capacity, evacuation and flood safety. Try asking: 'Which village has the highest risk?'";
      }

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply
        }
      ]);
    } catch (error) {
      console.error("Chatbot API error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm unable to retrieve the latest flood information right now. Please make sure the FastAPI backend is running."
        }
      ]);
    }
  };

  return (
    <>
      {/* CHAT BUTTON */}

      {!open && (
        <button
          className="chatbot-button"
          onClick={() => setOpen(true)}
          aria-label="Open chatbot"
        >
          💬
        </button>
      )}

      {/* CHAT WINDOW */}

      {open && (
        <div className="chatbot">

          {/* HEADER */}

          <div className="chatbot-header">
            <div>
              <strong>Reloc8 Assistant</strong>
              <small>AI Emergency Assistant</small>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              ✕
            </button>
          </div>

          {/* MESSAGES */}

          <div className="chatbot-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender}`}
              >
                {msg.text}
              </div>
            ))}

            {/* QUICK QUESTIONS */}

            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                marginTop: "10px"
              }}
            >
              <button
                className="quick-btn"
                onClick={() => askBot("Which village has the highest risk?")}
              >
                🚨 Highest Risk
              </button>

              <button
                className="quick-btn"
                onClick={() => askBot("How many shelters are available?")}
              >
                🏠 Shelters
              </button>

              <button
                className="quick-btn"
                onClick={() => askBot("How much shelter capacity is available?")}
              >
                👥 Capacity
              </button>

              <button
                className="quick-btn"
                onClick={() => askBot("What should I do during a flood?")}
              >
                🌧️ Flood Safety
              </button>

              <button
                className="quick-btn"
                onClick={() => askBot("What is the evacuation status?")}
              >
                🚨 Evacuation
              </button>
            </div>

          </div>

          {/* INPUT */}

          <div className="chatbot-input">

            <input
              type="text"
              placeholder="Ask something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askBot(message);
                }
              }}
            />

            <button
              onClick={() => askBot(message)}
              aria-label="Send message"
            >
              ➤
            </button>

          </div>

        </div>
      )}
    </>
  );
};

export default Chatbot;