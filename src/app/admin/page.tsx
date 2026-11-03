'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Users,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Flag,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  BookMarked,
  FileText,
  ChevronDown,
  ChevronUp,
  FolderPlus,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { User, ContentReport, Community, Project, Book, BookChapter } from '@/lib/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'reports' | 'content' | 'books'>('analytics');

  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  // Book CMS States
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBookForm, setNewBookForm] = useState({
    title: '',
    author: '',
    category: 'O‘zbek mumtoz adabiyoti',
    pages: 250,
    description: '',
    coverColor: '#4338ca',
  });

  const [showChapterModal, setShowChapterModal] = useState(false);
  const [isEditingChapter, setIsEditingChapter] = useState(false);
  const [chapterForm, setChapterForm] = useState({
    bookId: '',
    chapterId: '',
    title: '',
    pageStart: 1,
    content: '',
  });

  // Action status message
  const [actionMsg, setActionMsg] = useState('');

  const loadBooks = () => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => setBooks(data.books || []))
      .catch(() => {});
  };

  const loadAll = () => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        const u = d.user;
        setCurrentUser(u);
        if (!u || (u.role !== 'SUPER_ADMIN' && u.role !== 'REGIONAL_COORDINATOR' && u.role !== 'COMMUNITY_MODERATOR')) {
          router.push('/dashboard');
          return;
        }

        // Fetch users
        fetch('/api/admin/users')
          .then((res) => res.json())
          .then((data) => setUsers(data.users || []))
          .catch(() => {});

        // Fetch reports
        fetch('/api/reports')
          .then((res) => res.json())
          .then((data) => setReports(data.reports || []))
          .catch(() => {});

        // Fetch books for CMS
        loadBooks();

        // Fetch communities (filtered if coordinator)
        const comUrl = u.role === 'REGIONAL_COORDINATOR' ? `/api/communities?region=${u.regionId}` : '/api/communities';
        fetch(comUrl)
          .then((res) => res.json())
          .then((data) => setCommunities(data.communities || []))
          .catch(() => {});

        // Fetch projects (filtered if coordinator)
        const projUrl = u.role === 'REGIONAL_COORDINATOR' ? `/api/projects?region=${u.regionId}` : '/api/projects';
        fetch(projUrl)
          .then((res) => res.json())
          .then((data) => setProjects(data.projects || []))
          .catch(() => {});

        setLoading(false);
      })
      .catch(() => router.push('/kirish'));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg(`Foydalanuvchi roli "${newRole}" ga o‘zgartirildi!`);
        loadAll();
        setTimeout(() => setActionMsg(''), 2500);
      } else {
        setActionMsg(data.error || 'Xatolik yuz berdi');
      }
    } catch {
      setActionMsg('Aloqa xatosi');
    }
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve', reportId, notes: 'Moderator tomonidan ko‘rib chiqildi' }),
      });
      if (res.ok) {
        setActionMsg('Shikoyat ijobiy hal etildi!');
        loadAll();
        setTimeout(() => setActionMsg(''), 2500);
      }
    } catch {}
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookForm),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg(`"${newBookForm.title}" kitobi kutubxonaga muvaffaqiyatli qo‘shildi!`);
        setShowAddBookModal(false);
        setNewBookForm({
          title: '',
          author: '',
          category: 'O‘zbek mumtoz adabiyoti',
          pages: 250,
          description: '',
          coverColor: '#4338ca',
        });
        loadBooks();
        setTimeout(() => setActionMsg(''), 3000);
      } else {
        setActionMsg(data.error || 'Kitob yaratishda xatolik yuz berdi');
      }
    } catch {
      setActionMsg('Aloqa xatosi');
    }
  };

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    if (!confirm(`Haqiqatan ham "${bookTitle}" kitobini va uning barcha boblarini butunlay o‘chirmoqchimisiz?`)) return;
    try {
      const res = await fetch(`/api/admin/books?bookId=${bookId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setActionMsg(`"${bookTitle}" kitobi o‘chirildi!`);
        loadBooks();
        setTimeout(() => setActionMsg(''), 2500);
      }
    } catch {
      setActionMsg('Kitobni o‘chirishda xatolik');
    }
  };

  const handleOpenAddChapter = (bookId: string, nextStartPage: number) => {
    setChapterForm({
      bookId,
      chapterId: '',
      title: '',
      pageStart: nextStartPage || 1,
      content: '',
    });
    setIsEditingChapter(false);
    setShowChapterModal(true);
  };

  const handleOpenEditChapter = (bookId: string, chapter: BookChapter) => {
    setChapterForm({
      bookId,
      chapterId: chapter.id,
      title: chapter.title,
      pageStart: chapter.pageStart,
      content: chapter.content,
    });
    setIsEditingChapter(true);
    setShowChapterModal(true);
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditingChapter) {
        const res = await fetch('/api/admin/books', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update-chapter',
            bookId: chapterForm.bookId,
            chapterId: chapterForm.chapterId,
            title: chapterForm.title,
            content: chapterForm.content,
          }),
        });
        if (res.ok) {
          setActionMsg(`Bob muvaffaqiyatli tahrirlandi!`);
          setShowChapterModal(false);
          loadBooks();
          setTimeout(() => setActionMsg(''), 2500);
        }
      } else {
        const res = await fetch('/api/admin/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add-chapter',
            bookId: chapterForm.bookId,
            title: chapterForm.title,
            pageStart: chapterForm.pageStart,
            content: chapterForm.content,
          }),
        });
        if (res.ok) {
          setActionMsg(`Yangi bob muvaffaqiyatli qo‘shildi!`);
          setShowChapterModal(false);
          loadBooks();
          setTimeout(() => setActionMsg(''), 2500);
        }
      }
    } catch {
      setActionMsg('Bobni saqlashda xatolik');
    }
  };

  const handleDeleteChapter = async (bookId: string, chapterId: string, chapterTitle: string) => {
    if (!confirm(`"${chapterTitle}" bobini o‘chirishni tasdiqlaysizmi?`)) return;
    try {
      const res = await fetch(`/api/admin/books?bookId=${bookId}&chapterId=${chapterId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setActionMsg(`"${chapterTitle}" bobi o‘chirildi!`);
        loadBooks();
        setTimeout(() => setActionMsg(''), 2500);
      }
    } catch {
      setActionMsg('Bobni o‘chirishda xatolik');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Admin ma’lumotlari yuklanmoqda...</div>;
  }

  if (!currentUser) return null;

  // Chart data: Distribution by Direction
  const directionChartData = [
    { name: 'Kitobxonlik', value: 12480, color: '#4f46e5' },
    { name: 'Tillar', value: 18920, color: '#8b5cf6' },
    { name: 'IT & Innovatsiya', value: 15400, color: '#06b6d4' },
    { name: 'Liderlik', value: 9800, color: '#f59e0b' },
    { name: 'Volontyorlik', value: 11300, color: '#10b981' },
  ];

  const regionalBarData = [
    { name: 'Samarqand', count: 510 },
    { name: 'Farg‘ona', count: 490 },
    { name: 'Qashqadaryo', count: 440 },
    { name: 'Andijon', count: 430 },
    { name: 'Toshkent sh.', count: 420 },
    { name: 'Namangan', count: 380 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              {currentUser.role}
            </span>
            {currentUser.role === 'REGIONAL_COORDINATOR' && (
              <span className="text-xs text-slate-400">
                Faqat o‘z hududingiz: <b>{currentUser.regionName}</b>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {currentUser.role === 'REGIONAL_COORDINATOR'
              ? `${currentUser.regionName} Koordinatori Xizmat Xonasi`
              : 'Yuksalish Hub Boshqaruv va Moderatsiya Paneli'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {currentUser.role === 'REGIONAL_COORDINATOR'
              ? `Siz faqat o‘zingiz mas’ul bo‘lgan ${currentUser.regionName} yoshlari, loyihalari va hamjamiyatlarini nazorat qilasiz.`
              : 'Respublika bo‘yicha platforma faoliyati, foydalanuvchilar rollari, shikoyatlar va barcha hududlar nazorati.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Mening profilim
          </Link>
        </div>
      </div>

      {actionMsg && (
        <div className="mb-6 p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-3">
        {[
          { id: 'analytics', label: 'Umumiy Tahlil & Statistika', icon: BarChart3 },
          { id: 'users', label: `Foydalanuvchilar (${users.length})`, icon: Users },
          { id: 'reports', label: `Shikoyatlar (${reports.length})`, icon: Flag },
          { id: 'content', label: `Hamjamiyatlar & Loyihalar`, icon: Layers },
          ...(currentUser.role === 'SUPER_ADMIN'
            ? [{ id: 'books', label: `📚 Kitoblar & Boblar CMS (${books.length})`, icon: BookOpen }]
            : []),
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Jami Foydalanuvchilar</span>
              <div className="text-2xl font-black text-white mt-1">{users.length} nafar</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Hamjamiyatlar</span>
              <div className="text-2xl font-black text-indigo-400 mt-1">{communities.length} ta</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Faol Loyihalar</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">{projects.length} ta</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Ko‘rilmagan Shikoyatlar</span>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {reports.filter((r) => r.status === 'PENDING').length} ta
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Eng Katta Hududlar Bo‘yicha Yoshlar Qamrovi (ming kishi)
              </h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalBarData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                Yo‘nalishlar Bo‘yicha Qiziqish Taqsimoti
              </h3>
              <div className="w-full h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={directionChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name }) => name}
                    >
                      {directionChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white mb-4">Foydalanuvchilar va Rollar</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Foydalanuvchi</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Hudud / Tuman</th>
                  <th className="p-3">Joriy Rol</th>
                  <th className="p-3">Ball / Daraja</th>
                  {currentUser.role === 'SUPER_ADMIN' && <th className="p-3">Rolni o‘zgartirish</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-white">
                      {u.name} {u.surname}
                      <span className="block text-[10px] text-slate-400">@{u.username}</span>
                    </td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3">
                      {u.regionName}
                      <span className="block text-[10px] text-slate-400">{u.districtName}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-amber-400 font-bold">{u.points || 0} XP</span>
                      <span className="block text-[10px] text-slate-400">Lvl {u.level || 1}</span>
                    </td>
                    {currentUser.role === 'SUPER_ADMIN' && (
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-white focus:outline-none"
                        >
                          <option value="USER">USER</option>
                          <option value="MENTOR">MENTOR</option>
                          <option value="COMMUNITY_MODERATOR">COMMUNITY_MODERATOR</option>
                          <option value="DISTRICT_COORDINATOR">DISTRICT_COORDINATOR</option>
                          <option value="REGIONAL_COORDINATOR">REGIONAL_COORDINATOR</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS & MODERATION */}
      {activeTab === 'reports' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white mb-4">Shikoyatlar va Moderatsiya</h3>

          {reports.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Hech qanday shikoyat yo‘q. Platforma tinch va tartibli!
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rep.status === 'PENDING'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {rep.status}
                      </span>
                      <span className="text-xs font-bold text-white">
                        Obyekt: {rep.targetType} (#{rep.targetId})
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">Sabab: "{rep.reason}"</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Yuboruvchi: {rep.reporterName} • Sana:{' '}
                      {new Date(rep.createdAt).toLocaleDateString('uz-UZ')}
                    </div>
                  </div>

                  {rep.status === 'PENDING' && (
                    <button
                      onClick={() => handleResolveReport(rep.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold self-end sm:self-auto"
                    >
                      Hal etildi deb belgilash
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CONTENT OVERSIGHT */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white mb-4">
              Faol Hamjamiyatlar ({communities.length})
            </h3>
            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {communities.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{c.title}</div>
                    <div className="text-[11px] text-slate-400">{c.coordinatorName}</div>
                  </div>
                  <span className="text-indigo-400 font-semibold">{c.memberCount} a’zo</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white mb-4">
              Loyihalar Nazorati ({projects.length})
            </h3>
            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{p.title}</div>
                    <div className="text-[11px] text-slate-400">{p.regionName}</div>
                  </div>
                  <span className="text-emerald-400 font-semibold">{p.progressPercent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BOOKS & CHAPTERS CMS */}
      {activeTab === 'books' && currentUser.role === 'SUPER_ADMIN' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Kitoblar, Boblar va Sahifalar Boshqaruvi
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kutubxonaga yangi asarlar qo‘shing, kitoblar ichiga yangi boblar va sahifalar kiriting yoki mavjud matnlarni tahrirlang. O‘quvchilar bu matnlarni to‘g‘ridan-to‘g‘ri o‘qishadi.
              </p>
            </div>

            <button
              onClick={() => setShowAddBookModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              + Yangi Kitob Qo‘shish
            </button>
          </div>

          {/* Books List */}
          <div className="space-y-4">
            {books.map((b) => {
              const isExpanded = expandedBookId === b.id;
              const chaptersCount = b.chapters?.length || 0;
              const nextStartPage = (b.chapters && b.chapters.length > 0)
                ? (b.chapters[b.chapters.length - 1].pageStart + 15)
                : 1;

              return (
                <div
                  key={b.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden transition-all shadow-md"
                >
                  {/* Book Card Main Header */}
                  <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-16 rounded-xl flex items-center justify-center shrink-0 shadow-md border border-white/10"
                        style={{ backgroundColor: b.coverColor || '#312e81' }}
                      >
                        <BookMarked className="w-6 h-6 text-white/90" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {b.category}
                          </span>
                          <span className="text-xs text-slate-400">
                            {b.pages} sahifa • ⭐ {b.rating}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white">{b.title}</h3>
                        <p className="text-xs text-slate-400">Muallif: {b.author}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1 max-w-xl">{b.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                      <Link
                        href={`/yonalishlar/kitobxonlik/${b.id}`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        O‘qish 📖
                      </Link>

                      <button
                        onClick={() => handleOpenAddChapter(b.id, nextStartPage)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        + Yangi Bob qo‘shish
                      </button>

                      <button
                        onClick={() => setExpandedBookId(isExpanded ? null : b.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                          isExpanded
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Boblar ({chaptersCount})</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDeleteBook(b.id, b.title)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                        title="Kitobni o‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Accordion: Chapters List */}
                  {isExpanded && (
                    <div className="bg-slate-950/70 border-t border-slate-800 p-5 sm:p-6 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Ushbu kitob boblari va sahifalari ({chaptersCount} ta):
                        </span>
                        <button
                          onClick={() => handleOpenAddChapter(b.id, nextStartPage)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Yangi bob kiritish
                        </button>
                      </div>

                      {chaptersCount === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500 rounded-2xl bg-slate-900/50 border border-slate-800/60">
                          Hozircha hech qanday bob kiritilmagan. Yuqoridagi "+ Yangi Bob qo‘shish" tugmasini bosing.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {(b.chapters || []).map((ch, idx) => (
                            <div
                              key={ch.id}
                              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300">
                                    {ch.pageStart}-betdan
                                  </span>
                                  <h4 className="text-sm font-bold text-white">{ch.title}</h4>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-2 italic font-serif">
                                  "{ch.content?.substring(0, 160)}..."
                                </p>
                              </div>

                              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                <button
                                  onClick={() => handleOpenEditChapter(b.id, ch)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                                  Tahrirlash
                                </button>
                                <button
                                  onClick={() => handleDeleteChapter(b.id, ch.id, ch.title)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                                  title="Bobni o‘chirish"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal 1: Add New Book */}
          {showAddBookModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <FolderPlus className="w-5 h-5 text-indigo-400" />
                    Kutubxonaga Yangi Kitob Qo‘shish
                  </h3>
                  <button
                    onClick={() => setShowAddBookModal(false)}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1"
                  >
                    ✕ Yopish
                  </button>
                </div>

                <form onSubmit={handleCreateBook} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Kitob Nomi *</label>
                    <input
                      type="text"
                      required
                      value={newBookForm.title}
                      onChange={(e) => setNewBookForm({ ...newBookForm, title: e.target.value })}
                      placeholder="Masalan: Yulduzli tunlar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Muallif *</label>
                      <input
                        type="text"
                        required
                        value={newBookForm.author}
                        onChange={(e) => setNewBookForm({ ...newBookForm, author: e.target.value })}
                        placeholder="Pirimqul Qodirov"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Toifa / Janr *</label>
                      <select
                        value={newBookForm.category}
                        onChange={(e) => setNewBookForm({ ...newBookForm, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      >
                        <option value="O‘zbek mumtoz adabiyoti">O‘zbek mumtoz adabiyoti</option>
                        <option value="Tarix va Davlatchilik">Tarix va Davlatchilik</option>
                        <option value="Shaxsiy rivojlanish">Shaxsiy rivojlanish</option>
                        <option value="Jahon adabiyoti">Jahon adabiyoti</option>
                        <option value="Detektiv / Texnologiya">Detektiv / Texnologiya</option>
                        <option value="Falsafa va Tasavvuf">Falsafa va Tasavvuf</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Jami sahifalar soni</label>
                      <input
                        type="number"
                        min={1}
                        value={newBookForm.pages}
                        onChange={(e) => setNewBookForm({ ...newBookForm, pages: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Muqova rang kodi</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={newBookForm.coverColor}
                          onChange={(e) => setNewBookForm({ ...newBookForm, coverColor: e.target.value })}
                          className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-800"
                        />
                        <span className="text-xs text-slate-400 font-mono">{newBookForm.coverColor}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Qisqacha ta’rif / annotatsiya</label>
                    <textarea
                      rows={3}
                      value={newBookForm.description}
                      onChange={(e) => setNewBookForm({ ...newBookForm, description: e.target.value })}
                      placeholder="Asarning mazmuni va g‘oyasi haqida qisqacha ma’lumot..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddBookModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                    >
                      Kitobni Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal 2: Add or Edit Chapter */}
          {showChapterModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-indigo-400" />
                    {isEditingChapter ? 'Bob / Sahifani Tahrirlash' : 'Kitobga Yangi Bob / Sahifa Qo‘shish'}
                  </h3>
                  <button
                    onClick={() => setShowChapterModal(false)}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1"
                  >
                    ✕ Yopish
                  </button>
                </div>

                <form onSubmit={handleSaveChapter} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Bob sarlavhasi *
                      </label>
                      <input
                        type="text"
                        required
                        value={chapterForm.title}
                        onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                        placeholder="Masalan: 2-bob: Toshkent ko‘chalari"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Boshlanish beti
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={chapterForm.pageStart}
                        onChange={(e) => setChapterForm({ ...chapterForm, pageStart: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Bob yoki sahifa matni (O‘quvchilar ushbu matnni o‘qiydilar) *
                    </label>
                    <textarea
                      rows={12}
                      required
                      value={chapterForm.content}
                      onChange={(e) => setChapterForm({ ...chapterForm, content: e.target.value })}
                      placeholder="Bob matnini to‘liq ushbu maydonga kiriting yoki nusxalab qo‘ying. Matn o‘quvchining e-reader sahifasida chiroyli shriftda ko‘rinadi..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowChapterModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                    >
                      {isEditingChapter ? 'O‘zgarishlarni Saqlash' : 'Bobni Kitobga Qo‘shish'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
