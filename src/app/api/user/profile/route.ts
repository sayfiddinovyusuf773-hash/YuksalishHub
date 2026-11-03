import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const { name, surname, bio, phone, interests, regionId, districtId } = await req.json();

    const dbData = db.get();
    let regionName = user.regionName;
    let districtName = user.districtName;

    if (regionId) {
      const reg = dbData.regions.find((r) => r.id === regionId);
      if (reg) regionName = reg.name;
    }

    if (districtId) {
      const dist = dbData.districts.find((d) => d.id === districtId);
      if (dist) districtName = dist.name;
    }

    const updated = db.updateUser(user.id, {
      name: name?.trim() || user.name,
      surname: surname?.trim() || user.surname,
      bio: bio !== undefined ? bio.trim() : user.bio,
      phone: phone !== undefined ? phone.trim() : user.phone,
      interests: Array.isArray(interests) ? interests : user.interests,
      regionId: regionId || user.regionId,
      regionName,
      districtId: districtId || user.districtId,
      districtName,
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
