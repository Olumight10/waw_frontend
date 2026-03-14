import { useState, useEffect } from "react";
import { ShieldCheck, Users, CheckCircle2, MapPin, Star, Shield, ClipboardCheck, Crown } from "lucide-react";
import PortalLayout from "../components/PortalLayout";

// Helper to determine badge UI based on status
const getStatusUI = (status: string) => {
  const s = (status || 'member').toLowerCase();
  if (s === 'super admin') return { icon: <Crown size={12} className="mr-1" />, color: "bg-purple-600", text: "text-white" };
  if (s === 'admin') return { icon: <Shield size={12} className="mr-1" />, color: "bg-red-600", text: "text-white" };
  if (s === 'registrar') return { icon: <ClipboardCheck size={12} className="mr-1" />, color: "bg-blue-600", text: "text-white" };
  return { icon: <Star size={12} className="mr-1" />, color: "bg-church-gold", text: "text-white" }; // Default Member
};

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(console.error);
  }, []);

  const activeEvent = events.find(e => e.status === 'Active');
  const upcomingEvents = events.filter(e => e.status === 'Upcoming');

  return (
    <PortalLayout>
      {(user) => {
        const badgeUI = getStatusUI(user.status);
        
        return (
          <div className="p-6 md:p-10 transition-all max-w-7xl mx-auto w-full">
            {/* HERO */}
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl mb-10 group bg-church-purple">
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" alt="Theme BG" />
              <div className="absolute inset-0 bg-gradient-to-r from-church-purple via-church-purple/80 to-transparent"></div>
              <div className="relative h-full flex flex-col justify-center px-8 md:px-16 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                    <ShieldCheck className="text-church-gold" size={24} />
                  </div>
                  <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase">Verified Portal</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl md:text-5xl font-serif mb-1">Shalom, </h2>
                  {/* DYNAMIC ROLE BADGE */}
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
                  <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <img src={activeEvent.pic} className="w-full h-full object-cover" alt="Event" />
                  </div>
                  <div className="flex-grow space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{activeEvent.details}</span>
                    </div>
                    <h5 className="text-xl md:text-2xl font-serif text-church-purple leading-tight">{activeEvent.event_name}</h5>
                    <p className="text-sm text-gray-500">{new Date(activeEvent.event_date).toLocaleDateString()} - {activeEvent.location}, {activeEvent.city_state}</p>
                  </div>
                  <button className="w-full md:w-auto px-6 py-3 bg-church-purple text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black shadow-lg transition-all">
                    Access Portal
                  </button>
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
      }}
    </PortalLayout>
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