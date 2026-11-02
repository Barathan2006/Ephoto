import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Eye, Download, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, cart } = useApp();

  const isInCart = cart.some((item) => item.productId === product.id);

  const handleCardClick = () => {
    navigateTo('details', product.id);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 hover:shadow-xl transition-all cursor-pointer relative"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-950">
        <img
          src={product.previewImage}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Inactive overlay if deactivated */}
        {!product.isActive && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Currently Inactive
            </span>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5">
          <span className="text-xs text-neutral-300 flex items-center gap-1 font-medium">
            <Eye className="w-3.5 h-3.5" />
            Inspect Specs
          </span>
          <button
            onClick={handleCartClick}
            disabled={!product.isActive}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isInCart
                ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                In Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Anti-Slop Zero-Pill Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="font-medium text-emerald-400">{product.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>{product.imageWidth} × {product.imageHeight}</span>
            <span aria-hidden="true">·</span>
            <span>{product.imageFormat}</span>
            <span aria-hidden="true">·</span>
            <span>{product.fileSize}</span>
          </div>

          {/* Product Title */}
          <h3 className="mt-1.5 text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
            {product.title}
          </h3>

          {/* Quiet description snippet */}
          <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Card Footer: Price & Author */}
        <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            {product.authorAvatar && (
              <img
                src={product.authorAvatar}
                alt={product.authorName}
                className="w-4 h-4 rounded-full object-cover"
              />
            )}
            <span className="truncate max-w-[110px]">{product.authorName}</span>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-white tracking-tight">
              ${product.price.toFixed(2)}
            </div>
            <div className="text-[10px] text-neutral-500">Demo Price</div>
          </div>
        </div>
      </div>
    </div>
  );
};
