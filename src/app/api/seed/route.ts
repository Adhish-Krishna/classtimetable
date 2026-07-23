import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';
import MasterSlot from '@/lib/models/MasterSlot';
import { hashPassword } from '@/lib/auth';
import { INITIAL_COURSES, INITIAL_MASTER_SLOTS } from '@/lib/constants';
import { invalidateTimetableCache } from '@/lib/cache';

export async function POST() {
  try {
    await connectToDatabase();

    const adminUsername = (process.env.ADMIN_USERNAME || 'ADMIN').toUpperCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    let adminUser = await User.findOne({ username: adminUsername });
    if (!adminUser) {
      const passwordHash = await hashPassword(adminPassword);
      adminUser = await User.create({
        username: adminUsername,
        passwordHash,
        role: 'admin',
      });
    }

    for (const cCode of Object.keys(INITIAL_COURSES)) {
      const c = INITIAL_COURSES[cCode];
      await Course.findOneAndUpdate(
        { code: c.code },
        { code: c.code, title: c.title, staffName: c.staffName, type: c.type },
        { upsert: true, new: true }
      );
    }

    const count = await MasterSlot.countDocuments();
    if (count === 0) {
      await MasterSlot.insertMany(INITIAL_MASTER_SLOTS);
    }

    invalidateTimetableCache();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      adminUsername,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
