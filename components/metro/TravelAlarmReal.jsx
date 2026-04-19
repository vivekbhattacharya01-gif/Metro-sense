'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Clock, MapPin, Trash2, AlarmClock, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import * as realMetroService from '@/lib/realMetroService.js';
import { useLanguage } from '@/lib/language-context';

export default function TravelAlarmReal() {
  const { t } = useLanguage();
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedLine, setSelectedLine] = useState('');
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load stations on mount
  useEffect(() => {
    try {
      const allStations = realMetroService.getAllStations();
      setStations(allStations.map(s => ({
        id: s.id,
        name: s.name
      })));
      setLoading(false);
    } catch (error) {
      console.error('Error loading stations:', error);
      setLoading(false);
    }
  }, []);

  // Get lines for selected station
  const selectedStationData = stations.find(s => s.id === selectedStation);
  const availableLines = selectedStationData ? 
    realMetroService.getStationDetails(selectedStation)?.routes || [] : [];

  // Request notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Check for train arrivals
  useEffect(() => {
    if (alarms.length === 0) return;

    const checkArrivals = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

      alarms.forEach((alarm, index) => {
        if (!alarm.active || alarm.triggered) return;

        const timings = realMetroService.getTrainTimingsAtStation(alarm.stationId, alarm.lineId);
        
        // Check if any train is arriving now (within 2 minute window)
        const arrivingTrain = timings.find(t => {
          const [tHour, tMin] = t.arrival_time.split(':').map(Number);
          const trainTime = tHour * 60 + tMin;
          const now_mins = now.getHours() * 60 + now.getMinutes();
          return Math.abs(trainTime - now_mins) <= 2;
        });

        if (arrivingTrain) {
          triggerAlarm(alarm);
          
          // Mark as triggered
          const updatedAlarms = [...alarms];
          updatedAlarms[index] = { ...alarm, triggered: true };
          setAlarms(updatedAlarms);
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkArrivals);
  }, [alarms]);

  const triggerAlarm = (alarm) => {
    // Browser notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🚇 Metro Alert!', {
        body: `Train arriving at ${alarm.stationName}`,
        icon: '🔔',
        tag: `metro-${alarm.id}`,
        requireInteraction: true
      });
    }

    // Play sound (if available)
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.7;
      audio.play().catch(() => {
        // Fallback: use Web Audio API
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);
      });
    } catch (error) {
      console.log('Audio notification unavailable');
    }

    // Vibration (mobile)
    if (navigator.vibrate) {
      navigator.vibrate([500, 100, 500, 100, 500]);
    }
  };

  const createAlarm = () => {
    if (!selectedStation || !selectedLine) return;

    const stationData = realMetroService.getStationDetails(selectedStation);
    const frequency = realMetroService.getTrainFrequency(selectedStation, selectedLine);
    const nextTrain = realMetroService.getNextTrainArrival(selectedStation, selectedLine);

    const newAlarm = {
      id: Date.now().toString(),
      stationId: selectedStation,
      stationName: stationData.name,
      lineId: selectedLine,
      lineName: stationData.routes.find(r => r.lineId === selectedLine)?.lineName,
      frequency,
      nextTrain: nextTrain?.arrival_time,
      active: true,
      triggered: false
    };

    setAlarms([...alarms, newAlarm]);
    setSelectedStation('');
    setSelectedLine('');
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const toggleAlarm = (id) => {
    setAlarms(alarms.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading real metro data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-linear-to-r from-orange-500 to-red-500 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">🚇 Live Train Alarm</h1>
              <p className="text-orange-100 text-sm">Real-time arrival notifications with actual DMRC data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Alarm */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-orange-500" />
            Set Station Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Station Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Station</label>
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger>
                <SelectValue placeholder="Search station..." />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Line Selector */}
          {selectedStation && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Line</label>
              <Select value={selectedLine} onValueChange={setSelectedLine}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose line..." />
                </SelectTrigger>
                <SelectContent>
                  {availableLines.map((line) => (
                    <SelectItem key={line.lineId} value={line.lineId}>
                      {line.lineName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:opacity-90"
            onClick={createAlarm}
            disabled={!selectedStation || !selectedLine}
          >
            <Zap className="h-4 w-4 mr-2" />
            Create Real-Time Alert
          </Button>
        </CardContent>
      </Card>

      {/* Active Alarms */}
      {alarms.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Active Alerts ({alarms.filter(a => a.active).length})
          </h2>
          {alarms.map((alarm) => (
            <Card 
              key={alarm.id}
              className={`border-l-4 ${alarm.active ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20' : 'border-l-gray-300 dark:border-l-gray-700 opacity-60'}`}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span className="font-bold text-lg">{alarm.stationName}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 rounded">
                        {alarm.lineName}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Next Train</p>
                        <p className="font-bold text-orange-600 dark:text-orange-400">
                          {alarm.nextTrain || 'Calculating...'}
                        </p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Frequency</p>
                        <p className="font-bold text-blue-600 dark:text-blue-400">
                          {alarm.frequency} min
                        </p>
                      </div>
                    </div>
                    
                    {alarm.triggered && (
                      <div className="mt-2 p-2 rounded bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                          ✅ Train Notification Sent!
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-3">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleAlarm(alarm.id)}
                    >
                      <Bell className={`h-4 w-4 ${alarm.active ? 'text-orange-500' : 'text-gray-400'}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteAlarm(alarm.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {alarms.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 pb-6 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">No alerts set</p>
            <p className="text-sm text-muted-foreground">Set an alert to get notified when trains arrive at your selected station</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
