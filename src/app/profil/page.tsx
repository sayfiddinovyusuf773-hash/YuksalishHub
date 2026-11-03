'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Sparkles,
  MapPin,
  Award,
  Phone,
  Mail,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { User, Achievement } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const loadUser = () => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          router.push('/kirish');
          return;
        }
        setUser(d.user);
        setName(d.user.name || '');
        setSurname(d.user.surname || '');
        setBio(d.user.bio || '');
        setPhone(d.user.phone || '');
        setInterests(d.user.interests || []);
        setLoading(false);
      })
      .catch(() => router.push('/kirish'));
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, bio, phone, interests }),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveStatus('Profil ma’lumotlari muvaffaqiyatli yangilandi! ✓');
        loadUser();
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus(data.error || 'Xatolik yuz berdi');
      }
    } catch {
      setSaveStatus('Aloqa xatosi');
    } finally {
      setSaving(false);
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

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Profil yuklanmoqda...</div>;
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-sky-400 p-[2px] shadow-xl shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl font-black text-white">
              {user.name.charAt(0)}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-white">
                {user.name} {user.surname}
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {user.role}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {user.regionName} • {user.districtName}
            </p>

            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>{user.points || 0} XP ball</span>
              </div>
              <div className="text-slate-400">
                Daraja: <b className="text-white">{user.level || 1}</b>
              </div>
              <div className="text-slate-400">
                A’zolik: <b className="text-slate-300">{new Date(user.createdAt).toLocaleDateString('uz-UZ')}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {saveStatus && (
        <div className="mb-6 p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-indigo-400" />
          Shaxsiy Ma’lumotlarni Tahrirlash
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ism</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Familiya</label>
              <input
                type="text"
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email (o‘zgartirib bo‘lmaydi)
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-500 text-xs cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Telefon raqam
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              O‘zingiz haqingizda (Bio)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Qaysi sohada o‘qiysiz yoki ishlaysiz? Asosiy maqsadlaringiz nima?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Qiziqishlar va ko‘nikmalar
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
                placeholder="Yangi qiziqish qo‘shish..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
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

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saqlanmoqda...' : 'O‘zgarishlarni saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
