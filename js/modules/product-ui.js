import { products } from "../products.js";
import { addToCart } from "../core/store.js";
import { openCheckout } from "./checkout.js";
import { openProductDetails } from "../main.js";
import { formatPrice } from "../core/utils.js";

export function renderProducts() {
  const container = document.querySelector(".products-grid");
  if (!container) return;
  
  container.innerHTML = products.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-card__media">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__desc">${p.description}</p>
        <div class="product-card__price">
          <span class="price">${formatPrice(p.price)}</span>
        </div>
        <div class="product-card__actions">
          <button class="btn btn-outline add-cart" data-id="${p.id}">Add to Cart</button>
          <button class="btn btn-primary buy-now" data-id="${p.id}">Buy Now</button>
        </div>
      </div>
    </article>
  `).join("");

  container.addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    if (!card) return;

    // Action buttons keep their own behavior; the card itself opens details
    const actionBtn = e.target.closest(".product-card__actions [data-id]");
    if (actionBtn) {
      const product = products.find(p => p.id === actionBtn.dataset.id);
      if (!product) return;

      if (e.target.closest(".add-cart")) addToCart(product);
      if (e.target.closest(".buy-now")) openCheckout([{ ...product, quantity: 1 }]);
      return;
    }

    openProductDetails(card.dataset.id);
  });
}