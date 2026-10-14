import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  HeartHandshake, 
  ShieldCheck, 
  UserCheck, 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  Award,
  AlertCircle,
  MessageSquare,
  Users
} from 'lucide-react';
import { DILEMMA_SCENARIOS } from '../data/dilemmaData';
import { DilemmaChoice, DilemmaScenario } from '../types/game';
import { sound } from '../utils/audio';

interface ToleranceDetectiveProps {
  onAddXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onUpdateToleranceScore: (points: number) => void;
}

export const ToleranceDetective: React.FC<ToleranceDetectiveProps> = ({
  onAddXp,
  onUnlockBadge,
  onUpdateToleranceScore,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<DilemmaChoice | null>(null);
  const [totalToleranceGained, setTotalToleranceGained] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState<{ scenario: DilemmaScenario; choice: DilemmaChoice }[]>([]);

  const currentScenario = DILEMMA_SCENARIOS[currentIndex];

  const handleSelectChoice = (choice: DilemmaChoice) => {
    if (selectedChoice) return;
    setSelectedChoice(choice);

    if (choice.isBest) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    const { tolerance, xp } = choice.scoreChange;
    setTotalToleranceGained((prev) => prev + Math.max(0, tolerance));
    onUpdateToleranceScore(tolerance);

    if (xp > 0) {
      onAddXp(xp, `Studi Kasus Toleransi: ${currentScenario.title}`);
    }

    setHistory((prev) => [...prev, { scenario: currentScenario, choice }]);
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < DILEMMA_SCENARIOS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
    } else {
      setCompleted(true);
      sound.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // If all chosen choices were the best, unlock badge
      const allBest = history.every((h) => h.choice.isBest);
      if (allBest) {
        onUnlockBadge('badge-tolerance-champion');
      }
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedChoice(null);
    setTotalToleranceGained(0);
    setCompleted(false);
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Mini-Game 4
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Simulasi Sikap & Moral IPS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Detektif Toleransi & Harmoni
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Hadapi berbagai situasi nyata di lingkungan sekolah dan masyarakat. Tentukan keputusan terbaik yang mencerminkan profil Pelajar Pancasila!
          </p>
        </div>

        {/* Tolerance Gauge */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3.5 py-2 rounded-xl">
          <HeartHandshake className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Skor Empati & Harmoni</div>
            <div className="text-sm font-bold text-emerald-400 font-mono">
              +{totalToleranceGained} Poin
            </div>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-6">
          {/* Scenario Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-7 shadow-xl">
            {/* Context Badge */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4 text-xs">
              <span className="font-bold text-amber-400 uppercase tracking-wider">
                Kasus #{currentIndex + 1}: {currentScenario.title}
              </span>
              <span className="text-slate-400 font-medium">
                Karakter: {currentScenario.character}
              </span>
            </div>

            {/* Context Story */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-750 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Situasi Kelas:</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {currentScenario.context}
              </p>
            </div>

            {/* Dilemma Question */}
            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Tantangan Moralmu:</span>
              </div>
              <p className="text-sm text-amber-100 font-semibold leading-relaxed">
                {currentScenario.situation}
              </p>
            </div>

            {/* Choices */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase">
                Apa tindakan yang akan kamu ambil?
              </div>

              {currentScenario.choices.map((choice, idx) => {
                const isSelected = selectedChoice === choice;

                let btnStyle = 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-emerald-500/50';

                if (selectedChoice) {
                  if (choice.isBest) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-950/30';
                  } else if (isSelected && !choice.isBest) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-100';
                  } else {
                    btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedChoice !== null}
                    onClick={() => handleSelectChoice(choice)}
                    className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start gap-3.5 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug font-medium flex-1">
                      {choice.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback when selected */}
            {selectedChoice && (
              <div className="mt-6 pt-5 border-t border-slate-700 animate-fadeIn">
                <div
                  className={`p-4 rounded-xl border mb-4 ${
                    selectedChoice.isBest
                      ? 'bg-emerald-950/40 border-emerald-500/40'
                      : 'bg-amber-950/40 border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        selectedChoice.isBest ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Refleksi Sikap: {selectedChoice.nilaiKarakter}
                    </span>
                    {selectedChoice.scoreChange.xp > 0 && (
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        +{selectedChoice.scoreChange.xp} XP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedChoice.feedback}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-all flex items-center gap-2"
                  >
                    <span>{currentIndex + 1 < DILEMMA_SCENARIOS.length ? 'Kasus Selanjutnya' : 'Lihat Hasil Akhir'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Completion Summary */
        <div className="bg-gradient-to-br from-slate-800 via-slate-850 to-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 mb-4">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Misi Detektif Toleransi Berhasil!
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
            Kamu telah menyelesaikan seluruh studi kasus moral kebinekaan dengan penuh kedewasaan. Sikap saling menghargai adalah pondasi persatuan Indonesia!
          </p>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 max-w-sm mx-auto mb-6">
            <div className="text-xs text-slate-400 uppercase font-semibold">
              Karakter Utama yang Terlatih:
            </div>
            <div className="text-emerald-400 font-bold text-base mt-1">
              ✨ Toleransi, Empati Sosial, & Inklusivitas
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Ulangi Studi Kasus
          </button>
        </div>
      )}
    </div>
  );
};
