import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  const groups = db.getLanguageGroups();
  return NextResponse.json({ groups, userId: user?.id });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const { groupId } = await req.json();
    if (!groupId) {
      return NextResponse.json({ error: 'Guruh ID kiritilishi lozim' }, { status: 400 });
    }

    const res = db.toggleLanguageGroupJoin(groupId, user.id);
    const grp = db.getLanguageGroups().find((g) => g.id === groupId);

    if (res.joined && grp) {
      user.points = (user.points || 0) + 20;
      db.updateUser(user.id, { points: user.points });

      db.createNotification({
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: `"${grp.title}" til guruhiga a’zo bo‘ldingiz!`,
        message: `Muntazam muloqot va jonli amaliyot sizni tezroq maqsadga yetkazadi. +20 ball berildi.`,
        type: 'COMMUNITY',
        link: '/yonalishlar/til-organish',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, ...res });
  } catch (error) {
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}
