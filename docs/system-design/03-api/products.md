# Products API

[← Back to Stores](./stores.md) | [Next: Orders API →](./orders.md)

---

## Overview

Product management endpoints for creating, updating, and organizing products.

---

## Endpoints

### List Products

```http
GET /v1/products
Authorization: Bearer <token>
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 100) |
| status | string | Filter by status: `draft`, `active`, `archived` |
| category | string | Filter by category ID |
| search | string | Search in name, description |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| sort | string | Sort field (default: `-createdAt`) |

**Example:**

```http
GET /v1/products?status=active&category=cat_123&sort=-price&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "prod_001",
      "name": "Blue Denim Jacket",
      "slug": "blue-denim-jacket",
      "price": 2500,
      "compareAtPrice": 3000,
      "images": [
        {
          "url": "https://cdn.baazarify.com/products/001/main.jpg",
          "alt": "Blue Denim Jacket Front",
          "position": 0
        }
      ],
      "status": "active",
      "stock": 25,
      "hasVariants": false,
      "categories": ["cat_123"],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 145,
    "totalPages": 15
  }
}
```

---

### Get Product

```http
GET /v1/products/:id
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "prod_001",
    "name": "Blue Denim Jacket",
    "slug": "blue-denim-jacket",
    "description": "Classic blue denim jacket with button closure...",
    "shortDescription": "Classic denim jacket for everyday wear",
    "price": 2500,
    "compareAtPrice": 3000,
    "costPrice": 1500,
    "images": [
      {
        "id": "img_001",
        "url": "https://cdn.baazarify.com/products/001/main.jpg",
        "alt": "Blue Denim Jacket Front",
        "position": 0
      },
      {
        "id": "img_002",
        "url": "https://cdn.baazarify.com/products/001/back.jpg",
        "alt": "Blue Denim Jacket Back",
        "position": 1
      }
    ],
    "hasVariants": true,
    "variants": [
      {
        "id": "var_001",
        "name": "Small",
        "sku": "BDJ-S",
        "price": null,
        "stock": 10,
        "attributes": [
          { "name": "Size", "value": "S" }
        ]
      },
      {
        "id": "var_002",
        "name": "Medium",
        "sku": "BDJ-M",
        "price": null,
        "stock": 15,
        "attributes": [
          { "name": "Size", "value": "M" }
        ]
      }
    ],
    "categories": [
      {
        "id": "cat_123",
        "name": "Jackets",
        "slug": "jackets"
      }
    ],
    "tags": ["denim", "jacket", "casual"],
    "seo": {
      "title": "Blue Denim Jacket | Ram's Fashion",
      "description": "Shop our classic blue denim jacket...",
      "keywords": ["denim jacket", "blue jacket"]
    },
    "status": "active",
    "visibility": "visible",
    "trackInventory": true,
    "allowBackorder": false,
    "stats": {
      "views": 1250,
      "orders": 25,
      "revenue": 62500
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-28T14:20:00Z"
  }
}
```

---

### Create Product

```http
POST /v1/products
Authorization: Bearer <token>
```

**Request (Simple Product):**

```json
{
  "name": "Cotton T-Shirt",
  "description": "Comfortable cotton t-shirt for everyday wear",
  "price": 800,
  "compareAtPrice": 1000,
  "costPrice": 400,
  "sku": "CTS-WHT-M",
  "stock": 50,
  "categories": ["cat_456"],
  "tags": ["t-shirt", "cotton", "casual"],
  "status": "active"
}
```

**Request (Product with Variants):**

```json
{
  "name": "Cotton T-Shirt",
  "description": "Comfortable cotton t-shirt",
  "price": 800,
  "hasVariants": true,
  "variants": [
    {
      "name": "White / S",
      "sku": "CTS-WHT-S",
      "stock": 20,
      "attributes": [
        { "name": "Color", "value": "White" },
        { "name": "Size", "value": "S" }
      ]
    },
    {
      "name": "White / M",
      "sku": "CTS-WHT-M",
      "stock": 25,
      "attributes": [
        { "name": "Color", "value": "White" },
        { "name": "Size", "value": "M" }
      ]
    },
    {
      "name": "Black / S",
      "sku": "CTS-BLK-S",
      "price": 850,
      "stock": 15,
      "attributes": [
        { "name": "Color", "value": "Black" },
        { "name": "Size", "value": "S" }
      ]
    }
  ],
  "categories": ["cat_456"],
  "status": "draft"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "prod_002",
    "name": "Cotton T-Shirt",
    "slug": "cotton-t-shirt",
    // ... full product object
  }
}
```

**Errors:**

| Code | Reason |
|------|--------|
| 400 | Validation error |
| 403 | Product limit reached |
| 409 | SKU already exists |

---

### Update Product

```http
PUT /v1/products/:id
Authorization: Bearer <token>
```

**Request:**

```json
{
  "name": "Premium Cotton T-Shirt",
  "price": 900,
  "status": "active"
}
```

**Response (200):** Updated product object

---

### Delete Product

```http
DELETE /v1/products/:id
Authorization: Bearer <token>
```

**Response (204):** No content

**Note:** Deleting a product with orders will archive it instead.

---

### Upload Product Images

```http
POST /v1/products/:id/images
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**

```
files: <binary image data>  // Multiple files allowed
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "img_003",
        "url": "https://cdn.baazarify.com/products/002/img1.jpg",
        "alt": "",
        "position": 0
      },
      {
        "id": "img_004",
        "url": "https://cdn.baazarify.com/products/002/img2.jpg",
        "alt": "",
        "position": 1
      }
    ]
  }
}
```

**Constraints:**

- Max 10 images per product
- Max 5MB per image
- Formats: JPG, PNG, WebP

---

### Reorder Images

```http
PUT /v1/products/:id/images/reorder
Authorization: Bearer <token>
```

**Request:**

```json
{
  "order": ["img_004", "img_003", "img_001"]
}
```

---

### Delete Image

```http
DELETE /v1/products/:id/images/:imageId
Authorization: Bearer <token>
```

---

### Update Variant

```http
PUT /v1/products/:id/variants/:variantId
Authorization: Bearer <token>
```

**Request:**

```json
{
  "price": 900,
  "stock": 30,
  "sku": "CTS-WHT-M-V2"
}
```

---

### Bulk Update Stock

```http
POST /v1/products/bulk/stock
Authorization: Bearer <token>
```

**Request:**

```json
{
  "updates": [
    { "productId": "prod_001", "variantId": null, "stock": 50 },
    { "productId": "prod_002", "variantId": "var_001", "stock": 25 },
    { "productId": "prod_002", "variantId": "var_002", "stock": 30 }
  ]
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "updated": 3,
    "failed": 0
  }
}
```

---

### Bulk Update Status

```http
POST /v1/products/bulk/status
Authorization: Bearer <token>
```

**Request:**

```json
{
  "productIds": ["prod_001", "prod_002", "prod_003"],
  "status": "archived"
}
```

---

## Categories API

### List Categories

```http
GET /v1/categories
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "cat_001",
      "name": "Men's Clothing",
      "slug": "mens-clothing",
      "image": "https://cdn.baazarify.com/categories/mens.jpg",
      "parentId": null,
      "position": 0,
      "productCount": 45,
      "children": [
        {
          "id": "cat_002",
          "name": "T-Shirts",
          "slug": "t-shirts",
          "parentId": "cat_001",
          "position": 0,
          "productCount": 20
        },
        {
          "id": "cat_003",
          "name": "Jackets",
          "slug": "jackets",
          "parentId": "cat_001",
          "position": 1,
          "productCount": 15
        }
      ]
    }
  ]
}
```

---

### Create Category

```http
POST /v1/categories
Authorization: Bearer <token>
```

**Request:**

```json
{
  "name": "Women's Clothing",
  "description": "Fashion for women",
  "parentId": null,
  "position": 1
}
```

---

### Update Category

```http
PUT /v1/categories/:id
Authorization: Bearer <token>
```

---

### Delete Category

```http
DELETE /v1/categories/:id
Authorization: Bearer <token>
```

**Note:** Products in the category will be uncategorized, not deleted.

---

[Next: Orders API →](./orders.md)
