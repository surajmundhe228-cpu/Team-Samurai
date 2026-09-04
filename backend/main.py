import json
import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from backend.shelter_allocator import allocate_shelters


# --------------------------------------------------
# ENVIRONMENT CONFIGURATION
# --------------------------------------------------

load_dotenv()

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)


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
    allow_origins=[FRONTEND_URL],
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


# --------------------------------------------------
# IN-MEMORY DATABASE FOR INCIDENT REPORTS
# --------------------------------------------------

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

    v_list = (
        villages_data.get("villages", villages_data)
        if isinstance(villages_data, dict)
        else villages_data
    )

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

    v_list = (
        villages_data.get("villages", villages_data)
        if isinstance(villages_data, dict)
        else villages_data
    )

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
# XAI RISK SCORING
# --------------------------------------------------

def compute_xai_risk_breakdown(village_name: str):

    v_list = (
        villages_data.get("villages", villages_data)
        if isinstance(villages_data, dict)
        else villages_data
    )

    village = next(
        (
            v for v in v_list
            if v.get("village", "").lower() == village_name.lower()
        ),
        None
    )

    if not village:
        return None

    # --------------------------------------------------
    # EXISTING DATA
    # --------------------------------------------------

    population = float(
        village.get("population", 0)
    )

    rainfall = float(
        village.get("rainfall_mm", 0)
    )

    hazard_score = float(
        village.get("hazard_score", 0)
    )

    # --------------------------------------------------
    # NORMALIZED FACTOR SCORES
    # All factors are converted to a 0-100 scale.
    # --------------------------------------------------

    # Water-level / flood hazard indicator
    # Since the current dataset does not contain
    # water_level directly, hazard_score is used
    # as the available flood-risk indicator.
    water_level_score = max(
        0,
        min(100, hazard_score)
    )

    # Population score
    # 1000 people = 100 score.
    population_score = max(
        0,
        min(100, population / 10)
    )

    # Rainfall score
    # 200 mm rainfall is treated as the 100-point
    # reference level.
    rainfall_score = max(
        0,
        min(100, (rainfall / 200) * 100)
    )

    # --------------------------------------------------
    # WEIGHTED RISK CALCULATION
    #
    # Water Level       = 40%
    # Population Density = 30%
    # Weather/Rainfall   = 30%
    # --------------------------------------------------

    water_contribution = water_level_score * 0.40

    population_contribution = population_score * 0.30

    weather_contribution = rainfall_score * 0.30

    total_score = (
        water_contribution
        + population_contribution
        + weather_contribution
    )

    # --------------------------------------------------
    # RISK LEVEL
    # --------------------------------------------------

    if total_score >= 81:
        risk_level = "CRITICAL"

    elif total_score >= 61:
        risk_level = "HIGH"

    elif total_score >= 31:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    # --------------------------------------------------
    # XAI RESPONSE
    # --------------------------------------------------

    return {
        "village": village.get("village"),

        "district": village.get(
            "district",
            "Unknown"
        ),

        "predicted_risk_score": round(
            total_score,
            1
        ),

        "risk_level": risk_level,

        "xai_feature_contributions": [

            {
                "feature": "Water Level",

                "weight": 40,

                "score": round(
                    water_level_score,
                    1
                ),

                "contribution": round(
                    water_contribution,
                    1
                ),

                "reason": (
                    "Flood hazard indicator contributes "
                    "40% to the overall risk score."
                )
            },

            {
                "feature": "Population Density",

                "weight": 30,

                "score": round(
                    population_score,
                    1
                ),

                "contribution": round(
                    population_contribution,
                    1
                ),

                "reason": (
                    f"Population of {int(population)} "
                    "increases evacuation and resource "
                    "requirements."
                )
            },

            {
                "feature": "Weather Forecast / Rainfall",

                "weight": 30,

                "score": round(
                    rainfall_score,
                    1
                ),

                "contribution": round(
                    weather_contribution,
                    1
                ),

                "reason": (
                    f"Recorded rainfall of {rainfall} mm "
                    "increases flood-related risk."
                )
            }
        ],

        "model_metadata": {

            "algorithm": (
                "Weighted Explainable Risk Scoring"
            ),

            "weights": {

                "water_level": "40%",

                "population_density": "30%",

                "weather_forecast_rainfall": "30%"
            },

            "version": "2.0.0"
        }
    }


# --------------------------------------------------
# XAI API ENDPOINT
# --------------------------------------------------

@app.get("/api/xai-risk/{village_name}")
def get_xai_risk(village_name: str):

    result = compute_xai_risk_breakdown(
        village_name
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Village record not found for XAI processing."
        )

    return result


# --------------------------------------------------
# ENDPOINTS: INCIDENT REPORTS
# --------------------------------------------------

@app.post("/api/reports")
def submit_report(report: IncidentReport):

    report_dict = (
        report.model_dump()
        if hasattr(report, "model_dump")
        else report.dict()
    )

    report_dict["id"] = len(reports_db) + 1

    reports_db.append(
        report_dict
    )

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