import { useState, useRef } from "react";
import { Mail, Phone, MapPin, Globe, Camera, Clock, Star, PenLine, Check, X, Shield, ClipboardCheck, Crown } from "lucide-react";
import PortalLayout from "../components/PortalLayout";

const getStatusIcon = (status: string) => {
  const s = (status || 'member').toLowerCase();
  if (s === 'super admin') return <Crown size={12} fill="white" />;
  if (s === 'admin') return <Shield size={12} fill="white" />;
  if (s === 'registrar') return <ClipboardCheck size={12} />;
  return <Star size={12} fill="white" />;
};

export default function MyProfile() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <PortalLayout>
      {(user) => {
        const memberSince = user.date_created ? new Date(user.date_created).getFullYear() : "2026";
        const displayStatus = (user.status || "MEMBER").toUpperCase();
        
        // Helper to check if a valid picture exists
        const hasPicture = user.picture && user.picture !== 'nil';

        const handleSave = async (field: string) => {
          setIsSaving(true);
          try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/user/${user.unique_code}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ field, value: editValue })
            });
            if (response.ok) {
              user[field] = editValue;
              setEditingField(null);
            } else {
              alert("Failed to update.");
            }
          } catch (e) {
            alert("Error updating.");
          } finally {
            setIsSaving(false);
          }
        };

        const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setIsUploadingPic(true);
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "waw_profile_pics");

          try {
            // 1. Upload to Cloudinary
            const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
              method: "POST",
              body: formData,
            });
            const cloudData = await cloudRes.json();
            
            if (cloudData.secure_url) {
              // 2. Save secure URL to Backend Database
              const dbRes = await fetch(`${import.meta.env.VITE_BACKEND}/api/user/${user.unique_code}/profile-pic`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pictureUrl: cloudData.secure_url }),
              });

              if (dbRes.ok) {
                // 3. Update the UI locally
                user.picture = cloudData.secure_url;
              } else {
                alert("Failed to save picture to database.");
              }
            } else {
              alert("Failed to upload image to Cloudinary.");
            }
          } catch (error) {
            console.error(error);
            alert("Image upload failed. Check your Cloudinary configuration.");
          } finally {
            setIsUploadingPic(false);
          }
        };

        const renderEditableRow = (label: string, field: string, icon: any) => {
          const isEditing = editingField === field;
          return (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl relative group">
              <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
              <div className="flex-grow">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full bg-white border border-church-purple/30 rounded px-2 py-1 text-sm outline-none"
                      autoFocus
                    />
                    <button onClick={() => handleSave(field)} disabled={isSaving} className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"><Check size={14}/></button>
                    <button onClick={() => setEditingField(null)} disabled={isSaving} className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"><X size={14}/></button>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-800">{user[field] || "Not Specified"}</p>
                )}
              </div>
              {!isEditing && (
                <button 
                  onClick={() => { setEditingField(field); setEditValue(user[field] || ""); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-church-purple hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <PenLine size={16} />
                </button>
              )}
            </div>
          );
        };

        return (
          <div className="pb-20">
            {/* Hidden File Input for Cloudinary Upload */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="relative h-64 bg-gradient-to-r from-church-purple to-church-purple/80 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-20">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-8">
                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    
                    {/* Profile Picture */}
                    <div className="relative group shrink-0">
                      <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-church-purple to-church-purple/80 border-4 border-white shadow-xl flex items-center justify-center text-white text-6xl font-bold transform rotate-3 group-hover:rotate-0 transition-transform duration-300 overflow-hidden relative">
                          {isUploadingPic && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                          {hasPicture ? (
                            <img src={user.picture} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            user.full_name?.charAt(0)
                          )}
                        </div>
                        <div className="absolute -top-3 -right-3 bg-church-gold text-white px-3 py-1.5 rounded-full shadow-lg z-20">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(user.status)}
                            <span className="text-[10px] font-bold tracking-widest">{displayStatus}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPic}
                        className="absolute -bottom-2 -right-2 p-3 bg-church-gold text-white rounded-xl shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed z-20"
                      >
                        <Camera size={18} />
                      </button>
                    </div>

                    {/* User Intro */}
                    <div className="flex-grow w-full mt-4 md:mt-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="w-full">
                          {editingField === 'full_name' ? (
                            <div className="flex items-center gap-2 mb-2 w-full max-w-sm">
                              <input 
                                type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                                className="w-full border border-church-purple/30 rounded px-2 py-1 text-2xl font-serif text-church-purple outline-none" autoFocus
                              />
                              <button onClick={() => handleSave('full_name')} disabled={isSaving} className="p-2 bg-green-500 text-white rounded hover:bg-green-600"><Check size={16}/></button>
                              <button onClick={() => setEditingField(null)} disabled={isSaving} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><X size={16}/></button>
                            </div>
                          ) : (
                            <div className="group flex items-center gap-3 justify-center md:justify-start">
                              <h1 className="text-3xl md:text-4xl font-serif text-church-purple mb-2">{user.full_name}</h1>
                              <button onClick={() => { setEditingField('full_name'); setEditValue(user.full_name); }} className="text-gray-300 hover:text-church-purple opacity-0 group-hover:opacity-100 transition-opacity pb-2">
                                <PenLine size={18} />
                              </button>
                            </div>
                          )}

                          <div className="flex items-center justify-center md:justify-start gap-3">
                            <p className="text-church-gold font-mono tracking-widest text-sm bg-church-gold/10 px-3 py-1 rounded-full">{user.unique_code}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> Member since {memberSince}</p>
                          </div>
                        </div>
                      </div>

                      {/* Editable Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        {renderEditableRow("Email Address", "email", <Mail size={18} className="text-church-purple" />)}
                        {renderEditableRow("Phone Number", "phone_number", <Phone size={18} className="text-church-purple" />)}
                        {renderEditableRow("Country", "country", <Globe size={18} className="text-church-purple" />)}
                        {renderEditableRow("City / State", "city_state", <MapPin size={18} className="text-church-purple" />)}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </PortalLayout>
  );
}