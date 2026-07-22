import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Course from '@/lib/models/Course';
import { INITIAL_COURSES } from '@/lib/constants';

export async function GET() {
  try {
    await connectToDatabase();
    const dbCourses = await Course.find().sort({ code: 1 }).lean();

    const courseMap: Record<string, any> = {};

    Object.values(INITIAL_COURSES).forEach((c) => {
      courseMap[c.code] = {
        code: c.code,
        title: c.title,
        staffName: c.staffName,
        type: c.type,
        colorTheme: c.colorTheme,
      };
    });

    dbCourses.forEach((c) => {
      courseMap[c.code] = {
        code: c.code,
        title: c.title,
        staffName: c.staffName,
        type: c.type,
        colorTheme: INITIAL_COURSES[c.code]?.colorTheme || {
          bg: 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100',
          border: 'border-slate-300 dark:border-slate-800',
          text: 'text-slate-900 dark:text-slate-200',
          badge: 'bg-slate-200 text-slate-800',
          hex: '#64748b',
        },
      };
    });

    return NextResponse.json({ success: true, courses: Object.values(courseMap) });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
