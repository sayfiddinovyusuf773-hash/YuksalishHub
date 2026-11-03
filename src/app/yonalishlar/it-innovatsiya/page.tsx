import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  Code2,
  Cpu,
  FolderGit2,
  Users,
  Sparkles,
  ArrowRight,
  Terminal,
  Zap,
} from 'lucide-react';

export default function ITInnovatsiyaPage() {
  const database = db.get();
  const itProjects = database.projects.filter((p) => p.category === 'it-innovatsiya');
  const itEvents = database.events.filter((e) => e.category === 'it-innovatsiya');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-500/20 rounded-3xl p-6 sm:p-10 mb-10 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-3">
            <Code2 className="w-3.5 h-3.5" />
            IT va Innovatsion Texnologiyalar
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Kelajak texnologiyalarini yaratuvchi yoshlar
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Dasturlash, sun’iy intellekt, ma’lumotlar tahlili va startap loyihalar bo‘yicha O‘zbekiston yoshlari o‘rtasida jamoaviy kodlash, xakatonlar va mentorlik maydoni.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/hamjamiyatlar/com-3"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              DevHorizon IT Jamiyatiga o‘tish
            </Link>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Open Source Marafonlari</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            O‘zbek tilidagi dasturiy kutubxonalar va jamiyat uchun ochiq manbali mahsulotlarni birgalikda yaratish.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Sun’iy Intellekt Laboratoriyasi</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Machine Learning, LLM va kompyuter ko‘rish texnologiyalarini amaliyotda qo‘llash bo‘yicha seminar va vorkshoplar.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">14 Kunlik Sprintlar</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            G‘oyadan ishchi MVP prototipigacha bo‘lgan masofani qisqa vaqtda jamoaviy tarzda bosib o‘tish.
          </p>
        </div>
      </div>

      {/* IT Projects */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">IT Yo‘nalishidagi Loyihalar</h2>
            <p className="text-xs text-slate-400">Dasturchi, dizayner yoki tester sifatida jamoalarga qo‘shiling</p>
          </div>
          <Link href="/loyihalar" className="text-xs font-semibold text-sky-400 hover:underline">
            Barcha loyihalar →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itProjects.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{p.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">{p.summary}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.neededRoles.map((r, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href="/loyihalar"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white text-xs font-semibold text-center transition-all"
              >
                Jamoaga a’zo bo‘lish
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
