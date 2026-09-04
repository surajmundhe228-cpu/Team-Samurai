# RELOC8 🚨
### Real-Time Disaster Management, Evacuation Routing & Crowd Control System

RELOC8 is a comprehensive, intelligent emergency response and evacuation platform designed to save lives during natural disasters and manage high-density mass gatherings (such as Kumbh Mela or major religious festivals). The system integrates real-time risk assessment, dynamic routing, and offline communication capabilities.

---

## 🚀 Key Features

* **Real-time Evacuation Routing:** Dynamic path calculation to guide citizens safely away from hazard zones toward verified active shelters.
* **Explainable AI (XAI) Risk Assessment:** Transparent risk scoring powered by real-time parameters (water levels, population density, and weather patterns) explaining *why* an area is dangerous.
* **Dual-Use Scalability:** Seamlessly shifts from emergency disaster response (floods/earthquakes) to mass gathering crowd management (stampede prevention and footfall control).
* **Offline Bluetooth Mesh Support:** Built-in blueprint for peer-to-peer (P2P) emergency messaging when cellular networks and the internet fail.
* **Citizen Reporting & Relief Hub:** Enables citizens to report ground-level blockages, request animal evacuation support, and access community donation portals.

---

## 🛠️ Tech Stack

* **Backend:** Python, FastAPI, Uvicorn, Lightweight JSON/Database architecture.
* **Frontend:** React.js / Modern UI frameworks, deployed on Vercel.
* **Cloud & Deployment:** Render (Backend API), Vercel (Frontend), GitHub (Version Control).

---

## 📂 Project Architecture

```text
RELOC8/
├── backend/
│   ├── main.py            # FastAPI entry point & API routes
│   ├── data.json          # Mock dataset for villages, shelters, and hazards
│   └── requirements.txt   # Python dependencies
├── frontend/              # Vercel-deployed client application
├── OFFLINE_MESH_DESIGN.md # Bluetooth mesh networking blueprint for offline use
└── README.md              # Project documentation