import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { EventItem } from '@/lib/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const region = searchParams.get('region');

  let events = db.getEvents();

  if (category && category !== 'all') {
    events = events.filter((e) => e.category === category);
  }
  if (type && type !== 'all') {
    events = events.filter((e) => e.type === type);
  }
  if (region && region !== 'all') {
    events = events.filter((e) => e.regionId === region);
  }

  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, eventId } = body;

    if (action === 'rsvp') {
      if (!eventId) {
        return NextResponse.json({ error: 'Tadbir ID kiritilishi lozim' }, { status: 400 });
      }

      const res = db.toggleEventRSVP(eventId, user.id);
      const evt = db.getEvents().find((e) => e.id === eventId);

      if (res.registered && evt) {
        user.points = (user.points || 0) + 25;
        db.updateUser(user.id, { points: user.points });

        db.createNotification({
          id: `notif-${Date.now()}`,
          userId: user.id,
          title: `"${evt.title}" tadbiriga ro‘yxatdan o‘tdingiz!`,
          message: `${evt.date} soat ${evt.time} da bo‘lib o‘tadi. Joylashuv: ${evt.location}. +25 ball berildi.`,
          type: 'EVENT',
          link: '/tadbirlar',
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }

      return NextResponse.json({ success: true, ...res });
    }

    // Create event (by coordinator / admin / mentor)
    const {
      title,
      description,
      category,
      date,
      time,
      type,
      location,
      capacity = 100,
    } = body;

    if (!title || !description || !date || !time || !location) {
      return NextResponse.json({ error: 'Barcha ma’lumotlarni to‘ldiring' }, { status: 400 });
    }

    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category: category || 'it-innovatsiya',
      date,
      time,
      type: type || 'ONLINE',
      location,
      regionId: user.regionId,
      regionName: user.regionName,
      organizer: `${user.name} ${user.surname}`,
      organizerRole: user.role === 'USER' ? 'Tashabbuskor yosh' : user.role,
      capacity: Number(capacity),
      attendees: [user.id],
      coverGradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    };

    const data = db.get();
    data.events.unshift(newEvent);
    db.save(data);

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    return NextResponse.json({ error: 'Tadbir amaliyotida xatolik' }, { status: 500 });
  }
}
