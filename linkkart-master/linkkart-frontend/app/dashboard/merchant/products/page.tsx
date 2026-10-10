'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  Package, Plus, Search, Filter, CheckCircle2, AlertCircle, 
  ArrowRight, MoreVertical, Edit3, Trash2, Power, PowerOff, Loader2 
} from 'lucide-react';

export default function MerchantProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.products.merchantList();
      setProducts(Array.isArray(res) ? res : (res?.data || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await api.products.toggleStatus(id, newStatus);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.products.delete(id);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p => {
    if (statusFilter !== 'all' && (p.status || 'ACTIVE') !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8 min-h-screen pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#E5D8F4]">
        <div>
          <h1 className="text-[32px] font-bold tracking-tight text-[#291451]">Products</h1>
          <p className="text-[#6D28D9]/70 mt-1 text-[15px] font-medium">
            Manage your product catalog and affiliate offerings.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/merchant/products/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6D28D9] hover:bg-[#7C3AED] text-white font-bold rounded-full transition-all shadow-[0_8px_20px_rgba(109,40,217,0.15)] hover:shadow-[0_12px_25px_rgba(109,40,217,0.25)] hover:-translate-y-0.5"
          >
            <Plus size={18} strokeWidth={2.5} />
            Create Product
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-2 pl-4 flex flex-col sm:flex-row items-center justify-between border border-[#E5D8F4] shadow-[0_4px_15px_rgba(41,20,81,0.02)] gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <Search size={18} className="text-[#291451]/40" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-[300px] bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] font-medium text-[#291451] placeholder:text-[#291451]/40 py-2"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-[#E5D8F4] pt-3 sm:pt-0 sm:pl-3">
          <Filter size={16} className="text-[#291451]/40" />
          <select 
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-[14px] font-semibold text-[#291451] py-2 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-[24px] h-[380px] border border-[#E5D8F4] animate-pulse p-6 flex flex-col">
              <div className="w-full h-[180px] bg-[#F5EEFF] rounded-[16px] mb-4" />
              <div className="h-6 bg-[#F5EEFF] rounded-md w-3/4 mb-2" />
              <div className="h-4 bg-[#F5EEFF] rounded-md w-1/2 mb-auto" />
              <div className="h-10 bg-[#F5EEFF] rounded-xl w-full mt-4" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[24px] border border-[#E5D8F4] shadow-[0_4px_20px_rgba(41,20,81,0.02)]">
          <div className="w-20 h-20 bg-[#F5EEFF] rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-[#6D28D9]" />
          </div>
          <h2 className="text-xl font-bold text-[#291451] mb-2">No products found</h2>
          <p className="text-[15px] text-[#291451]/60 max-w-md mx-auto mb-8 font-medium">
            Create your first product to start building campaigns and partnerships.
          </p>
          <Link
            href="/dashboard/merchant/products/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5EEFF] text-[#6D28D9] font-bold rounded-full hover:bg-[#E5D8F4] transition-colors"
          >
            <Plus size={18} />
            Create Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const isActive = (p.status || 'ACTIVE') === 'ACTIVE';
            return (
              <div 
                key={p.id} 
                className="bg-white rounded-[24px] overflow-hidden border border-[#E5D8F4] shadow-[0_4px_15px_rgba(41,20,81,0.02)] hover:shadow-[0_12px_35px_rgba(109,40,217,0.06)] hover:-translate-y-1 hover:border-[#6D28D9]/20 transition-all duration-300 group flex flex-col relative"
              >
                {/* Actions Dropdown / Quick Actions - Hidden by default, shown on hover */}
                <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.preventDefault(); handleToggleStatus(p.id, p.status); }}
                    className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all ${isActive ? 'bg-white/80 text-amber-600 hover:bg-white' : 'bg-white/80 text-emerald-600 hover:bg-white'}`}
                    title={isActive ? 'Deactivate' : 'Activate'}
                  >
                    {isActive ? <PowerOff size={16} /> : <Power size={16} />}
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); handleDelete(p.id); }}
                    className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm text-red-500 hover:bg-white transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Product Image */}
                <Link href={`/dashboard/merchant/products/${p.id}`} className="block relative bg-[#FBF9FF] aspect-[4/3] flex items-center justify-center p-6 border-b border-[#E5D8F4]/50 overflow-hidden">
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl} 
                      alt={p.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#291451]/20">
                      <Package size={48} strokeWidth={1} />
                      <span className="text-[13px] font-semibold mt-2">Product image unavailable</span>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 text-[12px] font-bold rounded-full shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-500 text-[12px] font-bold rounded-full shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Inactive
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold tracking-wider text-[#6D28D9] uppercase">
                        {p.categoryName || 'General'}
                      </span>
                    </div>
                    <Link href={`/dashboard/merchant/products/${p.id}`}>
                      <h3 className="text-lg font-bold text-[#291451] leading-tight line-clamp-1 group-hover:text-[#6D28D9] transition-colors">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-[14px] text-[#291451]/60 font-medium mt-2 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  {/* Pricing & Metrics */}
                  <div className="mt-auto grid grid-cols-2 gap-4 pb-6 border-b border-[#E5D8F4]/50">
                    <div>
                      <p className="text-[12px] font-semibold text-[#291451]/50 mb-1">Retail Price</p>
                      <p className="text-xl font-bold text-[#291451]">₹{(Number(p.price) || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#291451]/50 mb-1">Commission</p>
                      <p className="text-lg font-bold text-[#6D28D9]">
                        {Number(p.commissionRate || 0)}%
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 flex items-center justify-between">
                    <Link 
                      href={`/dashboard/merchant/products/${p.id}`}
                      className="text-[14px] font-bold text-[#291451] hover:text-[#6D28D9] inline-flex items-center gap-2 transition-colors"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href={`/dashboard/merchant/products/${p.id}/edit`}
                      className="p-2 text-[#291451]/40 hover:text-[#6D28D9] hover:bg-[#F5EEFF] rounded-full transition-colors"
                    >
                      <Edit3 size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
