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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 shadow-xs">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                Class Timetable
              </h1>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                CSE AI&ML • Sem 7
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              IST Schedule & Drag-and-Drop Shift Portal
            </p>
          </div>
        </div>

        {/* Date Selector & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* IST Date Picker */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg text-xs">
            <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-white font-mono font-semibold focus:outline-none cursor-pointer text-xs"
            />
          </div>

          {/* User Controls */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Role Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-200">
                {user.role === 'admin' ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                )}
                <span className="hidden sm:inline font-mono">{user.username}</span>
                <span className="capitalize text-[10px] text-zinc-400">({user.role})</span>
              </div>

              {/* Admin Manage Reps */}
              {user.role === 'admin' && (
                <button
                  onClick={onOpenAdminDialog}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition"
                  title="Manage Class Reps"
                >
                  <Users className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden lg:inline">Reps</span>
                </button>
              )}

              {/* Shift/Edit Schedule */}
              {onOpenBatchEdit && (
                <button
                  onClick={onOpenBatchEdit}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 shadow-xs transition"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Batch Shift</span>
                </button>
              )}

              {/* Logout */}
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
