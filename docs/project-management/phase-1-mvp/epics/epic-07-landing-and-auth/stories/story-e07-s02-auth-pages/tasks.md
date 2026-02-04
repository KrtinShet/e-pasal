# E07-S02 Task Breakdown

## Execution Checklist

## T1. Auth infrastructure (Frontend)

- [ ] Create AuthContext with user state, loading, and error handling
- [ ] Create AuthProvider wrapping the app with login/logout/register methods
- [ ] Implement token storage in localStorage (`baazarify_token`, `baazarify_refresh_token`)
- [ ] Add API client interceptor to attach auth headers automatically
- [ ] Implement automatic token refresh before expiry
- [ ] Create `useAuth` hook for consuming auth context
- [ ] Create protected route middleware (Next.js middleware or wrapper component)
- [ ] Handle 401 responses with automatic redirect to login

## T2. Login page (`/login`)

- [ ] Create login page at `app/(auth)/login/page.tsx`
- [ ] Build login form with email and password fields
- [ ] Add client-side validation (email format, password required)
- [ ] Connect to `POST /api/v1/auth/login` endpoint
- [ ] Store tokens on successful login
- [ ] Check if user needs onboarding (new user) → redirect to `/onboarding`
- [ ] Existing users → redirect to `/dashboard`
- [ ] Display error messages for invalid credentials
- [ ] Add "Remember me" option (optional)
- [ ] Link to registration and forgot password pages

## T3. Registration page (`/register`)

- [ ] Create registration page at `app/(auth)/register/page.tsx`
- [ ] Build registration form (name, email, password, confirm password)
- [ ] Add client-side validation (email format, password min 8 chars, passwords match)
- [ ] Connect to `POST /api/v1/auth/register` endpoint
- [ ] Note: Store creation moved to onboarding - register only creates user account
- [ ] Store tokens on successful registration
- [ ] Redirect to `/onboarding` after successful registration
- [ ] Handle errors (email already exists, validation errors)
- [ ] Link to login page

## T4. Forgot password page (`/forgot-password`)

- [ ] Create forgot password page at `app/(auth)/forgot-password/page.tsx`
- [ ] Build form with email input
- [ ] Connect to `POST /api/v1/auth/forgot-password` endpoint
- [ ] Show success message after submission (check your email)
- [ ] Handle errors (email not found - or show generic message for security)

## T5. Password reset page (`/reset-password/[token]`)

- [ ] Create password reset page at `app/(auth)/reset-password/[token]/page.tsx`
- [ ] Build form with new password and confirm password fields
- [ ] Validate token on page load
- [ ] Connect to `POST /api/v1/auth/reset-password` endpoint
- [ ] Show success message and redirect to login
- [ ] Handle errors (invalid/expired token)

## T6. Backend - Forgot/Reset password endpoints

- [ ] Add `POST /auth/forgot-password` endpoint
- [ ] Generate password reset token (JWT or random string with expiry)
- [ ] Store reset token hash in user record (or separate collection)
- [ ] Send reset email with link (or log to console for dev)
- [ ] Add `POST /auth/reset-password` endpoint
- [ ] Validate reset token
- [ ] Update password and invalidate token
- [ ] Add `POST /auth/logout` endpoint (optional - invalidate refresh token)

## T7. Session management

- [ ] Implement logout in auth context (clear tokens, reset state)
- [ ] Add logout button to dashboard header/nav
- [ ] Persist auth state across page refreshes (check token on mount)
- [ ] Add loading spinner during auth state initialization
- [ ] Handle token expiry gracefully (auto-refresh or redirect to login)

## T8. Auth layout and styling

- [ ] Create `(auth)` route group with shared auth layout
- [ ] Design clean, centered auth card layout
- [ ] Add Baazarify logo and branding to auth pages
- [ ] Ensure responsive design for mobile
- [ ] Add loading states to form submissions
