import React, { useEffect, useState } from "react";

import shelters from "../data/shelter";

import StatCard from "../components/StatCard";
import Riskcard from "../components/Riskcard";
import MapView from "../components/MapView";
import WeatherCard from "../components/WeatherCard";
import ConnectionStatus from "../components/ConnectionStatus";

import { getDashboardData } from "../services/api";


function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ========================================
  // LOAD DASHBOARD DATA
  // ========================================

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardData();

        console.log("Dashboard data:", data);

        if (data?.status === "error") {
          throw new Error(
            data.message || "Unable to load dashboard data."
          );
        }

        setDashboardData(data);

      } catch (err) {
        console.error("Dashboard API error:", err);

        setError(
          err?.message ||
          "Unable to load dashboard data."
        );

      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="dashboard-page">

        <div className="page-heading">
          <h1>Reloc8 Dashboard</h1>
          <p>
            Real-time flood risk and evacuation monitoring
          </p>
        </div>

        <ConnectionStatus />

        <div className="loading-state">
          Loading dashboard data...
        </div>

      </div>
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (error && !dashboardData) {
    return (
      <div className="dashboard-page">

        <div className="page-heading">
          <h1>Reloc8 Dashboard</h1>
          <p>
            Real-time flood risk and evacuation monitoring
          </p>
        </div>

        <ConnectionStatus />

        <div className="error-state">
          {error}
        </div>

      </div>
    );
  }


  // ========================================
  // SAFE DATA
  // ========================================

  const riskAssessment =
    Array.isArray(
      dashboardData?.risk_assessment
    )
      ? dashboardData.risk_assessment
      : [];


  // ========================================
  // NORMALIZE RISK DATA
  // ========================================

  const normalizedRisk =
    riskAssessment.map((village) => ({
      ...village,

      risk_level:
        village.risk_level?.toUpperCase() ||
        village.priority?.toUpperCase() ||
        "LOW",
    }));


  // ========================================
  // STATISTICS
  // ========================================

  const totalVillages =
    dashboardData?.total_villages ??
    normalizedRisk.length;


  const criticalVillages =
    normalizedRisk.filter(
      (village) =>
        village.risk_level === "CRITICAL"
    );


  const highVillages =
    normalizedRisk.filter(
      (village) =>
        village.risk_level === "HIGH"
    );


  const totalPopulation =
    normalizedRisk.reduce(
      (sum, village) =>
        sum +
        Number(
          village.population || 0
        ),
      0
    );


  // ========================================
  // SHELTER STATISTICS
  // ========================================

  const totalShelters =
    shelters.length;


  const totalShelterCapacity =
    shelters.reduce(
      (sum, shelter) =>
        sum +
        Number(
          shelter.capacity || 0
        ),
      0
    );


  const availableShelterCapacity =
    shelters.reduce(
      (sum, shelter) =>
        sum +
        Number(
          shelter.available_capacity || 0
        ),
      0
    );


  const occupiedShelterCapacity =
    totalShelterCapacity -
    availableShelterCapacity;


  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="dashboard-page">

      {/* ==================================
          PAGE HEADING
      ================================== */}

      <div className="page-heading">

        <h1>
          Reloc8 Dashboard
        </h1>

        <p>
          Real-time flood risk and
          evacuation monitoring
        </p>

      </div>


      {/* ==================================
          CONNECTION STATUS
      ================================== */}

      <ConnectionStatus />


      {/* ==================================
          ERROR MESSAGE
      ================================== */}

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}


      {/* ==================================
          STAT CARDS
      ================================== */}

      <div className="stats-grid">

        <StatCard
          icon="🏘️"
          title="Total Villages"
          value={totalVillages}
          subtitle="Monitored locations"
        />


        <StatCard
          icon="🚨"
          title="Critical Risk"
          value={criticalVillages.length}
          subtitle="Immediate attention"
        />


        <StatCard
          icon="⚠️"
          title="High Risk"
          value={highVillages.length}
          subtitle="Require monitoring"
        />


        <StatCard
          icon="👥"
          title="Population"
          value={totalPopulation.toLocaleString()}
          subtitle="People in monitored areas"
        />


        <StatCard
          icon="🏠"
          title="Shelters"
          value={totalShelters}
          subtitle={`${availableShelterCapacity.toLocaleString()} spaces available`}
        />


        <StatCard
          icon="🛏️"
          title="Occupied"
          value={occupiedShelterCapacity.toLocaleString()}
          subtitle={`of ${totalShelterCapacity.toLocaleString()} capacity`}
        />

      </div>


      {/* ==================================
          WEATHER
      ================================== */}

      <WeatherCard />


      {/* ==================================
          MAP
      ================================== */}

      <MapView
        villages={normalizedRisk}
        shelters={shelters}
      />


      {/* ==================================
          CRITICAL RISK VILLAGES
      ================================== */}

      {criticalVillages.length > 0 && (

        <div className="risk-section">

          <div className="section-heading">

            <h2>
              Critical Risk Areas
            </h2>

            <p>
              Villages requiring immediate attention
            </p>

          </div>


          <div className="risk-cards">

            {criticalVillages.map(
              (village, index) => (

                <Riskcard
                  key={
                    village.village_name ||
                    village.name ||
                    index
                  }
                  village={village}
                />

              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}


export default Dashboard;