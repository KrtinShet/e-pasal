# E06-S02 Acceptance Criteria

## AC1: All Components Implemented

- [ ] Button with all variants and sizes
- [ ] Input with label, error, icons
- [ ] Select with options
- [ ] Checkbox, Radio, Switch, Textarea
- [ ] Card with header/body/footer
- [ ] Badge with color variants
- [ ] Avatar with image and initials
- [ ] Table with all sub-components
- [ ] Modal with sizes
- [ ] Popover with positioning
- [ ] Dropdown with keyboard nav
- [ ] Toast notification system
- [ ] Skeleton, Spinner, Progress
- [ ] EmptyState, Alert
- [ ] Tabs, Breadcrumbs

## AC2: Theme Token Integration

- [ ] All components use CSS variables for colors
- [ ] Changing theme tokens updates component appearance
- [ ] No hardcoded color values in components

## AC3: Accessibility

- [ ] All interactive elements are keyboard accessible
- [ ] Proper ARIA attributes on form controls
- [ ] Focus states visible
- [ ] Modal traps focus correctly

## AC4: TypeScript Types

- [ ] All components have proper TypeScript props
- [ ] Props extend appropriate HTML element attributes
- [ ] Types are exported from package

## AC5: Documentation

- [ ] Each component has basic JSDoc comments
- [ ] Props are documented with descriptions

## Verification

```tsx
import { Button, Input, Card, CardHeader, CardBody, Badge, Modal, useToast } from '@baazarify/ui';

// All imports resolve correctly
// All components render without errors
// Theme changes affect all components
```
