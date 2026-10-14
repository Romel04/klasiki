"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CART_STORAGE_KEY, useCartStore } from "@/lib/cart/cart-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    useCartStore.persist.rehydrate();
    // Keep the cart in sync across browser tabs.
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) useCartStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
