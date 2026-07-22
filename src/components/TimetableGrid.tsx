'use client';

import React, { useState } from 'react';
import { ResolvedSlot } from '@/lib/timetable-resolver';
import { DayOfWeek, DAYS_OF_WEEK, PERIODS } from '@/lib/constants';
import SlotCard from './SlotCard';
import { Calendar as CalendarIcon, Grid, ListFilter, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface TimetableGridProps {
  singleDayData?: {
    date: string;
    dayOfWeek: DayOfWeek;
    slots: ResolvedSlot[];
  };
  weeklyGridData?: Record<DayOfWeek, ResolvedSlot[]>;
  canEdit: boolean;
  onEditSlot: (slot: ResolvedSlot) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function TimetableGrid({
  singleDayData,
  weeklyGridData,
  canEdit,
  onEditSlot,
  selectedDate,
  onDateChange,
}: TimetableGridProps) {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [activeMobileDay, setActiveMobileDay] = useState<DayOfWeek>(
    singleDayData?.dayOfWeek || 'MON'
  );

  // Helper to step date forward / backward
  const handleDateStep = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const dayNamesMap: Record<DayOfWeek, string> = {
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
  };

  return (
    <div className="space-y-6">
      {/* Top Control Bar: View Switcher & Mobile Day Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDateStep(-1)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Previous Day"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-center sm:text-left px-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{dayNamesMap[singleDayData?.dayOfWeek || activeMobileDay]}</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {selectedDate}
              </span>
            </h2>
          </div>
          <button
            onClick={() => handleDateStep(1)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Next Day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('day')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'day'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            <span>Daily View</span>
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'week'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Weekly Grid</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Daily View (Mobile Optimized Stack + Responsive Grid) */}
      {viewMode === 'day' && (
        <div>
          {/* Day Tabs selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {DAYS_OF_WEEK.map((day) => {
              const isActive = (singleDayData?.dayOfWeek || activeMobileDay) === day;
              return (
                <button
                  key={day}
                  onClick={() => setActiveMobileDay(day)}
                  className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-bold transition text-center border ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Slots List / Grid for Active Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {(singleDayData?.slots || (weeklyGridData && weeklyGridData[activeMobileDay]) || []).map((slot) => (
              <SlotCard
                key={slot.periodNumber}
                slot={slot}
                canEdit={canEdit}
                onEditSlot={onEditSlot}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Full Weekly Grid Matrix */}
      {viewMode === 'week' && weeklyGridData && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 font-bold text-slate-700 dark:text-slate-300 min-w-[100px]">
                  Period / Day
                </th>
                {DAYS_OF_WEEK.map((day) => (
                  <th key={day} className="p-3 font-extrabold text-center text-slate-800 dark:text-slate-200 min-w-[170px] border-l border-slate-200 dark:border-slate-800">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((period) => (
                <tr key={period.number} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-950/30">
                  <td className="p-2.5 font-medium bg-slate-50/50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400">
                    <div className="font-bold text-slate-800 dark:text-slate-200">Period {period.number}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{period.time}</div>
                  </td>
                  {DAYS_OF_WEEK.map((day) => {
                    const slot = weeklyGridData[day]?.find((s) => s.periodNumber === period.number);
                    return (
                      <td key={day} className="p-1.5 border-l border-slate-200 dark:border-slate-800 vertical-top">
                        {slot ? (
                          <SlotCard
                            slot={slot}
                            canEdit={canEdit}
                            onEditSlot={onEditSlot}
                            compact={true}
                          />
                        ) : (
                          <div className="h-full min-h-[60px] rounded-lg border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 text-[10px]">
                            Free
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend Banner */}
      <div className="flex flex-wrap items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
          <Info className="h-4 w-4 text-indigo-500" />
          <span>Color Key:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
          <span>Free Periods (LIB, TWM)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500"></span>
          <span>Lab / Project (23N710, 23N711)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-indigo-500"></span>
          <span>Theory Courses (Subject Colors)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-amber-400 ring-2 ring-amber-400/50 animate-pulse"></span>
          <span>Temporary Override Active</span>
        </div>
      </div>
    </div>
  );
}
