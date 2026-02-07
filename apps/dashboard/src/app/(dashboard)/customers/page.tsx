'use client';

import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Table,
  Badge,
  Input,
  Select,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  TableEmpty,
  TableHeader,
  TableSkeleton,
  TablePagination,
} from '@baazarify/ui';

import { apiRequest } from '@/lib/api';

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  tags: string[];
  source: string;
  lastOrderAt?: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

type SourceType = 'website' | 'whatsapp' | 'instagram' | 'manual';
type SortByType = 'lastOrderAt' | 'totalSpent' | 'totalOrders' | 'createdAt';

const sourceBadgeColor: Record<SourceType, 'info' | 'success' | 'error' | 'neutral'> = {
  website: 'info',
  whatsapp: 'success',
  instagram: 'error',
  manual: 'neutral',
};

function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString('en-NP')}`;
}

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

function SearchIcon() {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

const sourceOptions = [
  { value: '', label: 'All Sources' },
  { value: 'website', label: 'Website' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'manual', label: 'Manual' },
];

const sortOptions = [
  { value: 'lastOrderAt', label: 'Last Order' },
  { value: 'totalSpent', label: 'Total Spent' },
  { value: 'totalOrders', label: 'Total Orders' },
  { value: 'createdAt', label: 'Date Joined' },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [source, setSource] = useState('');
  const [sortBy, setSortBy] = useState<SortByType>('lastOrderAt');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      params.set('sortBy', sortBy);
      params.set('sortOrder', 'desc');
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (source) params.set('source', source);

      const response = await apiRequest<{
        success: boolean;
        data: Customer[];
        pagination: Pagination;
      }>(`/customers?${params.toString()}`);

      setCustomers(response.data || []);
      setPagination(response.pagination || null);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, source, sortBy]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, source, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Customers</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {pagination ? `${pagination.total} customers` : 'Manage your customers'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<SearchIcon />}
            inputSize="md"
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            options={sourceOptions}
            selectSize="md"
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortByType)}
            options={sortOptions}
            selectSize="md"
          />
        </div>
      </div>

      <div className="bg-[var(--color-background)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead className="hidden sm:table-cell">Last Order</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton rows={5} columns={7} />
            ) : customers.length === 0 ? (
              <TableEmpty
                colSpan={7}
                title="No customers found"
                description={
                  debouncedSearch || source
                    ? 'Try adjusting your search or filters.'
                    : 'Customers will appear here once they place orders.'
                }
              />
            ) : (
              customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    <Link
                      href={`/customers/${customer._id}`}
                      className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{customer.phone}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-[var(--color-text-muted)]">
                    {customer.email || '-'}
                  </TableCell>
                  <TableCell className="text-sm">{customer.totalOrders}</TableCell>
                  <TableCell className="text-sm font-medium">
                    {formatNPR(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-[var(--color-text-muted)]">
                    {customer.lastOrderAt ? relativeTime(customer.lastOrderAt) : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="soft"
                      size="sm"
                      color={sourceBadgeColor[customer.source as SourceType] || 'neutral'}
                    >
                      {customer.source}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {pagination && pagination.pages > 1 && (
          <TablePagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            pageSize={limit}
            totalItems={pagination.total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setLimit(size);
              setPage(1);
            }}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
      </div>
    </div>
  );
}
