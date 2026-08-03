# GearUp Client

Frontend for **GearUp**, agear rental platform. Built with Next.js 16, React 19, and Tailwind CSS 4.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, shadcn/ui, Tailwind CSS 4, Lucide icons
- **State:** Zustand
- **Forms:** Native `<form>` + `useActionState`, Zod validation
- **Auth:** Cookie-based JWT (httpOnly) with automatic token refresh
- **Payments:** Stripe Checkout (via backend)
- **Images:** Cloudinary
- **Package manager:** pnpm

## Prerequisites

- Node.js 18+
- pnpm

## Getting Started

```bash
git clone <repo-url>
cd gear-up-client
pnpm install
```

Create a `.env` file in the project root:

```env
BACKEND_API_URL=https://gear-up-backend-rho.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=gearupUsers
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_GEARS=gearupItems
```

Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  (publicGroup)/          # Public routes (home, gear browsing, gear detail)
  (dashboardGroup)/       # Protected dashboard routes
    dashboard/
      customer/           # Customer: orders, payments
      provider/           # Provider: gear CRUD, orders
      profile/            # Profile management
    admin-dashboard/      # Admin: users, gear, rentals, profile
  auth/                   # Login, register
  payment/                # Stripe success/cancel pages
components/
  ui/                     # shadcn/ui primitives (button, card, dialog, table, etc.)
  shared/                 # Navbar, Footer, StatusBadge, GearThumb, LogoutDialog
  providers/              # ThemeProvider, UserProvider
lib/
  types.ts                # Shared TypeScript types
  schemas.ts              # Zod schemas
  utils.ts                # cn() utility
  cloudinary.ts           # Cloudinary upload helpers
  format.ts               # Date/number formatting
service/                  # Server-side fetch layer (auth, gear, rentals, admin, provider)
stores/                   # Zustand stores (user, UI, forms)
proxy.ts                  # Next.js middleware (auth, role-based routing)
```

## Features

### Roles

| Role | Dashboard | Capabilities |
|------|-----------|-------------|
| **Customer** | `/dashboard` | Browse gear, rent, view orders/payments, leave reviews |
| **Provider** | `/dashboard` | Manage gear listings, view/fulfill orders |
| **Admin** | `/admin-dashboard` | Manage users, all gear, all rentals |

### Core Flows

- **Auth:** Register as Customer or Provider, login with JWT, automatic refresh token rotation via proxy middleware
- **Gear Browsing:** Public catalog with category filtering, search, and detail pages with image gallery
- **Rental:** Date picker, quantity selection, Stripe Checkout redirect, order status tracking
- **Provider:** Create/edit/delete gear with Cloudinary image upload, stock management, order fulfillment
- **Admin:** User status management ( ACTIVE / BANNED ), gear oversight, rental monitoring

### Rental Order Status

`PLACED` → `CONFIRMED` → `PAID` → `PICKED_UP` → `RETURNED` (or `CANCELLED`)

## Available Scripts

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture Notes

- **Proxy middleware** (`proxy.ts`) handles auth: decodes JWTs, refreshes expired access tokens, redirects based on role, protects routes
- **Server actions** handle all mutations (login, register, profile updates, gear CRUD, rentals, payments)
- **Zustand stores** manage client-side state (user identity, UI toggles, form state). No `useState` in components
- **Service layer** (`service/`) wraps all backend fetches with `unstable_cache` for server-side caching with tag-based invalidation
- **No axios** — all HTTP via native `fetch()`
