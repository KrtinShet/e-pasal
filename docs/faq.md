# Frequently Asked Questions

## Account & Setup

**How do I create a store?**
Register at the dashboard, then follow the onboarding wizard to set up your store name, subdomain, and branding.

**Can I change my subdomain later?**
Subdomains are set during onboarding and cannot be changed after creation. Choose carefully.

**What browsers are supported?**
Chrome, Firefox, Safari, and Edge (latest versions). The storefront is mobile-responsive.

## Products

**How many products can I add?**
There is no hard limit on the number of products per store.

**What image formats are supported?**
JPG, PNG, and WebP. Images are automatically optimized for web display.

**Can I import products in bulk?**
Bulk import is not yet available. Products must be added individually through the dashboard.

## Orders

**How do I get notified of new orders?**
Email notifications are sent for new orders. Configure notification preferences in Settings.

**Can customers track their orders?**
Yes, once you add tracking information to an order, customers can view the status on the storefront.

**How do I handle returns?**
Update the order status to reflect the return and add notes for internal tracking. Refunds are processed through the original payment provider.

## Payments

**Which payment methods are available?**
eSewa, Khalti, Fonepay QR, and Cash on Delivery are currently supported.

**How do I get eSewa/Khalti merchant credentials?**
Register as a merchant on the respective provider's website. Once approved, enter your credentials in Settings > Payments.

**When do I receive payouts?**
Payouts are handled directly by the payment provider based on their settlement schedule.

## Storefront

**Can I use a custom domain?**
Custom domain support is planned for a future release. Currently, stores are accessible via their subdomain.

**How does the AI page generator work?**
The AI generator creates landing page content based on your store info and category. You can edit the generated content before publishing.

## Technical

**Is there an API?**
Yes, the REST API is documented at `/api/docs` with interactive Swagger UI.

**What happens if the site goes down?**
Health monitoring is in place. The platform automatically restarts services on failure and the team is alerted for critical issues.

**How is my data secured?**
All connections use HTTPS. Passwords are hashed with bcrypt. JWT tokens expire after 15 minutes. Sensitive data is redacted from logs.
