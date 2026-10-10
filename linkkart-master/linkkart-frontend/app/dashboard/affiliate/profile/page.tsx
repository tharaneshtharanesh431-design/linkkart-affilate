'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/lib/hooks/useUser';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  paymentEmail: z.string().email('Please enter a valid email address'),
  websiteUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  socialLinks: z.string().optional(),
  taxId: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AffiliateProfilePage() {
  const { data: userResponse, isLoading: isLoadingUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      paymentEmail: '',
      websiteUrl: '',
      socialLinks: '',
      taxId: '',
    },
  });

  useEffect(() => {
    if (userResponse?.data?.profile) {
      const profile = userResponse.data.profile;
      form.reset({
        paymentEmail: profile.paymentEmail || '',
        websiteUrl: profile.websiteUrl || '',
        socialLinks: profile.socialLinks || '',
        taxId: profile.taxId || '',
      });
    }
  }, [userResponse, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsSaving(true);
      await api.profile.onboardAffiliate(values);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and payout information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout Information</CardTitle>
          <CardDescription>
            Update your payment details to ensure you receive your commissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentEmail">PayPal / Payment Email <span className="text-red-500">*</span></Label>
                <Input 
                  id="paymentEmail" 
                  type="email" 
                  {...form.register('paymentEmail')} 
                  placeholder="payments@example.com"
                />
                {form.formState.errors.paymentEmail && (
                  <p className="text-sm text-red-500">{form.formState.errors.paymentEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input 
                  id="websiteUrl" 
                  type="url" 
                  {...form.register('websiteUrl')} 
                  placeholder="https://yourwebsite.com"
                />
                {form.formState.errors.websiteUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.websiteUrl.message}</p>
                )}
                <p className="text-xs text-slate-500">Primary website where you promote products.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialLinks">Social Links</Label>
                <Input 
                  id="socialLinks" 
                  {...form.register('socialLinks')} 
                  placeholder="Twitter, Instagram, YouTube etc."
                />
                <p className="text-xs text-slate-500">Comma-separated URLs to your primary social profiles.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / PAN (Optional)</Label>
                <Input 
                  id="taxId" 
                  {...form.register('taxId')} 
                  placeholder="Tax Identification Number"
                />
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your Link Kart account details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Login Email</p>
              <p className="text-base text-slate-900 dark:text-white font-medium">{userResponse?.data?.user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Role</p>
              <p className="text-base text-slate-900 dark:text-white font-medium capitalize">{userResponse?.data?.user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
