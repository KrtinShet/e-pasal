'use client';

import { useState } from 'react';

import { apiRequest } from '@/lib/api';

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  onUpdate: () => void;
}

const statusTransitions: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['ready_for_pickup', 'shipped', 'cancelled'],
  ready_for_pickup: ['shipped', 'delivered'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
  refunded: [],
};

const statusLabels: Record<string, string> = {
  confirmed: 'Confirm',
  processing: 'Process',
  ready_for_pickup: 'Ready for Pickup',
  shipped: 'Ship',
  delivered: 'Deliver',
  cancelled: 'Cancel',
};

const statusButtonStyles: Record<string, string> = {
  confirmed: 'bg-blue-600 hover:bg-blue-700 text-white',
  processing: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  ready_for_pickup: 'bg-purple-600 hover:bg-purple-700 text-white',
  shipped: 'bg-sky-600 hover:bg-sky-700 text-white',
  delivered: 'bg-green-600 hover:bg-green-700 text-white',
  cancelled: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
};

export function OrderActions({
  orderId,
  currentStatus,
  currentPaymentStatus,
  onUpdate,
}: OrderActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const availableStatuses = statusTransitions[currentStatus] || [];

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === 'cancelled' && !showCancelReason) {
      setShowCancelReason(true);
      return;
    }

    setLoading(true);
    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === 'cancelled' && cancelReason ? { cancelReason } : {}),
        }),
      });
      setShowCancelReason(false);
      setCancelReason('');
      onUpdate();
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = async (paymentStatus: string) => {
    setPaymentLoading(true);
    try {
      await apiRequest(`/orders/${orderId}/payment-status`, {
        method: 'PATCH',
        body: JSON.stringify({ paymentStatus }),
      });
      onUpdate();
    } catch {
      // Error handled by parent
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    try {
      await apiRequest(`/orders/${orderId}/notes`, {
        method: 'PATCH',
        body: JSON.stringify({ note }),
      });
      setNote('');
      setShowNoteInput(false);
      onUpdate();
    } catch {
      // Error handled by parent
    }
  };

  return (
    <div className="space-y-4">
      {availableStatuses.length > 0 && (
        <div>
          <p className="text-xs font-medium text-[var(--grey-500)] uppercase tracking-wider mb-2">
            Update Status
          </p>
          <div className="flex flex-wrap gap-2">
            {availableStatuses.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                disabled={loading}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${statusButtonStyles[status] || 'bg-[var(--grey-100)] text-[var(--grey-900)]'}`}
              >
                {statusLabels[status] || status}
              </button>
            ))}
          </div>
        </div>
      )}

      {showCancelReason && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
          <input
            type="text"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Reason for cancellation..."
            className="w-full h-9 rounded-lg border border-red-200 bg-[white] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Cancelling...' : 'Confirm Cancel'}
            </button>
            <button
              onClick={() => {
                setShowCancelReason(false);
                setCancelReason('');
              }}
              className="px-3 py-1.5 text-xs font-medium text-[var(--grey-600)] hover:text-[var(--grey-900)]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {currentPaymentStatus === 'pending' && (
        <div>
          <p className="text-xs font-medium text-[var(--grey-500)] uppercase tracking-wider mb-2">
            Payment
          </p>
          <button
            onClick={() => handlePaymentUpdate('paid')}
            disabled={paymentLoading}
            className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {paymentLoading ? 'Updating...' : 'Mark as Paid'}
          </button>
        </div>
      )}

      <div>
        {showNoteInput ? (
          <div className="space-y-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Add a note..."
              className="w-full rounded-lg border border-[var(--grey-200)]/30 bg-[white] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)]/30 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddNote}
                disabled={!note.trim()}
                className="px-3 py-1.5 text-xs font-medium bg-[var(--grey-900)] text-white rounded-lg hover:bg-[var(--grey-800)] disabled:opacity-50"
              >
                Save Note
              </button>
              <button
                onClick={() => {
                  setShowNoteInput(false);
                  setNote('');
                }}
                className="px-3 py-1.5 text-xs font-medium text-[var(--grey-600)] hover:text-[var(--grey-900)]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNoteInput(true)}
            className="text-xs font-medium text-[var(--primary-main)] hover:text-[var(--coral-dark)] transition-colors"
          >
            + Add Note
          </button>
        )}
      </div>
    </div>
  );
}
