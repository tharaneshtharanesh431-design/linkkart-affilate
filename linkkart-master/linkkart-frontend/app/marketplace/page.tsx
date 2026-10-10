'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Search, Star, Link2, SlidersHorizontal, ChevronDown, BadgeCheck, Filter, Loader2, Package } from 'lucide-react';
import { categories, sortOptions } from './data';
import { api } from '@/lib/api';

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [showSort, setShowSort] = useState(false);
  const [minCommission, setMinCommission] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError('');
        
        // Pass parameters to the backend for filtering
        const res = await api.products.list({
          search: search || undefined,
          category: activeCategory !== 'all' ? activeCategory : undefined,
          minCommission: minCommission > 0 ? minCommission : undefined,
          sort: sort !== 'default' ? sort : undefined
        });
        
        const items = Array.isArray(res) ? res : (res?.data || []);
        setProducts(items);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products from backend');
      } finally {
        setLoading(false);
      }
    }
    
    // Debounce search slightly
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, activeCategory, minCommission, sort]);

  const filtered = products; // Frontend no longer filters, backend does it
  const sortLabel = sortOptions.find(o => o.value === sort)?.label || 'Most Popular';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Product Marketplace</h1>
              <p className="text-gray-500">Browse verified affiliate products, generate your tracking link, and start earning commissions.</p>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                <div className="text-xs text-gray-400">Live Products</div>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">40%</div>
                <div className="text-xs text-gray-400">Max Commission</div>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">Instant</div>
                <div className="text-xs text-gray-400">Link Generation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands, or categories..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors min-w-44"
              >
                <SlidersHorizontal size={14} className="text-gray-400" />
                {sortLabel}
                <ChevronDown size={13} className={`text-gray-400 ml-auto transition-transform ${showSort ? 'rotate-180' : ''}`} />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1">
                  {sortOptions.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sort === o.value ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600">
              <Filter size={13} className="text-gray-400 flex-shrink-0" />
              <span className="hidden sm:block whitespace-nowrap">Min {minCommission}%</span>
              <input
                type="range"
                min={0}
                max={30}
                step={5}
                value={minCommission}
                onChange={(e) => setMinCommission(Number(e.target.value))}
                className="w-16 accent-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-52 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Categories</p>
              <nav className="space-y-0.5">
                {categories.map((cat) => {
                  const count = cat.id === 'all'
                    ? products.length
                    : products.filter((p) => {
                        const pCat = (p.categoryName || '').toLowerCase();
                        return pCat === cat.id.toLowerCase() || pCat === cat.label.toLowerCase() || pCat.includes(cat.id.toLowerCase());
                      }).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                        activeCategory === cat.id
                          ? 'bg-gray-900 text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <cat.icon size={14} className={activeCategory === cat.id ? 'text-white' : 'text-gray-400'} />
                      <span>{cat.label}</span>
                      <span className={`ml-auto text-xs ${activeCategory === cat.id ? 'text-gray-300' : 'text-gray-400'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-5 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                <p className="text-xs font-semibold text-gray-700 mb-0.5">Top Commission</p>
                <p className="text-2xl font-bold text-emerald-600">Up to 40%</p>
                <p className="text-xs text-gray-400 mt-1">Software & Online Courses</p>
              </div>
            </div>
          </aside>

          {/* Mobile category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 lg:hidden w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors flex-shrink-0 ${
                  activeCategory === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <cat.icon size={12} />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-800">{filtered.length}</span> verified products
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                <p className="text-sm text-gray-400">Loading products from database...</p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 text-sm">
                {error}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-gray-50/50 rounded-3xl border border-gray-100">
                <Search size={28} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-600">No products found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search query or filters.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product) => {
                  const price = Number(product.price) || 0;
                  const comm = Number(product.commissionRate) || 0;
                  const earnings = Number(product.potentialCommission) || ((price * comm) / 100);

                  return (
                    <div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-md transition-all group flex flex-col justify-between">
                      <div>
                        <div className="relative h-48 overflow-hidden bg-gray-50 flex items-center justify-center">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=500';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                              <Package size={36} />
                              <span className="text-xs mt-1">No Image</span>
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm">
                            <BadgeCheck size={14} className="text-blue-500" />
                          </div>
                          {product.categoryName && (
                            <span className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-lg">
                              {product.categoryName}
                            </span>
                          )}
                        </div>

                        <div className="p-5">
                          <p className="text-xs text-gray-400 mb-1">{product.merchantName || 'Linkkart Merchant'}</p>
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-4 line-clamp-2 h-10" title={product.name}>
                            {product.name}
                          </h3>

                          <div className="flex items-end justify-between mb-2 pt-3 border-t border-gray-50">
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Commission</p>
                              <p className="text-base font-bold text-gray-900">{comm ? `${comm}%` : 'N/A'}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400 mb-0.5">Price</p>
                              <p className="text-sm text-gray-600">₹{price.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400 mb-0.5">You earn</p>
                              <p className="text-base font-bold text-emerald-600">
                                ₹{earnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-0">
                        <Link
                          href={`/marketplace/${product.id}`}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                        >
                          <Link2 size={12} />
                          View & Promote Link
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
