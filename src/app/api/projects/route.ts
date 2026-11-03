import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Project, ProjectStatus } from '@/lib/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const region = searchParams.get('region');
  const search = searchParams.get('q');

  let projects = db.getProjects();

  if (category && category !== 'all') {
    projects = projects.filter((p) => p.category === category);
  }
  if (status && status !== 'all') {
    projects = projects.filter((p) => p.status === status);
  }
  if (region && region !== 'all') {
    projects = projects.filter((p) => p.regionId === region);
  }
  if (search) {
    const q = search.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tish zarur' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    // Action 1: Join project team
    if (action === 'join-team') {
      const { projectId, role } = body;
      if (!projectId || !role) {
        return NextResponse.json({ error: 'Loyiha va lavozimni ko‘rsating' }, { status: 400 });
      }

      const success = db.joinProjectTeam(projectId, {
        userId: user.id,
        name: `${user.name} ${user.surname}`,
        role: role.trim(),
      });

      if (!success) {
        return NextResponse.json({ error: 'Siz allaqachon ushbu jamoa a’zosisiz' }, { status: 400 });
      }

      // Award achievement & points
      user.points = (user.points || 0) + 50;
      db.updateUser(user.id, { points: user.points });

      const proj = db.getProjectById(projectId);
      db.createNotification({
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: `"${proj?.title}" jamoasiga qo‘shildingiz!`,
        message: `Siz muvaffaqiyatli tarzda "${role}" vazifasini qabul qildingiz. +50 rivojlanish bali berildi.`,
        type: 'PROJECT',
        link: `/loyihalar/${projectId}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true });
    }

    // Action 2: Create project
    const {
      title,
      summary,
      description,
      category,
      neededRoles = [],
      regionId,
      districtName,
    } = body;

    if (!title || !summary || !description || !category) {
      return NextResponse.json({ error: 'Barcha asosiy maydonlarni to‘ldiring' }, { status: 400 });
    }

    const reg = db.get().regions.find((r) => r.id === (regionId || user.regionId));

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      category,
      regionId: reg?.id || user.regionId,
      regionName: reg?.name || user.regionName,
      districtName: districtName || user.districtName,
      authorId: user.id,
      authorName: `${user.name} ${user.surname}`,
      status: 'Jamoa shakllanmoqda',
      progressPercent: 10,
      neededRoles: Array.isArray(neededRoles) ? neededRoles : ['Dasturchi', 'Dizayner'],
      members: [
        {
          userId: user.id,
          name: `${user.name} ${user.surname}`,
          role: 'Loyiha muallifi',
          joinedAt: new Date().toISOString().split('T')[0],
        },
      ],
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          title: 'Loyiha konsepsiyasini tasdiqlash',
          isCompleted: true,
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        },
        {
          id: `m-${Date.now()}-2`,
          title: 'Jamoani to‘liq shakllantirish',
          isCompleted: false,
          dueDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
        },
      ],
      createdAt: new Date().toISOString(),
      coverGradient: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    };

    db.createProject(newProject);

    // Award +100 points for creating project
    user.points = (user.points || 0) + 100;
    db.updateUser(user.id, { points: user.points });

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    console.error('Project API error:', error);
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}
