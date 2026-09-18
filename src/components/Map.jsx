import { useEffect, useState } from "react";
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
import healthcareData from "../data/healthcare_facilities.json";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api";

// =========================================================
// HAVERSINE DISTANCE
// =========================================================

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (
    lat1 == null ||
    lon1 == null ||
    lat2 == null ||
    lon2 == null
  ) {
    return "0.0";
  }

  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return (R * c).toFixed(1);
};

// =========================================================
// MAP ICONS
// =========================================================

const shelterIcon = L.divIcon({
  className: "custom-shelter-marker",
  html:
    '<div style="background:#16a34a;color:white;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🏠</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const crowdedShelterIcon = L.divIcon({
  className: "custom-shelter-marker",
  html:
    '<div style="background:#9333ea;color:white;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🏠</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const animalIcon = L.divIcon({
  className: "custom-animal-marker",
  html:
    '<div style="background:#fbbf24;color:#78350f;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:12px;border:1.5px solid #78350f;box-shadow:0 2px 4px rgba(0,0,0,0.2);">🐾</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const criticalVillageIcon = L.divIcon({
  className: "custom-village-marker",
  html:
    '<div style="background:#dc2626;color:white;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:14px;border:2.5px solid white;box-shadow:0 3px 6px rgba(0,0,0,0.3);">📍</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const highVillageIcon = L.divIcon({
  className: "custom-village-marker",
  html: "📍",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const hospitalIcon = L.divIcon({
  className: "custom-hospital-marker",
  html:
    '<div style="background:#2563eb;color:white;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🏥</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// =========================================================
// MAP
// =========================================================

function Map() {
  const [selectedVillage, setSelectedVillage] =
    useState(null);

  const [activeRoute, setActiveRoute] =
    useState(null);

  const [selectedDistrict, setSelectedDistrict] =
    useState("All");

  const [showVillages, setShowVillages] =
    useState(true);

  const [showShelters, setShowShelters] =
    useState(true);

  const [showAnimals, setShowAnimals] =
    useState(true);

  const [showHospitals, setShowHospitals] =
    useState(true);

  const [showCrowdsourcedAlerts, setShowCrowdsourcedAlerts] =
    useState(true);

  // =======================================================
  // LIVE SHELTER DATA
  // =======================================================

  const [liveShelters, setLiveShelters] =
    useState(
      Array.isArray(sheltersData)
        ? sheltersData
        : []
    );

  useEffect(() => {
    let cancelled = false;

    const loadShelters = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/shelters`
        );

        if (!response.ok) {
          throw new Error(
            `Shelter API returned ${response.status}`
          );
        }

        const data = await response.json();

        const shelters = Array.isArray(data)
          ? data
          : data?.shelters || [];

        if (
          !cancelled &&
          Array.isArray(shelters) &&
          shelters.length > 0
        ) {
          setLiveShelters(shelters);
        }
      } catch (error) {
        console.warn(
          "Live shelter data unavailable. Using local shelter data.",
          error
        );
      }
    };

    loadShelters();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // NEAREST HOSPITAL ROUTE
  // =========================================================

  const handleHospitalRoute = () => {
    if (!selectedVillage) return;

    const villageLat =
      Number(selectedVillage.latitude);

    const villageLng =
      Number(selectedVillage.longitude);

    if (
      !Number.isFinite(villageLat) ||
      !Number.isFinite(villageLng)
    ) {
      alert("Invalid village coordinate data.");
      return;
    }

    if (
      !healthcareData ||
      healthcareData.length === 0
    ) {
      alert("No healthcare facilities found.");
      return;
    }

    const validHospitals =
      healthcareData.filter((hospital) => {
        const lat = Number(hospital.latitude);
        const lng = Number(hospital.longitude);

        return (
          Number.isFinite(lat) &&
          Number.isFinite(lng)
        );
      });

    if (validHospitals.length === 0) {
      alert(
        "No hospitals with valid coordinates found."
      );
      return;
    }

    let nearestHospital = null;
    let shortestDistance = Infinity;

    validHospitals.forEach((hospital) => {
      const distance = Number(
        calculateDistance(
          villageLat,
          villageLng,
          Number(hospital.latitude),
          Number(hospital.longitude)
        )
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestHospital = hospital;
      }
    });

    if (!nearestHospital) {
      alert(
        "Could not find nearest hospital."
      );
      return;
    }

    const hospitalName =
      nearestHospital.name ||
      nearestHospital.hospital_name ||
      nearestHospital.facility_name ||
      "Nearest Hospital";

    setActiveRoute({
      type: "hospital",
      fromVillage:
        selectedVillage.village,
      toShelter: hospitalName,
      vLat: villageLat,
      vLng: villageLng,
      sLat: Number(
        nearestHospital.latitude
      ),
      sLng: Number(
        nearestHospital.longitude
      ),
      coords: [
        [villageLat, villageLng],
        [
          Number(nearestHospital.latitude),
          Number(nearestHospital.longitude),
        ],
      ],
    });
  };

  // =========================================================
  // VILLAGE CLICK
  // =========================================================

  const handleVillageClick = (village) => {
    setSelectedVillage(village);
  };

  // =========================================================
  // SHELTER ALLOCATION
  // =========================================================

  const handleAllocateShelter = () => {
    if (!selectedVillage) return;

    const shelters =
      Array.isArray(liveShelters)
        ? liveShelters
        : [];

    if (shelters.length === 0) {
      alert("No shelters available.");
      return;
    }

    const population =
      Number(
        selectedVillage.population_numeric_for_calc ||
        selectedVillage.population ||
        0
      );

    const suitableShelters =
      shelters.filter(
        (shelter) =>
          Number(
            shelter.available_capacity || 0
          ) >= population
      );

    const matchedShelter =
      suitableShelters.length > 0
        ? suitableShelters[0]
        : shelters.reduce(
            (prev, curr) =>
              Number(
                prev.available_capacity || 0
              ) >
              Number(
                curr.available_capacity || 0
              )
                ? prev
                : curr
          );

    if (
      matchedShelter.latitude == null ||
      matchedShelter.longitude == null ||
      selectedVillage.latitude == null ||
      selectedVillage.longitude == null
    ) {
      alert(
        "Invalid coordinate data for routing."
      );
      return;
    }

    setActiveRoute({
      fromVillage:
        selectedVillage.village,

      toShelter:
        matchedShelter.shelter_name,

      vLat:
        selectedVillage.latitude,

      vLng:
        selectedVillage.longitude,

      sLat:
        matchedShelter.latitude,

      sLng:
        matchedShelter.longitude,

      coords: [
        [
          selectedVillage.latitude,
          selectedVillage.longitude,
        ],
        [
          matchedShelter.latitude,
          matchedShelter.longitude,
        ],
      ],
    });
  };

  // =========================================================
  // FILTERED DATA
  // =========================================================

  const filteredVillages =
    villagesData.filter(
      (village) =>
        selectedDistrict === "All" ||
        village.district === selectedDistrict
    );

  const filteredShelters =
    liveShelters.filter((shelter) => {
      if (selectedDistrict === "All") {
        return true;
      }

      return (
        shelter.shelter_name?.includes(
          selectedDistrict
        ) ||
        shelter.district === selectedDistrict
      );
    });

  const filteredAnimals =
    animalsData.filter((animal) => {
      if (selectedDistrict === "All") {
        return true;
      }

      const matchedVillage =
        villagesData.find(
          (village) =>
            village.village ===
            animal.village
        );

      return matchedVillage
        ? matchedVillage.district ===
            selectedDistrict
        : true;
    });

  const filteredHospitals =
    healthcareData.filter((hospital) => {
      if (selectedDistrict === "All") {
        return true;
      }

      if (hospital.district) {
        return (
          hospital.district ===
          selectedDistrict
        );
      }

      if (hospital.name) {
        return hospital.name.includes(
          selectedDistrict
        );
      }

      return true;
    });

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      style={{
        height: "calc(100vh - 75px)",
        width: "100%",
        position: "relative",
      }}
    >
      {/* FILTER PANEL */}

      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "60px",
          zIndex: 1000,
          background:
            "rgba(255, 255, 255, 0.95)",
          padding: "12px 16px",
          borderRadius: "10px",
          boxShadow:
            "0 4px 16px rgba(0,0,0,0.15)",
          fontFamily:
            "system-ui, sans-serif",
          fontSize: "13px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "170px",
        }}
      >
        <div>
          <label
            style={{
              fontWeight: "bold",
              fontSize: "11px",
              color: "#64748b",
              textTransform: "uppercase",
            }}
          >
            District Filter
          </label>

          <select
            value={selectedDistrict}
            onChange={(event) =>
              setSelectedDistrict(
                event.target.value
              )
            }
            style={{
              width: "100%",
              marginTop: "4px",
              padding: "4px 8px",
              borderRadius: "6px",
              border:
                "1px solid #cbd5e1",
              fontSize: "12px",
            }}
          >
            <option value="All">
              All Districts
            </option>

            <option value="Supaul">
              Supaul
            </option>

            <option value="Madhepura">
              Madhepura
            </option>
          </select>
        </div>

        <div
          style={{
            borderTop:
              "1px solid #e2e8f0",
            paddingTop: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showVillages}
              onChange={(event) =>
                setShowVillages(
                  event.target.checked
                )
              }
            />

            Habitations (
            {filteredVillages.length})
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showShelters}
              onChange={(event) =>
                setShowShelters(
                  event.target.checked
                )
              }
            />

            Safe Shelters (
            {filteredShelters.length})
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showAnimals}
              onChange={(event) =>
                setShowAnimals(
                  event.target.checked
                )
              }
            />

            Animal Reports 🐾 (
            {filteredAnimals.length})
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showHospitals}
              onChange={(event) =>
                setShowHospitals(
                  event.target.checked
                )
              }
            />

            Healthcare 🏥 (
            {filteredHospitals.length})
          </label>
        </div>
      </div>

      {/* VILLAGE DETAILS */}

      {selectedVillage && (
        <VillageDetailCard
          village={selectedVillage}
          onClose={() =>
            setSelectedVillage(null)
          }
          onRouteClick={
            handleAllocateShelter
          }
          onHospitalRouteClick={
            handleHospitalRoute
          }
        />
      )}

      {/* MAP LEGEND */}

      <div
        style={{
          position: "absolute",
          top: "250px",
          left: "60px",
          zIndex: 1000,
          background:
            "rgba(255, 255, 255, 0.95)",
          padding: "10px 14px",
          borderRadius: "8px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.15)",
          fontSize: "12px",
          lineHeight: "1.6",
          color: "#1e293b",
          fontFamily:
            "system-ui, sans-serif",
          minWidth: "170px",
        }}
      >
        <strong
          style={{
            display: "block",
            marginBottom: "4px",
          }}
        >
          Map Indicators
        </strong>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#dc2626",
            }}
          />

          Critical Habitation (📍)
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#ea580c",
            }}
          />

          High Risk Habitation (📍)
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#16a34a",
            }}
          />

          Shelter (🏠)
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#fbbf24",
            }}
          />

          Animal Rescue Report (🐾)
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#2563eb",
            }}
          />

          Healthcare Facility (🏥)
        </div>
      </div>

      {/* ACTIVE ROUTE */}

      {activeRoute && (
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "20px",
            zIndex: 1000,
            background: "#0f172a",
            color: "#fff",
            padding: "14px 18px",
            borderRadius: "10px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.3)",
            fontSize: "13px",
            fontFamily:
              "system-ui, sans-serif",
            minWidth: "320px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color:
                activeRoute.type ===
                "hospital"
                  ? "#60a5fa"
                  : "#4ade80",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}
          >
            {activeRoute.type ===
            "hospital"
              ? "Nearest Healthcare Route:"
              : "Recommended Evacuation Corridor:"}
          </div>

          <div
            style={{
              fontSize: "15px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            {activeRoute.fromVillage}

            <span
              style={{
                color:
                  activeRoute.type ===
                  "hospital"
                    ? "#60a5fa"
                    : "#38bdf8",
                margin: "0 6px",
              }}
            >
              &rarr;
            </span>

            <span
              style={{
                color:
                  activeRoute.type ===
                  "hospital"
                    ? "#60a5fa"
                    : "#4ade80",
              }}
            >
              {activeRoute.toShelter}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              fontSize: "12px",
              color: "#cbd5e1",
              borderTop:
                "1px solid #334155",
              paddingTop: "8px",
              flexWrap: "wrap",
            }}
          >
            <span>
              📏 Distance:{" "}
              <strong>
                {calculateDistance(
                  activeRoute.vLat,
                  activeRoute.vLng,
                  activeRoute.sLat,
                  activeRoute.sLng
                )}{" "}
                km
              </strong>
            </span>

            <span>
              ⏱️ Est. Time:{" "}
              <strong>
                ~
                {(
                  Number(
                    calculateDistance(
                      activeRoute.vLat,
                      activeRoute.vLng,
                      activeRoute.sLat,
                      activeRoute.sLng
                    )
                  ) * 3
                ).toFixed(0)}{" "}
                mins
              </strong>
            </span>

            <span>
              🟢 Route:{" "}
              <strong
                style={{
                  color: "#4ade80",
                }}
              >
                Clear
              </strong>
            </span>
          </div>

          <button
            onClick={() =>
              setActiveRoute(null)
            }
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
              fontSize: "11px",
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* MAP */}

      <MapContainer
        center={[26.05, 86.70]}
        zoom={10}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {/* ACTIVE ROUTE */}

        {activeRoute &&
          activeRoute.coords && (
            <Polyline
              positions={
                activeRoute.coords
              }
              pathOptions={{
                color: "#2563eb",
                weight: 5,
                dashArray: "8, 8",
              }}
            />
          )}

        {/* SHELTERS */}

        {showShelters &&
          filteredShelters.map(
            (shelter, index) => {
              if (
                shelter.latitude == null ||
                shelter.longitude == null ||
                isNaN(
                  Number(
                    shelter.latitude
                  )
                ) ||
                isNaN(
                  Number(
                    shelter.longitude
                  )
                )
              ) {
                return null;
              }

              const isCrowded =
                Number(
                  shelter.available_capacity ||
                    0
                ) < 50;

              const chosenIcon =
                isCrowded
                  ? crowdedShelterIcon
                  : shelterIcon;

              return (
                <Marker
                  key={`shelter-${index}`}
                  position={[
                    Number(
                      shelter.latitude
                    ),
                    Number(
                      shelter.longitude
                    ),
                  ]}
                  icon={chosenIcon}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -8]}
                    opacity={0.9}
                  >
                    <span>
                      🏠{" "}
                      {shelter.shelter_name ||
                        "Shelter"}{" "}
                      (Space:{" "}
                      {shelter.available_capacity ??
                        "N/A"}
                      )
                    </span>
                  </Tooltip>
                </Marker>
              );
            }
          )}

        {/* ANIMALS */}

        {showAnimals &&
          filteredAnimals.map(
            (animal, index) => {
              if (
                animal.latitude == null ||
                animal.longitude == null ||
                isNaN(
                  Number(animal.latitude)
                ) ||
                isNaN(
                  Number(animal.longitude)
                )
              ) {
                return null;
              }

              return (
                <Marker
                  key={`animal-${index}`}
                  position={[
                    Number(
                      animal.latitude
                    ),
                    Number(
                      animal.longitude
                    ),
                  ]}
                  icon={animalIcon}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -6]}
                    opacity={0.9}
                  >
                    <span>
                      🐾{" "}
                      {animal.animal_type} (
                      {animal.estimated_affected ||
                        animal.count}
                      )
                    </span>
                  </Tooltip>
                </Marker>
              );
            }
          )}

        {/* VILLAGES */}

        {showVillages &&
          filteredVillages.map(
            (village, index) => {
              if (
                village.latitude == null ||
                village.longitude == null ||
                isNaN(
                  Number(village.latitude)
                ) ||
                isNaN(
                  Number(village.longitude)
                )
              ) {
                return null;
              }

              const risk =
                (
                  village.risk_level ||
                  ""
                ).toUpperCase();

              const isCritical =
                risk === "CRITICAL";

              const chosenIcon =
                isCritical
                  ? criticalVillageIcon
                  : highVillageIcon;

              return (
                <Marker
                  key={`village-${index}`}
                  position={[
                    Number(
                      village.latitude
                    ),
                    Number(
                      village.longitude
                    ),
                  ]}
                  icon={chosenIcon}
                  eventHandlers={{
                    click: () =>
                      handleVillageClick(
                        village
                      ),
                  }}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -8]}
                    opacity={0.95}
                  >
                    <span>
                      📍{" "}
                      {village.village} (
                      {village.risk_level}) -
                      Pop:{" "}
                      {village.population_range ||
                        village.population}
                    </span>
                  </Tooltip>
                </Marker>
              );
            }
          )}

        {/* HOSPITALS */}

        {showHospitals &&
          filteredHospitals.map(
            (hospital, index) => {
              if (
                hospital.latitude ==
                  null ||
                hospital.longitude ==
                  null ||
                !Number.isFinite(
                  Number(
                    hospital.latitude
                  )
                ) ||
                !Number.isFinite(
                  Number(
                    hospital.longitude
                  )
                )
              ) {
                return null;
              }

              return (
                <Marker
                  key={`hospital-${index}`}
                  position={[
                    Number(
                      hospital.latitude
                    ),
                    Number(
                      hospital.longitude
                    ),
                  ]}
                  icon={hospitalIcon}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -8]}
                    opacity={0.9}
                  >
                    <span>
                      🏥{" "}
                      {hospital.name ||
                        hospital.hospital_name ||
                        hospital.facility_name ||
                        "Hospital"}

                      {hospital.category
                        ? ` (${hospital.category})`
                        : ""}

                      {hospital.beds_available !=
                      null
                        ? ` - Beds: ${hospital.beds_available}`
                        : ""}
                    </span>
                  </Tooltip>
                </Marker>
              );
            }
          )}
      </MapContainer>
    </div>
  );
}

export default Map;