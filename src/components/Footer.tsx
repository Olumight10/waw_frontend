export default function Footer() {
  return (
    <footer className="bg-[#1a041a] text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Column 1: Brand/About */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
               {/* Replace with your logo image */}
               <span className="text-xs font-bold">WAW</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            A Global Army of Spirit-filled women, laboring in fervent intercession for the family, the Church and the nations.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholder */}
            {['fb', 'tw', 'ig', 'yt'].map((icon) => (
              <div key={icon} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-church-gold hover:border-church-gold transition-colors cursor-pointer">
                <span className="text-[10px] uppercase">{icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Explore Links */}
        <div>
          <h4 className="text-church-gold font-bold text-xs tracking-widest uppercase mb-6">Explore</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-white transition-colors">About Us</a> </li>
            <li><a href="#" className="hover:text-white transition-colors">Ministry Aims</a> </li>
            <li><a href="#" className="hover:text-white transition-colors">Our Projects</a> </li>
            <li><a href="#" className="hover:text-white transition-colors">Events</a> </li>
            <li><a href="#" className="hover:text-white transition-colors">Give</a> </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h4 className="text-church-gold font-bold text-xs tracking-widest uppercase mb-6">Contact</h4>
          <ul className="space-y-6 text-sm text-gray-400">
            <li className="flex gap-3">
              <span className="text-church-gold">📍</span>
              <span>International Head Office:<br />54 Afolabi Street, O-Line<br />Itire Ijesha, Lagos, Nigeria </span>
            </li>
            <li className="flex gap-3">
              <span className="text-church-gold">📞</span>
              <div className="flex flex-col">
                <span>+234 817 771 4407</span> 
                <span>+234 902 332 2341</span> 
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-church-gold">✉️</span>
              <span>info@aglobalarmyofwomen.org</span> 
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest">
        <p>© 2026 A Global Army of Women. All Rights Reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}