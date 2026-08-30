
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from shelter_allocator import allocate_shelters

app = FastAPI(title="RELOC8 Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("data/villages.json", "r") as f:
    villages_data = json.load(f)

with open("data/shelters.json", "r") as f:
    shelters_data = json.load(f)

reports_db = []

class IncidentReport(BaseModel):
    type: str
    village: str
    affectedCount: str
    description: Optional[str] = ""

@app.get("/villages")
def get_villages():
    return villages_data

@app.get("/shelters")
def get_shelters():
    return shelters_data

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

from fastapi import FastAPI

app = FastAPI(
    title="RELOC8 API",
    description="Backend for the RELOC8 disaster risk and relocation system",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "RELOC8 Backend is running"
    }


@app.get("/villages")
def get_villages():
    return {
        "villages": [
            {
                "id": 1,
                "name": "Village A",
                "population": 500,
                "latitude": 18.5204,
                "longitude": 73.8567
            },
            {
                "id": 2,
                "name": "Village B",
                "population": 800,
                "latitude": 18.5304,
                "longitude": 73.8667
            },
            {
                "id": 3,
                "name": "Village C",
                "population": 250,
                "latitude": 18.5104,
                "longitude": 73.8467
            }
        ]
    }
    
@app.get("/hazards")
def get_hazards():
    return {
        "hazards": [
            {
                "id": 1,
                "type": "flood",
                "severity": "high",
                "risk_score": 82
            },
            {
                "id": 2,
                "type": "flood",
                "severity": "medium",
                "risk_score": 55
            }
        ]
    }
    
@app.get("/shelters")
def get_shelters():
    return {
        "shelters": [
            {
                "id": 1,
                "name": "Shelter A",
                "capacity": 500,
                "occupied": 400,
                "available": 100,
                "latitude": 18.5404,
                "longitude": 73.8767
            },
            {
                "id": 2,
                "name": "Shelter B",
                "capacity": 800,
                "occupied": 200,
                "available": 600,
                "latitude": 18.5504,
                "longitude": 73.8867
            }
        ]
    }
    
@app.get("/animals")
def get_animals():
    return {
        "animals": [
            {
                "id": 1,
                "type": "cattle",
                "count": 50
            },
            {
                "id": 2,
                "type": "goat",
                "count": 30
            },
            {
                "id": 3,
                "type": "dog",
                "count": 20
            }
        ]
    }
    
@app.get("/risk")
def get_risk():
    return {
        "risk_level": "HIGH",
        "risk_score": 82,
        "affected_population": 500
    }
