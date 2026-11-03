'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Region } from '@/lib/types';
import { MapPin, Users, FolderGit2, Compass, ChevronRight, Sparkles } from 'lucide-react';

interface UzbekistanMapProps {
  regions: Region[];
  selectedRegionId?: string;
  onSelectRegion?: (regionId: string) => void;
  showDetailsCard?: boolean;
}

// Stylized geographical polygons mapped in a 1000x600 viewBox representing Uzbekistan's shape accurately
const REGION_PATHS: Record<string, string> = {
  'qoraqalpogiston': 'M 40,80 L 290,70 L 320,170 L 260,250 L 170,300 L 90,260 L 30,190 Z',
  'xorazm': 'M 240,240 L 285,225 L 305,270 L 275,305 L 235,275 Z',
  'navoiy': 'M 290,70 L 510,90 L 550,190 L 490,280 L 420,290 L 340,210 L 320,170 Z',
  'buxoro': 'M 340,210 L 420,290 L 460,340 L 400,430 L 320,380 L 300,320 Z',
  'samarqand': 'M 460,340 L 560,330 L 580,410 L 510,430 L 480,410 Z',
  'qashqadaryo': 'M 400,430 L 510,430 L 560,450 L 520,530 L 440,510 Z',
  'surxondaryo': 'M 520,530 L 570,450 L 630,470 L 610,580 L 550,570 Z',
  'jizzax': 'M 560,270 L 640,270 L 630,360 L 560,350 Z',
  'sirdaryo': 'M 640,270 L 700,260 L 690,340 L 630,340 Z',
  'toshkent-vil': 'M 680,180 L 780,170 L 810,250 L 710,290 L 680,240 Z',
  'toshkent-sh': 'M 720,220 L 745,215 L 750,235 L 725,240 Z',
  'namangan': 'M 780,170 L 850,180 L 840,230 L 790,225 Z',
  'fargona': 'M 790,255 L 870,250 L 880,310 L 800,320 Z',
  'andijon': 'M 850,210 L 920,220 L 910,280 L 860,265 Z',
};

export default function UzbekistanMap({
  regions,
  selectedRegionId: externalSelectedId,
  onSelectRegion,
  showDetailsCard = true,
}: UzbekistanMapProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string>('samarqand');
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  const activeId = externalSelectedId || internalSelectedId;
  const activeRegion = regions.find((r) => r.id === activeId) || regions[2] || regions[0];

  const handleRegionClick = (id: string) => {
    setInternalSelectedId(id);
    if (onSelectRegion) {
      onSelectRegion(id);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-2">
            <Compass className="w-3.5 h-3.5" />
            O‘zbekiston yoshlarining hududiy xaritasi
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            14 ta hudud — Yagona ekotizim
          </h3>
          <p className="text-sm text-slate-400">
            Viloyatingizni tanlang va mahalliy hamjamiyatlar, tadbirlar hamda yoshlar loyihalarini kashf qiling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-3 h-3 rounded-sm bg-indigo-600 inline-block" /> Faol
            <span className="w-3 h-3 rounded-sm bg-violet-500 inline-block ml-2" /> Tanlangan
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Interactive SVG Map */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center relative">
          <div className="w-full aspect-[16/9] max-h-[460px] relative">
            <svg
              viewBox="0 0 960 620"
              className="w-full h-full filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] select-none"
            >
              <defs>
                <linearGradient id="selectedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="defaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="hoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#312e81" />
                  <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting ambient network lines */}
              <g stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" strokeDasharray="3 3">
                <line x1="730" y1="220" x2="530" y2="390" />
                <line x1="530" y1="390" x2="410" y2="350" />
                <line x1="410" y1="350" x2="260" y2="240" />
                <line x1="260" y1="240" x2="170" y2="150" />
                <line x1="730" y1="220" x2="840" y2="290" />
                <line x1="730" y1="220" x2="880" y2="245" />
                <line x1="530" y1="390" x2="500" y2="460" />
                <line x1="500" y1="460" x2="590" y2="520" />
              </g>

              {/* Region Polygons */}
              {regions.map((region) => {
                const path = REGION_PATHS[region.id];
                if (!path) return null;
                const isSelected = region.id === activeId;
                const isHovered = region.id === hoveredRegionId;

                return (
                  <g
                    key={region.id}
                    onClick={() => handleRegionClick(region.id)}
                    onMouseEnter={() => setHoveredRegionId(region.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    <path
                      d={path}
                      fill={
                        isSelected
                          ? 'url(#selectedGrad)'
                          : isHovered
                          ? 'url(#hoverGrad)'
                          : 'url(#defaultGrad)'
                      }
                      stroke={isSelected ? '#c084fc' : isHovered ? '#818cf8' : '#334155'}
                      strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1'}
                      className="transition-all duration-200"
                      filter={isSelected ? 'url(#glow)' : undefined}
                    />

                    {/* Regional Node Point */}
                    <circle
                      cx={region.centerCoords.x}
                      cy={region.centerCoords.y}
                      r={isSelected ? 6 : isHovered ? 5 : 3.5}
                      fill={isSelected ? '#ffffff' : '#818cf8'}
                      stroke={isSelected ? '#7c3aed' : '#1e1b4b'}
                      strokeWidth={2}
                    />

                    {/* Region Label */}
                    <text
                      x={region.centerCoords.x}
                      y={region.centerCoords.y - 10}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : isHovered ? '#e2e8f0' : '#94a3b8'}
                      fontSize={isSelected ? '12px' : '10px'}
                      fontWeight={isSelected ? 'bold' : '500'}
                      className="pointer-events-none drop-shadow-md"
                    >
                      {region.name.replace(' viloyati', '').replace(' Respublikasi', '')}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick selection pills */}
          <div className="flex flex-wrap gap-1.5 mt-4 justify-center max-w-2xl">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => handleRegionClick(r.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  r.id === activeId
                    ? 'bg-indigo-600 border-indigo-400 text-white font-medium shadow-md'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {r.name.replace(' viloyati', '').replace(' Respublikasi', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Region Detail Card */}
        {showDetailsCard && activeRegion && (
          <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700 rounded-2xl p-5 md:p-6 backdrop-blur-md shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {activeRegion.code} kodi
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  Markaz: {activeRegion.center}
                </span>
              </div>

              <h4 className="text-xl font-bold text-white mb-1">
                {activeRegion.name}
              </h4>
              <p className="text-xs text-slate-400 mb-5">
                Maydoni: {activeRegion.areaKm2.toLocaleString()} km²
              </p>

              {/* Real statistics indicators */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-indigo-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-medium">Yoshlar soni</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {activeRegion.youthCount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Rasmiy ro‘yxat</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-violet-400 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-medium">Hamjamiyatlar</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {activeRegion.activeCommunities} ta
                  </div>
                  <div className="text-[10px] text-slate-400">Faol guruhlar</div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 mb-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <FolderGit2 className="w-4 h-4 text-emerald-400" />
                    Faol Yoshlar Loyihalari
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {activeRegion.activeProjects} ta
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, activeRegion.activeProjects * 3)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/60">
              <Link
                href={`/hududlar?region=${activeRegion.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
              >
                Ushbu hudud sahifasiga o‘tish
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/hamjamiyatlar?region=${activeRegion.id}`}
                className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium text-center transition-all"
              >
                Hududiy hamjamiyatlarni ko‘rish
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
