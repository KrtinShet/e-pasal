# Stores API

[← Back to Auth](./auth.md) | [Next: Products API →](./products.md)

---

## Overview

Store management endpoints for merchants to configure their online store.

---

## Endpoints

### Get Current Store

```http
GET /v1/stores/me
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "store_456",
    "name": "Ram's Fashion",
    "slug": "rams-fashion",
    "subdomain": "rams-fashion",
    "customDomain": null,
    "url": "https://rams-fashion.baazarify.com",
    "plan": "premium",
    "status": "active",
    "settings": {
      "currency": "NPR",
      "timezone": "Asia/Kathmandu",
      "language": "en",
      "logo": "https://cdn.baazarify.com/stores/456/logo.png",
      "favicon": "https://cdn.baazarify.com/stores/456/favicon.ico",
      "contactEmail": "info@ramsfashion.com",
      "contactPhone": "+977-9801234567",
      "address": {
        "street": "New Road",
        "city": "Kathmandu",
        "state": "Bagmati",
        "country": "Nepal"
      },
      "socialLinks": {
        "facebook": "https://facebook.com/ramsfashion",
        "instagram": "https://instagram.com/ramsfashion",
        "tiktok": null
      }
    },
    "theme": {
      "templateId": "modern-minimal",
      "colors": {
        "primary": "#0d9488",
        "secondary": "#115e59",
        "accent": "#14b8a6",
        "background": "#ffffff",
        "text": "#1f2937"
      },
      "fonts": {
        "heading": "Inter",
        "body": "Inter"
      }
    },
    "limits": {
      "products": 2500,
      "orders": 50000,
      "staff": 25
    },
    "stats": {
      "totalProducts": 145,
      "totalOrders": 1250,
      "totalRevenue": 2500000
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Update Store

```http
PUT /v1/stores/me
Authorization: Bearer <token>
```

**Request:**

```json
{
  "name": "Ram's Fashion House",
  "settings": {
    "contactEmail": "contact@ramsfashion.com",
    "contactPhone": "+977-9801234568"
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "store_456",
    "name": "Ram's Fashion House",
    "settings": {
      "contactEmail": "contact@ramsfashion.com",
      "contactPhone": "+977-9801234568"
      // ... other settings unchanged
    }
    // ... rest of store
  }
}
```

---

### Update Theme

```http
PUT /v1/stores/me/theme
Authorization: Bearer <token>
```

**Request:**

```json
{
  "templateId": "elegant-dark",
  "colors": {
    "primary": "#8b5cf6",
    "secondary": "#7c3aed",
    "accent": "#a78bfa",
    "background": "#0f0f0f",
    "text": "#f9fafb"
  },
  "fonts": {
    "heading": "Playfair Display",
    "body": "Lato"
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "theme": {
      "templateId": "elegant-dark",
      "colors": {
        "primary": "#8b5cf6",
        "secondary": "#7c3aed",
        "accent": "#a78bfa",
        "background": "#0f0f0f",
        "text": "#f9fafb"
      },
      "fonts": {
        "heading": "Playfair Display",
        "body": "Lato"
      }
    }
  }
}
```

---

### Upload Logo

```http
POST /v1/stores/me/logo
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**

```
file: <binary image data>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "logo": "https://cdn.baazarify.com/stores/456/logo-v2.png"
  }
}
```

**Constraints:**

- Max file size: 2MB
- Formats: PNG, JPG, SVG
- Recommended: 200x80px

---

### Configure Custom Domain

```http
POST /v1/stores/me/domain
Authorization: Bearer <token>
```

**Request:**

```json
{
  "domain": "shop.ramsfashion.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "domain": "shop.ramsfashion.com",
    "status": "pending_verification",
    "verification": {
      "type": "CNAME",
      "host": "shop",
      "value": "rams-fashion.baazarify.com",
      "instructions": "Add this CNAME record to your DNS settings"
    }
  }
}
```

**Errors:**

| Code | Reason                               |
| ---- | ------------------------------------ |
| 403  | Custom domains require Premium+ plan |
| 409  | Domain already in use                |

---

### Verify Domain

```http
POST /v1/stores/me/domain/verify
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "domain": "shop.ramsfashion.com",
    "status": "active",
    "sslStatus": "provisioning"
  }
}
```

**Response (422) - Verification Failed:**

```json
{
  "success": false,
  "error": {
    "code": "DOMAIN_VERIFICATION_FAILED",
    "message": "DNS record not found. Please ensure CNAME is configured correctly."
  }
}
```

---

### Get Dashboard Stats

```http
GET /v1/stores/me/stats?period=30d
Authorization: Bearer <token>
```

**Query Parameters:**

| Param  | Type   | Options                   |
| ------ | ------ | ------------------------- |
| period | string | `7d`, `30d`, `90d`, `12m` |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "period": "30d",
    "summary": {
      "totalOrders": 156,
      "totalRevenue": 425000,
      "averageOrderValue": 2724,
      "conversionRate": 3.2
    },
    "comparison": {
      "orders": { "value": 156, "change": 12.5 },
      "revenue": { "value": 425000, "change": 18.2 },
      "aov": { "value": 2724, "change": 5.1 }
    },
    "charts": {
      "revenue": [
        { "date": "2024-01-01", "value": 15000 },
        { "date": "2024-01-02", "value": 18000 }
        // ... daily values
      ],
      "orders": [
        { "date": "2024-01-01", "value": 5 },
        { "date": "2024-01-02", "value": 7 }
      ]
    },
    "topProducts": [
      { "id": "prod_1", "name": "Blue Denim Jacket", "orders": 25, "revenue": 62500 },
      { "id": "prod_2", "name": "Cotton T-Shirt", "orders": 40, "revenue": 32000 }
    ],
    "ordersBySource": {
      "website": 80,
      "whatsapp": 45,
      "instagram": 25,
      "manual": 6
    },
    "ordersByStatus": {
      "pending": 12,
      "confirmed": 8,
      "processing": 5,
      "shipped": 20,
      "delivered": 105,
      "cancelled": 6
    }
  }
}
```

---

### Get Staff Members

```http
GET /v1/stores/me/staff
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "user_789",
      "email": "sita@ramsfashion.com",
      "firstName": "Sita",
      "lastName": "Thapa",
      "role": "staff",
      "permissions": ["orders.read", "orders.write", "customers.read"],
      "lastLoginAt": "2024-01-30T14:25:00Z",
      "createdAt": "2024-01-10T09:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "limit": 25
  }
}
```

---

### Invite Staff Member

```http
POST /v1/stores/me/staff
Authorization: Bearer <token>
```

**Request:**

```json
{
  "email": "hari@ramsfashion.com",
  "firstName": "Hari",
  "lastName": "Prasad",
  "permissions": ["orders.read", "orders.write"]
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "user_790",
    "email": "hari@ramsfashion.com",
    "firstName": "Hari",
    "lastName": "Prasad",
    "role": "staff",
    "permissions": ["orders.read", "orders.write"],
    "status": "pending_invitation"
  }
}
```

---

### Update Staff Permissions

```http
PUT /v1/stores/me/staff/:userId
Authorization: Bearer <token>
```

**Request:**

```json
{
  "permissions": ["orders.*", "customers.read", "products.read"]
}
```

---

### Remove Staff Member

```http
DELETE /v1/stores/me/staff/:userId
Authorization: Bearer <token>
```

**Response (204):** No content

---

## Available Permissions

| Permission        | Description            |
| ----------------- | ---------------------- |
| `orders.read`     | View orders            |
| `orders.write`    | Create/update orders   |
| `orders.delete`   | Cancel/delete orders   |
| `products.read`   | View products          |
| `products.write`  | Create/update products |
| `products.delete` | Delete products        |
| `customers.read`  | View customers         |
| `customers.write` | Update customers       |
| `inventory.read`  | View inventory         |
| `inventory.write` | Update stock           |
| `analytics.read`  | View reports           |
| `settings.read`   | View settings          |
| `settings.write`  | Update settings        |

Use `*` for full access or `resource.*` for all actions on a resource.

---

[Next: Products API →](./products.md)
