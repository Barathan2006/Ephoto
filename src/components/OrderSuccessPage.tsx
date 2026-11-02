import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Download, Clock, ArrowRight, ShieldCheck, Sparkles, FileText } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastPlacedOrder, downloadImage, navigateTo } = useApp();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  if (!lastPlacedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-in fade-in">
        <p className="text-sm text-neutral-400">No recent order found.</p>
        <button
          onClick={() => navigateTo('explore')}
          className="mt-4 px-5 py-2.5 bg-emerald-500 text-neutral-950 font-semibold rounded-xl text-xs"
        >
          Explore Images
        </button>
      </div>
    );
  }

  const handleDownload = async (orderItemId: number) => {
    setDownloadingId(orderItemId);
    await downloadImage(lastPlacedOrder.id, orderItemId);
    setDownloadingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      
      {/* Success Banner */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">
          Demo Order Confirmed
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Thank you! Your Assets are Ready
        </h1>
        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
          Order reference <span className="text-white font-mono font-medium">{lastPlacedOrder.orderNumber}</span> has been simulated and saved to the database. You may now download your unwatermarked original master files.
        </p>

        {/* Explicit Demo Notice */}
        <div className="mt-4 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-amber-300">
          ⚠️ This is a demonstration order. No payment was collected and no real-money transaction occurred.
        </div>
      </div>

      {/* Order Details Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-2xl space-y-6">
        
        {/* Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-neutral-800 text-xs">
          <div>
            <span className="text-neutral-500 block">Order Number</span>
            <span className="font-mono text-white font-medium">{lastPlacedOrder.orderNumber}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Date & Time</span>
            <span className="text-white">
              {new Date(lastPlacedOrder.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block">Status</span>
            <span className="text-emerald-400 font-semibold">{lastPlacedOrder.orderStatus}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Demo Total</span>
            <span className="text-white font-bold">${lastPlacedOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Ordered Image List with Direct Download Actions */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Eligible Purchased Original Files
          </h3>

          <div className="divide-y divide-neutral-800">
            {lastPlacedOrder.items.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.previewImage}
                    alt={item.productTitle}
                    className="w-20 h-14 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {item.productTitle}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                      <span>{item.imageFormat} Master</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.imageWidth} × {item.imageHeight} px</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.fileSize}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleDownload(item.id)}
                    disabled={downloadingId === item.id}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {downloadingId === item.id ? 'Downloading...' : 'Download Master Asset'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigateTo('history')}
            className="flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            View Full Order & Download History
          </button>

          <button
            onClick={() => navigateTo('explore')}
            className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors flex items-center gap-2"
          >
            <span>Continue Exploring Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
