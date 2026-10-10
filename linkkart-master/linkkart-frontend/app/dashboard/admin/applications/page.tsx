'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page, size: 20 };
      if (searchQuery) params.search = searchQuery;
      if (status !== 'ALL') params.status = status;
      
      const res = await api.admin.applications.list(params);
      setApplications(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err: any) {
      toast.error('Failed to load applications: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, status, searchQuery]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(0);
  };

  const handleApprove = async (campaignId: number, affiliateId: number) => {
    if (!confirm('Are you sure you want to approve this application?')) return;
    try {
      await api.admin.applications.approve(campaignId, affiliateId);
      toast.success('Application approved');
      loadApplications();
    } catch (err: any) {
      toast.error('Failed to approve application: ' + err.message);
    }
  };

  const handleReject = async (campaignId: number, affiliateId: number) => {
    if (!confirm('Are you sure you want to reject this application?')) return;
    try {
      await api.admin.applications.reject(campaignId, affiliateId);
      toast.success('Application rejected');
      loadApplications();
    } catch (err: any) {
      toast.error('Failed to reject application: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Applications</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review pending affiliate applications for campaigns.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search email, campaign..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </form>
            <div className="w-full sm:w-48">
              <Select value={status} onValueChange={(val) => { setStatus(val); setPage(0); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={handleSearch} variant="secondary">Filter</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Campaign</th>
                <th className="px-6 py-4 font-medium">Merchant</th>
                <th className="px-6 py-4 font-medium">Affiliate</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Requested</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={`${app.campaignId}-${app.affiliateId}`} className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {app.campaignName}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {app.merchantEmail}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {app.affiliateEmail}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={app.status === 'APPROVED' ? 'success' : app.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(app.requestedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleApprove(app.campaignId, app.affiliateId)}
                        disabled={app.status === 'APPROVED'}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject(app.campaignId, app.affiliateId)}
                        disabled={app.status === 'REJECTED'}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || loading}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
