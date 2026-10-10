'use client';

import { useState } from 'react';
import { useMyPaymentMethods, useAddPaymentMethod, useDeletePaymentMethod } from '@/lib/hooks/usePaymentMethods';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, CreditCard, Trash2, Building } from 'lucide-react';
import { toast } from 'sonner';

export function PaymentMethodsTab() {
  const { data: response, isLoading } = useMyPaymentMethods();
  const { mutate: addPaymentMethod, isPending: isAdding } = useAddPaymentMethod();
  const { mutate: deletePaymentMethod, isPending: isDeleting } = useDeletePaymentMethod();

  const [showAddModal, setShowAddModal] = useState(false);
  const [type, setType] = useState('BANK_ACCOUNT');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [identifier, setIdentifier] = useState('');

  const paymentMethods = response?.data || [];

  const handleAdd = () => {
    if (!accountHolderName || !identifier) {
      toast.error('Please fill in all fields');
      return;
    }

    addPaymentMethod({ type, accountHolderName, identifier }, {
      onSuccess: () => {
        toast.success('Payment method added successfully');
        setShowAddModal(false);
        setAccountHolderName('');
        setIdentifier('');
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to add payment method');
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      deletePaymentMethod(id, {
        onSuccess: () => toast.success('Payment method removed'),
        onError: (err: any) => toast.error(err.message || 'Failed to remove payment method')
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Payment Methods</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage where you receive your payouts.</p>
        </div>
        
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new bank account or UPI ID to receive payouts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_ACCOUNT">Bank Account</SelectItem>
                    <SelectItem value="UPI">UPI ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="holder">Account Holder Name</Label>
                <Input 
                  id="holder" 
                  value={accountHolderName} 
                  onChange={(e) => setAccountHolderName(e.target.value)} 
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifier">{type === 'UPI' ? 'UPI ID' : 'Account Number'}</Label>
                <Input 
                  id="identifier" 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)} 
                  placeholder={type === 'UPI' ? 'name@bank' : 'Enter account number'}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add Payment Method'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
      ) : paymentMethods.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No payment methods found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center max-w-sm">
              You haven't added any payment methods yet. Add one to receive your earnings.
            </p>
            <Button variant="outline" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method: any) => (
            <Card key={method.id} className="relative overflow-hidden">
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                    {method.type === 'BANK_ACCOUNT' ? <Building size={20} /> : <CreditCard size={20} />}
                  </div>
                  <div>
                    <CardTitle className="text-base">{method.type === 'BANK_ACCOUNT' ? 'Bank Account' : 'UPI'}</CardTitle>
                    <CardDescription>{method.accountHolderName}</CardDescription>
                  </div>
                </div>
                <Badge variant={method.status === 'ACTIVE' ? 'default' : 'secondary'}
                       className={method.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : ''}>
                  {method.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-2">
                  <div className="font-mono text-lg tracking-wider text-slate-700 dark:text-slate-300">
                    {method.maskedIdentifier}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    onClick={() => handleDelete(method.id)}
                    disabled={isDeleting || method.status !== 'ACTIVE'}
                    title="Remove method"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
