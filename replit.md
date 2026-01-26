# Memoria - Knowledge Retention Dashboard

## Overview

Memoria is a reading retention tool inspired by Readwise that helps users master their reading highlights through daily reviews and spaced repetition. The application provides a dashboard for tracking reading progress, a flashcard-based daily review system, a library for organizing books and highlights, and an extension preview demonstrating browser integration.

The project follows an "Intellectual Minimalist" design philosophy with a warm paper aesthetic, using serif fonts (Lora) for content and sans-serif (Inter) for UI elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Routing**: wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for page transitions and interactions
- **Icons**: Lucide React

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Build**: Custom build script using esbuild for server bundling, Vite for client

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines tables for books and highlights
- **Migrations**: Drizzle Kit for schema management (`drizzle-kit push`)
- **Connection**: Uses `DATABASE_URL` environment variable

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components and layout
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # API utilities, query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database operations
│   └── vite.ts       # Vite dev server integration
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle schema definitions
```

### API Design
- `GET/POST /api/books` - List and create books
- `GET/DELETE /api/books/:id` - Get and delete individual books
- `GET/POST /api/highlights` - List and create highlights
- `GET/DELETE/PATCH /api/highlights/:id` - Individual highlight operations

### Development vs Production
- Development: Vite dev server with HMR, served through Express middleware
- Production: Static files served from `dist/public`, server bundled to `dist/index.cjs`

## External Dependencies

### Database
- PostgreSQL database (connection via `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe database operations
- Session storage via `connect-pg-simple`

### UI/Frontend Libraries
- Radix UI primitives for accessible components
- Framer Motion for animations
- Embla Carousel for carousel components
- React Day Picker for calendar functionality
- cmdk for command palette
- vaul for drawer components

### Build Tools
- Vite with React plugin
- esbuild for server bundling
- PostCSS with Tailwind CSS

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` for error display
- `@replit/vite-plugin-cartographer` for development
- `@replit/vite-plugin-dev-banner` for development mode indicator