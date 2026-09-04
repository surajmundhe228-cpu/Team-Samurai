import math


def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate accurate distance between two points in kilometers."""
    R = 6371.0  # Earth radius in km

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return round(R * c, 2)


def allocate_shelters(villages, shelters):
    """
    Allocate people from high-risk villages to shelters.

    Features:
    1. Accurate Haversine distance
    2. Capacity constraint checks
    3. Overflow to secondary shelters
    4. Warning flags when capacity is exhausted
    """
    shelter_pool = [dict(s) for s in shelters]

    # Highest risk / population first
    sorted_villages = sorted(
        villages,
        key=lambda v: (
            v.get("risk_score", 0),
            v.get("population", v.get("population_affected", 0))
        ),
        reverse=True
    )

    plan = []

    for v in sorted_villages:
        needed = v.get("population") or v.get("population_affected") or 0
        v_lat = v["latitude"]
        v_lon = v["longitude"]
        rem = needed

        ranked_shelters = sorted(
            shelter_pool,
            key=lambda s: haversine_distance(
                v_lat, v_lon, s["latitude"], s["longitude"]
            )
        )

        assigned = []
        warnings = []

        for s in ranked_shelters:
            if rem <= 0:
                break

            available = s.get("available_capacity", 0)
            if available <= 0:
                continue

            dist = haversine_distance(v_lat, v_lon, s["latitude"], s["longitude"])
            take = min(rem, available)

            assigned.append({
                "shelter_name": s.get("shelter_name") or s.get("name"),
                "distance_km": dist,
                "evacuated_count": take,
                "is_primary": len(assigned) == 0
            })

            s["available_capacity"] = available - take
            rem -= take

        # ----- Warning flags (required for task) -----
        if rem > 0:
            warnings.append({
                "type": "CAPACITY_EXHAUSTED",
                "message": f"{rem} people from {v.get('village') or v.get('name')} could not be allocated. All reachable shelters are full."
            })

        if len(assigned) > 1:
            warnings.append({
                "type": "OVERFLOW_TO_SECONDARY",
                "message": f"Primary shelter full. Population overflowed to {len(assigned) - 1} secondary shelter(s)."
            })

        if len(assigned) == 0:
            warnings.append({
                "type": "NO_SHELTER_AVAILABLE",
                "message": f"No available shelter found for {v.get('village') or v.get('name')}."
            })

        plan.append({
            "village": v.get("village") or v.get("name"),
            "district": v.get("district", ""),
            "total_population": needed,
            "risk_level": v.get("risk_level", ""),
            "routes": assigned,
            "unassigned_population": rem,
            "warnings": warnings,
            "status": "FULLY_ALLOCATED" if rem == 0 else "CAPACITY_EXHAUSTED"
        })

    return plan
