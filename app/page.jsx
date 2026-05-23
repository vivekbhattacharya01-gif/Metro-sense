"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Radio, 
  MapPin, 
  Bell, 
  IndianRupee, 
  AlertCircle, 
  Info,
  Bot,
  Navigation,
  Users,
  TrendingUp,
  Sun,
  Moon,
  Languages,
  Mic,
  Camera,
  CreditCard
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import Dashboard from "@/components/metro/Dashboard";
import RealTimeTracker from "@/components/metro/RealTimeTracker";
import TrainCountdown from '@/components/metro/TrainCountdown';
import MetroMap from '@/components/metro/MetroMap';
import RouteFinder from '@/components/metro/RouteFinder';
import SavedRoutes from '@/components/metro/SavedRoutes';
import TravelAlarmReal from '@/components/metro/TravelAlarmReal';
import FareCalculator from '@/components/metro/FareCalculator';
import FareComparison from '@/components/metro/FareComparison';
import LiveStatus from "@/components/metro/LiveStatus";
// import StationInfo from "@/components/metro/StationInfo";
// import CrowdHeatmap from '@/components/metro/CrowdHeatmap';
// import JourneyAnalytics from '@/components/metro/JourneyAnalytics';
// import SmartRouteOptimization from '@/components/metro/SmartRouteOptimization';
// import AiTripPlanner from '@/components/metro/AiTripPlanner';
// import PredictiveNotifications from '@/components/metro/PredictiveNotifications';
// import VoiceCommands from '@/components/metro/VoiceCommands';
// import ARStationNavigation from '@/components/metro/ARStationNavigation';
// import NFCIntegration from '@/components/metro/NFCIntegration';

export default function MetroSenseApp() {
  const [activeTab, setActiveTab] = useState("home");
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const tabs = [
    { id: "home", labelKey: "tab.home", icon: Home },
    { id: "tracker", labelKey: "tab.live", icon: Radio },
    { id: "route", labelKey: "tab.route", icon: MapPin },
    { id: "alarm", labelKey: "tab.alarm", icon: Bell },
    { id: "fare", labelKey: "tab.fare", icon: IndianRupee },
    { id: "status", labelKey: "tab.status", icon: AlertCircle },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* App Header */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("app.title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("app.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 h-9"
            >
              <Languages className="h-4 w-4" />
              <span className="text-xs font-medium">{language === "en" ? "हिं" : "EN"}</span>
            </Button>
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Content */}
          <div className="pb-20">
            <TabsContent value="home" className="mt-0">
              <Dashboard setActiveTab={setActiveTab} />
            </TabsContent>
            <TabsContent value="tracker" className="mt-0 space-y-6">
              <RealTimeTracker />
              <TrainCountdown />
              <MetroMap />
            </TabsContent>
            <TabsContent value="route" className="mt-0 space-y-6">
              <RouteFinder />
              <SavedRoutes />
            </TabsContent>
            {/* <TabsContent value="smart-route" className="mt-0">
              <SmartRouteOptimization />
            </TabsContent> */}
            <TabsContent value="alarm" className="mt-0">
              <TravelAlarmReal />
            </TabsContent>
            {/* <TabsContent value="notifications" className="mt-0">
              <PredictiveNotifications />
            </TabsContent>
            <TabsContent value="voice" className="mt-0">
              <VoiceCommands />
            </TabsContent>
            <TabsContent value="ar" className="mt-0">
              <ARStationNavigation />
            </TabsContent>
            <TabsContent value="nfc" className="mt-0">
              <NFCIntegration />
            </TabsContent> */}
            <TabsContent value="fare" className="mt-0 space-y-6">
              <FareCalculator />
              <FareComparison />
            </TabsContent>
            <TabsContent value="status" className="mt-0">
              <LiveStatus />
            </TabsContent>
            {/* <TabsContent value="station" className="mt-0">
              <StationInfo />
            </TabsContent>
            <TabsContent value="heatmap" className="mt-0">
              <CrowdHeatmap />
            </TabsContent>
            <TabsContent value="analytics" className="mt-0">
              <JourneyAnalytics />
            </TabsContent>
            <TabsContent value="ai" className="mt-0">
              <AiTripPlanner />
            </TabsContent> */}
          </div>

          {/* Bottom Navigation */}
          <TabsList className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-lg border-t grid grid-cols-6 rounded-none shadow-lg">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none h-full"
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{t(tab.labelKey)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
