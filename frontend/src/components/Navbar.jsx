import React, { useState } from 'react';
import { ShoppingBag, Search, MapPin, Zap, Cloud, Volume2, VolumeX, Flame, CloudRain, Sun, ChevronDown } from 'lucide-react';
import { soundService } from '../services/soundService';

export default function Navbar({
  cartCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  onOpenCloudInfo,
  onOpenStressTest,
  selectedStore,
  setSelectedStore,
  weatherMode,
  setWeatherMode,
  darkStores
}) {
  const [isMuted, setIsMuted] = useState(soundService.isMuted());
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);

  const toggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      
      {/* Weather Surge Notice Banner (If Rain or Flash Rush active) */}
      {weatherMode === 'rain' && (
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <CloudRain className="w-3.5 h-3.5 animate-bounce" />
          <span>Monsoon Surge Active • Extra ₹15 rain protection incentive directly transferred to delivery partners • ETA ~16 Mins</span>
        </div>
      )}

      {weatherMode === 'rush' && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          <span>Flash Rush Hours Active • 3x dark store pickers deployed for ultra-fast dispatch</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
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
                  10-Min Cloud Commerce
                </span>
              </div>
            </div>

            {/* Proximity Dark Store Selector Dropdown */}
            <div className="relative hidden md:block pl-3 border-l border-slate-200">
              <button
                onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                className="flex items-center gap-2 text-left hover:bg-slate-50 p-1.5 rounded-xl transition"
              >
                <MapPin className="w-5 h-5 text-brand-green shrink-0 animate-bounce" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900">
                      {selectedStore.name}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                    {selectedStore.hubCode} • {selectedStore.distance} ({selectedStore.eta})
                  </p>
                </div>
              </button>

              {/* Store Dropdown */}
              {isStoreDropdownOpen && (
                <div className="absolute left-3 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <span className="text-[10px] font-mono font-bold text-slate-400 px-3 py-1 block uppercase">
                    Select Micro Dark Store Hub
                  </span>
                  {darkStores.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => {
                        setSelectedStore(store);
                        setIsStoreDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start justify-between transition ${
                        selectedStore.id === store.id ? 'bg-emerald-50 text-brand-green font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{store.name}</div>
                        <span className="text-[10px] text-slate-400 block">{store.hubCode} • {store.distance}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-mono font-bold">
                        {store.eta}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder='Search "milk", "chips", "maggi", "bananas"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs rounded-xl border border-transparent focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition"
              />
            </div>
          </div>

          {/* Right Action Icons: Weather Toggle, Stress Test, Audio, Cloud, Cart */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Weather / Surge Mode Cycle */}
            <button
              onClick={() => {
                if (weatherMode === 'clear') setWeatherMode('rain');
                else if (weatherMode === 'rain') setWeatherMode('rush');
                else setWeatherMode('clear');
              }}
              className="p-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
              title="Toggle Weather / Demand Simulation"
            >
              {weatherMode === 'clear' && <Sun className="w-4 h-4 text-amber-500" />}
              {weatherMode === 'rain' && <CloudRain className="w-4 h-4 text-sky-500" />}
              {weatherMode === 'rush' && <Zap className="w-4 h-4 text-rose-500" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
              title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-brand-green" />}
            </button>

            {/* Cloud Chaos / Stress Test Button */}
            <button
              onClick={onOpenStressTest}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition border border-rose-200"
              title="Run Cloud Concurrency Stress Test"
            >
              <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
              <span className="hidden xl:inline">Stress Test</span>
            </button>

            {/* Cloud Info Button */}
            <button
              onClick={onOpenCloudInfo}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
              title="Inspect AWS Architecture"
            >
              <Cloud className="w-4 h-4 text-sky-600" />
              <span className="hidden lg:inline">Cloud Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-darkgreen text-white font-bold shadow-md shadow-brand-green/20 transition active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <div className="text-left text-xs leading-tight">
                <div>{cartCount > 0 ? `${cartCount} items` : 'My Cart'}</div>
                <div className="text-brand-yellow font-extrabold">₹{cartTotal.toFixed(0)}</div>
              </div>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
