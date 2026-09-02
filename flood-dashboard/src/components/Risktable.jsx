import React from "react";

function RiskTable({ villages }) {

  return (
    <div className="table-container">

      <table>

        <thead>
          <tr>
            <th>Village</th>
            <th>District</th>
            <th>Population</th>
            <th>Rainfall</th>
            <th>Hazard</th>
            <th>Vulnerability</th>
            <th>Exposure</th>
            <th>Risk Score</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {villages.map((village) => (

            <tr key={village.village}>

              <td>
                <strong>{village.village}</strong>
              </td>

              <td>{village.district}</td>

              <td>{village.population}</td>

              <td>{village.rainfall_mm} mm</td>

              <td>{village.hazard_score}</td>

              <td>{village.vulnerability_score}</td>

              <td>{village.exposure_score}</td>

              <td>
                <strong>{village.risk_score}</strong>
              </td>

              <td>
                <span
                  className={`risk-badge ${village.risk_level.toLowerCase()}`}
                >
                  {village.risk_level}
                </span>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default RiskTable;