# E07-S02 - Merchant Auth Pages

## Overview

- Epic: [E07 - Landing Page and Merchant Auth](../../README.md)
- Sprint: Sprint 3
- Planned window: Week 5 Day 1-2
- Status: Pending

## Goal

Build authentication pages in the dashboard app for merchant login, registration, and password recovery. Integrate end-to-end with existing API auth endpoints. After successful authentication, new users are routed to onboarding (E07-S03), returning users go directly to dashboard.

## Deliverables

- Login page with email/password authentication
- Registration page with merchant signup form (email, password, name)
- Forgot password page with email submission
- Password reset page (token-based)
- Auth context/provider for managing session state
- Protected route middleware (redirect to login if not authenticated)
- Token storage (localStorage) with automatic refresh
- Logout functionality
- API endpoints for forgot/reset password (backend)

## Dependencies

- E01-S02 (Auth API - already completed)
- E07-S01 (Landing Page - for navigation context)

## Detail Files

- [Task Breakdown](./tasks.md)
- [Acceptance Criteria](./acceptance.md)
