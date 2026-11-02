import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

export const ProductListing: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    navigateTo,
    currentUser,
  } = useApp();

  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // In customer view, only show active products
      if (currentUser.role !== 'admin' && !product.isActive) {
        return false;
      }

      // Category filter
      if (
        selectedCategoryFilter !== 'all' &&
        product.categoryName.toLowerCase() !== selectedCategoryFilter.toLowerCase()
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = product.categoryName.toLowerCase().includes(q);
        const matchesAuthor = product.authorName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesAuthor) {
          return false;
        }
      }

      // Price filter
      if (minPrice !== '' && product.price < Number(minPrice)) {
        return false;
      }
      if (maxPrice !== '' && product.price > Number(maxPrice)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedCategoryFilter, searchQuery, minPrice, maxPrice, sortBy, currentUser.role]);

  const resetFilters = () => {
    setSelectedCategoryFilter('all');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  const hasActiveFilters =
    selectedCategoryFilter !== 'all' ||
    searchQuery.trim() !== '' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortBy !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Marketplace Catalog
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Displaying {filteredProducts.length} high-resolution image assets
            {selectedCategoryFilter !== 'all' && ` in "${selectedCategoryFilter}"`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-neutral-800 text-white border-neutral-700'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filters & Price</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          {/* Sort Selector */}
          <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 mr-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer py-1"
            >
              <option value="newest" className="bg-neutral-900 text-white">Sort: Newest</option>
              <option value="price-asc" className="bg-neutral-900 text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-neutral-900 text-white">Price: High to Low</option>
            </select>
          </div>

          {/* Create Image Shortcut */}
          <button
            onClick={() => navigateTo('create-image')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-xs rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sell Own Image</span>
          </button>
        </div>
      </div>

      {/* Expandable Filter Box */}
      {showFilters && (
        <div className="mt-4 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Search by Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Title, description, photographer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Price Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="Min ($)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50"
              />
              <span className="text-neutral-500 text-xs">to</span>
              <input
                type="number"
                min="0"
                placeholder="Max ($)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="flex items-end justify-between sm:justify-end gap-2">
            <button
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="px-3 py-2 text-xs text-neutral-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Interactive Category Segmented Bar */}
      <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategoryFilter === 'all'
              ? 'bg-emerald-500 text-neutral-950 font-semibold'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          All Categories ({products.filter((p) => currentUser.role === 'admin' || p.isActive).length})
        </button>

        {categories.map((cat) => {
          const count = products.filter(
            (p) => p.categoryId === cat.id && (currentUser.role === 'admin' || p.isActive)
          ).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.categoryName)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategoryFilter.toLowerCase() === cat.categoryName.toLowerCase()
                  ? 'bg-emerald-500 text-neutral-950 font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat.categoryName} ({count})
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-16 text-center py-16 px-4 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/30 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No images found</h3>
          <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
            We couldn’t find any image matching your current search or price filters. Try adjusting your keywords.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={() => navigateTo('create-image')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sell Your Own Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
