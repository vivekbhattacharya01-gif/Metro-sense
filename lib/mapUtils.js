/**
 * Map and Visualization Utilities for Metro Lines
 */

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
}

/**
 * Get map bounds for all stations
 */
export function getMapBounds(stations) {
  if (stations.length === 0) return null;
  
  const lats = stations.map(s => s.lat);
  const lngs = stations.map(s => s.lng);
  
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
    center: {
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
    }
  };
}

/**
 * Calculate zoom level based on bounds
 */
export function calculateZoom(bounds) {
  if (!bounds) return 12;
  
  const latRange = bounds.maxLat - bounds.minLat;
  const lngRange = bounds.maxLng - bounds.minLng;
  const maxRange = Math.max(latRange, lngRange);
  
  if (maxRange > 0.5) return 10;
  if (maxRange > 0.3) return 11;
  if (maxRange > 0.1) return 12;
  return 13;
}

/**
 * Get station position for SVG/Canvas rendering (0-100 scale)
 */
export function getStationPosition(station, bounds, padding = 10) {
  if (!bounds) return { x: 50, y: 50 };
  
  const latRange = bounds.maxLat - bounds.minLat;
  const lngRange = bounds.maxLng - bounds.minLng;
  
  const x = ((station.lng - bounds.minLng) / lngRange) * (100 - 2 * padding) + padding;
  const y = ((bounds.maxLat - station.lat) / latRange) * (100 - 2 * padding) + padding;
  
  return { x, y };
}

/**
 * Get nearby stations within radius (km)
 */
export function getNearbyStations(lat, lng, stations, radiusKm = 2) {
  return stations.filter(station => {
    const distance = parseFloat(calculateDistance(lat, lng, station.lat, station.lng));
    return distance <= radiusKm;
  }).sort((a, b) => {
    const distA = calculateDistance(lat, lng, a.lat, a.lng);
    const distB = calculateDistance(lat, lng, b.lat, b.lng);
    return parseFloat(distA) - parseFloat(distB);
  });
}

/**
 * Get line color or default
 */
export function getLineColorCode(lineId, metroLines) {
  const line = metroLines.find(l => l.id === lineId);
  return line?.color || '#999999';
}

/**
 * Get SVG path for metro line
 */
export function generateLinePath(stations, bounds, padding = 10) {
  if (stations.length < 2) return '';
  
  const points = stations
    .filter(s => s.lat && s.lng)
    .map(s => {
      const pos = getStationPosition(s, bounds, padding);
      return `${pos.x},${pos.y}`;
    })
    .join(' ');
  
  return `M ${points}`;
}

/**
 * Determine station accessibility level
 */
export function getAccessibilityLevel(station) {
  const routeCount = station.routes?.length || 0;
  
  if (routeCount >= 3) return 'high'; // Interchange with 3+ lines
  if (routeCount === 2) return 'medium'; // Interchange with 2 lines
  return 'low'; // Single line station
}

/**
 * Get station clusters for zoomed-out view
 */
export function getStationClusters(stations, clusterSize = 5) {
  const clusters = [];
  let currentCluster = [];
  
  stations.forEach((station, index) => {
    currentCluster.push(station);
    
    if (currentCluster.length === clusterSize || index === stations.length - 1) {
      const avgLat = currentCluster.reduce((sum, s) => sum + s.lat, 0) / currentCluster.length;
      const avgLng = currentCluster.reduce((sum, s) => sum + s.lng, 0) / currentCluster.length;
      
      clusters.push({
        lat: avgLat,
        lng: avgLng,
        stations: currentCluster,
        count: currentCluster.length
      });
      
      currentCluster = [];
    }
  });
  
  return clusters;
}

/**
 * Convert degrees to radians
 */
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}
