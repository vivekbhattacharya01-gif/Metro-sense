// Real Delhi Metro data service using DMRC GTFS data
import realMetroDataRaw from './realMetroData.json' assert { type: 'json' };

// Cache the data
let metroDataCache = null;

export function getMetroData() {
  if (!metroDataCache) {
    metroDataCache = realMetroDataRaw;
  }
  return metroDataCache;
}

/**
 * Get all metro lines
 */
export function getAllLines() {
  return getMetroData().metroLines.map(line => ({
    id: line.id,
    name: line.name,
    shortName: line.shortName,
    color: line.color,
    stationCount: line.stations.length
  }));
}

/**
 * Get all stations
 */
export function getAllStations() {
  return getMetroData().stations;
}

/**
 * Get stations for a specific line
 */
export function getStationsForLine(lineId) {
  const line = getMetroData().metroLines.find(l => l.id === lineId);
  if (!line) return [];
  return line.stations.map(station => ({
    id: station.id,
    name: station.name,
    lat: station.lat,
    lng: station.lng
  }));
}

/**
 * Get station details with line info
 */
export function getStationDetails(stationId) {
  const station = getMetroData().stations.find(s => s.id === stationId);
  if (!station) return null;
  
  const routes = station.routes.map(routeId => {
    const line = getMetroData().metroLines.find(l => l.id === routeId);
    return {
      lineId: routeId,
      lineName: line?.name,
      color: line?.color
    };
  });
  
  return {
    ...station,
    routes
  };
}

/**
 * Get actual train timings for a station on a specific route
 */
export function getTrainTimingsAtStation(stationId, lineId) {
  const line = getMetroData().metroLines.find(l => l.id === lineId);
  if (!line) return [];
  
  const station = line.stations.find(s => s.id === stationId);
  if (!station || !station.timings) return [];
  
  return station.timings.slice(0, 10); // Return first 10 timings
}

/**
 * Get next train arrival time at a station
 */
export function getNextTrainArrival(stationId, lineId) {
  const timings = getTrainTimingsAtStation(stationId, lineId);
  if (timings.length === 0) return null;
  
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
  
  // Find next train after current time
  const nextTrain = timings.find(t => t.arrival_time > currentTime);
  
  return nextTrain || timings[0]; // Return next train or first of day
}

/**
 * Calculate frequency (minutes between trains)
 */
export function getTrainFrequency(stationId, lineId) {
  const timings = getTrainTimingsAtStation(stationId, lineId);
  if (timings.length < 2) return 5; // Default 5 minutes
  
  // Calculate average time between consecutive trains
  let totalGap = 0;
  for (let i = 1; i < timings.length && i < 5; i++) {
    const prev = timings[i - 1].arrival_time;
    const curr = timings[i].arrival_time;
    
    const [pHour, pMin] = prev.split(':').map(Number);
    const [cHour, cMin] = curr.split(':').map(Number);
    
    const prevMinutes = pHour * 60 + pMin;
    const currMinutes = cHour * 60 + cMin;
    
    totalGap += (currMinutes - prevMinutes);
  }
  
  return Math.round(totalGap / Math.min(4, timings.length - 1));
}

/**
 * Search stations by name
 */
export function searchStations(query) {
  const lowercaseQuery = query.toLowerCase();
  return getMetroData().stations.filter(station =>
    station.name.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 20); // Return top 20 results
}

/**
 * Get interchange stations (stations with multiple lines)
 */
export function getInterchangeStations() {
  return getMetroData().stations.filter(s => s.routes.length > 1);
}

/**
 * Calculate route between two stations
 */
export function findRoute(fromStationId, toStationId) {
  const fromStation = getMetroData().stations.find(s => s.id === fromStationId);
  const toStation = getMetroData().stations.find(s => s.id === toStationId);
  
  if (!fromStation || !toStation) return null;
  
  // Find common routes (lines that serve both stations)
  const commonRoutes = fromStation.routes.filter(r => toStation.routes.includes(r));
  
  if (commonRoutes.length > 0) {
    // Direct route found
    return {
      type: 'direct',
      routes: commonRoutes,
      from: fromStation,
      to: toStation
    };
  }
  
  // For interchange, find intermediate stations
  const interchanges = getInterchangeStations();
  const possibleInterchanges = interchanges.filter(i => 
    fromStation.routes.some(r => i.routes.includes(r)) &&
    toStation.routes.some(r => i.routes.includes(r))
  );
  
  if (possibleInterchanges.length > 0) {
    return {
      type: 'interchange',
      interchange: possibleInterchanges[0],
      from: fromStation,
      to: toStation
    };
  }
  
  return null;
}

/**
 * Get line color
 */
export function getLineColor(lineId) {
  const line = getMetroData().metroLines.find(l => l.id === lineId);
  return line?.color || '#999999';
}

/**
 * Format station ID to readable name
 */
export function formatStationName(stationId) {
  const station = getMetroData().stations.find(s => s.id === stationId);
  if (station) return station.name;
  
  return stationId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Calculate fare based on distance
 */
export function calculateFare(distance) {
  if (distance <= 2) return 10;
  if (distance <= 5) return 20;
  if (distance <= 12) return 30;
  if (distance <= 21) return 40;
  if (distance <= 32) return 50;
  return 60;
}

export default {
  getMetroData,
  getAllLines,
  getAllStations,
  getStationsForLine,
  getStationDetails,
  getTrainTimingsAtStation,
  getNextTrainArrival,
  getTrainFrequency,
  searchStations,
  getInterchangeStations,
  findRoute,
  getLineColor,
  formatStationName,
  calculateFare
};
