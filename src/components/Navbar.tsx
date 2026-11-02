import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ShieldCheck, UserCheck, Camera, Sparkles, Menu, X, Clock, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    cartCount,
    activeTab,
    navigateTo,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: string) => {
    navigateTo(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => handleNav('explore')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Ephoto
                <span className="text-neutral-500 text-xs font-normal">Marketplace</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button
              onClick={() => handleNav('explore')}
              className={`transition-colors ${
                activeTab === 'explore' || activeTab === 'details'
                  ? 'text-emerald-400 font-medium'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => handleNav('categories')}
              className={`flex items-center gap-1.5 transition-colors ${
                activeTab === 'categories' ? 'text-emerald-400 font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Categories
            </button>
            <button
              onClick={() => handleNav('create-image')}
              className={`flex items-center gap-1.5 transition-colors ${
                activeTab === 'create-image' ? 'text-emerald-400 font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Create & Sell Image</span>
            </button>
            <button
              onClick={() => handleNav('history')}
              className={`flex items-center gap-1.5 transition-colors ${
                activeTab === 'history' ? 'text-emerald-400 font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              My Orders & Downloads
            </button>
          </nav>
        </div>

        {/* Right Section: Role Switcher, Cart & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick Role Switcher (Customer <-> Admin) */}
          <div className="hidden sm:flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => switchUserRole('customer')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                currentUser.role === 'customer'
                  ? 'bg-neutral-800 text-white font-medium shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Browse, cart, demo checkout, and image downloads"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
            <button
              onClick={() => {
                switchUserRole('admin');
                navigateTo('admin');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                currentUser.role === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Admin dashboard: Upload, edit, manage products, categories, users, orders"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Panel</span>
            </button>
          </div>

          {/* Cart Icon */}
          <button
            onClick={() => handleNav('cart')}
            className="relative p-2 text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-neutral-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Trigger */}
          <button
            onClick={() => handleNav('profile')}
            className={`flex items-center gap-2 p-1.5 rounded-lg border transition-colors ${
              activeTab === 'profile'
                ? 'border-emerald-500/50 bg-neutral-900'
                : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/50'
            }`}
            title="My Profile"
          >
            <img
              src={currentUser.profileImage}
              alt={currentUser.username}
              className="w-6 h-6 rounded-full object-cover border border-neutral-700"
            />
            <span className="hidden lg:inline text-xs font-medium text-neutral-300 max-w-[100px] truncate">
              {currentUser.username}
            </span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950 px-4 pt-3 pb-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-xs text-neutral-400">Current Role</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  switchUserRole('customer');
                  setMobileMenuOpen(false);
                }}
                className={`text-xs px-2.5 py-1 rounded ${
                  currentUser.role === 'customer' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  switchUserRole('admin');
                  navigateTo('admin');
                  setMobileMenuOpen(false);
                }}
                className={`text-xs px-2.5 py-1 rounded ${
                  currentUser.role === 'admin' ? 'bg-emerald-900/60 text-emerald-300' : 'text-neutral-400'
                }`}
              >
                Admin Panel
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <button
              onClick={() => handleNav('explore')}
              className={`text-left py-1.5 ${activeTab === 'explore' ? 'text-emerald-400 font-medium' : 'text-neutral-300'}`}
            >
              Explore Images
            </button>
            <button
              onClick={() => handleNav('categories')}
              className={`text-left py-1.5 ${activeTab === 'categories' ? 'text-emerald-400 font-medium' : 'text-neutral-300'}`}
            >
              Browse Categories
            </button>
            <button
              onClick={() => handleNav('create-image')}
              className={`text-left py-1.5 ${activeTab === 'create-image' ? 'text-emerald-400 font-medium' : 'text-neutral-300'}`}
            >
              Create & Sell Your Own Image
            </button>
            <button
              onClick={() => handleNav('history')}
              className={`text-left py-1.5 ${activeTab === 'history' ? 'text-emerald-400 font-medium' : 'text-neutral-300'}`}
            >
              My Orders & Downloads
            </button>
            <button
              onClick={() => handleNav('profile')}
              className={`text-left py-1.5 ${activeTab === 'profile' ? 'text-emerald-400 font-medium' : 'text-neutral-300'}`}
            >
              User Profile
            </button>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                className={`text-left py-1.5 font-medium ${activeTab === 'admin' ? 'text-emerald-400' : 'text-emerald-300'}`}
              >
                Administrator Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
