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
pnpm dev:proxy        # Run Caddy proxy (requires: brew install caddy)
pnpm dev:all          # Run all apps + Caddy proxy together
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

## Local Development URLs

With Caddy proxy running (`pnpm dev:all`):

| App        | URL                                |
| ---------- | ---------------------------------- |
| Dashboard  | http://dashboard.localhost         |
| Admin      | http://admin.localhost             |
| API        | http://api.localhost               |
| Storefront | http://{store-subdomain}.localhost |

Example storefronts:

- `http://mystore.localhost` → loads "mystore" tenant
- `http://demo.localhost` → loads "demo" tenant

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
- Connection: `mongodb://localhost:27117/baazarify`
- All queries scoped by `storeId` for multi-tenancy
- Indexes always include `storeId` as first field

## Environment

API requires `.env` file:

```
MONGODB_URI=mongodb://localhost:27117/baazarify
REDIS_URL=redis://localhost:6479
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

---

## Project Management

### Structure

All project planning lives in `docs/project-management/`:

```
docs/project-management/
├── README.md                     # Overview
└── phase-1-mvp/
    ├── README.md                 # Phase overview with epic/sprint tables
    ├── epics/
    │   ├── README.md             # Epic backlog table
    │   └── epic-{XX}-{name}/
    │       ├── README.md         # Epic overview, story table
    │       └── stories/
    │           ├── README.md     # Story index
    │           └── story-{EXX}-s{YY}-{name}/
    │               ├── README.md      # Story overview
    │               ├── tasks.md       # Detailed task breakdown
    │               └── acceptance.md  # Acceptance criteria
    └── sprints/
        ├── README.md             # Sprint overview table
        └── sprint-{XX}-{name}/
            ├── README.md         # Sprint scope, committed stories
            └── execution-plan.md # Day-wise sequencing
```

### Key Documents

| Document      | Location                        | Purpose                          |
| ------------- | ------------------------------- | -------------------------------- |
| Epic Backlog  | `phase-1-mvp/epics/README.md`   | All epics with story counts      |
| Sprint Plans  | `phase-1-mvp/sprints/README.md` | Sprint timeline and goals        |
| System Design | `docs/system-design/`           | Architecture and technical specs |

### Current Epics

| ID  | Epic                             | Status      |
| --- | -------------------------------- | ----------- |
| E01 | Foundation and Tenant Core       | Done        |
| E02 | Catalog and Storefront Commerce  | In Progress |
| E03 | Orders and Merchant Operations   | Pending     |
| E04 | Payments, Analytics, and Polish  | Pending     |
| E05 | Launch and Reliability           | Pending     |
| E06 | UI System and Storefront Builder | Pending     |

### Workflow: Updating Project Management

**When starting work on a story:**

1. Read the story README: `docs/project-management/phase-1-mvp/epics/epic-{XX}-{name}/stories/story-{EXX}-s{YY}-{name}/README.md`
2. Review tasks.md for detailed breakdown
3. Review acceptance.md for completion criteria
4. Update story status to "In Progress" in the epic README

**When completing a task:**

1. Check off the task in `tasks.md` using `- [x]`
2. If all tasks complete, verify acceptance criteria in `acceptance.md`

**When completing a story:**

1. Mark all acceptance criteria as done: `- [x]`
2. Update story status to "Done" in:
   - Epic README (`epics/epic-{XX}/README.md`) - story table
   - Sprint README (`sprints/sprint-{XX}/README.md`) - if applicable
   - Stories index (`stories/README.md`)
3. Add completion date if tracking

**When completing an epic:**

1. Update epic status in `epics/README.md`
2. Add progress snapshot with date in epic README

### Status Values

- `Pending` - Not started
- `In Progress` - Work underway
- `Done` - Completed and verified
- `Blocked` - Waiting on dependency

### Example: Marking a Story Complete

```markdown
<!-- In epic README story table, change: -->

| E01-S02 | Auth API and merchant registration | Sprint 1 | Week 1 Day 3-4 | In Progress |

<!-- To: -->

| E01-S02 | Auth API and merchant registration | Sprint 1 | Week 1 Day 3-4 | Done |
```

### Adding New Work

**To add a new story to an existing epic:**

1. Create story folder: `stories/story-{EXX}-s{YY}-{name}/`
2. Create README.md, tasks.md, acceptance.md
3. Add to epic README story table
4. Add to stories/README.md index
5. Add to relevant sprint README if scheduled
6. Update story counts in sprint and phase READMEs

**To add a new epic:**

1. Create epic folder: `epics/epic-{XX}-{name}/`
2. Create README.md with story table
3. Create `stories/README.md` index
4. Add to `epics/README.md` backlog table
5. Add to `phase-1-mvp/README.md` epic breakdown
6. Assign stories to sprints and update sprint READMEs

### Keeping Documents in Sync

When making changes, update ALL affected documents:

| Change              | Update These Files                                               |
| ------------------- | ---------------------------------------------------------------- |
| Story status change | Epic README, Sprint README, Stories index                        |
| New story added     | Epic README, Stories index, Sprint README, Phase README (counts) |
| New epic added      | Epics README, Phase README, Sprint READMEs                       |
| Sprint scope change | Sprint README, Phase README (counts)                             |

### Design Documents

Technical designs live in `docs/system-design/`. Reference them from epic/story READMEs:

```markdown
## Technical Design

- [UI System Design](../../../../system-design/05-frontend/ui-system-design.md)
```

---

## UI System (Planned)

### Packages

```
packages/
  ui/                    # @baazarify/ui - Shared component library
  storefront-builder/    # @baazarify/storefront-builder - Landing page builder
```

### Design Tokens

Theme customization via CSS variables. Token schema in `packages/ui/src/tokens/schema.ts` defines:

- Colors (primary, secondary, accent, semantic)
- Radius (sm, md, lg, xl)
- Typography (fonts, sizes, weights)
- Spacing, shadows, transitions

### Key Patterns

- ThemeProvider injects CSS variables at runtime
- Components use Tailwind classes mapped to CSS variables
- Per-store themes stored in database, loaded in storefront layout
- Section-based landing page builder with AI-assisted generation

See: `docs/system-design/05-frontend/ui-system-design.md`

---

## Notes

- DO NOT INCLUDE Claude Signature or AI Signature, in git messages
