import { useState } from 'react';
import { useMyBalance, useMyPayouts, useRequestPayout } from '@/lib/hooks/usePayouts';
import { DollarSign, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';

export default function PayoutsTab() {
  const { data: balanceResponse, isLoading: isLoadingBalance } = useMyBalance();
  const { data: payoutsResponse, isLoading: isLoadingPayouts } = useMyPayouts();
  const { mutate: requestPayout, isPending: isRequesting } = useRequestPayout();

  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const balance = balanceResponse?.data;
  const payouts = payoutsResponse?.data || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const handleWithdrawClick = () => {
    if (!balance) return;
    if (balance.availableBalance < balance.minimumPayout) {
      alert(`Minimum withdrawal amount is ${formatCurrency(balance.minimumPayout)}`);
      return;
    }
    setWithdrawAmount(balance.availableBalance.toString());
    setShowModal(true);
  };

  const submitWithdrawal = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }
    requestPayout({ amount, paymentMethodId: 0 }, {
      onSuccess: () => {
        setShowModal(false);
        setWithdrawAmount('');
      },
      onError: (err: any) => {
        alert(err.response?.data?.message || 'Withdrawal failed');
      }
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Available Balance</h3>
              <DollarSign size={20} className="text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {isLoadingBalance ? '...' : formatCurrency(balance?.availableBalance)}
            </div>
          </div>
          <button
            onClick={handleWithdrawClick}
            disabled={isLoadingBalance || (balance && balance.availableBalance < balance.minimumPayout)}
            className="mt-4 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Withdraw
          </button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Pending Earnings</h3>
            <Clock size={20} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {isLoadingBalance ? '...' : formatCurrency(balance?.pendingEarnings)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Processing</h3>
            <RefreshCw size={20} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {isLoadingBalance ? '...' : formatCurrency((balance?.requestedAmount || 0) + (balance?.processingAmount || 0))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Total Paid</h3>
            <CheckCircle size={20} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {isLoadingBalance ? '...' : formatCurrency(balance?.paidAmount)}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-medium text-slate-900">Payout History</h3>
        </div>
        
        {isLoadingPayouts ? (
          <div className="p-8 text-center text-slate-500">Loading payouts...</div>
        ) : payouts.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No payouts yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Request your first withdrawal once your available balance reaches the minimum threshold.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-slate-500 bg-gray-50">
                  <th className="px-6 py-4 font-medium">Payout ID</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Requested</th>
                  <th className="px-6 py-4 font-medium">Processed</th>
                  <th className="px-6 py-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {payouts.map((payout: any) => (
                  <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      POX-{payout.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-semibold">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {renderStatusBadge(payout.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(payout.requestedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {payout.processedAt ? formatDate(payout.processedAt) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-[200px]" title={payout.rejectionReason || payout.failureReason}>
                      {payout.rejectionReason || payout.failureReason || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && balance && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Request Withdrawal</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Available Balance</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-lg font-semibold text-slate-900">
                {formatCurrency(balance.availableBalance)}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Withdrawal Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                <input
                  type="number"
                  min={balance.minimumPayout}
                  max={balance.availableBalance}
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="pl-8 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Minimum withdrawal: {formatCurrency(balance.minimumPayout)}</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitWithdrawal}
                disabled={isRequesting || parseFloat(withdrawAmount) > balance.availableBalance || parseFloat(withdrawAmount) < balance.minimumPayout}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:bg-slate-300"
              >
                {isRequesting ? 'Processing...' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
