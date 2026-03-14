import { useState } from "react";
import { X } from "lucide-react";
import RecoveryForm from "./RecoveryForm";

interface QuickLoginModalProps {
  uniqueCode: string;
  onSuccess: (code: string) => void;
  onClose: () => void;
}

export default function QuickLoginModal({ uniqueCode, onSuccess, onClose }: QuickLoginModalProps) {
  const [view, setView] = useState<'login' | 'forgotPassword' | 'forgotCode'>('login');
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added Loading State

  const handleLogin = async () => {
    setError("");
    setLoading(true); // Disable buttons
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unique_code: uniqueCode, password }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Invalid credentials");
      
      onSuccess(uniqueCode);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false); // Enable buttons
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={!loading ? onClose : undefined}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border-t-8 border-church-gold relative" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={20} />
        </button>

        {view === 'login' ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif text-church-purple">Member Login</h2>
              <p className="text-gray-500 text-sm mt-2">Enter your password to continue.</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unique Code</label>
                <input readOnly value={uniqueCode} className="w-full bg-gray-100 border border-gray-200 p-3 rounded mt-1 font-mono text-church-purple font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={loading}
                  className="w-full bg-white border border-gray-200 p-3 rounded mt-1 focus:border-church-gold outline-none disabled:bg-gray-100 disabled:cursor-not-allowed" 
                />
              </div>
              
              {error && <p className="text-red-500 text-xs">{error}</p>}
              
              <div className="flex flex-col gap-2">
                <button onClick={() => setView('forgotPassword')} disabled={loading} className="text-[10px] text-church-gold hover:underline text-left uppercase font-bold disabled:opacity-50 disabled:cursor-not-allowed">Forgot Password?</button>
                <button onClick={() => setView('forgotCode')} disabled={loading} className="text-[10px] text-church-gold hover:underline text-left uppercase font-bold disabled:opacity-50 disabled:cursor-not-allowed">Forgot Unique Code?</button>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={onClose} 
                disabled={loading} 
                className="w-1/2 bg-gray-200 py-3 rounded-lg text-sm font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogin} 
                disabled={loading} 
                className={`w-1/2 text-white py-3 rounded-lg font-bold text-sm uppercase transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-church-purple hover:bg-black'}`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </>
        ) : (
          <RecoveryForm type={view === 'forgotPassword' ? 'password' : 'code'} onBack={() => setView('login')} />
        )}
      </div>
    </div>
  );
}