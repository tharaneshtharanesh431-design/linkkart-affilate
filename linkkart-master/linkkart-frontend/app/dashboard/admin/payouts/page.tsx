'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import { useUser } from '@/lib/hooks/useUser';
import { useAdminPayouts, useProcessPayout, useMarkPayoutPaid, useRejectPayout, useFailPayout } from '@/lib/hooks/usePayouts';
import { DollarSign, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminPayouts() {
  const { data: userResponse } = useUser();
  const userName = userResponse?.data?.user?.email?.split('@')[0] || 'Admin';

  const { data: payoutsResponse, isLoading } = useAdminPayouts();
  const payouts = payoutsResponse?.data || [];

  const { mutate: processPayout, isPending: isProcessing } = useProcessPayout();
  const { mutate: markPaid, isPending: isMarkingPaid } = useMarkPayoutPaid();
  const { mutate: rejectPayout, isPending: isRejecting } = useRejectPayout();
  const { mutate: failPayout, isPending: isFailing } = useFailPayout();

  const [rejectId, setRejectId] = useState<number | null>(null);
  const [failId, setFailId] = useState<number | null>(null);
  const [reason, setReason] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle size={12} /> Paid</span>;
      case 'REQUESTED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock size={12} /> Requested</span>;
      case 'PROCESSING':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><RefreshCw size={12} /> Processing</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle size={12} /> Rejected</span>;
      case 'FAILED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle size={12} /> Failed</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleProcess = (id: number) => {
    if (confirm('Process this payout request?')) {
      processPayout(id, { onError: (e: any) => alert(e.response?.data?.message || 'Error processing') });
    }
  };

  const handleMarkPaid = (id: number) => {
    if (confirm('Mark this payout as PAID?')) {
      markPaid(id, { onError: (e: any) => alert(e.response?.data?.message || 'Error marking paid') });
    }
  };

  const handleRejectSubmit = () => {
    if (rejectId && reason.trim()) {
      rejectPayout({ id: rejectId, reason }, {
        onSuccess: () => { setRejectId(null); setReason(''); },
        onError: (e: any) => alert(e.response?.data?.message || 'Error rejecting')
      });
    }
  };

  const handleFailSubmit = () => {
    if (failId && reason.trim()) {
      failPayout({ id: failId, reason }, {
        onSuccess: () => { setFailId(null); setReason(''); },
        onError: (e: any) => alert(e.response?.data?.message || 'Error failing')
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Payout Management</h1>
              <p className="text-sm text-slate-500 mt-1">Manage affiliate withdrawal requests across the platform.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-lg font-medium text-slate-900">All Payout Requests</h3>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading payouts...</div>
          ) : payouts.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No payouts found</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-slate-500 bg-gray-50">
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Affiliate</th>
                    <th className="px-6 py-4 font-medium">Payment Email</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Dates</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {payouts.map((payout: any) => (
                    <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        POX-{payout.id.toString().padStart(4, '0')}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {payout.affiliateEmail}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {payout.paymentEmail}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-semibold">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {renderStatusBadge(payout.status)}
                        {(payout.rejectionReason || payout.failureReason) && (
                          <div className="text-xs text-red-500 mt-1 max-w-[150px] truncate" title={payout.rejectionReason || payout.failureReason}>
                            {payout.rejectionReason || payout.failureReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        <div>Req: {formatDate(payout.requestedAt)}</div>
                        {payout.processedAt && <div>Proc: {formatDate(payout.processedAt)}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right">
                        <div className="flex justify-end gap-2">
                          {payout.status === 'REQUESTED' && (
                            <>
                              <button 
                                onClick={() => handleProcess(payout.id)}
                                disabled={isProcessing}
                                className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs transition-colors"
                              >
                                Process
                              </button>
                              <button 
                                onClick={() => setRejectId(payout.id)}
                                className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {payout.status === 'PROCESSING' && (
                            <>
                              <button 
                                onClick={() => handleMarkPaid(payout.id)}
                                disabled={isMarkingPaid}
                                className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded text-xs transition-colors"
                              >
                                Mark Paid
                              </button>
                              <button 
                                onClick={() => setFailId(payout.id)}
                                className="px-3 py-1 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded text-xs transition-colors"
                              >
                                Fail
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {(rejectId !== null || failId !== null) && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {rejectId !== null ? 'Reject Payout' : 'Fail Payout'}
              </h3>
              <button onClick={() => { setRejectId(null); setFailId(null); setReason(''); }} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Required..."
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setRejectId(null); setFailId(null); setReason(''); }}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={rejectId !== null ? handleRejectSubmit : handleFailSubmit}
                disabled={!reason.trim() || isRejecting || isFailing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:bg-slate-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
