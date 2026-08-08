import { ExecomMember, Quiz, EventItem, LeaderboardEntry, Certificate, NotificationItem } from '../types';

export const ADMIN_EMAILS = [
  'devuz19693@gmail.com',
  'anusha.palliyara@gmail.com',
  'devika272006@gmail.com',
  'malavikamahesh07@gmail.com',
  'gourynairm@gmail.com',
  'meghamsekhar@gmail.com',
  'clarcha92@gmail.com',
  'shruthilayars35@gmail.com',
  'kaarunya624@gmail.com',
  'sreelekshmicheruvalath@gmail.com',
  'rakshanabijikumar16@gmail.com',
];

export const EXECOM_MEMBERS: ExecomMember[] = [
  // MAIN EXECOM
  { id: 'm1', name: 'MEGHA M SEKHAR', role: 'PRESIDENT', team: 'MAIN EXECOM', email: 'meghamsekhar@gmail.com', isLead: true },
  { id: 'm2', name: 'GOWRI G NAIR', role: 'VICE PRESIDENT', team: 'MAIN EXECOM', email: 'gourynairm@gmail.com', isLead: true },
  { id: 'm3', name: 'ABHIRAMI D G', role: 'SECRETARY', team: 'MAIN EXECOM', isLead: true },
  { id: 'm4', name: 'PALLAVI J CHANDRAN', role: 'JOINT SECRETARY', team: 'MAIN EXECOM', isLead: true },
  { id: 'm5', name: 'KAARUNYA PRASAD', role: 'TREASURER', team: 'MAIN EXECOM', email: 'kaarunya624@gmail.com', isLead: true },

  // Content Team
  { id: 'c1', name: 'Archa C L', role: 'Content Team Lead', team: 'Content Team', email: 'clarcha92@gmail.com', isLead: true },
  { id: 'c2', name: 'Sreelekshmi C', role: 'Content Team Lead', team: 'Content Team', email: 'sreelekshmicheruvalath@gmail.com', isLead: true },

  // Design Team
  { id: 'd1', name: 'Rakshana Bijikumar', role: 'Design Team Lead', team: 'Design Team', email: 'rakshanabijikumar16@gmail.com', isLead: true },
  { id: 'd2', name: 'Sreya', role: 'Design Team Lead', team: 'Design Team', isLead: true },

  // Outreach Team
  { id: 'o1', name: 'Bhavya S R', role: 'Outreach Team Lead', team: 'Outreach Team', isLead: true },
  { id: 'o2', name: 'Malavika Mahesh L', role: 'Outreach Team Lead', team: 'Outreach Team', email: 'malavikamahesh07@gmail.com', isLead: true },

  // Volunteer Leads
  { id: 'v1', name: 'Devika N A', role: 'Volunteer Lead', team: 'Volunteer Leads', email: 'devika272006@gmail.com', isLead: true },
  { id: 'v2', name: 'Hiba P Harshad', role: 'Volunteer Lead', team: 'Volunteer Leads', isLead: true },

  // Social Media Leads
  { id: 's1', name: 'Akshaya R Gopan', role: 'Social Media Lead', team: 'Social Media Leads', isLead: true },

  // Program Coordination Leads
  { id: 'p1', name: 'Goury M Nair', role: 'Program Coordination Lead', team: 'Program Coordination Leads', email: 'gourynairm@gmail.com', isLead: true },
  { id: 'p2', name: 'Anagha S S', role: 'Program Coordination Lead', team: 'Program Coordination Leads', isLead: true },
];

export const INITIAL_QUIZZES: Quiz[] = [];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-earth-forum-2026',
    title: 'Earth Forum',
    category: 'Debate',
    eventSpecification: 'Debate Competition',
    description: 'Earth Forum - Official BODHI Debate Competition discussing climate crisis, environmental policy, and sustainable futures. Join as a debater or audience member at LITAA Seminar Hall!',
    posterUrl: '',
    status: 'upcoming',
    eventDate: '2026-08-10',
    time: '2:15 PM - 4:15 PM (2 hours)',
    mode: 'offline',
    venue: 'LITAA seminar hall',
    registrationDeadline: '2026-08-10T14:15:00Z',
    requiresRegistration: true,
    registeredUserIds: [],
    registeredParticipants: [],
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [];

export const INITIAL_CERTIFICATES: Certificate[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
