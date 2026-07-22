'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import TimetableGrid from '@/components/TimetableGrid';
import CourseLegend from '@/components/CourseLegend';
import BatchEditDialog from '@/components/BatchEditDialog';
import AdminRepDialog from '@/components/AdminRepDialog';
import DragConfirmDialog from '@/components/DragConfirmDialog';
import { ResolvedSlot } from '@/lib/timetable-resolver';
import { DayOfWeek } from '@/lib/constants';
import { getTodayIST } from '@/lib/date-utils';

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [user, setUser] = useState<{ username: string; role: 'admin' | 'rep' } | null>(null);
  
  const [singleDayData, setSingleDayData] = useState<{
    date: string;
    dayOfWeek: DayOfWeek;
    slots: ResolvedSlot[];
  } | undefined>(undefined);

  const [weeklyGridData, setWeeklyGridData] = useState<Record<DayOfWeek, ResolvedSlot[]> | undefined>(undefined);
  const [courses, setCourses] = useState<{ code: string; title: string; staffName: string }[]>([]);

  // Dialog states
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isBatchEditDialogOpen, setIsBatchEditDialogOpen] = useState(false);
  const [selectedSlotForEdit, setSelectedSlotForEdit] = useState<ResolvedSlot | null>(null);

  // Drag-and-Drop Shift Dialog state
  const [isDragDialogOpen, setIsDragDialogOpen] = useState(false);
  const [dragSourceSlot, setDragSourceSlot] = useState<ResolvedSlot | null>(null);
  const [dragTargetSlot, setDragTargetSlot] = useState<ResolvedSlot | null>(null);

  useEffect(() => {
    setSelectedDate(getTodayIST());
  }, []);

  useEffect(() => {
    fetch('/api/seed').catch(() => {});

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});

    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .catch(() => {});
  }, []);

  const loadTimetable = useCallback(async () => {
    if (!selectedDate) return;

    try {
      const resSingle = await fetch(`/api/timetable?date=${selectedDate}&mode=single`);
      const dataSingle = await resSingle.json();
      if (dataSingle.success) {
        setSingleDayData({
          date: dataSingle.date,
          dayOfWeek: dataSingle.dayOfWeek,
          slots: dataSingle.slots,
        });
      }

      const resWeek = await fetch(`/api/timetable?date=${selectedDate}&mode=week`);
      const dataWeek = await resWeek.json();
      if (dataWeek.success) {
        setWeeklyGridData(dataWeek.grid);
      }
    } catch (err) {
      console.error('Error fetching timetable:', err);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadTimetable();
  }, [loadTimetable]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.reload();
  };

  const handleOpenEditSlot = (slot: ResolvedSlot) => {
    setSelectedSlotForEdit(slot);
    setIsBatchEditDialogOpen(true);
  };

  const handleOpenNewBatchEdit = () => {
    setSelectedSlotForEdit(null);
    setIsBatchEditDialogOpen(true);
  };

  const handleDragDropShift = (source: ResolvedSlot, target: ResolvedSlot) => {
    setDragSourceSlot(source);
    setDragTargetSlot(target);
    setIsDragDialogOpen(true);
  };

  const canEdit = !!user && (user.role === 'admin' || user.role === 'rep');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Navbar Header */}
      <Navbar
        user={user}
        selectedDate={selectedDate || getTodayIST()}
        onDateChange={setSelectedDate}
        onLogout={handleLogout}
        onOpenAdminDialog={() => setIsAdminDialogOpen(true)}
        onOpenBatchEdit={handleOpenNewBatchEdit}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Timetable Interactive Grid */}
        <TimetableGrid
          singleDayData={singleDayData}
          weeklyGridData={weeklyGridData}
          canEdit={canEdit}
          onEditSlot={handleOpenEditSlot}
          onDragDropShift={handleDragDropShift}
          selectedDate={selectedDate || getTodayIST()}
          onDateChange={setSelectedDate}
        />

        {/* Collapsible Course Legend */}
        <CourseLegend />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 text-center text-xs text-zinc-500 font-mono">
        <p>BE CSE (AI & ML) Sem 7 • Digital Timetable (IST)</p>
      </footer>

      {/* Modals & Dialogs */}
      <BatchEditDialog
        isOpen={isBatchEditDialogOpen}
        onClose={() => setIsBatchEditDialogOpen(false)}
        initialSlot={selectedSlotForEdit}
        courses={courses}
        onSaveSuccess={loadTimetable}
        selectedDate={selectedDate || getTodayIST()}
      />

      <AdminRepDialog
        isOpen={isAdminDialogOpen}
        onClose={() => setIsAdminDialogOpen(false)}
      />

      <DragConfirmDialog
        isOpen={isDragDialogOpen}
        onClose={() => setIsDragDialogOpen(false)}
        sourceSlot={dragSourceSlot}
        targetSlot={dragTargetSlot}
        selectedDate={selectedDate || getTodayIST()}
        onSaveSuccess={loadTimetable}
      />
    </div>
  );
}
