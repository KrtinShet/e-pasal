# E01-S02 Task Breakdown

## Execution Checklist

## T1. User model and security

- [x] Create users schema with unique email index
- [x] Add password hashing and complexity validation
- [x] Store refresh-token metadata for rotation

## T2. Auth endpoint implementation

- [x] Implement POST /auth/register and POST /auth/login
- [x] Implement POST /auth/refresh and GET /auth/me
- [x] Define token expiry and revocation behavior

## T3. Middleware and test coverage

- [x] Add bearer token auth middleware
- [x] Add integration tests for success and rejection paths
- [x] Apply basic login rate limiting
