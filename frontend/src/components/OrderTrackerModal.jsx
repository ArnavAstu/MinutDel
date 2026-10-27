import React, { useEffect } from 'react';
import { X, CheckCircle2, Clock, Bike, PackageCheck, AlertCircle, PhoneCall, Sparkles } from 'lucide-react';

export default function OrderTrackerModal({
  order,
  onClose,
  onCancelOrder,
  onRefreshOrder
}) {
  if (!order) return null;

  // Poll for updates every 2.5s while order is not completed or cancelled
  useEffect(() => {
    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') return;

    const interval = setInterval(() => {
      onRefreshOrder(order.id);
    }, 2500);

    return () => clearInterval(interval);
  }, [order.id, order.status, onRefreshOrder]);

  const stages = [
    { key: 'PLACED', label: 'Order Received', desc: 'Dark Store confirmed items' },
    { key: 'PACKING', label: 'Packing Items', desc: 'Picker assembling groceries' },
    { key: 'RIDER_ASSIGNED', label: 'Rider Assigned', desc: 'Partner waiting at store' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'On the way to your door' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Arrived at your doorstep' },
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'PACKING': return 1;
      case 'RIDER_ASSIGNED': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const currentStageIndex = getStageIndex(order.status);
  const isCancelled = order.status === 'CANCELLED';
  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className={`p-6 text-white ${
          isCancelled
            ? 'bg-rose-600'
            : isDelivered
            ? 'bg-brand-green'
            : 'bg-slate-900'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
              Order #{order.id}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                {isCancelled
                  ? 'Order Cancelled'
                  : isDelivered
                  ? 'Order Delivered!'
                  : `Arriving in ~${order.estimatedMinutesRemaining || 10} Mins`}
              </h2>
              <p className="text-xs text-white/80 mt-1">
                {order.darkStoreLocation || 'Dark Store #07'}
              </p>
            </div>

            {!isCancelled && !isDelivered && (
              <div className="flex items-center gap-1.5 bg-brand-yellow text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-xl animate-pulse">
                <Bike className="w-4 h-4" />
                <span>LIVE TRACKING</span>
              </div>
            )}

            {isDelivered && (
              <div className="flex items-center gap-1.5 bg-white text-brand-green font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>10 MIN GUARANTEE MET</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Stepper Progress */}
          {!isCancelled ? (
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {stages.map((stage, idx) => {
                const isPassed = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stage.key} className="relative flex items-start gap-4">
                    {/* Circle Pin */}
                    <div
                      className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-brand-green text-white ring-4 ring-emerald-50'
                          : isCurrent
                          ? 'bg-brand-yellow text-slate-900 ring-4 ring-amber-100 scale-110 shadow-md'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div className="pt-0.5">
                      <h4
                        className={`text-sm font-bold ${
                          isCurrent
                            ? 'text-slate-900 font-black'
                            : isPassed
                            ? 'text-slate-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {stage.label}
                        {isCurrent && (
                          <span className="ml-2 inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 uppercase tracking-wider">
                            In Progress
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>This order was cancelled. Restocked back to Dark Store inventory.</span>
            </div>
          )}

          {/* Rider Card (Appears once rider is assigned) */}
          {order.riderName && !isCancelled && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-brand-yellow rounded-full flex items-center justify-center text-xl shadow-inner">
                  🚴
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Delivery Partner
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900">{order.riderName}</h4>
                  <span className="text-xs text-slate-500">{order.riderPhone}</span>
                </div>
              </div>
              <a
                href={`tel:${order.riderPhone}`}
                className="w-9 h-9 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-brand-green transition"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Ordered Items Summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Items in this Order ({order.items?.length || 0})</span>
              <span className="text-slate-900 font-black">Total: ₹{order.totalAmount?.toFixed(2)}</span>
            </div>
            <div className="divide-y divide-slate-200/60 text-xs">
              {order.items?.map((item) => (
                <div key={item.id} className="py-2 flex justify-between items-center">
                  <span className="text-slate-700">
                    {item.product?.name} <span className="text-slate-400 font-semibold">× {item.quantity}</span>
                  </span>
                  <span className="font-bold text-slate-900">₹{item.subtotal?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Destination */}
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-700">Delivering to: </span>
            {order.deliveryAddress}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          {['PLACED', 'PACKING'].includes(order.status) && (
            <button
              onClick={() => onCancelOrder(order.id)}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-2 rounded-lg hover:bg-rose-50 transition"
            >
              Cancel Order
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
}
