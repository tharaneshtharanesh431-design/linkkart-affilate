'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { useMerchantAnalytics } from '@/lib/hooks/useAnalytics';
import { Plus, TrendingUp, DollarSign, Activity, Download, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AnalyticsKpiCard } from '@/components/analytics/AnalyticsKpiCard';
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';
import { DateRangeSelector } from '@/components/analytics/DateRangeSelector';
import { PerformanceTable } from '@/components/analytics/PerformanceTable';

export default function MerchantDashboard() {
  const { data: userResponse } = useUser();
  const businessName = userResponse?.data?.profile?.businessName || 'Merchant';
  
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');
  const { data: analyticsResponse, isLoading } = useMerchantAnalytics({ range: dateRange });
  const analytics = analyticsResponse?.data;
  const kpis = analytics?.kpis;

  const formatCurrency = (amount: number | undefined) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const handleExport = () => {
    window.location.href = `/api/analytics/merchant/export?range=${dateRange}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your business performance, {businessName}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
          <Button variant="outline" onClick={handleExport}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/dashboard/merchant/products?action=new">
              <Plus size={16} className="mr-2" />
              New Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsKpiCard
          title="Total Revenue"
          value={formatCurrency(kpis?.totalSalesAmount)}
          icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Estimated Earnings (Net)"
          value={formatCurrency(kpis?.totalEarnings)}
          subtitle="Revenue minus approved commissions"
          icon={<DollarSign className="h-4 w-4 text-indigo-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Approved Comm. Costs"
          value={formatCurrency(kpis?.approvedEarnings)}
          icon={<DollarSign className="h-4 w-4 text-rose-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Pending Comm. Costs"
          value={formatCurrency(kpis?.pendingEarnings)}
          icon={<Activity className="h-4 w-4 text-orange-500" />}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 h-[400px]">
          <CardHeader>
            <CardTitle>Sales & Conversions</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <AnalyticsChart
              data={analytics?.timeSeries || []}
              xKey="date"
              primaryKey="sales"
              primaryName="Sales (₹)"
              primaryColor="#10b981"
              secondaryKey="conversions"
              secondaryName="Conversions"
              secondaryColor="#3b82f6"
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
