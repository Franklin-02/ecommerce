// Original studio-style product renders, drawn as SVG on a transparent 800x800
// canvas so they sit on any tile colour. Each drawer receives a context `d`
// (gradient/pattern registry), a colourway `c`, and optional per-product opts.

export const colors = {
  graphite: { b: "#3b404c", l: "#6a7182", d: "#16181f" },
  midnight: { b: "#1e2a52", l: "#46599c", d: "#0b1128" },
  silver: { b: "#cfd4dc", l: "#f6f7fa", d: "#8d95a3" },
  white: { b: "#e9ecf1", l: "#ffffff", d: "#b5bcc8" },
  blue: { b: "#3a55f0", l: "#8598ff", d: "#1a2596" },
  teal: { b: "#0f8a86", l: "#4fd1c5", d: "#064a47" },
  coral: { b: "#ee5f3e", l: "#ffa488", d: "#a42f17" },
  sand: { b: "#c9b597", l: "#efe5d3", d: "#8d7a5d" },
  forest: { b: "#2e5c4f", l: "#5f9c88", d: "#132c25" },
  plum: { b: "#5a3a82", l: "#9673c4", d: "#2c1a47" },
};

const metal = (d, c, x1 = 0, y1 = 0, x2 = 1, y2 = 1) =>
  d.grad([[0, c.l], [0.45, c.b], [1, c.d]], x1, y1, x2, y2);

const shadow = (d, cx, cy, rx, ry, o = 0.32) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${d.rad([[0, `rgba(11,17,40,${o})`], [0.6, `rgba(11,17,40,${o * 0.45})`], [1, "rgba(11,17,40,0)"]])}"/>`;

const lens = (d, cx, cy, r) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0c0e14"/>
  <circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="#5c6474" stroke-width="2.5"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="${d.rad([[0, "#44578f"], [0.55, "#141a33"], [1, "#05060c"]])}"/>
  <circle cx="${cx - r * 0.24}" cy="${cy - r * 0.26}" r="${r * 0.17}" fill="#fff" opacity=".62"/>
  <circle cx="${cx + r * 0.2}" cy="${cy + r * 0.24}" r="${r * 0.08}" fill="#8fb0ff" opacity=".5"/>`;

const led = (cx, cy, r, fill) =>
  `<circle cx="${cx}" cy="${cy}" r="${r * 2.4}" fill="${fill}" opacity=".18"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;

const usbC = (x, y, w = 46) =>
  `<rect x="${x}" y="${y}" width="${w}" height="16" rx="8" fill="#0b0c11"/><rect x="${x + 9}" y="${y + 6}" width="${w - 18}" height="4" rx="2" fill="#6d7484"/>`;

const socket = (cx, cy, r, c) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${c.d}" opacity=".32"/>
  <circle cx="${cx}" cy="${cy - 1.5}" r="${r - 3}" fill="${c.l}"/>
  <circle cx="${cx}" cy="${cy - r * 0.38}" r="${r * 0.17}" fill="#20242e"/>
  <circle cx="${cx - r * 0.36}" cy="${cy + r * 0.32}" r="${r * 0.12}" fill="#20242e"/>
  <circle cx="${cx + r * 0.36}" cy="${cy + r * 0.32}" r="${r * 0.12}" fill="#20242e"/>`;

const wallpaper = (d, x, y, w, h, rx, hue = "blue") => {
  const pal = {
    blue: ["#0b1140", "#3147f5", "#49d6e8"],
    sunset: ["#2a0f4e", "#e8476b", "#ffb35c"],
    teal: ["#032b33", "#0f9c91", "#b6f0c8"],
    plum: ["#17103f", "#6a3df0", "#f06ad6"],
  }[hue];
  const id = d.clip(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`);
  return `<g clip-path="url(#${id})">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${d.grad([[0, pal[0]], [1, pal[1]]], 0, 0, 0.6, 1)}"/>
    <circle cx="${x + w * 0.85}" cy="${y + h * 0.82}" r="${w * 0.72}" fill="${pal[2]}" opacity=".62"/>
    <circle cx="${x + w * 0.1}" cy="${y + h * 0.98}" r="${w * 0.62}" fill="${pal[1]}" opacity=".85"/>
    <circle cx="${x + w * 0.42}" cy="${y + h * 0.38}" r="${w * 0.26}" fill="#fff" opacity=".07"/>
    <path d="M${x} ${y}h${w * 0.72}L${x} ${y + h * 0.55}z" fill="#fff" opacity=".06"/>
  </g>`;
};

const phoneFront = (d, x, y, w, h, c, hue) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.17}" fill="${metal(d, c)}"/>
  <rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" rx="${w * 0.155}" fill="#07080d"/>
  ${wallpaper(d, x + 13, y + 13, w - 26, h - 26, w * 0.125, hue)}
  <circle cx="${x + w / 2}" cy="${y + 36}" r="9" fill="#050509"/>
  <text x="${x + w / 2}" y="${y + h * 0.3}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="300" font-size="${w * 0.24}" fill="#fff" opacity=".94">10:08</text>
  <rect x="${x + w * 0.32}" y="${y + h - 34}" width="${w * 0.36}" height="5" rx="2.5" fill="#fff" opacity=".7"/>`;

const phoneBack = (d, x, y, w, h, c, cams = 3) => {
  const isl = w * 0.5;
  const ix = x + w * 0.09;
  const iy = y + w * 0.09;
  const r = w * 0.095;
  const pos = cams === 3
    ? [[0.29, 0.28], [0.71, 0.5], [0.29, 0.72]]
    : cams === 2
      ? [[0.5, 0.28], [0.5, 0.72]]
      : [[0.5, 0.5]];
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.17}" fill="${c.d}"/>
  <rect x="${x + 4}" y="${y + 3}" width="${w - 8}" height="${h - 7}" rx="${w * 0.155}" fill="${metal(d, c, 0.1, 0, 0.9, 1)}"/>
  <path d="M${x + w * 0.62} ${y + 4}h${w * 0.24}L${x + w * 0.3} ${y + h - 4}H${x + w * 0.06}z" fill="#fff" opacity=".06"/>
  <rect x="${ix}" y="${iy}" width="${isl}" height="${isl * 1.08}" rx="${w * 0.12}" fill="${c.d}" opacity=".85"/>
  <rect x="${ix + 2}" y="${iy + 2}" width="${isl - 4}" height="${isl * 1.08 - 4}" rx="${w * 0.11}" fill="none" stroke="${c.l}" stroke-opacity=".35" stroke-width="2"/>
  ${pos.map(([px, py]) => lens(d, ix + isl * px, iy + isl * 1.08 * py, r)).join("")}
  ${cams > 1 ? `<circle cx="${ix + isl * 0.71}" cy="${iy + isl * 0.22}" r="7" fill="#ffe9b0"/>` : ""}`;
};

export const drawers = {
  phone(d, c, o) {
    return `${shadow(d, 400, 712, 300, 40)}
    <g transform="rotate(-9 290 400)">${phoneBack(d, 165, 130, 270, 545, c, o.cams ?? 3)}</g>
    <g transform="rotate(7 500 420)">${phoneFront(d, 365, 148, 272, 552, c, o.hue ?? "blue")}</g>`;
  },
  case(d, c) {
    return `${shadow(d, 400, 716, 210, 34)}
    <g transform="rotate(-6 400 400)">
      <rect x="248" y="96" width="304" height="600" rx="58" fill="${metal(d, c, 0, 0, 1, 0.3)}"/>
      <rect x="254" y="103" width="292" height="586" rx="52" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="3"/>
      ${phoneBack(d, 268, 116, 264, 560, colors.graphite, 3)}
      <circle cx="400" cy="440" r="88" fill="none" stroke="${c.l}" stroke-opacity=".8" stroke-width="7"/>
      <circle cx="400" cy="440" r="70" fill="none" stroke="${c.l}" stroke-opacity=".25" stroke-width="3"/>
      <rect x="548" y="240" width="9" height="74" rx="4" fill="${c.d}"/>
    </g>`;
  },
  glass(d, c) {
    return `${shadow(d, 410, 722, 240, 34)}
    <g transform="rotate(6 400 400)">${phoneFront(d, 262, 150, 270, 548, c, "teal")}</g>
    <g transform="rotate(-5 400 400)">
      <rect x="282" y="98" width="284" height="572" rx="48" fill="${d.grad([[0, "rgba(255,255,255,.62)"], [0.5, "rgba(205,224,255,.2)"], [1, "rgba(255,255,255,.48)"]])}" stroke="#fff" stroke-width="3"/>
      <path d="M300 122h120L300 368z" fill="#fff" opacity=".55"/>
      <path d="M540 420v150L470 650h-40z" fill="#fff" opacity=".3"/>
      <circle cx="424" cy="132" r="10" fill="none" stroke="#fff" stroke-width="2.5"/>
    </g>`;
  },
  mount(d, c) {
    return `${shadow(d, 400, 708, 250, 34)}
    <path d="M250 672h300q16 0 16 14v6q0 12-16 12H250q-16 0-16-12v-6q0-14 16-14z" fill="${metal(d, c, 0, 0, 1, 0)}"/>
    <path d="M400 680L470 430" stroke="${metal(d, c, 0, 0, 1, 0)}" stroke-width="42" stroke-linecap="round"/>
    <circle cx="470" cy="430" r="36" fill="${c.d}"/><circle cx="470" cy="430" r="20" fill="${c.l}"/>
    <g transform="rotate(10 400 360)">${phoneFront(d, 272, 96, 256, 500, colors.graphite, "plum")}</g>
    <path d="M270 588q120 34 244 42" stroke="${c.b}" stroke-width="16" stroke-linecap="round" fill="none"/>`;
  },
  charger(d, c, o) {
    const ports = o.ports ?? 2;
    return `${shadow(d, 410, 668, 210, 30)}
    <rect x="340" y="104" width="30" height="110" rx="15" fill="${d.grad([[0, "#f3f4f7"], [1, "#8b93a1"]], 0, 0, 1, 0)}"/>
    <rect x="430" y="104" width="30" height="110" rx="15" fill="${d.grad([[0, "#f3f4f7"], [1, "#8b93a1"]], 0, 0, 1, 0)}"/>
    <rect x="256" y="196" width="288" height="456" rx="64" fill="${c.d}"/>
    <rect x="262" y="198" width="276" height="448" rx="58" fill="${metal(d, c, 0, 0, 1, 1)}"/>
    <path d="M286 226h90L286 460z" fill="#fff" opacity=".1"/>
    ${Array.from({ length: ports }, (_, i) => usbC(366, 300 + i * 60, 68)).join("")}
    <rect x="344" y="${310 + ports * 60}" width="112" height="9" rx="4.5" fill="${c.l}" opacity=".5"/>
    <rect x="374" y="${334 + ports * 60}" width="52" height="6" rx="3" fill="${c.l}" opacity=".32"/>
    ${led(400, 590, 6, "#59e0a4")}`;
  },
  cable(d, c) {
    const braid = (p, w = 22) => `<path d="${p}" fill="none" stroke="${c.d}" stroke-width="${w + 3}" stroke-linecap="round"/>
      <path d="${p}" fill="none" stroke="${c.b}" stroke-width="${w}" stroke-linecap="round"/>
      <path d="${p}" fill="none" stroke="${c.l}" stroke-width="${w - 6}" stroke-dasharray="7 9" opacity=".65"/>`;
    return `${shadow(d, 400, 640, 280, 42)}
    ${braid("M400 568c-180 0-260-66-260-156s90-152 260-152 256 62 256 150-88 150-250 150")}
    ${braid("M400 520c-132 0-200-48-200-112s74-108 200-108 196 44 196 106-68 106-188 106")}
    ${braid("M408 464c-84 0-134-22-134-58s54-62 130-62 130 26 130 60-48 58-120 60")}
    ${braid("M404 568c60 0 120-6 170-44l66-62")}
    ${braid("M534 406c60 20 62 60 40 100l-120 120")}
    <g transform="rotate(-44 660 440)"><rect x="620" y="400" width="84" height="56" rx="14" fill="${metal(d, colors.graphite, 0, 0, 1, 1)}"/><rect x="702" y="414" width="58" height="28" rx="12" fill="${d.grad([[0, "#f7f8fa"], [1, "#9099a8"]], 0, 0, 0, 1)}"/></g>
    <g transform="rotate(134 440 640)"><rect x="400" y="612" width="84" height="56" rx="14" fill="${metal(d, colors.graphite, 0, 0, 1, 1)}"/><rect x="482" y="626" width="58" height="28" rx="12" fill="${d.grad([[0, "#f7f8fa"], [1, "#9099a8"]], 0, 0, 0, 1)}"/></g>`;
  },
  pad(d, c) {
    return `${shadow(d, 400, 690, 310, 40)}
    <ellipse cx="400" cy="634" rx="284" ry="74" fill="${c.d}"/>
    <ellipse cx="400" cy="616" rx="284" ry="74" fill="${metal(d, c, 0, 0, 1, 0.4)}"/>
    <ellipse cx="400" cy="616" rx="238" ry="56" fill="none" stroke="${c.l}" stroke-opacity=".3" stroke-width="3"/>
    <ellipse cx="590" cy="610" rx="66" ry="20" fill="${c.d}"/>
    <ellipse cx="590" cy="606" rx="56" ry="15" fill="#4fd1c5" opacity=".65"/>
    <path d="M288 600L316 300" stroke="${metal(d, c, 0, 0, 1, 0)}" stroke-width="40" stroke-linecap="round"/>
    <g transform="rotate(5 340 340)">${phoneFront(d, 212, 92, 248, 490, colors.graphite, "sunset")}</g>
    ${led(400, 668, 5, "#59e0a4")}`;
  },
  powerbank(d, c, o) {
    const w = o.slim ? 300 : 340;
    const h = o.tall ? 590 : 520;
    const x = 400 - w / 2;
    const y = 400 - h / 2;
    return `${shadow(d, 400, y + h + 40, w * 0.72, 34)}
    <g transform="rotate(-7 400 400)">
      <rect x="${x + 12}" y="${y + 14}" width="${w}" height="${h}" rx="52" fill="${c.d}"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="50" fill="${metal(d, c, 0, 0, 1, 1)}"/>
      <path d="M${x + 30} ${y + 18}h${w * 0.42}L${x + 18} ${y + h * 0.52}z" fill="#fff" opacity=".09"/>
      <rect x="${x + w * 0.2}" y="${y + 86}" width="${w * 0.6}" height="116" rx="20" fill="#080a10"/>
      <text x="400" y="${y + 164}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="58" fill="#59e0a4">${o.pct ?? "98"}%</text>
      ${[0, 1, 2, 3].map((i) => led(x + w / 2 - 54 + i * 36, y + 244, 6, i < 3 ? "#7fa0ff" : c.l)).join("")}
      ${usbC(400 - 76, y + h - 92, 66)}${usbC(400 + 10, y + h - 92, 66)}
      <rect x="${x + w / 2 - 44}" y="${y + h - 50}" width="88" height="7" rx="3.5" fill="${c.l}" opacity=".45"/>
      ${o.magnetic ? `<circle cx="400" cy="${y + h * 0.56}" r="76" fill="none" stroke="${c.l}" stroke-opacity=".6" stroke-width="6"/>` : ""}
    </g>`;
  },
  headphones(d, c) {
    return `${shadow(d, 400, 700, 280, 36)}
    <path d="M196 448C176 120 624 120 604 448" fill="none" stroke="${c.d}" stroke-width="58" stroke-linecap="round"/>
    <path d="M196 448C176 120 624 120 604 448" fill="none" stroke="${metal(d, c, 0, 0, 1, 0.5)}" stroke-width="46" stroke-linecap="round"/>
    <path d="M232 300C288 186 512 186 568 300" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="9" stroke-linecap="round"/>
    ${[[188, -1], [612, 1]].map(([cx, s]) => `
      <rect x="${cx - 18}" y="380" width="36" height="96" rx="16" fill="${d.grad([[0, "#f2f3f6"], [1, "#868e9d"]], 0, 0, 1, 0)}"/>
      <ellipse cx="${cx - s * 40}" cy="540" rx="84" ry="134" fill="#141720"/>
      <ellipse cx="${cx}" cy="534" rx="104" ry="146" fill="${c.d}"/>
      <ellipse cx="${cx + s * 4}" cy="534" rx="96" ry="136" fill="${metal(d, c, 0, 0, 1, 1)}"/>
      <ellipse cx="${cx + s * 4}" cy="534" rx="58" ry="84" fill="none" stroke="${c.l}" stroke-opacity=".42" stroke-width="4"/>
      <ellipse cx="${cx + s * 4}" cy="534" rx="30" ry="44" fill="${c.d}" opacity=".5"/>`).join("")}
    ${led(626, 636, 5, "#59e0a4")}`;
  },
  earbuds(d, c) {
    const bud = (cx, cy, rot) => `<g transform="rotate(${rot} ${cx} ${cy})">
      <ellipse cx="${cx}" cy="${cy + 8}" rx="82" ry="72" fill="${c.d}"/>
      <ellipse cx="${cx}" cy="${cy}" rx="80" ry="70" fill="${metal(d, c, 0, 0, 1, 1)}"/>
      <ellipse cx="${cx - 18}" cy="${cy - 24}" rx="32" ry="16" fill="#fff" opacity=".2"/>
      <ellipse cx="${cx + 8}" cy="${cy + 6}" rx="32" ry="28" fill="${c.d}" opacity=".5"/>
      <rect x="${cx + 58}" y="${cy - 34}" width="52" height="70" rx="26" fill="#23262f"/>
      <ellipse cx="${cx + 104}" cy="${cy}" rx="10" ry="24" fill="#0e1016"/>
    </g>`;
    return `${shadow(d, 400, 690, 300, 36)}
    <path d="M196 410c0-96 92-160 204-160s204 64 204 160z" fill="${c.d}"/>
    <path d="M214 402c0-82 84-136 186-136s186 54 186 136z" fill="#0e1016"/>
    <rect x="186" y="404" width="428" height="270" rx="112" fill="${c.d}"/>
    <rect x="192" y="402" width="416" height="262" rx="106" fill="${metal(d, c, 0, 0, 1, 1)}"/>
    <rect x="192" y="402" width="416" height="12" fill="${c.d}" opacity=".4"/>
    <path d="M230 442h120L236 590z" fill="#fff" opacity=".12"/>
    ${led(400, 600, 6, "#59e0a4")}
    ${bud(292, 352, -18)}${bud(508, 348, 200)}`;
  },
  speaker(d, c, o) {
    const fabric = d.pattern(14, `<rect width="14" height="14" fill="${c.b}"/><circle cx="4" cy="4" r="2.6" fill="${c.d}"/><circle cx="11" cy="11" r="2.6" fill="${c.d}"/>`);
    if (o.tall) {
      return `${shadow(d, 400, 712, 214, 34)}
      <rect x="236" y="130" width="328" height="574" rx="150" fill="${fabric}"/>
      <rect x="236" y="130" width="328" height="574" rx="150" fill="${d.grad([[0, "rgba(255,255,255,.2)"], [0.45, "rgba(255,255,255,0)"], [1, "rgba(0,0,0,.42)"]], 0, 0, 1, 0)}"/>
      <ellipse cx="400" cy="190" rx="128" ry="42" fill="${metal(d, colors.graphite, 0, 0, 1, 1)}"/>
      <ellipse cx="400" cy="188" rx="90" ry="26" fill="none" stroke="#7fa0ff" stroke-width="6"/>
      ${led(400, 188, 7, "#7fa0ff")}
      <rect x="326" y="664" width="148" height="10" rx="5" fill="${c.l}" opacity=".35"/>`;
    }
    return `${shadow(d, 400, 618, 330, 38)}
    <g transform="rotate(-8 400 400)">
      <rect x="130" y="244" width="540" height="310" rx="150" fill="${fabric}"/>
      <rect x="130" y="244" width="540" height="310" rx="150" fill="${d.grad([[0, "rgba(255,255,255,.26)"], [0.42, "rgba(255,255,255,0)"], [1, "rgba(0,0,0,.5)"]], 0, 0, 0, 1)}"/>
      <ellipse cx="596" cy="399" rx="76" ry="154" fill="${metal(d, colors.graphite, 0, 0, 1, 1)}"/>
      <ellipse cx="600" cy="399" rx="56" ry="118" fill="${c.d}"/>
      <ellipse cx="600" cy="399" rx="30" ry="66" fill="${metal(d, c, 0, 0, 1, 1)}"/>
      <rect x="290" y="524" width="150" height="20" rx="10" fill="#14161d"/>
      <rect x="296" y="278" width="150" height="40" rx="20" fill="#14161d"/>
      <circle cx="326" cy="298" r="9" fill="#fff" opacity=".85"/><rect x="354" y="294" width="26" height="8" rx="4" fill="#fff" opacity=".85"/><circle cx="414" cy="298" r="9" fill="#fff" opacity=".85"/>
    </g>`;
  },
  soundbar(d, c) {
    const fabric = d.pattern(12, `<rect width="12" height="12" fill="${c.b}"/><circle cx="3" cy="3" r="2.2" fill="${c.d}"/><circle cx="9" cy="9" r="2.2" fill="${c.d}"/>`);
    return `${shadow(d, 400, 638, 360, 34)}
    <rect x="442" y="214" width="250" height="400" rx="34" fill="${metal(d, colors.graphite, 0, 0, 1, 1)}"/>
    <circle cx="567" cy="344" r="92" fill="#0d0f15"/><circle cx="567" cy="344" r="62" fill="${d.rad([[0, "#3a404d"], [1, "#0d0f15"]])}"/><circle cx="567" cy="344" r="18" fill="#535a69"/>
    <rect x="46" y="478" width="708" height="130" rx="42" fill="${fabric}"/>
    <rect x="46" y="478" width="708" height="130" rx="42" fill="${d.grad([[0, "rgba(255,255,255,.26)"], [0.45, "rgba(255,255,255,0)"], [1, "rgba(0,0,0,.45)"]], 0, 0, 0, 1)}"/>
    ${led(400, 586, 5, "#fff")}`;
  },
  laptop(d, c, o) {
    return `${shadow(d, 400, 650, 370, 34)}
    <rect x="130" y="150" width="540" height="372" rx="24" fill="${metal(d, c, 0, 0, 1, 1)}"/>
    <rect x="140" y="160" width="520" height="352" rx="16" fill="#07080d"/>
    ${wallpaper(d, 150, 170, 500, 332, 10, o.hue ?? "plum")}
    <circle cx="400" cy="165" r="3.5" fill="#2a2f3b"/>
    <path d="M120 522h560l54 92q6 14-14 14H80q-20 0-14-14z" fill="${metal(d, c, 0, 0, 1, 0)}"/>
    <path d="M66 616h668q6 14-14 14H80q-20 0-14-14z" fill="${c.d}"/>
    ${[0, 1, 2, 3].map((r) => `<path d="M${148 - r * 11} ${532 + r * 14}h${504 + r * 22}l3 10H${145 - r * 11}z" fill="#14161d" opacity=".82"/>`).join("")}
    <path d="M336 592h128l6 20H330z" fill="${c.d}" opacity=".3"/>`;
  },
  mouse(d, c) {
    return `${shadow(d, 410, 672, 186, 34)}
    <g transform="rotate(14 400 400)">
      <path d="M400 118c130 0 186 102 186 262 0 176-70 296-186 296S214 556 214 380c0-160 56-262 186-262z" fill="${c.d}"/>
      <path d="M400 112c124 0 178 100 178 258 0 174-66 294-178 294S222 544 222 370c0-158 54-258 178-258z" fill="${metal(d, c, 0, 0, 1, 1)}"/>
      <path d="M400 112v230" stroke="${c.d}" stroke-width="5"/>
      <path d="M224 350c54 22 298 22 352 0" fill="none" stroke="${c.d}" stroke-width="5"/>
      <rect x="376" y="176" width="48" height="104" rx="24" fill="#0d0f15"/>
      <rect x="388" y="188" width="24" height="80" rx="12" fill="${d.grad([[0, "#6c7485"], [1, "#2c3039"]], 0, 0, 0, 1)}"/>
      <path d="M264 150q70-30 120-30" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="10" stroke-linecap="round"/>
      ${led(400, 420, 5, "#7fa0ff")}
    </g>`;
  },
  keyboard(d, c) {
    const accent = new Set(["0-0", "4-6", "1-13", "2-13", "3-13"]);
    let keys = "";
    for (let r = 0; r < 5; r++) {
      for (let k = 0; k < 14; k++) {
        if (r === 4 && k > 3 && k < 9) continue;
        const fill = accent.has(`${r}-${k}`) ? colors.blue : c;
        keys += `<rect x="${86 + k * 46}" y="${274 + r * 50}" width="40" height="44" rx="9" fill="${fill.d}"/>
        <rect x="${88 + k * 46}" y="${274 + r * 50}" width="36" height="37" rx="7" fill="${metal(d, fill, 0, 0, 1, 1)}"/>`;
      }
    }
    keys += `<rect x="270" y="474" width="228" height="44" rx="9" fill="${c.d}"/><rect x="272" y="474" width="224" height="37" rx="7" fill="${metal(d, c, 0, 0, 1, 1)}"/>`;
    return `${shadow(d, 400, 590, 372, 32)}
    <g transform="rotate(-5 400 400)">
      <rect x="62" y="250" width="676" height="296" rx="28" fill="${colors.graphite.d}"/>
      <rect x="62" y="246" width="676" height="292" rx="28" fill="${metal(d, colors.graphite, 0, 0, 1, 1)}"/>
      ${keys}
    </g>`;
  },
  hub(d, c) {
    return `${shadow(d, 400, 560, 340, 30)}
    <path d="M640 356c80-20 110-120 60-190" fill="none" stroke="#1d2029" stroke-width="16" stroke-linecap="round"/>
    <rect x="662" y="118" width="52" height="66" rx="12" fill="${metal(d, c, 0, 0, 1, 0)}" transform="rotate(-26 688 150)"/>
    <g transform="rotate(-6 400 420)">
      <rect x="90" y="326" width="620" height="200" rx="44" fill="${c.d}"/>
      <rect x="90" y="318" width="620" height="196" rx="42" fill="${metal(d, c, 0, 0, 1, 1)}"/>
      <rect x="120" y="344" width="560" height="44" rx="20" fill="#fff" opacity=".1"/>
      <rect x="134" y="420" width="88" height="42" rx="7" fill="#0b0c11"/><rect x="146" y="432" width="64" height="9" fill="#5a6172"/>
      <rect x="240" y="420" width="88" height="42" rx="7" fill="#0b0c11"/><rect x="252" y="432" width="64" height="9" fill="#3a55f0"/>
      ${usbC(350, 432, 70)}${usbC(436, 432, 70)}
      <rect x="524" y="420" width="62" height="42" rx="7" fill="#0b0c11"/>
      <rect x="602" y="424" width="66" height="30" rx="5" fill="#0b0c11"/>
      ${led(650, 366, 5, "#59e0a4")}
    </g>`;
  },
  watch(d, c, o) {
    const strap = o.strap ? colors[o.strap] : c;
    const dial = `
      <circle cx="400" cy="400" r="${o.round ? 112 : 104}" fill="none" stroke="#1d2433" stroke-width="16"/>
      <circle cx="400" cy="400" r="${o.round ? 112 : 104}" fill="none" stroke="#ff5a44" stroke-width="16" stroke-linecap="round" stroke-dasharray="500 800" transform="rotate(-90 400 400)"/>
      <circle cx="400" cy="400" r="${o.round ? 90 : 82}" fill="none" stroke="#1d2433" stroke-width="16"/>
      <circle cx="400" cy="400" r="${o.round ? 90 : 82}" fill="none" stroke="#59e0a4" stroke-width="16" stroke-linecap="round" stroke-dasharray="300 800" transform="rotate(-90 400 400)"/>
      <text x="400" y="414" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="500" font-size="44" fill="#fff">10:08</text>
      <text x="400" y="444" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="17" fill="#7fa0ff">8,412 steps</text>`;
    const face = o.round
      ? `<circle cx="400" cy="400" r="180" fill="${metal(d, c, 0, 0, 1, 1)}"/>
         ${o.rugged ? Array.from({ length: 24 }, (_, i) => `<rect x="396" y="226" width="8" height="18" rx="3" fill="${c.d}" transform="rotate(${i * 15} 400 400)"/>`).join("") : ""}
         <circle cx="400" cy="400" r="${o.rugged ? 150 : 162}" fill="#07080d"/>`
      : `<rect x="238" y="222" width="324" height="356" rx="86" fill="${metal(d, c, 0, 0, 1, 1)}"/>
         <rect x="252" y="236" width="296" height="328" rx="72" fill="#07080d"/>`;
    return `${shadow(d, 400, 745, 180, 24)}
    <path d="M300 280L318 54q2-14 18-14h128q16 0 18 14l18 226z" fill="${metal(d, strap, 0, 0, 1, 0)}"/>
    <path d="M300 520l18 226q2 14 18 14h128q16 0 18-14l18-226z" fill="${metal(d, strap, 0, 0, 1, 0)}"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="388" y="${620 + i * 30}" width="24" height="12" rx="6" fill="${strap.d}"/>`).join("")}
    ${face}${dial}
    <rect x="${o.round ? 578 : 560}" y="360" width="26" height="62" rx="10" fill="${metal(d, c, 0, 0, 0, 1)}"/>
    <path d="M300 268q60-40 130-44" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="7" stroke-linecap="round"/>`;
  },
  band(d, c) {
    return `${shadow(d, 400, 716, 170, 28)}
    <path d="M400 90c150 0 210 130 210 310S550 710 400 710 190 580 190 400 250 90 400 90z" fill="none" stroke="${c.d}" stroke-width="82"/>
    <path d="M400 90c150 0 210 130 210 310S550 710 400 710 190 580 190 400 250 90 400 90z" fill="none" stroke="${metal(d, c, 0, 0, 1, 0)}" stroke-width="70"/>
    <rect x="310" y="196" width="180" height="408" rx="76" fill="${metal(d, colors.graphite, 0, 0, 1, 1)}"/>
    <rect x="322" y="208" width="156" height="384" rx="66" fill="#07080d"/>
    <text x="400" y="366" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="500" font-size="60" fill="#fff">10</text>
    <text x="400" y="426" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="500" font-size="60" fill="#fff">08</text>
    <path d="M382 484c-18-14-30-22-30-38 0-22 28-26 48-8 20-18 48-14 48 8 0 16-12 24-30 38l-18 14z" fill="#ff5a44"/>`;
  },
  powerstrip(d, c, o) {
    const n = o.outlets ?? 4;
    const step = 118;
    const total = (n - 1) * step;
    return `${shadow(d, 400, 590, 350, 32)}
    <path d="M90 430C10 470 20 590 110 620" fill="none" stroke="${c.d}" stroke-width="18" stroke-linecap="round"/>
    <g transform="rotate(-8 400 400)">
      <rect x="60" y="294" width="680" height="218" rx="48" fill="${c.d}"/>
      <rect x="60" y="286" width="680" height="214" rx="46" fill="${metal(d, c, 0, 0, 1, 1)}"/>
      ${Array.from({ length: n }, (_, i) => socket(500 - total + i * step, 394, 47, c)).join("")}
      <rect x="582" y="346" width="42" height="96" rx="10" fill="#d4372c"/><rect x="588" y="352" width="30" height="44" rx="6" fill="#f26255"/>
      ${o.usb ? `${usbC(644, 366, 58)}${usbC(644, 402, 58)}` : led(664, 394, 7, "#59e0a4")}
    </g>`;
  },
  adapter(d, c) {
    return `${shadow(d, 400, 664, 240, 32)}
    <path d="M186 332l214-94 214 94-214 94z" fill="${c.l}"/>
    <path d="M186 332v234q0 14 14 22l200 86V426z" fill="${metal(d, c, 0, 0, 1, 1)}"/>
    <path d="M614 332v234q0 14-14 22l-200 86V426z" fill="${c.d}"/>
    <g transform="translate(0 0) skewY(23)"><g transform="translate(0 -118)">
      ${socket(292, 488, 74, c)}
    </g></g>
    <g transform="skewY(-23)"><g transform="translate(0 322)">
      ${usbC(462, 184, 72)}${usbC(462, 218, 72)}
      <rect x="470" y="264" width="56" height="26" rx="12" fill="${colors.blue.b}"/>
      <rect x="506" y="268" width="17" height="18" rx="7" fill="#fff"/>
    </g></g>
    <rect x="340" y="120" width="22" height="130" rx="11" fill="${d.grad([[0, "#f3f4f7"], [1, "#8b93a1"]], 0, 0, 1, 0)}"/>
    <rect x="438" y="120" width="22" height="130" rx="11" fill="${d.grad([[0, "#f3f4f7"], [1, "#8b93a1"]], 0, 0, 1, 0)}"/>`;
  },
  bulb(d, c, o) {
    const glow = o.warm ? "#ffc861" : "#7f9bff";
    const glow2 = o.warm ? "#ffe9b5" : "#ff7ad9";
    return `${shadow(d, 400, 720, 120, 22)}
    <circle cx="400" cy="300" r="290" fill="${d.rad([[0, glow], [1, "rgba(255,255,255,0)"]])}" opacity=".5"/>
    <path d="M400 70c128 0 220 92 220 214 0 86-48 138-84 186-18 24-26 44-28 66H292c-2-22-10-42-28-66-36-48-84-100-84-186 0-122 92-214 220-214z" fill="${d.grad([[0, glow2], [0.55, "#fff"], [1, glow]], 0, 0, 1, 1)}"/>
    <path d="M250 180q50-70 130-74" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".85"/>
    <rect x="290" y="534" width="220" height="34" rx="14" fill="${metal(d, c, 0, 0, 1, 0)}"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${302 + i * 5}" y="${572 + i * 30}" width="${196 - i * 10}" height="24" rx="11" fill="${metal(d, colors.silver, 0, 0, 1, 0)}"/>`).join("")}
    <path d="M336 692h128l-34 34h-60z" fill="#242833"/>`;
  },
  ledstrip(d, c) {
    const path = "M120 620c120-160 200 60 300-90s-120-200 40-290 220 40 230 120";
    const rainbow = d.grad([[0, "#3a55f0"], [0.3, "#a64df5"], [0.55, "#f0509b"], [0.8, "#ff9a3d"], [1, "#4fd1c5"]], 0, 1, 1, 0);
    return `${shadow(d, 390, 680, 300, 30, 0.22)}
    <path d="${path}" fill="none" stroke="${rainbow}" stroke-width="84" stroke-linecap="round" opacity=".2"/>
    <path d="${path}" fill="none" stroke="${c.b}" stroke-width="38" stroke-linecap="round"/>
    <path d="${path}" fill="none" stroke="${rainbow}" stroke-width="26" stroke-linecap="round"/>
    <path d="${path}" fill="none" stroke="#fff" stroke-width="13" stroke-dasharray="1 30" stroke-linecap="round"/>
    <rect x="64" y="600" width="126" height="84" rx="20" fill="${metal(d, colors.graphite, 0, 0, 1, 1)}"/>
    ${led(127, 642, 7, "#59e0a4")}`;
  },
  lamp(d, c) {
    return `${shadow(d, 340, 702, 210, 26)}
    <ellipse cx="520" cy="470" rx="250" ry="250" fill="${d.rad([[0, "rgba(255,214,130,.5)"], [1, "rgba(255,214,130,0)"]])}"/>
    <ellipse cx="340" cy="668" rx="136" ry="32" fill="${c.d}"/>
    <ellipse cx="340" cy="658" rx="136" ry="32" fill="${metal(d, c, 0, 0, 1, 0.4)}"/>
    <path d="M340 654L250 380 480 200" fill="none" stroke="${c.d}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M340 654L250 380 480 200" fill="none" stroke="${metal(d, c, 0, 0, 1, 0)}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="250" cy="380" r="20" fill="${c.d}"/><circle cx="250" cy="380" r="9" fill="${c.l}"/>
    <g transform="rotate(14 480 210)">
      <rect x="300" y="176" width="420" height="58" rx="28" fill="${metal(d, c, 0, 0, 1, 1)}"/>
      <rect x="326" y="224" width="368" height="14" rx="7" fill="#fff4d6"/>
    </g>
    ${led(340, 656, 6, "#ffd27a")}`;
  },
  plug(d, c) {
    return `${shadow(d, 410, 666, 230, 30)}
    <rect x="600" y="340" width="86" height="26" rx="13" fill="${d.grad([[0, "#f3f4f7"], [1, "#8b93a1"]], 0, 0, 0, 1)}"/>
    <rect x="600" y="430" width="86" height="26" rx="13" fill="${d.grad([[0, "#f3f4f7"], [1, "#8b93a1"]], 0, 0, 0, 1)}"/>
    <rect x="166" y="184" width="460" height="460" rx="110" fill="${c.d}"/>
    <rect x="154" y="176" width="460" height="456" rx="106" fill="${metal(d, c, 0, 0, 1, 1)}"/>
    <path d="M196 214h130L196 440z" fill="#fff" opacity=".28"/>
    ${socket(384, 396, 136, c)}
    <circle cx="536" cy="566" r="30" fill="${c.d}" opacity=".35"/><circle cx="536" cy="564" r="24" fill="${c.l}"/>
    <circle cx="536" cy="564" r="24" fill="none" stroke="#3a55f0" stroke-width="5"/>`;
  },
  cam(d, c) {
    return `${shadow(d, 400, 708, 200, 28)}
    <ellipse cx="400" cy="672" rx="150" ry="36" fill="${c.d}"/>
    <ellipse cx="400" cy="662" rx="150" ry="36" fill="${metal(d, c, 0, 0, 1, 0.4)}"/>
    <rect x="372" y="520" width="56" height="140" fill="${metal(d, c, 0, 0, 1, 0)}"/>
    <circle cx="400" cy="340" r="214" fill="${c.d}"/>
    <circle cx="400" cy="332" r="210" fill="${d.rad([[0, c.l], [0.6, c.b], [1, c.d]])}"/>
    <circle cx="400" cy="332" r="146" fill="#0a0b11"/>
    ${lens(d, 400, 332, 96)}
    ${led(400, 212, 5, "#59e0a4")}
    <path d="M250 196q60-60 140-68" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="12" stroke-linecap="round"/>`;
  },
  doorbell(d, c) {
    return `${shadow(d, 400, 740, 150, 22)}
    <rect x="262" y="52" width="288" height="684" rx="110" fill="${c.d}"/>
    <rect x="256" y="46" width="288" height="680" rx="106" fill="${metal(d, c, 0, 0, 1, 1)}"/>
    <rect x="280" y="72" width="240" height="330" rx="86" fill="#0a0b11"/>
    ${lens(d, 400, 214, 76)}
    ${led(340, 340, 5, "#7fa0ff")}${led(460, 340, 5, "#7fa0ff")}
    <circle cx="400" cy="560" r="96" fill="${c.d}" opacity=".3"/>
    <circle cx="400" cy="556" r="92" fill="none" stroke="#5a7bff" stroke-width="12"/>
    <circle cx="400" cy="556" r="104" fill="none" stroke="#5a7bff" stroke-width="16" opacity=".2"/>
    <circle cx="400" cy="556" r="66" fill="${metal(d, c, 1, 1, 0, 0)}"/>`;
  },
  thermostat(d, c) {
    return `${shadow(d, 400, 690, 240, 26)}
    <circle cx="400" cy="392" r="280" fill="${c.d}"/>
    <circle cx="400" cy="382" r="276" fill="${metal(d, c, 0, 0, 1, 1)}"/>
    <circle cx="400" cy="382" r="224" fill="#090b12"/>
    <circle cx="400" cy="382" r="186" fill="none" stroke="#1e2436" stroke-width="20" stroke-dasharray="4 11"/>
    <path d="M222 438A186 186 0 0 1 514 236" fill="none" stroke="${d.grad([[0, "#3a8bff"], [1, "#59e0d0"]], 0, 1, 1, 0)}" stroke-width="20" stroke-linecap="round"/>
    <text x="400" y="424" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="300" font-size="122" fill="#fff">24°</text>
    <text x="400" y="472" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#7fc4ff">Cooling</text>`;
  },
  router(d, c, o) {
    const n = o.antennas ?? 4;
    const xs = Array.from({ length: n }, (_, i) => 150 + (i * 500) / (n - 1));
    return `${shadow(d, 400, 650, 350, 30)}
    ${xs.map((x, i) => `<rect x="${x - 17}" y="130" width="34" height="340" rx="17" fill="${metal(d, c, 0, 0, 1, 0)}" transform="rotate(${(i - (n - 1) / 2) * 6} ${x} 460)"/>`).join("")}
    <path d="M120 440h560q30 0 40 28l26 112q6 40-34 40H88q-40 0-34-40l26-112q10-28 40-28z" fill="${metal(d, c, 0, 0, 1, 1)}"/>
    <path d="M60 584h680q6 36-34 36H94q-40 0-34-36z" fill="${c.d}"/>
    ${d.slats(150, 468, 500, 44, c)}
    ${[0, 1, 2, 3, 4].map((i) => led(286 + i * 57, 552, 6, i === 4 ? "#7fa0ff" : "#59e0a4")).join("")}`;
  },
  mesh(d, c) {
    const tower = (x, y, w, h) => `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.3}" fill="${c.d}"/>
      <rect x="${x + 3}" y="${y}" width="${w - 6}" height="${h - 6}" rx="${w * 0.28}" fill="${metal(d, c, 0, 0, 1, 0.8)}"/>
      <ellipse cx="${x + w / 2}" cy="${y + w * 0.2}" rx="${w * 0.3}" ry="${w * 0.06}" fill="${c.d}" opacity=".3"/>
      ${led(x + w / 2, y + h - 44, 6, "#7fa0ff")}`;
    return `${shadow(d, 400, 690, 340, 32)}
    ${tower(96, 300, 200, 370)}${tower(504, 300, 200, 370)}${tower(282, 200, 236, 490)}`;
  },
  switch(d, c) {
    const port = (x, y) => `<rect x="${x}" y="${y}" width="56" height="50" rx="6" fill="#0a0b11"/><rect x="${x + 16}" y="${y + 37}" width="24" height="9" fill="#0a0b11" stroke="#333a48" stroke-width="1.5"/><path d="M${x + 8} ${y + 8}h40v8H${x + 8}z" fill="#c9a24b" opacity=".85"/>`;
    return `${shadow(d, 400, 590, 360, 30)}
    <g transform="rotate(-5 400 400)">
      <rect x="50" y="288" width="700" height="248" rx="22" fill="${c.d}"/>
      <rect x="50" y="280" width="700" height="246" rx="20" fill="${metal(d, c, 0, 0, 1, 1)}"/>
      <rect x="74" y="308" width="652" height="10" rx="5" fill="#fff" opacity=".08"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => port(100 + i * 70, 396)).join("")}
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => led(128 + i * 70, 366, 5, i % 3 === 2 ? "#ffb35c" : "#59e0a4")).join("")}
    </g>`;
  },
};
