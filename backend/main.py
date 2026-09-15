from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os
from datetime import datetime

app = FastAPI(title="Reloc8 Backend API")

# Allow React frontend on localhost (Vite standard ports: 5173 / 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "database.json")

# Default initial database records
DEFAULT_DATA = {
    "citizens": [],
    "authorities": [
        {"id": "auth_101", "name": "Inspector R. Sharma", "badge": "NDRF-101", "phone": "101", "department": "NDRF Supaul"},
        {"id": "auth_102", "name": "Dr. Priya Varma", "badge": "HEALTH-102", "phone": "102", "department": "Madhepura Health Dept"},
        {"id": "auth_103", "name": "Pankaj Kumar", "badge": "REV-103", "phone": "103", "department": "Supaul Administration"}
    ],
    "reports": [
        {"id": "rep_1", "village": "Rampur", "issue": "Embankment crack near east perimeter", "reported_by": "System", "status": "RESOLVED", "created_at": "2026-09-14T02:00:00"},
        {"id": "rep_2", "village": "Bishanpur", "issue": "Contaminated drinking water in Ward 4", "reported_by": "cit_1", "status": "PENDING", "created_at": "2026-09-15T09:30:00"}
    ]
}

def load_db():
    if not os.path.exists(DB_PATH):
        with open(DB_PATH, "w") as f:
            json.dump(DEFAULT_DATA, f, indent=2)
        return DEFAULT_DATA
    with open(DB_PATH, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return DEFAULT_DATA

def save_db(data):
    with open(DB_PATH, "w") as f:
        json.dump(data, f, indent=2)

# Models
class RegisterCitizenRequest(BaseModel):
    name: str
    phone_or_email: str
    password: str

class LoginRequest(BaseModel):
    phone_or_email: str
    password: str

class ReportRequest(BaseModel):
    village: str
    issue: str
    reported_by: str

class ResolveRequest(BaseModel):
    report_id: str

# Endpoints
@app.post("/api/register")
def register_citizen(req: RegisterCitizenRequest):
    db = load_db()
    for user in db["citizens"]:
        if user["phone_or_email"].strip().lower() == req.phone_or_email.strip().lower():
            raise HTTPException(status_code=400, detail="Account already registered with this phone or email.")
    
    new_user = {
        "id": f"cit_{len(db['citizens']) + 1}",
        "name": req.name.strip(),
        "phone_or_email": req.phone_or_email.strip(),
        "password": req.password.strip(),
        "role": "citizen",
        "created_at": datetime.now().isoformat()
    }
    db["citizens"].append(new_user)
    save_db(db)
    
    # Return user profile without sending password
    return {
        "status": "success",
        "user": {"id": new_user["id"], "name": new_user["name"], "role": "citizen"}
    }

@app.post("/api/login")
def login(req: LoginRequest):
    db = load_db()
    # Check citizen records
    for user in db["citizens"]:
        if user["phone_or_email"].strip().lower() == req.phone_or_email.strip().lower() and user["password"] == req.password:
            return {
                "status": "success",
                "user": {"id": user["id"], "name": user["name"], "role": "citizen"}
            }
            
    # Check authority records (matching phone/badge with password)
    for auth in db["authorities"]:
        if (auth["phone"] == req.phone_or_email or auth["badge"].lower() == req.phone_or_email.lower()) and req.password == "admin123":
            return {
                "status": "success",
                "user": {"id": auth["id"], "name": auth["name"], "badge": auth["badge"], "role": "authority"}
            }
            
    raise HTTPException(status_code=401, detail="Invalid credentials or unregistered account.")

@app.get("/api/reports")
def get_reports():
    db = load_db()
    return db["reports"]

@app.post("/api/reports")
def create_report(req: ReportRequest):
    db = load_db()
    new_report = {
        "id": f"rep_{len(db['reports']) + 1}",
        "village": req.village,
        "issue": req.issue,
        "reported_by": req.reported_by,
        "status": "PENDING",
        "created_at": datetime.now().isoformat()
    }
    db["reports"].append(new_report)
    save_db(db)
    return new_report

@app.post("/api/reports/resolve")
def resolve_report(req: ResolveRequest):
    db = load_db()
    for report in db["reports"]:
        if report["id"] == req.report_id:
            report["status"] = "RESOLVED"
            save_db(db)
            return {"status": "success", "report": report}
    raise HTTPException(status_code=404, detail="Report not found.")