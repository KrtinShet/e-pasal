# Go-Live Runbook

## Overview

This runbook covers the step-by-step process for taking Baazarify to production.

## Prerequisites

- [ ] Launch checklist fully completed (see launch-checklist.md)
- [ ] Rollback plan reviewed by team (see rollback-plan.md)
- [ ] All team members aware of their roles during launch window

## Roles

| Role             | Responsibility                                    |
| ---------------- | ------------------------------------------------- |
| Deploy Lead      | Executes deployment steps, monitors CI/CD         |
| Backend On-Call  | Monitors API health, logs, error rates            |
| Frontend On-Call | Monitors Vercel deployments, storefront rendering |
| Support Lead     | Handles merchant communications, triages issues   |

## Launch Window

**Recommended:** Weekday, 10:00-12:00 NPT (low traffic period)

## Step-by-Step

### Phase 1: Final Checks (T-30 min)

1. Run `pnpm build` locally to verify no build errors
2. Verify all CI checks are green on the release branch
3. Confirm staging environment mirrors production config
4. Announce launch start in team channel

### Phase 2: Deploy API (T-0)

1. Merge release branch to `main`
2. Watch Railway dashboard for auto-deployment
3. Wait for deployment to complete (typically 2-5 minutes)
4. Verify endpoints:
   ```
   curl https://api.baazarify.com/health
   curl https://api.baazarify.com/ready
   curl https://api.baazarify.com/api/version
   ```
5. Confirm structured logs are flowing in Railway

### Phase 3: Deploy Frontends (T+5 min)

1. Verify Vercel auto-deploys triggered for dashboard, storefront, admin
2. Wait for all three builds to complete
3. Verify each app loads:
   - https://dashboard.baazarify.com
   - https://admin.baazarify.com
   - https://{test-store}.baazarify.com

### Phase 4: Smoke Tests (T+15 min)

1. Register a new test merchant account
2. Complete onboarding wizard
3. Add a test product with images
4. Visit the test storefront and verify product displays
5. Place a test order
6. Verify order appears in dashboard
7. Test payment flow with sandbox credentials
8. Check API docs at /api/docs

### Phase 5: Monitor (T+15 min to T+120 min)

1. Watch Sentry for new errors
2. Monitor Railway logs for unusual patterns
3. Check API response times via /health uptime field
4. Verify Redis and MongoDB connections stable via /ready

### Phase 6: Announce (T+120 min)

1. If no critical issues found, declare launch successful
2. Send launch announcement to beta merchants
3. Post in team channel with launch status

## Incident Response

If issues arise during launch:

1. **Severity 1** (site down, data loss): Trigger rollback immediately
2. **Severity 2** (degraded, single feature broken): Investigate, fix forward if < 30 min, otherwise rollback
3. **Severity 3** (cosmetic, minor): Log issue, fix in follow-up deployment

## Post-Launch Report Template

After 48 hours, publish a report covering:

- Deployment timeline and any deviations
- Error rates and performance metrics
- Merchant feedback summary
- Issues encountered and resolutions
- Action items for the next sprint
