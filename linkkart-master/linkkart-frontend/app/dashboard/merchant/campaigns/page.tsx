'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Megaphone, Plus, Edit, Trash2, Loader2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function MerchantCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/campaigns/merchant');
      setCampaigns(Array.isArray(res) ? res : (res?.data || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await api.delete(`/api/campaigns/${id}`);
    } catch(err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Campaigns</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage affiliate programs for your products.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/dashboard/merchant/campaigns/new">
              <Plus size={16} className="mr-2" />
              New Campaign
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Campaigns Yet</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                Create a campaign to define commission rates and attract affiliates.
              </p>
              <Button asChild variant="outline">
                <Link href="/dashboard/merchant/campaigns/new">Create Campaign</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        {c.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {c.commissionRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.status === 'ACTIVE' ? 'default' : 'secondary'} className={c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                            <Link href={`/dashboard/merchant/campaigns/${c.id}`}>
                              <Edit size={16} />
                            </Link>
                          </Button>
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
