import React from 'react';
import { Sun, Moon, Sparkles, HelpCircle, BarChart3, Columns, MonitorPlay } from 'lucide-react';
import type { VisualizerMode } from '../types/sort';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  mode: VisualizerMode;
  setMode: (mode: VisualizerMode) => void;
  onHelpOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  onHelpOpen
}) => {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';
  const toggleDarkMode = toggleTheme;
  return (
    <header className="sticky top-0 z-45 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 transition-colors">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="text-md font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Sort<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
          </span>
          <span className="hidden sm:inline-block rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
            v1.0.0
          </span>
        </div>

        {/* Modes Navigation */}
        <nav className="flex items-center rounded-xl bg-slate-100/60 p-1 dark:bg-slate-800/50" aria-label="Visualizer Modes">
          <button
            onClick={() => setMode('single')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
              mode === 'single'
                ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-205'
            }`}
          >
            <MonitorPlay className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Dashboard</span>
          </button>
          <button
            onClick={() => setMode('compare')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
              mode === 'compare'
                ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-205'
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Comparison Mode</span>
            <span className="md:hidden">Compare</span>
          </button>
          <button
            onClick={() => setMode('benchmark')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
              mode === 'benchmark'
                ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-205'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Benchmark Suite</span>
            <span className="md:hidden">Benchmark</span>
          </button>
        </nav>

        {/* Global actions: theme + help */}
        <div className="flex items-center gap-2">
          {/* Keyboard Help trigger */}
          <button
            onClick={onHelpOpen}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Help Guide"
          >
            <HelpCircle className="h-4.5 w-4.5" />
          </button>

          {/* Theme toggler */}
          <button
            onClick={toggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="h-4.5 w-4.5 text-amber-500 fill-amber-500/10" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
