'use client';

import React from 'react';
import { INITIAL_COURSES } from '@/lib/constants';
import { BookOpen, User } from 'lucide-react';

export default function CourseLegend() {
  const coursesList = Object.values(INITIAL_COURSES);

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 shadow-xs space-y-4 text-zinc-100">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Course Catalog & Faculty Legend</h2>
            <p className="text-xs text-zinc-400">
              BE COMPUTER SCIENCE & ENGINEERING (ARTIFICIAL INTELLIGENCE & MACHINE LEARNING) - Sem 7
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {coursesList.map((course) => (
          <div
            key={course.code}
            className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono font-bold text-sm text-white">
                  {course.code}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {course.type}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-zinc-200 line-clamp-2 leading-tight">
                {course.title}
              </h4>
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center gap-1.5 text-[11px] text-zinc-400">
              <User className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{course.staffName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
