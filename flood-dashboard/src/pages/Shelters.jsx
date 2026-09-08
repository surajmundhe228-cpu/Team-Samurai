import React from "react";

import shelters from "../data/shelter";
import Sheltercard from "../components/Sheltercard";

function Shelters() {
  // ============================================================
  // SAFE SHELTER DATA
  // ============================================================

  const shelterData = Array.isArray(shelters)
    ? shelters
    : [];

  // ============================================================
  // TOTAL CAPACITY
  // ============================================================

  const totalCapacity = shelterData.reduce(
    (sum, shelter) =>
      sum + Number(shelter?.capacity || 0),
    0
  );

  // ============================================================
  // AVAILABLE SPACES
  // ============================================================

  const available = shelterData.reduce(
    (sum, shelter) =>
      sum +
      Number(
        shelter?.available_capacity || 0
      ),
    0
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="shelters-page mobile-page-shell">

      {/* ======================================================
          PAGE HEADING
      ====================================================== */}

      <div className="page-heading shelters-page-heading">

        <div className="page-heading-icon">
          🏠
        </div>

        <div>
          <h1>
            Relief Shelters
          </h1>

          <p>
            Monitor shelter capacity and facilities
          </p>
        </div>

      </div>

      {/* ======================================================
          SHELTER SUMMARY
      ====================================================== */}

      <div className="shelter-summary">

        <div className="shelter-summary-card">

          <div className="shelter-summary-icon">
            🏠
          </div>

          <div>
            <span>
              Total Shelters
            </span>

            <strong>
              {shelterData.length}
            </strong>
          </div>

        </div>

        <div className="shelter-summary-card">

          <div className="shelter-summary-icon">
            👥
          </div>

          <div>
            <span>
              Total Capacity
            </span>

            <strong>
              {totalCapacity.toLocaleString()}
            </strong>
          </div>

        </div>

        <div className="shelter-summary-card">

          <div className="shelter-summary-icon">
            ✅
          </div>

          <div>
            <span>
              Available Spaces
            </span>

            <strong>
              {available.toLocaleString()}
            </strong>
          </div>

        </div>

      </div>

      {/* ======================================================
          AVAILABILITY INDICATOR
      ====================================================== */}

      <div className="shelter-availability-bar">

        <div className="shelter-availability-header">

          <div>
            <strong>
              Shelter Availability
            </strong>

            <span>
              Current available capacity
            </span>
          </div>

          <strong>
            {totalCapacity > 0
              ? Math.round(
                  (available /
                    totalCapacity) *
                    100
                )
              : 0}
            %
          </strong>

        </div>

        <div className="shelter-progress-track">
          <div
            className="shelter-progress-fill"
            style={{
              width: `${
                totalCapacity > 0
                  ? Math.min(
                      100,
                      Math.max(
                        0,
                        (available /
                          totalCapacity) *
                          100
                      )
                    )
                  : 0
              }%`,
            }}
          />
        </div>

      </div>

      {/* ======================================================
          SHELTER SECTION HEADER
      ====================================================== */}

      <div className="shelter-section-header">

        <div>
          <h2>
            Available Relief Shelters
          </h2>

          <p>
            Shelter locations and current capacity
          </p>
        </div>

        <span className="shelter-count-badge">
          {shelterData.length} shelters
        </span>

      </div>

      {/* ======================================================
          SHELTER CARDS
      ====================================================== */}

      {shelterData.length === 0 ? (

        <div className="empty-state">

          <div className="empty-state-icon">
            🏠
          </div>

          <h3>
            No shelters available
          </h3>

          <p>
            No shelter information is currently available.
          </p>

        </div>

      ) : (

        <div className="shelter-grid">

          {shelterData.map(
            (shelter, index) => (

              <Sheltercard
                key={
                  shelter?.shelter_name ||
                  shelter?.name ||
                  shelter?.id ||
                  index
                }
                shelter={shelter}
              />

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Shelters;