import { useEffect, useState } from "react";
import Map from "./components/Map";
import ReportIncidentModal from "./components/ReportIncidentModal";
import FamilyCheckInHub from "./components/FamilyCheckInHub";
import i18nData from "./data/i18n_voice_support.json";

function App() {
  const [userRole, setUserRole] = useState("Authority");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFamilyHubOpen, setIsFamilyHubOpen] = useState(false);

  const [language, setLanguage] = useState(
    localStorage.getItem("reloc8_language") ||
      i18nData.default_language ||
      "hi"
  );

  const [voices, setVoices] = useState([]);

  // Load browser speech voices
  useEffect(() => {
    if (!window.speechSynthesis) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices
      );
    };
  }, []);

  // Translation helper
  const t = (key, fallback = key) => {
    return i18nData.strings?.[key]?.[language] || fallback;
  };

  // Change language
  const changeLanguage = (lang) => {
    setLanguage(lang);

    localStorage.setItem("reloc8_language", lang);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Select best available voice for current language
  const getPreferredVoice = () => {
    if (!voices.length) return null;

    const languageMap = {
      en: ["en-IN", "en-US", "en-GB", "en"],
      hi: ["hi-IN", "hi"],
      mr: ["mr-IN", "mr"]
    };

    const preferredLanguages =
      languageMap[language] || languageMap.en;

    // Exact language match
    for (const lang of preferredLanguages) {
      const exactVoice = voices.find(
        (voice) =>
          voice.lang.toLowerCase() === lang.toLowerCase()
      );

      if (exactVoice) {
        return exactVoice;
      }
    }

    // Prefix match
    const languageCode = preferredLanguages[0].split("-")[0];

    const matchingVoice = voices.find((voice) =>
      voice.lang
        .toLowerCase()
        .startsWith(languageCode.toLowerCase())
    );

    if (matchingVoice) {
      return matchingVoice;
    }

    return null;
  };

  // Voice alert
  const speakAlert = () => {
    if (!window.speechSynthesis) {
      alert("Voice support is not available in this browser.");
      return;
    }

    const alertData = i18nData.voice_alerts?.[0];

    if (!alertData) {
      alert("No voice alert data available.");
      return;
    }

    const text = alertData[language] || alertData.en;

    window.speechSynthesis.cancel();

    const selectedVoice = getPreferredVoice();

    if (!selectedVoice) {
      const languageName =
        language === "hi"
          ? "Hindi"
          : language === "mr"
          ? "Marathi"
          : "English";

      alert(
        `${languageName} voice is not installed or available in this browser.`
      );

      return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.voice = selectedVoice;
    speech.lang = selectedVoice.lang;
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#0f172a",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      {/* =========================
          TOP HEADER
      ========================== */}
      <header
        style={{
          minHeight: "70px",
          backgroundColor: "#1e293b",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
          zIndex: 1001,
          gap: "15px"
        }}
      >
        {/* Logo / Title */}
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.4rem",
              fontWeight: "700",
              letterSpacing: "1px",
              color: "#38bdf8"
            }}
          >
            RELOC8
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              color: "#94a3b8"
            }}
          >
            {t(
              "app_subtitle",
              "Disaster Decision-Support Platform"
            )}
          </p>
        </div>

        {/* =========================
            CONTROLS
        ========================== */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
            flexWrap: "wrap"
          }}
        >
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) =>
              changeLanguage(e.target.value)
            }
            style={{
              padding: "7px 10px",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              border: "1px solid #475569",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              outline: "none"
            }}
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>

          {/* Voice Button */}
          <button
            onClick={speakAlert}
            style={{
              padding: "7px 12px",
              backgroundColor: "#334155",
              color: "#ffffff",
              border: "1px solid #475569",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            🔊 Voice
          </button>

          {/* Role Switcher */}
          <div
            style={{
              display: "flex",
              background: "#0f172a",
              padding: "3px",
              borderRadius: "8px",
              border: "1px solid #334155"
            }}
          >
            <button
              onClick={() => setUserRole("Citizen")}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                background:
                  userRole === "Citizen"
                    ? "#0284c7"
                    : "transparent",
                color:
                  userRole === "Citizen"
                    ? "#fff"
                    : "#94a3b8"
              }}
            >
              {t("citizen_view", "Citizen View")}
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
                background:
                  userRole === "Authority"
                    ? "#16a34a"
                    : "transparent",
                color:
                  userRole === "Authority"
                    ? "#fff"
                    : "#94a3b8"
              }}
            >
              {t("authority_view", "Authority View")}
            </button>
          </div>

          {/* Family Safety */}
          <button
            onClick={() => setIsFamilyHubOpen(true)}
            style={{
              padding: "7px 14px",
              backgroundColor: "#7c3aed",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            👨‍👩‍👧 Family Safety
          </button>

          {/* Report Incident */}
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
            + {t(
              "report_incident",
              "Report Incident"
            )}
          </button>
        </div>
      </header>

      {/* =========================
          MAIN MAP
      ========================== */}
      <main
        style={{
          flex: 1,
          position: "relative"
        }}
      >
        <Map userRole={userRole} />
      </main>

      {/* =========================
          REPORT INCIDENT MODAL
      ========================== */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() =>
          setIsReportModalOpen(false)
        }
      />

      {/* =========================
          FAMILY SAFETY HUB
      ========================== */}
      <FamilyCheckInHub
        isOpen={isFamilyHubOpen}
        onClose={() =>
          setIsFamilyHubOpen(false)
        }
      />
    </div>
  );
}

export default App;