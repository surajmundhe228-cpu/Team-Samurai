const shelters = [
  {
    shelter_name: "Supaul College Relief Camp",
    district: "Supaul",
    contact_person: "Rajesh Kumar",
    role: "Camp In-Charge",
    phone: "+91-94312-45001",
    alternate_phone: "+91-99341-22010",
    email: "supaul.college.camp@gov.in",
    emergency_helpline: "1077",
    address: "Supaul College Campus, Ward 5, Supaul",
    latitude: 26.115,
    longitude: 86.595,
    available_24x7: true,
    capacity: 800,
    current_occupancy: 620,
    available_capacity: 180,
    type: "School/College",
    facilities:
      "Toilets, Drinking Water, Medical Desk, Food Distribution"
  },

  {
    shelter_name: "Triveniganj High School Camp",
    district: "Supaul",
    contact_person: "Sunita Devi",
    role: "Relief Coordinator",
    phone: "+91-94312-45002",
    alternate_phone: "+91-99341-22011",
    email: "triveniganj.camp@gov.in",
    emergency_helpline: "1077",
    address: "Triveniganj High School, Triveniganj Block",
    latitude: 26.18,
    longitude: 86.72,
    available_24x7: true,
    capacity: 450,
    current_occupancy: 410,
    available_capacity: 40,
    type: "School",
    facilities:
      "Toilets, Drinking Water"
  },

  {
    shelter_name: "Chhatapur Block Relief Centre",
    district: "Supaul",
    contact_person: "Amit Sharma",
    role: "Block Relief Officer",
    phone: "+91-94312-45003",
    alternate_phone: "+91-99341-22012",
    email: "chhatapur.relief@gov.in",
    emergency_helpline: "1077",
    address: "Block Office Complex, Chhatapur",
    latitude: 26.21,
    longitude: 86.68,
    available_24x7: true,
    capacity: 600,
    current_occupancy: 280,
    available_capacity: 320,
    type: "Community Hall",
    facilities:
      "Toilets, Drinking Water, Medical Desk, Kitchen"
  },

  {
    shelter_name: "Raghopur Primary School",
    district: "Supaul",
    contact_person: "Priya Singh",
    role: "Camp Manager",
    phone: "+91-94312-45004",
    alternate_phone: "+91-99341-22013",
    email: "raghopur.school.camp@gov.in",
    emergency_helpline: "1077",
    address: "Raghopur Primary School, Raghopur",
    latitude: 26.25,
    longitude: 86.55,
    available_24x7: false,
    capacity: 300,
    current_occupancy: 295,
    available_capacity: 5,
    type: "School",
    facilities:
      "Toilets, Drinking Water"
  },

  {
    shelter_name: "Basantpur Relief Camp",
    district: "Supaul",
    contact_person: "Manoj Yadav",
    role: "Camp In-Charge",
    phone: "+91-94312-45005",
    alternate_phone: "+91-99341-22014",
    email: "basantpur.camp@gov.in",
    emergency_helpline: "1077",
    address: "Basantpur Temporary Relief Ground",
    latitude: 26.32,
    longitude: 86.48,
    available_24x7: true,
    capacity: 500,
    current_occupancy: 150,
    available_capacity: 350,
    type: "Temporary Camp",
    facilities:
      "Toilets, Drinking Water, Medical Desk, Food Distribution, Tents"
  },

  {
    shelter_name: "Madhepura Stadium Camp",
    district: "Madhepura",
    contact_person: "Dr. Anita Kumari",
    role: "District Relief Coordinator",
    phone: "+91-94314-56001",
    alternate_phone: "+91-99345-33001",
    email: "madhepura.stadium.camp@gov.in",
    emergency_helpline: "1077",
    address: "Madhepura Stadium, District HQ",
    latitude: 25.92,
    longitude: 86.79,
    available_24x7: true,
    capacity: 1200,
    current_occupancy: 950,
    available_capacity: 250,
    type: "Stadium/Ground",
    facilities:
      "Toilets, Drinking Water, Medical Desk, Food Distribution, Electricity"
  },

  {
    shelter_name: "Murliganj High School",
    district: "Madhepura",
    contact_person: "Suresh Paswan",
    role: "Camp Manager",
    phone: "+91-94314-56002",
    alternate_phone: "+91-99345-33002",
    email: "murliganj.camp@gov.in",
    emergency_helpline: "1077",
    address: "Murliganj High School Campus",
    latitude: 25.88,
    longitude: 86.92,
    available_24x7: true,
    capacity: 400,
    current_occupancy: 380,
    available_capacity: 20,
    type: "School",
    facilities:
      "Toilets, Drinking Water"
  },

  {
    shelter_name: "Kumarkhand Community Centre",
    district: "Madhepura",
    contact_person: "Kavita Jha",
    role: "Relief Coordinator",
    phone: "+91-94314-56003",
    alternate_phone: "+91-99345-33003",
    email: "kumarkhand.camp@gov.in",
    emergency_helpline: "1077",
    address: "Community Centre, Kumarkhand Block",
    latitude: 25.95,
    longitude: 86.85,
    available_24x7: false,
    capacity: 350,
    current_occupancy: 120,
    available_capacity: 230,
    type: "Community Hall",
    facilities:
      "Toilets, Drinking Water, Medical Desk, Kitchen"
  },

  {
    shelter_name: "Alamnagar Relief Shelter",
    district: "Madhepura",
    contact_person: "Rakesh Kumar",
    role: "Camp In-Charge",
    phone: "+91-94314-56004",
    alternate_phone: "+91-99345-33004",
    email: "alamnagar.shelter@gov.in",
    emergency_helpline: "1077",
    address: "Alamnagar School Ground",
    latitude: 25.85,
    longitude: 86.7,
    available_24x7: true,
    capacity: 280,
    current_occupancy: 260,
    available_capacity: 20,
    type: "School",
    facilities:
      "Toilets, Drinking Water"
  },

  {
    shelter_name: "Singheshwar Temple Complex",
    district: "Madhepura",
    contact_person: "Pandit Hari Narayan",
    role: "Shelter Coordinator",
    phone: "+91-94314-56005",
    alternate_phone: "+91-99345-33005",
    email: "singheshwar.camp@gov.in",
    emergency_helpline: "1077",
    address: "Singheshwar Temple Complex, Madhepura",
    latitude: 25.98,
    longitude: 86.8,
    available_24x7: true,
    capacity: 450,
    current_occupancy: 200,
    available_capacity: 250,
    type: "Religious Complex",
    facilities:
      "Toilets, Drinking Water, Food Distribution"
  },

  {
    shelter_name: "Bihariganj Block Office Camp",
    district: "Madhepura",
    contact_person: "Neha Verma",
    role: "Block Relief Officer",
    phone: "+91-94314-56006",
    alternate_phone: "+91-99345-33006",
    email: "bihariganj.camp@gov.in",
    emergency_helpline: "1077",
    address: "Block Office, Bihariganj",
    latitude: 25.9,
    longitude: 87.0,
    available_24x7: true,
    capacity: 320,
    current_occupancy: 80,
    available_capacity: 240,
    type: "Govt Building",
    facilities:
      "Toilets, Drinking Water, Medical Desk, Electricity"
  },

  {
    shelter_name: "Gwalpara School Camp",
    district: "Madhepura",
    contact_person: "Deepak Kumar",
    role: "Camp Manager",
    phone: "+91-94314-56007",
    alternate_phone: "+91-99345-33007",
    email: "gwalpara.camp@gov.in",
    emergency_helpline: "1077",
    address: "Gwalpara Middle School",
    latitude: 25.87,
    longitude: 86.75,
    available_24x7: false,
    capacity: 250,
    current_occupancy: 240,
    available_capacity: 10,
    type: "School",
    facilities:
      "Toilets, Drinking Water"
  },

  {
    shelter_name: "Pratapganj High School Camp",
    district: "Supaul",
    contact_person: "Anjali Kumari",
    role: "Camp In-Charge",
    phone: "+91-94312-45006",
    alternate_phone: "+91-99341-22015",
    email: "pratapganj.camp@gov.in",
    emergency_helpline: "1077",
    address: "Pratapganj High School, Pratapganj",
    latitude: 26.28,
    longitude: 86.62,
    available_24x7: true,
    capacity: 380,
    current_occupancy: 210,
    available_capacity: 170,
    type: "School",
    facilities:
      "Toilets, Drinking Water, Food Distribution"
  },

  {
    shelter_name: "Nirmali Relief Centre",
    district: "Supaul",
    contact_person: "Vikash Singh",
    role: "Relief Coordinator",
    phone: "+91-94312-45007",
    alternate_phone: "+91-99341-22016",
    email: "nirmali.camp@gov.in",
    emergency_helpline: "1077",
    address: "Nirmali Community Hall",
    latitude: 26.3,
    longitude: 86.58,
    available_24x7: true,
    capacity: 420,
    current_occupancy: 180,
    available_capacity: 240,
    type: "Community Hall",
    facilities:
      "Toilets, Drinking Water, Medical Desk, Kitchen"
  },

  {
    shelter_name: "Udakishunganj Block Camp",
    district: "Madhepura",
    contact_person: "Sanjay Mandal",
    role: "Block Relief Officer",
    phone: "+91-94314-56008",
    alternate_phone: "+91-99345-33008",
    email: "udakishunganj.camp@gov.in",
    emergency_helpline: "1077",
    address: "Block Campus, Udakishunganj",
    latitude: 25.83,
    longitude: 86.95,
    available_24x7: true,
    capacity: 550,
    current_occupancy: 300,
    available_capacity: 250,
    type: "Govt Building",
    facilities:
      "Toilets, Drinking Water, Medical Desk, Electricity, Food Distribution"
  },

  {
    shelter_name: "Shankarpur Primary School",
    district: "Madhepura",
    contact_person: "Pooja Rani",
    role: "Camp Manager",
    phone: "+91-94314-56009",
    alternate_phone: "+91-99345-33009",
    email: "shankarpur.camp@gov.in",
    emergency_helpline: "1077",
    address: "Shankarpur Primary School",
    latitude: 25.91,
    longitude: 86.88,
    available_24x7: false,
    capacity: 220,
    current_occupancy: 195,
    available_capacity: 25,
    type: "School",
    facilities:
      "Toilets, Drinking Water"
  },

  {
    shelter_name: "Kishanganj Road Temporary Camp",
    district: "Supaul",
    contact_person: "Rohit Kumar",
    role: "Camp In-Charge",
    phone: "+91-94312-45008",
    alternate_phone: "+91-99341-22017",
    email: "kishanganj.road.camp@gov.in",
    emergency_helpline: "1077",
    address: "Kishanganj Road Temporary Ground, Supaul",
    latitude: 26.05,
    longitude: 86.65,
    available_24x7: true,
    capacity: 600,
    current_occupancy: 140,
    available_capacity: 460,
    type: "Temporary Camp",
    facilities:
      "Toilets, Drinking Water, Tents, Food Distribution"
  },

  {
    shelter_name: "Gamharia Community Hall",
    district: "Madhepura",
    contact_person: "Meena Devi",
    role: "Relief Coordinator",
    phone: "+91-94314-56010",
    alternate_phone: "+91-99345-33010",
    email: "gamharia.camp@gov.in",
    emergency_helpline: "1077",
    address: "Gamharia Community Hall",
    latitude: 25.915,
    longitude: 86.97,
    available_24x7: true,
    capacity: 300,
    current_occupancy: 90,
    available_capacity: 210,
    type: "Community Hall",
    facilities:
      "Toilets, Drinking Water, Medical Desk"
  }
];

export default shelters;