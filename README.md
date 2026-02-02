# Baazarify

Multi-tenant e-commerce SaaS platform for the Nepali market.

## Overview

Baazarify enables small-to-medium online sellers to create customizable online stores, manage orders from multiple channels (Website, WhatsApp, Instagram), and integrate with local payment gateways and logistics providers.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **API** | Node.js 20, Express.js, MongoDB 7, Redis 7 |
| **Storefront** | Next.js 16, React 19, Tailwind CSS 4 |
| **Dashboard** | Next.js 16, React 19, Tailwind CSS 4 |
| **Admin** | Next.js 16, React 19, Tailwind CSS 4 |
| **Shared** | TypeScript, Zod |

## Project Structure

```
├── apps/
│   ├── api/          # Express.js backend (port 4000)
│   ├── storefront/   # Customer-facing store (port 3000)
│   ├── dashboard/    # Merchant portal (port 5173)
│   └── admin/        # Platform admin (port 5174)
├── packages/
│   └── shared/       # Shared types, utils, constants
├── docs/
│   └── system-design/
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for MongoDB & Redis)

### Setup

```bash
# Install dependencies
pnpm install

# Start databases
docker-compose up -d

# Create API environment file
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your values

# Run all apps
pnpm dev
```

### Available Scripts

```bash
pnpm dev              # Run all apps in development
pnpm dev:api          # Run API only (port 4000)
pnpm dev:storefront   # Run storefront only (port 3000)
pnpm dev:dashboard    # Run dashboard only (port 5173)
pnpm dev:admin        # Run admin only (port 5174)

pnpm build            # Build all apps
pnpm lint             # Lint all apps
pnpm lint:fix         # Fix lint issues
pnpm format           # Format code with Prettier
pnpm fix:all          # Lint + format
```

## API Endpoints

| Route | Description |
|-------|-------------|
| `POST /api/v1/auth/register` | Register merchant + create store |
| `POST /api/v1/auth/login` | Login |
| `GET /api/v1/stores/me` | Get current store |
| `GET /api/v1/products` | List products |
| `POST /api/v1/products` | Create product |
| `GET /api/v1/orders` | List orders |
| `PATCH /api/v1/orders/:id/status` | Update order status |
| `GET /api/v1/customers` | List customers |
| `GET /api/v1/inventory/low-stock` | Get low stock alerts |
| `GET /api/v1/analytics/dashboard` | Dashboard stats |
| `GET /api/v1/storefront/:subdomain` | Public store API |

## Environment Variables

### API (`apps/api/.env`)

```env
NODE_ENV=development
PORT=4000

MONGODB_URI=mongodb://localhost:27017/baazarify
REDIS_URL=redis://localhost:6379

JWT_SECRET=your-secret-key-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=

STOREFRONT_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

## Architecture

### Multi-Tenancy

- Subdomain-based tenant resolution (`shop.baazarify.com`)
- Shared database with `storeId` scoping
- Redis caching for tenant lookup

### API Modules

- **Auth** - JWT authentication, role-based access
- **Store** - Store settings, subdomain management
- **Product** - Product CRUD with variants
- **Order** - Order lifecycle, status transitions
- **Customer** - Customer profiles, order history
- **Inventory** - Stock tracking, reservations
- **Payment** - eSewa, Khalti integrations
- **Upload** - S3-compatible image storage
- **Analytics** - Dashboard statistics
- **Notification** - In-app notifications

## License

Private - All rights reserved.
