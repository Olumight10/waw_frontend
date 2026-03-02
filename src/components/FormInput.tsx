interface FormInputProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  dark?: boolean;
  value: string; // Add this
  onChange: (val: string) => void; // Add this
}

export default function FormInput({ label, placeholder, required, dark, value, onChange }: FormInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className={`text-[10px] font-bold uppercase tracking-widest ${dark ? 'text-church-gold' : 'text-church-purple'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value} // Link to state
        onChange={(e) => onChange(e.target.value)} // Send data back up
        className={`rounded-sm px-4 py-3 text-sm focus:outline-none transition-all w-full border ${
          dark 
            ? "bg-white/10 border-white/20 text-white placeholder:text-gray-400" 
            : "bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400"
        }`}
      />
    </div>
  );
}