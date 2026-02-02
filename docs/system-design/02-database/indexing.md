# Indexing Strategy

[← Back to Schema](./schema.md) | [Next: Multi-Tenancy →](./multi-tenancy.md)

---

## Indexing Principles

### 1. Every Query Must Use an Index

```javascript
// Bad: Full collection scan
db.products.find({ name: /shirt/i })

// Good: Uses storeId index, then scans fewer docs
db.products.find({ storeId: ObjectId('...'), name: /shirt/i })
```

### 2. storeId First in Compound Indexes

All tenant data queries start with `storeId`. Always make it the first field in compound indexes.

```javascript
// Correct order
{ storeId: 1, status: 1, createdAt: -1 }

// Wrong order (storeId not first)
{ status: 1, storeId: 1, createdAt: -1 }
```

### 3. Index for Sort Operations

If you sort by a field, include it in the index:

```javascript
// Query: Get recent orders
db.orders.find({ storeId, status: 'pending' }).sort({ createdAt: -1 })

// Index must include createdAt
{ storeId: 1, status: 1, createdAt: -1 }
```

---

## Index Definitions

### users

```javascript
// Unique email for login
db.users.createIndex({ email: 1 }, { unique: true })

// Find staff by store
db.users.createIndex({ storeId: 1, role: 1 })
```

### stores

```javascript
// URL routing
db.stores.createIndex({ slug: 1 }, { unique: true })
db.stores.createIndex({ subdomain: 1 }, { unique: true })
db.stores.createIndex({ customDomain: 1 }, { unique: true, sparse: true })

// Admin queries
db.stores.createIndex({ ownerId: 1 })
db.stores.createIndex({ plan: 1, status: 1 })
db.stores.createIndex({ createdAt: -1 })
```

### products

```javascript
// Product page URL: /p/{slug}
db.products.createIndex(
  { storeId: 1, slug: 1 },
  { unique: true }
)

// Product listing with filters
db.products.createIndex({ storeId: 1, status: 1, createdAt: -1 })
db.products.createIndex({ storeId: 1, categories: 1, status: 1 })

// SKU lookup
db.products.createIndex({ storeId: 1, sku: 1 })
db.products.createIndex({ storeId: 1, 'variants.sku': 1 })

// Search (text index)
db.products.createIndex(
  { name: 'text', description: 'text', tags: 'text' },
  { weights: { name: 10, tags: 5, description: 1 } }
)
```

### categories

```javascript
db.categories.createIndex(
  { storeId: 1, slug: 1 },
  { unique: true }
)
db.categories.createIndex({ storeId: 1, parentId: 1, position: 1 })
```

### customers

```javascript
// Lookup by email/phone
db.customers.createIndex(
  { storeId: 1, email: 1 },
  { unique: true, sparse: true }
)
db.customers.createIndex({ storeId: 1, phone: 1 })

// Customer list
db.customers.createIndex({ storeId: 1, createdAt: -1 })
db.customers.createIndex({ storeId: 1, 'stats.totalSpent': -1 })
```

### orders

```javascript
// Order lookup
db.orders.createIndex(
  { storeId: 1, orderNumber: 1 },
  { unique: true }
)

// Order list with filters
db.orders.createIndex({ storeId: 1, status: 1, createdAt: -1 })
db.orders.createIndex({ storeId: 1, createdAt: -1 })

// Customer order history
db.orders.createIndex({ storeId: 1, customerId: 1, createdAt: -1 })

// Payment status queries
db.orders.createIndex({ storeId: 1, 'payment.status': 1 })

// Source filter
db.orders.createIndex({ storeId: 1, source: 1, createdAt: -1 })
```

### inventory

```javascript
// Unique per product/variant
db.inventory.createIndex(
  { storeId: 1, productId: 1, variantId: 1 },
  { unique: true }
)

// SKU lookup
db.inventory.createIndex({ storeId: 1, sku: 1 })

// Low stock alerts
db.inventory.createIndex({ storeId: 1, quantity: 1 })
```

### conversations

```javascript
// Unique conversation per channel
db.conversations.createIndex(
  { storeId: 1, channel: 1, externalId: 1 },
  { unique: true }
)

// Inbox view
db.conversations.createIndex({ storeId: 1, status: 1, lastMessageAt: -1 })

// Staff assignment
db.conversations.createIndex({ storeId: 1, assignedTo: 1, status: 1 })
```

---

## Index Size Estimation

| Collection | Indexes | Est. Size (500 stores) |
|------------|---------|------------------------|
| users | 2 | ~5 MB |
| stores | 5 | ~2 MB |
| products | 5 | ~50 MB |
| categories | 2 | ~5 MB |
| customers | 4 | ~30 MB |
| orders | 6 | ~100 MB |
| inventory | 3 | ~20 MB |
| conversations | 3 | ~30 MB |
| **Total** | | **~250 MB** |

---

## Query Patterns & Index Usage

### Pattern 1: Product Listing

```javascript
// Query
db.products.find({
  storeId: ObjectId('...'),
  status: 'active',
  categories: ObjectId('...')
}).sort({ createdAt: -1 }).limit(20)

// Uses index
{ storeId: 1, categories: 1, status: 1 }
// Note: createdAt sort happens in memory (acceptable for 20 docs)
```

### Pattern 2: Order Dashboard

```javascript
// Query
db.orders.find({
  storeId: ObjectId('...'),
  status: { $in: ['pending', 'confirmed', 'processing'] }
}).sort({ createdAt: -1 }).limit(50)

// Uses index
{ storeId: 1, status: 1, createdAt: -1 }
```

### Pattern 3: Customer Search

```javascript
// Query
db.customers.find({
  storeId: ObjectId('...'),
  $or: [
    { email: /search/i },
    { phone: /search/i },
    { firstName: /search/i }
  ]
}).limit(10)

// Uses index for storeId, then scans
// For better perf, use text index or external search (Algolia)
```

### Pattern 4: Low Stock Alert

```javascript
// Query
db.inventory.find({
  storeId: ObjectId('...'),
  quantity: { $lte: 5 },
  $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
}).sort({ quantity: 1 })

// Uses index
{ storeId: 1, quantity: 1 }
```

---

## Performance Monitoring

### Check Index Usage

```javascript
// Explain query
db.orders.find({ storeId, status: 'pending' })
  .sort({ createdAt: -1 })
  .explain('executionStats')

// Look for:
// - winningPlan.stage: 'IXSCAN' (good)
// - winningPlan.stage: 'COLLSCAN' (bad - full scan)
// - executionStats.totalDocsExamined vs totalKeysExamined
```

### Monitor Slow Queries

```javascript
// Enable profiling
db.setProfilingLevel(1, { slowms: 100 })

// Check slow queries
db.system.profile.find().sort({ ts: -1 }).limit(10)
```

### Index Stats

```javascript
// Check index usage
db.products.aggregate([
  { $indexStats: {} }
])

// Remove unused indexes (careful!)
db.products.dropIndex('unused_index_name')
```

---

## Anti-Patterns to Avoid

### 1. Missing storeId in Queries

```javascript
// NEVER do this - scans ALL products
db.products.find({ status: 'active' })

// ALWAYS include storeId
db.products.find({ storeId, status: 'active' })
```

### 2. Too Many Indexes

Each index slows down writes. Aim for:
- Max 6-8 indexes per collection
- Remove unused indexes quarterly

### 3. Indexing Low-Cardinality Fields Alone

```javascript
// Bad: status only has ~5 values
{ status: 1 }

// Good: combined with high-cardinality field
{ storeId: 1, status: 1 }
```

### 4. Regex on Non-Anchored Strings

```javascript
// Bad: Can't use index effectively
db.products.find({ name: /shirt/i })

// Better: Text index
db.products.find({ $text: { $search: 'shirt' } })

// Best: External search (Algolia, Elasticsearch)
```

---

[Next: Multi-Tenancy →](./multi-tenancy.md)
