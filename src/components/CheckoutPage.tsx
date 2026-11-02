import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, AlertCircle, ArrowLeft, Check, Sparkles, Lock } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, currentUser, placeDemoOrder, navigateTo } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-in fade-in">
        <p className="text-sm text-neutral-400">Your cart is empty. Add images before proceeding to checkout.</p>
        <button
          onClick={() => navigateTo('explore')}
          className="mt-4 px-5 py-2.5 bg-emerald-500 text-neutral-950 font-semibold rounded-xl text-xs"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      placeDemoOrder();
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      
      {/* Back button */}
      <button
        onClick={() => navigateTo('cart')}
        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Cart
      </button>

      {/* Required prominent disclaimer banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed mb-8 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-300 uppercase tracking-wide block mb-0.5">
            Demonstration Order Mode
          </strong>
          This is a demonstration order. No payment was collected and no real-money transaction occurred.
          No credit card, UPI, Razorpay, Stripe, or PayPal information is requested or handled anywhere in this platform.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Customer Account & Summary */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              1. Customer Account Verification
            </h2>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <img
                src={currentUser.profileImage}
                alt={currentUser.username}
                className="w-10 h-10 rounded-full object-cover border border-neutral-700"
              />
              <div className="text-xs">
                <div className="font-semibold text-white">{currentUser.username}</div>
                <div className="text-neutral-400">{currentUser.email}</div>
                <div className="text-emerald-400 text-[11px] mt-0.5">Authenticated Demo Account</div>
              </div>
            </div>
          </div>

          {/* Selected Items Breakdown */}
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              2. Selected Digital Assets ({cart.length})
            </h2>

            <div className="divide-y divide-neutral-800/80">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.previewImage}
                      alt={item.product.title}
                      className="w-12 h-9 rounded object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                    />
                    <div>
                      <div className="font-medium text-white line-clamp-1">{item.product.title}</div>
                      <div className="text-neutral-500 text-[11px]">
                        {item.product.categoryName} · {item.product.imageWidth}×{item.product.imageHeight} · {item.product.fileSize}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-white text-right">
                    ${item.product.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Demo Checkout Action Card */}
        <div className="md:col-span-5">
          <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-2xl space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3">
              Checkout Confirmation
            </h2>

            <div className="space-y-2 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} assets)</span>
                <span className="text-white font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Taxes & Fees</span>
                <span className="text-emerald-400 font-medium">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Type</span>
                <span className="text-amber-400 font-medium">DEMO SIMULATION</span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-baseline justify-between">
              <div>
                <div className="text-xs text-neutral-400">Simulated Total</div>
                <div className="text-2xl font-black text-white tracking-tight">
                  ${cartTotal.toFixed(2)}
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-medium">
                100% Free Demo
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Generating Demo Order...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Place Demo Order</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Instant digital delivery with secure license token
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
