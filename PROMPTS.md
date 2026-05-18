# Project Decision & Prompt Log

This document serves as a technical audit trail for the development of the Tic-Tac-Toe app

## 1. Project Infrastructure
**Goal:** Establish a modern React/TypeScript environment.

### Prompt:
"Initialize a professional Tic-Tac-Toe React project in this current empty directory.
1. Run npm create vite@latest . -- --template react-ts
2. Set up the folder structure: src/core, src/features/game, src/components, src/hooks, and src/types.
3. Install Tailwind CSS and Framer Motion.
4. Initialize Git with main and develop branches.
5. Create a README.md and a PROMPTS.md to track our progress"

---

## 2. Core Engine & AI (Minimax)
**Goal:** Implement optimal move calculation via Minimax.

### Prompt:
"Create a pure TypeScript implementation of Minimax for TicTacToe. It must use the PLAYERS constant and applyMove function I've already defined. Explain the recursive scoring logic."

---

## 3. Refactoring & Atomic Design

### Prompt:
"Refactor the existing TicTacToe.tsx component into a modular Atomic Component architecture. Replace the 'div-heavy' structure with reusable sub-components (e.g., Square, ThemeButton, ScoreCard). Optimize Tailwind CSS to align with v4 syntax. Replace arbitrary values with simplified shorthand (bg-[var(--name)] -> bg-(--name))."

---

## 4. Animated Background
**Goal:** Implement a high-performance, non-repeating atmospheric background.

### Prompt:
"Create a React component called BackgroundAtmosphere.tsx using framer-motion.
1. **Randomness:** Use three motion.div bubbles with prime-number durations (19s, 23s, 29s) to ensure the pattern never repeats.
2. **Visuals:** Use high CSS blurs (blur-[100px]) and mix-blend-mode: screen. Do not use SVG filters to avoid color banding.
3. **Performance:** Wrap in React.memo to prevent re-animations on game state updates.
4. **Theming:** Drive colors and opacities via CSS variables from index.css (target 10% opacity)."

### Architectural Decisions:
- **Animation:** Switched from CSS Keyframes to Framer Motion
- **Optimization:** Utilized `React.memo` to decouple background rendering from game logic re-renders.

---

## 5. Audio Synthesis & Web Audio API
**Goal:** Implement a lightweight retro sound effects system.

### Prompt:
"Create a self-contained TypeScript utility using the browser's native Web Audio API to get a retro 8-bit game sounds without external asset files.
- **Sounds:** Generate four distinct sound effects using oscillators and gain envelopes: 'clickX' (sharp upward blip), 'clickO' (lower response blip), 'win' (like an upward chord), and 'draw' (downward freq)."