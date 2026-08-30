# ============================================================
# FLOOD EVACUATION ENGINE
# ============================================================

import json

from risk_engine import compute_risks
from shelter_allocator import match_shelters


# ============================================================
# MERGE RISK DATA WITH ORIGINAL VILLAGE DATA
# ============================================================

def _prepare_villages_for_allocation(villages, risk_results):
    """
    Combine the original village information with the
    calculated risk information.

    risk_engine.py returns:
        population

    shelter_allocator.py expects:
        population_numeric_for_calc

    This function connects the two modules.
    """

    # Create lookup using village name
    risk_lookup = {
        result["village"]: result
        for result in risk_results
    }

    prepared_villages = []

    for village in villages:

        village_name = village.get("village")

        if village_name not in risk_lookup:
            raise ValueError(
                f"Risk result not found for village: "
                f"{village_name}"
            )

        risk = risk_lookup[village_name]

        # Start with original village data
        prepared = dict(village)

        # Add calculated risk information
        prepared["risk_score"] = risk["risk_score"]
        prepared["priority"] = risk["priority"]

        # risk_engine returns "population"
        # shelter_allocator expects "population_numeric_for_calc"
        prepared["population_numeric_for_calc"] = int(
            risk["population"]
        )

        # Make sure coordinates are available
        prepared["latitude"] = float(
            risk["latitude"]
        )

        prepared["longitude"] = float(
            risk["longitude"]
        )

        prepared_villages.append(prepared)

    return prepared_villages


# ============================================================
# MAIN EVACUATION ENGINE
# ============================================================

def generate_evacuation_plan(villages, shelters):
    """
    Generate a complete flood evacuation plan.

    Pipeline:

        Villages
           ↓
        Risk Engine
           ↓
        Risk assessment
           ↓
        Shelter preparation
           ↓
        Shelter allocator
           ↓
        Distance + capacity ranking
           ↓
        Evacuation allocation
           ↓
        Route coordinates
           ↓
        Final evacuation plan
    """

    # --------------------------------------------------------
    # INPUT VALIDATION
    # --------------------------------------------------------

    if not isinstance(villages, list):
        raise ValueError(
            "villages must be a list."
        )

    if not isinstance(shelters, list):
        raise ValueError(
            "shelters must be a list."
        )

    if len(villages) == 0:
        raise ValueError(
            "At least one village is required."
        )

    if len(shelters) == 0:
        raise ValueError(
            "At least one shelter is required."
        )

    # --------------------------------------------------------
    # STEP 1: CALCULATE FLOOD RISK
    # --------------------------------------------------------

    risk_results = compute_risks(
        villages
    )

    # --------------------------------------------------------
    # STEP 2: PREPARE VILLAGE DATA FOR ALLOCATION
    # --------------------------------------------------------

    prepared_villages = _prepare_villages_for_allocation(
        villages,
        risk_results
    )

    # --------------------------------------------------------
    # STEP 3: ALLOCATE SHELTERS
    # --------------------------------------------------------
    #
    # shelter_allocator.py handles:
    #
    #   - Haversine distance
    #   - Maximum shelter distance
    #   - Available space ratio
    #   - 60% distance weight
    #   - 40% space weight
    #   - Risk priority
    #   - Capacity-aware allocation
    #   - Multiple shelter allocation
    #   - Route coordinate generation
    #
    # --------------------------------------------------------

    evacuation_results = match_shelters(
        prepared_villages,
        shelters
    )

    # --------------------------------------------------------
    # STEP 4: CREATE FINAL PLAN
    # --------------------------------------------------------

    final_plan = {
        "status": "success",

        "total_villages": len(
            villages
        ),

        "total_shelters": len(
            shelters
        ),

        "risk_assessment": risk_results,

        "evacuation_plan": evacuation_results
    }

    return final_plan


# ============================================================
# LIVE EVACUATION PLAN
# ============================================================

def generate_live_evacuation_plan(villages, shelters):
    """
    FastAPI-friendly entry point.

    Member 6 can call:

        from engine import generate_live_evacuation_plan

        plan = generate_live_evacuation_plan(
            villages,
            shelters
        )

    The returned dictionary contains:
        - risk assessment
        - shelter allocations
        - evacuation status
        - route coordinates
    """

    return generate_evacuation_plan(
        villages,
        shelters
    )


# ============================================================
# SAVE PLAN TO JSON
# ============================================================

def save_evacuation_plan(
    plan,
    filename="evacuation_plan.json"
):
    """
    Save the final evacuation plan as JSON.
    """

    with open(
        filename,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            plan,
            file,
            indent=4,
            ensure_ascii=False
        )

    return filename


# ============================================================
# DISPLAY SUMMARY
# ============================================================

def print_summary(plan):
    """
    Print a human-readable summary.
    """

    print("\n")
    print("=" * 70)
    print("             FLOOD EVACUATION ENGINE")
    print("=" * 70)

    print(
        "\nStatus:",
        plan.get("status")
    )

    print(
        "Total Villages:",
        plan.get("total_villages", 0)
    )

    print(
        "Total Shelters:",
        plan.get("total_shelters", 0)
    )

    # --------------------------------------------------------
    # RISK SUMMARY
    # --------------------------------------------------------

    print("\nRISK SUMMARY")
    print("-" * 70)

    for village in plan.get(
        "risk_assessment",
        []
    ):

        print(
            f"{village['village']} | "
            f"Risk: {village['risk_score']} | "
            f"Priority: {village['priority']} | "
            f"{village['risk_level']}"
        )

    # --------------------------------------------------------
    # EVACUATION SUMMARY
    # --------------------------------------------------------

    print("\nEVACUATION SUMMARY")
    print("-" * 70)

    for result in plan.get(
        "evacuation_plan",
        []
    ):

        print(
            f"{result['village']} | "
            f"{result['status']} | "
            f"Evacuated: "
            f"{result['total_evacuated']}/"
            f"{result['population']} | "
            f"{result['evacuation_percentage']}%"
        )

        for route in result.get(
            "routes",
            []
        ):

            print(
                f"   → {route['shelter']} | "
                f"{route['distance_km']} km | "
                f"{route['evacuated']} people"
            )

            print(
                f"      Route points: "
                f"{len(route['route_coordinates'])}"
            )

    print("\n")
    print("=" * 70)


# ============================================================
# TEST DATA
# ============================================================

sample_villages = [

    {
        "village": "Rampur",

        "latitude": 26.175,
        "longitude": 86.710,

        "rainfall_mm": 112.0,
        "river_distance_km": 1.2,
        "elevation_m": 48.0,

        "population_numeric_for_calc": 850
    },

    {
        "village": "Shivapur",

        "latitude": 26.200,
        "longitude": 86.750,

        "rainfall_mm": 85.0,
        "river_distance_km": 3.0,
        "elevation_m": 52.0,

        "population_numeric_for_calc": 600
    },

    {
        "village": "Lakshmipur",

        "latitude": 26.160,
        "longitude": 86.690,

        "rainfall_mm": 60.0,
        "river_distance_km": 5.5,
        "elevation_m": 60.0,

        "population_numeric_for_calc": 250
    }
]


# ============================================================
# TEST SHELTERS
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
# RUN ENGINE DIRECTLY
# ============================================================

if __name__ == "__main__":

    try:

        print(
            "\nStarting Flood Evacuation Engine..."
        )

        # Generate complete evacuation plan
        plan = generate_live_evacuation_plan(
            sample_villages,
            sample_shelters
        )

        # Print readable summary
        print_summary(
            plan
        )

        # Save JSON
        filename = save_evacuation_plan(
            plan
        )

        print(
            f"\nJSON saved successfully as "
            f"'{filename}'"
        )

        print(
            "\nEngine executed successfully."
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