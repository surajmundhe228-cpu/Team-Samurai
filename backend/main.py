import json
from pathlib import Path
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.shelter_allocator import allocate_shelters


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "datab"
FRONTEND_DATA_DIR = BASE_DIR.parent / "src" / "data"


# --------------------------------------------------
# LOAD DATA
# --------------------------------------------------

with open(DATA_DIR / "villages.json", "r", encoding="utf-8") as f:
    villages_data = json.load(f)

with open(DATA_DIR / "shelters.json", "r", encoding="utf-8") as f:
    shelters_data = json.load(f)

# Animals currently exists in src/data
with open(FRONTEND_DATA_DIR / "animals.json", "r", encoding="utf-8") as f:
    animals_data = json.load(f)


# --------------------------------------------------
# APP
# --------------------------------------------------

app = FastAPI(
    title="RELOC8 API",
    description="Backend for the RELOC8 disaster risk and relocation system",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# TEMPORARY REPORT DATABASE
# --------------------------------------------------

reports_db = []


# --------------------------------------------------
# REPORT MODEL
# --------------------------------------------------

class IncidentReport(BaseModel):
    type: str
    village: str
    affectedCount: int
    description: Optional[str] = ""


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "RELOC8 Backend is running"
    }


# --------------------------------------------------
# VILLAGES
# --------------------------------------------------

@app.get("/villages")
def get_villages():
    return {
        "villages": villages_data
    }


# --------------------------------------------------
# SHELTERS
# --------------------------------------------------

@app.get("/shelters")
def get_shelters():
    return {
        "shelters": shelters_data
    }


# --------------------------------------------------
# ANIMALS
# --------------------------------------------------

@app.get("/animals")
def get_animals():
    return {
        "animals": animals_data
    }


# --------------------------------------------------
# HAZARDS
# --------------------------------------------------

@app.get("/hazards")
def get_hazards():
    hazards = []

    for village in villages_data:
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


# --------------------------------------------------
# RISK
# --------------------------------------------------

@app.get("/risk")
def get_risk():
    if not villages_data:
        return {
            "risk_level": "UNKNOWN",
            "risk_score": 0,
            "affected_population": 0
        }

    highest_risk_village = max(
        villages_data,
        key=lambda village: village.get("risk_score", 0)
    )

    return {
        "risk_level": highest_risk_village.get("risk_level"),
        "risk_score": highest_risk_village.get("risk_score"),
        "affected_population": highest_risk_village.get("population"),
        "village": highest_risk_village.get("village")
    }


# --------------------------------------------------
# SUBMIT INCIDENT REPORT
# --------------------------------------------------

@app.post("/api/reports")
def submit_report(report: IncidentReport):
    report_dict = report.model_dump()

    report_dict["id"] = len(reports_db) + 1

    reports_db.append(report_dict)

    return {
        "status": "success",
        "data": report_dict
    }


# --------------------------------------------------
# GET INCIDENT REPORTS
# --------------------------------------------------

@app.get("/api/reports")
def get_reports():
    return {
        "reports": reports_db
    }


# --------------------------------------------------
# RELOCATION PLAN
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