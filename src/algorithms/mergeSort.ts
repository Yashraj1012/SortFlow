import type { SortStep, ElementStatus } from '../types/sort';

export function* mergeSort(arr: number[]): Generator<SortStep, void, unknown> {
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

  // Run the recursive helper
  yield* mergeSortHelper(0, n - 1);

  // Mark all elements as sorted at the end
  for (let k = 0; k < n; k++) {
    sortedIndices.add(k);
  }
  yield {
    array: [...array],
    type: 'sorted',
    highlightedIndices: getHighlights(sortedIndices),
    pseudocodeLine: 0,
    comparisonsCount,
    swapsCount
  };

  function* mergeSortHelper(l: number, r: number): Generator<SortStep, void, unknown> {
    // Line 1: if l < r
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getActiveRangeHighlights(l, r),
      pseudocodeLine: 1,
      comparisonsCount,
      swapsCount
    };

    if (l < r) {
      const m = Math.floor((l + r) / 2);
      
      // Line 2: calculate mid
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: {
          ...getActiveRangeHighlights(l, r),
          [m]: 'pivot' // Highlight mid as pivot for visual separation
        },
        pseudocodeLine: 2,
        comparisonsCount,
        swapsCount
      };

      // Line 3: sort left half
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: getActiveRangeHighlights(l, m),
        pseudocodeLine: 3,
        comparisonsCount,
        swapsCount
      };
      yield* mergeSortHelper(l, m);

      // Line 4: sort right half
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: getActiveRangeHighlights(m + 1, r),
        pseudocodeLine: 4,
        comparisonsCount,
        swapsCount
      };
      yield* mergeSortHelper(m + 1, r);

      // Line 5: merge halves
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: getActiveRangeHighlights(l, r),
        pseudocodeLine: 5,
        comparisonsCount,
        swapsCount
      };
      yield* merge(l, m, r);
    }
  }

  function* merge(l: number, m: number, r: number): Generator<SortStep, void, unknown> {
    // Line 7: merge function entry
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getActiveRangeHighlights(l, r),
      pseudocodeLine: 7,
      comparisonsCount,
      swapsCount
    };

    const L = array.slice(l, m + 1);
    const R = array.slice(m + 1, r + 1);

    // Line 8: copy subarrays
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getActiveRangeHighlights(l, r),
      pseudocodeLine: 8,
      comparisonsCount,
      swapsCount
    };

    let i = 0;
    let j = 0;
    let k = l;

    // Line 9: compare and merge loop
    while (i < L.length && j < R.length) {
      // Highlight the elements being compared
      // The element from L is at l + i, element from R is at m + 1 + j
      comparisonsCount++;
      yield {
        array: [...array],
        type: 'compare',
        highlightedIndices: {
          ...getActiveRangeHighlights(l, r),
          [l + i]: 'compare',
          [m + 1 + j]: 'compare'
        },
        pseudocodeLine: 9,
        comparisonsCount,
        swapsCount
      };

      if (L[i] <= R[j]) {
        array[k] = L[i];
        i++;
      } else {
        array[k] = R[j];
        j++;
      }
      swapsCount++; // increment swaps count (as write/overwrite operation)

      // Highlight the overwrite
      yield {
        array: [...array],
        type: 'overwrite',
        highlightedIndices: {
          ...getActiveRangeHighlights(l, r),
          [k]: 'swap'
        },
        pseudocodeLine: 9,
        comparisonsCount,
        swapsCount
      };
      k++;
    }

    // Copy remaining elements of L
    while (i < L.length) {
      array[k] = L[i];
      i++;
      swapsCount++;
      yield {
        array: [...array],
        type: 'overwrite',
        highlightedIndices: {
          ...getActiveRangeHighlights(l, r),
          [k]: 'swap'
        },
        pseudocodeLine: 9,
        comparisonsCount,
        swapsCount
      };
      k++;
    }

    // Copy remaining elements of R
    while (j < R.length) {
      array[k] = R[j];
      j++;
      swapsCount++;
      yield {
        array: [...array],
        type: 'overwrite',
        highlightedIndices: {
          ...getActiveRangeHighlights(l, r),
          [k]: 'swap'
        },
        pseudocodeLine: 9,
        comparisonsCount,
        swapsCount
      };
      k++;
    }

    // Mark current merged range as sorted temporarily (rendered as green/sorted range)
    // In final pass, everything becomes fully green. For intermediate states, we can keep them in 'idle' or standard color.
  }

  function getActiveRangeHighlights(_start: number, _end: number): { [key: number]: ElementStatus } {
    const highlights: { [key: number]: ElementStatus } = {};
    // Let's highlight the elements currently within the merge scope with a subtle color if needed,
    // or just let them stay normal. In this case, we don't highlight the entire range to avoid color overload,
    // but we can mark sorted elements.
    for (let k = 0; k < n; k++) {
      if (sortedIndices.has(k)) {
        highlights[k] = 'sorted';
      }
    }
    return highlights;
  }
}

function getHighlights(sorted: Set<number>): { [key: number]: ElementStatus } {
  const highlights: { [key: number]: ElementStatus } = {};
  sorted.forEach(idx => {
    highlights[idx] = 'sorted';
  });
  return highlights;
}
