import { useSyncExternalStore } from "react";
import { useCartStore } from "./cart-store";

// The cart rehydrates from localStorage after mount (skipHydration), so pages
// that depend on its contents must wait for this before showing "empty cart".
export function useCartHydrated() {
  return useSyncExternalStore(
    (cb) => useCartStore.persist.onFinishHydration(cb),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}
