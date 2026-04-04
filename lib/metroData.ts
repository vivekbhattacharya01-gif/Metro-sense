export interface Station {
  id: string;
  name: string;
  code: string;
  lines: string[];
  facilities: string[];
  landmarks: string[];
  parkingAvailable: boolean;
  interchange: boolean;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: string[];
}

export interface Route {
  segments: { line: string; from: string; to: string; stations: string[] }[];
  interchanges: string[];
  estimatedTime: number;
  fare: number;
}

export const metroLines: MetroLine[] = [
  {
    id: "red",
    name: "Red Line",
    color: "#E21B22",
    stations: [
      "rithala", "rohini-west", "rohini-east", "pitampura", "kohat-enclave",
      "netaji-subhash-place", "keshav-puram", "kanhaiya-nagar", "inderlok",
      "shastri-nagar", "pratap-nagar", "pulbangash", "tis-hazari", "kashmere-gate",
      "shastri-park", "seelampur", "welcome", "shahdara", "mansarovar-park",
      "jhilmil", "dilshad-garden", "shaheed-nagar", "raj-bagh", "rajdhani-park",
      "ghaziabad"
    ]
  },
  {
    id: "blue",
    name: "Blue Line",
    color: "#0066B3",
    stations: [
      "dwarka-sector-21", "dwarka-sector-8", "dwarka-sector-9", "dwarka-sector-10",
      "dwarka-sector-11", "dwarka-sector-12", "dwarka-sector-13", "dwarka-sector-14",
      "dwarka", "dwarka-mor", "nawada", "uttam-nagar-west", "uttam-nagar-east",
      "janakpuri-west", "janakpuri-east", "tilak-nagar", "subhash-nagar",
      "tagore-garden", "rajouri-garden", "ramesh-nagar", "moti-nagar", "kirti-nagar",
      "shadipur", "patel-nagar", "rajendra-place", "karol-bagh", "jhandewalan",
      "ramakrishna-ashram-marg", "rajiv-chowk", "barakhamba-road", "mandi-house",
      "pragati-maidan", "indraprastha", "yamuna-bank", "akshardham", "mayur-vihar-1",
      "mayur-vihar-ext", "new-ashok-nagar", "noida-sector-15", "noida-sector-16",
      "noida-sector-18", "botanical-garden", "golf-course", "noida-city-centre",
      "noida-sector-34", "noida-sector-52", "noida-sector-61", "noida-sector-59",
      "noida-sector-62", "noida-electronic-city"
    ]
  },
  {
    id: "yellow",
    name: "Yellow Line",
    color: "#FFCB05",
    stations: [
      "samaypur-badli", "rohini-sector-18", "haiderpur-badli-mor", "jahangirpuri",
      "adarsh-nagar", "azadpur", "model-town", "gtb-nagar", "vishwavidyalaya",
      "vidhan-sabha", "civil-lines", "kashmere-gate", "chandni-chowk", "chawri-bazar",
      "new-delhi", "rajiv-chowk", "patel-chowk", "central-secretariat", "udyog-bhawan",
      "lok-kalyan-marg", "jor-bagh", "ina", "aiims", "green-park", "hauz-khas",
      "malviya-nagar", "saket", "qutab-minar", "chhatarpur", "sultanpur",
      "ghitorni", "arjan-garh", "guru-dronacharya", "sikandarpur", "mg-road",
      "iffco-chowk", "huda-city-centre"
    ]
  },
  {
    id: "green",
    name: "Green Line",
    color: "#00A650",
    stations: [
      "inderlok", "ashok-park-main", "punjabi-bagh", "shivaji-park", "madipur",
      "paschim-vihar-east", "paschim-vihar-west", "peera-garhi", "udyog-nagar",
      "surajmal-stadium", "nangloi", "nangloi-railway-station", "rajdhani-park",
      "mundka", "mundka-industrial-area", "brigadier-hoshiar-singh"
    ]
  },
  {
    id: "violet",
    name: "Violet Line",
    color: "#9B59B6",
    stations: [
      "kashmere-gate", "lal-quila", "jama-masjid", "delhi-gate", "ito",
      "mandi-house", "janpath", "central-secretariat", "khan-market", "jln-stadium",
      "jangpura", "lajpat-nagar", "moolchand", "kailash-colony", "nehru-place",
      "kalkaji-mandir", "govind-puri", "okhla", "jasola-apollo", "sarita-vihar",
      "mohan-estate", "tughlakabad", "badarpur-border", "sarai", "nhpc-chowk",
      "mewala-maharajpur", "sector-28", "badkhal-mor", "old-faridabad", "neelam-chowk-ajronda",
      "bata-chowk", "escorts-mujesar", "raja-nahar-singh"
    ]
  },
  {
    id: "pink",
    name: "Pink Line",
    color: "#E91E8C",
    stations: [
      "majlis-park", "azadpur", "shalimar-bagh", "netaji-subhash-place", "shakurpur",
      "punjabi-bagh-west", "esi-basaidarapur", "rajouri-garden", "mayapuri",
      "naraina-vihar", "delhi-cantt", "durgabai-deshmukh-south-campus", "sir-vishweshwaraiah-moti-bagh",
      "bhikaji-cama-place", "sarojini-nagar", "ina", "south-ext", "lajpat-nagar",
      "vinobapuri", "ashram", "hazrat-nizamuddin", "mayur-vihar-1", "mayur-vihar-pocket-1",
      "trilokpuri-sanjay-lake", "vinod-nagar-east", "mandawali-west-vinod-nagar",
      "ip-extension", "anand-vihar-isbt", "karkarduma", "karkarduma-court", "krishna-nagar",
      "east-azad-nagar", "welcome", "jaffrabad", "maujpur-babarpur", "gokulpuri",
      "johri-enclave", "shiv-vihar"
    ]
  },
  {
    id: "magenta",
    name: "Magenta Line",
    color: "#B3308C",
    stations: [
      "janakpuri-west", "dabri-mor", "dashrathpuri", "palam", "sadar-bazar-cantonment",
      "terminal-1-igi-airport", "shankar-vihar", "vasant-vihar", "munirka",
      "r-k-puram", "ina", "panchsheel-park", "chirag-delhi", "greater-kailash",
      "nehru-enclave", "kalkaji-mandir", "okhla-nsic", "sukhdev-vihar", "jamia-milia-islamia",
      "jasola-vihar-shaheen-bagh", "okhla-bird-sanctuary", "kalindi-kunj",
      "botanical-garden"
    ]
  }
];

export const stations: Station[] = [
  {
    id: "rajiv-chowk",
    name: "Rajiv Chowk",
    code: "RJCH",
    lines: ["blue", "yellow"],
    facilities: ["Lift", "Escalator", "Wheelchair Access", "ATM", "Food Court"],
    landmarks: ["Connaught Place", "Central Park", "Palika Bazaar"],
    parkingAvailable: false,
    interchange: true
  },
  {
    id: "kashmere-gate",
    name: "Kashmere Gate",
    code: "KMGT",
    lines: ["red", "yellow", "violet"],
    facilities: ["Lift", "Escalator", "Wheelchair Access", "ISBT"],
    landmarks: ["ISBT Kashmere Gate", "Civil Lines", "Old Delhi"],
    parkingAvailable: true,
    interchange: true
  },
  {
    id: "central-secretariat",
    name: "Central Secretariat",
    code: "CSEC",
    lines: ["yellow", "violet"],
    facilities: ["Lift", "Escalator", "Wheelchair Access"],
    landmarks: ["India Gate", "Rashtrapati Bhawan", "Parliament House"],
    parkingAvailable: false,
    interchange: true
  },
  {
    id: "ina",
    name: "INA",
    code: "INA",
    lines: ["yellow", "pink", "magenta"],
    facilities: ["Lift", "Escalator", "Wheelchair Access", "INA Market"],
    landmarks: ["INA Market", "Dilli Haat", "Safdarjung Tomb"],
    parkingAvailable: true,
    interchange: true
  },
  {
    id: "netaji-subhash-place",
    name: "Netaji Subhash Place",
    code: "NSP",
    lines: ["red", "pink"],
    facilities: ["Lift", "Escalator", "Wheelchair Access", "Metro Mall"],
    landmarks: ["Netaji Subhash Place Mall", "Wazirpur Industrial Area"],
    parkingAvailable: true,
    interchange: true
  },
  {
    id: "rajouri-garden",
    name: "Rajouri Garden",
    code: "RJGD",
    lines: ["blue", "pink"],
    facilities: ["Lift", "Escalator", "Wheelchair Access", "Shopping"],
    landmarks: ["Rajouri Garden Market", "Pacific Mall"],
    parkingAvailable: true,
    interchange: true
  },
  {
    id: "dwarka-sector-21",
    name: "Dwarka Sector 21",
    code: "DW21",
    lines: ["blue"],
    facilities: ["Lift", "Escalator", "Wheelchair Access", "Airport Express"],
    landmarks: ["Dwarka Sector 21 Metro Station", "IGI Airport Express"],
    parkingAvailable: true,
    interchange: false
  },
  {
    id: "huda-city-centre",
    name: "HUDA City Centre",
    code: "HUDA",
    lines: ["yellow"],
    facilities: ["Lift", "Escalator", "Wheelchair Access"],
    landmarks: ["Cyber Hub", "DLF Cyber City", "Ambience Mall"],
    parkingAvailable: true,
    interchange: false
  },
  {
    id: "botanical-garden",
    name: "Botanical Garden",
    code: "BTGD",
    lines: ["blue", "magenta"],
    facilities: ["Lift", "Escalator", "Wheelchair Access"],
    landmarks: ["Botanical Garden", "Noida City Centre"],
    parkingAvailable: true,
    interchange: true
  },
  {
    id: "new-delhi",
    name: "New Delhi",
    code: "NDLS",
    lines: ["yellow"],
    facilities: ["Lift", "Escalator", "Wheelchair Access", "Railway Station"],
    landmarks: ["New Delhi Railway Station", "Paharganj", "Connaught Place"],
    parkingAvailable: false,
    interchange: false
  },
  {
    id: "hauz-khas",
    name: "Hauz Khas",
    code: "HZKH",
    lines: ["yellow"],
    facilities: ["Lift", "Escalator", "Wheelchair Access"],
    landmarks: ["Hauz Khas Village", "Deer Park", "IIT Delhi"],
    parkingAvailable: false,
    interchange: false
  },
  {
    id: "mayur-vihar-1",
    name: "Mayur Vihar Phase-1",
    code: "MVR1",
    lines: ["blue", "pink"],
    facilities: ["Lift", "Escalator", "Wheelchair Access"],
    landmarks: ["Mayur Vihar", "V3S Mall"],
    parkingAvailable: true,
    interchange: true
  }
];

export function calculateFare(distance: number): number {
  if (distance <= 2) return 10;
  if (distance <= 5) return 20;
  if (distance <= 12) return 30;
  if (distance <= 21) return 40;
  if (distance <= 32) return 50;
  return 60;
}

export const liveUpdates = [
  { line: "red", status: "normal", message: "All services running on time" },
  { line: "blue", status: "delayed", message: "Minor delays due to signal issues near Yamuna Bank" },
  { line: "yellow", status: "normal", message: "All services running on time" },
  { line: "green", status: "normal", message: "All services running on time" },
  { line: "violet", status: "normal", message: "All services running on time" },
  { line: "pink", status: "normal", message: "All services running on time" },
  { line: "magenta", status: "normal", message: "All services running on time" }
];

export function getStationById(id: string): Station | undefined {
  return stations.find(s => s.id === id);
}

export function getLineById(id: string): MetroLine | undefined {
  return metroLines.find(l => l.id === id);
}

export function getLineColor(lineId: string): string {
  const line = getLineById(lineId);
  return line?.color || "#666";
}

export function getAllStationIds(): string[] {
  const allStations = new Set<string>();
  metroLines.forEach(line => {
    line.stations.forEach(station => allStations.add(station));
  });
  return Array.from(allStations);
}

export function formatStationName(id: string): string {
  const station = getStationById(id);
  if (station) return station.name;
  return id
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
