import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const { communityId } = await req.json();
    if (!communityId) {
      return NextResponse.json({ error: 'Hamjamiyat ID kiritilishi shart' }, { status: 400 });
    }

    const result = db.toggleCommunityMembership(communityId, user.id);
    const com = db.getCommunityById(communityId);

    if (result.joined && com) {
      // Award 20 points
      user.points = (user.points || 0) + 20;
      db.updateUser(user.id, { points: user.points });

      db.createNotification({
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: `"${com.title}" hamjamiyatiga qo‘shildingiz!`,
        message: 'Yangi fikrlar almashish va tadbirlarda qatnashish uchun +20 rivojlanish bali berildi.',
        type: 'COMMUNITY',
        link: `/hamjamiyatlar/${com.id}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}
