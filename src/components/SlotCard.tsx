'use client';

import React from 'react';
import { ResolvedSlot } from '@/lib/timetable-resolver';
import { INITIAL_COURSES } from '@/lib/constants';
import { MapPin, User as UserIcon, Clock, Edit2, AlertCircle, GripVertical } from 'lucide-react';

interface SlotCardProps {
  slot: ResolvedSlot;
  canEdit: boolean;
  onEditSlot?: (slot: ResolvedSlot) => void;
  onDragStartSlot?: (slot: ResolvedSlot) => void;
  onDropOnSlot?: (targetSlot: ResolvedSlot) => void;
  isSelectedForSwap?: boolean;
  onSelectForSwap?: (slot: ResolvedSlot) => void;
  compact?: boolean;
}

export default function SlotCard({
  slot,
  canEdit,
  onEditSlot,
  onDragStartSlot,
  onDropOnSlot,
  isSelectedForSwap,
  onSelectForSwap,
  compact = false,
}: SlotCardProps) {
  const courseCode = slot.courseCode.trim().toUpperCase();

  const coursePreset = INITIAL_COURSES[courseCode];
  const isFree = slot.type === 'free' || courseCode === 'LIB' || courseCode === 'TWM' || !courseCode;
  const isLab = slot.type === 'lab' || courseCode === '23N710' || courseCode === '23N711';

  // Minimal theme fallback with specific period highlight colors
  let highlightStyles = 'border-zinc-800/80 bg-zinc-900/60 text-zinc-100 hover:border-zinc-700';

  if (isFree) {
    highlightStyles = 'border-emerald-900/50 bg-emerald-950/20 text-emerald-100 hover:border-emerald-700/60';
  } else if (isLab) {
    highlightStyles = 'border-rose-900/50 bg-rose-950/20 text-rose-100 hover:border-rose-700/60';
  } else if (coursePreset?.colorTheme) {
    highlightStyles = 'border-zinc-800 bg-zinc-900/80 text-zinc-100 hover:border-zinc-700';
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ periodNumber: slot.periodNumber, dayOfWeek: slot.dayOfWeek }));
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStartSlot) onDragStartSlot(slot);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDropOnSlot) onDropOnSlot(slot);
  };

  return (
    <div
      draggable={canEdit}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => {
        if (canEdit && onSelectForSwap) onSelectForSwap(slot);
      }}
      className={`group relative rounded-xl p-3 border transition-all duration-150 flex flex-col justify-between select-none ${
        canEdit ? 'cursor-grab active:cursor-grabbing' : ''
      } ${highlightStyles} ${
        slot.isOverride ? 'ring-1 ring-amber-400/80 border-amber-500/50' : ''
      } ${
        isSelectedForSwap ? 'ring-2 ring-indigo-500 bg-indigo-950/40 border-indigo-500' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5">
          {canEdit && (
            <GripVertical className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-300 transition" />
          )}
          <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
            P{slot.periodNumber}
          </span>
          <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
            <Clock className="h-3 w-3 inline text-zinc-500" />
            {slot.time}
          </span>
        </div>

        {/* Badges & Edit Trigger */}
        <div className="flex items-center gap-1">
          {slot.isOverride && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertCircle className="h-3 w-3" />
              Temp
            </span>
          )}

          {canEdit && onEditSlot && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditSlot(slot);
              }}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Edit Slot"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="my-1">
        {courseCode ? (
          <div>
            <div className="flex items-baseline justify-between gap-1">
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                {courseCode}
              </h3>
              {isFree && (
                <span className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                  Free
                </span>
              )}
              {isLab && (
                <span className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60">
                  Lab
                </span>
              )}
            </div>
            {!compact && (
              <p className="text-xs text-zinc-400 font-medium line-clamp-1 mt-0.5">
                {slot.courseTitle}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic font-medium">Free Slot</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-1.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400 gap-2">
        {slot.venue ? (
          <span className="font-mono font-medium text-zinc-300 flex items-center gap-1 bg-zinc-800/60 px-1.5 py-0.5 rounded">
            <MapPin className="h-3 w-3 text-zinc-400" />
            {slot.venue}
          </span>
        ) : (
          <span className="text-zinc-600">-</span>
        )}

        {slot.staffName && !compact && (
          <span className="truncate max-w-[130px] flex items-center gap-1 text-zinc-400" title={slot.staffName}>
            <UserIcon className="h-3 w-3 text-zinc-500" />
            {slot.staffName.split('/')[0]}
          </span>
        )}
      </div>
    </div>
  );
}
