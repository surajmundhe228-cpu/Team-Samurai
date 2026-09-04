import React, { useState } from "react";

import { createEvacuationPlan } from "../services/api";

import villages from "../data/village";
import shelters from "../data/shelter";


function EvacuationPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ============================================================
  // GENERATE EVACUATION PLAN
  // ============================================================

  const handleGeneratePlan = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await createEvacuationPlan(
        villages,
        shelters
      );

      console.log("Evacuation API response:", data);


      // --------------------------------------------------------
      // CHECK RESPONSE
      // --------------------------------------------------------

      if (!data) {
        throw new Error(
          "Backend returned an empty response."
        );
      }

      if (
        !Array.isArray(data) &&
        data.status === "error"
      ) {
        throw new Error(
          data.message ||
          "Evacuation plan generation failed."
        );
      }


      // --------------------------------------------------------
      // EXTRACT EVACUATION PLAN
      // --------------------------------------------------------

      let evacuationData = [];


      // Backend returned array directly
      if (Array.isArray(data)) {
        evacuationData = data;
      }

      // Backend returned evacuation_plan
      else if (
        Array.isArray(data.evacuation_plan)
      ) {
        evacuationData = data.evacuation_plan;
      }

      // Alternative backend property
      else if (
        Array.isArray(data.plans)
      ) {
        evacuationData = data.plans;
      }

      // Alternative backend property
      else if (
        Array.isArray(data.village_plans)
      ) {
        evacuationData = data.village_plans;
      }

      // Alternative backend property
      else if (
        Array.isArray(data.result)
      ) {
        evacuationData = data.result;
      }


      // --------------------------------------------------------
      // NORMALIZE RESPONSE
      // --------------------------------------------------------

      const safePlan = Array.isArray(data)
        ? {
            status: "success",
            summary: {},
            evacuation_plan: evacuationData,
          }
        : {
            ...data,

            summary:
              data.summary &&
              typeof data.summary === "object"
                ? data.summary
                : {},

            evacuation_plan:
              evacuationData,
          };


      console.log(
        "Normalized evacuation plan:",
        safePlan
      );


      setPlan(safePlan);

    } catch (err) {
      console.error(
        "Evacuation plan error:",
        err
      );

      setError(
        err?.message ||
        "Unable to generate evacuation plan."
      );

      setPlan(null);

    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // SUMMARY DATA
  // ============================================================

  const summary = plan?.summary || {};


  const evacuationPlan =
    Array.isArray(plan?.evacuation_plan)
      ? plan.evacuation_plan
      : [];


  // ------------------------------------------------------------
  // TOTAL POPULATION
  // ------------------------------------------------------------

  const villagePopulation =
    Array.isArray(villages)
      ? villages.reduce(
          (sum, village) =>
            sum +
            Number(
              village?.population || 0
            ),
          0
        )
      : 0;


  const totalPopulation =
    Number(
      summary.total_population ??
      summary.population ??
      villagePopulation
    );


  // ------------------------------------------------------------
  // TOTAL EVACUATED
  // ------------------------------------------------------------

  const calculatedEvacuated =
    evacuationPlan.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.evacuated_population ??
          item?.evacuated ??
          item?.assigned_population ??
          0
        ),
      0
    );


  const totalEvacuated =
    Number(
      summary.total_evacuated ??
      summary.evacuated_population ??
      calculatedEvacuated
    );


  // ------------------------------------------------------------
  // TOTAL UNASSIGNED
  // ------------------------------------------------------------

  const totalUnassigned =
    Number(
      summary.total_unassigned ??
      summary.unassigned_population ??
      Math.max(
        totalPopulation -
        totalEvacuated,
        0
      )
    );


  // ------------------------------------------------------------
  // COMPLETION %
  // ------------------------------------------------------------

  const calculatedPercentage =
    totalPopulation > 0
      ? (
          totalEvacuated /
          totalPopulation
        ) * 100
      : 0;


  const completionPercentage =
    Number(
      summary.evacuation_completion_percentage ??
      summary.completion_percentage ??
      calculatedPercentage
    );


  // ============================================================
  // PRIORITY CLASS
  // ============================================================

  const getPriorityClass = (priority) => {
    const value =
      String(priority || "")
        .toLowerCase();

    if (
      value.includes("critical") ||
      value.includes("very high")
    ) {
      return "priority-critical";
    }

    if (
      value.includes("high")
    ) {
      return "priority-high";
    }

    if (
      value.includes("medium")
    ) {
      return "priority-medium";
    }

    return "priority-low";
  };


  // ============================================================
  // STATUS CLASS
  // ============================================================

  const getStatusClass = (status) => {
    const value =
      String(status || "")
        .toLowerCase();

    if (
      value.includes("fully") ||
      value.includes("complete")
    ) {
      return "status-complete";
    }

    if (
      value.includes("partial") ||
      value.includes("progress")
    ) {
      return "status-partial";
    }

    return "status-pending";
  };


  // ============================================================
  // STATUS ICON
  // ============================================================

  const getStatusIcon = (status) => {
    const value =
      String(status || "")
        .toLowerCase();

    if (
      value.includes("fully") ||
      value.includes("complete")
    ) {
      return "✓";
    }

    if (
      value.includes("partial") ||
      value.includes("progress")
    ) {
      return "!";
    }

    return "○";
  };


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="evacuation-page">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="evacuation-header">

        <div className="page-heading">

          <h1>
            Evacuation Plan
          </h1>

          <p>
            Generate intelligent evacuation
            plans, shelter assignments and
            recommended routes.
          </p>

        </div>


        <button
          className="generate-plan-btn"
          onClick={handleGeneratePlan}
          disabled={loading}
        >

          {loading ? (
            <>
              <span className="button-spinner"></span>
              Generating...
            </>
          ) : (
            <>
              <span className="button-icon">
                ⚡
              </span>

              {plan
                ? "Regenerate Plan"
                : "Generate Evacuation Plan"}
            </>
          )}

        </button>

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="evacuation-error">

          <strong>
            Unable to generate plan
          </strong>

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ======================================================
          BEFORE GENERATION
      ====================================================== */}

      {!plan &&
        !loading &&
        !error && (

          <div className="generate-empty">

            <div className="empty-icon">
              🚨
            </div>

            <h2>
              Ready to Generate
              Evacuation Plan?
            </h2>

            <p>
              The system will analyze village
              risk, population and available
              shelters to create an
              evacuation strategy.
            </p>


            <button
              className="generate-main-btn"
              onClick={handleGeneratePlan}
            >
              ⚡ Generate Plan
            </button>


            <div className="generation-features">

              <div>
                <span>🧠</span>

                <strong>
                  Risk Analysis
                </strong>

                <small>
                  Analyze flood risk
                </small>
              </div>


              <div>
                <span>🏠</span>

                <strong>
                  Shelter Matching
                </strong>

                <small>
                  Find suitable shelters
                </small>
              </div>


              <div>
                <span>🛣️</span>

                <strong>
                  Route Planning
                </strong>

                <small>
                  Recommend evacuation routes
                </small>
              </div>

            </div>

          </div>

        )}


      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (

        <div className="generate-loading">

          <div className="loading-spinner"></div>

          <h2>
            Generating Evacuation Plan
          </h2>

          <p>
            Analyzing risk levels, shelter
            capacity and evacuation
            requirements...
          </p>

        </div>

      )}


      {/* ======================================================
          RESULTS
      ====================================================== */}

      {plan && !loading && (

        <>

          {/* ==================================================
              SUMMARY
          ================================================== */}

          <div className="evacuation-summary">


            <div className="evac-summary-card population-card">

              <div className="summary-icon">
                👥
              </div>

              <div>

                <span>
                  Total Population
                </span>

                <strong>
                  {totalPopulation.toLocaleString()}
                </strong>

                <small>
                  People in affected villages
                </small>

              </div>

            </div>


            <div className="evac-summary-card evacuated-card">

              <div className="summary-icon">
                ✅
              </div>

              <div>

                <span>
                  Evacuated
                </span>

                <strong>
                  {totalEvacuated.toLocaleString()}
                </strong>

                <small>
                  Successfully assigned
                </small>

              </div>

            </div>


            <div className="evac-summary-card unassigned-card">

              <div className="summary-icon">
                ⚠️
              </div>

              <div>

                <span>
                  Unassigned
                </span>

                <strong>
                  {totalUnassigned.toLocaleString()}
                </strong>

                <small>
                  Require additional capacity
                </small>

              </div>

            </div>


            <div className="evac-summary-card completion-card">

              <div className="summary-icon">
                📊
              </div>

              <div>

                <span>
                  Completion
                </span>

                <strong>
                  {completionPercentage.toFixed(1)}%
                </strong>

                <small>
                  Evacuation progress
                </small>

              </div>

            </div>

          </div>


          {/* ==================================================
              PROGRESS
          ================================================== */}

          <div className="evacuation-progress-card">

            <div className="progress-header">

              <div>

                <h2>
                  Evacuation Progress
                </h2>

                <p>
                  {totalEvacuated.toLocaleString()}{" "}
                  of{" "}
                  {totalPopulation.toLocaleString()}{" "}
                  people assigned to shelters
                </p>

              </div>

              <strong>
                {completionPercentage.toFixed(1)}%
              </strong>

            </div>


            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    Math.max(
                      completionPercentage,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>


          {/* ==================================================
              PLAN TITLE
          ================================================== */}

          <div className="plans-title">

            <div>

              <h2>
                Village Evacuation Plans
              </h2>

              <p>
                Recommended actions for
                each village
              </p>

            </div>

            <span>
              {evacuationPlan.length} Villages
            </span>

          </div>


          {/* ==================================================
              VILLAGE PLANS
          ================================================== */}

          <div className="evacuation-list">

            {evacuationPlan.length === 0 ? (

              <div className="empty-state">

                <h3>
                  No evacuation plan available
                </h3>

                <p>
                  The backend did not return
                  any village evacuation plans.
                </p>

              </div>

            ) : (

              evacuationPlan.map(
                (item, index) => {

                  if (
                    !item ||
                    typeof item !== "object"
                  ) {
                    return null;
                  }


                  // ------------------------------------------
                  // VILLAGE
                  // ------------------------------------------

                  const villageName =
                    item.village ||
                    item.village_name ||
                    item.name ||
                    `Village ${index + 1}`;


                  const district =
                    item.district ||
                    "";


                  // ------------------------------------------
                  // POPULATION
                  // ------------------------------------------

                  const population =
                    Number(
                      item.population ??
                      item.total_population ??
                      0
                    );


                  // ------------------------------------------
                  // EVACUATED
                  // ------------------------------------------

                  const evacuated =
                    Number(
                      item.evacuated_population ??
                      item.evacuated ??
                      item.assigned_population ??
                      0
                    );


                  // ------------------------------------------
                  // REMAINING
                  // ------------------------------------------

                  const unassigned =
                    Number(
                      item.unassigned_population ??
                      item.unassigned ??
                      Math.max(
                        population -
                        evacuated,
                        0
                      )
                    );


                  // ------------------------------------------
                  // PRIORITY
                  // ------------------------------------------

                  const priority =
                    item.priority ||
                    item.risk_level ||
                    item.risk_priority ||
                    "Unknown";


                  // ------------------------------------------
                  // RISK SCORE
                  // ------------------------------------------

                  const riskScore =
                    item.risk_score ??
                    item.risk ??
                    item.score ??
                    "-";


                  // ------------------------------------------
                  // STATUS
                  // ------------------------------------------

                  const status =
                    item.evacuation_status ||
                    item.status ||
                    (
                      unassigned === 0
                        ? "Fully Evacuated"
                        : evacuated > 0
                          ? "Partially Evacuated"
                          : "Not Evacuated"
                    );


                  // ------------------------------------------
                  // SHELTER ASSIGNMENTS
                  // ------------------------------------------

                  const assignments =
                    Array.isArray(
                      item.shelter_assignments
                    )
                      ? item.shelter_assignments
                      : Array.isArray(
                          item.assignments
                        )
                        ? item.assignments
                        : [];


                  // ------------------------------------------
                  // ROUTES
                  // ------------------------------------------

                  const routes =
                    Array.isArray(item.routes)
                      ? item.routes
                      : Array.isArray(
                          item.recommended_routes
                        )
                        ? item.recommended_routes
                        : [];


                  return (

                    <div
                      className="evacuation-card"
                      key={`${villageName}-${index}`}
                    >


                      {/* ====================================
                          HEADER
                      ==================================== */}

                      <div className="evacuation-card-header">

                        <div className="village-title">

                          <div className="village-icon">
                            📍
                          </div>

                          <div>

                            <h2>
                              {String(villageName)}
                            </h2>

                            {district && (
                              <p>
                                {String(district)}
                              </p>
                            )}

                          </div>

                        </div>


                        <div
                          className={`priority-badge ${getPriorityClass(
                            priority
                          )}`}
                        >
                          {String(priority)}
                        </div>

                      </div>


                      {/* ====================================
                          STATS
                      ==================================== */}

                      <div className="village-stats">

                        <div className="village-stat">

                          <span>
                            Population
                          </span>

                          <strong>
                            {population.toLocaleString()}
                          </strong>

                        </div>


                        <div className="village-stat">

                          <span>
                            Evacuated
                          </span>

                          <strong>
                            {evacuated.toLocaleString()}
                          </strong>

                        </div>


                        <div className="village-stat">

                          <span>
                            Remaining
                          </span>

                          <strong>
                            {unassigned.toLocaleString()}
                          </strong>

                        </div>


                        <div className="village-stat">

                          <span>
                            Risk Score
                          </span>

                          <strong>
                            {String(riskScore)}
                          </strong>

                        </div>

                      </div>


                      {/* ====================================
                          STATUS
                      ==================================== */}

                      <div
                        className={`evacuation-status ${getStatusClass(
                          status
                        )}`}
                      >

                        <span>
                          {getStatusIcon(status)}
                        </span>

                        <div>

                          <strong>
                            {String(status)}
                          </strong>

                          <small>
                            {evacuated.toLocaleString()}{" "}
                            people evacuated
                          </small>

                        </div>

                      </div>


                      {/* ====================================
                          SHELTER ASSIGNMENTS
                      ==================================== */}

                      <div className="section-block">

                        <div className="section-heading">

                          <h3>
                            🏠 Shelter Assignments
                          </h3>

                          <span>
                            {assignments.length} shelters
                          </span>

                        </div>


                        {assignments.length === 0 ? (

                          <div className="no-assignment">
                            No shelter assignment available.
                          </div>

                        ) : (

                          <div className="assignment-grid">

                            {assignments.map(
                              (
                                assignment,
                                assignmentIndex
                              ) => {

                                if (
                                  !assignment ||
                                  typeof assignment !== "object"
                                ) {
                                  return null;
                                }


                                const shelterName =
                                  assignment.shelter_name ||
                                  assignment.shelter ||
                                  assignment.name ||
                                  assignment.destination ||
                                  "Shelter";


                                const assignedPeople =
                                  Number(
                                    assignment.assigned_population ??
                                    assignment.assigned ??
                                    assignment.population ??
                                    assignment.people ??
                                    assignment.count ??
                                    0
                                  );


                                const distance =
                                  assignment.distance_km ??
                                  assignment.distance ??
                                  null;


                                return (

                                  <div
                                    className="assignment-card"
                                    key={assignmentIndex}
                                  >

                                    <div className="assignment-icon">
                                      🏠
                                    </div>


                                    <div className="assignment-info">

                                      <strong>
                                        {String(
                                          shelterName
                                        )}
                                      </strong>

                                      <span>
                                        {assignedPeople.toLocaleString()}{" "}
                                        people assigned
                                      </span>


                                      {distance !== null &&
                                        distance !== undefined && (
                                          <small>
                                            📍{" "}
                                            {String(distance)}{" "}
                                            km away
                                          </small>
                                        )}

                                    </div>


                                    <div className="assignment-count">
                                      {assignedPeople}
                                    </div>

                                  </div>

                                );
                              }
                            )}

                          </div>

                        )}

                      </div>


                      {/* ====================================
                          ROUTES
                      ==================================== */}

                      {routes.length > 0 && (

                        <div className="section-block">

                          <div className="section-heading">

                            <h3>
                              🛣️ Recommended Routes
                            </h3>

                            <span>
                              {routes.length} routes
                            </span>

                          </div>


                          <div className="route-list">

                            {routes.map(
                              (
                                route,
                                routeIndex
                              ) => {

                                if (
                                  !route ||
                                  typeof route !== "object"
                                ) {
                                  return null;
                                }


                                const shelterName =
                                  route.shelter_name ||
                                  route.shelter ||
                                  route.destination ||
                                  route.name ||
                                  "Shelter";


                                const distance =
                                  route.distance_km ??
                                  route.distance ??
                                  null;


                                return (

                                  <div
                                    className="route-card"
                                    key={routeIndex}
                                  >

                                    <div className="route-number">
                                      {routeIndex + 1}
                                    </div>


                                    <div className="route-info">

                                      <strong>
                                        {String(
                                          shelterName
                                        )}
                                      </strong>


                                      {route.route_type && (
                                        <small>
                                          {String(
                                            route.route_type
                                          )}
                                        </small>
                                      )}

                                    </div>


                                    <div className="route-distance">

                                      {distance !== null &&
                                      distance !== undefined
                                        ? `${distance} km`
                                        : "N/A"}

                                    </div>

                                  </div>

                                );
                              }
                            )}

                          </div>

                        </div>

                      )}

                    </div>

                  );
                }
              )

            )}

          </div>

        </>

      )}

    </div>
  );
}


export default EvacuationPlan;