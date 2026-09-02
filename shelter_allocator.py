# ============================================================
# FLOOD SHELTER ALLOCATION ENGINE
# ============================================================

import math


# ============================================================
# CONFIGURATION
# ============================================================

MAX_SHELTER_DISTANCE_KM = 10.0

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

    priority = str(
        priority
    ).lower()

    priority_map = {
        "critical": 4,
        "high": 3,
        "medium": 2,
        "low": 1
    }

    return priority_map.get(
        priority,
        0
    )


# ============================================================
# VALIDATE VILLAGE
# ============================================================

def validate_village(village):

    required_fields = [
        "village",
        "latitude",
        "longitude"
    ]

    for field in required_fields:

        if field not in village:

            raise ValueError(
                f"Village missing required field: {field}"
            )

    population = village.get(
        "population",
        village.get(
            "population_numeric_for_calc",
            0
        )
    )

    if population < 0:

        raise ValueError(
            f"Population cannot be negative: "
            f"{village['village']}"
        )


# ============================================================
# VALIDATE SHELTER
# ============================================================

def validate_shelter(shelter):

    required_fields = [
        "shelter_name",
        "latitude",
        "longitude",
        "capacity",
        "available_capacity"
    ]

    for field in required_fields:

        if field not in shelter:

            raise ValueError(
                f"Shelter missing required field: {field}"
            )

    capacity = int(
        shelter["capacity"]
    )

    available = int(
        shelter["available_capacity"]
    )

    if capacity <= 0:

        raise ValueError(
            f"Capacity must be greater than 0: "
            f"{shelter['shelter_name']}"
        )

    if available < 0:

        raise ValueError(
            f"Available capacity cannot be negative: "
            f"{shelter['shelter_name']}"
        )

    if available > capacity:

        raise ValueError(
            f"Available capacity cannot exceed capacity: "
            f"{shelter['shelter_name']}"
        )


# ============================================================
# AVAILABLE SPACE RATIO
# ============================================================

def available_space_ratio(shelter):

    return (
        shelter["available_capacity"]
        / shelter["capacity"]
    )


# ============================================================
# SHELTER RANKING SCORE
# ============================================================

def calculate_shelter_score(
    distance_km,
    space_ratio
):
    """
    Lower score = better shelter.

    60% = distance
    40% = available space
    """

    distance_score = min(
        1.0,
        distance_km / MAX_SHELTER_DISTANCE_KM
    )

    space_score = 1.0 - space_ratio

    score = (
        DISTANCE_WEIGHT * distance_score
        + SPACE_WEIGHT * space_score
    )

    return round(
        score,
        4
    )


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
    Generates an approximate straight-line corridor.

    This is NOT road navigation.
    """

    number_of_points = max(
        2,
        int(number_of_points)
    )

    route = []

    for i in range(number_of_points):

        fraction = (
            i /
            (number_of_points - 1)
        )

        lat = (
            start_lat
            + (
                end_lat - start_lat
            ) * fraction
        )

        lon = (
            start_lon
            + (
                end_lon - start_lon
            ) * fraction
        )

        route.append([
            round(lat, 6),
            round(lon, 6)
        ])

    return route


# ============================================================
# SHELTER ALLOCATION
# ============================================================

def match_shelters(
    villages,
    shelters
):
    """
    Match villages with suitable shelters.

    Rules:

    1. Critical villages first.
    2. Higher risk score first.
    3. Nearest + available-space shelters preferred.
    4. Maximum distance = 10 km.
    5. Shelter capacity cannot be exceeded.
    6. Village population can be divided between shelters.
    7. Route coordinates are returned.
    """

    # ========================================================
    # VALIDATE
    # ========================================================

    for village in villages:

        validate_village(
            village
        )

    for shelter in shelters:

        validate_shelter(
            shelter
        )

    # ========================================================
    # CREATE SHELTER POOL
    # ========================================================

    shelter_pool = []

    for shelter in shelters:

        item = dict(
            shelter
        )

        # Ensure integers
        item["capacity"] = int(
            item["capacity"]
        )

        item["available_capacity"] = int(
            item["available_capacity"]
        )

        # Occupancy calculation
        item["current_occupancy"] = (
            item["capacity"]
            - item["available_capacity"]
        )

        shelter_pool.append(
            item
        )

    # ========================================================
    # SORT VILLAGES BY RISK
    # ========================================================

    villages_sorted = sorted(

        villages,

        key=lambda v: (

            priority_value(
                v.get(
                    "priority",
                    v.get(
                        "risk_level",
                        "Low"
                    )
                )
            ),

            float(
                v.get(
                    "risk_score",
                    0
                )
            )
        ),

        reverse=True
    )

    evacuation_plan = []

    # ========================================================
    # PROCESS EACH VILLAGE
    # ========================================================

    for village in villages_sorted:

        village_name = village[
            "village"
        ]

        district = village.get(
            "district",
            "Unknown"
        )

        population = int(
            village.get(
                "population",
                village.get(
                    "population_numeric_for_calc",
                    0
                )
            )
        )

        latitude = float(
            village["latitude"]
        )

        longitude = float(
            village["longitude"]
        )

        risk_score = float(
            village.get(
                "risk_score",
                0
            )
        )

        risk_level = village.get(
            "risk_level",
            village.get(
                "priority",
                "LOW"
            )
        )

        # Convert risk level to priority
        if str(
            risk_level
        ).upper() == "CRITICAL":

            priority = "Critical"

        elif str(
            risk_level
        ).upper() == "HIGH":

            priority = "High"

        elif str(
            risk_level
        ).upper() == "MEDIUM":

            priority = "Medium"

        else:

            priority = "Low"

        remaining = population

        assigned_routes = []

        # ====================================================
        # FIND SUITABLE SHELTERS
        # ====================================================

        ranked_shelters = []

        for shelter in shelter_pool:

            if (
                shelter[
                    "available_capacity"
                ] <= 0
            ):

                continue

            shelter_lat = float(
                shelter["latitude"]
            )

            shelter_lon = float(
                shelter["longitude"]
            )

            distance = haversine(

                latitude,
                longitude,

                shelter_lat,
                shelter_lon
            )

            # Maximum allowed distance
            if (
                distance
                > MAX_SHELTER_DISTANCE_KM
            ):

                continue

            space_ratio = (
                available_space_ratio(
                    shelter
                )
            )

            ranking_score = (
                calculate_shelter_score(
                    distance,
                    space_ratio
                )
            )

            ranked_shelters.append({

                "shelter": shelter,

                "distance": distance,

                "space_ratio": round(
                    space_ratio,
                    3
                ),

                "ranking_score":
                    ranking_score
            })

        # ====================================================
        # SORT SHELTERS
        # ====================================================

        ranked_shelters.sort(

            key=lambda x:
                x["ranking_score"]
        )

        # ====================================================
        # ALLOCATE PEOPLE
        # ====================================================

        for item in ranked_shelters:

            if remaining <= 0:

                break

            shelter = item[
                "shelter"
            ]

            distance = item[
                "distance"
            ]

            ranking_score = item[
                "ranking_score"
            ]

            available_before = int(
                shelter[
                    "available_capacity"
                ]
            )

            if available_before <= 0:

                continue

            # Allocate
            evacuated = min(

                remaining,

                available_before
            )

            if evacuated <= 0:

                continue

            # Update shelter
            shelter[
                "available_capacity"
            ] -= evacuated

            shelter[
                "current_occupancy"
            ] += evacuated

            remaining -= evacuated

            # Remaining capacity
            remaining_capacity = int(
                shelter[
                    "available_capacity"
                ]
            )

            # New space ratio
            new_space_ratio = (

                remaining_capacity
                / shelter["capacity"]
            )

            # =================================================
            # ROUTE
            # =================================================

            route_coordinates = (
                generate_route_coordinates(

                    latitude,
                    longitude,

                    float(
                        shelter["latitude"]
                    ),

                    float(
                        shelter["longitude"]
                    )
                )
            )

            # =================================================
            # ADD ASSIGNMENT
            # =================================================

            assigned_routes.append({

                "shelter":
                    shelter["shelter_name"],

                "shelter_type":
                    shelter.get(
                        "type",
                        "Unknown"
                    ),

                "facilities":
                    shelter.get(
                        "facilities",
                        ""
                    ),

                "distance_km":
                    distance,

                "ranking_score":
                    ranking_score,

                "available_capacity_before":
                    available_before,

                "evacuated":
                    evacuated,

                "remaining_capacity":
                    remaining_capacity,

                "current_occupancy":
                    shelter[
                        "current_occupancy"
                    ],

                "capacity":
                    shelter[
                        "capacity"
                    ],

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

                    float(
                        shelter["latitude"]
                    ),

                    float(
                        shelter["longitude"]
                    )
                ],

                "route_coordinates":
                    route_coordinates
            })

        # ====================================================
        # STATISTICS
        # ====================================================

        total_evacuated = (

            population
            - remaining
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

            status = (
                "Fully Evacuated"
            )

        elif total_evacuated > 0:

            status = (
                "Partially Evacuated"
            )

        else:

            status = (
                "No Shelter Available"
            )

        # ====================================================
        # FINAL VILLAGE RESULT
        # ====================================================

        evacuation_plan.append({

            "village":
                village_name,

            "district":
                district,

            "latitude":
                latitude,

            "longitude":
                longitude,

            "population":
                population,

            "risk_score":
                risk_score,

            "risk_level":
                str(
                    risk_level
                ).upper(),

            "priority":
                priority,

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
        })

    return evacuation_plan


# ============================================================
# SHELTER SUMMARY
# ============================================================

def get_shelter_summary(shelters):
    """
    Generate summary statistics for dashboard.
    """

    total_capacity = 0

    total_occupancy = 0

    total_available = 0

    full_or_nearly_full = 0

    available_shelters = 0

    for shelter in shelters:

        capacity = int(
            shelter.get(
                "capacity",
                shelter.get(
                    "total_capacity",
                    0
                )
            )
        )

        available = int(
            shelter.get(
                "available_capacity",
                0
            )
        )

        occupancy = int(
            shelter.get(
                "current_occupancy",
                capacity - available
            )
        )

        total_capacity += capacity

        total_occupancy += occupancy

        total_available += available

        if available > 0:

            available_shelters += 1

        occupancy_percentage = (

            occupancy / capacity * 100
        ) if capacity > 0 else 0

        if occupancy_percentage >= 90:

            full_or_nearly_full += 1

    utilization = (

        total_occupancy
        / total_capacity
        * 100

    ) if total_capacity > 0 else 0

    return {

        "total_shelters":
            len(shelters),

        "total_capacity":
            total_capacity,

        "total_occupancy":
            total_occupancy,

        "total_available":
            total_available,

        "available_shelters":
            available_shelters,

        "full_or_nearly_full":
            full_or_nearly_full,

        "utilization_percentage":
            round(
                utilization,
                1
            )
    }