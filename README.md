# Sprint Board

A modern, local-first Kanban board application built for speed and privacy. Manage your sprints, tasks, and projects efficiently with a beautiful, responsive interface.

## Features

- **Local-First Architecture**: All data is stored locally in your browser using IndexedDB. No server required, works offline.
- **Kanban Board**: Drag-and-drop interface for managing tasks across lists.
- **Project Structure**: Organize work into Workspaces and Boards.
- **Rich Task Details** (Not implemented yet): Support for descriptions, checklists, labels, due dates, and attachments.
- **Storage Management**: Detailed insights into local storage usage with quota management.
- **Responsive Design**: Fully responsive layout optimized for desktop and mobile.
- **Dark Mode**: Native support for light and dark themes.

## Tech Stack

- **Framework**: [React](https://react.dev/) 19 & [Vite](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State Management**: [TanStack Query](https://tanstack.com/query) & [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 & [Shadcn/UI](https://ui.shadcn.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Storage**: Raw IndexedDB with custom wrapper (Local-first)

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- [pnpm](https://pnpm.io/) (Package manager)

### Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

### Running Locally

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Scripts

- `pnpm dev`: Start the development server.
- `pnpm build`: Build the application for production.
- `pnpm preview`: Preview the production build locally.
- `pnpm test`: Run tests using Vitest.
- `pnpm lint`: Lint the codebase using ESLint.
- `pnpm format`: Format code using Prettier.
- `pnpm check`: Run both formatter and linter checks.

## Project Structure

- `src/routes`: Application routes (File-based routing).
- `src/components`: Reusable UI components.
- `src/db`: Local database layer (IndexedDB wrapper).
- `src/services`: Business logic and service aggregation.
- `src/store`: Global state management.
