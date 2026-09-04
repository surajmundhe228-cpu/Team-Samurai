// ========================================
// RELOC8 OFFLINE STORAGE
// ========================================


// Check internet connection
export function isOnline() {
  return navigator.onLine;
}


// ========================================
// SAVE DATA
// ========================================

export function saveOfflineData(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

    console.log(
      `Offline data saved: ${key}`
    );

  } catch (error) {

    console.error(
      "Failed to save offline data:",
      error
    );

  }
}


// ========================================
// GET DATA
// ========================================

export function getOfflineData(key) {
  try {

    const data =
      localStorage.getItem(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);

  } catch (error) {

    console.error(
      "Failed to read offline data:",
      error
    );

    return null;
  }
}


// ========================================
// DELETE DATA
// ========================================

export function removeOfflineData(key) {

  try {

    localStorage.removeItem(key);

    console.log(
      `Offline data removed: ${key}`
    );

  } catch (error) {

    console.error(
      "Failed to remove offline data:",
      error
    );

  }
}


// ========================================
// OFFLINE SYNC
// ========================================

export function setupOfflineSync(callback) {

  function handleOnline() {

    console.log(
      "Internet restored. Syncing Reloc8 data..."
    );

    if (callback) {
      callback();
    }

  }

  window.addEventListener(
    "online",
    handleOnline
  );

  return () => {

    window.removeEventListener(
      "online",
      handleOnline
    );

  };
}