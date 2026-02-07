const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  processing: { label: 'Processing', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  ready_for_pickup: {
    label: 'Ready for Pickup',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  shipped: { label: 'Shipped', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  delivered: { label: 'Delivered', className: 'bg-green-50 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200' },
  refunded: { label: 'Refunded', className: 'bg-gray-50 text-gray-700 border-gray-200' },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || {
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
