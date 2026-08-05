# Pinkfly

A [Next.js](https://nextjs.org) application using the App Router, TypeScript, and Tailwind CSS.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/            # App Router: routes, layouts, pages
│   └── (routes)/   # Route groups for organizing sections
├── components/     # Reusable React components
│   ├── ui/         # Primitive, presentational UI elements
│   ├── layout/     # Structural components (header, footer, sidebar)
│   └── shared/     # Cross-feature composite components
├── features/       # Self-contained feature modules
├── lib/            # Framework-agnostic logic
│   ├── api/        # API clients / data fetching
│   ├── utils/      # Helper functions
│   └── constants/  # Shared constant values
├── hooks/          # Reusable React hooks
├── types/          # Shared TypeScript types
└── config/         # App configuration

public/             # Static assets (images, icons, fonts)
```

Path alias `@/*` maps to `src/*`.
