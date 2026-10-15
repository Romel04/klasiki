// Best-effort name -> swatch colour. Unknown names fall back to a text chip.
const COLORS: Record<string, string> = {
  black: "#111111", white: "#ffffff", ivory: "#f4efe3", cream: "#efe6d2", beige: "#d9c7a7",
  tan: "#b98a5a", camel: "#c19a6b", brown: "#6b4226", chocolate: "#4a2c1a", coffee: "#5a3d2b",
  khaki: "#b5a47a", olive: "#6b6b3a", green: "#2f6b45", navy: "#1c2541", blue: "#2a5db0",
  grey: "#8a8a8a", gray: "#8a8a8a", silver: "#c0c0c0", gold: "#c9a227", red: "#b3202a",
  maroon: "#6d1a24", burgundy: "#6d1a2c", wine: "#5e1a2b", pink: "#e8a0b4", orange: "#d9772b",
  mustard: "#d1a020", yellow: "#e8c53a", purple: "#5e3a78", nude: "#d8b8a0", rust: "#9a4a2a",
};

export function swatchColor(name: string): string | undefined {
  const key = name.trim().toLowerCase();
  if (COLORS[key]) return COLORS[key];
  // "Dark Brown", "Brown / Tan" -> first known colour word
  return key.split(/[^a-z]+/).map((w) => COLORS[w]).find(Boolean);
}
