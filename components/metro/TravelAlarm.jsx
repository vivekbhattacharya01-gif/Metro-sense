'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Clock, MapPin, Trash2, AlarmClock } from 'lucide-react';
import { useState } from 'react';
import { stations, formatStationName } from '@/lib/metroData.js';
import * as aiService from '@/lib/aiService.js';
import { useLanguage } from '@/lib/language-context';

export default function TravelAlarm() {
  const { t } = useLanguage();
  const [selectedStation, setSelectedStation] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [alarms, setAlarms] = useState([]);

  const createAlarm = () => {
    if (!selectedStation || !arrivalTime) return;

    const timing = aiService.calculateOptimalAlertTiming(selectedStation, arrivalTime);

    const newAlarm = {
      id: Date.now().toString(),
      station: selectedStation,
      arrivalTime,
      wakeUpTime: timing.wakeUpTime,
      departureTime: timing.departureTime,
      active: true
    };

    setAlarms([...alarms, newAlarm]);
    setSelectedStation('');
    setArrivalTime('');
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const toggleAlarm = (id) => {
    setAlarms(alarms.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t('alarm.title')}</h1>
              <p className="text-orange-100 text-sm">{t('alarm.subtitle')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Alarm */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-orange-500" />
            {t('alarm.setNew')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('alarm.destination')}</label>
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger>
                <SelectValue placeholder={t('alarm.selectDest')} />
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

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('alarm.arrivalTime')}</label>
            <Input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
            onClick={createAlarm}
            disabled={!selectedStation || !arrivalTime}
          >
            <Bell className="h-4 w-4 mr-2" />
            {t('alarm.createSmart')}
          </Button>
        </CardContent>
      </Card>

      {/* Active Alarms */}
      {alarms.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            {t('alarm.yourAlarms')}
          </h2>
          {alarms.map((alarm) => (
            <Card 
              key={alarm.id}
              className={`border-l-4 ${alarm.active ? 'border-l-orange-500' : 'border-l-gray-300 dark:border-l-gray-700 opacity-60'}`}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">{formatStationName(alarm.station)}</span>
                      <Badge variant={alarm.active ? 'default' : 'secondary'}>
                        {alarm.active ? t('alarm.active') : t('alarm.paused')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="p-2 rounded bg-muted/50 text-center">
                        <p className="text-xs text-muted-foreground">{t('alarm.wakeUp')}</p>
                        <p className="font-bold text-orange-600 dark:text-orange-400">{alarm.wakeUpTime}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50 text-center">
                        <p className="text-xs text-muted-foreground">{t('alarm.leaveBy')}</p>
                        <p className="font-bold text-blue-600 dark:text-blue-400">{alarm.departureTime}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50 text-center">
                        <p className="text-xs text-muted-foreground">{t('alarm.arrive')}</p>
                        <p className="font-bold text-green-600 dark:text-green-400">{alarm.arrivalTime}</p>
                      </div>
                    </div>
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
            <p className="text-muted-foreground">{t('alarm.noAlarms')}</p>
            <p className="text-sm text-muted-foreground">{t('alarm.createFirst')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
