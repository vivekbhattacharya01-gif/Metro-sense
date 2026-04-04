"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Train, 
  Bell, 
  Info, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { metroLines, liveUpdates } from "@/lib/metroData";
import { aiService } from "@/lib/aiService";
import { useLanguage } from "@/lib/language-context";
import { useEffect, useState } from "react";

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [crowdPrediction, setCrowdPrediction] = useState<ReturnType<typeof aiService.predictCrowdLevel> | null>(null);
  const [delayPrediction, setDelayPrediction] = useState<ReturnType<typeof aiService.predictDelays> | null>(null);
  const [trainArrival, setTrainArrival] = useState<ReturnType<typeof aiService.predictTrainArrival> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCrowdPrediction(aiService.predictCrowdLevel("rajiv-chowk", "blue"));
    setDelayPrediction(aiService.predictDelays("red"));
    setTrainArrival(aiService.predictTrainArrival("rajiv-chowk", "blue"));
  }, []);

  const hour = currentTime.getHours();
  const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);

  const getGreeting = () => {
    if (hour < 12) return t("greeting.morning");
    if (hour < 17) return t("greeting.afternoon");
    return t("greeting.evening");
  };

  const quickActions = [
    { labelKey: "action.planRoute", icon: MapPin, tab: "route", color: "from-blue-500 to-blue-600" },
    { labelKey: "action.trackTrains", icon: Train, tab: "tracker", color: "from-green-500 to-green-600" },
    { labelKey: "action.setAlarm", icon: Bell, tab: "alarm", color: "from-orange-500 to-orange-600" },
    { labelKey: "action.stationInfo", icon: Info, tab: "station", color: "from-purple-500 to-purple-600" },
  ];

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-500";
      case "moderate": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "very-high": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCrowdLevelText = (level: string) => {
    switch (level) {
      case "low": return t("crowd.low");
      case "moderate": return t("crowd.moderate");
      case "high": return t("crowd.high");
      case "very-high": return t("crowd.veryHigh");
      default: return level;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{getGreeting()}!</h1>
              <p className="text-blue-100 mt-1">{t("dashboard.welcome")}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="text-blue-100 text-sm">
                {currentTime.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peak Hour Warning */}
      {isPeakHour && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-orange-800 dark:text-orange-200">{t("dashboard.peakHours")}</p>
                <p className="text-sm text-orange-600 dark:text-orange-400">{t("dashboard.peakHoursMsg")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          {t("dashboard.quickActions")}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.tab}
              variant="outline"
              className={`h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${action.color} text-white border-0 hover:opacity-90 hover:text-white`}
              onClick={() => setActiveTab(action.tab)}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{t(action.labelKey)}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Line Status Overview */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Train className="h-5 w-5 text-blue-500" />
          {t("dashboard.lineStatus")}
        </h2>
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-2">
              {metroLines.slice(0, 6).map((line) => {
                const update = liveUpdates.find(u => u.line === line.id);
                const isNormal = update?.status === "normal";
                return (
                  <div
                    key={line.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: line.color }}
                    />
                    <span className="text-sm font-medium flex-1">{line.name.replace(" Line", "")}</span>
                    <Badge 
                      variant={isNormal ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {isNormal ? t("common.ok") : t("common.delay")}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          {t("dashboard.aiInsights")}
        </h2>
        <div className="space-y-3">
          {/* Crowd Prediction */}
          {crowdPrediction && (
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Rajiv Chowk {t("tracker.crowdLevel")}</p>
                      <Badge className={getCrowdLevelColor(crowdPrediction.level)}>
                        {getCrowdLevelText(crowdPrediction.level).toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {crowdPrediction.recommendation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delay Prediction */}
          {delayPrediction && (
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
                    <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Red Line {t("common.delay")} Forecast</p>
                      <Badge variant="outline">
                        {delayPrediction.probability}% probability
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {delayPrediction.expectedDelay > 0 
                        ? `${t("status.expectedDelay")}: ${delayPrediction.expectedDelay} ${t("common.mins")} due to ${delayPrediction.reason.toLowerCase()}`
                        : `No significant delays expected. ${delayPrediction.reason} in progress.`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Train Arrival */}
          {trainArrival && (
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                    <Train className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{t("tracker.nextTrain")} at Rajiv Chowk</p>
                      <Badge className="bg-green-500">
                        {trainArrival.nextTrain} {t("common.min")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Blue Line • {t("tracker.frequency")}: Every {trainArrival.frequency} {t("common.mins")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
