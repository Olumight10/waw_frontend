import { useState } from "react";

interface SuccessModalProps {
  uniqueCode: string;
  initialPassword: string;
  onLogin: (code: string, pass: string) => void;
}

export default function RegistrationSuccessModal({ uniqueCode, initialPassword, onLogin }: SuccessModalProps) {
  const [password, setPassword] = useState(initialPassword);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border-t-8 border-church-gold animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
          <h2 className="text-2xl font-serif text-church-purple">Registration Successful!</h2>
          <p className="text-gray-500 text-sm mt-2">Please save your login credentials below.</p>
        </div>

        <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Unique Code</label>
            <input 
              readOnly 
              value={uniqueCode} 
              className="w-full bg-white border border-gray-200 p-3 rounded mt-1 font-mono text-church-purple font-bold outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password (Phone Number)</label>
            <input 
              type="text" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-200 p-3 rounded mt-1 text-church-purple focus:border-church-gold outline-none"
            />
            <p className="text-[9px] text-gray-400 mt-2 italic">You can change your password above before proceeding.</p>
          </div>
        </div>

        <button 
          onClick={() => onLogin(uniqueCode, password)}
          className="w-full bg-church-purple text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
        >
          Proceed to Dashboard <span>→</span>
        </button>
      </div>
    </div>
  );
}