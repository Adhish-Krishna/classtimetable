import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import AllowedRep from '@/lib/models/AllowedRep';
import { hashPassword, setAuthCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { rollNo, password } = await req.json();

    if (!rollNo || !password) {
      return NextResponse.json({ error: 'Roll number and password are required' }, { status: 400 });
    }

    const cleanRollNo = rollNo.trim().toUpperCase();

    if (password.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters long' }, { status: 400 });
    }

    // Check if roll number is allowed by Admin
    const allowed = await AllowedRep.findOne({ rollNo: cleanRollNo });
    if (!allowed) {
      return NextResponse.json(
        { error: 'Roll number is not authorized as a Class Rep by the Global Admin.' },
        { status: 403 }
      );
    }

    if (allowed.isRegistered) {
      return NextResponse.json(
        { error: 'This Class Rep account is already registered. Please log in.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username: cleanRollNo });
    if (existingUser) {
      return NextResponse.json({ error: 'User account already exists.' }, { status: 400 });
    }

    // Create Rep User
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      username: cleanRollNo,
      passwordHash,
      role: 'rep',
    });

    // Mark AllowedRep as registered
    allowed.isRegistered = true;
    await allowed.save();

    await setAuthCookies({ username: user.username, role: 'rep' });

    return NextResponse.json({
      success: true,
      user: { username: user.username, role: 'rep' },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
