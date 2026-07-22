'use client';

import React, { useState, useEffect } from 'react';
import { DayOfWeek, DAYS_OF_WEEK, PERIODS } from '@/lib/constants';
import { ResolvedSlot } from '@/lib/timetable-resolver';
import { X, Plus, Trash2, Calendar, Sparkles, AlertCircle, Check } from 'lucide-react';

interface CourseOption {
  code: string;
  title: string;
  staffName: string;
}

interface BatchEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlot?: ResolvedSlot | null;
  courses: CourseOption[];
  onSaveSuccess: () => void;
  selectedDate: string;
}

interface SlotItem {
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  courseCode: string;
  venue: string;
  staffName: string;
}

export default function BatchEditDialog({
  isOpen,
  onClose,
  initialSlot,
  courses,
  onSaveSuccess,
  selectedDate,
}: BatchEditDialogProps) {
  const [isPermanent, setIsPermanent] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'single_date' | 'single_week' | 'repeat_until_date'>('single_date');
  
  const [specificDate, setSpecificDate] = useState(selectedDate);
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);

  const [slotsToEdit, setSlotsToEdit] = useState<SlotItem[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialSlot) {
      setSlotsToEdit([
        {
          dayOfWeek: initialSlot.dayOfWeek,
          periodNumber: initialSlot.periodNumber,
          courseCode: initialSlot.courseCode,
          venue: initialSlot.venue,
          staffName: initialSlot.staffName,
        },
      ]);
    } else {
      setSlotsToEdit([
        {
          dayOfWeek: 'MON',
          periodNumber: 1,
          courseCode: courses[0]?.code || 'LIB',
          venue: '',
          staffName: courses[0]?.staffName || '',
        },
      ]);
    }
  }, [initialSlot, courses]);

  if (!isOpen) return null;

  const handleAddSlot = () => {
    setSlotsToEdit((prev) => [
      ...prev,
      {
        dayOfWeek: 'MON',
        periodNumber: (prev[prev.length - 1]?.periodNumber || 1) + 1,
        courseCode: courses[0]?.code || 'LIB',
        venue: '',
        staffName: courses[0]?.staffName || '',
      },
    ]);
  };

  const handleRemoveSlot = (index: number) => {
    setSlotsToEdit((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index: number, field: keyof SlotItem, value: any) => {
    setSlotsToEdit((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      // Auto populate staff name if course changes
      if (field === 'courseCode') {
        const found = courses.find((c) => c.code === value);
        if (found) {
          updated[index].staffName = found.staffName;
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/timetable/slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPermanent,
          recurrenceType,
          specificDate,
          startDate,
          endDate,
          slots: slotsToEdit,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save timetable changes.');
      }

      onSaveSuccess();
      onClose();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialSlot ? `Edit Slot P${initialSlot.periodNumber} (${initialSlot.dayOfWeek})` : 'Batch Shift / Update Classes'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Modify venue, course, or period slots permanently or temporarily.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Scope & Recurrence Selection */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              1. Change Duration & Recurrence Mode
            </label>

            {/* Permanent vs Temporary Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPermanent(false)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                  !isPermanent
                    ? 'bg-indigo-600 text-white border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                Temporary / Override
              </button>
              <button
                type="button"
                onClick={() => setIsPermanent(true)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                  isPermanent
                    ? 'bg-indigo-600 text-white border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                Permanent (Master Schedule)
              </button>
            </div>

            {/* Recurrence Sub-Options for Temporary Changes */}
            {!isPermanent && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecurrenceType('single_date')}
                    className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition ${
                      recurrenceType === 'single_date'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Single Specific Date
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecurrenceType('single_week')}
                    className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition ${
                      recurrenceType === 'single_week'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Single Week Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecurrenceType('repeat_until_date')}
                    className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition ${
                      recurrenceType === 'repeat_until_date'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Repeat Until Date
                  </button>
                </div>

                {/* Date Inputs based on Recurrence */}
                {recurrenceType === 'single_date' && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">Target Date:</span>
                    <input
                      type="date"
                      value={specificDate}
                      onChange={(e) => setSpecificDate(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                )}

                {(recurrenceType === 'single_week' || recurrenceType === 'repeat_until_date') && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Start Date:</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 dark:text-slate-400">End Date:</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Slot Edits List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Slot Changes ({slotsToEdit.length})
              </label>
              <button
                type="button"
                onClick={handleAddSlot}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Class Shift</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {slotsToEdit.map((slot, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                      Item #{index + 1}
                    </span>
                    {slotsToEdit.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(index)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Day */}
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Day</label>
                      <select
                        value={slot.dayOfWeek}
                        onChange={(e) => handleSlotChange(index, 'dayOfWeek', e.target.value as DayOfWeek)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        {DAYS_OF_WEEK.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Period */}
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Period</label>
                      <select
                        value={slot.periodNumber}
                        onChange={(e) => handleSlotChange(index, 'periodNumber', parseInt(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        {PERIODS.map((p) => (
                          <option key={p.number} value={p.number}>
                            P{p.number} ({p.time.split(' ')[0]})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Course Code */}
                    <div className="col-span-2 sm:col-span-2">
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Subject / Course</label>
                      <select
                        value={slot.courseCode}
                        onChange={(e) => handleSlotChange(index, 'courseCode', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        {courses.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} - {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Venue & Staff */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Venue (e.g. Q301, Y202, *)</label>
                      <input
                        type="text"
                        placeholder="e.g. Q301"
                        value={slot.venue}
                        onChange={(e) => handleSlotChange(index, 'venue', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Staff Name</label>
                      <input
                        type="text"
                        placeholder="Faculty Name"
                        value={slot.staffName}
                        onChange={(e) => handleSlotChange(index, 'staffName', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save & Apply Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
