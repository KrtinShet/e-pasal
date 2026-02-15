'use client';

import { Button } from '@baazarify/ui';
import { Truck, Loader2, Package } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { apiRequest } from '@/lib/api';

interface ShipOrderDialogProps {
  orderId: string;
  shipping: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  total: number;
  paymentMethod: string;
  onSuccess: () => void;
}

interface RateResult {
  success: boolean;
  amount?: number;
  estimatedDays?: number;
  error?: string;
}

export function ShipOrderDialog({
  orderId,
  shipping,
  total,
  paymentMethod,
  onSuccess,
}: ShipOrderDialogProps) {
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [rate, setRate] = useState<RateResult | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchProviders = useCallback(async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: string[] }>(
        '/integrations/logistics/providers'
      );
      setProviders(res.data);
      if (res.data.length > 0) setSelectedProvider(res.data[0]);
    } catch {
      setError('Failed to load logistics providers');
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleCalculateRate = async () => {
    if (!selectedProvider) return;
    setLoadingRate(true);
    setRate(null);
    try {
      const res = await apiRequest<{ success: boolean; data: RateResult }>(
        '/integrations/logistics/rates',
        {
          method: 'POST',
          body: JSON.stringify({
            provider: selectedProvider,
            pickupCity: 'Kathmandu',
            deliveryCity: shipping.city,
            weight: 1,
            itemType: 'parcel',
            codAmount: paymentMethod === 'cod' ? total : undefined,
          }),
        }
      );
      setRate(res.data);
    } catch {
      setRate({ success: false, error: 'Failed to calculate rate' });
    } finally {
      setLoadingRate(false);
    }
  };

  useEffect(() => {
    if (selectedProvider) handleCalculateRate();
  }, [selectedProvider]);

  const handleCreateShipment = async () => {
    setCreating(true);
    setError('');
    try {
      await apiRequest('/integrations/logistics/shipments', {
        method: 'POST',
        body: JSON.stringify({
          provider: selectedProvider,
          orderId,
          pickupStore: {
            name: 'Store',
            address: 'Pickup Address',
            city: 'Kathmandu',
            phone: '9800000000',
          },
          recipient: {
            name: shipping.name,
            phone: shipping.phone,
            address: shipping.address,
            city: shipping.city,
          },
          package: {
            weight: 1,
            itemType: 'parcel',
            description: 'Order items',
            quantity: 1,
          },
          codAmount: paymentMethod === 'cod' ? total : undefined,
          deliveryType: 'normal',
        }),
      });

      await apiRequest(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'shipped', note: `Shipped via ${selectedProvider}` }),
      });

      onSuccess();
    } catch {
      setError('Failed to create shipment');
    } finally {
      setCreating(false);
    }
  };

  if (providers.length === 0) {
    return (
      <div className="text-sm text-[var(--grey-500)] p-4 bg-[var(--grey-100)]/50 rounded-lg">
        <p>No logistics providers configured.</p>
        <a
          href="/settings/integrations"
          className="text-[var(--primary-main)] hover:underline mt-1 inline-block"
        >
          Configure in Settings
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--grey-900)] mb-2">
          Logistics Provider
        </label>
        <div className="flex gap-2">
          {providers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedProvider(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                selectedProvider === p
                  ? 'bg-[var(--primary-main)] text-white'
                  : 'bg-[var(--grey-100)] text-[var(--grey-500)] hover:bg-[var(--grey-100)]/80'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--grey-100)]/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-4 h-4 text-[var(--grey-500)]" />
          <span className="text-sm font-medium text-[var(--grey-900)]">
            Delivery to {shipping.city}
          </span>
        </div>
        <div className="text-sm text-[var(--grey-500)]">
          <p>
            {shipping.name} - {shipping.phone}
          </p>
          <p>{shipping.address}</p>
        </div>
      </div>

      {loadingRate && (
        <div className="flex items-center gap-2 text-sm text-[var(--grey-500)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Calculating shipping rate...
        </div>
      )}

      {rate && rate.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700">Estimated shipping cost</span>
            <span className="text-sm font-semibold text-green-700">
              NPR {rate.amount?.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {rate && !rate.success && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-700">{rate.error || 'Could not calculate rate'}</p>
        </div>
      )}

      {paymentMethod === 'cod' && (
        <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Package className="w-4 h-4 text-blue-600" />
          <span className="text-blue-700">COD collection: NPR {total.toLocaleString()}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        variant="primary"
        onClick={handleCreateShipment}
        loading={creating}
        disabled={creating || !selectedProvider}
        className="w-full"
      >
        {creating ? 'Creating Shipment...' : 'Ship Order'}
      </Button>
    </div>
  );
}
