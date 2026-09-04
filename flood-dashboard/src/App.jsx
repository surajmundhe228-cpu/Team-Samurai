import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import RiskAssessment from "./pages/RiskAssessment";
import Shelters from "./pages/Shelters";
import EvacuationPlan from "./pages/EvacuationPlan";
import EmergencyGuide from "./pages/EmergencyGuide";

import Chatbot from "./components/Chatbot";

import { setupOfflineSync } from "./services/offline";

import OfflineBanner from "./components/OfflineBanner";


function AppContent() {

  const [darkMode, setDarkMode] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  const navigate = useNavigate();


  // =========================
  // DARK MODE
  // =========================

  useEffect(() => {

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

  }, [darkMode]);


  // =========================
  // ONLINE / OFFLINE DETECTION
  // =========================

  useEffect(() => {

    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);

      // Automatically open Emergency Guide
      navigate("/emergency");
    }

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    return () => {

      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );

    };

  }, [navigate]);


  // =========================
  // OFFLINE DATA SYNC
  // =========================

  useEffect(() => {

    const cleanup = setupOfflineSync(() => {

      console.log(
        "Internet restored. Reloading Reloc8..."
      );

      window.location.reload();

    });

    return cleanup;

  }, []);


  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-area">

        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <OfflineBanner />

        <main className="page-content">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/risk"
              element={<RiskAssessment />}
            />

            <Route
              path="/shelters"
              element={<Shelters />}
            />

            <Route
              path="/evacuation"
              element={<EvacuationPlan />}
            />

            <Route
              path="/emergency"
              element={<EmergencyGuide />}
            />

          </Routes>

        </main>

      </div>

      <Chatbot />

    </div>
  );
}


function App() {

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}


export default App;