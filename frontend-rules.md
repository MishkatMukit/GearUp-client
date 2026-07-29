# Frontend Agent Rules

## 1. Architecture & Folder Structure

- **Route group colocation**: Organize routes into groups by access level (`(publicGroup)`, `(authGroup)`, `(dashboardGroup)`). Each group has its own `layout.tsx`, `_components/`, and `_actions/` directories.
- **Feature-first colocation**: Place feature-specific components, actions, and config inside the route group they belong to, not in a global folder. Use `_components/`, `_actions/`, `_config/` as private folders (prefixed with `_`) inside route groups.
- **Global shared code** lives at root level:
  - `components/shared/` — cross-feature components (navbar, footer)
  - `components/ui/` — design-system primitives
  - `hooks/` — reusable React hooks
  - `lib/` — types, utilities, constants
  - `service/` — server-side data-fetching functions
  - `utils/` — pure utility functions (JWT, helpers)
- **Keep `lib/` small**: Only `types.ts`, `utils.ts`, and truly cross-cutting concerns. Feature-specific types stay in `_config/` or colocated with the feature.

## 2. Naming Conventions

- **Files**: PascalCase for components (`UserCard.tsx`), camelCase for utilities and hooks (`use-mobile.ts`, `getMe.ts`).
- **Exports**: Named exports for components (`export function UserCard()`), default exports for pages (`export default function LoginPage()`).
- **Server actions**: camelCase suffixed with action verb (`loginAction`, `createPost`, `getMyPosts`, `subscribePremium`).
- **Service functions**: camelCase (`getMe`, `logout`, `getNewAccessToken`).
- **Types**: Prefix with `I` for interfaces (`IPost`, `IUser`, `ISidebarItem`, `IPostStatus`).
- **Props types**: Suffix with `Props` (`NavbarProps`, `MyPostCardProps`, `PostFormDialogProps`).
- **Sidebar items**: UPPER_SNAKE_CASE for the exported array (`USER_SIDEBAR_ITEMS`, `ADMIN_SIDEBAR_ITEMS`).
- **Config maps**: camelCase object with role keys (`sidebarMenuItems = { USER, AUTHOR, ADMIN }`).

## 3. Component Patterns

- **Server components by default**: Pages and data-fetching components are async server components. Only add `"use client"` when interactivity (state, effects, event handlers) is needed.
- **Client components** are thin: They handle UI state, user interactions, and delegate data mutations to server actions. Avoid fetching data directly in client components.
- **Composition pattern**: Page → wraps content in layout markup → delegates data rendering to sub-components → wraps async data components in `<Suspense>` with skeleton fallbacks.
- **Skeleton pattern**: Every async data component has a corresponding `*Skeleton.tsx` placeholder used as Suspense fallback.
- **Props pattern**: Define explicit `type ComponentNameProps = { ... }` for every component's props. Destructure props inline.
- **Default values**: Use `??` for fallbacks (`post.author?.name ?? "Unknown"`, `post._count?.comments ?? 0`).

## 4. Data Fetching (Server Actions)

- **Server Actions for all mutations**: Every data write (login, create, update, subscribe) is a server action (`"use server"` file-top directive).
- **Actions accept `(prevState, formData)`**: Use the standard `useActionState` signature. The first parameter can be additional context (e.g., `redirectTo` bound via `.bind()`).
- **Cookie-based auth for API calls**: Pass the access token via `Cookie: accessToken=${token}` header instead of `Authorization: Bearer`, because the backend expects it this way.
- **Graceful error handling**: Return `{ success: false, message: "..." }` objects from server actions instead of throwing errors. The calling client component checks `state.success` in a `useEffect`.
- **Cache revalidation**: After successful mutations, call `revalidateTag("tag-name", { expire: 0 })` to bust cached data. Use meaningful tag names (`"my-posts"`, `"premium-posts"`, `"public-posts"`, `"my-profile"`).
- **Read-only data fetching**: Use plain async server functions (not server actions) for fetching data. These are imported and called directly in server components.

## 5. Forms & State Management

- **`useActionState` hook**: Bind server actions to forms via `useActionState(action, initialState)`. The returned `[state, formAction, pending]` tuple drives loading states and feedback.
- **Zustand for client state**: Use Zustand stores for cross-component client state (auth, UI preferences, etc.). Server-driven state (mutations, form submissions) still uses `useActionState`. Component-local concerns use `useState`.
- **Form validation**: Use HTML5 validation (`required` attribute on inputs) for simplicity. No form validation library.
- **Toast feedback**: Use `sonner` toast library. Show success/error in `useEffect` watching the action state: `if (state.success) toast.success(...)`.
- **Redirect after action**: Use `redirect()` from `next/navigation` inside server actions (not client-side `router.push`). Actions can also return the result and let the client decide.

## 6. Styling

- **Tailwind CSS utility classes**: All styling uses Tailwind utility classes. No CSS modules, no styled-components, no inline styles.
- **CSS variables for theming**: Colors are defined as CSS custom properties in `globals.css` using `oklch()` color space. Both `:root` (light) and `.dark` variants are defined.
- **`@theme inline` block**: Custom theme tokens are defined using the `@theme` directive referencing CSS variables.
- **Layer base**: Use `@layer base` for global resets (`* { @apply border-border }`).
- **`cn()` utility**: Always use the `cn()` function from `@/lib/utils` to merge conditional Tailwind classes. It uses `clsx` + `tailwind-merge`.
- **Responsive breakpoints**: Use Tailwind's default breakpoints (`sm:`, `md:`, `lg:`) consistently. Max-width containers use `max-w-7xl` or `max-w-3xl`/`max-w-md` with `mx-auto` and horizontal padding (`px-4 sm:px-6 lg:px-8`).
- **Icons**: Use `lucide-react` icons. Apply `data-icon="inline-start"` attribute for icon spacing within buttons (shadcn convention).
- **shadcn components**: Use `@/components/ui/*` for all UI primitives (Button, Card, Input, Dialog, Badge, DropdownMenu, etc.). Do not write custom HTML for modals, dropdowns, sidebars, etc.

## 7. Middleware & Auth

- **Middleware file**: Name the middleware entry point `proxy.ts` (not `middleware.ts`). Export an async `proxy(request: NextRequest)` function and a `config.matcher` array.
- **Middleware runs on all routes except static assets**: The matcher excludes `api`, `_next/static`, `favicon.ico`, `_next/image`, `.png` files.
- **Token refresh in middleware**: When access token is expired but refresh token is valid, silently obtain a new access token from the backend and set the cookie before proceeding.
- **Role-based redirects**: Authenticated users on auth pages (`/login`, `/register`) are redirected to their role-specific dashboard. Role-specific routes are protected by redirecting to `/not-found` on role mismatch.
- **Premium gating**: Premium routes (e.g., `/premium`) check subscription status in middleware and redirect non-subscribers to the payment page.
- **Route lists**: Define `AUTH_ROUTES` and `PUBLIC_ROUTES` as arrays at the top of the middleware file for clarity.

## 8. TypeScript & Types

- **`strict: true`** in tsconfig. Target `ES2017` with `bundler` module resolution.
- **Path alias `@/*`**: All imports use the `@/` alias mapping to the project root.
- **Type definitions in `lib/types.ts`**: Centralized types for domain models (IPost, IUser, IAuthor, IComment) and UI-specific types (NavbarProps, ISidebarItem).
- **Union types for status enums**: Use TypeScript union types (`type IPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"`) instead of enums.
- **`ForwardRefExoticComponent` types**: For icon props in sidebar items, use the full React + lucide type signature.
- **`as any` escapes**: When `useActionState` types are complex, use `as any` with an eslint disable comment to bypass strict type checking for the hook return.

## 9. Data Fetching Caching Strategy

- **Tag-based cache invalidation**: Use `next: { tags: ["tag-name"] }` on fetch calls. Revalidate specific tags after mutations.
- **Time-based revalidation**: Use `next: { revalidate: seconds }` for data that changes infrequently (e.g., 1 day for profiles, 6 hours for news).
- **`force-cache` for read-heavy data**: Use `cache: "force-cache"` for data that doesn't change often (user profile, my posts).
- **`no-cache` for dynamic data**: Use `cache: "no-cache"` for data that must be fresh (subscription status, premium news with search).
- **Environment variables**: Backend URL is accessed via `process.env.BACKEND_API_URL` (server-only). Public env vars prefixed with `NEXT_PUBLIC_`.

## 10. Package & Tooling Conventions

- **Package manager**: Use `pnpm` (not npm or yarn).
- **ESLint**: Use flat config format (`eslint.config.mjs`) with Next.js core-web-vitals + TypeScript presets.
- **PostCSS**: Use `@tailwindcss/postcss` plugin for Tailwind v4.
- **shadcn/ui config**: Registered in `components.json` with aliases for `@/components`, `@/lib/utils`, `@/components/ui`, `@/hooks`.
- **Fonts**: Import Google Fonts via `next/font/google` (Inter) with a CSS variable (`--font-sans`).

## 11. Security Patterns

- **JWT tokens**: Access token (1 day) and refresh token (7 days) stored as `httpOnly`, `sameSite: "lax"` cookies.
- **Token verification**: Verify JWT tokens server-side using `jsonwebtoken.verify()`. Return `{ success, data }` or `{ success, error }` objects.
- **Server-only code**: Server actions, service files, and API calls using `BACKEND_API_URL` (no `NEXT_PUBLIC_` prefix) never reach the client bundle.
- **Cookie cleanup**: On logout, delete both `accessToken` and `refreshToken` cookies, then revalidate profile cache.

## 12. Code Quality Rules

- **No comments in production code**: The project does not include inline code comments. Logic should be self-documenting through naming.
- **No runtime CSS-in-JS**: All styling uses Tailwind classes. No CSS-in-JS libraries (styled-components, emotion).
- **No client-side fetch libraries**: Use native `fetch()` everywhere. No axios, react-query, or SWR.
- **No form libraries**: Use native `<form>` elements with `useActionState`. No react-hook-form, formik.
- **Global state via Zustand**: Zustand stores serve as the global state layer. Keep stores focused and colocated — one store per domain (auth, UI, etc.). Avoid putting server-fetched data in Zustand (use TanStack Query for that).
