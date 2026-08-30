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