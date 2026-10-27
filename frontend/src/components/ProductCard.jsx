import React from 'react';
import { Plus, Minus, Zap, Star } from 'lucide-react';

export default function ProductCard({ product, quantityInCart, onAddToCart, onRemoveFromCart }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
      
      {/* Top Image & ETA Badge */}
      <div className="relative mb-3 aspect-square rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop";
          }}
        />

        {/* 10-Minute Guarantee Tag */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs border border-slate-100">
          <Zap className="w-3 h-3 text-brand-green fill-brand-green" />
          <span className="text-[10px] font-black text-slate-800 tracking-tight">10 MINS</span>
        </div>

        {/* Stock warning if low */}
        {product.stockQuantity < 10 && (
          <div className="absolute bottom-2 left-2 bg-amber-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            Only {product.stockQuantity} left
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Unit / Weight */}
          <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
            {product.unit || 'Standard'}
          </span>

          {/* Title */}
          <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug mb-1">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold text-slate-600">{product.rating}</span>
            </div>
          )}
        </div>

        {/* Price & Add / Stepper Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
          <div>
            <span className="text-sm font-black text-slate-900">
              ₹{Number(product.price).toFixed(0)}
            </span>
          </div>

          {quantityInCart > 0 ? (
            /* Stepper: [-] [qty] [+] */
            <div className="flex items-center bg-brand-green text-white rounded-lg px-1.5 py-1 gap-2 shadow-xs">
              <button
                onClick={() => onRemoveFromCart(product.id)}
                className="w-5 h-5 flex items-center justify-center hover:bg-black/20 rounded transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black min-w-[12px] text-center">
                {quantityInCart}
              </span>
              <button
                onClick={() => onAddToCart(product)}
                className="w-5 h-5 flex items-center justify-center hover:bg-black/20 rounded transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* "+ ADD" Button */
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-brand-green/30 bg-emerald-50 hover:bg-brand-green hover:text-white text-brand-green font-bold text-xs transition duration-150 active:scale-95 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
