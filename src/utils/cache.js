// cache.js
// Local Caching for Offline Mode (Member 5)

// Save data to localStorage
export function saveToCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log("Saved to cache:", key);
  } catch (err) {
    console.log("Cache save failed:", err);
  }
}

// Load data from localStorage
export function loadFromCache(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.log("Cache load failed:", err);
    return null;
  }
}

// Remove one key from cache
export function clearCache(key) {
  localStorage.removeItem(key);
}

// Clear all app cache
export function clearAllCache() {
  const keys = ["shelters", "villages", "animals", "alerts", "risk_data"];
  keys.forEach((key) => localStorage.removeItem(key));
  console.log("All cache cleared");
}

// Check if device is online
export function isOnline() {
  return navigator.onLine;
}

// Load data with offline support
// Tries network first, falls back to cache
export async function loadWithCache(key, fetchUrl) {
  if (isOnline()) {
    try {
      const res = await fetch(fetchUrl);
      if (res.ok) {
        const data = await res.json();
        saveToCache(key, data);
        return data;
      }
    } catch (err) {
      console.log("Network failed, using cache for:", key);
    }
  }

  // Offline or network failed → use cache
  const cached = loadFromCache(key);
  if (cached) {
    console.log("Loaded from cache:", key);
    return cached;
  }

  console.log("No cache found for:", key);
  return null;
}
