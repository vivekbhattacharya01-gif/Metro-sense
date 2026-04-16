import {
  PEAK_HOURS,
  CROWD_LEVELS,
  MAIN_INTERCHANGES,
  DELAY_REASONS,
  isPeakHour,
  getRandomInRange,
  getRandomDelayReason,
  getCoachCrowdDistribution
} from './metroUtils.js';

/**
 * Predict next train arrival time
 */
export function predictTrainArrival(stationId, lineId) {
  const baseFrequency = isPeakHour() ? 3 : 6;
  const nextTrain = getRandomInRange(1, baseFrequency);
  
  return {
    nextTrain,
    frequency: baseFrequency
  };
}

/**
 * Predict crowd level at a station
 */
export function predictCrowdLevel(stationId, lineId) {
  const isInterchange = MAIN_INTERCHANGES.includes(stationId);
  
  let percentage = getRandomInRange(20, 50);
  if (isPeakHour()) percentage += 40;
  if (isInterchange) percentage += 15;
  
  percentage = Math.min(percentage, 95);
  
  let level;
  let recommendation;
  
  if (percentage < 30) {
    level = 'low';
    recommendation = 'Great time to travel! Plenty of seats available.';
  } else if (percentage < 50) {
    level = 'moderate';
    recommendation = 'Comfortable travel expected. Some seats may be available.';
  } else if (percentage < 75) {
    level = 'high';
    recommendation = 'Expect standing. Consider first or last coach for better chances.';
  } else {
    level = 'very-high';
    recommendation = 'Very crowded. Wait for next train if possible or use first/last coach.';
  }
  
  return { level, percentage: Math.round(percentage), recommendation };
}

/**
 * Calculate optimal timing for alarms
 */
export function calculateOptimalAlertTiming(destination, arrivalTime) {
  const [hours, minutes] = arrivalTime.split(':').map(Number);
  const arrivalDate = new Date();
  arrivalDate.setHours(hours, minutes, 0, 0);
  
  const travelMinutes = getRandomInRange(30, 45);
  const bufferMinutes = 10;
  const prepMinutes = 15;
  
  const departureDate = new Date(arrivalDate.getTime() - travelMinutes * 60000);
  const wakeUpDate = new Date(departureDate.getTime() - (prepMinutes + bufferMinutes) * 60000);
  
  const formatTimeStr = (date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  
  return {
    wakeUpTime: formatTimeStr(wakeUpDate),
    departureTime: formatTimeStr(departureDate)
  };
}

/**
 * Recommend optimal route based on time
 */
export function recommendOptimalRoute(from, to) {
  if (isPeakHour()) {
    return {
      route: 'alternate',
      reason: 'Peak hours detected. Suggesting alternate route to avoid crowded interchanges.'
    };
  }
  
  return {
    route: 'direct',
    reason: 'Off-peak hours. Direct route recommended for fastest travel.'
  };
}

/**
 * Predict delays for a line
 */
export function predictDelays(lineId) {
  let probability = getRandomInRange(0, 20);
  if (isPeakHour()) probability += 15;
  if (lineId === 'blue') probability += 10;
  
  probability = Math.min(probability, 60);
  
  const expectedDelay = probability > 30 ? getRandomInRange(2, 7) : 0;
  
  return {
    probability: Math.round(probability),
    expectedDelay,
    reason: getRandomDelayReason()
  };
}

/**
 * Get coach crowd distribution
 */
export function getCoachCrowdDistributionByLine(lineId) {
  return getCoachCrowdDistribution();
}
