# E07-S03 Acceptance Criteria

## Access Control

- [ ] Only authenticated users can access `/onboarding`
- [ ] Unauthenticated users are redirected to `/login`
- [ ] Users who already have a store are redirected to `/dashboard`
- [ ] New registrations automatically land on `/onboarding`

## Step 1 - Store Basics

- [ ] Store name field is required
- [ ] Subdomain field is required
- [ ] Subdomain shows `.baazarify.com` suffix
- [ ] Subdomain availability is checked in real-time (debounced)
- [ ] Available subdomain shows green checkmark
- [ ] Taken subdomain shows red X with "already taken" message
- [ ] Subdomain validation: lowercase, alphanumeric, hyphens only, 3-30 chars
- [ ] Cannot proceed to next step without valid store name and available subdomain

## Step 2 - Business Info (Optional)

- [ ] Contact email field accepts valid email format
- [ ] Contact phone field accepts any text
- [ ] Business address is a textarea
- [ ] "Skip" button allows proceeding without filling fields
- [ ] Filled values are preserved if user goes back

## Step 3 - Store Appearance (Optional)

- [ ] Logo upload accepts image files (jpg, png, svg)
- [ ] Uploaded logo shows preview
- [ ] Primary color picker allows selecting a color
- [ ] Accent color picker allows selecting a color
- [ ] Color changes show live preview
- [ ] "Skip" button allows proceeding with default colors
- [ ] Default colors: primary #2563eb, accent #f59e0b

## Wizard Navigation

- [ ] Progress indicator shows current step (e.g., "Step 2 of 3")
- [ ] "Next" button advances to next step
- [ ] "Back" button returns to previous step
- [ ] "Skip" button on optional steps advances without saving
- [ ] Browser back button works correctly
- [ ] Form state persists across step navigation

## Store Creation

- [ ] Clicking "Launch Store" on final step creates the store
- [ ] Store is created with all provided information
- [ ] Success screen shows congratulations message
- [ ] Success screen displays store URL (subdomain.baazarify.com)
- [ ] "Go to Dashboard" button redirects to `/dashboard`

## Error Handling

- [ ] Network errors show retry option
- [ ] Subdomain taken at submit time shows error (race condition)
- [ ] Validation errors are displayed inline
- [ ] Loading states shown during API calls

## Persistence

- [ ] Form data persists across page refresh (localStorage)
- [ ] Completing onboarding clears persisted data
- [ ] Abandoning onboarding preserves data for return

## UI/UX

- [ ] Clean, focused design without dashboard navigation
- [ ] Responsive on mobile, tablet, desktop
- [ ] Clear visual hierarchy for each step
- [ ] Baazarify branding present

## Backend

- [ ] User can create store via API after registration
- [ ] `GET /auth/me` indicates whether user needs onboarding
- [ ] Store creation validates subdomain uniqueness

## Verification Notes

- Test full flow: Register → Onboarding → Dashboard
- Test skipping optional steps
- Test subdomain availability check timing
- Test page refresh during onboarding
- Test with existing user who already has store
- Verify store is accessible at subdomain after creation
