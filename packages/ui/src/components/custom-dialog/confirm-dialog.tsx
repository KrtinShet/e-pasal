'use client';

import { Button } from '../button';
import { Modal, ModalBody, ModalHeader, ModalFooter } from '../modal';

import type { ConfirmDialogProps } from './types';

export function ConfirmDialog({ title, content, action, open, onClose }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>{title}</ModalHeader>

      {content && <ModalBody className="text-sm">{content}</ModalBody>}

      <ModalFooter>
        {action}
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
