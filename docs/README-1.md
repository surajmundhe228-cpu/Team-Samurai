# RELOC8 — Disaster Decision-Support & Relocation Platform

RELOC8 helps authorities and citizens during floods and large public gatherings by combining **risk assessment**, **shelter allocation**, **incident reporting**, **alerts**, and **offline sync**.

Primary pilot context: **2008 Kosi belt (Supaul & Madhepura, Bihar)**.

---

## Features

- Interactive disaster map (villages, shelters, risk zones)
- Rule-based risk & vulnerability scoring
- Shelter capacity checks + overflow to secondary shelters
- Citizen incident reporting + live feed
- Automated alerts when risk is HIGH / CRITICAL
- Animal / livestock distress reporting
- Offline cache + sync-when-online queue
- Citizen view and Authority view
- REST APIs (FastAPI)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, JavaScript, Leaflet |
| Backend | Python, FastAPI, Uvicorn |
| Data | JSON (villages, shelters, animals, alerts) |
| Deploy | Frontend → Vercel/Netlify · Backend → Render |

---

## Project Structure

```text
Team-Samurai/
├── backend/
│   ├── main.py                 # FastAPI app & endpoints
│   ├── shelter_allocator.py    # Distance + capacity overflow
│   ├── alert_system.py         # Threshold checker (Member 3)
│   ├── validate_data.py
│   ├── requirements.txt
│   └── datab/
│       ├── villages.json
│       ├── shelters.json
│       └── alerts_data.json
├── src/
│   ├── components/             # Map, Report modal, Feed, etc.
│   ├── services/api.js         # Frontend API client
│   ├── utils/                  # cache.js, syncQueue.js, normalize.js
│   ├── data/                   # Frontend JSON samples
│   ├── App.jsx
│   └── main.jsx
├── docs/
│   └── ARCHITECTURE.md         # Dual-use workflow
├── package.json
└── README.md
```

---

## Local Setup

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend

```bash
npm install
npm run dev
```

App: http://localhost:5173

Optional `.env` (frontend):

```env
VITE_API_URL=http://localhost:8000
```

---

## Main API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/villages` | Village list |
| GET | `/shelters` | Shelter list |
| GET | `/animals` | Animal reports |
| GET | `/hazards` | Hazard summary |
| GET | `/risk` | Highest risk snapshot |
| GET | `/api/relocation-plan` | Shelter allocation plan |
| GET | `/api/reports` | Incident reports list |
| POST | `/api/reports` | Submit incident report |
| GET | `/api/notifications` | Alerts for UI pop-ups |
| POST | `/api/notifications` | Create notification |
| POST | `/api/alerts/check` | Threshold checker (single input) |
| POST | `/api/alerts/scan-villages` | Scan all villages → generate alerts |
| GET | `/api/xai-risk/{village}` | Explainable risk breakdown |

---

## Automated Alert System (Member 3)

1. **Threshold checker** (`alert_system.py`)  
   - Input: risk level / score / water level  
   - If **CRITICAL** or **HIGH** → `alert: true` + alert object  

2. **Notifications API**  
   - `GET /api/notifications` → frontend polls for pop-ups  
   - `POST /api/alerts/check` → run checker on one reading  
   - `POST /api/alerts/scan-villages` → simulated background scan  

---

## Dual-Use Workflow (Floods → Crowd Safety)

The same architecture supports **natural disasters** and **mass gatherings** (e.g. Kumbh Mela):

| Module | Flood mode | Crowd / stampede mode |
|--------|------------|------------------------|
| Risk input | Water level, rainfall, terrain | Crowd density, gate inflow, heat |
| Threshold | Risk HIGH/CRITICAL | Density above safe limit |
| Alert | Flood / evacuation warning | Stampede risk / route closure |
| Allocation | Shelter capacity overflow | Exit routes / holding areas |
| Citizen report | Stranded people / animals | Medical emergency / blocked exit |
| Map | Flood zones + shelters | Dense zones + exits |

**Workflow shift (concept):**

```text
Sensors / Reports
      ↓
Threshold Checker  →  alert flag if above limit
      ↓
Notifications API  →  pop-up to Authority + Citizens
      ↓
Decision modules   →  relocation OR crowd rerouting
      ↓
Map + Live feed    →  shared operational picture
```

See `docs/ARCHITECTURE.md` for the diagram-style write-up.

---

## License / Team

Built for Smart India Hackathon style disaster-support use cases.  
Team Samurai — RELOC8
