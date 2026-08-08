import React, { useState, useRef } from 'react';
import { User, QuizSubmission, EventItem, Certificate } from '../types';
import { User as UserIcon, Calendar, Trophy, Award, Edit3, CheckCircle, Clock, Sparkles, ExternalLink, Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { CertificateModal } from './CertificateModal';

interface ProfileModalProps {
  currentUser: User;
  onUpdateUser: (updated: Partial<User>) => void;
  userSubmissions: QuizSubmission[];
  userRegisteredEvents: EventItem[];
  allEvents?: EventItem[];
  userCertificates: Certificate[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentUser,
  onUpdateUser,
  userSubmissions,
  userRegisteredEvents,
  allEvents = [],
  userCertificates,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [semester, setSemester] = useState(currentUser.semester || 'S5');
  const [dept, setDept] = useState(currentUser.department || 'Computer Science & Engg');
  const [rollNo, setRollNo] = useState(currentUser.rollNumber || '');
  const [bio, setBio] = useState(currentUser.bio || 'Passionate quizzer and debater at LBSITW.');

  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      avatar,
      semester,
      department: dept,
      rollNumber: rollNo,
      bio,
    });
    setIsEditing(false);
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Profile Header Window */}
      <div className="y2k-window bg-white border-2 border-[#800000] overflow-hidden">
        <div className="y2k-window-header bg-[#800000] text-white">
          <span className="text-xs font-mono font-bold text-[#FFD700]">
            STUDENT_PROFILE_DASHBOARD.EXE
          </span>
          <span className="y2k-badge bg-[#FFD700] text-[#800000]">
            {currentUser.role === 'admin' ? 'EXECOM ADMIN' : 'REGISTERED MEMBER'}
          </span>
        </div>

        <div className="p-6 md:p-8">
          {!isEditing ? (
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-2xl border-4 border-[#800000] object-cover shadow-[4px_4px_0px_#800000]"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-2xl font-serif font-bold text-[#800000]">
                      {currentUser.name}
                    </h2>
                    <span className="y2k-badge bg-[#800000] text-[#FFD700]">
                      {currentUser.semester || 'S5'} • {currentUser.department || 'CSE'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#800000]/70">
                    {currentUser.email} {currentUser.rollNumber && `• Roll: ${currentUser.rollNumber}`}
                  </p>
                  <p className="text-xs font-medium text-[#2D2D2D]/80 pt-1 max-w-md">
                    {currentUser.bio || 'Passionate BODHI club member.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 y2k-btn-secondary text-xs flex items-center gap-1.5 shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="font-serif font-bold text-base text-[#800000] border-b-2 border-[#800000] pb-2">
                Edit Personal Information
              </h3>

              {/* Profile Photo Upload from Device Gallery */}
              <div className="bg-[#FFF5B8] p-4 rounded-xl border-2 border-[#800000] space-y-3">
                <label className="block text-xs font-bold text-[#800000] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#800000]" />
                  <span>Profile Photo (Upload from Phone Gallery / Device)</span>
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative shrink-0">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-2xl border-2 border-[#800000] object-cover shadow-[2px_2px_0px_#800000]"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-[#800000] text-[#FFD700] border-2 border-[#800000] flex items-center justify-center font-serif font-bold text-2xl shadow-[2px_2px_0px_#800000]">
                        {name.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
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
                      className="py-2.5 px-4 y2k-btn-primary text-xs flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
                    >
                      <Upload className="w-4 h-4 text-[#FFD700]" />
                      <span>Choose Photo from Device / Gallery</span>
                    </button>
                    <p className="text-[11px] font-mono text-[#800000]/80">
                      Select any picture from your device gallery or camera.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g., LBS23CS042"
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  >
                    {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">
                    Department
                  </label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  >
                    <option value="Computer Science & Engg">CSE</option>
                    <option value="Electronics & Comm Engg">ECE</option>
                    <option value="Information Technology">IT</option>
                    <option value="Civil Engineering">CE</option>
                    <option value="Applied Electronics">AE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#800000] mb-1">
                  Profile Bio / About Me
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 y2k-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 y2k-btn-primary text-xs font-bold"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Grid: Events Participated, Quizzes Taken, Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Participated */}
        <div className="y2k-window bg-white border-2 border-[#800000] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-[#800000] pb-2">
            <Calendar className="w-4 h-4 text-[#800000]" />
            <h3 className="font-serif font-bold text-sm text-[#800000]">
              Events Participated ({userRegisteredEvents.length})
            </h3>
          </div>

          {userRegisteredEvents.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {userRegisteredEvents.map((ev) => {
                // Find attendance record for currentUser
                const participantRecord = ev.registeredParticipants?.find(
                  p => p.userId === currentUser.id || p.email.toLowerCase() === currentUser.email.toLowerCase()
                );
                const isCheckedIn = participantRecord?.checkedIn === true;

                return (
                  <div
                    key={ev.id}
                    className="p-3 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl space-y-1.5 shadow-[2px_2px_0px_#800000]"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="y2k-badge bg-[#800000] text-[#FFD700] text-[10px]">
                        {ev.eventSpecification || ev.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#800000] font-bold">
                        📅 10/08/2026
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-xs text-[#800000]">
                      {ev.title}
                    </h4>

                    <p className="text-[10px] text-[#2D2D2D]/80 font-mono">
                      📍 {ev.venue} {ev.time && `• ⏰ ${ev.time}`}
                    </p>

                    {/* Attendance Verification Badge */}
                    <div className="pt-1">
                      {isCheckedIn ? (
                        <div className="py-1 px-2 bg-emerald-100 border border-emerald-600 rounded-lg text-[10px] font-extrabold text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>✓ Verified Attendance (Checked-In by Admin)</span>
                        </div>
                      ) : (
                        <div className="py-1 px-2 bg-[#FFF5B8] border border-[#800000] rounded-lg text-[10px] font-bold text-[#800000] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#800000] shrink-0" />
                          <span>Registered (Pending Check-In at Venue)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-[#2D2D2D]/60 italic">
              No registered events yet. Explore upcoming events to participate!
            </p>
          )}
        </div>

        {/* Quizzes Taken */}
        <div className="y2k-window bg-white border-2 border-[#800000] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-[#800000] pb-2">
            <Trophy className="w-4 h-4 text-[#800000]" />
            <h3 className="font-serif font-bold text-sm text-[#800000]">
              Quizzes Taken ({userSubmissions.length})
            </h3>
          </div>

          {userSubmissions.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {userSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl flex items-center justify-between shadow-[2px_2px_0px_#800000]"
                >
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#800000]">
                      {sub.quizTitle}
                    </h4>
                    <p className="text-[10px] text-[#2D2D2D]/70 font-mono">
                      Attempted {new Date(sub.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-[#800000]">
                      {sub.score}/{sub.totalPoints} PTS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#2D2D2D]/60 italic">
              No quiz attempts logged yet. Check out the Quiz League!
            </p>
          )}
        </div>

        {/* Certificates Earned */}
        <div className="y2k-window bg-white border-2 border-[#800000] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-[#800000] pb-2">
            <Award className="w-4 h-4 text-[#800000]" />
            <h3 className="font-serif font-bold text-sm text-[#800000]">
              Certificates Received ({userCertificates.length})
            </h3>
          </div>

          {userCertificates.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {userCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3 bg-[#FFF5B8] border-2 border-[#800000] rounded-xl space-y-1 shadow-[2px_2px_0px_#800000]"
                >
                  <span className="y2k-badge bg-[#800000] text-[#FFD700] text-[10px]">
                    {cert.type}
                  </span>
                  <h4 className="font-serif font-bold text-xs text-[#800000]">
                    {cert.eventOrQuizTitle}
                  </h4>
                  <p className="text-[10px] font-mono text-[#800000]">
                    Issued: {cert.issueDate} • Code: {cert.certificateCode}
                  </p>
                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    className="w-full mt-1 py-1 y2k-btn-primary text-[10px] font-bold flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3 text-[#FFD700]" />
                    <span>View Official Certificate</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#2D2D2D]/60 italic">
              Certificates issued by admins will appear here for viewing & printing.
            </p>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </section>
  );
};
