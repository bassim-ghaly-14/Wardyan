import { getState, clearCart } from "../core/store.js";
import { validatePhone } from "../core/utils.js";
import { applyCoupon, calculateDiscount } from "./coupons.js";
import { showToast } from "../core/toast.js";
import { createElement } from "../core/utils.js";

let modal;

export function initCheckout() {
  modal = createCheckoutModal();
  document.body.appendChild(modal);
}

export function openCheckout(items = null) {
  const state = getState();
  const cartItems = items || state.cart;
  if (!cartItems.length) return;

  modal.dataset.items = JSON.stringify(cartItems);
  modal.dataset.coupon = state.coupon ? JSON.stringify(state.coupon) : "";

  updateCheckoutUI(cartItems, state.coupon);
  modal.classList.add("active");
}

function updateCheckoutUI(items, coupon = null) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = coupon ? calculateDiscount(subtotal, coupon) : 0;
  const total = subtotal - discount;

  modal.querySelector(".checkout-summary").innerHTML = `
    <p>Items: ${items.reduce((s, i) => s + i.quantity, 0)}</p>

    <input id="name" placeholder="Full Name" maxlength="35">
    <input id="phone" placeholder="01X XXXX XXXX" inputmode="numeric" maxlength="11">
    <input id="address" placeholder="Address" maxlength="60">

    <div class="checkout-summary-total">
      Total: ${total} EGP
    </div>
  `;

  modal.querySelector(".place-order").onclick = placeOrder;
}

function validateForm() {
  const name = modal.querySelector("#name").value.trim();
  const phone = modal.querySelector("#phone").value.trim();
  const address = modal.querySelector("#address").value.trim();

  const errors = [];

  if (!name || name.length < 3) errors.push("Invalid name");
  if (!validatePhone(phone)) errors.push("Invalid phone");
  if (!address || address.length < 10) errors.push("Invalid address");

  return { valid: !errors.length, errors };
}

function placeOrder() {
  const { valid, errors } = validateForm();
  if (!valid) {
    errors.forEach(e => showToast(e, "error"));
    return;
  }

  const items = JSON.parse(modal.dataset.items);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const coupon = modal.dataset.coupon ? JSON.parse(modal.dataset.coupon) : null;
  const discount = coupon ? calculateDiscount(subtotal, coupon) : 0;
  const total = subtotal - discount;

  const orderId = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  clearCart();
  modal.classList.remove("active");

  showToast("Order placed successfully", "success");
  showSuccessModal(orderId, total);
}

function showSuccessModal(id, total) {
  const modalEl = createElement(
    "div",
    "modal success-modal active",
    `
    <div class="modal-content">
      <h2>Order Confirmed 🎉</h2>
      <p>Order ID: <strong>${id}</strong></p>
      <p>Total Paid: <strong>${total} EGP</strong></p>
      <br>
      <button class="btn btn-primary" data-action="continue-shopping">
        OK
      </button>
    </div>
  `
  );

  document.body.appendChild(modalEl);

  // FIX: delegated event (no direct binding)
  modalEl.addEventListener("click", (e) => {
    if (e.target.closest('[data-action="continue-shopping"]')) {
      modalEl.remove();
    }
  });
}

function createCheckoutModal() {
  const div = createElement("div", "modal checkout-modal", `
    <div class="modal-content">
      <h2>Checkout</h2>
      <div class="checkout-summary"></div>

      <button class="btn btn-primary place-order">Place Order</button>
      <button class="btn btn-outline close-modal">Cancel</button>
    </div>
  `);

  div.querySelector(".close-modal").onclick = () => div.classList.remove("active");

  return div;
}