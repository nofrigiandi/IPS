import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Search, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  Star,
  Award,
  Lightbulb,
  Compass
} from 'lucide-react';
import { MYSTERY_ITEMS, MysteryItem } from '../data/mysteryData';
import { sound } from '../utils/audio';

interface MysteryClueGameProps {
  onAddXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const MysteryClueGame: React.FC<MysteryClueGameProps> = ({ onAddXp, onUnlockBadge }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unlockedClueCount, setUnlockedClueCount] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentItem: MysteryItem = MYSTERY_ITEMS[currentIndex];

  const handleUnlockNextClue = () => {
    if (unlockedClueCount < 3) {
      sound.playClick();
      setUnlockedClueCount((prev) => prev + 1);
    }
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === currentItem.correctAnswer;

    if (isCorrect) {
      sound.playCorrect();
      // Stars based on clues used:
      // 1 clue = 3 stars, 2 clues = 2 stars, 3 clues = 1 star
      const starsEarned = unlockedClueCount === 1 ? 3 : unlockedClueCount === 2 ? 2 : 1;
      const xpEarned = unlockedClueCount === 1 ? 150 : unlockedClueCount === 2 ? 100 : 60;

      setTotalStars((prev) => prev + starsEarned);
      setScore((prev) => prev + xpEarned);

      if (unlockedClueCount === 1) {
        onUnlockBadge('badge-clue-detective');
      }

      onAddXp(xpEarned, `Menebak misteri ${currentItem.targetName} dengan ${unlockedClueCount} petunjuk`);
    } else {
      sound.playWrong();
    }
  };

  const handleNextRound = () => {
    sound.playClick();
    if (currentIndex + 1 < MYSTERY_ITEMS.length) {
      setCurrentIndex((prev) => prev + 1);
      setUnlockedClueCount(1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
      sound.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setUnlockedClueCount(1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTotalStars(0);
    setCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Mini-Game 2
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Detektif Ciri & Fakta Budaya</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Tebak Ciri Misteri Nusantara
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Analisis petunjuk bertahap! Semakin sedikit petunjuk yang kamu gunakan, semakin banyak bintang dan XP yang kamu peroleh.
          </p>
        </div>

        {/* Live Score & Progress */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-amber-300 font-mono">
              {totalStars} Bintang
            </span>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300">
            Kasus {currentIndex + 1} / {MYSTERY_ITEMS.length}
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-6">
          {/* Mystery Card */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Kategori Misteri:</span>
                  <span className="ml-1.5 text-xs font-bold text-amber-300">
                    {currentItem.category}
                  </span>
                </div>
              </div>

              {/* Star Potential based on current clue */}
              <div className="flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
                <span className="text-[11px] text-slate-400 mr-1">Potensi Hadiah:</span>
                {[1, 2, 3].map((starNum) => {
                  const maxStarsForStep = unlockedClueCount === 1 ? 3 : unlockedClueCount === 2 ? 2 : 1;
                  return (
                    <Star
                      key={starNum}
                      className={`w-3.5 h-3.5 ${
                        starNum <= maxStarsForStep
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Clues Stack */}
            <div className="space-y-3 mb-6">
              {/* Clue 1 */}
              <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                  1
                </span>
                <div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase mb-0.5">
                    Petunjuk 1 (Filosofis & Ciri Khusus)
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {currentItem.clues[0]}
                  </p>
                </div>
              </div>

              {/* Clue 2 */}
              {unlockedClueCount >= 2 ? (
                <div className="bg-slate-900/60 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">
                    2
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-blue-400 uppercase mb-0.5">
                      Petunjuk 2 (Asal Daerah & Geografis)
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {currentItem.clues[1]}
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleUnlockNextClue}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/60 text-slate-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Buka Petunjuk 2 (Mengurangi 1 Bintang Hadiah)</span>
                </button>
              )}

              {/* Clue 3 */}
              {unlockedClueCount >= 3 ? (
                <div className="bg-slate-900/60 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                    3
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-emerald-400 uppercase mb-0.5">
                      Petunjuk 3 (Bentuk Visual & Fungsi)
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {currentItem.clues[2]}
                    </p>
                  </div>
                </div>
              ) : unlockedClueCount === 2 ? (
                <button
                  onClick={handleUnlockNextClue}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/60 text-slate-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Buka Petunjuk 3 (Bentuk Visual Paling Terang)</span>
                </button>
              ) : null}
            </div>

            {/* Answer Options */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-slate-400 uppercase mb-3">
                Pilih Jawaban yang Tepat:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentItem.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentItem.correctAnswer;

                  let btnStyle = 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-500/40';

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    } else {
                      btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={option}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(option)}
                      className={`p-3.5 rounded-xl border font-bold text-sm text-left transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post-Answer Feedback & Fun Fact */}
            {isAnswered && (
              <div className="mt-5 p-4 rounded-xl bg-slate-900/80 border border-slate-700 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {selectedAnswer === currentItem.correctAnswer ? (
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Jawaban Tepat!
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Kurang Tepat!
                      </span>
                    )}
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-300 font-semibold">
                      Asal: {currentItem.origin}
                    </span>
                  </div>

                  {selectedAnswer === currentItem.correctAnswer && (
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      +{unlockedClueCount === 1 ? 150 : unlockedClueCount === 2 ? 100 : 60} XP
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  <span className="font-semibold text-amber-300">Fakta IPS: </span>
                  {currentItem.funFact}
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextRound}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Lanjut ke Kasus Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Final Mystery Scorecard */
        <div className="bg-gradient-to-br from-slate-800 via-slate-850 to-amber-950/40 border border-amber-500/40 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Kasus Detektif Selesai!
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
            Kamu telah menyelesaikan seluruh investigasi artefak budaya Nusantara. Ketajaman analisismu dalam mengenali ciri khas bangsa sangat mengagumkan!
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
              <div className="text-xs text-slate-400">Total Bintang</div>
              <div className="text-2xl font-bold text-amber-400 font-mono flex items-center justify-center gap-1 mt-1">
                <Star className="w-5 h-5 fill-amber-400" />
                <span>{totalStars} / {MYSTERY_ITEMS.length * 3}</span>
              </div>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
              <div className="text-xs text-slate-400">Total XP Didapat</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                +{score}
              </div>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Ulangi Kasus Detektif
          </button>
        </div>
      )}
    </div>
  );
};
