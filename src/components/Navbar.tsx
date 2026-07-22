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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2">
        {/* Branding - Cleaned for mobile: Title hidden on mobile, AIML badge removed */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shadow-xs shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <h1 className="text-sm font-bold text-white tracking-tight hidden sm:block">
            Class Timetable
          </h1>
        </div>

        {/* Date Selector & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* IST Date Picker */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg text-xs">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-white font-mono font-semibold focus:outline-none cursor-pointer text-xs"
            />
          </div>

          {user ? (
            <div className="flex items-center gap-1.5">
              {/* Role badge */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-300">
                {user.role === 'admin' ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <User className="h-3.5 w-3.5 text-zinc-400" />
                )}
                <span className="font-mono text-xs">{user.username}</span>
              </div>

              {/* Admin Manage Reps */}
              {user.role === 'admin' && (
                <button
                  onClick={onOpenAdminDialog}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
                  title="Manage Class Reps"
                >
                  <Users className="h-4 w-4" />
                </button>
              )}

              {/* Batch Shift */}
              {onOpenBatchEdit && (
                <button
                  onClick={onOpenBatchEdit}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Shift</span>
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
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition"
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
