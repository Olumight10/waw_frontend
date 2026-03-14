import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function PortalLayout({ children }: { children: (user: any) => ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
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
      .catch(() => navigate("/"));
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-church-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} userCode={user.unique_code} />
      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`flex-grow flex flex-col transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}>
        <Topbar user={user} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        {children(user)}
      </div>
    </div>
  );
}