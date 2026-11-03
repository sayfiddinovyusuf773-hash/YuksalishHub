'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Languages,
  Users,
  Calendar,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Globe2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { LanguageGroup } from '@/lib/types';

export default function TilOrganishPage() {
  const [groups, setGroups] = useState<LanguageGroup[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingGroupId, setLoadingGroupId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const loadData = () => {
    fetch('/api/languages')
      .then((res) => res.json())
      .then((data) => {
        setGroups(data.groups || []);
        setCurrentUserId(data.userId || null);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleJoin = async (groupId: string) => {
    setLoadingGroupId(groupId);
    try {
      const res = await fetch('/api/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      // error handling
    } finally {
      setLoadingGroupId(null);
    }
  };

  const filteredGroups = groups.filter((g) => {
    if (selectedLanguage === 'all') return true;
    return g.language === selectedLanguage;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 border border-violet-500/20 rounded-3xl p-6 sm:p-10 mb-10 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
            <Languages className="w-3.5 h-3.5" />
            Xorijiy Tillar va Speaking Klublar
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Dunyo bilan o‘z tilida so‘zlash
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Ingliz, arab va rus tillarida nutqingizni charxlang. Jonli so‘zlashuv klublari, oylik lug‘at marafonlari va hamfikr do‘stlar bilan muloqot amaliyoti.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/hamjamiyatlar/com-2"
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Global Speakers English Club
            </Link>
          </div>
        </div>
      </div>

      {/* Language filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'all', label: 'Barcha tillar' },
          { id: 'Ingliz tili', label: '🇬🇧 Ingliz tili' },
          { id: 'Arab tili', label: '🇸🇦 Arab tili' },
          { id: 'Rus tili', label: '🇷🇺 Rus tili' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedLanguage(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedLanguage === tab.id
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Speaking Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredGroups.map((grp) => {
          const isMember = currentUserId ? grp.members.includes(currentUserId) : false;
          const isLoading = loadingGroupId === grp.id;

          return (
            <div
              key={grp.id}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">
                    {grp.language}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {grp.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {grp.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    <span>Jadval: {grp.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Yetakchi: {grp.mentorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>A’zolar soni: {grp.memberCount} nafar</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => handleToggleJoin(grp.id)}
                  disabled={isLoading}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isMember
                      ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/25'
                  }`}
                >
                  {isLoading
                    ? 'Yuklanmoqda...'
                    : isMember
                    ? 'Guruhdan chiqish'
                    : 'Guruhga a’zo bo‘lish (+20 ball)'}
                </button>

                {isMember && (
                  <a
                    href={grp.meetingLinkOrPlace}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5"
                  >
                    Jonli efir havolasiga o‘tish
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 30-Day Vocabulary Marathon Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Oylik Marafon
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            30 Kunlik Yangi Lug‘at (500 ta so‘z)
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Har kuni o‘rganilayotgan xorijiy tilda 15-20 tadan yangi so‘z yodlang, so‘zlarni nutqda qo‘llang va marafon yakunida 200 XP ballga ega bo‘ling.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shrink-0 shadow-lg shadow-indigo-600/20"
        >
          Marafon holatini tekshirish →
        </Link>
      </div>
    </div>
  );
}
