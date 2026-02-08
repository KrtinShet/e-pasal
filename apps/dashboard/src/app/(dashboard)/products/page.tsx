'use client';

import type { FormEvent } from 'react';
import { useMemo, useState, useEffect } from 'react';
import { Input, Alert, Button, Select } from '@baazarify/ui';
import {
  X,
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  ImagePlus,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { apiRequest } from '@/lib/api';
import type { Product, Category, Pagination } from '@/types/catalog';

interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  pagination?: Pagination;
}

interface UploadResponse {
  success: boolean;
  data: {
    key: string;
    url: string;
  };
}

interface ProductFormState {
  id?: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  status: 'draft' | 'active' | 'archived';
  categoryId: string;
  images: string[];
}

interface CategoryFormState {
  id?: string;
  name: string;
  status: 'active' | 'inactive';
  order: string;
}

const EMPTY_PRODUCT_FORM: ProductFormState = {
  name: '',
  description: '',
  price: '',
  stock: '0',
  status: 'draft',
  categoryId: '',
  images: [],
};

const EMPTY_CATEGORY_FORM: CategoryFormState = {
  name: '',
  status: 'active',
  order: '0',
};

const statusMap: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  draft: { label: 'Draft', dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50' },
  archived: { label: 'Archived', dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-100' },
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'created_desc' | 'name_asc' | 'price_desc'>('created_desc');

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [productForm, setProductForm] = useState<ProductFormState>(EMPTY_PRODUCT_FORM);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(EMPTY_CATEGORY_FORM);

  const [productErrors, setProductErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string>('');
  const [error, setError] = useState<string>('');

  const sortedProducts = useMemo(() => {
    const items = [...products];

    if (sortBy === 'name_asc') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else {
      items.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    }

    return items;
  }, [products, sortBy]);

  async function loadProducts(page = pagination.page) {
    setLoadingProducts(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pagination.limit),
      });

      if (search.trim()) {
        params.set('search', search.trim());
      }

      if (statusFilter) {
        params.set('status', statusFilter);
      }

      const response = await apiRequest<ApiListResponse<Product>>(`/products?${params.toString()}`);
      setProducts(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadCategories() {
    setLoadingCategories(true);

    try {
      const response = await apiRequest<ApiListResponse<Category>>('/categories?limit=100');
      setCategories(response.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  }

  useEffect(() => {
    loadProducts(1);
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validateProductForm(state: ProductFormState) {
    const errors: Record<string, string> = {};

    if (!state.name.trim()) {
      errors.name = 'Product name is required';
    }

    if (!state.price || Number.isNaN(Number(state.price)) || Number(state.price) < 0) {
      errors.price = 'Price must be a valid positive number';
    }

    if (!state.stock || Number.isNaN(Number(state.stock)) || Number(state.stock) < 0) {
      errors.stock = 'Stock must be a valid positive number';
    }

    return errors;
  }

  async function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');
    setError('');

    const errors = validateProductForm(productForm);
    setProductErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = {
      name: productForm.name.trim(),
      description: productForm.description.trim() || undefined,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      status: productForm.status,
      categoryId: productForm.categoryId || undefined,
      images: productForm.images,
    };

    try {
      if (productForm.id) {
        await apiRequest(`/products/${productForm.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setNotice('Product updated successfully');
      } else {
        await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setNotice('Product created successfully');
      }

      setProductForm(EMPTY_PRODUCT_FORM);
      setProductErrors({});
      await loadProducts();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save product');
    }
  }

  async function handleProductDelete(productId: string) {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    try {
      await apiRequest(`/products/${productId}`, { method: 'DELETE' });
      setNotice('Product deleted');
      await loadProducts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete product');
    }
  }

  function handleEditProduct(product: Product) {
    setProductForm({
      id: product._id,
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
      stock: String(product.stock),
      status: product.status,
      categoryId: product.categoryId ?? '',
      images: product.images ?? [],
    });
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await apiRequest<UploadResponse>('/upload/images', {
          method: 'POST',
          body: formData,
        });

        uploadedUrls.push(response.data.url);
      }

      setProductForm((previous) => ({
        ...previous,
        images: [...previous.images, ...uploadedUrls],
      }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(imageUrl: string) {
    setProductForm((previous) => ({
      ...previous,
      images: previous.images.filter((url) => url !== imageUrl),
    }));
  }

  async function handleCategorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');
    setError('');

    if (!categoryForm.name.trim()) {
      setError('Category name is required');
      return;
    }

    const payload = {
      name: categoryForm.name.trim(),
      status: categoryForm.status,
      order: Number(categoryForm.order) || 0,
    };

    try {
      if (categoryForm.id) {
        await apiRequest(`/categories/${categoryForm.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setNotice('Category updated successfully');
      } else {
        await apiRequest('/categories', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setNotice('Category created successfully');
      }

      setCategoryForm(EMPTY_CATEGORY_FORM);
      await loadCategories();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save category');
    }
  }

  async function handleCategoryDelete(categoryId: string) {
    if (!window.confirm('Delete this category?')) {
      return;
    }

    try {
      await apiRequest(`/categories/${categoryId}`, { method: 'DELETE' });
      setNotice('Category deleted');
      await loadCategories();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete category');
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Hero header ── */}
      <div className="animate-rise relative overflow-hidden rounded-2xl warm-mesh px-8 py-8">
        <div className="grid-dots absolute inset-0 opacity-30" />
        <div className="relative flex items-end justify-between">
          <div>
            <div className="accent-bar">
              <h1 className="font-display text-[2rem] font-bold tracking-[-0.03em] text-[var(--grey-900)] leading-tight">
                Catalog
              </h1>
            </div>
            <p className="text-[0.9375rem] text-[var(--grey-500)] -mt-1">
              Manage products, categories, and inventory.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setProductForm(EMPTY_PRODUCT_FORM);
              setProductErrors({});
              document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="relative btn-coral inline-flex items-center gap-2 rounded-[14px] bg-[var(--color-primary)] px-5 py-2.5 text-[0.875rem] font-bold text-white shadow-sm transition-all hover:shadow-lg active:scale-[0.97]"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Product
          </button>
        </div>
      </div>

      {notice && (
        <div className="animate-slide-up">
          <Alert variant="success">{notice}</Alert>
        </div>
      )}
      {error && (
        <div className="animate-slide-up">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {/* ── Filter bar ── */}
      <div className="animate-rise delay-1">
        <div className="bzr-card p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--grey-400)]"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-[12px] border border-[var(--grey-200)] bg-[var(--grey-50)] py-2.5 pl-10 pr-4 text-[0.875rem] text-[var(--grey-900)] placeholder:text-[var(--grey-400)] transition-all focus:border-[var(--color-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-[12px] border border-[var(--grey-200)] bg-[var(--grey-50)] px-4 py-2.5 text-[0.875rem] text-[var(--grey-700)] transition-all focus:border-[var(--color-primary)] focus:outline-none min-w-[140px] appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-[12px] border border-[var(--grey-200)] bg-[var(--grey-50)] px-4 py-2.5 text-[0.875rem] text-[var(--grey-700)] transition-all focus:border-[var(--color-primary)] focus:outline-none min-w-[140px] appearance-none"
            >
              <option value="created_desc">Newest first</option>
              <option value="name_asc">Name A-Z</option>
              <option value="price_desc">Price high-low</option>
            </select>
            <button
              type="button"
              onClick={() => loadProducts(1)}
              className="rounded-[12px] border border-[var(--grey-200)] bg-white px-5 py-2.5 text-[0.875rem] font-semibold text-[var(--grey-700)] transition-all hover:bg-[var(--grey-50)] hover:border-[var(--grey-300)] active:scale-[0.97]"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* ── Products table ── */}
      <div className="animate-rise delay-2">
        <div className="bzr-card overflow-hidden">
          {loadingProducts ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-5 w-5 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--grey-50)]">
                <Package size={22} className="text-[var(--grey-300)]" />
              </div>
              <p className="text-sm font-medium text-[var(--grey-400)]">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Product</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Stock</th>
                    <th className="text-left">Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((product) => {
                    const st = statusMap[product.status] || statusMap.draft;
                    return (
                      <tr key={product._id}>
                        <td>
                          <span className="text-[0.875rem] font-bold text-[var(--grey-900)]">
                            {product.name}
                          </span>
                        </td>
                        <td className="text-right tabular-nums font-bold text-[var(--grey-900)]">
                          NPR {product.price.toLocaleString()}
                        </td>
                        <td className="text-right tabular-nums text-[var(--grey-600)]">
                          {product.stock}
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${st.bg} ${st.text}`}
                          >
                            <span className={`status-dot ${st.dot}`} />
                            {st.label}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="inline-flex gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditProduct(product)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-[var(--grey-500)] transition-all hover:bg-[rgba(253,232,227,0.3)] hover:text-[var(--color-primary)]"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleProductDelete(product._id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-[var(--grey-400)] transition-all hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-[var(--grey-100)] px-7 py-4">
              <p className="text-[0.75rem] font-semibold text-[var(--grey-400)]">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => loadProducts(Math.max(1, pagination.page - 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--grey-200)] text-[var(--grey-600)] transition-all hover:bg-[var(--grey-50)] hover:border-[var(--grey-300)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => loadProducts(Math.min(pagination.pages, pagination.page + 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--grey-200)] text-[var(--grey-600)] transition-all hover:bg-[var(--grey-50)] hover:border-[var(--grey-300)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Forms ── */}
      <div className="grid gap-6 lg:grid-cols-2 animate-rise delay-3">
        {/* Product Form */}
        <div id="product-form" className="bzr-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[var(--grey-100)] px-7 py-5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[14px]"
              style={{ background: 'color-mix(in srgb, var(--color-primary) 12%, white)' }}
            >
              <Package size={18} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="text-[0.9375rem] font-bold text-[var(--grey-900)] tracking-tight">
                {productForm.id ? 'Edit Product' : 'New Product'}
              </h3>
              <p className="text-[0.75rem] text-[var(--grey-400)] mt-0.5">
                Fill in the product details
              </p>
            </div>
          </div>
          <form className="space-y-4 p-7" onSubmit={handleProductSubmit}>
            <Input
              label="Product Name"
              value={productForm.name}
              error={productErrors.name}
              onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
            />

            <label className="block">
              <span className="text-[0.875rem] font-medium text-[var(--grey-900)]">
                Description
              </span>
              <textarea
                className="mt-1.5 w-full rounded-[14px] border border-[var(--grey-200)] bg-[var(--grey-50)] px-4 py-3 text-[0.875rem] text-[var(--grey-900)] placeholder:text-[var(--grey-400)] transition-all focus:border-[var(--color-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                rows={3}
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="Price (NPR)"
                type="number"
                min="0"
                step="0.01"
                value={productForm.price}
                error={productErrors.price}
                onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
              />
              <Input
                label="Stock"
                type="number"
                min="0"
                value={productForm.stock}
                error={productErrors.stock}
                onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Select
                label="Status"
                value={productForm.status}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    status: e.target.value as Product['status'],
                  }))
                }
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'active', label: 'Active' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
              <Select
                label="Category"
                value={productForm.categoryId}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
                options={[
                  { value: '', label: 'No category' },
                  ...categories.map((cat) => ({
                    value: cat._id,
                    label: cat.name,
                  })),
                ]}
              />
            </div>

            <div>
              <span className="block text-[0.875rem] font-medium text-[var(--grey-900)] mb-2">
                Images
              </span>
              <label className="group flex flex-col items-center justify-center w-full h-28 rounded-[14px] border-2 border-dashed border-[var(--grey-200)] bg-[var(--grey-50)] cursor-pointer transition-all hover:border-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_5%,white)]">
                <ImagePlus
                  size={24}
                  className="text-[var(--grey-400)] transition-colors group-hover:text-[var(--color-primary)]"
                />
                <span className="mt-2 text-[0.75rem] font-medium text-[var(--grey-400)] group-hover:text-[var(--color-primary)]">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </span>
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => void handleImageUpload(e.target.files)}
                />
              </label>
            </div>

            {productForm.images.length > 0 && (
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                {productForm.images.map((url) => (
                  <div
                    className="group relative rounded-[14px] border border-[var(--grey-200)] overflow-hidden"
                    key={url}
                  >
                    <img alt="Product" className="h-24 w-full object-cover" src={url} />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button type="submit" className="w-full">
              {productForm.id ? 'Update Product' : 'Create Product'}
            </Button>
          </form>
        </div>

        {/* Category Form */}
        <div className="bzr-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[var(--grey-100)] px-7 py-5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[14px]"
              style={{ background: 'color-mix(in srgb, var(--secondary-main) 12%, white)' }}
            >
              <FolderOpen size={18} className="text-[var(--color-secondary)]" />
            </div>
            <div>
              <h3 className="text-[0.9375rem] font-bold text-[var(--grey-900)] tracking-tight">
                Categories
              </h3>
              <p className="text-[0.75rem] text-[var(--grey-400)] mt-0.5">Organize your products</p>
            </div>
          </div>
          <div className="p-7">
            <form className="space-y-4" onSubmit={handleCategorySubmit}>
              <Input
                label="Category Name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
              />

              <div className="grid gap-3 md:grid-cols-2">
                <Select
                  label="Status"
                  value={categoryForm.status}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      status: e.target.value as Category['status'],
                    }))
                  }
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                />
                <Input
                  label="Display Order"
                  type="number"
                  min="0"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, order: e.target.value }))}
                />
              </div>

              <Button type="submit" className="w-full">
                {categoryForm.id ? 'Update Category' : 'Create Category'}
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              {loadingCategories ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-5 w-5 rounded-full border-2 border-[var(--color-secondary)] border-t-transparent animate-spin" />
                </div>
              ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <FolderOpen size={20} className="text-[var(--grey-300)]" />
                  <p className="text-[0.75rem] font-medium text-[var(--grey-400)]">
                    No categories yet
                  </p>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    className="flex items-center justify-between rounded-[14px] border border-[var(--grey-200)] px-4 py-3 transition-all hover:bg-[rgba(253,232,227,0.2)] hover:border-[var(--grey-300)]"
                    key={category._id}
                  >
                    <div>
                      <p className="text-[0.875rem] font-medium text-[var(--grey-900)]">
                        {category.name}
                      </p>
                      <p className="text-[0.6875rem] text-[var(--grey-400)]">{category.status}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setCategoryForm({
                            id: category._id,
                            name: category.name,
                            status: category.status,
                            order: String(category.order ?? 0),
                          })
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-[var(--grey-500)] transition-all hover:bg-[rgba(253,232,227,0.3)] hover:text-[var(--color-primary)]"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCategoryDelete(category._id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-[var(--grey-400)] transition-all hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
