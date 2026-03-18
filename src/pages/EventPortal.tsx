import { useState, useEffect } from "react";
import PortalLayout from "../components/PortalLayout";
import { Users, Printer, Video, Lock, UserCheck, Calendar, MapPin } from "lucide-react";
import EventRegistrationModal from "../components/EventRegistrationModal";
import PrintTagModal from "../components/PrintTagModal";

export default function EventPortal() {
  return (
    <PortalLayout>
      {(user) => <EventPortalContent user={user} />}
    </PortalLayout>
  );
}

function EventPortalContent({ user }: { user: any }) {
  const [statusData, setStatusData] = useState<any>(null);
  const [regLog, setRegLog] = useState<{ myRegistration: any, registeredByMe: any[] } | null>(null);
  
  const [showRegModal, setShowRegModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    if (user?.unique_code) {
      // 1. Fetch Event Status
      fetch(`${import.meta.env.VITE_BACKEND}/api/user-event-status/${user.unique_code}`)
        .then(res => res.json())
        .then(data => setStatusData(data))
        .catch(console.error);

      // 2. Fetch Registration Log
      fetch(`${import.meta.env.VITE_BACKEND}/api/registration-log/${user.unique_code}`)
        .then(res => res.json())
        .then(data => setRegLog(data))
        .catch(console.error);
    }
  }, [user]);

  if (!statusData || !statusData.activeEvent) return <div className="p-10 text-center flex flex-col items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-church-purple border-t-transparent rounded-full animate-spin"></div></div>;

  const isOnline = statusData.method === "online";
  const event = statusData.activeEvent;

  const handleJoinOnline = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND}/api/program/join-online`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unique_code: user.unique_code })
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`Meeting ID: ${data.meeting_id}\nPassword: ${data.meeting_password}\n(In production, redirect to Zoom URI here)`);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Connection error to Zoom Interceptor");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full pb-20">
      
      {/* NEW: Dynamic Event Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-10 bg-church-purple text-white group">
        {event.pic && event.pic !== 'nil' ? (
          <img 
            src={event.pic} 
            alt={event.event_name}
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073" 
            alt="Default Theme"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-church-purple via-church-purple/80 to-transparent"></div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end min-h-[250px] md:min-h-[300px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-church-gold text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
              Active Event Portal
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif mb-4 leading-tight">
            {event.event_name}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200 font-medium">
            <span className="flex items-center gap-2">
              <Calendar size={18} className="text-church-gold"/> 
              {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={18} className="text-church-gold"/> 
              {event.location}, {event.city_state}
            </span>
          </div>
        </div>
      </div>

      {showRegModal && (
        <EventRegistrationModal 
          event={statusData.activeEvent} 
          userCode={user.unique_code} 
          onClose={() => setShowRegModal(false)} 
          onSuccess={() => {
            alert("Member Registered Successfully!");
            // Refresh Log Data
            fetch(`${import.meta.env.VITE_BACKEND}/api/registration-log/${user.unique_code}`)
              .then(res => res.json())
              .then(data => setRegLog(data));
          }}
          isRegisteringOthers={true} 
        />
      )}

      {showPrintModal && (
        <PrintTagModal 
          user={user} 
          event={statusData.activeEvent} 
          onClose={() => setShowPrintModal(false)} 
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Register Others */}
        <div onClick={() => setShowRegModal(true)} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-church-gold hover:shadow-lg transition-all group text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-church-gold transition-colors">
            <Users size={28} className="text-blue-500 group-hover:text-white" />
          </div>
          <h3 className="font-serif text-xl text-church-purple mb-2">Register Others</h3>
          <p className="text-xs text-gray-500">Pay and register for your group members.</p>
        </div>

        {/* Card 2: Print Tag */}
        <div onClick={() => setShowPrintModal(true)} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-church-gold hover:shadow-lg transition-all group text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-church-purple transition-colors">
            <Printer size={28} className="text-church-purple group-hover:text-white" />
          </div>
          <h3 className="font-serif text-xl text-church-purple mb-2">Print Access Tag</h3>
          <p className="text-xs text-gray-500">Generate your printable 1/4 A4 entrance tag.</p>
        </div>

        {/* Card 3: Online Link */}
        <div onClick={isOnline ? handleJoinOnline : undefined} className={`relative p-8 rounded-2xl border text-center transition-all ${isOnline ? 'bg-white shadow-sm border-gray-100 cursor-pointer hover:border-green-500 hover:shadow-lg group' : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'}`}>
          {!isOnline && (
            <div className="absolute inset-0 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-2xl">
              <Lock className="text-gray-500 mb-2" size={32} />
              <span className="text-xs font-bold text-gray-600 bg-white/80 px-3 py-1 rounded-full shadow-sm">Onsite Registration Detected</span>
            </div>
          )}
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
            <Video size={28} className="text-green-500 group-hover:text-white" />
          </div>
          <h3 className="font-serif text-xl text-church-purple mb-2">Join Online</h3>
          <p className="text-xs text-gray-500">Access the live stream room.</p>
        </div>
      </div>

      {/* Registration Log Section */}
      <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-serif text-church-purple mb-6 border-b pb-4">Registration Log</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* My Registration Info */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
            <h4 className="font-bold text-church-purple mb-4 flex items-center gap-2">
              <UserCheck size={18} /> My Registration Details
            </h4>
            {regLog?.myRegistration?.time ? (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-bold">Registered On:</span> 
                  <span className="text-gray-800">{new Date(regLog.myRegistration.time).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-gray-500 font-bold">Registered By:</span> 
                  <span className="text-church-purple font-mono font-bold bg-purple-100 px-2 py-0.5 rounded">
                    {regLog.myRegistration.who === user.unique_code ? 'Self' : regLog.myRegistration.who}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-bold">Status:</span> 
                  <span className="text-green-600 font-bold">Verified & Registered</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-gray-500 font-bold">Log Details:</span> 
                  <span className="text-gray-400 italic">Time/Who not captured (Legacy record)</span>
                </div>
              </div>
            )}
          </div>

          {/* People I Registered */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-church-purple mb-4 flex items-center gap-2">
              <Users size={18} /> Members I Registered
            </h4>
            {regLog?.registeredByMe && regLog.registeredByMe.length > 0 ? (
              <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {regLog.registeredByMe.map((member: any) => (
                  <li key={member.unique_code} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-church-purple">{member.full_name}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{member.unique_code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Date</p>
                      <p className="text-xs text-gray-600 font-medium">{new Date(member.time).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">You haven't registered anyone else yet.</p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}