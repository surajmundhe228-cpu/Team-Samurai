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

      {/* =========================
          HEADER
      ========================= */}

      <div className="shelter-header">

        <div>
          <h3>{shelter.shelter_name}</h3>

          <span>
            {shelter.type}
          </span>

          <p>
            📍 {shelter.district}
          </p>
        </div>

        <span className="shelter-status">
          {status}
        </span>

      </div>


      {/* =========================
          CAPACITY
      ========================= */}

      <div className="capacity-section">

        <div className="capacity-label">

          <span>
            Occupancy
          </span>

          <strong>
            {shelter.current_occupancy} / {shelter.capacity}
          </strong>

        </div>


        <div className="capacity-bar">

          <div
            className="capacity-fill"
            style={{
              width: `${Math.min(occupancy, 100)}%`
            }}
          />

        </div>


        <p>
          <strong>
            {shelter.available_capacity}
          </strong>{" "}
          spaces available
        </p>

      </div>


      {/* =========================
          RELIEF INFORMATION
      ========================= */}

      <div className="facility-section">

        <strong>
          Relief Information
        </strong>

        <p>
          📍 {shelter.address}
        </p>

        <p>
          👤 {shelter.contact_person}
        </p>

        <p>
          💼 {shelter.role}
        </p>

      </div>


      {/* =========================
          CONTACT
      ========================= */}

      <div className="facility-section">

        <strong>
          Contact
        </strong>

        <p>
          📞{" "}
          <a href={`tel:${shelter.phone}`}>
            {shelter.phone}
          </a>
        </p>

        <p>
          📞{" "}
          <a href={`tel:${shelter.alternate_phone}`}>
            {shelter.alternate_phone}
          </a>
        </p>

        <p>
          🚨 Emergency Helpline:{" "}
          <a href={`tel:${shelter.emergency_helpline}`}>
            {shelter.emergency_helpline}
          </a>
        </p>

        <p>
          ✉️{" "}
          <a href={`mailto:${shelter.email}`}>
            {shelter.email}
          </a>
        </p>

      </div>


      {/* =========================
          AVAILABILITY
      ========================= */}

      <div className="facility-section">

        <strong>
          Availability
        </strong>

        <p>
          {shelter.available_24x7
            ? "🟢 Available 24×7"
            : "🟠 Limited Hours"}
        </p>

      </div>


      {/* =========================
          FACILITIES
      ========================= */}

      <div className="facility-section">

        <strong>
          Facilities
        </strong>

        <p>
          {shelter.facilities}
        </p>

      </div>


      {/* =========================
          ACTIONS
      ========================= */}

      <div className="shelter-actions">

        <a
          href={`tel:${shelter.phone}`}
          className="shelter-action-btn"
        >
          📞 Call
        </a>

        <a
          href={`mailto:${shelter.email}`}
          className="shelter-action-btn"
        >
          ✉️ Email
        </a>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shelter-action-btn"
        >
          🗺️ Directions
        </a>

      </div>

    </div>
  );
}

export default Sheltercard;