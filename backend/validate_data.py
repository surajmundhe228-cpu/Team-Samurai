import json
from pathlib import Path


BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "datab"


def load_json(filename):
    path = DATA_DIR / filename

    try:
        with open(path, "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"❌ File not found: {path}")
        return None
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON: {path}")
        return None


def validate_villages(villages):
    print("\n========== VILLAGE VALIDATION ==========")

    if not isinstance(villages, list):
        print("❌ villages.json must contain a list")
        return False

    required_fields = [
        "village",
        "district",
        "population",
        "latitude",
        "longitude",
        "rainfall_mm",
        "elevation_m",
        "distance_from_river_km",
        "flood_history",
        "hazard_score",
        "vulnerability_score",
        "exposure_score",
        "risk_score",
        "risk_level"
    ]

    valid = True
    village_names = set()

    for index, village in enumerate(villages, start=1):

        # Check required fields
        for field in required_fields:
            if field not in village:
                print(f"❌ Village #{index}: missing '{field}'")
                valid = False

        if "village" not in village:
            continue

        name = village["village"]

        # Check duplicate names
        if name in village_names:
            print(f"❌ Duplicate village: {name}")
            valid = False

        village_names.add(name)

        # Population
        if village.get("population", 0) <= 0:
            print(f"❌ {name}: invalid population")
            valid = False

        # Latitude
        latitude = village.get("latitude")
        if not isinstance(latitude, (int, float)) or not -90 <= latitude <= 90:
            print(f"❌ {name}: invalid latitude")
            valid = False

        # Longitude
        longitude = village.get("longitude")
        if not isinstance(longitude, (int, float)) or not -180 <= longitude <= 180:
            print(f"❌ {name}: invalid longitude")
            valid = False

        # Score validation
        score_fields = [
            "hazard_score",
            "vulnerability_score",
            "exposure_score",
            "risk_score"
        ]

        for field in score_fields:
            score = village.get(field)

            if not isinstance(score, (int, float)) or not 0 <= score <= 100:
                print(f"❌ {name}: invalid {field}")
                valid = False

    print(f"Total villages checked: {len(villages)}")

    if valid:
        print("✅ Village data validation PASSED")
    else:
        print("❌ Village data validation FAILED")

    return valid


def validate_shelters(shelters):
    print("\n========== SHELTER VALIDATION ==========")

    if not isinstance(shelters, list):
        print("❌ shelters.json must contain a list")
        return False

    required_fields = [
        "shelter_name",
        "latitude",
        "longitude",
        "capacity",
        "current_occupancy",
        "available_capacity",
        "type",
        "facilities"
    ]

    valid = True
    shelter_names = set()

    for index, shelter in enumerate(shelters, start=1):

        # Check required fields
        for field in required_fields:
            if field not in shelter:
                print(f"❌ Shelter #{index}: missing '{field}'")
                valid = False

        if "shelter_name" not in shelter:
            continue

        name = shelter["shelter_name"]

        # Check duplicate names
        if name in shelter_names:
            print(f"❌ Duplicate shelter: {name}")
            valid = False

        shelter_names.add(name)

        # Latitude
        latitude = shelter.get("latitude")
        if not isinstance(latitude, (int, float)) or not -90 <= latitude <= 90:
            print(f"❌ {name}: invalid latitude")
            valid = False

        # Longitude
        longitude = shelter.get("longitude")
        if not isinstance(longitude, (int, float)) or not -180 <= longitude <= 180:
            print(f"❌ {name}: invalid longitude")
            valid = False

        capacity = shelter.get("capacity")
        occupancy = shelter.get("current_occupancy")
        available = shelter.get("available_capacity")

        # Capacity
        if not isinstance(capacity, (int, float)) or capacity <= 0:
            print(f"❌ {name}: invalid capacity")
            valid = False

        # Occupancy
        if not isinstance(occupancy, (int, float)) or occupancy < 0:
            print(f"❌ {name}: invalid current_occupancy")
            valid = False

        # Occupancy cannot exceed capacity
        if (
            isinstance(capacity, (int, float))
            and isinstance(occupancy, (int, float))
            and occupancy > capacity
        ):
            print(f"❌ {name}: occupancy exceeds capacity")
            valid = False

        # Available capacity
        if (
            isinstance(capacity, (int, float))
            and isinstance(occupancy, (int, float))
            and isinstance(available, (int, float))
        ):
            expected = capacity - occupancy

            if available != expected:
                print(
                    f"❌ {name}: available_capacity is {available}, "
                    f"but should be {expected}"
                )
                valid = False

    print(f"Total shelters checked: {len(shelters)}")

    if valid:
        print("✅ Shelter data validation PASSED")
    else:
        print("❌ Shelter data validation FAILED")

    return valid


def main():
    villages = load_json("villages.json")
    shelters = load_json("shelters.json")

    if villages is None or shelters is None:
        print("\n❌ Validation stopped because a data file could not be loaded.")
        return

    villages_valid = validate_villages(villages)
    shelters_valid = validate_shelters(shelters)

    print("\n========== FINAL RESULT ==========")

    if villages_valid and shelters_valid:
        print("✅ ALL DATA VALIDATION PASSED")
    else:
        print("❌ DATA VALIDATION FOUND ERRORS")


if __name__ == "__main__":
    main()