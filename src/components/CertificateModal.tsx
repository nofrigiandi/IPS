import React, { useRef } from 'react';
import { X, Printer, Award, Shield, CheckCircle2, Download } from 'lucide-react';
import { PlayerStats } from '../types/game';
import { sound } from '../utils/audio';
import { tokenManager } from '../utils/tokenManager';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  playerStats,
}) => {
  if (!isOpen) return null;

  const teacherProfile = tokenManager.getTeacherProfile();

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-3xl my-auto">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="flex items-center justify-between pb-3 text-slate-300 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white">
              Piagam Penghargaan Duta Keberagaman
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Container */}
        <div
          id="certificate-print-area"
          className="relative bg-gradient-to-b from-amber-50/95 via-white to-amber-50/90 text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border-8 border-double border-amber-600/80 overflow-hidden font-serif"
        >
          {/* Subtle Decorative Corners */}
          <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-600" />
          <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-600" />
          <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-600" />
          <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-600" />

          {/* Certificate Content */}
          <div className="text-center space-y-4">
            {/* Header Emblem */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white text-3xl shadow-md mb-2 border-2 border-amber-300">
                🇮🇩
              </div>
              <div className="text-[11px] font-sans font-bold tracking-widest text-amber-900 uppercase">
                REPUBLIK INDONESIA · KURIKULUM ILMU PENGETAHUAN SOSIAL
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-wide text-slate-900 uppercase mt-1">
                Piagam Penghargaan
              </h1>
              <div className="text-xs font-sans font-bold tracking-widest text-amber-800 uppercase mt-0.5">
                DUTA KEBERAGAMAN & HARMONI PELAJAR NUSANTARA
              </div>
              <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-2" />
            </div>

            {/* Recipient */}
            <div className="pt-2">
              <p className="text-xs font-sans text-slate-600 italic">
                Dengan penuh rasa bangga diberikan kepada:
              </p>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-950 underline decoration-amber-500/50 underline-offset-8 mt-1">
                {playerStats.name || 'Siswa Berprestasi'}
              </div>
              <div className="text-sm font-sans font-semibold text-slate-700 mt-2">
                {playerStats.schoolName || 'SMP Nusantara'}
              </div>
            </div>

            {/* Citation */}
            <p className="text-xs font-sans text-slate-700 leading-relaxed max-w-xl mx-auto pt-2">
              Telah berhasil menyelesaikan serangkaian misi eksplorasi, analisis, dan tantangan cerdas cermat bertema{' '}
              <span className="font-bold text-slate-900">
                "Keberagaman Suku, Agama, Ras, dan Antargolongan dalam Bingkai Bhinneka Tunggal Ika"
              </span>{' '}
              pada mata pelajaran <span className="font-bold">IPS Kelas 7 SMP</span> dengan dedikasi tinggi serta menjunjung tinggi nilai-nilai toleransi dan persatuan bangsa.
            </p>

            {/* Achievement Metrics */}
            <div className="flex items-center justify-center gap-6 pt-2 font-sans">
              <div className="text-center">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Tingkat Penjelajah</div>
                <div className="text-sm font-bold text-amber-800">Level {playerStats.level}</div>
              </div>
              <div className="text-center border-x border-amber-300/80 px-6">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Poin Pengalaman (XP)</div>
                <div className="text-sm font-bold text-emerald-800">{playerStats.xp} XP</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Lencana Terkumpul</div>
                <div className="text-sm font-bold text-blue-800">{playerStats.unlockedBadgeIds.length} Lencana</div>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 font-sans text-xs">
              <div className="text-center">
                <div className="text-slate-500 mb-8">Ditetapkan pada: {currentDate}</div>
                <div className="font-bold text-slate-900 border-t border-slate-400 pt-1 max-w-[200px] mx-auto">
                  {teacherProfile.name}
                </div>
                {teacherProfile.nip && (
                  <div className="text-[10px] text-slate-500">NIP. {teacherProfile.nip}</div>
                )}
                <div className="text-[10px] text-slate-600 font-medium">Guru Mata Pelajaran IPS</div>
              </div>
              <div className="text-center">
                <div className="text-slate-500 mb-8">Status: Divalidasi Kurikulum Merdeka</div>
                <div className="font-bold text-slate-900 border-t border-slate-400 pt-1 max-w-[200px] mx-auto">
                  Kepala / Pembina Kurikulum
                </div>
                <div className="text-[10px] text-slate-600 font-medium">{teacherProfile.schoolName}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
