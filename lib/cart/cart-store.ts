import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  variantId: string;
  name: string;
  color: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  maxStock: number;
}

interface CartState {
  lines: CartLine[];
  add: (line: CartLine) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

export const CART_STORAGE_KEY = "klasiki_cart";

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line) =>
        set((s) => {
          const existing = s.lines.find((l) => l.variantId === line.variantId);
          if (!existing) return { lines: [...s.lines, line] };
          return {
            lines: s.lines.map((l) =>
              l.variantId === line.variantId
                ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.maxStock) }
                : l,
            ),
          };
        }),
      setQty: (variantId, qty) =>
        set((s) => ({
          lines: s.lines.map((l) =>
            l.variantId === variantId
              ? { ...l, quantity: Math.max(1, Math.min(qty, l.maxStock)) }
              : l,
          ),
        })),
      remove: (variantId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.variantId !== variantId) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
      partialize: (s) => ({ lines: s.lines }),
      // Hydrate manually after mount (see app/providers.tsx) so the server
      // render and first client render match — no hydration mismatch on the badge.
      skipHydration: true,
    },
  ),
);

// Narrow selectors: a component only re-renders when its own slice changes.
export const useCartLines = () => useCartStore((s) => s.lines);
export const useCartCount = () =>
  useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
export const useCartSubtotal = () =>
  useCartStore((s) => s.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0));

// Outside React (e.g. after a successful order): useCartStore.getState().clear()
