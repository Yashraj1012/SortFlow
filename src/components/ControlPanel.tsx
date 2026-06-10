import React, { useState } from 'react';
import { Play, Pause, RotateCcw, StepBack, StepForward, Shuffle, Keyboard, Volume2, VolumeX } from 'lucide-react';
import type { DatasetType } from '../types/sort';
import { useAudioSettings } from '../context/AudioContext';


interface ControlPanelProps {
  status: 'idle' | 'running' | 'paused' | 'completed';
  arraySize: number;
  setArraySize: (size: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  datasetType: DatasetType;
  setDatasetType: (type: DatasetType) => void;
  onGenerate: () => void;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  canStepForward: boolean;
  canStepBackward: boolean;
  onCustomArraySubmit: (arr: number[]) => void;
  onHelpOpen: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  status,
  arraySize,
  setArraySize,
  speed,
  setSpeed,
  datasetType,
  setDatasetType,
  onGenerate,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  canStepForward,
  canStepBackward,
  onCustomArraySubmit,
  onHelpOpen
}) => {
  const [customInput, setCustomInput] = useState('');
  const [inputError, setInputError] = useState('');
  const { isSoundEnabled, setIsSoundEnabled, volume, setVolume } = useAudioSettings();


  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError('');

    // Parse comma separated values
    const parts = customInput.split(',').map(s => s.trim());
    const numbers = parts
      .map(p => parseInt(p, 10))
      .filter(n => !isNaN(n));

    if (numbers.length < 5) {
      setInputError('Please enter at least 5 valid numbers.');
      return;
    }

    if (numbers.length > 150) {
      setInputError('Maximum 150 elements for custom input.');
      return;
    }

    // Check if numbers are positive
    if (numbers.some(n => n <= 0)) {
      setInputError('All values must be positive integers.');
      return;
    }

    onCustomArraySubmit(numbers);
  };


  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 transition-colors">
      {/* Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={!canStepBackward || status === 'running'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title="Step Backward (Left Arrow)"
          >
            <StepBack className="h-4.5 w-4.5" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className={`flex h-12 px-6 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white shadow-md transition-all active:scale-95 ${
              status === 'running'
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
            }`}
            title="Play / Pause (Space)"
          >
            {status === 'running' ? (
              <>
                <Pause className="h-5 w-5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-white" />
                <span>{status === 'paused' ? 'Play' : 'Start'}</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={!canStepForward || status === 'running'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title="Step Forward (Right Arrow)"
          >
            <StepForward className="h-4.5 w-4.5" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title="Reset Array (R)"
          >
            <RotateCcw className="h-4.5 w-4.5" />
          </button>
        </div>

        <button
          onClick={onHelpOpen}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        >
          <Keyboard className="h-4 w-4" />
          <span>Shortcuts</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Array Size */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="size-range" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Array Size
            </label>
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              {arraySize} elements
            </span>
          </div>
          <input
            id="size-range"
            type="range"
            min="10"
            max="300"
            value={arraySize}
            disabled={status === 'running' || status === 'paused'}
            onChange={e => setArraySize(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700 dark:accent-indigo-500 disabled:opacity-50"
          />
        </div>

        {/* Animation Speed */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="speed-range" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Animation Speed
            </label>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              {speed <= 5 ? 'Max Speed' : `${speed}ms delay`}
            </span>
          </div>
          <input
            id="speed-range"
            type="range"
            min="1"
            max="1000"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700 dark:accent-indigo-500"
          />
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* Audio Feedback controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Audio Feedback
          </span>
          <label className="inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSoundEnabled}
              onChange={e => setIsSoundEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
            <span className="ml-2 text-xs font-semibold text-slate-650 dark:text-slate-300 min-w-[24px]">
              {isSoundEnabled ? 'ON' : 'OFF'}
            </span>
          </label>
        </div>

        {/* Volume Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              {isSoundEnabled && volume > 0 ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" />
              )}
              <span>Volume</span>
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {volume}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700 dark:accent-indigo-500"
          />
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* Dataset Generation controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Dataset Generator
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['random', 'nearly-sorted', 'reversed'] as DatasetType[]).map(type => (
              <button
                key={type}
                onClick={() => setDatasetType(type)}
                disabled={status === 'running' || status === 'paused'}
                className={`rounded-lg py-2 text-xs font-medium border capitalize transition-all ${
                  datasetType === type
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={status === 'running' || status === 'paused'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-md hover:bg-slate-800 disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-50 active:scale-[0.99] transition-all"
        >
          <Shuffle className="h-4.5 w-4.5" />
          <span>Generate New Dataset</span>
        </button>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* Custom Array Input Form */}
      <form onSubmit={handleCustomSubmit} className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="custom-array-input" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Custom Array Input
          </label>
          {inputError && (
            <span className="text-[10px] font-medium text-rose-500 dark:text-rose-400">
              {inputError}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            id="custom-array-input"
            type="text"
            placeholder="e.g. 45, 12, 89, 3, 23, 67, 98"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            disabled={status === 'running' || status === 'paused'}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={status === 'running' || status === 'paused'}
            className="rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Apply
          </button>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
          Provide comma-separated integers (values range 10–300).
        </span>
      </form>
    </div>
  );
};
