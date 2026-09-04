# Member 5 — E2E Integration & API Resilience

## Files

1. src/services/api.js     → NEW (main API client)
2. src/utils/normalize.js  → NEW (risk + number helpers)

## What this solves

| Task | How |
|------|-----|
| Frontend ↔ Backend integration | All calls go through api.js |
| Risk normalization | CRITICAL / HIGH / MEDIUM / LOW only |
| Safe number parsing | capacity, population never become NaN |
| Latency / disconnect handling | Timeout + NETWORK_ERROR + TIMEOUT codes |

## How to use in components

```javascript
import api from "../services/api";

// Load shelters (normalized)
const shelters = await api.getShelters();

// Load villages with safe risk levels
const villages = await api.getVillages();

// Submit report
await api.submitReport({
  type: "Disaster Alert",
  village: "Rampur",
  affectedCount: 25,
  description: "Water rising"
});

// Health check
const health = await api.healthCheck();
if (!health.ok) {
  console.log("Backend down:", health.error);
}
```

## Error codes you can handle in UI

- TIMEOUT → show "Server is slow, try again"
- NETWORK_ERROR → show "Offline / backend not running"
- HTTP_ERROR → show status message

## Test checklist

1. Start backend: uvicorn backend.main:app --reload --port 8000
2. Start frontend: npm run dev
3. In browser console:
   - (await import('/src/services/api.js')).default.healthCheck()
   - (await import('/src/services/api.js')).default.getShelters()
4. Stop backend → healthCheck should return ok:false with NETWORK_ERROR
5. Confirm risk_level values are only CRITICAL|HIGH|MEDIUM|LOW
