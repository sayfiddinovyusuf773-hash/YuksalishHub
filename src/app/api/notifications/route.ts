import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ notifications: [] });
  }

  const notifications = db.getUserNotifications(user.id);
  return NextResponse.json({ notifications });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
  }

  try {
    const { notificationId } = await req.json();
    if (notificationId) {
      db.markNotificationAsRead(notificationId);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Xatolik' }, { status: 500 });
  }
}
