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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-lg bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800 p-6 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Class Reps Management</h2>
              <p className="text-xs text-zinc-400">
                Authorized Class Rep roll numbers who can edit timetable
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
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
            className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-mono font-semibold text-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition shadow-xs"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Rep</span>
          </button>
        </form>

        {/* Allowed Reps List */}
        <div className="mt-5 space-y-2 max-h-[250px] overflow-y-auto pr-1">
          <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">
            Authorized Roll Numbers ({reps.length})
          </label>

          {isLoading ? (
            <p className="text-xs text-zinc-500 italic">Loading reps list...</p>
          ) : reps.length === 0 ? (
            <p className="text-xs text-zinc-500 italic py-2">No Class Rep roll numbers authorized yet.</p>
          ) : (
            reps.map((rep) => (
              <div
                key={rep._id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">
                    {rep.rollNo}
                  </span>

                  {rep.isRegistered ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Activated
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      <Clock className="h-3 w-3 text-amber-400" /> Pending Password Setup
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteRep(rep.rollNo)}
                  className="p-1 text-zinc-500 hover:text-red-400 transition"
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
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
