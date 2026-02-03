export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  maxQuantity: number;
  sku?: string;
  variantName?: string;
}

export interface CartState {
  items: CartItem[];
  updatedAt: number;
}

export interface CartSummary {
  subtotal: number;
  itemCount: number;
  totalItems: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | {
      type: 'UPDATE_QUANTITY';
      payload: { productId: string; variantId?: string; quantity: number };
    }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartState };
