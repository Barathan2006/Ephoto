import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, AlertCircle } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, cartTotal, clearCart, navigateTo } = useApp();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your Shopping Cart is Empty</h2>
        <p className="mt-2 text-xs text-neutral-400 max-w-sm mx-auto">
          Explore the catalog to discover high-resolution photography, or generate your own artwork in the studio.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => navigateTo('explore')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-xs rounded-xl transition-colors"
          >
            Explore Marketplace
          </button>
          <button
            onClick={() => navigateTo('create-image')}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-medium text-xs rounded-xl transition-colors"
          >
            Create Your Own Image
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800 mb-8">
        <div>
          <button
            onClick={() => navigateTo('explore')}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Browsing
          </button>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-rose-400 transition-colors"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700/80 transition-all gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.previewImage}
                  alt={item.product.title}
                  className="w-20 h-14 sm:w-24 sm:h-16 rounded-lg object-cover bg-neutral-950 shrink-0 border border-neutral-800 cursor-pointer"
                  onClick={() => navigateTo('details', item.productId)}
                />
                <div>
                  <h3
                    onClick={() => navigateTo('details', item.productId)}
                    className="text-sm font-semibold text-white hover:text-emerald-300 transition-colors cursor-pointer line-clamp-1"
                  >
                    {item.product.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <span className="text-emerald-400">{item.product.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.product.imageFormat}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.product.imageWidth} × {item.product.imageHeight}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.product.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/80">
                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    ${item.product.price.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-neutral-500">Demo Price</div>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors"
                  title="Remove from Cart"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Demo disclaimer banner */}
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex items-start gap-3 text-xs text-neutral-400 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-200">Demo Checkout Notice:</strong> Digital items can be ordered in demo mode without any payment or credit card credentials. High-resolution master assets will be immediately available for download after confirmation.
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3">
              Order Summary
            </h2>

            <div className="space-y-2 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Items ({cart.length})</span>
                <span className="text-white font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Processing</span>
                <span className="text-emerald-400 font-medium">$0.00 (Demo)</span>
              </div>
              <div className="flex justify-between">
                <span>Royalty License</span>
                <span className="text-emerald-400 font-medium">Included</span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-baseline justify-between">
              <div>
                <div className="text-xs text-neutral-400">Total Demo Amount</div>
                <div className="text-2xl font-black text-white tracking-tight">
                  ${cartTotal.toFixed(2)}
                </div>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">
                No Real Payment
              </span>
            </div>

            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <span>Proceed to Demo Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
