import { useState } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Polyline,
  Tooltip
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import villagesData from "../data/villages.json";
import sheltersData from "../data/shelters.json";
import animalsData from "../data/animals.json";
import VillageDetailCard from "./VillageDetailCard";

// Haversine formula for precise distance calculation in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return "0.0";
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

// Custom Symbols / DivIcons Definitions
const shelterIcon = L.divIcon({
  className: "custom-shelter-marker",
  html: '<div style="background: #16a34a; color: white; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🏠</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const crowdedShelterIcon = L.divIcon({
  className: "custom-shelter-marker",
  html: '<div style="background: #9333ea; color: white; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🏠</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const animalIcon = L.divIcon({
  className: "custom-animal-marker",
  html: '<div style="background: #fbbf24; color: #78350f; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 12px; border: 1.5px solid #78350f; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">🐾</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const criticalVillageIcon = L.divIcon({
  className: "custom-village-marker",
  html: '<div style="background: #dc2626; color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 14px; border: 2.5px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">📍</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const highVillageIcon = L.divIcon({
  className: "custom-village-marker",
  html: '<div style="background: #ea580c; color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 14px; border: 2.5px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">📍</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function Map() {
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);

  // Filters State
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
      (s) => s.available_capacity >= (selectedVillage.population_numeric_for_calc || selectedVillage.population || 0)
    );

    const matchedShelter = suitableShelters.length > 0 
      ? suitableShelters[0] 
      : sheltersData.reduce((prev, curr) => 
          prev.available_capacity > curr.available_capacity ? prev : curr
        );

    if (matchedShelter.latitude == null || matchedShelter.longitude == null || 
        selectedVillage.latitude == null || selectedVillage.longitude == null) {
      alert("Invalid coordinate data for routing.");
      return;
    }

    setActiveRoute({
      fromVillage: selectedVillage.village,
      toShelter: matchedShelter.shelter_name,
      vLat: selectedVillage.latitude,
      vLng: selectedVillage.longitude,
      sLat: matchedShelter.latitude,
      sLng: matchedShelter.longitude,
      coords: [
        [selectedVillage.latitude, selectedVillage.longitude],
        [matchedShelter.latitude, matchedShelter.longitude]
      ]
    });
  };

  // Filtered data based on District dropdown
  const filteredVillages = villagesData.filter(
    (v) => selectedDistrict === "All" || v.district === selectedDistrict
  );
  const filteredShelters = sheltersData.filter(
    (s) => selectedDistrict === "All" || s.shelter_name.includes(selectedDistrict) || selectedDistrict === "All"
  );
  const filteredAnimals = animalsData.filter(
    (a) => {
      if (selectedDistrict === "All") return true;
      const matchedVill = villagesData.find((v) => v.village === a.village);
      return matchedVill ? matchedVill.district === selectedDistrict : true;
    }
  );

  return (
    <div style={{ height: "calc(100vh - 75px)", width: "100%", position: "relative" }}>
      
      {/* Floating Filter Panel */}
      <div style={{
        position: "absolute",
        top: "16px",
        left: "60px",
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.95)",
        padding: "12px 16px",
        borderRadius: "10px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        fontFamily: "system-ui, sans-serif",
        fontSize: "13px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: "170px"
      }}>
        <div>
          <label style={{ fontWeight: "bold", fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>
            District Filter
          </label>
          <select 
            value={selectedDistrict} 
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={{
              width: "100%",
              marginTop: "4px",
              padding: "4px 8px",
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
            Animal Reports 🐾 ({filteredAnimals.length})
          </label>
        </div>
      </div>

      {/* Village Details Side Panel */}
      {selectedVillage && (
        <VillageDetailCard 
          village={selectedVillage} 
          onClose={() => setSelectedVillage(null)}
          onRouteClick={handleAllocateShelter}
        />
      )}

      {/* Map Legend */}
      <div style={{
        position: "absolute",
        bottom: "24px",
        right: "16px",
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.95)",
        padding: "10px 14px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        fontSize: "12px",
        lineHeight: "1.6",
        color: "#1e293b",
        fontFamily: "system-ui, sans-serif"
      }}>
        <strong style={{ display: "block", marginBottom: "4px" }}>Map Indicators</strong>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#dc2626" }}></span>
          Critical Habitation (📍)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ea580c" }}></span>
          High Risk Habitation (📍)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#16a34a" }}></span>
          Shelter (🏠)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#fbbf24" }}></span>
          Animal Rescue Report (🐾)
        </div>
      </div>

      {/* Route Badge with Distance and Travel Time */}
      {activeRoute && (
        <div style={{
          position: "absolute",
          bottom: "24px",
          left: "20px",
          zIndex: 1000,
          background: "#0f172a",
          color: "#fff",
          padding: "14px 18px",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          fontSize: "13px",
          fontFamily: "system-ui, sans-serif",
          minWidth: "320px"
        }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
            Recommended Evacuation Corridor:
          </div>
          <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "8px" }}>
            {activeRoute.fromVillage} <span style={{ color: "#38bdf8" }}>&rarr;</span> <span style={{ color: "#4ade80" }}>{activeRoute.toShelter}</span>
          </div>
          <div style={{ display: "flex", gap: "14px", fontSize: "12px", color: "#cbd5e1", borderTop: "1px solid #334155", paddingTop: "8px" }}>
            <span>📏 Distance: <strong>{calculateDistance(activeRoute.vLat, activeRoute.vLng, activeRoute.sLat, activeRoute.sLng)} km</strong></span>
            <span>⏱️ Est. Time: <strong>~{(calculateDistance(activeRoute.vLat, activeRoute.vLng, activeRoute.sLat, activeRoute.sLng) * 3).toFixed(0)} mins</strong></span>
            <span>🟢 Route: <strong style={{ color: "#4ade80" }}>Clear</strong></span>
          </div>
          <button 
            onClick={() => setActiveRoute(null)}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "#334155",
              color: "#fff",
              border: "none",
              padding: "3px 8px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "11px"
            }}
          >
            Clear
          </button>
        </div>
      )}

      <MapContainer
        center={[26.05, 86.70]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {activeRoute && activeRoute.coords && (
          <Polyline 
            positions={activeRoute.coords} 
            pathOptions={{ color: "#2563eb", weight: 5, dashArray: "8, 8" }} 
          />
        )}

        {/* Shelters Layer */}
        {showShelters && filteredShelters.map((s, i) => {
          if (s.latitude == null || s.longitude == null || isNaN(s.latitude) || isNaN(s.longitude)) {
            return null;
          }

          const isCrowded = s.available_capacity < 50;
          const chosenIcon = isCrowded ? crowdedShelterIcon : shelterIcon;

          return (
            <Marker
              key={`s-${i}`}
              position={[s.latitude, s.longitude]}
              icon={chosenIcon}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.9}>
                <span>🏠 {s.shelter_name} (Space: {s.available_capacity})</span>
              </Tooltip>
            </Marker>
          );
        })}

        {/* Animals Layer */}
        {showAnimals && filteredAnimals.map((a, i) => {
          if (a.latitude == null || a.longitude == null || isNaN(a.latitude) || isNaN(a.longitude)) {
            return null;
          }

          return (
            <Marker
              key={`a-${i}`}
              position={[a.latitude, a.longitude]}
              icon={animalIcon}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={0.9}>
                <span>🐾 {a.animal_type} ({a.estimated_affected || a.count})</span>
              </Tooltip>
            </Marker>
          );
        })}

        {/* Habitations Layer */}
        {showVillages && filteredVillages.map((v, i) => {
          if (v.latitude == null || v.longitude == null || isNaN(v.latitude) || isNaN(v.longitude)) {
            return null;
          }

          const risk = (v.risk_level || "").toUpperCase();
          const isCritical = risk === "CRITICAL";
          const chosenIcon = isCritical ? criticalVillageIcon : highVillageIcon;

          return (
            <Marker
              key={`v-${i}`}
              position={[v.latitude, v.longitude]}
              icon={chosenIcon}
              eventHandlers={{
                click: () => handleVillageClick(v)
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                <span>📍 {v.village} ({v.risk_level}) - Pop: {v.population_range || v.population}</span>
              </Tooltip>
            </Marker>
          );
        })}

      </MapContainer>
    </div>
  );
}

export default Map;