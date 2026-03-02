import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, Bell, X, LogOut, LayoutDashboard, 
  UserCircle, ClipboardList, Clock, Calendar, CheckCircle2 
} from "lucide-react";

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ full_name: "Loading...", unique_code: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const savedCode = localStorage.getItem("user_code");
    if (!savedCode) {
      navigate("/");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND}/api/user/${savedCode}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) navigate("/");
        else setUser(data);
      })
      .catch(() => console.error("Fetch error"));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      
      {/* --- SIDEBAR --- */}
      {/* The 'translate' classes here handle the collapse/expand logic */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-church-purple text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-church-gold rounded flex items-center justify-center text-church-purple font-bold">W</div>
               <span className="font-serif text-lg tracking-tight">WAW Portal</span>
            </div>
            {/* Close button for mobile */}
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white">
              <X size={20}/>
            </button>
          </div>

          <nav className="flex-grow space-y-2">
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-church-gold text-white shadow-lg font-medium">
              <LayoutDashboard size={18}/> Dashboard
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all">
              <UserCircle size={18}/> My Profile
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all">
              <ClipboardList size={18}/> My Records
            </button>
          </nav>

          <button 
            onClick={() => { localStorage.clear(); navigate("/"); }} 
            className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-auto"
          >
            <LogOut size={18}/> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className={`flex-grow flex flex-col transition-all duration-300 ${isSidebarOpen ? "blur-sm lg:blur-none" : ""}`}>
        
        {/* TOP NAV */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 lg:ml-64">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} // Opens Sidebar
              className="p-2 text-church-purple hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-church-purple/40 italic font-serif">
               <Calendar size={14} />
               <span className="text-xs">2026 Academic Year</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-church-purple transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-church-purple uppercase leading-none">{user.full_name}</p>
                <button className="text-[9px] text-church-gold font-bold hover:underline">View Profile</button>
              </div>
              <div className="w-9 h-9 rounded-full bg-church-purple border-2 border-church-gold flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user.full_name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <div className="p-6 md:p-10 lg:ml-64 transition-all">
          
          {/* HERO */}
          <div className="relative h-60 md:h-72 rounded-3xl overflow-hidden shadow-2xl mb-10 group">
            <img 
              src="https://images.unsplash.com/photo-1475483768296-6163e08872a1?q=80&w=2070" 
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Hero BG"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-church-purple via-church-purple/85 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-center px-8 md:px-12 text-white">
              <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase w-fit mb-4">Official Member Portal</span>
              <h2 className="text-3xl md:text-5xl font-serif mb-1">Shalom,</h2>
              <h3 className="text-2xl md:text-4xl font-bold text-church-gold uppercase tracking-tight">{user.full_name}</h3>
              <p className="text-white/50 font-mono mt-4 tracking-widest text-xs">{user.unique_code}</p>
            </div>
          </div>

          {/* ACTIVE PROGRAM SECTION */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-church-gold rounded-full"></div>
              <h4 className="text-lg font-serif text-church-purple font-bold">Active Program</h4>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group hover:border-church-gold/30 transition-all">
               <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070" className="w-full h-full object-cover" alt="Event" />
               </div>
               <div className="flex-grow space-y-3">
                  <div className="flex items-center gap-2">
                     <CheckCircle2 size={16} className="text-green-500" />
                     <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Registered & Verified</span>
                  </div>
                  <h5 className="text-xl md:text-2xl font-serif text-church-purple leading-tight">16th International Leadership Summit</h5>
                  <p className="text-sm text-gray-500">Feb 4th - 8th, 2026 • Landmark Center, Lagos</p>
               </div>
               <button className="w-full md:w-auto px-6 py-3 bg-church-purple text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black shadow-lg transition-all">
                  Access Portal
               </button>
            </div>
          </section>

          {/* UPCOMING PROGRAMS SECTION */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-gray-300 rounded-full"></div>
              <h4 className="text-lg font-serif text-church-purple font-bold">Upcoming Programs</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProgramCard title="Global Intercessors' Retreat" date="May 12, 2026" isRegistered={false} />
              <ProgramCard title="Worship & Wonders Night" date="June 20, 2026" isRegistered={true} />
            </div>
          </section>

        </div>
      </div>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function ProgramCard({ title, date, isRegistered }: { title: string, date: string, isRegistered: boolean }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-gray-50 rounded-xl text-church-purple group-hover:bg-church-purple group-hover:text-white transition-colors">
          <Clock size={20} />
        </div>
        <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-tighter ${isRegistered ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
          {isRegistered ? 'Registered' : 'Not Registered'}
        </span>
      </div>
      <h6 className="font-serif text-lg text-church-purple leading-snug mb-1">{title}</h6>
      <p className="text-[11px] text-gray-400 mb-6">{date}</p>
      <button className={`w-full py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all ${isRegistered ? 'border border-church-purple text-church-purple hover:bg-church-purple hover:text-white' : 'bg-church-gold text-white shadow-lg shadow-church-gold/20 hover:scale-[1.02]'}`}>
        {isRegistered ? 'VIEW DETAILS' : 'REGISTER NOW'}
      </button>
    </div>
  );
}