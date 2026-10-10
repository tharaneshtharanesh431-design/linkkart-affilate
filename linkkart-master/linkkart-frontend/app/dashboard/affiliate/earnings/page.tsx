'use client';

import { useState } from 'react';
import { useCommissionSummary, useMyCommissions, AffiliateCommissionResponse } from '@/lib/hooks/useCommissions';
import { useMyBalance, useMyPayouts, useRequestPayout } from '@/lib/hooks/usePayouts';
import { useMyPaymentMethods } from '@/lib/hooks/usePaymentMethods';
import { DollarSign, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Loader2, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PaymentMethodsTab } from './payment-methods-tab';

export default function AffiliateEarningsPage() {
  const { data: summaryResponse, isLoading: isLoadingSummary } = useCommissionSummary();
  const { data: commissionsResponse, isLoading: isLoadingCommissions } = useMyCommissions();
  
  const { data: balanceResponse, isLoading: isLoadingBalance } = useMyBalance();
  const { data: payoutsResponse, isLoading: isLoadingPayouts } = useMyPayouts();
  const { data: methodsResponse, isLoading: isLoadingMethods } = useMyPaymentMethods();
  const { mutate: requestPayout, isPending: isRequesting } = useRequestPayout();

  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const summary = summaryResponse?.data;
  const commissions: AffiliateCommissionResponse[] = commissionsResponse?.data || [];
  const balance = balanceResponse?.data;
  const payouts = payoutsResponse?.data || [];
  const paymentMethods = methodsResponse?.data || [];

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

  const submitWithdrawal = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Invalid amount');
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    requestPayout({ amount, paymentMethodId: parseInt(selectedPaymentMethod) }, {
      onSuccess: () => {
        setShowModal(false);
        setWithdrawAmount('');
        setSelectedPaymentMethod('');
        toast.success('Withdrawal request submitted successfully');
      },
      onError: (err: any) => {
        toast.error(err.message || 'Withdrawal failed');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Earnings & Payouts</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your commissions and withdraw funds.</p>
      </div>

      <Tabs defaultValue="earnings" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="earnings">Commissions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts & Withdrawals</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoadingSummary ? '...' : formatCurrency(summary?.totalEarnings)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoadingSummary ? '...' : formatCurrency(summary?.pendingEarnings)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoadingSummary ? '...' : formatCurrency(summary?.approvedEarnings)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reversed</CardTitle>
                <AlertCircle className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoadingSummary ? '...' : formatCurrency(summary?.reversedEarnings)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCommissions ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
              ) : commissions.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No commissions yet</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    When visitors purchase products through your links, your commissions will appear here.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-slate-200 dark:border-slate-800">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Conversion</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Clears At</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissions.map((comm) => (
                        <TableRow key={comm.id}>
                          <TableCell className="font-medium text-slate-900 dark:text-white">
                            Order #{comm.conversionId}
                          </TableCell>
                          <TableCell className="font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(comm.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={comm.status === 'APPROVED' ? 'default' : comm.status === 'PENDING' ? 'secondary' : 'outline'} 
                                   className={comm.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                                              comm.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : ''}>
                              {comm.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-500 dark:text-slate-400">{formatDate(comm.clearsAt)}</TableCell>
                          <TableCell className="text-slate-500 dark:text-slate-400">{formatDate(comm.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="flex flex-col justify-between">
              <div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {isLoadingBalance ? '...' : formatCurrency(balance?.availableBalance)}
                  </div>
                </CardContent>
              </div>
              <div className="p-4 pt-0">
                <Dialog open={showModal} onOpenChange={setShowModal}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                      disabled={isLoadingBalance || (balance && balance.availableBalance < balance.minimumPayout)}
                      onClick={() => setWithdrawAmount(balance?.availableBalance.toString() || '')}
                    >
                      Withdraw Funds
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Withdrawal</DialogTitle>
                      <DialogDescription>
                        You have {formatCurrency(balance?.availableBalance)} available. 
                        Minimum payout is {formatCurrency(balance?.minimumPayout)}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input 
                          id="amount" 
                          type="number" 
                          value={withdrawAmount} 
                          onChange={(e) => setWithdrawAmount(e.target.value)} 
                          min={balance?.minimumPayout}
                          max={balance?.availableBalance}
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Select Payment Method</Label>
                        <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose where to receive funds" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.length === 0 ? (
                              <SelectItem value="0" disabled>No payment methods found</SelectItem>
                            ) : (
                              paymentMethods
                                .filter((pm: any) => pm.status === 'ACTIVE')
                                .map((pm: any) => (
                                  <SelectItem key={pm.id} value={pm.id.toString()}>
                                    {pm.type === 'BANK_ACCOUNT' ? 'Bank' : 'UPI'} - {pm.maskedIdentifier}
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                        {paymentMethods.length === 0 && (
                          <p className="text-xs text-amber-600 mt-1">
                            Please add a payment method in the Payment Methods tab first.
                          </p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                      <Button onClick={submitWithdrawal} disabled={isRequesting}>
                        {isRequesting ? 'Processing...' : 'Confirm Withdrawal'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoadingBalance ? '...' : formatCurrency(balance?.pendingEarnings)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing</CardTitle>
                <RefreshCw className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoadingBalance ? '...' : formatCurrency((balance?.requestedAmount || 0) + (balance?.processingAmount || 0))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLoadingBalance ? '...' : formatCurrency(balance?.paidAmount)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPayouts ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
              ) : payouts.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No payouts yet</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Request your first withdrawal once your available balance reaches the minimum threshold.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-slate-200 dark:border-slate-800">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payout ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Processed</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payouts.map((payout: any) => (
                        <TableRow key={payout.id}>
                          <TableCell className="font-medium text-slate-900 dark:text-white">
                            POX-{payout.id.toString().padStart(4, '0')}
                          </TableCell>
                          <TableCell className="font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(payout.amount)}
                          </TableCell>
                          <TableCell className="text-slate-500 dark:text-slate-400">
                            {payout.paymentMethod ? `${payout.paymentMethod.type === 'BANK_ACCOUNT' ? 'Bank' : 'UPI'} (${payout.paymentMethod.maskedIdentifier})` : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={payout.status === 'PAID' ? 'default' : payout.status === 'REQUESTED' ? 'secondary' : 'outline'}
                                   className={payout.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                                              payout.status === 'REQUESTED' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : ''}>
                              {payout.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-500 dark:text-slate-400">{formatDate(payout.requestedAt)}</TableCell>
                          <TableCell className="text-slate-500 dark:text-slate-400">{payout.processedAt ? formatDate(payout.processedAt) : '-'}</TableCell>
                          <TableCell className="text-slate-500 dark:text-slate-400 truncate max-w-[200px]" title={payout.rejectionReason || payout.failureReason}>
                            {payout.rejectionReason || payout.failureReason || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="methods" className="space-y-6">
          <PaymentMethodsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
