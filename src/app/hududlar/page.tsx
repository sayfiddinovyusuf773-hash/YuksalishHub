'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import UzbekistanMap from '@/components/map/UzbekistanMap';
import { SEED_REGIONS, SEED_DISTRICTS } from '@/data/seed';
import { db } from '@/lib/db';
import {
  Compass,
  MapPin,
  Users,
  FolderGit2,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Building,
} from 'lucide-react';
import { Region, District, Community, Project, EventItem } from '@/lib/types';

function HududlarContent() {
  const searchParams = useSearchParams();
  const initialRegionParam = searchParams.get('region') || 'samarqand';

  const [selectedRegionId, setSelectedRegionId] = useState<string>(initialRegionParam);
  const [regions, setRegions] = useState<Region[]>(SEED_REGIONS);
  const [districts, setDistricts] = useState<District[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    if (initialRegionParam) {
      setSelectedRegionId(initialRegionParam);
    }
  }, [initialRegionParam]);

  useEffect(() => {
    const regDistricts = SEED_DISTRICTS.filter((d) => d.regionId === selectedRegionId);
    setDistricts(regDistricts);

    // Fetch communities and projects for this region
    fetch(`/api/communities?region=${selectedRegionId}`)
      .then((r) => r.json())
      .then((d) => setCommunities(d.communities || []))
      .catch(() => {});

    fetch(`/api/projects?region=${selectedRegionId}`)
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .catch(() => {});

    fetch(`/api/events?region=${selectedRegionId}`)
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => {});
  }, [selectedRegionId]);

  const activeRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          Respublika Hududiy Tuzilmasi
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          14 ta Hudud — Bir Butun Ekotizim
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Xaritadagi istalgan hududni bosing va uning tumanlari, yoshlar soni, mahalliy tashabbuslari va koordinatorlari bilan tanishing.
        </p>
      </div>

      {/* Map Section */}
      <div className="mb-12">
        <UzbekistanMap
          regions={regions}
          selectedRegionId={selectedRegionId}
          onSelectRegion={(id) => setSelectedRegionId(id)}
          showDetailsCard={true}
        />
      </div>

      {/* Selected Region Detailed Ecosystem */}
      {activeRegion && (
        <div className="space-y-10">
          {/* Region Overview Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeRegion.code}
                </span>
                <span className="text-xs text-slate-400">
                  Markaz: {activeRegion.center} • Maydoni: {activeRegion.areaKm2.toLocaleString()} km²
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeRegion.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Jami ro‘yxatdagi yoshlar soni: {activeRegion.youthCount.toLocaleString()} nafar
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/royxatdan-otish`}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20"
              >
                Ushbu hudud a’zosi bo‘lish
              </Link>
            </div>
          </div>

          {/* Districts and Cities Grid */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-400" />
              Tuman va Shaharlar ({districts.length} ta)
            </h3>

            {districts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 text-center">
                Ushbu hudud bo‘yicha tumanlar ro‘yxati yangilanmoqda.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {districts.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between"
                  >
                    <div className="text-xs font-bold text-white mb-1">{d.name}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-2">
                      <span className="capitalize">{d.type}</span>
                      <span className="text-indigo-400 font-medium">
                        {d.youthCount.toLocaleString()} yosh
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Communities & Projects in this region */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Regional Communities */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-400" />
                  Mahalliy Hamjamiyatlar ({communities.length})
                </h3>
                <Link
                  href={`/hamjamiyatlar?region=${selectedRegionId}`}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Barchasi
                </Link>
              </div>

              {communities.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Ushbu hududda yangi hamjamiyatlar tashkil qilinmoqda.
                </div>
              ) : (
                <div className="space-y-3">
                  {communities.map((c) => (
                    <Link
                      key={c.id}
                      href={`/hamjamiyatlar/${c.id}`}
                      className="block p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                    >
                      <div className="text-xs font-bold text-white mb-0.5">{c.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                        {c.description}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{c.memberCount} a’zo</span>
                        <span className="text-indigo-400 font-semibold">Batafsil →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Regional Projects */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-emerald-400" />
                  Hududiy Loyihalar ({projects.length})
                </h3>
                <Link
                  href={`/loyihalar?region=${selectedRegionId}`}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Barchasi
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Hozircha faol loyiha yo‘q.{' '}
                  <Link href="/loyihalar" className="text-indigo-400 underline">
                    Ilk loyihani boshlang!
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{p.title}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {p.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mb-2">{p.summary}</div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Jarayon: {p.progressPercent}%</span>
                        <Link
                          href="/loyihalar"
                          className="text-indigo-400 hover:underline font-semibold"
                        >
                          Jamoaga qo‘shilish →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HududlarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Hududlar yuklanmoqda...</div>}>
      <HududlarContent />
    </Suspense>
  );
}
