import React, { useState } from 'react';
import { Quiz, EventItem, QuizSubmission, Certificate, ContactMessage, NotificationItem, Question } from '../types';
import { Shield, Plus, Edit, Trash2, Award, Users, BarChart2, Bell, Mail, FileText, CheckCircle2, Sparkles, Send, Upload, Eye, Calendar } from 'lucide-react';

interface AdminDashboardProps {
  quizzes: Quiz[];
  onSaveQuizzes: (quizzes: Quiz[]) => void;
  events: EventItem[];
  onSaveEvents: (events: EventItem[]) => void;
  onToggleCheckIn?: (eventId: string, userId: string) => void;
  submissions: QuizSubmission[];
  certificates: Certificate[];
  onIssueCertificate: (cert: Certificate) => void;
  contactMessages: ContactMessage[];
  onSendNotification: (notif: Omit<NotificationItem, 'id' | 'date' | 'read'>) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  quizzes,
  onSaveQuizzes,
  events,
  onSaveEvents,
  onToggleCheckIn,
  submissions,
  certificates,
  onIssueCertificate,
  contactMessages,
  onSendNotification,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'quizzes' | 'events' | 'certificates' | 'notifications' | 'contact'>('analytics');

  // --- Quiz Creator State ---
  const [editingQuiz, setEditingQuiz] = useState<Partial<Quiz> | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCategory, setQuizCategory] = useState('Technology & Science');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizPoster, setQuizPoster] = useState('');
  const [quizDuration, setQuizDuration] = useState(10);
  const [quizStatus, setQuizStatus] = useState<'upcoming' | 'live' | 'closed'>('live');
  const [questionsList, setQuestionsList] = useState<Question[]>([
    {
      id: 'q-new-1',
      questionText: 'Sample Question text...',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswerIndex: 0,
      points: 10,
    }
  ]);

  // --- Event Creator State ---
  const [editingEvent, setEditingEvent] = useState<Partial<EventItem> | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<'Quiz' | 'Debate' | 'Workshop' | 'Talk' | 'Competition'>('Debate');
  const [eventDesc, setEventDesc] = useState('');
  const [eventPoster, setEventPoster] = useState('');
  const [eventVenue, setEventVenue] = useState('Auditorium, LBSITW');
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [eventDate, setEventDate] = useState('2026-08-28T10:00');
  const [eventDeadline, setEventDeadline] = useState('2026-08-25T23:59');

  // --- Certificate Issuer State ---
  const [certRecipientName, setCertRecipientName] = useState('');
  const [certRecipientEmail, setCertRecipientEmail] = useState('');
  const [certEventTitle, setCertEventTitle] = useState('TARKASH 2026 Inter-College Debate');
  const [certType, setCertType] = useState<'Quiz Achievement' | 'Event Participation' | 'Debate Winner' | 'Excellence Award'>('Event Participation');
  const [certSuccess, setCertSuccess] = useState(false);

  // --- Notification Sender State ---
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'quiz' | 'event' | 'deadline' | 'announcement'>('announcement');
  const [notifSuccess, setNotifSuccess] = useState(false);

  // Quiz submit handler
  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPts = questionsList.reduce((acc, q) => acc + q.points, 0);

    const newQuiz: Quiz = {
      id: editingQuiz?.id || `quiz-${Date.now()}`,
      title: quizTitle || 'Untitled Quiz',
      category: quizCategory,
      description: quizDesc,
      posterUrl: quizPoster || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      durationMinutes: quizDuration,
      totalPoints: totalPts || 50,
      status: quizStatus,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: questionsList,
      createdBy: 'BODHI Execom Lead',
      createdAt: new Date().toISOString(),
    };

    if (editingQuiz?.id) {
      onSaveQuizzes(quizzes.map(q => q.id === editingQuiz.id ? newQuiz : q));
    } else {
      onSaveQuizzes([...quizzes, newQuiz]);
    }

    setEditingQuiz(null);
    resetQuizForm();
  };

  const resetQuizForm = () => {
    setQuizTitle('');
    setQuizCategory('Technology & Science');
    setQuizDesc('');
    setQuizPoster('');
    setQuizDuration(10);
    setQuizStatus('live');
    setQuestionsList([
      {
        id: 'q-new-1',
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        points: 10,
      }
    ]);
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm('Delete this quiz?')) {
      onSaveQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  // Event submit handler
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: EventItem = {
      id: editingEvent?.id || `ev-${Date.now()}`,
      title: eventTitle || 'Untitled Event',
      category: eventCategory,
      description: eventDesc,
      posterUrl: eventPoster || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
      status: eventStatus,
      eventDate: new Date(eventDate).toISOString(),
      venue: eventVenue,
      registrationDeadline: new Date(eventDeadline).toISOString(),
      requiresRegistration: true,
      registeredUserIds: editingEvent?.registeredUserIds || [],
      registeredParticipants: editingEvent?.registeredParticipants || [],
    };

    if (editingEvent?.id) {
      onSaveEvents(events.map(ev => ev.id === editingEvent.id ? newEvent : ev));
    } else {
      onSaveEvents([...events, newEvent]);
    }

    setEditingEvent(null);
    resetEventForm();
  };

  const resetEventForm = () => {
    setEventTitle('');
    setEventCategory('Debate');
    setEventDesc('');
    setEventPoster('');
    setEventVenue('Auditorium, LBSITW');
    setEventStatus('upcoming');
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Delete this event?')) {
      onSaveEvents(events.filter(ev => ev.id !== id));
    }
  };

  // Issue Certificate
  const handleIssueCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certRecipientName || !certRecipientEmail) return;

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      userId: `user-${Date.now()}`,
      userEmail: certRecipientEmail.trim(),
      userName: certRecipientName.trim(),
      eventOrQuizTitle: certEventTitle,
      type: certType,
      issueDate: new Date().toISOString().split('T')[0],
      certificateCode: `BODHI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      signedBy: 'MEGHA M SEKHAR (President, BODHI LBSITW)'
    };

    onIssueCertificate(newCert);
    setCertSuccess(true);
    setTimeout(() => setCertSuccess(false), 2000);
    setCertRecipientName('');
    setCertRecipientEmail('');
  };

  // Send Push Notification / Email Reminder
  const handleSendNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;

    onSendNotification({
      title: notifTitle,
      message: notifMessage,
      type: notifType,
    });

    setNotifSuccess(true);
    setTimeout(() => setNotifSuccess(false), 2000);
    setNotifTitle('');
    setNotifMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#800000]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="y2k-window bg-white border-2 border-[#800000] w-full max-w-5xl my-6 overflow-hidden relative max-h-[90vh] flex flex-col shadow-[10px_10px_0px_#800000]">
        {/* Header Bar */}
        <div className="y2k-window-header bg-[#800000] text-white shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FFD700]" />
            <span className="font-mono font-bold text-xs text-[#FFD700]">
              BODHI EXECOM CONTROL CENTER & ADMIN PANEL
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#FFD700] text-[#800000] border border-[#800000] rounded-full text-xs font-bold hover:bg-white"
          >
            Exit Dashboard
          </button>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="bg-[#FAF9F6] border-b-2 border-[#800000] p-2 flex flex-wrap items-center gap-1.5 shrink-0">
          {[
            { id: 'analytics', label: '📊 Analytics', icon: BarChart2 },
            { id: 'quizzes', label: '🎯 Manage Quizzes', icon: Plus },
            { id: 'events', label: '📅 Manage Events', icon: Calendar },
            { id: 'certificates', label: '📜 Issue Certificates', icon: Award },
            { id: 'notifications', label: '🔔 Broadcast Push / Reminders', icon: Bell },
            { id: 'contact', label: `📬 Contact Inbox (${contactMessages.length})`, icon: Mail },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-[#800000] text-[#FFD700] shadow-[1px_1px_0px_rgba(0,0,0,0.2)]'
                  : 'bg-white text-[#2D2D2D] hover:bg-[#FFF5B8] hover:text-[#800000] border border-[#800000]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[#FAF9F6] border-2 border-[#800000] rounded-2xl shadow-[3px_3px_0px_#800000] text-center">
                  <span className="text-2xl font-mono font-bold text-[#800000]">{submissions.length}</span>
                  <span className="block text-[10px] font-mono font-bold text-[#800000] uppercase">Quiz Submissions</span>
                </div>
                <div className="p-4 bg-[#FFF5B8] border-2 border-[#800000] rounded-2xl shadow-[3px_3px_0px_#800000] text-center">
                  <span className="text-2xl font-mono font-bold text-[#800000]">{quizzes.length}</span>
                  <span className="block text-[10px] font-mono font-bold text-[#800000] uppercase">Active Leagues</span>
                </div>
                <div className="p-4 bg-[#FAF9F6] border-2 border-[#800000] rounded-2xl shadow-[3px_3px_0px_#800000] text-center">
                  <span className="text-2xl font-mono font-bold text-[#800000]">{events.length}</span>
                  <span className="block text-[10px] font-mono font-bold text-[#800000] uppercase">Campus Events</span>
                </div>
                <div className="p-4 bg-[#FFF5B8] border-2 border-[#800000] rounded-2xl shadow-[3px_3px_0px_#800000] text-center">
                  <span className="text-2xl font-mono font-bold text-[#800000]">{certificates.length}</span>
                  <span className="block text-[10px] font-mono font-bold text-[#800000] uppercase">Certificates Issued</span>
                </div>
              </div>

              {/* Recent Quiz Responses Table */}
              <div className="y2k-window bg-white border-2 border-[#800000] overflow-hidden">
                <div className="y2k-window-header bg-[#800000] text-white">
                  <span className="text-xs font-mono font-bold text-[#FFD700]">
                    RECENT PARTICIPANT SUBMISSIONS LOG
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F6] border-b-2 border-[#800000] text-[#800000]">
                        <th className="p-2.5">Participant</th>
                        <th className="p-2.5">Quiz Title</th>
                        <th className="p-2.5 text-center">Score</th>
                        <th className="p-2.5 text-right">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#800000]/20">
                      {submissions.slice(0, 10).map((sub) => (
                        <tr key={sub.id} className="hover:bg-[#FAF9F6] text-[#2D2D2D]">
                          <td className="p-2.5">
                            <span className="block font-serif font-bold text-[#800000]">{sub.userName}</span>
                            <span className="text-[10px] text-[#2D2D2D]/70 font-mono">{sub.userEmail}</span>
                          </td>
                          <td className="p-2.5">{sub.quizTitle}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-[#800000]">
                            {sub.score}/{sub.totalPoints}
                          </td>
                          <td className="p-2.5 text-right text-[10px] font-mono text-[#2D2D2D]/70">
                            {new Date(sub.submittedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* QUIZZES MANAGEMENT TAB */}
          {activeTab === 'quizzes' && (
            <div className="space-y-6">
              {/* Form to Add/Edit Quiz */}
              <div className="p-4 bg-[#FAF9F6] border-2 border-[#800000] rounded-2xl shadow-[3px_3px_0px_#800000] space-y-4">
                <h3 className="font-serif font-bold text-sm text-[#800000] flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#800000]" />
                  <span>{editingQuiz ? 'Edit Quiz Details' : 'Create & Publish New Quiz'}</span>
                </h3>

                <form onSubmit={handleSaveQuiz} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">Quiz Title</label>
                      <input
                        type="text"
                        required
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="e.g., General Tech & AI League"
                        className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">Category</label>
                      <select
                        value={quizCategory}
                        onChange={(e) => setQuizCategory(e.target.value)}
                        className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      >
                        <option value="Technology & Science">Technology & Science</option>
                        <option value="Debate & Oratory">Debate & Oratory</option>
                        <option value="Literature & Culture">Literature & Culture</option>
                        <option value="General Knowledge">General Knowledge</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">Poster URL / Image</label>
                      <input
                        type="url"
                        value={quizPoster}
                        onChange={(e) => setQuizPoster(e.target.value)}
                        placeholder="Poster image link..."
                        className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">Duration (Minutes)</label>
                      <input
                        type="number"
                        min={1}
                        value={quizDuration}
                        onChange={(e) => setQuizDuration(Number(e.target.value))}
                        className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">Status</label>
                      <select
                        value={quizStatus}
                        onChange={(e) => setQuizStatus(e.target.value as any)}
                        className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="live">Live</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#800000] mb-1">Quiz Description</label>
                    <textarea
                      rows={2}
                      value={quizDesc}
                      onChange={(e) => setQuizDesc(e.target.value)}
                      placeholder="Brief rules & description..."
                      className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                    />
                  </div>

                  {/* Question Builders */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-mono font-bold text-[#800000] uppercase tracking-wider block">
                      Questions ({questionsList.length})
                    </label>

                    {questionsList.map((q, qIdx) => (
                      <div key={q.id} className="p-3 bg-white border-2 border-[#800000] rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-[#800000]">Q{qIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setQuestionsList(questionsList.filter((_, i) => i !== qIdx))}
                            className="text-rose-700 hover:underline text-[10px] font-bold"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={q.questionText}
                          onChange={(e) => {
                            const updated = [...questionsList];
                            updated[qIdx].questionText = e.target.value;
                            setQuestionsList(updated);
                          }}
                          placeholder="Question text..."
                          className="w-full p-2 bg-[#FAF9F6] border border-[#800000] rounded-lg text-xs font-bold text-[#2D2D2D]"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => (
                            <input
                              key={optIdx}
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => {
                                const updated = [...questionsList];
                                updated[qIdx].options[optIdx] = e.target.value;
                                setQuestionsList(updated);
                              }}
                              placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                              className={`p-1.5 border rounded-lg text-xs font-medium text-[#2D2D2D] ${
                                q.correctAnswerIndex === optIdx ? 'bg-[#FFF5B8] border-[#800000] font-bold text-[#800000]' : 'bg-white border-[#800000]/40'
                              }`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <label className="font-bold text-[#800000]">Correct Option:</label>
                          <select
                            value={q.correctAnswerIndex}
                            onChange={(e) => {
                              const updated = [...questionsList];
                              updated[qIdx].correctAnswerIndex = Number(e.target.value);
                              setQuestionsList(updated);
                            }}
                            className="p-1 border border-[#800000] rounded text-xs font-bold text-[#800000]"
                          >
                            {q.options.map((_, i) => (
                              <option key={i} value={i}>Option {String.fromCharCode(65 + i)}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setQuestionsList([
                        ...questionsList,
                        {
                          id: `q-new-${Date.now()}`,
                          questionText: '',
                          options: ['', '', '', ''],
                          correctAnswerIndex: 0,
                          points: 10,
                        }
                      ])}
                      className="px-3 py-1.5 bg-white border border-[#800000] rounded-full text-xs font-bold text-[#800000] hover:bg-[#FFF5B8]"
                    >
                      + Add Question
                    </button>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button type="submit" className="px-6 py-2 y2k-btn-primary text-xs font-bold">
                      Save & Publish Quiz
                    </button>
                  </div>
                </form>
              </div>

              {/* Current Quizzes Table */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#800000]">Active & Past Quizzes List</h4>
                {quizzes.map(q => (
                  <div key={q.id} className="p-3 bg-white border-2 border-[#800000] rounded-xl flex items-center justify-between shadow-[2px_2px_0px_#800000]">
                    <div>
                      <span className="font-serif font-bold text-xs text-[#800000] block">{q.title}</span>
                      <span className="text-[10px] text-[#2D2D2D]/70 font-mono">
                        {q.category} • {q.questions.length} Qs • Status: {q.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteQuiz(q.id)}
                        className="p-1.5 bg-rose-100 text-rose-800 border border-[#800000] rounded-lg hover:bg-rose-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EVENTS MANAGEMENT TAB */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              {/* Event Creator Form */}
              <div className="p-4 bg-[#FAF9F6] border-2 border-[#800000] rounded-2xl shadow-[3px_3px_0px_#800000] space-y-4">
                <h3 className="font-serif font-bold text-sm text-[#800000]">Create New Campus Event</h3>

                <form onSubmit={handleSaveEvent} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">Event Title</label>
                      <input
                        type="text"
                        required
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        placeholder="e.g., TARKASH Inter-College Debate"
                        className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">Category</label>
                      <select
                        value={eventCategory}
                        onChange={(e) => setEventCategory(e.target.value as any)}
                        className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      >
                        <option value="Debate">Debate</option>
                        <option value="Quiz">Quiz</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Talk">Talk</option>
                        <option value="Competition">Competition</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">Poster Image URL</label>
                      <input
                        type="url"
                        value={eventPoster}
                        onChange={(e) => setEventPoster(e.target.value)}
                        placeholder="Poster image link..."
                        className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">Venue</label>
                      <input
                        type="text"
                        value={eventVenue}
                        onChange={(e) => setEventVenue(e.target.value)}
                        className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#800000] mb-1">Status</label>
                      <select
                        value={eventStatus}
                        onChange={(e) => setEventStatus(e.target.value as any)}
                        className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="live">Live</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#800000] mb-1">Description & Rules</label>
                    <textarea
                      rows={2}
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" className="px-6 py-2 y2k-btn-primary text-xs font-bold">
                      Save & Post Event
                    </button>
                  </div>
                </form>
              </div>

              {/* Event List */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#800000]">All Events & Attendance Verification</h4>
                {events.map(ev => (
                  <div key={ev.id} className="p-4 bg-white border-2 border-[#800000] rounded-xl space-y-3 shadow-[2px_2px_0px_#800000]">
                    <div className="flex items-center justify-between border-b border-[#800000]/20 pb-2">
                      <div>
                        <span className="font-serif font-bold text-sm text-[#800000] block">
                          {ev.title} {ev.eventSpecification ? `(${ev.eventSpecification})` : ''}
                        </span>
                        <span className="text-[10px] text-[#2D2D2D]/80 font-mono">
                          📍 {ev.venue} • 📅 10/08/2026 • ⏰ {ev.time || '2:15 PM - 4:15 PM'} • Registered: <strong>{ev.registeredParticipants?.length || 0}</strong>
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-1.5 bg-rose-100 text-rose-800 border border-[#800000] rounded-lg hover:bg-rose-200"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Registered Participants & Check-In List */}
                    {ev.registeredParticipants && ev.registeredParticipants.length > 0 ? (
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-mono font-bold text-[#800000] uppercase">
                          Participant Roster & Verification Log:
                        </span>
                        <div className="divide-y divide-[#800000]/10 border border-[#800000]/30 rounded-lg overflow-hidden bg-[#FAF9F6]">
                          {ev.registeredParticipants.map((p) => (
                            <div key={p.userId || p.email} className="p-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                              <div>
                                <span className="font-bold text-[#800000] block">{p.name} ({p.institution || 'LBSITW'})</span>
                                <span className="text-[10px] font-mono text-[#2D2D2D]/80">
                                  {p.email} • {p.branch} ({p.department}) • 📞 {p.contactNumber || 'N/A'}
                                </span>
                              </div>

                              <button
                                onClick={() => onToggleCheckIn && onToggleCheckIn(ev.id, p.userId)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border shrink-0 transition-colors ${
                                  p.checkedIn
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-600'
                                    : 'bg-[#FFF5B8] text-[#800000] border-[#800000] hover:bg-[#FFD700]'
                                }`}
                              >
                                {p.checkedIn ? '✓ Verified Attendance' : 'Verify Check-In'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] font-mono text-[#2D2D2D]/60 italic">
                        No participant registrations recorded yet.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATES TAB */}
          {activeTab === 'certificates' && (
            <div className="p-4 bg-[#FAF9F6] border-2 border-[#800000] rounded-2xl shadow-[3px_3px_0px_#800000] space-y-4">
              <h3 className="font-serif font-bold text-sm text-[#800000]">Issue Official E-Certificate</h3>

              {certSuccess && (
                <div className="p-3 bg-[#FFF5B8] border border-[#800000] rounded-xl text-xs font-bold text-[#800000]">
                  ✓ Certificate Issued Successfully to participant profile!
                </div>
              )}

              <form onSubmit={handleIssueCert} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#800000] mb-1">Participant Name *</label>
                    <input
                      type="text"
                      required
                      value={certRecipientName}
                      onChange={(e) => setCertRecipientName(e.target.value)}
                      placeholder="e.g., Devika S"
                      className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#800000] mb-1">Participant Email *</label>
                    <input
                      type="email"
                      required
                      value={certRecipientEmail}
                      onChange={(e) => setCertRecipientEmail(e.target.value)}
                      placeholder="e.g., devika.s@lbsitw.ac.in"
                      className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#800000] mb-1">Event / Quiz Title</label>
                    <input
                      type="text"
                      required
                      value={certEventTitle}
                      onChange={(e) => setCertEventTitle(e.target.value)}
                      className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#800000] mb-1">Award Type</label>
                    <select
                      value={certType}
                      onChange={(e) => setCertType(e.target.value as any)}
                      className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                    >
                      <option value="Event Participation">Event Participation</option>
                      <option value="Debate Winner">Debate Winner</option>
                      <option value="Quiz Achievement">Quiz Achievement</option>
                      <option value="Excellence Award">Excellence Award</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="px-6 py-2 y2k-btn-primary text-xs font-bold">
                  Generate & Send Certificate
                </button>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS & EMAIL REMINDERS TAB */}
          {activeTab === 'notifications' && (
            <div className="p-4 bg-[#FAF9F6] border-2 border-[#800000] rounded-2xl shadow-[3px_3px_0px_#800000] space-y-4">
              <h3 className="font-serif font-bold text-sm text-[#800000]">Broadcast Push Notification & Email Reminder</h3>

              {notifSuccess && (
                <div className="p-3 bg-[#FFF5B8] border border-[#800000] rounded-xl text-xs font-bold text-[#800000]">
                  ✓ Push Notification broadcasted to all active student portals!
                </div>
              )}

              <form onSubmit={handleSendNotif} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">Notification Title *</label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="e.g., 🔔 Final Call: Quiz League Closes at 8 PM!"
                    className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#800000] mb-1">Message Content *</label>
                  <textarea
                    required
                    rows={3}
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    placeholder="Type broadcast announcement message..."
                    className="w-full p-2 bg-white border-2 border-[#800000] rounded-xl text-xs font-bold text-[#2D2D2D]"
                  />
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 y2k-btn-primary text-xs font-bold uppercase">
                    Broadcast Push Notification
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CONTACT INBOX TAB */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-sm text-[#800000]">
                Contact Form Messages (Target: bodhiclub.lbsitw@gmail.com)
              </h3>

              {contactMessages.length > 0 ? (
                <div className="space-y-3">
                  {contactMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 bg-white border-2 border-[#800000] rounded-xl space-y-2 shadow-[2px_2px_0px_#800000]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-[#800000]">{msg.senderName} ({msg.senderEmail})</span>
                        <span className="text-[10px] font-mono text-[#2D2D2D]/70">{new Date(msg.submittedAt).toLocaleString()}</span>
                      </div>
                      <p className="font-bold text-xs text-[#800000]">Subject: {msg.subject}</p>
                      <p className="text-xs text-[#2D2D2D] leading-relaxed bg-[#FAF9F6] p-2.5 rounded-lg border border-[#800000]/40">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#2D2D2D]/60 italic">No messages received yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
