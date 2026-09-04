# RELOC8

## Disaster Decision-Support and Relocation Platform

RELOC8 is a disaster management and decision-support platform designed to help users understand disaster risks, locate safe shelters, report incidents, and support relocation planning.

The platform combines an interactive map, disaster-related data, shelter information, animal rescue information, incident reporting, and backend decision-support APIs.

---

## Features

- Interactive disaster map
- Village and habitation information
- Safe shelter locations
- Shelter capacity and allocation
- Disaster hazard information
- Risk information
- Animal rescue reports
- Disaster notifications
- Field incident reporting
- Relocation planning
- Citizen and Authority views
- Offline cache and synchronization support
- REST APIs using FastAPI

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Leaflet / interactive maps

### Backend

- Python
- FastAPI
- Uvicorn

### Data

- JSON-based village data
- JSON-based shelter data
- JSON-based animal data

### Deployment

- Frontend: Vercel
- Backend: Render

---

## Project Structure

```text
RELOC8/
│
├── backend/
│   ├── main.py
│   ├── shelter_allocator.py
│   ├── validate_data.py
│   ├── requirements.txt
│   └── datab/
│       ├── villages.json
│       └── shelters.json
│
├── docs/
│   ├── API.md
│   └── ARCHITECTURE.md
│
├── src/
│   ├── components/
│   │   ├── Map.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── ReportIncidentModal.jsx
│   │   └── VillageDetailCard.jsx
│   │
│   ├── utils/
│   │   ├── cache.js
│   │   └── syncQueue.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── public/
├── package.json
├── README.md
└── .gitignore