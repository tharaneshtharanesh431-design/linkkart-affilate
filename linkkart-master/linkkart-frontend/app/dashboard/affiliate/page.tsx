'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { useAffiliateAnalytics } from '@/lib/hooks/useAnalytics';
import { Link2, TrendingUp, DollarSign, MousePointerClick, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsKpiCard } from '@/components/analytics/AnalyticsKpiCard';
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';
import { DateRangeSelector } from '@/components/analytics/DateRangeSelector';
import { PerformanceTable } from '@/components/analytics/PerformanceTable';

export default function AffiliateDashboard() {
  const { data: userResponse } = useUser();
  const userName = userResponse?.data?.user?.email?.split('@')[0] || 'Affiliate';
  
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');
  const { data: analyticsResponse, isLoading } = useAffiliateAnalytics({ range: dateRange });
  
  const analytics = analyticsResponse?.data;
  const kpis = analytics?.kpis;

  const formatCurrency = (amount: number | undefined) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const handleExport = () => {
    window.location.href = `/api/analytics/affiliate/export?range=${dateRange}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Affiliate Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {userName}. Here is your performance overview.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
          <Button variant="outline" onClick={handleExport}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/marketplace">
              <Link2 size={16} className="mr-2" />
              Marketplace
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsKpiCard
          title="Total Earnings (Approved)"
          value={formatCurrency(kpis?.approvedEarnings)}
          icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Pending Earnings"
          value={formatCurrency(kpis?.pendingEarnings)}
          icon={<DollarSign className="h-4 w-4 text-orange-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Total Clicks"
          value={kpis?.totalClicks?.toLocaleString() || '0'}
          icon={<MousePointerClick className="h-4 w-4 text-blue-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Conversion Rate"
          value={`${kpis?.conversionRate?.toFixed(2) || '0.00'}%`}
          subtitle={`EPC: ${formatCurrency(kpis?.epc)}`}
          icon={<TrendingUp className="h-4 w-4 text-indigo-500" />}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 h-[400px]">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <AnalyticsChart
              data={analytics?.timeSeries || []}
              xKey="date"
              primaryKey="earnings"
              primaryName="Earnings (₹)"
              primaryColor="#4f46e5"
              secondaryKey="conversions"
              secondaryName="Conversions"
              secondaryColor="#10b981"
              loading={isLoading}
            />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <PerformanceTable 
              data={analytics?.topProducts || []} 
              title="Products" 
              loading={isLoading} 
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceTable 
            data={analytics?.topCampaigns || []} 
            title="Campaigns" 
            loading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
