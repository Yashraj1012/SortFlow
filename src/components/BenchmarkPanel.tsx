import React, { useState } from 'react';
import { Play, Activity, AlertCircle, BarChart3, TrendingUp } from 'lucide-react';
import type { AlgorithmType, BenchmarkResult } from '../types/sort';
import { ALGORITHMS_INFO } from '../algorithms/algorithmInfo';
import * as algorithms from '../algorithms';

interface BenchmarkPanelProps {
  initialArray: number[];
}

export const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({ initialArray }) => {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'timing' | 'operations' | 'theoretical'>('timing');

  const runBenchmark = () => {
    setIsRunning(true);
    setResults([]);

    // We can use setTimeout to allow UI to render the "Running..." state before blocking CPU
    setTimeout(() => {
      const benchmarkData: BenchmarkResult[] = Object.keys(ALGORITHMS_INFO).map(key => {
        const algoId = key as AlgorithmType;
        const sortFnName = `${algoId}Sort`;
        const sortFn = algorithms[sortFnName as keyof typeof algorithms];

        if (typeof sortFn !== 'function') {
          return {
            algorithmId: algoId,
            name: ALGORITHMS_INFO[algoId].name,
            timeMs: 0,
            comparisons: 0,
            swaps: 0,
            completed: false
          };
        }

        const testArray = [...initialArray];
        const generator = sortFn(testArray);

        const startTime = performance.now();
        let comps = 0;
        let swps = 0;

        // Run generator synchronously to completion
        let step = generator.next();
        while (!step.done) {
          comps = step.value.comparisonsCount;
          swps = step.value.swapsCount;
          step = generator.next();
        }
        const endTime = performance.now();

        return {
          algorithmId: algoId,
          name: ALGORITHMS_INFO[algoId].name,
          timeMs: endTime - startTime,
          comparisons: comps,
          swaps: swps,
          completed: true
        };
      });

      setResults(benchmarkData);
      setIsRunning(false);
    }, 100);
  };

  // Find max value in benchmark results to scale SVG bars
  const maxTime = results.length > 0 ? Math.max(...results.map(r => r.timeMs)) : 1;
  const maxOps = results.length > 0 ? Math.max(...results.map(r => r.comparisons + r.swaps)) : 1;
  const n = initialArray.length;


  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Benchmark controller box */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 transition-colors">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-250">
            Algorithm Performance Benchmarking
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            Run all algorithms synchronously on the active dataset of{' '}
            <strong className="text-slate-600 dark:text-slate-400">{n} elements</strong> to compare exact
            timings and counts.
          </p>
        </div>

        <button
          onClick={runBenchmark}
          disabled={isRunning || initialArray.length === 0}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-45 active:scale-95 transition-all"
        >
          <Play className="h-4.5 w-4.5 fill-white" />
          <span>{isRunning ? 'Running benchmarks...' : 'Run Benchmark'}</span>
        </button>
      </div>

      {/* Grid: Results Table and Visual Charts */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Table of Results */}
          <div className="lg:col-span-1 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/80 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/30">
              <Activity className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Benchmark Results Table
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-55/30 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-950/10">
                    <th className="px-4 py-3">Algorithm</th>
                    <th className="px-4 py-3 text-right">Time (ms)</th>
                    <th className="px-4 py-3 text-right">Compares</th>
                    <th className="px-4 py-3 text-right">Swaps/Writes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {results.map(res => (
                    <tr
                      key={res.algorithmId}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                    >
                      <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-350">
                        {res.name}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-medium text-slate-905 dark:text-slate-200">
                        {res.timeMs.toFixed(3)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-slate-500 dark:text-slate-400">
                        {res.comparisons.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-slate-500 dark:text-slate-400">
                        {res.swaps.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Graphical Charts Section */}
          <div className="lg:col-span-2 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/80 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50 px-4 dark:border-slate-800 dark:bg-slate-950/30">
              <button
                onClick={() => setActiveTab('timing')}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'timing'
                    ? 'border-indigo-650 text-indigo-600 dark:border-indigo-550 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Execution Time</span>
              </button>
              <button
                onClick={() => setActiveTab('operations')}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'operations'
                    ? 'border-indigo-650 text-indigo-600 dark:border-indigo-550 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Activity className="h-4 w-4" />
                <span>Operations Count</span>
              </button>
              <button
                onClick={() => setActiveTab('theoretical')}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'theoretical'
                    ? 'border-indigo-650 text-indigo-600 dark:border-indigo-550 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Theoretical Big-O</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 p-6 flex flex-col justify-center items-center">
              {activeTab === 'timing' && (
                <div className="w-full max-w-lg space-y-4">
                  {results.map(res => {
                    const widthPercent = maxTime > 0 ? (res.timeMs / maxTime) * 100 : 0;
                    return (
                      <div key={res.algorithmId} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600 dark:text-slate-400">{res.name}</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">
                            {res.timeMs.toFixed(3)} ms
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-md bg-gradient-to-r from-indigo-550 to-indigo-600 transition-all duration-500"
                            style={{ width: `${Math.max(widthPercent, 1.5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'operations' && (
                <div className="w-full max-w-lg space-y-4">
                  {results.map(res => {
                    const totalOps = res.comparisons + res.swaps;
                    const widthPercent = maxOps > 0 ? (totalOps / maxOps) * 100 : 0;
                    return (
                      <div key={res.algorithmId} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600 dark:text-slate-400">{res.name}</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">
                            {totalOps.toLocaleString()} ops{' '}
                            <span className="text-[10px] text-slate-450 dark:text-slate-500">
                              ({res.comparisons}c / {res.swaps}s)
                            </span>
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-md bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                            style={{ width: `${Math.max(widthPercent, 1.5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'theoretical' && (
                <div className="w-full flex flex-col items-center">
                  {/* SVG Chart for Big O curves */}
                  <svg viewBox="0 0 500 240" className="w-full max-w-md overflow-visible">
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="40" y2="210" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" />
                    <line x1="40" y1="210" x2="480" y2="210" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" />

                    {/* Chart Curves */}
                    {/* O(N^2) Curve - Quadratic (Bubble, Selection, Insertion Worst Cases) */}
                    <path
                      d="M 40,210 Q 260,205 480,25"
                      fill="none"
                      className="stroke-rose-500/80"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                    <text x="440" y="45" className="fill-rose-500 text-[9px] font-bold">O(n²)</text>

                    {/* O(N log N) Curve - Linearithmic (Merge, Quick Avg, Heap) */}
                    <path
                      d="M 40,210 Q 260,160 480,120"
                      fill="none"
                      className="stroke-indigo-500"
                      strokeWidth="2.5"
                    />
                    <text x="445" y="115" className="fill-indigo-650 dark:fill-indigo-400 text-[9px] font-bold">O(n log n)</text>

                    {/* O(N) Curve - Linear (Insertion Best Case) */}
                    <path
                      d="M 40,210 L 480,170"
                      fill="none"
                      className="stroke-emerald-500"
                      strokeWidth="2"
                    />
                    <text x="455" y="165" className="fill-emerald-500 text-[9px] font-bold">O(n)</text>

                    {/* Current Dataset N vertical bar indicator */}
                    {(() => {
                      const maxPossibleN = 1000;
                      // map current n (10-300) into SVG bounds (x: 40 to 480)
                      const xPos = 40 + (n / maxPossibleN) * 440;
                      return (
                        <>
                          <line
                            x1={xPos}
                            y1="10"
                            x2={xPos}
                            y2="215"
                            className="stroke-indigo-600/30 dark:stroke-indigo-400/40"
                            strokeWidth="1.5"
                            strokeDasharray="2 2"
                          />
                          {/* Dot at curve intersections */}
                          <circle cx={xPos} cy={210 - (n / maxPossibleN) * 40} r="4.5" className="fill-emerald-500 stroke-white dark:stroke-slate-900" strokeWidth="1.5" />
                          <circle cx={xPos} cy={210 - (n * Math.log2(n) / (1000 * Math.log2(1000))) * 90} r="4.5" className="fill-indigo-500 stroke-white dark:stroke-slate-900" strokeWidth="1.5" />
                          <circle cx={xPos} cy={210 - ((n * n) / (1000 * 1000)) * 185} r="4.5" className="fill-rose-500 stroke-white dark:stroke-slate-900" strokeWidth="1.5" />

                          <text x={xPos + 6} y="25" className="fill-indigo-600 dark:fill-indigo-400 text-[8px] font-bold">
                            Current N = {n}
                          </text>
                        </>
                      );
                    })()}

                    {/* Axis Labels */}
                    <text x="25" y="115" transform="rotate(-90 25 115)" className="fill-slate-400 text-[9px] text-center font-semibold">
                      Time Complexity (Operations)
                    </text>
                    <text x="260" y="228" className="fill-slate-400 text-[9px] text-center font-semibold">
                      Array Size (n)
                    </text>
                  </svg>
                  <p className="mt-3 text-[10px] text-slate-450 dark:text-slate-500 text-center leading-relaxed max-w-sm">
                    Visual curve modeling shows how algorithms scale as N grows.
                    Dots represent the theoretical complexity of current dataset size.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 border-dashed bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/30">
          <AlertCircle className="h-9 w-9 text-slate-350 dark:text-slate-600 mb-3" />
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No Benchmark Data Available
          </h4>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
            Click the "Run Benchmark" button above to execute all algorithms and view detailed speed charts.
          </p>
        </div>
      )}
    </div>
  );
};
