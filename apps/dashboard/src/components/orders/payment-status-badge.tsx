const paymentConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  pending: {
    label: 'Pending',
    dot: 'bg-amber-400',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
  },
  paid: {
    label: 'Paid',
    dot: 'bg-emerald-400',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
  },
  failed: {
    label: 'Failed',
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

export function PaymentStatusBadge({ status }: { status: string }) {
  const config = paymentConfig[status] || {
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
