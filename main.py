# ============================================================
# FLOOD EVACUATION API
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from engine import generate_evacuation_plan


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(
    title="Flood Evacuation System",
    description="AI-based Flood Risk and Evacuation API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATA MODELS
# ============================================================

class Village(BaseModel):
    village: str

    latitude: float
    longitude: float

    rainfall_mm: float = 50.0
    river_distance_km: float = 5.0
    elevation_m: float = 55.0

    population_numeric_for_calc: int = 500


class Shelter(BaseModel):
    shelter_name: str

    latitude: float
    longitude: float

    total_capacity: int
    available_capacity: int


class EvacuationRequest(BaseModel):
    villages: List[Village]
    shelters: List[Shelter]


# ============================================================
# HOME ENDPOINT
# ============================================================

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Flood Evacuation API is running",
        "docs": "/docs"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# ============================================================
# GENERATE EVACUATION PLAN
# ============================================================

@app.post("/evacuation-plan")
def create_evacuation_plan(
    request: EvacuationRequest
):

    villages = [
        village.model_dump()
        for village in request.villages
    ]

    shelters = [
        shelter.model_dump()
        for shelter in request.shelters
    ]

    plan = generate_evacuation_plan(
        villages,
        shelters
    )

    return plan


# ============================================================
# RISK ONLY ENDPOINT
# ============================================================

@app.post("/risk")
def calculate_risk(
    request: EvacuationRequest
):

    from risk_engine import compute_risks

    villages = [
        village.model_dump()
        for village in request.villages
    ]

    risk_results = compute_risks(
        villages
    )

    return {
        "status": "success",
        "risk_assessment": risk_results
    }


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
