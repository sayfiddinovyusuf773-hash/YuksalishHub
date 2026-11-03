import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Target,
  Users,
  Award,
  Globe2,
  Mail,
  Phone,
  Heart,
} from 'lucide-react';

export default function HaqidaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Vision Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Platforma Haqida va Missiya
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Yuksalish Hub — O‘zbekiston yoshlarining yagona rivojlanish ekotizimi
        </h1>
        <p className="text-base text-indigo-300 font-medium mb-3">
          "Bilim sari birlashamiz. Kelajak sari yuksalamiz."
        </p>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Yuksalish Hub — bu oddiy ta’lim sayti yoki maktab boshqaruv tizimi emas. Bu respublikamizning barcha 14 ta hududidagi ilg‘or, izlanuvchan va tashabbuskor yoshlarni birlashtiruvchi zamonaviy intellektual ekotizimdir.
        </p>
      </div>

      {/* Core Principle */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-violet-950/80 border border-indigo-500/30 rounded-3xl p-8 sm:p-10 mb-12 text-center shadow-2xl relative overflow-hidden">
        <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">
          Asosiy Bosh Tamoyil
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white max-w-2xl mx-auto leading-snug">
          "Har bir yoshning rivojlanishi — mamlakat kelajagiga qo‘shilgan hissa."
        </h2>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Hududiy Bog‘liqlik</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Poytaxt va viloyatlar, shahar va tumanlar o‘rtasidagi raqamli hamkorlik ko‘prigi. Har bir hudud o‘z salohiyatini to‘liq namoyon qiladi.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Hamfikrlar Jamiyati</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kitobxonlar, til o‘rganuvchilar, IT mutaxassislari va ijtimoiy tashabbuskorlar yagona platformada birlashadi.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Xavfsizlik va Odob</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Foydalanuvchilar shaxsiy ma’lumotlari himoyalangan, kontentlar odob-axloq me’yorlari asosida faol moderatsiya qilinadi.
          </p>
        </div>
      </div>

      {/* Contact & Support */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-white mb-2">Savollar va Hamkorlik</h3>
        <p className="text-xs text-slate-400 mb-6">
          Ta’lim muassasalari, yoshlar tashkilotlari va mentorlik bo‘yicha takliflaringizni kutamiz.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-indigo-300">
            <Mail className="w-4 h-4" />
            <span>info@yuksalishhub.uz</span>
          </div>
          <span className="hidden sm:inline text-slate-700">•</span>
          <div className="flex items-center gap-2 text-indigo-300">
            <Phone className="w-4 h-4" />
            <span>+998 71 200 00 26</span>
          </div>
        </div>
      </div>
    </div>
  );
}
