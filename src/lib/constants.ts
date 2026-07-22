export interface PeriodInfo {
  number: number;
  time: string;
}

// 8 Active Periods (8:30 AM - 5:10 PM)
export const PERIODS: PeriodInfo[] = [
  { number: 1, time: "8.30 - 9.20" },
  { number: 2, time: "9.20 - 10.10" },
  { number: 3, time: "10.30 - 11.20" },
  { number: 4, time: "11.20 - 12.10" },
  { number: 5, time: "1.40 - 2.30" },
  { number: 6, time: "2.30 - 3.20" },
  { number: 7, time: "3.30 - 4.20" },
  { number: 8, time: "4.20 - 5.10" },
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
      bg: "bg-emerald-950/30",
      border: "border-emerald-800/80",
      text: "text-emerald-300",
      badge: "bg-emerald-900/60 text-emerald-300 border-emerald-700/60",
      hex: "#10b981",
    },
  },
  TWM: {
    code: "TWM",
    title: "TUTOR WARD MEETING",
    staffName: "SATHIYAPRIYA K",
    type: "free",
    colorTheme: {
      bg: "bg-emerald-950/30",
      border: "border-emerald-800/80",
      text: "text-emerald-300",
      badge: "bg-emerald-900/60 text-emerald-300 border-emerald-700/60",
      hex: "#059669",
    },
  },
  "23N710": {
    code: "23N710",
    title: "BIG DATA AND ADVANCED DATABASE SYSTEMS LABORATORY",
    staffName: "KARTHIKA L / THIRUMAHAL R / ARCHANA K / VIVEKA C",
    type: "lab",
    colorTheme: {
      bg: "bg-rose-950/30",
      border: "border-rose-800/80",
      text: "text-rose-300",
      badge: "bg-rose-900/60 text-rose-300 border-rose-700/60",
      hex: "#ef4444",
    },
  },
  "23N711": {
    code: "23N711",
    title: "PROJECT WORK - I",
    staffName: "SATHIYAPRIYA K / SURIYA S",
    type: "lab",
    colorTheme: {
      bg: "bg-rose-950/30",
      border: "border-rose-800/80",
      text: "text-rose-300",
      badge: "bg-rose-900/60 text-rose-300 border-rose-700/60",
      hex: "#dc2626",
    },
  },
  "23N003": {
    code: "23N003",
    title: "RECOMMENDER SYSTEMS",
    staffName: "SARANYA K G",
    type: "theory",
    colorTheme: {
      bg: "bg-indigo-950/30",
      border: "border-indigo-800/80",
      text: "text-indigo-300",
      badge: "bg-indigo-900/60 text-indigo-300 border-indigo-700/60",
      hex: "#6366f1",
    },
  },
  "23N014": {
    code: "23N014",
    title: "CLOUD COMPUTING",
    staffName: "ANNE MERIN MATHEW",
    type: "theory",
    colorTheme: {
      bg: "bg-sky-950/30",
      border: "border-sky-800/80",
      text: "text-sky-300",
      badge: "bg-sky-900/60 text-sky-300 border-sky-700/60",
      hex: "#0ea5e9",
    },
  },
  "23N017": {
    code: "23N017",
    title: "COMPUTER VISION",
    staffName: "ARCHANA K",
    type: "theory",
    colorTheme: {
      bg: "bg-purple-950/30",
      border: "border-purple-800/80",
      text: "text-purple-300",
      badge: "bg-purple-900/60 text-purple-300 border-purple-700/60",
      hex: "#a855f7",
    },
  },
  "23N020": {
    code: "23N020",
    title: "GENERATIVE AI",
    staffName: "ANASWARA C",
    type: "theory",
    colorTheme: {
      bg: "bg-amber-950/30",
      border: "border-amber-800/80",
      text: "text-amber-300",
      badge: "bg-amber-900/60 text-amber-300 border-amber-700/60",
      hex: "#f59e0b",
    },
  },
  "23N701": {
    code: "23N701",
    title: "BIG DATA AND ADVANCED DATABASE SYSTEMS",
    staffName: "THIRUMAHAL R",
    type: "theory",
    colorTheme: {
      bg: "bg-fuchsia-950/30",
      border: "border-fuchsia-800/80",
      text: "text-fuchsia-300",
      badge: "bg-fuchsia-900/60 text-fuchsia-300 border-fuchsia-700/60",
      hex: "#d946ef",
    },
  },
  "23N002": {
    code: "23N002",
    title: "DESIGN THINKING",
    staffName: "ADLENE ANUSHA J",
    type: "theory",
    colorTheme: {
      bg: "bg-orange-950/30",
      border: "border-orange-800/80",
      text: "text-orange-300",
      badge: "bg-orange-900/60 text-orange-300 border-orange-700/60",
      hex: "#f97316",
    },
  },
};

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
