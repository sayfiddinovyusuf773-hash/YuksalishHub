import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  Compass,
  BookOpen,
  Languages,
  Code2,
  Rocket,
  Users,
  Award,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  FolderGit2,
  Clock,
  Shield,
} from 'lucide-react';

export const instant = false;

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/kirish');
  }

  const database = db.get();

  // User's joined communities
  const userCommunities = database.communities.filter((c) =>
    c.members.includes(user.id)
  );

  // User's reading logs
  const userReadingLogs = database.readingLogs.filter((r) => r.userId === user.id);

  // User's joined projects
  const userProjects = database.projects.filter((p) =>
    p.members.some((m) => m.userId === user.id)
  );

  // User's registered events
  const userEvents = database.events.filter((e) => e.attendees.includes(user.id));

  // User's achievements
  const userAchievements = database.userAchievements
    .filter((ua) => ua.userId === user.id)
    .map((ua) => {
      const ach = database.achievements.find((a) => a.id === ua.achievementId);
      return { ...ach, unlockedAt: ua.unlockedAt };
    })
    .filter(Boolean);

  // Active challenges
  const activeChallenges = database.challenges;

  // Level calculations: Level N requires N * 100 XP
  const currentPoints = user.points || 0;
  const userLevel = Math.max(1, Math.floor(currentPoints / 100) + 1);
  const nextLevelPoints = userLevel * 100;
  const currentLevelProgress = currentPoints % 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* 1. WELCOME & STATS BANNER */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-violet-950/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium">
                {user.regionName} • {user.districtName}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium">
                {user.role}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Assalomu alaykum, {user.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Yuksalish Hub platformasidagi shaxsiy rivojlanish maydoningizga xush kelibsiz. Bugungi rejalaringizni belgilang va yangi cho‘qqilarga intiling!
            </p>
          </div>

          {/* Level & XP Widget */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 min-w-[240px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {userLevel}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Daraja: {userLevel}</div>
                  <div className="text-[10px] text-slate-400">{currentPoints} umumiy ball</div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{currentLevelProgress} ball</span>
              <span>Keyingi daraja: {nextLevelPoints} ball</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Main Feed & Progress) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-indigo-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-[11px] font-medium text-slate-400">Hamjamiyatlar</span>
              </div>
              <div className="text-xl font-bold text-white">{userCommunities.length} ta</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-violet-400 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-[11px] font-medium text-slate-400">Mutolaalar</span>
              </div>
              <div className="text-xl font-bold text-white">{userReadingLogs.length} ta</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sky-400 mb-1">
                <FolderGit2 className="w-4 h-4" />
                <span className="text-[11px] font-medium text-slate-400">Loyihalar</span>
              </div>
              <div className="text-xl font-bold text-white">{userProjects.length} ta</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-[11px] font-medium text-slate-400">Tadbirlar</span>
              </div>
              <div className="text-xl font-bold text-white">{userEvents.length} ta</div>
            </div>
          </div>

          {/* Joined Communities */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Mening Hamjamiyatlarim</h3>
              </div>
              <Link
                href="/hamjamiyatlar"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                Kashf qilish <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {userCommunities.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                <p className="text-xs text-slate-400 mb-3">Hali birorta hamjamiyatga a’zo bo‘lmadingiz.</p>
                <Link
                  href="/hamjamiyatlar"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Hamjamiyatlarni ko‘rish
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userCommunities.map((c) => (
                  <Link
                    key={c.id}
                    href={`/hamjamiyatlar/${c.id}`}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white mb-1">{c.title}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                        {c.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-2">
                      <span>{c.memberCount} a’zo</span>
                      <span className="text-indigo-400 font-semibold">Kirish →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reading Tracker Showcase */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Mutolaa Jarayoni</h3>
              </div>
              <Link
                href="/yonalishlar/kitobxonlik"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                Kitoblar katalogi <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {userReadingLogs.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                <p className="text-xs text-slate-400 mb-3">Hozircha o‘qilayotgan kitoblar qayd etilmagan.</p>
                <Link
                  href="/yonalishlar/kitobxonlik"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Ilk kitobni tanlash
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userReadingLogs.map((log) => {
                  const percent = Math.round((log.currentPage / log.totalPages) * 100);
                  return (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{log.bookTitle}</span>
                          <span className="text-[10px] text-slate-400">• {log.bookAuthor}</span>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full ${
                              log.status === 'Tugatildi'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-indigo-500/10 text-indigo-400'
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="mt-2 w-full max-w-md">
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>
                              {log.currentPage} / {log.totalPages} sahifa
                            </span>
                            <span className="font-semibold text-white">{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 self-end sm:self-auto">
                        <Link
                          href={`/yonalishlar/kitobxonlik/${log.bookId}`}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1"
                        >
                          O‘qish 📖
                        </Link>
                        <Link
                          href="/yonalishlar/kitobxonlik"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                        >
                          Yangilash 📝
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Challenges, Events, Achievements) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Challenges */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Faol Marafonlar</h3>
              </div>
            </div>

            <div className="space-y-3">
              {activeChallenges.map((chl) => {
                const userPart = chl.participants.find((p) => p.userId === user.id);
                return (
                  <div
                    key={chl.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{chl.title}</span>
                      <span className="text-[10px] font-bold text-amber-400">
                        +{chl.rewardPoints} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">{chl.description}</p>

                    {userPart ? (
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>
                            {userPart.currentCount} / {chl.targetCount} {chl.targetUnit}
                          </span>
                          <span className="font-semibold text-emerald-400">
                            {userPart.completed ? 'Bajarildi! 🎉' : 'Jarayonda'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (userPart.currentCount / chl.targetCount) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <Link
                        href="/tadbirlar"
                        className="block w-full py-1.5 text-center text-xs font-semibold text-indigo-400 hover:text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Ishtirok etish
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Registered Events */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Yaqinlashayotgan Tadbirlar</h3>
              </div>
              <Link href="/tadbirlar" className="text-[11px] text-sky-400 hover:underline">
                Barchasi
              </Link>
            </div>

            {userEvents.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                Hozircha tadbirlarga ro‘yxatdan o‘tmadingiz.{' '}
                <Link href="/tadbirlar" className="text-indigo-400 hover:underline">
                  Tadbirlar jadvali
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80"
                  >
                    <div className="text-xs font-bold text-white mb-1">{evt.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>📅 {evt.date}</span>
                      <span>⏰ {evt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Achievements */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Yutuqlar va Nishonlar</h3>
              </div>
              <Link href="/yutuqlar" className="text-[11px] text-violet-400 hover:underline">
                Barchasi
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {userAchievements.map((ach: any) => (
                <div
                  key={ach.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{ach.title}</div>
                    <div className="text-[10px] text-amber-400">+{ach.points} XP</div>
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
