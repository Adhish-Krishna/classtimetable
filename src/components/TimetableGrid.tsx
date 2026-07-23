'use client';

import React, { useState } from 'react';
import { ResolvedSlot } from '@/lib/timetable-resolver';
import { DayOfWeek, DAYS_OF_WEEK, PERIODS } from '@/lib/constants';
import { formatDateDisplayIST, addDaysIST } from '@/lib/date-utils';
import SlotCard from './SlotCard';
import { Grid, ListFilter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface TimetableGridProps {
  singleDayData?: {
    date: string;
    dayOfWeek: DayOfWeek;
    slots: ResolvedSlot[];
  };
  weeklyGridData?: Record<DayOfWeek, ResolvedSlot[]>;
  canEdit: boolean;
  onEditSlot: (slot: ResolvedSlot) => void;
  onDragDropShift: (sourceSlot: ResolvedSlot, targetSlot: ResolvedSlot) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  isLoading?: boolean;
}

export default function TimetableGrid({
  singleDayData,
  weeklyGridData,
  canEdit,
  onEditSlot,
  onDragDropShift,
  selectedDate,
  onDateChange,
  isLoading = false,
}: TimetableGridProps) {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [activeMobileDay, setActiveMobileDay] = useState<DayOfWeek>(
    singleDayData?.dayOfWeek || 'MON'
  );

  const [draggedSlot, setDraggedSlot] = useState<ResolvedSlot | null>(null);
  const [selectedForSwap, setSelectedForSwap] = useState<ResolvedSlot | null>(null);

  // In Daily View: Navigate by 1 Day. In Weekly Matrix View: Navigate by 7 Days (1 Week).
  const handleDateStep = (direction: number) => {
    const stepAmount = viewMode === 'week' ? 7 : 1;
    const newDate = addDaysIST(selectedDate, direction * stepAmount);
    onDateChange(newDate);
  };

  const handleDragStart = (slot: ResolvedSlot) => {
    setDraggedSlot(slot);
  };

  const handleDropOnSlot = (targetSlot: ResolvedSlot) => {
    if (draggedSlot && (draggedSlot.periodNumber !== targetSlot.periodNumber || draggedSlot.dayOfWeek !== targetSlot.dayOfWeek)) {
      onDragDropShift(draggedSlot, targetSlot);
    }
    setDraggedSlot(null);
  };

  const handleSelectForSwap = (slot: ResolvedSlot) => {
    if (!canEdit) return;

    if (!selectedForSwap) {
      setSelectedForSwap(slot);
    } else if (selectedForSwap.periodNumber === slot.periodNumber && selectedForSwap.dayOfWeek === slot.dayOfWeek) {
      setSelectedForSwap(null);
    } else {
      onDragDropShift(selectedForSwap, slot);
      setSelectedForSwap(null);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Sleek Date Header & View Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
        {/* Date Selector & Navigation */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => handleDateStep(-1)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition flex items-center justify-center"
              title={viewMode === 'week' ? 'Previous Week' : 'Previous Day'}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDateStep(1)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition flex items-center justify-center"
              title={viewMode === 'week' ? 'Next Week' : 'Next Day'}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight">
              {formatDateDisplayIST(selectedDate)}
            </h2>
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            )}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setViewMode('day')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'day'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            <span>Daily View</span>
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'week'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Weekly Matrix</span>
          </button>
        </div>
      </div>

      {/* Loading Overlay or Grid */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-12 bg-zinc-950/40 rounded-2xl border border-zinc-800 text-zinc-400 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-xs font-mono font-medium">Loading schedule data...</p>
        </div>
      ) : (
        <>
          {/* Mode 1: Daily View (Mobile Optimized Tabs & Grid) */}
          {viewMode === 'day' && (
            <div>
              {/* Day Tabs selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
                {DAYS_OF_WEEK.map((day) => {
                  const isActive = (singleDayData?.dayOfWeek || activeMobileDay) === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setActiveMobileDay(day)}
                      className={`flex-1 min-w-[65px] py-1.5 px-3 rounded-xl text-xs font-mono font-bold transition text-center border ${
                        isActive
                          ? 'bg-white text-zinc-950 border-white shadow-xs'
                          : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-200'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Slots List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {(singleDayData?.slots || (weeklyGridData && weeklyGridData[activeMobileDay]) || []).map((slot) => (
                  <SlotCard
                    key={slot.periodNumber}
                    slot={slot}
                    canEdit={canEdit}
                    onEditSlot={onEditSlot}
                    onDragStartSlot={handleDragStart}
                    onDropOnSlot={handleDropOnSlot}
                    isSelectedForSwap={
                      selectedForSwap?.periodNumber === slot.periodNumber && selectedForSwap?.dayOfWeek === slot.dayOfWeek
                    }
                    onSelectForSwap={handleSelectForSwap}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mode 2: Full Weekly Matrix View */}
          {viewMode === 'week' && weeklyGridData && (
            <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xs">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800">
                    <th className="p-3 font-mono font-bold text-zinc-400 min-w-[90px]">
                      Time / Day
                    </th>
                    {DAYS_OF_WEEK.map((day) => (
                      <th key={day} className="p-3 font-mono font-bold text-center text-zinc-200 min-w-[160px] border-l border-zinc-800">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((period) => (
                    <tr key={period.number} className="border-b border-zinc-800/60 hover:bg-zinc-900/30">
                      <td className="p-2.5 bg-zinc-900/40 text-zinc-400 font-mono">
                        <div className="font-bold text-zinc-200">P{period.number}</div>
                        <div className="text-[10px] text-zinc-500">{period.time}</div>
                      </td>
                      {DAYS_OF_WEEK.map((day) => {
                        const slot = weeklyGridData[day]?.find((s) => s.periodNumber === period.number);
                        return (
                          <td key={day} className="p-1.5 border-l border-zinc-800/80 vertical-top">
                            {slot ? (
                              <SlotCard
                                slot={slot}
                                canEdit={canEdit}
                                onEditSlot={onEditSlot}
                                onDragStartSlot={handleDragStart}
                                onDropOnSlot={handleDropOnSlot}
                                isSelectedForSwap={
                                  selectedForSwap?.periodNumber === slot.periodNumber && selectedForSwap?.dayOfWeek === slot.dayOfWeek
                                }
                                onSelectForSwap={handleSelectForSwap}
                                compact={true}
                              />
                            ) : (
                              <div className="h-full min-h-[50px] rounded-lg border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-[10px]">
                                Empty
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
        </>
      )}
    </div>
  );
}
