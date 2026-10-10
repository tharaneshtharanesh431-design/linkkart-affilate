'use client';

import { useState } from 'react';
import { useAdminAnalytics } from '@/lib/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, Activity, DollarSign, MousePointerClick, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalyticsKpiCard } from '@/components/analytics/AnalyticsKpiCard';
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';
import { DateRangeSelector } from '@/components/analytics/DateRangeSelector';

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');
  const { data: analyticsResponse, isLoading } = useAdminAnalytics({ range: dateRange });
  const analytics = analyticsResponse?.data;
  const kpis = analytics?.kpis;

  const formatCurrency = (amount: number | undefined) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const handleExport = () => {
    window.location.href = `/api/analytics/admin/export?range=${dateRange}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Platform overview and high-level metrics.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
          <Button variant="outline" onClick={handleExport}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsKpiCard
          title="Total Users"
          value={kpis?.totalUsers || '0'}
          subtitle={`${kpis?.totalAffiliates || 0} Affiliates | ${kpis?.totalMerchants || 0} Merchants`}
          icon={<Users className="h-4 w-4 text-slate-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Products & Campaigns"
          value={kpis?.totalProducts || '0'}
          subtitle={`${kpis?.activeCampaigns || 0} Active Campaigns`}
          icon={<Package className="h-4 w-4 text-slate-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Clicks & Conversions"
          value={kpis?.totalConversions || '0'}
          subtitle={`From ${kpis?.totalClicks || 0} tracked clicks`}
          icon={<MousePointerClick className="h-4 w-4 text-blue-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Total Platform Sales"
          value={formatCurrency(kpis?.totalSalesAmount)}
          icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Approved Commissions"
          value={formatCurrency(kpis?.approvedEarnings)}
          icon={<DollarSign className="h-4 w-4 text-indigo-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Pending Commissions"
          value={formatCurrency(kpis?.pendingEarnings)}
          icon={<Activity className="h-4 w-4 text-orange-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Paid Payouts"
          value={formatCurrency(kpis?.paidPayouts)}
          icon={<RefreshCw className="h-4 w-4 text-teal-500" />}
          loading={isLoading}
        />
        <AnalyticsKpiCard
          title="Pending Payouts"
          value={formatCurrency(kpis?.pendingPayouts)}
          icon={<RefreshCw className="h-4 w-4 text-amber-500" />}
          loading={isLoading}
        />
      </div>

      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Platform Revenue & Commission Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <AnalyticsChart
            data={analytics?.timeSeries || []}
            xKey="date"
            primaryKey="sales"
            primaryName="Total Sales (₹)"
            primaryColor="#10b981"
            secondaryKey="earnings"
            secondaryName="Commissions (₹)"
            secondaryColor="#8b5cf6"
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
