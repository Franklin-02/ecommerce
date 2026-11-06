import type { Product, ProductTag } from "@/types/catalog";
import { brands } from "./categories";

interface Seed {
  brand: string;
  name: string;
  cat: string;
  price: number;
  was?: number;
  rating: number;
  reviews: number;
  stock: number;
  sold: number;
  added: string;
  tags?: ProductTag[];
  warranty?: number;
  summary: string;
  highlights: string[];
  specs: Record<string, string>;
}

const seeds: Seed[] = [
  // Smartphones
  { brand: "Aurex", name: "Nova 9 Pro", cat: "cat_phones", price: 79999, was: 89999, rating: 4.8, reviews: 2841, stock: 64, sold: 9120, added: "2026-10-14", tags: ["trending", "new"], summary: "A 6.8-inch LTPO flagship with a 200MP periscope camera system and two-day battery life.", highlights: ["200MP main + 5x periscope", "6.8\" 1–120Hz LTPO OLED", "5,200mAh with 80W charging"], specs: { Display: "6.8\" LTPO OLED, 120Hz", Processor: "Octa-core 3nm", Memory: "12GB RAM", Storage: "256GB", Battery: "5,200mAh", Charging: "80W wired, 25W wireless", Rating: "IP68" } },
  { brand: "Aurex", name: "Nova 9", cat: "cat_phones", price: 54999, rating: 4.7, reviews: 1964, stock: 112, sold: 7340, added: "2026-10-14", tags: ["new"], summary: "Flagship performance in a lighter 6.3-inch body with a warm champagne finish.", highlights: ["50MP dual camera", "6.3\" 120Hz OLED", "All-day 4,700mAh battery"], specs: { Display: "6.3\" OLED, 120Hz", Processor: "Octa-core 3nm", Memory: "8GB RAM", Storage: "256GB", Battery: "4,700mAh", Charging: "65W wired", Rating: "IP68" } },
  { brand: "Kestrel", name: "X5 Ultra", cat: "cat_phones", price: 94999, was: 109999, rating: 4.6, reviews: 1205, stock: 8, sold: 3890, added: "2026-08-02", tags: ["deal"], summary: "A titanium-framed camera phone with 1-inch sensor and pro-grade video tools.", highlights: ["1-inch 50MP sensor", "8K video, log recording", "Titanium frame"], specs: { Display: "6.7\" LTPO OLED, 120Hz", Processor: "Octa-core 3nm", Memory: "16GB RAM", Storage: "512GB", Battery: "5,000mAh", Charging: "90W wired, 50W wireless", Rating: "IP69" } },
  { brand: "Kestrel", name: "A3 Lite", cat: "cat_phones", price: 14999, was: 17999, rating: 4.4, reviews: 3512, stock: 240, sold: 12480, added: "2026-05-19", tags: ["deal"], summary: "A dependable everyday dual-SIM 5G phone with a big screen and a battery that lasts.", highlights: ["6.6\" 90Hz display", "5,000mAh battery", "3 years of updates"], specs: { Display: "6.6\" LCD, 90Hz", Processor: "Octa-core 6nm", Memory: "6GB RAM", Storage: "128GB", Battery: "5,000mAh", Charging: "33W wired", Rating: "IP54" } },

  // Mobile accessories
  { brand: "Pivot", name: "MagRing Clear Case", cat: "cat_mobile_acc", price: 899, rating: 4.6, reviews: 4120, stock: 520, sold: 18600, added: "2026-06-11", tags: ["trending"], summary: "A slim, anti-yellow clear case with a magnetic ring and raised camera lip.", highlights: ["Built-in magnetic ring", "3m drop tested", "Anti-yellowing shell"], specs: { Material: "Polycarbonate + TPU", Drop: "3m", Wireless: "Magnetic charging compatible", Fit: "Nova 9 Pro" } },
  { brand: "Pivot", name: "Silicone Case", cat: "cat_mobile_acc", price: 599, was: 899, rating: 4.5, reviews: 2210, stock: 310, sold: 9800, added: "2026-03-08", tags: ["deal"], summary: "Soft-touch silicone with a microfiber lining in a warm coral finish.", highlights: ["Soft-touch finish", "Microfiber lining", "Wireless charging safe"], specs: { Material: "Liquid silicone", Lining: "Microfiber", Wireless: "Compatible", Fit: "Nova 9 Pro" } },
  { brand: "Pivot", name: "ArmorGlass Screen Shield", cat: "cat_mobile_acc", price: 399, rating: 4.7, reviews: 5340, stock: 880, sold: 22100, added: "2026-02-20", summary: "9H tempered glass with an alignment tray that makes a bubble-free fit effortless.", highlights: ["9H tempered glass", "Alignment tray included", "Pack of 2"], specs: { Hardness: "9H", Thickness: "0.33mm", Coating: "Oleophobic", Quantity: "2 pack" } },
  { brand: "Pivot", name: "Fold Aluminium Stand", cat: "cat_mobile_acc", price: 1299, rating: 4.5, reviews: 860, stock: 0, sold: 2400, added: "2026-07-01", summary: "A folding CNC aluminium stand that adjusts through 270 degrees and fits in a pocket.", highlights: ["270° adjustable hinge", "CNC aluminium", "Folds flat"], specs: { Material: "6063 aluminium", Weight: "142g", Compatibility: "4–13\" devices" } },

  // Chargers & cables
  { brand: "Fluxon", name: "GaN 65W Charger", cat: "cat_chargers", price: 2499, was: 3299, rating: 4.8, reviews: 6230, stock: 430, sold: 24300, added: "2026-04-02", tags: ["trending", "deal"], summary: "Two-port GaN charger that can run a laptop and phone at once, at half the size of a stock brick.", highlights: ["65W USB-C PD 3.1", "2 ports, smart power split", "Foldable prongs"], specs: { Output: "65W max", Ports: "2× USB-C", Standard: "PD 3.1, PPS", Weight: "112g" } },
  { brand: "Fluxon", name: "GaN 140W Desktop Charger", cat: "cat_chargers", price: 5999, rating: 4.7, reviews: 1480, stock: 96, sold: 4100, added: "2026-09-21", tags: ["new"], summary: "A three-port desktop charger with enough power for a 16-inch laptop and two more devices.", highlights: ["140W USB-C PD", "3 ports", "Active temperature control"], specs: { Output: "140W max", Ports: "3× USB-C", Standard: "PD 3.1 EPR", Weight: "285g" } },
  { brand: "Fluxon", name: "Braid 100W USB-C Cable", cat: "cat_chargers", price: 799, rating: 4.8, reviews: 8120, stock: 1200, sold: 31200, added: "2026-01-15", summary: "A 2m double-braided nylon cable tested to 30,000 bends and rated for 100W.", highlights: ["100W power delivery", "30,000-bend rated", "2m length"], specs: { Length: "2m", Power: "100W", Data: "480Mbps", Jacket: "Double-braided nylon" } },
  { brand: "Fluxon", name: "Trio 3-in-1 Wireless Stand", cat: "cat_chargers", price: 4999, was: 6999, rating: 4.5, reviews: 1730, stock: 74, sold: 5120, added: "2026-07-27", tags: ["trending", "deal"], summary: "Charge a phone, watch and earbuds from one tidy nightstand base.", highlights: ["15W magnetic phone charging", "Watch and earbuds pads", "Soft night-mode LED"], specs: { Phone: "15W magnetic", Watch: "5W", Earbuds: "5W", Input: "USB-C, 36W adapter included" } },

  // Power banks
  { brand: "Voltaik", name: "Slim 10000", cat: "cat_power_banks", price: 1499, rating: 4.6, reviews: 3910, stock: 280, sold: 14200, added: "2026-03-30", summary: "A wallet-thin 10,000mAh pack with a live percentage display.", highlights: ["10,000mAh", "22.5W fast charging", "13mm thin"], specs: { Capacity: "10,000mAh", Output: "22.5W", Ports: "2× USB-C", Weight: "198g" } },
  { brand: "Voltaik", name: "Go 20000", cat: "cat_power_banks", price: 3299, was: 4299, rating: 4.8, reviews: 5640, stock: 165, sold: 19800, added: "2026-06-22", tags: ["trending", "deal"], summary: "20,000mAh with 65W output charges a laptop to 50% in about 40 minutes.", highlights: ["65W laptop charging", "20,000mAh", "Airline-safe capacity"], specs: { Capacity: "20,000mAh", Output: "65W", Ports: "2× USB-C", Weight: "392g" } },
  { brand: "Voltaik", name: "Snap 5000 Magnetic", cat: "cat_power_banks", price: 1799, rating: 4.4, reviews: 1120, stock: 6, sold: 3210, added: "2026-10-05", tags: ["new"], summary: "Snaps to the back of your phone for a quick wireless top-up on the go.", highlights: ["Magnetic attach", "15W wireless", "Pocket-sized"], specs: { Capacity: "5,000mAh", Output: "15W wireless, 20W wired", Ports: "1× USB-C", Weight: "118g" } },
  { brand: "Voltaik", name: "Titan 27000", cat: "cat_power_banks", price: 8999, was: 10999, rating: 4.7, reviews: 940, stock: 38, sold: 2260, added: "2026-08-18", summary: "A laptop-class 100Wh battery with 140W output that keeps you working through long power cuts.", highlights: ["140W max output", "27,000mAh / 99.9Wh", "Smart status display"], specs: { Capacity: "27,000mAh", Output: "140W", Ports: "2× USB-C, 1× USB-A", Weight: "640g" } },

  // Audio
  { brand: "Aurex", name: "Quiet One ANC Headphones", cat: "cat_audio", price: 19999, was: 26999, rating: 4.9, reviews: 7210, stock: 142, sold: 16700, added: "2026-09-02", tags: ["trending", "deal"], summary: "Class-leading noise cancellation, plush memory-foam cushions and 50 hours of playback.", highlights: ["Adaptive ANC", "50-hour battery", "Spatial audio with head tracking"], specs: { Driver: "40mm dynamic", Battery: "50 hours (ANC on)", Bluetooth: "5.4, multipoint", Weight: "254g" } },
  { brand: "Aurex", name: "Studio M2 Headphones", cat: "cat_audio", price: 13999, rating: 4.6, reviews: 1860, stock: 58, sold: 4300, added: "2026-04-25", summary: "Tuned flat for mixing, comfortable enough for a full day in the studio.", highlights: ["Reference tuning", "Detachable cable", "Foldable design"], specs: { Driver: "45mm dynamic", Impedance: "38Ω", Connection: "3.5mm / Bluetooth 5.3", Weight: "278g" } },
  { brand: "Aurex", name: "Pods Air Earbuds", cat: "cat_audio", price: 6999, was: 8999, rating: 4.7, reviews: 9320, stock: 410, sold: 28900, added: "2026-07-09", tags: ["trending"], summary: "Compact true wireless earbuds with hybrid ANC and a case smaller than a matchbox.", highlights: ["Hybrid ANC", "32 hours with case", "IPX5 sweat resistance"], specs: { Driver: "11mm", Battery: "8h + 24h case", Bluetooth: "5.4", Rating: "IPX5" } },
  { brand: "Aurex", name: "Pods Sport Earbuds", cat: "cat_audio", price: 3999, rating: 4.4, reviews: 2140, stock: 196, sold: 7650, added: "2026-10-22", tags: ["new"], summary: "Secure-fit earbuds with IP57 protection for runs, rides and rain.", highlights: ["Secure ear-wing fit", "IP57 rated", "Ambient awareness mode"], specs: { Driver: "10mm", Battery: "9h + 27h case", Bluetooth: "5.3", Rating: "IP57" } },

  // Speakers
  { brand: "Resona", name: "Roam Portable Speaker", cat: "cat_speakers", price: 7499, was: 9999, rating: 4.7, reviews: 3480, stock: 134, sold: 11200, added: "2026-06-03", tags: ["trending"], summary: "Big 360-degree sound from a waterproof speaker that shrugs off the monsoon.", highlights: ["IP67 waterproof", "24-hour battery", "Stereo pairing"], specs: { Output: "30W", Battery: "24 hours", Bluetooth: "5.3", Rating: "IP67" } },
  { brand: "Resona", name: "Pebble Mini Speaker", cat: "cat_speakers", price: 2499, rating: 4.5, reviews: 2760, stock: 3, sold: 8420, added: "2026-02-11", summary: "A surprisingly loud clip-on speaker that fits in a jacket pocket.", highlights: ["10-hour battery", "Clip-on strap", "IP67 rated"], specs: { Output: "8W", Battery: "10 hours", Bluetooth: "5.3", Weight: "210g" } },
  { brand: "Resona", name: "Arc 5.1 Soundbar", cat: "cat_speakers", price: 29999, was: 39999, rating: 4.6, reviews: 1290, stock: 27, sold: 2980, added: "2026-09-15", tags: ["deal"], summary: "Cinema-grade 5.1 sound with a wireless subwoofer and spatial audio support.", highlights: ["5.1 channels, 420W", "Wireless subwoofer", "HDMI eARC"], specs: { Channels: "5.1", Output: "420W", Inputs: "HDMI eARC, Optical, Bluetooth", Subwoofer: "8\" wireless" } },
  { brand: "Resona", name: "Home Smart Speaker", cat: "cat_speakers", price: 7999, rating: 4.3, reviews: 1640, stock: 88, sold: 3950, added: "2026-10-28", tags: ["new"], summary: "Room-filling sound with a built-in voice assistant and multi-room support.", highlights: ["Voice assistant built in", "Multi-room audio", "Room-adaptive tuning"], specs: { Drivers: "Woofer + 2 tweeters", Connectivity: "WiFi 6, Bluetooth 5.3", Power: "Mains", Height: "20cm" } },

  // Computing
  { brand: "Tessel", name: "Air 14 Laptop", cat: "cat_computing", price: 84999, was: 99999, rating: 4.7, reviews: 1630, stock: 46, sold: 5320, added: "2026-09-09", tags: ["trending", "deal"], warranty: 36, summary: "A 1.1kg aluminium ultrabook with a colour-accurate display and 18-hour battery.", highlights: ["14\" 2.8K OLED", "18-hour battery", "1.1kg magnesium-aluminium body"], specs: { Display: "14\" 2.8K OLED, 120Hz", Processor: "12-core mobile", Memory: "16GB LPDDR5X", Storage: "1TB NVMe", Weight: "1.1kg", Ports: "2× USB4, USB-A, HDMI" } },
  { brand: "Tessel", name: "Pro 16 Laptop", cat: "cat_computing", price: 149999, rating: 4.8, reviews: 780, stock: 12, sold: 1860, added: "2026-10-30", tags: ["new"], warranty: 36, summary: "Workstation power with a 16-inch mini-LED display for creators and developers.", highlights: ["16\" mini-LED, 165Hz", "32GB RAM", "Dedicated 8GB graphics"], specs: { Display: "16\" mini-LED, 165Hz", Processor: "16-core mobile", Memory: "32GB LPDDR5X", Storage: "2TB NVMe", Graphics: "8GB dedicated", Weight: "2kg" } },
  { brand: "Tessel", name: "Glide Wireless Mouse", cat: "cat_computing", price: 2499, rating: 4.6, reviews: 2980, stock: 215, sold: 9600, added: "2026-05-05", summary: "A quiet-click ergonomic mouse that pairs with three devices at once.", highlights: ["Silent clicks", "3-device switching", "90-day battery"], specs: { Sensor: "8,000 DPI", Connection: "Bluetooth, 2.4GHz", Battery: "90 days", Weight: "96g" } },
  { brand: "Tessel", name: "Keys 75 Mechanical Keyboard", cat: "cat_computing", price: 7999, was: 9999, rating: 4.7, reviews: 1410, stock: 71, sold: 3740, added: "2026-08-26", tags: ["deal"], summary: "A compact gasket-mounted board with hot-swap switches and a satisfying, muted sound.", highlights: ["Hot-swappable switches", "Gasket mounted", "Wireless + USB-C"], specs: { Layout: "75%", Switches: "Linear, hot-swap", Connection: "Bluetooth, 2.4GHz, USB-C", Battery: "4,000mAh" } },
  { brand: "Tessel", name: "Dock 9-in-1 USB-C Hub", cat: "cat_computing", price: 3999, rating: 4.5, reviews: 2250, stock: 148, sold: 6810, added: "2026-03-17", summary: "One cable for dual 4K displays, gigabit Ethernet and everything else on your desk.", highlights: ["Dual 4K HDMI", "100W pass-through", "Gigabit Ethernet"], specs: { Video: "2× HDMI 4K60", Data: "USB-C 10Gbps, 3× USB-A", Network: "1Gbps Ethernet", Power: "100W pass-through" } },

  // Watches
  { brand: "Orbis", name: "Halo 2 Smartwatch", cat: "cat_watches", price: 21999, was: 26999, rating: 4.7, reviews: 3120, stock: 92, sold: 8760, added: "2026-09-27", tags: ["trending"], summary: "A round sapphire-glass smartwatch with ECG, dual-band GPS and a 5-day battery.", highlights: ["ECG and SpO2 sensors", "Dual-band GPS", "5-day battery"], specs: { Display: "1.43\" AMOLED", Case: "45mm stainless steel", Battery: "5 days", Rating: "5ATM + IP68" } },
  { brand: "Orbis", name: "Square S Smartwatch", cat: "cat_watches", price: 9999, rating: 4.5, reviews: 2470, stock: 133, sold: 6120, added: "2026-06-30", summary: "A bright, lightweight everyday watch with 120 workout modes.", highlights: ["1.9\" AMOLED", "120 workout modes", "Bluetooth calling"], specs: { Display: "1.9\" AMOLED", Case: "42mm aluminium", Battery: "7 days", Rating: "5ATM" } },
  { brand: "Orbis", name: "Terra Rugged Smartwatch", cat: "cat_watches", price: 32999, rating: 4.8, reviews: 960, stock: 5, sold: 2140, added: "2026-10-18", tags: ["new"], summary: "Built for the backcountry, with topo maps, a titanium bezel and a 21-day battery.", highlights: ["Offline topo maps", "21-day battery", "MIL-STD-810H"], specs: { Display: "1.5\" MIP + AMOLED", Case: "48mm titanium", Battery: "21 days", Rating: "10ATM" } },
  { brand: "Orbis", name: "Fit Band 4", cat: "cat_watches", price: 2499, was: 3499, rating: 4.4, reviews: 6830, stock: 380, sold: 17300, added: "2026-04-14", tags: ["deal"], summary: "A featherweight fitness band with sleep tracking and a two-week battery.", highlights: ["14-day battery", "Sleep and stress tracking", "24g featherweight"], specs: { Display: "1.6\" AMOLED", Weight: "24g", Battery: "14 days", Rating: "5ATM" } },

  // Electrical
  { brand: "Ferro", name: "Guard 6 Surge Strip", cat: "cat_electrical", price: 1899, rating: 4.7, reviews: 3620, stock: 210, sold: 10900, added: "2026-05-28", summary: "Four sockets and two USB-C ports with 2,100-joule surge protection for unsteady mains power.", highlights: ["2,100-joule protection", "2× USB-C, 30W", "1.8m heavy-duty cord"], specs: { Sockets: "4 universal + 2 USB-C", Protection: "2,100 joules", Cord: "1.8m", Certified: "BIS certified" } },
  { brand: "Ferro", name: "Desk 4 Power Strip", cat: "cat_electrical", price: 799, was: 1099, rating: 4.5, reviews: 1860, stock: 320, sold: 7200, added: "2026-02-02", summary: "A low-profile graphite strip with widely spaced sockets for bulky adapters.", highlights: ["Wide-spaced sockets", "Illuminated switch", "Wall-mountable"], specs: { Sockets: "4 universal", Rating: "10A / 2,300W", Cord: "1.5m", Certified: "BIS certified" } },
  { brand: "Ferro", name: "Globe Travel Adapter", cat: "cat_electrical", price: 1499, rating: 4.6, reviews: 2410, stock: 176, sold: 6340, added: "2026-07-14", tags: ["trending"], summary: "One adapter for 200+ countries with sliding plugs and fast USB-C.", highlights: ["Works in 200+ countries", "Sliding plug selector", "30W USB-C"], specs: { Regions: "India, US, EU, UK, AU", USB: "2× USB-C, 30W", Fuse: "Replaceable 8A", Weight: "150g" } },
  { brand: "Ferro", name: "Reel 10m Extension", cat: "cat_electrical", price: 1699, rating: 4.3, reviews: 640, stock: 52, sold: 1480, added: "2026-08-08", summary: "A 10m outdoor-rated extension with three sockets and overload protection.", highlights: ["10m cord", "Outdoor rated", "Overload cut-off"], specs: { Length: "10m", Sockets: "3 universal", Rating: "16A", Weather: "IP44" } },

  // Lighting
  { brand: "Lumora", name: "Colour B22 Smart Bulb", cat: "cat_lighting", price: 999, was: 1299, rating: 4.6, reviews: 7420, stock: 640, sold: 26100, added: "2026-03-12", tags: ["deal"], summary: "16 million colours and tunable whites, controlled by app or voice with no hub required.", highlights: ["16M colours", "No hub required", "Works with major voice assistants"], specs: { Base: "B22", Brightness: "1,100 lumens", Power: "9W (75W equivalent)", Connectivity: "WiFi + Bluetooth" } },
  { brand: "Lumora", name: "Warm B22 Filament Bulb", cat: "cat_lighting", price: 249, rating: 4.5, reviews: 1980, stock: 720, sold: 8300, added: "2026-01-29", summary: "Dimmable filament glow with vintage character and modern efficiency.", highlights: ["Dimmable", "2,200K warm glow", "15,000-hour life"], specs: { Base: "B22", Brightness: "600 lumens", Power: "6W (60W equivalent)", Temperature: "2,200K" } },
  { brand: "Lumora", name: "Flow 5m LED Strip", cat: "cat_lighting", price: 2999, rating: 4.4, reviews: 3210, stock: 240, sold: 9740, added: "2026-10-11", tags: ["new", "trending"], summary: "Multi-zone gradient LEDs that sync to music and cut to any length.", highlights: ["Multi-zone gradients", "Music sync", "Cut-to-length"], specs: { Length: "5m", LEDs: "60 per meter", Control: "App, voice, remote", Power: "24W" } },
  { brand: "Lumora", name: "Beam Desk Lamp", cat: "cat_lighting", price: 4499, rating: 4.7, reviews: 1120, stock: 0, sold: 3160, added: "2026-06-17", summary: "A glare-free task lamp with auto-dimming and a built-in wireless charger base.", highlights: ["Auto-dimming sensor", "Flicker-free LEDs", "Wireless charging base"], specs: { Brightness: "1,000 lux at 40cm", Temperature: "2,700–6,500K", Charging: "10W wireless", Power: "18W" } },

  // Smart home
  { brand: "Nestwell", name: "Plug Mini", cat: "cat_smart_home", price: 899, rating: 4.6, reviews: 5120, stock: 590, sold: 19400, added: "2026-02-26", summary: "A compact smart plug with energy monitoring that leaves the second socket free.", highlights: ["Energy monitoring", "Compact design", "Schedules and scenes"], specs: { Rating: "16A, for ACs and geysers", Connectivity: "WiFi, Matter", Monitoring: "Real-time energy", Voice: "Major assistants" } },
  { brand: "Nestwell", name: "Eye Indoor Camera", cat: "cat_smart_home", price: 2499, was: 3499, rating: 4.5, reviews: 2760, stock: 164, sold: 7120, added: "2026-08-12", tags: ["deal"], summary: "2K video with on-device person detection and a physical privacy shutter.", highlights: ["2K HDR video", "On-device AI detection", "Privacy shutter"], specs: { Video: "2K HDR", View: "130°", Storage: "Local or cloud", Audio: "Two-way" } },
  { brand: "Nestwell", name: "Ring Video Doorbell", cat: "cat_smart_home", price: 8999, rating: 4.4, reviews: 1980, stock: 83, sold: 4560, added: "2026-10-08", tags: ["new"], summary: "See who's there in crisp head-to-toe video, with package detection built in.", highlights: ["Head-to-toe 1:1 video", "Package detection", "Wired or battery"], specs: { Video: "1536p HDR", View: "160°", Power: "Wired or 6-month battery", Rating: "IP65" } },
  { brand: "Nestwell", name: "Climate AC Controller", cat: "cat_smart_home", price: 3499, was: 4499, rating: 4.7, reviews: 1460, stock: 61, sold: 3380, added: "2026-09-19", tags: ["trending"], summary: "Puts any split or window AC on your phone, with schedules that trim power bills by up to 20%.", highlights: ["Works with most IR-remote ACs", "Up to 20% power savings", "Turns the AC off when you leave"], specs: { Compatibility: "Most split and window ACs", Display: "2.4\" colour", Connectivity: "WiFi, Matter", Install: "5 minutes, no wiring" } },

  // Networking
  { brand: "Meshline", name: "AX7 WiFi 7 Router", cat: "cat_networking", price: 17999, was: 21999, rating: 4.7, reviews: 1840, stock: 74, sold: 5240, added: "2026-09-30", tags: ["trending"], summary: "Tri-band WiFi 7 at up to 9.3Gbps, with a 2.5G port and built-in security.", highlights: ["Tri-band WiFi 7", "9.3Gbps total speed", "2.5G WAN + LAN"], specs: { Standard: "WiFi 7 (BE9300)", Bands: "Tri-band", Ports: "2× 2.5G, 3× 1G", Coverage: "2,500 sq ft" } },
  { brand: "Meshline", name: "Home Mesh 3-Pack", cat: "cat_networking", price: 21999, was: 27999, rating: 4.6, reviews: 2120, stock: 41, sold: 4120, added: "2026-07-22", tags: ["deal"], summary: "Blanket a large home in fast WiFi 6E, with setup that takes minutes.", highlights: ["Covers 6,500 sq ft", "WiFi 6E", "Setup in 10 minutes"], specs: { Standard: "WiFi 6E (AXE5400)", Units: "3", Ports: "2× 1G per unit", Coverage: "6,500 sq ft" } },
  { brand: "Meshline", name: "8-Port Gigabit Switch", cat: "cat_networking", price: 1699, rating: 4.8, reviews: 3340, stock: 310, sold: 8920, added: "2026-01-08", summary: "Fanless, plug-and-play wired networking in a solid steel case.", highlights: ["8 gigabit ports", "Fanless and silent", "Steel housing"], specs: { Ports: "8× 1G", Switching: "16Gbps", Housing: "Steel", Power: "5W" } },
  { brand: "Meshline", name: "Reach AX3 Extender", cat: "cat_networking", price: 3499, rating: 4.2, reviews: 1460, stock: 128, sold: 3640, added: "2026-05-11", summary: "Pushes your existing WiFi into the dead zones without replacing the router.", highlights: ["WiFi 6, 3Gbps", "One-touch pairing", "Gigabit Ethernet port"], specs: { Standard: "WiFi 6 (AX3000)", Bands: "Dual-band", Ports: "1× 1G", Coverage: "1,500 sq ft" } },
];

/** Country of origin must be shown on Indian e-commerce listings. */
const origin: Record<string, string> = {
  cat_phones: "India",
  cat_chargers: "India",
  cat_power_banks: "India",
  cat_electrical: "India",
  cat_lighting: "India",
  cat_audio: "Vietnam",
};

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const products: Product[] = seeds.map((seed, index) => {
  const slug = slugify(`${seed.brand} ${seed.name}`);
  const brand = brands.find((b) => b.name === seed.brand);
  if (!brand) throw new Error(`Unknown brand in mock data: ${seed.brand}`);
  const number = String(index + 1).padStart(3, "0");
  return {
    id: `prd_${number}`,
    slug,
    sku: `OHM-${seed.brand.slice(0, 3).toUpperCase()}-${number}`,
    name: `${seed.brand} ${seed.name}`,
    brandId: brand.id,
    brandName: brand.name,
    categoryId: seed.cat,
    price: seed.price,
    compareAtPrice: seed.was,
    rating: seed.rating,
    reviewCount: seed.reviews,
    stock: seed.stock,
    unitsSold: seed.sold,
    tags: seed.tags ?? [],
    addedAt: seed.added,
    images: [`/images/products/${slug}.svg`, `/images/products/${slug}-detail.svg`],
    summary: seed.summary,
    highlights: seed.highlights,
    specs: { ...seed.specs, "Country of origin": origin[seed.cat] ?? "China" },
    warrantyMonths: seed.warranty ?? 24,
  };
});
