'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Train, Clock, Users, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { metroLines, formatStationName, getLineColor, getStationsForLine } from '@/lib/metroData.js';
import * as aiService from '@/lib/aiService.js';
import { useLanguage } from '@/lib/language-context';
import { getCrowdLevelColor } from '@/lib/metroUtils.js';

export default function RealTimeTracker() {
  const { t } = useLanguage();
  const [selectedLine, setSelectedLine] = useState('blue');
  const [selectedStation, setSelectedStation] = useState('rajiv-chowk');
  const [trainData, setTrainData] = useState(null);
  const [crowdData, setCrowdData] = useState(null);
  const [coachData, setCoachData] = useState(null);

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

  const line = metroLines.find(l => l.id === selectedLine);
  const lineStations = line?.stations || [];

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
      <Card className="bg-gradient-to-r from-green-600 to-teal-600 border-0 text-white">
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
