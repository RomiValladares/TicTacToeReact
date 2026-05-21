# Tic-Tac-Toe: A UX & Accessibility Showcase

A Tic-Tac-Toe game built with React, TypeScript, and Framer Motion.

## 🚀 Live Demo
[Play the Game Here](https://tic-tac-toe-react-seven-zeta.vercel.app/)

## ✨ Key Technical Features

### 🧠 Unbeatable AI Engine
* **Minimax Algorithm:** Powered by a minimax algorithm, ensuring the computer evaluates all possible future moves and never loses (depending on selected difficulty).

### ⌨️ Advanced Keyboard Accessibility
* **Grid:** Use arrow keys or 1-9 keys to navigate around the 3x3 grid.

### 💾 Safe State Persistence
* **Defensive Storage Wrapper:** Uses `localStorage` save game history, scores, and configurations.

### 🎨 Tactile UX & Motion Design
* **Framer Motion Integration:** Uses animation for natural layout rendering, physical board shaking on draw states, and reactive score-pop micro-animations.
* **Multi-Theme Architecture:** Toggling between Neon, Sunset, and Classic palettes.

## 🛠️ Tech Stack
* **Core:** React 18, TypeScript
* **Styling:** Tailwind CSS v4
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **Bundler:** Vite
* **Testing:** Vitest

## 💻 How to Run Locally

**Prerequisite:** Check that you have Node.js installed.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/RomiValladares/TicTacToeReact.git](https://github.com/RomiValladares/TicTacToeReact.git)
   ```

2. **Navigate into the project directory:**
   ```bash
   cd TicTacToeReact
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
5. **Open your browser:** The app will launch at `http://localhost:5173`.

## 📐 Design Decisions & Known Limitations

* **Mobile Orientation:** This application is  optimized for portrait orientation on mobile devices. Landscape mode on mobile is not currently supported.
