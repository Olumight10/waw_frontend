import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import RegistrationSuccessModal from "./RegistrationSuccessModal";
import AccountExistsModal from "./AccountExistsModal";
import QuickLoginModal from "./QuickLoginModal";

export default function RegistrationLayout() {
  const navigate = useNavigate();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showExistsModal, setShowExistsModal] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [credentials, setCredentials] = useState({ code: "", pass: "" });
  const [quickRegister, setQuickRegister] = useState({ member_code: "", event: "None" });
  
  // New loading states
  const [isRegistering, setIsRegistering] = useState(false);
  const [isQuickVerifying, setIsQuickVerifying] = useState(false);

  // Removed special_requirements
  const [formData, setFormData] = useState({
    full_name: "", email: "", phone_number: "", country: "Nigeria", city_state: "", chapter: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickChange = (field: string, value: string) => {
    setQuickRegister((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickVerify = () => {
    if (!quickRegister.member_code) {
      alert("Please enter your unique code.");
      return;
    }
    setIsQuickVerifying(true);
    // Simulate slight delay to show loading state before modal pops
    setTimeout(() => {
      setIsQuickVerifying(false);
      setShowQuickModal(true);
    }, 500);
  };

  const handleLoginAfterReg = async (code: string, finalPass: string) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND}/api/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unique_code: code, password: finalPass }),
      });
      localStorage.setItem("user_code", code);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleCompleteRegistration = async () => {
    setIsRegistering(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (response.status === 409 && data.existing) {
        setCredentials({ code: data.unique_code, pass: formData.phone_number });
        setShowExistsModal(true);
        setIsRegistering(false);
        return;
      }
      
      if (response.ok) {
        setCredentials({ code: data.unique_code, pass: data.password });
        setShowSuccessModal(true);
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the server.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 -mt-10 mb-20 relative z-20 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-church-gold">
          <h3 className="font-serif text-church-purple text-lg mb-4">Why Attend?</h3>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3"><span className="text-church-purple">01</span><div><p className="font-bold">Prophetic Alignment</p><p className="text-gray-500 text-xs">Receive clarity on God's agenda.</p></div></div>
            <div className="flex gap-3"><span className="text-church-purple">02</span><div><p className="font-bold">Fellowship</p><p className="text-gray-500 text-xs">Connect with intercessors.</p></div></div>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-church-purple p-8 rounded-lg shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold mb-4">Member Quick Register</h3>
            <p className="text-xs text-gray-300 mb-6">Already a registered member?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <FormInput label="MEMBER UNIQUE CODE" placeholder="e.g. WAW-00001-NG" value={quickRegister.member_code} onChange={(val) => handleQuickChange("member_code", val)} dark />
              <FormSelect label="SELECT EVENT" options={["None", "16th International Leadership Summit 2026"]} value={quickRegister.event} onChange={(val) => handleQuickChange("event", val)} dark />
              <button 
                onClick={handleQuickVerify} 
                disabled={isQuickVerifying}
                className={`text-white py-3 px-4 rounded-sm text-[10px] font-bold uppercase shadow-lg transition-all ${isQuickVerifying ? 'bg-gray-500 cursor-not-allowed' : 'bg-church-gold hover:bg-orange-600'}`}
              >
                {isQuickVerifying ? 'Verifying...' : 'Verify & Pay'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-4">
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
        <span className="text-[10px] text-gray-400 border rounded-full px-2 py-1 bg-white uppercase font-bold">OR</span>
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-church-purple p-6 rounded-lg text-white space-y-4 shadow-lg">
          <p className="text-[10px] text-church-gold uppercase tracking-widest font-bold">Selected Event</p>
          <h4 className="font-serif text-xl leading-tight">16th International Leadership Summit 2026</h4>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-lg shadow-2xl p-10 border border-gray-100">
          <h2 className="text-3xl font-serif text-church-purple mb-8 pb-4 border-b border-gray-100">New Registration</h2>
          <div className="space-y-10">
            <div>
              <div className="text-church-purple font-bold text-[11px] tracking-widest uppercase mb-6">PERSONAL INFORMATION</div>
              <div className="space-y-6">
                <FormInput label="FULL NAME" placeholder="e.g. Jane Doe" value={formData.full_name} onChange={(val) => handleChange("full_name", val)} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="EMAIL ADDRESS" placeholder="e.g. jane@example.com" value={formData.email} onChange={(val) => handleChange("email", val)} required />
                  <FormInput label="PHONE NUMBER" placeholder="e.g. +234 800 000 0000" value={formData.phone_number} onChange={(val) => handleChange("phone_number", val)} required />
                </div>
                <FormSelect label="SELECT CHAPTER" options={["Lagos Mainland", "Lagos Island", "Accra Central", "London North"]} value={formData.chapter} onChange={(val) => handleChange("chapter", val)} />
              </div>
            </div>
            
            <div>
              <div className="text-church-purple font-bold text-[11px] tracking-widest uppercase mb-6">LOCATION DETAILS</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect label="COUNTRY" options={["Nigeria", "Ghana", "United Kingdom", "USA", "Canada"]} value={formData.country} onChange={(val) => handleChange("country", val)} required />
                <FormInput label="CITY / STATE" placeholder="e.g. Lagos" value={formData.city_state} onChange={(val) => handleChange("city_state", val)} required />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-100 gap-4">
            <p className="text-[10px] text-gray-400 italic">* Required fields</p>
            <button 
              onClick={handleCompleteRegistration}
              disabled={isRegistering}
              className={`w-full md:w-auto text-white px-12 py-4 rounded-sm font-bold text-xs uppercase transition-all shadow-lg ${isRegistering ? 'bg-gray-400 cursor-not-allowed' : 'bg-church-gold hover:bg-orange-600'}`}
            >
              {isRegistering ? 'PROCESSING...' : 'COMPLETE REGISTRATION'}
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showSuccessModal && <RegistrationSuccessModal uniqueCode={credentials.code} initialPassword={credentials.pass} onLogin={handleLoginAfterReg} onClose={() => setShowSuccessModal(false)} />}
      {showExistsModal && <AccountExistsModal uniqueCode={credentials.code} onLoginSuccess={(code) => { localStorage.setItem("user_code", code); navigate("/dashboard"); }} onClose={() => setShowExistsModal(false)} />}
      {showQuickModal && <QuickLoginModal uniqueCode={quickRegister.member_code} onSuccess={(code) => { localStorage.setItem("user_code", code); navigate("/dashboard"); }} onClose={() => setShowQuickModal(false)} />}
    </section>
  );
}