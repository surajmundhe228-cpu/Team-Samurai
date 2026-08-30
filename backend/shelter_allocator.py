import math

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    return round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 2)

def allocate_shelters(villages, shelters):
    shelter_pool = [dict(s) for s in shelters]
    sorted_villages = sorted(villages, key=lambda v: v.get("risk_score", 0), reverse=True)
    plan = []

    for v in sorted_villages:
        needed = v["population"]
        v_lat, v_lon = v["latitude"], v["longitude"]

        ranked_shelters = sorted(
            shelter_pool,
            key=lambda s: haversine_distance(v_lat, v_lon, s["latitude"], s["longitude"])
        )

        assigned = []
        rem = needed

        for s in ranked_shelters:
            if s["available_capacity"] <= 0:
                continue
            
            dist = haversine_distance(v_lat, v_lon, s["latitude"], s["longitude"])
            take = min(rem, s["available_capacity"])
            
            assigned.append({
                "shelter_name": s["shelter_name"],
                "distance_km": dist,
                "evacuated_count": take
            })
            s["available_capacity"] -= take
            rem -= take

            if rem == 0:
                break

        plan.append({
            "village": v["village"],
            "district": v["district"],
            "total_population": needed,
            "risk_level": v["risk_level"],
            "routes": assigned,
            "unassigned_population": rem
        })
    return plan