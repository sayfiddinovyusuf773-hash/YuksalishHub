import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'REGIONAL_COORDINATOR')) {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 });
  }

  let users = db.get().users.map(({ passwordHash: _, ...u }) => u);

  // If Regional Coordinator, filter only users in their region
  if (user.role === 'REGIONAL_COORDINATOR') {
    users = users.filter((u) => u.regionId === user.regionId);
  }

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Faqat Bosh Administrator (Super Admin) o‘zgartira oladi' }, { status: 403 });
  }

  try {
    const { userId, newRole } = await req.json();
    if (!userId || !newRole) {
      return NextResponse.json({ error: 'userId va newRole kiritilishi shart' }, { status: 400 });
    }

    const updated = db.updateUser(userId, { role: newRole as UserRole });
    if (!updated) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 });
    }

    const { passwordHash: _, ...safeUser } = updated;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    return NextResponse.json({ error: 'Rolni o‘zgartirishda xatolik' }, { status: 500 });
  }
}
