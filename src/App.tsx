import { useState, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { ChevronDown, Download } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { VisualizerCanvas } from './components/VisualizerCanvas';
import { ControlPanel } from './components/ControlPanel';
import { StatsPanel } from './components/StatsPanel';
import { CodeHighlightPanel } from './components/CodeHighlightPanel';
import { InfoPanel } from './components/InfoPanel';
import { ComparisonMode } from './components/ComparisonMode';
import { BenchmarkPanel } from './components/BenchmarkPanel';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { useSortVisualizer } from './hooks/useSortVisualizer';
import type { AlgorithmType, VisualizerMode, DatasetType } from './types/sort';
import { ALGORITHMS_INFO } from './algorithms/algorithmInfo';
import { useTheme } from './context/ThemeContext';

// Helper function to generate datasets
const generateDataset = (size: number, type: DatasetType): number[] => {
  const arr: number[] = [];
  if (type === 'random') {
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 290) + 10);
    }
  } else if (type === 'reversed') {
    for (let i = size; i > 0; i--) {
      const val = Math.floor((i / size) * 290) + 10;
      arr.push(val);
    }
  } else if (type === 'nearly-sorted') {
    // Generate sorted array
    for (let i = 1; i <= size; i++) {
      const val = Math.floor((i / size) * 290) + 10;
      arr.push(val);
    }
    // Perform a small number of random adjacent swaps to make it nearly sorted
    const swapCount = Math.max(2, Math.floor(size * 0.05));
    for (let s = 0; s < swapCount; s++) {
      const idx = Math.floor(Math.random() * (size - 1));
      const temp = arr[idx];
      arr[idx] = arr[idx + 1];
      arr[idx + 1] = temp;
    }
  }
  return arr;
};

function App() {
  // Global View Configurations
  const [mode, setMode] = useState<VisualizerMode>('single');
  const { theme } = useTheme();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Sorting Dataset state
  const [arraySize, setArraySize] = useState<number>(50);
  const [datasetType, setDatasetType] = useState<DatasetType>('random');
  const [initialArray, setInitialArray] = useState<number[]>(() =>
    generateDataset(50, 'random')
  );

  // Speed and Single Visualizer specific configurations
  const [speed, setSpeed] = useState<number>(40);
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>('bubble');

  // Instantiate Single Sorter visualizer hook
  const visualizer = useSortVisualizer({
    initialArray,
    algorithm: selectedAlgo,
    speed
  });

  // Handle new array generation
  const handleGenerateArray = useCallback(() => {
    visualizer.reset();
    const newArr = generateDataset(arraySize, datasetType);
    setInitialArray(newArr);
  }, [arraySize, datasetType, visualizer]);

  // Handle custom array submit
  const handleCustomArraySubmit = (customArr: number[]) => {
    visualizer.reset();
    setInitialArray(customArr);
    setArraySize(customArr.length);
    setDatasetType('custom');
  };

  // Regeneration on size / dataset type changes (if visualizer is not running)
  useEffect(() => {
    if (visualizer.status === 'idle') {
      const newArr = generateDataset(arraySize, datasetType);
      setInitialArray(newArr);
    }
  }, [arraySize, datasetType, visualizer.status]);

  // Unified Play / Pause trigger
  const handlePlayPause = () => {
    if (visualizer.status === 'running') {
      visualizer.pause();
    } else if (visualizer.status === 'paused') {
      visualizer.resume();
    } else {
      visualizer.start();
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing shortcuts when user is focused on forms
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'KeyR') {
        visualizer.reset();
      } else if (e.code === 'KeyG') {
        handleGenerateArray();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        visualizer.stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        visualizer.stepBackward();
      } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6'].includes(e.code)) {
        const digitIndex = parseInt(e.code.replace('Digit', ''), 10) - 1;
        const algos: AlgorithmType[] = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'];
        if (digitIndex >= 0 && digitIndex < algos.length) {
          visualizer.reset();
          setSelectedAlgo(algos[digitIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visualizer, handlePlayPause, handleGenerateArray]);

  // Export visualizer state as image
  const handleExportImage = async () => {
    const containerId = mode === 'compare' ? 'canvas-a-container' : 'canvas-container';
    const canvasEl = document.getElementById(containerId);
    if (!canvasEl) return;

    try {
      const captureCanvas = await html2canvas(canvasEl, {
        backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
        scale: 2,
        useCORS: true,
        logging: false
      });

      const dataUrl = captureCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `sortflow-snapshot-${selectedAlgo}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to capture snapshot:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 transition-colors flex flex-col font-sans">
      {/* Top Navbar Header */}
      <Navbar
        mode={mode}
        setMode={(m) => {
          visualizer.reset();
          setMode(m);
        }}
        onHelpOpen={() => setIsHelpOpen(true)}
      />

      {/* Main Layout Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {mode === 'single' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Sidebar Controls Column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Algorithm Dropdown card */}
              <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 transition-colors">
                <label htmlFor="algo-select" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Algorithm
                </label>
                <div className="relative flex items-center">
                  <select
                    id="algo-select"
                    value={selectedAlgo}
                    disabled={visualizer.status === 'running' || visualizer.status === 'paused'}
                    onChange={(e) => {
                      visualizer.reset();
                      setSelectedAlgo(e.target.value as AlgorithmType);
                    }}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-3 text-sm font-semibold text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 cursor-pointer disabled:opacity-60"
                  >
                    {Object.values(ALGORITHMS_INFO).map((algo) => (
                      <option key={algo.id} value={algo.id} className="bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100">
                        {algo.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 pointer-events-none h-4.5 w-4.5 text-slate-450 dark:text-slate-500" />
                </div>
              </div>

              {/* Controls Dashboard */}
              <ControlPanel
                status={visualizer.status}
                arraySize={arraySize}
                setArraySize={setArraySize}
                speed={speed}
                setSpeed={setSpeed}
                datasetType={datasetType}
                setDatasetType={setDatasetType}
                onGenerate={handleGenerateArray}
                onPlayPause={handlePlayPause}
                onReset={visualizer.reset}
                onStepForward={visualizer.stepForward}
                onStepBackward={visualizer.stepBackward}
                canStepForward={visualizer.canStepForward}
                canStepBackward={visualizer.canStepBackward}
                onCustomArraySubmit={handleCustomArraySubmit}
                onHelpOpen={() => setIsHelpOpen(true)}
              />

              {/* Live Pseudocode Highlight Panel */}
              <CodeHighlightPanel
                pseudocode={ALGORITHMS_INFO[selectedAlgo].pseudocode}
                currentLine={visualizer.pseudocodeLine}
              />
            </div>

            {/* Main Visualizer Canvas & Stats Column */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Top Row: Current Stats */}
              <StatsPanel
                stats={visualizer.stats}
                complexity={ALGORITHMS_INFO[selectedAlgo].complexity}
                fps={visualizer.fps}
                avgStepTimeMs={visualizer.avgStepTimeMs}
                status={visualizer.status}
              />

              {/* Canvas Container with overlays */}
              <div className="relative group">
                <VisualizerCanvas
                  array={visualizer.array}
                  highlightedIndices={visualizer.highlightedIndices}
                  isSorting={visualizer.status === 'running' || visualizer.status === 'paused'}
                />

                {/* Snap Export Overlay Icon */}
                <button
                  onClick={handleExportImage}
                  className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow-md border border-slate-200 text-slate-500 backdrop-blur-xs hover:bg-white dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-900 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Export Snapshot as Image"
                  aria-label="Export visualization snapshot to image file"
                >
                  <Download className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Concepts details Panel */}
              <InfoPanel info={ALGORITHMS_INFO[selectedAlgo]} />
            </div>
          </div>
        )}

        {mode === 'compare' && (
          <ComparisonMode
            initialArray={initialArray}
            onGenerate={handleGenerateArray}
            speed={speed}
            setSpeed={setSpeed}
          />
        )}

        {mode === 'benchmark' && (
          <BenchmarkPanel initialArray={initialArray} />
        )}
      </main>

      {/* Accessibility Keyboard Modal */}
      <KeyboardShortcutsHelp
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

export default App;
