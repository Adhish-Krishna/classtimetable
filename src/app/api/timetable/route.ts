import { NextRequest, NextResponse } from 'next/server';
import { resolveTimetableForDate, resolveFullWeeklyGrid } from '@/lib/timetable-resolver';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    const mode = searchParams.get('mode') || 'single';

    const todayStr = new Date().toISOString().split('T')[0];
    const targetDate = dateParam || todayStr;

    let responseData;

    if (mode === 'week') {
      const grid = await resolveFullWeeklyGrid(targetDate);
      responseData = { success: true, date: targetDate, mode: 'week', grid };
    } else {
      const timetableData = await resolveTimetableForDate(targetDate);
      responseData = { success: true, mode: 'single', ...timetableData };
    }

    const response = NextResponse.json(responseData);

    // Cache control for Vercel Edge CDN
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
