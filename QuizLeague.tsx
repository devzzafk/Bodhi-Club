import React, { useState } from 'react';
import { Quiz, QuizSubmission, User } from '../types';
import { Play, Trophy, Clock, Sparkles, X, ChevronRight, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizLeagueProps {
  quizzes: Quiz[];
  currentUser: User | null;
  submissions: QuizSubmission[];
  onSubmitQuiz: (submission: Omit<QuizSubmission, 'id' | 'submittedAt'>) => void;
  onRequireAuth: () => void;
}

export const QuizLeague: React.FC<QuizLeagueProps> = ({
  quizzes,
  currentUser,
  submissions,
  onSubmitQuiz,
  onRequireAuth,
}) => {
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'closed'>('all');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  
  // Interactive Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizTimer, setQuizTimer] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState<QuizSubmission | null>(null);

  // Closed Quiz Leaderboard Modal State
  const [viewingLeaderboardQuiz, setViewingLeaderboardQuiz] = useState<Quiz | null>(null);

  const filteredQuizzes = quizzes.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  // Start Quiz
  const handleStartQuiz = (quiz: Quiz) => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    // Check if user already took this quiz
    const existing = submissions.find(s => s.quizId === quiz.id && s.userId === currentUser.id);
    if (existing) {
      alert(`You have already completed "${quiz.title}" with a score of ${existing.score}/${existing.totalPoints}! Check the leaderboard below.`);
      return;
    }

    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setTimeLeft(quiz.durationMinutes * 60);
    setIsSubmitted(false);

    if (quizTimer) clearInterval(quizTimer);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit(quiz);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setQuizTimer(timer);
  };

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleAutoSubmit = (quiz: Quiz) => {
    finishAndSubmitQuiz(quiz);
  };

  const finishAndSubmitQuiz = (quiz: Quiz) => {
    if (quizTimer) clearInterval(quizTimer);

    // Calculate score
    let calculatedScore = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        calculatedScore += q.points;
      }
    });

    const timeSpent = quiz.durationMinutes * 60 - timeLeft;

    const newSubmission: QuizSubmission = {
      id: `sub-${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      userId: currentUser!.id,
      userName: currentUser!.name,
      userEmail: currentUser!.email,
      score: calculatedScore,
      totalPoints: quiz.totalPoints,
      timeSpentSeconds: timeSpent,
      submittedAt: new Date().toISOString(),
      answers: selectedAnswers,
    };

    onSubmitQuiz(newSubmission);
    setLatestSubmission(newSubmission);
    setIsSubmitted(true);

    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const closeQuizModal = () => {
    if (quizTimer) clearInterval(quizTimer);
    setActiveQuiz(null);
    setIsSubmitted(false);
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#800000] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="y2k-badge bg-[#800000] text-[#FFD700]">BODHI ARENA</span>
            <span className="text-xs font-mono text-[#800000]">QUIZ_LEAGUE_SYSTEM</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#800000] tracking-tight mt-1 flex items-center gap-2">
            <span>Official Quiz League</span>
            <Sparkles className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
          </h2>
          <p className="text-sm font-medium text-[#2D2D2D]/80">
            Solve trivia, battle timing clocks, earn official points, and climb the LBSITW rankings.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border-2 border-[#800000] shadow-[2px_2px_0px_#800000]">
          {(['all', 'live', 'upcoming', 'closed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1 text-xs font-bold rounded-xl capitalize transition-all ${
                filter === tab
                  ? 'bg-[#800000] text-[#FFD700] shadow-[1px_1px_0px_rgba(0,0,0,0.2)]'
                  : 'text-[#2D2D2D] hover:bg-[#FAF9F6] hover:text-[#800000]'
              }`}
            >
              {tab === 'all' ? 'All Quizzes' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Cards Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const userSub = currentUser
              ? submissions.find(s => s.quizId === quiz.id && s.userId === currentUser.id)
              : null;

            return (
              <div
                key={quiz.id}
                className="y2k-window bg-white flex flex-col justify-between overflow-hidden border-2 border-[#800000] hover:-translate-y-1 transition-transform"
              >
                <div>
                  {/* Header Bar */}
                  <div className="y2k-window-header bg-[#800000] text-white">
                    <span className="text-xs font-mono font-bold text-[#FFD700] truncate max-w-[180px]">
                      {quiz.category}
                    </span>
                    <span
                      className={`y2k-badge ${
                        quiz.status === 'live'
                          ? 'bg-[#FFD700] text-[#800000] animate-pulse'
                          : quiz.status === 'upcoming'
                          ? 'bg-[#FFF5B8] text-[#800000]'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {quiz.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Poster Image */}
                  <div className="relative h-44 overflow-hidden border-b-2 border-[#800000]">
                    <img
                      src={quiz.posterUrl}
                      alt={quiz.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-[#800000]/90 text-[#FFD700] text-[11px] font-bold px-2.5 py-1 rounded-xl border border-[#FFD700]/30 flex items-center gap-1 backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-[#FFD700]" />
                      <span>{quiz.durationMinutes} mins</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-[#FFD700] text-[#800000] text-[11px] font-bold px-2.5 py-1 rounded-xl border-2 border-[#800000] shadow-[1px_1px_0px_#800000]">
                      {quiz.totalPoints} PTS
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-lg text-[#800000] leading-snug line-clamp-2">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-[#2D2D2D]/80 line-clamp-3 leading-relaxed">
                      {quiz.description}
                    </p>

                    <div className="pt-2 text-[11px] font-bold text-[#800000]/70 flex items-center justify-between font-mono">
                      <span>Questions: {quiz.questions.length}</span>
                      <span>By: {quiz.createdBy}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 pt-0">
                  {userSub ? (
                    <div className="space-y-2">
                      <div className="p-2 bg-emerald-50 border border-emerald-600 rounded-xl text-center text-xs font-bold text-emerald-800">
                        ✓ Completed • Score: {userSub.score}/{userSub.totalPoints}
                      </div>
                      <button
                        onClick={() => setViewingLeaderboardQuiz(quiz)}
                        className="w-full py-2 y2k-btn-secondary text-xs flex items-center justify-center gap-1.5"
                      >
                        <Trophy className="w-3.5 h-3.5 text-[#800000]" />
                        <span>View Quiz Leaderboard</span>
                      </button>
                    </div>
                  ) : quiz.status === 'live' ? (
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full py-2.5 y2k-btn-primary text-xs flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider"
                    >
                      <Play className="w-4 h-4 fill-current text-[#FFD700]" />
                      <span>Attempt Quiz Now</span>
                    </button>
                  ) : quiz.status === 'upcoming' ? (
                    <button
                      disabled
                      className="w-full py-2 bg-slate-100 text-slate-500 border-2 border-[#800000] rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-not-allowed opacity-80"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Opens {new Date(quiz.startTime).toLocaleDateString()}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setViewingLeaderboardQuiz(quiz)}
                      className="w-full py-2.5 y2k-btn-yellow text-xs flex items-center justify-center gap-1.5 font-bold"
                    >
                      <Trophy className="w-4 h-4 text-[#800000]" />
                      <span>Closed • View Final Results</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border-2 border-[#800000] rounded-2xl shadow-[4px_4px_0px_#800000] space-y-2">
          <Sparkles className="w-10 h-10 mx-auto text-[#800000]" />
          <h3 className="font-serif font-bold text-lg text-[#800000]">No Quizzes Available Yet</h3>
          <p className="text-xs text-[#2D2D2D]/70">New quiz leagues will be published here soon. Stay tuned!</p>
        </div>
      )}

      {/* Interactive Live Quiz Modal Window */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-[#800000]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="y2k-window bg-white border-2 border-[#800000] w-full max-w-2xl my-8 overflow-hidden relative shadow-[10px_10px_0px_#800000] animate-in fade-in zoom-in-95 duration-200">
            {/* Window Title Header */}
            <div className="y2k-window-header bg-[#800000] text-white">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-[#FFD700]">
                  LIVE QUIZ: {activeQuiz.title}
                </span>
              </div>
              <button
                onClick={closeQuizModal}
                className="p-1 hover:bg-[#FFD700] rounded-full text-white hover:text-[#800000]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isSubmitted ? (
              /* Quiz Taking Screen */
              <div className="p-6 space-y-6">
                {/* Timer & Question Progress Bar */}
                <div className="flex items-center justify-between bg-[#FAF9F6] p-3 rounded-xl border-2 border-[#800000]">
                  <div className="text-xs font-serif font-bold text-[#800000]">
                    Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-[#800000] bg-[#FFF5B8] px-3 py-1 rounded-full border border-[#800000]">
                    <Clock className="w-4 h-4 text-[#800000] animate-spin" />
                    <span>
                      {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Current Question */}
                {activeQuiz.questions[currentQuestionIndex] && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#FAF9F6] border-2 border-[#800000] rounded-2xl shadow-[3px_3px_0px_#800000]">
                      <span className="text-[10px] font-mono font-bold text-[#800000] uppercase tracking-wider block mb-1">
                        {activeQuiz.questions[currentQuestionIndex].points} POINTS QUESTION
                      </span>
                      <h4 className="text-base font-serif font-bold text-[#800000] leading-relaxed">
                        {activeQuiz.questions[currentQuestionIndex].questionText}
                      </h4>
                    </div>

                    {/* Options Grid */}
                    <div className="space-y-2.5">
                      {activeQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(optIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border-2 border-[#800000] font-semibold text-sm transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#FFF5B8] text-[#800000] font-bold shadow-[3px_3px_0px_#800000] -translate-y-0.5'
                                : 'bg-white hover:bg-[#FAF9F6] text-[#2D2D2D] shadow-[1px_2px_0px_#800000]'
                            }`}
                          >
                            <span>{opt}</span>
                            <div
                              className={`w-5 h-5 rounded-full border-2 border-[#800000] flex items-center justify-center text-xs font-bold ${
                                isSelected ? 'bg-[#800000] text-[#FFD700]' : 'bg-white text-[#800000]'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-[#800000]">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="px-4 py-2 y2k-btn-secondary text-xs disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-5 py-2 y2k-btn-primary text-xs flex items-center gap-1"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4 text-[#FFD700]" />
                    </button>
                  ) : (
                    <button
                      onClick={() => finishAndSubmitQuiz(activeQuiz)}
                      className="px-6 py-2.5 y2k-btn-primary text-xs font-bold uppercase tracking-wider"
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Score Summary Screen */
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF5B8] border-2 border-[#800000] shadow-[4px_4px_0px_#800000] flex items-center justify-center text-4xl">
                  🎉
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-[#800000]">
                    Quiz Submitted Successfully!
                  </h3>
                  <p className="text-xs font-medium text-[#2D2D2D]/80">
                    Great effort! Your score has been added to the BODHI Leaderboards.
                  </p>
                </div>

                {latestSubmission && (
                  <div className="p-6 bg-[#FAF9F6] border-2 border-[#800000] rounded-2xl shadow-[4px_4px_0px_#800000] max-w-sm mx-auto space-y-3">
                    <div className="text-xs font-mono font-bold text-[#800000] uppercase tracking-wider">
                      YOUR FINAL SCORE
                    </div>
                    <div className="text-4xl font-mono font-bold text-[#800000]">
                      {latestSubmission.score} / {latestSubmission.totalPoints}
                    </div>
                    <p className="text-xs font-mono font-bold text-[#800000]">
                      Time Taken: {Math.floor(latestSubmission.timeSpentSeconds / 60)}m {latestSubmission.timeSpentSeconds % 60}s
                    </p>
                  </div>
                )}

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={closeQuizModal}
                    className="px-6 py-2.5 y2k-btn-primary text-xs font-bold"
                  >
                    Done & Back to Leagues
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Closed Quiz Leaderboard Modal */}
      {viewingLeaderboardQuiz && (
        <div className="fixed inset-0 z-50 bg-[#800000]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="y2k-window bg-white border-2 border-[#800000] w-full max-w-xl my-8 overflow-hidden relative shadow-[10px_10px_0px_#800000]">
            <div className="y2k-window-header bg-[#800000] text-white">
              <span className="font-mono font-bold text-xs text-[#FFD700]">
                LEADERBOARD: {viewingLeaderboardQuiz.title}
              </span>
              <button
                onClick={() => setViewingLeaderboardQuiz(null)}
                className="p-1 hover:bg-[#FFD700] rounded-full text-white hover:text-[#800000]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <span className="y2k-badge bg-[#800000] text-[#FFD700]">OFFICIAL RANKINGS</span>
                <h3 className="text-xl font-serif font-bold text-[#800000]">
                  {viewingLeaderboardQuiz.title}
                </h3>
              </div>

              {/* Submissions List */}
              {submissions.filter(s => s.quizId === viewingLeaderboardQuiz.id).length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {submissions
                    .filter(s => s.quizId === viewingLeaderboardQuiz.id)
                    .sort((a, b) => b.score - a.score || a.timeSpentSeconds - b.timeSpentSeconds)
                    .map((sub, index) => (
                      <div
                        key={sub.id}
                        className={`p-3 rounded-xl border-2 border-[#800000] flex items-center justify-between text-xs font-bold ${
                          index === 0
                            ? 'bg-[#FFF5B8]'
                            : index === 1
                            ? 'bg-[#FAF9F6]'
                            : index === 2
                            ? 'bg-[#FAF9F6]'
                            : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#800000] text-[#FFD700] flex items-center justify-center font-mono font-bold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-serif font-bold text-[#800000]">{sub.userName}</p>
                            <p className="text-[10px] font-mono text-[#2D2D2D]/70">{sub.userEmail}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-sm text-[#800000]">
                            {sub.score} / {sub.totalPoints} PTS
                          </span>
                          <p className="text-[10px] font-mono text-[#2D2D2D]/70">
                            {Math.floor(sub.timeSpentSeconds / 60)}m {sub.timeSpentSeconds % 60}s
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#FAF9F6] border-2 border-dashed border-[#800000] rounded-2xl text-xs font-bold text-[#2D2D2D]/70">
                  No quiz submissions recorded yet for this closed league.
                </div>
              )}

              <div className="pt-2 text-right">
                <button
                  onClick={() => setViewingLeaderboardQuiz(null)}
                  className="px-5 py-2 y2k-btn-secondary text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
