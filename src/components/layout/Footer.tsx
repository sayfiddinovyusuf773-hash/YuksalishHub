'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, BookOpen, Heart, Globe, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group inline-flex">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-[1.5px] shadow-lg shadow-indigo-600/30">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-indigo-400">
                    <path
                      d="M3 17C7.5 13 16.5 13 21 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="10" r="3.5" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-black tracking-tight text-white">Yuksalish Hub</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-4">
              O‘zbekiston yoshlarining yagona rivojlanish ekotizimi. Bilim sari birlashamiz, yangi cho‘qqilar sari birgalikda yuksalamiz.
            </p>
            <div className="text-xs text-slate-500 italic">
              "Har bir yoshning rivojlanishi — mamlakat kelajagiga qo‘shilgan hissa."
            </div>
          </div>

          {/* Yo‘nalishlar */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Yo‘nalishlar
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/yonalishlar/kitobxonlik" className="hover:text-indigo-400 transition-colors">
                  Kitobxonlik va Adabiyot
                </Link>
              </li>
              <li>
                <Link href="/yonalishlar/til-organish" className="hover:text-indigo-400 transition-colors">
                  Xorijiy Tillar (Speaking Club)
                </Link>
              </li>
              <li>
                <Link href="/yonalishlar/it-innovatsiya" className="hover:text-indigo-400 transition-colors">
                  IT va Innovatsiya
                </Link>
              </li>
              <li>
                <Link href="/yonalishlar/liderlik" className="hover:text-indigo-400 transition-colors">
                  Liderlik va Tadbirkorlik
                </Link>
              </li>
              <li>
                <Link href="/yonalishlar/volontyorlik" className="hover:text-indigo-400 transition-colors">
                  Volontyorlik Harakati
                </Link>
              </li>
            </ul>
          </div>

          {/* Platforma */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platforma
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/hududlar" className="hover:text-indigo-400 transition-colors">
                  14 ta Hudud Xaritasi
                </Link>
              </li>
              <li>
                <Link href="/hamjamiyatlar" className="hover:text-indigo-400 transition-colors">
                  Yoshlar Hamjamiyatlari
                </Link>
              </li>
              <li>
                <Link href="/loyihalar" className="hover:text-indigo-400 transition-colors">
                  Birlashgan Loyihalar
                </Link>
              </li>
              <li>
                <Link href="/tadbirlar" className="hover:text-indigo-400 transition-colors">
                  Tadbirlar Taqsimoti
                </Link>
              </li>
              <li>
                <Link href="/yutuqlar" className="hover:text-indigo-400 transition-colors">
                  Yutuqlar va Reyting
                </Link>
              </li>
            </ul>
          </div>

          {/* Bog‘lanish */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Bog‘lanish va Yordam
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>info@yuksalishhub.uz</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Toshkent, O‘zbekiston</span>
              </li>
              <li className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-indigo-400" />
                <span>@yuksalishhub_rasmiy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Yuksalish Hub — O‘zbekiston yoshlarining yagona raqamli ekotizimi. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex gap-6">
            <Link href="/haqida" className="hover:text-slate-400">
              Platforma nizomi
            </Link>
            <Link href="/haqida" className="hover:text-slate-400">
              Maxfiylik siyosati
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
