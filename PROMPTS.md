# Project Decision & Prompt Log

This document serves as a technical audit trail for the development of the Tic-Tac-Toe app

## Phase 1: Project Scaffolding & Infrastructure
**Goal:** Establish a modern, scalable React/TypeScript environment.

### Prompt Used:
"Initialize a professional Tic-Tac-Toe React project in this current empty directory.
1. Run npm create vite@latest . -- --template react-ts
2. Set up the folder structure: src/core, src/features/game, src/components, src/hooks, and src/types.
3. Install Tailwind CSS and Framer Motion.
4. Initialize Git with main and develop branches.
5. Create a README.md and a PROMPTS.md to track our progress"

### Architectural Decisions:
- **Environment:** Vite + React + TypeScript.
- **Organization:** Modular folder structure to separate Domain Logic (`src/core`) from UI.

---

## Phase 2: Core Engine & AI (Minimax)

### Prompt Used:
"Create a pure TypeScript implementation of Minimax for Tic-Tac-Toe. It must use the PLAYERS constant and applyMove function I've already defined. Explain the recursive scoring logic."
