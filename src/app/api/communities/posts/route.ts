import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { CommunityPost } from '@/lib/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const communityId = searchParams.get('communityId');

  if (!communityId) {
    return NextResponse.json({ error: 'communityId kerak' }, { status: 400 });
  }

  const posts = db.getPostsByCommunity(communityId);
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const { communityId, title, content } = await req.json();
    if (!communityId || !title || !content) {
      return NextResponse.json({ error: 'Barcha maydonlarni to‘ldiring' }, { status: 400 });
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      communityId,
      authorId: user.id,
      authorName: `${user.name} ${user.surname}`,
      authorRole: user.role,
      title: title.trim(),
      content: content.trim(),
      likes: [],
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.createPost(newPost);

    // Award user 15 XP for contributing
    user.points = (user.points || 0) + 15;
    db.updateUser(user.id, { points: user.points });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    return NextResponse.json({ error: 'Post yaratishda xatolik' }, { status: 500 });
  }
}
