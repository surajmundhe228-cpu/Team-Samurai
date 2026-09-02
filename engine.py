# ============================================================
# FLOOD EVACUATION ENGINE
# ============================================================

from risk_engine import compute_risks, get_risk_summary
from shelter_allocator import match_shelters, get_shelter_summary


def generate_evacuation_plan(villages, shelters):
    """
    Main evacuation engine.

    Connects:
        1. Risk Engine
        2. Shelter Allocation Engine
        3. Dashboard Statistics

    Returns a complete evacuation result.
    """

    # ========================================================
    # 1. CALCULATE RISK
    # ========================================================

    risk_results = compute_risks(villages)

    if not isinstance(risk_results, list):
        risk_results = []

    # ========================================================
    # 2. CREATE RISK LOOKUP
    # ========================================================
    # IMPORTANT:
    # compute_risks() may sort the results.
    # Therefore, never use:
    #
    # zip(villages, risk_results)
    #
    # Instead, match using village name.

    risk_lookup = {}

    for risk in risk_results:

        if not isinstance(risk, dict):
            continue

        village_name = str(
            risk.get("village", "")
        ).strip().lower()

        if village_name:
            risk_lookup[village_name] = risk

    # ========================================================
    # 3. ADD RISK INFORMATION TO VILLAGES
    # ========================================================

    villages_with_risk = []

    for village in villages:

        if not isinstance(village, dict):
            continue

        updated_village = dict(village)

        village_name = str(
            village.get("village", "Unknown")
        ).strip().lower()

        risk = risk_lookup.get(village_name)

        if risk:

            updated_village.update({

                "hazard_score": risk.get(
                    "hazard_score",
                    0
                ),

                "vulnerability_score": risk.get(
                    "vulnerability_score",
                    0
                ),

                "exposure_score": risk.get(
                    "exposure_score",
                    0
                ),

                "risk_score": risk.get(
                    "risk_score",
                    0
                ),

                "risk_level": risk.get(
                    "risk_level",
                    "LOW"
                ),

                "priority": risk.get(
                    "priority",
                    "LOW"
                ),

                "risk_description": risk.get(
                    "risk_description",
                    ""
                ),

                "reasons": risk.get(
                    "reasons",
                    []
                ),
            })

        else:

            updated_village.update({

                "hazard_score": 0,
                "vulnerability_score": 0,
                "exposure_score": 0,
                "risk_score": 0,
                "risk_level": "LOW",
                "priority": "LOW",
                "risk_description": "",
                "reasons": [],
            })

        villages_with_risk.append(
            updated_village
        )

    # ========================================================
    # 4. MATCH VILLAGES WITH SHELTERS
    # ========================================================

    try:

        evacuation_plan = match_shelters(
            villages_with_risk,
            shelters
        )

    except Exception as e:

        print(
            "Shelter allocation error:",
            e
        )

        evacuation_plan = []

    if not isinstance(evacuation_plan, list):
        evacuation_plan = []

    # ========================================================
    # 5. RISK SUMMARY
    # ========================================================

    try:

        risk_summary = get_risk_summary(
            risk_results
        )

    except Exception as e:

        print(
            "Risk summary error:",
            e
        )

        risk_summary = {
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0,
        }

    if not isinstance(risk_summary, dict):
        risk_summary = {}

    # ========================================================
    # 6. SHELTER SUMMARY
    # ========================================================

    try:

        shelter_summary = get_shelter_summary(
            shelters
        )

    except Exception as e:

        print(
            "Shelter summary error:",
            e
        )

        shelter_summary = {}

    if not isinstance(shelter_summary, dict):
        shelter_summary = {}

    # ========================================================
    # 7. TOTAL POPULATION
    # ========================================================

    total_population = 0

    for village in villages_with_risk:

        try:

            total_population += int(
                village.get(
                    "population",
                    0
                )
            )

        except (ValueError, TypeError):

            pass

    # ========================================================
    # 8. TOTAL EVACUATED
    # ========================================================

    total_evacuated = 0

    for plan in evacuation_plan:

        if not isinstance(plan, dict):
            continue

        try:

            evacuated = plan.get(
                "total_evacuated",
                plan.get(
                    "evacuated_population",
                    plan.get(
                        "evacuated",
                        0
                    )
                )
            )

            total_evacuated += int(
                evacuated or 0
            )

        except (ValueError, TypeError):

            pass

    # ========================================================
    # 9. TOTAL UNASSIGNED
    # ========================================================

    total_unassigned = 0

    for plan in evacuation_plan:

        if not isinstance(plan, dict):
            continue

        try:

            unassigned = plan.get(
                "unassigned",
                0
            )

            total_unassigned += int(
                unassigned or 0
            )

        except (ValueError, TypeError):

            pass

    # If shelter allocator did not provide unassigned
    # population, calculate it from total population.

    if total_unassigned == 0:

        calculated_unassigned = (
            total_population -
            total_evacuated
        )

        if calculated_unassigned > 0:
            total_unassigned = calculated_unassigned

    # ========================================================
    # 10. EVACUATION PERCENTAGE
    # ========================================================

    if total_population > 0:

        evacuation_percentage = round(
            (
                total_evacuated /
                total_population
            ) * 100,
            1
        )

    else:

        evacuation_percentage = 0.0

    # Prevent percentage above 100

    if evacuation_percentage > 100:
        evacuation_percentage = 100.0

    # ========================================================
    # 11. DASHBOARD STATISTICS
    # ========================================================

    statistics = {

        "total_villages":
            len(villages_with_risk),

        "total_population":
            total_population,

        "critical":
            risk_summary.get(
                "critical",
                0
            ),

        "high":
            risk_summary.get(
                "high",
                0
            ),

        "medium":
            risk_summary.get(
                "medium",
                0
            ),

        "low":
            risk_summary.get(
                "low",
                0
            ),

        "total_shelters":
            shelter_summary.get(
                "total_shelters",
                len(shelters)
            ),

        "total_capacity":
            shelter_summary.get(
                "total_capacity",
                0
            ),

        "total_occupancy":
            shelter_summary.get(
                "total_occupancy",
                0
            ),

        "total_available":
            shelter_summary.get(
                "total_available",
                0
            ),

        "available_shelters":
            shelter_summary.get(
                "available_shelters",
                0
            ),

        "full_or_nearly_full":
            shelter_summary.get(
                "full_or_nearly_full",
                0
            ),

        "utilization_percentage":
            shelter_summary.get(
                "utilization_percentage",
                0
            ),

        "total_evacuated":
            total_evacuated,

        "total_unassigned":
            total_unassigned,

        "evacuation_percentage":
            evacuation_percentage,
    }

    # ========================================================
    # 12. FINAL RESULT
    # ========================================================

    return {

        "status":
            "success",

        "statistics":
            statistics,

        "villages":
            villages_with_risk,

        "shelters":
            shelters,

        "risk_assessment":
            risk_results,

        "evacuation_plan":
            evacuation_plan,
    }