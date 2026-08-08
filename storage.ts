import { User, Quiz, EventItem, Certificate, LeaderboardEntry, ContactMessage, NotificationItem, QuizSubmission, ExecomMember } from '../types';
import { ADMIN_EMAILS, INITIAL_QUIZZES, INITIAL_EVENTS, INITIAL_LEADERBOARD, INITIAL_CERTIFICATES, INITIAL_NOTIFICATIONS, EXECOM_MEMBERS } from '../data/initialData';

const STORAGE_KEYS = {
  USER: 'bodhi_current_user_v2',
  QUIZZES: 'bodhi_quizzes_v2',
  EVENTS: 'bodhi_events_v2',
  SUBMISSIONS: 'bodhi_submissions_v2',
  LEADERBOARD: 'bodhi_leaderboard_v2',
  CERTIFICATES: 'bodhi_certificates_v2',
  NOTIFICATIONS: 'bodhi_notifications_v2',
  CONTACT_MESSAGES: 'bodhi_contact_messages_v2',
  EXECOM: 'bodhi_execom_members_v2',
};

// Local storage helper
export const storage = {
  // Current User
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) {
      try { return JSON.parse(data); } catch { return null; }
    }
    return null;
  },
  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  // Quizzes
  getQuizzes: (): Quiz[] => {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    if (data) {
      try { return JSON.parse(data); } catch { return INITIAL_QUIZZES; }
    }
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(INITIAL_QUIZZES));
    return INITIAL_QUIZZES;
  },
  saveQuizzes: (quizzes: Quiz[]) => {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },

  // Events
  getEvents: (): EventItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (data) {
      try {
        const parsed: EventItem[] = JSON.parse(data);
        const cleaned = parsed.map(e => {
          if (e.posterUrl && e.posterUrl.includes('unsplash.com')) {
            return { ...e, posterUrl: '' };
          }
          return e;
        });
        const hasEarthForum = cleaned.some(e => e.id === 'evt-earth-forum-2026' || e.title.toLowerCase() === 'earth forum');
        if (!hasEarthForum) {
          const merged = [...INITIAL_EVENTS, ...cleaned];
          localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(merged));
          return merged;
        }
        return cleaned;
      } catch {
        return INITIAL_EVENTS;
      }
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  },
  saveEvents: (events: EventItem[]) => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  // Submissions
  getSubmissions: (): QuizSubmission[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (data) {
      try { return JSON.parse(data); } catch { return []; }
    }
    return [];
  },
  saveSubmissions: (submissions: QuizSubmission[]) => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  },

  // Leaderboard
  getLeaderboard: (): LeaderboardEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (data) {
      try { return JSON.parse(data); } catch { return INITIAL_LEADERBOARD; }
    }
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(INITIAL_LEADERBOARD));
    return INITIAL_LEADERBOARD;
  },
  saveLeaderboard: (leaderboard: LeaderboardEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
  },

  // Certificates
  getCertificates: (): Certificate[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
    if (data) {
      try { return JSON.parse(data); } catch { return INITIAL_CERTIFICATES; }
    }
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
    return INITIAL_CERTIFICATES;
  },
  saveCertificates: (certs: Certificate[]) => {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certs));
  },

  // Notifications
  getNotifications: (): NotificationItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (data) {
      try { return JSON.parse(data); } catch { return INITIAL_NOTIFICATIONS; }
    }
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  },
  saveNotifications: (notifications: NotificationItem[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  // Contact Messages
  getContactMessages: (): ContactMessage[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES);
    if (data) {
      try { return JSON.parse(data); } catch { return []; }
    }
    return [];
  },
  saveContactMessages: (messages: ContactMessage[]) => {
    localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(messages));
  },

  // Execom / Committee Members
  getExecomMembers: (): ExecomMember[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EXECOM);
    if (data) {
      try { return JSON.parse(data); } catch { return EXECOM_MEMBERS; }
    }
    localStorage.setItem(STORAGE_KEYS.EXECOM, JSON.stringify(EXECOM_MEMBERS));
    return EXECOM_MEMBERS;
  },
  saveExecomMembers: (members: ExecomMember[]) => {
    localStorage.setItem(STORAGE_KEYS.EXECOM, JSON.stringify(members));
  },

  // Helper to check if an email is admin
  isAdminEmail: (email: string): boolean => {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    return ADMIN_EMAILS.map(e => e.trim().toLowerCase()).includes(cleanEmail);
  }
};
