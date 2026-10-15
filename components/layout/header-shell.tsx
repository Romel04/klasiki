import { getAllCategories } from "@/lib/server/data";
import { SiteHeader } from "./site-header";

// Server wrapper: loads the (cached) category tree so the nav is in the first
// HTML instead of popping in after a client fetch. On failure (Render cold
// start) it passes nothing and the client hook fetches instead.
export async function HeaderShell() {
  const categories = await getAllCategories().catch(() => []);
  return <SiteHeader initialCategories={categories} />;
}
