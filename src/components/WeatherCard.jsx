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

        console.log("Weather data from backend:", data);

        setWeather(data);
      } catch (err) {
        console.error("Weather API error:", err);

        setError(
          err?.message || "Weather information unavailable"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  /*
   * The backend may use slightly different field names.
   * Normalize them here so the UI remains compatible.
   */

  const temperature =
    weather?.temperature ??
    weather?.temperature_c ??
    weather?.temp ??
    weather?.temp_c ??
    weather?.current_temperature ??
    null;

  const humidity =
    weather?.humidity ??
    weather?.humidity_percent ??
    weather?.humidity_percentage ??
    null;

  const windSpeed =
    weather?.windSpeed ??
    weather?.wind_speed ??
    weather?.wind_kmh ??
    weather?.wind_speed_kmh ??
    weather?.wind ??
    null;

  const rainfall =
    weather?.rainfall ??
    weather?.rainfall_mm ??
    weather?.rain ??
    weather?.rain_mm ??
    null;

  const condition =
    weather?.condition ??
    weather?.weather_condition ??
    weather?.description ??
    weather?.status ??
    (rainfall !== null && Number(rainfall) >= 75
      ? "Heavy Rainfall"
      : "Current conditions");

  const location =
    weather?.location ??
    weather?.area ??
    weather?.region ??
    "Supaul & Madhepura monitored areas";

  const icon =
    weather?.icon ??
    (Number(rainfall) >= 75 ? "🌧️" : "🌤️");

  const maxRainfall =
  weather?.maximum_rainfall_mm ??
  weather?.max_rainfall ??
  weather?.maximum_rainfall ??
  weather?.max_recorded_rainfall ??
  weather?.highest_rainfall ??
  rainfall;

  return (
    <section className="weather-card">

      {/* ==============================
          HEADER
      ============================== */}

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


      {/* ==============================
          LOADING
      ============================== */}

      {loading && (
        <div className="weather-message weather-loading">

          <span className="weather-message-icon">
            ⏳
          </span>

          <div>
            <strong>Loading weather</strong>
            <p>
              Fetching latest conditions...
            </p>
          </div>

        </div>
      )}


      {/* ==============================
          ERROR
      ============================== */}

      {!loading && error && (

        <div className="weather-message weather-error">

          <span className="weather-message-icon">
            ⚠️
          </span>

          <div>
            <strong>
              Weather unavailable
            </strong>

            <p>{error}</p>
          </div>

        </div>
      )}


      {/* ==============================
          WEATHER DATA
      ============================== */}

      {!loading && !error && weather && (

        <div className="weather-content">

          {/* ============================
              MAIN WEATHER
          ============================ */}

          <div className="weather-main">

            <div className="weather-main-icon">
              {icon}
            </div>

            <div className="weather-temperature">

              <h1>
                {temperature !== null
                  ? temperature
                  : "N/A"}

                {temperature !== null && (
                  <span>°C</span>
                )}
              </h1>

              <p>
                {condition}
              </p>

            </div>

          </div>


          {/* ============================
              WEATHER DETAILS
          ============================ */}

          <div className="weather-details">

            {/* HUMIDITY */}

            <div className="weather-detail">

              <div className="weather-detail-icon humidity">
                💧
              </div>

              <div>
                <p>Humidity</p>

                <strong>
                  {humidity !== null
                    ? `${humidity}%`
                    : "Not available"}
                </strong>
              </div>

            </div>


            {/* WIND */}

            <div className="weather-detail">

              <div className="weather-detail-icon wind">
                💨
              </div>

              <div>
                <p>Wind</p>

                <strong>
                  {windSpeed !== null
                    ? `${windSpeed} km/h`
                    : "Not available"}
                </strong>
              </div>

            </div>


            {/* RAINFALL */}

            <div className="weather-detail">

              <div className="weather-detail-icon rain">
                🌧️
              </div>

              <div>
                <p>Rainfall</p>

                <strong>
                  {rainfall !== null
                    ? `${rainfall} mm`
                    : "Not available"}
                </strong>
              </div>

            </div>


            {/* LOCATION */}

            <div className="weather-detail">

              <div className="weather-detail-icon location">
                📍
              </div>

              <div>
                <p>Location</p>

                <strong>
                  {location}
                </strong>
              </div>

            </div>

          </div>


          {/* ============================
              WEATHER ALERT
          ============================ */}

          {(weather.alert || Number(rainfall) >= 100) && (

            <div className="weather-alert">

              <span className="weather-alert-icon">
                🚨
              </span>

              <div>

                <strong>
                  Weather Alert
                </strong>

                <p>
                  {weather.alert ||
                    `Heavy rainfall detected in the monitored area. Recorded rainfall has reached ${rainfall} mm.`}
                </p>

              </div>

            </div>

          )}


          {/* ============================
              MAXIMUM RECORDED RAINFALL
          ============================ */}

          {maxRainfall !== null && (

            <div className="weather-alert">

              <span className="weather-alert-icon">
                🌧️
              </span>

              <div>

                <strong>
                  Maximum Recorded Rainfall
                </strong>

                <p>
                  {maxRainfall} mm
                </p>

              </div>

            </div>

          )}

        </div>

      )}

    </section>
  );
}

export default WeatherCard;