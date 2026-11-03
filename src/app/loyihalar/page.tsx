'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FolderGit2,
  Search,
  Filter,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  Lock,
} from 'lucide-react';
import { Project, ProjectStatus } from '@/lib/types';
import { SEED_REGIONS, SEED_DIRECTIONS } from '@/data/seed';

function LoyihalarContent() {
  const searchParams = useSearchParams();
  const regionParam = searchParams.get('region') || 'all';

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState(regionParam);
  const [loading, setLoading] = useState(true);

  // Create Project Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('it-innovatsiya');
  const [newRoles, setNewRoles] = useState('Dasturchi, Dizayner, Menejer');
  const [createLoading, setCreateLoading] = useState(false);
  const [createMsg, setCreateMsg] = useState('');

  // Join Team Modal
  const [activeJoinProject, setActiveJoinProject] = useState<Project | null>(null);
  const [selectedRoleToApply, setSelectedRoleToApply] = useState('');
  const [joinMsg, setJoinMsg] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

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

  const loadData = () => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setCurrentUserId(d.user?.id || null))
      .catch(() => {});

    let url = `/api/projects?status=${selectedStatus}&category=${selectedCategory}&region=${selectedRegion}`;
    if (search) url += `&q=${encodeURIComponent(search)}`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setProjects(d.projects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedStatus, selectedCategory, selectedRegion, search]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateMsg('');

    try {
      const rolesArray = newRoles
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          summary: newSummary,
          description: newDesc,
          category: newCategory,
          neededRoles: rolesArray,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCreateMsg('Loyiha muvaffaqiyatli e’lon qilindi! +100 ball berildi 🎉');
        loadData();
        setTimeout(() => {
          setIsCreateModalOpen(false);
          setNewTitle('');
          setNewSummary('');
          setNewDesc('');
          setCreateMsg('');
        }, 1500);
      } else {
        setCreateMsg(data.error || 'Xatolik yuz berdi');
      }
    } catch {
      setCreateMsg('Server bilan aloqa uzildi');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJoinProject || !selectedRoleToApply) return;
    setJoinLoading(true);
    setJoinMsg('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join-team',
          projectId: activeJoinProject.id,
          role: selectedRoleToApply,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setJoinMsg('Tabriklaymiz! Siz jamoaga qo‘shildingiz (+50 ball) ✨');
        loadData();
        setTimeout(() => {
          setActiveJoinProject(null);
          setJoinMsg('');
        }, 1500);
      } else {
        setJoinMsg(data.error || 'Xatolik yuz berdi');
      }
    } catch {
      setJoinMsg('Aloqa xatosi');
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            Yoshlar Loyihalari va Startaplar
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Hamkorlik va Loyihalar Maydoni
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            G‘oyangizni haqiqatga aylantiring yoki mavjud tashabbuslarga o‘z hissangizni qo‘shing.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUserId) {
              setShowLoginModal(true);
              return;
            }
            setIsCreateModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi Loyiha Yaratish (+100 XP)
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Loyiha qidirish..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Barcha holatlar (Status)</option>
          <option value="G‘oya">G‘oya</option>
          <option value="Jamoa shakllanmoqda">Jamoa shakllanmoqda</option>
          <option value="Jarayonda">Jarayonda</option>
          <option value="Yakunlandi">Yakunlandi</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Barcha yo‘nalishlar</option>
          {SEED_DIRECTIONS.map((dir) => (
            <option key={dir.id} value={dir.id}>
              {dir.title}
            </option>
          ))}
        </select>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Barcha hududlar</option>
          {SEED_REGIONS.map((reg) => (
            <option key={reg.id} value={reg.id}>
              {reg.name}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">Loyihalar yuklanmoqda...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 max-w-lg mx-auto">
          <p className="text-sm text-slate-400 mb-4">Ushbu filtr bo‘yicha loyiha topilmadi.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Yangi loyiha qo‘shing!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const isAlreadyMember = currentUserId
              ? proj.members.some((m) => m.userId === currentUserId)
              : false;

            return (
              <div
                key={proj.id}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      📍 {proj.regionName}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        proj.status === 'Jarayonda'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : proj.status === 'Jamoa shakllanmoqda'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Amalga oshish:</span>
                      <span className="font-semibold text-white">{proj.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full"
                        style={{ width: `${proj.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Needed roles */}
                  <div className="mb-4">
                    <span className="text-[10px] text-slate-500 block mb-1">
                      Kerakli mutaxassislar:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {proj.neededRoles.map((r, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Members count */}
                  <div className="text-[11px] text-slate-400 mb-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <span>Muallif: {proj.authorName}</span>
                    <span>{proj.members.length} a’zo</span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      if (!currentUserId) {
                        setShowLoginModal(true);
                        return;
                      }
                      setActiveJoinProject(proj);
                      setSelectedRoleToApply(proj.neededRoles[0] || 'Dasturchi');
                      setJoinMsg('');
                    }}
                    disabled={isAlreadyMember}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isAlreadyMember
                        ? 'bg-slate-800 text-slate-400 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    {isAlreadyMember ? 'Siz ushbu jamoa a’zosisiz ✓' : 'Jamoaga a’zo bo‘lish (+50 XP)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">Yangi Yoshlar Loyihasi Yaratish</h3>
            <p className="text-xs text-slate-400 mb-4">
              G‘oyangizni e’lon qiling, maqsadlarni belgilang va iqtidorli tengdoshlarni jamoangizga chorlang.
            </p>

            {createMsg && (
              <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs">
                {createMsg}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Loyiha nomi
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="masalan: Qishloq maktablari uchun mini-kutubxona"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Qisqacha mazmuni (1 jumla)
                </label>
                <input
                  type="text"
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Loyihaning asosiy maqsadi nima?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Batafsil tavsif va rejalar
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Loyiha qanday amalga oshiriladi, kimlarga yordam beradi?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Yo‘nalish
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
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
                    Kerakli mutaxassislar (vergul bilan)
                  </label>
                  <input
                    type="text"
                    value={newRoles}
                    onChange={(e) => setNewRoles(e.target.value)}
                    placeholder="Dasturchi, Dizayner, Kopirayter"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {createLoading ? 'E’lon qilinmoqda...' : 'Loyihani e’lon qilish (+100 XP)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {activeJoinProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-1">
              "{activeJoinProject.title}" jamoasiga qo‘shilish
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ushbu loyihada qaysi vazifani bajarishni xohlaysiz?
            </p>

            {joinMsg && (
              <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs">
                {joinMsg}
              </div>
            )}

            <form onSubmit={handleJoinTeam} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Vazifa / Rol
                </label>
                <select
                  value={selectedRoleToApply}
                  onChange={(e) => setSelectedRoleToApply(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                >
                  {activeJoinProject.neededRoles.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="Ko‘ngilli a’zo">Ko‘ngilli a’zo</option>
                  <option value="Tashkilotchi">Tashkilotchi</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveJoinProject(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={joinLoading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {joinLoading ? 'Yuklanmoqda...' : 'Tasdiqlash (+50 XP)'}
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
              Loyiha yaratish, jamoalarga a’zo bo‘lish va <b>+50 XP</b> ball yig‘ish uchun avval tizimga kiring.
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

export default function LoyihalarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Yuklanmoqda...</div>}>
      <LoyihalarContent />
    </Suspense>
  );
}
