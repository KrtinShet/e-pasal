export interface ProductVariant {
  _id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  options: Record<string, string>;
  image?: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductSEO {
  title?: string;
  description?: string;
}

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
}

export interface Product {
  _id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  images: string[];
  categoryId?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  variants: ProductVariant[];
  hasVariants: boolean;
  options: ProductOption[];
  status: 'draft' | 'active' | 'archived';
  visibility: 'visible' | 'hidden';
  seo: ProductSEO;
  tags: string[];
  weight?: number;
  dimensions?: ProductDimensions;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListItem {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface Category {
  _id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

export interface ProductsQueryParams {
  category?: string;
  search?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}
