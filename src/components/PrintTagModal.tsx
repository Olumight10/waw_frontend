import { useState, useRef } from "react";
import { X, Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export default function PrintTagModal({ user, event, onClose }: any) {
  const tagRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState("top-left");
  const [isDownloading, setIsDownloading] = useState(false);

  // Determines tag header color based on user status
  const getHeaderStyle = (status: string) => {
    const s = (status || 'member').toLowerCase();
    if (s === 'super admin') return "bg-purple-900";
    if (s === 'admin') return "bg-red-700";
    if (s === 'registrar') return "bg-blue-600";
    return "bg-church-gold"; // Member
  };

  const handleDownload = async () => {
    if (!tagRef.current) return;
    setIsDownloading(true);
    
    try {
      // html-to-image easily handles modern CSS like Tailwind's oklch() colors
      const imgData = await toPng(tagRef.current, { 
        pixelRatio: 3, // Ensures print-quality high resolution
        backgroundColor: "#ffffff",
        style: {
           transform: "scale(1)", // Prevents wrapper scaling issues
           transformOrigin: "top left"
        }
      });
      
      // A4 Portrait dimensions in mm
      const pdf = new jsPDF("p", "mm", "a4");
      
      // 1/4 A4 size calculation (roughly 105mm x 148.5mm)
      const tagWidth = 105;
      const tagHeight = 148.5;
      
      // Calculate X and Y based on selected position on the A4 paper
      let x = 0;
      let y = 0;
      
      if (position.includes("right")) x = 105;
      if (position.includes("middle")) y = 74.25; 
      if (position.includes("bottom")) y = 148.5;
      
      pdf.addImage(imgData, "PNG", x, y, tagWidth, tagHeight);
      pdf.save(`${user.unique_code}_Access_Tag.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate your tag. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl max-w-4xl w-full flex flex-col md:flex-row gap-8 relative overflow-y-auto max-h-[95vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <X size={20} />
        </button>
        
        {/* PREVIEW AREA */}
        <div className="flex-1 border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center p-8 rounded-lg overflow-hidden relative min-h-[400px]">
          
          {/* SCALING WRAPPER: Shrinks it for the screen without affecting the PDF download */}
          <div className="transform scale-[0.6] sm:scale-[0.7] md:scale-90 origin-center transition-transform">
            
            {/* THE ACTUAL TAG: Strictly 105mm x 148.5mm for 1/4 A4 printing */}
            <div
              id="print-tag-target"
              ref={tagRef}
              className="w-[105mm] h-[148.5mm] bg-white border border-gray-200 shadow-sm flex flex-col relative overflow-hidden"
            >
              {/* Tag Header */}
              <div className={`h-28 ${getHeaderStyle(user.status)} flex flex-col items-center justify-center text-white px-4 text-center relative`}>
                <div className="absolute top-2 right-4 opacity-20 font-bold text-4xl">WAW</div>
                <h1 className="font-serif text-xl font-bold uppercase leading-tight z-10">{event.event_name}</h1>
              </div>
              
              {/* Tag Body */}
              <div className="flex-grow flex flex-col items-center pt-8 px-6 text-center">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-church-purple shadow-lg mb-6 relative">
                  {user.picture && user.picture !== 'nil' ? (
                    <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" crossOrigin="anonymous" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-400">
                      {user.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <h2 className="text-3xl font-serif text-church-purple mb-2 leading-tight">{user.full_name}</h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {user.status || 'MEMBER'}
                </p>

                {/* Simulated Barcode / Code Section */}
                <div className="mt-auto mb-6 w-full flex flex-col items-center">
                   <div className="w-full h-12 flex items-center justify-between px-4 opacity-50 mb-2">
                     {/* Decorative Barcode Lines */}
                     {[...Array(20)].map((_, i) => (
                       <div key={i} className={`bg-gray-800 ${i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-2' : 'w-0.5'} h-full`}></div>
                     ))}
                   </div>
                   <span className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full text-sm font-bold font-mono tracking-widest border border-gray-200">
                    {user.unique_code}
                  </span>
                </div>
              </div>
              
              {/* Tag Footer */}
              <div className="bg-gray-100 p-4 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase border-t border-gray-200">
                <span>{new Date(event.event_date).toLocaleDateString()}</span>
                <span className="text-church-purple">{event.abbrev}</span>
                <span>{event.location}</span>
              </div>

            </div>
          </div>
        </div>
        
        {/* CONTROLS */}
        <div className="w-full md:w-72 flex flex-col justify-center space-y-6">
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
             <h3 className="font-bold text-church-purple mb-1">Print Instructions</h3>
             <p className="text-xs text-gray-600">This tag is perfectly sized to fit exactly 4 times on a standard A4 sheet of paper. Select your grid position below.</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-widest">A4 Grid Position</h3>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full border-2 border-gray-200 p-4 rounded-lg outline-none cursor-pointer focus:border-church-gold transition-colors font-medium text-gray-700"
            >
              <option value="top-left">Top Left (Pos 1)</option>
              <option value="top-right">Top Right (Pos 2)</option>
              <option value="middle-left">Middle Left (Pos 3)</option>
              <option value="middle-right">Middle Right (Pos 4)</option>
              <option value="bottom-left">Bottom Left (Pos 5)</option>
              <option value="bottom-right">Bottom Right (Pos 6)</option>
            </select>
          </div>
          
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className={`w-full text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all ${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-church-purple hover:bg-black'}`}
          >
            {isDownloading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Generating PDF...
              </>
            ) : (
              <>
                <Download size={18} /> Download High-Res PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}