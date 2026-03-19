import { useState } from "react";
import { X, CreditCard, Globe, Loader2 } from "lucide-react";
import { usePaystackPayment } from "react-paystack";

export default function EventRegistrationModal({ event, userCode, onClose, onSuccess, isRegisteringOthers = false }: any) {
  const [formData, setFormData] = useState({
    targetCode: isRegisteringOthers ? "" : userCode,
    method: "onsite",
    diet: "None",
    prayer: "",
    billingEmail: "", // Paystack requires an email for the receipt
  });

  const [selectedCurrency, setSelectedCurrency] = useState<"NGN" | "USD">("NGN");
  const EXCHANGE_RATE = 1500; // 1 USD = 1500 NGN
  
  // Base calculations
  const baseFeeNGN = parseFloat(event.event_fee);
  const displayAmountUSD = parseFloat((baseFeeNGN / EXCHANGE_RATE).toFixed(2));
  
  // Display variables based on user selection
  const amountToPayDisplay = selectedCurrency === "NGN" ? baseFeeNGN : displayAmountUSD;
  const displayString = selectedCurrency === "NGN" ? `₦${baseFeeNGN.toLocaleString()}` : `$${displayAmountUSD}`;
  
  const [loading, setLoading] = useState(false);

  // --- PAYSTACK CONFIGURATION (OPTION 1: THE QUICK FIX) ---
// Determine who is actually being registered to track it in Paystack
  const codeBeingRegistered = (isRegisteringOthers && formData.targetCode) ? formData.targetCode : userCode;

  // --- PAYSTACK CONFIGURATION (OPTION 1: THE QUICK FIX) ---
  const paystackConfig = {
    // Format: WAW_WAW-00001-NG_1710860000000 (Guarantees uniqueness even on retries)
    reference: `${codeBeingRegistered}_${new Date().getTime()}`,
    email: formData.billingEmail,
    // ALWAYS charge in NGN under the hood so Paystack doesn't block the transaction
    amount: baseFeeNGN * 100, 
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
    // ALWAYS force currency to NGN for the processor
    currency: "NGN", 
  };
  const initializePayment = usePaystackPayment(paystackConfig);

  // This runs ONLY after Paystack successfully deducts the money
  const submitToBackend = async (paymentReference: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/program/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unique_code: userCode,
          target_code: formData.targetCode,
          method: formData.method,
          diet: formData.diet,
          prayer: formData.prayer,
          amount_paid: amountToPayDisplay, // Send the amount they selected to the DB for accurate records
          currency: selectedCurrency,      // Record the currency they chose
          payment_reference: paymentReference 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        alert(data.error || "Payment succeeded, but registration failed. Contact support with your receipt.");
      }
    } catch (err) {
      alert("Network Error: Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  // Triggered when user clicks "Pay"
  const handlePaymentInitiation = () => {
    if (!formData.billingEmail) {
      alert("Please provide a billing email address to receive your receipt.");
      return;
    }
    if (isRegisteringOthers && !formData.targetCode) {
      alert("Please enter the unique code of the member you are registering.");
      return;
    }

    // Launch the Paystack Modal
    initializePayment({
      onSuccess: (paymentResult: any) => {
        // paymentResult.reference contains the successful transaction ID
        submitToBackend(paymentResult.reference);
      },
      onClose: () => {
        alert("Payment window closed. Your account has not been charged.");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 border-t-8 border-church-gold relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-serif text-church-purple mb-2">
          {isRegisteringOthers ? "Register Another Member" : "Complete Registration"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">{event.event_name}</p>

        <div className="space-y-4">
          {isRegisteringOthers && (
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Member Unique Code</label>
              <input 
                type="text" 
                value={formData.targetCode} 
                onChange={(e) => setFormData({...formData, targetCode: e.target.value.toUpperCase()})} 
                className="w-full border border-gray-200 p-3 rounded mt-1 focus:border-church-gold outline-none uppercase placeholder:lowercase" 
                placeholder="e.g. WAW-00001-NG" 
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              Billing Email <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              value={formData.billingEmail} 
              onChange={(e) => setFormData({...formData, billingEmail: e.target.value})} 
              className="w-full border border-gray-200 p-3 rounded mt-1 focus:border-church-gold outline-none" 
              placeholder="Where should we send the receipt?" 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Attendance Method</label>
            <select value={formData.method} onChange={(e) => setFormData({...formData, method: e.target.value})} className="w-full border border-gray-200 p-3 rounded mt-1 outline-none cursor-pointer">
              <option value="onsite">Onsite (Physical)</option>
              <option value="online">Online (Virtual)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dietary Specifications</label>
            <input type="text" value={formData.diet} onChange={(e) => setFormData({...formData, diet: e.target.value})} className="w-full border border-gray-200 p-3 rounded mt-1 focus:border-church-gold outline-none" placeholder="e.g. Vegetarian, None" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prayer Request</label>
            <textarea value={formData.prayer} onChange={(e) => setFormData({...formData, prayer: e.target.value})} className="w-full border border-gray-200 p-3 rounded mt-1 focus:border-church-gold outline-none" rows={3} placeholder="Drop your expectations..."></textarea>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-600">Total Fee</span>
              <span className="text-2xl font-serif text-church-purple">{displayString}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedCurrency("NGN")} className={`flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 border transition-all ${selectedCurrency === 'NGN' ? 'bg-church-purple text-white' : 'bg-white text-gray-500'}`}>
                <CreditCard size={14} /> Pay Local (NGN)
              </button>
              <button onClick={() => setSelectedCurrency("USD")} className={`flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 border transition-all ${selectedCurrency === 'USD' ? 'bg-church-gold text-white' : 'bg-white text-gray-500'}`}>
                <Globe size={14} /> Pay Intl (USD)
              </button>
            </div>
          </div>

          <button 
            onClick={handlePaymentInitiation} 
            disabled={loading || (isRegisteringOthers && !formData.targetCode)} 
            className="w-full bg-church-gold text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Verifying...</>
            ) : (
              `Pay ${displayString}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}