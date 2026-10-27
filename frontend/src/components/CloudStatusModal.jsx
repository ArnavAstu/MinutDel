import React from 'react';
import { X, Server, Database, HardDrive, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function CloudStatusModal({ isOpen, onClose, cloudInfo }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-yellow" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                Cloud Architecture Report
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <h2 className="text-xl font-black">MinutDel Cloud Infrastructure</h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time status of backend services and AWS Free Tier mapping
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Service Cards */}
          <div className="grid grid-cols-1 gap-3">
            
            {/* Compute */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Compute Service (EC2)</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    ONLINE
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Host: <span className="font-mono font-semibold text-slate-700">{cloudInfo?.hostName || 'localhost'}</span>
                </p>
                <p className="text-slate-500">
                  Profile: <span className="font-semibold text-slate-700">{cloudInfo?.environment || 'Local Mode'}</span>
                </p>
              </div>
            </div>

            {/* Storage */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <HardDrive className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Object Storage (Amazon S3)</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    cloudInfo?.awsS3Enabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {cloudInfo?.awsS3Enabled ? 'AWS S3 LIVE' : 'LOCAL ASSET MODE'}
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Bucket: <span className="font-mono font-semibold text-slate-700">{cloudInfo?.s3Bucket || 'minutdel-product-assets'}</span>
                </p>
                <p className="text-slate-500">
                  Media: Grocery product images streamed from S3
                </p>
              </div>
            </div>

            {/* Database */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Database Layer</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    CONNECTED
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Engine: <span className="font-semibold text-slate-700">{cloudInfo?.databaseType || 'H2 Embedded SQL'}</span>
                </p>
                <p className="text-slate-500">
                  Target Cloud: Amazon RDS PostgreSQL (Free Tier `db.t3.micro`)
                </p>
              </div>
            </div>

          </div>

          {/* AWS Free Tier Guarantee Checklist */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 space-y-2">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>AWS Free Tier Compliance Checklist</span>
            </h4>
            <div className="grid grid-cols-1 gap-1 text-[11px] text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>EC2 t2.micro/t3.micro: 750 hrs/month (100% Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Amazon S3: 5 GB Standard Object Storage (100% Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero-downtime Spring Boot Actuator monitoring</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}
