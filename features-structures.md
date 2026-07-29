# GearUp Backend — Orchestral Rules for Frontend Agent Coding

> This document captures the full anatomy of the GearUp backend (Express + TypeScript + Prisma + PostgreSQL + Stripe) and distills authoritative rules for building a frontend that perfectly mirrors its contracts, conventions, and data flow. Follow these rules precisely.

---

## 1. PROJECT MAP — Backend Structure

```
gear-up-backend/
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma           # Prisma generator + datasource (PostgreSQL)
│   │   ├── enums.prisma            # Role, ActiveStatus, RentalStatus, PaymentStatus
│   │   ├── user.prisma             # User model
│   │   ├── profile.prisma          # Profile (1:1 with User)
│   │   ├── category.prisma         # Category
│   │   ├── gearItem.prisma         # GearItem (belongs to Provider + Category)
│   │   ├── rental.prisma           # RentalOrder (Customer ↔ GearItem)
│   │   ├── payment.prisma          # Payment (1:1 with RentalOrder)
│   │   └── review.prisma           # Review (unique per customer + gear)
│   ├── migrations/
│   └── config.ts
├── generated/prisma/               # Auto-generated Prisma client
├── src/
│   ├── app.ts                      # Express app: middleware + route mounting
│   ├── server.ts                   # Entry point: listen on PORT
│   ├── config/index.ts             # Environment variables (dotenv)
│   ├── lib/
│   │   ├── prisma.ts               # Prisma client singleton (Pg adapter)
│   │   └── stripe.ts               # Stripe SDK init
│   ├── utils/
│   │   ├── catchAsync.ts           # Async error wrapper for controllers
│   │   ├── sendResponse.ts         # Unified JSON response helper
│   │   └── jwt.ts                  # JWT create/verify utilities
│   ├── middleware/
│   │   ├── auth.ts                 # JWT auth + role guard
│   │   ├── globalErrorHandler.ts   # Centralized error handling
│   │   ├── validateRequest.ts      # Zod schema validation middleware
│   │   └── routerHandler.ts        # 404 route handler
│   ├── validations/
│   │   └── requestSchemas.ts       # ALL Zod schemas in one file
│   ├── Interfaces/
│   │   ├── auth.interface.ts       # IloginUser
│   │   ├── user.interface.ts       # RegisterUserPayload + Express.Request augmentation
│   │   ├── category.interface.ts   # ICreateCategory, IUpdateCategory
│   │   ├── gear.interface.ts       # ICreateGear, IGearQuery, IUpdateGear
│   │   ├── rental.interface.ts     # ICreateRental, IUpdateRentalStatus
│   │   └── review.interface.ts     # ICreateReview
│   └── modules/
│       ├── auth/                   # Register, Login, RefreshToken, GetMe
│       ├── users/                  # Update profile
│       ├── category/               # CRUD categories (admin)
│       ├── gear/                   # Public listing (search/filter/paginate)
│       ├── provider/               # Manage own gear + incoming orders
│       ├── rental/                 # Customer place/cancel/view rentals
│       ├── payment/                # Stripe checkout + webhook
│       ├── admin/                  # Manage users, gear, rentals
│       └── review/                 # Submit review after return
├── tsup.config.js                  # ESM bundler config
├── vercel.json                     # Vercel deployment
├── .env.example                    # Env template
└── package.json
```

---

## 2. TECH STACK

| Layer | Technology | Notes |
|---|---|---|
| Runtime | Node.js + TypeScript v6 | ESM modules (`"type": "module"`) |
| Framework | Express.js v5 | Async-native |
| ORM | Prisma v7 | PostgreSQL adapter (`@prisma/adapter-pg`) |
| Database | PostgreSQL | UUID primary keys, `snake_case` table mapping |
| Validation | Zod v4 | Schemas consolidated in one file |
| Auth | JWT (jsonwebtoken) + bcryptjs | Cookies + Bearer fallback |
| Payments | Stripe v22 | Checkout sessions + webhooks |
| Build | tsup (esbuild) | Single ESM bundle → `dist/server.js` |
| Deploy | Vercel | `@vercel/node` runtime |
| Config | dotenv | `.env` at project root |

---

## 3. ARCHITECTURE — Modular MVC

**Pattern:** Route → Middleware Chain (auth → validation) → Controller → Service → Prisma → DB → Response

Each module has **exactly** this shape:
```
module/
├── *.route.ts        # Router with HTTP verbs + middleware stack
├── *.controller.ts   # Extracts req data → calls service → returns response
├── *.services.ts     # Business logic + Prisma queries
└── utils.*.ts        # (optional) Module-specific helpers
```

### Naming Conventions (MANDATORY)

| Artifact | Pattern | Example |
|---|---|---|
| Route file | `{entity}.route.ts` | `auth.route.ts` |
| Controller file | `{entity}.controller.ts` | `auth.controller.ts` |
| Service file | `{entity}.services.ts` | `auth.services.ts` |
| Controller export | `{entity}Controller` object | `export const authController` |
| Service export | `{entity}Services` object | `export const authServices` |
| Route export | `{entity}Routes` router | `export const authRoutes` |
| Service method suffix | `FromDB` / `InDB` | `getAllCategoriesFromDB`, `insertCategoryIntoDB` |
| Interface files | `{entity}.interface.ts` | `gear.interface.ts` |

---

## 4. CODE STYLE RULES

### 4.1 General
- **Double quotes** for strings
- **Semicolons** required
- **Trailing commas** in multiline objects/arrays
- **4-space indentation**
- No JSDoc or inline comments in production code
- **No emojis** in code

### 4.2 Imports
```typescript
import { Router } from "express";                    // regular import
import type { NextFunction, Request } from "express";  // type-only import
import { prisma } from "../../lib/prisma";            // relative paths
import { Role } from "../../../generated/prisma/enums"; // generated enums
```

### 4.3 Types
```typescript
const fn = async (userId: string, payload: IPayload): Promise<Result> => { ... }
const app: Application = express()
```
- Use `import type` for types that are erased at runtime
- Interfaces use `I` prefix: `IloginUser`, `ICreateGear`, `IGearQuery`

### 4.4 Controllers
```typescript
const createRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string       // always cast from req.user
    const order = await rentalServices.insertRentalIntoDB(req.body, customerId)
    sendResponse(res, {
        statusCode: httpstatus.CREATED,              // use http-status library
        success: true,
        message: "Rental order placed successfully",
        data: order,
        meta                                   // optional pagination meta
    })
})
```
- **Always** wrap with `catchAsync`
- **Always** use `sendResponse` for JSON responses
- **Always** use `httpstatus.*` for status codes (not raw numbers)
- Exports: `export const authController = { createRental, ... }`

### 4.5 Services
```typescript
const insertRentalIntoDB = async (payload: ICreateRental, customerId: string) => {
    const gear = await prisma.gearItem.findUniqueOrThrow({ where: { id: payload.gearItemId } })
    const order = await prisma.rentalOrder.create({ data: { ... }, include: { gearItem: true } })
    return order
}
```
- Business logic only in services
- Use `findUniqueOrThrow` for existence checks (throws Prisma `P2025` automatically)
- Use `prisma.$transaction` for multi-step atomic operations
- Throw `new Error("message")` for business rule violations
- Exports: `export const rentalServices = { insertRentalIntoDB, ... }`

### 4.6 Routes
```typescript
import { Router } from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { createRentalSchema } from "../../validations/requestSchemas";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router = Router()
router.post('/', auth(Role.CUSTOMER), validateRequest(createRentalSchema), rentalController.createRental)
export const rentalRoutes = router
```
- Middleware order: **auth → validateRequest → controller**
- `auth(...roles)` guards by role; empty `auth()` means any authenticated user
- Single `Router()` per file, exported as `{entity}Routes`

### 4.7 Response Format — ALL endpoints
```typescript
// Success
{ "success": true, "statusCode": 200, "message": "...", "data": {...}, "meta": {"page":1,"limit":10,"total":42} }

// Error (from globalErrorHandler)
{ "success": false, "statusCode": 500, "name": "Error", "message": "...", "errorDetails": "stack..." }
```

### 4.8 Error Handling
- Controllers: throw `Error` → caught by `catchAsync` → forwarded via `next(error)`
- `globalErrorHandler` catches all errors, including Prisma-specific ones
- Prisma error mapping: `P2002` (duplicate), `P2003` (FK), `P2025` (not found), `P1000`/`P1001` (connection)

---

## 5. API ENDPOINTS REFERENCE

### Auth (`/api/auth`)
| Method | Path | Auth | Validation | Description |
|---|---|---|---|---|
| POST | `/register` | No | `registerSchema` | Create account (CUSTOMER or PROVIDER) |
| POST | `/login` | No | `loginSchema` | Login → sets httpOnly cookies |
| POST | `/refresh-token` | No | — | Refresh access token via cookie |
| GET | `/me` | CUSTOMER/PROVIDER/ADMIN | — | Get current user with profile |

### Users (`/api/users`)
| Method | Path | Auth | Validation | Description |
|---|---|---|---|---|
| PUT | `/update-profile` | any | `updateProfileSchema` | Update name/phone/photo/bio/address |

### Categories (`/api/categories`)
| Method | Path | Auth | Validation | Description |
|---|---|---|---|---|
| GET | `/` | No | — | All categories (with gear count) |
| POST | `/` | ADMIN | `createCategorySchema` | Create category |
| PUT | `/:categoryId` | ADMIN | `updateCategorySchema` | Update category |
| DELETE | `/:categoryId` | ADMIN | — | Delete category |

### Gear (`/api/gear`) — Public
| Method | Path | Auth | Validation | Description |
|---|---|---|---|---|
| GET | `/` | No | — | List with searchTerm, category, brand, minPrice, maxPrice, page, limit, sortBy, sortOrder |
| GET | `/:id` | No | — | Detail with category, provider, reviews |

### Provider (`/api/provider`)
| Method | Path | Auth | Validation | Description |
|---|---|---|---|---|
| POST | `/gear` | PROVIDER | `createGearSchema` | Add gear to inventory |
| PUT | `/gear/:id` | PROVIDER | `updateGearSchema` | Update own gear |
| DELETE | `/gear/:id` | PROVIDER | — | Remove own gear |
| GET | `/orders` | PROVIDER | — | Incoming rental orders |
| PATCH | `/orders/:id` | PROVIDER | `updateRentalStatusSchema` | Update order status |

### Rentals (`/api/rentals`) — Customer
| Method | Path | Auth | Validation | Description |
|---|---|---|---|---|
| POST | `/` | CUSTOMER | `createRentalSchema` | Place rental order |
| GET | `/` | CUSTOMER | — | My rental orders |
| GET | `/:id` | CUSTOMER | — | Single rental detail |
| PATCH | `/:id/cancel` | CUSTOMER | — | Cancel placed order |

### Payments (`/api/payments`)
| Method | Path | Auth | Validation | Description |
|---|---|---|---|---|
| POST | `/create` | CUSTOMER | `createPaymentSchema` | Create Stripe checkout session |
| POST | `/confirm` | No | — | Stripe webhook (raw body) |
| GET | `/` | CUSTOMER | — | My payment history |
| GET | `/:id` | CUSTOMER/ADMIN | — | Payment detail |

### Reviews (`/api/reviews`)
| Method | Path | Auth | Validation | Description |
|---|---|---|---|---|
| POST | `/` | CUSTOMER | `createReviewSchema` | Submit review (after gear returned) |

### Admin (`/api/admin`)
| Method | Path | Auth | Validation | Description |
|---|---|---|---|---|
| GET | `/users` | ADMIN | — | All non-admin users |
| PATCH | `/users/:id` | ADMIN | `updateUserStatusSchema` | Suspend/activate user |
| GET | `/gear` | ADMIN | — | All gear listings |
| GET | `/rentals` | ADMIN | — | All rental orders |

---

## 6. DATA MODELS — Entity Relationships

```
User (CUSTOMER | PROVIDER | ADMIN)
├── Profile (1:1)
├── GearItem[] (as provider)
├── RentalOrder[] (as customer)
├── Payment[] (as customer)
└── Review[] (as customer)

Category (1:N) → GearItem

GearItem (belongs to Provider[User] + Category)
├── Review[] (1:N)
└── RentalOrder[] (1:N)

RentalOrder (belongs to Customer[User] + GearItem)
└── Payment (1:1)

Payment (belongs to Customer[User] + RentalOrder)
```

### Prisma Enums
```typescript
Role         = CUSTOMER | PROVIDER | ADMIN
ActiveStatus = ACTIVE | SUSPENDED
RentalStatus = PLACED | CONFIRMED | PAID | PICKED_UP | RETURNED | CANCELLED
PaymentStatus = PENDING | COMPLETED | FAILED
```

### Rental Status State Machine
```
PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED
  ↓
CANCELLED (only from PLACED by customer)
```

---

## 7. FRONTEND ORCHESTRAL RULES — Agent Coding Guide

### 7.1 Project Structure — MUST mirror the backend
```
frontend/
├── src/
│   ├── app/               # Next.js App Router pages & layouts
│   ├── components/         # Reusable UI components (shadcn/ui style)
│   ├── lib/                # API client, utilities
│   │   ├── api-client.ts   # Axios/fetch wrapper with auth interceptor
│   │   ├── utils.ts        # Shared helpers
│   │   └── constants.ts    # Routes, enums, status maps
│   ├── hooks/              # Custom React hooks (useAuth, useGear, useRental, etc.)
│   ├── store/              # State management (zustand or context)
│   ├── types/              # TypeScript interfaces matching backend
│   │   ├── auth.ts         # IloginUser, RegisterUserPayload
│   │   ├── user.ts         # User, Profile
│   │   ├── category.ts     # Category
│   │   ├── gear.ts         # GearItem, ICreateGear, IGearQuery
│   │   ├── rental.ts       # RentalOrder, ICreateRental
│   │   ├── payment.ts      # Payment
│   │   ├── review.ts       # Review, ICreateReview
│   │   └── api.ts          # ApiResponse<T>, PaginatedResponse<T>
│   ├── modules/            # Feature-based pages (mirror backend modules)
│   │   ├── auth/           # Register, Login pages
│   │   ├── gear/           # Browse gear, gear detail pages
│   │   ├── rentals/        # My rentals, create rental
│   │   ├── provider/       # Provider dashboard (manage gear, orders)
│   │   ├── payments/       # Payment history
│   │   ├── admin/          # Admin dashboard
│   │   ├── profile/        # User profile page
│   │   └── reviews/        # Review submission
│   └── middleware.ts        # Next.js middleware (route protection)
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 7.2 TypeScript Types — MUST exactly match backend contracts

Create a **single source of truth** `src/types/` directory with interfaces that mirror the backend exactly:

```typescript
// src/types/api.ts — generic response wrapper
export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  meta?: { page: number; limit: number; total: number }
}

// src/types/enums.ts — mirror backend enums
export enum Role { CUSTOMER = "CUSTOMER", PROVIDER = "PROVIDER", ADMIN = "ADMIN" }
export enum ActiveStatus { ACTIVE = "ACTIVE", SUSPENDED = "SUSPENDED" }
export enum RentalStatus { PLACED = "PLACED", CONFIRMED = "CONFIRMED", PAID = "PAID", PICKED_UP = "PICKED_UP", RETURNED = "RETURNED", CANCELLED = "CANCELLED" }
export enum PaymentStatus { PENDING = "PENDING", COMPLETED = "COMPLETED", FAILED = "FAILED" }

// src/types/auth.ts
export interface IloginUser { email: string; password: string }
export interface RegisterUserPayload { name: string; email: string; password: string; phone?: string; role?: Role; profilePhoto?: string }

// src/types/user.ts
export interface User { id: string; name: string; email: string; phone?: string; role: Role; status: ActiveStatus; createdAt: string; updatedAt: string; profile?: Profile }
export interface Profile { id: string; profilePhoto?: string; bio?: string; address?: string; userId: string }
export interface UpdateProfilePayload { name?: string; phone?: string; profilePhoto?: string; bio?: string; address?: string }

// src/types/gear.ts
export interface GearItem { id: string; name: string; description: string; brand?: string; pricePerDay: number; stock: number; isAvailable: boolean; images: string[]; categoryId: string; category: Category; providerId: string; provider: User; reviews?: Review[]; _count?: { reviews: number }; createdAt: string; updatedAt: string }
export interface ICreateGear { name: string; description: string; brand?: string; pricePerDay: number; stock?: number; isAvailable?: boolean; images?: string[]; categoryId: string }
export interface IUpdateGear { name?: string; description?: string; brand?: string; pricePerDay?: number; stock?: number; isAvailable?: boolean; images?: string[]; categoryId?: string }
export interface IGearQuery { searchTerm?: string; category?: string; brand?: string; minPrice?: string; maxPrice?: string; page?: string; limit?: string; sortBy?: string; sortOrder?: string }

// src/types/category.ts
export interface Category { id: string; name: string; description?: string; _count?: { gearItems: number }; createdAt: string; updatedAt: string }
export interface ICreateCategory { name: string; description?: string }
export interface IUpdateCategory { name?: string; description?: string }

// src/types/rental.ts
export interface RentalOrder { id: string; customerId: string; gearItemId: string; gearItem: GearItem; status: RentalStatus; startDate: string; endDate: string; quantity: number; days: number; pricePerDay: number; totalAmount: number; payment?: Payment; createdAt: string; updatedAt: string }
export interface ICreateRental { gearItemId: string; startDate: string; endDate: string; quantity?: number }
export interface IUpdateRentalStatus { status: RentalStatus }

// src/types/payment.ts
export interface Payment { id: string; transactionId: string; rentalOrderId: string; amount: number; status: PaymentStatus; stripeSessionId?: string; paidAt?: string; createdAt: string; updatedAt: string; rentalOrder?: RentalOrder }
export interface ICreatePayment { rentalOrderId: string }

// src/types/review.ts
export interface Review { id: string; rating: number; comment?: string; customerId: string; gearItemId: string; customer?: User; createdAt: string; updatedAt: string }
export interface ICreateReview { gearItemId: string; rating: number; comment?: string }

// src/types/admin.ts
export interface UpdateUserStatusPayload { status: ActiveStatus }
```

### 7.3 API Client — Single Axios/Fetch Instance

```typescript
// src/lib/api-client.ts
import axios from "axios"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,             // sends httpOnly cookies automatically
  headers: { "Content-Type": "application/json" },
})

// Interceptor: handle 401 → redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) { window.location.href = "/login" }
    return Promise.reject(err)
  }
)

export default apiClient
```

### 7.4 Auth Flow — Cookie-Based

| Backend | Frontend Action |
|---|---|
| POST `/api/auth/login` → sets `accessToken` + `refreshToken` cookies | Call login API; cookies auto-attached via `withCredentials` |
| POST `/api/auth/refresh-token` → reads `refreshToken` cookie, returns new `accessToken` cookie | On 401, silently call refresh endpoint |
| GET `/api/auth/me` → reads `accessToken` cookie | Call on app load to hydrate user state |
| Logout → clear cookies client-side | `document.cookie = "accessToken=; max-age=0"` (or call a logout endpoint) |

**No token management needed in JS** — cookies are httpOnly and auto-sent.

### 7.5 Page / Module Structure — Mirror Backend Modules

Each backend module gets its own folder in `src/modules/`:

| Backend Module | Frontend Pages | Key Actions |
|---|---|---|
| `auth` | Register, Login | Register form → POST `/register`, Login form → POST `/login` |
| `users` | Profile page | GET `/auth/me`, PUT `/users/update-profile` |
| `gear` | Browse gear, Gear detail | GET `/gear` (with query filters), GET `/gear/:id` |
| `category` | (Used in gear filters, admin) | GET `/categories` |
| `provider` | Provider dashboard: My Gear, Incoming Orders | CRUD `/provider/gear`, GET/PATCH `/provider/orders` |
| `rental` | My Rentals, Create Rental Modal | CRUD `/rentals` |
| `payment` | Payment history, Checkout redirect | POST `/payments/create` → redirect to Stripe URL |
| `admin` | Admin dashboard: Users, Gear, Rentals | GET/PATCH `/admin/*` |
| `review` | Review form on gear detail | POST `/reviews` |

### 7.6 Shared Components — shadcn/ui Pattern

```typescript
// Components are:
// - Pure presentation (no API calls)
// - Accept typed props
// - Use a UI library (shadcn/ui, Ant Design, or custom)
// - Placed in src/components/ organized by domain

// Example:
// src/components/ui/button.tsx       — base UI primitives
// src/components/shared/header.tsx   — app header with auth
// src/components/shared/gear-card.tsx — gear listing card
// src/components/shared/rental-status-badge.tsx — status display
```

### 7.7 Custom Hooks — Per Entity

```typescript
// src/hooks/useAuth.ts
// Returns: { user, isLoading, login, register, logout, refreshUser }

// src/hooks/useGear.ts
// Returns: { gearList, isLoading, fetchGear, fetchGearById, filters, setFilters, pagination }

// src/hooks/useRentals.ts
// Returns: { rentals, createRental, cancelRental, isLoading }

// src/hooks/usePayments.ts
// Returns: { payments, createPayment, isLoading }

// src/hooks/useReviews.ts
// Returns: { submitReview, isLoading }
```

### 7.8 Form Validation — MUST match Zod schemas exactly

Backend Zod schemas are in `src/validations/requestSchemas.ts`. Frontend validation rules MUST be identical:

| Zod Schema (Backend) | Frontend Validation |
|---|---|
| `registerSchema` | name: min(2), email: valid, password: min(6), phone: optional |
| `loginSchema` | email: valid, password: required |
| `createCategorySchema` | name: min(2), description: optional |
| `createGearSchema` | name: min(2), description: min(5), pricePerDay: >0, stock: positive int, categoryId: required |
| `createRentalSchema` | gearItemId, startDate, endDate: required, quantity: optional positive int |
| `createReviewSchema` | rating: 1-5, comment: optional |
| `createPaymentSchema` | rentalOrderId: required |
| `updateProfileSchema` | at least one field: name(min2), phone(min5), profilePhoto, bio, address |
| `updateUserStatusSchema` | status: ACTIVE or SUSPENDED |

Use **zod on the frontend too** (via `npm install zod`) to share the same validation library.

### 7.9 Error Handling — MUST mirror backend

```typescript
// Frontend error handler
try {
  const response = await apiClient.post("/api/auth/login", payload)
  // success: response.data follows { success, statusCode, message, data, meta? }
} catch (error) {
  // error.response.data follows { success: false, statusCode, name, message, errorDetails }
  toast.error(error.response?.data?.message || "Something went wrong")
}
```

### 7.10 State Management Rules

1. **Auth state** — zustand store or React context (hydrated from `GET /api/auth/me`)
2. **Server data** — React Query (TanStack Query) for caching, pagination, refetching
3. **Form state** — React Hook Form + Zod resolver
4. **UI state** — Local component state (useState)

### 7.11 Route Protection — Next.js Middleware

```typescript
// src/middleware.ts
// Protect routes based on user role from cookie
// /provider/* → requires PROVIDER role
// /admin/* → requires ADMIN role
// /rentals/* , /payments/* → requires CUSTOMER or PROVIDER or ADMIN
```

### 7.12 Common UI Patterns

| Pattern | Implementation |
|---|---|
| Gear card | Image, name, price/day, category badge, stock indicator |
| Rental status badge | Color-coded: PLACED=blue, CONFIRMED=indigo, PAID=green, PICKED_UP=orange, RETURNED=gray, CANCELLED=red |
| Payment status badge | PENDING=yellow, COMPLETED=green, FAILED=red |
| Search/filter bar | searchTerm text input + category dropdown + price range + sort select |
| Pagination | Page numbers + prev/next, page size selector |
| Provider order management | Table with status dropdown to transition orders |
| Admin tables | Users table, Gear table, Rentals table with search/filter |

### 7.13 Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 7.14 Coding Style Rules (Frontend)

- **Same style as backend**: double quotes, semicolons, trailing commas, 2-space (TS/JSX common) or 4-space indentation (be consistent)
- **Named exports** for hooks, components, types
- **Default exports** for pages (Next.js convention)
- **No inline comments**
- **No emojis**
- **TypeScript strict mode** enabled
- `import type` for type-only imports
- Component file naming: `PascalCase.tsx` for components, `kebab-case.ts` for utilities

---

## 8. BACKEND → FRONTEND CONTRACT SUMMARY

```
                  Zod Schema (validation)
                         ↓
  Frontend Form ──→ API Client ──→ POST/PUT/DELETE ──→ Backend Route
        ↑                                                    ↓
        │                                            validateRequest (Zod)
        │                                                    ↓
        │                                              Auth Middleware
        │                                                    ↓
        │                                             Controller
        │                                                    ↓
        │                                             Service (business logic)
        │                                                    ↓
        │                                             Prisma (PostgreSQL)
        │                                                    ↓
        └────── JSON Response ←─────── sendResponse ←─────────┘
                 { success, statusCode, message, data, meta }
```



---

```
