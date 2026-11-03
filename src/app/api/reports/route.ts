import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ContentReport } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'COMMUNITY_MODERATOR')) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 });
  }

  const reports = db.get().reports;
  return NextResponse.json({ reports });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'resolve') {
      if (user.role !== 'SUPER_ADMIN' && user.role !== 'COMMUNITY_MODERATOR') {
        return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 });
      }
      const { reportId, notes } = body;
      const success = db.resolveReport(reportId, notes || 'Ko‘rib chiqildi');
      return NextResponse.json({ success });
    }

    const { targetType, targetId, reason } = body;
    if (!targetType || !targetId || !reason) {
      return NextResponse.json({ error: 'Barcha ma’lumotlarni to‘ldiring' }, { status: 400 });
    }

    const newReport: ContentReport = {
      id: `rep-${Date.now()}`,
      reporterId: user.id,
      reporterName: `${user.name} ${user.surname}`,
      targetType,
      targetId,
      reason: reason.trim(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    db.createReport(newReport);
    return NextResponse.json({ success: true, report: newReport });
  } catch (error) {
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}
