import { NextRequest, NextResponse } from 'next/server';
import { resolveTimetableForDate, resolveFullWeeklyGrid } from '@/lib/timetable-resolver';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    const mode = searchParams.get('mode') || 'single'; // 'single' or 'week'

    const todayStr = new Date().toISOString().split('T')[0];
    const targetDate = dateParam || todayStr;

    if (mode === 'week') {
      const grid = await resolveFullWeeklyGrid(targetDate);
      return NextResponse.json({ success: true, date: targetDate, mode: 'week', grid });
    }

    const timetableData = await resolveTimetableForDate(targetDate);
    return NextResponse.json({ success: true, mode: 'single', ...timetableData });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
