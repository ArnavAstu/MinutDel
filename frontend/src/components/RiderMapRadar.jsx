import React, { useMemo } from 'react';
import { Bike, MapPin, Zap, Navigation, Radio } from 'lucide-react';

export default function RiderMapRadar({ status, darkStoreLocation, deliveryAddress }) {
  // Determine progress % along delivery path based on state
  const progressPercent = useMemo(() => {
    switch (status) {
      case 'PLACED': return 5;
      case 'PACKING': return 15;
      case 'RIDER_ASSIGNED': return 35;
      case 'OUT_FOR_DELIVERY': return 75;
      case 'DELIVERED': return 100;
      default: return 5;
    }
  }, [status]);

  const telemetry = useMemo(() => {
    switch (status) {
      case 'PLACED':
        return { distance: '0.9 km', speed: '0 km/h', statusText: 'Order at Dark Store', battery: '92%' };
      case 'PACKING':
        return { distance: '0.9 km', speed: '0 km/h', statusText: 'Assembling in Aisle 4', battery: '92%' };
      case 'RIDER_ASSIGNED':
        return { distance: '0.8 km', speed: '12 km/h', statusText: 'Departing Bay #2', battery: '90%' };
      case 'OUT_FOR_DELIVERY':
        return { distance: '0.3 km', speed: '32 km/h', statusText: 'Speeding on Sector Road', battery: '88%' };
      case 'DELIVERED':
        return { distance: '0.0 km', speed: '0 km/h', statusText: 'Arrived at Doorstep!', battery: '86%' };
      default:
        return { distance: '0.9 km', speed: '0 km/h', statusText: 'Standby', battery: '90%' };
    }
  }, [status]);

  return (
    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-white relative overflow-hidden shadow-inner">
      
      {/* Background Radar Grid Styling */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Header Telemetry Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-brand-yellow">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-bold uppercase tracking-wider">Live Dark Store Radar</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>Speed: <strong className="text-white">{telemetry.speed}</strong></span>
          <span>Dist: <strong className="text-emerald-400">{telemetry.distance}</strong></span>
        </div>
      </div>

      {/* Interactive Map Visual Area */}
      <div className="relative h-44 my-3 flex items-center justify-center">
        
        {/* SVG Road Track */}
        <svg className="w-full h-full" viewBox="0 0 400 160">
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F8CB46" />
              <stop offset="50%" stopColor="#0C831F" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Road Path */}
          <path
            d="M 50 110 Q 130 30, 200 80 T 350 40"
            fill="none"
            stroke="#1E293B"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Active Illuminated Path */}
          <path
            d="M 50 110 Q 130 30, 200 80 T 350 40"
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="6 6"
            className="animate-pulse"
          />

          {/* Dark Store Hub Marker (Left) */}
          <g transform="translate(50, 110)">
            <circle r="16" fill="#F8CB46" opacity="0.2" className="animate-ping" />
            <circle r="12" fill="#0F172A" stroke="#F8CB46" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#F8CB46" fontWeight="bold">🏪</text>
            <text x="0" y="24" textAnchor="middle" fontSize="9" fill="#94A3B8" fontWeight="bold">DarkStore</text>
          </g>

          {/* Customer Destination Marker (Right) */}
          <g transform="translate(350, 40)">
            <circle r="16" fill="#38BDF8" opacity="0.2" className="animate-ping" />
            <circle r="12" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#38BDF8" fontWeight="bold">🏠</text>
            <text x="0" y="24" textAnchor="middle" fontSize="9" fill="#94A3B8" fontWeight="bold">You</text>
          </g>
        </svg>

        {/* Dynamic Moving Rider Pin */}
        <div
          className="absolute transition-all duration-1000 ease-out flex flex-col items-center pointer-events-none"
          style={{
            left: `${progressPercent}%`,
            top: `${progressPercent < 50 ? 55 - (progressPercent * 0.4) : 40 + ((progressPercent - 50) * 0.2)}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-500/30 animate-bounce">
              <Bike className="w-4 h-4" />
            </div>
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-emerald-400 whitespace-nowrap shadow-sm">
              EV 450X
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Telemetry Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate max-w-[240px]">
          <Navigation className="w-3.5 h-3.5 text-brand-green shrink-0" />
          <span className="truncate">{telemetry.statusText}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-300 font-mono text-[10px]">
          <Zap className="w-3 h-3 text-brand-yellow" />
          <span>Battery: {telemetry.battery}</span>
        </div>
      </div>

    </div>
  );
}
