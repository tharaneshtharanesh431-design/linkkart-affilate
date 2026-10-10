'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Megaphone, Mail, CheckCircle2, ArrowRight, Loader2, Link as LinkIcon, Building2 } from 'lucide-react';

export default function AffiliateOnboarding() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    paymentEmail: '',
    websiteUrl: '',
    socialLinks: '',
    taxId: ''
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      await api.profile.onboardAffiliate(formData);
      
      await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      router.push('/dashboard/affiliate');
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Megaphone className="text-white" size={24} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Complete your profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us how you plan to promote products.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300" 
                  style={{ width: `${((step - 1) / 2) * 100}%` }} 
                />
              </div>
              {[1, 2, 3].map((s) => (
                <div 
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors ${
                    step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s ? <CheckCircle2 size={16} /> : <span className="text-sm font-medium">{s}</span>}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-gray-500">
              <span>Traffic</span>
              <span>Payouts</span>
              <span>Finish</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Website/Blog (Optional)</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="url"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors sm:text-sm"
                    placeholder="https://yourblog.com"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Social Links (Optional)</label>
                <div className="mt-2">
                  <textarea
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors sm:text-sm"
                    placeholder="Twitter: @username&#10;YouTube: youtube.com/c/channel"
                    value={formData.socialLinks}
                    onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Payout Email</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors sm:text-sm"
                    placeholder="paypal@example.com"
                    value={formData.paymentEmail}
                    onChange={(e) => setFormData({ ...formData, paymentEmail: e.target.value })}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Where should we send your commissions?</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tax ID (Optional)</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors sm:text-sm"
                    placeholder="Leave blank to provide later"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => formData.paymentEmail && setStep(3)}
                  disabled={!formData.paymentEmail || !formData.paymentEmail.includes('@')}
                  className="w-2/3 flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="text-emerald-600" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Ready to earn!</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Your profile is complete. You can now browse the marketplace and generate affiliate links.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="w-1/3 flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-2/3 flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Saving...
                    </>
                  ) : (
                    'Go to Dashboard'
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
