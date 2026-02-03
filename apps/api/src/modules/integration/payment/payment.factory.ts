import { esewaProvider } from './esewa.provider.js';
import { khaltiProvider } from './khalti.provider.js';
import type { PaymentProvider } from './payment.interface.js';

export type PaymentMethod = 'esewa' | 'khalti' | 'fonepay' | 'bank_transfer' | 'cod';

const providers: Record<string, PaymentProvider> = {
  esewa: esewaProvider,
  khalti: khaltiProvider,
};

export function getPaymentProvider(method: PaymentMethod): PaymentProvider | null {
  if (method === 'cod' || method === 'bank_transfer') {
    return null;
  }

  const provider = providers[method];
  if (!provider) {
    throw new Error(`Unsupported payment method: ${method}`);
  }

  return provider;
}

export function isOnlinePayment(method: PaymentMethod): boolean {
  return method !== 'cod' && method !== 'bank_transfer';
}

export function getSupportedPaymentMethods(): PaymentMethod[] {
  return ['esewa', 'khalti', 'fonepay', 'bank_transfer', 'cod'];
}
