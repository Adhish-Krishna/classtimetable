export interface PeriodInfo {
  number: number;
  time: string;
}

export const PERIODS: PeriodInfo[] = [
  { number: 1, time: "8.30 - 9.20" },
  { number: 2, time: "9.20 - 10.10" },
  { number: 3, time: "10.30 - 11.20" },
  { number: 4, time: "11.20 - 12.10" },
  { number: 5, time: "1.40 - 2.30" },
  { number: 6, time: "2.30 - 3.20" },
  { number: 7, time: "3.30 - 4.20" },
  { number: 8, time: "4.20 - 5.10" },
  { number: 9, time: "5.30 - 6.20" },
  { number: 10, time: "6.20 - 7.10" },
  { number: 11, time: "7.15 - 8.05" },
  { number: 12, time: "8.05 - 8.55" },
];

export const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI"] as const;
export type DayOfWeek = typeof DAYS_OF_WEEK[number];

export interface InitialCourse {
  code: string;
  title: string;
  staffName: string;
  type: 'free' | 'lab' | 'theory';
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    hex: string;
  };
}

export const INITIAL_COURSES: Record<string, InitialCourse> = {
  LIB: {
    code: "LIB",
    title: "LIBRARY",
    staffName: "SATHIYAPRIYA K",
    type: "free",
    colorTheme: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/60",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-900 dark:text-emerald-200",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
      hex: "#10b981",
    },
  },
  TWM: {
    code: "TWM",
    title: "TUTOR WARD MEETING",
    staffName: "SATHIYAPRIYA K",
    type: "free",
    colorTheme: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/60",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-900 dark:text-emerald-200",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
      hex: "#059669",
    },
  },
  "23N710": {
    code: "23N710",
    title: "BIG DATA AND ADVANCED DATABASE SYSTEMS LABORATORY",
    staffName: "KARTHIKA L / THIRUMAHAL R / ARCHANA K / VIVEKA C",
    type: "lab",
    colorTheme: {
      bg: "bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-950/60",
      border: "border-rose-300 dark:border-rose-800",
      text: "text-rose-900 dark:text-rose-200",
      badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300",
      hex: "#ef4444",
    },
  },
  "23N711": {
    code: "23N711",
    title: "PROJECT WORK - I",
    staffName: "SATHIYAPRIYA K / SURIYA S",
    type: "lab",
    colorTheme: {
      bg: "bg-red-50 dark:bg-red-950/40 hover:bg-red-100/80 dark:hover:bg-red-950/60",
      border: "border-red-300 dark:border-red-800",
      text: "text-red-900 dark:text-red-200",
      badge: "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300",
      hex: "#dc2626",
    },
  },
  "23N003": {
    code: "23N003",
    title: "RECOMMENDER SYSTEMS",
    staffName: "SARANYA K G",
    type: "theory",
    colorTheme: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-950/60",
      border: "border-indigo-200 dark:border-indigo-800",
      text: "text-indigo-900 dark:text-indigo-200",
      badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300",
      hex: "#6366f1",
    },
  },
  "23N014": {
    code: "23N014",
    title: "CLOUD COMPUTING",
    staffName: "ANNE MERIN MATHEW",
    type: "theory",
    colorTheme: {
      bg: "bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100/80 dark:hover:bg-sky-950/60",
      border: "border-sky-200 dark:border-sky-800",
      text: "text-sky-900 dark:text-sky-200",
      badge: "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300",
      hex: "#0ea5e9",
    },
  },
  "23N017": {
    code: "23N017",
    title: "COMPUTER VISION",
    staffName: "ARCHANA K",
    type: "theory",
    colorTheme: {
      bg: "bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100/80 dark:hover:bg-purple-950/60",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-900 dark:text-purple-200",
      badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300",
      hex: "#a855f7",
    },
  },
  "23N020": {
    code: "23N020",
    title: "GENERATIVE AI",
    staffName: "ANASWARA C",
    type: "theory",
    colorTheme: {
      bg: "bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100/80 dark:hover:bg-amber-950/60",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-900 dark:text-amber-200",
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300",
      hex: "#f59e0b",
    },
  },
  "23N701": {
    code: "23N701",
    title: "BIG DATA AND ADVANCED DATABASE SYSTEMS",
    staffName: "THIRUMAHAL R",
    type: "theory",
    colorTheme: {
      bg: "bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100/80 dark:hover:bg-teal-950/60",
      border: "border-teal-200 dark:border-teal-800",
      text: "text-teal-900 dark:text-teal-200",
      badge: "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300",
      hex: "#14b8a6",
    },
  },
  "23N002": {
    code: "23N002",
    title: "DESIGN THINKING",
    staffName: "ADLENE ANUSHA J",
    type: "theory",
    colorTheme: {
      bg: "bg-violet-50 dark:bg-violet-950/40 hover:bg-violet-100/80 dark:hover:bg-violet-950/60",
      border: "border-violet-200 dark:border-violet-800",
      text: "text-violet-900 dark:text-violet-200",
      badge: "bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-300",
      hex: "#8b5cf6",
    },
  },
};

// Master schedule extracted precisely from timetable.png
export const INITIAL_MASTER_SLOTS = [
  // MON
  { dayOfWeek: "MON", periodNumber: 1, courseCode: "LIB", venue: "", staffName: "SATHIYAPRIYA K" },
  { dayOfWeek: "MON", periodNumber: 2, courseCode: "TWM", venue: "Q301", staffName: "SATHIYAPRIYA K" },
  { dayOfWeek: "MON", periodNumber: 3, courseCode: "23N020", venue: "Q301", staffName: "ANASWARA C" },
  { dayOfWeek: "MON", periodNumber: 4, courseCode: "23N017", venue: "Q301", staffName: "ARCHANA K" },
  { dayOfWeek: "MON", periodNumber: 5, courseCode: "23N711", venue: "*", staffName: "SATHIYAPRIYA K / SURIYA S" },
  { dayOfWeek: "MON", periodNumber: 6, courseCode: "23N711", venue: "*", staffName: "SATHIYAPRIYA K / SURIYA S" },
  { dayOfWeek: "MON", periodNumber: 7, courseCode: "23N711", venue: "*", staffName: "SATHIYAPRIYA K / SURIYA S" },
  { dayOfWeek: "MON", periodNumber: 8, courseCode: "23N711", venue: "*", staffName: "SATHIYAPRIYA K / SURIYA S" },

  // TUE
  { dayOfWeek: "TUE", periodNumber: 1, courseCode: "LIB", venue: "", staffName: "SATHIYAPRIYA K" },
  { dayOfWeek: "TUE", periodNumber: 2, courseCode: "23N701", venue: "Y202", staffName: "THIRUMAHAL R" },
  { dayOfWeek: "TUE", periodNumber: 3, courseCode: "23N003", venue: "Y202", staffName: "SARANYA K G" },
  { dayOfWeek: "TUE", periodNumber: 4, courseCode: "23N003", venue: "Y202", staffName: "SARANYA K G" },
  { dayOfWeek: "TUE", periodNumber: 5, courseCode: "23N014", venue: "Q301", staffName: "ANNE MERIN MATHEW" },
  { dayOfWeek: "TUE", periodNumber: 6, courseCode: "23N020", venue: "Q301", staffName: "ANASWARA C" },
  { dayOfWeek: "TUE", periodNumber: 7, courseCode: "LIB", venue: "", staffName: "SATHIYAPRIYA K" },

  // WED
  { dayOfWeek: "WED", periodNumber: 1, courseCode: "LIB", venue: "", staffName: "SATHIYAPRIYA K" },
  { dayOfWeek: "WED", periodNumber: 2, courseCode: "23N014", venue: "Q301", staffName: "ANNE MERIN MATHEW" },
  { dayOfWeek: "WED", periodNumber: 3, courseCode: "23N017", venue: "Q301", staffName: "ARCHANA K" },
  { dayOfWeek: "WED", periodNumber: 4, courseCode: "LIB", venue: "", staffName: "SATHIYAPRIYA K" },
  { dayOfWeek: "WED", periodNumber: 5, courseCode: "23N002", venue: "Q301", staffName: "ADLENE ANUSHA J" },
  { dayOfWeek: "WED", periodNumber: 6, courseCode: "23N002", venue: "Q301", staffName: "ADLENE ANUSHA J" },
  { dayOfWeek: "WED", periodNumber: 7, courseCode: "LIB", venue: "", staffName: "SATHIYAPRIYA K" },

  // THU
  { dayOfWeek: "THU", periodNumber: 1, courseCode: "LIB", venue: "", staffName: "SATHIYAPRIYA K" },
  { dayOfWeek: "THU", periodNumber: 2, courseCode: "23N701", venue: "Q301", staffName: "THIRUMAHAL R" },
  { dayOfWeek: "THU", periodNumber: 3, courseCode: "23N014", venue: "Q301", staffName: "ANNE MERIN MATHEW" },
  { dayOfWeek: "THU", periodNumber: 4, courseCode: "LIB", venue: "", staffName: "SATHIYAPRIYA K" },
  { dayOfWeek: "THU", periodNumber: 5, courseCode: "23N710", venue: "", staffName: "KARTHIKA L / THIRUMAHAL R / ARCHANA K / VIVEKA C" },
  { dayOfWeek: "THU", periodNumber: 6, courseCode: "23N710", venue: "", staffName: "KARTHIKA L / THIRUMAHAL R / ARCHANA K / VIVEKA C" },
  { dayOfWeek: "THU", periodNumber: 7, courseCode: "23N710", venue: "", staffName: "KARTHIKA L / THIRUMAHAL R / ARCHANA K / VIVEKA C" },
  { dayOfWeek: "THU", periodNumber: 8, courseCode: "23N710", venue: "", staffName: "KARTHIKA L / THIRUMAHAL R / ARCHANA K / VIVEKA C" },

  // FRI
  { dayOfWeek: "FRI", periodNumber: 1, courseCode: "LIB", venue: "", staffName: "SATHIYAPRIYA K" },
  { dayOfWeek: "FRI", periodNumber: 2, courseCode: "23N017", venue: "Q301", staffName: "ARCHANA K" },
  { dayOfWeek: "FRI", periodNumber: 3, courseCode: "23N002", venue: "Q301", staffName: "ADLENE ANUSHA J" },
  { dayOfWeek: "FRI", periodNumber: 4, courseCode: "23N020", venue: "Q301", staffName: "ANASWARA C" },
  { dayOfWeek: "FRI", periodNumber: 5, courseCode: "23N003", venue: "Y202", staffName: "SARANYA K G" },
  { dayOfWeek: "FRI", periodNumber: 6, courseCode: "23N701", venue: "Y202", staffName: "THIRUMAHAL R" },
  { dayOfWeek: "FRI", periodNumber: 7, courseCode: "LIB", venue: "", staffName: "SATHIYAPRIYA K" },
];
