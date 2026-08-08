import React, { useState, useRef } from 'react';
import { EXECOM_MEMBERS, ADMIN_EMAILS } from '../data/initialData';
import { ExecomMember, User } from '../types';
import { Crown, Heart, Sparkles, Users, Award, Star, Camera, Upload, X, Check, ShieldAlert, Image as ImageIcon } from 'lucide-react';

interface ExecomSectionProps {
  currentUser?: User | null;
  execomMembers?: ExecomMember[];
  onUpdateExecomMember?: (member: ExecomMember) => void;
}

export const ExecomSection: React.FC<ExecomSectionProps> = ({
  currentUser,
  execomMembers,
  onUpdateExecomMember,
}) => {
  const members = execomMembers && execomMembers.length > 0 ? execomMembers : EXECOM_MEMBERS;
  
  const isAdmin = currentUser?.role === 'admin' || 
    (currentUser?.email ? ADMIN_EMAILS.map(e => e.toLowerCase()).includes(currentUser.email.toLowerCase()) : false);

  const mainExecom = members.filter(m => m.team === 'MAIN EXECOM');
  const contentTeam = members.filter(m => m.team === 'Content Team');
  const designTeam = members.filter(m => m.team === 'Design Team');
  const outreachTeam = members.filter(m => m.team === 'Outreach Team');
  const volunteerLeads = members.filter(m => m.team === 'Volunteer Leads');
  const socialMediaLeads = members.filter(m => m.team === 'Social Media Leads');
  const programCoord = members.filter(m => m.team === 'Program Coordination Leads');

  // Photo Upload Modal State
  const [editingMember, setEditingMember] = useState<ExecomMember | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenPhotoUpload = (member: ExecomMember) => {
    if (!isAdmin) {
      alert('🔒 Access Denied: Only BODHI Execom Admins can upload profile pictures for committee members.');
      return;
    }
    setEditingMember(member);
    setPhotoUrlInput(member.avatar || '');
    setUploadSuccessMsg('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrlInput(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !onUpdateExecomMember) return;

    const updated = {
      ...editingMember,
      avatar: photoUrlInput,
    };

    onUpdateExecomMember(updated);
    setUploadSuccessMsg(`✓ Profile picture updated for ${editingMember.name}`);
    setTimeout(() => {
      setEditingMember(null);
      setUploadSuccessMsg('');
    }, 1200);
  };

  const renderMemberAvatar = (member: ExecomMember, sizeClass: string = "w-14 h-14") => {
    return (
      <div className="relative group/avatar inline-block">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className={`${sizeClass} rounded-2xl border-2 border-[#800000] object-cover shadow-[2px_2px_0px_#800000]`}
          />
        ) : (
          <div className={`${sizeClass} rounded-2xl bg-[#FFD700] border-2 border-[#800000] flex items-center justify-center font-serif font-bold text-[#800000] text-lg shadow-[2px_2px_0px_#800000]`}>
            {member.name.charAt(0)}
          </div>
        )}

        {/* Upload Overlay Button for Admin */}
        {isAdmin && (
          <button
            onClick={() => handleOpenPhotoUpload(member)}
            className="absolute -bottom-1 -right-1 p-1 bg-[#800000] text-[#FFD700] rounded-lg border border-[#FFD700] shadow-[1px_1px_0px_#800000] hover:scale-110 transition-transform"
            title="Upload/Edit Profile Picture (Admin Only)"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b-2 border-[#800000] pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="y2k-badge bg-[#800000] text-[#FFD700]">BODHI EXECOM 2026</span>
            <span className="text-xs font-mono text-[#800000]">OFFICIAL_COMMITTEE_DIRECTORY</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#800000] tracking-tight mt-1 flex items-center gap-2">
            <span>Executive Committee & Leads</span>
            <Crown className="w-6 h-6 text-[#FFD700] fill-[#FFD700] sparkle-icon" />
          </h2>
          <p className="text-sm font-medium text-[#2D2D2D]/80">
            The dedicated student leaders powering quiz leagues, debates, and campus events at LBSITW.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <span className="y2k-badge bg-[#FFD700] text-[#800000] border border-[#800000] flex items-center gap-1 text-xs">
              <Camera className="w-3.5 h-3.5" /> Admin Photo Upload Enabled
            </span>
          ) : (
            <span className="text-[11px] font-mono text-[#800000]/70 bg-white px-3 py-1 rounded-xl border border-[#800000] shadow-[1px_1px_0px_#800000]">
              🔒 Photos Managed by BODHI Admins
            </span>
          )}
        </div>
      </div>

      {/* Main Execom Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-[#800000]" />
          <h3 className="text-xl font-serif font-bold text-[#800000]">MAIN EXECOM</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {mainExecom.map((member) => (
            <div
              key={member.id}
              className="y2k-window bg-[#FFF5B8] border-2 border-[#800000] p-5 text-center space-y-3 relative group hover:-translate-y-1 transition-transform"
            >
              <div className="flex justify-center">
                {renderMemberAvatar(member, "w-16 h-16")}
              </div>

              <div>
                <span className="y2k-badge bg-[#800000] text-[#FFD700] text-[10px]">
                  {member.role}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#800000] mt-1.5 uppercase">
                  {member.name}
                </h4>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleOpenPhotoUpload(member)}
                  className="w-full py-1 bg-[#800000]/10 hover:bg-[#800000] text-[#800000] hover:text-[#FFD700] rounded-lg text-[10px] font-bold border border-[#800000] flex items-center justify-center gap-1 transition-colors mt-2"
                >
                  <Camera className="w-3 h-3" /> Change Photo
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content Team */}
        <div className="y2k-window bg-white border-2 border-[#800000] p-5 space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-[#800000] pb-2">
            <span className="p-1.5 bg-[#FFF5B8] border border-[#800000] rounded-lg">✍️</span>
            <h4 className="font-serif font-bold text-base text-[#800000]">Content Team Leads</h4>
          </div>
          <div className="space-y-2">
            {contentTeam.map(m => (
              <div key={m.id} className="p-2.5 bg-[#FAF9F6] border border-[#800000] rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {renderMemberAvatar(m, "w-10 h-10")}
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-xs text-[#800000] block truncate">{m.name}</span>
                    <span className="text-[10px] text-[#2D2D2D]/70 block truncate">{m.role}</span>
                  </div>
                </div>
                {isAdmin ? (
                  <button
                    onClick={() => handleOpenPhotoUpload(m)}
                    className="p-1.5 bg-white border border-[#800000] rounded-lg hover:bg-[#FFF5B8] text-[#800000] shrink-0"
                    title="Upload Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Star className="w-4 h-4 text-[#800000] shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Design Team */}
        <div className="y2k-window bg-white border-2 border-[#800000] p-5 space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-[#800000] pb-2">
            <span className="p-1.5 bg-[#FFF5B8] border border-[#800000] rounded-lg">🎨</span>
            <h4 className="font-serif font-bold text-base text-[#800000]">Design Team Leads</h4>
          </div>
          <div className="space-y-2">
            {designTeam.map(m => (
              <div key={m.id} className="p-2.5 bg-[#FAF9F6] border border-[#800000] rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {renderMemberAvatar(m, "w-10 h-10")}
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-xs text-[#800000] block truncate">{m.name}</span>
                    <span className="text-[10px] text-[#2D2D2D]/70 block truncate">{m.role}</span>
                  </div>
                </div>
                {isAdmin ? (
                  <button
                    onClick={() => handleOpenPhotoUpload(m)}
                    className="p-1.5 bg-white border border-[#800000] rounded-lg hover:bg-[#FFF5B8] text-[#800000] shrink-0"
                    title="Upload Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Heart className="w-4 h-4 text-[#800000] shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Outreach Team */}
        <div className="y2k-window bg-white border-2 border-[#800000] p-5 space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-[#800000] pb-2">
            <span className="p-1.5 bg-[#FFF5B8] border border-[#800000] rounded-lg">📢</span>
            <h4 className="font-serif font-bold text-base text-[#800000]">Outreach Team Leads</h4>
          </div>
          <div className="space-y-2">
            {outreachTeam.map(m => (
              <div key={m.id} className="p-2.5 bg-[#FAF9F6] border border-[#800000] rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {renderMemberAvatar(m, "w-10 h-10")}
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-xs text-[#800000] block truncate">{m.name}</span>
                    <span className="text-[10px] text-[#2D2D2D]/70 block truncate">{m.role}</span>
                  </div>
                </div>
                {isAdmin ? (
                  <button
                    onClick={() => handleOpenPhotoUpload(m)}
                    className="p-1.5 bg-white border border-[#800000] rounded-lg hover:bg-[#FFF5B8] text-[#800000] shrink-0"
                    title="Upload Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Sparkles className="w-4 h-4 text-[#800000] shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Leads */}
        <div className="y2k-window bg-white border-2 border-[#800000] p-5 space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-[#800000] pb-2">
            <span className="p-1.5 bg-[#FFF5B8] border border-[#800000] rounded-lg">🤝</span>
            <h4 className="font-serif font-bold text-base text-[#800000]">Volunteer Leads</h4>
          </div>
          <div className="space-y-2">
            {volunteerLeads.map(m => (
              <div key={m.id} className="p-2.5 bg-[#FAF9F6] border border-[#800000] rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {renderMemberAvatar(m, "w-10 h-10")}
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-xs text-[#800000] block truncate">{m.name}</span>
                    <span className="text-[10px] text-[#2D2D2D]/70 block truncate">{m.role}</span>
                  </div>
                </div>
                {isAdmin ? (
                  <button
                    onClick={() => handleOpenPhotoUpload(m)}
                    className="p-1.5 bg-white border border-[#800000] rounded-lg hover:bg-[#FFF5B8] text-[#800000] shrink-0"
                    title="Upload Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Users className="w-4 h-4 text-[#800000] shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Leads */}
        <div className="y2k-window bg-white border-2 border-[#800000] p-5 space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-[#800000] pb-2">
            <span className="p-1.5 bg-[#FFF5B8] border border-[#800000] rounded-lg">📱</span>
            <h4 className="font-serif font-bold text-base text-[#800000]">Social Media Leads</h4>
          </div>
          <div className="space-y-2">
            {socialMediaLeads.map(m => (
              <div key={m.id} className="p-2.5 bg-[#FAF9F6] border border-[#800000] rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {renderMemberAvatar(m, "w-10 h-10")}
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-xs text-[#800000] block truncate">{m.name}</span>
                    <span className="text-[10px] text-[#2D2D2D]/70 block truncate">{m.role}</span>
                  </div>
                </div>
                {isAdmin ? (
                  <button
                    onClick={() => handleOpenPhotoUpload(m)}
                    className="p-1.5 bg-white border border-[#800000] rounded-lg hover:bg-[#FFF5B8] text-[#800000] shrink-0"
                    title="Upload Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Sparkles className="w-4 h-4 text-[#800000] shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Program Coordination Leads */}
        <div className="y2k-window bg-white border-2 border-[#800000] p-5 space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-[#800000] pb-2">
            <span className="p-1.5 bg-[#FFF5B8] border border-[#800000] rounded-lg">⚡</span>
            <h4 className="font-serif font-bold text-base text-[#800000]">Program Coordination</h4>
          </div>
          <div className="space-y-2">
            {programCoord.map(m => (
              <div key={m.id} className="p-2.5 bg-[#FAF9F6] border border-[#800000] rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {renderMemberAvatar(m, "w-10 h-10")}
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-xs text-[#800000] block truncate">{m.name}</span>
                    <span className="text-[10px] text-[#2D2D2D]/70 block truncate">{m.role}</span>
                  </div>
                </div>
                {isAdmin ? (
                  <button
                    onClick={() => handleOpenPhotoUpload(m)}
                    className="p-1.5 bg-white border border-[#800000] rounded-lg hover:bg-[#FFF5B8] text-[#800000] shrink-0"
                    title="Upload Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Award className="w-4 h-4 text-[#800000] shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Photo Upload Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="y2k-window bg-white border-2 border-[#800000] max-w-md w-full overflow-hidden shadow-[8px_8px_0px_#800000]">
            <div className="y2k-window-header bg-[#800000] text-white flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#FFD700]">
                ADMIN_PHOTO_UPLOAD.EXE
              </span>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1 hover:bg-[#FFD700] hover:text-[#800000] rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="p-6 space-y-4">
              <div className="flex items-center gap-3 bg-[#FFF5B8] p-3 rounded-xl border border-[#800000]">
                {photoUrlInput ? (
                  <img src={photoUrlInput} alt="preview" className="w-14 h-14 rounded-xl border-2 border-[#800000] object-cover shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#800000] text-[#FFD700] border-2 border-[#800000] flex items-center justify-center font-bold shrink-0">
                    {editingMember.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#800000] uppercase">{editingMember.name}</h4>
                  <p className="text-xs text-[#800000]/80 font-bold">{editingMember.role} • {editingMember.team}</p>
                </div>
              </div>

              {uploadSuccessMsg && (
                <div className="p-3 bg-green-100 border-2 border-green-700 text-green-900 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-700" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}

              {/* Upload File Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#800000]">
                  Upload Profile Photo from Device / Gallery
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 y2k-btn-primary text-xs flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4 text-[#FFD700]" />
                  <span>Choose Photo from Device / Gallery</span>
                </button>
                <p className="text-[11px] font-mono text-[#800000]/80 text-center">
                  Select any photo from your phone gallery or computer.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#800000]/20">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 border-2 border-[#800000] rounded-xl text-xs font-bold text-[#800000] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 y2k-btn-primary text-xs font-bold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile Picture</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
