# API Integration Reference

All backend endpoints are called from Next.js **Server Actions** and **Server Components**. The base URL is `BACKEND_API_URL` from environment variables. Authentication uses **httpOnly cookies** (`accessToken`, `refreshToken`).

---

## 1. Authentication

### POST `/api/auth/register`

Register a new user account.

**Input:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass123",
  "role": "CUSTOMER"
}
```

**Output (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully"
}
```

**Notes:** After registration, the frontend automatically calls login to obtain tokens.

---

### POST `/api/auth/login`

Authenticate and receive JWT tokens.

**Input:**

```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Output (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."
  }
}
```

**Side Effects:** Sets `accessToken` (24h) and `refreshToken` (7d) as httpOnly cookies.

---

### POST `/api/auth/refresh-token`

Refresh an expired access token using the refresh token.

**Input (Cookie):**

```
Cookie: refreshToken=dGhpcyBpcyBhIHJlZnJlc2g...
```

**Output (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...(new)"
  }
}
```

---

### GET `/api/auth/me`

Get the currently authenticated user's profile.

**Input (Cookie):**

```
Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...
```

**Output (200):**

```json
{
  "id": "clx1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "CUSTOMER",
  "status": "ACTIVE",
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-07-20T14:22:00.000Z",
  "profile": {
    "profilePhoto": "https://res.cloudinary.com/xxx/image/upload/...",
    "bio": "Outdoor enthusiast",
    "address": "123 Main St, New York, NY"
  }
}
```

---

## 2. User Profile

### PUT `/api/users/update-profile`

Update the authenticated user's profile.

**Input (Cookie + JSON body):**

```json
{
  "name": "John Doe Updated",
  "phone": "+1987654321",
  "profilePhoto": "https://res.cloudinary.com/xxx/image/upload/new-photo.jpg",
  "bio": "Updated bio text",
  "address": "456 Oak Ave, Boston, MA"
}
```

**Output (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "clx1234567890",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "phone": "+1987654321",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "profile": {
      "profilePhoto": "https://res.cloudinary.com/xxx/image/upload/new-photo.jpg",
      "bio": "Updated bio text",
      "address": "456 Oak Ave, Boston, MA"
    }
  }
}
```

**Cache Invalidation:** Tag `my-profile`

---

## 3. Gear (Public Catalog)

### GET `/api/gear`

List gear items with filtering, search, and pagination.

**Input (Query Parameters):**

```
GET /api/gear?searchTerm=tent&category=clx001&brand=Nike&minPrice=10&maxPrice=100&page=1&limit=12&sortBy=pricePerDay&sortOrder=asc
```

| Parameter | Type | Description |
|---|---|---|
| `searchTerm` | string | Search by name/description |
| `category` | string | Category ID filter |
| `brand` | string | Brand name filter |
| `minPrice` | number | Minimum price per day |
| `maxPrice` | number | Maximum price per day |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12) |
| `sortBy` | string | Sort field (`pricePerDay`, `name`, `createdAt`) |
| `sortOrder` | string | `asc` or `desc` |

**Output (200):**

```json
{
  "items": [
    {
      "id": "clx001",
      "name": "Mountain Tent Pro",
      "brand": "Nordisk",
      "pricePerDay": 25.00,
      "isAvailable": true,
      "images": [
        "https://res.cloudinary.com/xxx/image/upload/tent1.jpg"
      ],
      "category": {
        "id": "clx001",
        "name": "Camping"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 48
  }
}
```

---

### GET `/api/gear/:id`

Get full details of a single gear item including reviews.

**Input (URL Param):**

```
GET /api/gear/clx001
```

**Output (200):**

```json
{
  "id": "clx001",
  "name": "Mountain Tent Pro",
  "description": "4-season tent for extreme conditions",
  "brand": "Nordisk",
  "pricePerDay": 25.00,
  "stock": 5,
  "isAvailable": true,
  "images": [
    "https://res.cloudinary.com/xxx/image/upload/tent1.jpg",
    "https://res.cloudinary.com/xxx/image/upload/tent2.jpg"
  ],
  "categoryId": "clx001",
  "category": {
    "id": "clx001",
    "name": "Camping"
  },
  "providerId": "clx002",
  "provider": {
    "id": "clx002",
    "name": "Outdoor Rentals Co",
    "email": "provider@example.com"
  },
  "reviews": [
    {
      "id": "clx003",
      "rating": 5,
      "comment": "Excellent tent!",
      "customer": {
        "id": "clx004",
        "name": "Jane Smith"
      },
      "createdAt": "2026-06-10T08:00:00.000Z"
    }
  ],
  "_count": { "reviews": 12 },
  "createdAt": "2026-01-10T10:00:00.000Z",
  "updatedAt": "2026-07-15T12:00:00.000Z"
}
```

---

### GET `/api/categories`

List all gear categories.

**Input:** None

**Output (200):**

```json
[
  {
    "id": "clx001",
    "name": "Camping",
    "_count": { "gearItems": 15 }
  },
  {
    "id": "clx002",
    "name": "Hiking",
    "_count": { "gearItems": 22 }
  },
  {
    "id": "clx003",
    "name": "Climbing",
    "_count": { "gearItems": 8 }
  }
]
```

---

## 4. Rentals

### POST `/api/rentals`

Create a new rental order.

**Input (Cookie + JSON body):**

```json
{
  "gearItemId": "clx001",
  "startDate": "2026-08-10",
  "endDate": "2026-08-15",
  "quantity": 2
}
```

**Output (201):**

```json
{
  "success": true,
  "message": "Rental order created successfully",
  "data": {
    "id": "clx100",
    "startDate": "2026-08-10T00:00:00.000Z",
    "endDate": "2026-08-15T00:00:00.000Z",
    "quantity": 2,
    "days": 5,
    "totalAmount": 250.00
  }
}
```

**Cache Invalidation:** Tags `my-rentals`, `my-payments`

---

### GET `/api/rentals`

Get all rental orders for the authenticated user.

**Input (Cookie):**

```
Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...
```

**Output (200):**

```json
[
  {
    "id": "clx100",
    "customerId": "clx1234567890",
    "gearItemId": "clx001",
    "customer": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "gearItem": {
      "id": "clx001",
      "name": "Mountain Tent Pro",
      "brand": "Nordisk",
      "images": ["https://res.cloudinary.com/xxx/image/upload/tent1.jpg"],
      "category": { "id": "clx001", "name": "Camping" }
    },
    "status": "PAID",
    "startDate": "2026-08-10T00:00:00.000Z",
    "endDate": "2026-08-15T00:00:00.000Z",
    "quantity": 2,
    "days": 5,
    "pricePerDay": 25.00,
    "totalAmount": 250.00,
    "payment": {
      "id": "clx200",
      "transactionId": "txn_abc123",
      "amount": 250.00,
      "status": "COMPLETED",
      "paidAt": "2026-08-05T10:30:00.000Z"
    },
    "createdAt": "2026-08-01T10:00:00.000Z",
    "updatedAt": "2026-08-05T10:30:00.000Z"
  }
]
```

**Rental Statuses:** `PLACED` | `CONFIRMED` | `PAID` | `PICKED_UP` | `RETURNED` | `CANCELLED`

---

### GET `/api/rentals/:id`

Get a specific rental order by ID.

**Input (URL Param + Cookie):**

```
GET /api/rentals/clx100
Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...
```

**Output (200):** Same shape as individual item from `GET /api/rentals` above.

---

### PATCH `/api/rentals/:id/cancel`

Cancel a rental order.

**Input (URL Param + Cookie):**

```
PATCH /api/rentals/clx100/cancel
Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...
```

**Output (200):**

```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

**Cache Invalidation:** Tags `my-rentals`, `my-payments`

---

## 5. Payments

### POST `/api/payments/create`

Initiate a Stripe checkout session for a rental order.

**Input (Cookie + JSON body):**

```json
{
  "rentalOrderId": "clx100"
}
```

**Output (200):**

```json
{
  "success": true,
  "message": "Payment session created",
  "data": {
    "url": "https://checkout.stripe.com/pay/cs_test_abc123...",
    "stripeSessionId": "cs_test_abc123"
  }
}
```

**Notes:** The `url` is returned for client-side redirect to Stripe Checkout.

---

### GET `/api/payments`

Get all payments for the authenticated user.

**Input (Cookie):**

```
Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...
```

**Output (200):**

```json
[
  {
    "id": "clx200",
    "transactionId": "txn_abc123",
    "rentalOrderId": "clx100",
    "amount": 250.00,
    "status": "COMPLETED",
    "stripeSessionId": "cs_test_abc123",
    "paidAt": "2026-08-05T10:30:00.000Z",
    "createdAt": "2026-08-05T10:00:00.000Z",
    "updatedAt": "2026-08-05T10:30:00.000Z",
    "rentalOrder": {
      "id": "clx100",
      "status": "PAID",
      "gearItem": { "name": "Mountain Tent Pro" }
    }
  }
]
```

**Payment Statuses:** `PENDING` | `COMPLETED` | `FAILED`

---

## 6. Reviews

### POST `/api/reviews`

Submit a review for a gear item.

**Input (Cookie + JSON body):**

```json
{
  "gearItemId": "clx001",
  "rating": 5,
  "comment": "Excellent tent, very durable in harsh weather!"
}
```

**Output (201):**

```json
{
  "success": true,
  "message": "Review submitted successfully"
}
```

**Cache Invalidation:** Tags `public-gear`, `gear-clx001`

---

## 7. Provider — Gear Management

### POST `/api/provider/gear`

Create a new gear listing (provider only).

**Input (Cookie + JSON body):**

```json
{
  "name": "Alpine Climbing Harness",
  "description": "Lightweight climbing harness for alpine routes",
  "brand": "Petzl",
  "pricePerDay": 15.00,
  "stock": 10,
  "isAvailable": true,
  "images": [
    "https://res.cloudinary.com/xxx/image/upload/harness1.jpg"
  ],
  "categoryId": "clx003"
}
```

**Output (201):**

```json
{
  "success": true,
  "message": "Gear created successfully",
  "data": {
    "id": "clx300",
    "name": "Alpine Climbing Harness",
    "pricePerDay": 15.00,
    "stock": 10
  }
}
```

**Cache Invalidation:** Tag `public-gear`

---

### PUT `/api/provider/gear/:id`

Update an existing gear listing (provider only).

**Input (Cookie + JSON body):**

```json
{
  "name": "Alpine Climbing Harness v2",
  "pricePerDay": 18.00,
  "stock": 8
}
```

**Output (200):**

```json
{
  "success": true,
  "message": "Gear updated successfully",
  "data": {
    "id": "clx300",
    "name": "Alpine Climbing Harness v2",
    "pricePerDay": 18.00,
    "stock": 8
  }
}
```

**Cache Invalidation:** Tags `public-gear`, `gear-clx300`

---

### DELETE `/api/provider/gear/:id`

Delete a gear listing (provider only).

**Input (URL Param + Cookie):**

```
DELETE /api/provider/gear/clx300
Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...
```

**Output (200):**

```json
{
  "success": true,
  "message": "Gear deleted successfully"
}
```

**Cache Invalidation:** Tag `public-gear`

---

### GET `/api/provider/gear`

Get all gear listings for the authenticated provider.

**Input (Cookie):**

```
Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...
```

**Output (200):**

```json
[
  {
    "id": "clx300",
    "name": "Alpine Climbing Harness v2",
    "description": "Lightweight climbing harness for alpine routes",
    "brand": "Petzl",
    "pricePerDay": 18.00,
    "stock": 8,
    "isAvailable": true,
    "images": ["https://res.cloudinary.com/xxx/image/upload/harness1.jpg"],
    "category": { "id": "clx003", "name": "Climbing" },
    "provider": { "id": "clx002", "name": "Outdoor Rentals Co" },
    "createdAt": "2026-06-01T10:00:00.000Z"
  }
]
```

---

## 8. Provider — Orders

### GET `/api/provider/orders`

Get all rental orders for the provider's gear.

**Input (Cookie):**

```
Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...
```

**Output (200):**

```json
[
  {
    "id": "clx100",
    "customerId": "clx1234567890",
    "gearItemId": "clx300",
    "customer": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "gearItem": {
      "id": "clx300",
      "name": "Alpine Climbing Harness v2",
      "brand": "Petzl",
      "images": ["https://res.cloudinary.com/xxx/image/upload/harness1.jpg"],
      "category": { "id": "clx003", "name": "Climbing" }
    },
    "status": "CONFIRMED",
    "startDate": "2026-08-20T00:00:00.000Z",
    "endDate": "2026-08-25T00:00:00.000Z",
    "quantity": 1,
    "days": 5,
    "pricePerDay": 18.00,
    "totalAmount": 90.00,
    "createdAt": "2026-08-10T10:00:00.000Z",
    "updatedAt": "2026-08-12T14:00:00.000Z"
  }
]
```

---

### PATCH `/api/provider/orders/:id`

Update a rental order status (provider only).

**Input (URL Param + Cookie + JSON body):**

```json
{
  "status": "PICKED_UP"
}
```

**Valid statuses:** `CONFIRMED` | `PICKED_UP` | `RETURNED`

**Output (200):**

```json
{
  "success": true,
  "message": "Order status updated successfully"
}
```

**Cache Invalidation:** Tags `provider-orders`, `my-rentals`

---

## 9. Admin

### GET `/api/admin/users`

Get all users (admin only).

**Input (Cookie):**

```
Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...
```

**Output (200):**

```json
[
  {
    "id": "clx1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-07-20T14:22:00.000Z"
  }
]
```

---

### PATCH `/api/admin/users/:id`

Update a user's status (admin only).

**Input (URL Param + Cookie + JSON body):**

```json
{
  "status": "SUSPENDED"
}
```

**Valid statuses:** `ACTIVE` | `SUSPENDED`

**Output (200):**

```json
{
  "success": true,
  "message": "User status updated successfully"
}
```

**Cache Invalidation:** Tag `admin-users`

---

### GET `/api/admin/gear`

Get all gear items across all providers (admin only).

**Input (Cookie):**

```
Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...
```

**Output (200):** Same shape as `GET /api/provider/gear` but includes gear from all providers.

---

### GET `/api/admin/rentals`

Get all rental orders across all users (admin only).

**Input (Cookie):**

```
Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...
```

**Output (200):** Same shape as `GET /api/rentals` but includes orders from all customers.

---

## 10. External — Cloudinary Image Upload

### POST `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`

Upload an image to Cloudinary (used for profile photos and gear images).

**Input (multipart/form-data):**

| Field | Type | Description |
|---|---|---|
| `file` | File | The image file to upload |
| `upload_preset` | string | Unsigned upload preset |

**Output (200):**

```json
{
  "secure_url": "https://res.cloudinary.com/xxx/image/upload/v1234567890/photo.jpg",
  "public_id": "xxx/photo",
  "version": 1234567890,
  "width": 1920,
  "height": 1080,
  "format": "jpg"
}
```

**Notes:** Only `secure_url` is used by the frontend.

---

## 11. Middleware — Token Refresh

The `proxy.ts` middleware intercepts all non-static requests and handles:

1. **Token Refresh:** If `accessToken` is expired but `refreshToken` is valid, calls `POST /api/auth/refresh-token` and sets the new cookie.
2. **Route Protection:** Redirects unauthenticated users to `/auth/login`. Redirects authenticated users away from `/auth/*`. Restricts admin routes to ADMIN role, and dashboard routes to CUSTOMER/PROVIDER roles.

---

## Summary Table

| # | Endpoint | Method | Auth | Description |
|---|---|---|---|---|
| 1 | `/api/auth/register` | POST | No | Register new user |
| 2 | `/api/auth/login` | POST | No | Login and get tokens |
| 3 | `/api/auth/refresh-token` | POST | No | Refresh access token |
| 4 | `/api/auth/me` | GET | Yes | Get current user |
| 5 | `/api/users/update-profile` | PUT | Yes | Update user profile |
| 6 | `/api/gear` | GET | No | List gear (search/filter/paginate) |
| 7 | `/api/gear/:id` | GET | No | Get gear detail + reviews |
| 8 | `/api/categories` | GET | No | List all categories |
| 9 | `/api/rentals` | POST | Yes | Create rental order |
| 10 | `/api/rentals` | GET | Yes | Get user's rental orders |
| 11 | `/api/rentals/:id` | GET | Yes | Get single rental order |
| 12 | `/api/rentals/:id/cancel` | PATCH | Yes | Cancel a rental order |
| 13 | `/api/payments/create` | POST | Yes | Initiate Stripe payment |
| 14 | `/api/payments` | GET | Yes | Get user's payments |
| 15 | `/api/reviews` | POST | Yes | Submit gear review |
| 16 | `/api/provider/gear` | POST | Yes | Create gear listing |
| 17 | `/api/provider/gear/:id` | PUT | Yes | Update gear listing |
| 18 | `/api/provider/gear/:id` | DELETE | Yes | Delete gear listing |
| 19 | `/api/provider/gear` | GET | Yes | Get provider's gear |
| 20 | `/api/provider/orders` | GET | Yes | Get provider's orders |
| 21 | `/api/provider/orders/:id` | PATCH | Yes | Update order status |
| 22 | `/api/admin/users` | GET | Yes | Get all users |
| 23 | `/api/admin/users/:id` | PATCH | Yes | Update user status |
| 24 | `/api/admin/gear` | GET | Yes | Get all gear (admin) |
| 25 | `/api/admin/rentals` | GET | Yes | Get all rentals (admin) |
| 26 | Cloudinary `/image/upload` | POST | No | Upload image |

**Total: 25 backend endpoints + 1 external service**
