import React, { useState, useEffect } from 'react';
import { User, Quiz, EventItem, QuizSubmission, Certificate, LeaderboardEntry, ContactMessage, NotificationItem, ExecomMember } from './types';
import { storage } from './lib/storage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuizLeague } from './components/QuizLeague';
import { EventsSection } from './components/EventsSection';
import { DeadlinesSection } from './components/DeadlinesSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { ExecomSection } from './components/ExecomSection';
import { ContactSection } from './components/ContactSection';
import { ProfileModal } from './components/ProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { NotificationCenter } from './components/NotificationCenter';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getUser());
  const [activeTab, setActiveTab] = useState<string>('hero');

  // Core Data
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => storage.getQuizzes());
  const [events, setEvents] = useState<EventItem[]>(() => storage.getEvents());
  const [submissions, setSubmissions] = useState<QuizSubmission[]>(() => storage.getSubmissions());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => storage.getLeaderboard());
  const [certificates, setCertificates] = useState<Certificate[]>(() => storage.getCertificates());
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => storage.getContactMessages());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storage.getNotifications());
  const [execomMembers, setExecomMembers] = useState<ExecomMember[]>(() => storage.getExecomMembers());

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);

  // Sync state changes to storage
  useEffect(() => {
    storage.saveQuizzes(quizzes);
  }, [quizzes]);

  useEffect(() => {
    storage.saveEvents(events);
  }, [events]);

  useEffect(() => {
    storage.saveSubmissions(submissions);
  }, [submissions]);

  useEffect(() => {
    storage.saveLeaderboard(leaderboard);
  }, [leaderboard]);

  useEffect(() => {
    storage.saveCertificates(certificates);
  }, [certificates]);

  useEffect(() => {
    storage.saveContactMessages(contactMessages);
  }, [contactMessages]);

  useEffect(() => {
    storage.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    storage.saveExecomMembers(execomMembers);
  }, [execomMembers]);

  const handleUpdateExecomMember = (updatedMember: ExecomMember) => {
    setExecomMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    storage.setUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storage.setUser(null);
    setActiveTab('hero');
  };

  const handleUpdateUser = (updated: Partial<User>) => {
    if (!currentUser) return;
    const newUsr = { ...currentUser, ...updated };
    setCurrentUser(newUsr);
    storage.setUser(newUsr);
  };

  // Quiz submission callback
  const handleSubmitQuiz = (submissionData: Omit<QuizSubmission, 'id' | 'submittedAt'>) => {
    const sub: QuizSubmission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    const updatedSubmissions = [sub, ...submissions];
    setSubmissions(updatedSubmissions);

    // Update Leaderboard entry for this user
    setLeaderboard(prevLb => {
      const existingIdx = prevLb.findIndex(entry => entry.userEmail === sub.userEmail);
      if (existingIdx !== -1) {
        const updated = [...prevLb];
        updated[existingIdx].totalPoints += sub.score;
        updated[existingIdx].quizzesTaken += 1;
        return updated;
      } else {
        const newEntry: LeaderboardEntry = {
          userId: sub.userId,
          userName: sub.userName,
          userEmail: sub.userEmail,
          avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
          department: currentUser?.department || 'Student Member',
          totalPoints: sub.score,
          quizzesTaken: 1,
          debatesWon: 0,
          rank: prevLb.length + 1,
          badges: ['⚡ New Quizzer'],
        };
        return [...prevLb, newEntry];
      }
    });
  };

  // Event registration callback
  const handleRegisterForEvent = (
    eventId: string, 
    details: { name: string; institution: string; branch: string; department: string; email: string; contactNumber: string }
  ) => {
    if (!currentUser) return;

    setEvents(prevEvents =>
      prevEvents.map(ev => {
        if (ev.id === eventId) {
          const registeredUserIds = ev.registeredUserIds.includes(currentUser.id)
            ? ev.registeredUserIds
            : [...ev.registeredUserIds, currentUser.id];

          const existingParticipants = ev.registeredParticipants || [];
          // If already registered, update details; else append
          const isAlreadyIn = existingParticipants.some(p => p.userId === currentUser.id || p.email.toLowerCase() === details.email.toLowerCase());
          
          let updatedParticipants;
          if (isAlreadyIn) {
            updatedParticipants = existingParticipants.map(p => {
              if (p.userId === currentUser.id || p.email.toLowerCase() === details.email.toLowerCase()) {
                return {
                  ...p,
                  name: details.name,
                  institution: details.institution,
                  branch: details.branch,
                  department: details.department,
                  email: details.email,
                  contactNumber: details.contactNumber,
                };
              }
              return p;
            });
          } else {
            updatedParticipants = [
              ...existingParticipants,
              {
                userId: currentUser.id,
                name: details.name,
                institution: details.institution,
                branch: details.branch,
                department: details.department,
                email: details.email,
                contactNumber: details.contactNumber,
                registeredAt: new Date().toISOString(),
                checkedIn: false,
              }
            ];
          }

          return {
            ...ev,
            registeredUserIds,
            registeredParticipants: updatedParticipants,
          };
        }
        return ev;
      })
    );
  };

  // Toggle Check-In Attendance for Event Participant
  const handleToggleCheckInParticipant = (eventId: string, userId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(ev => {
        if (ev.id === eventId && ev.registeredParticipants) {
          const updatedParticipants = ev.registeredParticipants.map(p => {
            if (p.userId === userId) {
              const nextChecked = !p.checkedIn;
              return {
                ...p,
                checkedIn: nextChecked,
                checkedInAt: nextChecked ? new Date().toISOString() : undefined,
              };
            }
            return p;
          });
          return {
            ...ev,
            registeredParticipants: updatedParticipants,
          };
        }
        return ev;
      })
    );
  };

  // Admin issue certificate
  const handleIssueCertificate = (cert: Certificate) => {
    setCertificates(prev => [cert, ...prev]);
  };

  // Admin broadcast notification
  const handleSendNotification = (notifData: Omit<NotificationItem, 'id' | 'date' | 'read'>) => {
    const notif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}`,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Contact form submission
  const handleSubmitMessage = (msgData: Omit<ContactMessage, 'id' | 'submittedAt' | 'read'>) => {
    const msg: ContactMessage = {
      ...msgData,
      id: `cm-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      read: false,
    };
    setContactMessages(prev => [msg, ...prev]);
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const liveQuiz = quizzes.find(q => q.status === 'live');
  const upcomingEvent = events.find(e => e.status === 'upcoming');
  const userSubmissions = currentUser ? submissions.filter(s => s.userEmail === currentUser.email) : [];
  const userRegisteredEvents = currentUser ? events.filter(e => e.registeredUserIds.includes(currentUser.id)) : [];
  const userCertificates = currentUser ? certificates.filter(c => c.userEmail.toLowerCase() === currentUser.email.toLowerCase()) : [];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#ffc4d6] selection:text-[#2d2342]">
      {/* OS Navigation Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        unreadNotificationsCount={unreadNotifsCount}
        onOpenNotifications={() => setNotificationCenterOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'hero' && (
          <Hero
            onNavigate={setActiveTab}
            liveQuiz={liveQuiz}
            upcomingEvent={upcomingEvent}
            totalMembersCount={leaderboard.length}
          />
        )}

        {activeTab === 'quizzes' && (
          <QuizLeague
            quizzes={quizzes}
            currentUser={currentUser}
            submissions={submissions}
            onSubmitQuiz={handleSubmitQuiz}
            onRequireAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'events' && (
          <EventsSection
            events={events}
            currentUser={currentUser}
            onRegisterForEvent={handleRegisterForEvent}
            onToggleCheckIn={handleToggleCheckInParticipant}
            onSaveEvents={setEvents}
            onRequireAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'deadlines' && (
          <DeadlinesSection
            events={events}
            quizzes={quizzes}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardSection leaderboard={leaderboard} />
        )}

        {activeTab === 'execom' && (
          <ExecomSection
            currentUser={currentUser}
            execomMembers={execomMembers}
            onUpdateExecomMember={handleUpdateExecomMember}
          />
        )}

        {activeTab === 'contact' && (
          <ContactSection onSubmitMessage={handleSubmitMessage} />
        )}

        {activeTab === 'profile' && currentUser && (
          <ProfileModal
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            userSubmissions={userSubmissions}
            userRegisteredEvents={userRegisteredEvents}
            allEvents={events}
            userCertificates={userCertificates}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#800000] text-white border-t-2 border-[#FFD700] py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full border-2 border-[#FFD700] overflow-hidden bg-[#800000] shrink-0 shadow-[2px_2px_0px_#FFD700]">
              <img
                src="/src/assets/images/bodhi_logo_1786159250405.jpg"
                alt="BODHI Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-bold font-serif text-sm text-[#FFD700] tracking-wide">
              BODHI • Quiz & Debate Club of LBSITW
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#FFF5B8]">
            <a href="mailto:bodhiclub.lbsitw@gmail.com" className="hover:text-white transition-colors">bodhiclub.lbsitw@gmail.com</a>
            <span>•</span>
            <a href="https://www.linkedin.com/in/bodhi-lbsitw/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <span>•</span>
            <a href="https://www.instagram.com/bodhi.lbsitw/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
          </div>

          <div className="text-[10px] text-[#FFF5B8]/80 font-mono">
            Poojappura, Thiruvananthapuram © 2026 BODHI LBSITW
          </div>
        </div>
      </footer>

      {/* Modals */}
      {authModalOpen && (
        <AuthModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setAuthModalOpen(false)}
        />
      )}

      {adminModalOpen && currentUser?.role === 'admin' && (
        <AdminDashboard
          quizzes={quizzes}
          onSaveQuizzes={setQuizzes}
          events={events}
          onSaveEvents={setEvents}
          onToggleCheckIn={handleToggleCheckInParticipant}
          submissions={submissions}
          certificates={certificates}
          onIssueCertificate={handleIssueCertificate}
          contactMessages={contactMessages}
          onSendNotification={handleSendNotification}
          onClose={() => setAdminModalOpen(false)}
        />
      )}

      {notificationCenterOpen && (
        <NotificationCenter
          notifications={notifications}
          onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          onClose={() => setNotificationCenterOpen(false)}
          onNavigate={setActiveTab}
        />
      )}
    </div>
  );
}
