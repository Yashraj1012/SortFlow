import type { SortStep, ElementStatus } from '../types/sort';


export function* selectionSort(arr: number[]): Generator<SortStep, void, unknown> {
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

  for (let i = 0; i < n; i++) {
    // Line 1: Outer loop
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices),
      pseudocodeLine: 1,
      comparisonsCount,
      swapsCount
    };

    let minIdx = i;
    // Line 2: minIdx = i
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: {
        ...getHighlights(sortedIndices),
        [minIdx]: 'pivot' // Use pivot style to show current minimum candidate
      },
      pseudocodeLine: 2,
      comparisonsCount,
      swapsCount
    };

    for (let j = i + 1; j < n; j++) {
      // Line 3: Inner loop
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: {
          ...getHighlights(sortedIndices),
          [minIdx]: 'pivot',
          [j]: 'compare'
        },
        pseudocodeLine: 3,
        comparisonsCount,
        swapsCount
      };

      comparisonsCount++;
      // Line 4: compare
      yield {
        array: [...array],
        type: 'compare',
        highlightedIndices: {
          ...getHighlights(sortedIndices),
          [minIdx]: 'pivot',
          [j]: 'compare'
        },
        pseudocodeLine: 4,
        comparisonsCount,
        swapsCount
      };

      if (array[j] < array[minIdx]) {
        minIdx = j;
        // Line 5: update minIdx
        yield {
          array: [...array],
          type: 'none',
          highlightedIndices: {
            ...getHighlights(sortedIndices),
            [minIdx]: 'pivot'
          },
          pseudocodeLine: 5,
          comparisonsCount,
          swapsCount
        };
      }
    }

    if (minIdx !== i) {
      const temp = array[i];
      array[i] = array[minIdx];
      array[minIdx] = temp;
      swapsCount++;

      // Line 6: swap
      yield {
        array: [...array],
        type: 'swap',
        highlightedIndices: {
          ...getHighlights(sortedIndices),
          [i]: 'swap',
          [minIdx]: 'swap'
        },
        pseudocodeLine: 6,
        comparisonsCount,
        swapsCount
      };
    } else {
      // Line 6: no swap needed but code line is executed
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: {
          ...getHighlights(sortedIndices),
          [i]: 'swap'
        },
        pseudocodeLine: 6,
        comparisonsCount,
        swapsCount
      };
    }

    sortedIndices.add(i);
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
