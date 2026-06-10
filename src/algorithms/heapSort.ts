import type { SortStep, ElementStatus } from '../types/sort';


export function* heapSort(arr: number[]): Generator<SortStep, void, unknown> {
  const array = [...arr];
  const n = array.length;
  let comparisonsCount = 0;
  let swapsCount = 0;
  const sortedIndices = new Set<number>();

  yield {
    array: [...array],
    type: 'none',
    highlightedIndices: {},
    pseudocodeLine: 0,
    comparisonsCount,
    swapsCount
  };

  // Line 1: Build max heap
  yield {
    array: [...array],
    type: 'none',
    highlightedIndices: {},
    pseudocodeLine: 1,
    comparisonsCount,
    swapsCount
  };
  yield* buildMaxHeap();

  // Line 2: Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices, { 0: 'pivot', [i]: 'pivot' }),
      pseudocodeLine: 2,
      comparisonsCount,
      swapsCount
    };

    // Swap root (max element) with last element
    const temp = array[0];
    array[0] = array[i];
    array[i] = temp;
    swapsCount++;

    // Line 3: Swap root with last element
    yield {
      array: [...array],
      type: 'swap',
      highlightedIndices: getHighlights(sortedIndices, { 0: 'swap', [i]: 'swap' }),
      pseudocodeLine: 3,
      comparisonsCount,
      swapsCount
    };

    // The element placed at index i is now sorted
    sortedIndices.add(i);

    // Line 4: heapify root to restore max heap on remaining elements
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices),
      pseudocodeLine: 4,
      comparisonsCount,
      swapsCount
    };
    yield* maxHeapify(0, i);
  }

  // The last remaining element at index 0 is sorted
  sortedIndices.add(0);

  yield {
    array: [...array],
    type: 'sorted',
    highlightedIndices: getHighlights(sortedIndices),
    pseudocodeLine: 1,
    comparisonsCount,
    swapsCount
  };

  function* buildMaxHeap(): Generator<SortStep, void, unknown> {
    const startIdx = Math.floor(n / 2) - 1;
    for (let i = startIdx; i >= 0; i--) {
      yield* maxHeapify(i, n);
    }
  }

  function* maxHeapify(idx: number, heapSize: number): Generator<SortStep, void, unknown> {
    // Line 6: maxHeapify entry
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices, { [idx]: 'pivot' }),
      pseudocodeLine: 6,
      comparisonsCount,
      swapsCount
    };

    const left = 2 * idx + 1;
    const right = 2 * idx + 2;
    let largest = idx;

    // Line 7: initialize pointers
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices, { [idx]: 'pivot' }),
      pseudocodeLine: 7,
      comparisonsCount,
      swapsCount
    };

    // Compare left child
    if (left < heapSize) {
      comparisonsCount++;
      // Line 8: find largest comparisons
      yield {
        array: [...array],
        type: 'compare',
        highlightedIndices: getHighlights(sortedIndices, { [idx]: 'pivot', [left]: 'compare' }),
        pseudocodeLine: 8,
        comparisonsCount,
        swapsCount
      };

      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    // Compare right child
    if (right < heapSize) {
      comparisonsCount++;
      yield {
        array: [...array],
        type: 'compare',
        highlightedIndices: getHighlights(sortedIndices, { [idx]: 'pivot', [largest]: 'pivot', [right]: 'compare' }),
        pseudocodeLine: 8,
        comparisonsCount,
        swapsCount
      };

      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    // Line 9: check if largest changed
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices, { [idx]: 'pivot', [largest]: 'pivot' }),
      pseudocodeLine: 9,
      comparisonsCount,
      swapsCount
    };

    if (largest !== idx) {
      const temp = array[idx];
      array[idx] = array[largest];
      array[largest] = temp;
      swapsCount++;

      // Line 10: swap parent with largest child
      yield {
        array: [...array],
        type: 'swap',
        highlightedIndices: getHighlights(sortedIndices, { [idx]: 'swap', [largest]: 'swap' }),
        pseudocodeLine: 10,
        comparisonsCount,
        swapsCount
      };

      // Line 11: recursive heapify call
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: getHighlights(sortedIndices),
        pseudocodeLine: 11,
        comparisonsCount,
        swapsCount
      };
      yield* maxHeapify(largest, heapSize);
    }
  }

  function getHighlights(sorted: Set<number>, active: { [key: number]: ElementStatus } = {}): { [key: number]: ElementStatus } {
    const highlights: { [key: number]: ElementStatus } = { ...active };
    sorted.forEach(idx => {
      if (!highlights[idx]) {
        highlights[idx] = 'sorted';
      }
    });
    return highlights;
  }
}
