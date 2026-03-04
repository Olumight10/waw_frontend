import { useState } from "react";

interface AccountExistsModalProps {
  uniqueCode: string;
  onLoginSuccess: (code: string) => void;
}

export default function AccountExistsModal({
  uniqueCode,
  onLoginSuccess,
}: AccountExistsModalProps) {

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
        setError(data.error || "Login failed");
        return;
      }

      onLoginSuccess(uniqueCode);

    } catch (err) {
      setError("Could not connect to server");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">

      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border-t-8 border-red-500">

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-md">
            !
          </div>

          <h2 className="text-3xl font-serif text-church-purple mb-2">
            ⚠ Account Already Exists
          </h2>

          <p className="text-gray-600 text-sm">
            An account with these details is already registered.
            <br />
            Please enter your password below to continue.
          </p>
        </div>

        <div className="space-y-4 mb-6">

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Your Unique Code
            </label>
            <input
              readOnly
              value={uniqueCode}
              className="w-full bg-gray-100 border border-gray-200 p-3 rounded mt-1 font-mono text-church-purple font-bold"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-700">
            Use your existing password to login.
            If this is your first time logging in, your default password is your phone number + "#".
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Enter Password
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

        <button
          onClick={handleLogin}
          className="w-full bg-church-purple text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg"
        >
          Login →
        </button>

      </div>
    </div>
  );
}