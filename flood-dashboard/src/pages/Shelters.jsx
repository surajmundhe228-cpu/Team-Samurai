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
      sum + Number(
        shelter?.available_capacity || 0
      ),
    0
  );


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div>

      {/* ======================================================
          PAGE HEADING
      ====================================================== */}

      <div className="page-heading">

        <h1>
          Relief Shelters
        </h1>

        <p>
          Monitor shelter capacity and facilities
        </p>

      </div>


      {/* ======================================================
          SHELTER SUMMARY
      ====================================================== */}

      <div className="shelter-summary">

        <div>

          <span>
            Total Shelters
          </span>

          <strong>
            {shelterData.length}
          </strong>

        </div>


        <div>

          <span>
            Total Capacity
          </span>

          <strong>
            {totalCapacity.toLocaleString()}
          </strong>

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


      {/* ======================================================
          SHELTER CARDS
      ====================================================== */}

      {shelterData.length === 0 ? (

        <div className="empty-state">

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