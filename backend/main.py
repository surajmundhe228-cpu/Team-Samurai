from fastapi import FastAPI
from fastapi import HTTPException
from schemas import IncidentCreate, AuthorityLogin
import json
from pathlib import Path 

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

VILLAGES_FILE = DATA_DIR / "villages.json"
SHELTERS_FILE = DATA_DIR / "shelters.json"
MAP_FILE = DATA_DIR / "map.json"

app = FastAPI(
    title="RELOC8 API",
    description="Backend for the RELOC8 disaster risk and relocation system",
    version="1.0.0"
)

def load_json_file(file_path):
    try:
        if not file_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Data file not found: {file_path.name}"
            )

        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)

    except HTTPException:
        raise

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid JSON data in: {file_path.name}"
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to read data file"
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


@app.post("/incidents")
def create_incident(incident: IncidentCreate):
    try:
        return {
            "message": "Incident reported successfully",
            "incident": incident.model_dump()
        }
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to report incident"
        )


@app.post("/authority/login")
def authority_login(login: AuthorityLogin):
    try:
        if login.username == "admin" and login.password == "admin123":
            return {
                "message": "Login successful",
                "username": login.username
            }

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to process login"
        )
@app.get("/offline/villages")
def get_offline_villages():
    try:
        data = load_json_file(VILLAGES_FILE)

        return {
            "offline": True,
            "villages": data.get("villages", [])
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to load offline village data"
        )

@app.get("/offline/shelters")
def get_offline_shelters():
    try:
        data = load_json_file(SHELTERS_FILE)

        return {
            "offline": True,
            "shelters": data.get("shelters", [])
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to load offline shelter data"
        )
@app.get("/offline/map")
def get_offline_map():
    try:
        data = load_json_file(MAP_FILE)

        return {
            "offline": True,
            "map": data.get("map", {})
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to load offline map data"
        )
@app.get("/offline/bundle")
def get_offline_bundle():
    try:
        villages = load_json_file(VILLAGES_FILE)
        shelters = load_json_file(SHELTERS_FILE)
        map_data = load_json_file(MAP_FILE)

        return {
            "offline": True,
            "villages": villages.get("villages", []),
            "shelters": shelters.get("shelters", []),
            "map": map_data.get("map", {})
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to create offline bundle"
        )