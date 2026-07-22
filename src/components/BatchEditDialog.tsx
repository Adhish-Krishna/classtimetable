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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800 p-6 my-8 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialSlot ? `Edit Slot P${initialSlot.periodNumber} (${initialSlot.dayOfWeek})` : 'Batch Shift / Update Classes'}
              </h2>
              <p className="text-xs text-zinc-400">
                Modify venue, course, or period slots permanently or temporarily
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Scope & Recurrence Selection */}
          <div className="space-y-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
              1. Change Duration & Recurrence Mode
            </label>

            {/* Permanent vs Temporary Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPermanent(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                  !isPermanent
                    ? 'bg-white text-zinc-950 border-white shadow-xs'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                Temporary / Override
              </button>
              <button
                type="button"
                onClick={() => setIsPermanent(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                  isPermanent
                    ? 'bg-white text-zinc-950 border-white shadow-xs'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
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
                    className={`p-2 rounded-lg text-xs font-semibold border text-center transition ${
                      recurrenceType === 'single_date'
                        ? 'bg-zinc-800 text-white border-zinc-700 font-bold'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Single Specific Date
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecurrenceType('single_week')}
                    className={`p-2 rounded-lg text-xs font-semibold border text-center transition ${
                      recurrenceType === 'single_week'
                        ? 'bg-zinc-800 text-white border-zinc-700 font-bold'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Single Week Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecurrenceType('repeat_until_date')}
                    className={`p-2 rounded-lg text-xs font-semibold border text-center transition ${
                      recurrenceType === 'repeat_until_date'
                        ? 'bg-zinc-800 text-white border-zinc-700 font-bold'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Repeat Until Date
                  </button>
                </div>

                {/* Date Inputs */}
                {recurrenceType === 'single_date' && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="text-xs text-zinc-300">Target Date:</span>
                    <input
                      type="date"
                      value={specificDate}
                      onChange={(e) => setSpecificDate(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-mono font-semibold text-white"
                    />
                  </div>
                )}

                {(recurrenceType === 'single_week' || recurrenceType === 'repeat_until_date') && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-300">Start Date:</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-mono font-semibold text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-300">End Date:</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-mono font-semibold text-white"
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
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                2. Slot Changes ({slotsToEdit.length})
              </label>
              <button
                type="button"
                onClick={handleAddSlot}
                className="flex items-center gap-1 text-xs font-bold text-white hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Class Shift</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {slotsToEdit.map((slot, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      Shift Item #{index + 1}
                    </span>
                    {slotsToEdit.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Day */}
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Day</label>
                      <select
                        value={slot.dayOfWeek}
                        onChange={(e) => handleSlotChange(index, 'dayOfWeek', e.target.value as DayOfWeek)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-semibold text-white"
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
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Period</label>
                      <select
                        value={slot.periodNumber}
                        onChange={(e) => handleSlotChange(index, 'periodNumber', parseInt(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-semibold text-white"
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
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Subject / Course</label>
                      <select
                        value={slot.courseCode}
                        onChange={(e) => handleSlotChange(index, 'courseCode', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-semibold text-white"
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
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Venue (e.g. Q301, Y202, *)</label>
                      <input
                        type="text"
                        placeholder="e.g. Q301"
                        value={slot.venue}
                        onChange={(e) => handleSlotChange(index, 'venue', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-semibold text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Staff Name</label>
                      <input
                        type="text"
                        placeholder="Faculty Name"
                        value={slot.staffName}
                        onChange={(e) => handleSlotChange(index, 'staffName', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-semibold text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 shadow-xs transition disabled:opacity-50"
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
