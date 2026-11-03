import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import UzbekistanMap from '@/components/map/UzbekistanMap';
import {
  Compass,
  BookOpen,
  Languages,
  Code2,
  Rocket,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  Star,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export default async function HomePage() {
  const database = db.get();
  const { regions, directions, projects, events, books, languageGroups } = database;

  // Calculate real total statistics
  const totalYouthInRegions = regions.reduce((sum, r) => sum + r.youthCount, 0);
  const totalCommunities = database.communities.length;
  const totalActiveProjects = projects.length;
  const totalEvents = events.length;

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950">
        {/* Glow gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-600/20 via-violet-600/25 to-sky-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[11px] sm:text-xs font-semibold mb-6 sm:mb-8 backdrop-blur-md shadow-inner text-center max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate sm:whitespace-normal">O‘zbekiston yoshlarining yagona rivojlanish ekotizimi</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mb-4 sm:mb-6">
            <span className="block">Yoshlar birlashadi.</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-300">
              Kelajak yuksaladi.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-2xl mb-8 sm:mb-10 leading-relaxed font-normal px-2">
            O‘zbekistonning barcha hududlaridagi yoshlar bilan bilim oling, yangi tillarni o‘rganing, kitobxonlikni rivojlantiring va o‘z g‘oyalaringizni haqiqiy loyihalarga aylantiring.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <Link
              href="/royxatdan-otish"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Platformaga qo‘shilish
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#imkoniyatlar"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-sm font-semibold transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              Imkoniyatlarni ko‘rish
            </Link>
          </div>

          {/* Live Quick Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl border-t border-slate-800/80 pt-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">14 ta</span>
              <span className="text-xs text-slate-400 font-medium">Barcha hududlar</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
                {totalCommunities}+ ta
              </span>
              <span className="text-xs text-slate-400 font-medium">Faol hamjamiyatlar</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-violet-400">
                {totalActiveProjects} ta
              </span>
              <span className="text-xs text-slate-400 font-medium">Yoshlar loyihalari</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {totalEvents} ta
              </span>
              <span className="text-xs text-slate-400 font-medium">Rejalashtirilgan tadbirlar</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORMANING IMKONIYATLARI */}
      <section id="imkoniyatlar" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
            Tizimli Yondashuv
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
            Nega aynan Yuksalish Hub ekotizimi?
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Biz oddiy ma’lumotlar bazasi emasmiz. Biz har bir hududdagi yoshlar salohiyatini birlashtiruvchi zamonaviy ijtimoiy-intellektual maydonmiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-7 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">14 Hudud Birlashuvi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Qoraqalpog‘istondan Farg‘onagacha, har bir tuman va shahar yoshlari o‘zaro tajriba almashadi, birgalikda loyihalar yaratadi.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-7 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-5">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Haqiqiy Yutuqlar Tizimi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bo‘sh bosishlar emas — o‘qilgan kitoblar, jamoaviy startaplar va ijtimoiy tashabbuslardagi amaliy ishtirok uchun XP ballar va nishonlar.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-7 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mentorlik va Koordinatsiya</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hududiy koordinatorlar, tajribali mentorlar va soha mutaxassislari yoshlar tashabbuslarini to‘g‘ri yo‘naltiradi.
            </p>
          </div>
        </div>
      </section>

      {/* 3. ASOSIY RIVOJLANISH YO‘NALISHLARI */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                5 ta Asosiy Ustun
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">
                Asosiy rivojlanish yo‘nalishlari
              </h2>
            </div>
            <Link
              href="/yonalishlar"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 mt-3 md:mt-0"
            >
              Barcha yo‘nalishlarni ko‘rish <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {directions.map((dir) => {
              const iconMap: Record<string, any> = {
                kitobxonlik: BookOpen,
                'til-organish': Languages,
                'it-innovatsiya': Code2,
                liderlik: Rocket,
                volontyorlik: HeartHandshake,
              };
              const Icon = iconMap[dir.id] || Sparkles;

              return (
                <Link
                  key={dir.id}
                  href={`/yonalishlar/${dir.id}`}
                  className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${dir.accentColor}18`,
                          color: dir.accentColor,
                          border: `1px solid ${dir.accentColor}30`,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                        {dir.memberCount.toLocaleString()}+ a’zo
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                      {dir.title}
                    </h3>
                    <div className="text-xs font-medium text-indigo-400 mb-2">
                      {dir.tagline}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      {dir.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-500">{dir.activitiesCount} ta faollik</span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Batafsil <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. O‘ZBEKISTON YOSHLARINING HUDUDIY HAMJAMIYATI (Interactive Map) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <UzbekistanMap regions={regions} />
      </section>

      {/* 5. KITOBXONLIK VA TIL O‘RGANISH SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/20 border-y border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Kitobxonlik Showcase */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
                  <BookOpen className="w-3.5 h-3.5" /> Kitobxonlik Klubi
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Har oy yangi asarlar, yangi tafakkur
                </h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Barcha viloyatlardagi yoshlar bilan birgalikda oylik mutolaa marafonlarida qatnashing, kitob tahlillarini yozing va o‘z fikrlaringizni tengdoshlaringiz bilan baham ko‘ring.
                </p>

                {/* Popular books in club */}
                <div className="space-y-3 mb-6">
                  {books.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{b.title}</div>
                        <div className="text-[11px] text-slate-400">{b.author}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {b.rating}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/yonalishlar/kitobxonlik"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
              >
                Kitobxonlik bo‘limiga o‘tish <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Til O‘rganish Showcase */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-4">
                  <Languages className="w-3.5 h-3.5" /> Xorijiy Tillar (Speaking Clubs)
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Jonli muloqot va so‘zlashuv klublari
                </h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Ingliz, arab va rus tillarida haftalik onlayn speaking sessiyalar, grammatik savol-javoblar va tengdoshlar bilan o‘rganish sherikligi.
                </p>

                {/* Language groups */}
                <div className="space-y-3 mb-6">
                  {languageGroups.map((g) => (
                    <div
                      key={g.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{g.title}</div>
                        <div className="text-[11px] text-slate-400">
                          {g.language} • {g.schedule}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium">
                        {g.memberCount} a’zo
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/yonalishlar/til-organish"
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-600/20"
              >
                Til guruhlariga a’zo bo‘lish <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. YOSHLAR LOYIHALARI */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Haqiqiy Natijalar
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">
              Yoshlarning jamoaviy loyihalari
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              G‘oyangiz bormi? Jamoa tuzing, vazifalarni taqsimlang va loyihani birgalikda amalga oshiring.
            </p>
          </div>
          <Link
            href="/loyihalar"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 mt-3 md:mt-0"
          >
            Barcha loyihalarni ko‘rish <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {proj.regionName}
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
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {proj.summary}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Jarayon</span>
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
                <div className="mb-6">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5">
                    Qidirilayotgan mutaxassislar:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proj.neededRoles.slice(0, 2).map((r, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {r}
                      </span>
                    ))}
                    {proj.neededRoles.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                        +{proj.neededRoles.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Link
                href={`/loyihalar`}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                Jamoaga a’zo bo‘lish <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PLATFORMA QANDAY ISHLAYDI */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
              Oddiy va Samarali
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3 tracking-tight">
              Platforma qanday ishlaydi?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Yuksalish Hub ekotizimida muvaffaqiyatga erishish uchun 4 ta asosiy qadam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/30">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">Ro‘yxatdan o‘tish</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                O‘z viloyatingiz, tumaningiz va qiziqqan yo‘nalishlaringizni tanlang. Ilk 50 ball sizga darhol taqdim etiladi.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative">
              <div className="w-9 h-9 rounded-xl bg-violet-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-lg shadow-violet-600/30">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">Hamjamiyatga qo‘shilish</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kitobxonlar, til o‘rganuvchilar yoki IT guruhlariga a’zo bo‘lib, tengdoshlar bilan bevosita muloqotni boshlang.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-lg shadow-sky-600/30">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">Loyihalarda ishtirok</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yangi g‘oyani ilgari suring yoki mavjud jamoaga dasturchi, dizayner, koordinator sifatida qo‘shiling.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/30">
                04
              </div>
              <h3 className="text-base font-bold text-white mb-2">Yutuqlar va Reyting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Har bir muvaffaqiyatli mutolaa, tadbir va loyiha uchun nishonlar oling, viloyatingiz reytingini yuqoriga ko‘taring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="bg-gradient-to-r from-indigo-900/80 via-slate-900 to-violet-950/80 border border-indigo-500/30 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
              Kelajakni birgalikda yaratamiz!
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
              Bugunoq Yuksalish Hub platformasiga a’zo bo‘ling va O‘zbekiston yoshlarining eng faol harakatiga qo‘shiling.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/royxatdan-otish"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-xl transition-all"
              >
                Hoziroq ro‘yxatdan o‘tish
              </Link>
              <Link
                href="/kirish"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 text-sm font-semibold transition-all"
              >
                Mavjud hisobga kirish
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
