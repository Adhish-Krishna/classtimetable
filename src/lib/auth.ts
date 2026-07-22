import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'classtimetable_super_secret_access_jwt_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'classtimetable_super_secret_refresh_jwt_key_2026';

export interface TokenPayload {
  username: string;
  role: 'admin' | 'rep';
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookies(payload: TokenPayload) {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const cookieStore = await cookies();

  // Short term access cookie (15 min)
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 minutes
  });

  // Long term refresh cookie (7 days)
  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

export async function getAuthUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (accessToken) {
    const payload = verifyAccessToken(accessToken);
    if (payload) return payload;
  }

  // If access token expired, attempt refresh
  const refreshToken = cookieStore.get('refresh_token')?.value;
  if (refreshToken) {
    const payload = verifyRefreshToken(refreshToken);
    if (payload) {
      // Refresh the cookies
      await setAuthCookies({ username: payload.username, role: payload.role });
      return payload;
    }
  }

  return null;
}
