# Tenant Resolution Local Development Notes

## Host Mapping

Use hostnames with at least three segments so the middleware can extract subdomains.

- API base example: `http://localhost:4000`
- Tenant request example: `http://demo.localtest.me:4000`
- Extracted tenant subdomain: `demo`

`localtest.me` resolves to `127.0.0.1`, which makes subdomain testing straightforward on local machines.

## Expected Behavior

- Missing subdomain on host (`localhost:4000`) skips tenant resolution.
- Unknown subdomain returns `TENANT_NOT_FOUND`.
- Inactive subdomain returns `TENANT_INACTIVE`.
- Active subdomain populates `req.storeId` and `req.store`.
