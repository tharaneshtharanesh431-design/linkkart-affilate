'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const earningsData = [
  { month: 'Jan', earnings: 4200 },
  { month: 'Feb', earnings: 5800 },
  { month: 'Mar', earnings: 4900 },
  { month: 'Apr', earnings: 7200 },
  { month: 'May', earnings: 8400 },
  { month: 'Jun', earnings: 9100 },
  { month: 'Jul', earnings: 11200 },
  { month: 'Aug', earnings: 13500 },
  { month: 'Sep', earnings: 12100 },
  { month: 'Oct', earnings: 15800 },
  { month: 'Nov', earnings: 18200 },
  { month: 'Dec', earnings: 24830 },
];

const miniStats = [
  { label: 'Total Earned', value: '$24,830', change: '+18.3%' },
  { label: 'Conversions', value: '1,284', change: '+12.1%' },
  { label: 'Click Rate', value: '4.28%', change: '+0.8%' },
  { label: 'Active Links', value: '42', change: '+6 new' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="text-gray-400 mb-0.5">{label}</p>
        <p className="font-bold text-gray-900">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Live Dashboard</p>
          <h2 className="text-4xl font-bold text-white mb-5 leading-tight">
            Your earnings, always in view
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A clean analytics dashboard gives you complete visibility into every campaign, link, and commission.
          </p>
        </div>

        {/* Dashboard Mock */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {/* Window bar */}
          <div className="border-b border-gray-800 px-5 py-3.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
            </div>
            <span className="text-gray-600 text-xs ml-2">Linkkart Dashboard</span>
          </div>

          <div className="p-6">
            {/* Mini Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {miniStats.map((stat) => (
                <div key={stat.label} className="bg-gray-800 border border-gray-700/60 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-emerald-500 mt-1">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Line Chart */}
            <div className="bg-gray-800 border border-gray-700/60 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-300">Earnings Overview</p>
                <span className="text-xs text-gray-500">Last 12 months</span>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#93c5fd"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: '#93c5fd', stroke: '#1e293b', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm"
          >
            Explore the dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
