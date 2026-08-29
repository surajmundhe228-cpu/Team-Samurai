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