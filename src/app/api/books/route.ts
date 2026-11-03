import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ReadingLog } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  const books = db.getBooks();
  const userLogs = user ? db.getUserReadingLogs(user.id) : [];

  return NextResponse.json({ books, userLogs });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bookId, currentPage, status, review, rating } = body;

    const book = db.getBooks().find((b) => b.id === bookId);
    if (!book) {
      return NextResponse.json({ error: 'Kitob topilmadi' }, { status: 404 });
    }

    const log: ReadingLog = {
      id: `rl-${user.id}-${bookId}`,
      userId: user.id,
      bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      currentPage: Number(currentPage) || 0,
      totalPages: book.pages,
      status: status || (Number(currentPage) >= book.pages ? 'Tugatildi' : 'O‘qilmoqda'),
      updatedAt: new Date().toISOString().split('T')[0],
      review: review?.trim() || undefined,
      rating: rating ? Number(rating) : undefined,
    };

    db.updateReadingLog(log);

    // If completed, award points and check achievement
    if (log.status === 'Tugatildi') {
      user.points = (user.points || 0) + 50;
      db.updateUser(user.id, { points: user.points });

      db.createNotification({
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: `Tabriklaymiz! "${book.title}" kitobini yakunladingiz!`,
        message: 'Mutolaa qat’iyatingiz uchun +50 rivojlanish bali qo‘shildi. Yangi asarlarni o‘qishda davom eting.',
        type: 'SUCCESS',
        link: '/yonalishlar/kitobxonlik',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, log });
  } catch (error) {
    return NextResponse.json({ error: 'Kitob mutolaasini saqlashda xatolik' }, { status: 500 });
  }
}
