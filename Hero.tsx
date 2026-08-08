import React from 'react';
import { Sparkles, Trophy, Flame, Calendar, ArrowRight, Heart, Star, Radio } from 'lucide-react';
import { Quiz, EventItem } from '../types';

interface HeroProps {
  onNavigate: (tab: string) => void;
  liveQuiz?: Quiz;
  upcomingEvent?: EventItem;
  totalMembersCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  liveQuiz,
  upcomingEvent,
  totalMembersCount,
}) => {
  return (
    <section className="relative pt-6 pb-10 px-4 overflow-hidden">
      {/* Background Floaters */}
      <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-[#800000]/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-4 right-12 w-24 h-24 rounded-full bg-[#FFD700]/10 blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Main Card Window */}
        <div className="y2k-window bg-white relative overflow-hidden border-2 border-[#800000]">
          {/* Header Bar */}
          <div className="y2k-window-header bg-[#800000] text-white">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FFD700] border border-[#5c0000]" />
              <div className="w-3 h-3 rounded-full bg-amber-400 border border-[#5c0000]" />
              <div className="w-3 h-3 rounded-full bg-emerald-400 border border-[#5c0000]" />
              <span className="ml-2 font-mono text-xs font-bold tracking-widest text-[#FFD700]">
                BODHI_LBSITW_DASHBOARD_V2.0
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFD700] text-[#800000] border border-[#800000]">
                LBSITW OFFICIAL
              </span>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-6 md:p-10 relative">
            {/* Sticker Decor */}
            <div className="hidden lg:block absolute -top-3 -right-3 rotate-3 z-10">
              <div className="bg-[#FFD700] border-2 border-[#800000] px-3 py-1.5 rounded-2xl shadow-[3px_3px_0px_#800000] text-xs font-black text-[#800000] flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-[#800000] text-[#800000]" />
                <span>WOMEN IN TECH & DEBATE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border-2 border-[#800000] shadow-[2px_2px_0px_#800000] text-xs font-bold text-[#800000]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
                  <span className="font-mono uppercase tracking-wider">LIGHTING UP MINDS • DEBATING TRUTHS</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#800000] overflow-hidden bg-[#800000] shadow-[4px_4px_0px_#800000] shrink-0">
                    <img
                      src="/src/assets/images/bodhi_logo_1786159250405.jpg"
                      alt="Official BODHI LBSITW Logo"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#800000] leading-[1.1] tracking-tight">
                    Where Intellect Meets <span className="italic text-[#800000] underline decoration-[#FFD700] decoration-4">Expression</span>
                  </h1>
                </div>

                <p className="text-base sm:text-lg font-medium text-[#2D2D2D]/80 leading-relaxed">
                  Welcome to <strong className="text-[#800000]">BODHI</strong>, the Official Quiz & Debate Club of <strong className="text-[#800000]">LBS Institute of Technology for Women, Poojappura</strong>. Uniting articulate thinkers, trivia champions, and fearless debaters.
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('quizzes')}
                    className="px-6 py-3 y2k-btn-primary text-sm flex items-center gap-2 group"
                  >
                    <Flame className="w-4 h-4 text-[#FFD700] fill-[#FFD700] group-hover:scale-110 transition-transform" />
                    <span>Enter Quiz League</span>
                    <ArrowRight className="w-4 h-4 text-[#FFD700]" />
                  </button>

                  <button
                    onClick={() => onNavigate('events')}
                    className="px-5 py-3 y2k-btn-pink text-sm flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#800000]" />
                    <span>Explore Events</span>
                  </button>

                  <button
                    onClick={() => onNavigate('leaderboard')}
                    className="px-5 py-3 y2k-btn-secondary text-sm flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-[#800000]" />
                    <span>Leaderboard</span>
                  </button>
                </div>

                {/* College Branding Badges */}
                <div className="pt-4 flex flex-wrap items-center gap-2.5 text-xs font-bold text-[#2D2D2D]">
                  <span className="flex items-center gap-1 px-3 py-1 bg-white border border-[#800000] rounded-xl shadow-[1px_1px_0px_#800000]">
                    📍 LBSITW, Poojappura
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#FFD700]/20 text-[#800000] border border-[#800000] rounded-xl shadow-[1px_1px_0px_#800000]">
                    🎓 Student Centric
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#800000]/10 text-[#800000] border border-[#800000] rounded-xl shadow-[1px_1px_0px_#800000]">
                    📜 Verified Certificates
                  </span>
                </div>
              </div>

              {/* Right Column Widget Collages */}
              <div className="lg:col-span-5 space-y-4">
                {/* Live Quiz Spotlight Card */}
                {liveQuiz ? (
                  <div className="p-5 bg-gradient-to-br from-[#FAF9F6] to-[#FFF5B8] rounded-2xl border-2 border-[#800000] shadow-[4px_4px_0px_#800000] relative group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="y2k-badge bg-[#800000] text-[#FFD700] flex items-center gap-1 animate-pulse">
                        <Radio className="w-3 h-3 text-[#FFD700]" /> QUIZ LIVE NOW
                      </span>
                      <span className="text-[11px] font-bold text-[#800000]/80">
                        {liveQuiz.questions.length} Qs • {liveQuiz.durationMinutes} Mins
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#800000] line-clamp-1">
                      {liveQuiz.title}
                    </h3>

                    <p className="text-xs text-[#2D2D2D]/80 line-clamp-2 mt-1 mb-3">
                      {liveQuiz.description}
                    </p>

                    <button
                      onClick={() => onNavigate('quizzes')}
                      className="w-full py-2.5 y2k-btn-yellow text-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Take Quiz & Earn Points</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-2xl border-2 border-[#800000] shadow-[3px_3px_0px_#800000]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#800000]">
                      <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                      <span>Next Quiz League Round Launching Soon!</span>
                    </div>
                  </div>
                )}

                {/* Upcoming Event Alert */}
                {upcomingEvent && (
                  <div className="p-4 bg-white rounded-2xl border-2 border-[#800000] shadow-[3px_3px_0px_#800000] flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#800000] border-2 border-[#FFD700] flex flex-col items-center justify-center text-[#FFD700] shrink-0 font-extrabold">
                      <span className="text-[10px] uppercase font-mono">
                        {new Date(upcomingEvent.eventDate).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg leading-none font-serif font-bold">
                        {new Date(upcomingEvent.eventDate).getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#800000] uppercase tracking-wider font-mono">
                        FEATURED UPCOMING EVENT
                      </span>
                      <h4 className="font-bold text-sm text-[#2D2D2D] truncate">
                        {upcomingEvent.title}
                      </h4>
                      <p className="text-[11px] text-[#2D2D2D]/70 truncate">
                        📍 {upcomingEvent.venue}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('events')}
                      className="p-2 y2k-btn-secondary text-xs rounded-xl shrink-0"
                      title="View Event"
                    >
                      <ArrowRight className="w-4 h-4 text-[#800000]" />
                    </button>
                  </div>
                )}

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border-2 border-[#800000] rounded-xl shadow-[2px_2px_0px_#800000] text-center">
                    <div className="font-serif font-bold text-xl text-[#800000]">200+</div>
                    <div className="text-[10px] font-bold text-[#800000]/70 uppercase font-mono">Members</div>
                  </div>
                  <div className="p-3 bg-white border-2 border-[#800000] rounded-xl shadow-[2px_2px_0px_#800000] text-center">
                    <div className="font-serif font-bold text-xl text-[#800000]">15+</div>
                    <div className="text-[10px] font-bold text-[#800000]/70 uppercase font-mono">Debates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

