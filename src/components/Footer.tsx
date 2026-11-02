import React from 'react';
import { useApp } from '../context/AppContext';
import { Camera, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setSelectedCategoryFilter, categories } = useApp();

  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Ephoto / PixelMart
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              An architectural demonstration platform for digital photography e-commerce. Features custom image creation, catalog exploration, simulated checkout without payment gateways, and direct master asset downloads.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-300/90 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Demonstration purposes only · No financial transactions</span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Explore Collections
            </h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter(cat.categoryName);
                      navigateTo('explore');
                    }}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {cat.categoryName} Photography
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Platform Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigateTo('explore')}
                  className="hover:text-white transition-colors"
                >
                  Marketplace Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('create-image')}
                  className="hover:text-white transition-colors"
                >
                  Create & Sell Image
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('history')}
                  className="hover:text-white transition-colors"
                >
                  My Orders & Downloads
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('profile')}
                  className="hover:text-white transition-colors"
                >
                  Customer Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Administrator Portal
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Ephoto · PixelMart Digital Marketplace. Built for high-res creative media commerce.
          </div>
          <div className="flex items-center gap-4">
            <span>Demo License Agreement</span>
            <span aria-hidden="true">·</span>
            <span>Privacy & Security</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Demonstration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
