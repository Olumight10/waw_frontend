import { useState } from "react";
import { X } from "lucide-react"; // [cite: 1068]
import RecoveryForm from "./RecoveryForm";

interface AccountExistsModalProps {
  uniqueCode: string;
  onLoginSuccess: (code: string) => void;
  onClose: () => void; // Added onClose prop
}

export default function AccountExistsModal({ uniqueCode, onLoginSuccess, onClose }: AccountExistsModalProps) {
  const [view, setView] = useState<'login' | 'forgotPassword' | 'forgotCode'>('login');
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unique_code: uniqueCode, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      onLoginSuccess(uniqueCode);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    // Background Overlay: Clicking here triggers onClose
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal Container: stopPropagation prevents closing when clicking inside */}
      <div 
        className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border-t-8 relative ${view === 'login' ? 'border-red-500' : 'border-church-gold'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {view === 'login' ? (
          <>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-md">!</div>
              <h2 className="text-3xl font-serif text-church-purple mb-2">Account Already Exists</h2>
              <p className="text-gray-600 text-sm">Please enter your password below to continue.</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Unique Code</label>
                <input readOnly value={uniqueCode} className="w-full bg-gray-100 border border-gray-200 p-3 rounded mt-1 font-mono text-church-purple font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enter Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-gray-200 p-3 rounded mt-1 focus:border-church-gold outline-none" />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              
              <div className="flex flex-col gap-2 mt-2">
                <button onClick={() => setView('forgotPassword')} className="text-[10px] text-church-gold hover:underline text-left uppercase font-bold">Forgot Password?</button>
                <button onClick={() => setView('forgotCode')} className="text-[10px] text-church-gold hover:underline text-left uppercase font-bold">Forgot Unique Code?</button>
              </div>
            </div>

            <button onClick={handleLogin} className="w-full bg-church-purple text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg">Login</button>
          </>
        ) : (
          <RecoveryForm type={view === 'forgotPassword' ? 'password' : 'code'} onBack={() => setView('login')} />
        )}
      </div>
    </div>
  );
}