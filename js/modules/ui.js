export function openCartDrawer() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("drawerOverlay").classList.add("active");

  // FIX: prevent scroll
  document.body.style.overflow = "hidden";
}

export function closeCartDrawer() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("drawerOverlay").classList.remove("active");

  // FIX: restore scroll
  document.body.style.overflow = "";
}

export function bindDrawer() {
  document.getElementById("cartToggle").onclick = openCartDrawer;
  document.getElementById("closeCart").onclick = closeCartDrawer;
  document.getElementById("drawerOverlay").onclick = closeCartDrawer;
}