import React, { useEffect, useState } from "react";
import { getWeather } from "../services/api";

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        setError("");

        const data = await getWeather();

        console.log(
          "Weather data from backend:",
          data
        );

        setWeather(data);
      } catch (err) {
        console.error(
          "Weather API error:",
          err
        );

        setError(
          err?.message ||
            "Weather information unavailable"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  return (
    <section className="weather-card">

      {/* Header */}
      <div className="weather-header">
        <div className="weather-title">
          <div className="weather-title-icon">
            🌤️
          </div>

          <div>
            <h2>Weather</h2>
            <p>Current weather conditions</p>
          </div>
        </div>

        <span className="weather-live-badge">
          <span className="weather-live-dot"></span>
          LIVE
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="weather-message weather-loading">
          <span className="weather-message-icon">
            ⏳
          </span>

          <div>
            <strong>Loading weather</strong>
            <p>Fetching latest conditions...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="weather-message weather-error">
          <span className="weather-message-icon">
            ⚠️
          </span>

          <div>
            <strong>Weather unavailable</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Weather Data */}
      {!loading && !error && weather && (
        <div className="weather-content">

          {/* Main Weather */}
          <div className="weather-main">

            <div className="weather-main-icon">
              {weather.icon || "☀️"}
            </div>

            <div className="weather-temperature">
              <h1>
                {weather.temperature ?? "--"}
                <span>°C</span>
              </h1>

              <p>
                {weather.condition || "Unknown"}
              </p>
            </div>

          </div>

          {/* Weather Details */}
          <div className="weather-details">

            {/* Humidity */}
            <div className="weather-detail">
              <div className="weather-detail-icon humidity">
                💧
              </div>

              <div>
                <p>Humidity</p>
                <strong>
                  {weather.humidity ?? "--"}%
                </strong>
              </div>
            </div>

            {/* Wind */}
            <div className="weather-detail">
              <div className="weather-detail-icon wind">
                💨
              </div>

              <div>
                <p>Wind</p>
                <strong>
                  {weather.windSpeed ?? "--"} km/h
                </strong>
              </div>
            </div>

            {/* Rain */}
            <div className="weather-detail">
              <div className="weather-detail-icon rain">
                🌧️
              </div>

              <div>
                <p>Rain</p>
                <strong>
                  {weather.rainfall ?? "--"} mm
                </strong>
              </div>
            </div>

            {/* Location */}
            <div className="weather-detail">
              <div className="weather-detail-icon location">
                📍
              </div>

              <div>
                <p>Location</p>
                <strong>
                  {weather.location ||
                    "Supaul, Bihar"}
                </strong>
              </div>
            </div>

          </div>

          {/* Weather Alert */}
          {weather.alert && (
            <div className="weather-alert">
              <span className="weather-alert-icon">
                🚨
              </span>

              <div>
                <strong>Weather Alert</strong>
                <p>{weather.alert}</p>
              </div>
            </div>
          )}

        </div>
      )}

    </section>
  );
}

export default WeatherCard;