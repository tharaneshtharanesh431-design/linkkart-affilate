'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Check, X, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminLedgerPage() {
  const [activeTab, setActiveTab] = useState('payouts');
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page, size: 20 };
      if (searchQuery) params.search = searchQuery;
      if (status !== 'ALL') params.status = status;
      
      let res;
      if (activeTab === 'conversions') {
        res = await api.admin.ledger.conversions(params);
      } else if (activeTab === 'commissions') {
        res = await api.admin.ledger.commissions(params);
      } else {
        res = await api.admin.ledger.payouts(params);
      }
      
      setData(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err: any) {
      toast.error(`Failed to load ${activeTab}: ` + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, status, searchQuery, activeTab]);

  useEffect(() => {
    setPage(0);
    setSearch('');
    setSearchQuery('');
    setStatus('ALL');
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(0);
  };

  const handleUpdatePayout = async (id: number, newStatus: string) => {
    const notes = prompt(`Enter ${newStatus.toLowerCase()} reason (optional):`);
    if (notes === null && newStatus !== 'PAID') return;
    
    try {
      await api.admin.ledger.updatePayout(id, newStatus, notes || undefined);
      toast.success(`Payout ${newStatus.toLowerCase()}`);
      loadData();
    } catch (err: any) {
      toast.error(`Failed to update payout: ` + err.message);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeVariant = (s: string) => {
    switch (s) {
      case 'VALID':
      case 'APPROVED':
      case 'PAID':
        return 'success';
      case 'PENDING':
      case 'REQUESTED':
      case 'PROCESSING':
        return 'warning';
      case 'REJECTED':
      case 'FAILED':
      case 'REVERSED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Ledger</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage platform financials, conversions, and payouts.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
          <TabsTrigger value="payouts" className="rounded-md data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-900">
            Payouts
          </TabsTrigger>
          <TabsTrigger value="commissions" className="rounded-md data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-900">
            Commissions
          </TabsTrigger>
          <TabsTrigger value="conversions" className="rounded-md data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-900">
            Conversions
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="capitalize">{activeTab} Filter</CardTitle>
            <Button variant="ghost" size="sm" onClick={loadData}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search email, id..." 
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
                    {activeTab === 'conversions' && (
                      <>
                        <SelectItem value="VALID">Valid</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                      </>
                    )}
                    {activeTab === 'commissions' && (
                      <>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="REVERSED">Reversed</SelectItem>
                      </>
                    )}
                    {activeTab === 'payouts' && (
                      <>
                        <SelectItem value="REQUESTED">Requested</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </>
                    )}
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
                  {activeTab === 'conversions' && (
                    <>
                      <th className="px-6 py-4 font-medium">Tx ID</th>
                      <th className="px-6 py-4 font-medium">Affiliate</th>
                      <th className="px-6 py-4 font-medium">Merchant</th>
                      <th className="px-6 py-4 font-medium">Sale Amount</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </>
                  )}
                  {activeTab === 'commissions' && (
                    <>
                      <th className="px-6 py-4 font-medium">ID / Conv ID</th>
                      <th className="px-6 py-4 font-medium">Affiliate</th>
                      <th className="px-6 py-4 font-medium">Merchant</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Clears On</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </>
                  )}
                  {activeTab === 'payouts' && (
                    <>
                      <th className="px-6 py-4 font-medium">ID / Method</th>
                      <th className="px-6 py-4 font-medium">Affiliate</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No {activeTab} found
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      {activeTab === 'conversions' && (
                        <>
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                            {item.transactionId}
                            <div className="text-xs text-slate-500 font-normal mt-1">{item.campaignName}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{item.affiliateEmail}</td>
                          <td className="px-6 py-4 text-slate-500">{item.merchantEmail}</td>
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{formatCurrency(item.saleAmount)}</td>
                          <td className="px-6 py-4 text-slate-500">{formatDate(item.createdAt)}</td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                          </td>
                        </>
                      )}
                      
                      {activeTab === 'commissions' && (
                        <>
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                            #{item.id}
                            <div className="text-xs text-slate-500 font-normal mt-1">Conv: #{item.conversionId}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{item.affiliateEmail}</td>
                          <td className="px-6 py-4 text-slate-500">{item.merchantEmail}</td>
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{formatCurrency(item.amount)}</td>
                          <td className="px-6 py-4 text-slate-500">{formatDate(item.clearingDate)}</td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                          </td>
                        </>
                      )}

                      {activeTab === 'payouts' && (
                        <>
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                            #{item.id}
                            <div className="text-xs text-slate-500 font-normal mt-1">{item.paymentMethod || 'BANK_TRANSFER'}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{item.affiliateEmail}</td>
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{formatCurrency(item.amount)}</td>
                          <td className="px-6 py-4 text-slate-500">{formatDate(item.requestedAt)}</td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                            {item.notes && <div className="text-xs text-slate-400 mt-1">{item.notes}</div>}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                            {(item.status === 'REQUESTED' || item.status === 'PROCESSING') && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdatePayout(item.id, 'PAID')}
                                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                >
                                  <Check className="w-3 h-3 mr-1" /> Mark Paid
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdatePayout(item.id, 'REJECTED')}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                >
                                  <X className="w-3 h-3 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                          </td>
                        </>
                      )}
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
      </Tabs>
    </div>
  );
}
