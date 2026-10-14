import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Home, 
  Music, 
  Sword, 
  Sparkles, 
  Shirt, 
  Utensils, 
  Landmark, 
  Users,
  Compass,
  Check
} from 'lucide-react';
import { CULTURAL_ITEMS, RELIGIONS_DATA, RACES_DATA, REGIONS } from '../data/culturalData';
import { CulturalCategory, RegionId } from '../types/game';
import { sound } from '../utils/audio';

interface CulturalAtlasProps {
  onUnlockBadge: (badgeId: string) => void;
  onAddXp: (amount: number, reason: string) => void;
}

export const CulturalAtlas: React.FC<CulturalAtlasProps> = ({ onUnlockBadge, onAddXp }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CulturalCategory | 'all' | 'agama' | 'ras'>('all');
  const [selectedRegion, setSelectedRegion] = useState<RegionId | 'all'>('all');
  const [activeItemModal, setActiveItemModal] = useState<any | null>(null);

  // Filter items
  const filteredItems = CULTURAL_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesRegion =
      selectedRegion === 'all' || item.regionId === selectedRegion;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesRegion && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'rumah-adat', label: 'Rumah Adat' },
    { id: 'alat-musik', label: 'Alat Musik' },
    { id: 'senjata-tradisional', label: 'Senjata' },
    { id: 'tarian-daerah', label: 'Tarian' },
    { id: 'pakaian-adat', label: 'Pakaian Adat' },
    { id: 'makanan-khas', label: 'Kuliner Khas' },
    { id: 'agama', label: '6 Agama Resmi' },
    { id: 'ras', label: 'Keberagaman Ras' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Atlas & Ensiklopedia
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Khazanah Budaya & SARA Indonesia</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Atlas Keberagaman Nusantara
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Jelajahi ensiklopedia lengkap rumah adat, senjata, alat musik, kuliner, tarian, 6 agama resmi, serta keberagaman ras di Indonesia.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari adat, alat musik, senjata..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3 mb-6">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Island Filters (only relevant if not in agama/ras tabs) */}
        {selectedCategory !== 'agama' && selectedCategory !== 'ras' && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs text-slate-400">
            <span className="font-medium mr-1 text-[11px] uppercase tracking-wider text-slate-500">
              Pulau:
            </span>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedRegion('all');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                selectedRegion === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Wilayah
            </button>
            {REGIONS.map((reg) => (
              <button
                key={reg.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedRegion(reg.id);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  selectedRegion === reg.id
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {reg.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View 1: 6 Agama Resmi di Indonesia */}
      {selectedCategory === 'agama' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {RELIGIONS_DATA.map((rel) => (
            <div
              key={rel.name}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
                <h3 className="font-display text-lg font-bold text-amber-400">
                  Agama {rel.name}
                </h3>
                <span className="text-[10px] font-mono bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded">
                  Diakui Resmi RI
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {rel.summary}
              </p>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">Kitab Suci:</span>
                  <span className="text-white font-semibold">{rel.holyBook}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">Tempat Ibadah:</span>
                  <span className="text-emerald-300 font-semibold">{rel.placeOfWorship}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">Salam Khas:</span>
                  <span className="text-amber-200 italic font-medium">{rel.greeting}</span>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">Hari Besar:</span>
                  <div className="flex flex-wrap gap-1">
                    {rel.holyDays.map((day) => (
                      <span
                        key={day}
                        className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded text-[10px] text-slate-300 font-medium"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Keberagaman Ras di Indonesia */}
      {selectedCategory === 'ras' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {RACES_DATA.map((r) => (
            <div
              key={r.race}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
                <h3 className="font-display text-lg font-bold text-emerald-400">
                  {r.race}
                </h3>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                  Kelompok Ras
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-slate-400 font-semibold mb-0.5">Sebaran Wilayah di Indonesia:</div>
                  <p className="text-white font-medium">{r.distribution}</p>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold mb-0.5">Ciri Fisik Utama:</div>
                  <p className="text-slate-300 leading-relaxed">{r.characteristics}</p>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold mb-0.5">Arti Penting dalam Keberagaman:</div>
                  <p className="text-amber-200 leading-relaxed">{r.significance}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 3: Artifacts Grid (Rumah Adat, Senjata, Musik, Kuliner, Tarian) */}
      {selectedCategory !== 'agama' && selectedCategory !== 'ras' && (
        <>
          {filteredItems.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-12 text-center">
              <Search className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <div className="text-base font-bold text-slate-300 mb-1">
                Tidak ada artefak yang cocok
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Meta */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">
                        {item.category.replace('-', ' ')}
                      </span>
                      <span className="text-slate-400 text-[11px] font-medium">
                        {item.regionName}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-display text-base font-bold text-white mb-1">
                      {item.name}
                    </h3>

                    {/* Origin */}
                    <div className="text-xs font-semibold text-emerald-400 mb-2">
                      📍 {item.origin}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Fun Fact footer */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750 text-[11px]">
                    <span className="font-bold text-amber-300">Tahukah Kamu? </span>
                    <span className="text-slate-300 leading-relaxed">{item.funFact}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
