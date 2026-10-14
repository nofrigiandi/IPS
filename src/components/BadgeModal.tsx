import React from 'react';
import { X, Award, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { BADGES_DATA } from '../data/badgesData';
import { sound } from '../utils/audio';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadgeIds: string[];
}

export const BadgeModal: React.FC<BadgeModalProps> = ({
  isOpen,
  onClose,
  unlockedBadgeIds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-850 border border-slate-700 w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-750 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-lg font-bold text-white">
              Galeri Lencana Prestasi
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-750 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle & Progress */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-750">
          <span>Kumpulkan seluruh lencana dengan mencoba berbagai mode mini-game!</span>
          <span className="font-bold text-amber-400 font-mono">
            {unlockedBadgeIds.length} / {BADGES_DATA.length} Terbuka
          </span>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-slate-900/80 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900/30 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-400'
                      : 'bg-slate-800 border border-slate-700 text-slate-500'
                  }`}
                >
                  {isUnlocked ? (
                    <Award className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-xs font-bold ${
                        isUnlocked ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {badge.title}
                    </span>
                    {isUnlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
