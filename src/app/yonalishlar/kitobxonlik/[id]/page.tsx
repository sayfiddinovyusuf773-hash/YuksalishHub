'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Star,
  Settings,
  Share2,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Volume2,
  Shield,
  Plus,
  Edit3,
} from 'lucide-react';
import { Book, ReadingLog, User, BookChapter } from '@/lib/types';

function BookReaderContent() {
  const params = useParams();
  const router = useRouter();
  const bookId = params?.id as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [userLog, setUserLog] = useState<ReadingLog | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Admin In-reader CMS state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [adminChapterForm, setAdminChapterForm] = useState({
    chapterId: '',
    title: '',
    pageStart: 1,
    content: '',
  });
  const [adminActionMsg, setAdminActionMsg] = useState('');

  // Reader Settings
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [showSettings, setShowSettings] = useState(false);

  // Progress update state
  const [savedPage, setSavedPage] = useState<number>(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [savingProgress, setSavingProgress] = useState(false);

  // Review modal / form state
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const loadData = () => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});

    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => {
        const found = (data.books || []).find((b: Book) => b.id === bookId);
        setBook(found || null);

        const log = (data.userLogs || []).find((l: ReadingLog) => l.bookId === bookId);
        if (log) {
          setUserLog(log);
          setSavedPage(log.currentPage);
          setReviewText(log.review || '');
          setRating(log.rating || 5);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [bookId]);

  const handleOpenAdminAddChapter = () => {
    const nextStartPage = (book?.chapters && book.chapters.length > 0)
      ? (book.chapters[book.chapters.length - 1].pageStart + 15)
      : 1;

    setAdminChapterForm({
      chapterId: '',
      title: '',
      pageStart: nextStartPage,
      content: '',
    });
    setIsAdminEditing(false);
    setShowAdminModal(true);
  };

  const handleOpenAdminEditChapter = (ch: BookChapter) => {
    setAdminChapterForm({
      chapterId: ch.id,
      title: ch.title,
      pageStart: ch.pageStart,
      content: ch.content,
    });
    setIsAdminEditing(true);
    setShowAdminModal(true);
  };

  const handleSaveAdminChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    try {
      if (isAdminEditing) {
        const res = await fetch('/api/admin/books', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update-chapter',
            bookId: book.id,
            chapterId: adminChapterForm.chapterId,
            title: adminChapterForm.title,
            content: adminChapterForm.content,
          }),
        });
        if (res.ok) {
          setAdminActionMsg('Bob matni muvaffaqiyatli yangilandi!');
          setShowAdminModal(false);
          loadData();
          setTimeout(() => setAdminActionMsg(''), 3000);
        }
      } else {
        const res = await fetch('/api/admin/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add-chapter',
            bookId: book.id,
            title: adminChapterForm.title,
            pageStart: adminChapterForm.pageStart,
            content: adminChapterForm.content,
          }),
        });
        if (res.ok) {
          setAdminActionMsg('Yangi bob kiritildi va kitobga qo‘shildi!');
          setShowAdminModal(false);
          loadData();
          // Switch to new chapter
          if (book.chapters) {
            setCurrentChapterIndex(book.chapters.length);
          }
          setTimeout(() => setAdminActionMsg(''), 3000);
        }
      }
    } catch {
      setAdminActionMsg('Xatolik yuz berdi');
    }
  };

  const handleSavePageProgress = async (newPage: number, status?: 'O‘qilmoqda' | 'Tugatildi') => {
    if (!book) return;
    setSavingProgress(true);
    setSaveSuccessMsg('');

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          currentPage: newPage,
          status: status || (newPage >= book.pages ? 'Tugatildi' : 'O‘qilmoqda'),
          review: reviewText,
          rating,
        }),
      });

      if (res.ok) {
        setSavedPage(newPage);
        setSaveSuccessMsg(
          status === 'Tugatildi'
            ? 'Tabriklaymiz! Kitob to‘liq yakunlandi va +50 XP berildi! 🎉'
            : `Mutolaa jarayoni saqlandi: ${newPage}-sahifa (+XP)`
        );
        loadData();
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch {
      // ignore
    } finally {
      setSavingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400">
        Kitob matni yuklanmoqda...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-xl font-bold text-white mb-2">Kitob topilmadi</h2>
        <p className="text-xs text-slate-400 mb-4">
          Qidirilayotgan kitob platformada mavjud emas yoki o‘chirilgan.
        </p>
        <Link
          href="/yonalishlar/kitobxonlik"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Katalogga qaytish
        </Link>
      </div>
    );
  }

  const chapters = book.chapters || [
    {
      id: 'default',
      title: '1-bob: Asardan parcha va kirish',
      pageStart: 1,
      content: book.description,
    },
  ];

  const currentChapter = chapters[currentChapterIndex] || chapters[0];
  const progressPercent = Math.min(100, Math.round((savedPage / book.pages) * 100));

  // Theme styling classes
  const themeClasses = {
    dark: 'bg-slate-950 text-slate-200 border-slate-800',
    sepia: 'bg-[#FBF0D9] text-[#433422] border-[#E6D4B8]',
    light: 'bg-white text-slate-900 border-slate-200',
  };

  const fontClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-loose',
    lg: 'text-lg leading-loose',
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Top Reading Navigation Bar */}
      <header className="sticky top-16 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3">
        {currentUser?.role === 'SUPER_ADMIN' && (
          <div className="mb-2.5 pb-2.5 border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Admin Rejimi: Ushbu kitob matnini tahrirlash yoki yangi boblar qo‘shish mumkin</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAdminAddChapter}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                + Yangi Bob qo‘shish
              </button>
              <button
                onClick={() => handleOpenAdminEditChapter(currentChapter)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                Bobni tahrirlash
              </button>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/yonalishlar/kitobxonlik"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Katalogga qaytish</span>
          </Link>

          {/* Book Title & Chapter indicator */}
          <div className="text-center overflow-hidden">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {book.title}
            </h1>
            <div className="text-[10px] text-slate-400 truncate">
              {book.author} • {currentChapter.title}
            </div>
          </div>

          {/* Reader controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="O‘qish rejimi sozlamalari"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSavePageProgress(Math.min(book.pages, savedPage + 5))}
              disabled={savingProgress}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Belgilash ({savedPage} b.)</span>
            </button>
          </div>
        </div>

        {/* Reader Settings Drawer */}
        {showSettings && (
          <div className="max-w-md mx-auto mt-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Shrift hajmi:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2.5 py-1 rounded-lg text-xs ${
                    fontSize === 'sm' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Kichik
                </button>
                <button
                  onClick={() => setFontSize('base')}
                  className={`px-2.5 py-1 rounded-lg text-xs ${
                    fontSize === 'base' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  O‘rta
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2.5 py-1 rounded-lg text-xs ${
                    fontSize === 'lg' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Katta
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Mavzu (Theme):</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setReaderTheme('dark')}
                  className={`px-2.5 py-1 rounded-lg text-xs ${
                    readerTheme === 'dark'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Tungi
                </button>
                <button
                  onClick={() => setReaderTheme('sepia')}
                  className={`px-2.5 py-1 rounded-lg text-xs ${
                    readerTheme === 'sepia'
                      ? 'bg-[#E6D4B8] text-[#433422] font-bold'
                      : 'bg-[#FBF0D9] text-[#6b583f]'
                  }`}
                >
                  Issiq
                </button>
                <button
                  onClick={() => setReaderTheme('light')}
                  className={`px-2.5 py-1 rounded-lg text-xs ${
                    readerTheme === 'light'
                      ? 'bg-slate-200 text-slate-900 font-bold'
                      : 'bg-white text-slate-700'
                  }`}
                >
                  Kunduzgi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Progress Line */}
        <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
          <div
            className="bg-indigo-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {saveSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Chapter Selection Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none items-center">
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setCurrentChapterIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                currentChapterIndex === idx
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              {ch.title.split(':')[0]}
            </button>
          ))}

          {currentUser?.role === 'SUPER_ADMIN' && (
            <button
              onClick={handleOpenAdminAddChapter}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 shrink-0 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              + Yangi bob
            </button>
          )}
        </div>

        {adminActionMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{adminActionMsg}</span>
          </div>
        )}

        {/* Book Reader Paper Area */}
        <div
          className={`rounded-3xl p-6 sm:p-12 border shadow-2xl transition-colors duration-200 ${themeClasses[readerTheme]}`}
        >
          {/* Chapter Heading */}
          <div className="mb-8 pb-4 border-b border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold opacity-60 mb-1">
                {book.category} • {book.author}
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{currentChapter.title}</h2>
            </div>

            {currentUser?.role === 'SUPER_ADMIN' && (
              <button
                onClick={() => handleOpenAdminEditChapter(currentChapter)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/10 hover:bg-black/20 text-xs font-semibold border border-current/20 transition-all self-start sm:self-center"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Bob matnini tahrirlash
              </button>
            )}
          </div>

          {/* Book Text Content */}
          <div className={`${fontClasses[fontSize]} whitespace-pre-line tracking-wide font-serif`}>
            {currentChapter.content}
          </div>

          {/* Bottom chapter navigation */}
          <div className="mt-12 pt-6 border-t border-current/10 flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentChapterIndex(Math.max(0, currentChapterIndex - 1))}
              disabled={currentChapterIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/10 hover:bg-black/20 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Oldingi bob
            </button>

            <span className="text-[11px] opacity-70">
              Bob {currentChapterIndex + 1} / {chapters.length}
            </span>

            <button
              onClick={() =>
                setCurrentChapterIndex(Math.min(chapters.length - 1, currentChapterIndex + 1))
              }
              disabled={currentChapterIndex === chapters.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/10 hover:bg-black/20 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              Keyingi bob
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reading Progress Quick Slider & Finished Button */}
        <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>Mutolaa hisobi: {savedPage} / {book.pages} bet</span>
              <span className="text-indigo-400">{progressPercent}% o‘qildi</span>
            </div>
            <input
              type="range"
              min={0}
              max={book.pages}
              value={savedPage}
              onChange={(e) => setSavedPage(Number(e.target.value))}
              onMouseUp={() => handleSavePageProgress(savedPage)}
              onTouchEnd={() => handleSavePageProgress(savedPage)}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <button
            onClick={() => handleSavePageProgress(book.pages, 'Tugatildi')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 whitespace-nowrap transition-all"
          >
            Kitobni yakunladim 🎉 (+50 XP)
          </button>
        </div>

        {/* Book Reviews and Discussions */}
        <div className="mt-10 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Asar haqida taqriz va fikrlar
          </h3>

          {userLog?.review && (
            <div className="mb-6 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">Sizning taqrizingiz:</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{userLog.rating || 5}</span>
                </div>
              </div>
              <p className="text-slate-300 italic">"{userLog.review}"</p>
            </div>
          )}

          {/* Write review form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSavePageProgress(savedPage);
              setReviewSubmitted(true);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ushbu kitob bo‘yicha o‘z xulosangizni qoldiring:
              </label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Kitobning qaysi g‘oyalari sizga yoqdi? Tengdoshlaringizga qanday tavsiya berasiz?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 text-slate-600 hover:text-amber-400"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
              >
                Taqrizni saqlash
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Admin Chapter Add / Edit Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                {isAdminEditing ? 'Ushbu bobni tahrirlash' : `"${book.title}" ga yangi bob / sahifa qo‘shish`}
              </h3>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                ✕ Yopish
              </button>
            </div>

            <form onSubmit={handleSaveAdminChapter} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bob sarlavhasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminChapterForm.title}
                    onChange={(e) => setAdminChapterForm({ ...adminChapterForm, title: e.target.value })}
                    placeholder="Masalan: 3-bob: Marg‘ilon safari"
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
                    value={adminChapterForm.pageStart}
                    onChange={(e) => setAdminChapterForm({ ...adminChapterForm, pageStart: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bob yoki sahifa matni (Kitobxonlar o‘qiydigan to‘liq matn) *
                </label>
                <textarea
                  rows={12}
                  required
                  value={adminChapterForm.content}
                  onChange={(e) => setAdminChapterForm({ ...adminChapterForm, content: e.target.value })}
                  placeholder="Bob yoki sahifaning to‘liq matnini shu yerga kiriting..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                >
                  {isAdminEditing ? 'Tahrirni Saqlash' : 'Bobni Qo‘shish va Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookReaderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Kitob yuklanmoqda...</div>}>
      <BookReaderContent />
    </Suspense>
  );
}
