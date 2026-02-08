const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  pending: {
    label: 'Pending',
    dot: 'bg-amber-400',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
  },
  confirmed: {
    label: 'Confirmed',
    dot: 'bg-blue-400',
    text: 'text-blue-700',
    bg: 'bg-blue-50',
  },
  processing: {
    label: 'Processing',
    dot: 'bg-indigo-400',
    text: 'text-indigo-700',
    bg: 'bg-indigo-50',
  },
  ready_for_pickup: {
    label: 'Ready for Pickup',
    dot: 'bg-violet-400',
    text: 'text-violet-700',
    bg: 'bg-violet-50',
  },
  shipped: {
    label: 'Shipped',
    dot: 'bg-sky-400',
    text: 'text-sky-700',
    bg: 'bg-sky-50',
  },
  delivered: {
    label: 'Delivered',
    dot: 'bg-emerald-400',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
  },
  cancelled: {
    label: 'Cancelled',
    dot: 'bg-red-400',
    text: 'text-red-700',
    bg: 'bg-red-50',
  },
  refunded: {
    label: 'Refunded',
    dot: 'bg-gray-400',
    text: 'text-gray-600',
    bg: 'bg-gray-50',
  },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || {
    label: status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    dot: 'bg-gray-400',
    text: 'text-gray-600',
    bg: 'bg-gray-50',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`status-dot ${config.dot}`} />
      {config.label}
    </span>
  );
}
