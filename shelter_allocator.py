import math
import json


# ============================================================
# CONFIGURATION
# ============================================================

# Maximum distance within which a shelter can be considered
MAX_SHELTER_DISTANCE_KM = 10.0

# Weight used for shelter ranking
DISTANCE_WEIGHT = 0.60
SPACE_WEIGHT = 0.40


# ============================================================
# HAVERSINE DISTANCE
# ============================================================

def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two latitude/longitude points.
    Returns distance in kilometres.
    """

    R = 6371.0

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )

    a = min(1.0, max(0.0, a))

    distance = R * 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return round(distance, 2)


# ============================================================
# PRIORITY VALUE
# ============================================================

def priority_value(priority):
    """
    Convert priority category into numerical value.
    Higher value = higher evacuation priority.
    """

    priority = str(priority).lower()

    priority_map = {
        "critical": 4,
        "high": 3,
        "medium": 2,
        "low": 1
    }

    return priority_map.get(priority, 0)


# ============================================================
# VALIDATE VILLAGE
# ============================================================

def validate_village(village):
    """
    Check whether required village information exists.
    """

    required_fields = [
        "village",
        "latitude",
        "longitude",
        "population_numeric_for_calc"
    ]

    for field in required_fields:

        if field not in village:
            raise ValueError(
                f"Village missing required field: {field}"
            )

    if village["population_numeric_for_calc"] < 0:

        raise ValueError(
            f"Population cannot be negative: "
            f"{village['village']}"
        )


# ============================================================
# VALIDATE SHELTER
# ============================================================

def validate_shelter(shelter):
    """
    Check whether required shelter information exists.
    """

    required_fields = [
        "shelter_name",
        "latitude",
        "longitude",
        "total_capacity",
        "available_capacity"
    ]

    for field in required_fields:

        if field not in shelter:
            raise ValueError(
                f"Shelter missing required field: {field}"
            )

    if shelter["total_capacity"] <= 0:

        raise ValueError(
            f"Total capacity must be greater than 0: "
            f"{shelter['shelter_name']}"
        )

    if shelter["available_capacity"] < 0:

        raise ValueError(
            f"Available capacity cannot be negative: "
            f"{shelter['shelter_name']}"
        )

    if shelter["available_capacity"] > shelter["total_capacity"]:

        raise ValueError(
            f"Available capacity cannot exceed total capacity: "
            f"{shelter['shelter_name']}"
        )


# ============================================================
# AVAILABLE SPACE RATIO
# ============================================================

def available_space_ratio(shelter):
    """
    Calculate how much space is currently available.

    Example:
        available = 300
        total = 500

        ratio = 0.60
    """

    return (
        shelter["available_capacity"]
        / shelter["total_capacity"]
    )


# ============================================================
# SHELTER RANKING SCORE
# ============================================================

def calculate_shelter_score(distance_km, space_ratio):
    """
    Calculate combined shelter ranking score.

    Lower score = better shelter.

    Factors:
        60% Distance
        40% Available space

    A closer shelter is preferred.
    A shelter with more available space is preferred.
    """

    # Normalize distance between 0 and 1
    distance_score = min(
        1.0,
        distance_km / MAX_SHELTER_DISTANCE_KM
    )

    # More available space = lower penalty
    space_score = 1.0 - space_ratio

    score = (
        DISTANCE_WEIGHT * distance_score
        + SPACE_WEIGHT * space_score
    )

    return round(score, 4)


# ============================================================
# ROUTE COORDINATES
# ============================================================

def generate_route_coordinates(
    start_lat,
    start_lon,
    end_lat,
    end_lon,
    number_of_points=6
):
    """
    Generate coordinate points between village and shelter.

    IMPORTANT:
    This creates a straight/interpolated evacuation corridor.
    It is NOT a road-following navigation route.

    Later this can be replaced with:
        OSRM
        OpenRouteService
        GraphHopper
        Google Maps API
    """

    number_of_points = max(
        2,
        int(number_of_points)
    )

    route = []

    for i in range(number_of_points):

        fraction = i / (number_of_points - 1)

        lat = (
            start_lat
            + (end_lat - start_lat) * fraction
        )

        lon = (
            start_lon
            + (end_lon - start_lon) * fraction
        )

        route.append([
            round(lat, 6),
            round(lon, 6)
        ])

    return route


# ============================================================
# SHELTER ALLOCATION
# ============================================================

def match_shelters(villages, shelters):
    """
    Allocate village populations to suitable shelters.

    Rules:

    1. Critical villages are processed first.
    2. Higher risk score gets higher priority.
    3. Shelters are ranked using:
           - Distance
           - Available space ratio
    4. Shelter must be within MAX_SHELTER_DISTANCE_KM.
    5. Shelter cannot exceed capacity.
    6. Population can be distributed across
       multiple shelters.
    7. Route coordinate points are returned.
    """

    # --------------------------------------------------------
    # VALIDATE INPUT
    # --------------------------------------------------------

    for village in villages:
        validate_village(village)

    for shelter in shelters:
        validate_shelter(shelter)

    # --------------------------------------------------------
    # COPY SHELTER DATA
    # --------------------------------------------------------

    shelter_pool = [
        dict(shelter)
        for shelter in shelters
    ]

    # --------------------------------------------------------
    # SORT VILLAGES BY RISK
    # --------------------------------------------------------

    villages_sorted = sorted(
        villages,
        key=lambda v: (
            priority_value(
                v.get("priority", "Low")
            ),
            float(
                v.get("risk_score", 0)
            )
        ),
        reverse=True
    )

    evacuation_plan = []

    # ========================================================
    # PROCESS EACH VILLAGE
    # ========================================================

    for village in villages_sorted:

        village_name = village["village"]

        population = int(
            village["population_numeric_for_calc"]
        )

        latitude = float(
            village["latitude"]
        )

        longitude = float(
            village["longitude"]
        )

        risk_score = float(
            village.get("risk_score", 0)
        )

        priority = village.get(
            "priority",
            "Low"
        )

        remaining = population

        assigned_routes = []

        # ----------------------------------------------------
        # FIND AND RANK SHELTERS
        # ----------------------------------------------------

        ranked_shelters = []

        for shelter in shelter_pool:

            if shelter["available_capacity"] <= 0:
                continue

            shelter_lat = float(
                shelter["latitude"]
            )

            shelter_lon = float(
                shelter["longitude"]
            )

            # Calculate distance
            distance = haversine(
                latitude,
                longitude,
                shelter_lat,
                shelter_lon
            )

            # Ignore shelters farther than maximum distance
            if distance > MAX_SHELTER_DISTANCE_KM:
                continue

            # Calculate available space ratio
            space_ratio = available_space_ratio(
                shelter
            )

            # Calculate combined ranking score
            ranking_score = calculate_shelter_score(
                distance,
                space_ratio
            )

            ranked_shelters.append(
                {
                    "shelter": shelter,
                    "distance": distance,
                    "space_ratio": round(
                        space_ratio,
                        3
                    ),
                    "ranking_score": ranking_score
                }
            )

        # ----------------------------------------------------
        # SORT BY COMBINED SCORE
        # ----------------------------------------------------

        ranked_shelters.sort(
            key=lambda x: x["ranking_score"]
        )

        # ----------------------------------------------------
        # ALLOCATE PEOPLE
        # ----------------------------------------------------

        for item in ranked_shelters:

            if remaining <= 0:
                break

            shelter = item["shelter"]

            distance = item["distance"]

            ranking_score = item["ranking_score"]

            # Available capacity BEFORE allocation
            available_before = int(
                shelter["available_capacity"]
            )

            if available_before <= 0:
                continue

            # Allocate people
            evacuated = min(
                remaining,
                available_before
            )

            if evacuated <= 0:
                continue

            # Update shelter capacity
            shelter["available_capacity"] -= evacuated

            # Update remaining village population
            remaining -= evacuated

            # New remaining capacity
            remaining_capacity = int(
                shelter["available_capacity"]
            )

            # Current space ratio after allocation
            new_space_ratio = (
                remaining_capacity
                / shelter["total_capacity"]
            )

            # ------------------------------------------------
            # GENERATE ROUTE COORDINATES
            # ------------------------------------------------

            route_coordinates = generate_route_coordinates(
                latitude,
                longitude,
                float(shelter["latitude"]),
                float(shelter["longitude"])
            )

            # ------------------------------------------------
            # ADD ROUTE
            # ------------------------------------------------

            assigned_routes.append(
                {
                    "shelter": shelter["shelter_name"],

                    "distance_km": distance,

                    "ranking_score": ranking_score,

                    "available_space_ratio_before":
                        item["space_ratio"],

                    "evacuated":
                        evacuated,

                    "remaining_capacity":
                        remaining_capacity,

                    "available_space_ratio_after":
                        round(
                            new_space_ratio,
                            3
                        ),

                    "start_coordinates": [
                        latitude,
                        longitude
                    ],

                    "shelter_coordinates": [
                        float(shelter["latitude"]),
                        float(shelter["longitude"])
                    ],

                    "route_coordinates":
                        route_coordinates
                }
            )

        # ====================================================
        # FINAL STATISTICS
        # ====================================================

        total_evacuated = (
            population - remaining
        )

        if population > 0:

            evacuation_percentage = round(
                (
                    total_evacuated
                    / population
                ) * 100,
                1
            )

        else:

            evacuation_percentage = 100.0

        # ====================================================
        # STATUS
        # ====================================================

        if remaining == 0:

            status = "Fully Evacuated"

        elif total_evacuated > 0:

            status = "Partially Evacuated"

        else:

            status = "No Shelter Available"

        # ====================================================
        # ADD FINAL RESULT
        # ====================================================

        evacuation_plan.append(
            {
                "village": village_name,

                "risk_score": risk_score,

                "priority": priority,

                "population": population,

                "total_evacuated":
                    total_evacuated,

                "unassigned":
                    remaining,

                "evacuation_percentage":
                    evacuation_percentage,

                "status":
                    status,

                "routes":
                    assigned_routes
            }
        )

    return evacuation_plan


# ============================================================
# PRINT PLAN
# ============================================================

def print_plan(plan):

    print("\n")
    print("=" * 80)
    print("        FLOOD EVACUATION SHELTER ALLOCATION PLAN")
    print("=" * 80)

    for result in plan:

        print("\nVillage:", result["village"])

        print(
            "Risk Score:",
            result["risk_score"]
        )

        print(
            "Priority:",
            result["priority"]
        )

        print(
            "Population:",
            result["population"]
        )

        print(
            "Total Evacuated:",
            result["total_evacuated"]
        )

        print(
            "Unassigned:",
            result["unassigned"]
        )

        print(
            "Evacuation:",
            f"{result['evacuation_percentage']}%"
        )

        print(
            "Status:",
            result["status"]
        )

        print("\nRoutes:")

        if not result["routes"]:

            print(
                "  No suitable shelter available."
            )

        else:

            for route in result["routes"]:

                print(
                    f"  → {route['shelter']} | "
                    f"Distance: "
                    f"{route['distance_km']} km | "
                    f"Ranking Score: "
                    f"{route['ranking_score']} | "
                    f"People: "
                    f"{route['evacuated']} | "
                    f"Remaining Capacity: "
                    f"{route['remaining_capacity']}"
                )

                print(
                    "    Route:",
                    route["route_coordinates"]
                )

    print("\n")
    print("=" * 80)


# ============================================================
# TEST DATA
# ============================================================

sample_villages = [

    {
        "village": "Rampur",
        "latitude": 26.175,
        "longitude": 86.710,
        "population_numeric_for_calc": 500,
        "risk_score": 90.1,
        "priority": "Critical"
    },

    {
        "village": "Shivapur",
        "latitude": 26.200,
        "longitude": 86.750,
        "population_numeric_for_calc": 400,
        "risk_score": 68.5,
        "priority": "High"
    },

    {
        "village": "Lakshmipur",
        "latitude": 26.160,
        "longitude": 86.690,
        "population_numeric_for_calc": 250,
        "risk_score": 42.0,
        "priority": "Medium"
    }
]


# ============================================================
# SHELTER DATA
# ============================================================

sample_shelters = [

    {
        "shelter_name": "Camp A",
        "latitude": 26.180,
        "longitude": 86.720,
        "total_capacity": 500,
        "available_capacity": 300
    },

    {
        "shelter_name": "Camp B",
        "latitude": 26.210,
        "longitude": 86.680,
        "total_capacity": 600,
        "available_capacity": 400
    },

    {
        "shelter_name": "Camp C",
        "latitude": 26.150,
        "longitude": 86.700,
        "total_capacity": 500,
        "available_capacity": 350
    }
]


# ============================================================
# MAIN PROGRAM
# ============================================================

if __name__ == "__main__":

    try:

        # Generate evacuation plan
        plan = match_shelters(
            sample_villages,
            sample_shelters
        )

        # Print readable output
        print_plan(plan)

        # Save JSON
        with open(
            "evacuation_plan.json",
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                plan,
                file,
                indent=4
            )

        print(
            "\nJSON saved successfully as "
            "'evacuation_plan.json'"
        )

    except ValueError as error:

        print(
            "\nInput Error:",
            error
        )

    except Exception as error:

        print(
            "\nUnexpected Error:",
            error
        )