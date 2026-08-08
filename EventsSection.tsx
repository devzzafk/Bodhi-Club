import React, { useState, useRef } from 'react';
import { EventItem, EventStatus, User, EventParticipant } from '../types';
import { ADMIN_EMAILS } from '../data/initialData';
import { 
  Calendar, MapPin, Clock, Users, Trophy, CheckCircle, Sparkles, 
  X, ArrowRight, Upload, Edit3, Plus, ShieldCheck, UserCheck, 
  Search, Phone, Building, GraduationCap, Tag, Image as ImageIcon
} from 'lucide-react';

interface EventsSectionProps {
  events: EventItem[];
  currentUser: User | null;
  onRegisterForEvent: (
    eventId: string, 
    details: { name: string; institution: string; branch: string; department: string; email: string; contactNumber: string }
  ) => void;
  onToggleCheckIn?: (eventId: string, userId: string) => void;
  onSaveEvents?: (events: EventItem[]) => void;
  onRequireAuth: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  currentUser,
  onRegisterForEvent,
  onToggleCheckIn,
  onSaveEvents,
  onRequireAuth,
}) => {
  const isAdmin = currentUser && (currentUser.role === 'admin' || ADMIN_EMAILS.map(e => e.toLowerCase()).includes(currentUser.email.toLowerCase()));

  const [activeTab, setActiveTab] = useState<EventStatus | 'all'>('all');
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);

  // Student Registration Form State
  const [regName, setRegName] = useState(currentUser?.name || '');
  const [regInstitution, setRegInstitution] = useState('LBS Institute of Technology for Women (LBSITW)');
  const [regBranch, setRegBranch] = useState('Computer Science & Engineering');
  const [regDept, setRegDept] = useState(currentUser?.department || 'CSE');
  const [regEmail, setRegEmail] = useState(currentUser?.email || '');
  const [regContactNumber, setRegContactNumber] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Admin Modals State
  const [posterUploadEvent, setPosterUploadEvent] = useState<EventItem | null>(null);
  const [posterInputUrl, setPosterInputUrl] = useState('');
  const [fullscreenPosterUrl, setFullscreenPosterUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Edit Event Form State
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<'Debate' | 'Quiz' | 'Workshop' | 'Talk' | 'Competition'>('Debate');
  const [editSpecification, setEditSpecification] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPoster, setEditPoster] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editMode, setEditMode] = useState<'offline' | 'online'>('offline');
  const [editVenue, setEditVenue] = useState('');
  const [editStatus, setEditStatus] = useState<EventStatus>('upcoming');

  // Admin Participant / Attendance Verification Modal State
  const [viewingParticipantsEvent, setViewingParticipantsEvent] = useState<EventItem | null>(null);
  const [participantSearch, setParticipantSearch] = useState('');

  const filteredEvents = events.filter(e => {
    if (activeTab === 'all') return true;
    return e.status === activeTab;
  });

  // Open Registration Modal
  const handleOpenRegister = (ev: EventItem) => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    setRegisteringEvent(ev);
    setRegName(currentUser.name || '');
    setRegInstitution('LBS Institute of Technology for Women (LBSITW)');
    setRegBranch('Computer Science & Engineering');
    setRegDept(currentUser.department || 'CSE');
    setRegEmail(currentUser.email || '');
    setRegContactNumber('');
    setRegSuccess(false);
  };

  // Submit Student Registration Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringEvent) return;

    onRegisterForEvent(registeringEvent.id, {
      name: regName,
      institution: regInstitution,
      branch: regBranch,
      department: regDept,
      email: regEmail,
      contactNumber: regContactNumber,
    });

    setRegSuccess(true);
    setTimeout(() => {
      setRegisteringEvent(null);
      setRegSuccess(false);
    }, 1800);
  };

  // Admin Poster Upload Handler
  const handleOpenPosterModal = (ev: EventItem) => {
    setPosterUploadEvent(ev);
    setPosterInputUrl(ev.posterUrl);
  };

  const handlePosterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && posterUploadEvent && onSaveEvents) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const updated = events.map(ev => ev.id === posterUploadEvent.id ? { ...ev, posterUrl: reader.result as string } : ev);
          onSaveEvents(updated);
          setPosterUploadEvent(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePosterUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (posterUploadEvent && posterInputUrl && onSaveEvents) {
      const updated = events.map(ev => ev.id === posterUploadEvent.id ? { ...ev, posterUrl: posterInputUrl } : ev);
      onSaveEvents(updated);
      setPosterUploadEvent(null);
    }
  };

  // Admin Edit or Create Event
  const handleOpenEditModal = (ev?: EventItem) => {
    if (ev) {
      setEditingEvent(ev);
      setIsCreatingNew(false);
      setEditTitle(ev.title);
      setEditCategory(ev.category);
      setEditSpecification(ev.eventSpecification || '');
      setEditDesc(ev.description);
      setEditPoster(ev.posterUrl);
      setEditDate(ev.eventDate);
      setEditTime(ev.time || '2:15 PM - 4:15 PM (2 hours)');
      setEditMode(ev.mode || 'offline');
      setEditVenue(ev.venue);
      setEditStatus(ev.status);
    } else {
      setEditingEvent(null);
      setIsCreatingNew(true);
      setEditTitle('Earth Forum');
      setEditCategory('Debate');
      setEditSpecification('Debate Competition');
      setEditDesc('Official BODHI Debate Competition discussing environmental policy, sustainable futures, and global climate action.');
      setEditPoster('');
      setEditDate('2026-08-10');
      setEditTime('2:15 PM - 4:15 PM (2 hours)');
      setEditMode('offline');
      setEditVenue('LITAA seminar hall');
      setEditStatus('upcoming');
    }
  };

  const handleSaveEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveEvents) return;

    const eventObj: EventItem = {
      id: editingEvent?.id || `evt-${Date.now()}`,
      title: editTitle || 'Untitled Event',
      category: editCategory,
      eventSpecification: editSpecification,
      description: editDesc,
      posterUrl: editPoster || '',
      status: editStatus,
      eventDate: editDate || '2026-08-10',
      time: editTime || '2:15 PM - 4:15 PM (2 hours)',
      mode: editMode,
      venue: editVenue || 'LITAA seminar hall',
      registrationDeadline: `${editDate || '2026-08-10'}T12:00:00Z`,
      requiresRegistration: true,
      registeredUserIds: editingEvent?.registeredUserIds || [],
      registeredParticipants: editingEvent?.registeredParticipants || [],
    };

    if (editingEvent) {
      onSaveEvents(events.map(ev => ev.id === editingEvent.id ? eventObj : ev));
    } else {
      onSaveEvents([eventObj, ...events]);
    }

    setEditingEvent(null);
    setIsCreatingNew(false);
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#800000] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="y2k-badge bg-[#800000] text-[#FFD700]">CAMPUS BULLETIN</span>
            <span className="text-xs font-mono text-[#800000]">EVENT_CALENDAR</span>
            {isAdmin && (
              <span className="y2k-badge bg-[#FFD700] text-[#800000] flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3 text-[#800000]" />
                ADMIN CONTROL ENABLED
              </span>
            )}
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#800000] tracking-tight mt-1 flex items-center gap-2">
            <span>BODHI Events & Debates</span>
            <Sparkles className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
          </h2>
          <p className="text-sm font-medium text-[#2D2D2D]/80">
            Upcoming debate championships, workshops, and verified campus participation.
          </p>
        </div>

        {/* Filter Buttons & Admin Add Event Button */}
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => handleOpenEditModal()}
              className="px-3.5 py-1.5 y2k-btn-primary text-xs flex items-center gap-1.5 font-bold uppercase shadow-[2px_2px_0px_#800000]"
            >
              <Plus className="w-4 h-4 text-[#FFD700]" />
              <span>+ Add Campus Event</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border-2 border-[#800000] shadow-[2px_2px_0px_#800000]">
            {(['all', 'upcoming', 'live', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-bold rounded-xl capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-[#800000] text-[#FFD700] shadow-[1px_1px_0px_rgba(0,0,0,0.2)]'
                    : 'text-[#2D2D2D] hover:bg-[#FAF9F6] hover:text-[#800000]'
                }`}
              >
                {tab === 'all' ? 'All Events' : `${tab} Events`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((eventItem) => {
            const isRegistered = currentUser && eventItem.registeredUserIds.includes(currentUser.id);
            const participantCount = eventItem.registeredParticipants?.length || eventItem.registeredUserIds.length || 0;

            return (
              <div
                key={eventItem.id}
                className="y2k-window bg-white flex flex-col justify-between overflow-hidden shadow-[4px_4px_0px_#800000]"
              >
                <div>
                  {/* Window Header */}
                  <div className="y2k-window-header bg-[#800000] text-white flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#FFD700] truncate max-w-[180px] flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-[#FFD700]" />
                      {eventItem.eventSpecification || eventItem.category}
                    </span>
                    <span
                      className={`y2k-badge ${
                        eventItem.status === 'live'
                          ? 'bg-[#FFD700] text-[#800000] animate-pulse'
                          : eventItem.status === 'upcoming'
                          ? 'bg-[#FFF5B8] text-[#800000]'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {eventItem.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Poster Banner with Admin Controls Overlay */}
                  {eventItem.posterUrl ? (
                    <div className="relative h-60 bg-[#1A0000] border-b-2 border-[#800000] overflow-hidden group flex items-center justify-center">
                      {/* Background blur overlay to preserve card aspect ratio seamlessly */}
                      <img
                        src={eventItem.posterUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover filter blur-md opacity-35 pointer-events-none scale-110"
                      />

                      {/* Primary fitted poster image - fits completely without clipping */}
                      <img
                        src={eventItem.posterUrl}
                        alt={eventItem.title}
                        className="relative z-10 max-h-full max-w-full object-contain p-1 transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer drop-shadow-md"
                        onClick={() => setFullscreenPosterUrl(eventItem.posterUrl)}
                      />

                      {/* Mode Badge */}
                      <div className="absolute top-2 left-2 z-20 flex items-center gap-1">
                        {eventItem.mode && (
                          <span className="bg-[#800000]/90 text-[#FFD700] text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg uppercase backdrop-blur-sm border border-[#FFD700]/40">
                            📍 {eventItem.mode}
                          </span>
                        )}
                      </div>

                      {/* Admin Poster Change Overlay Button */}
                      {isAdmin && (
                        <button
                          onClick={() => handleOpenPosterModal(eventItem)}
                          className="absolute top-2 right-2 z-20 bg-[#FFD700] text-[#800000] border-2 border-[#800000] px-2.5 py-1 rounded-xl font-extrabold text-[10px] shadow-md flex items-center gap-1 hover:bg-white transition-colors uppercase tracking-wider"
                          title="Upload/Edit Event Poster (Design Admin)"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#800000]" />
                          <span>Design Admin Upload</span>
                        </button>
                      )}

                      {/* Fullscreen Enlarge View Button */}
                      <button
                        onClick={() => setFullscreenPosterUrl(eventItem.posterUrl)}
                        className="absolute bottom-2 right-2 z-20 bg-black/70 text-white hover:text-[#FFD700] text-[10px] font-mono font-bold px-2 py-1 rounded-lg backdrop-blur-sm border border-white/20 transition-colors flex items-center gap-1"
                        title="Click to view high-res poster"
                      >
                        <Search className="w-3 h-3 text-[#FFD700]" />
                        <span>Enlarge Poster</span>
                      </button>

                      <div className="absolute bottom-2 left-2 z-20 bg-[#800000]/90 text-[#FFD700] text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 backdrop-blur-sm border border-[#800000]">
                        <Calendar className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span>
                          {eventItem.eventDate === '2026-08-10' ? '10/08/2026' : new Date(eventItem.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-60 bg-gradient-to-br from-[#3D0000] via-[#5C0000] to-[#250000] border-b-2 border-[#800000] flex flex-col items-center justify-center p-5 text-center space-y-2 group">
                      <div className="w-12 h-12 rounded-2xl bg-[#800000] border-2 border-[#FFD700] flex items-center justify-center text-[#FFD700] shadow-[2px_2px_0px_#FFD700] group-hover:scale-105 transition-transform">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <span className="y2k-badge bg-[#FFD700] text-[#800000] font-extrabold text-[10px] tracking-wider uppercase">
                        POSTER PENDING UPLOAD
                      </span>
                      <p className="text-[11px] font-mono font-bold text-white max-w-[240px] leading-tight">
                        BODHI Design Team will upload the official event poster here soon.
                      </p>

                      {isAdmin ? (
                        <button
                          onClick={() => handleOpenPosterModal(eventItem)}
                          className="mt-1 px-3.5 py-1.5 bg-[#FFD700] text-[#800000] border-2 border-[#800000] rounded-xl font-extrabold text-[11px] hover:bg-white transition-all shadow-[2px_2px_0px_#800000] flex items-center gap-1.5 uppercase tracking-wider"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#800000]" />
                          <span>Upload Poster (Design Admin)</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-[#FFD700]/70 italic">
                          (Only BODHI Design Team admins can upload event posters)
                        </span>
                      )}

                      {/* Mode & Date Badges */}
                      <div className="absolute top-2 left-2">
                        {eventItem.mode && (
                          <span className="bg-[#800000]/90 text-[#FFD700] text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg uppercase border border-[#FFD700]/40">
                            📍 {eventItem.mode}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2 left-2 bg-[#800000]/90 text-[#FFD700] text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 border border-[#800000]">
                        <Calendar className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span>
                          {eventItem.eventDate === '2026-08-10' ? '10/08/2026' : new Date(eventItem.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content Body */}
                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[10px] font-mono font-extrabold text-[#800000] uppercase tracking-wider block">
                        {eventItem.eventSpecification || `${eventItem.category} Competition`}
                      </span>
                      <h3 className="font-serif font-bold text-xl text-[#800000] leading-snug">
                        {eventItem.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#2D2D2D]/80 line-clamp-3 leading-relaxed">
                      {eventItem.description}
                    </p>

                    {/* Event Specs Box */}
                    <div className="bg-[#FAF9F6] p-2.5 border-2 border-[#800000] rounded-xl space-y-1.5 text-xs font-bold text-[#2D2D2D]">
                      {eventItem.time && (
                        <div className="flex items-center gap-2 text-[#800000]">
                          <Clock className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                          <span className="font-mono text-[11px]">{eventItem.time}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                        <span className="truncate">{eventItem.venue}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[#2D2D2D]/80 text-[11px]">
                        <Users className="w-3.5 h-3.5 text-[#800000] shrink-0" />
                        <span>Registered: <strong>{participantCount} participants</strong></span>
                      </div>
                    </div>

                    {/* Admin Options Box */}
                    {isAdmin && (
                      <div className="bg-[#FFF5B8] p-2.5 border-2 border-[#800000] rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#800000]">
                          <span className="flex items-center gap-1 font-mono">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#800000]" />
                            ADMIN CONTROLS
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(eventItem)}
                            className="py-1 px-2 bg-white text-[#800000] border border-[#800000] rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-[#800000] hover:text-[#FFD700] transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Event</span>
                          </button>

                          <button
                            onClick={() => setViewingParticipantsEvent(eventItem)}
                            className="py-1 px-2 bg-[#800000] text-[#FFD700] border border-[#800000] rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-[#660000] transition-colors"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Attendance ({participantCount})</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 pt-0">
                  {eventItem.status === 'completed' ? (
                    <div className="p-2 bg-[#FAF9F6] border border-[#800000] rounded-xl text-center text-xs font-bold text-[#800000]">
                      ✓ Event Concluded
                    </div>
                  ) : isRegistered ? (
                    <div className="p-2 bg-emerald-50 border-2 border-emerald-600 rounded-xl text-center text-xs font-extrabold text-emerald-800 flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Registered (Attendance Check-In at Venue)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenRegister(eventItem)}
                      className="w-full py-2.5 y2k-btn-primary text-xs flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider"
                    >
                      <span>Register for Event</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border-2 border-[#800000] rounded-2xl shadow-[4px_4px_0px_#800000] space-y-2">
          <Calendar className="w-10 h-10 mx-auto text-[#800000]" />
          <h3 className="font-serif font-bold text-lg text-[#800000]">No Events Scheduled Yet</h3>
          <p className="text-xs text-[#2D2D2D]/70">Check back soon for upcoming debates and campus activities!</p>
        </div>
      )}

      {/* STUDENT REGISTRATION FORM MODAL */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 bg-[#800000]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="y2k-window bg-white w-full max-w-lg my-8 overflow-hidden relative border-2 border-[#800000] shadow-[8px_8px_0px_#800000]">
            <div className="y2k-window-header bg-[#800000] text-white flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#FFD700]">
                EVENT REGISTRATION FORM
              </span>
              <button
                onClick={() => setRegisteringEvent(null)}
                className="p-1 hover:bg-[#FFD700]/20 rounded-full text-[#FFD700]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!regSuccess ? (
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="bg-[#FFF5B8] p-3 rounded-xl border-2 border-[#800000]">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#800000]">
                    <Tag className="w-3 h-3 text-[#800000]" />
                    <span>{registeringEvent.eventSpecification || registeringEvent.category}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#800000]">
                    {registeringEvent.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#2D2D2D] mt-1">
                    <span>📍 {registeringEvent.venue}</span>
                    <span>•</span>
                    <span>📅 10/08/2026</span>
                    {registeringEvent.time && (
                      <>
                        <span>•</span>
                        <span>⏰ {registeringEvent.time}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#800000] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#800000] mb-1">
                      Institution / College Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regInstitution}
                      onChange={(e) => setRegInstitution(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      placeholder="e.g., LBS Institute of Technology for Women (LBSITW)"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">
                        Branch / Specialization *
                      </label>
                      <input
                        type="text"
                        required
                        value={regBranch}
                        onChange={(e) => setRegBranch(e.target.value)}
                        className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                        placeholder="e.g., Computer Science & Engg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">
                        Department Code *
                      </label>
                      <select
                        value={regDept}
                        onChange={(e) => setRegDept(e.target.value)}
                        className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      >
                        <option value="CSE">CSE (Computer Science)</option>
                        <option value="ECE">ECE (Electronics & Comm)</option>
                        <option value="IT">IT (Information Tech)</option>
                        <option value="CE">CE (Civil Engg)</option>
                        <option value="AE">AE (Applied Electronics)</option>
                        <option value="OTHER">Other Department</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                        placeholder="student@lbsitw.ac.in"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">
                        Contact / Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={regContactNumber}
                        onChange={(e) => setRegContactNumber(e.target.value)}
                        className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                        placeholder="e.g., 9876543210"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#800000]/20">
                  <button
                    type="button"
                    onClick={() => setRegisteringEvent(null)}
                    className="px-4 py-2 border-2 border-[#800000] rounded-xl text-xs font-bold text-[#800000]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 y2k-btn-primary text-xs font-extrabold uppercase tracking-wider"
                  >
                    Confirm Registration
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-2 border-[#800000] flex items-center justify-center text-3xl">
                  🎉
                </div>
                <h3 className="text-xl font-serif font-bold text-[#800000]">
                  Registration Successful!
                </h3>
                <p className="text-xs font-bold text-[#2D2D2D]">
                  You are registered for <strong>{registeringEvent.title}</strong>. Your participation will be recorded on your profile after venue check-in.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN POSTER UPLOAD MODAL */}
      {posterUploadEvent && (
        <div className="fixed inset-0 z-50 bg-[#800000]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="y2k-window bg-white w-full max-w-md overflow-hidden border-2 border-[#800000] shadow-[8px_8px_0px_#800000]">
            <div className="y2k-window-header bg-[#800000] text-white flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#FFD700]">
                ADMIN_UPLOAD_EVENT_POSTER
              </span>
              <button
                onClick={() => setPosterUploadEvent(null)}
                className="p-1 hover:bg-[#FFD700]/20 rounded-full text-[#FFD700]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-[#800000]">
                  {posterUploadEvent.title}
                </h4>
                <p className="text-xs text-[#2D2D2D]/80">
                  Upload a photo from your phone gallery/device or paste an image URL.
                </p>
              </div>

              {/* Upload File Button */}
              <div className="bg-[#FFF5B8] p-4 rounded-xl border-2 border-[#800000] space-y-3">
                <label className="block text-xs font-bold text-[#800000]">
                  Option 1: Upload Image from Device Gallery
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePosterFileUpload}
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
              </div>

              {/* URL Input Form */}
              <form onSubmit={handleSavePosterUrl} className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-[#800000]">
                  Option 2: Paste Image Web URL
                </label>
                <input
                  type="url"
                  value={posterInputUrl}
                  onChange={(e) => setPosterInputUrl(e.target.value)}
                  placeholder="https://drive.google.com/direct-image-url..."
                  className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                />
                
                {posterUploadEvent.posterUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onSaveEvents) {
                        onSaveEvents(events.map(ev => ev.id === posterUploadEvent.id ? { ...ev, posterUrl: '' } : ev));
                        setPosterUploadEvent(null);
                      }
                    }}
                    className="w-full py-2 bg-rose-100 text-rose-800 border border-rose-400 rounded-xl text-xs font-bold hover:bg-rose-200 transition-colors"
                  >
                    Reset to "Poster Pending Upload"
                  </button>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-[#800000]/10">
                  <button
                    type="button"
                    onClick={() => setPosterUploadEvent(null)}
                    className="px-3 py-2 border-2 border-[#800000] rounded-xl text-xs font-bold text-[#800000]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 y2k-btn-primary text-xs font-bold uppercase"
                  >
                    Save Poster Image
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN EDIT / ADD EVENT MODAL */}
      {(editingEvent || isCreatingNew) && (
        <div className="fixed inset-0 z-50 bg-[#800000]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="y2k-window bg-white w-full max-w-xl my-8 overflow-hidden border-2 border-[#800000] shadow-[8px_8px_0px_#800000]">
            <div className="y2k-window-header bg-[#800000] text-white flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#FFD700]">
                {isCreatingNew ? 'ADMIN_CREATE_EVENT' : 'ADMIN_EDIT_EVENT_DETAILS'}
              </span>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setIsCreatingNew(false);
                }}
                className="p-1 hover:bg-[#FFD700]/20 rounded-full text-[#FFD700]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEventSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                    placeholder="e.g., Earth Forum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">
                    Event Specification / Subtitle *
                  </label>
                  <input
                    type="text"
                    required
                    value={editSpecification}
                    onChange={(e) => setEditSpecification(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                    placeholder="e.g., Debate Competition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  >
                    <option value="Debate">Debate</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Talk">Talk</option>
                    <option value="Competition">Competition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">Mode</label>
                  <select
                    value={editMode}
                    onChange={(e) => setEditMode(e.target.value as any)}
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">Date (YYYY-MM-DD) *</label>
                  <input
                    type="text"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    placeholder="2026-08-10"
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">Event Time *</label>
                  <input
                    type="text"
                    required
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    placeholder="2:15 PM - 4:15 PM (2 hours)"
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={editVenue}
                    onChange={(e) => setEditVenue(e.target.value)}
                    placeholder="LITAA seminar hall"
                    className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#800000] mb-1">Poster Image URL *</label>
                <input
                  type="url"
                  required
                  value={editPoster}
                  onChange={(e) => setEditPoster(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#800000] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#800000]/20">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2 border-2 border-[#800000] rounded-xl text-xs font-bold text-[#800000]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 y2k-btn-primary text-xs font-extrabold uppercase"
                >
                  {isCreatingNew ? 'Create Event' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN PARTICIPANT LIST & ATTENDANCE CHECK-IN MODAL */}
      {viewingParticipantsEvent && (
        <div className="fixed inset-0 z-50 bg-[#800000]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="y2k-window bg-white w-full max-w-3xl my-8 overflow-hidden border-2 border-[#800000] shadow-[8px_8px_0px_#800000]">
            <div className="y2k-window-header bg-[#800000] text-white flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-[#FFD700] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#FFD700]" />
                ATTENDANCE_SYSTEM & REGISTERED_PARTICIPANTS
              </span>
              <button
                onClick={() => setViewingParticipantsEvent(null)}
                className="p-1 hover:bg-[#FFD700]/20 rounded-full text-[#FFD700]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#FFF5B8] p-3 rounded-xl border-2 border-[#800000]">
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#800000]">
                    {viewingParticipantsEvent.title}
                  </h4>
                  <p className="text-xs font-bold text-[#2D2D2D]">
                    📍 {viewingParticipantsEvent.venue} • 📅 10/08/2026 • ⏰ {viewingParticipantsEvent.time || '2:15 PM - 4:15 PM'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-black text-[#800000]">
                    {viewingParticipantsEvent.registeredParticipants?.length || 0}
                  </span>
                  <span className="block text-[10px] font-mono font-bold text-[#800000] uppercase">
                    Total Registered
                  </span>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#800000]" />
                <input
                  type="text"
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  placeholder="Search registered participants by name, email, phone, or branch..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                />
              </div>

              {/* Participants Table */}
              <div className="overflow-x-auto border-2 border-[#800000] rounded-xl">
                <table className="w-full text-left text-xs font-bold border-collapse">
                  <thead>
                    <tr className="bg-[#800000] text-[#FFD700]">
                      <th className="p-2.5">Participant Info</th>
                      <th className="p-2.5">Institution & Branch</th>
                      <th className="p-2.5">Contact Number</th>
                      <th className="p-2.5 text-center">Attendance Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#800000]/20 bg-white">
                    {viewingParticipantsEvent.registeredParticipants && viewingParticipantsEvent.registeredParticipants.length > 0 ? (
                      viewingParticipantsEvent.registeredParticipants
                        .filter(p => {
                          if (!participantSearch) return true;
                          const q = participantSearch.toLowerCase();
                          return (
                            p.name.toLowerCase().includes(q) ||
                            p.email.toLowerCase().includes(q) ||
                            p.contactNumber.toLowerCase().includes(q) ||
                            p.branch.toLowerCase().includes(q) ||
                            p.institution.toLowerCase().includes(q)
                          );
                        })
                        .map((participant) => (
                          <tr key={participant.userId || participant.email} className="hover:bg-[#FAF9F6] text-[#2D2D2D]">
                            <td className="p-2.5">
                              <span className="font-serif font-bold text-sm text-[#800000] block">{participant.name}</span>
                              <span className="text-[10px] font-mono text-[#2D2D2D]/70">{participant.email}</span>
                            </td>
                            <td className="p-2.5">
                              <span className="block text-[11px] font-bold text-[#2D2D2D]">{participant.institution || 'LBSITW'}</span>
                              <span className="text-[10px] font-mono text-[#800000]">{participant.branch} ({participant.department})</span>
                            </td>
                            <td className="p-2.5 font-mono text-xs">
                              {participant.contactNumber || 'N/A'}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => {
                                  if (onToggleCheckIn) {
                                    onToggleCheckIn(viewingParticipantsEvent.id, participant.userId);
                                    // Update local viewing object
                                    setViewingParticipantsEvent(prev => {
                                      if (!prev || !prev.registeredParticipants) return prev;
                                      return {
                                        ...prev,
                                        registeredParticipants: prev.registeredParticipants.map(p => 
                                          p.userId === participant.userId ? { ...p, checkedIn: !p.checkedIn } : p
                                        )
                                      };
                                    });
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all border ${
                                  participant.checkedIn
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-600 hover:bg-emerald-200'
                                    : 'bg-[#FFF5B8] text-[#800000] border-[#800000] hover:bg-[#FFD700]'
                                }`}
                              >
                                {participant.checkedIn ? '✓ Verified / Checked In' : 'Click to Verify Attendance'}
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-xs font-bold text-[#800000]">
                          No registered participants found for this event yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN HIGH-RES POSTER VIEWER MODAL */}
      {fullscreenPosterUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setFullscreenPosterUrl(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-black rounded-2xl border-2 border-[#FFD700] overflow-hidden p-2 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-[#800000] text-[#FFD700] px-4 py-2 font-mono font-bold text-xs border-b border-[#FFD700]">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#FFD700]" />
                OFFICIAL_EVENT_POSTER_VIEWER
              </span>
              <button
                onClick={() => setFullscreenPosterUrl(null)}
                className="p-1 hover:bg-[#FFD700] hover:text-[#800000] rounded-lg transition-colors text-[#FFD700]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 flex items-center justify-center max-h-[80vh] overflow-auto bg-[#0F0000]">
              <img
                src={fullscreenPosterUrl}
                alt="Official Event Poster"
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-lg border border-[#800000]"
              />
            </div>
            <div className="bg-[#1A0000] p-2 text-center text-xs font-mono text-[#FFD700] border-t border-[#800000]">
              BODHI Design Team Official Event Publication • Full High-Resolution View
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
