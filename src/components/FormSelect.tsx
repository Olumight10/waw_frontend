interface FormSelectProps {
  label: string;
  options: string[];
  required?: boolean;
  dark?: boolean; // For the Quick Register section
  value: string; // Add this to hold the current selection
  onChange: (val: string) => void; // Add this to update the state
}

export default function FormSelect({ 
  label, 
  options, 
  required, 
  dark, 
  value, 
  onChange 
}: FormSelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className={`text-[10px] font-bold uppercase tracking-wider ${
        dark ? 'text-church-gold' : 'text-church-purple'
      }`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <select 
          value={value} // Binds the select to your formData state
          onChange={(e) => onChange(e.target.value)} // Updates state on change
          className={`appearance-none rounded-sm px-4 py-3 text-sm focus:outline-none w-full cursor-pointer transition-all border ${
            dark 
              ? "bg-white/10 border-white/20 text-white focus:border-church-gold/50" 
              : "bg-pink-50/30 border-pink-100 text-gray-700 focus:border-church-purple/30"
          }`}
        >
          {/* Default empty option if needed */}
          <option value="" disabled className="text-gray-400">Select an option...</option>
          
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-black">
              {opt}
            </option>
          ))}
        </select>
        
        {/* The dropdown arrow icon */}
        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${
          dark ? 'text-church-gold' : 'text-gray-700'
        }`}>
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}