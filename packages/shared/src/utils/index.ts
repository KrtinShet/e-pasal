export function formatPrice(amount: number, currency = 'NPR'): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+977)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function formatOrderNumber(number: number): string {
  return `ORD-${number.toString().padStart(6, '0')}`;
}

export function calculateDiscount(originalPrice: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= originalPrice) return 0;
  return Math.round(((compareAtPrice - originalPrice) / compareAtPrice) * 100);
}
