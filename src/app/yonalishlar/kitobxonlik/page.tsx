'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Star,
  Sparkles,
  Award,
  CheckCircle2,
  Users,
  Plus,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Book, ReadingLog } from '@/lib/types';

export default function KitobxonlikPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [userLogs, setUserLogs] = useState<ReadingLog[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalBook, setActiveModalBook] = useState<Book | null>(null);

  // Form states
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = () => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books || []);
        setUserLogs(data.userLogs || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const openTrackerModal = (book: Book) => {
    setActiveModalBook(book);
    const existing = userLogs.find((l) => l.bookId === book.id);
    if (existing) {
      setCurrentPage(existing.currentPage);
      setRating(existing.rating || 5);
      setReview(existing.review || '');
    } else {
      setCurrentPage(0);
      setRating(5);
      setReview('');
    }
    setMessage('');
  };

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalBook) return;
    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: activeModalBook.id,
          currentPage,
          rating,
          review,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Mutolaa natijasi muvaffaqiyatli saqlandi! ✨');
        loadData();
        setTimeout(() => {
          setActiveModalBook(null);
          setMessage('');
        }, 1500);
      } else {
        setMessage(data.error || 'Xatolik yuz berdi');
      }
    } catch {
      setMessage('Server bilan aloqa uzildi');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || b.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-10 mb-10 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Kitobxonlik va Adabiyot Hamjamiyati
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Kitob bilan tafakkur kengayadi
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            O‘zbekiston yoshlari bilan birgalikda o‘qing, har bir sahifadagi ibratli fikrlarni tahlil qiling va mutolaa rivojlanish balini to‘plang.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/hamjamiyatlar/com-1"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Ziyo Mutolaa Klubiga o‘tish
            </Link>
          </div>
        </div>
      </div>

      {/* User's Current Reading Shelf */}
      {userLogs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Mening kitob javonim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userLogs.map((log) => {
              const percent = Math.round((log.currentPage / log.totalPages) * 100);
              return (
                <div
                  key={log.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{log.bookTitle}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          log.status === 'Tugatildi'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mb-3">{log.bookAuthor}</div>

                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{log.currentPage} / {log.totalPages} bet</span>
                      <span>{percent}%</span>
                    </div>
                  </div>

                  {log.review && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 text-[11px] text-slate-300 italic border border-slate-800/60">
                      "{log.review}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Catalog Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Kitoblar katalogi</h2>
          <p className="text-xs text-slate-400">
            Tavsiya etilgan asarlar ro‘yxatidan kitob tanlang va mutolaani belgilang
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kitob yoki muallif qidirish..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Barcha toifalar</option>
            <option value="mumtoz">Mumtoz adabiyot</option>
            <option value="rivojlanish">Shaxsiy rivojlanish</option>
            <option value="detektiv">Detektiv / Ilmiy</option>
            <option value="tarix">Tarix</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => {
          const userLog = userLogs.find((l) => l.bookId === book.id);
          return (
            <div
              key={book.id}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Link
                    href={`/yonalishlar/kitobxonlik/${book.id}`}
                    className="w-12 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg shrink-0 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    📖
                  </Link>
                  <div className="flex-1">
                    <span className="text-[10px] font-medium text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                      {book.category}
                    </span>
                    <Link
                      href={`/yonalishlar/kitobxonlik/${book.id}`}
                      className="block text-base font-bold text-white mt-1 leading-snug hover:text-indigo-400 transition-colors"
                    >
                      {book.title}
                    </Link>
                    <div className="text-xs text-slate-400">{book.author}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                  {book.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3 mb-4">
                  <span>{book.pages} sahifa</span>
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {book.rating} ({book.reviewsCount} taqriz)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href={`/yonalishlar/kitobxonlik/${book.id}`}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-indigo-600/20 transition-all"
                >
                  Kitobni o‘qish 📖
                </Link>
                <button
                  onClick={() => openTrackerModal(book)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                >
                  {userLog ? 'Hisobni yangilash 📝' : 'Mutolaa hisobi ✍️'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress / Review Modal */}
      {activeModalBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">
              "{activeModalBook.title}" mutolaasi
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Jami: {activeModalBook.pages} bet • {activeModalBook.author}
            </p>

            {message && (
              <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                {message}
              </div>
            )}

            <form onSubmit={handleSaveProgress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  O‘qilgan sahifa (0 dan {activeModalBook.pages} gacha)
                </label>
                <input
                  type="number"
                  min={0}
                  max={activeModalBook.pages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Baholash (1 dan 5 yulduzgacha)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-600 hover:text-amber-400"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kitob haqida taqriz yoki fikringiz
                </label>
                <textarea
                  rows={3}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Ushbu asar sizga qanday taassurot qoldirdi? Qaysi g‘oyalari yodingizda qoldi?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModalBook(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saqlanmoqda...' : 'Saqlash (+XP)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
