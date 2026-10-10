'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DollarSign, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function MerchantCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const res = await api.get('/api/commissions/merchant');
        setCommissions(Array.isArray(res) ? res : (res?.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommissions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Commissions Ledger</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track amounts owed to affiliates for successful referrals.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Commissions Yet</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                Commissions will appear here when conversions are verified.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead className="text-right">Commission Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        {c.affiliateEmail}
                      </TableCell>
                      <TableCell className="text-right font-medium text-orange-600 dark:text-orange-400">
                        ₹{c.amount?.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.status === 'APPROVED' ? 'default' : c.status === 'PENDING' ? 'secondary' : 'outline'} 
                          className={c.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                                     c.status === 'PENDING' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' : ''}>
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
