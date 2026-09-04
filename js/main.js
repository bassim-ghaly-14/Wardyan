import { addToCart } from "./core/store.js";
import { getProductById } from "./products.js";
import { openCheckout } from "./modules/checkout.js";
import { createElement, formatPrice } from "./core/utils.js";

let modal;
let lastFocused = null;

export function initProductDetails() {
  modal = createProductModal();
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-action='close']")) {
      closeProductDetails();
      return;
    }

    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const product = getProductById(btn.dataset.id);
    if (!product) return;

    if (btn.dataset.action === "add-cart") {
      addToCart(product);
      closeProductDetails();
    }

    if (btn.dataset.action === "buy-now") {
      closeProductDetails();
      openCheckout([{ ...product, quantity: 1 }]);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeProductDetails();
    }
  });
}

export function openProductDetails(productId) {
  const product = getProductById(productId);
  if (!product || !modal) return;

  renderProduct(product);

  lastFocused = document.activeElement;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  modal.querySelector("[data-action='close']").focus();
}

export function closeProductDetails() {
  if (!modal.classList.contains("active")) return;

  modal.classList.remove("active");
  document.body.style.overflow = "";

  if (lastFocused && document.contains(lastFocused)) {
    lastFocused.focus();
  }
  lastFocused = null;
}

function renderProduct(product) {
  modal.querySelector(".modal-content").innerHTML = `
    <button class="icon-btn product-detail__close" data-action="close" aria-label="Close product details">
      <i class="fas fa-times" aria-hidden="true"></i>
    </button>
    <div class="product-detail">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-detail__info">
        <h2 class="product-detail__name">${product.name}</h2>
        <p class="product-detail__desc">${product.description}</p>
        <p class="product-detail__price">${formatPrice(product.price)}</p>
        <div class="product-detail__actions">
          <button class="btn btn-outline" data-action="add-cart" data-id="${product.id}">Add to Cart</button>
          <button class="btn btn-primary" data-action="buy-now" data-id="${product.id}">Buy Now</button>
        </div>
      </div>
    </div>
  `;
}

function createProductModal() {
  return createElement("div", "modal product-detail-modal", `
    <div class="modal-content" role="dialog" aria-modal="true" aria-label="Product details"></div>
  `);
}