'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Trash2, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface AllowedRep {
  _id: string;
  rollNo: string;
  isRegistered: boolean;
  addedBy: string;
  createdAt: string;
}

interface AdminRepDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminRepDialog({ isOpen, onClose }: AdminRepDialogProps) {
  const [reps, setReps] = useState<AllowedRep[]>([]);
  const [newRollNo, setNewRollNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReps = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/reps');
      const data = await res.json();
      if (res.ok && data.success) {
        setReps(data.reps);
      }
    } catch {
      setError('Failed to fetch class reps list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReps();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddRep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRollNo.trim()) return;

    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo: newRollNo }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add class rep.');
      }

      setSuccessMsg(`Roll No ${newRollNo.toUpperCase()} added successfully.`);
      setNewRollNo('');
      fetchReps();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message);
    }
  };

  const handleDeleteRep = async (rollNo: string) => {
    if (!confirm(`Are you sure you want to remove Class Rep ${rollNo}?`)) return;

    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/reps', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to remove class rep.');
      }

      setSuccessMsg(`Class Rep ${rollNo} removed.`);
      fetchReps();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Class Reps Management</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized Class Rep roll numbers who can edit timetable
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Add Rep Input Form */}
        <form onSubmit={handleAddRep} className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter Roll Number (e.g. 21AI001)"
            value={newRollNo}
            onChange={(e) => setNewRollNo(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Rep</span>
          </button>
        </form>

        {/* Allowed Reps List */}
        <div className="mt-5 space-y-2 max-h-[250px] overflow-y-auto pr-1">
          <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
            Authorized Roll Numbers ({reps.length})
          </label>

          {isLoading ? (
            <p className="text-xs text-slate-400 italic">Loading reps list...</p>
          ) : reps.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">No Class Rep roll numbers authorized yet.</p>
          ) : (
            reps.map((rep) => (
              <div
                key={rep._id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold font-mono text-slate-800 dark:text-slate-200">
                    {rep.rollNo}
                  </span>

                  {rep.isRegistered ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> Activated
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      <Clock className="h-3 w-3" /> Pending Password Setup
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteRep(rep.rollNo)}
                  className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                  title="Delete Rep"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
