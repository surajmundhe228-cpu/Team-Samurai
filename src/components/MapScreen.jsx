import { useState, useMemo } from 'react';
import { ArrowLeft, Filter, ChevronDown } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './CitizenDashboard.css';

const MAP_DATA = {
  habitations: [
    { id: 'h1', name: 'Rampur', district: 'Supaul', lat: 26.12, lng: 86.60, rainfall: 112.0, status: 'CRITICAL' },
    { id: 'h2', name: 'Bishanpur', district: 'Supaul', lat: 26.15, lng: 86.58, rainfall: 108.0, status: 'CRITICAL' },
    { id: 'h3', name: 'Jorgama', district: 'Madhepura', lat: 25.92, lng: 86.79, rainfall: 105.5, status: 'CRITICAL' },
    { id: 'h4', name: 'Pratapganj', district: 'Supaul', lat: 26.29, lng: 86.82, rainfall: 110.0, status: 'CRITICAL' },
    { id: 'h5', name: 'Udakishunganj', district: 'Madhepura', lat: 25.68, lng: 86.95, rainfall: 107.0, status: 'CRITICAL' },
    { id: 'h6', name: 'Pipra', district: 'Supaul', lat: 26.05, lng: 86.68, rainfall: 82.0, status: 'WARNING' },
    { id: 'h7', name: 'Singheshwar', district: 'Madhepura', lat: 26.01, lng: 86.81, rainfall: 78.0, status: 'WARNING' },
  ],
  shelters: [
    { id: 's1', name: 'Rampur Govt High School Shelter', district: 'Supaul', lat: 26.13, lng: 86.62, capacity: '450 people', status: 'Active' },
    { id: 's2', name: 'Supaul Stadium Relief Hub', district: 'Supaul', lat: 26.11, lng: 86.59, capacity: '1200 people', status: 'Active' },
    { id: 's3', name: 'Madhepura College Evacuation Center', district: 'Madhepura', lat: 25.93, lng: 86.80, capacity: '800 people', status: 'Active' },
    { id: 's4', name: 'Pratapganj Panchayat Bhawan', district: 'Supaul', lat: 26.30, lng: 86.83, capacity: '350 people', status: 'Active' },
  ],
  animals: [
    { id: 'a1', name: 'Supaul Animal Rescue Pen', district: 'Supaul', lat: 26.10, lng: 86.61, capacity: '180 Cattle', status: 'Open' },
    { id: 'a2', name: 'Madhepura Veterinary Camp', district: 'Madhepura', lat: 25.91, lng: 86.78, capacity: '220 Cattle', status: 'Open' },
  ]
};

function MapRecenter({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function MapScreen({ onBack }) {
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [showHabitations, setShowHabitations] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showAnimals, setShowAnimals] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const filteredHabitations = useMemo(() => {
    if (selectedDistrict === 'All') return MAP_DATA.habitations;
    return MAP_DATA.habitations.filter(h => h.district === selectedDistrict);
  }, [selectedDistrict]);

  const filteredShelters = useMemo(() => {
    if (selectedDistrict === 'All') return MAP_DATA.shelters;
    return MAP_DATA.shelters.filter(s => s.district === selectedDistrict);
  }, [selectedDistrict]);

  const filteredAnimals = useMemo(() => {
    if (selectedDistrict === 'All') return MAP_DATA.animals;
    return MAP_DATA.animals.filter(a => a.district === selectedDistrict);
  }, [selectedDistrict]);

  const mapCenter = selectedDistrict === 'Madhepura' ? [25.92, 86.80] : [26.12, 86.60];

  return (
    <div className="dashboard-page-wrapper">
      <div className="dashboard-mobile-frame">
        
        {/* Header - Back arrow left, Title centered */}
        <div 
          className="dashboard-header" 
          style={{ 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '0 16px' 
          }}
        >
          <button 
            onClick={onBack} 
            className="icon-btn" 
            title="Back"
            style={{ position: 'absolute', left: '16px' }}
          >
            <ArrowLeft size={22} color="#ffffff" />
          </button>
          
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff', textAlign: 'center' }}>
            Interactive Risk Map
          </h2>
        </div>

        {/* Map Container Area */}
        <div style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden' }}>
          
          {/* Floating Filter Card - Positioned on the right */}
          <div 
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 1000,
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
              border: '1px solid #e2e8f0',
              width: '165px',
              overflow: 'hidden'
            }}
          >
            <div 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                borderBottom: isFilterOpen ? '1px solid #e2e8f0' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={14} color="#0f4d34" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>Map Filters</span>
              </div>
              <ChevronDown 
                size={14} 
                color="#64748b" 
                style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} 
              />
            </div>

            {isFilterOpen && (
              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#0f172a',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="All">All Districts</option>
                    <option value="Supaul">Supaul</option>
                    <option value="Madhepura">Madhepura</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={showHabitations}
                      onChange={(e) => setShowHabitations(e.target.checked)}
                      style={{ accentColor: '#dc2626' }}
                    />
                    <span>Habitations ({filteredHabitations.length})</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={showShelters}
                      onChange={(e) => setShowShelters(e.target.checked)}
                      style={{ accentColor: '#10b981' }}
                    />
                    <span>Safe Shelters ({filteredShelters.length})</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={showAnimals}
                      onChange={(e) => setShowAnimals(e.target.checked)}
                      style={{ accentColor: '#ea580c' }}
                    />
                    <span>Animals 🐾 ({filteredAnimals.length})</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Leaflet Map Canvas */}
          <MapContainer 
            center={mapCenter} 
            zoom={10} 
            zoomControl={true}
            style={{ height: '100%', width: '100%' }}
          >
            <MapRecenter center={mapCenter} />
            
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Habitations Pins */}
            {showHabitations && filteredHabitations.map((item) => (
              <CircleMarker
                key={item.id}
                center={[item.lat, item.lng]}
                radius={item.status === 'CRITICAL' ? 9 : 7}
                pathOptions={{
                  color: item.status === 'CRITICAL' ? '#dc2626' : '#f59e0b',
                  fillColor: item.status === 'CRITICAL' ? '#ef4444' : '#fbbf24',
                  fillOpacity: 0.85,
                  weight: 2
                }}
              >
                <Popup>
                  <div style={{ fontSize: '12px', minWidth: '130px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{item.name}</div>
                    <div>District: <strong>{item.district}</strong></div>
                    <div>Rainfall: <strong>{item.rainfall} mm</strong></div>
                    <div style={{ marginTop: '6px', fontWeight: 800, color: item.status === 'CRITICAL' ? '#dc2626' : '#d97706' }}>
                      {item.status} FLOOD RISK
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* Shelters Pins */}
            {showShelters && filteredShelters.map((item) => (
              <CircleMarker
                key={item.id}
                center={[item.lat, item.lng]}
                radius={8}
                pathOptions={{
                  color: '#059669',
                  fillColor: '#10b981',
                  fillOpacity: 0.85,
                  weight: 2
                }}
              >
                <Popup>
                  <div style={{ fontSize: '12px', minWidth: '130px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{item.name}</div>
                    <div>District: <strong>{item.district}</strong></div>
                    <div>Capacity: <strong>{item.capacity}</strong></div>
                    <div style={{ marginTop: '6px', fontWeight: 800, color: '#059669' }}>
                      SAFE RELOCATION SHELTER
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* Animals Pins */}
            {showAnimals && filteredAnimals.map((item) => (
              <CircleMarker
                key={item.id}
                center={[item.lat, item.lng]}
                radius={7}
                pathOptions={{
                  color: '#7c3aed',
                  fillColor: '#a855f7',
                  fillOpacity: 0.85,
                  weight: 2
                }}
              >
                <Popup>
                  <div style={{ fontSize: '12px', minWidth: '130px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{item.name}</div>
                    <div>District: <strong>{item.district}</strong></div>
                    <div>Capacity: <strong>{item.capacity}</strong></div>
                    <div style={{ marginTop: '6px', fontWeight: 800, color: '#7c3aed' }}>
                      LIVESTOCK SAFETY HUB
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
}