// base-ui components may pass `className` as a state function; those are
// ignored here (our usages only ever pass strings).
type ClassPart = string | false | null | undefined | ((...args: never[]) => unknown);

export function cn(...parts: ClassPart[]) {
  return parts.filter((p): p is string => typeof p === "string" && p.length > 0).join(" ");
}
