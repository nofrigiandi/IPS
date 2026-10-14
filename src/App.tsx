/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles 
} from 'lucide-react';
import { Navbar, ActiveTab } from './components/Navbar';
import { AdventureMap } from './components/AdventureMap';
import { MatchingGame } from './components/MatchingGame';
import { MysteryClueGame } from './components/MysteryClueGame';
import { CerdasCermatQuiz } from './components/CerdasCermatQuiz';
import { ToleranceDetective } from './components/ToleranceDetective';
import { CulturalAtlas } from './components/CulturalAtlas';
import { StudentProfileModal } from './components/StudentProfileModal';
import { CertificateModal } from './components/CertificateModal';
import { BadgeModal } from './components/BadgeModal';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { StudentGate } from './components/StudentGate';
import { PlayerStats, RegionId, StudentSession } from './types/game';
import { tokenManager } from './utils/tokenManager';
import { sound } from './utils/audio';

const STORAGE_KEY = 'jelajah_bhinneka_stats_v1';

const INITIAL_STATS: PlayerStats = {
  name: 'Rizky Pratama',
  schoolName: 'SMP Negeri 1',
  studentClass: 'Kelas 7-A',
  activeTokenCode: 'IPS7-NUSANTARA',
  avatar: '🇮🇩',
  xp: 120,
  level: 1,
  toleranceScore: 30,
  completedRegions: [],
  completedDilemmas: [],
  highestQuizScore: 0,
  quizzesPlayed: 0,
  perfectQuizzes: 0,
  matchingBestTime: 0,
  unlockedBadgeIds: ['badge-start'],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Student active session state
  const [studentSession, setStudentSession] = useState<StudentSession | null>(() =>
    tokenManager.getCurrentSession()
  );

  // Player Stats
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const currentSession = tokenManager.getCurrentSession();
        if (currentSession) {
          return {
            ...parsed,
            name: currentSession.studentName,
            schoolName: currentSession.schoolName,
            studentClass: currentSession.studentClass,
            activeTokenCode: currentSession.tokenCode,
          };
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_STATS;
  });

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isTeacherPortalOpen, setIsTeacherPortalOpen] = useState(false);

  // XP Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync player stats to localStorage and report to teacher monitor
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playerStats));
      // Log to teacher monitor
      if (playerStats.activeTokenCode) {
        tokenManager.recordStudentActivity({
          name: playerStats.name,
          studentClass: playerStats.studentClass || 'Kelas 7',
          schoolName: playerStats.schoolName,
          tokenUsed: playerStats.activeTokenCode,
          xp: playerStats.xp,
          level: playerStats.level,
          highestQuizScore: playerStats.highestQuizScore,
          unlockedBadgesCount: playerStats.unlockedBadgeIds.length,
        });
      }
    } catch {
      // ignore
    }
  }, [playerStats]);

  // Handle student entering with token from StudentGate
  const handleStudentEnter = (session: StudentSession) => {
    setStudentSession(session);
    setPlayerStats((prev) => ({
      ...prev,
      name: session.studentName,
      schoolName: session.schoolName,
      studentClass: session.studentClass,
      activeTokenCode: session.tokenCode,
    }));
  };

  // Handle student exit session
  const handleExitStudentSession = () => {
    if (confirm('Yakin ingin keluar dari sesi siswa ini?')) {
      tokenManager.clearSession();
      setStudentSession(null);
    }
  };

  // Audio Toggle
  const handleToggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
  };

  // Add XP and level update
  const handleAddXp = (amount: number, reason: string) => {
    setPlayerStats((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.max(1, Math.floor(newXp / 150) + 1);

      // Check level up
      if (newLevel > prev.level) {
        sound.playLevelUp();
      }

      // Check badge for 600+ XP
      const unlockedBadges = [...prev.unlockedBadgeIds];
      if (newXp >= 600 && !unlockedBadges.includes('badge-pancasila-hero')) {
        unlockedBadges.push('badge-pancasila-hero');
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        unlockedBadgeIds: unlockedBadges,
      };
    });

    setToastMessage(`+${amount} XP: ${reason}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Unlock Badge helper
  const handleUnlockBadge = (badgeId: string) => {
    setPlayerStats((prev) => {
      if (prev.unlockedBadgeIds.includes(badgeId)) return prev;
      sound.playLevelUp();
      return {
        ...prev,
        unlockedBadgeIds: [...prev.unlockedBadgeIds, badgeId],
      };
    });
  };

  // Completed Region helper
  const handleCompleteRegion = (regionId: RegionId) => {
    setPlayerStats((prev) => {
      if (prev.completedRegions.includes(regionId)) return prev;
      const updatedRegions = [...prev.completedRegions, regionId];

      const updatedBadges = [...prev.unlockedBadgeIds];
      if (updatedRegions.length >= 6 && !updatedBadges.includes('badge-atlas-explorer')) {
        updatedBadges.push('badge-atlas-explorer');
      }

      return {
        ...prev,
        completedRegions: updatedRegions,
        unlockedBadgeIds: updatedBadges,
      };
    });
  };

  // Update tolerance score
  const handleUpdateTolerance = (points: number) => {
    setPlayerStats((prev) => ({
      ...prev,
      toleranceScore: Math.max(0, prev.toleranceScore + points),
    }));
  };

  // Update quiz score
  const handleUpdateQuizScore = (score: number) => {
    setPlayerStats((prev) => ({
      ...prev,
      highestQuizScore: Math.max(prev.highestQuizScore, score),
      quizzesPlayed: prev.quizzesPlayed + 1,
      perfectQuizzes: score === 100 ? prev.perfectQuizzes + 1 : prev.perfectQuizzes,
    }));
  };

  // Update student profile
  const handleUpdateProfile = (name: string, schoolName: string, avatar: string) => {
    setPlayerStats((prev) => ({
      ...prev,
      name,
      schoolName,
      avatar,
    }));
  };

  // Reset progress
  const handleResetProgress = () => {
    setPlayerStats(INITIAL_STATS);
    tokenManager.clearSession();
    setStudentSession(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // If student is not logged in with token, display StudentGate
  if (!studentSession) {
    return (
      <>
        <StudentGate
          onStudentEnter={handleStudentEnter}
          onOpenTeacherPortal={() => setIsTeacherPortalOpen(true)}
        />
        <TeacherDashboardModal
          isOpen={isTeacherPortalOpen}
          onClose={() => setIsTeacherPortalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        playerStats={playerStats}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenBadges={() => setIsBadgeOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenTeacherPortal={() => setIsTeacherPortalOpen(true)}
        onExitStudentSession={handleExitStudentSession}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Active Token Notification Banner */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-1.5 px-4 text-center text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">Token Akses Aktif:</span>
            <span className="font-mono font-bold text-amber-300 bg-slate-800 px-2 py-0.2 rounded border border-slate-700">
              {playerStats.activeTokenCode}
            </span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline font-semibold text-slate-300">
              {playerStats.studentClass} ({playerStats.schoolName})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-medium hidden md:inline">
              ✓ Progres belajar tersimpan otomatis ke akun guru
            </span>
            <button
              onClick={handleExitStudentSession}
              className="text-slate-400 hover:text-amber-400 underline font-semibold"
            >
              Ganti Siswa
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'map' && (
          <AdventureMap
            completedRegions={playerStats.completedRegions}
            onCompleteRegion={handleCompleteRegion}
            onAddXp={handleAddXp}
            onNavigateToMiniGame={(game) => setActiveTab(game)}
          />
        )}

        {activeTab === 'matching' && (
          <MatchingGame
            onAddXp={handleAddXp}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeTab === 'mystery' && (
          <MysteryClueGame
            onAddXp={handleAddXp}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeTab === 'quiz' && (
          <CerdasCermatQuiz
            onAddXp={handleAddXp}
            onUnlockBadge={handleUnlockBadge}
            onUpdateQuizScore={handleUpdateQuizScore}
          />
        )}

        {activeTab === 'tolerance' && (
          <ToleranceDetective
            onAddXp={handleAddXp}
            onUnlockBadge={handleUnlockBadge}
            onUpdateToleranceScore={handleUpdateTolerance}
          />
        )}

        {activeTab === 'atlas' && (
          <CulturalAtlas
            onUnlockBadge={handleUnlockBadge}
            onAddXp={handleAddXp}
          />
        )}
      </main>

      {/* XP Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-600 to-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn border border-white/20">
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        playerStats={playerStats}
        onUpdateProfile={handleUpdateProfile}
        onResetProgress={handleResetProgress}
      />

      <BadgeModal
        isOpen={isBadgeOpen}
        onClose={() => setIsBadgeOpen(false)}
        unlockedBadgeIds={playerStats.unlockedBadgeIds}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        playerStats={playerStats}
      />

      <TeacherDashboardModal
        isOpen={isTeacherPortalOpen}
        onClose={() => setIsTeacherPortalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-bold text-amber-400">Jelajah Bhinneka</span>
            <span>·</span>
            <span>Media Pembelajaran Interaktif IPS SMP Kelas 7</span>
          </div>
          <div>
            Berdasarkan Capaian Pembelajaran Kurikulum Merdeka & Kurikulum 2013
          </div>
        </div>
      </footer>
    </div>
  );
}
