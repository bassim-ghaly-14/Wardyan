import { getState, updateQty, removeItem, clearCart, getCartTotal, getCartCount, setCoupon } from "../core/store.js";
import { formatPrice } from "../core/utils.js";
import { applyCoupon, calculateDiscount } from "./coupons.js";
import { showToast } from "../core/toast.js";

export function renderCart() {
  const state = getState();
  const container = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");
  const count = document.getElementById("cartCount");
  const drawerFooter = document.querySelector(".drawer-footer");

  count.textContent = getCartCount();

  if (!state.cart.length) {
    container.innerHTML = `
      <div class="cart__empty">
        <div class="cart__empty-text">Empty Cart</div>
        <div class="cart__empty-sub">You have no items in your cart</div>
        <div class="cart-actions">
          <button class="btn btn-primary go-shopping">Go Shopping</button>
        </div>
      </div>
    `;
    summary.innerHTML = "";
    if (drawerFooter) drawerFooter.classList.add("hidden-checkout");
    return;
  }

  if (drawerFooter) drawerFooter.classList.remove("hidden-checkout");

  const subtotal = getCartTotal();
  const discount = state.coupon ? calculateDiscount(subtotal, state.coupon) : 0;
  const total = subtotal - discount;

  container.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${formatPrice(item.price)}</p>
        <div class="qty-controls">
          <button data-id="${item.id}" data-action="minus">-</button>
          <span>${item.quantity}</span>
          <button data-id="${item.id}" data-action="plus">+</button>
        </div>
      </div>
      <button class="remove-btn" data-id="${item.id}">x</button>
    </div>
  `).join("");

  summary.innerHTML = `
    <div class="cart-coupon">
      <input type="text" id="couponInput" placeholder="Enter coupon code" value="${state.coupon ? state.coupon.code : ''}">
      <button class="btn btn-outline" id="applyCoupon">Apply</button>
    </div>

    <div class="cart-summary-line">
      <span>Subtotal:</span>
      <span>${formatPrice(subtotal)}</span>
    </div>

    ${discount > 0 ? `
    <div class="cart-summary-line discount">
      <span>Discount:</span>
      <span>- ${formatPrice(discount)}</span>
    </div>` : ""}

    <div class="cart-summary-total">
      <span>Total:</span>
      <span>${formatPrice(total)}</span>
    </div>

    <div class="cart-actions">
      <button class="btn btn-outline clear-cart">Clear Cart</button>
    </div>
  `;

  document.getElementById("applyCoupon").onclick = () => {
    const code = document.getElementById("couponInput").value.trim();
    const result = applyCoupon(code);

    if (result.success) {
      setCoupon({ ...result.coupon, code: code.toUpperCase() });
      showToast("Coupon applied successfully", "success");
    } else {
      setCoupon(null);
      showToast(result.message || "Invalid coupon", "error");
    }

    renderCart();
  };

  document.querySelector(".clear-cart").onclick = () => {
    clearCart();
    renderCart();
    showToast("Cart cleared", "success");
  };

  document.querySelector(".go-shopping")?.addEventListener("click", () => {
    document.getElementById("closeCart")?.click();
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  });
}

export function bindCartEvents() {
  const cartItemsContainer = document.getElementById("cartItems");
  if (!cartItemsContainer) return;

  cartItemsContainer.addEventListener("click", e => {
    const id = e.target.closest("[data-id]")?.dataset.id;

    if (id) {
      if (e.target.closest("[data-action='plus']")) updateQty(id, 1);
      if (e.target.closest("[data-action='minus']")) updateQty(id, -1);
      if (e.target.closest(".remove-btn")) removeItem(id);
    }

    // FIX: Go Shopping button (event delegation)
    if (e.target.closest(".go-shopping")) {
      document.getElementById("closeCart")?.click();
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
}