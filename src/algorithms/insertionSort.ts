import type { SortStep, ElementStatus } from '../types/sort';


export function* insertionSort(arr: number[]): Generator<SortStep, void, unknown> {
  const array = [...arr];
  const n = array.length;
  let comparisonsCount = 0;
  let swapsCount = 0;
  const sortedIndices = new Set<number>();
  
  // The first element is considered sorted initially
  sortedIndices.add(0);

  yield {
    array: [...array],
    type: 'none',
    highlightedIndices: getHighlights(sortedIndices),
    pseudocodeLine: 0,
    comparisonsCount,
    swapsCount
  };

  for (let i = 1; i < n; i++) {
    // Line 1: Outer loop
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: {
        ...getHighlights(sortedIndices),
        [i]: 'pivot' // key element
      },
      pseudocodeLine: 1,
      comparisonsCount,
      swapsCount
    };

    const key = array[i];
    // Line 2: key = array[i]
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: {
        ...getHighlights(sortedIndices),
        [i]: 'pivot'
      },
      pseudocodeLine: 2,
      comparisonsCount,
      swapsCount
    };

    let j = i - 1;
    // Line 3: j = i - 1
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: {
        ...getHighlights(sortedIndices),
        [i]: 'pivot',
        [j]: 'compare'
      },
      pseudocodeLine: 3,
      comparisonsCount,
      swapsCount
    };

    // Line 4: while condition check
    comparisonsCount++;
    yield {
      array: [...array],
      type: 'compare',
      highlightedIndices: {
        ...getHighlights(sortedIndices),
        [i]: 'pivot',
        [j >= 0 ? j : 0]: 'compare'
      },
      pseudocodeLine: 4,
      comparisonsCount,
      swapsCount
    };

    while (j >= 0 && array[j] > key) {
      // If not the first comparison in loop, count it
      if (j !== i - 1) {
        comparisonsCount++;
        yield {
          array: [...array],
          type: 'compare',
          highlightedIndices: {
            ...getHighlights(sortedIndices),
            [j]: 'compare'
          },
          pseudocodeLine: 4,
          comparisonsCount,
          swapsCount
        };
      }

      array[j + 1] = array[j];
      swapsCount++; // Treat shift as swap/overwrite

      // Line 5: shift element
      yield {
        array: [...array],
        type: 'overwrite',
        highlightedIndices: {
          ...getHighlights(sortedIndices),
          [j + 1]: 'swap',
          [j]: 'swap'
        },
        pseudocodeLine: 5,
        comparisonsCount,
        swapsCount
      };

      j = j - 1;
      // Line 6: j = j - 1
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: {
          ...getHighlights(sortedIndices),
          [j >= 0 ? j : 0]: 'compare'
        },
        pseudocodeLine: 6,
        comparisonsCount,
        swapsCount
      };
    }

    // Insert the key
    array[j + 1] = key;
    swapsCount++; // Treat insertion as overwrite/swap

    // Line 7: array[j+1] = key
    yield {
      array: [...array],
      type: 'overwrite',
      highlightedIndices: {
        ...getHighlights(sortedIndices),
        [j + 1]: 'swap'
      },
      pseudocodeLine: 7,
      comparisonsCount,
      swapsCount
    };

    // Add everything up to i to sorted indices
    for (let k = 0; k <= i; k++) {
      sortedIndices.add(k);
    }
  }

  // Set all as sorted
  for (let k = 0; k < n; k++) {
    sortedIndices.add(k);
  }

  yield {
    array: [...array],
    type: 'sorted',
    highlightedIndices: getHighlights(sortedIndices),
    pseudocodeLine: 1,
    comparisonsCount,
    swapsCount
  };
}

function getHighlights(sorted: Set<number>): { [key: number]: ElementStatus } {
  const highlights: { [key: number]: ElementStatus } = {};
  sorted.forEach(idx => {
    highlights[idx] = 'sorted';
  });
  return highlights;
}
