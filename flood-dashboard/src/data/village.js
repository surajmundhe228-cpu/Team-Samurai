const villages = [
  {
    village: "Rampur",
    district: "Supaul",
    population: 850,
    latitude: 26.120,
    longitude: 86.920,
    rainfall_mm: 112.0,
    elevation_m: 48,
    distance_from_river_km: 1.2,
    flood_history: "High",
    hazard_score: 90,
    vulnerability_score: 85,
    exposure_score: 88,
    risk_score: 88,
    risk_level: "CRITICAL"
  },
  {
    village: "Bishanpur",
    district: "Supaul",
    population: 620,
    latitude: 26.135,
    longitude: 86.910,
    rainfall_mm: 108.0,
    elevation_m: 51,
    distance_from_river_km: 2.5,
    flood_history: "High",
    hazard_score: 86,
    vulnerability_score: 80,
    exposure_score: 78,
    risk_score: 82,
    risk_level: "CRITICAL"
  }
];

const shelters = [
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

export { villages, shelters };
export default villages;