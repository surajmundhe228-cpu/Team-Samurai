import React, { useEffect, useState } from "react";

import villages from "../data/village";
import Risktable from "../components/Risktable";

import { calculateRisk } from "../services/api";
import { getOfflineData } from "../services/offline";

function RiskAssessment() {
  const [filter, setFilter] = useState("ALL");
  const [riskVillages, setRiskVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD RISK DATA
  // ============================================================

  useEffect(() => {
    async function loadRiskData() {
      try {
        setLoading(true);
        setError("");

        // ------------------------------------------------------
        // TRY BACKEND / API
        // ------------------------------------------------------

        let data;

        try {
          data = await calculateRisk(villages);

          console.log(
            "Risk data from backend:",
            data
          );
        } catch (apiError) {
          console.warn(
            "Risk API unavailable. Trying offline data..."
          );

          // ----------------------------------------------------
          // OFFLINE FALLBACK
          // ----------------------------------------------------

          const cachedData =
            getOfflineData("reloc8_risk");

          if (cachedData) {
            console.log(
              "Using cached offline risk data:",
              cachedData
            );

            data = cachedData;
          } else {
            throw apiError;
          }
        }

        // ------------------------------------------------------
        // CHECK BACKEND ERROR
        // ------------------------------------------------------

        if (
          !Array.isArray(data) &&
          data?.status === "error"
        ) {
          throw new Error(
            data.message ||
              "Risk calculation failed."
          );
        }

        // ------------------------------------------------------
        // EXTRACT RISK DATA
        // ------------------------------------------------------

        let riskData = [];

        // Backend returned array directly
        if (Array.isArray(data)) {
          riskData = data;
        }

        // Backend returned risk_assessment
        else if (
          Array.isArray(
            data?.risk_assessment
          )
        ) {
          riskData =
            data.risk_assessment;
        }

        // Alternative property
        else if (
          Array.isArray(data?.results)
        ) {
          riskData = data.results;
        }

        // Alternative property
        else if (
          Array.isArray(data?.villages)
        ) {
          riskData = data.villages;
        }

        // ------------------------------------------------------
        // NORMALIZE RISK DATA
        // ------------------------------------------------------

        const normalizedRiskData =
          riskData.map(
            (village, index) => ({
              ...village,

              risk_level:
                String(
                  village?.risk_level ||
                    village?.priority ||
                    village?.risk ||
                    "LOW"
                ).toUpperCase(),

              village:
                village?.village ||
                village?.village_name ||
                village?.name ||
                `Village ${index + 1}`,
            })
          );

        console.log(
          "Normalized risk data:",
          normalizedRiskData
        );

        // ------------------------------------------------------
        // SAVE TO STATE
        // ------------------------------------------------------

        setRiskVillages(
          normalizedRiskData
        );
      } catch (err) {
        console.error(
          "Risk API error:",
          err
        );

        setError(
          err?.message ||
            "Unable to calculate flood risk."
        );

        setRiskVillages([]);
      } finally {
        setLoading(false);
      }
    }

    loadRiskData();
  }, []);

  // ============================================================
  // FILTER VILLAGES
  // ============================================================

  const filteredVillages =
    filter === "ALL"
      ? riskVillages
      : riskVillages.filter(
          (village) =>
            String(
              village?.risk_level ||
                ""
            ).toUpperCase() === filter
        );

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="risk-assessment-page mobile-page-shell">

        <div className="page-heading risk-page-heading">
          <div className="page-heading-icon">
            ⚠️
          </div>

          <div>
            <h1>
              Risk Assessment
            </h1>

            <p>
              Calculating flood risk...
            </p>
          </div>
        </div>

        <div className="generate-loading risk-loading-card">
          <div className="loading-spinner"></div>

          <h2>
            Analyzing Village Risk
          </h2>

          <p>
            Calculating hazard, vulnerability
            and exposure levels...
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
      <div className="risk-assessment-page mobile-page-shell">

        <div className="page-heading risk-page-heading">
          <div className="page-heading-icon">
            ⚠️
          </div>

          <div>
            <h1>
              Risk Assessment
            </h1>

            <p>
              Analyze flood risk across villages
            </p>
          </div>
        </div>

        <div className="evacuation-error risk-error-card">
          <div className="risk-error-icon">
            ⚠️
          </div>

          <strong>
            Unable to calculate risk
          </strong>

          <span>
            {error}
          </span>
        </div>

        <button
          className="generate-main-btn risk-retry-btn"
          onClick={() => {
            window.location.reload();
          }}
        >
          🔄 Retry
        </button>

      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="risk-assessment-page mobile-page-shell">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="page-heading risk-page-heading">

        <div className="page-heading-icon">
          ⚠️
        </div>

        <div>
          <h1>
            Risk Assessment
          </h1>

          <p>
            Analyze flood risk across villages
          </p>
        </div>

      </div>

      {/* ======================================================
          RISK SUMMARY
      ====================================================== */}

      <div className="risk-mobile-summary">

        <div className="risk-summary-card">
          <span className="risk-summary-icon">
            📊
          </span>

          <div>
            <span className="risk-summary-label">
              Total Villages
            </span>

            <strong>
              {riskVillages.length}
            </strong>
          </div>
        </div>

        <div className="risk-summary-card">
          <span className="risk-summary-icon">
            🔎
          </span>

          <div>
            <span className="risk-summary-label">
              Showing
            </span>

            <strong>
              {filteredVillages.length}
            </strong>
          </div>
        </div>

      </div>

      {/* ======================================================
          FILTER BAR
      ====================================================== */}

      <div className="filter-section">

        <div className="filter-section-header">
          <div>
            <h3>
              Risk Level
            </h3>

            <span>
              Filter villages by priority
            </span>
          </div>
        </div>

        <div className="filter-bar">

          <button
            className={
              filter === "ALL"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("ALL")
            }
          >
            All
          </button>

          <button
            className={
              filter === "CRITICAL"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("CRITICAL")
            }
          >
            Critical
          </button>

          <button
            className={
              filter === "HIGH"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("HIGH")
            }
          >
            High
          </button>

          <button
            className={
              filter === "MEDIUM"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("MEDIUM")
            }
          >
            Medium
          </button>

          <button
            className={
              filter === "LOW"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("LOW")
            }
          >
            Low
          </button>

        </div>

      </div>

      {/* ======================================================
          RESULT COUNT
      ====================================================== */}

      <div className="risk-result-count">

        Showing{" "}

        <strong>
          {filteredVillages.length}
        </strong>{" "}

        of{" "}

        <strong>
          {riskVillages.length}
        </strong>{" "}

        villages

      </div>

      {/* ======================================================
          RISK TABLE
      ====================================================== */}

      <div className="risk-table-section">

        {filteredVillages.length === 0 ? (

          <div className="empty-state">

            <div className="empty-state-icon">
              🔍
            </div>

            <h3>
              No villages found
            </h3>

            <p>
              There are no villages matching
              the selected risk level.
            </p>

          </div>

        ) : (

          <Risktable
            villages={filteredVillages}
          />

        )}

      </div>

    </div>
  );
}

export default RiskAssessment;