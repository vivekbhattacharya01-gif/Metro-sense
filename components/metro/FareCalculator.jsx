'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, ArrowRight, Calculator, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { stations, calculateFare, formatStationName } from '@/lib/metroData.js';
import { useLanguage } from '@/lib/language-context';
import { getRandomInRange } from '@/lib/metroUtils.js';

export default function FareCalculator() {
  const { t } = useLanguage();
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [fare, setFare] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (fromStation && toStation && fromStation !== toStation) {
      const mockDistance = getRandomInRange(3, 28);
      setDistance(mockDistance);
      setFare(calculateFare(mockDistance));
    } else {
      setFare(null);
      setDistance(null);
    }
  }, [fromStation, toStation]);

  const fareSlabs = [
    { range: '0-2 km', fare: 10 },
    { range: '2-5 km', fare: 20 },
    { range: '5-12 km', fare: 30 },
    { range: '12-21 km', fare: 40 },
    { range: '21-32 km', fare: 50 },
    { range: '32+ km', fare: 60 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-linear-to-r from-purple-600 to-pink-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t('fare.title')}</h1>
              <p className="text-purple-100 text-sm">{t('fare.subtitle')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculator */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple-500" />
            {t('fare.calculate')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">
              <Select value={fromStation} onValueChange={setFromStation}>
                <SelectTrigger>
                  <SelectValue placeholder={t('common.from')} />
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
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="col-span-2">
              <Select value={toStation} onValueChange={setToStation}>
                <SelectTrigger>
                  <SelectValue placeholder={t('common.to')} />
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
          </div>

          {fare !== null && distance !== null && (
            <div className="p-4 rounded-lg bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800">
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-sm text-muted-foreground">{t('fare.estimatedFare')}</span>
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">₹{fare}</span>
              </div>
              <div className="text-xs text-muted-foreground text-center mt-2">
                {t('common.approxDistance')}: {distance} km
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fare Slabs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            {t('fare.slabs')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {fareSlabs.map((slab, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition">
                <span className="font-medium">{slab.range}</span>
                <Badge className="bg-green-600 hover:bg-green-700">₹{slab.fare}</Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {t('fare.slabsNote')}
          </p>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium mb-1">{t('fare.info')}</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>{t('fare.sameFrom')}</li>
                <li>{t('fare.roundTrip')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
