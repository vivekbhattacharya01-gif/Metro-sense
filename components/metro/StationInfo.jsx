'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Car, 
  Accessibility, 
  Landmark, 
  ArrowRightLeft,
  Building2,
  Info
} from 'lucide-react';
import { useState } from 'react';
import { stations, metroLines, getLineColor } from '@/lib/metroData.js';
import { useLanguage } from '@/lib/language-context';

export default function StationInfo() {
  const { t } = useLanguage();
  const [selectedStation, setSelectedStation] = useState('');

  const station = stations.find(s => s.id === selectedStation);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-violet-600 to-purple-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t('station.title')}</h1>
              <p className="text-violet-100 text-sm">{t('station.subtitle')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Station Selection */}
      <Card>
        <CardContent className="pt-6">
          <label className="text-sm font-medium mb-2 block">{t('station.select')}</label>
          <Select value={selectedStation} onValueChange={setSelectedStation}>
            <SelectTrigger>
              <SelectValue placeholder={t('station.choosePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {stations.map((stn) => (
                <SelectItem key={stn.id} value={stn.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {stn.name}
                    {stn.interchange && (
                      <ArrowRightLeft className="h-3 w-3 text-orange-500" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Station Details */}
      {station && (
        <div className="space-y-4">
          {/* Station Header */}
          <Card className="overflow-hidden">
            <div 
              className="h-2"
              style={{ 
                background: `linear-gradient(to right, ${station.lines.map(l => getLineColor(l)).join(', ')})`
              }}
            />
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{station.name}</h2>
                  <p className="text-muted-foreground">{t('station.code')}: {station.code}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {station.interchange && (
                    <Badge className="bg-orange-500 hover:bg-orange-500">
                      <ArrowRightLeft className="h-3 w-3 mr-1" />
                      {t('station.interchange')}
                    </Badge>
                  )}
                  {station.parkingAvailable && (
                    <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-600 dark:border-green-400">
                      <Car className="h-3 w-3 mr-1" />
                      {t('station.parking')}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Metro Lines */}
              <div className="flex flex-wrap gap-2 mt-4">
                {station.lines.map((lineId) => {
                  const line = metroLines.find(l => l.id === lineId);
                  return (
                    <Badge 
                      key={lineId}
                      style={{ backgroundColor: getLineColor(lineId), color: 'white' }}
                    >
                      {line?.name || lineId}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Facilities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-blue-500" />
                {t('station.facilities')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {station.facilities.map((facility, idx) => (
                  <Badge key={idx} variant="secondary">
                    {facility}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Landmarks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Landmark className="h-5 w-5 text-purple-500" />
                {t('station.landmarks')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {station.landmarks.map((landmark, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{landmark}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!station && (
        <Card className="border-dashed">
          <CardContent className="pt-6 pb-6 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">{t('station.selectToView')}</p>
            <p className="text-sm text-muted-foreground">
              {t('station.infoIncludes')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
