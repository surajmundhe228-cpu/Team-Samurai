import { useEffect, useState } from "react";

import Map from "./components/Map";
import ReportIncidentModal from "./components/ReportIncidentModal";
import FamilyCheckInHub from "./components/FamilyCheckInHub";

import WelcomePage from "./components/WelcomePage";
import RoleSelection from "./components/RoleSelection";
import CitizenDashboard from "./components/CitizenDashboard";
import AuthorityDashboard from "./components/AuthorityDashboard";
import OfflineScreen from "./components/OfflineScreen";
import AuthorityLogin from "./components/AuthorityLogin";
import CitizenSettingsScreen from "./components/CitizenSettingsScreen";
import CitizenAuth from "./components/CitizenAuth";
import MapScreen from "./components/MapScreen";
import InfoExchangeScreen from "./components/InfoExchangeScreen";
import DonationScreen from "./components/DonationScreen";

import i18nData from "./data/i18n_voice_support.json";

function App() {
  /*
   * Main application navigation.
   *
   * Pages:
   * welcome
   * roleSelection
   * citizenAuth
   * citizenDashboard
   * authorityLogin
   * authorityDashboard
   * map
   * authorityMap
   * infoExchange
   * donation
   * settings
   * offlineScreen
   */
  const [currentPage, setCurrentPage] = useState("welcome");
  const [pendingDestination, setPendingDestination] = useState(null);

  // Existing RELOC8 authority session
  const [currentAuthority, setCurrentAuthority] = useState(() => {
    try {
      const saved = localStorage.getItem("reloc8_authority_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Citizen session
  const [currentCitizen, setCurrentCitizen] = useState(() => {
    try {
      const saved = sessionStorage.getItem("reloc8_citizen_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Existing RELOC8 map controls
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFamilyHubOpen, setIsFamilyHubOpen] = useState(false);

  // Existing multilingual / voice support
  const [language, setLanguage] = useState(
    localStorage.getItem("reloc8_language") ||
      i18nData.default_language ||
      "hi"
  );

  const [voices, setVoices] = useState([]);

  /*
   * Load browser speech voices.
   */
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

  /*
   * Translation helper.
   */
  const t = (key, fallback = key) => {
    return i18nData.strings?.[key]?.[language] || fallback;
  };

  /*
   * Change application language.
   */
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("reloc8_language", lang);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  /*
   * Find the best browser voice for the selected language.
   */
  const getPreferredVoice = () => {
    if (!voices.length) return null;

    const languageMap = {
      en: ["en-IN", "en-US", "en-GB", "en"],
      hi: ["hi-IN", "hi"],
      mr: ["mr-IN", "mr"],
    };

    const preferredLanguages =
      languageMap[language] || languageMap.en;

    for (const lang of preferredLanguages) {
      const exactVoice = voices.find(
        (voice) =>
          voice.lang.toLowerCase() === lang.toLowerCase()
      );

      if (exactVoice) {
        return exactVoice;
      }
    }

    const languageCode = preferredLanguages[0].split("-")[0];

    const matchingVoice = voices.find((voice) =>
      voice.lang
        .toLowerCase()
        .startsWith(languageCode.toLowerCase())
    );

    return matchingVoice || null;
  };

  /*
   * Existing voice alert functionality.
   */
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

  /*
   * Generic navigation.
   */
  const navigate = (page) => {
    setCurrentPage(page);
  };

  /*
   * Protected citizen navigation.
   *
   * Pages that don't require authentication:
   * - welcome
   * - roleSelection
   * - citizenDashboard
   * - settings
   * - offlineScreen
   *
   * Other citizen services require login.
   */
  const handleProtectedNavigate = (targetPage) => {
  const protectedCitizenPages = [
    "citizenDashboard",
    "map",
    "infoExchange",
    "donation",
    "settings",
    "offlineScreen",
  ];

  if (
    protectedCitizenPages.includes(targetPage) &&
    !currentCitizen
  ) {
    setPendingDestination(targetPage);
    setCurrentPage("citizenAuth");
    return;
  }

  setCurrentPage(targetPage);
};
  /*
   * Role selection.
   */
  const handleRoleSelect = (role) => {
    if (role === "citizen") {
  if (currentCitizen) {
    navigate("citizenDashboard");
  } else {
    navigate("citizenAuth");
  }
  return;
}

    if (role === "authority") {
      if (currentAuthority) {
        navigate("authorityDashboard");
      } else {
        navigate("authorityLogin");
      }
    }
  };

  /*
   * Authority login.
   */
  const handleAuthorityLoginSuccess = (user) => {
    setCurrentAuthority(user);
    navigate("authorityDashboard");
  };

  /*
   * Authority logout.
   */
  const handleAuthorityLogout = () => {
    localStorage.removeItem("reloc8_authority_session");
    setCurrentAuthority(null);
    alert("Authority logged out successfully.");
    navigate("roleSelection");
  };

  /*
   * Citizen login.
   */
  const handleCitizenLoginSuccess = (citizen) => {
    setCurrentCitizen(citizen);

    if (pendingDestination) {
      const target = pendingDestination;
      setPendingDestination(null);
      navigate(target);
    } else {
      navigate("citizenDashboard");
    }
  };

  /*
   * Citizen logout.
   */
  const handleCitizenLogout = () => {
    sessionStorage.removeItem("reloc8_citizen_session");
    setCurrentCitizen(null);
    alert("Citizen logged out successfully.");
    navigate("citizenDashboard");
  };

  /*
   * Render.
   */
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* =====================================================
          1. WELCOME
      ====================================================== */}
      {currentPage === "welcome" && (
        <WelcomePage
          onLogin={() => navigate("roleSelection")}
          onContinueOffline={() => navigate("offlineScreen")}
        />
      )}

      {/* =====================================================
          2. ROLE SELECTION
      ====================================================== */}
      {currentPage === "roleSelection" && (
        <RoleSelection
          onSelectRole={handleRoleSelect}
          onBack={() => navigate("welcome")}
        />
      )}

      {/* =====================================================
          3. CITIZEN AUTH
      ====================================================== */}
      {currentPage === "citizenAuth" && (
        <CitizenAuth
          onBack={() => {
            setPendingDestination(null);
            navigate("citizenDashboard");
          }}
          onLoginSuccess={handleCitizenLoginSuccess}
          onNavigate={navigate}
        />
      )}

      {/* =====================================================
          4. CITIZEN DASHBOARD
      ====================================================== */}
      {currentPage === "citizenDashboard" && (
        <CitizenDashboard
          citizenUser={currentCitizen}
          onBack={() => navigate("roleSelection")}
          onNavigate={handleProtectedNavigate}
        />
      )}

      {/* =====================================================
          5. CITIZEN RISK MAP
      ====================================================== */}
      {currentPage === "map" && (
        <MapScreen
          onBack={() => navigate("citizenDashboard")}
        />
      )}

      {/* =====================================================
          6. INFORMATION EXCHANGE
      ====================================================== */}
      {currentPage === "infoExchange" && (
        <InfoExchangeScreen
          citizenUser={currentCitizen}
          onBack={() => navigate("citizenDashboard")}
          onNavigate={handleProtectedNavigate}
        />
      )}

      {/* =====================================================
          7. DONATION
      ====================================================== */}
      {currentPage === "donation" && (
        <DonationScreen
          citizenUser={currentCitizen}
          onBack={() => navigate("citizenDashboard")}
          onNavigate={handleProtectedNavigate}
        />
      )}

      {/* =====================================================
          8. CITIZEN SETTINGS
      ====================================================== */}
      {currentPage === "settings" && (
        <CitizenSettingsScreen
          citizenUser={currentCitizen}
          onBack={() => navigate("citizenDashboard")}
          onOpenAuth={() => navigate("citizenAuth")}
          onLogout={handleCitizenLogout}
          onNavigate={handleProtectedNavigate}
        />
      )}

      {/* =====================================================
          9. OFFLINE CENTER
      ====================================================== */}
      {currentPage === "offlineScreen" && (
        <OfflineScreen
          onBack={() => navigate("citizenDashboard")}
          onNavigate={handleProtectedNavigate}
        />
      )}

      {/* =====================================================
          10. AUTHORITY LOGIN
      ====================================================== */}
      {currentPage === "authorityLogin" && (
        <AuthorityLogin
          onBack={() => navigate("roleSelection")}
          onLoginSuccess={handleAuthorityLoginSuccess}
        />
      )}

      {/* =====================================================
          11. AUTHORITY DASHBOARD
      ====================================================== */}
      {currentPage === "authorityDashboard" && (
        <AuthorityDashboard
          user={currentAuthority}
          onBack={() => navigate("roleSelection")}
          onLogout={handleAuthorityLogout}
        />
      )}

      {/* =====================================================
          12. AUTHORITY OPERATIONS MAP
          Existing RELOC8 Map.jsx is preserved.
      ====================================================== */}
      {currentPage === "authorityMap" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            backgroundColor: "#0f172a",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
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
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  color: "#38bdf8",
                }}
              >
                RELOC8
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                }}
              >
                {t(
                  "app_subtitle",
                  "Disaster Decision-Support Platform"
                )}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
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
                  outline: "none",
                }}
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>

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
                  cursor: "pointer",
                }}
              >
                🔊 Voice
              </button>

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
                  cursor: "pointer",
                }}
              >
                👨‍👩‍👧 Family Safety
              </button>

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
                  cursor: "pointer",
                }}
              >
                + {t(
                  "report_incident",
                  "Report Incident"
                )}
              </button>

              <button
                onClick={() => navigate("authorityDashboard")}
                style={{
                  padding: "7px 14px",
                  backgroundColor: "#16a34a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ← Dashboard
              </button>
            </div>
          </header>

          <main
            style={{
              flex: 1,
              position: "relative",
            }}
          >
            <Map />
          </main>

          <ReportIncidentModal
            isOpen={isReportModalOpen}
            onClose={() =>
              setIsReportModalOpen(false)
            }
          />

          <FamilyCheckInHub
            isOpen={isFamilyHubOpen}
            onClose={() =>
              setIsFamilyHubOpen(false)
            }
          />
        </div>
      )}
    </div>
  );
}

export default App;