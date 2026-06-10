import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Shuffle, ChevronDown } from 'lucide-react';
import type { AlgorithmType } from '../types/sort';
import { useSortVisualizer } from '../hooks/useSortVisualizer';
import { VisualizerCanvas } from './VisualizerCanvas';
import { ALGORITHMS_INFO } from '../algorithms/algorithmInfo';

interface ComparisonModeProps {
  initialArray: number[];
  onGenerate: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
}

export const ComparisonMode: React.FC<ComparisonModeProps> = ({
  initialArray,
  onGenerate,
  speed,
  setSpeed
}) => {
  const [algoA, setAlgoA] = useState<AlgorithmType>('bubble');
  const [algoB, setAlgoB] = useState<AlgorithmType>('quick');

  // Instantiate two separate visualizers with the same initial array
  const visualizerA = useSortVisualizer({
    initialArray,
    algorithm: algoA,
    speed
  });

  const visualizerB = useSortVisualizer({
    initialArray,
    algorithm: algoB,
    speed
  });

  // Sync controls
  const handlePlayPause = () => {
    const isAnyRunning = visualizerA.status === 'running' || visualizerB.status === 'running';

    if (isAnyRunning) {
      visualizerA.pause();
      visualizerB.pause();
    } else {
      visualizerA.start();
      visualizerB.start();
    }
  };

  const handleReset = () => {
    visualizerA.reset();
    visualizerB.reset();
  };

  const isRunning = visualizerA.status === 'running' || visualizerB.status === 'running';
  const isAllCompleted = visualizerA.status === 'completed' && visualizerB.status === 'completed';

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Shared Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 transition-colors">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className={`flex h-11 px-5 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white shadow-md transition-all active:scale-95 ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-4.5 w-4.5 fill-white" />
                <span>Pause Both</span>
              </>
            ) : (
              <>
                <Play className="h-4.5 w-4.5 fill-white" />
                <span>{visualizerA.status === 'paused' ? 'Play Both' : 'Start Comparison'}</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title="Reset Both"
          >
            <RotateCcw className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Speed slider & Generate */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3 w-56">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Speed: {speed}ms
            </span>
            <input
              type="range"
              min="1"
              max="1000"
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="h-1 w-full cursor-pointer rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700 dark:accent-indigo-500"
            />
          </div>

          <button
            onClick={onGenerate}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-slate-800 disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Generate Shared Array</span>
          </button>
        </div>
      </div>

      {/* Side-by-side Visualizers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Visualizer: Sorter A */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-100/50 p-2.5 dark:bg-slate-800/40">
            <div className="relative flex items-center">
              <select
                id="algo-a-select"
                value={algoA}
                disabled={isRunning}
                onChange={e => {
                  setAlgoA(e.target.value as AlgorithmType);
                  handleReset();
                }}
                className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm font-semibold text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500 cursor-pointer disabled:opacity-60"
              >
                {Object.values(ALGORITHMS_INFO).map(algo => (
                  <option key={algo.id} value={algo.id} className="bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100">
                    {algo.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 pointer-events-none h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>

            <div className="flex gap-3 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Comparisons:{' '}
                <strong className="text-slate-800 dark:text-slate-100">
                  {visualizerA.stats.comparisons}
                </strong>
              </span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Swaps/Writes:{' '}
                <strong className="text-slate-800 dark:text-slate-100">
                  {visualizerA.stats.swaps}
                </strong>
              </span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Time:{' '}
                <strong className="text-slate-800 dark:text-slate-100 font-mono">
                  {formatTime(visualizerA.stats.elapsedTime)}
                </strong>
              </span>
            </div>
          </div>

          <VisualizerCanvas
            array={visualizerA.array}
            highlightedIndices={visualizerA.highlightedIndices}
            containerId="canvas-a-container"
            isSorting={visualizerA.status === 'running' || visualizerA.status === 'paused'}
          />
        </div>

        {/* Right Visualizer: Sorter B */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-100/50 p-2.5 dark:bg-slate-800/40">
            <div className="relative flex items-center">
              <select
                id="algo-b-select"
                value={algoB}
                disabled={isRunning}
                onChange={e => {
                  setAlgoB(e.target.value as AlgorithmType);
                  handleReset();
                }}
                className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm font-semibold text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500 cursor-pointer disabled:opacity-60"
              >
                {Object.values(ALGORITHMS_INFO).map(algo => (
                  <option key={algo.id} value={algo.id} className="bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100">
                    {algo.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 pointer-events-none h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>

            <div className="flex gap-3 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Comparisons:{' '}
                <strong className="text-slate-800 dark:text-slate-100">
                  {visualizerB.stats.comparisons}
                </strong>
              </span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Swaps/Writes:{' '}
                <strong className="text-slate-800 dark:text-slate-100">
                  {visualizerB.stats.swaps}
                </strong>
              </span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Time:{' '}
                <strong className="text-slate-800 dark:text-slate-100 font-mono">
                  {formatTime(visualizerB.stats.elapsedTime)}
                </strong>
              </span>
            </div>
          </div>

          <VisualizerCanvas
            array={visualizerB.array}
            highlightedIndices={visualizerB.highlightedIndices}
            containerId="canvas-b-container"
            isSorting={visualizerB.status === 'running' || visualizerB.status === 'paused'}
          />
        </div>
      </div>

      {/* Speed Winner Banner (only when both completed) */}
      {isAllCompleted && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-center dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-400">
            {visualizerA.stats.elapsedTime < visualizerB.stats.elapsedTime ? (
              <span>
                🏆 <strong>{ALGORITHMS_INFO[algoA].name}</strong> sorted the array{' '}
                {((visualizerB.stats.elapsedTime - visualizerA.stats.elapsedTime) / 1000).toFixed(2)}s faster
                than {ALGORITHMS_INFO[algoB].name}.
              </span>
            ) : visualizerA.stats.elapsedTime > visualizerB.stats.elapsedTime ? (
              <span>
                🏆 <strong>{ALGORITHMS_INFO[algoB].name}</strong> sorted the array{' '}
                {((visualizerA.stats.elapsedTime - visualizerB.stats.elapsedTime) / 1000).toFixed(2)}s faster
                than {ALGORITHMS_INFO[algoA].name}.
              </span>
            ) : (
              <span>🤝 Both algorithms completed at the exact same time!</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
