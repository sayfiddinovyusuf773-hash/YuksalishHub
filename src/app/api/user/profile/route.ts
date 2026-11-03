import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const { name, surname, bio, phone, interests } = await req.json();

    const updated = db.updateUser(user.id, {
      name: name?.trim() || user.name,
      surname: surname?.trim() || user.surname,
      bio: bio?.trim(),
      phone: phone?.trim(),
      interests: Array.isArray(interests) ? interests : user.interests,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 });
    }

    const { passwordHash: _, ...safeUser } = updated;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    return NextResponse.json({ error: 'Profilni saqlashda xatolik' }, { status: 500 });
  }
}
