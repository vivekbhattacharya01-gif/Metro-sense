// Shared constants and utilities to avoid duplication

export const PEAK_HOURS = { start: 8, end: 10, evenStart: 17, evenEnd: 20 };

export const CROWD_LEVELS = ['low', 'moderate', 'high', 'very-high'];

export const COACHES = ['1', '2', '3', '4', '5', '6', '7', '8'];

// Check if current hour is peak hour
export function isPeakHour(date = new Date()) {
  const hour = date.getHours();
  return (hour >= PEAK_HOURS.start && hour <= PEAK_HOURS.end) || 
         (hour >= PEAK_HOURS.evenStart && hour <= PEAK_HOURS.evenEnd);
}

// Get crowd level color
export function getCrowdLevelColor(level) {
  const colorMap = {
    'low': 'bg-green-500',
    'moderate': 'bg-yellow-500',
    'high': 'bg-orange-500',
    'very-high': 'bg-red-500',
  };
  return colorMap[level] || 'bg-gray-500';
}

// Generate random number in range
export function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Main interchange stations
export const MAIN_INTERCHANGES = ['rajiv-chowk', 'kashmere-gate', 'central-secretariat', 'ina'];

// Delay reasons
export const DELAY_REASONS = [
  'Signal adjustment',
  'Platform crowding',
  'Routine maintenance',
  'Weather conditions',
  'High passenger volume'
];

// Get random delay reason
export function getRandomDelayReason() {
  return DELAY_REASONS[Math.floor(Math.random() * DELAY_REASONS.length)];
}

// Format time to HH:MM
export function formatTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// Calculate coach crowd distribution
export function getCoachCrowdDistribution() {
  return COACHES.map((coach, index) => {
    let crowdLevelIndex;
    
    // First and last coaches typically less crowded
    if (index === 0 || index === COACHES.length - 1) {
      crowdLevelIndex = getRandomInRange(0, 1);
    } else if (index === 3 || index === 4) {
      crowdLevelIndex = getRandomInRange(2, 3);
    } else {
      crowdLevelIndex = getRandomInRange(1, 3);
    }
    
    return {
      coach,
      crowdLevel: CROWD_LEVELS[crowdLevelIndex]
    };
  });
}

// Format time for alarm
export function calculateAlarmTiming(arrivalTimeStr) {
  const [hours, minutes] = arrivalTimeStr.split(':').map(Number);
  const arrivalDate = new Date();
  arrivalDate.setHours(hours, minutes, 0, 0);
  
  const travelMinutes = getRandomInRange(30, 45);
  const bufferMinutes = 10;
  const prepMinutes = 15;
  
  const departureDate = new Date(arrivalDate.getTime() - travelMinutes * 60000);
  const wakeUpDate = new Date(departureDate.getTime() - (prepMinutes + bufferMinutes) * 60000);
  
  return {
    wakeUpTime: formatTime(wakeUpDate),
    departureTime: formatTime(departureDate)
  };
}
