import React from 'react';
import { 
  Compass, 
  Layers, 
  Search, 
  Zap, 
  HeartHandshake, 
  BookOpen, 
  Award, 
  Volume2, 
  VolumeX, 
  User,
  GraduationCap
} from 'lucide-react';
import { PlayerStats } from '../types/game';
import { sound } from '../utils/audio';

export type ActiveTab = 'map' | 'matching' | 'mystery' | 'quiz' | 'tolerance' | 'atlas';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  playerStats: PlayerStats;
  onOpenProfile: () => void;
  onOpenBadges: () => void;
  onOpenCertificate: () => void;
  onOpenTeacherPortal: () => void;
  onExitStudentSession: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  playerStats,
  onOpenProfile,
  onOpenBadges,
  onOpenCertificate,
  onOpenTeacherPortal,
  onExitStudentSession,
  soundEnabled,
  onToggleSound,
}) => {
  const tabs = [
    { id: 'map' as ActiveTab, label: 'Peta Jelajah', icon: Compass },
    { id: 'matching' as ActiveTab, label: 'Pasangan Budaya', icon: Layers },
    { id: 'mystery' as ActiveTab, label: 'Tebak Ciri', icon: Search },
    { id: 'quiz' as ActiveTab, label: 'Cerdas Cermat', icon: Zap },
    { id: 'tolerance' as ActiveTab, label: 'Studi Kasus', icon: HeartHandshake },
    { id: 'atlas' as ActiveTab, label: 'Atlas Budaya', icon: BookOpen },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    sound.playClick();
    setActiveTab(tabId);
  };

  // Calculate level progress (each level is 150 XP)
  const currentLevelXp = playerStats.xp % 150;
  const levelProgress = Math.min(100, Math.round((currentLevelXp / 150) * 100));

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner with App Brand & Student Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-extrabold text-lg">
            🇮🇩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight text-white">
                JELAJAH BHINNEKA
              </span>
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                IPS KELAS 7
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Misi Harmoni Keberagaman Nusantara dalam Bingkai Bhinneka Tunggal Ika
            </p>
          </div>
        </div>

        {/* Player Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* XP & Level Indicator */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60 cursor-pointer transition-all hover:border-amber-500/50"
            title="Klik untuk mengubah profil & data siswa"
          >
            <div className="text-2xl" role="img" aria-label="avatar">
              {playerStats.avatar}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                  {playerStats.name}
                </span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                  Lv.{playerStats.level}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-amber-400">
                  {playerStats.xp} XP
                </span>
              </div>
            </div>
          </div>

          {/* Badges Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenBadges();
            }}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-2 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all hover:border-slate-600"
            title="Lencana Pencapaian"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Lencana</span>
            <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded text-[11px] font-bold">
              {playerStats.unlockedBadgeIds.length}
            </span>
          </button>

          {/* Certificate Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCertificate();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-md shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Lihat Sertifikat Duta Pelajar"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden md:inline">Piagam Duta</span>
          </button>

          {/* Teacher Portal Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTeacherPortal();
            }}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 border border-amber-500/30 hover:border-amber-400 px-2.5 py-2 rounded-xl text-xs font-bold text-amber-300 hover:text-white transition-all shadow-sm"
            title="Buka Portal Guru IPS (admin / admin212)"
          >
            <span className="text-sm">🔑</span>
            <span className="hidden lg:inline">Portal Guru</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title={soundEnabled ? 'Matikan Suara Efek' : 'Nyalakan Suara Efek'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Exit / Switch Student Session */}
          <button
            onClick={() => {
              sound.playClick();
              onExitStudentSession();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors text-xs"
            title="Ganti Siswa / Keluar Sesi Token"
          >
            ⏻
          </button>
        </div>
      </div>

      {/* Navigation Game Mode Tabs */}
      <nav className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none border-t border-slate-800/60">
        <div className="flex items-center gap-1 py-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
