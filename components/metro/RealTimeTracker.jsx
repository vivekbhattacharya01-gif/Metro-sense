'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Train, Clock, Users, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllLines, getStationsForLine, formatStationName, getLineColor, getTrainTimingsAtStation } from '@/lib/realMetroService.js';
import * as aiService from '@/lib/aiService.js';
import { useLanguage } from '@/lib/language-context';
import { getCrowdLevelColor } from '@/lib/metroUtils.js';
import { getNextTrainCountdown, formatCountdown } from '@/lib/timerUtils.js';

export default function RealTimeTracker() {
  const { t } = useLanguage();
  const [selectedLine, setSelectedLine] = useState('33'); // Use real line ID
  const [selectedStation, setSelectedStation] = useState('68'); // Use real station ID
  const [trainData, setTrainData] = useState(null);
  const [crowdData, setCrowdData] = useState(null);
  const [coachData, setCoachData] = useState(null);
  const [stationTimings, setStationTimings] = useState([]);
  const [nextCountdown, setNextCountdown] = useState(null);
  const [lineProgress, setLineProgress] = useState(0);
  const [metroLines, setMetroLines] = useState([]);
  const [lineStations, setLineStations] = useState([]);

  useEffect(() => {
    const lines = getAllLines();
    setMetroLines(lines);
    if (lines.length > 0) {
      setSelectedLine(lines[0].id);
      const stations = getStationsForLine(lines[0].id);
      setLineStations(stations);
      if (stations.length > 0) {
        setSelectedStation(stations[0].id);
      }
    }
  }, []);

  useEffect(() => {
    const updateData = () => {
      setTrainData(aiService.predictTrainArrival(selectedStation, selectedLine));
      setCrowdData(aiService.predictCrowdLevel(selectedStation, selectedLine));
      setCoachData(aiService.getCoachCrowdDistributionByLine(selectedLine));
    };

    updateData();
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, [selectedLine, selectedStation]);

  useEffect(() => {
    if (selectedLine) {
      const stations = getStationsForLine(selectedLine);
      setLineStations(stations);

      if (selectedStation) {
        const stationIndex = stations.findIndex(s => s.id === selectedStation);
        setLineProgress(Math.max(0, stationIndex) / Math.max(stations.length - 1, 1));
      }

      const timings = getTrainTimingsAtStation(selectedStation, selectedLine);
      setStationTimings(timings);

      if (timings.length > 0) {
        const nextTime = timings[0].arrival_time;
        setNextCountdown(getNextTrainCountdown(nextTime));
      } else {
        setNextCountdown(null);
      }
    }
  }, [selectedLine, selectedStation]);

  const getCrowdLevelText = (level) => {
    const textMap = {
      'low': 'crowd.low',
      'moderate': 'crowd.moderate',
      'high': 'crowd.high',
      'very-high': 'crowd.veryHigh',
    };
    return t(textMap[level] || level);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-linear-to-r from-green-600 to-teal-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Train className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t('tracker.title')}</h1>
              <p className="text-green-100 text-sm">{t('tracker.subtitle')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('tracker.selectLine')}</label>
          <Select value={selectedLine} onValueChange={setSelectedLine}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metroLines.map((metro) => (
                <SelectItem key={metro.id} value={metro.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metro.color }} />
                    {metro.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">{t('tracker.selectStation')}</label>
          <Select value={selectedStation} onValueChange={setSelectedStation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lineStations.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name || formatStationName(station.id)}
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
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950">
              <div className="flex items-center gap-2">
                <Train className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium">{t('tracker.nextTrain')}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{trainData.nextTrain}</div>
                <div className="text-xs text-muted-foreground">
                  {t('common.mins')} (every {trainData.frequency} {t('common.mins')})
                </div>
              </div>
            </div>
          )}

          {/* Crowd Level */}
          {crowdData && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium">{t('tracker.crowdLevel')}</span>
              </div>
              <div className="text-right">
                <Badge className={getCrowdLevelColor(crowdData.level)}>
                  {getCrowdLevelText(crowdData.level).toUpperCase()}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  {crowdData.percentage}% {t('common.capacity')}
                </div>
              </div>
            </div>
          )}

          {/* Recommendation */}
          {crowdData && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                💡 {crowdData.recommendation}
              </p>
            </div>
          )}

          {/* Train Progress */}
          {lineStations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>{t('tracker.lineProgress')}</span>
                <span>{Math.round(lineProgress * 100)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${Math.round(lineProgress * 100)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">
                {lineStations.length > 0 && `${formatStationName(selectedStation)} is station ${lineStations.findIndex(s => s.id === selectedStation) + 1} of ${lineStations.length}`}
              </p>
            </div>
          )}

          {/* Countdown to next train */}
          {nextCountdown !== null && (
            <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-3">
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">Next train arrival</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{formatCountdown(nextCountdown)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coach Distribution */}
      {coachData && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('tracker.coachCrowdLevel')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {coachData.map((coach) => (
                <div
                  key={coach.coach}
                  className={`p-3 rounded-lg text-center ${getCrowdLevelColor(coach.crowdLevel)} text-white font-semibold`}
                >
                  {coach.coach}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {t('tracker.coachTip')}: {t('common.leftCoach')} 1 & 8 {t('common.lessQueueLocation')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
