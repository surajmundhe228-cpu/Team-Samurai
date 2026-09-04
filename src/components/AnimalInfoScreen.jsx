import { useState } from 'react';
import { ArrowLeft, PawPrint, ShieldCheck, MapPin, Search } from 'lucide-react';

const animalsData = [
  {
    id: 1,
    animal_type: "Cattle Herd",
    village: "Bishanpur",
    district: "Supaul",
    latitude: 26.135,
    longitude: 86.910,
    estimated_affected: 45,
    priority: "HIGH",
    status: "Rescue Required",
    notes: "Trapped near flooded pasture ground, requires fodder and high ground relocation."
  },
  {
    id: 2,
    animal_type: "Goats & Livestock",
    village: "Rampur",
    district: "Supaul",
    latitude: 26.120,
    longitude: 86.920,
    estimated_affected: 32,
    priority: "CRITICAL",
    status: "Evacuation in Progress",
    notes: "Low elevation habitations inundated; veterinary first-aid desk dispatched."
  },
  {
    id: 3,
    animal_type: "Water Buffaloes",
    village: "Jorgama",
    district: "Madhepura",
    latitude: 25.920,
    longitude: 86.790,
    estimated_affected: 28,
    priority: "MEDIUM",
    status: "Sheltered on Embankment",
    notes: "Moved along western canal embankment, requires clean drinking water supply."
  }
];

export default function AnimalInfoScreen({ onBack, onNavigateToMap }) {
  const [search, setSearch] = useState('');

  const filtered = animalsData.filter(item => 
    item.animal_type.toLowerCase().includes(search.toLowerCase()) ||
    item.village.toLowerCase().includes(search.toLowerCase()) ||
    item.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mobile-frame">
      <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Header */}
        <div className="dashboard-header">
          <button className="icon-btn" onClick={onBack} title="Back">
            <ArrowLeft size={22} />
          </button>
          <h2>Livestock & Animal Info</h2>
          <div style={{ width: 22 }}></div>
        </div>

        {/* Content */}
        <div className="dashboard-content" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          
          {/* Emergency Advisory Banner */}
          <div style={{
            background: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <ShieldCheck size={20} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#92400e', lineHeight: '1.4' }}>
              <strong>Animal Evacuation Directive:</strong> Untie tethered livestock before water level exceeds 1 foot. Never leave cattle tied in low-lying sheds.
            </div>
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f1f5f9',
            borderRadius: '8px',
            padding: '8px 12px',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <Search size={16} color="#64748b" />
            <input 
              type="text"
              placeholder="Search by animal or village..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Animal Incident List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(animal => {
              const isCritical = animal.priority === 'CRITICAL';

              return (
                <div 
                  key={animal.id}
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
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <PawPrint size={16} color="#0284c7" />
                        {animal.animal_type}
                      </h4>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} /> {animal.village}, {animal.district}
                      </span>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      color: isCritical ? '#b91c1c' : '#c2410c',
                      background: isCritical ? '#fee2e2' : '#ffedd5'
                    }}>
                      {animal.priority}
                    </span>
                  </div>

                  <div style={{ marginTop: '10px', fontSize: '13px', color: '#334155' }}>
                    <span>Estimated Count: <strong>{animal.estimated_affected} heads</strong></span><br />
                    <span>Current Status: <strong style={{ color: '#0369a1' }}>{animal.status}</strong></span>
                  </div>

                  <p style={{ marginTop: '8px', fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: '8px 0 0 0' }}>
                    "{animal.notes}"
                  </p>

                  <button
                    onClick={onNavigateToMap}
                    style={{
                      width: '100%',
                      marginTop: '12px',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    View Rescue Coordinates on Map
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