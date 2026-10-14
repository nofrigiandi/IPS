import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  Timer, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ChevronRight, 
  Award, 
  Sparkles, 
  Flame, 
  Clock, 
  Filter,
  Check,
  X
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion } from '../types/game';
import { sound } from '../utils/audio';

interface CerdasCermatQuizProps {
  onAddXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onUpdateQuizScore: (score: number) => void;
}

export const CerdasCermatQuiz: React.FC<CerdasCermatQuizProps> = ({
  onAddXp,
  onUnlockBadge,
  onUpdateQuizScore,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [timerActive, setTimerActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Lifelines
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [usedExtraTime, setUsedExtraTime] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);

  // User responses history for review
  const [history, setHistory] = useState<
    { question: QuizQuestion; userAnswer: number | null; isCorrect: boolean }[]
  >([]);

  // Start new quiz round (10 questions)
  const startQuiz = () => {
    sound.playClick();
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(25);
    setTimerActive(true);
    setCompleted(false);
    setUsedFiftyFifty(false);
    setUsedHint(false);
    setUsedExtraTime(false);
    setEliminatedOptions([]);
    setShowHint(false);
    setHistory([]);
  };

  useEffect(() => {
    startQuiz();
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (timerActive && !isAnswered && !completed && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered && !completed) {
      // Time ran out!
      handleTimeOut();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, isAnswered, completed, timeLeft]);

  const currentQ = questions[currentIndex];

  const handleTimeOut = () => {
    sound.playWrong();
    setIsAnswered(true);
    setSelectedAnswer(-1); // -1 indicates timeout
    setStreak(0);
    if (currentQ) {
      setHistory((prev) => [
        ...prev,
        { question: currentQ, userAnswer: null, isCorrect: false },
      ]);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;

    setSelectedAnswer(idx);
    setIsAnswered(true);
    setTimerActive(false);

    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      sound.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      // Streak multiplier bonus
      const multiplier = newStreak >= 3 ? 1.5 : 1;
      const pointsEarned = Math.round(10 * multiplier);
      setScore((prev) => prev + pointsEarned);

      setHistory((prev) => [
        ...prev,
        { question: currentQ, userAnswer: idx, isCorrect: true },
      ]);
    } else {
      sound.playWrong();
      setStreak(0);
      setHistory((prev) => [
        ...prev,
        { question: currentQ, userAnswer: idx, isCorrect: false },
      ]);
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(25);
      setTimerActive(true);
      setEliminatedOptions([]);
      setShowHint(false);
    } else {
      // Finished all 10 questions!
      setCompleted(true);
      setTimerActive(false);
      sound.playLevelUp();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });

      const finalScorePercent = Math.min(100, Math.round((score / (questions.length * 10)) * 100));
      onUpdateQuizScore(finalScorePercent);

      const totalXpGained = score * 3;
      onAddXp(totalXpGained, `Kuis Cerdas Cermat IPS (Skor: ${finalScorePercent}%)`);

      if (finalScorePercent >= 80) {
        onUnlockBadge('badge-quiz-ace');
      }
      if (finalScorePercent === 100) {
        onUnlockBadge('badge-quiz-perfect');
      }
    }
  };

  // Lifelines
  const handleFiftyFifty = () => {
    if (usedFiftyFifty || isAnswered || !currentQ) return;
    sound.playClick();
    setUsedFiftyFifty(true);

    const wrongIndices = currentQ.options
      .map((_, i) => i)
      .filter((i) => i !== currentQ.correctIndex);

    // Pick 2 random wrong options to eliminate
    const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random());
    setEliminatedOptions(shuffledWrong.slice(0, 2));
  };

  const handleUseHint = () => {
    if (usedHint || isAnswered || !currentQ) return;
    sound.playClick();
    setUsedHint(true);
    setShowHint(true);
  };

  const handleAddExtraTime = () => {
    if (usedExtraTime || isAnswered) return;
    sound.playClick();
    setUsedExtraTime(true);
    setTimeLeft((prev) => prev + 15);
  };

  if (!currentQ && !completed) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin text-amber-400 text-3xl mb-3">⟳</div>
        <p className="text-slate-400 text-sm">Menyiapkan butir soal IPS Kelas 7...</p>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const timerRatio = timeLeft / 25;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Quiz Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Mini-Game 3
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Tantangan Cerdas Cermat IPS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Cerdas Cermat Keberagaman
          </h1>
        </div>

        {/* Score & Streak Chips */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Skor:</span>
            <span className="text-xs font-bold font-mono text-emerald-400">{score}</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Flame className={`w-4 h-4 ${streak >= 2 ? 'text-amber-400' : 'text-slate-500'}`} />
            <span className="text-xs text-slate-400">Streak:</span>
            <span className="text-xs font-bold font-mono text-amber-400">x{streak}</span>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-5">
          {/* Progress & Timer Bar */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs font-semibold mb-2 text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span>Soal {currentIndex + 1} dari {questions.length}</span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-400">{currentQ.topicLabel}</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Timer className="w-3.5 h-3.5 text-slate-400" />
                <span className={timeLeft <= 5 ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-300'}>
                  {timeLeft}s
                </span>
              </span>
            </div>

            {/* Time progress bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  timeLeft > 12
                    ? 'bg-emerald-400'
                    : timeLeft > 5
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, timerRatio * 100))}%` }}
              />
            </div>
          </div>

          {/* Lifelines Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-850/60 border border-slate-750 px-4 py-2.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Bantuan (Lifelines):</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFiftyFifty}
                disabled={usedFiftyFifty || isAnswered}
                className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition-all flex items-center gap-1.5 ${
                  usedFiftyFifty
                    ? 'opacity-40 border-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-700 border-amber-500/40 text-amber-300'
                }`}
                title="Eliminasi 2 pilihan jawaban yang salah"
              >
                <span>50:50</span>
              </button>

              <button
                onClick={handleUseHint}
                disabled={usedHint || isAnswered}
                className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition-all flex items-center gap-1.5 ${
                  usedHint
                    ? 'opacity-40 border-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-700 border-blue-500/40 text-blue-300'
                }`}
                title="Buka petunjuk guru"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Petunjuk</span>
              </button>

              <button
                onClick={handleAddExtraTime}
                disabled={usedExtraTime || isAnswered}
                className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition-all flex items-center gap-1.5 ${
                  usedExtraTime
                    ? 'opacity-40 border-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-700 border-emerald-500/40 text-emerald-300'
                }`}
                title="Tambah waktu 15 detik"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>+15s</span>
              </button>
            </div>
          </div>

          {/* Hint Card if used */}
          {showHint && (
            <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-3 flex items-start gap-2.5 animate-fadeIn">
              <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-200">
                <span className="font-bold text-blue-300">Petunjuk Guru IPS: </span>
                {currentQ.hint}
              </p>
            </div>
          )}

          {/* Question Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xl">
            <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-snug mb-6">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isEliminated = eliminatedOptions.includes(idx);
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let cardStyle =
                  'bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:border-amber-500/40';

                if (isEliminated) {
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/30 text-slate-600 line-through text-xs font-medium cursor-not-allowed"
                    >
                      {option}
                    </div>
                  );
                }

                if (isAnswered) {
                  if (isCorrect) {
                    cardStyle =
                      'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/30';
                  } else if (isSelected && !isCorrect) {
                    cardStyle =
                      'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else {
                    cardStyle = 'bg-slate-900/40 border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left font-medium text-sm transition-all flex items-center justify-between gap-3 ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation */}
            {isAnswered && (
              <div className="mt-6 pt-5 border-t border-slate-700/80 animate-fadeIn">
                <div className="flex items-start gap-3 bg-slate-900/70 p-4 rounded-xl border border-slate-700 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-400 mb-1">
                      Pembahasan Materi IPS Kelas 7:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
                  >
                    <span>{currentIndex + 1 < questions.length ? 'Soal Selanjutnya' : 'Lihat Hasil Kuis'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completed Results & Review */
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 via-slate-850 to-indigo-950/40 border border-indigo-500/40 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 mx-auto flex items-center justify-center text-indigo-400 mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Kuis Cerdas Cermat Selesai!
            </h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
              Hasil evaluasi pemahamanmu tentang materi keberagaman masyarakat Indonesia:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-6">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                <div className="text-[11px] text-slate-400 uppercase">Nilai Akhir</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  {Math.min(100, Math.round((score / (questions.length * 10)) * 100))} / 100
                </div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                <div className="text-[11px] text-slate-400 uppercase">Benar</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {history.filter((h) => h.isCorrect).length} / {questions.length}
                </div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                <div className="text-[11px] text-slate-400 uppercase">Max Streak</div>
                <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
                  x{maxStreak}
                </div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                <div className="text-[11px] text-slate-400 uppercase">XP Diperoleh</div>
                <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
                  +{score * 3}
                </div>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" /> Kuis Baru (10 Soal Acak)
            </button>
          </div>

          {/* Detailed Question Review List */}
          <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-5 sm:p-6">
            <h3 className="font-bold text-base text-slate-200 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Review Kunci Jawaban & Pembahasan</span>
            </h3>

            <div className="space-y-4">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    item.isCorrect
                      ? 'bg-slate-900/50 border-emerald-500/30'
                      : 'bg-slate-900/50 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-semibold text-slate-300">
                      #{idx + 1}. {item.question.question}
                    </span>
                    {item.isCorrect ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                        Benar
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 shrink-0">
                        Salah
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div>
                      <span className="text-slate-500">Kunci Benar: </span>
                      <span className="text-emerald-300 font-medium">
                        {item.question.options[item.question.correctIndex]}
                      </span>
                    </div>
                    {!item.isCorrect && item.userAnswer !== null && (
                      <div>
                        <span className="text-slate-500">Jawabanmu: </span>
                        <span className="text-rose-300 font-medium">
                          {item.question.options[item.userAnswer]}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 text-slate-300 text-[11px] leading-relaxed">
                      💡 {item.question.explanation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
