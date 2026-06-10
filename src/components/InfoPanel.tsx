import React from 'react';
import { BookOpen, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import type { AlgorithmMetadata } from '../types/sort';


interface InfoPanelProps {
  info: AlgorithmMetadata;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ info }) => {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <BookOpen className="h-5 w-5 text-indigo-500" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          How {info.name} Works
        </h3>
      </div>

      {/* Description */}
      <div>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {info.description}
        </p>
      </div>

      {/* Overview of Steps */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <HelpCircle className="h-4 w-4 text-indigo-500" />
          <span>Execution Details</span>
        </div>
        <ol className="list-decimal list-inside text-xs space-y-1.5 pl-1 text-slate-500 dark:text-slate-400 leading-relaxed">
          {info.explanation.steps.map((step, idx) => (
            <li key={idx} className="pl-1">
              <span className="text-slate-600 dark:text-slate-350">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        {/* Pros */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Advantages</span>
          </div>
          <ul className="list-disc list-inside text-[11px] space-y-1 pl-1 text-slate-500 dark:text-slate-400 leading-relaxed">
            {info.explanation.pros.map((pro, idx) => (
              <li key={idx} className="pl-0.5">
                <span className="text-slate-505 dark:text-slate-350">{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>Disadvantages</span>
          </div>
          <ul className="list-disc list-inside text-[11px] space-y-1 pl-1 text-slate-500 dark:text-slate-400 leading-relaxed">
            {info.explanation.cons.map((con, idx) => (
              <li key={idx} className="pl-0.5">
                <span className="text-slate-505 dark:text-slate-350">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
