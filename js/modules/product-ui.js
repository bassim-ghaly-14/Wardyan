import { products } from "../products.js";
import { addToCart } from "../core/store.js";
import { openCheckout } from "./checkout.js";

export function renderProducts() {
  const container = document.querySelector(".products-grid");
  if (!container) return;
  
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-footer">
          <span class="price">${p.price} EGP</span>
          <div class="product-actions">
            <button class="btn btn-outline add-cart" data-id="${p.id}">Add to Cart</button>
            <button class="btn btn-primary buy-now" data-id="${p.id}">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  container.addEventListener("click", e => {
    const id = e.target.dataset.id;
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (e.target.classList.contains("add-cart")) addToCart(product);
    if (e.target.classList.contains("buy-now")) openCheckout([{ ...product, quantity: 1 }]);
  });
}