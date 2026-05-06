'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Clock,
  Users,
  Zap,
  Leaf,
  IndianRupee,
  Navigation,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import * as realMetroService from '@/lib/realMetroService';

export default function SmartRouteOptimization() {
  const { t } = useLanguage();
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [preferences, setPreferences] = useState({
    avoidCrowds: true,
    preferFastest: false,
    ecoFriendly: false,
    minimizeCost: false
  });
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = () => {
    const stationList = realMetroService.getAllStations();
    setStations(stationList);
  };

  const findOptimizedRoutes = async () => {
    if (!fromStation || !toStation) return;

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const optimizedRoutes = generateOptimizedRoutes(fromStation, toStation, preferences);
      setRoutes(optimizedRoutes);
      setLoading(false);
    }, 2000);
  };

  const generateOptimizedRoutes = (from, to, prefs) => {
    // Mock route generation with different optimization strategies
    const baseRoutes = [
      {
        id: 1,
        name: 'Direct Blue Line',
        duration: 25,
        distance: 12.5,
        fare: 30,
        crowdLevel: 'High',
        crowdScore: 8,
        transfers: 0,
        ecoScore: 7,
        path: ['Rajiv Chowk', 'Karol Bagh', 'Rajendra Place', 'Patel Nagar'],
        line: 'Blue Line',
        color: '#2563eb'
      },
      {
        id: 2,
        name: 'Via Yellow Line Transfer',
        duration: 32,
        distance: 14.2,
        fare: 35,
        crowdLevel: 'Medium',
        crowdScore: 5,
        transfers: 1,
        ecoScore: 6,
        path: ['Rajiv Chowk', 'Central Secretariat', 'Khan Market', 'JLN Stadium'],
        line: 'Blue → Yellow',
        color: '#eab308'
      },
      {
        id: 3,
        name: 'Green Line Alternative',
        duration: 28,
        distance: 13.8,
        fare: 32,
        crowdLevel: 'Low',
        crowdScore: 3,
        transfers: 0,
        ecoScore: 8,
        path: ['Rajiv Chowk', 'INA', 'AIIMS', 'Green Park'],
        line: 'Green Line',
        color: '#16a34a'
      }
    ];

    // Apply preferences to reorder routes
    let sortedRoutes = [...baseRoutes];

    if (prefs.avoidCrowds) {
      sortedRoutes.sort((a, b) => a.crowdScore - b.crowdScore);
    } else if (prefs.preferFastest) {
      sortedRoutes.sort((a, b) => a.duration - b.duration);
    } else if (prefs.ecoFriendly) {
      sortedRoutes.sort((a, b) => b.ecoScore - a.ecoScore);
    } else if (prefs.minimizeCost) {
      sortedRoutes.sort((a, b) => a.fare - b.fare);
    }

    // Add optimization scores
    return sortedRoutes.map(route => ({
      ...route,
      score: calculateRouteScore(route, prefs),
      recommendation: getRouteRecommendation(route, prefs)
    }));
  };

  const calculateRouteScore = (route, prefs) => {
    let score = 0;

    if (prefs.avoidCrowds) score += (10 - route.crowdScore) * 2;
    if (prefs.preferFastest) score += (40 - route.duration) * 1.5;
    if (prefs.ecoFriendly) score += route.ecoScore * 2;
    if (prefs.minimizeCost) score += (50 - route.fare) * 1.2;

    // Base score from duration and transfers
    score += (40 - route.duration) + (2 - route.transfers) * 5;

    return Math.round(score);
  };

  const getRouteRecommendation = (route, prefs) => {
    if (prefs.avoidCrowds && route.crowdScore <= 4) return 'Best for avoiding crowds';
    if (prefs.preferFastest && route.duration <= 28) return 'Fastest option';
    if (prefs.ecoFriendly && route.ecoScore >= 8) return 'Most eco-friendly';
    if (prefs.minimizeCost && route.fare <= 30) return 'Cheapest option';
    return 'Balanced choice';
  };

  const getCrowdColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCrowdIcon = (level) => {
    switch (level) {
      case 'Low': return <Users className="h-4 w-4" />;
      case 'Medium': return <Users className="h-4 w-4" />;
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Navigation className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Smart Route Optimization</h1>
              <p className="text-green-100 text-sm">AI-powered route recommendations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Input */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Plan Your Journey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-station">From Station</Label>
              <Select value={fromStation} onValueChange={setFromStation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select departure station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.slice(0, 50).map((station) => (
                    <SelectItem key={station.id} value={station.name}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-station">To Station</Label>
              <Select value={toStation} onValueChange={setToStation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.slice(0, 50).map((station) => (
                    <SelectItem key={station.id} value={station.name}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Travel Preferences</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="avoid-crowds"
                  checked={preferences.avoidCrowds}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, avoidCrowds: checked }))
                  }
                />
                <Label htmlFor="avoid-crowds" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Avoid Crowds
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="fastest"
                  checked={preferences.preferFastest}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, preferFastest: checked }))
                  }
                />
                <Label htmlFor="fastest" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Fastest Route
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="eco-friendly"
                  checked={preferences.ecoFriendly}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, ecoFriendly: checked }))
                  }
                />
                <Label htmlFor="eco-friendly" className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Eco-Friendly
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="minimize-cost"
                  checked={preferences.minimizeCost}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, minimizeCost: checked }))
                  }
                />
                <Label htmlFor="minimize-cost" className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Minimize Cost
                </Label>
              </div>
            </div>
          </div>

          <Button
            onClick={findOptimizedRoutes}
            disabled={!fromStation || !toStation || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Finding Best Routes...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
                Find Optimized Routes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Route Results */}
      {routes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Recommended Routes</h2>
          </div>

          {routes.map((route, index) => (
            <Card key={route.id} className={`relative ${index === 0 ? 'ring-2 ring-blue-500' : ''}`}>
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  BEST
                </div>
              )}

              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  {/* Route Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{route.name}</h3>
                      <p className="text-sm text-muted-foreground">{route.recommendation}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Score: {route.score}/100
                    </Badge>
                  </div>

                  {/* Route Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                      <div className="text-lg font-bold">{route.duration}min</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <MapPin className="h-5 w-5 mx-auto mb-1 text-green-500" />
                      <div className="text-lg font-bold">{route.distance}km</div>
                      <div className="text-xs text-muted-foreground">Distance</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <IndianRupee className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                      <div className="text-lg font-bold">₹{route.fare}</div>
                      <div className="text-xs text-muted-foreground">Fare</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCrowdColor(route.crowdLevel)}`}>
                        {getCrowdIcon(route.crowdLevel)}
                        {route.crowdLevel}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Crowd Level</div>
                    </div>
                  </div>

                  {/* Route Path */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: route.color }}
                      ></div>
                      <span className="text-sm font-medium">{route.line}</span>
                      {route.transfers > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {route.transfers} transfer{route.transfers > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-sm">
                      {route.path.map((station, idx) => (
                        <div key={idx} className="flex items-center">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                            {station}
                          </span>
                          {idx < route.path.length - 1 && (
                            <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Select Route
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tips */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-1">
                Smart Optimization Tips
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Routes are optimized based on real-time crowd data</li>
                <li>• Consider off-peak hours (10 AM - 4 PM) for less crowded travel</li>
                <li>• Green Line routes are generally more eco-friendly</li>
                <li>• Transfer stations can be avoided during peak hours</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}