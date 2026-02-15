'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Package, ExternalLink } from 'lucide-react';

import { apiRequest } from '@/lib/api';

interface ShipmentData {
  _id: string;
  provider: string;
  consignmentId: string;
  trackingNumber?: string;
  trackingUrl?: string;
  status: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  cost?: number;
  statusHistory: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
}

interface TrackingData {
  shipment: ShipmentData;
  tracking: {
    success: boolean;
    status: string;
    currentLocation?: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  picked_up: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-indigo-100 text-indigo-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  returned: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function ShipmentTracking({ orderId }: { orderId: string }) {
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTracking = useCallback(async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: TrackingData }>(
        `/integrations/logistics/tracking/${orderId}`
      );
      setData(res.data);
    } catch {
      // No shipment found
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-5 w-32 bg-[var(--grey-100)] rounded" />
        <div className="h-20 w-full bg-[var(--grey-100)] rounded" />
      </div>
    );
  }

  if (!data) return null;

  const { shipment } = data;

  return (
    <div className="bg-[white] rounded-xl border border-[var(--grey-200)]/20 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[var(--grey-500)]" />
          <h3 className="text-sm font-semibold text-[var(--grey-900)]">Shipment Tracking</h3>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[shipment.status] || 'bg-gray-100 text-gray-700'}`}
        >
          {formatStatus(shipment.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <span className="text-[var(--grey-400)]">Provider</span>
          <p className="font-medium text-[var(--grey-900)] capitalize">{shipment.provider}</p>
        </div>
        <div>
          <span className="text-[var(--grey-400)]">Consignment ID</span>
          <p className="font-medium text-[var(--grey-900)] font-mono text-xs">
            {shipment.consignmentId}
          </p>
        </div>
        {shipment.trackingNumber && (
          <div>
            <span className="text-[var(--grey-400)]">Tracking #</span>
            <p className="font-medium text-[var(--grey-900)] font-mono text-xs">
              {shipment.trackingNumber}
            </p>
          </div>
        )}
        {shipment.cost != null && (
          <div>
            <span className="text-[var(--grey-400)]">Cost</span>
            <p className="font-medium text-[var(--grey-900)]">
              NPR {shipment.cost.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {shipment.trackingUrl && (
        <a
          href={shipment.trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-[var(--primary-main)] hover:underline mb-4"
        >
          <ExternalLink className="w-3 h-3" />
          Track on {shipment.provider}
        </a>
      )}

      {shipment.statusHistory.length > 0 && (
        <div className="border-t border-[var(--grey-200)]/10 pt-4">
          <h4 className="text-xs font-medium text-[var(--grey-400)] mb-3 uppercase">
            Status Timeline
          </h4>
          <div className="space-y-3">
            {[...shipment.statusHistory].reverse().map((entry, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-[var(--primary-main)]' : 'bg-[var(--grey-200)]'}`}
                  />
                  {i < shipment.statusHistory.length - 1 && (
                    <div className="w-px flex-1 bg-[var(--grey-200)]/30 mt-1" />
                  )}
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium text-[var(--grey-900)]">
                    {formatStatus(entry.status)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-[var(--grey-400)]">
                    <Clock className="w-3 h-3" />
                    {formatDate(entry.timestamp)}
                  </div>
                  {entry.note && (
                    <p className="text-xs text-[var(--grey-500)] mt-0.5">{entry.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
