'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import TimetableGrid from '@/components/TimetableGrid';
import CourseLegend from '@/components/CourseLegend';
import BatchEditDialog from '@/components/BatchEditDialog';
import AdminRepDialog from '@/components/AdminRepDialog';
import { ResolvedSlot } from '@/lib/timetable-resolver';
import { DayOfWeek } from '@/lib/constants';

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [user, setUser] = useState<{ username: string; role: 'admin' | 'rep' } | null>(null);
  
  const [singleDayData, setSingleDayData] = useState<{
    date: string;
    dayOfWeek: DayOfWeek;
    slots: ResolvedSlot[];
  } | undefined>(undefined);

  const [weeklyGridData, setWeeklyGridData] = useState<Record<DayOfWeek, ResolvedSlot[]> | undefined>(undefined);
  const [courses, setCourses] = useState<{ code: string; title: string; staffName: string }[]>([]);

  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isBatchEditDialogOpen, setIsBatchEditDialogOpen] = useState(false);
  const [selectedSlotForEdit, setSelectedSlotForEdit] = useState<ResolvedSlot | null>(null);

  // Initialize seed & user profile
  useEffect(() => {
    // Call seed
    fetch('/api/seed').catch(() => {});

    // Fetch user
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});

    // Fetch courses
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .catch(() => {});
  }, []);

  // Fetch timetable data for selectedDate
  const loadTimetable = useCallback(async () => {
    try {
      // Single day
      const resSingle = await fetch(`/api/timetable?date=${selectedDate}&mode=single`);
      const dataSingle = await resSingle.json();
      if (dataSingle.success) {
        setSingleDayData({
          date: dataSingle.date,
          dayOfWeek: dataSingle.dayOfWeek,
          slots: dataSingle.slots,
        });
      }

      // Weekly grid
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

  const canEdit = !!user && (user.role === 'admin' || user.role === 'rep');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Header Navigation */}
      <Navbar
        user={user}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onLogout={handleLogout}
        onOpenAdminDialog={() => setIsAdminDialogOpen(true)}
        onOpenBatchEdit={handleOpenNewBatchEdit}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner for Class Reps & Admins */}
        {canEdit && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-800/50">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                Logged in as {user?.role.toUpperCase()} ({user?.username})
              </span>
              <h2 className="text-base font-bold">Timetable Management Mode Active</h2>
              <p className="text-xs text-indigo-200">
                Click any slot card below or use &quot;Shift / Edit Schedule&quot; to perform single-date, weekly, or permanent timetable updates.
              </p>
            </div>
            <button
              onClick={handleOpenNewBatchEdit}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-950 hover:bg-indigo-50 shadow-sm shrink-0 transition"
            >
              Shift / Edit Schedule
            </button>
          </div>
        )}

        {/* Timetable Interactive Grid */}
        <TimetableGrid
          singleDayData={singleDayData}
          weeklyGridData={weeklyGridData}
          canEdit={canEdit}
          onEditSlot={handleOpenEditSlot}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Course Catalog Legend */}
        <CourseLegend />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>BE CSE (AI & ML) Semester 7 • Digital Timetable Platform</p>
      </footer>

      {/* Modals */}
      <BatchEditDialog
        isOpen={isBatchEditDialogOpen}
        onClose={() => setIsBatchEditDialogOpen(false)}
        initialSlot={selectedSlotForEdit}
        courses={courses}
        onSaveSuccess={loadTimetable}
        selectedDate={selectedDate}
      />

      <AdminRepDialog
        isOpen={isAdminDialogOpen}
        onClose={() => setIsAdminDialogOpen(false)}
      />
    </div>
  );
}
