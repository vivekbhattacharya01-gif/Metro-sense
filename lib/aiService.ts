export interface UserProfile {
  regularRoute?: { from: string; to: string };
  commuteTime?: string;
  sleepPattern?: string;
  preferences?: {
    avoidCrowds: boolean;
    preferSeats: boolean;
    minimizeInterchanges: boolean;
  };
}

export type CrowdLevel = "low" | "moderate" | "high" | "very-high";

class AIService {
  private static instance: AIService;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  predictTrainArrival(stationId: string, lineId: string): { nextTrain: number; frequency: number } {
    const hour = new Date().getHours();
    const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
    
    const baseFrequency = isPeakHour ? 3 : 6;
    const nextTrain = Math.floor(Math.random() * baseFrequency) + 1;
    
    return {
      nextTrain,
      frequency: baseFrequency
    };
  }

  predictCrowdLevel(stationId: string, lineId: string): { level: CrowdLevel; percentage: number; recommendation: string } {
    const hour = new Date().getHours();
    const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
    const isInterchange = ["rajiv-chowk", "kashmere-gate", "central-secretariat", "ina"].includes(stationId);
    
    let basePercentage = Math.random() * 30 + 20;
    
    if (isPeakHour) basePercentage += 40;
    if (isInterchange) basePercentage += 15;
    
    basePercentage = Math.min(basePercentage, 95);
    
    let level: CrowdLevel;
    let recommendation: string;
    
    if (basePercentage < 30) {
      level = "low";
      recommendation = "Great time to travel! Plenty of seats available.";
    } else if (basePercentage < 50) {
      level = "moderate";
      recommendation = "Comfortable travel expected. Some seats may be available.";
    } else if (basePercentage < 75) {
      level = "high";
      recommendation = "Expect standing. Consider first or last coach for better chances.";
    } else {
      level = "very-high";
      recommendation = "Very crowded. Wait for next train if possible or use first/last coach.";
    }
    
    return { level, percentage: Math.round(basePercentage), recommendation };
  }

  calculateOptimalAlertTiming(destination: string, arrivalTime: string): { wakeUpTime: string; departureTime: string } {
    const [hours, minutes] = arrivalTime.split(":").map(Number);
    const arrivalDate = new Date();
    arrivalDate.setHours(hours, minutes, 0, 0);
    
    // Estimate travel time (mock: 30-45 mins)
    const travelMinutes = Math.floor(Math.random() * 15) + 30;
    const bufferMinutes = 10;
    const prepMinutes = 15;
    
    const departureDate = new Date(arrivalDate.getTime() - travelMinutes * 60000);
    const wakeUpDate = new Date(departureDate.getTime() - (prepMinutes + bufferMinutes) * 60000);
    
    return {
      wakeUpTime: wakeUpDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }),
      departureTime: departureDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
    };
  }

  recommendOptimalRoute(from: string, to: string): { route: string; reason: string } {
    const hour = new Date().getHours();
    const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
    
    if (isPeakHour) {
      return {
        route: "alternate",
        reason: "Peak hours detected. Suggesting alternate route to avoid crowded interchanges."
      };
    }
    
    return {
      route: "direct",
      reason: "Off-peak hours. Direct route recommended for fastest travel."
    };
  }

  predictDelays(lineId: string): { probability: number; expectedDelay: number; reason: string } {
    const hour = new Date().getHours();
    const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
    
    // Simulate delay probability
    let probability = Math.random() * 20;
    if (isPeakHour) probability += 15;
    if (lineId === "blue") probability += 10; // Blue line often has more delays
    
    probability = Math.min(probability, 60);
    
    const expectedDelay = probability > 30 ? Math.floor(Math.random() * 5) + 2 : 0;
    
    const reasons = [
      "Signal adjustment",
      "Platform crowding",
      "Routine maintenance",
      "Weather conditions",
      "High passenger volume"
    ];
    
    return {
      probability: Math.round(probability),
      expectedDelay,
      reason: reasons[Math.floor(Math.random() * reasons.length)]
    };
  }

  getCoachCrowdDistribution(lineId: string): { coach: string; crowdLevel: CrowdLevel }[] {
    const coaches = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const levels: CrowdLevel[] = ["low", "moderate", "high", "very-high"];
    
    return coaches.map((coach, index) => {
      // First and last coaches typically less crowded
      let levelIndex: number;
      if (index === 0 || index === 7) {
        levelIndex = Math.floor(Math.random() * 2);
      } else if (index === 3 || index === 4) {
        levelIndex = Math.floor(Math.random() * 2) + 2;
      } else {
        levelIndex = Math.floor(Math.random() * 3) + 1;
      }
      
      return {
        coach,
        crowdLevel: levels[levelIndex]
      };
    });
  }
}

export const aiService = AIService.getInstance();
