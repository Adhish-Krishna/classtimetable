import connectToDatabase from './db';
import MasterSlot from './models/MasterSlot';
import SlotOverride from './models/SlotOverride';
import Course from './models/Course';
import { DayOfWeek, INITIAL_COURSES, PERIODS } from './constants';

export interface ResolvedSlot {
  periodNumber: number;
  time: string;
  dayOfWeek: DayOfWeek;
  courseCode: string;
  courseTitle: string;
  staffName: string;
  venue: string;
  type: 'free' | 'lab' | 'theory';
  isOverride: boolean;
  overrideDetails?: {
    recurrenceType: 'single_date' | 'single_week' | 'repeat_until_date';
    specificDate?: string;
    startDate?: string;
    endDate?: string;
    batchId?: string;
    updatedBy?: string;
  };
}

export async function resolveTimetableForDate(dateStr: string, dayOfWeekOverride?: DayOfWeek) {
  await connectToDatabase();

  const targetDate = new Date(dateStr);
  const dayNames: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  
  // Get day of week from dateStr (0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat)
  const dayIndex = targetDate.getDay();
  let dayOfWeek: DayOfWeek = 'MON';

  if (dayOfWeekOverride && dayNames.includes(dayOfWeekOverride)) {
    dayOfWeek = dayOfWeekOverride;
  } else if (dayIndex >= 1 && dayIndex <= 5) {
    dayOfWeek = dayNames[dayIndex - 1];
  }

  // Fetch Master Slots for this day
  const masterSlots = await MasterSlot.find({ dayOfWeek }).lean();

  // Fetch Overrides for this day
  const rawOverrides = await SlotOverride.find({ dayOfWeek }).lean();

  // Filter overrides active on dateStr
  const activeOverrides = rawOverrides.filter((ov) => {
    if (ov.recurrenceType === 'single_date') {
      return ov.specificDate === dateStr;
    }
    if (ov.recurrenceType === 'single_week' || ov.recurrenceType === 'repeat_until_date') {
      if (!ov.startDate || !ov.endDate) return false;
      return dateStr >= ov.startDate && dateStr <= ov.endDate;
    }
    return false;
  });

  // Fetch courses catalog to resolve course details
  const dbCourses = await Course.find().lean();
  const courseMap: Record<string, { title: string; staffName: string; type: 'free' | 'lab' | 'theory' }> = {};

  // Populate course map with initial fallback + DB records
  Object.values(INITIAL_COURSES).forEach((c) => {
    courseMap[c.code] = { title: c.title, staffName: c.staffName, type: c.type };
  });

  dbCourses.forEach((c) => {
    courseMap[c.code] = { title: c.title, staffName: c.staffName, type: c.type };
  });

  // Build resolved period array (1..12)
  const resolvedSlots: ResolvedSlot[] = PERIODS.map((period) => {
    const override = activeOverrides.find((o) => o.periodNumber === period.number);

    if (override) {
      const cInfo = courseMap[override.courseCode] || {
        title: override.courseCode,
        staffName: override.staffName || '',
        type: 'theory' as const,
      };

      return {
        periodNumber: period.number,
        time: period.time,
        dayOfWeek,
        courseCode: override.courseCode,
        courseTitle: cInfo.title,
        staffName: override.staffName || cInfo.staffName,
        venue: override.venue,
        type: cInfo.type,
        isOverride: true,
        overrideDetails: {
          recurrenceType: override.recurrenceType,
          specificDate: override.specificDate,
          startDate: override.startDate,
          endDate: override.endDate,
          batchId: override.batchId,
          updatedBy: override.updatedBy,
        },
      };
    }

    const masterSlot = masterSlots.find((m) => m.periodNumber === period.number);
    if (masterSlot) {
      const cInfo = courseMap[masterSlot.courseCode] || {
        title: masterSlot.courseCode,
        staffName: masterSlot.staffName || '',
        type: 'theory' as const,
      };

      return {
        periodNumber: period.number,
        time: period.time,
        dayOfWeek,
        courseCode: masterSlot.courseCode,
        courseTitle: cInfo.title,
        staffName: masterSlot.staffName || cInfo.staffName,
        venue: masterSlot.venue,
        type: cInfo.type,
        isOverride: false,
      };
    }

    // Empty slot
    return {
      periodNumber: period.number,
      time: period.time,
      dayOfWeek,
      courseCode: '',
      courseTitle: 'Free / Empty Slot',
      staffName: '',
      venue: '',
      type: 'free' as const,
      isOverride: false,
    };
  });

  return {
    date: dateStr,
    dayOfWeek,
    slots: resolvedSlots,
  };
}

export async function resolveFullWeeklyGrid(dateStr: string) {
  const dayNames: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const grid: Record<DayOfWeek, ResolvedSlot[]> = {
    MON: [],
    TUE: [],
    WED: [],
    THU: [],
    FRI: [],
  };

  // Find Monday of the current week for dateStr
  const targetDate = new Date(dateStr);
  const dayIndex = targetDate.getDay(); // 0 = Sun
  const diffToMon = dayIndex === 0 ? -6 : 1 - dayIndex;
  
  const mondayDate = new Date(targetDate);
  mondayDate.setDate(targetDate.getDate() + diffToMon);

  for (let i = 0; i < 5; i++) {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    const formattedDate = d.toISOString().split('T')[0];
    const dayName = dayNames[i];
    
    const dayRes = await resolveTimetableForDate(formattedDate, dayName);
    grid[dayName] = dayRes.slots;
  }

  return grid;
}
