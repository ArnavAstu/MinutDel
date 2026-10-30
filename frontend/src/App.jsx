import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import QuickBundles from './components/QuickBundles';
import CartDrawer from './components/CartDrawer';
import OrderTrackerModal from './components/OrderTrackerModal';
import CloudStatusModal from './components/CloudStatusModal';
import StressTestModal from './components/StressTestModal';
import AiMealAssistantModal from './components/AiMealAssistantModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import { Sparkles, Zap, PackageCheck, Flame, BarChart3 } from 'lucide-react';
import { soundService } from './services/soundService';

const DARK_STORES = [
  { id: 'ds1', name: 'Sector 62, Noida', hubCode: 'Hub #07', distance: '0.8 km', eta: '9 mins' },
  { id: 'ds2', name: 'Indirapuram, Ghaziabad', hubCode: 'Hub #12', distance: '1.8 km', eta: '12 mins' },
  { id: 'ds3', name: 'Cyber Hub, Gurgaon', hubCode: 'Hub #04', distance: '3.2 km', eta: '18 mins' },
];

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});
  const [activeOrder, setActiveOrder] = useState(null);
  const [cloudInfo, setCloudInfo] = useState(null);

  // Dark Store & Weather State
  const [selectedStore, setSelectedStore] = useState(DARK_STORES[0]);
  const [weatherMode, setWeatherMode] = useState('clear'); // 'clear' | 'rain' | 'rush'

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isCloudInfoOpen, setIsCloudInfoOpen] = useState(false);
  const [isStressTestOpen, setIsStressTestOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch Categories & Cloud Info on load
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to fetch categories:', err));

    fetch('/api/cloud-info')
      .then((res) => res.json())
      .then((data) => setCloudInfo(data))
      .catch((err) => console.error('Failed to fetch cloud info:', err));
  }, []);

  // Fetch Products whenever category or search query changes
  useEffect(() => {
    setLoadingProducts(true);
    let url = '/api/products';
    const params = new URLSearchParams();
    if (activeCategory && activeCategory !== 'all') {
      params.append('category', activeCategory);
    }
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setLoadingProducts(false);
      });
  }, [activeCategory, searchQuery]);

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => {
      const currentQty = prev[product.id]?.quantity || 0;
      return {
        ...prev,
        [product.id]: {
          product,
          quantity: currentQty + 1,
        },
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const currentQty = prev[productId]?.quantity || 0;
      if (currentQty <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: currentQty - 1,
        },
      };
    });
  };

  // Add multiple items from AI Assistant or Recipe Kits
  const handleAddMultipleToCart = (items) => {
    soundService.playAddToCart();
    setCart((prev) => {
      const next = { ...prev };
      items.forEach((product) => {
        const currentQty = next[product.id]?.quantity || 0;
        next[product.id] = {
          product,
          quantity: currentQty + 1,
        };
      });
      return next;
    });
  };

  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = Object.values(cart).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Checkout with customer details & AWS SES notification
  const handleCheckout = async (orderPayload) => {
    setIsPlacingOrder(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderPayload,
          darkStoreLocation: orderPayload.darkStoreLocation || `${selectedStore.name} • ${selectedStore.hubCode}`
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to place order.');
        setIsPlacingOrder(false);
        return;
      }

      const newOrder = await res.json();
      setActiveOrder(newOrder);
      setCart({});
      setIsCartOpen(false);
      setIsOrderTrackerOpen(true);
    } catch (err) {
      alert('Network error connecting to backend: ' + err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Refresh single order for live simulation tracking
  const handleRefreshOrder = useCallback(async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const updated = await res.json();
        setActiveOrder(updated);
      }
    } catch (err) {
      console.error('Error refreshing order status:', err);
    }
  }, []);

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      if (res.ok) {
        handleRefreshOrder(orderId);
      } else {
        const err = await res.json();
        alert(err.error || 'Could not cancel order.');
      }
    } catch (err) {
      alert('Error cancelling order: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      
      {/* Top Navbar with Dark Store Switcher & Weather Surge */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCloudInfo={() => setIsCloudInfoOpen(true)}
        onOpenStressTest={() => setIsStressTestOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        weatherMode={weatherMode}
        setWeatherMode={setWeatherMode}
        darkStores={DARK_STORES}
      />

      {/* Category Pills Slider */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Hero Quick Delivery Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <div className="bg-gradient-to-r from-brand-yellow via-amber-300 to-yellow-400 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs border border-amber-300/50">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-brand-yellow text-xs font-black tracking-wide">
              <Zap className="w-3.5 h-3.5 fill-brand-yellow" />
              <span>SUPERFAST QUICK COMMERCE • {selectedStore.hubCode}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Groceries Delivered in <span className="underline decoration-slate-900">{selectedStore.eta}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-md">
              Fulfilling from <strong className="text-slate-950">{selectedStore.name}</strong> ({selectedStore.distance} away). Itemized tax invoice dispatched via AWS Simple Email Service (SES).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {activeOrder && (
              <button
                onClick={() => setIsOrderTrackerOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-brand-yellow" />
                <span>Track Active Order #{activeOrder.id}</span>
              </button>
            )}

            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
              <span>Ask AI Meal Assistant</span>
            </button>

            <button
              onClick={() => setIsStressTestOpen(true)}
              className="bg-white/90 hover:bg-white text-slate-900 px-4 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 border border-slate-900/10 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Stress Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1-Click Recipe Kits (Smart Bundles) */}
      <QuickBundles
        products={products}
        onAddBundle={handleAddMultipleToCart}
      />

      {/* Products Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {activeCategory === 'all'
                ? 'All Groceries & Essentials'
                : categories.find((c) => c.slug === activeCategory)?.name || 'Products'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {products.length} products verified in stock at {selectedStore.hubCode}
            </p>
          </div>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse space-y-3">
                <div className="aspect-square bg-slate-100 rounded-xl" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80">
            <span className="text-4xl block mb-2">🔍</span>
            <h3 className="text-base font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for "milk", "chips", or reset filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantityInCart={cart[product.id]?.quantity || 0}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <p className="font-extrabold text-slate-700">
              MinutDel Quick Commerce Architecture Demonstration
            </p>
            <p className="text-[11px] text-slate-400">
              Spring Boot 3 • React 18 • AWS Free Tier (EC2, S3, SES, RDS)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Admin Analytics Portal</span>
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsCloudInfoOpen(true)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cloud Status
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onCheckout={handleCheckout}
        isPlacingOrder={isPlacingOrder}
        selectedStore={selectedStore}
        weatherMode={weatherMode}
      />

      <OrderTrackerModal
        order={activeOrder}
        onClose={() => setIsOrderTrackerOpen(false)}
        onCancelOrder={handleCancelOrder}
        onRefreshOrder={handleRefreshOrder}
      />

      <CloudStatusModal
        isOpen={isCloudInfoOpen}
        onClose={() => setIsCloudInfoOpen(false)}
        cloudInfo={cloudInfo}
      />

      <StressTestModal
        isOpen={isStressTestOpen}
        onClose={() => setIsStressTestOpen(false)}
        cloudInfo={cloudInfo}
      />

      <AiMealAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onAddItemsToCart={handleAddMultipleToCart}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

    </div>
  );
}
