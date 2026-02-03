# E06-S02 Tasks

## Reference Source

Minima MUI React Kit: `/Users/krtinshet/Development/Minima MUI React Kit/next-ts/src/components/`

---

## Task 1: Button Component

**Estimate**: 2 hours

**Reference**: Minima button patterns

**Files**:

- [x] `src/components/button/button.tsx`
- [x] `src/components/button/button.styles.ts` (variant classes)
- [x] `src/components/button/index.ts`

**Variants**: primary, secondary, outline, ghost, destructive
**Sizes**: sm, md, lg
**States**: loading (with spinner), disabled

**Props**:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean; // For use with links
}
```

---

## Task 2: Input Component

**Estimate**: 2 hours

**Reference**: Minima `/src/components/hook-form/rhf-text-field.tsx`

**Files**:

- [x] `src/components/input/input.tsx`
- [x] `src/components/input/index.ts`

**Features**: label, placeholder, helper text, error state, left/right icons, clearable

**Props**:

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}
```

---

## Task 3: Select Component

**Estimate**: 2 hours

**Reference**: Minima `/src/components/hook-form/rhf-select.tsx`

**Files**:

- [x] `src/components/select/select.tsx`
- [x] `src/components/select/index.ts`

**Features**: label, placeholder, error state, native select option

**Props**:

```typescript
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  options: Array<{ value: string; label: string }>;
  onChange?: (value: string) => void;
}
```

---

## Task 4: Form Control Components

**Estimate**: 3 hours

**Files**:

- [x] `src/components/checkbox/checkbox.tsx`
- [x] `src/components/radio/radio.tsx`
- [x] `src/components/radio/radio-group.tsx`
- [x] `src/components/switch/switch.tsx`
- [x] `src/components/textarea/textarea.tsx`

**Each with**: label, error state, disabled state

---

## Task 5: Card Component

**Estimate**: 1.5 hours

**Reference**: Minima Card patterns

**Files**:

- [x] `src/components/card/card.tsx` (includes CardHeader, CardBody, CardFooter, CardTitle, CardDescription)
- [x] `src/components/card/index.ts`

**Props**:

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

---

## Task 6: Badge/Label Component

**Estimate**: 1 hour

**Reference**: Minima `/src/components/label/`

**Files**:

- [x] `src/components/badge/badge.tsx`
- [x] `src/components/badge/index.ts`

**Variants**: filled, outlined, soft
**Colors**: primary, secondary, success, warning, error, info, neutral

---

## Task 7: Avatar Component

**Estimate**: 1 hour

**Files**:

- [x] `src/components/avatar/avatar.tsx` (includes AvatarGroup)
- [x] `src/components/avatar/index.ts`

**Features**: image, initials fallback, sizes (xs, sm, md, lg, xl, 2xl), group with overlap

---

## Task 8: Table Components

**Estimate**: 3 hours

**Reference**: Minima `/src/components/table/`

**Files**:

- [x] `src/components/table/table.tsx` (includes Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption)
- [x] `src/components/table/table-pagination.tsx`
- [x] `src/components/table/table-empty.tsx`
- [x] `src/components/table/table-skeleton.tsx`
- [x] `src/components/table/index.ts`

---

## Task 9: Modal/Dialog Component

**Estimate**: 2 hours

**Reference**: Minima `/src/components/custom-dialog/`

**Files**:

- [x] `src/components/modal/modal.tsx` (includes Modal, ModalHeader, ModalBody, ModalFooter)
- [x] `src/components/modal/index.ts`

**Features**: sizes (sm, md, lg, xl, full), close on overlay click, close on escape, focus trapping

---

## Task 10: Popover Component

**Estimate**: 1.5 hours

**Reference**: Minima `/src/components/custom-popover/`

**Files**:

- [x] `src/components/popover/popover.tsx`
- [x] `src/components/popover/index.ts`

**Features**: positioning (top, bottom, left, right), arrow, trigger modes (click, hover)

---

## Task 11: Dropdown Menu Component

**Estimate**: 2 hours

**Files**:

- [x] `src/components/dropdown/dropdown.tsx` (includes Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownDivider, DropdownLabel)
- [x] `src/components/dropdown/index.ts`

**Features**: keyboard navigation, icons, destructive items

---

## Task 12: Toast/Notification Component

**Estimate**: 1.5 hours

**Files**:

- [x] `src/components/toast/toast.tsx`
- [x] `src/components/toast/toast-provider.tsx` (includes ToastProvider, useToast hook)
- [x] `src/components/toast/index.ts`

**Features**: variants (default, success, error, warning, info), auto-dismiss, position options

---

## Task 13: Feedback Components

**Estimate**: 2 hours

**Files**:

- [x] `src/components/skeleton/skeleton.tsx` (includes SkeletonText, SkeletonAvatar)
- [x] `src/components/spinner/spinner.tsx`
- [x] `src/components/progress/progress.tsx`
- [x] `src/components/empty-state/empty-state.tsx`
- [x] `src/components/alert/alert.tsx`

---

## Task 14: Navigation Components

**Estimate**: 2 hours

**Files**:

- [x] `src/components/tabs/tabs.tsx` (includes Tabs, TabList, Tab, TabPanels, TabPanel)
- [x] `src/components/tabs/index.ts`
- [x] `src/components/breadcrumbs/breadcrumbs.tsx` (includes Breadcrumbs, BreadcrumbItem, BreadcrumbSeparator)
- [x] `src/components/breadcrumbs/index.ts`

**Tab variants**: underline, pills

---

## Task 15: Update Package Exports

**Estimate**: 30 minutes

- [x] Update `src/index.ts` to export all components
- [x] Update `src/components/index.ts` with barrel exports
- [x] All components exported and linting passes

---

## Total Estimate: 26 hours (3-4 days)

**Status**: Complete
