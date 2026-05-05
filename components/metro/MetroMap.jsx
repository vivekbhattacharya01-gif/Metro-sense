'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Map, Search, ZoomIn, ZoomOut, MapPin, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getAllLines, getAllStations, getLineColor } from '@/lib/realMetroService.js';
import { getMapBounds, getStationPosition, calculateDistance, getNearbyStations } from '@/lib/mapUtils.js';
import { useLanguage } from '@/lib/language-context';

export default function MetroMap() {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const [metroLines, setMetroLines] = useState([]);
  const [allStations, setAllStations] = useState([]);
  const [selectedLine, setSelectedLine] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [bounds, setBounds] = useState(null);
  const mapWidth = 600;
  const mapHeight = 600;

  // Initialize data
  useEffect(() => {
    const lines = getAllLines();
    const stations = getAllStations();
    setMetroLines(lines);
    setAllStations(stations);
    
    if (lines.length > 0) {
      setSelectedLine(lines[0].id);
    }

    const mapBounds = getMapBounds(stations);
    setBounds(mapBounds);
  }, []);

  // Draw map on canvas
  useEffect(() => {
    if (!canvasRef.current || !bounds || allStations.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, mapWidth, mapHeight);

    // Draw background grid (optional)
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = (mapWidth / 10) * i;
      const y = (mapHeight / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mapHeight);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mapWidth, y);
      ctx.stroke();
    }

    // Draw metro lines
    metroLines.forEach((line) => {
      const lineStations = allStations.filter(s => s.routes?.includes(line.id));
      if (lineStations.length === 0) return;

      const opacity = selectedLine === line.id ? 1 : 0.3;
      ctx.globalAlpha = opacity;

      // Draw line path
      ctx.strokeStyle = line.color;
      ctx.lineWidth = selectedLine === line.id ? 4 : 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      lineStations.forEach((station, idx) => {
        const pos = getStationPosition(station, bounds, 20);
        const x = (pos.x / 100) * mapWidth;
        const y = (pos.y / 100) * mapHeight;

        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      ctx.globalAlpha = 1;
    });

    // Draw stations
    allStations.forEach((station) => {
      const pos = getStationPosition(station, bounds, 20);
      const x = (pos.x / 100) * mapWidth;
      const y = (pos.y / 100) * mapHeight;

      // Station circle
      const isSelected = selectedStation?.id === station.id;
      const isHighlighted = selectedLine && station.routes?.includes(selectedLine);

      ctx.fillStyle = isHighlighted ? getLineColor(selectedLine) : '#d1d5db';
      ctx.beginPath();
      ctx.arc(x, y, isSelected ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Border
      if (station.routes?.length > 1) {
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Selected station highlight
      if (isSelected) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw station labels for selected line
    if (selectedLine) {
      const lineStations = allStations.filter(s => s.routes?.includes(selectedLine)).slice(0, 10);
      
      ctx.fillStyle = '#000';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      
      lineStations.forEach((station) => {
        const pos = getStationPosition(station, bounds, 20);
        const x = (pos.x / 100) * mapWidth;
        const y = (pos.y / 100) * mapHeight;
        
        ctx.fillText(station.name.substring(0, 10), x, y + 18);
      });
    }
  }, [bounds, metroLines, allStations, selectedLine, selectedStation]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check which station was clicked
    allStations.forEach((station) => {
      const pos = getStationPosition(station, bounds, 20);
      const stationX = (pos.x / 100) * mapWidth;
      const stationY = (pos.y / 100) * mapHeight;

      const distance = Math.sqrt((x - stationX) ** 2 + (y - stationY) ** 2);
      if (distance < 10) {
        setSelectedStation(station);
      }
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = allStations.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-teal-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Map className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Interactive Metro Map</h1>
              <p className="text-green-100 text-sm">All 262 stations & 36 lines</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Map Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium block">Select Metro Line</label>
            <div className="flex flex-wrap gap-2">
              {metroLines.map((line) => (
                <Button
                  key={line.id}
                  variant={selectedLine === line.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLine(line.id)}
                  style={selectedLine === line.id ? { backgroundColor: line.color } : {}}
                  className="transition"
                >
                  {line.shortName || line.name.substring(0, 3)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Search Station</label>
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search station..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10">
                  {searchResults.map((station) => (
                    <button
                      key={station.id}
                      onClick={() => handleStationSelect(station)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
                    >
                      <MapPin className="h-3 w-3 mr-2 inline" />
                      {station.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setZoom(Math.min(zoom + 0.2, 3))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setZoom(1)}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Canvas */}
      <Card className="overflow-hidden">
        <CardContent className="pt-4 pb-4">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto" style={{ maxHeight: '600px' }}>
            <canvas
              ref={canvasRef}
              width={mapWidth}
              height={mapHeight}
              onClick={handleCanvasClick}
              className="cursor-crosshair w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected Station Info */}
      {selectedStation && (
        <Card className="border-2 border-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              {selectedStation.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Coordinates</p>
              <p className="font-mono text-sm">
                {selectedStation.lat?.toFixed(6)}, {selectedStation.lng?.toFixed(6)}
              </p>
            </div>

            {selectedStation.routes && selectedStation.routes.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Served by {selectedStation.routes.length} Line{selectedStation.routes.length !== 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedStation.routes.map((lineId) => {
                    const line = metroLines.find(l => l.id === lineId);
                    return (
                      <Badge 
                        key={lineId}
                        style={{ backgroundColor: line?.color }}
                        className="text-white"
                      >
                        {line?.name || lineId}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedStation.routes?.length > 1 && (
              <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-600 dark:border-orange-400">
                🔀 Interchange Station
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-semibold mb-1">Map Features</p>
              <ul className="space-y-1 text-xs">
                <li>• Click on stations for details</li>
                <li>• Select line to highlight stations</li>
                <li>• Orange border = Interchange station</li>
                <li>• Zoom in/out for better view</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
