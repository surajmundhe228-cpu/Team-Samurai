# RELOC8 System Architecture

## 1. Project Overview

RELOC8 is a disaster decision-support platform designed to help authorities and citizens during flood and disaster situations.

The system combines:

- Disaster and hazard information
- Village/habitation data
- Safe shelter information
- Animal rescue information
- Risk assessment
- Shelter allocation
- Incident reporting
- Map-based visualization
- Offline data caching and synchronization

The platform provides a map-based interface where users can understand affected areas, identify shelters, view animal rescue reports, and report incidents.

---

# 2. Technology Stack

## Frontend

- React
- Vite
- JavaScript / JSX
- CSS
- Leaflet / React Leaflet for maps

## Backend

- Python
- FastAPI
- Uvicorn

## Data

The current system uses JSON-based datasets for:

- Villages / habitations
- Shelters
- Animal reports

## Development Tools

- Git
- GitHub
- Postman
- Visual Studio Code

## Deployment

- Frontend: Vercel
- Backend: Render

---

# 3. High-Level Architecture

```mermaid
flowchart TD

    USER[Citizen / Authority]

    FRONTEND[React + Vite Frontend]

    MAP[Interactive Map]
    REPORT[Incident Reporting]
    NOTIFY[Notifications]
    CACHE[Offline Cache]
    QUEUE[Offline Sync Queue]

    API[FastAPI Backend]

    VILLAGES[Villages Data]
    SHELTERS[Shelters Data]
    ANIMALS[Animal Reports Data]
    ALLOCATOR[Shelter Allocation Engine]
    RISK[Risk Assessment]
    REPORTAPI[Incident Reports API]

    RENDER[Render Backend]
    VERCEL[Vercel Frontend]

    USER --> FRONTEND

    FRONTEND --> MAP
    FRONTEND --> REPORT
    FRONTEND --> NOTIFY

    FRONTEND --> API

    FRONTEND --> CACHE
    FRONTEND --> QUEUE

    API --> VILLAGES
    API --> SHELTERS
    API --> ANIMALS
    API --> ALLOCATOR
    API --> RISK
    API --> REPORTAPI

    FRONTEND -. deployed on .-> VERCEL
    API -. deployed on .-> RENDER