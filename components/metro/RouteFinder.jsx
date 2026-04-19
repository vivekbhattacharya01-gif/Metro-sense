'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, ArrowRight, Clock, IndianRupee, RefreshCcw, Train } from 'lucide-react';
import { useState } from 'react';
import { stations, metroLines, formatStationName, calculateFare, getLineColor } from '@/lib/metroData.js';
import { useLanguage } from '@/lib/language-context';
import { MAIN_INTERCHANGES, getRandomInRange } from '@/lib/metroUtils.js';

export default function RouteFinder() {
  const { t } = useLanguage();
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [route, setRoute] = useState(null);

  const findRoute = () => {
    if (!fromStation || !toStation || fromStation === toStation) return;

    const fromStationData = stations.find(s => s.id === fromStation);
    const toStationData = stations.find(s => s.id === toStation);

    if (!fromStationData || !toStationData) return;

    const fromLines = fromStationData.lines;
    const toLines = toStationData.lines;

    // Check for direct route
    const directLine = fromLines.find(l => toLines.includes(l));
    
    let lines = [];
    let interchanges = [];
    let stationCount;

    if (directLine) {
      lines = [directLine];
      stationCount = getRandomInRange(3, 10);
    } else {
      // Find interchange station
      const interchange = MAIN_INTERCHANGES.find(int => {
        const intStation = stations.find(s => s.id === int);
        if (!intStation) return false;
        return fromLines.some(fl => intStation.lines.includes(fl)) && 
               toLines.some(tl => intStation.lines.includes(tl));
      }) || 'rajiv-chowk';

      interchanges = [interchange];
      lines = [fromLines[0], toLines[0]];
      stationCount = getRandomInRange(6, 18);
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
      <Card className="bg-liinear-to-r from-blue-600 to-indigo-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t('route.title')}</h1>
              <p className="text-blue-100 text-sm">{t('route.subtitle')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Station Selection */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('route.from')}</label>
            <Select value={fromStation} onValueChange={setFromStation}>
              <SelectTrigger>
                <SelectValue placeholder={t('route.selectDeparture')} />
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
            <Button variant="ghost" size="icon" onClick={swapStations}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('route.to')}</label>
            <Select value={toStation} onValueChange={setToStation}>
              <SelectTrigger>
                <SelectValue placeholder={t('route.selectDestination')} />
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

          <Button 
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:opacity-90"
            onClick={findRoute}
            disabled={!fromStation || !toStation || fromStation === toStation}
          >
            {t('route.findRoute')}
          </Button>
        </CardContent>
      </Card>

      {/* Route Details */}
      {route && (
        <>
          {/* Main Route Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('route.routeDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Lines Used */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="flex items-center gap-2">
                  <Train className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">{t('route.linesUsed')}</span>
                </div>
                <div className="flex gap-2">
                  {route.lines.map(lineId => {
                    const line = metroLines.find(l => l.id === lineId);
                    return (
                      <Badge 
                        key={lineId} 
                        style={{ backgroundColor: line?.color }}
                        className="text-white"
                      >
                        {line?.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Time */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">{t('route.estimatedTime')}</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  ~{route.estimatedTime} {t('common.mins')}
                </span>
              </div>

              {/* Fare */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium">{t('route.fare')}</span>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  ₹{route.fare}
                </span>
              </div>

              {/* Stations Count */}
              <div className="text-sm text-muted-foreground text-center pt-2">
                {route.stationCount} {t('route.stationsOnRoute')}
              </div>
            </CardContent>
          </Card>

          {/* Interchanges */}
          {route.interchanges.length > 0 && (
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('route.interchanges')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {route.interchanges.map((interchange, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                      <ArrowRight className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="font-medium">{formatStationName(interchange)}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        (~5 {t('common.mins')})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
