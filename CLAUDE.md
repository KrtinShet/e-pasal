# CLAUDE.md

This file provides context for Claude Code when working on this codebase.

## Project Overview

Baazarify is a multi-tenant e-commerce SaaS platform targeting the Nepali market. It allows merchants to create online stores, manage orders, and integrate with local payment/logistics providers.

## Architecture

### Monorepo Structure (pnpm + Turborepo)

```
apps/
  api/          # Express.js backend - modular monolith
  storefront/   # Next.js 16 - customer-facing store
  dashboard/    # Next.js 16 - merchant portal
  admin/        # Next.js 16 - platform admin
packages/
  shared/       # Shared types, constants, utils
```

### Key Patterns

**API (apps/api)**
- Modular architecture: `modules/{name}/{name}.model.ts|service.ts|controller.ts|routes.ts`
- Multi-tenant via subdomain resolution middleware
- JWT auth with role-based access (merchant, staff, admin)
- Zod for request validation
- MongoDB with Mongoose ODM
- Redis for caching and sessions

**Frontend Apps**
- Next.js 16 with App Router
- Tailwind CSS v4 with custom design system
- Path aliases: `@/*` maps to `src/*`

## Commands

```bash
pnpm dev              # Run all apps
pnpm dev:api          # API only (port 4000)
pnpm dev:storefront   # Storefront only (port 3000)
pnpm dev:dashboard    # Dashboard only (port 5173)
pnpm dev:admin        # Admin only (port 5174)
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm format           # Prettier format
pnpm fix:all          # Lint + format
docker-compose up -d  # Start MongoDB + Redis
```

## Code Style

- ESLint v9 flat config with typescript-eslint
- Prettier: single quotes, trailing commas, 100 char width
- Import sorting via eslint-plugin-perfectionist (by line length)
- No unnecessary comments
- Prefer editing existing files over creating new ones

## API Module Template

When creating a new API module:

```
modules/{name}/
  {name}.model.ts      # Mongoose schema
  {name}.service.ts    # Business logic
  {name}.controller.ts # Request handlers
  {name}.routes.ts     # Express routes
```

Controller pattern:
```typescript
export class FooController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await fooService.list(req.user!.storeId!);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
```

Routes pattern:
```typescript
export const fooRouter = Router();
fooRouter.use(authenticate, requireStore);
fooRouter.get('/', (req, res, next) => fooController.list(req, res, next));
```

## Database

- MongoDB 7 via `docker-compose up -d`
- Connection: `mongodb://localhost:27017/baazarify`
- All queries scoped by `storeId` for multi-tenancy
- Indexes always include `storeId` as first field

## Environment

API requires `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/baazarify
REDIS_URL=redis://localhost:6379
JWT_SECRET=<min-32-chars>
```

## Key Files

- `apps/api/src/middleware/tenant-resolver.ts` - Multi-tenant subdomain resolution
- `apps/api/src/middleware/auth.ts` - JWT authentication
- `apps/api/src/config/env.ts` - Environment validation with Zod
- `packages/shared/src/types/index.ts` - Shared TypeScript types
- `docs/system-design/` - Architecture documentation

## Testing

Not yet implemented. Will use Vitest for API tests.

## Deployment

- Docker Compose for local development
- Production: Railway (API) + Vercel (frontends)
- See `apps/api/Dockerfile` for container build
