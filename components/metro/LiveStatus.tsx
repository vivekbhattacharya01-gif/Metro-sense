"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock, Train, Radio } from "lucide-react";
import { metroLines, liveUpdates } from "@/lib/metroData";
import { aiService } from "@/lib/aiService";
import { useLanguage } from "@/lib/language-context";
import { useEffect, useState } from "react";

interface LineStatusData {
  line: string;
  status: string;
  message: string;
  delay: ReturnType<typeof aiService.predictDelays>;
}

export default function LiveStatus() {
  const { t } = useLanguage();
  const [statusData, setStatusData] = useState<LineStatusData[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const updateStatus = () => {
      const data = metroLines.map(line => {
        const update = liveUpdates.find(u => u.line === line.id);
        const delay = aiService.predictDelays(line.id);
        return {
          line: line.id,
          status: update?.status || "normal",
          message: update?.message || "Status unavailable",
          delay
        };
      });
      setStatusData(data);
      setLastUpdated(new Date());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    return status === "normal" 
      ? <CheckCircle2 className="h-5 w-5 text-green-500" />
      : <AlertTriangle className="h-5 w-5 text-orange-500" />;
  };

  const getStatusBadge = (status: string) => {
    return status === "normal"
      ? <Badge className="bg-green-500 hover:bg-green-500">{t("status.normal")}</Badge>
      : <Badge className="bg-orange-500 hover:bg-orange-500">{t("status.delayed")}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-cyan-600 to-blue-600 border-0 text-white">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Radio className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{t("status.title")}</h1>
              <p className="text-cyan-100 text-sm">{t("status.subtitle")}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-cyan-100 text-xs">
                <Clock className="h-3 w-3" />
                {t("status.updated")} {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Status */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">{t("status.runningNormal")}</p>
              <p className="text-sm text-green-600 dark:text-green-400">{t("status.minorDelays")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line-wise Status */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Train className="h-5 w-5 text-blue-500" />
          {t("dashboard.lineStatus")}
        </h2>
        {statusData.map((data) => {
          const line = metroLines.find(l => l.id === data.line);
          if (!line) return null;

          return (
            <Card key={data.line} className="overflow-hidden">
              <div 
                className="h-1"
                style={{ backgroundColor: line.color }}
              />
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(data.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{line.name}</span>
                        {getStatusBadge(data.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {data.message}
                      </p>
                      {data.delay.expectedDelay > 0 && (
                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                          {t("status.expectedDelay")}: ~{data.delay.expectedDelay} {t("common.mins")}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {data.delay.probability}% {t("status.delayRisk")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Operating Hours */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            {t("status.operatingHours")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-sm text-muted-foreground">{t("status.firstTrain")}</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">5:30 AM</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-sm text-muted-foreground">{t("status.lastTrain")}</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">11:30 PM</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {t("status.peakHoursNote")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
