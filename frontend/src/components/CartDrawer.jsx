import React, { useState } from 'react';
import { X, Plus, Minus, ArrowRight, ShieldCheck, Clock, ShoppingCart, CloudRain, MapPin } from 'lucide-react';
import { soundService } from '../services/soundService';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
  isPlacingOrder,
  selectedStore,
  weatherMode
}) {
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [customerEmail, setCustomerEmail] = useState('rahul.sharma@example.com');
  const [deliveryAddress, setDeliveryAddress] = useState('Tower 4, Flat 502, Express Greens, Sector 62, Noida');
  const [contactNumber, setContactNumber] = useState('+91 98765-43210');

  if (!isOpen) return null;

  const itemsTotal = Object.values(cart).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = 0; // Free 10-min delivery promo
  const handlingFee = 2.0;
  const rainSurgeFee = weatherMode === 'rain' ? 15.0 : 0.0;
  const grandTotal = itemsTotal > 0 ? itemsTotal + deliveryFee + handlingFee + rainSurgeFee : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(cart).length === 0) return;

    soundService.playOrderPlaced();

    onCheckout({
      customerName,
      customerEmail,
      deliveryAddress,
      contactNumber,
      items: Object.values(cart).map((item) => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-green" />
            <h2 className="font-extrabold text-slate-900 text-base">My Cart</h2>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {Object.keys(cart).length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* 10-Min Flash Banner with selected dark store */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs text-brand-green font-bold">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Delivery in {selectedStore?.eta || '10 mins'}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-normal">
            {selectedStore?.hubCode || 'Hub #07'}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.keys(cart).length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">
                🛒
              </div>
              <h3 className="font-bold text-slate-700">Your cart is empty</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explore our catalog or 1-Click Recipe Kits to add fresh items instantly!
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="divide-y divide-slate-100">
                {Object.values(cart).map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{product.name}</h4>
                      <span className="text-[11px] text-slate-400 block">{product.unit}</span>
                      <span className="text-xs font-extrabold text-slate-900">
                        ₹{(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                    {/* Stepper */}
                    <div className="flex items-center bg-brand-green text-white rounded-lg px-1.5 py-1 gap-2 shrink-0">
                      <button
                        onClick={() => onRemoveFromCart(product.id)}
                        className="w-4 h-4 flex items-center justify-center hover:bg-black/20 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold min-w-[12px] text-center">{quantity}</span>
                      <button
                        onClick={() => {
                          soundService.playAddToCart();
                          onAddToCart(product);
                        }}
                        className="w-4 h-4 flex items-center justify-center hover:bg-black/20 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Details Form */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-green" />
                  <span>Delivery Address</span>
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white outline-none focus:border-brand-green"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white outline-none focus:border-brand-green"
                  />
                  <input
                    type="text"
                    placeholder="Delivery Address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white outline-none focus:border-brand-green"
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bill Summary
                </h4>
                <div className="flex justify-between text-slate-600">
                  <span>Item Total</span>
                  <span>₹{itemsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge</span>
                  <span className="text-brand-green font-bold">
                    <span className="line-through text-slate-400 mr-1">₹15</span>FREE
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Handling Fee</span>
                  <span>₹{handlingFee.toFixed(2)}</span>
                </div>
                {weatherMode === 'rain' && (
                  <div className="flex justify-between text-sky-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5" />
                      <span>Rider Rain Protection Fee</span>
                    </span>
                    <span>₹{rainSurgeFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                  <span>To Pay</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Simulated Order • Real-time Cloud Pipeline</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Button */}
        {Object.keys(cart).length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white">
            <button
              onClick={handleSubmit}
              disabled={isPlacingOrder}
              className="w-full py-3.5 px-4 bg-brand-green hover:bg-brand-darkgreen disabled:bg-slate-400 text-white rounded-xl font-extrabold flex items-center justify-between shadow-lg shadow-brand-green/20 transition active:scale-[0.98] cursor-pointer"
            >
              <div className="text-left text-xs">
                <div>₹{grandTotal.toFixed(2)}</div>
                <span className="text-[10px] text-emerald-200 uppercase font-semibold">TOTAL</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span>{isPlacingOrder ? 'Processing...' : `Place ${selectedStore?.eta || '10-Min'} Order`}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
