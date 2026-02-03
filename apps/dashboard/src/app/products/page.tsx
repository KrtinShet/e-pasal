'use client';

import type { FormEvent} from 'react';
import { useMemo, useState, useEffect } from 'react';

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
    <main className="min-h-screen bg-[var(--cream)]">
      <div className="container-main py-12 space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display">Catalog Manager</h1>
            <p className="text-[var(--muted)]">
              Manage products, categories, and inventory from one place.
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={() => {
              setProductForm(EMPTY_PRODUCT_FORM);
              setProductErrors({});
            }}
            type="button"
          >
            Reset Product Form
          </button>
        </header>

        {notice ? (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-700">
            {notice}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        <section className="card p-6">
          <h2 className="font-display text-2xl mb-4">Products</h2>

          <div className="grid gap-3 md:grid-cols-4 mb-4">
            <input
              className="rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <select
              className="rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
            >
              <option value="created_desc">Newest first</option>
              <option value="name_asc">Name A-Z</option>
              <option value="price_desc">Price high-low</option>
            </select>
            <button className="btn-primary" type="button" onClick={() => loadProducts(1)}>
              Apply Filters
            </button>
          </div>

          {loadingProducts ? <p>Loading products...</p> : null}
          {!loadingProducts && sortedProducts.length === 0 ? <p>No products found.</p> : null}

          {!loadingProducts && sortedProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--mist)]">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Price</th>
                    <th className="py-2 pr-4">Stock</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((product) => (
                    <tr className="border-b border-[var(--cream-dark)]" key={product._id}>
                      <td className="py-2 pr-4">{product.name}</td>
                      <td className="py-2 pr-4">NPR {product.price}</td>
                      <td className="py-2 pr-4">{product.stock}</td>
                      <td className="py-2 pr-4">{product.status}</td>
                      <td className="py-2 pr-4 flex gap-2">
                        <button
                          className="btn-secondary !px-4 !py-2"
                          onClick={() => handleEditProduct(product)}
                          type="button"
                        >
                          Edit
                        </button>
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
              <button
                className="btn-secondary !px-4 !py-2"
                disabled={pagination.page <= 1}
                onClick={() => loadProducts(Math.max(1, pagination.page - 1))}
                type="button"
              >
                Prev
              </button>
              <button
                className="btn-secondary !px-4 !py-2"
                disabled={pagination.page >= pagination.pages}
                onClick={() => loadProducts(Math.min(pagination.pages, pagination.page + 1))}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <article className="card p-6">
            <h2 className="font-display text-2xl mb-4">
              {productForm.id ? 'Edit Product' : 'Create Product'}
            </h2>
            <form className="space-y-3" onSubmit={handleProductSubmit}>
              <label className="block">
                <span className="text-sm">Product Name</span>
                <input
                  className="mt-1 w-full rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm((previous) => ({ ...previous, name: event.target.value }))
                  }
                />
                {productErrors.name ? (
                  <small className="text-red-700">{productErrors.name}</small>
                ) : null}
              </label>

              <label className="block">
                <span className="text-sm">Description</span>
                <textarea
                  className="mt-1 w-full rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
                  rows={3}
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm((previous) => ({ ...previous, description: event.target.value }))
                  }
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm">Price</span>
                  <input
                    className="mt-1 w-full rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(event) =>
                      setProductForm((previous) => ({ ...previous, price: event.target.value }))
                    }
                  />
                  {productErrors.price ? (
                    <small className="text-red-700">{productErrors.price}</small>
                  ) : null}
                </label>

                <label className="block">
                  <span className="text-sm">Stock</span>
                  <input
                    className="mt-1 w-full rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(event) =>
                      setProductForm((previous) => ({ ...previous, stock: event.target.value }))
                    }
                  />
                  {productErrors.stock ? (
                    <small className="text-red-700">{productErrors.stock}</small>
                  ) : null}
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm">Status</span>
                  <select
                    className="mt-1 w-full rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
                    value={productForm.status}
                    onChange={(event) =>
                      setProductForm((previous) => ({
                        ...previous,
                        status: event.target.value as Product['status'],
                      }))
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm">Category</span>
                  <select
                    className="mt-1 w-full rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
                    value={productForm.categoryId}
                    onChange={(event) =>
                      setProductForm((previous) => ({
                        ...previous,
                        categoryId: event.target.value,
                      }))
                    }
                  >
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm">Images</span>
                <input
                  className="mt-1 w-full rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => void handleImageUpload(event.target.files)}
                />
                {uploading ? <small>Uploading image...</small> : null}
              </label>

              {productForm.images.length > 0 ? (
                <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                  {productForm.images.map((url) => (
                    <div className="rounded-xl border border-[var(--mist)] bg-white p-2" key={url}>
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

              <button className="btn-primary" type="submit">
                {productForm.id ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </article>

          <article className="card p-6">
            <h2 className="font-display text-2xl mb-4">Category Management</h2>
            <form className="space-y-3" onSubmit={handleCategorySubmit}>
              <label className="block">
                <span className="text-sm">Category Name</span>
                <input
                  className="mt-1 w-full rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
                  value={categoryForm.name}
                  onChange={(event) =>
                    setCategoryForm((previous) => ({ ...previous, name: event.target.value }))
                  }
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm">Status</span>
                  <select
                    className="mt-1 w-full rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
                    value={categoryForm.status}
                    onChange={(event) =>
                      setCategoryForm((previous) => ({
                        ...previous,
                        status: event.target.value as Category['status'],
                      }))
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm">Display Order</span>
                  <input
                    className="mt-1 w-full rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
                    type="number"
                    min="0"
                    value={categoryForm.order}
                    onChange={(event) =>
                      setCategoryForm((previous) => ({ ...previous, order: event.target.value }))
                    }
                  />
                </label>
              </div>

              <button className="btn-primary" type="submit">
                {categoryForm.id ? 'Update Category' : 'Create Category'}
              </button>
            </form>

            <div className="mt-6">
              {loadingCategories ? <p>Loading categories...</p> : null}
              {!loadingCategories && categories.length === 0 ? <p>No categories found.</p> : null}

              {!loadingCategories && categories.length > 0 ? (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--mist)] bg-white px-3 py-2"
                      key={category._id}
                    >
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-[var(--muted)]">{category.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="btn-secondary !px-3 !py-1"
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
                        </button>
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
          </article>
        </section>
      </div>
    </main>
  );
}
