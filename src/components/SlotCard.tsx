'use client';

import React from 'react';
import { ResolvedSlot } from '@/lib/timetable-resolver';
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
  const courseCode = (slot.courseCode || '').trim().toUpperCase();

  const isEmpty = !courseCode;
  const isFree = courseCode === 'LIB' || courseCode === 'TWM';
  const isLab = courseCode === '23N710' || courseCode === '23N711';

  // Completely distinct color families for every subject
  let cardStyles = 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700';
  let badgeStyles = 'bg-zinc-800 text-zinc-400 border-zinc-700';

  if (isEmpty) {
    // Empty Slot -> Grey
    cardStyles = 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700';
  } else if (isFree) {
    // Free Periods -> Emerald Green
    cardStyles = 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300 hover:border-emerald-700';
    badgeStyles = 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60';
  } else if (isLab) {
    // Labs -> Rose Red
    cardStyles = 'bg-rose-950/30 border-rose-800/80 text-rose-300 hover:border-rose-700';
    badgeStyles = 'bg-rose-900/60 text-rose-300 border-rose-700/60';
  } else if (courseCode === '23N003') {
    // Recommender Systems -> Indigo
    cardStyles = 'bg-indigo-950/30 border-indigo-800/80 text-indigo-300 hover:border-indigo-700';
    badgeStyles = 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60';
  } else if (courseCode === '23N014') {
    // Cloud Computing -> Sky Blue
    cardStyles = 'bg-sky-950/30 border-sky-800/80 text-sky-300 hover:border-sky-700';
    badgeStyles = 'bg-sky-900/60 text-sky-300 border-sky-700/60';
  } else if (courseCode === '23N017') {
    // Computer Vision -> Purple
    cardStyles = 'bg-purple-950/30 border-purple-800/80 text-purple-300 hover:border-purple-700';
    badgeStyles = 'bg-purple-900/60 text-purple-300 border-purple-700/60';
  } else if (courseCode === '23N020') {
    // Generative AI -> Amber / Yellow
    cardStyles = 'bg-amber-950/30 border-amber-800/80 text-amber-300 hover:border-amber-700';
    badgeStyles = 'bg-amber-900/60 text-amber-300 border-amber-700/60';
  } else if (courseCode === '23N701') {
    // Big Data & Adv DB -> Fuchsia / Magenta
    cardStyles = 'bg-fuchsia-950/30 border-fuchsia-800/80 text-fuchsia-300 hover:border-fuchsia-700';
    badgeStyles = 'bg-fuchsia-900/60 text-fuchsia-300 border-fuchsia-700/60';
  } else if (courseCode === '23N002') {
    // Design Thinking -> Orange
    cardStyles = 'bg-orange-950/30 border-orange-800/80 text-orange-300 hover:border-orange-700';
    badgeStyles = 'bg-orange-900/60 text-orange-300 border-orange-700/60';
  } else {
    cardStyles = 'bg-zinc-900/80 border-zinc-800 text-zinc-200 hover:border-zinc-700';
    badgeStyles = 'bg-zinc-800 text-zinc-300 border-zinc-700';
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
      } ${cardStyles} ${
        slot.isOverride ? 'ring-2 ring-amber-400/90 border-amber-400' : ''
      } ${
        isSelectedForSwap ? 'ring-2 ring-white bg-zinc-800 border-white' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5">
          {canEdit && (
            <GripVertical className="h-3.5 w-3.5 text-zinc-500 opacity-60 group-hover:opacity-100 transition" />
          )}
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-950/60 border border-zinc-800 text-zinc-300">
            P{slot.periodNumber}
          </span>
          <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
            <Clock className="h-3 w-3 inline text-zinc-500" />
            {slot.time}
          </span>
        </div>

        {/* Badges & Edit Trigger */}
        <div className="flex items-center gap-1">
          {slot.isOverride && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950">
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
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition opacity-80 group-hover:opacity-100"
              title="Edit Slot"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="my-1">
        {!isEmpty ? (
          <div>
            <div className="flex items-baseline justify-between gap-1">
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                {courseCode}
              </h3>
              {isFree && (
                <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${badgeStyles}`}>
                  Free
                </span>
              )}
              {isLab && (
                <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${badgeStyles}`}>
                  Lab
                </span>
              )}
            </div>
            {!compact && (
              <p className="text-xs text-zinc-300 font-medium line-clamp-1 mt-0.5">
                {slot.courseTitle}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic font-medium">Empty Slot</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-1.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400 gap-2">
        {slot.venue ? (
          <span className="font-mono font-medium text-zinc-300 flex items-center gap-1 bg-zinc-950/60 border border-zinc-800 px-1.5 py-0.5 rounded">
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
