const STORAGE_KEY = "WARDYAN_state";

const defaultState = {
  cart: [],
  coupon: null,
  theme: "light"
};

let state = loadState();
let listeners = [];

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState;
  } catch {
    return defaultState;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.push(fn);
  return () => (listeners = listeners.filter(l => l !== fn));
}

function notify() {
  listeners.forEach(fn => fn(state));
  saveState();
}

export function addToCart(product, quantity = 1) {
  const existing = state.cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({ ...product, quantity });
  }
  notify();
}

export function updateQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(i => i.id !== id);
  }
  notify();
}

export function removeItem(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  notify();
}

export function clearCart() {
  state.cart = [];
  state.coupon = null;
  notify();
}

export function getCartTotal() {
  return state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function getCartTotalAfterDiscount() {
  const subtotal = getCartTotal();
  if (!state.coupon) return subtotal;
  const discount = calculateDiscount(subtotal, state.coupon);
  return Math.max(0, subtotal - discount);
}

export function getCartCount() {
  return state.cart.reduce((sum, i) => sum + i.quantity, 0);
}

export function setCoupon(coupon) {
  state.coupon = coupon;
  notify();
}

export function setTheme(theme) {
  state.theme = theme;
  notify();
}

// FIXED: unified coupon type handling
function calculateDiscount(subtotal, coupon) {
  if (!coupon) return 0;

  if (coupon.type === "percentage") {
    return (subtotal * coupon.value) / 100;
  }

  if (coupon.type === "fixed") {
    return Math.min(coupon.value, subtotal);
  }

  return 0;
}