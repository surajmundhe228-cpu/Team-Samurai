import React from "react";

function Sheltercard({ shelter }) {

  const occupancy =
    (shelter.current_occupancy / shelter.capacity) * 100;

  let status = "Available";

  if (occupancy >= 90) {
    status = "Nearly Full";
  } else if (occupancy >= 75) {
    status = "Filling Fast";
  }

  return (
    <div className="shelter-card">

      <div className="shelter-header">

        <div>
          <h3>{shelter.shelter_name}</h3>
          <span>{shelter.type}</span>
        </div>

        <span className="shelter-status">
          {status}
        </span>

      </div>

      <div className="capacity-section">

        <div className="capacity-label">
          <span>Occupancy</span>
          <strong>
            {shelter.current_occupancy} / {shelter.capacity}
          </strong>
        </div>

        <div className="capacity-bar">

          <div
            className="capacity-fill"
            style={{ width: `${occupancy}%` }}
          />

        </div>

        <p>
          <strong>{shelter.available_capacity}</strong>{" "}
          spaces available
        </p>

      </div>

      <div className="facility-section">

        <strong>Facilities</strong>

        <p>{shelter.facilities}</p>

      </div>

    </div>
  );
}

export default Sheltercard;