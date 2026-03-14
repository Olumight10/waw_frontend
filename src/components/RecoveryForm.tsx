import { useState } from "react";
import FormInput from "./FormInput";

interface RecoveryFormProps {
  type: 'password' | 'code';
  onBack: () => void;
}

export default function RecoveryForm({ type, onBack }: RecoveryFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [recoveredCode, setRecoveredCode] = useState("");
  const [fields, setFields] = useState({
    unique_code: "",
    full_name: "",
    email: "",
    phone_number: "",
    password: "", // Only for forgot-code
    new_password: "" // Only for forgot-password
  });

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    
    const endpoint = type === 'password' ? '/api/forgot-password' : '/api/forgot-code';
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Verification failed");
      
      if (type === 'password') {
        setMessage("Password updated successfully! You can now login.");
      } else {
        setRecoveredCode(data.unique_code);
        setMessage("Account Found!");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="text-center mb-4">
        <h3 className="font-serif text-church-purple text-xl">
          {type === 'password' ? 'Reset Password' : 'Find Unique Code'}
        </h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
          Provide at least 3 details to verify your identity
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded text-xs ${recoveredCode ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
          {message} {recoveredCode && <strong className="block mt-1 text-sm font-mono">{recoveredCode}</strong>}
        </div>
      )}

      {error && <div className="p-3 bg-red-50 text-red-600 rounded text-xs">{error}</div>}

      {!recoveredCode && (
        <div className={`grid grid-cols-1 gap-3 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
          {type === 'password' && (
            <FormInput label="Unique Code" value={fields.unique_code} onChange={(v) => setFields({...fields, unique_code: v})} />
          )}
          <FormInput label="Full Name" value={fields.full_name} onChange={(v) => setFields({...fields, full_name: v})} />
          <FormInput label="Email Address" value={fields.email} onChange={(v) => setFields({...fields, email: v})} />
          <FormInput label="Phone Number" value={fields.phone_number} onChange={(v) => setFields({...fields, phone_number: v})} />
          
          {type === 'code' && (
            <FormInput label="Current Password" value={fields.password} onChange={(v) => setFields({...fields, password: v})} />
          )}
          {type === 'password' && (
            <FormInput label="Set New Password" value={fields.new_password} onChange={(v) => setFields({...fields, new_password: v})} />
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 mt-6">
        {!recoveredCode && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-bold text-xs uppercase shadow-lg transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-church-gold hover:bg-orange-600'}`}
          >
            {loading ? "Verifying..." : "Verify & Process"}
          </button>
        )}
        <button
          onClick={onBack}
          disabled={loading}
          className="text-xs text-gray-400 hover:text-church-purple transition-colors uppercase font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}