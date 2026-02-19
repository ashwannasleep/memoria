# Memoria - Knowledge Retention Dashboard

Memoria is a focused reading retention tool inspired by Readwise. It helps you master your reading highlights through daily reviews, spaced repetition, and a beautiful "Intellectual Minimalist" interface.

## Features

- **Daily Review System**: Immersive flashcard experience for reviewing highlights.
- **Library Management**: Organize books and highlights with a visual grid layout.
- **Browser Web Clipper**: A real Chrome extension (Manifest V3) to save selected text from any page.
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

1. In GitHub, open your repository settings and enable Pages with source `GitHub Actions`.
2. Push to `main` (or `master`) to trigger deployment.

Local Pages build:
```bash
npm run build:pages
```

## Browser Extension (Web Clipper)

The real extension lives in `extension/` and saves selected text into the same Memoria local data store (`memoria.local.v1`).

Install in Chrome:
1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the repo's `extension/` folder.
5. Open the extension popup once and confirm the Memoria URL points to your site:
   - Example: `https://ashwannasleep.github.io/memoria/`

Usage:
1. Select text on any webpage.
2. Right click and choose `Save selection to Memoria`.
3. Open Memoria and check the `Web Highlights` book.

## Design Philosophy

The interface follows an "Intellectual Minimalist" art direction:
- **Typography**: `Lora` (Serif) for content paired with `Inter` (Sans) for UI.
- **Palette**: Warm off-white paper backgrounds with deep charcoal text and amber accents.
- **Interaction**: Tactile hover states and smooth entry animations.

## 📄 License

MIT
