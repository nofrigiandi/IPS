import React, { useState } from 'react';
import { 
  Key, 
  User, 
  GraduationCap, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Compass,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { tokenManager } from '../utils/tokenManager';
import { StudentSession } from '../types/game';
import { sound } from '../utils/audio';

interface StudentGateProps {
  onStudentEnter: (session: StudentSession) => void;
  onOpenTeacherPortal: () => void;
}

export const StudentGate: React.FC<StudentGateProps> = ({
  onStudentEnter,
  onOpenTeacherPortal,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [classInput, setClassInput] = useState('Kelas 7-A');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available tokens for quick click/test
  const activeTokens = tokenManager.getTokens().filter((t) => t.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setErrorMsg(null);

    if (!tokenInput.trim()) {
      setErrorMsg('Silakan masukkan kode token akses dari gurumu.');
      sound.playWrong();
      return;
    }

    if (!nameInput.trim()) {
      setErrorMsg('Silakan masukkan nama lengkapmu.');
      sound.playWrong();
      return;
    }

    const result = tokenManager.registerStudentWithToken(
      tokenInput,
      nameInput,
      classInput
    );

    if (result.success && result.session) {
      sound.playLevelUp();
      onStudentEnter(result.session);
    } else {
      sound.playWrong();
      setErrorMsg(result.error || 'Token tidak valid.');
    }
  };

  const handleSelectSampleToken = (code: string, className: string) => {
    sound.playClick();
    setTokenInput(code);
    setClassInput(className);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar with Teacher Portal Trigger */}
      <header className="max-w-6xl w-full mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-amber-500/20">
            🇮🇩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight text-white">
                JELAJAH BHINNEKA
              </span>
              <span className="text-[10px] font-bold bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded border border-amber-400/20">
                IPS KELAS 7
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Permainan Edukasi Keberagaman Suku, Agama, Ras & Budaya
            </p>
          </div>
        </div>

        {/* Teacher / Admin Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenTeacherPortal();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all shadow-sm"
          title="Masuk sebagai Guru untuk membuat & mengelola token (admin / admin212)"
        >
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>Portal Guru (Admin)</span>
        </button>
      </header>

      {/* Hero & Token Access Gate */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-lg bg-slate-850/90 border border-slate-750 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Emblem & Intro */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
              🔑
            </div>
            <h1 className="font-display text-2xl font-extrabold text-white mb-1">
              Gerbang Masuk Siswa
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Masukkan <span className="text-amber-400 font-semibold">Token Akses</span> yang diberikan oleh Guru IPS untuk membuka petualangan game keberagaman.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Token Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5 flex items-center justify-between">
                <span>Kode Token Akses:</span>
                <span className="text-[10px] text-amber-400 lowercase italic">
                  *diberikan oleh bapak/ibu guru
                </span>
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value.toUpperCase());
                    setErrorMsg(null);
                  }}
                  placeholder="Contoh: IPS7-NUSANTARA"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono font-bold text-amber-300 text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 tracking-wider uppercase"
                />
              </div>

              {/* Sample token chips for quick testing */}
              {activeTokens.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500">Token Tersedia:</span>
                  {activeTokens.slice(0, 3).map((tok) => (
                    <button
                      key={tok.id}
                      type="button"
                      onClick={() => handleSelectSampleToken(tok.code, tok.className)}
                      className="text-[10px] font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                      title={`Klik untuk mengisi token ${tok.code} (${tok.className})`}
                    >
                      {tok.code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Student Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Nama Lengkap Siswa:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Nama lengkapmu (misal: Aditya Pratama)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Student Class */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Kelas:
              </label>
              <input
                type="text"
                required
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                placeholder="misal: Kelas 7-A, 7-B, 7-C"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Mulai Petualangan Jelajah Bhinneka</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Info for Teachers */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Akses Terpantau Guru</span>
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onOpenTeacherPortal();
              }}
              className="text-amber-400 hover:underline font-semibold text-xs"
            >
              Login Guru (admin / admin212)
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/80">
        Mata Pelajaran IPS Kelas 7 SMP · Materi Keberagaman dalam Bingkai Bhinneka Tunggal Ika
      </footer>
    </div>
  );
};
