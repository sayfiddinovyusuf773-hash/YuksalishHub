import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Community } from '@/lib/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const direction = searchParams.get('direction');
  const region = searchParams.get('region');
  const search = searchParams.get('q');

  let communities = db.getCommunities();

  if (direction && direction !== 'all') {
    communities = communities.filter((c) => c.directionId === direction);
  }

  if (region && region !== 'all') {
    communities = communities.filter((c) => c.regionId === region);
  }

  if (search) {
    const q = search.toLowerCase();
    communities = communities.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ communities });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, directionId, regionId } = body;

    if (!title || !description || !directionId) {
      return NextResponse.json({ error: 'Barcha maydonlarni to‘ldiring' }, { status: 400 });
    }

    const region = regionId ? db.get().regions.find((r) => r.id === regionId) : undefined;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const newCommunity: Community = {
      id: `com-${Date.now()}`,
      title: title.trim(),
      slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`,
      description: description.trim(),
      directionId,
      regionId,
      regionName: region?.name,
      memberCount: 1,
      coordinatorId: user.id,
      coordinatorName: `${user.name} ${user.surname}`,
      coverImage: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      createdAt: new Date().toISOString(),
      members: [user.id],
    };

    const data = db.get();
    data.communities.unshift(newCommunity);
    db.save(data);

    return NextResponse.json({ success: true, community: newCommunity });
  } catch (error) {
    return NextResponse.json({ error: 'Hamjamiyat yaratishda xatolik' }, { status: 500 });
  }
}
