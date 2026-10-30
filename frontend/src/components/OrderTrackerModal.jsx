import React, { useEffect, useRef, useState } from 'react';
import { X, CheckCircle2, Clock, Bike, AlertCircle, PhoneCall, Sparkles, Radio, ShieldCheck, Mail, FileText, ExternalLink } from 'lucide-react';
import RiderMapRadar from './RiderMapRadar';
import { soundService } from '../services/soundService';

export default function OrderTrackerModal({
  order,
  onClose,
  onCancelOrder,
  onRefreshOrder
}) {
  if (!order) return null;

  const [currentOrder, setCurrentOrder] = useState(order);
  const [streamActive, setStreamActive] = useState(false);
  const hasPlayedDeliveredSound = useRef(false);

  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  // Server-Sent Events (SSE) Real-Time Stream Subscription
  useEffect(() => {
    if (!order.id || currentOrder.status === 'DELIVERED' || currentOrder.status === 'CANCELLED') {
      return;
    }

    let eventSource = null;
    let fallbackInterval = null;

    try {
      eventSource = new EventSource(`/api/orders/${order.id}/stream`);

      eventSource.addEventListener('order-init', (e) => {
        try {
          const updated = JSON.parse(e.data);
          setCurrentOrder(updated);
          setStreamActive(true);
        } catch (err) {}
      });

      eventSource.addEventListener('order-update', (e) => {
        try {
          const updated = JSON.parse(e.data);
          setCurrentOrder(updated);
          setStreamActive(true);

          if (updated.status === 'DELIVERED' && !hasPlayedDeliveredSound.current) {
            soundService.playDelivered();
            hasPlayedDeliveredSound.current = true;
          }
        } catch (err) {}
      });

      eventSource.onerror = () => {
        // SSE disconnected: close and gracefully fallback to polling
        if (eventSource) eventSource.close();
        setStreamActive(false);

        fallbackInterval = setInterval(() => {
          onRefreshOrder(order.id);
        }, 3000);
      };
    } catch (e) {
      // Fallback to polling directly
      fallbackInterval = setInterval(() => {
        onRefreshOrder(order.id);
      }, 3000);
    }

    return () => {
      if (eventSource) eventSource.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [order.id, currentOrder.status, onRefreshOrder]);

  const stages = [
    { key: 'PLACED', label: 'Order Received', desc: 'Dark Store confirmed items' },
    { key: 'PACKING', label: 'Packing Items', desc: 'Picker assembling groceries in Aisle 4' },
    { key: 'RIDER_ASSIGNED', label: 'Rider Assigned', desc: 'Partner waiting at store bay' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'EV Scooter speeding on main road' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Arrived at your doorstep in 10 mins!' },
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

  const currentStageIndex = getStageIndex(currentOrder.status);
  const isCancelled = currentOrder.status === 'CANCELLED';
  const isDelivered = currentOrder.status === 'DELIVERED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className={`p-6 text-white ${
          isCancelled
            ? 'bg-rose-600'
            : isDelivered
            ? 'bg-brand-green'
            : 'bg-slate-900'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                Order #{currentOrder.id}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 ${
                streamActive ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span>{streamActive ? 'SSE LIVE STREAM' : 'POLLING FALLBACK'}</span>
              </span>
            </div>
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
                  : `Arriving in ~${currentOrder.estimatedMinutesRemaining || 10} Mins`}
              </h2>
              <p className="text-xs text-white/80 mt-1">
                {currentOrder.darkStoreLocation || 'Dark Store #07 - Sector 62'}
              </p>
            </div>

            {!isCancelled && !isDelivered && (
              <div className="flex items-center gap-1.5 bg-brand-yellow text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-xl animate-pulse">
                <Bike className="w-4 h-4" />
                <span>REAL-TIME RADAR</span>
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

          {/* Embedded Real-Time GPS Radar & Map */}
          {!isCancelled && (
            <div>
              <RiderMapRadar
                status={currentOrder.status}
                darkStoreLocation={currentOrder.darkStoreLocation}
                deliveryAddress={currentOrder.deliveryAddress}
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-sky-500" />
                  <span>Demonstration Notice: High-fidelity simulated GPS vector route</span>
                </span>
                <span className="text-emerald-600 font-bold">SSE Push Active</span>
              </div>
            </div>
          )}

          {/* Stepper Progress */}
          {!isCancelled ? (
            <div className="relative pl-6 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
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

          {/* Rider Card */}
          {currentOrder.riderName && !isCancelled && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-brand-yellow rounded-full flex items-center justify-center text-xl shadow-inner">
                  🚴
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Delivery Partner • Ather EV
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900">{currentOrder.riderName}</h4>
                  <span className="text-xs text-slate-500">{currentOrder.riderPhone}</span>
                </div>
              </div>
              <a
                href={`tel:${currentOrder.riderPhone}`}
                className="w-9 h-9 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-brand-green transition"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Ordered Items Summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Items in this Order ({currentOrder.items?.length || 0})</span>
              <span className="text-slate-900 font-black">Total: ₹{currentOrder.totalAmount?.toFixed(2)}</span>
            </div>
            <div className="divide-y divide-slate-200/60 text-xs">
              {currentOrder.items?.map((item) => (
                <div key={item.id} className="py-2 flex justify-between items-center">
                  <span className="text-slate-700">
                    {item.product?.name} <span className="text-slate-400 font-semibold">× {item.quantity}</span>
                  </span>
                  <span className="font-bold text-slate-900">₹{item.subtotal?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AWS SES Email Invoice Box */}
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xs shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">AWS SES Order Bill Dispatched</h4>
                  <span className="text-[10px] text-slate-500 block">Sent to: <strong className="text-sky-700">{currentOrder.customerEmail}</strong></span>
                </div>
              </div>
              <a
                href={`/api/orders/${currentOrder.id}/invoice`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white hover:bg-sky-50 text-sky-700 border border-sky-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Bill</span>
                <ExternalLink className="w-3 h-3 text-sky-400" />
              </a>
            </div>
            <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-sky-200/60 font-medium">
              <span>Billed to: <strong>{currentOrder.customerName}</strong></span>
              <span>Contact: <strong>{currentOrder.contactNumber}</strong></span>
              <span>Delivery Hub: <strong>{currentOrder.darkStoreLocation || 'Hub #07'}</strong></span>
            </div>
          </div>

          {/* Destination */}
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-700">Delivering to: </span>
            {currentOrder.deliveryAddress}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          {['PLACED', 'PACKING'].includes(currentOrder.status) && (
            <button
              onClick={() => onCancelOrder(currentOrder.id)}
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
