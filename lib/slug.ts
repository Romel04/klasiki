// Pretty URLs without backend changes: /p/12-leather-tote. The numeric id
// prefix is the real key, the slug is cosmetic (old /p/12 links still work).
export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

function withSlug(base: string, id: string, name: string) {
  const slug = slugify(name);
  return slug ? `${base}/${id}-${slug}` : `${base}/${id}`;
}

export const productPath = (p: { id: string; name: string }) => withSlug("/p", p.id, p.name);
export const categoryPath = (c: { id: string; name: string }) => withSlug("/c", c.id, c.name);

// "12-leather-tote" -> "12". Returns null when the param has no numeric id.
export function idFromParam(param: string): string | null {
  let value = param;
  try {
    value = decodeURIComponent(param);
  } catch {}
  return /^(\d+)/.exec(value)?.[1] ?? null;
}
