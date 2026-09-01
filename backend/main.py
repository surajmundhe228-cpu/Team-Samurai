import json
from pathlib import Path
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.shelter_allocator import allocate_shelters

# --------------------------------------------------
# APP INITIALIZATION
# --------------------------------------------------

app = FastAPI(
    title="RELOC8 API",
    description="Backend for the RELOC8 disaster risk and relocation system",
    version="1.0.0"
)

# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# PATHS & DIRECTORIES
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "datab"
FRONTEND_DATA_DIR = BASE_DIR.parent / "src" / "data"

# --------------------------------------------------
# DATA LOADING WITH ERROR HANDLING
# --------------------------------------------------

try:
    with open(DATA_DIR / "villages.json", "r", encoding="utf-8") as f:
        villages_data = json.load(f)
    print("Successfully loaded villages.json")
except Exception as e:
    print(f"Warning: Could not load villages.json: {e}")
    villages_data = []

try:
    with open(DATA_DIR / "shelters.json", "r", encoding="utf-8") as f:
        shelters_data = json.load(f)
    print("Successfully loaded shelters.json")
except Exception as e:
    print(f"Warning: Could not load shelters.json: {e}")
    shelters_data = []

try:
    with open(FRONTEND_DATA_DIR / "animals.json", "r", encoding="utf-8") as f:
        animals_data = json.load(f)
    print("Successfully loaded animals.json")
except Exception as e:
    print(f"Warning: Could not load animals.json: {e}")
    animals_data = []
    
try:
    with open(DATA_DIR / "alerts_data.json", "r", encoding="utf-8") as f:
        notifications_data = json.load(f)
    print("Successfully loaded alerts_data.json")
except Exception as e:
    print(f"Warning: Could not load alerts_data.json: {e}")
    notifications_data = []

# In-memory database for incident reports
reports_db = []

# --------------------------------------------------
# PYDANTIC MODELS
# --------------------------------------------------

class IncidentReport(BaseModel):
    type: str
    village: str
    affectedCount: int
    description: Optional[str] = ""

# --------------------------------------------------
# ENDPOINTS: SYSTEM & CORE DATA
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "RELOC8 Backend is running"
    }

@app.get("/villages")
def get_villages():
    return {
        "villages": villages_data
    }

@app.get("/shelters")
def get_shelters():
    return {
        "shelters": shelters_data
    }

@app.get("/animals")
def get_animals():
    return {
        "animals": animals_data
    }

# --------------------------------------------------
# ENDPOINTS: HAZARDS & RISK ANALYSIS
# --------------------------------------------------

@app.get("/hazards")
def get_hazards():
    hazards = []
    v_list = villages_data.get("villages", villages_data) if isinstance(villages_data, dict) else villages_data
    
    for village in v_list:
        hazards.append({
            "village": village.get("village"),
            "district": village.get("district"),
            "hazard_score": village.get("hazard_score"),
            "flood_history": village.get("flood_history"),
            "risk_level": village.get("risk_level")
        })

    return {
        "hazards": hazards
    }

@app.get("/risk")
def get_risk():
    v_list = villages_data.get("villages", villages_data) if isinstance(villages_data, dict) else villages_data
    
    if not v_list:
        return {
            "risk_level": "UNKNOWN",
            "risk_score": 0,
            "affected_population": 0
        }

    highest_risk_village = max(
        v_list,
        key=lambda village: village.get("risk_score", 0)
    )

    return {
        "risk_level": highest_risk_village.get("risk_level"),
        "risk_score": highest_risk_village.get("risk_score"),
        "affected_population": highest_risk_village.get("population"),
        "village": highest_risk_village.get("village")
    }

# --------------------------------------------------
# ENDPOINTS: INCIDENT REPORTS
# --------------------------------------------------

@app.post("/api/reports")
def submit_report(report: IncidentReport):
    report_dict = report.model_dump() if hasattr(report, "model_dump") else report.dict()
    report_dict["id"] = len(reports_db) + 1
    reports_db.append(report_dict)

    return {
        "status": "success",
        "data": report_dict
    }

@app.get("/api/reports")
def get_reports():
    return {
        "reports": reports_db
    }

# --------------------------------------------------
# ENDPOINTS: ALLOCATION & NOTIFICATIONS
# --------------------------------------------------

@app.get("/api/relocation-plan")
def get_relocation_plan():
    plan = allocate_shelters(
        villages_data,
        shelters_data
    )

    return {
        "status": "success",
        "plan": plan
    }

@app.get("/api/notifications")
def get_notifications():
    return notifications_data