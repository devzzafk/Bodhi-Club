import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Search, Sparkles, Award, Star, Flame, Medal } from 'lucide-react';

interface LeaderboardSectionProps {
  leaderboard: LeaderboardEntry[];
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ leaderboard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'overall' | 'quizzes' | 'debates'>('overall');

  // Sort entries based on filter
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (filterCategory === 'quizzes') return b.quizzesTaken - a.quizzesTaken || b.totalPoints - a.totalPoints;
    if (filterCategory === 'debates') return b.debatesWon - a.debatesWon || b.totalPoints - a.totalPoints;
    return b.totalPoints - a.totalPoints;
  });

  const filtered = sortedLeaderboard.filter(item =>
    item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top3 = filtered.slice(0, 3);
  const remaining = filtered.slice(3);

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#800000] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="y2k-badge bg-[#800000] text-[#FFD700]">HALL OF FAME</span>
            <span className="text-xs font-mono text-[#800000]">MEMBER_RANKINGS_MATRIX</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#800000] tracking-tight mt-1 flex items-center gap-2">
            <span>BODHI Member Leaderboard</span>
            <Trophy className="w-6 h-6 text-[#FFD700] fill-[#FFD700] sparkle-icon" />
          </h2>
          <p className="text-sm font-medium text-[#2D2D2D]/80">
            Celebrating top quizmasters, articulate debaters, and active student contributors at LBSITW.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]" />
            <input
              type="text"
              placeholder="Search member or dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border-2 border-[#800000] rounded-2xl text-xs font-bold text-[#2D2D2D] shadow-[2px_2px_0px_#800000] focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-[#800000] shadow-[2px_2px_0px_#800000]">
            {(['overall', 'quizzes', 'debates'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 text-xs font-bold rounded-xl capitalize transition-all ${
                  filterCategory === cat
                    ? 'bg-[#800000] text-[#FFD700]'
                    : 'text-[#2D2D2D] hover:bg-[#FAF9F6] hover:text-[#800000]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty Leaderboard Notice */}
      {filtered.length === 0 && (
        <div className="p-12 text-center bg-white border-2 border-[#800000] rounded-2xl shadow-[4px_4px_0px_#800000] space-y-2">
          <Trophy className="w-10 h-10 mx-auto text-[#800000]" />
          <h3 className="font-serif font-bold text-lg text-[#800000]">Leaderboard is Currently Empty</h3>
          <p className="text-xs text-[#2D2D2D]/70">
            Complete online quizzes or participate in debate events to earn points and claim top positions on the official LBSITW rankings!
          </p>
        </div>
      )}

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="y2k-window bg-white border-2 border-[#800000] p-6 text-center space-y-3 relative order-2 md:order-1 mt-0 md:mt-6">
              <div className="w-10 h-10 mx-auto rounded-xl bg-slate-200 border-2 border-[#800000] flex items-center justify-center font-mono font-bold text-sm text-[#800000] shadow-[2px_2px_0px_#800000] absolute -top-5 left-1/2 -translate-x-1/2">
                🥈 2nd
              </div>
              <img
                src={top3[1].avatar}
                alt={top3[1].userName}
                className="w-20 h-20 mx-auto rounded-full border-2 border-[#800000] object-cover shadow-[3px_3px_0px_#800000]"
              />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#800000]">{top3[1].userName}</h3>
                <p className="text-xs text-[#2D2D2D]/70">{top3[1].department}</p>
              </div>
              <div className="p-2 bg-[#FAF9F6] border border-[#800000] rounded-xl text-xs font-mono font-bold text-[#800000]">
                {top3[1].totalPoints} TOTAL PTS
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {top3[1].badges.map((b, idx) => (
                  <span key={idx} className="y2k-badge bg-[#800000] text-[#FFD700] text-[10px]">{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* 1st Place Champion */}
          {top3[0] && (
            <div className="y2k-window bg-[#FFF5B8] border-2 border-[#800000] p-6 text-center space-y-3 relative order-1 md:order-2 shadow-[6px_6px_0px_#800000]">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#FFD700] border-2 border-[#800000] flex items-center justify-center font-mono font-bold text-base text-[#800000] shadow-[3px_3px_0px_#800000] absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce">
                👑 1st
              </div>
              <img
                src={top3[0].avatar}
                alt={top3[0].userName}
                className="w-24 h-24 mx-auto rounded-full border-4 border-[#800000] object-cover shadow-[4px_4px_0px_#800000]"
              />
              <div>
                <span className="y2k-badge bg-[#800000] text-[#FFD700]">LBSITW TOP QUIZZER</span>
                <h3 className="font-serif font-bold text-xl text-[#800000] mt-1">{top3[0].userName}</h3>
                <p className="text-xs text-[#800000] font-bold">{top3[0].department}</p>
              </div>
              <div className="p-2.5 bg-[#800000] text-[#FFD700] border-2 border-[#800000] rounded-xl text-sm font-mono font-bold">
                ⚡ {top3[0].totalPoints} TOTAL POINTS
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {top3[0].badges.map((b, idx) => (
                  <span key={idx} className="y2k-badge bg-white text-[#800000] border border-[#800000] text-[10px]">{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="y2k-window bg-white border-2 border-[#800000] p-6 text-center space-y-3 relative order-3 mt-0 md:mt-8">
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100 border-2 border-[#800000] flex items-center justify-center font-mono font-bold text-sm text-[#800000] shadow-[2px_2px_0px_#800000] absolute -top-5 left-1/2 -translate-x-1/2">
                🥉 3rd
              </div>
              <img
                src={top3[2].avatar}
                alt={top3[2].userName}
                className="w-20 h-20 mx-auto rounded-full border-2 border-[#800000] object-cover shadow-[3px_3px_0px_#800000]"
              />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#800000]">{top3[2].userName}</h3>
                <p className="text-xs text-[#2D2D2D]/70">{top3[2].department}</p>
              </div>
              <div className="p-2 bg-[#FAF9F6] border border-[#800000] rounded-xl text-xs font-mono font-bold text-[#800000]">
                {top3[2].totalPoints} TOTAL PTS
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {top3[2].badges.map((b, idx) => (
                  <span key={idx} className="y2k-badge bg-[#800000] text-[#FFD700] text-[10px]">{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Remaining Ranks Table */}
      {filtered.length > 0 && (
        <div className="y2k-window bg-white overflow-hidden border-2 border-[#800000]">
          <div className="y2k-window-header bg-[#800000] text-white">
            <span className="text-xs font-mono font-bold text-[#FFD700]">
              RANKINGS TABLE ({filtered.length} MEMBERS)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b-2 border-[#800000] text-xs font-mono font-bold text-[#800000]">
                  <th className="p-3 text-center w-12">#</th>
                  <th className="p-3">Member</th>
                  <th className="p-3 hidden sm:table-cell">Department</th>
                  <th className="p-3 text-center">Quizzes</th>
                  <th className="p-3 text-center">Debates</th>
                  <th className="p-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#800000]/20">
                {filtered.map((member, index) => (
                  <tr key={member.userId} className="hover:bg-[#FAF9F6] text-xs font-bold text-[#2D2D2D]">
                    <td className="p-3 text-center font-mono text-sm text-[#800000]">
                      {index + 1}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.userName}
                          className="w-8 h-8 rounded-full border border-[#800000] object-cover"
                        />
                        <div>
                          <span className="font-serif font-bold text-sm text-[#800000] block">{member.userName}</span>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {member.badges.map((b, i) => (
                              <span key={i} className="text-[10px] bg-[#FFF5B8] px-1.5 py-0.5 rounded border border-[#800000] text-[#800000]">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#2D2D2D]/70 hidden sm:table-cell">
                      {member.department}
                    </td>
                    <td className="p-3 text-center font-mono">
                      {member.quizzesTaken}
                    </td>
                    <td className="p-3 text-center font-mono">
                      {member.debatesWon}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-sm text-[#800000]">
                      {member.totalPoints} PTS
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
