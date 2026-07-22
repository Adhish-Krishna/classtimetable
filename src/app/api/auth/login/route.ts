import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { verifyPassword, setAuthCookies, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username/Roll number and password are required' }, { status: 400 });
    }

    const cleanUsername = username.trim().toUpperCase();

    // Check fixed admin from env if DB is empty or fallback
    const envAdminUsername = (process.env.ADMIN_USERNAME || 'ADMIN').toUpperCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (cleanUsername === envAdminUsername && password === envAdminPassword) {
      // Ensure admin exists in DB
      let admin = await User.findOne({ username: envAdminUsername });
      if (!admin) {
        const passwordHash = await hashPassword(envAdminPassword);
        admin = await User.create({ username: envAdminUsername, passwordHash, role: 'admin' });
      }

      await setAuthCookies({ username: envAdminUsername, role: 'admin' });
      return NextResponse.json({
        success: true,
        user: { username: envAdminUsername, role: 'admin' },
      });
    }

    // Otherwise check DB user
    const user = await User.findOne({ username: cleanUsername });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials or user not registered' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await setAuthCookies({ username: user.username, role: user.role });

    return NextResponse.json({
      success: true,
      user: { username: user.username, role: user.role },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
