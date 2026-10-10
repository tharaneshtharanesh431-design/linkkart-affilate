import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, LineChart, Line, ComposedChart } from 'recharts';

interface AnalyticsChartProps {
  data: any[];
  xKey: string;
  primaryKey: string;
  primaryName: string;
  primaryColor?: string;
  secondaryKey?: string;
  secondaryName?: string;
  secondaryColor?: string;
  loading?: boolean;
}

export function AnalyticsChart({
  data,
  xKey,
  primaryKey,
  primaryName,
  primaryColor = '#4f46e5',
  secondaryKey,
  secondaryName,
  secondaryColor = '#10b981',
  loading
}: AnalyticsChartProps) {
  if (loading) {
    return <div className="h-full w-full flex items-center justify-center text-slate-500">Loading chart data...</div>;
  }
  
  if (!data || data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-slate-500">No data available for this period.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey={xKey} 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12 }} 
          dy={10}
        />
        <YAxis 
          yAxisId="left" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        {secondaryKey && (
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
        )}
        <Tooltip 
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar yAxisId="left" dataKey={primaryKey} name={primaryName} fill={primaryColor} radius={[4, 4, 0, 0]} maxBarSize={40} />
        {secondaryKey && (
          <Line yAxisId="right" type="monotone" dataKey={secondaryKey} name={secondaryName} stroke={secondaryColor} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
