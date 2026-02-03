export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: 'draft' | 'active' | 'archived';
  images: string[];
  categoryId?: string;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  order: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
