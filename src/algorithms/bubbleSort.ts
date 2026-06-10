import type { SortStep, ElementStatus } from '../types/sort';


export function* bubbleSort(arr: number[]): Generator<SortStep, void, unknown> {
  const array = [...arr];
  const n = array.length;
  let comparisonsCount = 0;
  let swapsCount = 0;
  const sortedIndices = new Set<number>();

  // Line 0: function entry
  yield {
    array: [...array],
    type: 'none',
    highlightedIndices: {},
    pseudocodeLine: 0,
    comparisonsCount,
    swapsCount
  };

  for (let i = 0; i < n; i++) {
    // Line 1: outer loop
    yield {
      array: [...array],
      type: 'none',
      highlightedIndices: getHighlights(sortedIndices),
      pseudocodeLine: 1,
      comparisonsCount,
      swapsCount
    };

    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      // Line 2: inner loop
      yield {
        array: [...array],
        type: 'none',
        highlightedIndices: {
          ...getHighlights(sortedIndices),
          [j]: 'compare',
          [j + 1]: 'compare'
        },
        pseudocodeLine: 2,
        comparisonsCount,
        swapsCount
      };

      comparisonsCount++;
      // Line 3: comparison
      yield {
        array: [...array],
        type: 'compare',
        highlightedIndices: {
          ...getHighlights(sortedIndices),
          [j]: 'compare',
          [j + 1]: 'compare'
        },
        pseudocodeLine: 3,
        comparisonsCount,
        swapsCount
      };

      if (array[j] > array[j + 1]) {
        // Swap elements
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        swapsCount++;
        swapped = true;

        // Line 4: swap
        yield {
          array: [...array],
          type: 'swap',
          highlightedIndices: {
            ...getHighlights(sortedIndices),
            [j]: 'swap',
            [j + 1]: 'swap'
          },
          pseudocodeLine: 4,
          comparisonsCount,
          swapsCount
        };
      }
    }

    // The element at n - i - 1 is now sorted
    sortedIndices.add(n - i - 1);
    
    // If no elements were swapped, array is fully sorted
    if (!swapped) {
      for (let k = 0; k < n; k++) {
        sortedIndices.add(k);
      }
      break;
    }
  }

  // Set all as sorted at the end
  for (let k = 0; k < n; k++) {
    sortedIndices.add(k);
  }

  yield {
    array: [...array],
    type: 'sorted',
    highlightedIndices: getHighlights(sortedIndices),
    pseudocodeLine: 1, // point back to start or highlight first line
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
