"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi";

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // App Header
  "app.title": { en: "MetroSense", hi: "मेट्रोसेंस" },
  "app.subtitle": { en: "Delhi Metro AI Assistant", hi: "दिल्ली मेट्रो AI सहायक" },
  
  // Tab Labels
  "tab.home": { en: "Home", hi: "होम" },
  "tab.live": { en: "Live", hi: "लाइव" },
  "tab.route": { en: "Route", hi: "रूट" },
  "tab.alarm": { en: "Alarm", hi: "अलार्म" },
  "tab.fare": { en: "Fare", hi: "किराया" },
  "tab.status": { en: "Status", hi: "स्थिति" },
  "tab.info": { en: "Info", hi: "जानकारी" },
  "tab.ai": { en: "AI", hi: "AI" },
  
  // Dashboard
  "greeting.morning": { en: "Good Morning", hi: "शुभ प्रभात" },
  "greeting.afternoon": { en: "Good Afternoon", hi: "शुभ दोपहर" },
  "greeting.evening": { en: "Good Evening", hi: "शुभ संध्या" },
  "dashboard.welcome": { en: "Welcome to MetroSense", hi: "मेट्रोसेंस में आपका स्वागत है" },
  "dashboard.quickActions": { en: "Quick Actions", hi: "त्वरित कार्य" },
  "dashboard.lineStatus": { en: "Line Status", hi: "लाइन स्थिति" },
  "dashboard.aiInsights": { en: "AI Insights", hi: "AI अंतर्दृष्टि" },
  "dashboard.peakHours": { en: "Peak Hours Active", hi: "पीक आवर सक्रिय" },
  "dashboard.peakHoursMsg": { en: "Expect higher crowd levels. Plan accordingly!", hi: "अधिक भीड़ की उम्मीद करें। तदनुसार योजना बनाएं!" },
  
  // Quick Actions
  "action.planRoute": { en: "Plan Route", hi: "रूट बनाएं" },
  "action.trackTrains": { en: "Track Trains", hi: "ट्रेन ट्रैक करें" },
  "action.setAlarm": { en: "Set Alarm", hi: "अलार्म सेट करें" },
  "action.stationInfo": { en: "Station Info", hi: "स्टेशन जानकारी" },
  
  // Real-Time Tracker
  "tracker.title": { en: "Real-Time Tracker", hi: "रियल-टाइम ट्रैकर" },
  "tracker.subtitle": { en: "Live train arrivals and crowd levels", hi: "लाइव ट्रेन आगमन और भीड़ स्तर" },
  "tracker.selectLine": { en: "Select Line", hi: "लाइन चुनें" },
  "tracker.selectStation": { en: "Select Station", hi: "स्टेशन चुनें" },
  "tracker.nextTrain": { en: "Next Train", hi: "अगली ट्रेन" },
  "tracker.crowdLevel": { en: "Crowd Level", hi: "भीड़ स्तर" },
  "tracker.coachCrowd": { en: "Coach-wise Crowd", hi: "कोच-वार भीड़" },
  "tracker.frequency": { en: "Frequency", hi: "आवृत्ति" },
  "tracker.tip": { en: "Tip: First and last coaches are usually less crowded", hi: "टिप: पहले और आखिरी कोच आमतौर पर कम भीड़ वाले होते हैं" },
  
  // Route Finder
  "route.title": { en: "Route Finder", hi: "रूट खोजें" },
  "route.subtitle": { en: "Find the best route between stations", hi: "स्टेशनों के बीच सबसे अच्छा रूट खोजें" },
  "route.from": { en: "From Station", hi: "कहाँ से" },
  "route.to": { en: "To Station", hi: "कहाँ तक" },
  "route.selectDeparture": { en: "Select departure station", hi: "प्रस्थान स्टेशन चुनें" },
  "route.selectDestination": { en: "Select destination station", hi: "गंतव्य स्टेशन चुनें" },
  "route.findRoute": { en: "Find Route", hi: "रूट खोजें" },
  "route.yourRoute": { en: "Your Route", hi: "आपका रूट" },
  "route.changeAt": { en: "Change at", hi: "यहाँ बदलें" },
  "route.stations": { en: "Stations", hi: "स्टेशन" },
  "route.minutes": { en: "Minutes", hi: "मिनट" },
  
  // Travel Alarm
  "alarm.title": { en: "Travel Alarm", hi: "यात्रा अलार्म" },
  "alarm.subtitle": { en: "Never miss your station again", hi: "अब कभी स्टेशन न चूकें" },
  "alarm.setNew": { en: "Set New Alarm", hi: "नया अलार्म सेट करें" },
  "alarm.destination": { en: "Destination Station", hi: "गंतव्य स्टेशन" },
  "alarm.selectDest": { en: "Select your destination", hi: "अपना गंतव्य चुनें" },
  "alarm.arrivalTime": { en: "Arrival Time (when you need to reach)", hi: "आगमन समय (कब पहुंचना है)" },
  "alarm.createSmart": { en: "Create Smart Alarm", hi: "स्मार्ट अलार्म बनाएं" },
  "alarm.yourAlarms": { en: "Your Alarms", hi: "आपके अलार्म" },
  "alarm.wakeUp": { en: "Wake Up", hi: "जागें" },
  "alarm.leaveBy": { en: "Leave By", hi: "निकलें" },
  "alarm.arrive": { en: "Arrive", hi: "पहुंचें" },
  "alarm.active": { en: "Active", hi: "सक्रिय" },
  "alarm.paused": { en: "Paused", hi: "रुका हुआ" },
  "alarm.noAlarms": { en: "No alarms set yet", hi: "अभी तक कोई अलार्म सेट नहीं" },
  "alarm.createFirst": { en: "Create your first smart travel alarm above", hi: "ऊपर अपना पहला स्मार्ट यात्रा अलार्म बनाएं" },
  
  // Fare Calculator
  "fare.title": { en: "Fare Calculator", hi: "किराया कैलकुलेटर" },
  "fare.subtitle": { en: "Check metro fares between stations", hi: "स्टेशनों के बीच मेट्रो किराया जांचें" },
  "fare.calculate": { en: "Calculate Fare", hi: "किराया गणना करें" },
  "fare.oneWay": { en: "One Way", hi: "एक तरफ" },
  "fare.distance": { en: "Distance", hi: "दूरी" },
  "fare.chart": { en: "Fare Chart", hi: "किराया चार्ट" },
  "fare.note": { en: "Fares are subject to change. Senior citizens and students may avail discounts.", hi: "किराया परिवर्तन के अधीन है। वरिष्ठ नागरिक और छात्र छूट प्राप्त कर सकते हैं।" },
  
  // Live Status
  "status.title": { en: "Live Status", hi: "लाइव स्थिति" },
  "status.subtitle": { en: "Real-time line status updates", hi: "रियल-टाइम लाइन स्थिति अपडेट" },
  "status.updated": { en: "Updated", hi: "अपडेट किया गया" },
  "status.runningNormal": { en: "Metro Running Normally", hi: "मेट्रो सामान्य रूप से चल रही है" },
  "status.minorDelays": { en: "Minor delays on Blue Line only", hi: "केवल ब्लू लाइन पर मामूली देरी" },
  "status.normal": { en: "Normal", hi: "सामान्य" },
  "status.delayed": { en: "Delayed", hi: "देरी" },
  "status.expectedDelay": { en: "Expected delay", hi: "अपेक्षित देरी" },
  "status.delayRisk": { en: "delay risk", hi: "देरी जोखिम" },
  "status.operatingHours": { en: "Operating Hours", hi: "संचालन समय" },
  "status.firstTrain": { en: "First Train", hi: "पहली ट्रेन" },
  "status.lastTrain": { en: "Last Train", hi: "आखिरी ट्रेन" },
  "status.peakHoursNote": { en: "Peak hours: 8-10 AM and 5-8 PM (Mon-Sat)", hi: "पीक आवर: 8-10 AM और 5-8 PM (सोम-शनि)" },
  
  // Station Info
  "station.title": { en: "Station Info", hi: "स्टेशन जानकारी" },
  "station.subtitle": { en: "Facilities, landmarks & more", hi: "सुविधाएं, लैंडमार्क और बहुत कुछ" },
  "station.select": { en: "Select Station", hi: "स्टेशन चुनें" },
  "station.choosePlaceholder": { en: "Choose a station to view details", hi: "विवरण देखने के लिए स्टेशन चुनें" },
  "station.code": { en: "Code", hi: "कोड" },
  "station.interchange": { en: "Interchange", hi: "इंटरचेंज" },
  "station.parking": { en: "Parking", hi: "पार्किंग" },
  "station.facilities": { en: "Facilities", hi: "सुविधाएं" },
  "station.landmarks": { en: "Nearby Landmarks", hi: "नजदीकी लैंडमार्क" },
  "station.selectToView": { en: "Select a station to view details", hi: "विवरण देखने के लिए स्टेशन चुनें" },
  "station.infoIncludes": { en: "Information includes facilities, landmarks, and connectivity", hi: "जानकारी में सुविधाएं, लैंडमार्क और कनेक्टिविटी शामिल हैं" },
  
  // AI Trip Planner
  "ai.title": { en: "AI Trip Planner", hi: "AI यात्रा योजनाकार" },
  "ai.subtitle": { en: "Ask anything about your Delhi Metro journey", hi: "अपनी दिल्ली मेट्रो यात्रा के बारे में कुछ भी पूछें" },
  "ai.howCanHelp": { en: "How can I help you today?", hi: "आज मैं आपकी कैसे मदद कर सकता हूं?" },
  "ai.askAbout": { en: "Ask me about routes, fares, timings, or any Delhi Metro query in natural language!", hi: "मुझसे रूट, किराया, समय, या कोई भी दिल्ली मेट्रो प्रश्न प्राकृतिक भाषा में पूछें!" },
  "ai.placeholder": { en: "Ask about routes, fares, timings...", hi: "रूट, किराया, समय के बारे में पूछें..." },
  "ai.thinking": { en: "Thinking...", hi: "सोच रहा हूं..." },
  "ai.error": { en: "Sorry, I couldn't connect to the AI service. Please check your connection and try again.", hi: "क्षमा करें, AI सेवा से कनेक्ट नहीं हो सका। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।" },
  "ai.chip1": { en: "Dwarka to Connaught Place", hi: "द्वारका से कनॉट प्लेस" },
  "ai.chip2": { en: "Cheapest route to Airport", hi: "एयरपोर्ट का सबसे सस्ता रूट" },
  "ai.chip3": { en: "Avoid crowds, suggest best time", hi: "भीड़ से बचें, सबसे अच्छा समय सुझाएं" },
  
  // Common
  "common.min": { en: "min", hi: "मिनट" },
  "common.mins": { en: "mins", hi: "मिनट" },
  "common.ok": { en: "OK", hi: "ठीक है" },
  "common.delay": { en: "Delay", hi: "देरी" },
  "common.from": { en: "From", hi: "से" },
  "common.to": { en: "To", hi: "तक" },
  
  // Crowd Levels
  "crowd.low": { en: "Low", hi: "कम" },
  "crowd.moderate": { en: "Moderate", hi: "मध्यम" },
  "crowd.high": { en: "High", hi: "अधिक" },
  "crowd.veryHigh": { en: "Very High", hi: "बहुत अधिक" },
  
  // Settings
  "settings.language": { en: "Language", hi: "भाषा" },
  "settings.theme": { en: "Theme", hi: "थीम" },
  "settings.dark": { en: "Dark", hi: "डार्क" },
  "settings.light": { en: "Light", hi: "लाइट" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
