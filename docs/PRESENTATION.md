# RELOC8 - Technical Presentation

## 1. Project Overview

RELOC8 is a disaster risk and evacuation decision-support system.

It is designed to help users understand disaster situations, identify affected villages, view available shelters, report incidents, and create relocation plans.

### Main Features

- Disaster risk assessment
- Village and hazard information
- Interactive disaster map
- Shelter availability and capacity
- Incident reporting
- Animal reports
- Automatic relocation planning
- Backend REST APIs
- Offline support
- Deployed web application and backend

---

## 2. Problem Statement

During disasters, people need quick and reliable information about:

- Which villages are affected?
- What is the current risk level?
- Where are the available shelters?
- How many people can each shelter accommodate?
- How should affected people be relocated?
- How can new incidents be reported?

RELOC8 brings these functions together in one system to support faster and more organized disaster response.

---

## 3. Proposed Solution

RELOC8 provides a centralized platform where disaster-related information can be viewed and managed.

The system:

1. Displays villages and their risk information.
2. Shows disaster and hazard information.
3. Displays available shelters and their capacity.
4. Allows users to submit incident reports.
5. Generates relocation plans using village requirements and shelter capacity.
6. Supports animal-related disaster reports.
7. Provides APIs for communication between the frontend and backend.

---

## 4. System Architecture

RELOC8 follows a frontend-backend architecture.

### Frontend

The frontend is developed using:

- React
- Vite
- JavaScript
- CSS

The frontend provides the user interface, map, filters, reports, notifications, village information, and relocation results.

### Backend

The backend is developed using:

- Python
- FastAPI
- Uvicorn

The backend provides REST APIs and handles:

- Village data
- Shelter data
- Hazard data
- Risk information
- Animal reports
- Incident reports
- Relocation planning

### Data Layer

The project currently uses JSON files for structured data.

Important data files include:

- `backend/datab/villages.json`
- `backend/datab/shelters.json`
- `src/data/animals.json`

---

## 5. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Backend | Python FastAPI |
| Server | Uvicorn |
| Data | JSON |
| API Testing | Postman |
| API Documentation | Swagger/OpenAPI |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Version Control | Git & GitHub |

---

## 6. Project Structure

```text
Team-Samurai/
│
├── backend/
│   ├── main.py
│   ├── shelter_allocator.py
│   ├── validate_data.py
│   └── datab/
│       ├── villages.json
│       └── shelters.json
│
├── src/
│   ├── data/
│   │   └── animals.json
│   └── utils/
│       ├── cache.js
│       └── syncQueue.js
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEMO.md
│   └── PRESENTATION.md
│
└── README.md
---

## 7. Backend API

The backend provides REST APIs that connect the frontend with the disaster-related data and services.

### Main GET APIs

- `GET /`
- `GET /villages`
- `GET /shelters`
- `GET /animals`
- `GET /hazards`
- `GET /risk`
- `GET /api/notifications`

### Main POST APIs

- `POST /api/reports`
- `POST /api/relocation-plan`

These APIs allow the frontend to retrieve information, submit incident reports, and generate relocation plans.
---

## 8. Incident Reporting

The incident reporting feature allows users to submit information about a disaster incident.

A report can include:

- Village
- Disaster type
- Severity
- Number of affected people
- Description

The backend validates the submitted data before processing it.

For example, `affectedCount` must be provided as an integer.

If required data is missing or the data type is incorrect, the API returns a validation error.
---

## 9. Relocation Planning

Relocation planning is one of the main features of RELOC8.

The system uses shelter allocation logic to help assign affected people to suitable shelters.

The allocation considers:

- Number of affected people
- Shelter capacity
- Shelter availability
- Village requirements
- Distance-related information

The relocation logic is implemented in:

`backend/shelter_allocator.py`

The goal is to generate a practical relocation plan based on the available shelter capacity.
---

## 10. Risk Assessment

RELOC8 provides risk-related information to help users understand disaster situations.

Users can view:

- Village information
- Hazard information
- Risk levels
- Affected areas

This helps users identify locations that may require greater attention during disaster response.
---

## 11. Animal Reports

RELOC8 also considers animals affected during disaster situations.

The project contains animal-related data and provides an API through:

`GET /animals`

This allows animal information to be included as part of the overall disaster-response workflow.
---

## 12. Data Validation

Data validation is important because incorrect disaster data can affect decision-making.

The project includes:

`backend/validate_data.py`

It is used to validate the structured project data.

The FastAPI backend also validates incoming API requests.

For example:

- Required fields must be provided.
- Data must have the correct type.
- Invalid requests can return an HTTP 422 validation error.
---

## 13. API Testing

Postman was used to test the RELOC8 backend APIs.

### Successful Tests

The following APIs were tested successfully:

- `GET /`
- `GET /villages`
- `GET /shelters`
- `GET /animals`
- `GET /hazards`
- `GET /risk`
- `GET /api/notifications`
- `POST /api/reports`
- `POST /api/relocation-plan`

### Validation Tests

Invalid requests were also tested.

For example, sending:

`affectedCount: "fifty"`

instead of an integer produced an HTTP 422 validation error.

This confirms that the backend validates incoming data correctly.
---

## 14. Swagger API Documentation

FastAPI automatically provides interactive API documentation using Swagger/OpenAPI.

### Production Documentation

`https://reloc8-backend.onrender.com/docs`

Swagger allows developers to:

- View available API endpoints.
- View request parameters.
- Test APIs directly.
- Check response formats.
- Understand API behavior.

This makes API testing and development easier for the project team.
---

## 15. Frontend and Backend Communication

The RELOC8 frontend communicates with the FastAPI backend through REST APIs.

The frontend uses the environment variable:

`VITE_API_URL`

For local development, it points to the local backend.

For production, it points to:

`https://reloc8-backend.onrender.com`

This configuration allows the frontend to communicate with the correct backend environment without hardcoding the API URL.

---

## 16. CORS Configuration

CORS (Cross-Origin Resource Sharing) is configured in the FastAPI backend.

It allows the deployed frontend to communicate with the separately deployed backend.

This is required because the frontend and backend are hosted on different domains.

- Frontend: Vercel
- Backend: Render

The backend uses the configured frontend URL to allow cross-origin requests.
---

## 17. Offline Support

RELOC8 includes utility modules to support offline functionality:

- `src/utils/cache.js`
- `src/utils/syncQueue.js`

The cache helps retain data locally, while the synchronization queue helps manage operations that can be synchronized when connectivity becomes available.

This is useful in disaster situations where internet connectivity may be unreliable.
---

## 18. Deployment

RELOC8 is deployed using separate services for the frontend and backend.

### Frontend Deployment

The React frontend is deployed on Vercel.

Production URL:

`https://team-samurai-murex.vercel.app`

### Backend Deployment

The FastAPI backend is deployed on Render.

Production URL:

`https://reloc8-backend.onrender.com`

### Backend Start Command

`uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

This deployment setup allows the complete RELOC8 system to be accessed online.
---

## 19. Demo Flow

The recommended demonstration flow is:

1. Open the deployed RELOC8 application.
2. Show the disaster map.
3. Demonstrate the map filters.
4. Open village information.
5. Show shelter information.
6. Demonstrate animal reports.
7. Submit an incident report.
8. Generate a relocation plan.
9. Demonstrate risk information.
10. Show the deployed backend API.
11. Open Swagger API documentation.
12. Explain the system architecture.

This flow demonstrates the complete journey from viewing disaster information to reporting an incident and planning relocation.
---

## 20. Demo Scenario

### Scenario: Disaster Incident in a Village

Assume that a village is affected by a disaster.

The demonstration can follow this flow:

1. Locate the affected village on the RELOC8 map.
2. Show the village risk and disaster information.
3. Check nearby shelters and their available capacity.
4. Submit an incident report with the number of affected people.
5. Generate a relocation plan.
6. Show how affected people are assigned to available shelters.
7. Explain how the backend APIs support these operations.

This scenario demonstrates the complete flow from disaster identification to relocation planning.
---

## 21. Technical Highlights

The main technical highlights of RELOC8 are:

- React and Vite based frontend
- Python FastAPI backend
- REST API architecture
- JSON-based structured data
- Shelter allocation algorithm
- API request validation
- Postman API testing
- Swagger/OpenAPI documentation
- Environment-based API configuration
- CORS configuration
- Offline-support utilities
- Vercel frontend deployment
- Render backend deployment
- Git and GitHub collaboration
---

## 22. Team Collaboration

Git and GitHub were used for collaborative development.

The team worked together using:

- Feature development
- Git commits
- Branch management
- Pull and rebase
- Push to GitHub
- Conflict resolution
- Testing before integration

Documentation was also added to make the project easier for team members and evaluators to understand.
---

## 23. Future Improvements

Possible future improvements for RELOC8 include:

- Real-time disaster data integration
- Live weather and hazard APIs
- Advanced GIS-based analysis
- Improved route optimization
- Advanced shelter prioritization
- Database integration
- User authentication
- Role-based access
- Improved offline synchronization
- Real-time notifications
- Machine-learning-based risk prediction
---

## 24. Key Presentation Points

During the presentation, focus on these points:

### Problem

Disaster response requires quick access to information about affected areas, shelters, risks, and relocation.

### Solution

RELOC8 combines these functions into one decision-support platform.

### Technical Approach

React handles the user interface, while FastAPI provides the backend REST APIs.

### Important Feature

The relocation planner uses affected population and shelter information to generate a relocation plan.

### Reliability

The system includes data validation, API testing, environment configuration, and offline-support utilities.

### Deployment

The frontend is deployed on Vercel and the backend is deployed on Render.
---

## 25. Short Presentation Script

### Introduction

"Good morning everyone. Our project is RELOC8, a disaster risk and evacuation decision-support system.

The main purpose of RELOC8 is to help users understand disaster situations, identify affected villages, find available shelters, report incidents, and plan relocation."

### Problem

"During a disaster, information about affected areas and available shelters needs to be accessed quickly. Managing this information separately can make disaster response slower and less organized."

### Solution

"RELOC8 brings this information together in one platform. Users can view disaster and village information, check shelters, submit incident reports, and generate relocation plans."

### Technical Architecture

"Technically, our frontend is developed using React and Vite, while the backend is developed using Python FastAPI. The frontend communicates with the backend through REST APIs, and our structured data is currently stored in JSON files."

### Relocation Feature

"One of our important features is relocation planning. The backend uses shelter allocation logic to assign affected people to suitable shelters based on available capacity and other relevant information."

### Testing

"We tested our APIs using Postman and used FastAPI's Swagger documentation to verify the endpoints. We tested both valid and invalid requests to make sure backend validation works correctly."

### Deployment

"Our frontend is deployed on Vercel and our backend is deployed on Render. This allows us to demonstrate the complete system as a live application."

### Conclusion

"Overall, RELOC8 provides a centralized platform for disaster information, incident reporting, risk awareness, shelter management, and relocation planning.

Thank you."
---

## 26. Final Demo Checklist

Before the presentation, verify:

- [ ] Frontend opens correctly.
- [ ] Disaster map loads correctly.
- [ ] Map filters work.
- [ ] Village information works.
- [ ] Shelter information works.
- [ ] Animal reports work.
- [ ] Incident reporting works.
- [ ] Relocation planning works.
- [ ] Risk information works.
- [ ] Backend is running/deployed.
- [ ] Swagger documentation opens.
- [ ] Postman collection is available.
- [ ] Production frontend URL works.
- [ ] Production backend URL works.
- [ ] GitHub repository is up to date.
