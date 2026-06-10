# SortFlow 🎵 — Interactive Sorting Algorithm Visualizer & Sonifier

SortFlow is a modern, high-fidelity Sorting Algorithm Visualizer designed to demonstrate frontend engineering capabilities and algorithm behaviors. Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, and the **HTML5 Web Audio API**, SortFlow allows users to visually inspect and *audibly hear* how different sorting algorithms execute.

## 🔗 Live Demo
👉 **[Live Demo URL](https://sortflow-yashraj.vercel.app/)**



---

## 🚀 Key Features

### 1. Real-time Algorithm Sonification (Audio Feedback)
- **Dynamic Pitch Mapping**: Maps array element heights to audio frequencies (130Hz – 950Hz) dynamically.
- **Waveform Variety**: Uses clean **Sine Waves** for comparisons and locked sorted items, and rich **Triangle Waves** for swaps/overwrites to provide auditory distinction.
- **Completion Melody**: Plays a satisfying 4-note ascending success melody (C5, E5, G5, C6) in under 1 second when sorting completes.
- **Performance Guard**: Employs exponential gain envelopes to eliminate click/pop noise and an automatic throttling sampler that drops 70% of comparison tones when dataset size $N > 150$ to maintain stable 60 FPS animation.

### 2. Dual Comparison Mode
- Select any two algorithms (e.g., Quick Sort vs Merge Sort) and run them side-by-side on the same unsorted array.
- Unified Play, Pause, and Reset controls run both visualizers in perfect synchronization.
- Combined audio feedback is throttled to prevent noise overlap.

### 3. Integrated Benchmarking Board
- Instantly runs all 6 sorting algorithms *synchronously* on the current array dataset.
- Generates high-performance, responsive SVG comparison charts to display execution times (milliseconds), comparison counts, and write counts.

### 4. Interactive & Responsive Dashboard
- Real-time statistics: Comparisons, Swaps/Writes, Elapsed Time, and Visualizer FPS.
- Interactive control panel: Adjust dataset size (10–300 elements) and animation delays (1ms – 1000ms) on the fly.
- Live pseudocode panel that steps through line-by-line execution.
- Side-panel explanations for time/space complexity and algorithm pros/cons.

### 5. Accessibility & Custom Inputs
- Fully responsive dark mode and light mode layouts using Tailwind v4 variants.
- Support for custom comma-separated integer array inputs (5–150 elements).
- Sound ON/OFF toggle and Volume slider (0–100%) persisted in `localStorage`.
- Comprehensive keyboard shortcuts for mouse-free control.

---

## 🛠️ Technology Stack

- **Framework**: React 19 (Functional Components, Custom Hooks, Context API)
- **Language**: TypeScript (Strict Typings)
- **Styling**: Tailwind CSS v4 (Selector-based Dark Mode, modern CSS variables)
- **Animations**: Framer Motion (Dynamic hover tooltips, layout transitions)
- **Audio**: Web Audio API (OscillatorNode, GainNode envelopes)
- **Icons**: Lucide React
- **Screenshot Capture**: html2canvas

---

## ⌨️ Keyboard Shortcuts

Press `?` or click the **Shortcuts** button in the control panel to view:

| Key | Action |
| :--- | :--- |
| `Space` | Play / Pause animation |
| `R` | Reset array to original state |
| `G` | Generate a new dataset |
| `Arrow Right` | Step animation forward (when paused) |
| `Arrow Left` | Step animation backward (when paused) |
| `1` – `6` | Select algorithm (Bubble, Selection, Insertion, Merge, Quick, Heap) |

---

## ⚙️ Local Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sortflow.git
   cd sortflow
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
