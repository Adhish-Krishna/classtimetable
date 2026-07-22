'use client';

import React, { useState } from 'react';
import { INITIAL_COURSES } from '@/lib/constants';
import { BookOpen, User, ChevronDown, ChevronUp } from 'lucide-react';

export default function CourseLegend() {
  const [isOpen, setIsOpen] = useState(false);
  const coursesList = Object.values(INITIAL_COURSES);

  // Helper to pick exact matching color theme for each course
  const getCourseStyle = (code: string) => {
    const cleanCode = code.toUpperCase();
    if (cleanCode === 'LIB' || cleanCode === 'TWM') {
      return {
        card: 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300',
        badge: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60',
      };
    }
    if (cleanCode === '23N710' || cleanCode === '23N711') {
      return {
        card: 'bg-rose-950/30 border-rose-800/80 text-rose-300',
        badge: 'bg-rose-900/60 text-rose-300 border-rose-700/60',
      };
    }
    if (cleanCode === '23N003') {
      return {
        card: 'bg-indigo-950/30 border-indigo-800/80 text-indigo-300',
        badge: 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60',
      };
    }
    if (cleanCode === '23N014') {
      return {
        card: 'bg-sky-950/30 border-sky-800/80 text-sky-300',
        badge: 'bg-sky-900/60 text-sky-300 border-sky-700/60',
      };
    }
    if (cleanCode === '23N017') {
      return {
        card: 'bg-purple-950/30 border-purple-800/80 text-purple-300',
        badge: 'bg-purple-900/60 text-purple-300 border-purple-700/60',
      };
    }
    if (cleanCode === '23N020') {
      return {
        card: 'bg-amber-950/30 border-amber-800/80 text-amber-300',
        badge: 'bg-amber-900/60 text-amber-300 border-amber-700/60',
      };
    }
    if (cleanCode === '23N701') {
      return {
        card: 'bg-fuchsia-950/30 border-fuchsia-800/80 text-fuchsia-300',
        badge: 'bg-fuchsia-900/60 text-fuchsia-300 border-fuchsia-700/60',
      };
    }
    if (cleanCode === '23N002') {
      return {
        card: 'bg-orange-950/30 border-orange-800/80 text-orange-300',
        badge: 'bg-orange-900/60 text-orange-300 border-orange-700/60',
      };
    }
    return {
      card: 'bg-zinc-900/40 border-zinc-800 text-zinc-300',
      badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    };
  };

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow-xs text-zinc-100 overflow-hidden font-sans">
      {/* Collapsible Trigger Bar */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 bg-zinc-900/60 hover:bg-zinc-900 transition text-left"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-zinc-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Course Catalog & Faculty Legend ({coursesList.length})
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-400 font-semibold">
          <span>{isOpen ? 'Hide Legend' : 'Show Legend'}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 border-t border-zinc-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {coursesList.map((course) => {
              const theme = getCourseStyle(course.code);
              return (
                <div
                  key={course.code}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition ${theme.card}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono font-bold text-sm text-white">
                        {course.code}
                      </span>
                      <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${theme.badge}`}>
                        {course.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-200 line-clamp-2 leading-tight">
                      {course.title}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <User className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{course.staffName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
