'use client';

import type { FormEvent } from 'react';
import { useMemo, useState, useEffect } from 'react';
import { Input, Alert, Select, Button, PageHeader, ContentSection } from '@baazarify/ui';

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
    <div className="space-y-6">
      <PageHeader
        title="Catalog Manager"
        description="Manage products, categories, and inventory from one place."
        action={
          <Button
            variant="outline"
            onClick={() => {
              setProductForm(EMPTY_PRODUCT_FORM);
              setProductErrors({});
            }}
            type="button"
          >
            Reset Product Form
          </Button>
        }
      />

      {notice ? <Alert variant="success">{notice}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      <ContentSection title="Products">
        <div className="grid gap-3 md:grid-cols-4 mb-4">
          <Input
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={[
              { value: '', label: 'All statuses' },
              { value: 'draft', label: 'Draft' },
              { value: 'active', label: 'Active' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
          <Select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
            options={[
              { value: 'created_desc', label: 'Newest first' },
              { value: 'name_asc', label: 'Name A-Z' },
              { value: 'price_desc', label: 'Price high-low' },
            ]}
          />
          <Button type="button" onClick={() => loadProducts(1)}>
            Apply Filters
          </Button>
        </div>

        {loadingProducts ? <p>Loading products...</p> : null}
        {!loadingProducts && sortedProducts.length === 0 ? <p>No products found.</p> : null}

        {!loadingProducts && sortedProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Stock</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr className="border-b border-[var(--color-border)]" key={product._id}>
                    <td className="py-2 pr-4">{product.name}</td>
                    <td className="py-2 pr-4">NPR {product.price}</td>
                    <td className="py-2 pr-4">{product.stock}</td>
                    <td className="py-2 pr-4">{product.status}</td>
                    <td className="py-2 pr-4 flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                        type="button"
                      >
                        Edit
                      </Button>
                      <button
                        className="rounded-full border border-red-200 px-4 py-2 text-red-700"
                        onClick={() => handleProductDelete(product._id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between text-sm">
          <span>
            Page {pagination.page} / {Math.max(1, pagination.pages)}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={pagination.page <= 1}
              onClick={() => loadProducts(Math.max(1, pagination.page - 1))}
              type="button"
            >
              Prev
            </Button>
            <Button
              variant="outline"
              disabled={pagination.page >= pagination.pages}
              onClick={() => loadProducts(Math.min(pagination.pages, pagination.page + 1))}
              type="button"
            >
              Next
            </Button>
          </div>
        </div>
      </ContentSection>

      <section className="grid gap-6 lg:grid-cols-2">
        <ContentSection title={productForm.id ? 'Edit Product' : 'Create Product'}>
          <form className="space-y-3" onSubmit={handleProductSubmit}>
            <Input
              label="Product Name"
              value={productForm.name}
              error={productErrors.name}
              onChange={(event) =>
                setProductForm((previous) => ({ ...previous, name: event.target.value }))
              }
            />

            <label className="block">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                Description
              </span>
              <textarea
                className="mt-1.5 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/30"
                rows={3}
                value={productForm.description}
                onChange={(event) =>
                  setProductForm((previous) => ({ ...previous, description: event.target.value }))
                }
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="Price"
                type="number"
                min="0"
                step="0.01"
                value={productForm.price}
                error={productErrors.price}
                onChange={(event) =>
                  setProductForm((previous) => ({ ...previous, price: event.target.value }))
                }
              />

              <Input
                label="Stock"
                type="number"
                min="0"
                value={productForm.stock}
                error={productErrors.stock}
                onChange={(event) =>
                  setProductForm((previous) => ({ ...previous, stock: event.target.value }))
                }
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Select
                label="Status"
                value={productForm.status}
                onChange={(event) =>
                  setProductForm((previous) => ({
                    ...previous,
                    status: event.target.value as Product['status'],
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
                onChange={(event) =>
                  setProductForm((previous) => ({
                    ...previous,
                    categoryId: event.target.value,
                  }))
                }
                options={[
                  { value: '', label: 'No category' },
                  ...categories.map((category) => ({
                    value: category._id,
                    label: category.name,
                  })),
                ]}
              />
            </div>

            <label className="block">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">Images</span>
              <input
                className="mt-1.5 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)]"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => void handleImageUpload(event.target.files)}
              />
              {uploading ? (
                <small className="text-[var(--color-text-muted)]">Uploading image...</small>
              ) : null}
            </label>

            {productForm.images.length > 0 ? (
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                {productForm.images.map((url) => (
                  <div
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2"
                    key={url}
                  >
                    <img alt="Product" className="h-24 w-full rounded object-cover" src={url} />
                    <button
                      className="mt-2 w-full rounded-lg border border-red-200 py-1 text-sm text-red-700"
                      onClick={() => removeImage(url)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <Button type="submit">{productForm.id ? 'Update Product' : 'Create Product'}</Button>
          </form>
        </ContentSection>

        <ContentSection title="Category Management">
          <form className="space-y-3" onSubmit={handleCategorySubmit}>
            <Input
              label="Category Name"
              value={categoryForm.name}
              onChange={(event) =>
                setCategoryForm((previous) => ({ ...previous, name: event.target.value }))
              }
            />

            <div className="grid gap-3 md:grid-cols-2">
              <Select
                label="Status"
                value={categoryForm.status}
                onChange={(event) =>
                  setCategoryForm((previous) => ({
                    ...previous,
                    status: event.target.value as Category['status'],
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
                onChange={(event) =>
                  setCategoryForm((previous) => ({ ...previous, order: event.target.value }))
                }
              />
            </div>

            <Button type="submit">{categoryForm.id ? 'Update Category' : 'Create Category'}</Button>
          </form>

          <div className="mt-6">
            {loadingCategories ? <p>Loading categories...</p> : null}
            {!loadingCategories && categories.length === 0 ? <p>No categories found.</p> : null}

            {!loadingCategories && categories.length > 0 ? (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
                    key={category._id}
                  >
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{category.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCategoryForm({
                            id: category._id,
                            name: category.name,
                            status: category.status,
                            order: String(category.order ?? 0),
                          })
                        }
                        type="button"
                      >
                        Edit
                      </Button>
                      <button
                        className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-700"
                        onClick={() => handleCategoryDelete(category._id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </ContentSection>
      </section>
    </div>
  );
}
