import { useState, useEffect, useRef, useCallback } from 'react';
import type { AlgorithmType, SortStep, ElementStatus, SortStats } from '../types/sort';
import * as algorithms from '../algorithms';
import { useAudioSettings } from '../context/AudioContext';


interface UseSortVisualizerProps {
  initialArray: number[];
  algorithm: AlgorithmType;
  speed: number; // delay in ms
  onComplete?: () => void;
}

export const useSortVisualizer = ({
  initialArray,
  algorithm,
  speed,
  onComplete
}: UseSortVisualizerProps) => {
  const [array, setArray] = useState<number[]>([...initialArray]);
  const [highlightedIndices, setHighlightedIndices] = useState<{ [key: number]: ElementStatus }>({});
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [stats, setStats] = useState<SortStats>({ comparisons: 0, swaps: 0, elapsedTime: 0 });
  const [pseudocodeLine, setPseudocodeLine] = useState<number>(-1);
  const { playTone, playSuccessMelody } = useAudioSettings();


  // Performance metrics state
  const [fps, setFps] = useState<number>(60);
  const [avgStepTimeMs, setAvgStepTimeMs] = useState<number>(0);

  // Step history for stepping backward/forward
  const historyRef = useRef<SortStep[]>([]);
  const historyIndexRef = useRef<number>(-1);

  // Generator reference
  const generatorRef = useRef<Generator<SortStep, void, unknown> | null>(null);

  // Timer references
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickTimeRef = useRef<number>(0);

  // For FPS calculation
  const fpsFrameTimesRef = useRef<number[]>([]);
  const stepTimesRef = useRef<number[]>([]);

  // Initialize/reset generator
  const initGenerator = useCallback((arr: number[]) => {
    const sortFnName = `${algorithm}Sort`;
    const sortFn = algorithms[sortFnName as keyof typeof algorithms];
    if (typeof sortFn === 'function') {
      generatorRef.current = sortFn(arr) as Generator<SortStep, void, unknown>;
      historyRef.current = [];
      historyIndexRef.current = -1;
      console.log('[Debug] Algorithm selected:', algorithm);
    } else {
      console.error('[Debug] Failed to initialize generator: Function not found:', sortFnName);
    }
  }, [algorithm]);

  // Sync array on parent update if idle
  useEffect(() => {
    if (status === 'idle') {
      setArray([...initialArray]);
      setHighlightedIndices({});
      setStats({ comparisons: 0, swaps: 0, elapsedTime: 0 });
      setPseudocodeLine(-1);
      initGenerator(initialArray);
    }
  }, [initialArray, status, initGenerator]);

  // Handle elapsed time timer
  useEffect(() => {
    if (status === 'running') {
      const interval = 100; // update every 100ms
      elapsedTimerRef.current = setInterval(() => {
        setStats(prev => ({
          ...prev,
          elapsedTime: prev.elapsedTime + interval
        }));
      }, interval);
    } else {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
      }
    }

    return () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
      }
    };
  }, [status]);

  const playStepAudio = useCallback((step: SortStep, prevHighlights: { [key: number]: ElementStatus }) => {
    const maxValue = Math.max(...step.array, 1);

    // 1. Check for newly sorted element
    const newlySortedIdx = Object.keys(step.highlightedIndices).find(idxStr => {
      const idx = Number(idxStr);
      return step.highlightedIndices[idx] === 'sorted' && prevHighlights[idx] !== 'sorted';
    });

    if (newlySortedIdx !== undefined) {
      const idx = Number(newlySortedIdx);
      playTone(step.array[idx], maxValue, 'sorted');
      return;
    }

    // 2. Check for swaps / overwrites
    if (step.type === 'swap' || step.type === 'overwrite') {
      const swapIndices = Object.keys(step.highlightedIndices)
        .filter(idxStr => {
          const status = step.highlightedIndices[Number(idxStr)];
          return status === 'swap' || status === 'pivot';
        })
        .map(Number);

      if (swapIndices.length > 0) {
        playTone(step.array[swapIndices[0]], maxValue, 'swap');
      }
      return;
    }

    // 3. Check for comparisons
    if (step.type === 'compare') {
      const compareIndices = Object.keys(step.highlightedIndices)
        .filter(idxStr => step.highlightedIndices[Number(idxStr)] === 'compare')
        .map(Number);

      if (compareIndices.length > 0) {
        playTone(step.array[compareIndices[0]], maxValue, 'compare');
      }
      return;
    }
  }, [playTone]);

  // Single step forward
  const stepForward = useCallback((): boolean => {
    if (!generatorRef.current) {
      console.warn('[Debug] stepForward called but no generator active.');
      return false;
    }

    // Calculate FPS and step render duration
    const startTime = performance.now();
    const lastTick = lastTickTimeRef.current;
    const now = startTime;
    lastTickTimeRef.current = now;

    if (lastTick > 0) {
      const delta = now - lastTick;
      fpsFrameTimesRef.current.push(delta);
      if (fpsFrameTimesRef.current.length > 20) fpsFrameTimesRef.current.shift();
      const avgDelta = fpsFrameTimesRef.current.reduce((a, b) => a + b, 0) / fpsFrameTimesRef.current.length;
      setFps(Math.round(1000 / avgDelta));
    }

    // Check if we are scrubbed backwards in history
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const step = historyRef.current[historyIndexRef.current];
      
      const prevStep = historyIndexRef.current > 0 ? historyRef.current[historyIndexRef.current - 1] : null;
      const prevHighlights = prevStep ? prevStep.highlightedIndices : {};

      setArray(step.array);
      setHighlightedIndices(step.highlightedIndices);
      setStats(prev => ({
        ...prev,
        comparisons: step.comparisonsCount,
        swaps: step.swapsCount
      }));
      setPseudocodeLine(step.pseudocodeLine);
      
      playStepAudio(step, prevHighlights);
      console.log('[Debug] Current animation frame (history):', historyIndexRef.current + 1);

      const endTime = performance.now();
      stepTimesRef.current.push(endTime - startTime);
      if (stepTimesRef.current.length > 20) stepTimesRef.current.shift();
      setAvgStepTimeMs(stepTimesRef.current.reduce((a, b) => a + b, 0) / stepTimesRef.current.length);
      return true;
    }

    // Otherwise, generate next step
    const nextVal = generatorRef.current.next();
    if (!nextVal.done) {
      const step = nextVal.value;
      historyRef.current.push(step);
      historyIndexRef.current++;

      setArray(step.array);
      playStepAudio(step, highlightedIndices);
      setHighlightedIndices(step.highlightedIndices);
      setStats(prev => ({
        ...prev,
        comparisons: step.comparisonsCount,
        swaps: step.swapsCount
      }));
      setPseudocodeLine(step.pseudocodeLine);

      console.log('[Debug] Current animation frame generated:', historyIndexRef.current + 1);

      const endTime = performance.now();
      stepTimesRef.current.push(endTime - startTime);
      if (stepTimesRef.current.length > 20) stepTimesRef.current.shift();
      setAvgStepTimeMs(stepTimesRef.current.reduce((a, b) => a + b, 0) / stepTimesRef.current.length);
      return true;
    } else {
      setStatus('completed');
      setHighlightedIndices({}); // Clear temporary highlights
      // Add all as sorted state
      const finalHighlights: { [key: number]: ElementStatus } = {};
      for (let i = 0; i < array.length; i++) {
        finalHighlights[i] = 'sorted';
      }
      setHighlightedIndices(finalHighlights);
      console.log('[Debug] Sorting completed. Total animation frames generated:', historyRef.current.length);
      playSuccessMelody();
      if (onComplete) onComplete();
      return false;
    }
  }, [array.length, onComplete, playStepAudio, playSuccessMelody, highlightedIndices]);


  // Single step backward
  const stepBackward = useCallback((): boolean => {
    if (historyIndexRef.current <= 0) return false;

    historyIndexRef.current--;
    const step = historyRef.current[historyIndexRef.current];
    setArray(step.array);
    setHighlightedIndices(step.highlightedIndices);
    setStats(prev => ({
      ...prev,
      comparisons: step.comparisonsCount,
      swaps: step.swapsCount
    }));
    setPseudocodeLine(step.pseudocodeLine);
    return true;
  }, []);

  // References to keep state values up to date in the loop without causing re-renders/infinite loops
  const speedRef = useRef(speed);
  const statusRef = useRef(status);
  const stepForwardRef = useRef(stepForward);
  const lastTickTimestampRef = useRef<number>(0);

  // Sync refs on state changes
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    stepForwardRef.current = stepForward;
  }, [stepForward]);

  // Control operations
  const start = useCallback(() => {
    console.log('[Debug] Start button clicked. Algorithm:', algorithm);
    if (status === 'completed') {
      // Re-initialize generator
      initGenerator(initialArray);
      setStats({ comparisons: 0, swaps: 0, elapsedTime: 0 });
    }
    setStatus('running');
    lastTickTimeRef.current = performance.now();
  }, [status, initGenerator, initialArray, algorithm]);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    setStatus('running');
    lastTickTimeRef.current = performance.now();
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setArray([...initialArray]);
    setHighlightedIndices({});
    setStats({ comparisons: 0, swaps: 0, elapsedTime: 0 });
    setPseudocodeLine(-1);
    initGenerator(initialArray);
  }, [initialArray, initGenerator]);

  // Decoupled Animation Loop
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      if (statusRef.current !== 'running') return;

      const now = performance.now();
      const actualElapsed = lastTickTimestampRef.current > 0 ? (now - lastTickTimestampRef.current).toFixed(1) : '0.0';
      lastTickTimestampRef.current = now;

      const frameCount = historyIndexRef.current + 1;
      const currentSlider = speedRef.current;
      const effectiveDelay = speedRef.current;

      console.log(
        `[SortVisualizer Debug] Frame: ${frameCount} | Slider: ${currentSlider}ms | Effective Delay: ${effectiveDelay}ms | Actual Interval: ${actualElapsed}ms`
      );

      const hasNext = stepForwardRef.current();
      if (hasNext) {
        timeoutId = setTimeout(tick, speedRef.current);
      }
    };

    if (status === 'running') {
      lastTickTimestampRef.current = 0;
      tick();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [status]);

  return {
    array,
    highlightedIndices,
    status,
    stats,
    pseudocodeLine,
    fps,
    avgStepTimeMs,
    start,
    pause,
    resume,
    reset,
    stepForward: () => {
      pause();
      stepForward();
    },
    stepBackward: () => {
      pause();
      stepBackward();
    },
    canStepForward: status !== 'completed' && (generatorRef.current !== null),
    canStepBackward: historyIndexRef.current > 0
  };
};
