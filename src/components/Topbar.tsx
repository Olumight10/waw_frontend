import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  onMenuClick: () => void;
  user: any;
}

export default function Topbar({ onMenuClick, user }: TopbarProps) {
  const navigate = useNavigate();
  const hasPicture = user?.picture && user.picture !== 'nil';

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 text-church-purple hover:bg-gray-100 rounded-lg transition-colors relative z-50">
          <div className="flex items-center gap-2">
            <Menu size={24} />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Menu</span>
          </div>
        </button>
        <div className="hidden md:flex items-center gap-2 text-church-purple/40 italic font-serif">
          <span className="text-xs font-bold tracking-widest uppercase">A Global Army of Women</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer" onClick={() => navigate("/profile")}>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-church-purple uppercase leading-none">{user?.full_name}</p>
            <span className="text-[9px] text-church-gold font-bold hover:underline">View Profile</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-church-purple border-2 border-church-gold flex items-center justify-center text-white text-sm font-bold shadow-sm overflow-hidden">
            {hasPicture ? (
              <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.full_name?.charAt(0) || "U"
            )}
          </div>
        </div>
      </div>
    </header>
  );
}