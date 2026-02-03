# E06-S02 Tasks

## Reference Source

Minima MUI React Kit: `/Users/krtinshet/Development/Minima MUI React Kit/next-ts/src/components/`

---

## Task 1: Button Component

**Estimate**: 2 hours

**Reference**: Minima button patterns

**Files**:

- [ ] `src/components/button/button.tsx`
- [ ] `src/components/button/button.styles.ts` (variant classes)
- [ ] `src/components/button/index.ts`

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

- [ ] `src/components/input/input.tsx`
- [ ] `src/components/input/index.ts`

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

- [ ] `src/components/select/select.tsx`
- [ ] `src/components/select/index.ts`

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

- [ ] `src/components/checkbox/checkbox.tsx`
- [ ] `src/components/radio/radio.tsx`
- [ ] `src/components/radio/radio-group.tsx`
- [ ] `src/components/switch/switch.tsx`
- [ ] `src/components/textarea/textarea.tsx`

**Each with**: label, error state, disabled state

---

## Task 5: Card Component

**Estimate**: 1.5 hours

**Reference**: Minima Card patterns

**Files**:

- [ ] `src/components/card/card.tsx`
- [ ] `src/components/card/card-header.tsx`
- [ ] `src/components/card/card-body.tsx`
- [ ] `src/components/card/card-footer.tsx`
- [ ] `src/components/card/index.ts`

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

- [ ] `src/components/badge/badge.tsx`
- [ ] `src/components/badge/index.ts`

**Variants**: filled, outlined, soft
**Colors**: primary, secondary, success, warning, error, info, neutral

---

## Task 7: Avatar Component

**Estimate**: 1 hour

**Files**:

- [ ] `src/components/avatar/avatar.tsx`
- [ ] `src/components/avatar/avatar-group.tsx`
- [ ] `src/components/avatar/index.ts`

**Features**: image, initials fallback, sizes (xs, sm, md, lg, xl), group with overlap

---

## Task 8: Table Components

**Estimate**: 3 hours

**Reference**: Minima `/src/components/table/`

**Files**:

- [ ] `src/components/table/table.tsx`
- [ ] `src/components/table/table-head.tsx`
- [ ] `src/components/table/table-body.tsx`
- [ ] `src/components/table/table-row.tsx`
- [ ] `src/components/table/table-cell.tsx`
- [ ] `src/components/table/table-pagination.tsx`
- [ ] `src/components/table/table-empty.tsx`
- [ ] `src/components/table/table-skeleton.tsx`
- [ ] `src/components/table/index.ts`

---

## Task 9: Modal/Dialog Component

**Estimate**: 2 hours

**Reference**: Minima `/src/components/custom-dialog/`

**Files**:

- [ ] `src/components/modal/modal.tsx`
- [ ] `src/components/modal/modal-header.tsx`
- [ ] `src/components/modal/modal-body.tsx`
- [ ] `src/components/modal/modal-footer.tsx`
- [ ] `src/components/modal/index.ts`

**Features**: sizes (sm, md, lg, xl, full), close on overlay click, close on escape

---

## Task 10: Popover Component

**Estimate**: 1.5 hours

**Reference**: Minima `/src/components/custom-popover/`

**Files**:

- [ ] `src/components/popover/popover.tsx`
- [ ] `src/components/popover/index.ts`

**Features**: positioning (top, bottom, left, right), arrow, trigger modes

---

## Task 11: Dropdown Menu Component

**Estimate**: 2 hours

**Files**:

- [ ] `src/components/dropdown/dropdown.tsx`
- [ ] `src/components/dropdown/dropdown-item.tsx`
- [ ] `src/components/dropdown/dropdown-divider.tsx`
- [ ] `src/components/dropdown/index.ts`

**Features**: keyboard navigation, icons, nested menus

---

## Task 12: Toast/Notification Component

**Estimate**: 1.5 hours

**Files**:

- [ ] `src/components/toast/toast.tsx`
- [ ] `src/components/toast/toast-provider.tsx`
- [ ] `src/components/toast/use-toast.ts`
- [ ] `src/components/toast/index.ts`

**Option**: Integrate with sonner or react-hot-toast for simpler implementation

---

## Task 13: Feedback Components

**Estimate**: 2 hours

**Files**:

- [ ] `src/components/skeleton/skeleton.tsx`
- [ ] `src/components/spinner/spinner.tsx`
- [ ] `src/components/progress/progress.tsx`
- [ ] `src/components/empty-state/empty-state.tsx`
- [ ] `src/components/alert/alert.tsx`

---

## Task 14: Navigation Components

**Estimate**: 2 hours

**Files**:

- [ ] `src/components/tabs/tabs.tsx`
- [ ] `src/components/tabs/tab-list.tsx`
- [ ] `src/components/tabs/tab.tsx`
- [ ] `src/components/tabs/tab-panels.tsx`
- [ ] `src/components/tabs/tab-panel.tsx`
- [ ] `src/components/breadcrumbs/breadcrumbs.tsx`
- [ ] `src/components/breadcrumbs/index.ts`

**Tab variants**: underline, pills

---

## Task 15: Update Package Exports

**Estimate**: 30 minutes

- [ ] Update `src/index.ts` to export all components
- [ ] Update `src/components/index.ts` with barrel exports
- [ ] Rebuild package

---

## Total Estimate: 26 hours (3-4 days)
