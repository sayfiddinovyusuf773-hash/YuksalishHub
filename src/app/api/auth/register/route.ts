import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth-util';
import { setAuthCookie } from '@/lib/auth';
import { User } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      surname,
      username,
      email,
      password,
      regionId,
      districtId,
      interests = [],
      directions = [],
    } = body;

    if (!name || !surname || !username || !email || !password || !regionId || !districtId) {
      return NextResponse.json(
        { error: 'Barcha majburiy maydonlarni to‘ldiring' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Parol kamida 6 ta belgidan iborat bo‘lishi lozim' },
        { status: 400 }
      );
    }

    if (db.getUserByEmail(email)) {
      return NextResponse.json(
        { error: 'Ushbu email bilan avval ro‘yxatdan o‘tilgan' },
        { status: 400 }
      );
    }

    if (db.getUserByUsername(username)) {
      return NextResponse.json(
        { error: 'Ushbu foydalanuvchi nomi (username) band' },
        { status: 400 }
      );
    }

    const region = db.get().regions.find((r) => r.id === regionId);
    const district = db.get().districts.find((d) => d.id === districtId);

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      surname: surname.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      role: 'USER',
      regionId,
      regionName: region ? region.name : 'Noma’lum viloyat',
      districtId,
      districtName: district ? district.name : 'Noma’lum tuman',
      interests: Array.isArray(interests) ? interests : [],
      directions: Array.isArray(directions) ? directions : [],
      points: 50, // "Birinchi qadam" achievement bonus
      level: 1,
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser);

    // Give first achievement
    const data = db.get();
    data.userAchievements.push({
      userId: newUser.id,
      achievementId: 'ach-1',
      unlockedAt: new Date().toISOString(),
    });

    // Send welcome notification
    data.notifications.push({
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      title: 'Yuksalish Hub ekotizimiga xush kelibsiz!',
      message: 'O‘zbekiston yoshlarining yagona rivojlanish maydoniga muvaffaqiyatli a’zo bo‘ldingiz. +50 ball taqdim etildi.',
      type: 'SUCCESS',
      link: '/dashboard',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    db.save(data);

    await setAuthCookie(newUser.id);

    const { passwordHash: _, ...safeUser } = newUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Ro‘yxatdan o‘tishda xatolik yuz berdi' }, { status: 500 });
  }
}
