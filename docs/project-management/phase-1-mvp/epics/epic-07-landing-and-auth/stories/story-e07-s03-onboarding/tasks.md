# E07-S03 Task Breakdown

## Execution Checklist

## T1. Onboarding route and layout

- [ ] Create onboarding page at `app/(onboarding)/onboarding/page.tsx`
- [ ] Create onboarding layout with minimal chrome (no dashboard sidebar)
- [ ] Add route protection - only authenticated users without a store can access
- [ ] Redirect users with existing store to `/dashboard`

## T2. Onboarding wizard component

- [ ] Create multi-step wizard container component
- [ ] Implement step navigation (next, back, skip)
- [ ] Add progress indicator (step 1 of 3, progress bar)
- [ ] Maintain form state across steps
- [ ] Handle browser back button gracefully

## T3. Step 1 - Store basics (required)

- [ ] Build store name input field
- [ ] Build subdomain input with `.baazarify.com` suffix display
- [ ] Add real-time subdomain availability check (debounced)
- [ ] Connect to `GET /api/v1/stores/check/:subdomain` endpoint
- [ ] Show availability status (available/taken) with visual feedback
- [ ] Validate: name required, subdomain format (lowercase, alphanumeric, hyphens)

## T4. Step 2 - Business info (optional)

- [ ] Build contact email input
- [ ] Build contact phone input
- [ ] Build business address textarea
- [ ] Add "Skip this step" button
- [ ] Validate email format if provided

## T5. Step 3 - Store appearance (optional)

- [ ] Build logo upload component (drag & drop or file picker)
- [ ] Preview uploaded logo
- [ ] Build primary color picker
- [ ] Build accent color picker
- [ ] Show live preview of color choices
- [ ] Add "Skip this step" button

## T6. Store creation and completion

- [ ] Collect all form data from steps
- [ ] Submit store creation to API (may need new endpoint or modify register)
- [ ] Handle store creation success
- [ ] Show success screen with store URL
- [ ] Add "Go to Dashboard" button
- [ ] Redirect to `/dashboard` after completion

## T7. Backend adjustments

- [ ] Modify registration to NOT create store automatically (or create placeholder)
- [ ] Add `POST /api/v1/stores` endpoint for creating store during onboarding
- [ ] Or add `POST /api/v1/onboarding/complete` endpoint
- [ ] Add `onboardingCompleted` flag to user model (or check for store existence)
- [ ] Update `GET /api/v1/auth/me` to include onboarding status

## T8. Edge cases and UX

- [ ] Handle page refresh mid-onboarding (persist form state in localStorage)
- [ ] Handle subdomain already taken after initial check (race condition)
- [ ] Add loading states during API calls
- [ ] Add error handling with retry options
- [ ] Mobile responsive design for all steps
