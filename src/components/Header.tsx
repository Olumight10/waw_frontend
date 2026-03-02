import { useState } from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import RegistrationSuccessModal from './RegistrationSuccessModal';

export default function RegistrationLayout() {

  const [showModal, setShowModal] = useState(false);
  const [credentials, setCredentials] = useState({ code: '', pass: '' });
  
  // Create state for all form fields
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    country: '',
    city_state: '',
    chapter: '',
    special_requirements: ''
  });

  const handleCompleteRegistration = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setCredentials({ code: data.unique_code, pass: data.password });
        setShowModal(true);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Submission failed", error);
    }
  };



  return (
    <section className="max-w-6xl mx-auto px-4 -mt-10 mb-20 relative z-20 space-y-8">
      
      {/* ROW 1: WHY ATTEND & QUICK REGISTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Why Attend? */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-church-gold">
          <h3 className="font-serif text-church-purple text-lg mb-4">Why Attend?</h3>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <span className="text-church-purple">📅</span>
              <div>
                <p className="font-bold">Prophetic Alignment</p>
                <p className="text-gray-500 text-xs">Receive clarity on God's agenda for the season.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-church-purple">👥</span>
              <div>
                <p className="font-bold">Fellowship</p>
                <p className="text-gray-500 text-xs">Connect with intercessors from around the globe.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Member Quick Register */}
        <div className="lg:col-span-2 bg-church-purple p-8 rounded-lg shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-church-gold/20 p-1 rounded-full text-church-gold text-xs">⚡</span>
              <h3 className="font-bold">Member Quick Register </h3>
            </div>
            <p className="text-xs text-gray-300 mb-6">
              Already a registered member with a Unique Code? Enter your code below to instantly retrieve your details. 
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* ADD THE 'dark' PROP HERE */}
              <FormInput 
                label="MEMBER UNIQUE CODE" 
                placeholder="e.g. WAW-8821-NG" 
                dark 
              />
              <FormSelect 
                label="SELECT EVENT" 
                options={["16th International Leadership..."]} 
                dark 
              />
              <button className="bg-church-gold text-white py-3 px-4 rounded-sm text-[10px] font-bold hover:bg-orange-600 transition-all uppercase shadow-lg">
                Verify & Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-4">
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
        <span className="text-[10px] font-bold text-gray-400 border rounded-full px-2 py-1 bg-white uppercase">OR</span>
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
      </div>

      {/* ROW 2: EVENT DETAILS & NEW REGISTRATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Selected Event Sidebar */}
        <div className="bg-church-purple p-6 rounded-lg text-white space-y-4 shadow-lg">
          <p className="text-[10px] font-bold text-church-gold uppercase tracking-widest">Selected Event</p>
          <h4 className="font-serif text-xl leading-tight">16th International Leadership Summit 2026</h4>
          <div className="space-y-3 text-xs text-gray-300 pt-4">
            <p className="flex items-center gap-2">📅 4th - 8th February, 2026</p>
            <p className="flex items-center gap-2">📍 La Palm Royale Beach Hotel, Accra, Ghana</p>
            <p className="flex items-center gap-2">🕒 09:00 AM Daily</p>
          </div>
        </div>

{/* New Registration Form (Wider) */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-2xl p-10 border border-gray-100">
          <h2 className="text-3xl font-serif text-church-purple mb-8 pb-4 border-b border-gray-100">New Registration</h2>
          
          <div className="bg-pink-50/40 p-6 rounded-md mb-10 border border-pink-100/50">
            <FormSelect label="SELECT EVENT" options={["16th International Leadership Summit 2026"]} required />
          </div>

          <div className="space-y-10">
            {/* Personal Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-6 text-church-purple font-bold text-[11px] tracking-widest uppercase">
                <span>👤 PERSONAL INFORMATION</span>
              </div>
              <div className="space-y-6">
                <FormInput label="FULL NAME" placeholder="e.g. Jane Doe" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="EMAIL ADDRESS" placeholder="e.g. jane@example.com" />
                  <FormInput label="PHONE NUMBER" placeholder="e.g. +1 234 567 8900" />
                </div>
                <FormSelect label="SELECT CHAPTER" options={["Select your local chapter"]} />
              </div>
            </div>

            {/* Location Details Section */}
            <div>
              <div className="flex items-center gap-2 mb-6 text-church-purple font-bold text-[11px] tracking-widest uppercase">
                <span>📍 LOCATION DETAILS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect label="COUNTRY" options={["Select Country"]} />
                <FormInput label="CITY / STATE" placeholder="e.g. Lagos" required />
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <label className="text-[10px] font-bold text-church-purple uppercase tracking-widest block mb-3">
                SPECIAL REQUIREMENTS / PRAYER REQUEST
              </label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-200 rounded-sm p-4 text-sm min-h-[140px] focus:outline-none focus:border-church-purple/30 focus:ring-1 focus:ring-church-purple/10 transition-all"
                placeholder="Any dietary restrictions, special needs, or specific prayer points..."
              ></textarea>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-100 gap-4">
            <p className="text-[10px] text-gray-400 italic">* Required fields</p>
            <button className="w-full md:w-auto bg-church-gold text-white px-12 py-4 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-lg">
              COMPLETE REGISTRATION <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>



  );
}
