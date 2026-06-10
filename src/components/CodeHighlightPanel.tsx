import React from 'react';
import { Terminal } from 'lucide-react';

interface CodeHighlightPanelProps {
  pseudocode: string[];
  currentLine: number;
}

export const CodeHighlightPanel: React.FC<CodeHighlightPanelProps> = ({
  pseudocode,
  currentLine
}) => {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/80 transition-colors overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/30">
        <Terminal className="h-4.5 w-4.5 text-indigo-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Real-Time Code Execution Trace
        </h3>
      </div>

      {/* Code Container */}
      <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed dark:text-slate-300">
        <div className="min-w-fit space-y-1">
          {pseudocode.map((line, idx) => {
            const isHighlighted = idx === currentLine;

            return (
              <div
                key={idx}
                className={`flex rounded-md transition-all duration-75 ${
                  isHighlighted
                    ? 'bg-indigo-50/70 border-l-3 border-indigo-600 pl-1 dark:bg-indigo-950/40 dark:border-indigo-400'
                    : 'pl-2 border-l-3 border-transparent'
                }`}
              >
                {/* Line number */}
                <span
                  className={`w-6 select-none text-right pr-2 font-semibold ${
                    isHighlighted
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-300 dark:text-slate-650'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Code line content */}
                <pre
                  className={`flex-1 whitespace-pre ${
                    isHighlighted
                      ? 'text-slate-900 font-bold dark:text-slate-550'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {line}
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
