'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Users, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function MerchantAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAffiliates();
  }, []);

  const loadAffiliates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/merchant/affiliates');
      setAffiliates(Array.isArray(res) ? res : (res?.data || []));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load affiliates');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (campaignId: number, affiliateId: number, status: string) => {
    try {
      await api.patch(`/api/merchant/affiliates/${campaignId}/${affiliateId}/status?status=${status}`);
      toast.success(`Affiliate status updated to ${status}`);
      loadAffiliates();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Affiliates</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage partners promoting your campaigns.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : affiliates.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Affiliates Yet</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                When affiliates join your campaigns, they will appear here.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                    <TableHead className="text-right">Sales Gen.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.map((a, idx) => (
                    <TableRow key={`${a.affiliateId}-${a.campaignId}-${idx}`}>
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        {a.affiliateEmail}
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400">
                        {a.campaignName}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-slate-600 dark:text-slate-300">
                        {a.totalClicks}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-slate-600 dark:text-slate-300">
                        {a.totalConversions}
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                        ₹{(a.totalCommissionGenerated || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={a.status === 'APPROVED' ? 'default' : a.status === 'PENDING' ? 'secondary' : 'destructive'} 
                          className={a.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}>
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {a.status !== 'APPROVED' && (
                            <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(a.campaignId, a.affiliateId, 'APPROVED')} className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" title="Approve">
                              <CheckCircle size={16} />
                            </Button>
                          )}
                          {a.status !== 'REJECTED' && (
                            <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(a.campaignId, a.affiliateId, 'REJECTED')} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" title="Reject">
                              <XCircle size={16} />
                            </Button>
                          )}
                        </div>
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
