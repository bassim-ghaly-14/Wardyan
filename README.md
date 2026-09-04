# WARDYAN Store

A lightweight flower-shop storefront built with plain HTML, CSS, and vanilla JavaScript (ES modules). No frameworks, no build step, no backend — products are rendered from a local data file and the cart, coupons, and theme persist in the browser via `localStorage`.

## Overview

WARDYAN is a single-page storefront for a flower delivery business in Egypt. Visitors browse a product grid of bouquets, manage a slide-in cart drawer (quantities, removal, coupon codes), and check out through a simulated modal that validates customer details and confirms the order with an ID. The UI supports light/dark themes and is responsive down to mobile widths.

## Features

All features below are implemented in the current code.

- **Product browsing** — product grid rendered from `js/products.js` (4 hardcoded bouquets, images hosted on Cloudinary).
- **Product cards** — image with consistent 1:1 aspect ratio, name, description, full-width price row, and stacked full-width *Add to Cart* / *Buy Now* buttons. Clicking the card itself opens Product Details.
- **Product details** — a modal showing the product image, name, description, price, and full-width *Add to Cart* / *Buy Now* buttons (reusing the existing cart and checkout logic). Closable via the close button, backdrop click, or Escape, with focus restored to the card on close.
- **Cart** — slide-in drawer with quantity increment/decrement (quantity ≤ 0 removes the item), item removal, clear cart, empty state with a "Go Shopping" shortcut, and a live cart-count badge in the header.
- **Coupons** — hardcoded codes `SAVE10` (10% off) and `WELCOME50` (50 EGP off), applied in the cart with success/error toast feedback.
- **Checkout (simulated)** — modal capturing full name, Egyptian mobile number, and address with client-side validation; generates a random order ID (`ORD-XXXXXX`) and shows a confirmation modal. No real payment processing and orders are not persisted.
- **Theme switching** — light/dark toggle persisted across sessions.
- **Toast notifications** — success/error feedback for coupons, clearing the cart, validation errors, and order confirmation.
- **Responsive layout** — breakpoints at 900px, 768px, 600px, and 480px; the cart drawer becomes full-width on small screens.

Not implemented: search, filtering, sorting, wishlist, authentication (see [Limitations](#limitations)).

## Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (single page, semantic sections) |
| Styling | Hand-written CSS with custom properties (no preprocessor, no framework) |
| Logic | Vanilla JavaScript, native ES modules (`<script type="module">`) |
| Icons | Font Awesome 6.5.1 (CDN) |
| Images | Cloudinary-hosted URLs |
| Persistence | `localStorage` (key `WARDYAN_state`) |
| Build tooling | None |

## Architecture

The app follows a simple layered design:

```
index.html
   └── js/app.js                 (entry point, wires everything together)
        ├── core/store.js        (single source of truth + pub/sub + localStorage)
        ├── modules/             (UI features: cart, checkout, coupons, theme, …)
        ├── core/                (shared utilities: toast, formatting, validation)
        └── products.js          (static product data)
```

- **State management** — `core/store.js` holds a single `state` object (`cart`, `coupon`, `theme`). Mutator functions call `notify()`, which invokes every subscriber and writes the state to `localStorage`. `renderCart` is subscribed to the store, so cart mutations re-render the drawer automatically.
- **Rendering** — plain template-literal `innerHTML` rendering inside dedicated UI modules. No virtual DOM, no component framework.
- **Event handling** — event delegation on the product grid (`product-ui.js`) and the cart items container (`cart.js`), with `data-id` / `data-action` attributes driving cart mutations. A small `core/events.js` delegation helper exists but is not currently imported anywhere.
- **Data flow** — static product data → user clicks Add to Cart → `addToCart(product)` in the store → store notifies subscribers → cart drawer re-renders from state.

### Module reference

| Module | Responsibility | Key exports |
|---|---|---|
| `js/app.js` | Entry point; initializes theme, product details, products, drawer, cart, checkout | — |
| `js/main.js` | Product details modal: renders the selected product and routes its Add to Cart / Buy Now actions to the existing store and checkout | `initProductDetails`, `openProductDetails`, `closeProductDetails` |
| `js/core/store.js` | Central state, pub/sub, localStorage persistence, cart mutations | `addToCart`, `updateQty`, `removeItem`, `clearCart`, `getState`, `subscribe`, `setCoupon`, `setTheme` |
| `js/modules/product-ui.js` | Renders the product grid; delegates add-to-cart / buy-now clicks | `renderProducts` |
| `js/modules/cart.js` | Renders the cart drawer, summary, coupon UI; binds cart events | `renderCart`, `bindCartEvents` |
| `js/modules/coupons.js` | Hardcoded coupon catalog and discount calculation | `applyCoupon`, `calculateDiscount` |
| `js/modules/checkout.js` | Checkout modal, form validation, simulated order placement | `initCheckout`, `openCheckout` |
| `js/modules/theme.js` | Applies and toggles light/dark theme | `initTheme`, `bindThemeToggle` |
| `js/modules/ui.js` | Cart drawer open/close and overlay with scroll lock | `bindDrawer` |
| `js/core/toast.js` | Toast notifications | `showToast` |
| `js/core/utils.js` | Price formatting, element factory, email/phone validation | `formatPrice`, `createElement`, `validateEmail`, `validatePhone` |
| `js/products.js` | Static product data and lookup | `products`, `getProductById` |

## Project Structure

```
Wardyan/
├── index.html              # Single-page storefront (hero, products, about, contact, footer)
├── css/
│   └── master.css          # All styles: tokens, layout, components, themes, responsive rules
├── js/
│   ├── app.js              # Application entry point
│   ├── main.js             # Product details modal (integrated via app.js)
│   ├── products.js         # Static product data
│   ├── core/
│   │   ├── store.js        # State + pub/sub + localStorage
│   │   ├── events.js       # Delegation helper (currently unused)
│   │   ├── toast.js        # Toast notifications
│   │   └── utils.js        # Formatting, DOM helper, validators
│   └── modules/
│       ├── product-ui.js   # Product grid rendering
│       ├── cart.js         # Cart drawer rendering + events
│       ├── coupons.js      # Coupon codes and discounts
│       ├── checkout.js     # Checkout modal + simulated order
│       ├── theme.js        # Light/dark theme
│       └── ui.js           # Drawer open/close
└── README.md
```

## How It Works

### Product details flow

1. Clicking anywhere on a product card (except its action buttons) calls `openProductDetails(card.dataset.id)` in `main.js`.
2. The module renders the product into a modal built with the same dynamic-modal pattern as checkout (`role="dialog"`, `aria-modal`), and locks page scroll while open.
3. *Add to Cart* in the modal calls the same `addToCart(product)` store mutation; *Buy Now* calls the same `openCheckout([{ ...product, quantity: 1 }])` used by the cards. No duplicated cart or checkout logic.
4. The modal closes via its close button, a backdrop click, or the Escape key, restoring focus to the previously focused element.

### Cart flow

1. `Add to Cart` on a product card calls `addToCart(product)` in `core/store.js`.
2. If the product is already in the cart its quantity is incremented; otherwise it is pushed with `quantity: 1`.
3. `notify()` re-renders the cart drawer and writes state to `localStorage`.
4. In the drawer, `+` / `-` buttons call `updateQty` (removing the item at quantity 0), `x` calls `removeItem`, and `Clear Cart` empties the cart and its coupon.

### Checkout flow

1. `Checkout` opens a modal pre-populated with the cart items, coupon, subtotal, discount, and total (passed via dataset on the modal element).
2. `Place Order` validates: name ≥ 3 characters, phone matching Egyptian mobile format `01[0-2,5]XXXXXXXX`, address ≥ 10 characters. Failures show error toasts.
3. On success the cart is cleared, an order ID is generated client-side, and a confirmation modal is shown. **No order is sent to a server or persisted.**

### Data & storage

- `localStorage` key `WARDYAN_state` stores `{ cart, coupon, theme }`. Cart items store the full product object plus `quantity`.
- State loading is wrapped in `try/catch`; corrupted storage falls back to defaults.
- The cart and coupon survive page reloads; the theme is restored on initialization.

## Design System

Defined entirely through CSS custom properties on `:root`:

| Token | Light | Dark |
|---|---|---|
| `--primary` | `#ff4f9a` (pink) | same |
| `--primary-dark` | `#7a0f4a` | same |
| `--bg-primary` | `#ffffff` | `#0f0f0f` |
| `--bg-secondary` | `#f8f9fa` | `#1a1a1a` |
| `--text-primary` / `--text-secondary` | `#1a1a1a` / `#666` | `#ffffff` / `#a3a3a3` |
| `--border` | `#e0e0e0` | `#2a2a2a` |

- Typography: system font stack (`-apple-system`, `Segoe UI`, Roboto, …), sizes 11–56px with `clamp()` for headings.
- Components share a consistent radius scale (6–20px), a two-level shadow system (`--shadow`, `--shadow-lg`), and `translateY` hover elevation on cards.
- Dark theme is applied via a `data-theme="dark"` attribute on `<html>`.
- Notable extras: custom branded scrollbar, `slideUp` modal animation, slide-in toast/drawer transitions.

## Getting Started

### Prerequisites

- Any modern browser.
- A static file server. The app uses native ES modules, which browsers block over `file://` (CORS), so opening `index.html` directly will not work.

### Running locally

No installation step exists — there are no dependencies and no build. Serve the repository root with any static server, for example:

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Then open `http://localhost:8080`.

## Testing

There are no test files, no test framework, and no test scripts in the repository. Verification is manual.

## Deployment

The repository contains no deployment configuration (no `vercel.json`, `netlify.toml`, GitHub Pages workflow, etc.). Because it is a fully static site with no build step, it will run on any static host that serves the repository root as-is — GitHub Pages, Netlify, Vercel, or any web server — without configuration. No environment variables or secrets are required.

## Accessibility

Partially implemented:

- Semantic elements: `<header>`, `<main>`, `<footer>`, `<article>` product cards, and real `<button>` elements throughout.
- Social links carry `aria-label`s; product images have meaningful `alt` text.
- `.btn:focus-visible` shows a clear 2px outline; inputs have visible focus styles.
- Product Details modal uses dialog semantics (`role="dialog"`, `aria-modal="true"`, labeled close button), closes on Escape, and restores focus on close. Opening is click-only, though — product cards are not keyboard-focusable triggers.
- Gaps: icon-only header buttons (cart, theme, close cart) lack `aria-label`s; the cart drawer and checkout modal lack ARIA roles and focus trapping; checkout inputs rely on placeholders instead of `<label>` elements; there is no `prefers-reduced-motion` handling.

## Performance

- No runtime dependencies; only Font Awesome and Cloudinary images load from CDNs.
- Product images use `loading="lazy"` and fixed aspect-ratio containers, avoiding layout shift.
- Event delegation on the product grid and cart list instead of per-element listeners.
- State is written to `localStorage` only on mutations, and renders are simple `innerHTML` updates scoped to the cart and product containers.

## Security & Data Handling

- No backend, no network API calls (beyond static CDN assets), and no credentials or API keys in the repository.
- The only stored data is the cart, coupon code, and theme preference — no personal data persists; checkout details live only in memory.
- Known limitation: dynamic content is rendered with `innerHTML` from template literals. Current data is static and trusted, but the coupon code typed by the user is echoed back into an input's `value` attribute, so this pattern is not safe for untrusted data.

## Limitations

- **Simulated checkout** — orders are confirmed client-side with a random ID; there is no backend, payment gateway, or order persistence.
- **Static product data** — the catalog is a hardcoded array; there is no API or admin interface.
- **Single page** — no routing; the product detail view is a modal rather than a dedicated URL/page.
- **Coupon logic duplication** — discount calculation exists in both `coupons.js` (used everywhere) and `core/store.js` (whose percentage handling is inconsistent with the coupon catalog); only the `coupons.js` path is actually exercised.
- **No build system, linting, or automated tests.**

## License

No license file is present in the repository.

## Repository

https://github.com/bassim-ghaly-14/Warden
