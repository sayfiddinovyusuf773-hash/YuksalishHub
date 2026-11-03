import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  HeartHandshake,
  Sparkles,
  TreePine,
  GraduationCap,
  Users,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function VolontyorlikPage() {
  const database = db.get();
  const ecoProjects = database.projects.filter((p) => p.category === 'volontyorlik');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/20 rounded-3xl p-6 sm:p-10 mb-10 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            Volontyorlik va Ijtimoiy Tashabbuslar
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Jamiyatga nafi tegish — oliy fazilat
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Ekologik aksiyalar, yoshlar uchun bepul darslar, chekka qishloqlarga kitob yetkazish va ijtimoiy yordam tashabbuslarida birlashing.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/hamjamiyatlar/com-5"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Yashil Qadam Volontyorlik Markazi
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
            <TreePine className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">"Yashil Makon" Harakati</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Respublika bo‘ylab ko‘chat ekish, bog‘lar barpo etish va tabiatni asrash bo‘yicha hududiy hasharlar.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Bepul Ta’lim Loyihalari</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ijtimoiy himoyaga muhtoj bolalar uchun xorijiy tillar va kompyuter savodxonligi darslarini tashkil qilish.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Rasmiy Volontyorlik Guvohnomasi</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Platformadagi tasdiqlangan soatlar hisobi yuritiladi va rasmiy volontyorlik ma’lumotnomasi shakllantiriladi.
          </p>
        </div>
      </div>
    </div>
  );
}
