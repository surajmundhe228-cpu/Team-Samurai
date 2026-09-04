// syncQueue.js
// Online Sync Queue for offline-created reports (Member 5)

const QUEUE_KEY = "sync_queue";

// Internal helpers
function saveQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

function loadQueue() {
  try {
    const data = localStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Add a report to offline queue
export function addToSyncQueue(report) {
  const queue = loadQueue();
  queue.push({
    ...report,
    id: Date.now(),
    synced: false,
    createdAt: new Date().toISOString()
  });
  saveQueue(queue);
  console.log("Report saved to offline queue");
  return true;
}

// Get all pending (not yet synced) reports
export function getPendingReports() {
  const queue = loadQueue();
  return queue.filter((r) => !r.synced);
}

// Sync all pending reports to server
export async function syncOfflineReports(apiUrl = "/api/reports") {
  const queue = loadQueue();
  const pending = queue.filter((r) => !r.synced);

  if (pending.length === 0) {
    console.log("No offline reports to sync");
    return { synced: 0, failed: 0 };
  }

  let synced = 0;
  let failed = 0;

  for (let report of queue) {
    if (report.synced) continue;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report)
      });

      if (res.ok) {
        report.synced = true;
        synced += 1;
        console.log("Synced report:", report.id);
      } else {
        failed += 1;
      }
    } catch {
      failed += 1;
      console.log("Sync failed, will retry later");
    }
  }

  saveQueue(queue);
  return { synced, failed };
}

// Start auto-sync when internet comes back
export function startAutoSync(apiUrl = "/api/reports") {
  window.addEventListener("online", () => {
    console.log("Internet back → syncing offline reports...");
    syncOfflineReports(apiUrl);
  });

  // Also try once on load if online
  if (navigator.onLine) {
    syncOfflineReports(apiUrl);
  }
}

// Clear already synced reports from queue
export function clearSyncedReports() {
  const queue = loadQueue();
  const remaining = queue.filter((r) => !r.synced);
  saveQueue(remaining);
  console.log("Cleared synced reports");
}
