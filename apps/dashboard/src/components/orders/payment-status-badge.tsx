const paymentConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  paid: { label: 'Paid', className: 'bg-green-50 text-green-700 border-green-200' },
  failed: { label: 'Failed', className: 'bg-red-50 text-red-700 border-red-200' },
  refunded: { label: 'Refunded', className: 'bg-gray-50 text-gray-700 border-gray-200' },
};

export function PaymentStatusBadge({ status }: { status: string }) {
  const config = paymentConfig[status] || {
    label: status,
    className: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
