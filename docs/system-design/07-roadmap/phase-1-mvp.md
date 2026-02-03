# Phase 1: MVP

[← Back to Monitoring](../06-infrastructure/monitoring.md) | [Next: Phase 2 Growth →](./phase-2-growth.md)

---

## Overview

Build the core platform to onboard the first 50 paying merchants.

**Timeline:** 8-12 weeks

**Goal:** Validate product-market fit with a functional e-commerce platform.

---

## MVP Feature Set

### Core Features (Must Have)

| Feature                       | Priority | Effort    |
| ----------------------------- | -------- | --------- |
| Merchant registration & login | P0       | 1 week    |
| Store setup wizard            | P0       | 1 week    |
| Product management (CRUD)     | P0       | 1 week    |
| Basic storefront (SSR)        | P0       | 2 weeks   |
| Shopping cart & checkout      | P0       | 1.5 weeks |
| Order management              | P0       | 1.5 weeks |
| Basic inventory tracking      | P0       | 0.5 week  |
| Cash on Delivery              | P0       | 0.5 week  |
| Subdomain routing             | P0       | 0.5 week  |

### Secondary Features (Should Have)

| Feature                     | Priority | Effort   |
| --------------------------- | -------- | -------- |
| eSewa payment integration   | P1       | 1 week   |
| Basic analytics dashboard   | P1       | 1 week   |
| Customer management         | P1       | 0.5 week |
| Order notifications (email) | P1       | 0.5 week |
| Mobile-responsive dashboard | P1       | 1 week   |

### Deferred to Phase 2

- Page builder (GrapeJS)
- WhatsApp/Instagram integration
- Logistics integration
- SMS notifications
- Staff accounts
- Custom domains

---

## Development Sprints

### Sprint 1: Foundation (Weeks 1-2)

```
Week 1:
├── Day 1-2: Project setup
│   ├── Monorepo structure (pnpm workspaces)
│   ├── API boilerplate (Express + MongoDB)
│   ├── Dashboard boilerplate (React + Vite)
│   └── Storefront boilerplate (Next.js)
│
├── Day 3-4: Database & Auth
│   ├── MongoDB connection & models
│   ├── User authentication (JWT)
│   ├── Store creation
│   └── Tenant resolution middleware
│
└── Day 5: API scaffolding
    ├── Auth endpoints
    ├── Store endpoints
    └── Basic error handling

Week 2:
├── Day 1-3: Product Management
│   ├── Product CRUD API
│   ├── Category CRUD API
│   ├── Image upload (S3)
│   └── Inventory tracking
│
└── Day 4-5: Dashboard - Products
    ├── Product list page
    ├── Product create/edit form
    ├── Image uploader component
    └── Category management
```

### Sprint 2: Storefront (Weeks 3-4)

```
Week 3:
├── Day 1-2: Store layout
│   ├── Dynamic subdomain routing
│   ├── Store header/footer
│   ├── Theme variables (CSS)
│   └── Responsive layout
│
├── Day 3-4: Product pages
│   ├── Product listing page
│   ├── Product detail page
│   ├── Category filter
│   └── Search functionality
│
└── Day 5: SEO
    ├── Meta tags
    ├── Structured data (JSON-LD)
    └── Sitemap generation

Week 4:
├── Day 1-2: Shopping cart
│   ├── Cart state (Zustand)
│   ├── Cart sidebar UI
│   ├── Add to cart
│   └── Update/remove items
│
└── Day 3-5: Checkout
    ├── Checkout form
    ├── Address validation
    ├── Order creation API
    └── Order confirmation page
```

### Sprint 3: Orders & Dashboard (Weeks 5-6)

```
Week 5:
├── Day 1-3: Order management API
│   ├── Order CRUD
│   ├── Status transitions
│   ├── Inventory reservation
│   └── Order timeline
│
└── Day 4-5: Dashboard - Orders
    ├── Order list with filters
    ├── Order detail view
    ├── Status update UI
    └── Print invoice

Week 6:
├── Day 1-2: Dashboard home
│   ├── Stats cards
│   ├── Recent orders
│   ├── Quick actions
│   └── Revenue chart
│
├── Day 3-4: Customer management
│   ├── Customer list
│   ├── Customer detail
│   └── Order history
│
└── Day 5: Settings
    ├── Store settings
    ├── Theme customization
    └── Profile settings
```

### Sprint 4: Payments & Polish (Weeks 7-8)

```
Week 7:
├── Day 1-3: eSewa integration
│   ├── Payment adapter
│   ├── Checkout flow
│   ├── Webhook handling
│   └── Transaction verification
│
└── Day 4-5: Notifications
    ├── Email templates
    ├── Order confirmation email
    ├── Shipping update email
    └── Password reset email

Week 8:
├── Day 1-2: Analytics
│   ├── Dashboard stats API
│   ├── Revenue charts
│   ├── Order source breakdown
│   └── Top products
│
├── Day 3-4: Mobile optimization
│   ├── Responsive dashboard
│   ├── Mobile navigation
│   └── Touch-friendly UI
│
└── Day 5: Bug fixes & testing
    ├── E2E test suite
    ├── Performance optimization
    └── Security audit
```

### Sprint 5: Launch Prep (Weeks 9-10)

```
Week 9:
├── Day 1-2: Deployment
│   ├── Railway setup
│   ├── Environment config
│   ├── CI/CD pipeline
│   └── Domain setup
│
├── Day 3-4: Monitoring
│   ├── Sentry integration
│   ├── Logging setup
│   ├── Uptime monitoring
│   └── Error alerts
│
└── Day 5: Documentation
    ├── API documentation
    ├── User guide
    └── FAQ

Week 10:
├── Day 1-3: Beta testing
│   ├── Invite 5-10 merchants
│   ├── Collect feedback
│   └── Fix critical issues
│
└── Day 4-5: Launch
    ├── Marketing materials
    ├── Social media presence
    └── Go live!
```

---

## Technical Milestones

### Week 2 Checkpoint

- [ ] User can register and create store
- [ ] User can add products with images
- [ ] API handles multi-tenancy correctly
- [ ] Basic unit tests pass

### Week 4 Checkpoint

- [ ] Storefront renders at subdomain
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Checkout creates order

### Week 6 Checkpoint

- [ ] Orders manageable from dashboard
- [ ] Inventory updates on order
- [ ] Dashboard shows stats
- [ ] Mobile-responsive

### Week 8 Checkpoint

- [ ] eSewa payments work
- [ ] Email notifications send
- [ ] All core features complete
- [ ] No critical bugs

### Week 10 Checkpoint

- [ ] Deployed to production
- [ ] Monitoring in place
- [ ] Beta merchants onboarded
- [ ] Ready for public launch

---

## MVP Database Collections

```javascript
// Minimal schema for MVP
collections: [
  'users', // Merchants only (no staff yet)
  'stores', // Store config (no page builder data yet)
  'products', // Basic products (no variants yet)
  'categories', // Product categories
  'orders', // Orders with items embedded
  'customers', // Customer records
  'inventory', // Stock tracking
];
```

---

## MVP API Endpoints

```
Auth:
  POST   /auth/register
  POST   /auth/login
  POST   /auth/refresh
  GET    /auth/me

Store:
  GET    /stores/me
  PUT    /stores/me
  GET    /stores/me/stats

Products:
  GET    /products
  POST   /products
  GET    /products/:id
  PUT    /products/:id
  DELETE /products/:id
  POST   /products/:id/images

Categories:
  GET    /categories
  POST   /categories
  PUT    /categories/:id
  DELETE /categories/:id

Orders:
  GET    /orders
  POST   /orders
  GET    /orders/:id
  PUT    /orders/:id/status

Customers:
  GET    /customers
  GET    /customers/:id

Storefront:
  GET    /storefront/:subdomain
  GET    /storefront/:subdomain/products
  GET    /storefront/:subdomain/products/:slug
  POST   /storefront/:subdomain/orders

Webhooks:
  POST   /webhooks/payment/esewa
```

---

## MVP Cost Estimate

| Service                 | Monthly Cost      |
| ----------------------- | ----------------- |
| Railway (API + Worker)  | $20               |
| MongoDB Atlas (M0 → M2) | $0-25             |
| Redis (Railway)         | $5                |
| DigitalOcean Spaces     | $5                |
| Cloudflare (Free)       | $0                |
| Sentry (Free tier)      | $0                |
| Domain                  | $1                |
| **Total**               | **~$30-55/month** |

---

## Success Criteria

### Quantitative

- [ ] 50 stores created
- [ ] 500 orders processed
- [ ] 99% uptime
- [ ] < 500ms average API response time

### Qualitative

- [ ] Merchants can complete store setup without help
- [ ] Customers can complete purchase smoothly
- [ ] No critical bugs reported

---

## Risk Mitigation

| Risk           | Mitigation                           |
| -------------- | ------------------------------------ |
| Scope creep    | Strict feature freeze after Sprint 3 |
| Payment issues | Extensive testing with eSewa sandbox |
| Performance    | Load test with 100 concurrent users  |
| Security       | Security audit before launch         |

---

[Next: Phase 2 Growth →](./phase-2-growth.md)
