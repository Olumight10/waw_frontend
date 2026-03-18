import { useState, useEffect } from "react";
import { ShieldCheck, Users, CheckCircle2, MapPin, Star, Shield, ClipboardCheck, Crown, XCircle, Loader2 } from "lucide-react";
import PortalLayout from "../components/PortalLayout";
import { useNavigate } from "react-router-dom";
import EventRegistrationModal from "../components/EventRegistrationModal";

const getStatusUI = (status: string) => {
  const s = (status || 'member').toLowerCase();
  if (s === 'super admin') return { icon: <Crown size={12} className="mr-1" />, color: "bg-purple-600", text: "text-white" };
  if (s === 'admin') return { icon: <Shield size={12} className="mr-1" />, color: "bg-red-600", text: "text-white" };
  if (s === 'registrar') return { icon: <ClipboardCheck size={12} className="mr-1" />, color: "bg-blue-600", text: "text-white" };
  return { icon: <Star size={12} className="mr-1" />, color: "bg-church-gold", text: "text-white" }; 
};

export default function Dashboard() {
  return (
    <PortalLayout>
      {(user) => <DashboardContent user={user} />}
    </PortalLayout>
  );
}

function DashboardContent({ user }: { user: any }) {
  const [events, setEvents] = useState<any[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [showRegModal, setShowRegModal] = useState(false);
  const navigate = useNavigate();

  // Fetch all events
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(console.error);
  }, []);

  // Fetch specific event registration status on load
  useEffect(() => {
    if (user?.unique_code) {
       setIsLoadingStatus(true);
       fetch(`${import.meta.env.VITE_BACKEND}/api/user-event-status/${user.unique_code}`)
        .then(res => res.json())
        .then(data => {
            setIsRegistered(data.isRegistered === true);
            setIsLoadingStatus(false);
        })
        .catch(err => {
            console.error(err);
            setIsLoadingStatus(false);
        });
    }
  }, [user]);

  const activeEvent = events.find(e => e.status === 'Active');
  const upcomingEvents = events.filter(e => e.status === 'Upcoming');
  const badgeUI = getStatusUI(user.status);

  return (
    <div className="p-6 md:p-10 transition-all max-w-7xl mx-auto w-full relative">
      
      {showRegModal && activeEvent && (
         <EventRegistrationModal 
            event={activeEvent} 
            userCode={user.unique_code}
            onClose={() => setShowRegModal(false)}
            onSuccess={() => setIsRegistered(true)}
         />
      )}

      {/* HERO */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl mb-10 group bg-church-purple">
        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" alt="Theme BG" />
        <div className="absolute inset-0 bg-gradient-to-r from-church-purple via-church-purple/80 to-transparent"></div>
        <div className="relative h-full flex flex-col justify-center px-8 md:px-16 text-white">
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Restored Static Verified Portal Badge ONLY */}
            <div className="flex items-center gap-2">
               <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-sm">
                 <ShieldCheck className="text-church-gold" size={20} />
               </div>
               <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase shadow-sm">
                 Verified Portal
               </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <h2 className="text-3xl md:text-5xl font-serif mb-1">Shalom, </h2>
            <span className={`flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md ${badgeUI.color} ${badgeUI.text}`}>
              {badgeUI.icon} {user.status || 'Member'}
            </span>
          </div>
          <h3 className="text-2xl md:text-4xl font-bold text-church-gold uppercase tracking-tight">{user.full_name}</h3>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Member ID</span>
              <p className="text-white/80 font-mono text-sm tracking-widest">{user.unique_code}</p>
            </div>
          </div>
        </div>
        <Users className="absolute right-10 bottom-[-20px] text-white/5 w-64 h-64 rotate-12" />
      </div>

      {/* ACTIVE PROGRAM SECTION */}
      {activeEvent && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-church-gold rounded-full"></div>
            <h4 className="text-lg font-serif text-church-purple font-bold">Active Program</h4>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center group hover:border-church-gold/30 transition-all">
            <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-gray-100 relative">
              <img src={activeEvent.pic} className="w-full h-full object-cover" alt="Event" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[9px] font-bold text-church-purple uppercase tracking-widest">Active Now</span>
              </div>
            </div>
            
            <div className="flex-grow space-y-3">
              {/* Dynamic Registration Status Badge moved here */}
              <div className="flex items-center gap-3">
                {isLoadingStatus ? (
                   <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 w-fit">
                     <Loader2 size={12} className="animate-spin" /> Checking Status...
                   </div>
                ) : (
                   <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase w-fit shadow-sm ${isRegistered ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                     {isRegistered ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                     {isRegistered ? 'Registered and Verified' : 'Not Registered'}
                   </div>
                )}
              </div>

              <h5 className="text-xl md:text-2xl font-serif text-church-purple leading-tight">{activeEvent.event_name}</h5>
              <p className="text-sm text-gray-500">{new Date(activeEvent.event_date).toLocaleDateString()} • {activeEvent.location}, {activeEvent.city_state}</p>
            </div>
            
            {/* Dynamic Button with Loading Guard */}
            {isLoadingStatus ? (
              <button disabled className="w-full md:w-auto px-6 py-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm cursor-not-allowed flex items-center justify-center gap-2 transition-all">
                <Loader2 size={16} className="animate-spin" /> Verifying...
              </button>
            ) : isRegistered ? (
              <button onClick={() => navigate('/portal')} className="w-full md:w-auto px-6 py-3 bg-church-purple text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black shadow-lg transition-all">
                Access Portal
              </button>
            ) : (
              <button onClick={() => setShowRegModal(true)} className="w-full md:w-auto px-6 py-3 bg-church-gold text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 shadow-lg transition-all">
                REGISTER
              </button>
            )}
            
          </div>
        </section>
      )}
      
      {/* UPCOMING PROGRAMS SECTION */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-gray-300 rounded-full"></div>
          <h4 className="text-lg font-serif text-church-purple font-bold">Upcoming Programs</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map(evt => (
            <ProgramCard key={evt.id} title={evt.event_name} date={new Date(evt.event_date).toLocaleDateString()} location={evt.location} imageUrl={evt.pic} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProgramCard({ title, date, location, imageUrl }: { title: string, date: string, location: string, imageUrl: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
          <p className="text-[10px] font-bold text-church-purple uppercase tracking-wider">{date}</p>
        </div>
        <div className="absolute top-3 right-3 bg-church-gold/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
          <span className="text-[9px] font-bold text-white uppercase tracking-wider">Upcoming</span>
        </div>
      </div>
      <div className="p-5">
        <h6 className="font-serif text-lg text-church-purple leading-snug mb-2 line-clamp-2">{title}</h6>
        <div className="flex items-start gap-2 mb-4">
          <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-500 line-clamp-1">{location}</p>
        </div>
        <div className="flex items-center justify-between">
          <button className="px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest transition-all border border-church-purple text-church-purple hover:bg-church-purple hover:text-white">
            VIEW DETAILS
          </button>
        </div>
      </div>
    </div>
  );
}