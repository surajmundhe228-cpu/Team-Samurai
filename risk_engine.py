# ============================================================
# FLOOD RISK ENGINE
# ============================================================

def compute_risk(village):
    """
    Calculate / read flood risk for one village.

    Supports:
        - population
        - rainfall
        - elevation
        - distance_from_river_km
        - river_distance_km

    If calculated risk scores are already present in the
    input data, those values are preserved.
    """

    # ========================================================
    # 1. BASIC INPUT DATA
    # ========================================================

    village_name = village.get(
        "village",
        "Unknown"
    )

    district = village.get(
        "district",
        "Unknown"
    )

    latitude = float(
        village.get(
            "latitude",
            0
        )
    )

    longitude = float(
        village.get(
            "longitude",
            0
        )
    )

    rainfall = float(
        village.get(
            "rainfall_mm",
            50.0
        )
    )

    # --------------------------------------------------------
    # SUPPORT BOTH FIELD NAMES
    # --------------------------------------------------------

    river_distance = float(
        village.get(
            "distance_from_river_km",
            village.get(
                "river_distance_km",
                5.0
            )
        )
    )

    elevation = float(
        village.get(
            "elevation_m",
            55.0
        )
    )

    population = int(
        village.get(
            "population",
            village.get(
                "population_numeric_for_calc",
                500
            )
        )
    )

    flood_history = village.get(
        "flood_history",
        "Unknown"
    )

    # ========================================================
    # 2. HAZARD SCORE
    # ========================================================

    # If score is already supplied in your dataset,
    # use it directly.

    if "hazard_score" in village:

        hazard_score = float(
            village["hazard_score"]
        )

    else:

        # Rainfall contribution
        rainfall_score = min(
            100.0,
            (rainfall / 120.0) * 60.0
        )

        # River proximity contribution
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

    if "vulnerability_score" in village:

        vulnerability_score = float(
            village["vulnerability_score"]
        )

    else:

        vulnerability_score = max(
            20.0,
            min(
                100.0,
                100.0 -
                (elevation - 45.0) * 5.0
            )
        )

    # ========================================================
    # 4. EXPOSURE SCORE
    # ========================================================

    if "exposure_score" in village:

        exposure_score = float(
            village["exposure_score"]
        )

    else:

        exposure_score = min(
            100.0,
            (population / 850.0) * 100.0
        )

    # ========================================================
    # 5. COMPOSITE RISK SCORE
    # ========================================================

    if "risk_score" in village:

        risk_score = float(
            village["risk_score"]
        )

    else:

        risk_score = round(
            (0.40 * hazard_score)
            + (0.30 * vulnerability_score)
            + (0.30 * exposure_score),
            1
        )

    # ========================================================
    # 6. RISK LEVEL
    # ========================================================

    # If your dataset already contains risk_level,
    # preserve it.

    if "risk_level" in village:

        risk_level = str(
            village["risk_level"]
        ).upper()

    else:

        if risk_score >= 75:

            risk_level = "CRITICAL"

        elif risk_score >= 55:

            risk_level = "HIGH"

        elif risk_score >= 35:

            risk_level = "MEDIUM"

        else:

            risk_level = "LOW"

    # ========================================================
    # 7. PRIORITY
    # ========================================================

    if risk_level == "CRITICAL":

        priority = "Critical"

    elif risk_level == "HIGH":

        priority = "High"

    elif risk_level == "MEDIUM":

        priority = "Medium"

    else:

        priority = "Low"

    # ========================================================
    # 8. RISK REASONS
    # ========================================================

    reasons = []

    # Rainfall
    if rainfall > 100:

        reasons.append(
            f"Excess rainfall: {rainfall} mm"
        )

    elif rainfall >= 75:

        reasons.append(
            f"Heavy rainfall: {rainfall} mm"
        )

    # River distance
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

    # Elevation
    if elevation < 50:

        reasons.append(
            f"Low elevation: "
            f"{elevation} m"
        )

    # Population
    if population >= 700:

        reasons.append(
            f"High population exposure: "
            f"{population}"
        )

    # Flood history
    if flood_history == "High":

        reasons.append(
            "High flood history"
        )

    elif flood_history == "Medium":

        reasons.append(
            "Medium flood history"
        )

    # Default reason
    if not reasons:

        reasons.append(
            "No major individual risk factor detected"
        )

    # ========================================================
    # 9. RISK DESCRIPTION
    # ========================================================

    if risk_level == "CRITICAL":

        risk_description = (
            "Very High Flood Risk"
        )

    elif risk_level == "HIGH":

        risk_description = (
            "High Flood Risk"
        )

    elif risk_level == "MEDIUM":

        risk_description = (
            "Moderate Flood Risk"
        )

    else:

        risk_description = (
            "Low Flood Risk"
        )

    # ========================================================
    # 10. FINAL RESULT
    # ========================================================

    return {

        # ----------------------------------------------------
        # BASIC VILLAGE INFORMATION
        # ----------------------------------------------------

        "village": village_name,

        "district": district,

        "latitude": latitude,

        "longitude": longitude,

        "population": population,

        # ----------------------------------------------------
        # ENVIRONMENT DATA
        # ----------------------------------------------------

        "rainfall_mm": rainfall,

        "elevation_m": elevation,

        "distance_from_river_km": (
            river_distance
        ),

        # Keep old field name for compatibility
        "river_distance_km": (
            river_distance
        ),

        "flood_history": flood_history,

        # ----------------------------------------------------
        # RISK SCORES
        # ----------------------------------------------------

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

        "risk_score": round(
            risk_score,
            1
        ),

        # ----------------------------------------------------
        # RISK CLASSIFICATION
        # ----------------------------------------------------

        "risk_level": risk_level,

        "priority": priority,

        "risk_description": risk_description,

        # ----------------------------------------------------
        # REASONS
        # ----------------------------------------------------

        "reasons": reasons
    }


# ============================================================
# MULTIPLE VILLAGES
# ============================================================

def compute_risks(villages):
    """
    Calculate risk for multiple villages.

    Highest risk villages are returned first.
    """

    results = []

    for village in villages:

        result = compute_risk(
            village
        )

        results.append(
            result
        )

    # Highest risk first
    results.sort(
        key=lambda x: x["risk_score"],
        reverse=True
    )

    return results


# ============================================================
# GET RISK SUMMARY
# ============================================================

def get_risk_summary(results):
    """
    Generate statistics for React dashboard.
    """

    critical = 0
    high = 0
    medium = 0
    low = 0

    total_population = 0

    for result in results:

        risk_level = result.get(
            "risk_level",
            "LOW"
        )

        if risk_level == "CRITICAL":

            critical += 1

        elif risk_level == "HIGH":

            high += 1

        elif risk_level == "MEDIUM":

            medium += 1

        else:

            low += 1

        total_population += int(
            result.get(
                "population",
                0
            )
        )

    return {

        "total_villages": len(
            results
        ),

        "critical": critical,

        "high": high,

        "medium": medium,

        "low": low,

        "total_population": (
            total_population
        )
    }


# ============================================================
# TEST DATA
# ============================================================

sample_villages = [

    {
        "village": "Rampur",
        "district": "Supaul",
        "population": 850,
        "latitude": 26.120,
        "longitude": 86.920,
        "rainfall_mm": 112.0,
        "elevation_m": 48,
        "distance_from_river_km": 1.2,
        "flood_history": "High",
        "hazard_score": 90,
        "vulnerability_score": 85,
        "exposure_score": 88,
        "risk_score": 88,
        "risk_level": "CRITICAL"
    },

    {
        "village": "Bishanpur",
        "district": "Supaul",
        "population": 620,
        "latitude": 26.135,
        "longitude": 86.910,
        "rainfall_mm": 108.0,
        "elevation_m": 51,
        "distance_from_river_km": 2.5,
        "flood_history": "High",
        "hazard_score": 86,
        "vulnerability_score": 80,
        "exposure_score": 78,
        "risk_score": 82,
        "risk_level": "CRITICAL"
    },

    {
        "village": "Jorgama",
        "district": "Madhepura",
        "population": 720,
        "latitude": 25.920,
        "longitude": 86.790,
        "rainfall_mm": 105.5,
        "elevation_m": 46,
        "distance_from_river_km": 1.8,
        "flood_history": "High",
        "hazard_score": 88,
        "vulnerability_score": 82,
        "exposure_score": 84,
        "risk_score": 85,
        "risk_level": "CRITICAL"
    },

    {
        "village": "Pratapganj",
        "district": "Supaul",
        "population": 580,
        "latitude": 26.290,
        "longitude": 87.010,
        "rainfall_mm": 110.0,
        "elevation_m": 50,
        "distance_from_river_km": 2.0,
        "flood_history": "High",
        "hazard_score": 87,
        "vulnerability_score": 78,
        "exposure_score": 80,
        "risk_score": 82,
        "risk_level": "CRITICAL"
    },

    {
        "village": "Udakishunganj",
        "district": "Madhepura",
        "population": 670,
        "latitude": 25.500,
        "longitude": 86.920,
        "rainfall_mm": 107.0,
        "elevation_m": 47,
        "distance_from_river_km": 1.5,
        "flood_history": "High",
        "hazard_score": 89,
        "vulnerability_score": 80,
        "exposure_score": 83,
        "risk_score": 84,
        "risk_level": "CRITICAL"
    },

    {
        "village": "Pipra",
        "district": "Supaul",
        "population": 480,
        "latitude": 26.140,
        "longitude": 86.940,
        "rainfall_mm": 98.0,
        "elevation_m": 55,
        "distance_from_river_km": 4.0,
        "flood_history": "Medium",
        "hazard_score": 72,
        "vulnerability_score": 70,
        "exposure_score": 68,
        "risk_score": 70,
        "risk_level": "HIGH"
    },

    {
        "village": "Aurahi",
        "district": "Madhepura",
        "population": 540,
        "latitude": 25.890,
        "longitude": 86.750,
        "rainfall_mm": 102.0,
        "elevation_m": 49,
        "distance_from_river_km": 3.2,
        "flood_history": "Medium",
        "hazard_score": 75,
        "vulnerability_score": 72,
        "exposure_score": 74,
        "risk_score": 74,
        "risk_level": "HIGH"
    },

    {
        "village": "Gopalpur",
        "district": "Supaul",
        "population": 390,
        "latitude": 26.160,
        "longitude": 86.600,
        "rainfall_mm": 95.5,
        "elevation_m": 58,
        "distance_from_river_km": 5.5,
        "flood_history": "Medium",
        "hazard_score": 68,
        "vulnerability_score": 65,
        "exposure_score": 62,
        "risk_score": 65,
        "risk_level": "HIGH"
    },

    {
        "village": "Puraini",
        "district": "Madhepura",
        "population": 450,
        "latitude": 25.520,
        "longitude": 86.950,
        "rainfall_mm": 91.5,
        "elevation_m": 52,
        "distance_from_river_km": 3.8,
        "flood_history": "Medium",
        "hazard_score": 70,
        "vulnerability_score": 68,
        "exposure_score": 70,
        "risk_score": 69,
        "risk_level": "HIGH"
    },

    {
        "village": "Nirmali",
        "district": "Supaul",
        "population": 410,
        "latitude": 26.320,
        "longitude": 86.680,
        "rainfall_mm": 96.5,
        "elevation_m": 53,
        "distance_from_river_km": 3.5,
        "flood_history": "Medium",
        "hazard_score": 71,
        "vulnerability_score": 66,
        "exposure_score": 65,
        "risk_score": 68,
        "risk_level": "HIGH"
    },

    {
        "village": "Triveniganj",
        "district": "Supaul",
        "population": 510,
        "latitude": 26.270,
        "longitude": 86.920,
        "rainfall_mm": 98.0,
        "elevation_m": 52,
        "distance_from_river_km": 3.0,
        "flood_history": "Medium",
        "hazard_score": 73,
        "vulnerability_score": 70,
        "exposure_score": 72,
        "risk_score": 72,
        "risk_level": "HIGH"
    },

    {
        "village": "Chhatapur",
        "district": "Supaul",
        "population": 490,
        "latitude": 26.280,
        "longitude": 87.050,
        "rainfall_mm": 108.0,
        "elevation_m": 54,
        "distance_from_river_km": 3.8,
        "flood_history": "Medium",
        "hazard_score": 74,
        "vulnerability_score": 69,
        "exposure_score": 71,
        "risk_score": 72,
        "risk_level": "HIGH"
    },

    {
        "village": "Shankarpur",
        "district": "Madhepura",
        "population": 320,
        "latitude": 25.880,
        "longitude": 86.720,
        "rainfall_mm": 89.0,
        "elevation_m": 51,
        "distance_from_river_km": 2.8,
        "flood_history": "Medium",
        "hazard_score": 67,
        "vulnerability_score": 64,
        "exposure_score": 60,
        "risk_score": 64,
        "risk_level": "HIGH"
    },

    {
        "village": "Belari",
        "district": "Madhepura",
        "population": 280,
        "latitude": 25.950,
        "longitude": 86.850,
        "rainfall_mm": 88.0,
        "elevation_m": 54,
        "distance_from_river_km": 4.5,
        "flood_history": "Low",
        "hazard_score": 55,
        "vulnerability_score": 50,
        "exposure_score": 48,
        "risk_score": 51,
        "risk_level": "MEDIUM"
    },

    {
        "village": "Supaul Town",
        "district": "Supaul",
        "population": 1200,
        "latitude": 26.125,
        "longitude": 86.931,
        "rainfall_mm": 85.0,
        "elevation_m": 62,
        "distance_from_river_km": 6.0,
        "flood_history": "Low",
        "hazard_score": 50,
        "vulnerability_score": 55,
        "exposure_score": 58,
        "risk_score": 54,
        "risk_level": "MEDIUM"
    },

    {
        "village": "Madhepura Town",
        "district": "Madhepura",
        "population": 1500,
        "latitude": 25.928,
        "longitude": 86.792,
        "rainfall_mm": 82.0,
        "elevation_m": 60,
        "distance_from_river_km": 5.0,
        "flood_history": "Low",
        "hazard_score": 48,
        "vulnerability_score": 52,
        "exposure_score": 55,
        "risk_score": 51,
        "risk_level": "MEDIUM"
    }
]


# ============================================================
# TEST PROGRAM
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 70)
    print("              FLOOD RISK ASSESSMENT")
    print("=" * 70)

    results = compute_risks(
        sample_villages
    )

    summary = get_risk_summary(
        results
    )

    # ========================================================
    # SUMMARY
    # ========================================================

    print("\nRISK SUMMARY")
    print("-" * 70)

    print(
        "Total Villages:",
        summary["total_villages"]
    )

    print(
        "Total Population:",
        summary["total_population"]
    )

    print(
        "Critical:",
        summary["critical"]
    )

    print(
        "High:",
        summary["high"]
    )

    print(
        "Medium:",
        summary["medium"]
    )

    print(
        "Low:",
        summary["low"]
    )

    # ========================================================
    # VILLAGE RESULTS
    # ========================================================

    print("\nVILLAGE RISK RESULTS")
    print("-" * 70)

    for result in results:

        print(
            f"\n{result['village']} "
            f"({result['district']})"
        )

        print(
            "Population:",
            result["population"]
        )

        print(
            "Risk Score:",
            result["risk_score"]
        )

        print(
            "Risk Level:",
            result["risk_level"]
        )

        print(
            "Priority:",
            result["priority"]
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

        print(
            "Reasons:"
        )

        for reason in result["reasons"]:

            print(
                "  -",
                reason
            )

    print()
    print("=" * 70)