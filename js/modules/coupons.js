const COUPONS = {
  SAVE10: { value: 10, type: "percent" },
  WELCOME50: { value: 50, type: "fixed" }
};

export function applyCoupon(code) {
  const coupon = COUPONS[code.toUpperCase()];
  return coupon ? { success: true, coupon } : { success: false, message: "Invalid coupon code" };
}

export function calculateDiscount(total, coupon) {
  if (!coupon) return 0;
  return coupon.type === "percent" ? (total * coupon.value) / 100 : coupon.value;
}