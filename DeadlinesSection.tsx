import React from 'react';
import { EventItem, Quiz } from '../types';
import { Clock, AlertTriangle, Calendar, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface DeadlinesSectionProps {
  events: EventItem[];
  quizzes: Quiz[];
  onNavigate: (tab: string) => void;
}

export const DeadlinesSection: React.FC<DeadlinesSectionProps> = ({
  events,
  quizzes,
  onNavigate,
}) => {
  // Combine deadlines
  const now = new Date().getTime();

  const eventDeadlines = events
    .filter(e => e.status !== 'completed')
    .map(e => ({
      id: e.id,
      title: e.title,
      type: 'Event Registration' as const,
      category: e.category,
      deadlineStr: e.registrationDeadline,
      deadlineTime: new Date(e.registrationDeadline).getTime(),
      targetTab: 'events',
      poster: e.posterUrl,
    }));

  const quizDeadlines = quizzes
    .filter(q => q.status !== 'closed')
    .map(q => ({
      id: q.id,
      title: q.title,
      type: 'Quiz League Window' as const,
      category: q.category,
      deadlineStr: q.endTime,
      deadlineTime: new Date(q.endTime).getTime(),
      targetTab: 'quizzes',
      poster: q.posterUrl,
    }));

  const allDeadlines = [...eventDeadlines, ...quizDeadlines]
    .sort((a, b) => a.deadlineTime - b.deadlineTime);

  const getRemainingTime = (targetTime: number) => {
    const diff = targetTime - now;
    if (diff <= 0) return 'Deadline Passed';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days} Days, ${hours} Hours Left`;
    return `${hours} Hours Left!`;
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b-2 border-[#800000] pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="y2k-badge bg-[#800000] text-[#FFD700] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#FFD700]" /> URGENT TRACKER
            </span>
            <span className="text-xs font-mono text-[#800000]">DEADLINE_COUNTDOWN_ENGINE</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#800000] tracking-tight mt-1 flex items-center gap-2">
            <span>Upcoming Registration Deadlines</span>
            <Sparkles className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
          </h2>
          <p className="text-sm font-medium text-[#2D2D2D]/80">
            Never miss an entry! Timers update live to keep you ahead of every closing window.
          </p>
        </div>
      </div>

      {/* Deadlines List */}
      {allDeadlines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDeadlines.map((item) => {
            const timeLeftText = getRemainingTime(item.deadlineTime);
            const isUrgent = item.deadlineTime - now < 3 * 24 * 60 * 60 * 1000; // < 3 days

            return (
              <div
                key={`${item.type}-${item.id}`}
                className="y2k-window bg-white flex flex-col justify-between overflow-hidden group hover:-translate-y-1 transition-transform border-2 border-[#800000]"
              >
                <div>
                  <div className="y2k-window-header bg-[#800000] text-white">
                    <span className="text-xs font-mono font-bold text-[#FFD700]">
                      {item.type.toUpperCase()}
                    </span>
                    <span
                      className={`y2k-badge ${
                        isUrgent
                          ? 'bg-[#FFD700] text-[#800000] animate-pulse'
                          : 'bg-[#FFF5B8] text-[#800000]'
                      }`}
                    >
                      {timeLeftText}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="y2k-badge bg-[#FAF9F6] text-[#800000] border border-[#800000]">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#800000] line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="p-3 bg-[#FAF9F6] border-2 border-[#800000] rounded-xl flex items-center gap-2 text-xs font-bold text-[#2D2D2D]">
                      <Calendar className="w-4 h-4 text-[#800000] shrink-0" />
                      <div>
                        <span className="block text-[10px] text-[#800000] font-mono uppercase">CLOSING AT</span>
                        <span>{new Date(item.deadlineStr).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => onNavigate(item.targetTab)}
                    className="w-full py-2.5 y2k-btn-primary text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>Register Before Deadline</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border-2 border-[#800000] rounded-2xl shadow-[4px_4px_0px_#800000] space-y-2">
          <CheckCircle2 className="w-10 h-10 mx-auto text-[#800000]" />
          <h3 className="font-serif font-bold text-lg text-[#800000]">
            No Urgent Deadlines Pending!
          </h3>
          <p className="text-xs text-[#2D2D2D]/70">
            All registrations are currently up to date. Check back soon for new launches.
          </p>
        </div>
      )}
    </section>
  );
};
