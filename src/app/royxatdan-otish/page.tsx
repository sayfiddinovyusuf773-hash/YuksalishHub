'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Region, District } from '@/lib/types';
import { SEED_REGIONS, SEED_DISTRICTS } from '@/data/seed';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regionId, setRegionId] = useState(SEED_REGIONS[0].id);
  const [districtId, setDistrictId] = useState('');
  const [selectedDirections, setSelectedDirections] = useState<string[]>([
    'kitobxonlik',
    'til-organish',
  ]);
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>(['Dasturlash', 'IELTS']);

  const [districts, setDistricts] = useState<District[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Update district options when region changes
  useEffect(() => {
    const filtered = SEED_DISTRICTS.filter((d) => d.regionId === regionId);
    setDistricts(filtered);
    if (filtered.length > 0) {
      setDistrictId(filtered[0].id);
    } else {
      setDistrictId('');
    }
  }, [regionId]);

  const toggleDirection = (id: string) => {
    if (selectedDirections.includes(id)) {
      setSelectedDirections(selectedDirections.filter((d) => d !== id));
    } else {
      setSelectedDirections([...selectedDirections, id]);
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const removeInterest = (item: string) => {
    setInterests(interests.filter((i) => i !== item));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedDirections.length === 0) {
      setError('Kamida bitta rivojlanish yo‘nalishini tanlang');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          surname,
          username,
          email,
          password,
          regionId,
          districtId,
          interests,
          directions: selectedDirections,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ro‘yxatdan o‘tishda xatolik yuz berdi');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Server bilan aloqa uzildi');
      setLoading(false);
    }
  };

  const directionOptions = [
    { id: 'kitobxonlik', label: 'Kitobxonlik va Adabiyot' },
    { id: 'til-organish', label: 'Xorijiy Tillar' },
    { id: 'it-innovatsiya', label: 'IT va Innovatsiya' },
    { id: 'liderlik', label: 'Liderlik va Tadbirkorlik' },
    { id: 'volontyorlik', label: 'Volontyorlik Harakati' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-9 backdrop-blur-xl shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Platformaga qo‘shilish</h2>
          <p className="text-xs text-slate-400 mt-1">
            O‘z viloyatingiz yoshlari bilan birlashing va yangi bilim cho‘qqilarini zabt eting
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Ism va Familiya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ism</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jasur"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Familiya</label>
              <input
                type="text"
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Bekmurodov"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Username va Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Foydalanuvchi nomi (@username)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="jasurbek"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jasur@ufq.uz"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Parol */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Parol</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kamida 6 ta belgi"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Region and District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Viloyat / Hudud
              </label>
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {SEED_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tuman yoki Shahar
              </label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Directions Checkboxes */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Qiziqqan asosiy yo‘nalishlar:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {directionOptions.map((dir) => {
                const checked = selectedDirections.includes(dir.id);
                return (
                  <button
                    key={dir.id}
                    type="button"
                    onClick={() => toggleDirection(dir.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition-all ${
                      checked
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        checked ? 'text-indigo-400' : 'text-slate-600'
                      }`}
                    />
                    <span>{dir.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests tags */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Qiziqish va ko‘nikmalar (teglar)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addInterest();
                  }
                }}
                placeholder="masalan: Robototexnika, Gitara, Arab tili"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
              >
                Qo‘shish
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((item) => (
                <span
                  key={item}
                  onClick={() => removeInterest(item)}
                  className="cursor-pointer text-[10px] px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 transition-colors"
                >
                  #{item} ✕
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? 'Ro‘yxatdan o‘tkazilmoqda...' : 'Ro‘yxatdan o‘tish (+50 ball)'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
          Allaqachon a’zomisiz?{' '}
          <Link href="/kirish" className="text-indigo-400 font-semibold hover:underline">
            Kirish
          </Link>
        </div>
      </div>
    </div>
  );
}
