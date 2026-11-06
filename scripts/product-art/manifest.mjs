// slug -> [drawer, colourway, opts]. Slugs must match src/data/products.ts.
export const manifest = {
  // Smartphones
  "aurex-nova-9-pro": ["phone", "midnight", { cams: 3, hue: "blue" }],
  "aurex-nova-9": ["phone", "sand", { cams: 2, hue: "sunset" }],
  "kestrel-x5-ultra": ["phone", "graphite", { cams: 3, hue: "plum" }],
  "kestrel-a3-lite": ["phone", "teal", { cams: 1, hue: "teal" }],
  // Mobile accessories
  "pivot-magring-clear-case": ["case", "blue"],
  "pivot-silicone-case": ["case", "coral"],
  "pivot-armorglass-screen-shield": ["glass", "silver"],
  "pivot-fold-aluminium-stand": ["mount", "silver"],
  // Chargers & cables
  "fluxon-gan-65w-charger": ["charger", "white", { ports: 2 }],
  "fluxon-gan-140w-desktop-charger": ["charger", "graphite", { ports: 3 }],
  "fluxon-braid-100w-usb-c-cable": ["cable", "blue"],
  "fluxon-trio-3-in-1-wireless-stand": ["pad", "graphite"],
  // Power banks
  "voltaik-slim-10000": ["powerbank", "silver", { slim: true, pct: "86" }],
  "voltaik-go-20000": ["powerbank", "graphite", { pct: "98" }],
  "voltaik-snap-5000-magnetic": ["powerbank", "coral", { slim: true, magnetic: true, pct: "72" }],
  "voltaik-titan-27000": ["powerbank", "midnight", { tall: true, pct: "100" }],
  // Headphones & earbuds
  "aurex-quiet-one-anc-headphones": ["headphones", "graphite"],
  "aurex-studio-m2-headphones": ["headphones", "sand"],
  "aurex-pods-air-earbuds": ["earbuds", "white"],
  "aurex-pods-sport-earbuds": ["earbuds", "teal"],
  // Speakers
  "resona-roam-portable-speaker": ["speaker", "blue"],
  "resona-pebble-mini-speaker": ["speaker", "coral"],
  "resona-arc-5-1-soundbar": ["soundbar", "graphite"],
  "resona-home-smart-speaker": ["speaker", "graphite", { tall: true }],
  // Laptops & computer accessories
  "tessel-air-14-laptop": ["laptop", "silver", { hue: "blue" }],
  "tessel-pro-16-laptop": ["laptop", "graphite", { hue: "plum" }],
  "tessel-glide-wireless-mouse": ["mouse", "graphite"],
  "tessel-keys-75-mechanical-keyboard": ["keyboard", "silver"],
  "tessel-dock-9-in-1-usb-c-hub": ["hub", "silver"],
  // Smart watches
  "orbis-halo-2-smartwatch": ["watch", "silver", { round: true, strap: "midnight" }],
  "orbis-square-s-smartwatch": ["watch", "graphite", { strap: "coral" }],
  "orbis-terra-rugged-smartwatch": ["watch", "graphite", { round: true, rugged: true, strap: "forest" }],
  "orbis-fit-band-4": ["band", "plum"],
  // Electrical accessories
  "ferro-guard-6-surge-strip": ["powerstrip", "white", { outlets: 4, usb: true }],
  "ferro-desk-4-power-strip": ["powerstrip", "graphite", { outlets: 4 }],
  "ferro-globe-travel-adapter": ["adapter", "white"],
  "ferro-reel-10m-extension": ["powerstrip", "coral", { outlets: 3 }],
  // Lighting
  "lumora-colour-b22-smart-bulb": ["bulb", "white"],
  "lumora-warm-b22-filament-bulb": ["bulb", "sand", { warm: true }],
  "lumora-flow-5m-led-strip": ["ledstrip", "white"],
  "lumora-beam-desk-lamp": ["lamp", "graphite"],
  // Smart home
  "nestwell-plug-mini": ["plug", "white"],
  "nestwell-eye-indoor-camera": ["cam", "white"],
  "nestwell-ring-video-doorbell": ["doorbell", "graphite"],
  "nestwell-climate-ac-controller": ["thermostat", "silver"],
  // Networking
  "meshline-ax7-wifi-7-router": ["router", "graphite", { antennas: 4 }],
  "meshline-home-mesh-3-pack": ["mesh", "white"],
  "meshline-8-port-gigabit-switch": ["switch", "graphite"],
  "meshline-reach-ax3-extender": ["router", "white", { antennas: 2 }],
};
