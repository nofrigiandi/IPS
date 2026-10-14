export type RegionId = 'sumatera' | 'jawa' | 'kalimantan' | 'sulawesi' | 'bali-nusa' | 'maluku-papua';

export type CulturalCategory = 
  | 'rumah-adat' 
  | 'pakaian-adat' 
  | 'alat-musik' 
  | 'senjata-tradisional' 
  | 'tarian-daerah' 
  | 'makanan-khas'
  | 'suku-bangsa'
  | 'agama-ibadah';

export interface CulturalItem {
  id: string;
  name: string;
  regionId: RegionId;
  regionName: string;
  category: CulturalCategory;
  origin: string; // e.g. "Sumatera Barat", "Papua"
  description: string;
  funFact: string;
  iconName: string;
  tags: string[];
}

export interface RegionInfo {
  id: RegionId;
  name: string;
  tagline: string;
  description: string;
  majorTribes: string[];
  keyHighlights: string[];
  color: string;
  iconBg: string;
  coordinates: { x: number; y: number }; // For SVG map node positioning (%)
}

export interface QuizQuestion {
  id: string;
  topic: 'faktor-penyebab' | 'suku' | 'agama' | 'ras' | 'budaya' | 'toleransi';
  topicLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'mudah' | 'sedang' | 'sulit';
  hint: string;
}

export interface DilemmaChoice {
  text: string;
  isBest: boolean;
  scoreChange: {
    tolerance: number;
    harmony: number;
    xp: number;
  };
  feedback: string;
  nilaiKarakter: string;
}

export interface DilemmaScenario {
  id: string;
  title: string;
  context: string;
  situation: string;
  character: string;
  choices: DilemmaChoice[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requiredXp?: number;
  type: 'quiz' | 'adventure' | 'dilemma' | 'atlas' | 'general';
}

export interface StudentRecord {
  id: string;
  name: string;
  studentClass: string;
  schoolName: string;
  tokenUsed: string;
  joinedAt: string;
  xp: number;
  level: number;
  highestQuizScore: number;
  unlockedBadgesCount: number;
}

export interface AccessToken {
  id: string;
  code: string; // e.g. "IPS7-MERDEKA"
  className: string; // e.g. "Kelas 7-A"
  schoolName: string; // e.g. "SMP Negeri 1"
  teacherName: string; // e.g. "Guru IPS"
  maxUses?: number; // optional limit
  usedCount: number;
  createdAt: string;
  isActive: boolean;
  notes?: string;
}

export interface StudentSession {
  tokenCode: string;
  studentName: string;
  studentClass: string;
  schoolName: string;
  loginTime: string;
}

export interface PlayerStats {
  name: string;
  schoolName: string;
  studentClass?: string;
  activeTokenCode?: string;
  avatar: string;
  xp: number;
  level: number;
  toleranceScore: number;
  completedRegions: RegionId[];
  completedDilemmas: string[];
  highestQuizScore: number;
  quizzesPlayed: number;
  perfectQuizzes: number;
  matchingBestTime: number;
  unlockedBadgeIds: string[];
}

