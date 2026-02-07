import type { ReactNode } from 'react';

export interface ConfirmDialogProps {
  title: ReactNode;
  content?: ReactNode;
  action: ReactNode;
  open: boolean;
  onClose: VoidFunction;
}
