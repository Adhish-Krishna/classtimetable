'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, LogIn, KeyRound, UserCheck, Shield, AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regRollNo, setRegRollNo] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed.');
      }

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterRep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register-rep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo: regRollNo, password: regPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed.');
      }

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Timetable</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 relative z-10">
        {/* Branding Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 mb-2">
            <Calendar className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Class Timetable Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in as Global Admin or Class Rep to manage schedules
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            First-Time Setup (Rep)
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Sign In Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Username / Roll Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. ADMIN or 21AI001"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <LogIn className="h-4 w-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        )}

        {/* Tab 2: First-Time Setup Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterRep} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Shield className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Your Roll Number must first be authorized by the Global Admin. Type your Roll Number below to create your password.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Authorized Roll Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 21AI001"
                value={regRollNo}
                onChange={(e) => setRegRollNo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Set Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 4 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <UserCheck className="h-4 w-4" />
              <span>{isSubmitting ? 'Creating Account...' : 'Set Password & Sign In'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
