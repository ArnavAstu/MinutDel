import React, { useState } from 'react';
import { X, Flame, ShieldAlert, Cpu, CheckCircle2, RefreshCw, Activity } from 'lucide-react';

export default function StressTestModal({ isOpen, onClose, cloudInfo }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [orderCount, setOrderCount] = useState(20);

  if (!isOpen) return null;

  const runStressTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/stress-test/simulate-spike?count=${orderCount}&targetProductId=1`, {
        method: 'POST'
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('Error triggering stress test: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
              <span className="text-xs font-mono uppercase font-bold tracking-widest text-rose-300">
                Cloud Chaos &amp; Concurrency Engine
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <h2 className="text-xl font-black">High-Concurrency Flash Spike Simulator</h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate instantaneous flash-order traffic spikes to test thread safety and ACID inventory locking.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Controls */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Burst Order Traffic</span>
              <span className="text-[11px] text-slate-400">Number of parallel asynchronous checkout threads</span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={orderCount}
                onChange={(e) => setOrderCount(Number(e.target.value))}
                className="bg-slate-900 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono outline-none"
              >
                <option value={10}>10 Concurrent Orders</option>
                <option value={20}>20 Concurrent Orders</option>
                <option value={35}>35 Concurrent Orders</option>
              </select>
              <button
                onClick={runStressTest}
                disabled={loading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-rose-900/30"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                <span>{loading ? 'Simulating...' : 'Fire Spike'}</span>
              </button>
            </div>
          </div>

          {/* Live JVM Telemetry Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">JVM HEAP USED</span>
              <strong className="text-sm text-brand-yellow">{cloudInfo?.usedMemoryMb || 120} MB</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">TOTAL HEAP</span>
              <strong className="text-sm text-slate-200">{cloudInfo?.totalMemoryMb || 256} MB</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">CPU CORES</span>
              <strong className="text-sm text-sky-400">{cloudInfo?.availableProcessors || 2}</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">ACTIVE THREADS</span>
              <strong className="text-sm text-emerald-400">{cloudInfo?.activeThreads || 14}</strong>
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-3 p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulation Benchmark Complete</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Initial Stock:</span>
                  <strong className="text-white text-xs">{result.initialStock} units</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Final Stock:</span>
                  <strong className="text-emerald-400 text-xs">{result.finalStock} units</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Orders Placed:</span>
                  <strong className="text-white text-xs">{result.ordersSuccessfullyPlaced}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Execution Latency:</span>
                  <strong className="text-sky-400 text-xs">{result.totalExecutionTimeMs} ms</strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs">
                <strong>Verdict: </strong> {result.concurrencyVerdict}
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Demonstrates Spring Boot's transaction isolation level under concurrent burst load.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
          >
            Close Simulator
          </button>
        </div>

      </div>
    </div>
  );
}
