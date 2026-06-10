import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ElementStatus } from '../types/sort';

interface VisualizerCanvasProps {
  array: number[];
  highlightedIndices: { [key: number]: ElementStatus };
  containerId?: string;
  isSorting?: boolean;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  array,
  highlightedIndices,
  containerId = 'canvas-container',
  isSorting = false
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const maxValue = array.length > 0 ? Math.max(...array) : 100;
  const disableTooltip = isSorting && array.length > 100;

  // Determine bar colors based on theme/status
  const getBarColorClass = (status: ElementStatus) => {
    switch (status) {
      case 'compare':
        return 'bg-amber-400 dark:bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      case 'swap':
        return 'bg-rose-500 dark:bg-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.5)]';
      case 'pivot':
        return 'bg-purple-500 dark:bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.5)]';
      case 'sorted':
        return 'bg-emerald-500 dark:bg-emerald-600';
      default:
        return 'bg-indigo-500 hover:bg-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-500';
    }
  };

  return (
    <div
      id={containerId}
      className="relative flex h-80 w-full items-end justify-center rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-colors md:h-96 dark:border-slate-800/80 dark:bg-slate-950/20 backdrop-blur-xs"
      role="region"
      aria-label="Sorting Visualizer Canvas"
    >
      <div className="flex h-full w-full items-end justify-between gap-[1px] md:gap-[2px]">
        {array.map((value, idx) => {
          const status = highlightedIndices[idx] || 'idle';
          const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const barColorClass = getBarColorClass(status);
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={idx}
              className="group relative flex flex-col justify-end w-full cursor-pointer"
              style={{ height: '100%' }}
              onMouseEnter={() => {
                if (!disableTooltip) {
                  setHoveredIndex(idx);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Vertical Bar */}
              <div
                className={`w-full rounded-t-sm transition-all duration-75 ${barColorClass}`}
                style={{ height: `${heightPercent}%` }}
                role="img"
                aria-label={`Element ${idx}: Value ${value}, Status ${status}`}
              />

              {/* Framer Motion Tooltip */}
              <AnimatePresence>
                {isHovered && !disableTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 4, x: '-50%' }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-1/2 z-30 mb-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 whitespace-nowrap pointer-events-none"
                  >
                    Value: {value}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
