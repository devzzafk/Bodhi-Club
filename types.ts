export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  department?: string;
  semester?: string;
  rollNumber?: string;
  avatar: string;
  bio?: string;
  role: UserRole;
  createdAt: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
  posterUrl: string;
  durationMinutes: number;
  totalPoints: number;
  status: 'upcoming' | 'live' | 'closed';
  startTime: string;
  endTime: string;
  questions: Question[];
  createdBy: string;
  createdAt: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  totalPoints: number;
  timeSpentSeconds: number;
  submittedAt: string;
  answers: number[]; // Index of selected answer for each question
}

export interface EventParticipant {
  userId: string;
  name: string;
  institution: string;
  branch: string;
  department: string;
  email: string;
  contactNumber: string;
  registeredAt: string;
  checkedIn?: boolean;
  checkedInAt?: string;
}

export type EventStatus = 'upcoming' | 'live' | 'completed';

export interface EventItem {
  id: string;
  title: string;
  category: 'Quiz' | 'Debate' | 'Workshop' | 'Talk' | 'Competition';
  eventSpecification?: string; // e.g., "Debate Competition"
  description: string;
  posterUrl: string;
  status: EventStatus;
  eventDate: string; // e.g. "2026-08-10" or ISO
  time?: string; // e.g. "2:15 PM - 4:15 PM (2 hours)"
  mode?: 'offline' | 'online';
  venue: string; // e.g. "LITAA seminar hall"
  registrationDeadline: string;
  registrationFormUrl?: string;
  requiresRegistration: boolean;
  maxParticipants?: number;
  registeredUserIds: string[];
  registeredParticipants?: EventParticipant[];
  winners?: {
    position: string; // "1st Place", "2nd Place", "3rd Place", "Best Speaker"
    name: string;
    email: string;
  }[];
}

export interface Certificate {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  eventOrQuizTitle: string;
  type: 'Quiz Achievement' | 'Event Participation' | 'Debate Winner' | 'Excellence Award';
  issueDate: string;
  certificateCode: string;
  signedBy: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userEmail: string;
  avatar: string;
  department: string;
  totalPoints: number;
  quizzesTaken: number;
  debatesWon: number;
  rank: number;
  badges: string[];
}

export interface ExecomMember {
  id: string;
  name: string;
  role: string;
  team: 'MAIN EXECOM' | 'Content Team' | 'Design Team' | 'Outreach Team' | 'Volunteer Leads' | 'Social Media Leads' | 'Program Coordination Leads';
  email?: string;
  avatar?: string;
  isLead?: boolean;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'quiz' | 'event' | 'deadline' | 'certificate' | 'announcement';
  date: string;
  targetEmail?: string; // Optional if personal
  read: boolean;
  linkSection?: string;
}
