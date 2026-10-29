import React from 'react';
import { Sparkles, Plus, Zap } from 'lucide-react';

export default function QuickBundles({ products, onAddBundle }) {
  if (!products || products.length === 0) return null;

  // Find products by name or fallback to index
  const getProduct = (keyword, fallbackIdx) => {
    return products.find(p => p.name.toLowerCase().includes(keyword.toLowerCase())) || products[fallbackIdx];
  };

  const bundles = [
    {
      id: 'b1',
      title: 'Sunday Breakfast Kit',
      emoji: '🍳',
      tag: 'SAVE ₹15',
      items: [
        getProduct('milk', 0),
        getProduct('bread', 1),
        getProduct('egg', 2),
      ].filter(Boolean),
    },
    {
      id: 'b2',
      title: 'Midnight Binge Combo',
      emoji: '🍿',
      tag: 'TOP PICK',
      items: [
        getProduct('chips', 3),
        getProduct('coca-cola', 6),
        getProduct('silk', 5),
      ].filter(Boolean),
    },
    {
      id: 'b3',
      title: 'Quick 2-Min Meal Kit',
      emoji: '🍜',
      tag: 'INSTANT',
      items: [
        getProduct('maggi', 8),
        getProduct('coke', 6),
        getProduct('banana', 10),
      ].filter(Boolean),
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
          <h2 className="text-base font-extrabold text-slate-900">
            1-Click Quick Recipe Kits
          </h2>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
            SMART BUNDLES
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bundles.map((bundle) => {
          const bundleTotal = bundle.items.reduce((sum, item) => sum + (Number(item?.price) || 0), 0);
          const discountedTotal = Math.max(bundleTotal - 15, bundleTotal * 0.9);

          return (
            <div
              key={bundle.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 hover:shadow-md transition flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{bundle.emoji}</span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{bundle.title}</h3>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {bundle.items.length} items bundled
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-brand-yellow text-slate-900 px-2 py-0.5 rounded shadow-xs">
                  {bundle.tag}
                </span>
              </div>

              {/* Product thumbnails preview */}
              <div className="flex items-center gap-2 my-2 py-2 border-y border-slate-100">
                {bundle.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 flex-1 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-8 h-8 rounded-lg object-cover bg-slate-50 border border-slate-200 shrink-0"
                    />
                    <span className="text-[10px] text-slate-600 font-semibold truncate">
                      {item.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price & Add Bundle */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-extrabold text-slate-900">
                    ₹{discountedTotal.toFixed(0)}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through ml-1.5">
                    ₹{bundleTotal.toFixed(0)}
                  </span>
                </div>
                <button
                  onClick={() => onAddBundle(bundle.items)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-brand-green text-brand-green hover:text-white border border-brand-green/30 text-xs font-bold transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD KIT</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
