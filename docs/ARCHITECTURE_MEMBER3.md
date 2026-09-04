# RELOC8 — System Architecture & Dual-Use Workflow

## 1. High-level architecture

```text
┌─────────────────┐     REST API      ┌──────────────────────┐
│  React + Vite   │ ←──────────────→  │  FastAPI (backend)   │
│  Map / Forms    │                   │  main.py             │
│  Live Feed      │                   │  shelter_allocator   │
│  Notifications  │                   │  alert_system        │
└─────────────────┘                   └──────────────────────┘
         │                                      │
         │ localStorage cache                   │ JSON datab/
         ▼                                      ▼
   Offline reports                        villages / shelters
   Sync when online                       alerts / reports_db
```

## 2. Automated alert flow (Task 3)

```text
Incoming data (risk_level / water_level / hazard report)
                    │
                    ▼
         check_threshold()  in alert_system.py
                    │
        ┌───────────┴───────────┐
        │ risk CRITICAL or HIGH │
        │ or water_level >= 2.5m│
        └───────────┬───────────┘
                    │ yes
                    ▼
         Create alert_object (alert: true)
                    │
                    ▼
         Store in live_alerts_db
                    │
                    ▼
    GET /api/notifications  →  Frontend pop-up / bell
```

## 3. Dual-use: Floods vs Mass gatherings (e.g. Kumbh Mela)

RELOC8 is designed so **the same pipeline** can switch domain by changing inputs and labels—not by rewriting the core.

### 3.1 Flood mode (default)

| Input | Threshold | Output action |
|-------|-----------|---------------|
| Rainfall, water level, terrain risk | HIGH / CRITICAL | Evacuate to shelters |
| Shelter capacity | Full → overflow | Secondary shelters |
| Citizen report | Stranded / animal distress | Rescue tasking |

### 3.2 Crowd / stampede-prevention mode

| Input | Threshold | Output action |
|-------|-----------|---------------|
| Crowd density, inflow rate, heat index | Density above safe limit | Close gate / open alternate exit |
| Holding area capacity | Full → overflow | Redirect to secondary grounds |
| Citizen report | Medical / blocked exit | Dispatch response team |

### 3.3 Shared workflow diagram

```text
              ┌──────────────────────┐
              │  Domain adapters     │
              │  (flood OR crowd)    │
              └──────────┬───────────┘
                         │ normalized event
                         ▼
              ┌──────────────────────┐
              │  Threshold Checker   │
              │  alert = f(severity)│
              └──────────┬───────────┘
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
     Notifications   Allocation    Live Map/Feed
     (pop-ups)       (shelters or  (shared COP)
                     exits)
```

**Principle:** One brain (threshold + allocation + notify), two faces (flood vs crowd).

## 4. Resilience notes

- Frontend `api.js` uses timeouts and `NETWORK_ERROR` / `TIMEOUT` codes.
- Offline reports queue in `syncQueue.js` and flush when online.
- Alerts can be polled from `/api/notifications` for near real-time UI updates.
