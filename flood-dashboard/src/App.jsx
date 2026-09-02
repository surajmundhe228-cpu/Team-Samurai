import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import RiskAssessment from "./pages/RiskAssessment";
import Shelters from "./pages/Shelters";
import EvacuationPlan from "./pages/EvacuationPlan";

import Chatbot from "./components/Chatbot";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="app-layout">

        <Sidebar />

        <div className="main-area">

          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

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

            </Routes>
          </main>

        </div>

      </div>

      <Chatbot />

    </BrowserRouter>
  );
}

export default App;