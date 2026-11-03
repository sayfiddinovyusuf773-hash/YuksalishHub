'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  BookOpen,
  Users,
  FolderGit2,
  Calendar,
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Bell,
  Shield,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { User, NotificationItem } from '@/lib/types';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
        if (data.user) {
          fetch('/api/notifications')
            .then((r) => r.json())
            .then((d) => setNotifications(d.notifications || []))
            .catch(() => {});
        }
      })
      .catch(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setProfileDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/yonalishlar', label: 'Yo‘nalishlar', icon: Layers },
    { href: '/hududlar', label: 'Hududlar', icon: Compass },
    { href: '/hamjamiyatlar', label: 'Hamjamiyatlar', icon: Users },
    { href: '/loyihalar', label: 'Loyihalar', icon: FolderGit2 },
    { href: '/tadbirlar', label: 'Tadbirlar', icon: Calendar },
    { href: '/haqida', label: 'Haqida', icon: Sparkles },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 p-[1.5px] shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-violet-600/40 to-transparent" />
              {/* Minimal horizon / crescent dawn icon */}
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-indigo-400">
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
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
              Yuksalish Hub
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
              Yoshlar Ekotizimi
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white bg-slate-800/90 shadow-sm border border-slate-700/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right action area */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 relative transition-all"
                  title="Bildirishnomalar"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Bildirishnomalar
                      </span>
                      <span className="text-[11px] text-indigo-400">
                        {unreadCount} ta o‘qilmagan
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-500">
                          Hozircha yangi bildirishnomalar yo‘q
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl text-xs border transition-all ${
                              n.isRead
                                ? 'bg-slate-950/40 border-slate-800/40 text-slate-400'
                                : 'bg-indigo-950/30 border-indigo-500/30 text-slate-200'
                            }`}
                          >
                            <div className="font-semibold text-white mb-0.5">{n.title}</div>
                            <div className="text-[11px] text-slate-300 mb-1">{n.message}</div>
                            <div className="text-[9px] text-slate-500">
                              {new Date(n.createdAt).toLocaleDateString('uz-UZ')}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-medium leading-tight">
                      {user.points || 0} ball
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <div className="text-xs font-bold text-white">
                        {user.name} {user.surname}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {user.email}
                      </div>
                      <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {user.role}
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <Layers className="w-4 h-4 text-indigo-400" />
                      Mening boshqaruv panelim
                    </Link>

                    <Link
                      href="/profil"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <UserIcon className="w-4 h-4 text-violet-400" />
                      Profil ma’lumotlari
                    </Link>

                    {(user.role === 'SUPER_ADMIN' ||
                      user.role === 'REGIONAL_COORDINATOR' ||
                      user.role === 'COMMUNITY_MODERATOR') && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 hover:text-amber-200 hover:bg-amber-950/40"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        Admin boshqaruvi
                      </Link>
                    )}

                    <div className="my-1 border-t border-slate-800" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                    >
                      <LogOut className="w-4 h-4" />
                      Tizimdan chiqish
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/kirish"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition-all"
              >
                Kirish
              </Link>
              <Link
                href="/royxatdan-otish"
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
              >
                Platformaga qo‘shilish
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900"
            >
              <link.icon className="w-4 h-4 text-indigo-400" />
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/kirish"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800"
              >
                Kirish
              </Link>
              <Link
                href="/royxatdan-otish"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600"
              >
                Platformaga qo‘shilish
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
