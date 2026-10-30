import React, { useState, useEffect } from 'react';
import { X, BarChart3, TrendingUp, DollarSign, Package, AlertTriangle, ShieldCheck, RefreshCw, ShoppingCart, UserCheck, Lock } from 'lucide-react';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('minutdel_admin_token') || '');
  const [authError, setAuthError] = useState('');
  const [loginEmail, setLoginEmail] = useState('admin@minutdel.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      fetchAnalytics(token);
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const fetchAnalytics = async (authToken) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (res.status === 403 || res.status === 401) {
        setAuthError('Unauthorized: Please log in with Administrator credentials.');
        setToken('');
        localStorage.removeItem('minutdel_admin_token');
        setAnalytics(null);
        return;
      }

      if (!res.ok) throw new Error('Failed to load analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
        return;
      }

      if (data.role !== 'ROLE_ADMIN') {
        setAuthError('Access Denied: Customer accounts cannot access the Admin Portal.');
        return;
      }

      setToken(data.token);
      localStorage.setItem('minutdel_admin_token', data.token);
      fetchAnalytics(data.token);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 z-10 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">MinutDel Dark Store Command Center</h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400">Live order metrics, real database aggregations &amp; revenue telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* If Not Logged In as Admin, Show Login Form */}
          {!token ? (
            <div className="max-w-md mx-auto my-8 p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-indigo-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-white">Administrator Authentication</h4>
                <p className="text-slate-400 text-xs">Sign in with an authorized Dark Store Manager account</p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase font-mono">Admin Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase font-mono">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  <span>{isLoggingIn ? 'Authenticating...' : 'Sign In as Admin'}</span>
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                <span>Default credentials: </span>
                <code className="text-indigo-400">admin@minutdel.com</code> / <code className="text-indigo-400">admin123</code>
              </div>
            </div>
          ) : (
            <>
              {/* Top Action bar */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-emerald-400 font-bold">Authenticated as Store Administrator</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchAnalytics(token)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition font-bold"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={() => {
                      setToken('');
                      localStorage.removeItem('minutdel_admin_token');
                    }}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl transition font-bold"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Total Revenue</span>
                  <h4 className="text-xl font-black text-emerald-400">₹{analytics?.totalRevenue?.toFixed(2) || '0.00'}</h4>
                  <span className="text-[10px] text-slate-500 mt-1 block">Excluding cancellations</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Total Volume</span>
                  <h4 className="text-xl font-black text-white">{analytics?.totalOrders || 0} Orders</h4>
                  <span className="text-[10px] text-emerald-400 mt-1 block">{analytics?.deliveredOrders || 0} Delivered</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Average Order Value</span>
                  <h4 className="text-xl font-black text-brand-yellow">₹{analytics?.averageOrderValue?.toFixed(1) || '0.0'}</h4>
                  <span className="text-[10px] text-slate-500 mt-1 block">AOV metric</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Cancellation Rate</span>
                  <h4 className={`text-xl font-black ${analytics?.cancellationRate > 15 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {analytics?.cancellationRate?.toFixed(1) || '0.0'}%
                  </h4>
                  <span className="text-[10px] text-slate-500 mt-1 block">{analytics?.cancelledOrders || 0} cancelled</span>
                </div>
              </div>

              {/* Two Column Grid: Popular Products & Status Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Popular Products Table */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>Top Selling Grocery Items</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">SQL Aggregation</span>
                  </div>
                  
                  {(!analytics?.popularProducts || analytics.popularProducts.length === 0) ? (
                    <div className="text-slate-500 py-6 text-center text-xs">No order item records yet.</div>
                  ) : (
                    <div className="divide-y divide-slate-800/80">
                      {analytics.popularProducts.map((p, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500 w-4">{idx + 1}.</span>
                            <span className="font-bold text-slate-200 text-xs">{p.productName}</span>
                          </div>
                          <div className="text-right font-mono text-xs">
                            <span className="text-emerald-400 font-bold">{p.totalQuantitySold} sold</span>
                            <span className="text-slate-500 text-[10px] block">₹{p.totalRevenueGenerated?.toFixed(0)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Breakdown */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-brand-yellow" />
                    <span>Fulfillment Status Pipeline</span>
                  </h4>
                  
                  <div className="space-y-2 font-mono text-xs">
                    {analytics?.statusBreakdown && Object.entries(analytics.statusBreakdown).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">{status}</span>
                        <span className="font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-lg">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Orders List */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Recent Orders Log</h4>
                  <span className="text-[10px] text-slate-500 font-mono">Latest 8 entries</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="text-slate-500 border-b border-slate-800 pb-1">
                      <tr>
                        <th className="py-1">ID</th>
                        <th className="py-1">Customer</th>
                        <th className="py-1">Email</th>
                        <th className="py-1">Total</th>
                        <th className="py-1">Status</th>
                        <th className="py-1">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {analytics?.recentOrders?.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-900/60">
                          <td className="py-2 text-indigo-400 font-bold">#{ord.id}</td>
                          <td className="py-2">{ord.customerName}</td>
                          <td className="py-2 text-slate-400">{ord.customerEmail}</td>
                          <td className="py-2 font-bold text-emerald-400">₹{ord.totalAmount?.toFixed(2)}</td>
                          <td className="py-2">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-200">
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-2">
                            <a
                              href={`/api/orders/${ord.id}/invoice`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-400 underline hover:text-sky-300"
                            >
                              Bill
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Access Control Active (Only ROLE_ADMIN permitted)</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
