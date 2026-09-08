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

        console.log(
          "Dashboard data:",
          data
        );

        if (data?.status === "error") {

          throw new Error(
            data.message ||
            "Unable to load dashboard data."
          );

        }

        setDashboardData(data);

      } catch (err) {

        console.error(
          "Dashboard API error:",
          err
        );

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

          <div>
            <h1>
              Reloc8 Dashboard
            </h1>

            <p>
              Real-time flood risk and
              evacuation monitoring
            </p>
          </div>

        </div>


        <ConnectionStatus />


        <div className="loading-state">

          <div className="loading-spinner"></div>

          <span>
            Loading dashboard data...
          </span>

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

          <div>

            <h1>
              Reloc8 Dashboard
            </h1>

            <p>
              Real-time flood risk and
              evacuation monitoring
            </p>

          </div>

        </div>


        <ConnectionStatus />


        <div className="error-state">

          <span className="error-icon">
            ⚠️
          </span>

          <div>

            <strong>
              Unable to load dashboard
            </strong>

            <p>
              {error}
            </p>

          </div>

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
          PAGE HEADER
      ================================== */}

      <section className="dashboard-header">

        <div className="page-heading">

          <div>

            <div className="dashboard-title-row">

              <h1>
                Reloc8 Dashboard
              </h1>

              <span className="live-badge">
                <span className="live-dot"></span>
                LIVE
              </span>

            </div>

            <p>
              Real-time flood risk and
              evacuation monitoring
            </p>

          </div>

        </div>


        <ConnectionStatus />

      </section>


      {/* ==================================
          ERROR
      ================================== */}

      {error && (

        <div className="error-state">

          <span className="error-icon">
            ⚠️
          </span>

          <div>

            <strong>
              Dashboard update warning
            </strong>

            <p>
              {error}
            </p>

          </div>

        </div>

      )}


      {/* ==================================
          PRIORITY ALERT
      ================================== */}

      {criticalVillages.length > 0 && (

        <section className="dashboard-alert">

          <div className="alert-icon">
            🚨
          </div>

          <div className="alert-content">

            <strong>
              Critical Flood Risk Detected
            </strong>

            <span>
              {criticalVillages.length} village
              {criticalVillages.length !== 1
                ? "s"
                : ""} require immediate attention.
            </span>

          </div>

          <div className="alert-indicator">
            CRITICAL
          </div>

        </section>

      )}


      {/* ==================================
          STATISTICS
      ================================== */}

      <section className="dashboard-section">

        <div className="section-heading dashboard-section-heading">

          <div>

            <h2>
              Situation Overview
            </h2>

            <p>
              Current flood and shelter status
            </p>

          </div>

        </div>


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

      </section>


      {/* ==================================
          WEATHER
      ================================== */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>
              Weather Conditions
            </h2>

            <p>
              Current conditions affecting
              flood risk
            </p>

          </div>

        </div>

        <WeatherCard />

      </section>


      {/* ==================================
          MAP
      ================================== */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>
              Flood Risk Map
            </h2>

            <p>
              Monitored villages and available
              relief shelters
            </p>

          </div>

        </div>

        <MapView
          villages={normalizedRisk}
          shelters={shelters}
        />

      </section>


      {/* ==================================
          CRITICAL RISK VILLAGES
      ================================== */}

      {criticalVillages.length > 0 && (

        <section className="risk-section">

          <div className="section-heading">

            <div>

              <h2>
                Critical Risk Areas
              </h2>

              <p>
                Villages requiring immediate
                attention
              </p>

            </div>

            <span className="critical-count">
              {criticalVillages.length} Critical
            </span>

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

        </section>

      )}


      {/* ==================================
          HIGH RISK SUMMARY
      ================================== */}

      {highVillages.length > 0 && (

        <section className="dashboard-section high-risk-summary">

          <div className="section-heading">

            <div>

              <h2>
                High Risk Areas
              </h2>

              <p>
                Villages requiring continued
                monitoring
              </p>

            </div>

          </div>


          <div className="high-risk-list">

            {highVillages.map(
              (village, index) => (

                <div
                  className="high-risk-item"
                  key={
                    village.village_name ||
                    village.name ||
                    index
                  }
                >

                  <div className="high-risk-icon">
                    ⚠️
                  </div>

                  <div className="high-risk-info">

                    <strong>
                      {
                        village.village_name ||
                        village.name ||
                        "Unknown Village"
                      }
                    </strong>

                    <span>
                      High flood risk
                    </span>

                  </div>

                  <span className="high-risk-badge">
                    HIGH
                  </span>

                </div>

              )
            )}

          </div>

        </section>

      )}

    </div>

  );

}


export default Dashboard;