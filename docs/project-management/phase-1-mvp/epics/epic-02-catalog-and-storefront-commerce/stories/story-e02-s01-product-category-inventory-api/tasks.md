# E02-S01 Task Breakdown

## Execution Checklist

## T1. Catalog data model

- [ ] Create products schema with SKU, price, category, and stock fields
- [ ] Create categories schema with tenant-specific uniqueness
- [ ] Define inventory mutation rules for stock updates

## T2. Catalog APIs

- [ ] Implement CRUD endpoints for products with pagination/filtering
- [ ] Implement CRUD endpoints for categories
- [ ] Enforce tenant-level authorization across routes

## T3. Media and stock handling

- [ ] Implement product image upload endpoint to S3-compatible storage
- [ ] Store image metadata and URL references on products
- [ ] Add tests for stock updates and tenant isolation
