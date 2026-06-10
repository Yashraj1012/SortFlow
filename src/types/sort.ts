export type AlgorithmType = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';

export type VisualizerMode = 'single' | 'compare' | 'benchmark';

export type DatasetType = 'random' | 'nearly-sorted' | 'reversed' | 'custom';

export type ElementStatus = 'idle' | 'compare' | 'swap' | 'pivot' | 'sorted';

export interface ElementState {
  value: number;
  status: ElementStatus;
}

export interface SortStep {
  array: number[];
  type: 'compare' | 'swap' | 'overwrite' | 'pivot' | 'sorted' | 'none';
  highlightedIndices: { [key: number]: ElementStatus };
  pseudocodeLine: number;
  comparisonsCount: number;
  swapsCount: number;
}

export interface SortStats {
  comparisons: number;
  swaps: number;
  elapsedTime: number; // in ms
}

export interface BenchmarkResult {
  algorithmId: AlgorithmType;
  name: string;
  timeMs: number;
  comparisons: number;
  swaps: number;
  completed: boolean;
}

export interface AlgorithmComplexity {
  best: string;
  average: string;
  worst: string;
  space: string;
}

export interface AlgorithmMetadata {
  id: AlgorithmType;
  name: string;
  description: string;
  complexity: AlgorithmComplexity;
  pseudocode: string[];
  explanation: {
    overview: string;
    steps: string[];
    pros: string[];
    cons: string[];
  };
}
