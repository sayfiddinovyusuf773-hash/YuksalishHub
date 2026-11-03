import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Book, BookChapter } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 });
  }

  const books = db.getBooks();
  return NextResponse.json({ books });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Faqat Bosh Administrator bajara oladi' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    // Action: Add new chapter to an existing book
    if (action === 'add-chapter') {
      const { bookId, title, content, pageStart } = body;
      if (!bookId || !title || !content) {
        return NextResponse.json({ error: 'Kitob, bob sarlavhasi va matni talab qilinadi' }, { status: 400 });
      }

      const newChapter: BookChapter = {
        id: `ch-${Date.now()}`,
        title: title.trim(),
        pageStart: Number(pageStart) || 1,
        content: content.trim(),
      };

      const success = db.addChapterToBook(bookId, newChapter);
      if (!success) {
        return NextResponse.json({ error: 'Kitob topilmadi' }, { status: 404 });
      }

      return NextResponse.json({ success: true, chapter: newChapter });
    }

    // Action: Create a brand new book
    const { title, author, category, pages, description, coverColor } = body;
    if (!title || !author || !category) {
      return NextResponse.json({ error: 'Sarlavha, muallif va toifa talab qilinadi' }, { status: 400 });
    }

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      pages: Number(pages) || 200,
      description: description?.trim() || 'Yuksalish Hub kutubxonasiga yangi qo‘shilgan asar.',
      coverColor: coverColor || '#312E81',
      rating: 5.0,
      reviewsCount: 0,
      chapters: [
        {
          id: `ch-${Date.now()}-1`,
          title: '1-bob: Kirish va Muqaddima',
          pageStart: 1,
          content: `${title} asarining birinchi bobi. Mutolaadan bahramand bo‘ling!`,
        },
      ],
    };

    db.createBook(newBook);
    return NextResponse.json({ success: true, book: newBook });
  } catch (error) {
    return NextResponse.json({ error: 'Kitob amaliyotida xatolik' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    // Action: Update a specific chapter
    if (action === 'update-chapter') {
      const { bookId, chapterId, title, content } = body;
      const success = db.updateChapterInBook(bookId, chapterId, { title, content });
      return NextResponse.json({ success });
    }

    // Action: Update book metadata
    const { bookId, ...updates } = body;
    const updated = db.updateBook(bookId, updates);
    return NextResponse.json({ success: true, book: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Yangilashda xatolik' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');
    const chapterId = searchParams.get('chapterId');

    if (!bookId) {
      return NextResponse.json({ error: 'bookId talab qilinadi' }, { status: 400 });
    }

    if (chapterId) {
      const success = db.deleteChapterFromBook(bookId, chapterId);
      return NextResponse.json({ success });
    } else {
      const success = db.deleteBook(bookId);
      return NextResponse.json({ success });
    }
  } catch (error) {
    return NextResponse.json({ error: 'O‘chirishda xatolik' }, { status: 500 });
  }
}
