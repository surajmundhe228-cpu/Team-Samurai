const LIVE_BACKEND_URL = "https://reloc8-flood-evacuation-1.onrender.com";

export async function fetchLiveEvacuationPlan(villages, shelters) {
  try {
    const formattedVillages = villages.map(v => ({
      village: v.village,
      latitude: v.latitude,
      longitude: v.longitude,
      rainfall_mm: v.rainfall_mm || 50.0,
      river_distance_km: v.distance_from_river_km || 5.0,
      elevation_m: v.elevation_m || 55.0,
      population_numeric_for_calc: v.population || 500
    }));

    const formattedShelters = shelters.map(s => ({
      shelter_name: s.shelter_name,
      latitude: s.latitude,
      longitude: s.longitude,
      total_capacity: s.capacity || 500,
      available_capacity: s.available_capacity || 100
    }));

    const response = await fetch(`${LIVE_BACKEND_URL}/evacuation-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        villages: formattedVillages,
        shelters: formattedShelters
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to query live Render evacuation engine:", err);
    return null;
  }
}