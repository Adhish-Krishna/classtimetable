'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, LogIn, UserCheck, Shield, AlertCircle, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 text-zinc-100 font-sans">
      {/* Navigation link back to main page */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Timetable</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8">
        {/* Branding Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-zinc-950 border border-zinc-800 text-white shadow-xs mb-1">
            <Calendar className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Class Timetable Portal
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in as Global Admin or Class Rep to manage schedules
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 mb-6">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'login'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'register'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            First-Time Setup
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Sign In Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Username / Roll Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ADMIN or 21AI001"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <LogIn className="h-4 w-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        )}

        {/* Tab 2: First-Time Setup Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterRep} className="space-y-4">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
              <Shield className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Your Roll Number must first be authorized by the Global Admin. Type your Roll Number below to create your password.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Authorized Roll Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 21AI001"
                value={regRollNo}
                onChange={(e) => setRegRollNo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Set Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 4 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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
