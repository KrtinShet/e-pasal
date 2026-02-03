# E01-S02 Task Breakdown

## Execution Checklist

## T1. User model and security

- [ ] Create users schema with unique email index
- [ ] Add password hashing and complexity validation
- [ ] Store refresh-token metadata for rotation

## T2. Auth endpoint implementation

- [ ] Implement POST /auth/register and POST /auth/login
- [ ] Implement POST /auth/refresh and GET /auth/me
- [ ] Define token expiry and revocation behavior

## T3. Middleware and test coverage

- [ ] Add bearer token auth middleware
- [ ] Add integration tests for success and rejection paths
- [ ] Apply basic login rate limiting
