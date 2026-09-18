import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import villagesData from "../data/villages.json";
import sheltersData from "../data/shelters.json";
import animalsData from "../data/animals.json";

import { getShelters } from "../services/api";
import VillageDetailCard from "./VillageDetailCard";

/* =========================================================
   DISTANCE CALCULATION
========================================================= */

const calculateDistance = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  if (
    lat1 == null ||
    lon1 == null ||
    lat2 == null ||
    lon2 == null
  ) {
    return "0.0";
  }

  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
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

/* =========================================================
   MAP RESIZE HANDLER
========================================================= */

function MapResizeHandler({ fullScreen }) {
  const map = useMap();

  useEffect(() => {
    const timers = [];

    const invalidate = () => {
      map.invalidateSize();
    };

    invalidate();

    timers.push(
      setTimeout(invalidate, 100)
    );

    timers.push(
      setTimeout(invalidate, 350)
    );

    timers.push(
      setTimeout(invalidate, 600)
    );

    return () => {
      timers.forEach((timer) =>
        clearTimeout(timer)
      );
    };
  }, [fullScreen, map]);

  return null;
}

/* =========================================================
   MAP BACKGROUND CLICK HANDLER
========================================================= */

function MapClickHandler({
  fullScreen,
  onOpenFullScreen,
}) {
  useMapEvents({
    click: (event) => {
      /*
       * Only open fullscreen when the
       * actual map background is clicked.
       *
       * Marker clicks are stopped separately.
       */

      if (!fullScreen) {
        event.originalEvent?.stopPropagation();
        onOpenFullScreen();
      }
    },
  });

  return null;
}

/* =========================================================
   SHELTER ICON
========================================================= */

const shelterIcon = L.divIcon({
  className: "custom-shelter-marker",

  html: `
    <div style="
      background:#16a34a;
      color:white;
      width:30px;
      height:30px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      font-size:15px;
      border:2px solid white;
      box-shadow:0 2px 7px rgba(0,0,0,0.35);
    ">
      🏠
    </div>
  `,

  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

/* =========================================================
   CROWDED SHELTER ICON
========================================================= */

const crowdedShelterIcon = L.divIcon({
  className: "custom-shelter-marker",

  html: `
    <div style="
      background:#9333ea;
      color:white;
      width:30px;
      height:30px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      font-size:15px;
      border:2px solid white;
      box-shadow:0 2px 7px rgba(0,0,0,0.35);
    ">
      🏠
    </div>
  `,

  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

/* =========================================================
   ANIMAL ICON
========================================================= */

const animalIcon = L.divIcon({
  className: "custom-animal-marker",

  html: `
    <div style="
      background:#fbbf24;
      color:#78350f;
      width:28px;
      height:28px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      font-size:14px;
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    ">
      🐾
    </div>
  `,

  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

/* =========================================================
   CRITICAL VILLAGE ICON
========================================================= */

const criticalVillageIcon = L.divIcon({
  className: "custom-village-marker",

  html: `
    <div style="
      background:#dc2626;
      color:white;
      width:32px;
      height:32px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      font-size:15px;
      border:2px solid white;
      box-shadow:0 3px 8px rgba(0,0,0,0.35);
    ">
      📍
    </div>
  `,

  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

/* =========================================================
   HIGH RISK VILLAGE ICON
========================================================= */

const highVillageIcon = L.divIcon({
  className: "custom-village-marker",

  html: `
    <div style="
      background:#ea580c;
      color:white;
      width:32px;
      height:32px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      font-size:15px;
      border:2px solid white;
      box-shadow:0 3px 8px rgba(0,0,0,0.35);
    ">
      📍
    </div>
  `,

  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

/* =========================================================
   NORMAL VILLAGE ICON
========================================================= */

const normalVillageIcon = L.divIcon({
  className: "custom-village-marker",

  html: `
    <div style="
      background:#2563eb;
      color:white;
      width:32px;
      height:32px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      font-size:15px;
      border:2px solid white;
      box-shadow:0 3px 8px rgba(0,0,0,0.35);
    ">
      📍
    </div>
  `,

  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

/* =========================================================
   MAIN MAP COMPONENT
========================================================= */

function Map() {
  /* =======================================================
     STATE
  ======================================================= */

  const [
    selectedVillage,
    setSelectedVillage,
  ] = useState(null);

  const [
    activeRoute,
    setActiveRoute,
  ] = useState(null);

  const [
    selectedDistrict,
    setSelectedDistrict,
  ] = useState("All");

  const [
    showVillages,
    setShowVillages,
  ] = useState(true);

  const [
    showShelters,
    setShowShelters,
  ] = useState(true);

  const [
    showAnimals,
    setShowAnimals,
  ] = useState(true);

  const [
    fullScreen,
    setFullScreen,
  ] = useState(false);

  /* =======================================================
     LIVE SHELTER DATA
  ======================================================= */

  const [shelters, setShelters] = useState(
    Array.isArray(sheltersData)
      ? sheltersData
      : []
  );

  useEffect(() => {
    let mounted = true;

    const loadShelters = async () => {
      try {
        const data = await getShelters();

        const liveShelters = Array.isArray(data)
          ? data
          : data?.shelters || [];

        if (
          mounted &&
          Array.isArray(liveShelters) &&
          liveShelters.length > 0
        ) {
          setShelters(liveShelters);
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
      mounted = false;
    };
  }, []);

  /* =======================================================
     SAFE DATA
  ======================================================= */

  const villages = Array.isArray(villagesData)
    ? villagesData
    : [];

  const animals = Array.isArray(animalsData)
    ? animalsData
    : [];

  /* =======================================================
     DISTRICTS
  ======================================================= */

  const districts = [
    "All",
    ...new Set(
      villages
        .map((village) => village.district)
        .filter(Boolean)
    ),
  ];

  /* =======================================================
     FILTERED VILLAGES
  ======================================================= */

  const filteredVillages = villages.filter(
    (village) =>
      selectedDistrict === "All" ||
      village.district === selectedDistrict
  );

  /* =======================================================
     FILTERED SHELTERS
  ======================================================= */

  const filteredShelters = shelters.filter(
    (shelter) => {
      if (selectedDistrict === "All") {
        return true;
      }

      if (
        shelter.district ===
        selectedDistrict
      ) {
        return true;
      }

      return (
        shelter.shelter_name?.includes(
          selectedDistrict
        ) || false
      );
    }
  );

  /* =======================================================
     FILTERED ANIMALS
  ======================================================= */

  const filteredAnimals = animals.filter(
    (animal) => {
      if (selectedDistrict === "All") {
        return true;
      }

      if (
        animal.district ===
        selectedDistrict
      ) {
        return true;
      }

      const matchedVillage =
        villages.find(
          (village) =>
            village.village ===
            animal.village
        );

      return matchedVillage
        ? matchedVillage.district ===
            selectedDistrict
        : true;
    }
  );

  /* =======================================================
     OPEN FULLSCREEN
  ======================================================= */

  const openFullScreen = () => {
    setFullScreen(true);
  };

  /* =======================================================
     CLOSE FULLSCREEN
  ======================================================= */

  const closeFullScreen = () => {
    setFullScreen(false);
  };

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (
        event.key === "Escape" &&
        fullScreen
      ) {
        closeFullScreen();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [fullScreen]);

  /* =======================================================
     LOCK PAGE SCROLL ONLY IN FULLSCREEN
  ======================================================= */

  useEffect(() => {
    if (fullScreen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [fullScreen]);

  /* =======================================================
     VILLAGE CLICK
  ======================================================= */

  const handleVillageClick = (
    village
  ) => {
    setSelectedVillage(village);
  };

  /* =======================================================
     VILLAGE ICON
  ======================================================= */

  const getVillageIcon = (
    village
  ) => {
    const risk = String(
      village.risk_level ||
        village.riskLevel ||
        ""
    ).toUpperCase();

    if (
      risk === "CRITICAL" ||
      risk.includes("CRITICAL")
    ) {
      return criticalVillageIcon;
    }

    if (
      risk === "HIGH" ||
      risk.includes("HIGH")
    ) {
      return highVillageIcon;
    }

    return normalVillageIcon;
  };

  /* =======================================================
     FIND EVACUATION SHELTER
  ======================================================= */

  const handleAllocateShelter =
    () => {
      if (!selectedVillage) {
        return;
      }

      const population = Number(
        selectedVillage.population_numeric_for_calc ||
          selectedVillage.population ||
          0
      );

      const suitableShelters =
        shelters.filter(
          (shelter) =>
            Number(
              shelter.available_capacity ||
                0
            ) >= population
        );

      let matchedShelter = null;

      if (
        suitableShelters.length > 0
      ) {
        matchedShelter =
          suitableShelters[0];
      } else if (
        shelters.length > 0
      ) {
        matchedShelter =
          shelters.reduce(
            (
              previous,
              current
            ) =>
              Number(
                previous.available_capacity ||
                  0
              ) >
              Number(
                current.available_capacity ||
                  0
              )
                ? previous
                : current
          );
      }

      if (!matchedShelter) {
        alert(
          "No suitable shelter is available."
        );
        return;
      }

      if (
        matchedShelter.latitude ==
          null ||
        matchedShelter.longitude ==
          null ||
        selectedVillage.latitude ==
          null ||
        selectedVillage.longitude ==
          null
      ) {
        alert(
          "Invalid coordinate data for routing."
        );
        return;
      }

      const vLat = Number(
        selectedVillage.latitude
      );

      const vLng = Number(
        selectedVillage.longitude
      );

      const sLat = Number(
        matchedShelter.latitude
      );

      const sLng = Number(
        matchedShelter.longitude
      );

      if (
        !Number.isFinite(vLat) ||
        !Number.isFinite(vLng) ||
        !Number.isFinite(sLat) ||
        !Number.isFinite(sLng)
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

        vLat,
        vLng,
        sLat,
        sLng,

        coords: [
          [vLat, vLng],
          [sLat, sLng],
        ],
      });
    };

  /* =======================================================
     CLEAR ROUTE
  ======================================================= */

  const clearRoute = () => {
    setActiveRoute(null);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className={
        fullScreen
          ? "map-view-container fullscreen"
          : "map-view-container"
      }
      style={{
        height: fullScreen
          ? "100vh"
          : "500px",

        width: "100%",

        position: fullScreen
          ? "fixed"
          : "relative",

        top: fullScreen ? 0 : "auto",
        left: fullScreen ? 0 : "auto",
        right: fullScreen ? 0 : "auto",
        bottom: fullScreen ? 0 : "auto",

        zIndex: fullScreen
          ? 99999
          : 1,

        overflow: "hidden",

        background: "#e2e8f0",
      }}
    >
      {/* ===================================================
          FULLSCREEN HEADER
      =================================================== */}

      {fullScreen && (
        <>
          {/* BACK BUTTON */}

          <button
            onClick={closeFullScreen}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            onTouchStart={(event) =>
              event.stopPropagation()
            }
            style={{
              position: "absolute",
              top: "18px",
              left: "18px",
              zIndex: 6000,

              background: "#0f172a",
              color: "#ffffff",

              border: "none",
              borderRadius: "10px",

              padding: "11px 17px",

              fontSize: "14px",
              fontWeight: "700",

              cursor: "pointer",

              boxShadow:
                "0 4px 15px rgba(0,0,0,0.35)",
            }}
          >
            ← Back
          </button>

          {/* TITLE */}

          <div
            style={{
              position: "absolute",

              top: "18px",
              left: "50%",

              transform:
                "translateX(-50%)",

              zIndex: 5000,

              background:
                "rgba(255,255,255,0.96)",

              color: "#0f172a",

              padding:
                "10px 18px",

              borderRadius: "10px",

              fontSize: "15px",
              fontWeight: "700",

              boxShadow:
                "0 4px 15px rgba(0,0,0,0.2)",

              whiteSpace: "nowrap",

              pointerEvents: "none",
            }}
          >
            🌊 Reloc8 Emergency Map
          </div>
        </>
      )}

      {/* ===================================================
          FILTER PANEL
      =================================================== */}

      <div
        className="map-filter-panel"
        style={{
          position: "absolute",

          top: fullScreen
            ? "78px"
            : "16px",

          left: "16px",

          zIndex: 5000,

          background:
            "rgba(255,255,255,0.96)",

          padding: "12px 16px",

          borderRadius: "12px",

          boxShadow:
            "0 4px 18px rgba(0,0,0,0.18)",

          fontFamily:
            "system-ui, sans-serif",

          fontSize: "13px",

          display: "flex",
          flexDirection: "column",

          gap: "9px",

          minWidth: "190px",
        }}
      >
        <div>
          <label
            style={{
              fontWeight: "700",
              fontSize: "11px",

              color: "#64748b",

              textTransform:
                "uppercase",

              letterSpacing:
                "0.4px",
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

              marginTop: "5px",

              padding: "7px 9px",

              borderRadius: "7px",

              border:
                "1px solid #cbd5e1",

              fontSize: "12px",

              background: "#ffffff",

              cursor: "pointer",
            }}
          >
            {districts.map(
              (district) => (
                <option
                  key={district}
                  value={district}
                >
                  {district ===
                  "All"
                    ? "All Districts"
                    : district}
                </option>
              )
            )}
          </select>
        </div>

        <div
          style={{
            borderTop:
              "1px solid #e2e8f0",

            paddingTop: "7px",

            display: "flex",
            flexDirection:
              "column",

            gap: "7px",
          }}
        >
          {/* VILLAGES */}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",

              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={
                showVillages
              }
              onChange={(event) =>
                setShowVillages(
                  event.target.checked
                )
              }
            />

            Habitations (
            {
              filteredVillages.length
            }
            )
          </label>

          {/* SHELTERS */}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",

              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={
                showShelters
              }
              onChange={(event) =>
                setShowShelters(
                  event.target.checked
                )
              }
            />

            Safe Shelters (
            {
              filteredShelters.length
            }
            )
          </label>

          {/* ANIMALS */}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",

              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={
                showAnimals
              }
              onChange={(event) =>
                setShowAnimals(
                  event.target.checked
                )
              }
            />

            Animal Reports 🐾 (
            {
              filteredAnimals.length
            }
            )
          </label>
        </div>
      </div>

      {/* ===================================================
          MAP LEGEND
      =================================================== */}

      <div
        className="map-legend"
        style={{
          position: "absolute",

          top: fullScreen
            ? "78px"
            : "215px",

          right: "16px",
          left: "auto",

          zIndex: 5000,

          background:
            "rgba(255,255,255,0.96)",

          padding: "11px 14px",

          borderRadius: "10px",

          boxShadow:
            "0 3px 12px rgba(0,0,0,0.16)",

          fontSize: "12px",

          lineHeight: "1.7",

          color: "#1e293b",

          fontFamily:
            "system-ui, sans-serif",

          minWidth: "185px",
        }}
      >
        <strong
          style={{
            display: "block",
            marginBottom: "5px",
          }}
        >
          Map Indicators
        </strong>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",

              borderRadius: "50%",

              background:
                "#dc2626",
            }}
          />

          Critical Habitation 📍
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",

              borderRadius: "50%",

              background:
                "#ea580c",
            }}
          />

          High Risk Habitation 📍
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",

              borderRadius: "50%",

              background:
                "#16a34a",
            }}
          />

          Shelter 🏠
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",

              borderRadius: "50%",

              background:
                "#fbbf24",
            }}
          />

          Animal Rescue 🐾
        </div>
      </div>

      {/* ===================================================
          ACTIVE ROUTE CARD
      =================================================== */}

      {activeRoute && (
        <div
          className="map-route-card"
          style={{
            position: "absolute",

            bottom: "20px",
            left: "20px",

            zIndex: 5000,

            background: "#0f172a",

            color: "#ffffff",

            padding: "15px 18px",

            borderRadius: "12px",

            boxShadow:
              "0 10px 25px rgba(0,0,0,0.3)",

            fontSize: "13px",

            fontFamily:
              "system-ui, sans-serif",

            minWidth: "320px",

            maxWidth:
              "calc(100vw - 40px)",
          }}
        >
          <div
            style={{
              fontSize: "11px",

              color: "#94a3b8",

              textTransform:
                "uppercase",

              letterSpacing:
                "0.5px",

              marginBottom: "5px",
            }}
          >
            Recommended Evacuation
            Corridor
          </div>

          <div
            style={{
              fontSize: "15px",

              fontWeight: "600",

              marginBottom: "9px",
            }}
          >
            {activeRoute.fromVillage}

            <span
              style={{
                color: "#38bdf8",

                margin:
                  "0 7px",
              }}
            >
              →
            </span>

            <span
              style={{
                color: "#4ade80",
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

              paddingTop: "9px",

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
            onClick={clearRoute}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            style={{
              position: "absolute",

              top: "10px",
              right: "10px",

              background: "#334155",

              color: "#ffffff",

              border: "none",

              padding:
                "4px 8px",

              borderRadius: "6px",

              cursor: "pointer",

              fontSize: "11px",
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* ===================================================
          VILLAGE DETAIL CARD
      =================================================== */}

      {selectedVillage && (
        <VillageDetailCard
          village={selectedVillage}
          onClose={() =>
            setSelectedVillage(null)
          }
          onRouteClick={
            handleAllocateShelter
          }
        />
      )}

      {/* ===================================================
          LEAFLET MAP
      =================================================== */}

      <MapContainer
        center={[
          26.05,
          86.70,
        ]}
        zoom={10}

        /*
         * NORMAL DASHBOARD:
         * Scroll wheel zoom OFF so the
         * page can scroll normally.
         *
         * FULLSCREEN:
         * Scroll wheel zoom ON.
         */

        scrollWheelZoom={
          fullScreen
        }

        dragging={true}

        doubleClickZoom={true}

        touchZoom={true}

        keyboard={true}

        zoomControl={false}

        attributionControl={true}

        style={{
          height: "100%",
          width: "100%",

          minHeight:
            fullScreen
              ? "100vh"
              : "500px",

          zIndex: 1,
        }}

        whenReady={(event) => {
          setTimeout(() => {
            event.target.invalidateSize();
          }, 300);
        }}
      >
        {/* =================================================
            MAP CLICK
        ================================================= */}

        <MapClickHandler
          fullScreen={fullScreen}
          onOpenFullScreen={
            openFullScreen
          }
        />

        {/* =================================================
            RESIZE
        ================================================= */}

        <MapResizeHandler
          fullScreen={fullScreen}
        />

        {/* =================================================
            ZOOM CONTROL
        ================================================= */}

        <ZoomControl
          position="topright"
        />

        {/* =================================================
            OPENSTREETMAP
        ================================================= */}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* =================================================
            EVACUATION ROUTE
        ================================================= */}

        {activeRoute &&
          activeRoute.coords && (
            <Polyline
              positions={
                activeRoute.coords
              }
              pathOptions={{
                color: "#2563eb",
                weight: 5,
                opacity: 0.9,
                dashArray: "8, 8",
              }}
            />
          )}

        {/* =================================================
            SHELTER MARKERS
        ================================================= */}

        {showShelters &&
          filteredShelters.map(
            (shelter, index) => {
              if (
                shelter.latitude ==
                  null ||
                shelter.longitude ==
                  null
              ) {
                return null;
              }

              const latitude =
                Number(
                  shelter.latitude
                );

              const longitude =
                Number(
                  shelter.longitude
                );

              if (
                !Number.isFinite(
                  latitude
                ) ||
                !Number.isFinite(
                  longitude
                )
              ) {
                return null;
              }

              const isCrowded =
                Number(
                  shelter.available_capacity ||
                    0
                ) < 50;

              const icon =
                isCrowded
                  ? crowdedShelterIcon
                  : shelterIcon;

              return (
                <Marker
                  key={`shelter-${index}`}
                  position={[
                    latitude,
                    longitude,
                  ]}
                  icon={icon}
                  eventHandlers={{
                    click: (event) => {
                      /*
                       * Shelter click should
                       * NOT open fullscreen.
                       */

                      event.originalEvent?.stopPropagation();
                    },
                  }}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -8]}
                    opacity={0.95}
                  >
                    <span>
                      🏠{" "}
                      {
                        shelter.shelter_name
                      }{" "}
                      — Space:{" "}
                      {
                        shelter.available_capacity
                      }
                    </span>
                  </Tooltip>
                </Marker>
              );
            }
          )}

        {/* =================================================
            ANIMAL MARKERS
        ================================================= */}

        {showAnimals &&
          filteredAnimals.map(
            (animal, index) => {
              if (
                animal.latitude ==
                  null ||
                animal.longitude ==
                  null
              ) {
                return null;
              }

              const latitude =
                Number(
                  animal.latitude
                );

              const longitude =
                Number(
                  animal.longitude
                );

              if (
                !Number.isFinite(
                  latitude
                ) ||
                !Number.isFinite(
                  longitude
                )
              ) {
                return null;
              }

              return (
                <Marker
                  key={`animal-${index}`}
                  position={[
                    latitude,
                    longitude,
                  ]}
                  icon={animalIcon}
                  eventHandlers={{
                    click: (event) => {
                      /*
                       * Animal marker click
                       * should NOT open fullscreen.
                       */

                      event.originalEvent?.stopPropagation();
                    },
                  }}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -7]}
                    opacity={0.95}
                  >
                    <span>
                      🐾{" "}
                      {
                        animal.animal_type
                      }{" "}
                      (
                      {
                        animal.estimated_affected ||
                        animal.count ||
                        "--"
                      }
                      )
                    </span>
                  </Tooltip>
                </Marker>
              );
            }
          )}

        {/* =================================================
            VILLAGE MARKERS
        ================================================= */}

        {showVillages &&
          filteredVillages.map(
            (village, index) => {
              if (
                village.latitude ==
                  null ||
                village.longitude ==
                  null
              ) {
                return null;
              }

              const latitude =
                Number(
                  village.latitude
                );

              const longitude =
                Number(
                  village.longitude
                );

              if (
                !Number.isFinite(
                  latitude
                ) ||
                !Number.isFinite(
                  longitude
                )
              ) {
                return null;
              }

              const icon =
                getVillageIcon(
                  village
                );

              return (
                <Marker
                  key={`village-${index}`}
                  position={[
                    latitude,
                    longitude,
                  ]}
                  icon={icon}
                  eventHandlers={{
                    click: (event) => {
                      /*
                       * Village marker click:
                       * select village only.
                       *
                       * Do NOT open fullscreen.
                       */

                      event.originalEvent?.stopPropagation();

                      handleVillageClick(
                        village
                      );
                    },
                  }}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -8]}
                    opacity={0.95}
                  >
                    <span>
                      📍{" "}
                      {
                        village.village
                      }{" "}
                      (
                      {
                        village.risk_level ||
                        "UNKNOWN"
                      }
                      )
                      {" - Pop: "}
                      {
                        village.population_range ||
                        village.population ||
                        "--"
                      }
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
