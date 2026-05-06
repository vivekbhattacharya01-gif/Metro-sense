'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  IndianRupee,
  Leaf,
  Award,
  Target,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

export default function JourneyAnalytics() {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setLoading(true);
    // Simulate loading analytics data
    setTimeout(() => {
      const mockAnalytics = generateMockAnalytics();
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1500);
  };

  const generateMockAnalytics = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    return {
      overview: {
        totalTrips: 47,
        totalDistance: 234, // km
        totalFare: 890, // rupees
        carbonSaved: 156, // kg CO2
        avgTripTime: 28, // minutes
        mostUsedLine: 'Blue Line',
        favoriteStation: 'Rajiv Chowk'
      },
      monthlyData: [
        { month: 'Jan', trips: 42, distance: 198 },
        { month: 'Feb', trips: 38, distance: 182 },
        { month: 'Mar', trips: 45, distance: 215 },
        { month: 'Apr', trips: 47, distance: 234 }
      ],
      lineUsage: [
        { name: 'Blue Line', value: 35, color: '#2563eb' },
        { name: 'Yellow Line', value: 28, color: '#eab308' },
        { name: 'Red Line', value: 20, color: '#dc2626' },
        { name: 'Green Line', value: 12, color: '#16a34a' },
        { name: 'Violet Line', value: 5, color: '#7c3aed' }
      ],
      timePatterns: [
        { hour: '6-8 AM', trips: 12, label: 'Morning Peak' },
        { hour: '8-10 AM', trips: 15, label: 'Late Morning' },
        { hour: '5-7 PM', trips: 14, label: 'Evening Peak' },
        { hour: '7-9 PM', trips: 6, label: 'Late Evening' }
      ],
      achievements: [
        {
          title: 'Eco Warrior',
          description: 'Saved 156kg of CO2 this month',
          icon: '🌱',
          progress: 78,
          target: 200
        },
        {
          title: 'Regular Commuter',
          description: '47 trips completed',
          icon: '🎯',
          progress: 94,
          target: 50
        },
        {
          title: 'Time Saver',
          description: 'Average 28min per trip',
          icon: '⚡',
          progress: 85,
          target: 35
        }
      ],
      insights: [
        'You save ₹450/month compared to auto rickshaws',
        'Your most efficient route is Blue Line via Rajiv Chowk',
        'Peak hours: 8-10 AM (15 trips) - consider adjusting schedule',
        'Green Line usage could reduce your travel time by 12%'
      ]
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-white/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Journey Analytics</h1>
                <p className="text-blue-100 text-sm">Your travel patterns & insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-muted-foreground">Analyzing your travel patterns...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Journey Analytics</h1>
              <p className="text-blue-100 text-sm">Your travel patterns & insights</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {analytics.overview.totalTrips}
            </div>
            <div className="text-sm text-muted-foreground">Total Trips</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {analytics.overview.totalDistance}km
            </div>
            <div className="text-sm text-muted-foreground">Distance</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              ₹{analytics.overview.totalFare}
            </div>
            <div className="text-sm text-muted-foreground">Total Fare</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {analytics.overview.carbonSaved}kg
            </div>
            <div className="text-sm text-muted-foreground">CO2 Saved</div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Monthly Travel Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trips" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Usage & Time Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Usage */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Metro Line Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.lineUsage}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.lineUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time Patterns */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Travel Time Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analytics.timePatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="trips" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Achievements & Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.achievements.map((achievement, idx) => (
            <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {achievement.progress}%
                </Badge>
              </div>
              <Progress value={achievement.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Target className="h-5 w-5" />
            AI Travel Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analytics.insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-blue-800 dark:text-blue-300">{insight}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Travel Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-lg font-bold">{analytics.overview.favoriteStation}</div>
              <div className="text-xs text-muted-foreground">Most Used Station</div>
            </div>

            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-lg font-bold">{analytics.overview.avgTripTime}min</div>
              <div className="text-xs text-muted-foreground">Avg Trip Time</div>
            </div>

            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <Leaf className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-lg font-bold">{analytics.overview.carbonSaved}kg</div>
              <div className="text-xs text-muted-foreground">CO2 Saved</div>
            </div>

            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <IndianRupee className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <div className="text-lg font-bold">₹{Math.round(analytics.overview.totalFare / analytics.overview.totalTrips)}</div>
              <div className="text-xs text-muted-foreground">Avg Fare/Trip</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}