import React from "react";
import AnimalCard from "../components/AnimalCard";
import animals from "../data/animals";

function AnimalRescue() {
  const needsRescue = animals.filter(
    (animal) => animal.status === "Needs Rescue"
  ).length;

  const inProgress = animals.filter(
    (animal) => animal.status === "In Progress"
  ).length;

  const rescued = animals.filter(
    (animal) => animal.status === "Rescued"
  ).length;

  return (
    <div className="animal-rescue-page mobile-page-shell">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="animal-hero">

        <div className="animal-hero-left">

          <div className="animal-hero-icon">
            🐾
          </div>

          <div>
            <h1>
              Animal Rescue
            </h1>

            <p>
              Monitor and manage flood-affected animals
              across monitored locations.
            </p>
          </div>

        </div>

        <div className="animal-monitoring">

          <span className="monitoring-dot"></span>

          Rescue Monitoring Active

        </div>

      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="animal-stats">

        <div className="animal-stat-card">

          <div className="animal-stat-icon total">
            🐾
          </div>

          <div className="animal-stat-content">

            <span>
              Total Locations
            </span>

            <strong>
              {animals.length}
            </strong>

            <small>
              Monitored locations
            </small>

          </div>

        </div>

        <div className="animal-stat-card">

          <div className="animal-stat-icon danger">
            🚨
          </div>

          <div className="animal-stat-content">

            <span>
              Needs Rescue
            </span>

            <strong>
              {needsRescue}
            </strong>

            <small>
              Immediate attention
            </small>

          </div>

        </div>

        <div className="animal-stat-card">

          <div className="animal-stat-icon progress">
            ⏳
          </div>

          <div className="animal-stat-content">

            <span>
              In Progress
            </span>

            <strong>
              {inProgress}
            </strong>

            <small>
              Rescue operations active
            </small>

          </div>

        </div>

        <div className="animal-stat-card">

          <div className="animal-stat-icon success">
            ✓
          </div>

          <div className="animal-stat-content">

            <span>
              Rescued
            </span>

            <strong>
              {rescued}
            </strong>

            <small>
              Successfully rescued
            </small>

          </div>

        </div>

      </div>

      {/* =========================
          LOCATION SECTION
      ========================= */}

      <div className="animal-location-header">

        <div>
          <h2>
            Animal Rescue Locations
          </h2>

          <p>
            Current flood-affected animal locations
          </p>
        </div>

        <div className="animal-location-count">
          {animals.length} Locations
        </div>

      </div>

      {/* =========================
          ANIMAL CARDS
      ========================= */}

      <div className="animal-cards-grid">

        {animals.map((animal, index) => (

          <AnimalCard
            key={`${animal.village}-${index}`}
            animal={animal}
          />

        ))}

      </div>

    </div>
  );
}

export default AnimalRescue;