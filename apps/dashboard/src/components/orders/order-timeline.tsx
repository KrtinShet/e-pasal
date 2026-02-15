interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  note?: string;
  changedBy?: { name?: string } | string;
}

function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function OrderTimeline({ history }: { history: StatusHistoryEntry[] }) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-[var(--grey-600)] py-4">No status history available</p>;
  }

  const sorted = [...history].reverse();

  return (
    <div className="relative">
      {sorted.map((entry, index) => (
        <div key={index} className="flex gap-4 pb-6 last:pb-0">
          <div className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full border-2 ${
                index === 0
                  ? 'bg-[var(--primary-main)] border-[var(--primary-main)]'
                  : 'bg-[white] border-[var(--grey-200)]'
              }`}
            />
            {index < sorted.length - 1 && (
              <div className="w-px flex-1 bg-[var(--grey-200)]/30 mt-1" />
            )}
          </div>
          <div className="flex-1 -mt-0.5">
            <p className="text-sm font-medium text-[var(--grey-900)]">
              {formatStatus(entry.status)}
            </p>
            <p className="text-xs text-[var(--grey-500)] mt-0.5">
              {formatDateTime(entry.timestamp)}
            </p>
            {entry.note && (
              <p className="text-xs text-[var(--grey-600)] mt-1 bg-[var(--grey-50)] rounded px-2 py-1">
                {entry.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
