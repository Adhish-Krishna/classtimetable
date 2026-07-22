'use client';

import React, { useState } from 'react';
import { ResolvedSlot } from '@/lib/timetable-resolver';
import { X, ArrowRightLeft, MoveRight, Calendar, Check, AlertCircle } from 'lucide-react';

interface DragConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sourceSlot: ResolvedSlot | null;
  targetSlot: ResolvedSlot | null;
  selectedDate: string;
  onSaveSuccess: () => void;
}

export default function DragConfirmDialog({
  isOpen,
  onClose,
  sourceSlot,
  targetSlot,
  selectedDate,
  onSaveSuccess,
}: DragConfirmDialogProps) {
  const [actionType, setActionType] = useState<'swap' | 'move'>('swap');
  const [isPermanent, setIsPermanent] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'single_date' | 'single_week' | 'repeat_until_date'>('single_date');
  const [specificDate, setSpecificDate] = useState(selectedDate);
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !sourceSlot || !targetSlot) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const slotsPayload = [];

      if (actionType === 'swap') {
        // Swap source course to target slot, and target course to source slot
        slotsPayload.push({
          dayOfWeek: targetSlot.dayOfWeek,
          periodNumber: targetSlot.periodNumber,
          courseCode: sourceSlot.courseCode || 'LIB',
          venue: sourceSlot.venue || '',
          staffName: sourceSlot.staffName || '',
        });

        slotsPayload.push({
          dayOfWeek: sourceSlot.dayOfWeek,
          periodNumber: sourceSlot.periodNumber,
          courseCode: targetSlot.courseCode || 'LIB',
          venue: targetSlot.venue || '',
          staffName: targetSlot.staffName || '',
        });
      } else {
        // Move source to target slot
        slotsPayload.push({
          dayOfWeek: targetSlot.dayOfWeek,
          periodNumber: targetSlot.periodNumber,
          courseCode: sourceSlot.courseCode || 'LIB',
          venue: sourceSlot.venue || '',
          staffName: sourceSlot.staffName || '',
        });

        // Make source slot free / empty
        slotsPayload.push({
          dayOfWeek: sourceSlot.dayOfWeek,
          periodNumber: sourceSlot.periodNumber,
          courseCode: 'LIB',
          venue: '',
          staffName: '',
        });
      }

      const res = await fetch('/api/timetable/slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPermanent,
          recurrenceType,
          specificDate,
          startDate,
          endDate,
          slots: slotsPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to shift slots.');
      }

      onSaveSuccess();
      onClose();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800 p-6 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Confirm Drag-and-Drop Shift</h2>
              <p className="text-xs text-zinc-400">Class Rep Schedule Modification</p>
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

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Visual Shift Comparison */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Dragged From</span>
              <div className="font-bold text-sm">{sourceSlot.courseCode || 'Free Slot'}</div>
              <div className="text-xs text-zinc-400">
                P{sourceSlot.periodNumber} ({sourceSlot.dayOfWeek}) • {sourceSlot.venue || 'No Venue'}
              </div>
            </div>

            <div className="space-y-1 border-l border-zinc-800 pl-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Dropped Onto</span>
              <div className="font-bold text-sm">{targetSlot.courseCode || 'Free Slot'}</div>
              <div className="text-xs text-zinc-400">
                P{targetSlot.periodNumber} ({targetSlot.dayOfWeek}) • {targetSlot.venue || 'No Venue'}
              </div>
            </div>
          </div>

          {/* Action Choice: Swap vs Move */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 block">Shift Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActionType('swap')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                  actionType === 'swap'
                    ? 'bg-zinc-100 text-zinc-950 border-white'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>Swap Periods</span>
              </button>
              <button
                type="button"
                onClick={() => setActionType('move')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                  actionType === 'move'
                    ? 'bg-zinc-100 text-zinc-950 border-white'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                <MoveRight className="h-3.5 w-3.5" />
                <span>Move & Overwrite</span>
              </button>
            </div>
          </div>

          {/* Duration & Recurrence Mode */}
          <div className="space-y-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <label className="text-xs font-semibold text-zinc-400 block">Recurrence Scope</label>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPermanent(false)}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                  !isPermanent
                    ? 'bg-zinc-800 text-white border-zinc-700'
                    : 'bg-zinc-950 text-zinc-500 border-zinc-900'
                }`}
              >
                Temporary Override
              </button>
              <button
                type="button"
                onClick={() => setIsPermanent(true)}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                  isPermanent
                    ? 'bg-zinc-800 text-white border-zinc-700'
                    : 'bg-zinc-950 text-zinc-500 border-zinc-900'
                }`}
              >
                Permanent
              </button>
            </div>

            {!isPermanent && (
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setRecurrenceType('single_date')}
                    className={`py-1.5 rounded-lg border transition text-center ${
                      recurrenceType === 'single_date'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Single Date
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecurrenceType('single_week')}
                    className={`py-1.5 rounded-lg border transition text-center ${
                      recurrenceType === 'single_week'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Single Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecurrenceType('repeat_until_date')}
                    className={`py-1.5 rounded-lg border transition text-center ${
                      recurrenceType === 'repeat_until_date'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Repeat Until
                  </button>
                </div>

                {recurrenceType === 'single_date' && (
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    <span className="text-zinc-400">Date:</span>
                    <input
                      type="date"
                      value={specificDate}
                      onChange={(e) => setSpecificDate(e.target.value)}
                      className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 font-semibold"
                    />
                  </div>
                )}

                {(recurrenceType === 'single_week' || recurrenceType === 'repeat_until_date') && (
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <div>
                      <span className="text-zinc-400 mr-1">Start:</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200"
                      />
                    </div>
                    <div>
                      <span className="text-zinc-400 mr-1">End:</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{isSubmitting ? 'Applying...' : 'Confirm Shift'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
