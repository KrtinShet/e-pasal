# Merchant Quick Start Guide

## Getting Started with Baazarify

### 1. Create Your Account

1. Visit the dashboard at your Baazarify URL
2. Click **Register** and fill in your name, email, and password
3. Verify your email address

### 2. Set Up Your Store

After registration, the onboarding wizard guides you through:

1. **Store name** - Choose a name for your online store
2. **Subdomain** - Pick a unique subdomain (e.g., `mystore.baazarify.com`)
3. **Category** - Select your business category
4. **Logo and branding** - Upload your store logo

### 3. Add Products

Navigate to **Products** in the dashboard sidebar:

1. Click **Add Product**
2. Fill in product details: name, description, price, SKU
3. Upload product images
4. Set inventory quantities
5. Organize with categories

### 4. Configure Payments

Go to **Settings > Payments** to enable payment methods:

- **eSewa** - Nepal's popular digital wallet
- **Khalti** - Digital payment gateway
- **Fonepay** - QR-based payments
- **Cash on Delivery** - Manual payment tracking

Each provider requires merchant credentials from their respective platforms.

### 5. Customize Your Storefront

Under **Storefront**:

1. Choose a theme preset or customize colors, fonts, and spacing
2. Build your landing page using the drag-and-drop editor
3. Use AI generation to quickly create page content
4. Preview and publish your storefront

### 6. Manage Orders

When customers place orders:

1. View new orders in the **Orders** section
2. Update order status: Confirmed > Processing > Shipped > Delivered
3. Add tracking information and fulfillment details
4. Manage payment status and add internal notes

### 7. Track Performance

The **Dashboard** home shows:

- Revenue metrics and charts
- Order counts and trends
- Customer statistics
- Recent activity

## API Access

Your store's API is available at `https://api.baazarify.com/api/v1/`. Interactive API documentation is available at `/api/docs`.

All API requests require a Bearer token obtained via the `/auth/login` endpoint.
