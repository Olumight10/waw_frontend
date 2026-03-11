import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react"; // [cite: 1068]

interface SuccessModalProps {
  uniqueCode: string;
  initialPassword: string;
  onLogin: (code: string, pass: string) => void;
  onClose: () => void;
}

export default function RegistrationSuccessModal({ uniqueCode, initialPassword, onLogin, onClose }: SuccessModalProps) {
  const [password, setPassword] = useState(initialPassword);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border-t-8 border-church-gold animate-in fade-in zoom-in duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif text-church-purple mb-2">Welcome! Registration Complete</h2>
          <p className="text-gray-600 text-sm">Please save your login credentials carefully.</p>
        </div>

        <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Unique Code</label>
            <input readOnly value={uniqueCode} className="w-full bg-white border border-gray-200 p-3 rounded mt-1 font-mono text-church-purple font-bold outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password (Phone Number)</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-gray-200 p-3 rounded mt-1 text-church-purple focus:border-church-gold outline-none" />
          </div>
        </div>

        <button 
          onClick={() => onLogin(uniqueCode, password)}
          className="w-full bg-church-purple text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg"
        >
          Proceed to Dashboard
        </button>
      </div>
    </div>
  );
}