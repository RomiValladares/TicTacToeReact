# Modern Tic-Tac-Toe: A UX & Accessibility Showcase

Tic-Tac-Toe engine built with React, TypeScript, and Framer Motion. 

## 🚀 Live Demo
[[Tic Tac Toe](https://tic-tac-toe-react-a4uof7v68-ro-v-s-projects.vercel.app/)]

## ✨ Key Technical Features

### ⌨️ Advanced Keyboard Accessibility
* **Continuous 2D Grid:** Custom React event listeners map arrow keys to dynamic array indices, allowing continuous navigation around the 3x3 grid without focus trapping.
* **Direct Numpad Entry:** Global window listeners map keys `1-9` directly to board squares for rapid, macro-style input.

### 💾 Safe State Persistence
* **Defensive Storage Wrapper:** Uses `localStorage` in strict `try/catch` blocks to prevent fatal application crashes in browsers with strict cookie/privacy blockers.

### 🎨 Tactile UX & Motion Design
* **Framer Motion Integration:** Uses animation for natural layout rendering, physical board shaking on draw states, and reactive score-pop micro-animations.
* **Contextual UI States:** Buttons and controls shift hierarchy dynamically (e.g., the Rematch button dims during active play and elevates to full prominence with a 360-degree spin upon game completion).
* **Multi-Theme Architecture:** Driven by native CSS variables for instant toggling between Neon, Sunset, and Classic palettes.

### Mobile Orientation
* This application is strictly optimized for portrait orientation on mobile devices. 
* Landscape mode on mobile is currently unsupported.

## 🛠️ Tech Stack
* React 18
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide React (Icons)
* Vite (Bundler)

## 💻 How to Run Locally

1. **Clone the repository:**
   \`\`\`bash
   git clone [(https://github.com/RomiValladares/TicTacToeReact.git)]
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will launch at `http://localhost:5173`.