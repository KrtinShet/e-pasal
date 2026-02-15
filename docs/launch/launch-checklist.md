# Launch Checklist

## Pre-Launch (T-7 days)

### Infrastructure

- [ ] Railway API service provisioned with production config
- [ ] Vercel projects configured for dashboard, storefront, admin
- [ ] MongoDB Atlas production cluster provisioned
- [ ] Redis production instance provisioned
- [ ] DNS configured for api.baazarify.com, dashboard.baazarify.com, admin.baazarify.com
- [ ] Wildcard DNS for \*.baazarify.com (tenant storefronts)
- [ ] TLS certificates active on all domains

### Configuration

- [ ] All production environment variables set in Railway
- [ ] All Vercel environment variables set per project
- [ ] JWT_SECRET is unique, random, 64+ chars
- [ ] Payment provider credentials switched to production keys
- [ ] SMTP configured for transactional emails
- [ ] SENTRY_DSN configured for error tracking
- [ ] LOG_LEVEL set to "info" for production

### Security

- [ ] Security checklist completed (see security-checklist.md)
- [ ] `pnpm audit` shows no critical vulnerabilities
- [ ] CORS origins set to production domains only
- [ ] Rate limiting thresholds reviewed

## Pre-Launch (T-1 day)

### Testing

- [ ] Performance testing completed (see performance-testing.md)
- [ ] All CI checks passing on main branch
- [ ] End-to-end merchant flow tested: register → onboard → add product → receive order
- [ ] Payment flow tested with each provider in sandbox mode
- [ ] Storefront renders correctly for test tenant

### Monitoring

- [ ] Health check endpoint responding: GET /health
- [ ] Readiness endpoint responding: GET /ready
- [ ] Sentry capturing test errors
- [ ] Structured logs visible in Railway logs

## Launch Day (T-0)

### Deployment

- [ ] Merge release branch to main
- [ ] Verify CI pipeline passes
- [ ] Confirm Railway auto-deploys API
- [ ] Confirm Vercel deploys all frontend apps
- [ ] Verify /health returns status: "ok"
- [ ] Verify /ready returns status: "ready"

### Smoke Tests

- [ ] Dashboard login works
- [ ] Product CRUD operations work
- [ ] Storefront loads for test tenant
- [ ] Order creation works end-to-end
- [ ] Payment initiation redirects correctly
- [ ] API docs accessible at /api/docs

### Communication

- [ ] Launch announcement sent to beta merchants
- [ ] Support channels active and monitored
- [ ] Incident response team on standby

## Post-Launch (T+1 to T+7)

- [ ] Monitor error rates in Sentry
- [ ] Review API response times and latency
- [ ] Check database performance metrics
- [ ] Address any reported merchant issues
- [ ] Publish 48-hour launch report
