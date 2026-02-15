# Rollback Plan

## When to Rollback

Trigger a rollback if any of these occur within the first 48 hours:

- API error rate exceeds 5% of requests
- Payment processing failures affecting multiple merchants
- Data corruption or loss detected
- Health endpoint returns non-200 for > 5 minutes
- Critical security vulnerability discovered

## Rollback Procedures

### API (Railway)

1. Open Railway dashboard
2. Navigate to the API service
3. Click **Deployments** and find the last known good deployment
4. Click **Redeploy** on that deployment
5. Verify /health returns "ok" after rollback

**Alternative via CLI:**

```bash
# Railway CLI rollback to previous deployment
railway service rollback
```

### Frontend Apps (Vercel)

1. Open Vercel dashboard for the affected project
2. Go to **Deployments**
3. Find the previous stable deployment
4. Click **...** > **Promote to Production**

Repeat for each affected app (dashboard, storefront, admin).

### Database

Database rollback is more complex and should be a last resort:

1. **Do NOT drop collections** — data loss is irreversible
2. If schema migrations were applied, run compensating scripts
3. If data corruption occurred, restore from the most recent MongoDB Atlas backup
4. Verify data integrity after restore

### DNS / Infrastructure

If DNS changes were made during launch:

1. Revert DNS records to previous values
2. Allow TTL to expire (typically 5-15 minutes)
3. Verify resolution with `dig` or `nslookup`

## Post-Rollback

1. Notify the team via the ops channel
2. Communicate status to affected merchants
3. Investigate root cause before re-attempting deployment
4. Create an incident report documenting the issue and resolution
5. Update launch checklist with any new pre-flight checks
