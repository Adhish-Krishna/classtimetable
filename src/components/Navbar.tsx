'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, ShieldCheck, LogOut, LogIn, Users, Sparkles } from 'lucide-react';

interface NavbarProps {
  user: { username: string; role: 'admin' | 'rep' } | null;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onLogout: () => void;
  onOpenAdminDialog?: () => void;
  onOpenBatchEdit?: () => void;
}

export default function Navbar({
  user,
  selectedDate,
  onDateChange,
  onLogout,
  onOpenAdminDialog,
  onOpenBatchEdit,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="h-full w-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300">
                Class Timetable
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                BE CSE (AI & ML) - Sem 7
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Digital Schedule & Live Overrides
            </p>
          </div>
        </div>

        {/* Date Selector & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Date Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg text-xs">
            <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 hidden md:inline font-medium">Viewing Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            />
          </div>

          {/* User Controls */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Role Badge */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                user.role === 'admin'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
              }`}>
                {user.role === 'admin' ? (
                  <ShieldCheck className="h-3.5 w-3.5" />
                ) : (
                  <User className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">{user.username}</span>
                <span className="capitalize text-[10px] opacity-80">({user.role})</span>
              </div>

              {/* Admin Manage Reps button */}
              {user.role === 'admin' && (
                <button
                  onClick={onOpenAdminDialog}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition"
                  title="Manage Class Reps"
                >
                  <Users className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="hidden lg:inline">Manage Reps</span>
                </button>
              )}

              {/* Rep / Admin Quick Edit button */}
              {onOpenBatchEdit && (
                <button
                  onClick={onOpenBatchEdit}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/20 hover:opacity-95 transition"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Shift / Edit Schedule</span>
                </button>
              )}

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Rep / Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
