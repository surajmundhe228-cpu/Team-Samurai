import { useState } from "react";
import { 
  MapContainer, 
  TileLayer, 
  CircleMarker, 
  Polyline, 
  Tooltip 
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeft } from "lucide-react";
import VillageDetailCard from "./VillageDetailCard";

const villagesData = [
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
];

const sheltersData = [
  {
    "shelter_name": "Supaul College Relief Camp",
    "latitude": 26.115,
    "longitude": 86.595,
    "capacity": 800,
    "current_occupancy": 620,
    "available_capacity": 180,
    "type": "School/College",
    "facilities": "Toilets, Drinking Water, Medical Desk, Food Distribution"
  },
  {
    "shelter_name": "Triveniganj High School Camp",
    "latitude": 26.18,
    "longitude": 86.72,
    "capacity": 450,
    "current_occupancy": 410,
    "available_capacity": 40,
    "type": "School",
    "facilities": "Toilets, Drinking Water"
  },
  {
    "shelter_name": "Chhatapur Block Relief Centre",
    "latitude": 26.21,
    "longitude": 86.68,
    "capacity": 600,
    "current_occupancy": 280,
    "available_capacity": 320,
    "type": "Community Hall",
    "facilities": "Toilets, Drinking Water, Medical Desk, Kitchen"
  },
  {
    "shelter_name": "Raghopur Primary School",
    "latitude": 26.25,
    "longitude": 86.55,
    "capacity": 300,
    "current_occupancy": 295,
    "available_capacity": 5,
    "type": "School",
    "facilities": "Toilets, Drinking Water"
  },
  {
    "shelter_name": "Basantpur Relief Camp",
    "latitude": 26.32,
    "longitude": 86.48,
    "capacity": 500,
    "current_occupancy": 150,
    "available_capacity": 350,
    "type": "Temporary Camp",
    "facilities": "Toilets, Drinking Water, Medical Desk, Food Distribution, Tents"
  },
  {
    "shelter_name": "Madhepura Stadium Camp",
    "latitude": 25.92,
    "longitude": 86.79,
    "capacity": 1200,
    "current_occupancy": 950,
    "available_capacity": 250,
    "type": "Stadium/Ground",
    "facilities": "Toilets, Drinking Water, Medical Desk, Food Distribution, Electricity"
  },
  {
    "shelter_name": "Murliganj High School",
    "latitude": 25.88,
    "longitude": 86.92,
    "capacity": 400,
    "current_occupancy": 380,
    "available_capacity": 20,
    "type": "School",
    "facilities": "Toilets, Drinking Water"
  },
  {
    "shelter_name": "Kumarkhand Community Centre",
    "latitude": 25.95,
    "longitude": 86.85,
    "capacity": 350,
    "current_occupancy": 120,
    "available_capacity": 230,
    "type": "Community Hall",
    "facilities": "Toilets, Drinking Water, Medical Desk, Kitchen"
  },
  {
    "shelter_name": "Alamnagar Relief Shelter",
    "latitude": 25.85,
    "longitude": 86.7,
    "capacity": 280,
    "current_occupancy": 260,
    "available_capacity": 20,
    "type": "School",
    "facilities": "Toilets, Drinking Water"
  },
  {
    "shelter_name": "Singheshwar Temple Complex",
    "latitude": 25.98,
    "longitude": 86.8,
    "capacity": 450,
    "current_occupancy": 200,
    "available_capacity": 250,
    "type": "Religious Complex",
    "facilities": "Toilets, Drinking Water, Food Distribution"
  },
  {
    "shelter_name": "Bihariganj Block Office Camp",
    "latitude": 25.9,
    "longitude": 87.0,
    "capacity": 320,
    "current_occupancy": 80,
    "available_capacity": 240,
    "type": "Govt Building",
    "facilities": "Toilets, Drinking Water, Medical Desk, Electricity"
  },
  {
    "shelter_name": "Gwalpara School Camp",
    "latitude": 25.87,
    "longitude": 86.75,
    "capacity": 250,
    "current_occupancy": 240,
    "available_capacity": 10,
    "type": "School",
    "facilities": "Toilets, Drinking Water"
  },
  {
    "shelter_name": "Pratapganj High School Camp",
    "latitude": 26.28,
    "longitude": 86.62,
    "capacity": 380,
    "current_occupancy": 210,
    "available_capacity": 170,
    "type": "School",
    "facilities": "Toilets, Drinking Water, Food Distribution"
  },
  {
    "shelter_name": "Nirmali Relief Centre",
    "latitude": 26.3,
    "longitude": 86.58,
    "capacity": 420,
    "current_occupancy": 180,
    "available_capacity": 240,
    "type": "Community Hall",
    "facilities": "Toilets, Drinking Water, Medical Desk, Kitchen"
  },
  {
    "shelter_name": "Udakishunganj Block Camp",
    "latitude": 25.83,
    "longitude": 86.95,
    "capacity": 550,
    "current_occupancy": 300,
    "available_capacity": 250,
    "type": "Govt Building",
    "facilities": "Toilets, Drinking Water, Medical Desk, Electricity, Food Distribution"
  },
  {
    "shelter_name": "Shankarpur Primary School",
    "latitude": 25.91,
    "longitude": 86.88,
    "capacity": 220,
    "current_occupancy": 195,
    "available_capacity": 25,
    "type": "School",
    "facilities": "Toilets, Drinking Water"
  },
  {
    "shelter_name": "Kishanganj Road Temporary Camp",
    "latitude": 26.05,
    "longitude": 86.65,
    "capacity": 600,
    "current_occupancy": 140,
    "available_capacity": 460,
    "type": "Temporary Camp",
    "facilities": "Toilets, Drinking Water, Tents, Food Distribution"
  },
  {
    "shelter_name": "Gamharia Community Hall",
    "latitude": 25.915,
    "longitude": 86.97,
    "capacity": 300,
    "current_occupancy": 90,
    "available_capacity": 210,
    "type": "Community Hall",
    "facilities": "Toilets, Drinking Water, Medical Desk"
  }
];

const animalsData = [
  {
    "animal_type": "Cattle Herd",
    "village": "Bishanpur",
    "latitude": 26.135,
    "longitude": 86.910,
    "estimated_affected": 45
  },
  {
    "animal_type": "Goats & Livestock",
    "village": "Rampur",
    "latitude": 26.120,
    "longitude": 86.920,
    "estimated_affected": 32
  },
  {
    "animal_type": "Buffaloes",
    "village": "Jorgama",
    "latitude": 25.920,
    "longitude": 86.790,
    "estimated_affected": 28
  }
];

export default function MapScreen({ onBack }) {
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);

  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [showVillages, setShowVillages] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showAnimals, setShowAnimals] = useState(true);

  const handleVillageClick = (village) => {
    setSelectedVillage(village);
  };

  const handleAllocateShelter = () => {
    if (!selectedVillage) return;

    const suitableShelters = sheltersData.filter(
      (s) => s.available_capacity >= (selectedVillage.population || 0)
    );

    const matchedShelter = suitableShelters.length > 0 
      ? suitableShelters[0] 
      : sheltersData.reduce((prev, curr) => 
          prev.available_capacity > curr.available_capacity ? prev : curr
        );

    if (
      matchedShelter?.latitude == null || matchedShelter?.longitude == null || 
      selectedVillage?.latitude == null || selectedVillage?.longitude == null
    ) {
      alert("Invalid coordinate data for routing.");
      return;
    }

    setActiveRoute({
      fromVillage: selectedVillage.village,
      toShelter: matchedShelter.shelter_name,
      coords: [
        [selectedVillage.latitude, selectedVillage.longitude],
        [matchedShelter.latitude, matchedShelter.longitude]
      ]
    });
  };

  const filteredVillages = villagesData.filter(
    (v) => selectedDistrict === "All" || v.district === selectedDistrict
  );
  const filteredShelters = sheltersData.filter(
    (s) => selectedDistrict === "All" || s.shelter_name?.includes(selectedDistrict)
  );
  const filteredAnimals = animalsData.filter((a) => {
    if (selectedDistrict === "All") return true;
    const matchedVill = villagesData.find((v) => v.village === a.village);
    return matchedVill ? matchedVill.district === selectedDistrict : true;
  });

  return (
    <div className="mobile-frame">
      <div className="dashboard-container" style={{ position: "relative", overflow: "hidden", height: "100%" }}>
        
        {/* Header */}
        <div className="dashboard-header" style={{ zIndex: 1100, position: "relative" }}>
          <button className="icon-btn" onClick={onBack} title="Back">
            <ArrowLeft size={22} />
          </button>
          <h2>Interactive Risk Map</h2>
          <div style={{ width: 22 }}></div>
        </div>

        {/* Map Container View */}
        <div style={{ height: "calc(100% - 60px)", width: "100%", position: "relative" }}>
          
          {/* District & Layer Filter */}
          <div style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            zIndex: 1000,
            background: "rgba(255, 255, 255, 0.95)",
            padding: "10px 12px",
            borderRadius: "10px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            fontFamily: "system-ui, sans-serif",
            fontSize: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minWidth: "150px"
          }}>
            <div>
              <label style={{ fontWeight: "bold", fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>
                District
              </label>
              <select 
                value={selectedDistrict} 
                onChange={(e) => setSelectedDistrict(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "4px 6px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px"
                }}
              >
                <option value="All">All Districts</option>
                <option value="Supaul">Supaul</option>
                <option value="Madhepura">Madhepura</option>
              </select>
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={showVillages} 
                  onChange={(e) => setShowVillages(e.target.checked)} 
                />
                Habitations ({filteredVillages.length})
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={showShelters} 
                  onChange={(e) => setShowShelters(e.target.checked)} 
                />
                Safe Shelters ({filteredShelters.length})
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={showAnimals} 
                  onChange={(e) => setShowAnimals(e.target.checked)} 
                />
                Animals 🐾 ({filteredAnimals.length})
              </label>
            </div>
          </div>

          {/* Details Overlay Card */}
          {selectedVillage && (
            <VillageDetailCard 
              village={selectedVillage} 
              onClose={() => setSelectedVillage(null)}
              onRouteClick={handleAllocateShelter}
            />
          )}

          {/* Active Evacuation Path Box */}
          {activeRoute && (
            <div style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              right: "16px",
              zIndex: 1000,
              background: "#0f172a",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              fontSize: "12px",
              fontFamily: "system-ui, sans-serif"
            }}>
              <strong>Evacuation Route:</strong><br />
              {activeRoute.fromVillage} &rarr; <span style={{ color: "#4ade80" }}>{activeRoute.toShelter}</span>
              <button 
                onClick={() => setActiveRoute(null)}
                style={{ marginLeft: "10px", padding: "2px 6px", fontSize: "11px", cursor: "pointer" }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Map */}
          <MapContainer
            center={[26.05, 86.70]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />

            {activeRoute?.coords && (
              <Polyline 
                positions={activeRoute.coords} 
                pathOptions={{ color: "#2563eb", weight: 4, dashArray: "6, 8" }} 
              />
            )}

            {/* Shelters */}
            {showShelters && filteredShelters.map((s, i) => {
              if (!s.latitude || !s.longitude) return null;
              const isCrowded = s.available_capacity < 50;
              const markerColor = isCrowded ? "#9333ea" : "#16a34a";

              return (
                <CircleMarker
                  key={`s-${i}`}
                  center={[s.latitude, s.longitude]}
                  pathOptions={{ color: "#fff", fillColor: markerColor, fillOpacity: 0.85, weight: 2 }}
                  radius={10}
                >
                  <Tooltip direction="top" offset={[0, -8]} opacity={0.9}>
                    <span>🏠 {s.shelter_name} (Free: {s.available_capacity})</span>
                  </Tooltip>
                </CircleMarker>
              );
            })}

            {/* Animals */}
            {showAnimals && filteredAnimals.map((a, i) => {
              if (!a.latitude || !a.longitude) return null;

              return (
                <CircleMarker
                  key={`a-${i}`}
                  center={[a.latitude, a.longitude]}
                  pathOptions={{ color: "#78350f", fillColor: "#fbbf24", fillOpacity: 0.9, weight: 1.5 }}
                  radius={7}
                >
                  <Tooltip direction="top" offset={[0, -6]} opacity={0.9}>
                    <span>🐾 {a.animal_type} ({a.estimated_affected || a.count || 0})</span>
                  </Tooltip>
                </CircleMarker>
              );
            })}

            {/* Habitations */}
            {showVillages && filteredVillages.map((v, i) => {
              if (!v.latitude || !v.longitude) return null;
              const isCritical = (v.risk_level || "").toUpperCase() === "CRITICAL";
              const markerColor = isCritical ? "#dc2626" : "#ea580c";

              return (
                <CircleMarker
                  key={`v-${i}`}
                  center={[v.latitude, v.longitude]}
                  pathOptions={{ color: "#ffffff", fillColor: markerColor, fillOpacity: 0.95, weight: 2.5 }}
                  radius={11}
                  eventHandlers={{
                    click: () => handleVillageClick(v)
                  }}
                >
                  <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                    <span>📍 {v.village} ({v.risk_level}) - Pop: {v.population}</span>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

      </div>
    </div>
  );
}