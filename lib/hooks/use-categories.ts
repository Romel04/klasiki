import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/categories";
import type { Category } from "@/types/category";

// `initial` comes from the server (cached) so the nav is present on first paint.
// It is passed as placeholderData, NOT initialData: initialData stamps
// Date.now() while rendering, which Cache Components rejects during prerender.
// The client still fetches on mount and replaces the placeholder.
export function useCategories(initial?: Category[]) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 60_000,
    placeholderData: initial && initial.length > 0 ? initial : undefined,
  });
}
