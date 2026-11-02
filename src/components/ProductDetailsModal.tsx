import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Check,
  Maximize2,
  FileText,
  User,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProductDetailsView: React.FC = () => {
  const {
    products,
    selectedProductId,
    navigateTo,
    addToCart,
    cart,
  } = useApp();

  const [watermarkEnabled, setWatermarkEnabled] = useState(true);

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const isInCart = cart.some((item) => item.productId === product?.id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-neutral-400">Image not found.</p>
        <button
          onClick={() => navigateTo('explore')}
          className="mt-4 px-4 py-2 bg-neutral-800 text-white rounded-lg text-xs"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.isActive)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNowDemo = () => {
    addToCart(product);
    navigateTo('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      
      {/* Back navigation */}
      <button
        onClick={() => navigateTo('explore')}
        className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Image Preview with Watermark Toggle */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl aspect-[4/3] flex items-center justify-center">
            <img
              src={product.previewImage}
              alt={product.title}
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Protective Watermark Overlay (Standard Stock Photography Protection) */}
            {watermarkEnabled && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <div className="text-white/20 font-black tracking-widest text-3xl sm:text-5xl uppercase rotate-[-25deg] text-center border-2 border-white/10 px-8 py-4 rounded-xl backdrop-blur-[1px]">
                  Ephoto · Preview
                </div>
              </div>
            )}

            {/* Bottom Controls on Preview */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-neutral-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-neutral-800/80">
              <span className="text-neutral-400 flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Protected Preview · Original 4K Master delivered after demo order
              </span>
              <button
                onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                className="text-neutral-400 hover:text-white text-[11px] underline"
              >
                {watermarkEnabled ? 'Hide Watermark' : 'Show Watermark'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
            <span>Orientation: {product.orientation || 'Landscape'}</span>
            <span>License: Full Commercial & Editorial (Demo)</span>
          </div>
        </div>

        {/* Right Column: Metadata Specs, Price, Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Zero-Pill Meta Kicker */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
              <span className="text-emerald-400 font-medium">{product.categoryName}</span>
              <span aria-hidden="true">·</span>
              <span>Asset ID #{product.id}</span>
              <span aria-hidden="true">·</span>
              <span>{product.downloadsCount} Demo Downloads</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              {product.title}
            </h1>

            {/* Price Box */}
            <div className="mt-4 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-neutral-400 ml-2">USD (Simulated Demo)</span>
              </div>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                No Real Payment Required
              </span>
            </div>

            {/* Description */}
            <div className="mt-5">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Description
              </h3>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications Table */}
            <div className="mt-6 border-t border-b border-neutral-800 py-4 space-y-2.5 text-xs">
              <h3 className="font-semibold text-neutral-300 mb-2">
                Master Technical Specifications
              </h3>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Native Resolution</span>
                <span className="text-white font-medium">
                  {product.imageWidth} × {product.imageHeight} px
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>File Format</span>
                <span className="text-white font-medium">{product.imageFormat}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Uncompressed File Size</span>
                <span className="text-white font-medium">{product.fileSize}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Photographer / Creator</span>
                <span className="text-white font-medium">{product.authorName}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Date Added</span>
                <span className="text-white font-medium">
                  {new Date(product.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Callout Notice */}
            <div className="mt-4 p-3 rounded-lg bg-neutral-900/50 border border-neutral-800/80 text-[11px] text-neutral-400 leading-normal">
              🔒 <strong className="text-neutral-300">Safe Digital Delivery:</strong> The original raw full-resolution asset file ({product.fileSize}) is held in protected storage. Placing a demo order grants you an authorized, direct instant download.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.isActive}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isInCart
                  ? 'bg-neutral-800 border border-emerald-500/40 text-emerald-400'
                  : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-4 h-4" />
                  Item In Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNowDemo}
              disabled={!product.isActive}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
            >
              <Sparkles className="w-4 h-4" />
              Place Demo Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Images Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">
              More in {product.categoryName}
            </h3>
            <button
              onClick={() => {
                navigateTo('explore');
              }}
              className="text-xs text-emerald-400 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
