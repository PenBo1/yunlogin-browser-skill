/**
 * Tag colour palette used by the management center.
 *
 * The server stores a bare integer and does not validate it, so this module is
 * the single place that decides which values the skill is allowed to send.
 * See references/server-api/tag-colors.md for the rendered colours.
 */

export const TAG_COLORS = [
  { index: 1, name: "blue", rgb: "rgb(51, 99, 252)", hex: "#3363FC", note: "default" },
  { index: 2, name: "azure", rgb: "rgb(30, 160, 255)", hex: "#1EA0FF" },
  { index: 3, name: "teal", rgb: "rgb(17, 217, 193)", hex: "#11D9C1" },
  { index: 4, name: "lime", rgb: "rgb(172, 215, 70)", hex: "#ACD746" },
  { index: 5, name: "amber", rgb: "rgb(241, 190, 99)", hex: "#F1BE63" },
  { index: 6, name: "orange", rgb: "rgb(255, 130, 14)", hex: "#FF820E" },
  { index: 7, name: "red", rgb: "rgb(231, 4, 4)", hex: "#E70404" },
  { index: 8, name: "purple", rgb: "rgb(184, 77, 255)", hex: "#B84DFF" },
];

export const DEFAULT_TAG_COLOR = 1;

export function colorByIndex(index) {
  return TAG_COLORS.find((color) => color.index === Number(index));
}

export function colorByName(name) {
  const wanted = String(name ?? "").trim().toLowerCase();
  if (!wanted) return undefined;
  return TAG_COLORS.find((color) => color.name === wanted);
}

export function colorName(index) {
  return colorByIndex(index)?.name;
}

// Accepts a palette index or a palette name. Anything outside 1-8 is rejected
// because the server would store it and the panel could not render it.
export function resolveTagColor(value) {
  if (value === undefined || value === null) return DEFAULT_TAG_COLOR;
  const raw = String(value).trim();
  if (!raw) return DEFAULT_TAG_COLOR;
  const byName = colorByName(raw);
  if (byName) return byName.index;
  if (/^-?\d+$/.test(raw)) {
    const index = Number.parseInt(raw, 10);
    const known = colorByIndex(index);
    if (known) return known.index;
    throw new Error(`Unsupported tag colour ${index}. Use 1-8 or a palette name: ${TAG_COLORS.map((color) => color.name).join(", ")}`);
  }
  throw new Error(`Unknown tag colour "${raw}". Use 1-8 or a palette name: ${TAG_COLORS.map((color) => color.name).join(", ")}`);
}

export function describeTagColor(index) {
  const color = colorByIndex(index);
  if (!color) return { index, name: undefined, hex: undefined, rendered: false };
  return { index: color.index, name: color.name, hex: color.hex, rendered: true };
}
