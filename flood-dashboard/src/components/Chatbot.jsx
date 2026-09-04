import React, { useState, useRef, useEffect } from "react";

const API = "http://127.0.0.1:8000";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm Reloc8 Assistant. Ask me about flood risk, shelters, evacuation or flood safety."
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, isTyping]);


  // ==========================================
  // AUTO FOCUS
  // ==========================================

  useEffect(() => {

    if (open) {
      inputRef.current?.focus();
    }

  }, [open]);


  // ==========================================
  // ESCAPE KEY
  // ==========================================

  useEffect(() => {

    if (!open) return;

    const handleKeyDown = (e) => {

      if (e.key === "Escape") {
        setOpen(false);
      }

    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [open]);


  // ==========================================
  // OPEN CHAT
  // ==========================================

  const openChat = () => {

    setOpen(true);
    setHasNotification(false);

  };


  // ==========================================
  // OFFLINE EMERGENCY ANSWERS
  // ==========================================

  const getOfflineReply = (text) => {

    const q = text.toLowerCase().trim();


    // ==========================================
    // HELLO
    // ==========================================

    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey")
    ) {

      return (
        "Hello! I'm Reloc8 Offline Emergency Assistant. " +
        "I can provide basic flood safety, evacuation, " +
        "emergency contact and preparedness information " +
        "without an internet connection."
      );

    }


    // ==========================================
    // EMERGENCY NUMBER
    // ==========================================

    if (
      q.includes("emergency number") ||
      q.includes("emergency contact") ||
      q.includes("call emergency") ||
      q.includes("112") ||
      q.includes("police") ||
      q.includes("ambulance")
    ) {

      return (
        "For an immediate emergency in India, call 112. " +
        "It is the unified emergency number for police, " +
        "fire, medical and other emergency assistance. " +
        "NDMA Control Room: 011-26701728."
      );

    }


    // ==========================================
    // WHAT TO DO DURING FLOOD
    // ==========================================

    if (
      q.includes("what should i do") ||
      q.includes("during flood") ||
      q.includes("flood safety") ||
      q.includes("flood emergency") ||
      q === "flood"
    ) {

      return (
        "During a flood, move to higher ground immediately. " +
        "Follow official evacuation instructions, avoid " +
        "walking or driving through floodwater, stay away " +
        "from electrical wires, keep your emergency kit " +
        "with you and stay with your family or group."
      );

    }


    // ==========================================
    // FLOOD WATER
    // ==========================================

    if (
      q.includes("walk through water") ||
      q.includes("walk through flood") ||
      q.includes("cross flood water") ||
      q.includes("cross water") ||
      q.includes("drive through flood") ||
      q.includes("drive through water")
    ) {

      return (
        "No. Do not walk or drive through moving floodwater. " +
        "Floodwater can hide deep areas, damaged roads, " +
        "debris, sewage, electrical hazards and strong currents. " +
        "Use a safe evacuation route instead."
      );

    }


    // ==========================================
    // HIGHER GROUND
    // ==========================================

    if (
      q.includes("higher ground") ||
      q.includes("where should i go") ||
      q.includes("where should we go") ||
      q.includes("safe place") ||
      q.includes("safe location")
    ) {

      return (
        "Move to higher ground or a designated safe shelter. " +
        "Stay away from rivers, streams, drainage channels, " +
        "low-lying areas and rapidly rising water. Follow " +
        "the designated evacuation route whenever possible."
      );

    }


    // ==========================================
    // EVACUATION
    // ==========================================

    if (
      q.includes("evacuation") ||
      q.includes("evacuate") ||
      q.includes("evacuating") ||
      q.includes("evacuated")
    ) {

      return (
        "If evacuation is ordered, leave as early as possible. " +
        "Take your emergency kit, essential medicines and " +
        "important documents. Keep family members together " +
        "and follow the designated evacuation route to a " +
        "safe shelter or elevated location."
      );

    }


    // ==========================================
    // EMERGENCY KIT
    // ==========================================

    if (
      q.includes("emergency kit") ||
      q.includes("what should i carry") ||
      q.includes("what should i take") ||
      q.includes("supplies") ||
      q.includes("emergency supplies")
    ) {

      return (
        "An emergency kit should include drinking water, " +
        "ready-to-eat food, flashlight, batteries or power bank, " +
        "charged phone, first-aid supplies, essential medicines, " +
        "identification documents, emergency cash, extra clothes " +
        "and hygiene supplies."
      );

    }


    // ==========================================
    // CHILDREN / ELDERLY / VULNERABLE PEOPLE
    // ==========================================

    if (
      q.includes("children") ||
      q.includes("elderly") ||
      q.includes("old people") ||
      q.includes("pregnant") ||
      q.includes("vulnerable")
    ) {

      return (
        "Prioritize children, elderly people, pregnant people " +
        "and anyone requiring additional assistance. Keep them " +
        "with the group and help them reach a safe elevated " +
        "location or designated shelter."
      );

    }


    // ==========================================
    // ELECTRICAL SAFETY
    // ==========================================

    if (
      q.includes("electricity") ||
      q.includes("electrical") ||
      q.includes("power line") ||
      q.includes("electric wire") ||
      q.includes("fallen wire")
    ) {

      return (
        "Treat floodwater as electrically dangerous. Do not " +
        "touch electrical equipment while standing in water. " +
        "Stay away from fallen power lines and damaged electrical " +
        "systems. Do not attempt electrical repairs yourself."
      );

    }


    // ==========================================
    // DRINKING WATER
    // ==========================================

    if (
      q.includes("drink flood water") ||
      q.includes("drinking water") ||
      q.includes("water safe") ||
      q.includes("contaminated water") ||
      q.includes("water after flood")
    ) {

      return (
        "Do not drink untreated floodwater. Floodwater may contain " +
        "sewage, chemicals and other contaminants. Use drinking " +
        "water from an approved safe source and follow official " +
        "water-safety instructions."
      );

    }


    // ==========================================
    // MEDICAL EMERGENCY
    // ==========================================

    if (
      q.includes("injury") ||
      q.includes("injured") ||
      q.includes("medical") ||
      q.includes("bleeding") ||
      q.includes("hurt")
    ) {

      return (
        "For a serious medical emergency, call 112. Keep the " +
        "injured person safe and avoid unnecessary movement if " +
        "a serious injury is suspected. For severe bleeding, " +
        "apply firm pressure with clean cloth or first-aid " +
        "material while seeking professional medical help."
      );

    }


    // ==========================================
    // PHONE / BATTERY
    // ==========================================

    if (
      q.includes("phone battery") ||
      q.includes("save battery") ||
      q.includes("mobile battery") ||
      q.includes("phone")
    ) {

      return (
        "Keep your phone charged and save battery for emergency " +
        "communication. Reduce unnecessary screen usage and keep " +
        "your phone available for important calls and alerts."
      );

    }


    // ==========================================
    // FAMILY SAFETY
    // ==========================================

    if (
      q.includes("family") ||
      q.includes("meeting point") ||
      q.includes("family safety")
    ) {

      return (
        "Keep your family together whenever possible. Choose a " +
        "safe meeting point outside the flood-prone area, keep " +
        "important emergency contacts available and assign " +
        "responsibilities for children, elderly people and others " +
        "who need additional assistance."
      );

    }


    // ==========================================
    // SHELTER SAFETY
    // ==========================================

    if (
      q.includes("shelter safety") ||
      q.includes("at shelter") ||
      q.includes("relief shelter")
    ) {

      return (
        "At a relief shelter, register with shelter authorities " +
        "when required, use drinking water from approved sources, " +
        "maintain hygiene, keep your family together and follow " +
        "instructions from shelter officials and emergency responders."
      );

    }


    // ==========================================
    // AFTER FLOOD
    // ==========================================

    if (
      q.includes("after flood") ||
      q.includes("flood is over") ||
      q.includes("return home") ||
      q.includes("return after flood")
    ) {

      return (
        "Do not return to a flooded or damaged area until authorities " +
        "confirm that it is safe. Stay away from damaged buildings, " +
        "fallen electrical wires and contaminated water. Follow " +
        "official instructions about drinking water and cleanup."
      );

    }


    // ==========================================
    // DO NOT
    // ==========================================

    if (
      q.includes("what not to do") ||
      q.includes("do not") ||
      q.includes("don't")
    ) {

      return (
        "Do not walk or drive through moving floodwater. Do not touch " +
        "electrical equipment while standing in water. Do not approach " +
        "fallen power lines. Do not drink untreated floodwater. Do not " +
        "ignore evacuation orders or return to affected areas without " +
        "official clearance."
      );

    }


    // ==========================================
    // HELP
    // ==========================================

    if (
      q.includes("help") ||
      q.includes("what can you do")
    ) {

      return (
        "I'm currently working in Offline Emergency Mode. " +
        "I can answer questions about flood safety, evacuation, " +
        "emergency contacts, emergency kits, floodwater, electrical " +
        "safety, medical emergencies, family safety and shelters."
      );

    }


    // ==========================================
    // DEFAULT OFFLINE RESPONSE
    // ==========================================

    return (
      "I'm currently offline, so I cannot retrieve the latest " +
      "village risk, shelter or evacuation data. However, I can " +
      "still provide basic emergency guidance. Try asking about " +
      "flood safety, evacuation, emergency numbers, shelters, " +
      "floodwater, electrical safety or emergency kits."
    );

  };


  // ==========================================
  // ASK BOT
  // ==========================================

  const askBot = async (text) => {

    if (!text.trim() || isTyping) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: text
      }
    ]);

    setMessage("");
    setIsTyping(true);


    try {

      // ==========================================
      // TRY ONLINE BACKEND
      // ==========================================

      const [dashboardResponse, shelterResponse] =
        await Promise.all([
          fetch(`${API}/api/dashboard`),
          fetch(`${API}/api/shelters`)
        ]);


      if (!dashboardResponse.ok) {
        throw new Error(
          "Dashboard API error"
        );
      }


      if (!shelterResponse.ok) {
        throw new Error(
          "Shelter API error"
        );
      }


      const dashboard =
        await dashboardResponse.json();

      const shelterData =
        await shelterResponse.json();


      const risks =
        dashboard.risk_assessment || [];

      const evacuationPlan =
        dashboard.evacuation_plan || [];

      const shelters =
        shelterData.shelters || [];


      const q =
        text.toLowerCase().trim();


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

          const highestRisk =
            [...risks].sort(
              (a, b) =>
                Number(b.risk_score || 0) -
                Number(a.risk_score || 0)
            )[0];


          reply =
            `${highestRisk.village} has the highest flood risk. ` +
            `Risk score: ${highestRisk.risk_score}. ` +
            `Priority: ${highestRisk.priority || "Critical"}.`;

        } else {

          reply =
            "No risk assessment data is currently available.";

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

          const riskInfo =
            risks
              .map(
                (v) =>
                  `${v.village}: ${v.risk_score} (${v.priority || v.risk_level})`
              )
              .join(" | ");


          reply =
            `Current village risk levels: ${riskInfo}`;

        } else {

          reply =
            "Risk assessment data is not available.";

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

        reply =
          `There are ${shelters.length} relief shelters available in the system.`;

      }


      // ==========================================
      // SHELTER CAPACITY
      // ==========================================

      else if (
        q.includes("capacity") ||
        q.includes("available space") ||
        q.includes("empty space")
      ) {

        const availableCapacity =
          shelters.reduce(
            (sum, shelter) =>
              sum +
              Number(
                shelter.available_capacity || 0
              ),
            0
          );


        const totalCapacity =
          shelters.reduce(
            (sum, shelter) =>
              sum +
              Number(
                shelter.capacity || 0
              ),
            0
          );


        reply =
          `There are ${availableCapacity.toLocaleString()} ` +
          `available spaces out of a total shelter capacity of ` +
          `${totalCapacity.toLocaleString()}.`;

      }


      // ==========================================
      // BEST SHELTER
      // ==========================================

      else if (
        q.includes("best shelter") ||
        q.includes("most space") ||
        q.includes("largest shelter")
      ) {

        if (shelters.length > 0) {

          const bestShelter =
            [...shelters].sort(
              (a, b) =>
                Number(
                  b.available_capacity || 0
                ) -
                Number(
                  a.available_capacity || 0
                )
            )[0];


          reply =
            `${bestShelter.shelter_name} currently has the most ` +
            `available space: ${bestShelter.available_capacity} people.`;

        } else {

          reply =
            "Shelter information is not available.";

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

          const totalEvacuated =
            evacuationPlan.reduce(
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


          const totalUnassigned =
            evacuationPlan.reduce(
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

          reply =
            "No evacuation plan is currently available.";

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


      // ==========================================
      // ADD ONLINE BOT RESPONSE
      // ==========================================

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply
        }
      ]);

    } catch (error) {

      // ==========================================
      // OFFLINE FALLBACK
      // ==========================================

      console.warn(
        "Backend unavailable. Switching to offline chatbot."
      );

      const offlineReply =
        getOfflineReply(text);


      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: offlineReply
        }
      ]);

    } finally {

      setIsTyping(false);

    }

  };


  return (
    <>

      {/* =========================
          CHAT BUTTON
      ========================= */}

      {!open && (

        <button
          className="chatbot-button"
          onClick={openChat}
          aria-label="Open chatbot"
        >

          🤖

          {hasNotification && (
            <span
              className="chatbot-notification-dot"
              aria-hidden="true"
            />
          )}

        </button>

      )}


      {/* =========================
          CHAT WINDOW
      ========================= */}

      {open && (

        <div className="chatbot">


          {/* =========================
              HEADER
          ========================= */}

          <div className="chatbot-header">

            <div>

              <strong>
                Reloc8 Assistant
              </strong>

              <small>
                AI Emergency Assistant
              </small>

            </div>


            <button
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              ✕
            </button>

          </div>


          {/* =========================
              MESSAGES
          ========================= */}

          <div className="chatbot-messages">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`chat-message ${msg.sender}`}
              >
                {msg.text}
              </div>

            ))}


            {/* TYPING INDICATOR */}

            {isTyping && (

              <div
                className="chat-message bot typing-indicator"
                aria-live="polite"
              >

                <span></span>
                <span></span>
                <span></span>

              </div>

            )}


            <div ref={messagesEndRef} />


            {/* =========================
                QUICK QUESTIONS
            ========================= */}

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
                disabled={isTyping}
                onClick={() =>
                  askBot(
                    "Which village has the highest risk?"
                  )
                }
              >
                🚨 Highest Risk
              </button>


              <button
                className="quick-btn"
                disabled={isTyping}
                onClick={() =>
                  askBot(
                    "How many shelters are available?"
                  )
                }
              >
                🏠 Shelters
              </button>


              <button
                className="quick-btn"
                disabled={isTyping}
                onClick={() =>
                  askBot(
                    "How much shelter capacity is available?"
                  )
                }
              >
                👥 Capacity
              </button>


              <button
                className="quick-btn"
                disabled={isTyping}
                onClick={() =>
                  askBot(
                    "What should I do during a flood?"
                  )
                }
              >
                🌧️ Flood Safety
              </button>


              <button
                className="quick-btn"
                disabled={isTyping}
                onClick={() =>
                  askBot(
                    "What is the evacuation status?"
                  )
                }
              >
                🚨 Evacuation
              </button>

            </div>

          </div>


          {/* =========================
              INPUT
          ========================= */}

          <div className="chatbot-input">

            <input
              ref={inputRef}
              type="text"
              placeholder="Ask something..."
              value={message}
              disabled={isTyping}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  askBot(message);
                }

              }}
            />


            <button
              onClick={() => askBot(message)}
              disabled={
                isTyping ||
                !message.trim()
              }
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
