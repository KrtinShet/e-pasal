'use client';

import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  createContext,
  type ReactNode,
} from 'react';

import type { CartItem, CartState, CartAction, CartSummary } from '@/types/cart';

const CART_STORAGE_KEY = 'baazarify_cart';
const CART_VERSION = 1;

interface StoredCart {
  version: number;
  state: CartState;
}

function getItemKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}:${variantId}` : productId;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { quantity = 1, ...item } = action.payload;
      const itemKey = getItemKey(item.productId, item.variantId);
      const existingIndex = state.items.findIndex(
        (i) => getItemKey(i.productId, i.variantId) === itemKey
      );

      if (existingIndex >= 0) {
        const existingItem = state.items[existingIndex];
        const newQuantity = Math.min(existingItem.quantity + quantity, item.maxQuantity);

        if (newQuantity === existingItem.quantity) {
          return state;
        }

        const newItems = [...state.items];
        newItems[existingIndex] = { ...existingItem, quantity: newQuantity };

        return {
          items: newItems,
          updatedAt: Date.now(),
        };
      }

      const newItem: CartItem = {
        ...item,
        quantity: Math.min(quantity, item.maxQuantity),
      };

      return {
        items: [...state.items, newItem],
        updatedAt: Date.now(),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, variantId, quantity } = action.payload;
      const itemKey = getItemKey(productId, variantId);
      const existingIndex = state.items.findIndex(
        (i) => getItemKey(i.productId, i.variantId) === itemKey
      );

      if (existingIndex < 0) {
        return state;
      }

      if (quantity <= 0) {
        return {
          items: state.items.filter((_, index) => index !== existingIndex),
          updatedAt: Date.now(),
        };
      }

      const existingItem = state.items[existingIndex];
      const newQuantity = Math.min(quantity, existingItem.maxQuantity);

      if (newQuantity === existingItem.quantity) {
        return state;
      }

      const newItems = [...state.items];
      newItems[existingIndex] = { ...existingItem, quantity: newQuantity };

      return {
        items: newItems,
        updatedAt: Date.now(),
      };
    }

    case 'REMOVE_ITEM': {
      const { productId, variantId } = action.payload;
      const itemKey = getItemKey(productId, variantId);
      const newItems = state.items.filter((i) => getItemKey(i.productId, i.variantId) !== itemKey);

      if (newItems.length === state.items.length) {
        return state;
      }

      return {
        items: newItems,
        updatedAt: Date.now(),
      };
    }

    case 'CLEAR_CART': {
      if (state.items.length === 0) {
        return state;
      }

      return {
        items: [],
        updatedAt: Date.now(),
      };
    }

    case 'HYDRATE': {
      return action.payload;
    }

    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  updatedAt: Date.now(),
};

interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean;
  isDrawerOpen: boolean;
  summary: CartSummary;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  getItemQuantity: (productId: string, variantId?: string) => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: StoredCart = JSON.parse(stored);
        if (parsed.version === CART_VERSION && parsed.state?.items) {
          dispatch({ type: 'HYDRATE', payload: parsed.state });
        }
      }
    } catch {
      // Invalid stored data, start fresh
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      const toStore: StoredCart = {
        version: CART_VERSION,
        state,
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(toStore));
    } catch {
      // Storage full or unavailable
    }
  }, [state, isHydrated]);

  const summary = useMemo<CartSummary>(() => {
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 0; // TODO: Implement discount/coupon logic
    const total = subtotal - discount;
    const itemCount = state.items.length;
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, discount, total, itemCount, totalItems };
  }, [state.items]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, quantity } });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const getItemQuantity = useCallback(
    (productId: string, variantId?: string): number => {
      const itemKey = getItemKey(productId, variantId);
      const item = state.items.find((i) => getItemKey(i.productId, i.variantId) === itemKey);
      return item?.quantity ?? 0;
    },
    [state.items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      isHydrated,
      isDrawerOpen,
      summary,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      getItemQuantity,
    }),
    [
      state.items,
      isHydrated,
      isDrawerOpen,
      summary,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      getItemQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
