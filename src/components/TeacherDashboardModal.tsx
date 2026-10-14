import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Lock, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Power, 
  Users, 
  GraduationCap, 
  AlertCircle,
  Sparkles,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Settings,
  User,
  ShieldCheck,
  Building
} from 'lucide-react';
import { tokenManager, TeacherProfile } from '../utils/tokenManager';
import { AccessToken, StudentRecord } from '../types/game';
import { sound } from '../utils/audio';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokensUpdated?: () => void;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
  onTokensUpdated,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    tokenManager.isTeacherLoggedIn()
  );
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'tokens' | 'students' | 'profile'>('tokens');

  // Teacher Profile state
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() =>
    tokenManager.getTeacherProfile()
  );

  // Profile Form state
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editSchoolName, setEditSchoolName] = useState('');
  const [editNip, setEditNip] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Password Change Form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Token management data
  const [tokens, setTokens] = useState<AccessToken[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  // New token form state
  const [newCode, setNewCode] = useState('');
  const [newClassName, setNewClassName] = useState('Kelas 7-A');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newMaxUses, setNewMaxUses] = useState<number | ''>('');
  const [newNotes, setNewNotes] = useState('');
  const [formMsg, setFormMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filter students
  const [studentSearch, setStudentSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Reload data
  const reloadData = () => {
    const prof = tokenManager.getTeacherProfile();
    setTeacherProfile(prof);
    setEditTeacherName(prof.name);
    setEditSchoolName(prof.schoolName);
    setEditNip(prof.nip || '');
    setNewSchoolName(prof.schoolName);
    setTokens(tokenManager.getTokens());
    setStudents(tokenManager.getStudents());
  };

  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(tokenManager.isTeacherLoggedIn());
      reloadData();
      setLoginError(null);
      setFormMsg(null);
      setProfileMsg(null);
      setPwMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    if (tokenManager.verifyTeacher(username, password)) {
      sound.playLevelUp();
      tokenManager.setTeacherLoggedIn(true);
      setIsAuthenticated(true);
      setLoginError(null);
      reloadData();
    } else {
      sound.playWrong();
      setLoginError('Username atau kata sandi guru salah! (Periksa kembali username dan kata sandi Anda)');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sound.playClick();
    tokenManager.setTeacherLoggedIn(false);
    setIsAuthenticated(false);
    setPassword('');
  };

  // Generate random token code
  const handleRandomizeCode = () => {
    sound.playClick();
    setNewCode(tokenManager.generateRandomCode());
  };

  // Create Token
  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const result = tokenManager.createToken({
      code: newCode,
      className: newClassName,
      schoolName: newSchoolName || teacherProfile.schoolName,
      teacherName: teacherProfile.name,
      maxUses: typeof newMaxUses === 'number' ? newMaxUses : undefined,
      notes: newNotes,
    });

    if (result.success) {
      sound.playCorrect();
      setFormMsg({ text: result.message, type: 'success' });
      setNewCode('');
      reloadData();
      if (onTokensUpdated) onTokensUpdated();
    } else {
      sound.playWrong();
      setFormMsg({ text: result.message, type: 'error' });
    }
  };

  // Toggle Token
  const handleToggleToken = (id: string) => {
    sound.playClick();
    const updated = tokenManager.toggleTokenStatus(id);
    setTokens(updated);
    if (onTokensUpdated) onTokensUpdated();
  };

  // Delete Token
  const handleDeleteToken = (id: string) => {
    if (confirm('Yakin ingin menghapus token ini? Siswa tidak akan bisa masuk lagi dengan token ini.')) {
      sound.playClick();
      const updated = tokenManager.deleteToken(id);
      setTokens(updated);
      if (onTokensUpdated) onTokensUpdated();
    }
  };

  // Copy Token to clipboard
  const handleCopy = (code: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(code);
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  // Handle Update Teacher Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const res = tokenManager.updateTeacherProfileInfo({
      name: editTeacherName,
      schoolName: editSchoolName,
      nip: editNip,
    });
    sound.playCorrect();
    setProfileMsg({ text: res.message, type: 'success' });
    reloadData();
  };

  // Handle Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    if (newPassword !== confirmPassword) {
      sound.playWrong();
      setPwMsg({ text: 'Konfirmasi kata sandi baru tidak cocok.', type: 'error' });
      return;
    }

    const res = tokenManager.changeTeacherPassword(oldPassword, newPassword);
    if (res.success) {
      sound.playLevelUp();
      setPwMsg({ text: res.message, type: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      reloadData();
    } else {
      sound.playWrong();
      setPwMsg({ text: res.message, type: 'error' });
    }
  };

  // Export Native Multi-Column Excel (.xlsx)
  const handleExportExcel = () => {
    sound.playClick();
    tokenManager.exportStudentsToExcel(classFilter);
  };

  // Available unique classes for filter
  const uniqueClasses = Array.from(new Set(students.map((s) => s.studentClass)));

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentClass.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.tokenUsed.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesClass = classFilter === 'all' || s.studentClass === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-850 border border-slate-700 w-full max-w-4xl rounded-2xl p-5 sm:p-7 shadow-2xl my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-750 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
              👨‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-white">
                  Portal Guru IPS
                </h2>
                {isAuthenticated && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    {teacherProfile.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {teacherProfile.schoolName} · Pembelajaran Keberagaman IPS Kelas 7
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-semibold transition-colors"
                title="Keluar dari sesi guru"
              >
                <Power className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-750 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Section: Login vs Dashboard */}
        {!isAuthenticated ? (
          /* LOGIN FORM FOR TEACHER */
          <div className="max-w-md mx-auto w-full py-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-1">
                Masuk ke Panel Guru
              </h3>
              <p className="text-xs text-slate-400">
                Masukkan nama pengguna dan kata sandi Anda untuk mengelola token dan nilai siswa.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Username Guru:
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Kata Sandi:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-400">
                <span className="font-semibold text-amber-300">Akun Awal Standar:</span>
                <div className="mt-1 font-mono text-[11px] text-slate-300">
                  Username: <strong className="text-amber-400">admin</strong> | Password Awal: <strong className="text-amber-400">admin212</strong>
                </div>
                <div className="mt-1 text-[11px] text-slate-400 italic">
                  *Anda dapat mengganti password dan nama guru kapan saja di dalam tab Pengaturan Guru.
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all"
              >
                Masuk Panel Guru
              </button>
            </form>
          </div>
        ) : (
          /* TEACHER DASHBOARD (AUTHENTICATED) */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-750 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('tokens');
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'tokens'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Token Kelas ({tokens.length})</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('students');
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'students'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Rekap Nilai ({students.length})</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('profile');
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'profile'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Ganti Password & Profil</span>
                </button>
              </div>

              {activeTab === 'students' && (
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-all hover:scale-[1.02]"
                  title="Unduh Rekap Nilai Format Asli Excel (.xlsx) rapi per kolom"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                  <span>Unduh Nilai Excel (.xlsx)</span>
                </button>
              )}
            </div>

            {/* TAB 1: MANAJEMEN TOKEN */}
            {activeTab === 'tokens' && (
              <div className="space-y-6 overflow-y-auto pr-1">
                {/* Form Buat Token Baru */}
                <div className="bg-slate-900/70 border border-slate-750 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Plus className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-sm text-white">
                      Buat Token Akses Baru untuk Kelas
                    </h4>
                  </div>

                  <form onSubmit={handleCreateToken} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Code */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-300 uppercase">
                            Kode Token:
                          </label>
                          <button
                            type="button"
                            onClick={handleRandomizeCode}
                            className="text-[10px] text-amber-400 hover:underline font-semibold flex items-center gap-0.5"
                          >
                            <Sparkles className="w-3 h-3" /> Acak
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={newCode}
                          onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                          placeholder="misal: IPS7-MERDEKA"
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* Class Name */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                          Nama Kelas / Kelompok:
                        </label>
                        <input
                          type="text"
                          required
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          placeholder="misal: Kelas 7-A"
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* School Name */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                          Asal Sekolah:
                        </label>
                        <input
                          type="text"
                          required
                          value={newSchoolName}
                          onChange={(e) => setNewSchoolName(e.target.value)}
                          placeholder="misal: SMP Negeri 1"
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                          Batas Maksimal Siswa (Opsional):
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newMaxUses}
                          onChange={(e) =>
                            setNewMaxUses(e.target.value ? parseInt(e.target.value) : '')
                          }
                          placeholder="Biarkan kosong untuk tanpa batas"
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                          Catatan / Keterangan Tugas:
                        </label>
                        <input
                          type="text"
                          value={newNotes}
                          onChange={(e) => setNewNotes(e.target.value)}
                          placeholder="misal: Tugas Kuis Bab Keberagaman Semester 2"
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {formMsg && (
                      <div
                        className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                          formMsg.type === 'success'
                            ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                            : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                        }`}
                      >
                        {formMsg.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{formMsg.text}</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Terbitkan Token Akses</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Daftar Token */}
                <div>
                  <h4 className="font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>Daftar Token Akses Aktif & Terdaftar</span>
                  </h4>

                  <div className="space-y-2.5">
                    {tokens.map((token) => (
                      <div
                        key={token.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          token.isActive
                            ? 'bg-slate-900/60 border-slate-750'
                            : 'bg-slate-900/20 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                              token.isActive
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            🔑
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-base text-white tracking-wide">
                                {token.code}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.2 rounded border ${
                                  token.isActive
                                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-500 border-slate-700'
                                }`}
                              >
                                {token.isActive ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </div>

                            <div className="text-xs text-slate-400 mt-0.5">
                              <span>{token.className}</span>
                              <span className="mx-1.5">·</span>
                              <span>{token.schoolName}</span>
                              {token.notes && (
                                <>
                                  <span className="mx-1.5">·</span>
                                  <span className="text-slate-400 italic">"{token.notes}"</span>
                                </>
                              )}
                            </div>

                            <div className="text-[11px] text-amber-400/80 font-medium mt-1">
                              Digunakan: <strong>{token.usedCount} siswa</strong>
                              {token.maxUses && ` (Batas: ${token.maxUses})`}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => handleCopy(token.code, token.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                            title="Salin kode token"
                          >
                            {copiedTokenId === token.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleToggleToken(token.id)}
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                              token.isActive
                                ? 'bg-slate-800 hover:bg-amber-950/40 text-amber-300 border-amber-500/30'
                                : 'bg-slate-800 hover:bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                            }`}
                            title={token.isActive ? 'Nonaktifkan Token' : 'Aktifkan Token'}
                          >
                            {token.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>

                          <button
                            onClick={() => handleDeleteToken(token.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                            title="Hapus Token"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REKAP NILAI & PROGRES SISWA */}
            {activeTab === 'students' && (
              <div className="space-y-4 overflow-y-auto pr-1">
                {/* Search & Class Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Cari nama siswa atau token..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {uniqueClasses.length > 0 && (
                      <select
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="all">Semua Kelas</option>
                        {uniqueClasses.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>
                      Siswa Terdata: <strong className="text-amber-400">{filteredStudents.length}</strong>
                    </span>
                    <button
                      onClick={handleExportExcel}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition-colors flex items-center gap-1.5"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Unduh Excel</span>
                    </button>
                  </div>
                </div>

                {/* Table of Students - Beautiful Native Presentation */}
                <div className="bg-slate-900/60 border border-slate-750 rounded-2xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-800/90 text-slate-300 font-semibold border-b border-slate-750">
                        <tr>
                          <th className="py-3 px-3 w-10 text-center">No</th>
                          <th className="py-3 px-4">Nama Siswa</th>
                          <th className="py-3 px-3">Kelas</th>
                          <th className="py-3 px-3">Token Akses</th>
                          <th className="py-3 px-3 text-center">Nilai Kuis (0-100)</th>
                          <th className="py-3 px-3 text-center">Predikat</th>
                          <th className="py-3 px-3 text-center">Poin XP</th>
                          <th className="py-3 px-3 text-center">Level</th>
                          <th className="py-3 px-3 text-center">Lencana</th>
                          <th className="py-3 px-3 text-right">Waktu Mengerjakan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="py-8 text-center text-slate-500">
                              Belum ada data siswa untuk kriteria pencarian ini.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((s, idx) => {
                            let predikat = 'Perlu Bimbingan';
                            let predikatColor = 'text-slate-400';
                            if (s.highestQuizScore >= 90) {
                              predikat = 'Sangat Baik (A)';
                              predikatColor = 'text-emerald-400 font-bold';
                            } else if (s.highestQuizScore >= 80) {
                              predikat = 'Baik (B)';
                              predikatColor = 'text-blue-400 font-bold';
                            } else if (s.highestQuizScore >= 70) {
                              predikat = 'Cukup (C)';
                              predikatColor = 'text-amber-400 font-medium';
                            }

                            return (
                              <tr key={s.id} className="hover:bg-slate-850/60 transition-colors">
                                <td className="py-3 px-3 text-center text-slate-500 font-mono">
                                  {idx + 1}
                                </td>
                                <td className="py-3 px-4 font-bold text-white">
                                  {s.name}
                                </td>
                                <td className="py-3 px-3 text-slate-300 font-medium">
                                  {s.studentClass}
                                </td>
                                <td className="py-3 px-3">
                                  <span className="font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-amber-300 font-bold">
                                    {s.tokenUsed}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center font-mono font-bold">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[11px] inline-block ${
                                      s.highestQuizScore >= 80
                                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                        : s.highestQuizScore >= 60
                                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                        : 'bg-slate-800 text-slate-400'
                                    }`}
                                  >
                                    {s.highestQuizScore > 0 ? `${s.highestQuizScore}` : '-'}
                                  </span>
                                </td>
                                <td className={`py-3 px-3 text-center text-[11px] ${predikatColor}`}>
                                  {predikat}
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-amber-400 font-mono">
                                  {s.xp}
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-emerald-400">
                                  Lv.{s.level}
                                </td>
                                <td className="py-3 px-3 text-center text-slate-300">
                                  🎖️ {s.unlockedBadgesCount}
                                </td>
                                <td className="py-3 px-3 text-right text-[11px] text-slate-400">
                                  {new Date(s.joinedAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  💡 Tips Guru: Klik tombol <strong>"Unduh Nilai Excel (.xlsx)"</strong> untuk mendapatkan spreadsheet lengkap dengan kolom terpisah (Nama, Kelas, Nilai, Predikat, dll.) yang siap digunakan untuk penilaian rapor!
                </p>
              </div>
            )}

            {/* TAB 3: PROFIL GURU & GANTI PASSWORD */}
            {activeTab === 'profile' && (
              <div className="space-y-6 overflow-y-auto pr-1">
                {/* Form 1: Ubah Nama Guru & Identitas */}
                <div className="bg-slate-900/70 border border-slate-750 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        Identitas & Nama Guru Pengampu
                      </h4>
                      <p className="text-xs text-slate-400">
                        Nama guru ini akan tertera pada piagam penghargaan siswa dan token akses kelas.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Nama Lengkap Guru Beserta Gelar:
                        </label>
                        <input
                          type="text"
                          required
                          value={editTeacherName}
                          onChange={(e) => setEditTeacherName(e.target.value)}
                          placeholder="misal: Bapak Bambang Supriyadi, S.Pd."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Asal Sekolah:
                        </label>
                        <input
                          type="text"
                          required
                          value={editSchoolName}
                          onChange={(e) => setEditSchoolName(e.target.value)}
                          placeholder="misal: SMP Negeri 1 Jakarta"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                        NIP Guru (Opsional):
                      </label>
                      <input
                        type="text"
                        value={editNip}
                        onChange={(e) => setEditNip(e.target.value)}
                        placeholder="misal: 19850314 201001 1 008"
                        className="w-full sm:w-1/2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {profileMsg && (
                      <div
                        className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                          profileMsg.type === 'success'
                            ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                            : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{profileMsg.text}</span>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Simpan Identitas Guru</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Form 2: Ganti Kata Sandi Guru */}
                <div className="bg-slate-900/70 border border-slate-750 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        Ganti Kata Sandi (Password) Guru
                      </h4>
                      <p className="text-xs text-slate-400">
                        Ubah kata sandi default (<code className="text-amber-400 font-mono">admin212</code>) ke kata sandi pribadi Anda.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                        Kata Sandi Lama:
                      </label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Masukkan kata sandi saat ini"
                        className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Kata Sandi Baru:
                        </label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 4 karakter"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Ulangi Kata Sandi Baru:
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ketik ulang kata sandi baru"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {pwMsg && (
                      <div
                        className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                          pwMsg.type === 'success'
                            ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                            : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                        }`}
                      >
                        {pwMsg.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{pwMsg.text}</span>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-all flex items-center gap-1.5"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Perbarui Kata Sandi</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
