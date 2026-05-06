import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bell, BellOff, Settings, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../lib/language-context';
import { predictCrowdLevel, predictDelays, predictTrainArrival } from '../../lib/aiService';
import { getAllStations, getAllLines } from '../../lib/realMetroService';

const PredictiveNotifications = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const [settings, setSettings] = useState({
    crowdAlerts: true,
    delayAlerts: true,
    routeChanges: true,
    weatherAlerts: true,
    maintenanceAlerts: true
  });

  useEffect(() => {
    if (enabled) {
      generateNotifications();
      const interval = setInterval(generateNotifications, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [enabled, settings]);

  const generateNotifications = () => {
    const newNotifications = [];

    // Crowd level alerts
    const stations = getAllStations();
    stations.forEach(station => {
      const crowdLevel = predictCrowdLevel(station.id, 'blue');
      if (settings.crowdAlerts && crowdLevel.level === 'very-high') {
        newNotifications.push({
          id: `crowd-${station.id}-${Date.now()}`,
          type: 'crowd',
          title: t('notifications.crowdAlert'),
          message: `${station.name}: ${t('crowd.veryHigh')}`,
          priority: 'high',
          timestamp: new Date(),
          station: station.id
        });
      }
    });

    // Delay predictions
    const lines = getAllLines();
    lines.forEach(line => {
      const delayPrediction = predictDelays(line.id);
      if (settings.delayAlerts && delayPrediction.probability > 50) {
        newNotifications.push({
          id: `delay-${line.id}-${Date.now()}`,
          type: 'delay',
          title: t('notifications.delayAlert'),
          message: `${line.name}: ${delayPrediction.estimatedDelay} min delay`,
          priority: 'high',
          timestamp: new Date(),
          line: line.id
        });
      }
    });

    // Weather alerts (mock)
    if (settings.weatherAlerts && Math.random() > 0.95) {
      newNotifications.push({
        id: `weather-${Date.now()}`,
        type: 'weather',
        title: t('notifications.weatherAlert'),
        message: t('notifications.weatherMessage'),
        priority: 'medium',
        timestamp: new Date()
      });
    }

    // Maintenance alerts (mock)
    if (settings.maintenanceAlerts && Math.random() > 0.98) {
      newNotifications.push({
        id: `maintenance-${Date.now()}`,
        type: 'maintenance',
        title: t('notifications.maintenanceAlert'),
        message: t('notifications.maintenanceMessage'),
        priority: 'low',
        timestamp: new Date()
      });
    }

    setNotifications(prev => [...newNotifications, ...prev].slice(0, 20)); // Keep last 20 notifications
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'crowd': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'delay': return <Clock className="w-4 h-4 text-red-500" />;
      case 'route': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'weather': return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      case 'maintenance': return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('notifications.title')}</h2>
          <p className="text-gray-600">{t('notifications.subtitle')}</p>
        </div>
        <Button
          variant={enabled ? "default" : "outline"}
          onClick={() => setEnabled(!enabled)}
          className="flex items-center gap-2"
        >
          {enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          {enabled ? t('notifications.enabled') : t('notifications.disabled')}
        </Button>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('notifications.settings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {t(`notifications.settings.${key}`)}
              </label>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                className="rounded"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('notifications.recent')}</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t('notifications.noNotifications')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50"
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                        {t(`notifications.priority.${notification.priority}`)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-400">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveNotifications;