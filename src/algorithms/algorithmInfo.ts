import type { AlgorithmMetadata } from '../types/sort';


export const ALGORITHMS_INFO: Record<string, AlgorithmMetadata> = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    description: 'Bubble Sort is a simple, comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This pass-through is repeated until the list is sorted.',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    pseudocode: [
      'bubbleSort(array):',
      '  for i = 0 to array.length - 1:',
      '    for j = 0 to array.length - i - 2:',
      '      if array[j] > array[j + 1]:',
      '        swap(array[j], array[j + 1])',
    ],
    explanation: {
      overview: 'Bubble Sort is highly intuitive but inefficient for large datasets. It earns its name because smaller or larger elements "bubble" to the top (end) of the list with each iteration.',
      steps: [
        'Start at index 0 and compare adjacent elements.',
        'If the current element is greater than the next, swap them.',
        'Move to the next pair and repeat until the end of the unsorted portion.',
        'Repeat the entire process, reducing the unsorted bounds by 1 each pass, until no swaps are made.'
      ],
      pros: [
        'Easy to understand and implement.',
        'Requires no extra memory space (in-place).',
        'Stable sorting algorithm (maintains relative order of equal elements).'
      ],
      cons: [
        'Highly inefficient with a time complexity of O(n²).',
        'Performs a massive number of swaps.'
      ]
    }
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    description: 'Selection Sort divides the input list into two parts: a sorted sublist at the beginning, and an unsorted sublist at the end. It repeatedly finds the minimum element from the unsorted sublist and moves it to the beginning of the unsorted sublist.',
    complexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    pseudocode: [
      'selectionSort(array):',
      '  for i = 0 to array.length - 1:',
      '    minIdx = i',
      '    for j = i + 1 to array.length - 1:',
      '      if array[j] < array[minIdx]:',
      '        minIdx = j',
      '    swap(array[i], array[minIdx])',
    ],
    explanation: {
      overview: 'Selection Sort is a simple comparison algorithm. Although it has O(n²) time complexity, it minimizes the number of swaps, doing at most O(n) swaps.',
      steps: [
        'Set the first unsorted element as the minimum.',
        'Iterate through the rest of the unsorted array to find the true minimum element.',
        'Swap the minimum element found with the first unsorted element.',
        'Shift the boundary of the sorted array one element to the right.'
      ],
      pros: [
        'Simple to implement.',
        'Performs very few swaps compared to Bubble Sort, making it useful when write operations are expensive.',
        'Performs well on small datasets.'
      ],
      cons: [
        'Inefficient O(n²) performance regardless of the initial order of elements.',
        'Unstable sorting algorithm (can change the relative order of duplicate items).'
      ]
    }
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    description: 'Insertion Sort builds the final sorted array one item at a time. It takes one element from the unsorted part and inserts it into its correct position within the sorted part, shifting larger elements to the right.',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    pseudocode: [
      'insertionSort(array):',
      '  for i = 1 to array.length - 1:',
      '    key = array[i]',
      '    j = i - 1',
      '    while j >= 0 and array[j] > key:',
      '      array[j + 1] = array[j]',
      '      j = j - 1',
      '    array[j + 1] = key',
    ],
    explanation: {
      overview: 'Insertion Sort works similarly to the way we sort playing cards in our hands. It is highly efficient for small or nearly sorted datasets.',
      steps: [
        'Start with the second element (index 1), assuming the first element is already sorted.',
        'Store the current element as the "key".',
        'Compare the key with elements in the sorted portion (to its left).',
        'Shift elements that are larger than the key one position to the right.',
        'Insert the key into its correct sorted position.',
        'Repeat for all unsorted elements.'
      ],
      pros: [
        'Simple, stable, and in-place.',
        'Highly efficient for small datasets (often faster than Quick Sort for N < 10).',
        'Adaptive: runs in O(n) time if the array is already nearly sorted.'
      ],
      cons: [
        'Inefficient O(n²) time complexity for reverse-sorted or randomly ordered large datasets.'
      ]
    }
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    description: 'Merge Sort is a divide-and-conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves back together.',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)',
    },
    pseudocode: [
      'mergeSort(array, l, r):',
      '  if l < r:',
      '    m = floor((l + r) / 2)',
      '    mergeSort(array, l, m)',
      '    mergeSort(array, m + 1, r)',
      '    merge(array, l, m, r)',
      '',
      'merge(array, l, m, r):',
      '  copy left and right sub-arrays',
      '  compare elements and copy them back sorted',
    ],
    explanation: {
      overview: 'Merge Sort is a highly efficient, stable sorting algorithm. It relies on the principle that merging two already sorted arrays is linear O(n) in time complexity.',
      steps: [
        'Divide: Recursively split the array into halves until each sub-array contains a single element.',
        'Conquer: A single-element array is sorted by default.',
        'Combine: Merge the sorted sub-arrays back together by comparing their smallest elements and building a sorted result.'
      ],
      pros: [
        'Guaranteed O(n log n) time complexity in all cases (best, average, worst).',
        'Stable sort, preserving original relative order.',
        'Excellent for external sorting (large data that does not fit in RAM).'
      ],
      cons: [
        'Requires O(n) auxiliary space to store temporary sub-arrays.',
        'Slower than Quick Sort in practice on typical in-memory datasets due to memory allocation overhead.'
      ]
    }
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    description: 'Quick Sort is a highly efficient divide-and-conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot, placing smaller elements to the left and larger elements to the right.',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)',
    },
    pseudocode: [
      'quickSort(array, low, high):',
      '  if low < high:',
      '    p = partition(array, low, high)',
      '    quickSort(array, low, p - 1)',
      '    quickSort(array, p + 1, high)',
      '',
      'partition(array, low, high):',
      '  pivot = array[high]',
      '  i = low - 1',
      '  for j = low to high - 1:',
      '    if array[j] < pivot:',
      '      i++; swap(array[i], array[j])',
      '  swap(array[i + 1], array[high])',
      '  return i + 1',
    ],
    explanation: {
      overview: 'Quick Sort uses a partition algorithm (often Lomuto or Hoare) to divide elements. It is an in-place sorting algorithm and is usually the fastest algorithm in practice for cache locality.',
      steps: [
        'Choose a pivot element (often the last element in the partition).',
        'Reorder the array so that all elements smaller than the pivot go to its left, and all larger elements go to its right.',
        'This positions the pivot in its final sorted location.',
        'Recursively apply the same steps to the left and right sub-arrays.'
      ],
      pros: [
        'Extremely fast in practice with excellent cache locality.',
        'Requires very little auxiliary space (O(log n) call stack space).',
        'In-place sorting algorithm.'
      ],
      cons: [
        'Unstable sorting algorithm.',
        'Worst-case performance is O(n²) if the pivot choices are poor (e.g. pre-sorted array and picking the boundary element as pivot).'
      ]
    }
  },
  heap: {
    id: 'heap',
    name: 'Heap Sort',
    description: 'Heap Sort is a comparison-based sorting algorithm based on a Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place it at the end, repeating this process for the remaining elements.',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)',
    },
    pseudocode: [
      'heapSort(array):',
      '  buildMaxHeap(array)',
      '  for i = array.length - 1 down to 1:',
      '    swap(array[0], array[i])',
      '    maxHeapify(array, 0, i)',
      '',
      'maxHeapify(array, idx, heapSize):',
      '  largest = idx; L = 2*idx+1; R = 2*idx+2',
      '  find largest among array[idx, L, R]',
      '  if largest != idx:',
      '    swap(array[idx], array[largest])',
      '    maxHeapify(array, largest, heapSize)',
    ],
    explanation: {
      overview: 'Heap Sort utilizes a binary heap representation. By visualizing the array as a complete binary tree, we can build a max-heap and repeatedly extract the maximum element (root) and restore the heap property.',
      steps: [
        'Build a max-heap from the input data (reordering the array so that children are smaller than parents).',
        'The largest item is now stored at the root (index 0).',
        'Swap the root with the last item of the heap, reducing the heap size by 1.',
        'Call max-heapify on the root to restore the heap properties.',
        'Repeat these steps until the heap size is 1.'
      ],
      pros: [
        'Guaranteed O(n log n) time complexity in all cases.',
        'Highly memory efficient: sorts in-place with O(1) auxiliary space (unlike Merge Sort).',
        'Performs consistently without a bad worst-case like Quick Sort.'
      ],
      cons: [
        'Unstable sorting algorithm.',
        'Poor cache locality due to jumpy tree-based index operations, making it slower in practice than Quick Sort on modern CPUs.'
      ]
    }
  }
};
