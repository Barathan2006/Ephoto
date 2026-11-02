import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Sparkles, Shield, ArrowRight, DownloadCloud, Image as ImageIcon } from 'lucide-react';

export const Hero: React.FC = () => {
  const { searchQuery, setSearchQuery, setSelectedCategoryFilter, navigateTo, categories } = useApp();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    setSelectedCategoryFilter('all');
    navigateTo('explore');
  };

  return (
    <section className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800/80 pt-12 pb-16 lg:pt-16 lg:pb-20">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Anti-slop clean kicker */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
          <span className="font-medium text-emerald-400">PixelMart & Ephoto Marketplace</span>
          <span aria-hidden="true">·</span>
          <span>Digital Image Selling Platform</span>
          <span aria-hidden="true">·</span>
          <span>Simulation & Demo Commerce</span>
        </div>

        {/* Heading */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Curated High-Resolution Photography & Digital Art
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl">
            Browse premium imagery, generate or upload your own creations to sell, place instant demo orders without credit cards, and download authentic high-res master files.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl">
          <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all shadow-xl">
            <Search className="w-5 h-5 text-neutral-500 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search mountains, architecture, cyberpunk, abstract fluid..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-xs tracking-wide uppercase transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Category Buttons */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500">Popular:</span>
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategoryFilter(cat.categoryName);
                navigateTo('explore');
              }}
              className="text-neutral-400 hover:text-white hover:underline transition-colors"
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Action CTAs & Highlights */}
        <div className="mt-10 pt-8 border-t border-neutral-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigateTo('create-image')}
            className="flex items-start gap-3 p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-emerald-500/30 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:border-amber-400 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-emerald-300 flex items-center gap-1">
                Create & Sell Image
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Generate high-res procedural art or upload your file to list for demo sale.
              </div>
            </div>
          </button>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40 text-left">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                Zero-Payment Demo Checkout
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Simulated orders with instant confirmation. No credit card or gateways.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40 text-left">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <DownloadCloud className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                Authentic High-Res Downloads
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Download verified full-resolution master files directly to your device.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
