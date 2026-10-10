'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Edit3, Trash2, Power, CheckCircle, AlertCircle,
  Package, ExternalLink, Loader2, X, RefreshCw, Layers, DollarSign, Percent, Globe
} from 'lucide-react';
import { api } from '@/lib/api';

interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: number;
  commissionRate: number;
  potentialCommission?: number;
  imageUrl?: string;
  destinationUrl?: string;
  status: string;
  categoryId: number;
  categoryName?: string;
  merchantId?: number;
  merchantName?: string;
  createdAt: string;
  updatedAt?: string;
}

interface CategoryItem {
  id: number;
  name: string;
  description?: string;
}

export default function MerchantProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    commissionRate: '10',
    categoryId: '',
    imageUrl: '',
    destinationUrl: '',
    status: 'ACTIVE',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Delete / Deactivate Confirmation Modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load products and categories
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prodRes, catRes] = await Promise.all([
        api.products.merchantList(),
        api.categories.list(),
      ]);

      const prodList = Array.isArray(prodRes) ? prodRes : (prodRes?.data || []);
      const catList = Array.isArray(catRes) ? catRes : (catRes?.data || []);

      setProducts(prodList);
      setCategories(catList);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load merchant products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && String(p.categoryId) !== categoryFilter && (p.categoryName || '').toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter !== 'all' && (p.status || 'ACTIVE').toUpperCase() !== statusFilter.toUpperCase()) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const nameMatch = (p.name || '').toLowerCase().includes(q);
      const descMatch = (p.description || '').toLowerCase().includes(q);
      const catMatch = (p.categoryName || '').toLowerCase().includes(q);
      if (!nameMatch && !descMatch && !catMatch) return false;
    }
    return true;
  });

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => (p.status || 'ACTIVE').toUpperCase() === 'ACTIVE').length;
  const inactiveProducts = totalProducts - activeProducts;
  const avgCommission = totalProducts > 0
    ? (products.reduce((acc, p) => acc + (Number(p.commissionRate) || 0), 0) / totalProducts).toFixed(1)
    : '0';

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedProductId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      commissionRate: '10',
      categoryId: categories.length > 0 ? String(categories[0].id) : '',
      imageUrl: '',
      destinationUrl: '',
      status: 'ACTIVE',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product: ProductItem) => {
    setModalMode('edit');
    setSelectedProductId(product.id);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price || ''),
      commissionRate: String(product.commissionRate || 10),
      categoryId: product.categoryId ? String(product.categoryId) : (categories.length > 0 ? String(categories[0].id) : ''),
      imageUrl: product.imageUrl || '',
      destinationUrl: product.destinationUrl || '',
      status: product.status || 'ACTIVE',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.trim().length > 255) {
      errors.name = 'Product name cannot exceed 255 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length > 2000) {
      errors.description = 'Description cannot exceed 2000 characters';
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    const commNum = parseFloat(formData.commissionRate);
    if (isNaN(commNum) || commNum < 0 || commNum > 100) {
      errors.commissionRate = 'Commission must be between 0% and 100%';
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Please select a valid category';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Create / Update Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSuccessMessage(null);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      commissionRate: parseFloat(formData.commissionRate),
      categoryId: parseInt(formData.categoryId, 10),
      imageUrl: formData.imageUrl.trim() || undefined,
      destinationUrl: formData.destinationUrl.trim() || undefined,
      status: formData.status,
    };

    try {
      if (modalMode === 'create') {
        await api.products.create(payload);
        setSuccessMessage('Product created successfully and is now active in the catalog.');
      } else if (selectedProductId) {
        await api.products.update(selectedProductId, payload);
        setSuccessMessage('Product updated successfully.');
      }
      setIsModalOpen(false);
      await fetchData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setFormErrors({ submit: err.message || 'Operation failed. Please verify the input.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (product: ProductItem) => {
    const nextStatus = (product.status || 'ACTIVE').toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.products.toggleStatus(product.id, nextStatus);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
      );
      setSuccessMessage(`Product marked as ${nextStatus}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Open Delete Confirm
  const handleOpenDelete = (product: ProductItem) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  // Execute Safe Delete
  const handleExecuteDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await api.products.delete(productToDelete.id);
      setSuccessMessage('Product safely removed or deactivated.');
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
      await fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  // Calculated Potential Commission
  const parsedPrice = parseFloat(formData.price) || 0;
  const parsedComm = parseFloat(formData.commissionRate) || 0;
  const calculatedCommission = (parsedPrice * parsedComm) / 100;

  return (
    <div className="space-y-6">
      {/* Top Banner / Notification */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-medium animate-fadeIn">
          <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Product Summary Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Products</span>
            <Package size={16} className="text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
          <p className="text-xs text-gray-400 mt-1">Listed under your merchant account</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Marketplace</span>
            <Power size={16} />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{activeProducts}</div>
          <p className="text-xs text-gray-400 mt-1">Live for affiliates to promote</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Inactive / Paused</span>
            <X size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-700">{inactiveProducts}</div>
          <p className="text-xs text-gray-400 mt-1">Hidden from new promotion</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg. Commission</span>
            <Percent size={16} />
          </div>
          <div className="text-2xl font-bold text-blue-600">{avgCommission}%</div>
          <p className="text-xs text-gray-400 mt-1">Across all product offerings</p>
        </div>
      </div>

      {/* Management Toolbar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Merchant Product Catalog</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Add and manage your affiliate products. Changes reflect instantly in the marketplace.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
              title="Refresh Products"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title or description..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Active (Marketplace Visible)</option>
              <option value="INACTIVE">Inactive (Hidden)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table / Cards */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
            <p className="text-sm text-gray-400">Loading merchant products from MySQL...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 px-4">
            <Package size={44} className="mx-auto mb-3 text-gray-300" />
            <h3 className="text-base font-semibold text-gray-800">No products found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto mb-6">
              {products.length === 0
                ? 'You have not added any merchant products yet. Click "Add Product" above to publish your first offering.'
                : 'No products match your active search or filters. Try clearing your filters.'}
            </p>
            {products.length === 0 && (
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
              >
                <Plus size={14} /> Add Product Now
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-3 font-semibold">Category</th>
                  <th className="py-3.5 px-3 text-right font-semibold">Retail Price</th>
                  <th className="py-3.5 px-3 text-right font-semibold">Commission</th>
                  <th className="py-3.5 px-3 text-right font-semibold">Affiliate Earns</th>
                  <th className="py-3.5 px-3 text-center font-semibold">Status</th>
                  <th className="py-3.5 px-3 font-semibold hidden md:table-cell">Created</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const price = Number(p.price) || 0;
                  const comm = Number(p.commissionRate) || 0;
                  const potentialEarnings = (price * comm) / 100;
                  const isActive = (p.status || 'ACTIVE').toUpperCase() === 'ACTIVE';
                  const dateStr = p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                    : '—';

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300';
                                }}
                              />
                            ) : (
                              <Package size={18} className="text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-[240px]">
                            <p className="font-semibold text-gray-900 truncate text-xs sm:text-sm" title={p.name}>
                              {p.name}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5" title={p.description}>
                              {p.description}
                            </p>
                            {p.destinationUrl && (
                              <a
                                href={p.destinationUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline mt-0.5"
                              >
                                <Globe size={9} /> Destination Store
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                          {p.categoryName || 'General'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right font-semibold text-gray-900">
                        ₹{price.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-3 text-right font-bold text-gray-800">
                        {comm}%
                      </td>

                      <td className="py-3.5 px-3 text-right font-bold text-emerald-600">
                        ₹{potentialEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-xs text-gray-400 hidden md:table-cell">
                        {dateStr}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(p)}
                            className={`p-1.5 rounded-lg text-xs transition-colors ${isActive
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                            title={isActive ? 'Deactivate from marketplace' : 'Activate in marketplace'}
                          >
                            <Power size={15} />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            onClick={() => handleOpenDelete(p)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete or safely deactivate"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-gray-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Add New Merchant Product' : 'Edit Product Details'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter real product specifications and commission rate. The backend validates and calculates exact payouts.
              </p>
            </div>

            {formErrors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{formErrors.submit}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  className={`w-full px-3.5 py-2.5 bg-gray-50 border ${formErrors.name ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                    } rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300`}
                />
                {formErrors.name && <p className="text-[11px] text-red-500 mt-1">{formErrors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide comprehensive details, key specifications, and selling points..."
                  className={`w-full px-3.5 py-2.5 bg-gray-50 border ${formErrors.description ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                    } rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300`}
                />
                {formErrors.description && <p className="text-[11px] text-red-500 mt-1">{formErrors.description}</p>}
              </div>

              {/* Price, Commission, Category 3-col */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price (₹ INR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="29990"
                      className={`w-full pl-7 pr-3 py-2.5 bg-gray-50 border ${formErrors.price ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                        } rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300`}
                    />
                  </div>
                  {formErrors.price && <p className="text-[11px] text-red-500 mt-1">{formErrors.price}</p>}
                </div>

                {/* Commission % */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Commission (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                      placeholder="8"
                      className={`w-full px-3 py-2.5 bg-gray-50 border ${formErrors.commissionRate ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                        } rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">%</span>
                  </div>
                  {formErrors.commissionRate && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.commissionRate}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className={`w-full px-3 py-2.5 bg-gray-50 border ${formErrors.categoryId ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      } rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.categoryId && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.categoryId}</p>
                  )}
                </div>
              </div>

              {/* Commission Live Calculation Preview */}
              {parsedPrice > 0 && parsedComm >= 0 && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-medium">
                    Affiliate Payout Preview: <strong>₹{parsedPrice.toLocaleString('en-IN')}</strong> @{' '}
                    <strong>{parsedComm}%</strong>
                  </span>
                  <span className="text-emerald-700 font-bold text-sm">
                    ₹{calculatedCommission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / sale
                  </span>
                </div>
              )}

              {/* Image URL & Destination URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Product Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/product.jpg"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Destination / Target Store URL
                  </label>
                  <input
                    type="url"
                    value={formData.destinationUrl}
                    onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                    placeholder="https://yourstore.com/item"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {formData.imageUrl && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300';
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    <p className="font-semibold text-gray-700">Image Preview</p>
                    <p className="text-[11px] text-gray-400">Fallback icon used if URL is unreachable.</p>
                  </div>
                </div>
              )}

              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Availability Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option value="ACTIVE">ACTIVE (Published to Affiliate Marketplace)</option>
                  <option value="INACTIVE">INACTIVE (Hidden / Paused)</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs rounded-xl transition-colors disabled:opacity-60 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      {modalMode === 'create' ? 'Creating Product...' : 'Saving Changes...'}
                    </>
                  ) : modalMode === 'create' ? (
                    'Add Product to Marketplace'
                  ) : (
                    'Update Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Safe Deactivation Confirmation Modal */}
      {deleteConfirmOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-gray-100 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete or Deactivate Product</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Are you sure you want to remove <strong>"{productToDelete.name}"</strong>?
            </p>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 leading-relaxed mb-6">
              <strong>Data Protection Rule:</strong> If this product already has active affiliate promotion links, clicks, or conversions, it will be safely <strong>deactivated (INACTIVE)</strong> instead of hard-deleted to keep historical performance reports and commission payout data intact.
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deleting}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors disabled:opacity-60 shadow-sm"
              >
                {deleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Safe Removal'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
