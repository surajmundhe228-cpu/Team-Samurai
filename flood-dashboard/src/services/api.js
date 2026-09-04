// ================================
// API CONFIGURATION
// ================================

// Local development:
// http://127.0.0.1:8000
//
// Render production:
// Set VITE_API_URL in Render Environment Variables

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

console.log("API URL:", API_URL);


// ================================
// OFFLINE STORAGE
// ================================

import {
  saveOfflineData,
  getOfflineData,
} from "./offline";


// ================================
// RESPONSE HANDLER
// ================================

async function handleResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.detail ||
      `Backend error: ${response.status}`;

    throw new Error(message);
  }

  return data;
}


// ================================
// DASHBOARD
// ================================

export async function getDashboardData() {
  try {
    const response = await fetch(
      `${API_URL}/api/dashboard`
    );

    const data = await handleResponse(response);

    // Save latest successful data
    saveOfflineData(
      "reloc8_dashboard",
      data
    );

    return data;

  } catch (error) {

    console.warn(
      "Backend unavailable. Using offline dashboard data."
    );

    // Get saved dashboard data
    const cached =
      getOfflineData("reloc8_dashboard");

    if (cached) {
      return cached;
    }

    // No cached data available
    throw error;
  }
}


// ================================
// HEALTH CHECK
// ================================

export async function getHealth() {
  try {
    const response = await fetch(
      `${API_URL}/health`
    );

    return await handleResponse(response);

  } catch (error) {

    console.warn(
      "Backend health check failed."
    );

    throw error;
  }
}


// ================================
// WEATHER
// ================================

export async function getWeather() {
  try {
    const response = await fetch(
      `${API_URL}/api/weather`
    );

    const data =
      await handleResponse(response);

    // Save latest successful weather
    saveOfflineData(
      "reloc8_weather",
      data
    );

    return data;

  } catch (error) {

    console.warn(
      "Weather unavailable. Using cached weather."
    );

    const cached =
      getOfflineData("reloc8_weather");

    if (cached) {
      return cached;
    }

    throw error;
  }
}


// ================================
// SHELTERS
// ================================

export async function getShelters() {
  try {
    const response = await fetch(
      `${API_URL}/api/shelters`
    );

    const data =
      await handleResponse(response);

    // Save latest successful shelter data
    saveOfflineData(
      "reloc8_shelters",
      data
    );

    return data;

  } catch (error) {

    console.warn(
      "Shelters unavailable. Using cached shelter data."
    );

    const cached =
      getOfflineData("reloc8_shelters");

    if (cached) {
      return cached;
    }

    throw error;
  }
}


// ================================
// RISK ASSESSMENT
// ================================

export async function calculateRisk(villages) {

  if (!Array.isArray(villages)) {
    throw new Error(
      "Risk calculation requires a village array."
    );
  }

  try {

    const response = await fetch(
      `${API_URL}/risk`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          villages: villages,
        }),
      }
    );

    const data =
      await handleResponse(response);

    // Save latest successful risk data
    saveOfflineData(
      "reloc8_risk",
      data
    );

    return data;

  } catch (error) {

    console.warn(
      "Risk API unavailable. Using cached risk data."
    );

    const cached =
      getOfflineData("reloc8_risk");

    if (cached) {
      return cached;
    }

    throw error;
  }
}


// ================================
// EVACUATION PLAN
// ================================

export async function createEvacuationPlan(
  villages,
  shelters
) {

  if (!Array.isArray(villages)) {
    throw new Error(
      "Evacuation plan requires a village array."
    );
  }

  if (!Array.isArray(shelters)) {
    throw new Error(
      "Evacuation plan requires a shelter array."
    );
  }

  try {

    const response = await fetch(
      `${API_URL}/evacuation-plan`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          villages: villages,
          shelters: shelters,
        }),
      }
    );

    const data =
      await handleResponse(response);

    // Save latest successful evacuation plan
    saveOfflineData(
      "reloc8_evacuation_plan",
      data
    );

    return data;

  } catch (error) {

    console.warn(
      "Evacuation API unavailable. Using cached plan."
    );

    const cached =
      getOfflineData(
        "reloc8_evacuation_plan"
      );

    if (cached) {
      return cached;
    }

    throw error;
  }
}


// ================================
// DEFAULT API OBJECT
// ================================

const api = {
  getDashboardData,
  getHealth,
  getWeather,
  getShelters,
  calculateRisk,
  createEvacuationPlan,
};

export default api;