import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import MasterSlot from '@/lib/models/MasterSlot';
import SlotOverride, { RecurrenceType } from '@/lib/models/SlotOverride';
import { getAuthUser } from '@/lib/auth';
import { DayOfWeek } from '@/lib/constants';

interface SlotEditPayload {
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  courseCode: string;
  venue?: string;
  staffName?: string;
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'rep')) {
      return NextResponse.json({ error: 'Unauthorized. Class Rep or Admin role required.' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();

    const {
      isPermanent = false,
      recurrenceType = 'single_date' as RecurrenceType,
      specificDate,
      startDate,
      endDate,
      slots = [],
    }: {
      isPermanent?: boolean;
      recurrenceType?: RecurrenceType;
      specificDate?: string;
      startDate?: string;
      endDate?: string;
      slots: SlotEditPayload[];
    } = body;

    if (!slots || slots.length === 0) {
      return NextResponse.json({ error: 'At least one slot edit must be specified.' }, { status: 400 });
    }

    if (isPermanent) {
      // Update Master Slots directly
      for (const slot of slots) {
        await MasterSlot.findOneAndUpdate(
          { dayOfWeek: slot.dayOfWeek, periodNumber: slot.periodNumber },
          {
            dayOfWeek: slot.dayOfWeek,
            periodNumber: slot.periodNumber,
            courseCode: slot.courseCode.trim().toUpperCase(),
            venue: (slot.venue || '').trim(),
            staffName: (slot.staffName || '').trim(),
          },
          { upsert: true, new: true }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Successfully updated ${slots.length} master slot(s) permanently.`,
      });
    }

    // Temporary or Recurring Override
    if (recurrenceType === 'single_date' && !specificDate) {
      return NextResponse.json({ error: 'Specific date is required for single date overrides.' }, { status: 400 });
    }

    if ((recurrenceType === 'single_week' || recurrenceType === 'repeat_until_date') && (!startDate || !endDate)) {
      return NextResponse.json({ error: 'Start date and End date are required for weekly overrides.' }, { status: 400 });
    }

    const batchId = `batch_${Date.now()}`;

    for (const slot of slots) {
      await SlotOverride.create({
        dayOfWeek: slot.dayOfWeek,
        periodNumber: slot.periodNumber,
        recurrenceType,
        specificDate: recurrenceType === 'single_date' ? specificDate : null,
        startDate: recurrenceType !== 'single_date' ? startDate : null,
        endDate: recurrenceType !== 'single_date' ? endDate : null,
        courseCode: slot.courseCode.trim().toUpperCase(),
        venue: (slot.venue || '').trim(),
        staffName: (slot.staffName || '').trim(),
        batchId,
        updatedBy: authUser.username,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${slots.length} temporary/recurring slot override(s).`,
      batchId,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE an override by ID or batchId
export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'rep')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const overrideId = searchParams.get('id');
    const batchId = searchParams.get('batchId');

    if (batchId) {
      await SlotOverride.deleteMany({ batchId });
      return NextResponse.json({ success: true, message: 'Batch overrides removed.' });
    }

    if (overrideId) {
      await SlotOverride.findByIdAndDelete(overrideId);
      return NextResponse.json({ success: true, message: 'Slot override removed.' });
    }

    return NextResponse.json({ error: 'Specify overrideId or batchId to delete.' }, { status: 400 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
