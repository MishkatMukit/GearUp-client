# AGENTS.md

This repo is for the **GearUp frontend** only. Backend (Express + Prisma + PostgreSQL + Stripe) is already built and deployed — no backend code lives here.

## Existing instruction files (read these first)

- `features-structures.md` — Backend architecture reference. Single source of truth for entity models, API contracts, enums, state machine flows, and Zod schemas. Use this to match frontend types and API calls to the running backend.
- `frontend-rules.md` — Frontend conventions: folder structure, server actions, shadcn/ui, Tailwind, `useActionState` patterns, cookie-based auth.

## Key conventions

- **Package manager**: `pnpm` (not npm/yarn)
- **Quotes & punctuation**: double quotes, semicolons, trailing commas
- **Comments**: none in production code
- **Auth**: cookie-based (httpOnly). Backend expects `Cookie: accessToken=${token}` header (not `Authorization: Bearer`).
- **State**: Zustand for client state. Server actions, `useActionState`, URL params, and local `useState` for component-specific state.
- **Forms**: native `<form>` + `useActionState`. No react-hook-form or formik.
- **Data fetching**: TanStack Query for server state. Use `fetch()` as the HTTP client (no axios).
- **Styling**: Tailwind only. shadcn/ui for primitives. Use `cn()` from `@/lib/utils`.
- **Middleware**: named `proxy.ts` (not `middleware.ts`).

For detailed conventions, consult the two instruction files above.
