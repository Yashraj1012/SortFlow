import type { SortStep, ElementStatus } from '../types/sort';


export function* quickSort(arr: number[]): Generator<SortStep, void, unknown> {
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

  yield* quickSortHelper(0, n - 1);

  // Set all as sorted
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

  function* quickSortHelper(low: number, high: number): Generator<SortStep, void, unknown> {
    // Line 1: if low < high
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices, { [low]: 'compare', [high]: 'compare' }),
      pseudocodeLine: 1,
      comparisonsCount,
      swapsCount
    };

    if (low < high) {
      // Line 2: partition call
      const pResult: number = yield* partition(low, high);
      
      // Line 3: sort left
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: getHighlights(sortedIndices, { [pResult]: 'sorted' }),
        pseudocodeLine: 3,
        comparisonsCount,
        swapsCount
      };
      yield* quickSortHelper(low, pResult - 1);

      // Line 4: sort right
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: getHighlights(sortedIndices, { [pResult]: 'sorted' }),
        pseudocodeLine: 4,
        comparisonsCount,
        swapsCount
      };
      yield* quickSortHelper(pResult + 1, high);
    } else if (low === high) {
      // A single element is sorted by default
      sortedIndices.add(low);
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: getHighlights(sortedIndices),
        pseudocodeLine: 1,
        comparisonsCount,
        swapsCount
      };
    }
  }

  function* partition(low: number, high: number): Generator<SortStep, number, unknown> {
    // Line 6: Partition entry
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices, { [high]: 'pivot' }),
      pseudocodeLine: 6,
      comparisonsCount,
      swapsCount
    };

    const pivot = array[high];
    // Line 7: pivot = array[high]
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices, { [high]: 'pivot' }),
      pseudocodeLine: 7,
      comparisonsCount,
      swapsCount
    };

    let i = low - 1;
    // Line 8: i = low - 1
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices, { [high]: 'pivot' }),
      pseudocodeLine: 8,
      comparisonsCount,
      swapsCount
    };

    for (let j = low; j < high; j++) {
      // Line 9: loop
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: getHighlights(sortedIndices, { [high]: 'pivot', [j]: 'compare' }),
        pseudocodeLine: 9,
        comparisonsCount,
        swapsCount
      };

      comparisonsCount++;
      // Line 10: if array[j] < pivot
      yield {
        array: [...array],
        type: 'compare',
        highlightedIndices: getHighlights(sortedIndices, { [high]: 'pivot', [j]: 'compare' }),
        pseudocodeLine: 10,
        comparisonsCount,
        swapsCount
      };

      if (array[j] < pivot) {
        i++;
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        swapsCount++;

        // Line 11: swap
        yield {
          array: [...array],
          type: 'swap',
          highlightedIndices: getHighlights(sortedIndices, { [high]: 'pivot', [i]: 'swap', [j]: 'swap' }),
          pseudocodeLine: 11,
          comparisonsCount,
          swapsCount
        };
      }
    }

    // Place pivot in its correct spot
    const temp = array[i + 1];
    array[i + 1] = array[high];
    array[high] = temp;
    swapsCount++;

    // Line 12: swap pivot to final place
    yield {
      array: [...array],
      type: 'swap',
      highlightedIndices: getHighlights(sortedIndices, { [i + 1]: 'swap', [high]: 'swap' }),
      pseudocodeLine: 12,
      comparisonsCount,
      swapsCount
    };

    // The pivot element is now sorted
    const pivotIdx = i + 1;
    sortedIndices.add(pivotIdx);

    // Line 13: return i + 1
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices),
      pseudocodeLine: 13,
      comparisonsCount,
      swapsCount
    };

    return pivotIdx;
  }

  function getHighlights(sorted: Set<number>, active: { [key: number]: ElementStatus } = {}): { [key: number]: ElementStatus } {
    const highlights: { [key: number]: ElementStatus } = { ...active };
    sorted.forEach(idx => {
      // Keep active styles if they override sorted (e.g. during a final pivot placement check)
      if (!highlights[idx]) {
        highlights[idx] = 'sorted';
      }
    });
    return highlights;
  }
}
