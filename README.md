# Kanishka Computer & Mobiles: eCommerce prototype

An electronics store for customers in India, focused on Tamil Nadu. A frontend-only prototype built with Next.js (App Router), React, TypeScript and Tailwind CSS. All data is mocked; there is no backend, real authentication or payment processing.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Signing in comes first: every page redirects to `/login` until a session exists, and each role lands in its own area. The login page has one-click demo buttons for all three accounts; the shared demo password is `demo1234`.

| Role | Demo account | Lands on |
| --- | --- | --- |
| Customer | `arun.kumar@example.com` (or any valid email and password, or register) | `/` storefront |
| Employee | `kaviya.rajendran@kanishka.example` | `/employee` portal |
| Admin | `revathi.natarajan@kanishka.example` | `/admin` portal |

Employee accounts are managed in **Admin > Employees**: each row carries a work email, a portal password and portal access (admin or employee), so an employee the admin creates can sign in straight away. Roles are enforced — a customer who opens `/admin` is sent home, an employee who opens `/admin` is sent to `/employee`, and staff opening the customer account area are sent to their portal. One browser holds one session (tabs stay in sync), so use a second browser window in private mode to run two roles side by side.

Everything saves to the browser's localStorage. **Admin > Settings > Reset demo data** clears it.

| Command | Purpose |
| --- | --- |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | Static checks |
| `npm run art` | Regenerate product images after editing `scripts/product-art` |

## Project layout

```
src/
  app/
    (store)/       Storefront, checkout, customer account and content pages
    admin/         Admin portal
    employee/      Employee portal
  components/
    ui/            Design-system primitives: Button, Drawer, Modal, form fields...
    layout/        Header, search, footer, cart drawer
    dashboard/     Shared portal shell, DataTable, KPI cards
    charts/        Line, column and ranked bar charts
    product/       ProductCard, ProductRail, cart and wishlist buttons
    home/ catalog/ product-detail/ cart/ checkout/ account/ content/
    admin/ employee/
  config/site.ts   Brand name, currency, navigation, footer links
  data/            Mock data only
  services/        Async data access; the single seam for a real backend
  stores/          Cart, wishlist and toast state
  lib/             Store primitive, pricing, class helper
  types/           Domain types
```

Design tokens (colors, radii, shadows, animations) live in `src/app/globals.css`.

## Connecting a backend

Components never import from `src/data`. Everything goes through the async functions in `src/services`, which return the types in `src/types`. To go live, replace those function bodies with API calls. Cart and wishlist state sits behind the functions in `src/stores`, so those can move server-side the same way.

## Common changes

- **Rebrand:** edit `src/config/site.ts`, then the logo in `src/components/layout/logo.tsx` and `src/app/icon.svg`.
- **Add a category:** add an entry to `src/data/categories.ts`. The menu, tiles and mobile nav pick it up automatically.
- **Use real product photos:** `Product.images` is a list of URLs, so point it at real files. For remote images, add the host to `images.remotePatterns` in `next.config.ts`.

## India and Tamil Nadu rules

Locale settings live in `src/config/site.ts`: currency, time zone, the seller's home state, GSTIN, the free delivery threshold and EMI limits.

- **GST:** selling prices include GST, so it is extracted from the total and never added on top (`src/lib/tax.ts`). A flat 18% is assumed for every product.
- **CGST + SGST or IGST:** deliveries within Tamil Nadu split 9% + 9%. Other states show 18% IGST.
- **Delivery:** free over ₹999. Otherwise standard is ₹49 across India and next-day is ₹99, within Tamil Nadu only.
- **Payments:** UPI, cards, net banking, no-cost EMI over ₹3,000, and cash on delivery. All simulated.

Before going live, have an accountant confirm the GST rates per product and a lawyer review the legal pages. The GSTIN, phone numbers and store addresses are samples.

## Notes

- **Orders are shared** across customer, admin and employee views through `src/stores/orders.ts`. Admin edits to products, coupons, banners and settings are saved but stay in the admin area: the storefront still reads the seed data.
- **Sign-in is simulated.** Sessions live in localStorage (`src/stores/auth.ts`), staff passwords sit in plain text on the employee records, and any valid email works as a customer. The gates in `src/components/auth/gates.tsx` are client-side only — fine for a prototype, no substitute for real authentication.

- **Tailwind is pinned to 4.3.3.** Version 4.3.4 depends on an ESM-only `magic-string` that fails on Node below 20.17. The pin can be lifted after upgrading Node.
- **Brands and products are fictional,** and product images are generated originals, so the prototype carries no third-party trademarks.
- **Editorial photos** in `public/images/editorial` come from Unsplash under the Unsplash License.
