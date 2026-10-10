import { DollarSign, MousePointer, Users, TrendingUp } from 'lucide-react';

export default function StatCards({ summary }: { summary: any }) {
  const earningsVal = summary ? `₹${Number(summary.totalEarnings).toLocaleString('en-IN')}` : '₹0';
  const clicksVal = summary ? summary.totalClicks.toLocaleString() : '0';
  const convsVal = summary ? summary.totalConversions.toLocaleString() : '0';
  const rateVal = summary ? `${Number(summary.conversionRate).toFixed(2)}%` : '0.00%';

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Earnings',
      value: earningsVal,
      sub: 'Approved commissions',
    },
    {
      icon: MousePointer,
      label: 'Total Clicks',
      value: clicksVal,
      sub: 'All visitor clicks',
    },
    {
      icon: Users,
      label: 'Conversions',
      value: convsVal,
      sub: 'Completed sales',
    },
    {
      icon: TrendingUp,
      label: 'Conversion Rate',
      value: rateVal,
      sub: 'Conversions / clicks',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
              <stat.icon size={16} className="text-gray-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
          <div className="text-xs text-gray-400">{stat.label}</div>
          <div className="text-xs text-gray-300 mt-1">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}
