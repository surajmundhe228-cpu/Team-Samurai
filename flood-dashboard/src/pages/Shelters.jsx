import React from "react";

import shelters from "../data/shelter";
import ShelterCard from "../components/ShelterCard";

function Shelters() {

  const totalCapacity = shelters.reduce(
    (sum, shelter) => sum + shelter.capacity,
    0
  );

  const available = shelters.reduce(
    (sum, shelter) => sum + shelter.available_capacity,
    0
  );

  return (
    <div>

      <div className="page-heading">

        <h1>Relief Shelters</h1>

        <p>
          Monitor shelter capacity and facilities
        </p>

      </div>

      <div className="shelter-summary">

        <div>
          <span>Total Shelters</span>
          <strong>{shelters.length}</strong>
        </div>

        <div>
          <span>Total Capacity</span>
          <strong>{totalCapacity}</strong>
        </div>

        <div>
          <span>Available Spaces</span>
          <strong>{available}</strong>
        </div>

      </div>

      <div className="shelter-grid">

        {shelters.map(shelter => (

          <ShelterCard
            key={shelter.shelter_name}
            shelter={shelter}
          />

        ))}

      </div>

    </div>
  );
}

export default Shelters;