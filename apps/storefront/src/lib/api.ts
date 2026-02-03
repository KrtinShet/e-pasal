import type { StoreData, ApiResponse } from '@/types/store';
import type {
  Product,
  Category,
  PaginationInfo,
  ProductListItem,
  ProductsQueryParams,
} from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error?.message || 'An error occurred',
      response.status,
      data.error?.code || 'UNKNOWN_ERROR'
    );
  }

  return data.data as T;
}

export async function getStoreBySubdomain(subdomain: string): Promise<StoreData | null> {
  try {
    return await fetchApi<StoreData>(`/storefront/${subdomain}`);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export interface ProductsResponse {
  products: ProductListItem[];
  pagination: PaginationInfo;
}

export async function getProducts(
  subdomain: string,
  params: ProductsQueryParams = {}
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();

  if (params.category) searchParams.set('category', params.category);
  if (params.search) searchParams.set('search', params.search);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const queryString = searchParams.toString();
  const endpoint = `/storefront/${subdomain}/products${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error?.message || 'Failed to fetch products',
      response.status,
      data.error?.code || 'FETCH_ERROR'
    );
  }

  return {
    products: data.data,
    pagination: data.pagination,
  };
}

export async function getProductBySlug(subdomain: string, slug: string): Promise<Product | null> {
  try {
    return await fetchApi<Product>(`/storefront/${subdomain}/products/${slug}`);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function getCategories(subdomain: string): Promise<Category[]> {
  try {
    return await fetchApi<Category[]>(`/storefront/${subdomain}/categories`);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return [];
    }
    throw error;
  }
}

export interface SitemapProduct {
  slug: string;
  updatedAt: string;
}

export interface SitemapCategory {
  slug: string;
  updatedAt: string;
}

export async function getAllProductsForSitemap(subdomain: string): Promise<SitemapProduct[]> {
  try {
    const allProducts: SitemapProduct[] = [];
    let page = 1;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await getProducts(subdomain, { page, limit });
      const products = response.products.map((p) => ({
        slug: p.slug,
        updatedAt: new Date().toISOString(),
      }));
      allProducts.push(...products);

      hasMore = response.pagination.page < response.pagination.pages;
      page++;

      if (page > 100) break;
    }

    return allProducts;
  } catch {
    return [];
  }
}

export async function getAllCategoriesForSitemap(subdomain: string): Promise<SitemapCategory[]> {
  try {
    const categories = await getCategories(subdomain);
    return categories.map((c) => ({
      slug: c.slug,
      updatedAt: c.updatedAt,
    }));
  } catch {
    return [];
  }
}

export const storefrontApi = {
  getStore: getStoreBySubdomain,
  getProducts,
  getProductBySlug,
  getCategories,
  getAllProductsForSitemap,
  getAllCategoriesForSitemap,
};
