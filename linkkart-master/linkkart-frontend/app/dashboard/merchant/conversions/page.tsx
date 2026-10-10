'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Activity, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function MerchantConversionsPage() {
  const [conversions, setConversions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversions = async () => {
      try {
        const res = await api.get('/api/conversions/merchant');
        setConversions(Array.isArray(res) ? res : (res?.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Conversions Ledger</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track sales generated through affiliate links.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : conversions.length === 0 ? (
            <div className="text-center py-12">
              <Activity size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Conversions Yet</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                When affiliates refer sales, they will appear in this ledger.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Code</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Order Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversions.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-sm text-slate-500">
                        {c.trackingCode}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        {c.productName}
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                        ₹{c.amount?.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.status === 'VALID' ? 'default' : 'secondary'} 
                          className={c.status === 'VALID' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-slate-500">
                        {c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
