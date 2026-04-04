"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Train, Clock, Users, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { metroLines, formatStationName, getLineColor } from "@/lib/metroData";
import { aiService } from "@/lib/aiService";
import { useLanguage } from "@/lib/language-context";

export default function RealTimeTracker() {
  const { t } = useLanguage();
  const [selectedLine, setSelectedLine] = useState("blue");
  const [selectedStation, setSelectedStation] = useState("rajiv-chowk");
  const [trainData, setTrainData] = useState<ReturnType<typeof aiService.predictTrainArrival> | null>(null);
  const [crowdData, setCrowdData] = useState<ReturnType<typeof aiService.predictCrowdLevel> | null>(null);
  const [coachData, setCoachData] = useState<ReturnType<typeof aiService.getCoachCrowdDistribution> | null>(null);

  useEffect(() => {
    const updateData = () => {
      setTrainData(aiService.predictTrainArrival(selectedStation, selectedLine));
      setCrowdData(aiService.predictCrowdLevel(selectedStation, selectedLine));
      setCoachData(aiService.getCoachCrowdDistribution(selectedLine));
    };

    updateData();
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, [selectedLine, selectedStation]);

  const line = metroLines.find(l => l.id === selectedLine);
  const lineStations = line?.stations || [];

  const getCrowdColor = (level: string) => {
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
      <Card className="bg-gradient-to-r from-green-600 to-teal-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Train className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t("tracker.title")}</h1>
              <p className="text-green-100 text-sm">{t("tracker.subtitle")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-2 block">{t("tracker.selectLine")}</label>
          <Select value={selectedLine} onValueChange={setSelectedLine}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metroLines.map((line) => (
                <SelectItem key={line.id} value={line.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }} />
                    {line.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">{t("tracker.selectStation")}</label>
          <Select value={selectedStation} onValueChange={setSelectedStation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lineStations.map((stationId) => (
                <SelectItem key={stationId} value={stationId}>
                  {formatStationName(stationId)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Current Station Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" style={{ color: getLineColor(selectedLine) }} />
            {formatStationName(selectedStation)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Next Train */}
          {trainData && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t("tracker.nextTrain")}</p>
                  <p className="text-sm text-muted-foreground">{t("tracker.frequency")}: Every {trainData.frequency} {t("common.mins")}</p>
                </div>
              </div>
              <Badge className="text-lg px-3 py-1 bg-green-500 hover:bg-green-500">
                {trainData.nextTrain} {t("common.min")}
              </Badge>
            </div>
          )}

          {/* Crowd Level */}
          {crowdData && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t("tracker.crowdLevel")}</p>
                  <p className="text-sm text-muted-foreground">{crowdData.recommendation}</p>
                </div>
              </div>
              <Badge className={`${getCrowdColor(crowdData.level)} hover:opacity-90`}>
                {crowdData.percentage}%
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coach-wise Crowd Distribution */}
      {coachData && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("tracker.coachCrowd")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1">
              {coachData.map((coach, index) => (
                <div key={index} className="flex-1 text-center">
                  <div 
                    className={`h-12 rounded-t-lg ${getCrowdColor(coach.crowdLevel)} flex items-center justify-center text-white font-bold`}
                  >
                    {coach.coach}
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground capitalize">
                    {getCrowdLevelText(coach.crowdLevel)}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {t("tracker.tip")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
