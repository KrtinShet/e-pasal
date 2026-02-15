import { Suspense } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { Pagination } from '@/components/ui';
import type { SortOption } from '@/types/product';
import { ProductGrid, ProductFilters } from '@/components/product';
import { getStoreBaseUrl, generateProductsPageMetadata } from '@/lib/seo';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/seo';
import { getProducts, getCategories, getStoreBySubdomain } from '@/lib/api';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const headersList = await headers();
  const subdomain = headersList.get('x-store-subdomain');
  const params = await searchParams;

  if (!subdomain) {
    return {
      title: 'Products',
      description: 'Browse our collection of products',
    };
  }

  const store = await getStoreBySubdomain(subdomain);

  let categoryName: string | undefined;
  if (params.category) {
    const categories = await getCategories(subdomain);
    const category = categories.find(
      (c) => c._id === params.category || c.slug === params.category
    );
    categoryName = category?.name;
  }

  return generateProductsPageMetadata({
    store,
    subdomain,
    categoryName,
    searchQuery: params.search,
  });
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card overflow-hidden animate-pulse">
          <div className="aspect-square bg-[var(--grey-100)]" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-[var(--grey-100)] rounded w-3/4" />
            <div className="h-5 bg-[var(--grey-100)] rounded w-1/2" />
            <div className="h-6 bg-[var(--grey-100)] rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: ProductsPageProps['searchParams'];
}) {
  const headersList = await headers();
  const subdomain = headersList.get('x-store-subdomain');
  const params = await searchParams;

  if (!subdomain) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-heading-2 font-medium text-[var(--grey-900)] mb-4">
          Store not configured
        </h2>
        <p className="text-body text-[var(--grey-600)]">
          Please access this page through a store subdomain.
        </p>
      </div>
    );
  }

  const page = params.page ? parseInt(params.page, 10) : 1;
  const sort = (params.sort as SortOption) || 'newest';

  const [productsResult, categories, store] = await Promise.all([
    getProducts(subdomain, {
      category: params.category,
      search: params.search,
      sort,
      page,
      limit: 20,
    }),
    getCategories(subdomain),
    getStoreBySubdomain(subdomain),
  ]);

  const currentCategory = params.category
    ? categories.find((c) => c._id === params.category || c.slug === params.category)
    : undefined;

  const baseUrl = store ? getStoreBaseUrl(store, subdomain) : '';
  const pageUrl = `${baseUrl}/products`;

  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Products', url: pageUrl },
  ];

  if (currentCategory) {
    breadcrumbItems.push({
      name: currentCategory.name,
      url: `${pageUrl}?category=${currentCategory.slug}`,
    });
  }

  return (
    <>
      {store && (
        <>
          <BreadcrumbJsonLd items={breadcrumbItems} />
          <CollectionPageJsonLd
            store={store}
            category={currentCategory}
            url={pageUrl}
            productCount={productsResult.pagination.total}
          />
        </>
      )}

      <ProductFilters categories={categories} totalProducts={productsResult.pagination.total} />

      <div className="mt-8">
        <ProductGrid products={productsResult.products} />
      </div>

      <Pagination pagination={productsResult.pagination} />
    </>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="container-main py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-heading-1 font-display font-semibold text-[var(--grey-900)]">
          Products
        </h1>
        <p className="mt-2 text-body-lg text-[var(--grey-600)]">
          Discover our curated collection of products
        </p>
      </header>

      <Suspense fallback={<ProductsLoading />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
