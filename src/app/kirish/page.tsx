'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogIn,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  AlertCircle,
  Lock,
  Compass,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Kirishda xatolik yuz berdi');
        setLoading(false);
        return;
      }

      // Check role: if Admin or Coordinator, route to admin panel; otherwise to dashboard
      if (
        data.user.role === 'SUPER_ADMIN' ||
        data.user.role === 'REGIONAL_COORDINATOR' ||
        data.user.role === 'COMMUNITY_MODERATOR'
      ) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err) {
      setError('Server bilan aloqa uzildi');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-7 sm:p-9 backdrop-blur-xl shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Xavfsiz Tizimga Kirish</h2>
          <p className="text-xs text-slate-400 mt-1">
            Yuksalish Hub ekotizimida shaxsiy hisobingiz yoki koordinatorlik kabinetingizga kiring
          </p>
        </div>

        {/* Quick Test Login Chips */}
        <div className="mb-6 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Sinov Hisoblari (1-bosishda to‘ldirish):
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-left">
            <button
              type="button"
              onClick={() => {
                setEmailOrUsername('admin@ufq.uz');
                setPassword('admin123');
              }}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800/80 transition-all text-left"
            >
              <div className="font-bold text-xs text-white">Super Admin</div>
              <div className="text-[10px] text-slate-400 truncate">admin@ufq.uz</div>
              <div className="text-[9px] text-indigo-400 font-mono mt-0.5">admin123</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmailOrUsername('samarqand.admin@ufq.uz');
                setPassword('samarqand2026');
              }}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800/80 transition-all text-left"
            >
              <div className="font-bold text-xs text-white">Koordinator</div>
              <div className="text-[10px] text-slate-400 truncate">samarqand</div>
              <div className="text-[9px] text-indigo-400 font-mono mt-0.5">samarqand2026</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmailOrUsername('jasur@ufq.uz');
                setPassword('jasur123');
              }}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800/80 transition-all text-left"
            >
              <div className="font-bold text-xs text-white">Yoshlar a’zosi</div>
              <div className="text-[10px] text-slate-400 truncate">jasur@ufq.uz</div>
              <div className="text-[9px] text-indigo-400 font-mono mt-0.5">jasur123</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email yoki Foydalanuvchi nomi
            </label>
            <input
              type="text"
              required
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="masalan: jasur@ufq.uz yoki jizzax.admin@ufq.uz"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Maxfiy Parol
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Shaxsiy parolingizni kiriting"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Tekshirilmoqda...' : 'Tizimga kirish'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Xavfsizlik kafolati */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Shaxsiy ma’lumotlar shifrlangan va to‘liq himoyalangan</span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          Hisobingiz yo‘qmi?{' '}
          <Link href="/royxatdan-otish" className="text-indigo-400 font-semibold hover:underline">
            Ro‘yxatdan o‘tish
          </Link>
        </div>
      </div>
    </div>
  );
}
