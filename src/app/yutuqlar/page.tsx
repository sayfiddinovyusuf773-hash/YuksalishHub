import React from 'react';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import {
  Award,
  Crown,
  Trophy,
  Sparkles,
  Users,
  Compass,
  Star,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export const instant = false;

export default async function YutuqlarPage() {
  const user = await getCurrentUser();
  const database = db.get();
  const { achievements, userAchievements, users, regions } = database;

  // Rank users by points descending
  const sortedUsers = [...users].sort((a, b) => (b.points || 0) - (a.points || 0));

  // Regional ranking by accumulated user points
  const regionalPointsMap: Record<string, { regionName: string; totalPoints: number; youthCount: number }> = {};
  regions.forEach((r) => {
    regionalPointsMap[r.id] = { regionName: r.name, totalPoints: 0, youthCount: 0 };
  });

  users.forEach((u) => {
    if (regionalPointsMap[u.regionId]) {
      regionalPointsMap[u.regionId].totalPoints += u.points || 0;
      regionalPointsMap[u.regionId].youthCount += 1;
    }
  });

  const sortedRegions = Object.entries(regionalPointsMap)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  // User unlocked achievement ids
  const userUnlockedIds = user
    ? userAchievements.filter((ua) => ua.userId === user.id).map((ua) => ua.achievementId)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          <Trophy className="w-3.5 h-3.5" />
          Rag‘batlantirish va Yutuqlar Ekotizimi
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Bilim va Mehnat Reytingi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Yuksalish Hub platformasida har bir ball — bu o‘qilgan haqiqiy sahifalar, o‘rganilgan yangi so‘zlar, jamiyatga keltirilgan amaliy naf va jamoaviy loyihalardagi mehnat natijasidir.
        </p>
      </div>

      {/* Grid: Badges Showcase & Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Badges Collection (Left) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Nishonlar va Yutuqlar Kolleksiyasi
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Muayyan amaliy marralarni zabt etganingizda nishonlar avtomatik tarzda ochiladi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((ach) => {
                const isUnlocked = userUnlockedIds.includes(ach.id);

                return (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isUnlocked
                        ? 'bg-slate-950/80 border-indigo-500/40 shadow-lg'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-500 to-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-white truncate">{ach.title}</span>
                        {isUnlocked && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                        {ach.description}
                      </p>
                      <span className="text-[10px] font-bold text-amber-400">
                        +{ach.points} XP ball
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anti-manipulation statement */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">
                Adolatli ball berish tamoyillari:
              </span>{' '}
              Yuksalish Hub platformasida sun’iy kliklar yoki yolg‘on statistikalar uchun ball berilmaydi. Har bir yutuq haqiqiy topshiriqlar, mutolaa tahlillari va moderator tomonidan tekshirilgan jamoaviy hissalar bilan mustahkamlanadi.
            </div>
          </div>
        </div>

        {/* Leaderboards (Right) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Youth Leaders */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              Respublika Eng Faol Yoshlari
            </h3>

            <div className="space-y-2.5">
              {sortedUsers.slice(0, 5).map((u, idx) => (
                <div
                  key={u.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    idx === 0
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : idx === 1
                      ? 'bg-slate-800/60 border-slate-700'
                      : idx === 2
                      ? 'bg-indigo-950/30 border-indigo-500/20'
                      : 'bg-slate-950/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center font-black text-xs ${
                        idx === 0
                          ? 'text-amber-400'
                          : idx === 1
                          ? 'text-slate-300'
                          : idx === 2
                          ? 'text-indigo-400'
                          : 'text-slate-500'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {u.name} {u.surname}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {u.regionName} • Daraja: {u.level || 1}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-amber-400">{u.points || 0} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Ranking */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              Hududlar Reytingi
            </h3>

            <div className="space-y-2.5">
              {sortedRegions.slice(0, 5).map((r, idx) => (
                <div
                  key={r.id}
                  className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-400 w-4 text-center">#{idx + 1}</span>
                    <span className="font-semibold text-white">{r.regionName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">{r.youthCount} a’zo</span>
                    <span className="font-bold text-indigo-400">{r.totalPoints} ball</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
