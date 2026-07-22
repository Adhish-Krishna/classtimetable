'use client';

import React from 'react';
import { ResolvedSlot } from '@/lib/timetable-resolver';
import { INITIAL_COURSES } from '@/lib/constants';
import { MapPin, User as UserIcon, Clock, Edit2, AlertCircle } from 'lucide-react';

interface SlotCardProps {
  slot: ResolvedSlot;
  canEdit: boolean;
  onEditSlot?: (slot: ResolvedSlot) => void;
  compact?: boolean;
}

export default function SlotCard({ slot, canEdit, onEditSlot, compact = false }: SlotCardProps) {
  const courseCode = slot.courseCode.trim().toUpperCase();

  // Pick preset course color theme if available
  const coursePreset = INITIAL_COURSES[courseCode];
  const theme = coursePreset?.colorTheme || {
    bg: "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850",
    border: "border-slate-200 dark:border-slate-800",
    text: "text-slate-900 dark:text-slate-200",
    badge: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    hex: "#64748b",
  };

  const isFree = slot.type === 'free' || courseCode === 'LIB' || courseCode === 'TWM' || !courseCode;
  const isLab = slot.type === 'lab' || courseCode === '23N710' || courseCode === '23N711';

  return (
    <div
      className={`group relative rounded-xl p-3 border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${theme.bg} ${theme.border} ${
        slot.isOverride ? 'ring-2 ring-amber-400 dark:ring-amber-500 ring-offset-1' : ''
      }`}
    >
      {/* Top Header: Period # & Time / Badges */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300">
            P{slot.periodNumber}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
            <Clock className="h-3 w-3 inline" />
            {slot.time}
          </span>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1">
          {slot.isOverride && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500 text-white shadow-xs animate-pulse">
              <AlertCircle className="h-3 w-3" />
              Temp Override
            </span>
          )}

          {canEdit && onEditSlot && (
            <button
              onClick={() => onEditSlot(slot)}
              className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-white/80 dark:hover:bg-slate-800 transition opacity-80 group-hover:opacity-100"
              title="Edit Slot"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Course Code & Title */}
      <div className="my-1">
        {courseCode ? (
          <div>
            <div className="flex items-baseline justify-between gap-1">
              <h3 className={`font-extrabold text-sm sm:text-base tracking-tight ${theme.text}`}>
                {courseCode}
              </h3>
              {isFree && (
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200">
                  Free Period
                </span>
              )}
              {isLab && (
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-rose-200/60 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200">
                  Lab / Project
                </span>
              )}
            </div>
            {!compact && (
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1 mt-0.5">
                {slot.courseTitle}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic font-medium">Free / Empty Slot</p>
        )}
      </div>

      {/* Footer: Venue & Staff */}
      <div className="mt-2 pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 gap-2">
        {slot.venue ? (
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
            <MapPin className="h-3 w-3 text-indigo-500" />
            {slot.venue}
          </span>
        ) : (
          <span className="text-slate-400 dark:text-slate-600">-</span>
        )}

        {slot.staffName && !compact && (
          <span className="truncate max-w-[140px] flex items-center gap-1 text-slate-500 dark:text-slate-400" title={slot.staffName}>
            <UserIcon className="h-3 w-3 text-slate-400" />
            {slot.staffName.split('/')[0]}
          </span>
        )}
      </div>
    </div>
  );
}
