'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  ChevronLeft, Package, Edit3, Share2, AlertCircle, Loader2, 
  ExternalLink, TrendingUp, Users, Target, Activity, Tag, Hash, Calendar, DollarSign
} from 'lucide-react';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.products.get(Number(params.id));
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Unable to load this product.');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-[#6D28D9] animate-spin" />
        <p className="text-[#291451]/60 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#291451] mb-2">Product not found</h2>
        <p className="text-[15px] text-[#291451]/70 mb-8 font-medium">
          {error || "The product you're looking for may have been removed or you may not have access to it."}
        </p>
        <button 
          onClick={() => router.push('/dashboard/merchant/products')}
          className="px-6 py-3 bg-[#6D28D9] text-white font-bold rounded-full hover:bg-[#7C3AED] transition-colors shadow-sm"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const isActive = product.status === 'ACTIVE';
  const price = Number(product.price) || 0;
  const commission = Number(product.commissionRate) || 0;
  const potentialCommission = (price * commission) / 100;
  const createdAt = new Date(product.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center text-[13px] font-semibold text-[#291451]/60">
        <Link href="/dashboard/merchant/products" className="hover:text-[#6D28D9] flex items-center gap-1 transition-colors">
          <ChevronLeft size={16} />
          Products
        </Link>
        <span className="mx-2 text-[#291451]/30">/</span>
        <span className="text-[#291451] truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* 
        ==================================================
        PRODUCT HERO 
        ==================================================
      */}
      <div className="bg-white rounded-[32px] overflow-hidden border border-[#E5D8F4] shadow-[0_8px_30px_rgba(41,20,81,0.03)] flex flex-col lg:flex-row relative">
        {/* Left Visual Area */}
        <div className="w-full lg:w-1/2 bg-[#FBF9FF] p-10 flex items-center justify-center relative min-h-[400px] lg:border-r border-[#E5D8F4]">
          {/* Decorative radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.03),transparent_70%)] pointer-events-none" />
          
          {isActive && (
            <div className="absolute top-6 left-6 z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md text-emerald-700 text-[13px] font-bold rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Offering
              </span>
            </div>
          )}

          <div className="relative z-10 w-full max-w-[400px] aspect-square flex items-center justify-center">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_40px_rgba(41,20,81,0.1)] transition-transform duration-700 hover:scale-105" 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800';
                }}
              />
            ) : (
              <div className="w-full h-full bg-white/50 backdrop-blur-sm rounded-[32px] border border-[#E5D8F4] flex flex-col items-center justify-center text-[#291451]/20">
                <Package size={80} strokeWidth={1} />
                <span className="text-[15px] font-semibold mt-4">Product image unavailable</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#F5EEFF] text-[#6D28D9] text-[12px] font-bold tracking-widest uppercase rounded-full border border-[#E5D8F4]">
              {product.categoryName || 'General'}
            </span>
          </div>

          <h1 className="text-[36px] lg:text-[42px] font-bold text-[#291451] leading-[1.1] tracking-tight mb-4">
            {product.name}
          </h1>

          <p className="text-[16px] text-[#291451]/60 font-medium leading-relaxed mb-8 max-w-lg">
            {product.description}
          </p>

          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-[48px] font-bold text-[#291451] tracking-tight">₹{price.toLocaleString()}</span>
            <span className="text-[16px] font-medium text-[#291451]/50">Retail</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-auto pt-8 border-t border-[#E5D8F4]/50">
            <Link 
              href={`/dashboard/merchant/products/${product.id}/edit`}
              className="px-8 py-4 bg-[#6D28D9] text-white text-[15px] font-bold rounded-full hover:bg-[#7C3AED] transition-all shadow-[0_8px_20px_rgba(109,40,217,0.2)] hover:shadow-[0_12px_25px_rgba(109,40,217,0.3)] hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Edit3 size={18} />
              Edit Product
            </Link>
            
            {product.destinationUrl && (
              <a 
                href={product.destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-white text-[#291451] text-[15px] font-bold rounded-full border-2 border-[#E5D8F4] hover:border-[#6D28D9] transition-all flex items-center gap-2"
              >
                <ExternalLink size={18} />
                View Target Store
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        PRODUCT SPECIFICATIONS & COMMERCIAL DATA
        ==================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Specification Cards (Left column takes 2/3 space on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-[20px] font-bold text-[#291451] px-2 flex items-center gap-2">
            <Target size={20} className="text-[#6D28D9]" />
            Product Specifications
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#F5EEFF] rounded-[20px] p-5 flex flex-col items-center text-center justify-center border border-[#E5D8F4]">
              <Tag className="text-[#6D28D9] mb-3" size={24} />
              <span className="text-[12px] font-bold text-[#291451]/50 uppercase tracking-wider mb-1">Category</span>
              <span className="text-[15px] font-bold text-[#291451]">{product.categoryName || 'N/A'}</span>
            </div>
            
            <div className="bg-[#F5EEFF] rounded-[20px] p-5 flex flex-col items-center text-center justify-center border border-[#E5D8F4]">
              <Activity className="text-[#6D28D9] mb-3" size={24} />
              <span className="text-[12px] font-bold text-[#291451]/50 uppercase tracking-wider mb-1">Status</span>
              <span className="text-[15px] font-bold text-[#291451]">{product.status}</span>
            </div>

            <div className="bg-[#F5EEFF] rounded-[20px] p-5 flex flex-col items-center text-center justify-center border border-[#E5D8F4]">
              <Hash className="text-[#6D28D9] mb-3" size={24} />
              <span className="text-[12px] font-bold text-[#291451]/50 uppercase tracking-wider mb-1">Product ID</span>
              <span className="text-[15px] font-bold text-[#291451]">#{product.id}</span>
            </div>

            <div className="bg-[#F5EEFF] rounded-[20px] p-5 flex flex-col items-center text-center justify-center border border-[#E5D8F4]">
              <Calendar className="text-[#6D28D9] mb-3" size={24} />
              <span className="text-[12px] font-bold text-[#291451]/50 uppercase tracking-wider mb-1">Added</span>
              <span className="text-[15px] font-bold text-[#291451]">{createdAt}</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-8 border border-[#E5D8F4] shadow-sm mt-6">
            <h3 className="text-[16px] font-bold text-[#291451] mb-4 flex items-center gap-2">
              <Share2 size={18} className="text-[#6D28D9]" />
              Campaign Relationships
            </h3>
            <div className="bg-[#FBF9FF] p-6 rounded-[16px] border border-[#E5D8F4] text-center flex flex-col items-center justify-center">
              <TrendingUp size={32} className="text-[#6D28D9]/40 mb-3" />
              <p className="text-[#291451] font-semibold mb-1">Performance available through campaigns</p>
              <p className="text-[#291451]/50 text-[14px]">
                To view clicks, conversions, and affiliate performance, please check the Campaigns dashboard where this product is active.
              </p>
              <Link 
                href="/dashboard/merchant/campaigns"
                className="mt-4 px-5 py-2.5 bg-white text-[#6D28D9] font-bold rounded-full border border-[#E5D8F4] hover:bg-[#F5EEFF] transition-colors text-[14px]"
              >
                View Campaigns
              </Link>
            </div>
          </div>
        </div>

        {/* Commercial Information (Right column) */}
        <div className="space-y-6">
          <h2 className="text-[20px] font-bold text-[#291451] px-2 flex items-center gap-2">
            <DollarSign size={20} className="text-[#6D28D9]" />
            Commercial Info
          </h2>
          
          <div className="bg-white rounded-[24px] border border-[#E5D8F4] shadow-sm overflow-hidden flex flex-col h-full max-h-[360px]">
            <div className="p-6 border-b border-[#E5D8F4]/50">
              <p className="text-[13px] font-bold text-[#291451]/50 uppercase tracking-wider mb-1">Standard Commission</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[36px] font-bold text-[#6D28D9] leading-none">{commission}%</span>
                <span className="text-[14px] font-medium text-[#291451]/60">per sale</span>
              </div>
            </div>
            
            <div className="p-6 bg-[#FBF9FF] flex-1">
              <p className="text-[13px] font-bold text-[#291451]/50 uppercase tracking-wider mb-2">Estimated Affiliate Payout</p>
              <p className="text-[28px] font-bold text-emerald-600 mb-1">₹{potentialCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-[13px] font-medium text-[#291451]/60">
                Calculated dynamically based on retail price of ₹{price.toLocaleString()}.
              </p>
            </div>

            <div className="p-6 border-t border-[#E5D8F4]/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F5EEFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users size={14} className="text-[#6D28D9]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#291451] leading-tight mb-1">Affiliate Eligibility</p>
                  <p className="text-[12px] font-medium text-[#291451]/60 leading-relaxed">
                    Once added to a campaign, approved affiliates will automatically receive unique tracking links for this product.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
