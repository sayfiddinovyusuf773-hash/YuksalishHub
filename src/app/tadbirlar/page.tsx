'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Award,
  Plus,
  CheckCircle2,
  Filter,
  Lock,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { EventItem, Challenge } from '@/lib/types';
import { SEED_REGIONS, SEED_DIRECTIONS } from '@/data/seed';

export default function TadbirlarPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [loading, setLoading] = useState(true);

  // Status feedback & Login Modal
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);

  // Create Event Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('2026-03-25');
  const [newTime, setNewTime] = useState('15:00 - 17:00');
  const [newType, setNewType] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [newLocation, setNewLocation] = useState('Google Meet');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const loadData = () => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setCurrentUserId(d.user?.id || null))
      .catch(() => {});

    let url = `/api/events?category=${selectedCategory}&type=${selectedType}&region=${selectedRegion}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedType, selectedRegion]);

  const handleToggleRSVP = async (eventId: string, eventTitle: string) => {
    if (!currentUserId) {
      setPendingEventId(eventId);
      setShowLoginModal(true);
      return;
    }

    setActionLoadingId(eventId);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rsvp', eventId }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.registered) {
          setToastMsg({
            text: `Tabriklaymiz! "${eventTitle}" tadbiriga ro‘yxatdan o‘tdingiz (+25 XP qo‘shildi)! 🎉`,
            type: 'success',
          });
        } else {
          setToastMsg({
            text: `"${eventTitle}" tadbiridagi ishtirokingiz bekor qilindi.`,
            type: 'error',
          });
        }
        loadData();
        setTimeout(() => setToastMsg(null), 4000);
      } else {
        if (res.status === 401) {
          setPendingEventId(eventId);
          setShowLoginModal(true);
        } else {
          setToastMsg({ text: data.error || 'Xatolik yuz berdi', type: 'error' });
          setTimeout(() => setToastMsg(null), 3000);
        }
      }
    } catch {
      setToastMsg({ text: 'Aloqa xatosi yuz berdi', type: 'error' });
      setTimeout(() => setToastMsg(null), 3000);
    } finally {
      setActionLoadingId(null);
    }
  };

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
        setToastMsg({
          text: `Hush kelibsiz, ${data.user.name}! Endi tadbirlarda qatnashishingiz mumkin.`,
          type: 'success',
        });
        loadData();
        if (pendingEventId) {
          const target = events.find((e) => e.id === pendingEventId);
          setTimeout(() => {
            handleToggleRSVP(pendingEventId, target?.title || 'Tadbir');
            setPendingEventId(null);
          }, 400);
        }
      } else {
        router.push('/kirish');
      }
    } catch {
      router.push('/kirish');
    } finally {
      setQuickLoginLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    if (!currentUserId) {
      setShowLoginModal(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalMsg('');

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          date: newDate,
          time: newTime,
          type: newType,
          location: newLocation,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setModalMsg('Tadbir muvaffaqiyatli rejalashtirildi!');
        loadData();
        setTimeout(() => {
          setIsModalOpen(false);
          setNewTitle('');
          setNewDesc('');
          setModalMsg('');
        }, 1500);
      } else {
        if (res.status === 401) {
          setShowLoginModal(true);
        } else {
          setModalMsg(data.error || 'Xatolik yuz berdi');
        }
      }
    } catch {
      setModalMsg('Aloqa xatosi');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Toast Feedback */}
      {toastMsg && (
        <div
          className={`mb-6 p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-xl animate-fade-in ${
            toastMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toastMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{toastMsg.text}</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="text-xs opacity-60 hover:opacity-100 px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Tadbirlar Taqsimoti va Marafonlar
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Yoshlar Forumlari va Uchrashuvlari
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Respublika va hududiy tadbirlarga ro‘yxatdan o‘ting, mutaxassislar bilan jonli muloqotda bo‘ling.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tadbir Rejalashtirish
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Barcha toifalar</option>
          {SEED_DIRECTIONS.map((dir) => (
            <option key={dir.id} value={dir.id}>
              {dir.title}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Barcha formatlar</option>
          <option value="ONLINE">🌐 Onlayn (Zoom, Meet)</option>
          <option value="OFFLINE">🏢 Oflayn (Jonli zallar)</option>
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

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">Tadbirlar yuklanmoqda...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 max-w-lg mx-auto">
          <p className="text-sm text-slate-400 mb-4">Ushbu filtr bo‘yicha tadbirlar topilmadi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => {
            const isRegistered = currentUserId ? evt.attendees.includes(currentUserId) : false;

            return (
              <div
                key={evt.id}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {evt.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        evt.type === 'ONLINE'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {evt.type === 'ONLINE' ? '🌐 Onlayn' : '🏢 Oflayn'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">{evt.title}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300 mb-6 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Sana: {evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-violet-400" />
                      <span>Vaqt: {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tashkilotchi: {evt.organizer}</span>
                    </div>
                  </div>
                </div>

                {isRegistered && (
                  <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Siz ro‘yxatdan o‘tgansiz (+25 XP olindi)</span>
                    </div>
                    {evt.type === 'ONLINE' && (
                      <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-lg text-emerald-200">
                        {evt.location}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <span className="text-xs text-slate-400">
                    Ro‘yxatdan o‘tganlar: <b className="text-white">{evt.attendees.length}</b> /{' '}
                    {evt.capacity}
                  </span>

                  <button
                    onClick={() => handleToggleRSVP(evt.id, evt.title)}
                    disabled={actionLoadingId === evt.id}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isRegistered
                        ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    } disabled:opacity-50`}
                  >
                    {actionLoadingId === evt.id
                      ? 'Kutilmoqda...'
                      : isRegistered
                      ? 'Bekor qilish'
                      : 'Qatnashish (+25 XP)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">Yangi Tadbir Belgilash</h3>
            <p className="text-xs text-slate-400 mb-4">
              Onlayn master-klass yoki mahalliy uchrashuv rejasini kiritish
            </p>

            {modalMsg && (
              <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs">
                {modalMsg}
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tadbir nomi
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="masalan: Sun’iy intellekt bo‘yicha ochiq seminar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tavsif</label>
                <textarea
                  required
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Tadbir kimlar uchun va qanday mavzuda?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sana</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vaqt</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="18:00 - 19:30"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Format</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'ONLINE' | 'OFFLINE')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="ONLINE">Onlayn</option>
                    <option value="OFFLINE">Oflayn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Joylashuv / Havola
                  </label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Zoom havolasi yoki manzil"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
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
                  {modalLoading ? 'Saqlanmoqda...' : 'Tadbirni e’lon qilish'}
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
              Ushbu tadbirga ro‘yxatdan o‘tish, onlayn havola olish va <b>+25 XP</b> ball yig‘ish uchun avval tizimga kiring.
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
