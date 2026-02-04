# E07-S02 Acceptance Criteria

## Registration Flow

- [ ] User can access `/register` from landing page CTA
- [ ] Registration form collects: name, email, password, confirm password
- [ ] Client-side validation shows errors for invalid input
- [ ] Submitting valid form calls `POST /api/v1/auth/register`
- [ ] Successful registration stores tokens and redirects to `/onboarding`
- [ ] Duplicate email shows appropriate error message
- [ ] Link to login page works

## Login Flow

- [ ] User can access `/login` from landing page or registration page
- [ ] Login form collects: email, password
- [ ] Client-side validation shows errors for empty/invalid fields
- [ ] Submitting valid form calls `POST /api/v1/auth/login`
- [ ] Successful login stores tokens in localStorage
- [ ] New users (no store setup) redirect to `/onboarding`
- [ ] Returning users redirect to `/dashboard`
- [ ] Invalid credentials show "Invalid email or password" error
- [ ] Link to registration and forgot password pages work

## Forgot Password Flow

- [ ] User can access `/forgot-password` from login page
- [ ] Form accepts email address
- [ ] Submitting form calls `POST /api/v1/auth/forgot-password`
- [ ] Success message displayed: "Check your email for reset instructions"
- [ ] API sends password reset email (or logs link in dev mode)

## Password Reset Flow

- [ ] Reset link from email leads to `/reset-password/[token]`
- [ ] Page validates token on load (shows error if invalid/expired)
- [ ] Form accepts new password and confirm password
- [ ] Passwords must match and meet minimum requirements
- [ ] Submitting form calls `POST /api/v1/auth/reset-password`
- [ ] Success redirects to `/login` with success message
- [ ] Token is invalidated after use

## Session Management

- [ ] Auth state persists across page refreshes
- [ ] Tokens are stored in localStorage
- [ ] API requests include Authorization header automatically
- [ ] 401 responses redirect to `/login`
- [ ] Logout clears tokens and redirects to `/` (landing page)
- [ ] Token refresh happens automatically before expiry

## Protected Routes

- [ ] Unauthenticated users accessing `/dashboard/*` redirect to `/login`
- [ ] After login, user returns to originally requested page
- [ ] Auth pages (`/login`, `/register`) redirect to dashboard if already logged in

## UI/UX

- [ ] All auth pages are responsive (mobile, tablet, desktop)
- [ ] Loading states shown during form submissions
- [ ] Error messages are clear and helpful
- [ ] Baazarify branding present on auth pages
- [ ] Consistent styling with design system

## Backend Endpoints

- [ ] `POST /auth/forgot-password` accepts email and sends reset link
- [ ] `POST /auth/reset-password` accepts token and new password
- [ ] `POST /auth/logout` invalidates refresh token (optional)

## Verification Notes

- Test full flow: Register → Onboarding → Logout → Login → Dashboard
- Test invalid credentials handling
- Test forgot/reset password flow end-to-end
- Test protected route access without auth
- Test token refresh (set short expiry in dev)
- Verify responsive design on mobile devices
