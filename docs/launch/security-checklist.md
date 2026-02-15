# Security Audit Checklist

## Authentication & Authorization

- [ ] JWT secrets are unique per environment and >= 32 chars
- [ ] Access tokens expire in 15 minutes, refresh tokens in 7 days
- [ ] Refresh token rotation is enforced (old tokens invalidated)
- [ ] Password hashing uses bcrypt with adequate cost factor
- [ ] Rate limiting is active on auth endpoints
- [ ] Role-based access (merchant, staff, admin) is enforced on all protected routes

## Input Validation

- [ ] All request bodies validated with Zod schemas
- [ ] File uploads restricted by type and size (multer config)
- [ ] Query parameters sanitized before database queries
- [ ] No raw user input in MongoDB queries (injection prevention)

## Transport & Headers

- [ ] HTTPS enforced in production (Railway/Vercel TLS)
- [ ] Helmet middleware active (CSP, X-Frame-Options, HSTS, etc.)
- [ ] CORS restricted to known origins (dashboard, storefront, admin URLs)
- [ ] Sensitive headers not leaked in responses

## Data Protection

- [ ] Passwords never returned in API responses
- [ ] Sensitive fields redacted in logs (password, token, secret, apiKey)
- [ ] No secrets committed to git (check .env is in .gitignore)
- [ ] Environment variables validated on startup (env.ts)

## Payment Security

- [ ] Payment provider secrets stored as environment variables only
- [ ] Webhook signatures verified (eSewa, Khalti, Fonepay)
- [ ] Payment amounts validated server-side before confirmation
- [ ] No sensitive payment data stored in database

## Infrastructure

- [ ] Docker runs as non-root user in production
- [ ] Node.js 20 LTS with latest security patches
- [ ] Dependencies audited (`pnpm audit`)
- [ ] No unused or deprecated packages with known CVEs
