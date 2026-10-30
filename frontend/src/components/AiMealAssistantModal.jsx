import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, ShoppingBag, Plus, Bot, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { soundService } from '../services/soundService';

export default function AiMealAssistantModal({ isOpen, onClose, onAddItemsToCart }) {
  const [prompt, setPrompt] = useState('');
  const [maxBudget, setMaxBudget] = useState(150);
  const [diet, setDiet] = useState('any');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/ai/suggestions')
        .then(res => res.json())
        .then(data => setSuggestions(data))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (queryText) => {
    const textToSubmit = queryText || prompt;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSubmit,
          maxBudget: maxBudget > 0 ? maxBudget : null,
          dietaryPreference: diet
        })
      });

      if (!res.ok) throw new Error('Failed to generate recommendation');
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      alert('AI Assistant error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAll = () => {
    if (response && response.recommendedProducts) {
      soundService.playAddToCart();
      onAddItemsToCart(response.recommendedProducts);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-yellow flex items-center justify-center text-slate-900 font-black shadow-md">
                ✨
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-tight">MinutDel AI Meal Assistant</h3>
                <span className="text-[10px] text-slate-300 font-mono">Semantic Dark-Store Recipe &amp; Budget Matching</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-xs text-slate-300">
            Tell me your craving, dietary preference, or budget. I will curate in-stock groceries and add them to your cart!
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* Preset Prompts Chips */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Popular Quick Prompts
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(sug);
                    handleSubmit(sug);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-brand-green text-slate-700 text-[11px] font-medium transition border border-slate-200/80 text-left cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Filters: Budget & Diet */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Max Budget: ₹{maxBudget}
              </label>
              <input
                type="range"
                min="50"
                max="400"
                step="25"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-brand-green cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Diet Preference
              </label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="any">Any / No Restriction</option>
                <option value="veg">Pure Vegetarian (No Eggs)</option>
                <option value="protein">High Protein / Gym</option>
              </select>
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="relative"
          >
            <input
              type="text"
              placeholder="e.g. I need breakfast under ₹120 with high protein..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs rounded-2xl border border-transparent focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition text-slate-900"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-brand-green hover:bg-brand-darkgreen disabled:bg-slate-300 text-white flex items-center justify-center transition cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </form>

          {/* AI Response Card */}
          {response && (
            <div className="space-y-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-green text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {response.reply}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    Engine: {response.engineSource}
                  </span>
                </div>
              </div>

              {/* Recommended Products Grid */}
              <div className="space-y-2 pt-2 border-t border-emerald-200/60">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                  Curated In-Stock Groceries ({response.recommendedProducts?.length || 0})
                </span>
                <div className="divide-y divide-emerald-200/40">
                  {response.recommendedProducts?.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                        />
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                          <span className="text-[10px] text-slate-400">{item.unit} • In Stock</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 shrink-0">
                        ₹{item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Add All Button */}
              <div className="pt-3 border-t border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Combo Total</span>
                  <strong className="text-sm font-black text-slate-900">
                    ₹{response.totalCost?.toFixed(0)}
                  </strong>
                </div>
                <button
                  onClick={handleAddAll}
                  className="px-4 py-2.5 bg-brand-green hover:bg-brand-darkgreen text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-green/20 transition active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add All to Cart</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 px-6">
          <span>Real-time DB query &bull; Zero fake items</span>
          <button onClick={onClose} className="font-semibold text-slate-600 hover:text-slate-900">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
