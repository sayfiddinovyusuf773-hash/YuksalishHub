import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: 'postId talab qilinadi' }, { status: 400 });
    }

    const result = db.togglePostLike(postId, user.id);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}
