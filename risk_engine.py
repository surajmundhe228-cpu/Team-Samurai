# ============================================================
# FLOOD RISK ENGINE
# ============================================================

def compute_risk(village):
    """
    Calculate flood risk for a village.

    Risk is based on:
    1. Hazard       - rainfall + river proximity
    2. Vulnerability - elevation
    3. Exposure      - population

    Returns a complete risk assessment.
    """

    # ========================================================
    # 1. INPUT DATA
    # ========================================================

    rainfall = float(
        village.get("rainfall_mm", 50.0)
    )

    river_distance = float(
        village.get("river_distance_km", 5.0)
    )

    elevation = float(
        village.get("elevation_m", 55.0)
    )

    population = int(
        village.get(
            "population_numeric_for_calc",
            500
        )
    )

    # ========================================================
    # 2. HAZARD SCORE
    # ========================================================

    # Higher rainfall = higher hazard
    rainfall_score = min(
        100.0,
        (rainfall / 120.0) * 60.0
    )

    # Closer river = higher hazard
    river_score = max(
        0.0,
        (5.0 - river_distance) * 8.0
    )

    hazard_score = min(
        100.0,
        rainfall_score + river_score
    )

    # ========================================================
    # 3. VULNERABILITY SCORE
    # ========================================================

    # Lower elevation = higher vulnerability
    vulnerability_score = max(
        20.0,
        min(
            100.0,
            100.0 - (elevation - 45.0) * 5.0
        )
    )

    # ========================================================
    # 4. EXPOSURE SCORE
    # ========================================================

    # Higher population = higher exposure
    exposure_score = min(
        100.0,
        (population / 850.0) * 100.0
    )

    # ========================================================
    # 5. COMPOSITE RISK SCORE
    # ========================================================

    composite = round(
        (0.40 * hazard_score)
        + (0.30 * vulnerability_score)
        + (0.30 * exposure_score),
        1
    )

    # ========================================================
    # 6. PRIORITY
    # ========================================================

    if composite >= 75:
        priority = "Critical"

    elif composite >= 55:
        priority = "High"

    elif composite >= 35:
        priority = "Medium"

    else:
        priority = "Low"

    # ========================================================
    # 7. RISK REASONS
    # ========================================================

    reasons = []

    if rainfall > 100:
        reasons.append(
            f"Excess rainfall: {rainfall} mm"
        )

    elif rainfall >= 75:
        reasons.append(
            f"Heavy rainfall: {rainfall} mm"
        )

    if river_distance <= 2:
        reasons.append(
            f"Very close to river: "
            f"{river_distance} km"
        )

    elif river_distance <= 5:
        reasons.append(
            f"Near river: "
            f"{river_distance} km"
        )

    if elevation < 50:
        reasons.append(
            f"Low elevation: "
            f"{elevation} m"
        )

    if population >= 700:
        reasons.append(
            f"High population exposure: "
            f"{population}"
        )

    # If no specific reason was detected
    if not reasons:
        reasons.append(
            "No major individual risk factor detected"
        )

    # ========================================================
    # 8. RISK LEVEL DESCRIPTION
    # ========================================================

    if priority == "Critical":
        risk_level = "Very High Flood Risk"

    elif priority == "High":
        risk_level = "High Flood Risk"

    elif priority == "Medium":
        risk_level = "Moderate Flood Risk"

    else:
        risk_level = "Low Flood Risk"

    # ========================================================
    # 9. FINAL RESULT
    # ========================================================

    return {
        "village": village.get(
            "village",
            "Unknown"
        ),

        "latitude": village.get(
            "latitude"
        ),

        "longitude": village.get(
            "longitude"
        ),

        "rainfall_mm": rainfall,

        "river_distance_km": river_distance,

        "elevation_m": elevation,

        "population": population,

        "hazard_score": round(
            hazard_score,
            1
        ),

        "vulnerability_score": round(
            vulnerability_score,
            1
        ),

        "exposure_score": round(
            exposure_score,
            1
        ),

        "risk_score": composite,

        "priority": priority,

        "risk_level": risk_level,

        "reasons": reasons
    }


# ============================================================
# MULTIPLE VILLAGES
# ============================================================

def compute_risks(villages):
    """
    Calculate risk for multiple villages.
    """

    results = []

    for village in villages:

        result = compute_risk(village)

        results.append(result)

    # Highest risk first
    results.sort(
        key=lambda x: x["risk_score"],
        reverse=True
    )

    return results


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
# MAIN PROGRAM
# ============================================================

if __name__ == "__main__":

    print("\n")
    print("=" * 70)
    print("             FLOOD RISK ASSESSMENT")
    print("=" * 70)

    results = compute_risks(
        sample_villages
    )

    for result in results:

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
            "Risk Level:",
            result["risk_level"]
        )

        print(
            "Hazard:",
            result["hazard_score"]
        )

        print(
            "Vulnerability:",
            result["vulnerability_score"]
        )

        print(
            "Exposure:",
            result["exposure_score"]
        )

        print("Reasons:")

        for reason in result["reasons"]:
            print("  -", reason)

    print("\n")
    print("=" * 70)