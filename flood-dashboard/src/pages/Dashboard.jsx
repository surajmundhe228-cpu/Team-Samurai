import React, { useEffect, useState } from "react";

import shelters from "../data/shelter";

import StatCard from "../components/StatCard";
import RiskCard from "../components/RiskCard";
import MapView from "../components/MapView";
import WeatherCard from "../components/WeatherCard";

import { getDashboardData } from "../services/api";


function Dashboard() {

  // Backend dashboard data
  const [dashboardData, setDashboardData] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state
  const [error, setError] = useState("");


  // ============================================================
  // GET DATA FROM FASTAPI
  // ============================================================

  useEffect(() => {

    async function loadDashboard() {

      try {

        const data = await getDashboardData();

        console.log("Dashboard data from backend:", data);

        setDashboardData(data);

      } catch (err) {

        console.error("Dashboard API error:", err);

        setError(err.message);

      } finally {

        setLoading(false);

      }
    }

    loadDashboard();

  }, []);


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="dashboard">

        <div className="page-heading">
          <h1>Reloc8 Dashboard</h1>

          <p>
            Loading flood risk and evacuation data...
          </p>
        </div>

      </div>
    );
  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="dashboard">

        <div className="page-heading">
          <h1>Reloc8 Dashboard</h1>

          <p>
            Unable to connect to the backend.
          </p>

          <p style={{ color: "red" }}>
            {error}
          </p>

        </div>

      </div>
    );
  }


  // ============================================================
  // BACKEND VILLAGE DATA
  // ============================================================

  const villages = dashboardData?.risk_assessment || [];


  // ============================================================
  // NORMALIZE BACKEND DATA
  // ============================================================
  //
  // Your JSON uses:
  // priority: "Critical"
  // priority: "High"
  // priority: "Low"
  //
  // Your existing React components use:
  // risk_level: "CRITICAL"
  //
  // So we convert it here.
  // ============================================================

  const normalizedVillages = villages.map((village) => ({
    ...village,

    risk_level:
      village.priority?.toUpperCase() ||
      village.risk_level?.toUpperCase() ||
      "LOW",
  }));


  // ============================================================
  // COUNT CRITICAL VILLAGES
  // ============================================================

  const critical = normalizedVillages.filter(
    (v) => v.risk_level === "CRITICAL"
  ).length;


  // ============================================================
  // COUNT HIGH-RISK VILLAGES
  // ============================================================

  const high = normalizedVillages.filter(
    (v) => v.risk_level === "HIGH"
  ).length;


  // ============================================================
  // TOTAL POPULATION
  // ============================================================

  const totalPopulation = normalizedVillages.reduce(
    (sum, v) => sum + Number(v.population || 0),
    0
  );


  // ============================================================
  // SHELTER DATA
  // ============================================================
  //
  // Temporary:
  // shelter.js is still being used because the current
  // evacuation_plan.json does not contain complete shelter data.
  // ============================================================

  const totalCapacity = shelters.reduce(
    (sum, s) => sum + Number(s.capacity || 0),
    0
  );


  const occupied = shelters.reduce(
    (sum, s) => sum + Number(s.current_occupancy || 0),
    0
  );


  const available = shelters.reduce(
    (sum, s) => sum + Number(s.available_capacity || 0),
    0
  );


  // ============================================================
  // CRITICAL VILLAGES
  // ============================================================

  const criticalVillages = normalizedVillages.filter(
    (village) => village.risk_level === "CRITICAL"
  );


  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div className="dashboard">

      {/* Page Heading */}

      <div className="page-heading">

        <h1>Reloc8 Dashboard</h1>

        <p>
          Real-time flood risk and evacuation monitoring
        </p>

      </div>


      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div className="stats-grid">

        <StatCard
          title="Total Villages"
          value={normalizedVillages.length}
          subtitle="Monitored locations"
          icon="🏘️"
        />


        <StatCard
          title="Critical Risk"
          value={critical}
          subtitle="Immediate attention"
          icon="🚨"
          type="critical"
        />


        <StatCard
          title="High Risk"
          value={high}
          subtitle="Require monitoring"
          icon="⚠️"
          type="warning"
        />


        <StatCard
          title="Population"
          value={totalPopulation.toLocaleString()}
          subtitle="People in monitored areas"
          icon="👥"
        />


        <StatCard
          title="Shelters"
          value={dashboardData?.total_shelters ?? shelters.length}
          subtitle={`${available} spaces available`}
          icon="🏠"
          type="green"
        />


        <StatCard
          title="Occupied"
          value={occupied.toLocaleString()}
          subtitle={`of ${totalCapacity.toLocaleString()} capacity`}
          icon="🛏️"
        />

      </div>


      {/* ======================================================
          WEATHER
      ====================================================== */}

      <div className="weather-section">

        <WeatherCard />

      </div>


      {/* ======================================================
          MAP + CRITICAL VILLAGES
      ====================================================== */}

      <div className="dashboard-grid">


        {/* Map */}

        <div className="dashboard-map">

          <MapView
            villages={normalizedVillages}
            shelters={shelters}
          />

        </div>


        {/* Critical Villages */}

        <div className="dashboard-side">

          <h2>Critical Villages</h2>


          {criticalVillages.length === 0 ? (

            <p>No critical villages found.</p>

          ) : (

            criticalVillages.map((village) => (

              <RiskCard
                key={village.village}
                village={village}
              />

            ))

          )}

        </div>

      </div>

    </div>
  );
}


export default Dashboard;