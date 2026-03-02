export default function Navbar() {
  const navLinks = [
    { name: "ABOUT US", href: "#" },
    { name: "MINISTRY AIMS", href: "#" },
    { name: "OUR PROJECTS", href: "#" },
    { name: "EVENTS", href: "#" },
    { name: "E-STORE", href: "#" },
    { name: "GIVE", href: "#" },
    { name: "CONTACT US", href: "#" },
  ];

  return (
    <nav className="bg-church-purple text-white py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        {/* Placeholder for the logo seen in your file */}
        <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />
        <span className="font-bold tracking-widest text-sm">WAW</span>
      </div>
      
      <div className="hidden md:flex gap-6 text-[11px] font-semibold tracking-tighter">
        {navLinks.map((link) => (
          <a key={link.name} href={link.href} className="hover:text-church-gold transition-colors">
            {link.name}
          </a>
        ))}
      </div>

      <button className="bg-church-gold text-white px-6 py-2 rounded text-xs font-bold hover:bg-orange-600 transition-all">
        DONATE
      </button>
    </nav>
  );
}