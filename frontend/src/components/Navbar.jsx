import React from 'react';
import { ShoppingBag, Search, MapPin, Zap, Cloud } from 'lucide-react';

export default function Navbar({
  cartCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  onOpenCloudInfo,
  cloudInfo
}) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Delivery ETA Pill */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
              <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center shadow-inner">
                <Zap className="w-6 h-6 text-slate-900 fill-slate-900" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Minut<span className="text-brand-green">Del</span>
                </span>
                <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase -mt-1">
                  10-Minute Grocery
                </span>
              </div>
            </div>

            {/* Location & Dark Store Indicator */}
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 text-left">
              <MapPin className="w-5 h-5 text-brand-green shrink-0 animate-bounce" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-slate-900">Delivery in 10 MINS</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-brand-green font-bold">
                    FASTEST
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate max-w-[190px]">
                  Sector 62, Noida • Hub #07
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder='Search "milk", "chips", "coke", "bananas"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm rounded-xl border border-transparent focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition"
              />
            </div>
          </div>

          {/* Right Section: Cloud Architecture Badge & Cart Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cloud Info Button */}
            <button
              onClick={onOpenCloudInfo}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
              title="Inspect Cloud Architecture"
            >
              <Cloud className="w-4 h-4 text-sky-600" />
              <span className="hidden lg:inline">Cloud Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-green hover:bg-brand-darkgreen text-white font-bold shadow-md shadow-brand-green/20 transition active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <div className="text-left text-xs leading-tight">
                <div>{cartCount > 0 ? `${cartCount} items` : 'My Cart'}</div>
                <div className="text-brand-yellow font-extrabold">₹{cartTotal.toFixed(2)}</div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
