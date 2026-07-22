import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import AllowedRep from '@/lib/models/AllowedRep';
import User from '@/lib/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    await connectToDatabase();
    const reps = await AllowedRep.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, reps });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    await connectToDatabase();
    const { rollNo } = await req.json();

    if (!rollNo) {
      return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
    }

    const cleanRollNo = rollNo.trim().toUpperCase();

    const existing = await AllowedRep.findOne({ rollNo: cleanRollNo });
    if (existing) {
      return NextResponse.json({ error: 'Roll number is already added to Class Rep list.' }, { status: 400 });
    }

    const rep = await AllowedRep.create({
      rollNo: cleanRollNo,
      addedBy: authUser.username,
    });

    return NextResponse.json({ success: true, rep });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    await connectToDatabase();
    const { rollNo } = await req.json();

    if (!rollNo) {
      return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
    }

    const cleanRollNo = rollNo.trim().toUpperCase();

    await AllowedRep.deleteOne({ rollNo: cleanRollNo });
    await User.deleteOne({ username: cleanRollNo, role: 'rep' });

    return NextResponse.json({ success: true, message: `Class Rep ${cleanRollNo} removed successfully.` });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
