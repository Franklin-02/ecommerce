// Generates the product cutouts in public/images/products. Run: npm run art
// Output is committed, so this only needs re-running when the manifest changes.
// `<slug>.svg` is the full product; `<slug>-detail.svg` is a close crop for galleries.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { colors, drawers } from "./drawers.mjs";
import { manifest } from "./manifest.mjs";

const outDir = path.resolve("public/images/products");
mkdirSync(outDir, { recursive: true });

function createContext() {
  const defs = [];
  let n = 0;
  const id = (p) => `${p}${++n}`;
  const stopsXml = (stops) =>
    stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
  return {
    defs,
    grad(stops, x1 = 0, y1 = 0, x2 = 1, y2 = 1) {
      const g = id("g");
      defs.push(`<linearGradient id="${g}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stopsXml(stops)}</linearGradient>`);
      return `url(#${g})`;
    },
    rad(stops) {
      const g = id("r");
      defs.push(`<radialGradient id="${g}">${stopsXml(stops)}</radialGradient>`);
      return `url(#${g})`;
    },
    pattern(size, body) {
      const p = id("p");
      defs.push(`<pattern id="${p}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">${body}</pattern>`);
      return `url(#${p})`;
    },
    clip(body) {
      const c = id("c");
      defs.push(`<clipPath id="${c}">${body}</clipPath>`);
      return c;
    },
    slats(x, y, w, h, c) {
      const count = Math.floor(w / 24);
      return Array.from({ length: count }, (_, i) =>
        `<rect x="${x + i * 24}" y="${y}" width="12" height="${h * 0.42}" rx="6" fill="${c.d}" opacity=".55"/>`,
      ).join("");
    },
  };
}

const wrap = (d, body, viewBox) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><defs>${d.defs.join("")}</defs>${body}</svg>`;

let count = 0;
for (const [slug, [kind, colorway, opts = {}]] of Object.entries(manifest)) {
  const d = createContext();
  const body = drawers[kind](d, colors[colorway], opts).replace(/\s*\n\s*/g, " ");
  writeFileSync(path.join(outDir, `${slug}.svg`), wrap(d, body, "0 0 800 800"));
  writeFileSync(path.join(outDir, `${slug}-detail.svg`), wrap(d, body, "170 150 460 460"));
  count += 1;
}
console.log(`Generated ${count} products (${count * 2} files) in ${outDir}`);
