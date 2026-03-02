export default function Hero() {
  return (
    <div className="relative bg-church-purple overflow-hidden py-20 px-4">
      {/* Background decoration to mimic the soft glow in the PDF */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle,rgba(94,26,94,0.4)_0%,transparent_70%)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <p className="text-church-gold text-xs tracking-[0.3em] font-bold mb-4 uppercase">
          A Global Army of Women
        </p>
        <h1 className="text-4xl md:text-6xl font-serif mb-6">Event Registration</h1>
        <p className="text-gray-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Join us as we gather to seek the face of God. Please fill out the 
          form below to confirm your attendance for our upcoming global summit.
        </p>
      </div>
    </div>
  );
}