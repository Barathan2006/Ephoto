import React from 'react';
import { useApp } from '../context/AppContext';
import { Layers, ArrowRight, Image as ImageIcon } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, products, setSelectedCategoryFilter, navigateTo, currentUser } = useApp();

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    navigateTo('explore');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-emerald-400 font-medium">Image Taxonomy</span>
          <span aria-hidden="true">·</span>
          <span>{categories.length} Curated Collections</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Browse by Category
        </h1>
        <p className="mt-2 text-sm text-neutral-400 max-w-2xl">
          Explore digital master photography and art assets organized by thematic classifications.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const count = products.filter(
            (p) => p.categoryId === cat.id && (currentUser.role === 'admin' || p.isActive)
          ).length;

          return (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.categoryName)}
              className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between aspect-[4/3]"
            >
              {/* Category Cover Image with Dark Gradient */}
              {cat.coverImage ? (
                <img
                  src={cat.coverImage}
                  alt={cat.categoryName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center text-neutral-800">
                  <ImageIcon className="w-16 h-16" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

              {/* Top counter */}
              <div className="relative z-10 p-4 flex justify-end">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-neutral-950/80 border border-neutral-800 text-neutral-300">
                  {count} {count === 1 ? 'image' : 'images'}
                </span>
              </div>

              {/* Bottom Info */}
              <div className="relative z-10 p-4">
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                  <span>{cat.categoryName}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
