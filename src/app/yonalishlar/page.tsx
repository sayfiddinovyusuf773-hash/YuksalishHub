import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  BookOpen,
  Languages,
  Code2,
  Rocket,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
} from 'lucide-react';

export default function DirectionsPage() {
  const directions = db.get().directions;

  const iconMap: Record<string, any> = {
    kitobxonlik: BookOpen,
    'til-organish': Languages,
    'it-innovatsiya': Code2,
    liderlik: Rocket,
    volontyorlik: HeartHandshake,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Rivojlanish yo‘llari
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          5 Asosiy Rivojlanish Yo‘nalishi
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          O‘zbekiston yoshlarining intellektual, ma’naviy va amaliy salohiyatini yuksaltirishga qaratilgan asosiy yo‘nalishlar. O‘zingizga mos sohani tanlang va hamjamiyatlarga qo‘shiling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {directions.map((dir) => {
          const Icon = iconMap[dir.id] || Sparkles;
          return (
            <div
              key={dir.id}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: `${dir.accentColor}18`,
                      color: dir.accentColor,
                      border: `1px solid ${dir.accentColor}35`,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 px-2.5 py-1 rounded-full bg-slate-800">
                    {dir.memberCount.toLocaleString()}+ a’zo
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1.5">{dir.title}</h3>
                <div className="text-xs font-semibold text-indigo-400 mb-3">
                  {dir.tagline}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {dir.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <Link
                  href={`/yonalishlar/${dir.id}`}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  Yo‘nalishga o‘tish <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
