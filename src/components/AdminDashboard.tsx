import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Category, User, Order } from '../types';
import {
  LayoutDashboard,
  Image as ImageIcon,
  FolderTree,
  Users,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  DollarSign,
  TrendingUp,
  Download,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    users,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleUserActive,
    updateOrderStatus,
    showToast,
    navigateTo,
    currentUser,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'products' | 'categories' | 'users' | 'orders'>('overview');

  // Product search & filter
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  // Product Add / Edit Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: 29.0,
    categoryId: categories[0]?.id || 1,
    previewImage: '',
    originalImage: '',
    imageFormat: 'JPEG' as 'JPEG' | 'PNG' | 'WebP',
    imageWidth: 6000,
    imageHeight: 4000,
    fileSize: '18.5 MB',
    isActive: true,
  });

  // Category Add / Edit Modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [catForm, setCatForm] = useState({
    categoryName: '',
    slug: '',
    description: '',
    coverImage: '',
  });

  // Order search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Compute statistics
  const totalDemoOrderValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalActiveProducts = products.filter((p) => p.isActive).length;
  const totalDownloadsCount = products.reduce((sum, p) => sum + (p.downloadsCount || 0), 0);

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    if (productCatFilter !== 'all' && p.categoryId !== Number(productCatFilter)) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return o.orderNumber.toLowerCase().includes(q) || o.userName.toLowerCase().includes(q);
    }
    return true;
  });

  // Handle open product modal
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      description: '',
      price: 35.0,
      categoryId: categories[0]?.id || 1,
      previewImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80',
      originalImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=3840&q=95',
      imageFormat: 'JPEG',
      imageWidth: 6000,
      imageHeight: 4000,
      fileSize: '19.2 MB',
      isActive: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      title: p.title,
      description: p.description,
      price: p.price,
      categoryId: p.categoryId,
      previewImage: p.previewImage,
      originalImage: p.originalImage,
      imageFormat: p.imageFormat as any,
      imageWidth: p.imageWidth,
      imageHeight: p.imageHeight,
      fileSize: p.fileSize,
      isActive: p.isActive,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    const cat = categories.find((c) => c.id === Number(productForm.categoryId));

    if (editingProductId) {
      updateProduct(editingProductId, {
        ...productForm,
        categoryName: cat?.categoryName || 'General',
        price: Number(productForm.price),
      });
    } else {
      addProduct({
        ...productForm,
        categoryName: cat?.categoryName || 'General',
        price: Number(productForm.price),
        authorName: currentUser.username,
      });
    }
    setIsProductModalOpen(false);
  };

  // Handle open category modal
  const handleOpenAddCategory = () => {
    setEditingCatId(null);
    setCatForm({
      categoryName: '',
      slug: '',
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    });
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatForm({
      categoryName: cat.categoryName,
      slug: cat.slug,
      description: cat.description,
      coverImage: cat.coverImage || '',
    });
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.categoryName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    const slug = catForm.categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (editingCatId) {
      updateCategory(editingCatId, {
        ...catForm,
        slug,
      });
    } else {
      addCategory({
        ...catForm,
        slug,
      });
    }
    setIsCatModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      
      {/* Admin Header */}
      <div className="border-b border-neutral-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
            <span className="text-emerald-400 font-semibold uppercase tracking-wider">
              Control Panel
            </span>
            <span aria-hidden="true">·</span>
            <span>Authenticated as {currentUser.username} (Admin)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            PixelMart & Ephoto Administration
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('explore')}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-lg text-xs font-medium transition-colors"
          >
            View Customer Marketplace
          </button>
          <button
            onClick={handleOpenAddProduct}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Upload New Asset
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-800 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Metrics Overview', icon: LayoutDashboard },
          { id: 'products', label: `Products (${products.length})`, icon: ImageIcon },
          { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
          { id: 'orders', label: `Demo Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'users', label: `Users (${users.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-neutral-800 text-emerald-400 border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Total Active Assets</span>
              <div className="text-2xl font-black text-white">{totalActiveProducts}</div>
              <span className="text-[11px] text-neutral-500 mt-1 block">
                {products.length - totalActiveProducts} inactive
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Taxonomy Categories</span>
              <div className="text-2xl font-black text-white">{categories.length}</div>
              <span className="text-[11px] text-neutral-500 mt-1 block">Active taxonomies</span>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Registered Users</span>
              <div className="text-2xl font-black text-white">{users.length}</div>
              <span className="text-[11px] text-emerald-400 mt-1 block">
                {users.filter((u) => u.isActive).length} active accounts
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Total Demo Orders</span>
              <div className="text-2xl font-black text-white">{orders.length}</div>
              <span className="text-[11px] text-neutral-500 mt-1 block">Simulated orders</span>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Demo Order Volume</span>
              <div className="text-2xl font-black text-emerald-400">
                ${totalDemoOrderValue.toFixed(2)}
              </div>
              <span className="text-[10px] text-amber-400/90 mt-1 block font-medium">
                Simulated · No real money
              </span>
            </div>
          </div>

          {/* Quick Tables: Recent Orders & Popular Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Orders */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  Recent Demo Orders
                </h3>
                <button
                  onClick={() => setActiveAdminTab('orders')}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  View all ({orders.length})
                </button>
              </div>

              <div className="divide-y divide-neutral-800 text-xs">
                {orders.slice(0, 4).map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-white font-medium">{o.orderNumber}</div>
                      <div className="text-neutral-500 text-[11px]">
                        By {o.userName} · {o.items.length} items
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">${o.totalAmount.toFixed(2)}</div>
                      <div className="text-emerald-400 text-[10px]">{o.orderStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Downloaded Images */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Most Popular Marketplace Assets
                </h3>
                <button
                  onClick={() => setActiveAdminTab('products')}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Manage Products
                </button>
              </div>

              <div className="divide-y divide-neutral-800 text-xs">
                {[...products]
                  .sort((a, b) => b.downloadsCount - a.downloadsCount)
                  .slice(0, 4)
                  .map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.previewImage}
                          alt={p.title}
                          className="w-10 h-8 rounded object-cover bg-neutral-950 border border-neutral-800"
                        />
                        <div className="max-w-[200px] truncate">
                          <div className="font-medium text-white truncate">{p.title}</div>
                          <div className="text-neutral-500 text-[11px]">{p.categoryName}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-emerald-400">
                          {p.downloadsCount} downloads
                        </div>
                        <div className="text-neutral-500 text-[10px]">${p.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. PRODUCTS MANAGEMENT TAB */}
      {activeAdminTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <select
                value={productCatFilter}
                onChange={(e) => setProductCatFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          </div>

          {/* Products Table */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Image / Asset</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Specs</th>
                  <th className="py-3 px-4">Downloads</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-900/60 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.previewImage}
                        alt={p.title}
                        className="w-12 h-9 rounded object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                      />
                      <div className="max-w-xs">
                        <div className="font-semibold text-white truncate">{p.title}</div>
                        <div className="text-[11px] text-neutral-500">By {p.authorName}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-300">{p.categoryName}</td>
                    <td className="py-3 px-4 font-bold text-white">${p.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-neutral-400">
                      {p.imageWidth}×{p.imageHeight} · {p.imageFormat}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">{p.downloadsCount}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleProductActive(p.id)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                          p.isActive
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 shrink-0">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CATEGORIES MANAGEMENT TAB */}
      {activeAdminTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-white">Taxonomy Categories</h3>
              <p className="text-xs text-neutral-400">
                Categories with active products are protected from deletion to maintain relational integrity.
              </p>
            </div>
            <button
              onClick={handleOpenAddCategory}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => {
              const activeCount = products.filter((p) => p.categoryId === c.id).length;
              return (
                <div
                  key={c.id}
                  className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{c.categoryName}</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {activeCount} products
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                    <button
                      onClick={() => handleOpenEditCategory(c)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${c.categoryName}"?`)) {
                          deleteCategory(c.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-rose-900/40 text-neutral-400 hover:text-rose-300 text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. ORDERS MANAGEMENT TAB */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by order # or customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Demo Statuses</option>
                <option value="COMPLETED_DEMO">COMPLETED_DEMO</option>
                <option value="PROCESSING_DEMO">PROCESSING_DEMO</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <span className="text-xs text-neutral-400">
              Showing {filteredOrders.length} orders
            </span>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Simulated Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-900/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">{o.orderNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{o.userName}</div>
                      <div className="text-[11px] text-neutral-500">{o.userEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-neutral-300">
                      {o.items.length} {o.items.length === 1 ? 'image' : 'images'}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">${o.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                        className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-[11px] text-white focus:outline-none cursor-pointer"
                      >
                        <option value="COMPLETED_DEMO">COMPLETED_DEMO</option>
                        <option value="PROCESSING_DEMO">PROCESSING_DEMO</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. USERS MANAGEMENT TAB */}
      {activeAdminTab === 'users' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Registered Users & Customers</h3>
              <p className="text-xs text-neutral-400">
                Manage customer accounts, roles, and active access status.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-900/60 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={u.profileImage}
                        alt={u.username}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                      />
                      <div>
                        <div className="font-semibold text-white">{u.username}</div>
                        <div className="text-[11px] text-neutral-500">{u.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          u.role === 'admin'
                            ? 'bg-purple-950 border border-purple-800 text-purple-300'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          u.isActive
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleUserActive(u.id)}
                        disabled={u.id === currentUser.id && currentUser.role === 'admin'}
                        className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingProductId ? 'Edit Product Asset' : 'Add New Digital Image Asset'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-400 mb-1">Image Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-400 mb-1">Category *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-400 mb-1">Price ($ USD) *</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-400 mb-1">Preview Image URL (Public)</label>
                <input
                  type="url"
                  required
                  value={productForm.previewImage}
                  onChange={(e) => setProductForm({ ...productForm, previewImage: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-400 mb-1">
                  Original Master High-Res URL (Protected Download)
                </label>
                <input
                  type="url"
                  required
                  value={productForm.originalImage}
                  onChange={(e) => setProductForm({ ...productForm, originalImage: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-neutral-400 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={productForm.imageWidth}
                    onChange={(e) => setProductForm({ ...productForm, imageWidth: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-400 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={productForm.imageHeight}
                    onChange={(e) => setProductForm({ ...productForm, imageHeight: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-400 mb-1">Format</label>
                  <select
                    value={productForm.imageFormat}
                    onChange={(e) => setProductForm({ ...productForm, imageFormat: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="JPEG">JPEG</option>
                    <option value="PNG">PNG</option>
                    <option value="WebP">WebP</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs"
                >
                  Save Product Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Add/Edit Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingCatId ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-400 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catForm.categoryName}
                  onChange={(e) => setCatForm({ ...catForm, categoryName: e.target.value })}
                  placeholder="e.g. Wildlife, Wallpapers, Architecture"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-400 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={catForm.coverImage}
                  onChange={(e) => setCatForm({ ...catForm, coverImage: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
