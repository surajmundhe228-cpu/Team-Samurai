from pathlib import Path
import json
from urllib.request import urlopen
from typing import Any

from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware

from engine import generate_evacuation_plan
from risk_engine import compute_risks


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Reloc8 Flood Evacuation API",
    description="Flood risk assessment and evacuation management system",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):517[0-9]+",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# FILE PATH
# ============================================================

JSON_FILE = Path(__file__).resolve().parent / "evacuation_plan.json"


# ============================================================
# LOAD JSON DATA
# ============================================================

def load_dashboard_data():

    if not JSON_FILE.exists():
        return {
            "risk_assessment": [],
            "evacuation_plan": [],
            "total_villages": 0,
            "total_shelters": 0,
        }

    try:

        with open(
            JSON_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

            if not isinstance(data, dict):
                return {
                    "risk_assessment": [],
                    "evacuation_plan": [],
                    "total_villages": 0,
                    "total_shelters": 0,
                }

            return data

    except Exception as e:

        print("Error loading evacuation_plan.json:", e)

        return {
            "risk_assessment": [],
            "evacuation_plan": [],
            "total_villages": 0,
            "total_shelters": 0,
        }


# ============================================================
# NORMALIZE VILLAGE
# ============================================================

def normalize_village(village):

    if not isinstance(village, dict):
        village = {}

    return {

        "village": village.get(
            "village",
            village.get("name", "Unknown")
        ),

        "district": village.get(
            "district",
            "Supaul"
        ),

        "population": int(
            village.get(
                "population",
                0
            ) or 0
        ),

        "latitude": float(
            village.get(
                "latitude",
                village.get("lat", 0)
            ) or 0
        ),

        "longitude": float(
            village.get(
                "longitude",
                village.get("lng", 0)
            ) or 0
        ),

        # ----------------------------------------------------
        # RISK ENGINE FIELDS
        # ----------------------------------------------------

        "rainfall": float(
            village.get(
                "rainfall",
                village.get(
                    "rainfall_mm",
                    0
                )
            ) or 0
        ),

        "elevation": float(
            village.get(
                "elevation",
                village.get(
                    "elevation_m",
                    0
                )
            ) or 0
        ),

        "river_distance": float(
            village.get(
                "river_distance",
                village.get(
                    "distance_from_river_km",
                    0
                )
            ) or 0
        ),

        "history": village.get(
            "history",
            village.get(
                "flood_history",
                "Low"
            )
        ),

        # ----------------------------------------------------
        # FRONTEND FIELD NAMES
        # ----------------------------------------------------

        "rainfall_mm": float(
            village.get(
                "rainfall_mm",
                village.get(
                    "rainfall",
                    0
                )
            ) or 0
        ),

        "elevation_m": float(
            village.get(
                "elevation_m",
                village.get(
                    "elevation",
                    0
                )
            ) or 0
        ),

        "distance_from_river_km": float(
            village.get(
                "distance_from_river_km",
                village.get(
                    "river_distance",
                    0
                )
            ) or 0
        ),

        "flood_history": village.get(
            "flood_history",
            village.get(
                "history",
                "Low"
            )
        ),

        # ----------------------------------------------------
        # EXISTING RISK VALUES
        # ----------------------------------------------------

        "hazard_score": float(
            village.get(
                "hazard_score",
                0
            ) or 0
        ),

        "vulnerability_score": float(
            village.get(
                "vulnerability_score",
                0
            ) or 0
        ),

        "exposure_score": float(
            village.get(
                "exposure_score",
                0
            ) or 0
        ),

        "risk_score": float(
            village.get(
                "risk_score",
                0
            ) or 0
        ),

        "risk_level": village.get(
            "risk_level",
            ""
        ),
    }


# ============================================================
# NORMALIZE SHELTER
# ============================================================

def normalize_shelter(shelter):

    if not isinstance(shelter, dict):
        shelter = {}

    shelter_type = shelter.get(
        "type",
        shelter.get(
            "shelter_type",
            "Relief Centre"
        )
    )

    capacity = int(
        shelter.get(
            "capacity",
            0
        ) or 0
    )

    occupancy = int(
        shelter.get(
            "current_occupancy",
            shelter.get(
                "occupancy",
                0
            )
        ) or 0
    )

    available = shelter.get(
        "available_capacity",
        None
    )

    if available is None:
        available = max(
            capacity - occupancy,
            0
        )

    return {

        "shelter_name": shelter.get(
            "shelter_name",
            shelter.get(
                "name",
                "Unknown Shelter"
            )
        ),

        "latitude": float(
            shelter.get(
                "latitude",
                shelter.get("lat", 0)
            ) or 0
        ),

        "longitude": float(
            shelter.get(
                "longitude",
                shelter.get("lng", 0)
            ) or 0
        ),

        "capacity": capacity,

        "current_occupancy": occupancy,

        "available_capacity": int(
            available
        ),

        "type": shelter_type,

        "shelter_type": shelter_type,

        "facilities": shelter.get(
            "facilities",
            ""
        ),
    }


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "status": "success",
        "message": "Reloc8 Flood Evacuation API is running",
        "docs": "/docs",
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "Reloc8 Flood Evacuation API",
    }


# ============================================================
# DASHBOARD
# ============================================================

@app.get("/api/dashboard")
def get_dashboard():

    data = load_dashboard_data()

    risk_assessment = data.get(
        "risk_assessment",
        []
    )

    evacuation_plan = data.get(
        "evacuation_plan",
        []
    )

    return {

        "status": "success",

        "total_villages": data.get(
            "total_villages",
            len(risk_assessment)
        ),

        "total_shelters": data.get(
            "total_shelters",
            18
        ),

        "risk_assessment": risk_assessment,

        "evacuation_plan": evacuation_plan,
    }


# ============================================================
# SHELTERS
# ============================================================

@app.get("/api/shelters")
def get_shelters():

    shelters = [

        {
            "shelter_name": "Supaul College Relief Camp",
            "latitude": 26.115,
            "longitude": 86.595,
            "capacity": 800,
            "current_occupancy": 620,
            "available_capacity": 180,
            "type": "School/College",
            "facilities": "Toilets, Drinking Water, Medical Desk, Food Distribution",
        },

        {
            "shelter_name": "Triveniganj High School Camp",
            "latitude": 26.18,
            "longitude": 86.72,
            "capacity": 450,
            "current_occupancy": 410,
            "available_capacity": 40,
            "type": "School",
            "facilities": "Toilets, Drinking Water",
        },

        {
            "shelter_name": "Chhatapur Block Relief Centre",
            "latitude": 26.21,
            "longitude": 86.68,
            "capacity": 600,
            "current_occupancy": 280,
            "available_capacity": 320,
            "type": "Community Hall",
            "facilities": "Toilets, Drinking Water, Medical Desk, Kitchen",
        },

        {
            "shelter_name": "Raghopur Primary School",
            "latitude": 26.25,
            "longitude": 86.55,
            "capacity": 300,
            "current_occupancy": 295,
            "available_capacity": 5,
            "type": "School",
            "facilities": "Toilets, Drinking Water",
        },

        {
            "shelter_name": "Basantpur Relief Camp",
            "latitude": 26.32,
            "longitude": 86.48,
            "capacity": 500,
            "current_occupancy": 150,
            "available_capacity": 350,
            "type": "Temporary Camp",
            "facilities": "Toilets, Drinking Water, Medical Desk, Food Distribution, Tents",
        },

        {
            "shelter_name": "Madhepura Stadium Camp",
            "latitude": 25.92,
            "longitude": 86.79,
            "capacity": 1200,
            "current_occupancy": 950,
            "available_capacity": 250,
            "type": "Stadium/Ground",
            "facilities": "Toilets, Drinking Water, Medical Desk, Food Distribution, Electricity",
        },

        {
            "shelter_name": "Murliganj High School",
            "latitude": 25.88,
            "longitude": 86.92,
            "capacity": 400,
            "current_occupancy": 380,
            "available_capacity": 20,
            "type": "School",
            "facilities": "Toilets, Drinking Water",
        },

        {
            "shelter_name": "Kumarkhand Community Centre",
            "latitude": 25.95,
            "longitude": 86.85,
            "capacity": 350,
            "current_occupancy": 120,
            "available_capacity": 230,
            "type": "Community Hall",
            "facilities": "Toilets, Drinking Water, Medical Desk, Kitchen",
        },

        {
            "shelter_name": "Alamnagar Relief Shelter",
            "latitude": 25.85,
            "longitude": 86.70,
            "capacity": 280,
            "current_occupancy": 260,
            "available_capacity": 20,
            "type": "School",
            "facilities": "Toilets, Drinking Water",
        },

        {
            "shelter_name": "Singheshwar Temple Complex",
            "latitude": 25.98,
            "longitude": 86.80,
            "capacity": 450,
            "current_occupancy": 200,
            "available_capacity": 250,
            "type": "Religious Complex",
            "facilities": "Toilets, Drinking Water, Food Distribution",
        },

        {
            "shelter_name": "Bihariganj Block Office Camp",
            "latitude": 25.90,
            "longitude": 87.00,
            "capacity": 320,
            "current_occupancy": 80,
            "available_capacity": 240,
            "type": "Govt Building",
            "facilities": "Toilets, Drinking Water, Medical Desk, Electricity",
        },

        {
            "shelter_name": "Gwalpara School Camp",
            "latitude": 25.87,
            "longitude": 86.75,
            "capacity": 250,
            "current_occupancy": 240,
            "available_capacity": 10,
            "type": "School",
            "facilities": "Toilets, Drinking Water",
        },

        {
            "shelter_name": "Pratapganj High School Camp",
            "latitude": 26.28,
            "longitude": 86.62,
            "capacity": 380,
            "current_occupancy": 210,
            "available_capacity": 170,
            "type": "School",
            "facilities": "Toilets, Drinking Water, Food Distribution",
        },

        {
            "shelter_name": "Nirmali Relief Centre",
            "latitude": 26.30,
            "longitude": 86.58,
            "capacity": 420,
            "current_occupancy": 180,
            "available_capacity": 240,
            "type": "Community Hall",
            "facilities": "Toilets, Drinking Water, Medical Desk, Kitchen",
        },

        {
            "shelter_name": "Udakishunganj Block Camp",
            "latitude": 25.83,
            "longitude": 86.95,
            "capacity": 550,
            "current_occupancy": 300,
            "available_capacity": 250,
            "type": "Govt Building",
            "facilities": "Toilets, Drinking Water, Medical Desk, Electricity, Food Distribution",
        },

        {
            "shelter_name": "Shankarpur Primary School",
            "latitude": 25.91,
            "longitude": 86.88,
            "capacity": 220,
            "current_occupancy": 195,
            "available_capacity": 25,
            "type": "School",
            "facilities": "Toilets, Drinking Water",
        },

        {
            "shelter_name": "Kishanganj Road Temporary Camp",
            "latitude": 26.05,
            "longitude": 86.65,
            "capacity": 600,
            "current_occupancy": 140,
            "available_capacity": 460,
            "type": "Temporary Camp",
            "facilities": "Toilets, Drinking Water, Tents, Food Distribution",
        },

        {
            "shelter_name": "Gamharia Community Hall",
            "latitude": 25.915,
            "longitude": 86.97,
            "capacity": 300,
            "current_occupancy": 90,
            "available_capacity": 210,
            "type": "Community Hall",
            "facilities": "Toilets, Drinking Water, Medical Desk",
        },
    ]

    return {
        "status": "success",
        "total_shelters": len(shelters),
        "shelters": shelters,
    }


# ============================================================
# WEATHER
# ============================================================

@app.get("/api/weather")
def get_weather():

    try:

        latitude = 26.13
        longitude = 86.60

        weather_url = (
            "https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}"
            f"&longitude={longitude}"
            "&current=temperature_2m,"
            "relative_humidity_2m,"
            "precipitation,"
            "wind_speed_10m,"
            "weather_code"
            "&timezone=Asia%2FKolkata"
        )

        with urlopen(
            weather_url,
            timeout=10
        ) as response:

            data = json.loads(
                response.read().decode("utf-8")
            )

        current = data.get(
            "current",
            {}
        )

        temperature = current.get(
            "temperature_2m",
            0
        )

        humidity = current.get(
            "relative_humidity_2m",
            0
        )

        rainfall = current.get(
            "precipitation",
            0
        )

        wind_speed = current.get(
            "wind_speed_10m",
            0
        )

        weather_code = current.get(
            "weather_code",
            0
        )

        weather_map = {

            0: ("☀️", "Clear Sky"),
            1: ("🌤️", "Mainly Clear"),
            2: ("⛅", "Partly Cloudy"),
            3: ("☁️", "Overcast"),
            45: ("🌫️", "Fog"),
            48: ("🌫️", "Rime Fog"),
            51: ("🌦️", "Light Drizzle"),
            53: ("🌦️", "Drizzle"),
            55: ("🌧️", "Heavy Drizzle"),
            61: ("🌦️", "Light Rain"),
            63: ("🌧️", "Moderate Rain"),
            65: ("🌧️", "Heavy Rain"),
            71: ("🌨️", "Light Snow"),
            73: ("🌨️", "Snow"),
            75: ("❄️", "Heavy Snow"),
            80: ("🌦️", "Rain Showers"),
            81: ("🌧️", "Rain Showers"),
            82: ("⛈️", "Heavy Rain Showers"),
            95: ("⛈️", "Thunderstorm"),
            96: ("⛈️", "Thunderstorm with Hail"),
            99: ("⛈️", "Severe Thunderstorm"),
        }

        icon, condition = weather_map.get(
            weather_code,
            ("🌤️", "Unknown")
        )

        if rainfall >= 20:

            alert = "Heavy rainfall detected"

        elif rainfall >= 10:

            alert = "Moderate rainfall detected"

        elif weather_code in [95, 96, 99]:

            alert = "Thunderstorm warning"

        else:

            alert = ""

        return {

            "status": "success",

            "location": "Supaul, Bihar",

            "temperature": round(
                float(temperature),
                1
            ),

            "condition": condition,

            "humidity": int(
                humidity
            ),

            "windSpeed": round(
                float(wind_speed),
                1
            ),

            "rainfall": round(
                float(rainfall),
                1
            ),

            "icon": icon,

            "alert": alert,
        }

    except Exception as e:

        print(
            "Weather API error:",
            e
        )

        return {

            "status": "error",

            "location": "Supaul, Bihar",

            "temperature": 0,

            "condition": "Weather unavailable",

            "humidity": 0,

            "windSpeed": 0,

            "rainfall": 0,

            "icon": "⚠️",

            "alert": "Unable to fetch current weather",
        }


# ============================================================
# RISK ASSESSMENT
# ============================================================

@app.post("/risk")
def calculate_risk(payload: Any = Body(...)):

    try:

        # ----------------------------------------------------
        # ACCEPT BOTH FORMATS
        #
        # Format 1:
        # [...]
        #
        # Format 2:
        # {"villages": [...]}
        # ----------------------------------------------------

        if isinstance(payload, list):

            villages = payload

        elif isinstance(payload, dict):

            villages = payload.get(
                "villages",
                []
            )

        else:

            villages = []

        # ----------------------------------------------------
        # VALIDATE
        # ----------------------------------------------------

        if not isinstance(villages, list):

            return {
                "status": "error",
                "message": "Villages must be a list",
                "risk_assessment": [],
            }

        if len(villages) == 0:

            return {
                "status": "error",
                "message": "No villages provided",
                "risk_assessment": [],
            }

        # ----------------------------------------------------
        # NORMALIZE
        # ----------------------------------------------------

        normalized_villages = [
            normalize_village(village)
            for village in villages
        ]

        print(
            "Risk request received:",
            len(normalized_villages),
            "villages"
        )

        # ----------------------------------------------------
        # CALCULATE RISK
        # ----------------------------------------------------

        results = compute_risks(
            normalized_villages
        )

        if not isinstance(results, list):
            results = []

        print(
            "Risk results:",
            len(results)
        )

        return {

            "status": "success",

            "total_villages": len(results),

            "risk_assessment": results,
        }

    except Exception as e:

        print(
            "Risk calculation error:",
            repr(e)
        )

        return {

            "status": "error",

            "message": str(e),

            "risk_assessment": [],
        }


# ============================================================
# EVACUATION PLAN
# ============================================================

@app.post("/evacuation-plan")
def create_evacuation_plan(
    request: Any = Body(...)
):

    try:

        # ----------------------------------------------------
        # ACCEPT JSON OBJECT
        # ----------------------------------------------------

        if not isinstance(request, dict):

            return {

                "status": "error",

                "message":
                    "Request must be a JSON object",

                "summary": {

                    "total_population": 0,

                    "total_evacuated": 0,

                    "total_unassigned": 0,

                    "evacuation_completion_percentage": 0,
                },

                "evacuation_plan": [],
            }

        # ----------------------------------------------------
        # GET VILLAGES
        # ----------------------------------------------------

        villages = request.get(
            "villages",
            []
        )

        # ----------------------------------------------------
        # GET SHELTERS
        # ----------------------------------------------------

        shelters = request.get(
            "shelters",
            []
        )

        print(
            "Received evacuation request"
        )

        print(
            "Raw villages:",
            len(villages)
            if isinstance(villages, list)
            else "invalid"
        )

        print(
            "Raw shelters:",
            len(shelters)
            if isinstance(shelters, list)
            else "invalid"
        )

        # ----------------------------------------------------
        # VALIDATE VILLAGES
        # ----------------------------------------------------

        if not isinstance(villages, list) or not villages:

            return {

                "status": "error",

                "message":
                    "No villages provided",

                "summary": {

                    "total_population": 0,

                    "total_evacuated": 0,

                    "total_unassigned": 0,

                    "evacuation_completion_percentage": 0,
                },

                "evacuation_plan": [],
            }

        # ----------------------------------------------------
        # VALIDATE SHELTERS
        # ----------------------------------------------------

        if not isinstance(shelters, list) or not shelters:

            return {

                "status": "error",

                "message":
                    "No shelters provided",

                "summary": {

                    "total_population": 0,

                    "total_evacuated": 0,

                    "total_unassigned": 0,

                    "evacuation_completion_percentage": 0,
                },

                "evacuation_plan": [],
            }

        # ----------------------------------------------------
        # NORMALIZE
        # ----------------------------------------------------

        normalized_villages = [

            normalize_village(village)

            for village in villages

        ]

        normalized_shelters = [

            normalize_shelter(shelter)

            for shelter in shelters

        ]

        print(
            "Normalized villages:",
            len(normalized_villages)
        )

        print(
            "Normalized shelters:",
            len(normalized_shelters)
        )

        # ----------------------------------------------------
        # GENERATE PLAN
        # ----------------------------------------------------

        result = generate_evacuation_plan(

            normalized_villages,

            normalized_shelters

        )

        print(
            "Engine result type:",
            type(result).__name__
        )

        # ----------------------------------------------------
        # EXTRACT EVACUATION PLAN
        # ----------------------------------------------------

        generated_plan = []

        engine_summary = {}

        if isinstance(result, dict):

            # Normal expected format
            generated_plan = result.get(
                "evacuation_plan",
                []
            )

            engine_summary = result.get(
                "summary",
                {}
            )

            # Some engine versions may use "plans"
            if not generated_plan:

                generated_plan = result.get(
                    "plans",
                    []
                )

        elif isinstance(result, list):

            generated_plan = result

        # ----------------------------------------------------
        # SAFETY
        # ----------------------------------------------------

        if not isinstance(
            generated_plan,
            list
        ):

            generated_plan = []

        if not isinstance(
            engine_summary,
            dict
        ):

            engine_summary = {}

        print(
            "Generated village plans:",
            len(generated_plan)
        )

        # ====================================================
        # TOTAL POPULATION
        # ====================================================

        total_population = sum(

            int(
                village.get(
                    "population",
                    0
                ) or 0
            )

            for village in normalized_villages

        )

        # ====================================================
        # TOTAL EVACUATED
        # ====================================================

        total_evacuated = 0

        for item in generated_plan:

            if not isinstance(item, dict):
                continue

            evacuated = item.get(
                "total_evacuated",
                item.get(
                    "evacuated_population",
                    item.get(
                        "evacuated",
                        item.get(
                            "assigned",
                            0
                        )
                    )
                )
            )

            try:

                total_evacuated += int(
                    evacuated or 0
                )

            except Exception:

                pass

        # ----------------------------------------------------
        # LIMIT EVACUATED POPULATION
        # ----------------------------------------------------

        total_evacuated = min(
            total_evacuated,
            total_population
        )

        # ====================================================
        # UNASSIGNED
        # ====================================================

        total_unassigned = max(
            total_population -
            total_evacuated,
            0
        )

        # ====================================================
        # COMPLETION
        # ====================================================

        if total_population > 0:

            completion = (
                total_evacuated /
                total_population
            ) * 100

        else:

            completion = 0

        # ====================================================
        # SUMMARY
        # ====================================================

        summary = {

            "total_population":
                total_population,

            "total_evacuated":
                total_evacuated,

            "total_unassigned":
                total_unassigned,

            "evacuation_completion_percentage":
                round(
                    completion,
                    2
                ),
        }

        # ----------------------------------------------------
        # KEEP ADDITIONAL ENGINE SUMMARY VALUES
        # ----------------------------------------------------

        if engine_summary:

            for key, value in engine_summary.items():

                if key not in summary:

                    summary[key] = value

        # ====================================================
        # FINAL RESPONSE
        # ====================================================

        return {

            "status": "success",

            "summary": summary,

            "total_villages":
                len(normalized_villages),

            "total_shelters":
                len(normalized_shelters),

            "evacuation_plan":
                generated_plan,
        }

    except Exception as e:

        print(
            "EVACUATION PLAN ERROR:",
            repr(e)
        )

        return {

            "status": "error",

            "message":
                str(e),

            "summary": {

                "total_population": 0,

                "total_evacuated": 0,

                "total_unassigned": 0,

                "evacuation_completion_percentage": 0,
            },

            "evacuation_plan": [],
        }


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":
    import os
    import uvicorn

    port = int(os.environ.get("PORT", 8000))

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port
    )