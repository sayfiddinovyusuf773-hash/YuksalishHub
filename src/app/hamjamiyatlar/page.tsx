'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Users,
  Search,
  Filter,
  Plus,
  Compass,
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  Lock,
} from 'lucide-react';
import { Community } from '@/lib/types';
import { SEED_REGIONS, SEED_DIRECTIONS } from '@/data/seed';

function HamjamiyatlarContent() {
  const searchParams = useSearchParams();
  const regionParam = searchParams.get('region') || 'all';
  const directionParam = searchParams.get('direction') || 'all';

  const [communities, setCommunities] = useState<Community[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(regionParam);
  const [selectedDirection, setSelectedDirection] = useState(directionParam);
  const [loading, setLoading] = useState(true);

  // New Community Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDir, setNewDir] = useState('kitobxonlik');
  const [newReg, setNewReg] = useState('toshkent-sh');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadData = () => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setCurrentUserId(d.user?.id || null))
      .catch(() => {});

    let url = `/api/communities?direction=${selectedDirection}&region=${selectedRegion}`;
    if (search) url += `&q=${encodeURIComponent(search)}`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setCommunities(d.communities || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedRegion, selectedDirection, search]);

  // Login Modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);

  const handleQuickLogin = async () => {
    setQuickLoginLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'jasur@ufq.uz', password: 'jasur123' }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUserId(data.user.id);
        setShowLoginModal(false);
        loadData();
      }
    } catch {
    } finally {
      setQuickLoginLoading(false);
    }
  };

  const handleToggleJoin = async (communityId: string) => {
    if (!currentUserId) {
      setShowLoginModal(true);
      return;
    }
    try {
      const res = await fetch('/api/communities/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      // error
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);

    try {
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          directionId: newDir,
          regionId: newReg,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || 'Hamjamiyat yaratishda xatolik');
        setModalLoading(false);
        return;
      }

      setIsModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      loadData();
    } catch {
      setModalError('Server bilan aloqa uzildi');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            Respublika Yoshlar Hamjamiyatlari
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Hamjamiyatlar Markazi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Qiziqishlaringiz bo‘yicha guruhlarga a’zo bo‘ling yoki o‘z hududingizda yangi hamjamiyat tashkil qiling.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUserId) {
              setShowLoginModal(true);
              return;
            }
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi Hamjamiyat Ochish
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hamjamiyat nomi yoki tavsifi bo‘yicha qidiruv..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Direction Filter */}
        <select
          value={selectedDirection}
          onChange={(e) => setSelectedDirection(e.target.value)}
          className="w-full md:w-56 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Barcha yo‘nalishlar</option>
          {SEED_DIRECTIONS.map((dir) => (
            <option key={dir.id} value={dir.id}>
              {dir.title}
            </option>
          ))}
        </select>

        {/* Region Filter */}
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full md:w-56 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Barcha hududlar</option>
          {SEED_REGIONS.map((reg) => (
            <option key={reg.id} value={reg.id}>
              {reg.name}
            </option>
          ))}
        </select>
      </div>

      {/* Communities Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">
          Hamjamiyatlar yuklanmoqda...
        </div>
      ) : communities.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 max-w-lg mx-auto">
          <p className="text-sm text-slate-400 mb-4">
            Ushbu filtr bo‘yicha birorta hamjamiyat topilmadi.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Birinchi bo‘lib hamjamiyat yarating!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((c) => {
            const isMember = currentUserId ? c.members.includes(currentUserId) : false;

            return (
              <div
                key={c.id}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {c.directionId}
                    </span>
                    {c.regionName && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        📍 {c.regionName}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="text-[11px] text-slate-500 mb-4 flex items-center justify-between">
                    <span>Koordinator: {c.coordinatorName}</span>
                    <span className="font-semibold text-slate-300">
                      {c.memberCount} nafar a’zo
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800/80">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/hamjamiyatlar/${c.id}`}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-all"
                    >
                      Munozaralar
                    </Link>
                    <button
                      onClick={() => handleToggleJoin(c.id)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                        isMember
                          ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                      }`}
                    >
                      {isMember ? 'A’zolikdan chiqish' : 'Qo‘shilish (+20)'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Community Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">
              Yangi Yoshlar Hamjamiyati Yaratish
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              O‘z yo‘nalishingiz yoki tumaningiz yoshlarini birlashtiruvchi markazga asos soling
            </p>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateCommunity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hamjamiyat nomi
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="masalan: Samarqand Robototexnika Klubi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Asosiy maqsad va tavsif
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Hamjamiyat nima maqsadda tuzilmoqda? Qanday faoliyatlar o‘tkaziladi?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Yo‘nalish
                  </label>
                  <select
                    value={newDir}
                    onChange={(e) => setNewDir(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    {SEED_DIRECTIONS.map((dir) => (
                      <option key={dir.id} value={dir.id}>
                        {dir.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hudud
                  </label>
                  <select
                    value={newReg}
                    onChange={(e) => setNewReg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    {SEED_REGIONS.map((reg) => (
                      <option key={reg.id} value={reg.id}>
                        {reg.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {modalLoading ? 'Yaratilmoqda...' : 'Hamjamiyatni ochish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Prompt Modal when not signed in */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white mb-2">Tizimga Kirish Talab Qilinadi</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Hamjamiyatlarga a’zo bo‘lish, munozaralarda qatnashish va faoliyat yuritish uchun avval tizimga kiring.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleQuickLogin}
                disabled={quickLoginLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {quickLoginLoading ? 'Kirilmoqda...' : '⚡ 1-bosishda tezkor kirish (Jasur hisobi)'}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/kirish"
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold block transition-colors"
                >
                  Kirish
                </Link>
                <Link
                  href="/royxatdan-otish"
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold block transition-colors"
                >
                  Ro‘yxatdan o‘tish
                </Link>
              </div>

              <button
                onClick={() => setShowLoginModal(false)}
                className="text-xs text-slate-500 hover:text-slate-400 pt-2 block w-full"
              >
                Oynani yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HamjamiyatlarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Yuklanmoqda...</div>}>
      <HamjamiyatlarContent />
    </Suspense>
  );
}
