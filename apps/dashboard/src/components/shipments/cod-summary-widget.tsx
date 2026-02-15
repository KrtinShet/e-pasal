'use client';

import { Banknote } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { apiRequest } from '@/lib/api';

interface CodSummaryData {
  totalPending: number;
  totalCollected: number;
  byProvider: Record<
    string,
    { pending: number; collected: number; pendingCount: number; collectedCount: number }
  >;
}

function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString()}`;
}

export function CodSummaryWidget() {
  const [data, setData] = useState<CodSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: CodSummaryData }>(
        '/integrations/logistics/cod-summary'
      );
      setData(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) {
    return <div className="h-32 bg-[var(--grey-100)] rounded-xl animate-pulse" />;
  }

  if (!data || (data.totalPending === 0 && data.totalCollected === 0)) return null;

  return (
    <div className="bg-[white] rounded-xl border border-[var(--grey-200)]/20 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Banknote className="w-5 h-5 text-[var(--grey-500)]" />
        <h3 className="text-sm font-semibold text-[var(--grey-900)]">COD Summary</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-yellow-50 rounded-lg p-3">
          <p className="text-xs text-yellow-600 font-medium">Pending Collection</p>
          <p className="text-lg font-bold text-yellow-700">{formatNPR(data.totalPending)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-green-600 font-medium">Collected</p>
          <p className="text-lg font-bold text-green-700">{formatNPR(data.totalCollected)}</p>
        </div>
      </div>

      {Object.keys(data.byProvider).length > 0 && (
        <div className="space-y-2">
          {Object.entries(data.byProvider).map(([provider, stats]) => (
            <div
              key={provider}
              className="flex items-center justify-between text-sm py-1.5 border-t border-[var(--grey-200)]/10 first:border-0"
            >
              <span className="capitalize text-[var(--grey-900)] font-medium">{provider}</span>
              <div className="flex gap-4 text-xs">
                {stats.pending > 0 && (
                  <span className="text-yellow-600">
                    {formatNPR(stats.pending)} ({stats.pendingCount})
                  </span>
                )}
                {stats.collected > 0 && (
                  <span className="text-green-600">
                    {formatNPR(stats.collected)} ({stats.collectedCount})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
