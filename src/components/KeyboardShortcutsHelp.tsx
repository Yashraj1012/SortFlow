import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose
}) => {
  // Close on Escape press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Keyboard Shortcuts & Accessibility
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="mt-4 space-y-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Global Controls
                </h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Play / Pause Animation</span>
                    <kbd className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold shadow-xs dark:border-slate-700 dark:bg-slate-800">Space</kbd>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Reset Current Sort</span>
                    <kbd className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold shadow-xs dark:border-slate-700 dark:bg-slate-800">R</kbd>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Generate New Array</span>
                    <kbd className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold shadow-xs dark:border-slate-700 dark:bg-slate-800">G</kbd>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Step Forward (When Paused)</span>
                    <kbd className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold shadow-xs dark:border-slate-700 dark:bg-slate-800">→</kbd>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Step Backward (When Paused)</span>
                    <kbd className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold shadow-xs dark:border-slate-700 dark:bg-slate-800">←</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Algorithm Selector
                </h4>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between items-center pr-2">
                    <span>Bubble Sort</span>
                    <kbd className="rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-semibold shadow-xs dark:border-slate-700 dark:bg-slate-800">1</kbd>
                  </div>
                  <div className="flex justify-between items-center pl-2">
                    <span>Selection Sort</span>
                    <kbd className="rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-semibold shadow-xs dark:border-slate-700 dark:bg-slate-800">2</kbd>
                  </div>
                  <div className="flex justify-between items-center pr-2">
                    <span>Insertion Sort</span>
                    <kbd className="rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-semibold shadow-xs dark:border-slate-700 dark:bg-slate-800">3</kbd>
                  </div>
                  <div className="flex justify-between items-center pl-2">
                    <span>Merge Sort</span>
                    <kbd className="rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-semibold shadow-xs dark:border-slate-700 dark:bg-slate-800">4</kbd>
                  </div>
                  <div className="flex justify-between items-center pr-2">
                    <span>Quick Sort</span>
                    <kbd className="rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-semibold shadow-xs dark:border-slate-700 dark:bg-slate-800">5</kbd>
                  </div>
                  <div className="flex justify-between items-center pl-2">
                    <span>Heap Sort</span>
                    <kbd className="rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-semibold shadow-xs dark:border-slate-700 dark:bg-slate-800">6</kbd>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Color Guide
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-sm bg-indigo-500 dark:bg-indigo-600 block"></span>
                    <span>Unsorted Element</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-sm bg-amber-400 dark:bg-amber-500 block"></span>
                    <span>Comparing / Reading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-sm bg-rose-500 dark:bg-rose-600 block"></span>
                    <span>Swapping / Overwriting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-sm bg-purple-500 dark:bg-purple-600 block"></span>
                    <span>Pivot / Special Candidate</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <span className="h-3.5 w-3.5 rounded-sm bg-emerald-500 dark:bg-emerald-600 block"></span>
                    <span>Sorted Element</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
