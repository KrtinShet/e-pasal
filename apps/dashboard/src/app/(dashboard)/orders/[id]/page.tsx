'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  Tab,
  Tabs,
  Input,
  Button,
  TabList,
  TabPanel,
  TabPanels,
  Breadcrumbs,
  BreadcrumbItem,
} from '@baazarify/ui';

import { apiRequest } from '@/lib/api';
import { OrderActions } from '@/components/orders/order-actions';
import { OrderTimeline } from '@/components/orders/order-timeline';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { PaymentStatusBadge } from '@/components/orders/payment-status-badge';

interface OrderItem {
  productId: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  note?: string;
  changedBy?: { name?: string } | string;
}

interface OrderDetail {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentDetails?: {
    transactionId?: string;
    paidAt?: string;
    refundedAt?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  shipping: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
    notes?: string;
  };
  fulfillment?: {
    provider?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  statusHistory: StatusHistoryEntry[];
  source: string;
  notes?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function formatPaymentMethod(method: string): string {
  const labels: Record<string, string> = {
    cod: 'Cash on Delivery',
    esewa: 'eSewa',
    khalti: 'Khalti',
    fonepay: 'FonePay',
    bank_transfer: 'Bank Transfer',
  };
  return labels[method] || method;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fulfillmentForm, setFulfillmentForm] = useState({
    provider: '',
    trackingNumber: '',
    trackingUrl: '',
  });
  const [fulfillmentSaving, setFulfillmentSaving] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const response = await apiRequest<{ success: boolean; data: OrderDetail }>(
        `/orders/${orderId}`
      );
      setOrder(response.data);
      if (response.data.fulfillment) {
        setFulfillmentForm({
          provider: response.data.fulfillment.provider || '',
          trackingNumber: response.data.fulfillment.trackingNumber || '',
          trackingUrl: response.data.fulfillment.trackingUrl || '',
        });
      }
    } catch {
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleFulfillmentUpdate = async () => {
    setFulfillmentSaving(true);
    try {
      await apiRequest(`/orders/${orderId}/fulfillment`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...(fulfillmentForm.provider ? { provider: fulfillmentForm.provider } : {}),
          ...(fulfillmentForm.trackingNumber
            ? { trackingNumber: fulfillmentForm.trackingNumber }
            : {}),
          ...(fulfillmentForm.trackingUrl ? { trackingUrl: fulfillmentForm.trackingUrl } : {}),
        }),
      });
      fetchOrder();
    } catch {
      // Error handling
    } finally {
      setFulfillmentSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 bg-[var(--color-surface)] rounded-lg animate-pulse" />
        <div className="h-96 w-full bg-[var(--color-surface)] rounded-lg animate-pulse mt-6" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error || 'Order not found'}</p>
          <Link
            href="/orders"
            className="mt-4 inline-block px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/orders">Orders</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{order.orderNumber}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {order.orderNumber}
                </h1>
                <OrderStatusBadge status={order.status} />
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Placed on {formatDate(order.createdAt)} via {order.source}
              </p>
            </div>
            <Link
              href={`/orders/${orderId}/invoice`}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-background)] border border-[var(--color-border)]/30 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
            >
              View Invoice
            </Link>
          </div>

          <Tabs defaultValue="details">
            <TabList className="border-b border-[var(--color-border)]/20 gap-0">
              <Tab value="details">Details</Tab>
              <Tab value="timeline">Timeline</Tab>
              <Tab value="fulfillment">Fulfillment</Tab>
            </TabList>

            <TabPanels className="mt-6">
              <TabPanel value="details">
                <div className="space-y-6">
                  <div className="bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]/20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--color-border)]/10">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        Items ({order.items.length})
                      </h3>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--color-border)]/10">
                          <th className="text-left px-4 py-2 text-xs font-medium text-[var(--color-text-muted)]">
                            Product
                          </th>
                          <th className="text-center px-4 py-2 text-xs font-medium text-[var(--color-text-muted)]">
                            Qty
                          </th>
                          <th className="text-right px-4 py-2 text-xs font-medium text-[var(--color-text-muted)]">
                            Price
                          </th>
                          <th className="text-right px-4 py-2 text-xs font-medium text-[var(--color-text-muted)]">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr
                            key={i}
                            className="border-b border-[var(--color-border)]/10 last:border-0"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <div className="w-10 h-10 rounded-lg bg-[var(--color-surface)] overflow-hidden flex-shrink-0">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                    {item.name}
                                  </p>
                                  {item.sku && (
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                      SKU: {item.sku}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-[var(--color-text-primary)]">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-[var(--color-text-secondary)]">
                              {formatPrice(item.price)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-[var(--color-text-primary)]">
                              {formatPrice(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-4 py-3 bg-[var(--color-surface)]/50 space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                        <span className="text-[var(--color-text-primary)]">
                          {formatPrice(order.subtotal)}
                        </span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-text-secondary)]">Discount</span>
                          <span className="text-green-600">-{formatPrice(order.discount)}</span>
                        </div>
                      )}
                      {order.shippingCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-text-secondary)]">Shipping</span>
                          <span className="text-[var(--color-text-primary)]">
                            {formatPrice(order.shippingCost)}
                          </span>
                        </div>
                      )}
                      {order.tax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--color-text-secondary)]">Tax</span>
                          <span className="text-[var(--color-text-primary)]">
                            {formatPrice(order.tax)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-[var(--color-border)]/20">
                        <span className="text-[var(--color-text-primary)]">Total</span>
                        <span className="text-[var(--color-text-primary)]">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]/20 p-4">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                        Shipping Address
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {order.shipping.name}
                        </p>
                        <p className="text-[var(--color-text-secondary)]">
                          {order.shipping.address}
                        </p>
                        <p className="text-[var(--color-text-secondary)]">
                          {order.shipping.city}
                          {order.shipping.state && `, ${order.shipping.state}`}
                          {order.shipping.postalCode && ` ${order.shipping.postalCode}`}
                        </p>
                        <p className="text-[var(--color-text-secondary)]">
                          {order.shipping.country}
                        </p>
                        <p className="text-[var(--color-text-secondary)] pt-1">
                          {order.shipping.phone}
                        </p>
                        {order.shipping.email && (
                          <p className="text-[var(--color-text-secondary)]">
                            {order.shipping.email}
                          </p>
                        )}
                        {order.shipping.notes && (
                          <p className="text-[var(--color-text-muted)] italic pt-1">
                            Note: {order.shipping.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]/20 p-4">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                        Payment Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[var(--color-text-secondary)]">Method</span>
                          <span className="text-[var(--color-text-primary)]">
                            {formatPaymentMethod(order.paymentMethod)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--color-text-secondary)]">Status</span>
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                        {order.paymentDetails?.transactionId && (
                          <div className="flex justify-between">
                            <span className="text-[var(--color-text-secondary)]">
                              Transaction ID
                            </span>
                            <span className="text-[var(--color-text-primary)] font-mono text-xs">
                              {order.paymentDetails.transactionId}
                            </span>
                          </div>
                        )}
                        {order.paymentDetails?.paidAt && (
                          <div className="flex justify-between">
                            <span className="text-[var(--color-text-secondary)]">Paid At</span>
                            <span className="text-[var(--color-text-primary)]">
                              {formatDate(order.paymentDetails.paidAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]/20 p-4">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                        Notes
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">{order.notes}</p>
                    </div>
                  )}

                  {order.cancelReason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-red-700 mb-1">
                        Cancellation Reason
                      </h3>
                      <p className="text-sm text-red-600">{order.cancelReason}</p>
                    </div>
                  )}
                </div>
              </TabPanel>

              <TabPanel value="timeline">
                <div className="bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]/20 p-6">
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
                    Status History
                  </h3>
                  <OrderTimeline history={order.statusHistory} />
                </div>
              </TabPanel>

              <TabPanel value="fulfillment">
                <div className="bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]/20 p-6 max-w-lg">
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
                    Fulfillment Details
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Shipping Provider"
                      value={fulfillmentForm.provider}
                      onChange={(e) =>
                        setFulfillmentForm((f) => ({ ...f, provider: e.target.value }))
                      }
                      placeholder="e.g., Nepal Post, Pathao"
                    />
                    <Input
                      label="Tracking Number"
                      value={fulfillmentForm.trackingNumber}
                      onChange={(e) =>
                        setFulfillmentForm((f) => ({ ...f, trackingNumber: e.target.value }))
                      }
                      placeholder="Tracking number"
                    />
                    <Input
                      label="Tracking URL"
                      type="url"
                      value={fulfillmentForm.trackingUrl}
                      onChange={(e) =>
                        setFulfillmentForm((f) => ({ ...f, trackingUrl: e.target.value }))
                      }
                      placeholder="https://tracking.example.com/..."
                    />
                    <Button
                      variant="primary"
                      onClick={handleFulfillmentUpdate}
                      loading={fulfillmentSaving}
                      disabled={fulfillmentSaving}
                    >
                      {fulfillmentSaving ? 'Saving...' : 'Update Fulfillment'}
                    </Button>
                    {order.fulfillment?.shippedAt && (
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Shipped on {formatDate(order.fulfillment.shippedAt)}
                      </p>
                    )}
                    {order.fulfillment?.deliveredAt && (
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Delivered on {formatDate(order.fulfillment.deliveredAt)}
                      </p>
                    )}
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>

        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]/20 p-4 sticky top-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Actions</h3>
            <OrderActions
              orderId={orderId}
              currentStatus={order.status}
              currentPaymentStatus={order.paymentStatus}
              onUpdate={fetchOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
