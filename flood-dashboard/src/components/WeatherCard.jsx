import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/weather`);

        if (!response.ok) {
          throw new Error(`Weather API failed: ${response.status}`);
        }

        const data = await response.json();

        console.log("Weather data from backend:", data);

        setWeather(data);
      } catch (err) {
        console.error("Weather API error:", err);
        setError("Weather information unavailable");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  return (
    <div className="weather-card">

      {/* Header */}
      <div className="weather-header">
        <div>
          <h2>🌤️ Weather</h2>
          <p>Current weather conditions</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="weather-message">
          <span>⏳</span>
          Loading weather...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="weather-message">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Weather Data */}
      {!loading && !error && weather && (
        <div className="weather-content">

          {/* Main Weather */}
          <div className="weather-main">

            <span className="weather-icon">
              {weather.icon || "☀️"}
            </span>

            <div>
              <h1>
                {weather.temperature}°C
              </h1>

              <p>
                {weather.condition}
              </p>
            </div>

          </div>

          {/* Weather Details */}
          <div className="weather-details">

            {/* Humidity */}
            <div className="weather-detail">
              <span>💧</span>

              <div>
                <p>Humidity</p>

                <strong>
                  {weather.humidity}%
                </strong>
              </div>
            </div>

            {/* Wind */}
            <div className="weather-detail">
              <span>💨</span>

              <div>
                <p>Wind</p>

                <strong>
                  {weather.windSpeed} km/h
                </strong>
              </div>
            </div>

            {/* Rain */}
            <div className="weather-detail">
              <span>🌧️</span>

              <div>
                <p>Rain</p>

                <strong>
                  {weather.rainfall} mm
                </strong>
              </div>
            </div>

            {/* Location */}
            <div className="weather-detail">
              <span>📍</span>

              <div>
                <p>Location</p>

                <strong>
                  {weather.location}
                </strong>
              </div>
            </div>

          </div>

          {/* Weather Alert */}
          {weather.alert && (
            <div className="weather-alert">
              🚨 <strong>{weather.alert}</strong>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default WeatherCard;