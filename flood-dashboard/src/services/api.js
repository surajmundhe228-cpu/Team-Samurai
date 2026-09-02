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
  const response = await fetch(`${API_URL}/api/dashboard`);
  return await handleResponse(response);
}


// ================================
// HEALTH CHECK
// ================================

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`);
  return await handleResponse(response);
}


// ================================
// WEATHER
// ================================

export async function getWeather() {
  const response = await fetch(`${API_URL}/api/weather`);
  return await handleResponse(response);
}


// ================================
// SHELTERS
// ================================

export async function getShelters() {
  const response = await fetch(`${API_URL}/api/shelters`);
  return await handleResponse(response);
}


// ================================
// RISK ASSESSMENT
// ================================

export async function calculateRisk(villages) {
  if (!Array.isArray(villages)) {
    throw new Error("Risk calculation requires a village array.");
  }

  const response = await fetch(`${API_URL}/risk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      villages: villages,
    }),
  });

  return await handleResponse(response);
}


// ================================
// EVACUATION PLAN
// ================================

export async function createEvacuationPlan(villages, shelters) {
  if (!Array.isArray(villages)) {
    throw new Error("Evacuation plan requires a village array.");
  }

  if (!Array.isArray(shelters)) {
    throw new Error("Evacuation plan requires a shelter array.");
  }

  const response = await fetch(`${API_URL}/evacuation-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      villages: villages,
      shelters: shelters,
    }),
  });

  return await handleResponse(response);
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