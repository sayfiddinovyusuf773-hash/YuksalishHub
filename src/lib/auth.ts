import { cookies } from 'next/headers';
import { db } from './db';
import { User, UserRole } from './types';

const SESSION_COOKIE_NAME = 'ufq_session_token';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    // Simple robust encoded session { userId, exp }
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);

    if (!parsed.userId || parsed.exp < Date.now()) {
      return null;
    }

    const user = db.getUserById(parsed.userId);
    return user || null;
  } catch (error) {
    return null;
  }
}

export function createSessionToken(userId: string): string {
  const payload = {
    userId,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function setAuthCookie(userId: string) {
  const cookieStore = await cookies();
  const token = createSessionToken(userId);
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function hasPermission(
  user: User | null,
  requiredRole: UserRole | UserRole[],
  regionId?: string
): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (user.role === 'REGIONAL_COORDINATOR') {
    if (roles.includes('REGIONAL_COORDINATOR')) {
      if (!regionId || user.regionId === regionId) {
        return true;
      }
    }
  }

  return roles.includes(user.role);
}
