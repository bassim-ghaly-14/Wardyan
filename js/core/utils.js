export function formatPrice(price) {
  return `${price} EGP`;
}

export function createElement(tag, className, html) {
  const el = document.createElement(tag);

  if (className) {
    el.className = className;
  }

  if (html) {
    el.innerHTML = html;
  }

  return el;
}

export function validateEmail(email) {
  return /^[^@\s]{1,64}@[^@\s]{1,255}\.[^@\s]{2,63}$/.test(email);
}

export function validatePhone(phone) {
  return /^01[0-25][0-9]{8}$/.test(phone);
}