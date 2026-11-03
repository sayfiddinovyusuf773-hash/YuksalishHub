import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { PostComment } from '@/lib/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  if (!postId) return NextResponse.json({ comments: [] });
  const comments = db.getCommentsByPost(postId);
  return NextResponse.json({ comments });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const { postId, content } = await req.json();
    if (!postId || !content?.trim()) {
      return NextResponse.json({ error: 'Izoh matni talab qilinadi' }, { status: 400 });
    }

    const newComment: PostComment = {
      id: `comm-${Date.now()}`,
      postId,
      authorId: user.id,
      authorName: `${user.name} ${user.surname}`,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    db.createComment(newComment);
    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    return NextResponse.json({ error: 'Izoh qo‘shishda xatolik' }, { status: 500 });
  }
}
