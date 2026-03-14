import { useNavigate } from "react-router-dom";
import { LayoutDashboard, UserCircle, ClipboardList, LogOut, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userCode: string | null;
}

export default function Sidebar({ isOpen, onClose, userCode }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (userCode) {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND}/api/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unique_code: userCode }),
        });
      } catch (err) {
        console.error(err);
      }
    }
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-church-purple text-white transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-church-gold rounded flex items-center justify-center text-church-purple font-bold">W</div>
            <span className="font-serif text-lg tracking-tight">WAW Portal</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white" aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-grow space-y-2">
          <button onClick={() => navigate("/dashboard")} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => navigate("/profile")} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all">
            <UserCircle size={18} /> My Profile
          </button>
          <button onClick={() => navigate("/records")} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all">
            <ClipboardList size={18} /> My Records
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-auto w-full">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}