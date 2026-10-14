import * as XLSX from 'xlsx';
import { AccessToken, StudentRecord, StudentSession } from '../types/game';

const TOKENS_STORAGE_KEY = 'jelajah_bhinneka_tokens_v1';
const STUDENTS_STORAGE_KEY = 'jelajah_bhinneka_students_v1';
const SESSION_STORAGE_KEY = 'jelajah_bhinneka_session_v1';
const TEACHER_AUTH_KEY = 'jelajah_bhinneka_teacher_auth_v1';
const TEACHER_PROFILE_KEY = 'jelajah_bhinneka_teacher_profile_v1';

export interface TeacherProfile {
  username: string;
  password: string;
  name: string;
  nip?: string;
  schoolName: string;
}

const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  username: 'admin',
  password: 'admin212',
  name: 'Guru Mata Pelajaran IPS',
  nip: '19850314 201001 1 008',
  schoolName: 'SMP Negeri 1',
};

// Default initial tokens for immediate testing
const INITIAL_TOKENS: AccessToken[] = [
  {
    id: 'tok-1',
    code: 'IPS7-NUSANTARA',
    className: 'Kelas 7-A',
    schoolName: 'SMP Negeri 1',
    teacherName: 'Guru Mata Pelajaran IPS',
    usedCount: 2,
    createdAt: new Date().toISOString(),
    isActive: true,
    notes: 'Token utama materi keberagaman kelas 7-A',
  },
  {
    id: 'tok-2',
    code: 'BHINNEKA7B',
    className: 'Kelas 7-B',
    schoolName: 'SMP Negeri 1',
    teacherName: 'Guru Mata Pelajaran IPS',
    usedCount: 1,
    createdAt: new Date().toISOString(),
    isActive: true,
    notes: 'Token kelas 7-B',
  },
];

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'std-1',
    name: 'Siti Rahmawati',
    studentClass: 'Kelas 7-A',
    schoolName: 'SMP Negeri 1',
    tokenUsed: 'IPS7-NUSANTARA',
    joinedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    xp: 420,
    level: 3,
    highestQuizScore: 90,
    unlockedBadgesCount: 4,
  },
  {
    id: 'std-2',
    name: 'Ahmad Faisal',
    studentClass: 'Kelas 7-A',
    schoolName: 'SMP Negeri 1',
    tokenUsed: 'IPS7-NUSANTARA',
    joinedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    xp: 280,
    level: 2,
    highestQuizScore: 80,
    unlockedBadgesCount: 3,
  },
  {
    id: 'std-3',
    name: 'Made Aryaningrat',
    studentClass: 'Kelas 7-B',
    schoolName: 'SMP Negeri 1',
    tokenUsed: 'BHINNEKA7B',
    joinedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    xp: 510,
    level: 4,
    highestQuizScore: 100,
    unlockedBadgesCount: 6,
  },
];

export const tokenManager = {
  // --- TEACHER PROFILE & AUTHENTICATION ---
  getTeacherProfile(): TeacherProfile {
    try {
      const data = localStorage.getItem(TEACHER_PROFILE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    this.saveTeacherProfile(DEFAULT_TEACHER_PROFILE);
    return DEFAULT_TEACHER_PROFILE;
  },

  saveTeacherProfile(profile: TeacherProfile) {
    try {
      localStorage.setItem(TEACHER_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  },

  verifyTeacher(user: string, pw: string): boolean {
    const profile = this.getTeacherProfile();
    return user.trim().toLowerCase() === profile.username.toLowerCase() && pw === profile.password;
  },

  updateTeacherProfileInfo(params: { name: string; schoolName: string; nip?: string }): { success: boolean; message: string } {
    const profile = this.getTeacherProfile();
    profile.name = params.name.trim() || 'Guru IPS';
    profile.schoolName = params.schoolName.trim() || 'SMP Negeri 1';
    profile.nip = params.nip?.trim() || '';
    this.saveTeacherProfile(profile);
    return { success: true, message: 'Profil dan identitas guru berhasil diperbarui!' };
  },

  changeTeacherPassword(oldPassword: string, newPassword: string): { success: boolean; message: string } {
    const profile = this.getTeacherProfile();
    if (oldPassword !== profile.password) {
      return { success: false, message: 'Kata sandi lama yang Anda masukkan salah.' };
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, message: 'Kata sandi baru minimal harus 4 karakter.' };
    }

    profile.password = newPassword.trim();
    this.saveTeacherProfile(profile);
    return { success: true, message: 'Kata sandi guru berhasil diubah! Silakan gunakan kata sandi baru untuk login berikutnya.' };
  },

  setTeacherLoggedIn(isLoggedIn: boolean) {
    if (isLoggedIn) {
      sessionStorage.setItem(TEACHER_AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(TEACHER_AUTH_KEY);
    }
  },

  isTeacherLoggedIn(): boolean {
    return sessionStorage.getItem(TEACHER_AUTH_KEY) === 'true';
  },

  // --- TOKEN OPERATIONS ---
  getTokens(): AccessToken[] {
    try {
      const data = localStorage.getItem(TOKENS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    // Save defaults
    this.saveTokens(INITIAL_TOKENS);
    return INITIAL_TOKENS;
  },

  saveTokens(tokens: AccessToken[]) {
    try {
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
    } catch {
      // ignore
    }
  },

  createToken(params: {
    code: string;
    className: string;
    schoolName: string;
    teacherName?: string;
    maxUses?: number;
    notes?: string;
  }): { success: boolean; message: string; token?: AccessToken } {
    const formattedCode = params.code.trim().toUpperCase().replace(/\s+/g, '-');
    if (!formattedCode) {
      return { success: false, message: 'Kode token tidak boleh kosong.' };
    }

    const tokens = this.getTokens();
    if (tokens.some((t) => t.code === formattedCode)) {
      return { success: false, message: `Token dengan kode "${formattedCode}" sudah ada!` };
    }

    const teacher = this.getTeacherProfile();

    const newToken: AccessToken = {
      id: `tok-${Date.now()}`,
      code: formattedCode,
      className: params.className.trim() || 'Kelas 7',
      schoolName: params.schoolName.trim() || teacher.schoolName,
      teacherName: params.teacherName?.trim() || teacher.name,
      maxUses: params.maxUses && params.maxUses > 0 ? params.maxUses : undefined,
      usedCount: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
      notes: params.notes?.trim() || '',
    };

    tokens.unshift(newToken);
    this.saveTokens(tokens);
    return { success: true, message: `Token ${formattedCode} berhasil dibuat!`, token: newToken };
  },

  toggleTokenStatus(tokenId: string): AccessToken[] {
    const tokens = this.getTokens().map((t) =>
      t.id === tokenId ? { ...t, isActive: !t.isActive } : t
    );
    this.saveTokens(tokens);
    return tokens;
  },

  deleteToken(tokenId: string): AccessToken[] {
    const tokens = this.getTokens().filter((t) => t.id !== tokenId);
    this.saveTokens(tokens);
    return tokens;
  },

  generateRandomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'IPS7-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  // --- TOKEN VALIDATION & STUDENT ENTRY ---
  validateToken(code: string): { valid: boolean; token?: AccessToken; error?: string } {
    const clean = code.trim().toUpperCase();
    const tokens = this.getTokens();
    const found = tokens.find((t) => t.code === clean);

    if (!found) {
      return { valid: false, error: 'Kode token tidak ditemukan! Silakan tanyakan kode token kepada Guru IPS.' };
    }

    if (!found.isActive) {
      return { valid: false, error: 'Token ini telah dinonaktifkan oleh guru.' };
    }

    if (found.maxUses && found.usedCount >= found.maxUses) {
      return { valid: false, error: `Batas kuota token (${found.maxUses} siswa) telah tercapai.` };
    }

    return { valid: true, token: found };
  },

  registerStudentWithToken(
    tokenCode: string,
    studentName: string,
    studentClass: string
  ): { success: boolean; session?: StudentSession; error?: string } {
    const validation = this.validateToken(tokenCode);
    if (!validation.valid || !validation.token) {
      return { success: false, error: validation.error };
    }

    const token = validation.token;

    // Increment used count
    const tokens = this.getTokens().map((t) =>
      t.id === token.id ? { ...t, usedCount: t.usedCount + 1 } : t
    );
    this.saveTokens(tokens);

    // Save session
    const session: StudentSession = {
      tokenCode: token.code,
      studentName: studentName.trim(),
      studentClass: studentClass.trim() || token.className,
      schoolName: token.schoolName,
      loginTime: new Date().toISOString(),
    };
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }

    // Record student
    this.recordStudentActivity({
      name: session.studentName,
      studentClass: session.studentClass,
      schoolName: session.schoolName,
      tokenUsed: token.code,
      xp: 0,
      level: 1,
      highestQuizScore: 0,
      unlockedBadgesCount: 1,
    });

    return { success: true, session };
  },

  getCurrentSession(): StudentSession | null {
    try {
      const data = localStorage.getItem(SESSION_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return null;
  },

  clearSession() {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  // --- STUDENT ACTIVITY MONITORING FOR TEACHER ---
  getStudents(): StudentRecord[] {
    try {
      const data = localStorage.getItem(STUDENTS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    this.saveStudents(INITIAL_STUDENTS);
    return INITIAL_STUDENTS;
  },

  saveStudents(students: StudentRecord[]) {
    try {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
    } catch {
      // ignore
    }
  },

  recordStudentActivity(data: {
    name: string;
    studentClass: string;
    schoolName: string;
    tokenUsed: string;
    xp: number;
    level: number;
    highestQuizScore: number;
    unlockedBadgesCount: number;
  }) {
    const students = this.getStudents();
    const existingIndex = students.findIndex(
      (s) => s.name.toLowerCase() === data.name.toLowerCase() && s.tokenUsed === data.tokenUsed
    );

    if (existingIndex >= 0) {
      students[existingIndex] = {
        ...students[existingIndex],
        xp: Math.max(students[existingIndex].xp, data.xp),
        level: Math.max(students[existingIndex].level, data.level),
        highestQuizScore: Math.max(students[existingIndex].highestQuizScore, data.highestQuizScore),
        unlockedBadgesCount: Math.max(students[existingIndex].unlockedBadgesCount, data.unlockedBadgesCount),
      };
    } else {
      const newRec: StudentRecord = {
        id: `std-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: data.name,
        studentClass: data.studentClass,
        schoolName: data.schoolName,
        tokenUsed: data.tokenUsed,
        joinedAt: new Date().toISOString(),
        xp: data.xp,
        level: data.level,
        highestQuizScore: data.highestQuizScore,
        unlockedBadgesCount: data.unlockedBadgesCount,
      };
      students.unshift(newRec);
    }

    this.saveStudents(students);
  },

  // --- NATIVE MULTI-COLUMN EXCEL (.xlsx) EXPORT ---
  exportStudentsToExcel(filterClassName?: string) {
    const teacher = this.getTeacherProfile();
    let students = this.getStudents();

    if (filterClassName && filterClassName !== 'all') {
      students = students.filter((s) => s.studentClass === filterClassName);
    }

    // Prepare Title and Metadata Rows
    const currentDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const worksheetData: (string | number)[][] = [
      ['REKAPITULASI NILAI & CAPAIAN BELAJAR SISWA'],
      ['MATA PELAJARAN IPS KELAS 7 - TEMA KEBERAGAMAN INDONESIA'],
      ['APLIKASI PERMAINAN EDUKASI "JELAJAH BHINNEKA"'],
      [],
      ['Guru Pengampu', `: ${teacher.name}`],
      ['NIP', `: ${teacher.nip || '-'}`],
      ['Asal Sekolah', `: ${teacher.schoolName}`],
      ['Tanggal Unduh', `: ${currentDate}`],
      ['Total Siswa', `: ${students.length} orang`],
      [],
      // True Header Row - Each Column Separate
      [
        'No',
        'Nama Lengkap Siswa',
        'Kelas',
        'Asal Sekolah',
        'Token Akses',
        'Nilai Kuis (0-100)',
        'Predikat',
        'Total Poin XP',
        'Level Capaian',
        'Jumlah Lencana',
        'Waktu Mengerjakan',
      ],
    ];

    // Data rows
    students.forEach((s, idx) => {
      let predikat = 'Perlu Pendampingan';
      if (s.highestQuizScore >= 90) predikat = 'Sangat Baik (A)';
      else if (s.highestQuizScore >= 80) predikat = 'Baik (B)';
      else if (s.highestQuizScore >= 70) predikat = 'Cukup (C)';

      worksheetData.push([
        idx + 1,
        s.name,
        s.studentClass,
        s.schoolName,
        s.tokenUsed,
        s.highestQuizScore,
        predikat,
        s.xp,
        `Level ${s.level}`,
        `${s.unlockedBadgesCount} Lencana`,
        new Date(s.joinedAt).toLocaleString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      ]);
    });

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set precise column widths (in characters) so each column is spacious and clean
    worksheet['!cols'] = [
      { wch: 6 },  // No
      { wch: 28 }, // Nama Lengkap Siswa
      { wch: 14 }, // Kelas
      { wch: 22 }, // Asal Sekolah
      { wch: 18 }, // Token Akses
      { wch: 18 }, // Nilai Kuis (0-100)
      { wch: 18 }, // Predikat
      { wch: 14 }, // Total Poin XP
      { wch: 14 }, // Level Capaian
      { wch: 16 }, // Jumlah Lencana
      { wch: 22 }, // Waktu Mengerjakan
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Nilai IPS Kelas 7');

    // Trigger download of real .xlsx file
    const dateStamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Rekap_Nilai_IPS_Kelas7_${dateStamp}.xlsx`);
  },
};
