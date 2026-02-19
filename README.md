# Memoria - Knowledge Retention Dashboard

Memoria is a focused reading retention tool inspired by Readwise. It helps you master your reading highlights through daily reviews, spaced repetition, and a beautiful "Intellectual Minimalist" interface.

## Features

- **Daily Review System**: Immersive flashcard experience for reviewing highlights.
- **Library Management**: Organize books and highlights with a visual grid layout.
- **Extension Simulation**: A preview mode demonstrating how a browser extension would integrate.
- **Local Storage Persistence**: All data is saved locally to your browser, respecting user privacy.
- **Responsive Design**: "Warm Paper" aesthetic that adapts to your device.

## Tech Stack

This project is built with a modern frontend stack:

- **Languages**: [TypeScript](https://www.typescriptlang.org/), HTML5, CSS3
- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [wouter](https://github.com/molefrog/wouter)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & `tailwindcss-animate`

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/memoria.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Deploy Frontend To GitHub Pages

This repo now includes `.github/workflows/deploy-pages.yml` to publish the Vite client to GitHub Pages.

1. In your GitHub repo, set a repository variable `VITE_API_BASE_URL` to your Replit backend URL (example: `https://your-app.replit.app`).
2. In Replit backend env vars, set:
   - `FRONTEND_URL=https://<your-user>.github.io/<repo>/`
   - `CORS_ORIGIN=https://<your-user>.github.io`
3. Push to `main` (or `master`) to trigger deployment.

Local Pages build:
```bash
npm run build:pages
```

## Design Philosophy

The interface follows an "Intellectual Minimalist" art direction:
- **Typography**: `Lora` (Serif) for content paired with `Inter` (Sans) for UI.
- **Palette**: Warm off-white paper backgrounds with deep charcoal text and amber accents.
- **Interaction**: Tactile hover states and smooth entry animations.

## 📄 License

MIT
