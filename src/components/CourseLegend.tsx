'use client';

import React from 'react';
import { INITIAL_COURSES } from '@/lib/constants';
import { BookOpen, User, Tag } from 'lucide-react';

export default function CourseLegend() {
  const coursesList = Object.values(INITIAL_COURSES);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Course Catalog & Faculty Legend</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              BE COMPUTER SCIENCE & ENGINEERING (ARTIFICIAL INTELLIGENCE & MACHINE LEARNING) - Sem 7
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {coursesList.map((course) => (
          <div
            key={course.code}
            className={`p-3.5 rounded-2xl border transition hover:shadow-xs flex flex-col justify-between ${course.colorTheme.bg} ${course.colorTheme.border}`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={`font-mono font-extrabold text-sm ${course.colorTheme.text}`}>
                  {course.code}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${course.colorTheme.badge}`}>
                  {course.type}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                {course.title}
              </h4>
            </div>

            <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
              <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-medium">{course.staffName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
