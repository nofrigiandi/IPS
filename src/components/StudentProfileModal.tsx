import React, { useState } from 'react';
import { X, User, School, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { PlayerStats } from '../types/game';
import { sound } from '../utils/audio';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
  onUpdateProfile: (name: string, schoolName: string, avatar: string) => void;
  onResetProgress: () => void;
}

const AVATARS = [
  { id: '1', emoji: '🇮🇩', label: 'Pelajar Bhinneka' },
  { id: '2', emoji: '🎓', label: 'Cendekia Muda' },
  { id: '3', emoji: '🌺', label: 'Duta Budaya' },
  { id: '4', emoji: '🦅', label: 'Penjaga Borneo' },
  { id: '5', emoji: '⛵', label: 'Pelaut Bahari' },
  { id: '6', emoji: '🪷', label: 'Pesona Dewata' },
  { id: '7', emoji: '🏝️', label: 'Mutiara Timur' },
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  playerStats,
  onUpdateProfile,
  onResetProgress,
}) => {
  const [name, setName] = useState(playerStats.name);
  const [schoolName, setSchoolName] = useState(playerStats.schoolName);
  const [selectedAvatar, setSelectedAvatar] = useState(playerStats.avatar);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onUpdateProfile(name.trim() || 'Siswa SMP', schoolName.trim() || 'SMP Nusantara', selectedAvatar);
    onClose();
  };

  const handleReset = () => {
    sound.playClick();
    onResetProgress();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-850 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-750 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-lg font-bold text-white">
              Profil Siswa Penjelajah
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

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              Pilih Avatar Karakter:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedAvatar(av.emoji);
                  }}
                  className={`p-2.5 rounded-xl border text-2xl flex flex-col items-center justify-center transition-all ${
                    selectedAvatar === av.emoji
                      ? 'bg-amber-500/20 border-amber-400 scale-105 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                  }`}
                  title={av.label}
                >
                  <span>{av.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Nama Lengkap Siswa:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Raditya Pratama"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* School Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Asal Sekolah & Kelas:
            </label>
            <input
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Contoh: SMP Negeri 1 Jakarta / Kelas 7-C"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="text-xs text-rose-400 hover:text-rose-300 underline font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Progres</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>

        {/* Confirm Reset Alert */}
        {showConfirmReset && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Konfirmasi Reset Permainan</span>
            </div>
            <p>
              Semua skor, XP, dan lencana yang telah kamu raih akan dikembalikan ke awal. Yakin ingin mereset?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
