import { DayOfWeek } from './constants';

const TIMEZONE = 'Asia/Kolkata';

/**
 * Returns current date string YYYY-MM-DD in IST timezone.
 */
export function getTodayIST(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formatter = new Intl.DateTimeFormat('en-CA', options); // en-CA formats as YYYY-MM-DD
  return formatter.format(now);
}

/**
 * Gets day of week ('MON'|'TUE'|'WED'|'THU'|'FRI') for a YYYY-MM-DD string in IST.
 */
export function getDayOfWeekIST(dateStr: string): DayOfWeek {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)); // Midday UTC to avoid boundary drift

  const dayNames: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const options: Intl.DateTimeFormatOptions = {
    timeZone: TIMEZONE,
    weekday: 'short',
  };

  const weekdayShort = new Intl.DateTimeFormat('en-US', options).format(date).toUpperCase();
  
  if (weekdayShort.startsWith('MON')) return 'MON';
  if (weekdayShort.startsWith('TUE')) return 'TUE';
  if (weekdayShort.startsWith('WED')) return 'WED';
  if (weekdayShort.startsWith('THU')) return 'THU';
  if (weekdayShort.startsWith('FRI')) return 'FRI';

  return 'MON'; // Default fallback
}

/**
 * Formats YYYY-MM-DD into a clean readable string (e.g. "Thursday, 23 July 2026")
 */
export function formatDateDisplayIST(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  const options: Intl.DateTimeFormatOptions = {
    timeZone: TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

/**
 * Adds or subtracts days to a YYYY-MM-DD date string.
 */
export function addDaysIST(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0));

  const options: Intl.DateTimeFormatOptions = {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  return new Intl.DateTimeFormat('en-CA', options).format(date);
}
