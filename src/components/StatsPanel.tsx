import React from 'react';
import { Eye, Zap, Flame, Clock, Cpu } from 'lucide-react';
import type { AlgorithmComplexity, SortStats } from '../types/sort';


interface StatsPanelProps {
  stats: SortStats;
  complexity: AlgorithmComplexity;
  fps: number;
  avgStepTimeMs: number;
  status: 'idle' | 'running' | 'paused' | 'completed';
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  complexity,
  fps,
  avgStepTimeMs,
  status
}) => {
  // Format elapsed time
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 w-full">
      {/* Comparisons */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 transition-all">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
          <Eye className="h-5.5 w-5.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Comparisons
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {stats.comparisons.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Swaps / Overwrites */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 transition-all">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
          <Zap className="h-5.5 w-5.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Swaps / Writes
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {stats.swaps.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Elapsed Time */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 transition-all">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
          <Clock className="h-5.5 w-5.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Elapsed Time
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {formatTime(stats.elapsedTime)}
          </span>
        </div>
      </div>

      {/* Rendering / Anim Statistics (FPS) */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 transition-all">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
          <Flame className="h-5.5 w-5.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Perf Stats (FPS)
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-baseline gap-1.5">
            {status === 'running' ? fps : '--'}
            <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
              ({avgStepTimeMs.toFixed(1)}ms frame)
            </span>
          </span>
        </div>
      </div>

      {/* Complexities Block */}
      <div className="col-span-2 lg:col-span-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/10">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="h-4 w-4 text-indigo-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Algorithm Complexity Properties
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
          <div className="rounded-lg bg-white p-3 dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-0.5">Best Time</span>
            <code className="text-emerald-600 dark:text-emerald-400 font-bold">{complexity.best}</code>
          </div>
          <div className="rounded-lg bg-white p-3 dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-0.5">Average Time</span>
            <code className="text-indigo-600 dark:text-indigo-400 font-bold">{complexity.average}</code>
          </div>
          <div className="rounded-lg bg-white p-3 dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-0.5">Worst Time</span>
            <code className="text-rose-600 dark:text-rose-400 font-bold">{complexity.worst}</code>
          </div>
          <div className="rounded-lg bg-white p-3 dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-0.5">Space Complexity</span>
            <code className="text-purple-600 dark:text-purple-400 font-bold">{complexity.space}</code>
          </div>
        </div>
      </div>
    </div>
  );
};
