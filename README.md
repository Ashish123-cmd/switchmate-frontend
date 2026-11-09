# Switchmate

Vite + React + TypeScript + Tailwind CSS + React Router + React Hook Form + Zod

## Getting Started

```sh
npm install
npm run dev
```

## Project Structure

- `src/app/` — Router, providers, App.tsx
- `src/domain/` — Types and service interfaces only
- `src/services/` — Mock implementations of domain interfaces
- `src/shared/` — Reusable UI components, hooks, utils
- `src/features/` — Feature folders (auth, onboarding, jobs, apply, tracker, profile)

## Tooling
- ESLint + Prettier
- Path alias `@/` for `src`
- Strict TypeScript config
