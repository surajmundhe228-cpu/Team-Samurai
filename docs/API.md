# RELOC8 API Documentation

## Backend URLs

### Local
http://127.0.0.1:8000

### Production
https://reloc8-backend.onrender.com

---

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | Check whether the backend is running |
| `/villages` | GET | Retrieve village/habitation data |
| `/shelters` | GET | Retrieve safe shelter data |
| `/animals` | GET | Retrieve animal rescue/report data |
| `/hazards` | GET | Retrieve hazard information |
| `/risk` | GET | Retrieve risk information |
| `/api/notifications` | GET | Retrieve disaster notifications |
| `/api/reports` | POST | Submit a field incident report |
| `/api/relocation-plan` | POST | Generate a relocation/shelter plan |

---

## 1. Health Check

### GET `/`

Checks whether the RELOC8 backend is running.

Example response:

```json
{
  "message": "RELOC8 Backend is running"
}

---

## 2. Villages

### GET `/villages`

Returns village and habitation information used by the RELOC8 application.

The frontend uses this data to display villages and their locations on the map.

---

## 3. Shelters

### GET `/shelters`

Returns information about available safe shelters.

The shelter data includes:

- Shelter location
- Shelter capacity
- Available space

This information is used for relocation and shelter allocation.

---

## 4. Animals

### GET `/animals`

Returns animal rescue and animal-related disaster information.

The frontend uses this information to display animal-related markers on the map.

---

## 5. Hazards

### GET `/hazards`

Returns hazard and disaster-related information.

This information helps the application display dangerous or affected areas.

---

## 6. Risk

### GET `/risk`

Returns risk-related information used by the disaster assessment system.

---

## 7. Notifications

### GET `/api/notifications`

Returns disaster notifications and alerts displayed by the frontend.

---

## 8. Incident Reports

### POST `/api/reports`

Allows a citizen or authority to submit a field incident report.

Example request:

```json
{
  "type": "Disaster Alert",
  "village": "Sample Village",
  "affectedCount": 50,
  "description": "Flood water level is increasing near the village."
}