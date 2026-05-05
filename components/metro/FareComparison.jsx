'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, TrendingDown, Award, Calculator } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllStations, calculateFare } from '@/lib/realMetroService.js';
import { useLanguage } from '@/lib/language-context';

export default function FareComparison() {
  const { t } = useLanguage();
  const [distance, setDistance] = useState('');
  const [tripCount, setTripCount] = useState('');
  const [stations, setStations] = useState([]);
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    setStations(getAllStations());
  }, []);

  const calculateComparison = () => {
    if (!distance || !tripCount) return;

    const dist = parseFloat(distance);
    const trips = parseInt(tripCount);

    if (dist <= 0 || trips <= 0) return;

    // Single journey fare
    const singleFare = calculateFare(dist);
    const totalSingleJourneys = singleFare * trips;

    // Smart Card pricing (10% discount on regular fares)
    const smartCardFare = Math.floor(singleFare * 0.9);
    const totalSmartCard = smartCardFare * trips;
    const smartCardSavings = totalSingleJourneys - totalSmartCard;

    // Weekly pass (unlimited 7 days) - ₹300
    const weeklyPass = 300;
    const weeksNeeded = Math.ceil(trips / 20); // Assuming 20 trips per week
    const totalWeeklyPasses = weeklyPass * weeksNeeded;
    const weeklySavings = totalSingleJourneys - totalWeeklyPasses;

    // Monthly pass (unlimited 30 days) - ₹1000
    const monthlyPass = 1000;
    const monthsNeeded = Math.ceil(trips / 80); // Assuming 80 trips per month
    const totalMonthlyPasses = monthlyPass * monthsNeeded;
    const monthlySavings = totalSingleJourneys - totalMonthlyPasses;

    // Determine best option
    let bestOption = 'single';
    let bestPrice = totalSingleJourneys;
    let bestSavings = 0;

    if (totalSmartCard < bestPrice) {
      bestOption = 'smartcard';
      bestPrice = totalSmartCard;
      bestSavings = smartCardSavings;
    }

    if (totalWeeklyPasses < bestPrice && weeklySavings > 0) {
      bestOption = 'weekly';
      bestPrice = totalWeeklyPasses;
      bestSavings = weeklySavings;
    }

    if (totalMonthlyPasses < bestPrice && monthlySavings > 0) {
      bestOption = 'monthly';
      bestPrice = totalMonthlyPasses;
      bestSavings = monthlySavings;
    }

    setComparison({
      distance: dist,
      trips,
      singleJourney: {
        farePerTrip: singleFare,
        totalCost: totalSingleJourneys
      },
      smartCard: {
        farePerTrip: smartCardFare,
        totalCost: totalSmartCard,
        savings: smartCardSavings,
        discountPercent: 10
      },
      weeklyPass: {
        passPrice: weeklyPass,
        passesNeeded: weeksNeeded,
        totalCost: totalWeeklyPasses,
        savings: weeklySavings,
        avgPerTrip: Math.floor(totalWeeklyPasses / trips)
      },
      monthlyPass: {
        passPrice: monthlyPass,
        passesNeeded: monthsNeeded,
        totalCost: totalMonthlyPasses,
        savings: monthlySavings,
        avgPerTrip: Math.floor(totalMonthlyPasses / trips)
      },
      bestOption,
      bestPrice,
      bestSavings
    });
  };

  const handleCalculate = () => {
    calculateComparison();
  };

  const getRecommendation = () => {
    if (!comparison) return null;

    const { bestOption, bestSavings } = comparison;

    const recommendations = {
      single: { text: 'Single Journey', emoji: '🎫', detail: 'Pay per trip' },
      smartcard: { text: 'Smart Card', emoji: '💳', detail: '10% discount on all trips' },
      weekly: { text: 'Weekly Pass', emoji: '📅', detail: 'Unlimited 7 days' },
      monthly: { text: 'Monthly Pass', emoji: '📆', detail: 'Unlimited 30 days' }
    };

    return recommendations[bestOption];
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Smart Fare Comparison</h1>
              <p className="text-purple-100 text-sm">Find the cheapest way to travel</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Calculate Your Savings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Distance (km)</label>
              <input
                type="number"
                min="1"
                max="50"
                placeholder="e.g., 15"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Number of Trips</label>
              <input
                type="number"
                min="1"
                max="500"
                placeholder="e.g., 20"
                value={tripCount}
                onChange={(e) => setTripCount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900"
              />
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full bg-purple-600 hover:bg-purple-700">
            <Calculator className="h-4 w-4 mr-2" />
            Compare Fares
          </Button>
        </CardContent>
      </Card>

      {/* Best Option Highlight */}
      {comparison && recommendation && (
        <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-2">
              <div className="text-4xl">{recommendation.emoji}</div>
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
                {recommendation.text}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {recommendation.detail}
              </p>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ₹{comparison.bestPrice}
                </div>
                {comparison.bestSavings > 0 && (
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                    <TrendingDown className="h-4 w-4" />
                    Save ₹{comparison.bestSavings}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      {comparison && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">All Options Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Single Journey */}
              <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Single Journey</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Pay per trip</p>
                  </div>
                  {comparison.bestOption === 'single' && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Award className="h-3 w-3 mr-1" />
                      Best
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">₹{comparison.singleJourney.farePerTrip} per trip</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">₹{comparison.singleJourney.totalCost}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">for {comparison.trips} trips</p>
                </div>
              </div>

              {/* Smart Card */}
              <div className="p-4 border border-blue-300 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Smart Card</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">10% discount per trip</p>
                  </div>
                  {comparison.bestOption === 'smartcard' && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Award className="h-3 w-3 mr-1" />
                      Best
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">₹{comparison.smartCard.farePerTrip} per trip</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">₹{comparison.smartCard.totalCost}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Save ₹{comparison.smartCard.savings}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">for {comparison.trips} trips</p>
                </div>
              </div>

              {/* Weekly Pass */}
              <div className="p-4 border border-orange-300 dark:border-orange-700 rounded-lg bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/40 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Weekly Pass</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">₹{comparison.weeklyPass.passPrice}/week (unlimited)</p>
                  </div>
                  {comparison.bestOption === 'weekly' && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Award className="h-3 w-3 mr-1" />
                      Best
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">₹{comparison.weeklyPass.avgPerTrip} avg per trip</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">₹{comparison.weeklyPass.totalCost}</p>
                    {comparison.weeklyPass.savings > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Save ₹{comparison.weeklyPass.savings}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{comparison.weeklyPass.passesNeeded} pass(es)</p>
                </div>
              </div>

              {/* Monthly Pass */}
              <div className="p-4 border border-indigo-300 dark:border-indigo-700 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/40 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Monthly Pass</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">₹{comparison.monthlyPass.passPrice}/month (unlimited)</p>
                  </div>
                  {comparison.bestOption === 'monthly' && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Award className="h-3 w-3 mr-1" />
                      Best
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">₹{comparison.monthlyPass.avgPerTrip} avg per trip</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">₹{comparison.monthlyPass.totalCost}</p>
                    {comparison.monthlyPass.savings > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Save ₹{comparison.monthlyPass.savings}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{comparison.monthlyPass.passesNeeded} pass(es)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
