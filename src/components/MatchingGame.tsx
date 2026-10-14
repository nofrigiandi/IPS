import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  Flame, 
  Timer, 
  HelpCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PairDefinition {
  id: string;
  item: string;
  origin: string;
  category: string;
  funFact: string;
  icon: string;
}

const ALL_PAIRS: PairDefinition[] = [
  {
    id: 'gadang',
    item: 'Rumah Gadang',
    origin: 'Sumatera Barat',
    category: 'Rumah Adat',
    funFact: 'Atap panggung melengkung runcing seperti tanduk kerbau dirancang tahan goncangan gempa.',
    icon: '🏠',
  },
  {
    id: 'sasando',
    item: 'Alat Musik Sasando',
    origin: 'Pulau Rote (NTT)',
    category: 'Alat Musik',
    funFact: 'Ruang resonansi bunyi terbuat dari anyaman daun lontar berbentuk kipas setengah lingkaran.',
    icon: '🎵',
  },
  {
    id: 'angklung',
    item: 'Alat Musik Angklung',
    origin: 'Jawa Barat (Sunda)',
    category: 'Alat Musik',
    funFact: 'Alat musik bambu goyang warisan UNESCO yang mengajarkan harmoni kerja sama tim.',
    icon: '🎋',
  },
  {
    id: 'tongkonan',
    item: 'Rumah Tongkonan',
    origin: 'Tana Toraja (Sulsel)',
    category: 'Rumah Adat',
    funFact: 'Atapnya melengkung seperti perahu terbalik dengan tiang berhias susunan tanduk kerbau.',
    icon: '🛶',
  },
  {
    id: 'honai',
    item: 'Rumah Honai',
    origin: 'Papua (Suku Dani)',
    category: 'Rumah Adat',
    funFact: 'Dinding kayu melingkar dan atap jerami tanpa jendela untuk menahan dingin pegunungan.',
    icon: '🛖',
  },
  {
    id: 'rencong',
    item: 'Senjata Rencong',
    origin: 'Aceh',
    category: 'Senjata Tradisional',
    funFact: 'Gagang berukir melengkung menyerupai tulisan aksara Arab lambang basmalah.',
    icon: '🗡️',
  },
  {
    id: 'mandau',
    item: 'Senjata Mandau',
    origin: 'Kalimantan (Dayak)',
    category: 'Senjata Tradisional',
    funFact: 'Bilah pedang bertatah ukiran kuningan khas rimba dengan hulu berhias bulu burung enggang.',
    icon: '⚔️',
  },
  {
    id: 'saman',
    item: 'Tari Saman',
    origin: 'Gayo (Aceh)',
    category: 'Tarian Tradisional',
    funFact: 'Tarian seribu tangan bersimpuh rapat dengan kekompakan tepuk dada bertempo cepat.',
    icon: '💃',
  },
  {
    id: 'coto',
    item: 'Coto Makassar',
    origin: 'Sulawesi Selatan',
    category: 'Kuliner Khas',
    funFact: 'Sup daging berkuah kacang tanah sangrai giling dan rempah wangi disajikan dengan ketupat.',
    icon: '🍲',
  },
  {
    id: 'candi-bentar',
    item: 'Gapura Candi Bentar',
    origin: 'Bali',
    category: 'Rumah/Arsitektur',
    funFact: 'Pintu gerbang terbelah simetris melambangkan keseimbangan kekuatan Rwa Bhineda di alam semesta.',
    icon: '⛩️',
  },
];

interface CardState {
  cardId: string;
  pairId: string;
  text: string;
  type: 'item' | 'origin';
  icon: string;
  category: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MatchingGameProps {
  onAddXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ onAddXp, onUnlockBadge }) => {
  const [difficulty, setDifficulty] = useState<4 | 6 | 8>(6);
  const [cards, setCards] = useState<CardState[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardState[]>([]);
  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);
  const [lastMatchedFact, setLastMatchedFact] = useState<PairDefinition | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Initialize Cards
  const startNewGame = () => {
    sound.playClick();
    const shuffledPairs = [...ALL_PAIRS].sort(() => 0.5 - Math.random()).slice(0, difficulty);
    
    const cardDeck: CardState[] = [];
    shuffledPairs.forEach((pair) => {
      // Item Card
      cardDeck.push({
        cardId: `${pair.id}-item`,
        pairId: pair.id,
        text: pair.item,
        type: 'item',
        icon: pair.icon,
        category: pair.category,
        isFlipped: false,
        isMatched: false,
      });
      // Origin Card
      cardDeck.push({
        cardId: `${pair.id}-origin`,
        pairId: pair.id,
        text: pair.origin,
        type: 'origin',
        icon: '📍',
        category: pair.category,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    setCards(cardDeck.sort(() => 0.5 - Math.random()));
    setSelectedCards([]);
    setMoves(0);
    setStreak(0);
    setMatchesFound(0);
    setLastMatchedFact(null);
    setIsCompleted(false);
    setTimerSeconds(0);
    setTimerActive(true);
  };

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && !isCompleted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, isCompleted]);

  // Handle Card Click
  const handleCardClick = (card: CardState) => {
    if (card.isFlipped || card.isMatched || selectedCards.length === 2) return;

    sound.playCardFlip();

    const updatedCards = cards.map((c) =>
      c.cardId === card.cardId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newSelected = [...selectedCards, { ...card, isFlipped: true }];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newSelected;

      // Check Match
      if (first.pairId === second.pairId && first.type !== second.type) {
        // MATCH!
        sound.playCorrect();
        setStreak((prev) => prev + 1);
        const newMatches = matchesFound + 1;
        setMatchesFound(newMatches);

        // Find fact
        const foundDef = ALL_PAIRS.find((p) => p.id === first.pairId);
        if (foundDef) setLastMatchedFact(foundDef);

        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.pairId === first.pairId ? { ...c, isMatched: true } : c
            )
          );
          setSelectedCards([]);

          // Check if game complete
          if (newMatches === difficulty) {
            handleVictory();
          }
        }, 500);
      } else {
        // MISMATCH
        sound.playWrong();
        setStreak(0);
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.cardId === first.cardId || c.cardId === second.cardId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const handleVictory = () => {
    setIsCompleted(true);
    setTimerActive(false);
    sound.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    // XP calculation: Base XP + Streak Bonus + Time bonus
    const baseScore = difficulty * 25;
    const timeBonus = Math.max(10, 80 - timerSeconds);
    const totalXp = baseScore + timeBonus;

    onAddXp(totalXp, `Menyelesaikan Pasangan Budaya level ${difficulty} pasang`);
    onUnlockBadge('badge-matching-master');
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Game Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Mini-Game 1
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Daya Ingat & Asosiasi Daerah</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Cocokkan Pasangan Budaya
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Buka kartu dan pasangkan nama warisan budaya (rumah adat, alat musik, senjata, tarian) dengan daerah asalnya di Indonesia!
          </p>
        </div>

        {/* Difficulty Controls & Reset */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex items-center gap-1">
            <button
              onClick={() => setDifficulty(4)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                difficulty === 4
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mudah (4)
            </button>
            <button
              onClick={() => setDifficulty(6)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                difficulty === 6
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sedang (6)
            </button>
            <button
              onClick={() => setDifficulty(8)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                difficulty === 8
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pakar (8)
            </button>
          </div>

          <button
            onClick={startNewGame}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            title="Mulai Ulang"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Acak Kartu</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-medium">Waktu</div>
            <div className="text-lg font-bold font-mono text-white">{formatTime(timerSeconds)}</div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-medium">Pasangan Cocok</div>
            <div className="text-lg font-bold text-white">
              {matchesFound} / {difficulty}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-medium">Langkah</div>
            <div className="text-lg font-bold text-white">{moves}</div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-medium">Kombo Streak</div>
            <div className="text-lg font-bold text-amber-400">x{streak}</div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`grid gap-3 sm:gap-4 mb-6 ${
          difficulty === 4
            ? 'grid-cols-2 sm:grid-cols-4'
            : difficulty === 6
            ? 'grid-cols-3 sm:grid-cols-4'
            : 'grid-cols-4 sm:grid-cols-4 md:grid-cols-4'
        }`}
      >
        {cards.map((card) => {
          const isSelected = selectedCards.some((sc) => sc.cardId === card.cardId);
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <div
              key={card.cardId}
              onClick={() => handleCardClick(card)}
              className={`relative aspect-[4/3] rounded-2xl cursor-pointer select-none transition-all duration-300 transform perspective-1000 ${
                card.isMatched
                  ? 'opacity-85 scale-[0.98]'
                  : 'hover:scale-[1.02] active:scale-[0.97]'
              }`}
            >
              <div
                className={`w-full h-full rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300 border ${
                  card.isMatched
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-lg shadow-emerald-950/20'
                    : isRevealed
                    ? card.type === 'item'
                      ? 'bg-gradient-to-br from-amber-900/60 to-slate-900 border-amber-500/60 text-amber-100 shadow-md shadow-amber-500/10'
                      : 'bg-gradient-to-br from-cyan-900/60 to-slate-900 border-cyan-500/60 text-cyan-100 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700/80 shadow-md hover:border-slate-600'
                }`}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center justify-center gap-1.5 animate-fadeIn">
                    <span className="text-3xl" role="img" aria-label="card icon">
                      {card.icon}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {card.type === 'item' ? card.category : 'Asal Daerah'}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-slate-100 leading-snug line-clamp-2">
                      {card.text}
                    </span>
                    {card.isMatched && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Cocok
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 text-lg font-bold border border-slate-600/50">
                      🇮🇩
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Buka Kartu
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Fact Pop-up / Toast when Matched */}
      {lastMatchedFact && !isCompleted && (
        <div className="bg-gradient-to-r from-slate-800 to-slate-850 border border-amber-500/30 rounded-2xl p-4 mb-6 shadow-xl flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
            {lastMatchedFact.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-amber-400">
                Tahukah Kamu?
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-300 font-semibold">
                {lastMatchedFact.item} ({lastMatchedFact.origin})
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lastMatchedFact.funFact}
            </p>
          </div>
        </div>
      )}

      {/* Game Completed Victory Modal */}
      {isCompleted && (
        <div className="bg-gradient-to-br from-slate-800 via-slate-850 to-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-center shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 text-3xl mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Hebat! Semua Pasangan Ditemukan!
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
            Kamu berhasil memasangkan seluruh artefak budaya Nusantara dengan daerah asalnya dalam waktu{' '}
            <span className="font-bold text-amber-400">{formatTime(timerSeconds)}</span> dan{' '}
            <span className="font-bold text-emerald-400">{moves} langkah</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startNewGame}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Main Lagi
            </button>
            <button
              onClick={() => {
                if (difficulty < 8) {
                  setDifficulty(difficulty === 4 ? 6 : 8);
                } else {
                  startNewGame();
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors flex items-center gap-2"
            >
              <span>Level Selanjutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
