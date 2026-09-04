import { useState } from 'react';
import { ArrowLeft, Users, Search } from 'lucide-react';

// Embedded shelters data directly to avoid file import errors
const sheltersData = [
  {
    shelter_name: "Supaul College Relief Camp",
    latitude: 26.115,
    longitude: 86.595,
    capacity: 800,
    current_occupancy: 620,
    available_capacity: 180,
    type: "School/College",
    facilities: "Toilets, Drinking Water, Medical Desk, Food Distribution"
  },
  {
    shelter_name: "Triveniganj High School Camp",
    latitude: 26.18,
    longitude: 86.72,
    capacity: 450,
    current_occupancy: 410,
    available_capacity: 40,
    type: "School",
    facilities: "Toilets, Drinking Water"
  },
  {
    shelter_name: "Chhatapur Block Relief Centre",
    latitude: 26.21,
    longitude: 86.68,
    capacity: 600,
    current_occupancy: 280,
    available_capacity: 320,
    type: "Community Hall",
    facilities: "Toilets, Drinking Water, Medical Desk, Kitchen"
  },
  {
    shelter_name: "Raghopur Primary School",
    latitude: 26.25,
    longitude: 86.55,
    capacity: 300,
    current_occupancy: 295,
    available_capacity: 5,
    type: "School",
    facilities: "Toilets, Drinking Water"
  },
  {
    shelter_name: "Basantpur Relief Camp",
    latitude: 26.32,
    longitude: 86.48,
    capacity: 500,
    current_occupancy: 150,
    available_capacity: 350,
    type: "Temporary Camp",
    facilities: "Toilets, Drinking Water, Medical Desk, Food Distribution, Tents"
  },
  {
    shelter_name: "Madhepura Stadium Camp",
    latitude: 25.92,
    longitude: 86.79,
    capacity: 1200,
    current_occupancy: 950,
    available_capacity: 250,
    type: "Stadium/Ground",
    facilities: "Toilets, Drinking Water, Medical Desk, Food Distribution, Electricity"
  },
  {
    shelter_name: "Murliganj High School",
    latitude: 25.88,
    longitude: 86.92,
    capacity: 400,
    current_occupancy: 380,
    available_capacity: 20,
    type: "School",
    facilities: "Toilets, Drinking Water"
  },
  {
    shelter_name: "Kumarkhand Community Centre",
    latitude: 25.95,
    longitude: 86.85,
    capacity: 350,
    current_occupancy: 120,
    available_capacity: 230,
    type: "Community Hall",
    facilities: "Toilets, Drinking Water, Medical Desk, Kitchen"
  },
  {
    shelter_name: "Alamnagar Relief Shelter",
    latitude: 25.85,
    longitude: 86.7,
    capacity: 280,
    current_occupancy: 260,
    available_capacity: 20,
    type: "School",
    facilities: "Toilets, Drinking Water"
  },
  {
    shelter_name: "Singheshwar Temple Complex",
    latitude: 25.98,
    longitude: 86.8,
    capacity: 450,
    current_occupancy: 200,
    available_capacity: 250,
    type: "Religious Complex",
    facilities: "Toilets, Drinking Water, Food Distribution"
  },
  {
    shelter_name: "Bihariganj Block Office Camp",
    latitude: 25.9,
    longitude: 87.0,
    capacity: 320,
    current_occupancy: 80,
    available_capacity: 240,
    type: "Govt Building",
    facilities: "Toilets, Drinking Water, Medical Desk, Electricity"
  },
  {
    shelter_name: "Gwalpara School Camp",
    latitude: 25.87,
    longitude: 86.75,
    capacity: 250,
    current_occupancy: 240,
    available_capacity: 10,
    type: "School",
    facilities: "Toilets, Drinking Water"
  },
  {
    shelter_name: "Pratapganj High School Camp",
    latitude: 26.28,
    longitude: 86.62,
    capacity: 380,
    current_occupancy: 210,
    available_capacity: 170,
    type: "School",
    facilities: "Toilets, Drinking Water, Food Distribution"
  },
  {
    shelter_name: "Nirmali Relief Centre",
    latitude: 26.3,
    longitude: 86.58,
    capacity: 420,
    current_occupancy: 180,
    available_capacity: 240,
    type: "Community Hall",
    facilities: "Toilets, Drinking Water, Medical Desk, Kitchen"
  },
  {
    shelter_name: "Udakishunganj Block Camp",
    latitude: 25.83,
    longitude: 86.95,
    capacity: 550,
    current_occupancy: 300,
    available_capacity: 250,
    type: "Govt Building",
    facilities: "Toilets, Drinking Water, Medical Desk, Electricity, Food Distribution"
  },
  {
    shelter_name: "Shankarpur Primary School",
    latitude: 25.91,
    longitude: 86.88,
    capacity: 220,
    current_occupancy: 195,
    available_capacity: 25,
    type: "School",
    facilities: "Toilets, Drinking Water"
  },
  {
    shelter_name: "Kishanganj Road Temporary Camp",
    latitude: 26.05,
    longitude: 86.65,
    capacity: 600,
    current_occupancy: 140,
    available_capacity: 460,
    type: "Temporary Camp",
    facilities: "Toilets, Drinking Water, Tents, Food Distribution"
  },
  {
    shelter_name: "Gamharia Community Hall",
    latitude: 25.915,
    longitude: 86.97,
    capacity: 300,
    current_occupancy: 90,
    available_capacity: 210,
    type: "Community Hall",
    facilities: "Toilets, Drinking Water, Medical Desk"
  }
];

export default function SheltersScreen({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShelters = sheltersData.filter(shelter => 
    shelter.shelter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shelter.facilities.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mobile-frame">
      <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Header */}
        <div className="dashboard-header">
          <button className="icon-btn" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={22} />
          </button>
          <h2>Safe Shelters ({sheltersData.length})</h2>
          <div style={{ width: 22 }}></div>
        </div>

        {/* Content */}
        <div className="dashboard-content" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          
          {/* Search Field */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f1f5f9',
            borderRadius: '10px',
            padding: '8px 12px',
            marginBottom: '16px',
            gap: '8px'
          }}>
            <Search size={18} color="#64748b" />
            <input 
              type="text"
              placeholder="Search by shelter name or facility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Shelters List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredShelters.map((shelter, idx) => {
              const vacancy = shelter.available_capacity;
              const isCrowded = vacancy < 50;

              return (
                <div 
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a' }}>
                        {shelter.shelter_name}
                      </h4>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                        {shelter.type}
                      </span>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      color: isCrowded ? '#dc2626' : '#16a34a',
                      background: isCrowded ? '#fee2e2' : '#dcfce7'
                    }}>
                      {vacancy} Beds Free
                    </span>
                  </div>

                  {/* Occupancy Indicator */}
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                    <Users size={15} color="#64748b" />
                    <span>Occupancy: <strong>{shelter.current_occupancy}</strong> / {shelter.capacity}</span>
                  </div>

                  {/* Facilities */}
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#334155', lineHeight: '1.4' }}>
                    <strong>Facilities: </strong>{shelter.facilities}
                  </div>

                  <button 
                    onClick={() => alert(`Evacuation corridor locked for: ${shelter.shelter_name}`)}
                    style={{
                      width: '100%',
                      marginTop: '12px',
                      background: '#064e3b',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Select as Safe Evacuation Point
                  </button>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}