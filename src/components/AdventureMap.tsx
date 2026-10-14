import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  MapPin, 
  Compass, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  X, 
  BookOpen, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import { REGIONS, CULTURAL_ITEMS } from '../data/culturalData';
import { RegionId, RegionInfo, CulturalItem } from '../types/game';
import { sound } from '../utils/audio';

interface AdventureMapProps {
  completedRegions: RegionId[];
  onCompleteRegion: (regionId: RegionId) => void;
  onAddXp: (amount: number, reason: string) => void;
  onNavigateToMiniGame: (gameId: 'matching' | 'mystery' | 'quiz') => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  completedRegions,
  onCompleteRegion,
  onAddXp,
  onNavigateToMiniGame,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'challenge'>('info');
  const [challengeStep, setChallengeStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [challengeCorrect, setChallengeCorrect] = useState<boolean | null>(null);
  const [islandDone, setIslandDone] = useState(false);

  const handleSelectRegion = (region: RegionInfo) => {
    sound.playClick();
    setSelectedRegion(region);
    setActiveTab('info');
    setChallengeStep(0);
    setUserAnswer(null);
    setChallengeCorrect(null);
    setIslandDone(completedRegions.includes(region.id));
  };

  // Get items belonging to selected region
  const regionItems: CulturalItem[] = selectedRegion
    ? CULTURAL_ITEMS.filter((item) => item.regionId === selectedRegion.id)
    : [];

  // Island quick challenges
  const getIslandChallenge = (regionId: RegionId) => {
    switch (regionId) {
      case 'sumatera':
        return {
          question: 'Apa nama rumah adat di Sumatera Barat dengan atap gonjong menyerupai tanduk kerbau?',
          options: ['Rumah Gadang', 'Rumah Joglo', 'Rumah Baileo', 'Rumah Tongkonan'],
          correct: 'Rumah Gadang',
          funFact: 'Rumah Gadang tahan gempa karena menggunakan sistem pasak kayu elastis!',
        };
      case 'jawa':
        return {
          question: 'Alat musik tradisional Jawa Barat yang terbuat dari bambu dan digoyang adalah...',
          options: ['Gamelan', 'Kolintang', 'Angklung', 'Sasando'],
          correct: 'Angklung',
          funFact: 'Angklung diakui oleh UNESCO sebagai Warisan Budaya Tak Benda Dunia sejak 2010!',
        };
      case 'kalimantan':
        return {
          question: 'Rumah panggung suku Dayak yang dihuni ratusan orang dalam satu atap dinamakan...',
          options: ['Rumah Lamin / Betang', 'Rumah Honai', 'Rumah Gadang', 'Rumah Musalaki'],
          correct: 'Rumah Lamin / Betang',
          funFact: 'Rumah Betang melambangkan musyawarah mufakat dan kesetaraan derajat sesama warga!',
        };
      case 'sulawesi':
        return {
          question: 'Rumah adat suku Toraja yang memiliki atap menyerupai perahu terbalik adalah...',
          options: ['Tongkonan', 'Kasepuhan', 'Souraja', 'Baileo'],
          correct: 'Tongkonan',
          funFact: 'Deretan tanduk kerbau di tiang depan Tongkonan melambangkan status kehormatan keluarga.',
        };
      case 'bali-nusa':
        return {
          question: 'Alat musik petik dari Pulau Rote NTT yang resonatornya dari anyaman daun lontar adalah...',
          options: ['Sasando', 'Tifa', 'Saluang', 'Sampe'],
          correct: 'Sasando',
          funFact: 'Sasando adalah salah satu instrumen musik petik terunik di dunia!',
        };
      case 'maluku-papua':
        return {
          question: 'Rumah adat suku Dani di Papua yang berbentuk silinder melingkar beratap jerami adalah...',
          options: ['Honai', 'Joglo', 'Gadang', 'Lamin'],
          correct: 'Honai',
          funFact: 'Honai dirancang tanpa jendela untuk menahan hembusan angin dingin pegunungan!',
        };
      default:
        return {
          question: 'Bhinneka Tunggal Ika tertulis dalam kitab...',
          options: ['Sutasoma', 'Negarakertagama', 'Arjuna Wiwaha', 'Baratayuda'],
          correct: 'Sutasoma',
          funFact: 'Karya Mpu Tantular pada masa kejayaan Kerajaan Majapahit.',
        };
    }
  };

  const handleAnswerChallenge = (option: string, correct: string) => {
    if (userAnswer) return;
    setUserAnswer(option);
    const isRight = option === correct;
    setChallengeCorrect(isRight);

    if (isRight) {
      sound.playCorrect();
      setIslandDone(true);
      if (selectedRegion && !completedRegions.includes(selectedRegion.id)) {
        onCompleteRegion(selectedRegion.id);
        onAddXp(80, `Menjelajah & Menyelesaikan Misi Pulau ${selectedRegion.name}`);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Peta Petualangan Nusantara
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Jelajah 6 Wilayah Budaya</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Peta Harmoni Kepulauan Indonesia
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Klik salah satu pulau di peta untuk mempelajari kebudayaan khas, suku bangsa, dan menyelesaikan tantangan penjelajah!
          </p>
        </div>

        {/* Region Progress Indicator */}
        <div className="bg-slate-800/80 border border-slate-700/60 px-4 py-2 rounded-xl flex items-center gap-3">
          <Compass className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Pulau Dijelajahi</div>
            <div className="text-sm font-bold text-white font-mono">
              {completedRegions.length} / {REGIONS.length} Wilayah
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Board */}
      <div className="relative w-full aspect-[2/1] min-h-[300px] max-h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/60 rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-6 overflow-hidden mb-8 flex flex-col justify-between">
        {/* Ocean Background Grid Lines & Compass Rose */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-4 right-4 text-slate-700/50 flex flex-col items-center pointer-events-none select-none">
          <div className="text-[10px] font-bold font-mono">U</div>
          <div className="text-xl">▲</div>
          <div className="text-[9px] font-mono">INDONESIA</div>
        </div>

        {/* Watermark Label */}
        <div className="relative z-10">
          <span className="text-[11px] font-bold text-amber-400/80 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
            Peta Interaktif Sabang Sampai Merauke
          </span>
        </div>

        {/* Island Nodes Positioned over map space */}
        <div className="relative w-full h-full my-auto">
          {REGIONS.map((region) => {
            const isCompleted = completedRegions.includes(region.id);
            const isSelected = selectedRegion?.id === region.id;

            return (
              <div
                key={region.id}
                style={{
                  left: `${region.coordinates.x}%`,
                  top: `${region.coordinates.y}%`,
                }}
                onClick={() => handleSelectRegion(region)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                {/* Ping animation if not completed */}
                {!isCompleted && (
                  <span className="absolute -inset-2 rounded-full bg-amber-400/30 animate-ping opacity-60 pointer-events-none" />
                )}

                {/* Node Button */}
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border shadow-xl transition-all duration-300 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-white scale-110 shadow-amber-500/30'
                      : isCompleted
                      ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 hover:scale-105'
                      : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:border-amber-400 hover:scale-105'
                  }`}
                >
                  <MapPin
                    className={`w-4 h-4 shrink-0 ${
                      isSelected
                        ? 'text-slate-950'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                      <span>{region.name}</span>
                      {isCompleted && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Archipelago Bottom Banner Hint */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>🌟 Tip: Selesaikan kuis tantangan di tiap pulau untuk mengoleksi lencana penjelajah!</span>
          <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">Koordinat 6°LU–11°LS & 95°BT–141°BT</span>
        </div>
      </div>

      {/* Selected Region Detailed Dossier / Modal */}
      {selectedRegion && (
        <div className="bg-slate-850 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn">
          {/* Top Bar of Region Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-750 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Wilayah Adat & Budaya
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">{selectedRegion.tagline}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                <span>Pulau {selectedRegion.name}</span>
                {completedRegions.includes(selectedRegion.id) && (
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terjelajahi
                  </span>
                )}
              </h2>
            </div>

            {/* Mode Switcher Tabs for Island Dossier */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-750">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'info'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Informasi & Suku
              </button>
              <button
                onClick={() => setActiveTab('challenge')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'challenge'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tantangan Kilat (+80 XP)
              </button>
            </div>
          </div>

          {activeTab === 'info' ? (
            <div className="space-y-6">
              {/* Description */}
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedRegion.description}
              </p>

              {/* Major Tribes in Region */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-750">
                <div className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Suku Bangsa Utama di Wilayah Ini:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedRegion.majorTribes.map((tribe) => (
                    <span
                      key={tribe}
                      className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1 rounded-lg text-xs font-medium"
                    >
                      {tribe}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cultural Highlights Grid */}
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Warisan Budaya Unggulan:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {regionItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-900/50 hover:bg-slate-900 border border-slate-750 hover:border-slate-650 p-4 rounded-xl transition-all"
                    >
                      <div className="text-xs font-bold text-amber-400 uppercase mb-1">
                        {item.category.replace('-', ' ')}
                      </div>
                      <div className="text-sm font-bold text-white mb-1">{item.name}</div>
                      <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Island Quick Challenge */
            <div className="space-y-5">
              {(() => {
                const challenge = getIslandChallenge(selectedRegion.id);
                return (
                  <div className="bg-slate-900/70 border border-slate-750 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-amber-400 uppercase">
                        Tantangan Penjelajah Pulau {selectedRegion.name}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-5 leading-snug">
                      {challenge.question}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {challenge.options.map((opt) => {
                        const isSelected = userAnswer === opt;
                        const isRight = opt === challenge.correct;

                        let style = 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200';
                        if (userAnswer) {
                          if (isRight) {
                            style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                          } else if (isSelected && !isRight) {
                            style = 'bg-rose-950/80 border-rose-500 text-rose-200';
                          } else {
                            style = 'bg-slate-900/40 border-slate-800 text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={userAnswer !== null}
                            onClick={() => handleAnswerChallenge(opt, challenge.correct)}
                            className={`p-3.5 rounded-xl border font-bold text-xs sm:text-sm text-left transition-all ${style}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {userAnswer && (
                      <div className="p-4 rounded-xl bg-slate-850 border border-slate-700 animate-fadeIn">
                        <div className="flex items-center gap-2 mb-1">
                          {challengeCorrect ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" /> Jawaban Tepat! (+80 XP)
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-rose-400">
                              Jawaban kurang tepat. Kunci: {challenge.correct}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          <span className="font-semibold text-amber-300">Catatan IPS: </span>
                          {challenge.funFact}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
