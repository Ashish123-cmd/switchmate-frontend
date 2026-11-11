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
- `src/services/` — Mock and HTTP implementations of domain interfaces (`src/services/api/` holds the HTTP client)
- `src/shared/` — Reusable UI components, hooks, utils
- `src/features/` — Feature folders (auth, onboarding, jobs, apply, tracker, profile)

## Backend Integration

Authentication talks to the Spring Boot API. Copy `.env.example` to `.env` and point it at the backend:

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend origin, for example `http://localhost:8081`. When unset, auth falls back to the in-browser `MockAuthService` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID used by `@react-oauth/google` |

Wired endpoints: `POST /api/auth/login`, `POST /api/auth/google`, `POST /api/auth/signup/resume`, `POST /api/auth/signup/complete`, and `GET /api/auth/me`. `ApiClient` stores the JWT in `localStorage` (`switchmate.authToken`) and sends it as `Authorization: Bearer <token>` on every request. Profile, jobs, tracker, and auto-apply services are still mocks.

## Tooling
- ESLint + Prettier
- Path alias `@/` for `src`
- Strict TypeScript config
