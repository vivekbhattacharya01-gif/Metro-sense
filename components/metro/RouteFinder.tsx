"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, ArrowRight, Clock, IndianRupee, RefreshCcw, Train } from "lucide-react";
import { useState } from "react";
import { stations, metroLines, formatStationName, calculateFare, getLineColor } from "@/lib/metroData";
import { useLanguage } from "@/lib/language-context";

interface RouteResult {
  from: string;
  to: string;
  lines: string[];
  interchanges: string[];
  stationCount: number;
  estimatedTime: number;
  fare: number;
}

export default function RouteFinder() {
  const { t } = useLanguage();
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [route, setRoute] = useState<RouteResult | null>(null);

  const allStations = stations.map(s => ({ id: s.id, name: s.name }));

  const findRoute = () => {
    if (!fromStation || !toStation || fromStation === toStation) return;

    const fromStationData = stations.find(s => s.id === fromStation);
    const toStationData = stations.find(s => s.id === toStation);

    if (!fromStationData || !toStationData) return;

    const fromLines = fromStationData.lines;
    const toLines = toStationData.lines;

    // Check if direct route exists
    const directLine = fromLines.find(l => toLines.includes(l));
    
    let lines: string[] = [];
    let interchanges: string[] = [];
    let stationCount: number;

    if (directLine) {
      lines = [directLine];
      stationCount = Math.floor(Math.random() * 8) + 3;
    } else {
      // Need interchange - use Rajiv Chowk as common interchange
      const possibleInterchanges = ["rajiv-chowk", "kashmere-gate", "central-secretariat", "ina"];
      const interchange = possibleInterchanges.find(int => {
        const intStation = stations.find(s => s.id === int);
        if (!intStation) return false;
        return fromLines.some(fl => intStation.lines.includes(fl)) && 
               toLines.some(tl => intStation.lines.includes(tl));
      }) || "rajiv-chowk";

      interchanges = [interchange];
      lines = [fromLines[0], toLines[0]];
      stationCount = Math.floor(Math.random() * 12) + 6;
    }

    const distance = stationCount * 1.5;
    const estimatedTime = stationCount * 3 + (interchanges.length * 5);
    const fare = calculateFare(distance);

    setRoute({
      from: fromStation,
      to: toStation,
      lines,
      interchanges,
      stationCount,
      estimatedTime,
      fare
    });
  };

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
    setRoute(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t("route.title")}</h1>
              <p className="text-blue-100 text-sm">{t("route.subtitle")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Station Selection */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("route.from")}</label>
            <Select value={fromStation} onValueChange={setFromStation}>
              <SelectTrigger>
                <SelectValue placeholder={t("route.selectDeparture")} />
              </SelectTrigger>
              <SelectContent>
                {allStations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center">
            <Button variant="ghost" size="icon" onClick={swapStations}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("route.to")}</label>
            <Select value={toStation} onValueChange={setToStation}>
              <SelectTrigger>
                <SelectValue placeholder={t("route.selectDestination")} />
              </SelectTrigger>
              <SelectContent>
                {allStations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
            onClick={findRoute}
            disabled={!fromStation || !toStation || fromStation === toStation}
          >
            {t("route.findRoute")}
          </Button>
        </CardContent>
      </Card>

      {/* Route Result */}
      {route && (
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Train className="h-5 w-5 text-blue-600" />
              {t("route.yourRoute")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Route Summary */}
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{formatStationName(route.from)}</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline">{formatStationName(route.to)}</Badge>
            </div>

            {/* Lines */}
            <div className="flex flex-wrap gap-2">
              {route.lines.map((line, index) => {
                const lineData = metroLines.find(l => l.id === line);
                return (
                  <Badge 
                    key={index}
                    style={{ backgroundColor: getLineColor(line), color: "white" }}
                  >
                    {lineData?.name || line}
                  </Badge>
                );
              })}
            </div>

            {/* Interchanges */}
            {route.interchanges.length > 0 && (
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {t("route.changeAt")}: {route.interchanges.map(i => formatStationName(i)).join(", ")}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Train className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <p className="text-lg font-bold">{route.stationCount}</p>
                <p className="text-xs text-muted-foreground">{t("route.stations")}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <p className="text-lg font-bold">{route.estimatedTime}</p>
                <p className="text-xs text-muted-foreground">{t("route.minutes")}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <IndianRupee className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                <p className="text-lg font-bold">{route.fare}</p>
                <p className="text-xs text-muted-foreground">{t("tab.fare")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
