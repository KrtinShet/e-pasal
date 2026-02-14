import Link from 'next/link';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { ProductJsonLd } from '@/components/seo';
import { generateProductMetadata } from '@/lib/seo';
import { AddToCartButton } from '@/components/cart';
import { ProductGallery } from '@/components/product';
import { ProductCard } from '@/components/product/product-card';
import { getProducts, getProductBySlug, getStoreBySubdomain } from '@/lib/api';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const headersList = await headers();
  const subdomain = headersList.get('x-store-subdomain');
  const { slug } = await params;

  if (!subdomain) {
    return { title: 'Product' };
  }

  const [product, store] = await Promise.all([
    getProductBySlug(subdomain, slug),
    getStoreBySubdomain(subdomain),
  ]);

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

  return generateProductMetadata({ product, store, subdomain });
}

function formatPrice(price: number, currency: string = 'NPR'): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--sage)]"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--store-primary)]"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const headersList = await headers();
  const subdomain = headersList.get('x-store-subdomain');
  const { slug } = await params;

  if (!subdomain) {
    notFound();
  }

  const [product, store] = await Promise.all([
    getProductBySlug(subdomain, slug),
    getStoreBySubdomain(subdomain),
  ]);

  if (!product || !store) {
    notFound();
  }

  const currency = 'NPR';
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const isInStock = product.stock > 0 || product.allowBackorder;
  const lowStock = product.stock > 0 && product.stock <= 5;

  let relatedProducts: Awaited<ReturnType<typeof getProducts>>['products'] = [];
  try {
    const result = await getProducts(subdomain, {
      category: product.categoryId,
      limit: 4,
    });
    relatedProducts = result.products.filter((p) => p._id !== product._id).slice(0, 4);
  } catch {
    // Silently fail for related products
  }

  const productUrl = `https://${subdomain}.baazarify.com/products/${product.slug}`;

  return (
    <>
      <ProductJsonLd product={product} store={store} url={productUrl} />
      <div className="container-main py-8 md:py-12">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-body-sm">
            <li>
              <Link
                href="/"
                className="text-[var(--slate)] hover:text-[var(--charcoal)] transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-[var(--mist)]">/</li>
            <li>
              <Link
                href="/products"
                className="text-[var(--slate)] hover:text-[var(--charcoal)] transition-colors"
              >
                Products
              </Link>
            </li>
            <li className="text-[var(--mist)]">/</li>
            <li className="text-[var(--charcoal)] font-medium truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-body-sm text-[var(--slate)] hover:text-[var(--charcoal)] transition-colors"
          >
            <ChevronLeftIcon />
            Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="order-1">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div className="order-2 space-y-6">
            <div>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-heading-1 font-display font-semibold text-[var(--charcoal)]">
                {product.name}
              </h1>

              {product.sku && (
                <p className="mt-2 text-caption text-[var(--slate)]">SKU: {product.sku}</p>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-display-2 font-semibold text-[var(--charcoal)]">
                {formatPrice(product.price, currency)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-heading-2 text-[var(--slate)] line-through">
                    {formatPrice(product.compareAtPrice!, currency)}
                  </span>
                  <span className="badge bg-[var(--store-primary)] text-white">-{discountPercentage}%</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <CheckIcon />
                  <span className="text-body font-medium text-[var(--sage)]">
                    {lowStock ? `Only ${product.stock} left in stock` : 'In Stock'}
                  </span>
                </>
              ) : (
                <>
                  <XCircleIcon />
                  <span className="text-body font-medium text-[var(--store-primary)]">Out of Stock</span>
                </>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-body-lg text-[var(--graphite)] leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            <div className="pt-4 border-t border-[var(--mist)]/20">
              <AddToCartButton product={product} showQuantity />
              <p className="mt-3 text-caption text-[var(--slate)] text-center">
                Free shipping on orders over NPR 2,000
              </p>
            </div>

            {product.description && (
              <div className="pt-6 border-t border-[var(--mist)]/20">
                <h2 className="text-heading-3 font-medium text-[var(--charcoal)] mb-4">
                  Description
                </h2>
                <div
                  className="prose prose-slate max-w-none text-body text-[var(--graphite)]"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {(product.weight || product.dimensions) && (
              <div className="pt-6 border-t border-[var(--mist)]/20">
                <h2 className="text-heading-3 font-medium text-[var(--charcoal)] mb-4">
                  Specifications
                </h2>
                <dl className="grid grid-cols-2 gap-4 text-body">
                  {product.weight && (
                    <>
                      <dt className="text-[var(--slate)]">Weight</dt>
                      <dd className="text-[var(--charcoal)]">{product.weight}g</dd>
                    </>
                  )}
                  {product.dimensions?.length && (
                    <>
                      <dt className="text-[var(--slate)]">Dimensions</dt>
                      <dd className="text-[var(--charcoal)]">
                        {product.dimensions.length} x {product.dimensions.width || '-'} x{' '}
                        {product.dimensions.height || '-'} cm
                      </dd>
                    </>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--mist)]/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-heading-2 font-display font-semibold text-[var(--charcoal)]">
                You may also like
              </h2>
              <Link
                href="/products"
                className="text-body-sm font-medium text-[var(--store-primary)] hover:text-[var(--store-primary-dark)] link-underline transition-colors"
              >
                View all products
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
