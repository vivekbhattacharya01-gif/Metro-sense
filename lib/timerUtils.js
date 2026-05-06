/**
 * Timer and Countdown Utilities
 */

/**
 * Convert time string (HH:MM:SS) to minutes from midnight
 */
export function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes from midnight to time string (HH:MM:SS)
 */
export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
}

/**
 * Calculate time difference in minutes
 */
export function getTimeDifference(fromTime, toTime) {
  const fromMinutes = timeToMinutes(fromTime);
  const toMinutes = timeToMinutes(toTime);
  
  if (toMinutes > fromMinutes) {
    return toMinutes - fromMinutes;
  } else {
    // Handle next day
    return (24 * 60 - fromMinutes) + toMinutes;
  }
}

/**
 * Get next train arrival in minutes
 */
export function getNextTrainCountdown(trainArrivalTime) {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
  
  const diff = getTimeDifference(currentTime, trainArrivalTime);
  
  return diff <= 0 ? 0 : diff;
}

/**
 * Format countdown for display (e.g., "5 mins", "1 hour 20 mins")
 */
export function formatCountdown(minutes) {
  if (minutes <= 0) return 'Now';
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) return `${hours} hr${hours !== 1 ? 's' : ''}`;
  return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min`;
}

/**
 * Get human readable time format
 */
export function formatDisplayTime(timeStr) {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const min = parseInt(minutes);
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  
  return `${displayHour}:${minutes} ${period}`;
}

/**
 * Get all upcoming trains within next N hours
 */
export function getUpcomingTrains(timings, hoursAhead = 3) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const cutoffMinutes = currentMinutes + (hoursAhead * 60);
  
  return timings.filter(timing => {
    const trainMinutes = timeToMinutes(timing.arrival_time);
    return trainMinutes >= currentMinutes && trainMinutes <= cutoffMinutes;
  }).slice(0, 5); // Return top 5
}

/**
 * Calculate train frequency in minutes
 */
export function calculateFrequency(timings) {
  if (timings.length < 2) return null;
  
  let totalGap = 0;
  const sampleSize = Math.min(5, timings.length - 1);
  
  for (let i = 0; i < sampleSize; i++) {
    const current = timeToMinutes(timings[i].arrival_time);
    const next = timeToMinutes(timings[i + 1].arrival_time);
    
    const gap = next > current ? next - current : (24 * 60 - current) + next;
    totalGap += gap;
  }
  
  return Math.round(totalGap / sampleSize);
}
