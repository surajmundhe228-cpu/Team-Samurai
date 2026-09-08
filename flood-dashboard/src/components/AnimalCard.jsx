import React from "react";

function AnimalCard({ animal }) {
  const statusClass = animal.status
    .toLowerCase()
    .replace(/\s+/g, "-");

  let animalIcon = "🐄";

  if (animal.animal_type.toLowerCase().includes("buffalo")) {
    animalIcon = "🐃";
  }

  if (animal.animal_type.toLowerCase().includes("goat")) {
    animalIcon = "🐐";
  }

  if (animal.animal_type.toLowerCase().includes("sheep")) {
    animalIcon = "🐑";
  }

  if (animal.animal_type.toLowerCase().includes("poultry")) {
    animalIcon = "🐔";
  }

  return (
    <article className="animal-rescue-card">

      {/* =========================
          CARD TOP
      ========================= */}

      <div className="animal-card-top">

        <div className="animal-card-title">

          <div
            className="animal-big-icon"
            aria-hidden="true"
          >
            {animalIcon}
          </div>

          <div className="animal-card-heading">

            <h3>
              {animal.village}
            </h3>

            <p>
              {animal.animal_type}
            </p>

          </div>

        </div>


        {/* STATUS */}

        <span
          className={`animal-status-badge ${statusClass}`}
        >
          {animal.status}
        </span>

      </div>


      {/* =========================
          AFFECTED ANIMALS
      ========================= */}

      <div className="animal-affected-box">

        <div
          className="affected-icon"
          aria-hidden="true"
        >
          🐾
        </div>

        <div className="animal-affected-content">

          <span>
            Estimated Affected
          </span>

          <strong>
            {animal.estimated_affected}
          </strong>

        </div>

      </div>


      {/* =========================
          LOCATION
      ========================= */}

      <div className="animal-detail">

        <div
          className="animal-detail-icon"
          aria-hidden="true"
        >
          📍
        </div>

        <div className="animal-detail-content">

          <span>
            Location
          </span>

          <p>
            {animal.location}
          </p>

        </div>

      </div>


      {/* =========================
          COORDINATES
      ========================= */}

      <div className="animal-card-footer">

        <div className="animal-coordinate">

          <span>
            Latitude
          </span>

          <strong>
            {animal.latitude}
          </strong>

        </div>

        <div className="animal-coordinate">

          <span>
            Longitude
          </span>

          <strong>
            {animal.longitude}
          </strong>

        </div>

      </div>

    </article>
  );
}

export default AnimalCard;