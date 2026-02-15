'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Card,
  Badge,
  Table,
  CardBody,
  TableRow,
  Skeleton,
  TableBody,
  TableHead,
  TableCell,
  TableEmpty,
  Breadcrumbs,
  TableHeader,
  BreadcrumbItem,
} from '@baazarify/ui';

import { apiRequest } from '@/lib/api';

interface CustomerOrder {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: Array<{ name: string; quantity: number }>;
}

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  tags: string[];
  source: string;
  notes?: string;
  addresses: Array<{
    label: string;
    address: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
    isDefault: boolean;
  }>;
  lastOrderAt?: string;
  createdAt: string;
}

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready_for_pickup'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

const orderStatusColor: Record<
  OrderStatus,
  'warning' | 'info' | 'primary' | 'secondary' | 'info' | 'success' | 'error' | 'neutral'
> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'primary',
  ready_for_pickup: 'secondary',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  refunded: 'neutral',
};

const sourceBadgeColor: Record<string, 'info' | 'success' | 'error' | 'neutral'> = {
  website: 'info',
  whatsapp: 'success',
  instagram: 'error',
  manual: 'neutral',
};

function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString('en-NP')}`;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr));
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await apiRequest<{
          success: boolean;
          data: { customer: Customer; orders: CustomerOrder[] };
        }>(`/customers/${id}/orders`);

        setCustomer(response.data.customer);
        setOrders(response.data.orders || []);
      } catch {
        // error handled by empty state
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" width={200} height={20} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton variant="rounded" height={300} />
          <div className="lg:col-span-2">
            <Skeleton variant="rounded" height={400} />
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-[var(--grey-400)]">Customer not found</p>
        <Link
          href="/customers"
          className="mt-4 inline-block text-sm text-[var(--primary-main)] hover:underline"
        >
          Back to customers
        </Link>
      </div>
    );
  }

  const avgOrderValue = customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs separator={<span className="text-[var(--grey-400)]">/</span>}>
        <BreadcrumbItem href="/customers">Customers</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{customer.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card variant="outlined">
            <CardBody>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[var(--primary-main)]/10 text-[var(--primary-main)] flex items-center justify-center font-bold text-lg">
                  {customer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[var(--grey-900)]">{customer.name}</h1>
                  <p className="text-sm text-[var(--grey-400)]">
                    Joined {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[var(--grey-400)]">
                  <PhoneIcon />
                  <span className="text-sm text-[var(--grey-900)]">{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-3 text-[var(--grey-400)]">
                    <MailIcon />
                    <span className="text-sm text-[var(--grey-900)]">{customer.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-[var(--grey-400)]">
                  <CalendarIcon />
                  <span className="text-sm text-[var(--grey-900)]">
                    {formatDate(customer.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="soft"
                    size="sm"
                    color={sourceBadgeColor[customer.source] || 'neutral'}
                  >
                    {customer.source}
                  </Badge>
                </div>
              </div>

              {customer.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--grey-200)]">
                  <p className="text-xs font-medium text-[var(--grey-400)] uppercase tracking-wider mb-2">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.tags.map((tag) => (
                      <Badge key={tag} variant="outlined" size="sm" color="neutral">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {customer.addresses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--grey-200)]">
                  <p className="text-xs font-medium text-[var(--grey-400)] uppercase tracking-wider mb-2">
                    Addresses
                  </p>
                  <div className="space-y-3">
                    {customer.addresses.map((addr, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <MapPinIcon />
                        <div>
                          <span className="font-medium text-[var(--grey-900)]">{addr.label}</span>
                          {addr.isDefault && (
                            <Badge variant="soft" size="sm" color="primary" className="ml-2">
                              Default
                            </Badge>
                          )}
                          <p className="text-[var(--grey-400)]">
                            {addr.address}, {addr.city}
                            {addr.state ? `, ${addr.state}` : ''}
                            {addr.postalCode ? ` ${addr.postalCode}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {customer.notes && (
                <div className="mt-4 pt-4 border-t border-[var(--grey-200)]">
                  <p className="text-xs font-medium text-[var(--grey-400)] uppercase tracking-wider mb-2">
                    Notes
                  </p>
                  <p className="text-sm text-[var(--grey-900)]">{customer.notes}</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card variant="outlined" padding="md">
              <CardBody>
                <p className="text-sm text-[var(--grey-400)]">Total Orders</p>
                <p className="text-2xl font-bold text-[var(--grey-900)] mt-1">
                  {customer.totalOrders}
                </p>
              </CardBody>
            </Card>
            <Card variant="outlined" padding="md">
              <CardBody>
                <p className="text-sm text-[var(--grey-400)]">Total Spent</p>
                <p className="text-2xl font-bold text-[var(--grey-900)] mt-1">
                  {formatNPR(customer.totalSpent)}
                </p>
              </CardBody>
            </Card>
            <Card variant="outlined" padding="md">
              <CardBody>
                <p className="text-sm text-[var(--grey-400)]">Avg Order Value</p>
                <p className="text-2xl font-bold text-[var(--grey-900)] mt-1">
                  {formatNPR(Math.round(avgOrderValue))}
                </p>
              </CardBody>
            </Card>
          </div>

          <Card variant="outlined" padding="none">
            <div className="px-4 py-3 border-b border-[var(--grey-200)]">
              <h3 className="text-lg font-semibold text-[var(--grey-900)]">Order History</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableEmpty
                    colSpan={4}
                    title="No orders yet"
                    description="This customer has not placed any orders."
                  />
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <Link
                          href={`/orders/${order._id}`}
                          className="text-sm font-medium text-[var(--grey-900)] hover:text-[var(--primary-main)] transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-[var(--grey-400)]">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatNPR(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="soft"
                          size="sm"
                          color={orderStatusColor[order.status as OrderStatus] || 'neutral'}
                        >
                          {formatStatus(order.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
