"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee, ArrowRight, Calculator, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { stations, calculateFare, formatStationName } from "@/lib/metroData";
import { useLanguage } from "@/lib/language-context";

export default function FareCalculator() {
  const { t } = useLanguage();
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [fare, setFare] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (fromStation && toStation && fromStation !== toStation) {
      // Mock distance calculation based on station count
      const mockDistance = Math.floor(Math.random() * 25) + 3;
      setDistance(mockDistance);
      setFare(calculateFare(mockDistance));
    } else {
      setFare(null);
      setDistance(null);
    }
  }, [fromStation, toStation]);

  const fareSlabs = [
    { range: "0-2 km", fare: 10 },
    { range: "2-5 km", fare: 20 },
    { range: "5-12 km", fare: 30 },
    { range: "12-21 km", fare: 40 },
    { range: "21-32 km", fare: 50 },
    { range: "32+ km", fare: 60 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t("fare.title")}</h1>
              <p className="text-purple-100 text-sm">{t("fare.subtitle")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculator */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple-500" />
            {t("fare.calculate")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">
              <Select value={fromStation} onValueChange={setFromStation}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.from")} />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="col-span-2">
              <Select value={toStation} onValueChange={setToStation}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.to")} />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {fare !== null && distance !== null && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {formatStationName(fromStation)} → {formatStationName(toStation)}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{fare}</p>
                    <p className="text-xs text-muted-foreground">{t("fare.oneWay")}</p>
                  </div>
                  <div className="h-10 w-px bg-purple-200 dark:bg-purple-700" />
                  <div>
                    <p className="text-xl font-bold text-pink-600 dark:text-pink-400">{distance} km</p>
                    <p className="text-xs text-muted-foreground">{t("fare.distance")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fare Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            {t("fare.chart")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {fareSlabs.map((slab, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <span className="text-sm font-medium">{slab.range}</span>
                <Badge className="bg-purple-500 hover:bg-purple-500">
                  {slab.fare}
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            * {t("fare.note")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
