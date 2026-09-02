import React from "react";

function MapView({ villages = [], shelters = [] }) {

  return (
    <div className="map-container">

      <div className="map-overlay">

        <h3>Flood Risk Map</h3>

        <p>
          Villages: {villages.length}
        </p>

        <p>
          Shelters: {shelters.length}
        </p>

      </div>

      <div className="map-placeholder">

        <span>🗺️</span>

        <h3>Interactive Flood Map</h3>

        <p>
          Village and shelter locations will appear here.
        </p>

      </div>

    </div>
  );
}

export default MapView;