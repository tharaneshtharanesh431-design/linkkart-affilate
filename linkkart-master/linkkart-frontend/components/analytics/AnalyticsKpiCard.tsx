import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AnalyticsKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  loading?: boolean;
  valueClassName?: string;
}

export function AnalyticsKpiCard({ title, value, subtitle, icon, loading, valueClassName }: AnalyticsKpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClassName || 'text-slate-900 dark:text-white'}`}>
          {loading ? '...' : value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
