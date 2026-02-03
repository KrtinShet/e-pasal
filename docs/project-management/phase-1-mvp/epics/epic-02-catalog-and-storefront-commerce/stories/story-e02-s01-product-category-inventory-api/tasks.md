# E02-S01 Task Breakdown

## Execution Checklist

## T1. Catalog data model

- [x] Create products schema with SKU, price, category, and stock fields
- [x] Create categories schema with tenant-specific uniqueness
- [x] Define inventory mutation rules for stock updates

## T2. Catalog APIs

- [x] Implement CRUD endpoints for products with pagination/filtering
- [x] Implement CRUD endpoints for categories
- [x] Enforce tenant-level authorization across routes

## T3. Media and stock handling

- [x] Implement product image upload endpoint to S3-compatible storage
- [x] Store image metadata and URL references on products
- [x] Add tests for stock updates and tenant isolation
