'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, RefreshCw, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllLines, getStationsForLine, getLineColor } from '@/lib/realMetroService.js';
import * as aiService from '@/lib/aiService.js';
import { useLanguage } from '@/lib/language-context';

export default function CrowdHeatmap() {
  const { t } = useLanguage();
  const [selectedLine, setSelectedLine] = useState('');
  const [crowdData, setCrowdData] = useState([]);
  const [metroLines, setMetroLines] = useState([]);
  const [lineStations, setLineStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const lines = getAllLines();
    setMetroLines(lines);
    if (lines.length > 0) {
      setSelectedLine(lines[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedLine) {
      const stations = getStationsForLine(selectedLine);
      setLineStations(stations);
      loadCrowdData();
    }
  }, [selectedLine]);

  const loadCrowdData = async () => {
    setLoading(true);
    try {
      const stations = getStationsForLine(selectedLine);
      const crowdPromises = stations.map(async (station) => {
        const crowdLevel = await aiService.predictCrowdLevel(station.id, selectedLine);
        return {
          station,
          crowdLevel,
          color: getCrowdColor(crowdLevel.level)
        };
      });

      const results = await Promise.all(crowdPromises);
      setCrowdData(results);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading crowd data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCrowdColor = (level) => {
    switch (level) {
      case 'low': return '#10b981'; // green
      case 'moderate': return '#f59e0b'; // yellow
      case 'high': return '#ef4444'; // red
      case 'very-high': return '#7c2d12'; // dark red
      default: return '#6b7280'; // gray
    }
  };

  const getCrowdIcon = (level) => {
    switch (level) {
      case 'low': return '🟢';
      case 'moderate': return '🟡';
      case 'high': return '🔴';
      case 'very-high': return '🔴';
      default: return '⚪';
    }
  };

  const getCrowdTrend = (percentage) => {
    // Simulate trend based on time and random factors
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    return trend;
  };

  const getPeakStations = () => {
    return crowdData
      .filter(item => item.crowdLevel.level === 'very-high' || item.crowdLevel.level === 'high')
      .sort((a, b) => b.crowdLevel.percentage - a.crowdLevel.percentage)
      .slice(0, 3);
  };

  const getQuietStations = () => {
    return crowdData
      .filter(item => item.crowdLevel.level === 'low')
      .sort((a, b) => a.crowdLevel.percentage - b.crowdLevel.percentage)
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-red-600 to-orange-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Live Crowd Heatmap</h1>
              <p className="text-red-100 text-sm">Real-time crowd levels across stations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Select Metro Line</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={loadCrowdData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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

          <div className="mt-3 text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Crowd Level Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Low (0-30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Moderate (30-50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">High (50-75%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-900"></div>
              <span className="text-sm">Very High (75%+)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peak & Quiet Stations */}
      {crowdData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Peak Stations */}
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Most Crowded
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getPeakStations().map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCrowdIcon(item.crowdLevel.level)}</span>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {item.station.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.crowdLevel.percentage}% capacity
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive">
                    {item.crowdLevel.level.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quiet Stations */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                <Users className="h-5 w-5" />
                Least Crowded
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getQuietStations().map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCrowdIcon(item.crowdLevel.level)}</span>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {item.station.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.crowdLevel.percentage}% capacity
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600">
                    {item.crowdLevel.level.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Station List */}
      {crowdData.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">All Stations - Live Crowd Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {crowdData.map((item, idx) => {
                const trend = getCrowdTrend(item.crowdLevel.percentage);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {item.station.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.crowdLevel.percentage}% capacity
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      )}
                      <Badge
                        variant={item.crowdLevel.level === 'low' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {item.crowdLevel.level.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-muted-foreground">Loading live crowd data...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}