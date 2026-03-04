import { useState } from "react";

interface QuickLoginModalProps {
  uniqueCode: string;
  onSuccess: (code: string) => void;
  onClose: () => void;
}

export default function QuickLoginModal({
  uniqueCode,
  onSuccess,
  onClose,
}: QuickLoginModalProps) {

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unique_code: uniqueCode,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      onSuccess(uniqueCode);

    } catch (err) {
      setError("Could not connect to server");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">

      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border-t-8 border-church-gold">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif text-church-purple">
            Member Login
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter your password to continue.
          </p>
        </div>

        <div className="space-y-4 mb-6">

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Unique Code
            </label>
            <input
              readOnly
              value={uniqueCode}
              className="w-full bg-gray-100 border border-gray-200 p-3 rounded mt-1 font-mono text-church-purple font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-200 p-3 rounded mt-1 focus:border-church-gold outline-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-200 py-3 rounded-lg text-sm font-bold"
          >
            Cancel
          </button>

          <button
            onClick={handleLogin}
            className="w-1/2 bg-church-purple text-white py-3 rounded-lg font-bold text-sm uppercase"
          >
            Login →
          </button>
        </div>

      </div>
    </div>
  );
}