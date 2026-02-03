# System Architecture

[← Back to Vision](./vision.md) | [Next: Tech Stack →](./tech-stack.md)

---

## High-Level Architecture

```mermaid
graph TB
    subgraph Internet
        U1[Customers]
        U2[Merchants]
        U3[Platform Admin]
    end

    subgraph CDN
        CF[Cloudflare]
    end

    subgraph Frontend Apps
        SF[Storefront<br/>Next.js SSR]
        MD[Merchant Dashboard<br/>React SPA]
        AD[Admin Dashboard<br/>React SPA]
    end

    subgraph API Layer
        GW[API Gateway<br/>Express.js]
        AUTH[Auth Middleware]
        RL[Rate Limiter]
        TR[Tenant Resolver]
    end

    subgraph Core Services
        AS[Auth Service]
        SS[Store Service]
        PS[Product Service]
        OS[Order Service]
        IS[Inventory Service]
        NS[Notification Service]
    end

    subgraph Integration Layer
        PG[Payment Gateway<br/>Adapter]
        LG[Logistics<br/>Adapter]
        WA[WhatsApp<br/>Twilio]
        IG[Instagram<br/>Graph API]
    end

    subgraph Data Layer
        MDB[(MongoDB<br/>Primary)]
        RDS[(Redis<br/>Cache)]
        S3[Object Storage<br/>S3/DO Spaces]
    end

    subgraph Background
        Q[Job Queue<br/>BullMQ]
        W[Workers]
    end

    U1 --> CF
    U2 --> CF
    U3 --> CF
    CF --> SF
    CF --> MD
    CF --> AD
    SF --> GW
    MD --> GW
    AD --> GW
    GW --> AUTH
    AUTH --> RL
    RL --> TR
    TR --> AS
    TR --> SS
    TR --> PS
    TR --> OS
    TR --> IS
    TR --> NS
    OS --> PG
    OS --> LG
    NS --> WA
    NS --> IG
    AS --> MDB
    SS --> MDB
    PS --> MDB
    OS --> MDB
    IS --> MDB
    AS --> RDS
    SS --> S3
    PS --> S3
    NS --> Q
    Q --> W

    style CF fill:#0d9488,color:#fff
    style GW fill:#0d9488,color:#fff
    style MDB fill:#115e59,color:#fff
    style RDS fill:#115e59,color:#fff
    style S3 fill:#115e59,color:#fff
```

---

## Component Breakdown

### Frontend Layer

| App                    | Technology   | Purpose                | Deployment       |
| ---------------------- | ------------ | ---------------------- | ---------------- |
| **Storefront**         | Next.js 14   | Customer-facing stores | Vercel / Railway |
| **Merchant Dashboard** | React + Vite | Store management       | Static hosting   |
| **Admin Dashboard**    | React + Vite | Platform management    | Static hosting   |

#### Storefront Routing

```
https://{store-slug}.baazarify.com/           → Store homepage
https://{store-slug}.baazarify.com/products   → Product listing
https://{store-slug}.baazarify.com/p/{slug}   → Product detail
https://{store-slug}.baazarify.com/cart       → Shopping cart
https://{store-slug}.baazarify.com/checkout   → Checkout flow
https://custom-domain.com/                    → Custom domain (premium)
```

---

### API Layer

Single Express.js application with modular service structure:

```
/api
├── /auth           → Authentication endpoints
├── /stores         → Store management
├── /products       → Product CRUD
├── /orders         → Order management
├── /inventory      → Stock management
├── /customers      → Customer data
├── /analytics      → Reporting endpoints
├── /integrations   → External service webhooks
└── /admin          → Platform administration
```

#### Middleware Stack

```mermaid
graph LR
    A[Request] --> B[Cloudflare]
    B --> C[Rate Limiter]
    C --> D[Auth Check]
    D --> E[Tenant Resolver]
    E --> F[Request Validation]
    F --> G[Route Handler]
    G --> H[Response]

    style A fill:#134e4a,color:#fff
    style H fill:#134e4a,color:#fff
```

**Tenant Resolution Flow:**

1. Extract subdomain from request host
2. Lookup store by subdomain in Redis cache
3. If cache miss, query MongoDB
4. Attach `storeId` to request context
5. All subsequent queries scoped to tenant

---

### Service Layer

Services are **modules within the monolith**, not separate microservices:

```javascript
// Directory structure
/src
├── /services
│   ├── /auth
│   │   ├── auth.service.js
│   │   ├── auth.controller.js
│   │   └── auth.routes.js
│   ├── /store
│   ├── /product
│   ├── /order
│   ├── /inventory
│   └── /notification
├── /integrations
│   ├── /payment
│   │   ├── payment.adapter.js
│   │   ├── esewa.provider.js
│   │   ├── khalti.provider.js
│   │   └── fonepay.provider.js
│   ├── /logistics
│   └── /messaging
└── /shared
    ├── /middleware
    ├── /utils
    └── /errors
```

---

### Data Layer

#### MongoDB (Primary Database)

- **Shared database** for free/basic/premium/business plans
- **Dedicated database** for platinum/enterprise (isolated)
- All collections indexed on `storeId` for tenant isolation

#### Redis (Cache & Sessions)

| Use Case            | TTL    | Key Pattern                 |
| ------------------- | ------ | --------------------------- |
| Session tokens      | 7 days | `session:{token}`           |
| Store config        | 1 hour | `store:{subdomain}`         |
| Product cache       | 15 min | `products:{storeId}:{page}` |
| Rate limit counters | 1 min  | `ratelimit:{ip}:{endpoint}` |

#### Object Storage (S3/DO Spaces)

```
/baazarify-assets
├── /stores/{storeId}
│   ├── /logo/
│   ├── /favicon/
│   └── /pages/          → Page builder assets
├── /products/{storeId}
│   └── /{productId}/    → Product images
└── /temp/               → Upload staging
```

---

### Background Jobs

Using **BullMQ** with Redis for job queues:

| Queue           | Jobs                                    | Priority |
| --------------- | --------------------------------------- | -------- |
| `notifications` | SMS, WhatsApp, Email                    | High     |
| `orders`        | Status sync, inventory update           | High     |
| `analytics`     | Daily reports, aggregations             | Low      |
| `cleanup`       | Temp file deletion, log rotation        | Low      |
| `sync`          | External service sync (Instagram, etc.) | Medium   |

```mermaid
graph LR
    A[API] -->|Add Job| B[Redis Queue]
    B --> C[Worker 1]
    B --> D[Worker 2]
    C -->|Process| E[Send WhatsApp]
    D -->|Process| F[Update Inventory]

    style B fill:#0d9488,color:#fff
```

---

## Request Flow Examples

### Customer Places Order

```mermaid
sequenceDiagram
    participant C as Customer
    participant SF as Storefront
    participant API as API Gateway
    participant OS as Order Service
    participant IS as Inventory Service
    participant PS as Payment Service
    participant NS as Notification Service
    participant DB as MongoDB

    C->>SF: Submit Order
    SF->>API: POST /orders
    API->>OS: Create Order
    OS->>IS: Reserve Inventory
    IS->>DB: Update stock (reserved)
    IS-->>OS: Reserved OK
    OS->>DB: Save order (pending)
    OS->>PS: Initiate Payment
    PS-->>C: Redirect to eSewa
    C->>PS: Complete Payment
    PS->>OS: Payment Webhook
    OS->>DB: Update order (paid)
    OS->>IS: Confirm inventory deduction
    OS->>NS: Queue notifications
    NS-->>C: WhatsApp confirmation
    NS-->>M: Dashboard notification
```

### Merchant Updates Product

```mermaid
sequenceDiagram
    participant M as Merchant
    participant MD as Dashboard
    participant API as API Gateway
    participant PS as Product Service
    participant S3 as Object Storage
    participant Cache as Redis
    participant DB as MongoDB

    M->>MD: Edit product
    MD->>API: PUT /products/{id}
    API->>PS: Update product
    PS->>S3: Upload new images
    S3-->>PS: Image URLs
    PS->>DB: Update product doc
    PS->>Cache: Invalidate product cache
    PS-->>MD: Success response
    MD-->>M: Show updated product
```

---

## Security Architecture

### Authentication

- **JWT tokens** for API authentication
- **Refresh token rotation** for extended sessions
- **Role-based access control** (RBAC)

```mermaid
graph TD
    A[Login Request] --> B{Valid Credentials?}
    B -->|Yes| C[Generate Access Token<br/>15 min expiry]
    B -->|No| D[401 Unauthorized]
    C --> E[Generate Refresh Token<br/>7 day expiry]
    E --> F[Store refresh token hash in DB]
    F --> G[Return both tokens]

    style C fill:#0d9488,color:#fff
    style E fill:#0d9488,color:#fff
```

### Authorization Roles

| Role             | Scope  | Permissions                 |
| ---------------- | ------ | --------------------------- |
| `platform_admin` | Global | Full platform access        |
| `store_owner`    | Store  | Full store access           |
| `store_manager`  | Store  | Orders, products, customers |
| `store_staff`    | Store  | Orders only                 |
| `customer`       | Store  | Own orders, profile         |

### Data Isolation

```javascript
// Every database query includes tenant scope
const products = await Product.find({
  storeId: req.tenant.id, // Injected by middleware
  status: 'active',
});
```

---

## Scalability Considerations

### MVP (0-50 stores)

- Single server deployment
- Shared MongoDB instance
- Single Redis instance

### Growth (50-500 stores)

- Horizontal API scaling (2-3 instances)
- MongoDB replica set
- Redis cluster for sessions

### Scale (500+ stores)

- Kubernetes deployment
- Dedicated MongoDB for enterprise tenants
- CDN for static assets
- Read replicas for analytics queries

---

[Next: Tech Stack →](./tech-stack.md)
