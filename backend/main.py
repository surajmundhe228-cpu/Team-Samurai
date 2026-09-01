import json
from pathlib import Path
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from shelter_allocator import allocate_shelters

app = FastAPI(
    title="RELOC8 Engine",
    description="Backend for the RELOC8 disaster risk and relocation system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve path safely using pathlib to match your 'datab' directory structure
BASE_DIR = Path(__file__).resolve().parent

try:
    with open(BASE_DIR / "datab" / "villages.json", "r", encoding="utf-8") as f:
        villages_data = json.load(f)
    print("Successfully loaded villages.json")
except Exception as e:
    print(f"Warning: Could not load villages.json: {e}")
    villages_data = {"villages": []}

try:
    with open(BASE_DIR / "datab" / "shelters.json", "r", encoding="utf-8") as f:
        shelters_data = json.load(f)
    print("Successfully loaded shelters.json")
except Exception as e:
    print(f"Warning: Could not load shelters.json: {e}")
    shelters_data = {"shelters": []}

reports_db = []

class IncidentReport(BaseModel):
    type: str
    village: str
    affectedCount: str
    description: Optional[str] = ""

@app.get("/")
def home():
    return {
        "message": "RELOC8 Backend is running"
    }

@app.get("/villages")
def get_villages():
    return villages_data

@app.get("/shelters")
def get_shelters():
    return shelters_data

@app.get("/hazards")
def get_hazards():
    return {
        "hazards": [
            {"id": 1, "type": "flood", "severity": "high", "risk_score": 82},
            {"id": 2, "type": "flood", "severity": "medium", "risk_score": 55}
        ]
    }

@app.get("/animals")
def get_animals():
    return {
        "animals": [
            {"id": 1, "type": "cattle", "count": 50},
            {"id": 2, "type": "goat", "count": 30},
            {"id": 3, "type": "dog", "count": 20}
        ]
    }

@app.get("/risk")
def get_risk():
    return {
        "risk_level": "HIGH",
        "risk_score": 82,
        "affected_population": 500
    }

@app.post("/api/reports")
def submit_report(report: IncidentReport):
    report_dict = report.dict()
    report_dict["id"] = len(reports_db) + 1
    reports_db.append(report_dict)
    return {"status": "success", "data": report_dict}

@app.get("/api/reports")
def get_reports():
    return reports_db

@app.get("/api/relocation-plan")
def get_relocation_plan():
    plan = allocate_shelters(villages_data, shelters_data)
    return {"status": "success", "plan": plan}