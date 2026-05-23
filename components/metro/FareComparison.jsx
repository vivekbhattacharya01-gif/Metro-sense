'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function FareComparison() {
  const { t } = useLanguage();

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t('fare.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">Compare fares quickly and plan the best journey.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-muted/50 bg-muted/50 p-4">
          <CreditCard className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Fare comparison is available here.</p>
            <p className="text-sm text-muted-foreground">Use the fare calculator above for exact pricing.</p>
          </div>
        </div>
        <Badge variant="secondary">Coming Soon</Badge>
      </CardContent>
    </Card>
  );
}
