import React, { useState } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Building2, 
  ShieldCheck, 
  Lock, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  customerName,
  customerEmail,
  onPaymentSuccess
}) {
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState(null);
  const [simulateFailure, setSimulateFailure] = useState(false);

  // UPI State
  const [upiId, setUpiId] = useState(customerEmail ? `${customerEmail.split('@')[0]}@okaxis` : 'demo@okaxis');

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardHolder, setCardHolder] = useState(customerName || 'Arnav Astu');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isOpen) return null;

  const handleFillTestCard = () => {
    setCardNumber('4111 •••• •••• 1111');
    setCardHolder(customerName || 'Test Customer');
    setCardExpiry('08/29');
    setCardCvv('123');
  };

  const handleProcessPayment = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      setProcessingStep('1/3: Contacting Mock Banking Gateway...');
      await new Promise(r => setTimeout(r, 600));

      setProcessingStep('2/3: Simulating 2FA OTP & Token Verification...');
      await new Promise(r => setTimeout(r, 700));

      setProcessingStep('3/3: Authorizing Transaction on AWS Sandbox...');
      
      let methodLabel = 'ONLINE_MOCK_UPI';
      let detailsLabel = upiId;
      if (activeTab === 'card') {
        methodLabel = 'ONLINE_MOCK_CARD';
        detailsLabel = `Card ending in ${cardNumber.slice(-4)}`;
      } else if (activeTab === 'netbanking') {
        methodLabel = 'ONLINE_MOCK_NETBANKING';
        detailsLabel = selectedBank;
      }

      const res = await fetch('/api/payments/mock-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          paymentMethod: methodLabel,
          paymentDetails: detailsLabel,
          customerEmail: customerEmail,
          simulateFailure: simulateFailure
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Payment simulation declined by bank.');
      }

      setProcessingStep('Payment Authorized! Confirming order...');
      await new Promise(r => setTimeout(r, 400));

      onPaymentSuccess({
        paymentMethod: methodLabel,
        paymentStatus: 'PAID',
        transactionId: data.transactionId
      });
      onClose();

    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
        onClick={!isProcessing ? onClose : undefined} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-yellow to-amber-300 flex items-center justify-center text-slate-950 shadow-md">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-tight text-white">MinutDel MockPay</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  TEST GATEWAY
                </span>
              </div>
              <p className="text-xs text-slate-400">Simulated 256-bit Payment Gateway (Razorpay/Stripe Style)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-600 block">Total Amount to Authorize</span>
            <span className="text-xl font-black text-slate-950">₹{amount?.toFixed(2)}</span>
          </div>
          <div className="text-right text-[11px] text-emerald-800 font-medium">
            <span className="font-bold flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Mock Sandbox
            </span>
            <span className="text-slate-500 text-[10px]">No real card will be charged</span>
          </div>
        </div>

        {/* Error notification if failed */}
        {error && (
          <div className="m-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <div className="flex-1 font-medium">{error}</div>
            <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 font-bold text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Payment Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => setActiveTab('upi')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'upi'
                ? 'border-brand-green text-brand-green bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI / QR</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'card'
                ? 'border-brand-green text-brand-green bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('netbanking')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'netbanking'
                ? 'border-brand-green text-brand-green bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Net Banking</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {activeTab === 'upi' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {/* Simulated QR Pattern */}
                <div className="w-28 h-28 bg-white p-2 rounded-xl border border-slate-300 shadow-xs flex flex-col items-center justify-center text-center shrink-0">
                  <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center text-white font-mono text-[9px] relative overflow-hidden">
                    <div className="absolute inset-1 grid grid-cols-5 gap-1 p-1">
                      <div className="bg-brand-yellow rounded-xs col-span-2 row-span-2"></div>
                      <div className="bg-emerald-400 rounded-xs col-span-1"></div>
                      <div className="bg-white rounded-xs col-span-2 row-span-2"></div>
                      <div className="bg-white rounded-xs"></div>
                      <div className="bg-brand-yellow rounded-xs col-span-2 row-span-2"></div>
                      <div className="bg-emerald-400 rounded-xs"></div>
                      <div className="bg-white rounded-xs col-span-2"></div>
                    </div>
                    <span className="relative z-10 bg-slate-900/90 px-1 py-0.5 rounded text-[8px] font-bold text-brand-yellow">
                      SCAN QR
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 font-semibold">GPay • PhonePe</span>
                </div>

                <div className="space-y-2 text-left flex-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Or Enter Mock UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none"
                    placeholder="username@okhdfcbank"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['@okaxis', '@okhdfc', '@ybl', '@paytm'].map((suffix) => (
                      <button
                        key={suffix}
                        type="button"
                        onClick={() => setUpiId(`customer${suffix}`)}
                        className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded-md font-semibold text-slate-700 transition"
                      >
                        {suffix}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Mock Card Details</span>
                <button
                  type="button"
                  onClick={handleFillTestCard}
                  className="text-[11px] font-bold text-brand-green hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto-fill Test Card
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-brand-green outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-brand-green outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">CVV / CVC</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-brand-green outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Cardholder Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Name on Card"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-brand-green outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'netbanking' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Select Popular Bank</label>
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                      selectedBank === bank
                        ? 'border-brand-green bg-emerald-50/50 text-brand-green'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span>{bank}</span>
                    {selectedBank === bank && <CheckCircle2 className="w-4 h-4 text-brand-green" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Test Option: Failure Simulation toggle */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span>Simulate Bank Failure (for demo testing)</span>
            </label>
          </div>
        </div>

        {/* Processing State Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-brand-green mb-4">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base mb-1">Processing Mock Payment</h4>
            <p className="text-xs text-brand-green font-bold mb-3">{processingStep}</p>
            <p className="text-[11px] text-slate-400 max-w-xs">
              Simulating banking network handshake, tokenization, and AWS SES billing trigger...
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProcessPayment}
            disabled={isProcessing}
            className="flex-2 py-3 px-4 bg-brand-green hover:bg-brand-darkgreen font-extrabold text-xs text-white rounded-xl shadow-lg shadow-brand-green/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Pay ₹{amount?.toFixed(2)} (Authorize & Place Order)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
