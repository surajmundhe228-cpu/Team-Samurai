import { useEffect, useState } from "react";
import {
  Bell,
  LogOut,
  ShieldCheck,
  HeartPulse,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Users,
  Home,
  CloudRain,
  Map,
  Activity,
} from "lucide-react";

import "./AuthorityDashboard.css";

import StatCard from "./StatCard";
import Riskcard from "./Riskcard";
import AuthorityMapView from "./AuthorityMapView";
import WeatherCard from "./WeatherCard";
import ConnectionStatus from "./ConnectionStatus";
import { getDashboardData, getShelters } from "../services/api";

export default function AuthorityDashboard({
  user,
  onBack,
  onLogout,
}) {
  const officerName = user?.email
    ? user.email.split("@")[0]
    : "Authority";

  const [sosAlerts, setSosAlerts] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [shelterData, setShelterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD FLOOD DASHBOARD
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardData();

      if (data?.status === "error") {
        throw new Error(
          data.message || "Unable to load dashboard data."
        );
      }

      setDashboardData(data);

      try {
        const sheltersResponse = await getShelters();

        const liveShelters = Array.isArray(sheltersResponse)
          ? sheltersResponse
          : sheltersResponse?.shelters || [];

        setShelterData(liveShelters);
      } catch (shelterError) {
        console.warn(
          "Live shelter data unavailable.",
          shelterError
        );
        setShelterData([]);
      }
    } catch (err) {
      console.error("Dashboard API error:", err);

      setError(
        err?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================================
  // LOAD MEDICAL SOS
  // =====================================================

  useEffect(() => {
    const loadSOS = () => {
      const alerts =
        JSON.parse(
          localStorage.getItem("reloc8SOSAlerts")
        ) || [];

      setSosAlerts(alerts);
    };

    loadSOS();

    const interval = setInterval(loadSOS, 1000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // SOS ACTIONS
  // =====================================================

  const handleAccept = (id) => {
    const updated = sosAlerts.map((item) =>
      item.id === id
        ? { ...item, status: "ACCEPTED" }
        : item
    );

    setSosAlerts(updated);

    localStorage.setItem(
      "reloc8SOSAlerts",
      JSON.stringify(updated)
    );
  };

  const handleResolve = (id) => {
    const updated = sosAlerts.filter(
      (item) => item.id !== id
    );

    setSosAlerts(updated);

    localStorage.setItem(
      "reloc8SOSAlerts",
      JSON.stringify(updated)
    );
  };

  // =====================================================
  // NORMALIZE RISK DATA
  // =====================================================

  const riskAssessment = Array.isArray(
    dashboardData?.risk_assessment
  )
    ? dashboardData.risk_assessment
    : [];

  const normalizedRisk = riskAssessment.map(
    (village) => ({
      ...village,

      risk_level:
        village.risk_level?.toUpperCase() ||
        village.priority?.toUpperCase() ||
        "LOW",
    })
  );

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

  const totalVillages =
    dashboardData?.total_villages ??
    normalizedRisk.length;

  const totalPopulation =
    normalizedRisk.reduce(
      (sum, village) =>
        sum +
        Number(village.population || 0),
      0
    );

  // =====================================================
  // SHELTER STATISTICS
  // =====================================================

  const totalShelters =
    shelterData.length;

  const totalShelterCapacity =
    shelterData.reduce(
      (sum, shelter) =>
        sum +
        Number(shelter.capacity || 0),
      0
    );

  const availableShelterCapacity =
    shelterData.reduce(
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

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="authority-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="authority-header">

        <div className="authority-brand">

          <div className="authority-brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1>RELOC8</h1>
            <span>Authority Operations Center</span>
          </div>

        </div>

        <div className="authority-header-actions">

          <div className="authority-officer">
            <span>Officer</span>
            <strong>{officerName}</strong>
          </div>

          <button
            className="authority-icon-btn"
            title="Notifications"
          >
            <Bell size={20} />

            {sosAlerts.length > 0 && (
              <span className="notification-count">
                {sosAlerts.length}
              </span>
            )}
          </button>

          <button
            className="authority-logout-btn"
            onClick={onLogout}
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="authority-content">

        {/* TOP STATUS */}

        <section className="authority-welcome">

          <div>

            <div className="authority-title-row">

              <h2>
                Welcome, {officerName}
              </h2>

              <span className="authority-live">
                <span />
                LIVE
              </span>

            </div>

            <p>
              Real-time flood risk and evacuation
              monitoring
            </p>

          </div>

          <div className="authority-actions">

            <ConnectionStatus />

            <button
              className="refresh-dashboard-btn"
              onClick={loadDashboard}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "refresh-spin"
                    : ""
                }
              />
              Refresh
            </button>

          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="authority-warning">

            <AlertTriangle size={20} />

            <div>
              <strong>
                Dashboard update warning
              </strong>

              <p>{error}</p>
            </div>

          </div>
        )}

        {/* =================================================
            CRITICAL ALERT
        ================================================= */}

        {criticalVillages.length > 0 && (
          <section className="authority-critical-alert">

            <div className="critical-alert-icon">
              🚨
            </div>

            <div>
              <strong>
                Critical Flood Risk Detected
              </strong>

              <p>
                {criticalVillages.length} village
                {criticalVillages.length !== 1
                  ? "s"
                  : ""}{" "}
                require immediate attention.
              </p>
            </div>

            <span>CRITICAL</span>

          </section>
        )}

        {/* =================================================
            SITUATION OVERVIEW
        ================================================= */}

        <section className="authority-section">

          <div className="authority-section-heading">

            <div>
              <h2>
                <Activity size={19} />
                Situation Overview
              </h2>

              <p>
                Current flood and shelter status
              </p>
            </div>

          </div>

          <div className="authority-stats-grid">

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

        {/* =================================================
            MEDICAL SOS
        ================================================= */}

        <section className="authority-section">

          <div className="authority-section-heading">

            <div>

              <h2>
                <HeartPulse size={19} />
                Medical SOS Alerts
              </h2>

              <p>
                Emergency requests from citizens
              </p>

            </div>

            <span
              className={
                sosAlerts.length
                  ? "sos-live-badge"
                  : "sos-clear-badge"
              }
            >
              {sosAlerts.length
                ? `${sosAlerts.length} LIVE`
                : "NO ACTIVE ALERTS"}
            </span>

          </div>

          {sosAlerts.length === 0 ? (

            <div className="sos-empty">

              <CheckCircle size={30} />

              <strong>
                No active medical emergencies
              </strong>

              <span>
                New citizen SOS requests will
                appear here automatically.
              </span>

            </div>

          ) : (

            <div className="authority-sos-grid">

              {sosAlerts.map((alert) => (

                <article
                  className="authority-sos-card"
                  key={alert.id}
                >

                  <div className="sos-card-top">

                    <div className="sos-patient">

                      <HeartPulse size={18} />

                      <strong>
                        {alert.patientName ||
                          "Unknown Patient"}
                      </strong>

                    </div>

                    <span className="sos-status">
                      {alert.status}
                    </span>

                  </div>

                  <div className="sos-details">

                    <div>
                      <Phone size={14} />
                      {alert.phone ||
                        "Not provided"}
                    </div>

                    <div>
                      <MapPin size={14} />
                      {alert.location ||
                        "Location unavailable"}
                    </div>

                    <div>
                      <AlertTriangle size={14} />
                      {alert.emergencyType ||
                        "Medical emergency"}
                    </div>

                    {alert.description && (
                      <p>
                        {alert.description}
                      </p>
                    )}

                    <small>
                      <Clock size={12} />
                      {alert.createdAt ||
                        "Time unavailable"}
                    </small>

                  </div>

                  <div className="sos-actions">

                    {alert.status !==
                      "ACCEPTED" && (
                      <button
                        className="accept-sos-btn"
                        onClick={() =>
                          handleAccept(
                            alert.id
                          )
                        }
                      >
                        <CheckCircle size={15} />
                        Accept
                      </button>
                    )}

                    <button
                      className="resolve-sos-btn"
                      onClick={() =>
                        handleResolve(
                          alert.id
                        )
                      }
                    >
                      Resolve
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

        {/* =================================================
            WEATHER
        ================================================= */}

        <section className="authority-section">

          <div className="authority-section-heading">

            <div>

              <h2>
                <CloudRain size={19} />
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

        {/* =================================================
            FLOOD MAP
        ================================================= */}

        <section className="authority-section">

          <div className="authority-section-heading">

            <div>

              <h2>
                <Map size={19} />
                Flood Risk Map
              </h2>

              <p>
                Monitored villages and available
                relief shelters
              </p>

            </div>

          </div>

          <div className="authority-map-wrapper">

            <AuthorityMapView
              villages={normalizedRisk}
              shelters={shelterData}
            />

          </div>

        </section>

        {/* =================================================
            CRITICAL RISK AREAS
        ================================================= */}

        {criticalVillages.length > 0 && (

          <section className="authority-section">

            <div className="authority-section-heading">

              <div>

                <h2>
                  🚨 Critical Risk Areas
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

            <div className="risk-cards-grid">

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

        {/* =================================================
            HIGH RISK AREAS
        ================================================= */}

        {highVillages.length > 0 && (

          <section className="authority-section">

            <div className="authority-section-heading">

              <div>

                <h2>
                  ⚠️ High Risk Areas
                </h2>

                <p>
                  Villages requiring continued
                  monitoring
                </p>

              </div>

            </div>

            <div className="high-risk-list">

  {highVillages.map((village, index) => (

    <div
      className="high-risk-item"
      key={
        village.village ||
        village.village_name ||
        village.name ||
        `high-risk-${index}`
      }
    >

      <div className="high-risk-icon">
        ⚠️
      </div>

      <div className="high-risk-info">

        <strong>
          {village.village ||
            village.village_name ||
            village.name ||
            "Unknown Village"}
        </strong>

        <span>
          {village.district
            ? `${village.district} • Risk Score: ${
                village.risk_score ?? "N/A"
              }/100`
            : `High flood risk • Risk Score: ${
                village.risk_score ?? "N/A"
              }/100`}
        </span>

      </div>

      <span className="high-risk-badge">
        {village.risk_level || "HIGH"}
      </span>

    </div>

  ))}

</div>

          </section>

        )}

        {/* =================================================
            QUICK OPERATIONS
        ================================================= */}

        <section className="authority-section">

          <div className="authority-section-heading">

            <div>

              <h2>
                <ShieldCheck size={19} />
                Operations
              </h2>

              <p>
                Authority response information
              </p>

            </div>

          </div>

          <div className="authority-operation-grid">

            <div className="operation-card">

              <Users size={22} />

              <strong>
                Population Monitoring
              </strong>

              <span>
                {totalPopulation.toLocaleString()}{" "}
                people monitored
              </span>

            </div>

            <div className="operation-card">

              <Home size={22} />

              <strong>
                Shelter Capacity
              </strong>

              <span>
                {availableShelterCapacity.toLocaleString()}{" "}
                spaces available
              </span>

            </div>

            <div className="operation-card">

              <MapPin size={22} />

              <strong>
                Risk Locations
              </strong>

              <span>
                {criticalVillages.length +
                  highVillages.length}{" "}
                priority locations
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}