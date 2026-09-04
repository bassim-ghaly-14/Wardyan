import { initTheme, bindThemeToggle } from "./modules/theme.js";
import { renderProducts } from "./modules/product-ui.js";
import { renderCart, bindCartEvents } from "./modules/cart.js";
import { initCheckout } from "./modules/checkout.js";
import { initProductDetails } from "./main.js";
import { bindDrawer } from "./modules/ui.js";
import { subscribe } from "./core/store.js";

initTheme();
bindThemeToggle(document.getElementById("themeToggle"));
renderProducts();
initProductDetails();
bindDrawer();
bindCartEvents();
initCheckout();
subscribe(renderCart);
renderCart();

document.getElementById("checkoutBtn").onclick = () => {
  import("./modules/checkout.js").then(m => m.openCheckout());
};