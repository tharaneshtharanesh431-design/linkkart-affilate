'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { ArrowLeft, ExternalLink, Star, BadgeCheck, Loader2, Package, Globe, Tag } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface MarketplaceProductPageProps {
  params: {
    id: string;
  };
}

export default function MarketplaceProductPage({ params }: MarketplaceProductPageProps) {
  const productId = Number(params.id);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [affiliateLink, setAffiliateLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError('');
        const data = await api.products.get(productId);
        setProduct(data?.id ? data : (data?.data || null));
      } catch (err: any) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    }
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  useEffect(() => {
    async function checkExistingLink() {
      try {
        const res = await api.affiliateLinks.list();
        const list = Array.isArray(res) ? res : (res?.data || []);
        const existing = list.find((l: any) => l.productId === productId);
        if (existing) {
          setAffiliateLink(existing.trackingUrl);
        }
      } catch (err) {
        console.error('Failed to fetch existing links', err);
      }
    }
    if (productId) {
      checkExistingLink();
    }
  }, [productId]);

  const handleGenerateLink = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      toast.error('Please log in as an affiliate to generate tracking links.');
      window.location.href = '/login';
      return;
    }

    try {
      setGenerating(true);
      const res = await api.affiliateLinks.generate(productId);
      const linkUrl = res?.trackingUrl || res?.data?.trackingUrl;
      setAffiliateLink(linkUrl);
      toast.success('Tracking link generated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate link');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading product details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'The product you are looking for does not exist or has been deactivated.'}</p>
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl">
            <ArrowLeft size={16} /> Back to marketplace
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const price = Number(product.price) || 0;
  const comm = Number(product.commissionRate) || 0;
  const earnings = Number(product.potentialCommission) || ((price * comm) / 100);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500">Marketplace / Product</p>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-1 text-sm text-gray-600">Earn {comm ? `${comm}%` : 'N/A'} commission on every confirmed sale.</p>
          </div>
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <ArrowLeft size={16} /> Back to marketplace
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <div className="rounded-3xl border border-gray-100 overflow-hidden bg-gray-50 shadow-sm flex items-center justify-center min-h-[340px]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600';
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <Package size={48} />
                <span className="text-sm mt-2">No Image Provided</span>
              </div>
            )}
          </div>

          <section className="space-y-6">
            <div className="rounded-3xl border border-gray-100 p-6 shadow-sm bg-white">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Merchant / Brand</p>
                  <p className="text-lg font-semibold text-gray-900">{product.merchantName || 'Linkkart Merchant'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Commission Rate</p>
                  <p className="text-xl font-bold text-emerald-600">{comm ? `${comm}%` : 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">Retail Price</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">₹{price.toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100">
                  <p className="text-xs text-emerald-700 font-medium">Your Commission / Sale</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-0.5">
                    ₹{earnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 p-6 shadow-sm bg-white">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <BadgeCheck size={13} /> Verified Merchant Product
                </span>
                {product.categoryName && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    <Tag size={12} /> {product.categoryName}
                  </span>
                )}
                {product.destinationUrl && (
                  <a
                    href={product.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
                  >
                    <Globe size={12} /> Merchant Destination URL
                  </a>
                )}
              </div>

              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 p-6 shadow-sm bg-white">
              <p className="text-base font-semibold text-gray-900 mb-3">Your Affiliate Tracking Link</p>
              {affiliateLink ? (
                <>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 mb-4 flex items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm break-all text-gray-800 select-all font-mono font-medium">{affiliateLink}</p>
                      <button
                      onClick={() => {
                        navigator.clipboard.writeText(affiliateLink);
                        toast.success('Tracking link copied to clipboard!');
                      }}
                      className="px-3.5 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl transition-colors text-xs font-semibold text-gray-700 flex-shrink-0 shadow-sm"
                      title="Copy Link"
                    >
                      Copy Link
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={affiliateLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      <ExternalLink size={15} /> Test Tracking Redirect
                    </a>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleGenerateLink}
                  disabled={generating}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-60 shadow-sm"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Tracking Link...
                    </>
                  ) : (
                    <>Generate Tracking Link</>
                  )}
                </button>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
