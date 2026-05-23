import { initTheme, bindThemeToggle } from "./modules/theme.js";
import { renderCart, bindCartEvents } from "./modules/cart.js";
import { initCheckout } from "./modules/checkout.js";
import { bindDrawer } from "./modules/ui.js";
import { subscribe, addToCart } from "./core/store.js";
import { getProductById } from "./products.js";

initTheme();
bindThemeToggle(document.getElementById("themeToggle"));
bindDrawer();
bindCartEvents();
initCheckout();
subscribe(renderCart);
renderCart();

const productId = new URLSearchParams(location.search).get("id");
const product = getProductById(productId);

if (product) {
  document.getElementById("productDetail").innerHTML = `
    <div class="product-detail">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <h2>${product.price} EGP</h2>
        <button class="btn btn-primary" id="buyNow">Buy Now</button>
        <button class="btn btn-outline" id="addCart">Add to Cart</button>
      </div>
    </div>
  `;
  
  document.getElementById("addCart").onclick = () => addToCart(product);
  document.getElementById("buyNow").onclick = () => {
    import("./modules/checkout.js").then(m => m.openCheckout([{ ...product, quantity: 1 }]));
  };
}