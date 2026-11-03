import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  Rocket,
  TrendingUp,
  Target,
  Users,
  Sparkles,
  ArrowRight,
  Award,
  Briefcase,
} from 'lucide-react';

export default function LiderlikPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/20 rounded-3xl p-6 sm:p-10 mb-10 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Rocket className="w-3.5 h-3.5" />
            Liderlik va Yoshlar Tadbirkorligi
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            G‘oyangizni muvaffaqiyatli startapga aylantiring
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Biznes-reja tuzish, mahsulotni sinovdan o‘tkazish (validation), jamoani boshqarish va yetakchi tadbirkorlar bilan amaliy muloqot maydoni.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/hamjamiyatlar/com-4"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Kelajak Liderlari & Startaplar klubi
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">G‘oyalarni Validatsiya Qilish</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Biznes g‘oyangizning bozorga mosligini (Product-Market Fit) mentorlar ko‘magida bepul tekshiring.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Pitching & Taqdimotlar</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Investitsiya va grantlar olish uchun professional taqdimot va nutq so‘zlash ko‘nikmalarini rivojlantiring.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Mentorlik Tizimi</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Respublika va xalqaro miqyosdagi tajribali yosh tadbirkorlardan haftalik bevosita maslahatlar oling.
          </p>
        </div>
      </div>
    </div>
  );
}
