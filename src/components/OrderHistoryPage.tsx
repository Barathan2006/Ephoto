import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Clock, ChevronDown, ChevronUp, Package, ShieldCheck, ArrowRight } from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const { orders, currentUser, downloadImage, navigateTo } = useApp();
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(orders[0]?.id || null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Filter orders for the current user (if admin, can see all or own)
  const userOrders = currentUser.role === 'admin'
    ? orders
    : orders.filter((o) => o.userId === currentUser.id);

  const toggleOrder = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleDownload = async (orderId: number, orderItemId: number) => {
    setDownloadingId(orderItemId);
    await downloadImage(orderId, orderItemId);
    setDownloadingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
            <span className="text-emerald-400 font-medium">Customer Portal</span>
            <span aria-hidden="true">·</span>
            <span>Digital Asset Licenses</span>
            <span aria-hidden="true">·</span>
            <span>Active Downloads</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Order & Download History
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'} on record for {currentUser.username}
          </p>
        </div>

        <button
          onClick={() => navigateTo('explore')}
          className="self-start sm:self-auto px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <span>Browse More Images</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {userOrders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/30 max-w-md mx-auto">
          <Package className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            Place a demo order to unlock and download original high-resolution photography files.
          </p>
          <button
            onClick={() => navigateTo('explore')}
            className="mt-5 px-4 py-2 bg-emerald-500 text-neutral-950 font-semibold text-xs rounded-lg"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="rounded-2xl bg-neutral-900/70 border border-neutral-800 overflow-hidden transition-all shadow-sm"
              >
                {/* Order Summary Row */}
                <div
                  onClick={() => toggleOrder(order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white tracking-tight">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/80 text-emerald-300">
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{order.items.length} {order.items.length === 1 ? 'image' : 'images'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-800">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-neutral-500">Demo Checkout</div>
                    </div>

                    <div className="p-1 rounded-lg bg-neutral-800 text-neutral-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Items & Downloads */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-neutral-800/80 bg-neutral-950/40 divide-y divide-neutral-800/60">
                    <div className="py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Purchased Image Assets</span>
                      <span className="text-emerald-400 lowercase font-normal">
                        unlimited demo downloads
                      </span>
                    </div>

                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.previewImage}
                            alt={item.productTitle}
                            className="w-16 h-12 rounded-lg object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">
                              {item.productTitle}
                            </div>
                            <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1.5">
                              <span>{item.imageFormat} Master</span>
                              <span aria-hidden="true">·</span>
                              <span>{item.imageWidth} × {item.imageHeight} px</span>
                              <span aria-hidden="true">·</span>
                              <span>{item.fileSize}</span>
                              <span aria-hidden="true">·</span>
                              <span className="text-emerald-400">
                                {item.downloadCount || 0} downloads
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownload(order.id, item.id)}
                          disabled={downloadingId === item.id}
                          className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors self-end sm:self-auto cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>
                            {downloadingId === item.id ? 'Downloading...' : 'Download Master'}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
