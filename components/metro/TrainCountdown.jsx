'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Train, RefreshCw, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllLines, getStationsForLine, formatStationName, getTrainTimingsAtStation } from '@/lib/realMetroService.js';
import { getNextTrainCountdown, formatCountdown, formatDisplayTime, getUpcomingTrains, calculateFrequency } from '@/lib/timerUtils.js';
import { useLanguage } from '@/lib/language-context';

export default function TrainCountdown() {
  const { t } = useLanguage();
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [metroLines, setMetroLines] = useState([]);
  const [lineStations, setLineStations] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [nextTrains, setNextTrains] = useState([]);
  const [frequency, setFrequency] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize lines
  useEffect(() => {
    const lines = getAllLines();
    setMetroLines(lines);
    if (lines.length > 0) {
      setSelectedLine(lines[0].id);
    }
  }, []);

  // Load stations when line changes
  useEffect(() => {
    if (selectedLine) {
      const stations = getStationsForLine(selectedLine);
      setLineStations(stations);
      if (stations.length > 0) {
        setSelectedStation(stations[0].id);
      }
    }
  }, [selectedLine]);

  // Update countdown timer and upcoming trains
  useEffect(() => {
    const updateCountdown = () => {
      if (!selectedLine || !selectedStation) return;

      const timings = getTrainTimingsAtStation(selectedStation, selectedLine);
      if (timings.length === 0) return;

      // Get next train countdown
      const nextCountdown = getNextTrainCountdown(timings[0].arrival_time);
      setCountdown(nextCountdown);

      // Get upcoming trains
      const upcoming = getUpcomingTrains(timings);
      setNextTrains(upcoming);

      // Calculate frequency
      const freq = calculateFrequency(timings);
      setFrequency(freq);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedLine, selectedStation]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const currentLine = metroLines.find(l => l.id === selectedLine);
  const currentStation = lineStations.find(s => s.id === selectedStation);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Next Train Countdown</h1>
              <p className="text-blue-100 text-sm">Live train arrival timer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Select Route</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Metro Line</label>
              <Select value={selectedLine} onValueChange={setSelectedLine}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {metroLines.map((line) => (
                    <SelectItem key={line.id} value={line.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: line.color }}
                        />
                        {line.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Station</label>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lineStations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Countdown Display */}
      {countdown !== null && (
        <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Next Train at {currentStation?.name}
                </p>
                <div className="text-6xl font-bold text-green-600 dark:text-green-400">
                  {formatCountdown(countdown)}
                </div>
              </div>

              {nextTrains.length > 0 && (
                <div className="pt-4 border-t-2 border-green-200 dark:border-green-800">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Exact arrival time
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {formatDisplayTime(nextTrains[0].arrival_time)}
                  </p>
                </div>
              )}

              <div className="flex gap-2 justify-center pt-2">
                {frequency && (
                  <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400">
                    <Train className="h-3 w-3 mr-1" />
                    Every {frequency} mins
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Trains */}
      {nextTrains.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <Train className="h-5 w-5 text-blue-500" />
                Upcoming Trains (Next 3 Hours)
              </CardTitle>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nextTrains.map((train, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 w-12 text-center">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {formatDisplayTime(train.arrival_time)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Arrival Time
                      </p>
                    </div>
                  </div>
                  {idx === 0 && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Next
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Box */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-semibold mb-1">Live Updates</p>
              <p>Timer updates every second with real train schedules from DMRC data.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
