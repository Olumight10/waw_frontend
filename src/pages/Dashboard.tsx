import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, Bell, X, LogOut, LayoutDashboard, 
  UserCircle, ClipboardList, Clock, Calendar, CheckCircle2,
  ShieldCheck, Users
} from "lucide-react";

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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
        if (data.error) {
          navigate("/");
        } else {
          setUser(data);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        navigate("/");
      });
  }, [navigate]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Set initial state based on screen size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden relative">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-church-purple text-white transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-church-gold rounded flex items-center justify-center text-church-purple font-bold">W</div>
               <span className="font-serif text-lg tracking-tight">WAW Portal</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden text-white/50 hover:text-white"
              aria-label="Close sidebar"
            >
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
      <div className={`flex-grow flex flex-col transition-all duration-300 ${
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      }`}>
        
        {/* TOP NAV */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Hamburger menu - ALWAYS VISIBLE and above sidebar */}
            <button 
              onClick={toggleSidebar} 
              className="p-2 text-church-purple hover:bg-gray-100 rounded-lg transition-colors relative z-50"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center gap-2 text-church-purple/40 italic font-serif">
               <span className="text-xs font-bold tracking-widest uppercase">A Global Army of Women</span>
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
        <div className="p-6 md:p-10 transition-all max-w-7xl mx-auto w-full">
          
          {/* HERO */}
          <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl mb-10 group bg-church-purple">
            <img 
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" 
              alt="Registration Theme BG"
            />
            {/* Animated Glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-church-gold/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-church-purple via-church-purple/80 to-transparent"></div>
            
            <div className="relative h-full flex flex-col justify-center px-8 md:px-16 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                  <ShieldCheck className="text-church-gold" size={24} />
                </div>
                <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase">
                  Verified Portal
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-serif mb-1">Shalom,</h2>
              <h3 className="text-2xl md:text-4xl font-bold text-church-gold uppercase tracking-tight">{user.full_name}</h3>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Member ID</span>
                  <p className="text-white/80 font-mono text-sm tracking-widest">{user.unique_code}</p>
                </div>
                <div className="w-[1px] h-8 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Status</span>
                  <p className="text-church-gold text-sm font-bold">Active Member</p>
                </div>
              </div>
            </div>

            {/* Subtle background icon */}
            <Users className="absolute right-10 bottom-[-20px] text-white/5 w-64 h-64 rotate-12" />
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
              <ProgramCard 
                title="Global Intercessors' Retreat" 
                date="May 12 - 15, 2026"
                location="Mountain Prayer Center, Abuja"
                imageUrl="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070"
              />
              <ProgramCard 
                title="Worship & Wonders Night" 
                date="June 20, 2026"
                location="Glory Dome, Lagos"
                imageUrl="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070"
              />
              <ProgramCard 
                title="Women of Faith Conference" 
                date="August 15 - 18, 2026"
                location="International Convention Center, Accra"
                imageUrl="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070"
              />
              <ProgramCard 
                title="Prayer Summit" 
                date="September 10 - 13, 2026"
                location="Prayer Mountain, Nairobi"
                imageUrl="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070"
              />
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

function ProgramCard({ title, date, location, imageUrl }: { title: string, date: string, location: string, imageUrl: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Date Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
          <p className="text-[10px] font-bold text-church-purple uppercase tracking-wider">{date}</p>
        </div>
        
        {/* Upcoming Tag */}
        <div className="absolute top-3 right-3 bg-church-gold/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
          <span className="text-[9px] font-bold text-white uppercase tracking-wider">Upcoming</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h6 className="font-serif text-lg text-church-purple leading-snug mb-2 line-clamp-2">{title}</h6>
        
        <div className="flex items-start gap-2 mb-4">
          <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-500 line-clamp-1">{location}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-church-gold" />
            <span className="text-[10px] text-gray-400">2,500+ going</span>
          </div>
          <button className="px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest transition-all border border-church-purple text-church-purple hover:bg-church-purple hover:text-white">
            VIEW DETAILS
          </button>
        </div>
      </div>
    </div>
  );
}

// Add MapPin icon if not already imported
import { MapPin } from "lucide-react";