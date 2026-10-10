import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PerformanceMetric {
  id: number;
  name: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
  sales: number;
  earnings: number;
}

interface PerformanceTableProps {
  data: PerformanceMetric[];
  title: string;
  loading?: boolean;
}

export function PerformanceTable({ data, title, loading }: PerformanceTableProps) {
  if (loading) {
    return <div className="p-4 text-center text-slate-500">Loading {title}...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-slate-500">No {title} data found for this period.</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Clicks</TableHead>
            <TableHead className="text-right">Conversions</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium max-w-[200px] truncate" title={item.name}>{item.name}</TableCell>
              <TableCell className="text-right">{item.clicks}</TableCell>
              <TableCell className="text-right">{item.conversions}</TableCell>
              <TableCell className="text-right">{item.conversionRate.toFixed(2)}%</TableCell>
              <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(item.earnings)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
