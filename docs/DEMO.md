# RELOC8 Demo Guide

## 1. Demo Objective

The RELOC8 demo demonstrates how the platform supports disaster monitoring, incident reporting, risk assessment, shelter identification, and relocation planning.

The demonstration covers both the user interface and backend APIs.

---

# 2. Demo Flow

The recommended demonstration order is:

1. Open the RELOC8 application
2. Show the disaster map
3. Explain map indicators
4. Show village and habitation information
5. Show safe shelters
6. Show animal rescue reports
7. Demonstrate incident reporting
8. Demonstrate relocation planning
9. Explain risk assessment
10. Show the deployed application
11. Show backend API documentation

---

# 3. Step 1 — Open RELOC8

Open the deployed frontend:

https://team-samurai-murex.vercel.app

The RELOC8 dashboard should load with the interactive disaster map.

### Explain

"RELOC8 is a disaster decision-support platform that combines geographic information, disaster reports, shelters, and risk-related information in one interface."

---

# 4. Step 2 — Demonstrate the Disaster Map

The main screen contains an interactive map.

The map displays different types of information using markers and indicators.

### Map Information

The application displays:

- Habitations
- Safe shelters
- Animal rescue reports
- Disaster or incident reports

### Explain

"The map gives authorities a quick visual overview of affected locations, available shelters, and other disaster-related information."

---

# 5. Step 3 — Demonstrate Map Filters

Use the district filter and map indicators to control the information displayed on the map.

The available categories include:

- Habitations
- Safe Shelters
- Animal Reports

### Explain

"These filters allow the user to focus on the information that is important for the current disaster situation."

---

# 6. Step 4 — Demonstrate Villages

Show the habitation/village markers on the map.

Village information is provided by the backend through:

```text
GET /villages
### Explain

"Village data helps the system identify affected habitations and provides geographic context for disaster response."

---

# 5. Step 5 — Demonstrate Safe Shelters

Show the shelter markers on the map.

Shelter information is provided through:

```text
GET /shelters
The shelter allocation system considers:

- Shelter capacity
- Affected population
- Geographic distance
- Available shelter space

### Explain

"RELOC8 can use available shelter information to support relocation decisions for affected populations."

---

# 8. Step 6 - Demonstrate Animal Rescue Reports

Show the animal-related markers on the map.

Animal information is provided through:

```text
GET /animals
### Explain

"The system also includes animal rescue information so that animal-related incidents are visible as part of the disaster response picture."

---
# 9. Step 7 — Demonstrate Incident Reporting

Use the **+ Report Incident** button on the RELOC8 dashboard.

Fill in the incident details:

- Type
- Village
- Affected population
- Description

Submit the report.

The report is sent to the backend through:

```text
POST /api/reports
# 10. Step 8 — Demonstrate Relocation Planning

The relocation planning feature helps identify suitable shelters for affected populations.

The backend provides the relocation plan through:

```text
POST /api/relocation-plan
# 11. Step 9 — Explain Risk Assessment

RELOC8 provides risk-related information through the backend.

The risk information is available through:

```text
GET /risk
# 12. Step 10 — Demonstrate the Deployed Application

Open the deployed RELOC8 frontend:

https://team-samurai-murex.vercel.app

The application is hosted on Vercel.

The backend is deployed on Render:

https://reloc8-backend.onrender.com

### Explain

"The frontend is deployed on Vercel and communicates with the FastAPI backend deployed on Render. This allows RELOC8 to be accessed as a live web application."

---
# 13. Step 11 — Demonstrate Backend API Documentation

Open the RELOC8 API documentation:

https://reloc8-backend.onrender.com/docs

This opens the FastAPI Swagger documentation.

The API documentation allows developers to view and test the available backend endpoints.

Important endpoints include:

- GET `/`
- GET `/villages`
- GET `/shelters`
- GET `/animals`
- GET `/hazards`
- GET `/risk`
- GET `/api/notifications`
- POST `/api/reports`
- POST `/api/relocation-plan`

### Explain

"The FastAPI Swagger interface provides a clear way to inspect and test the backend APIs used by the RELOC8 application."

---
# 14. Demo Checklist

Before the presentation, verify the following:

- [ ] RELOC8 frontend opens successfully
- [ ] Interactive map loads
- [ ] Village markers are visible
- [ ] Shelter markers are visible
- [ ] Animal markers are visible
- [ ] Map filters work
- [ ] Report Incident feature works
- [ ] Incident report can be submitted
- [ ] Relocation planning API works
- [ ] Risk API works
- [ ] Backend Swagger documentation opens
- [ ] Production frontend works
- [ ] Production backend works

---
# 15. Short Presentation Script

"RELOC8 is a disaster decision-support platform designed to assist during disaster situations.

It provides an interactive map showing villages, safe shelters, animal rescue reports, and disaster-related information.

Users can submit field incident reports through the application.

The FastAPI backend validates these reports and provides APIs for disaster data, risk information, and relocation planning.

The shelter allocation module considers affected population, shelter capacity, available space, and geographic distance to support relocation decisions.

The frontend is deployed on Vercel and the backend is deployed on Render."

---