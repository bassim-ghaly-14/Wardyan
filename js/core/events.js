export function on(element, event, selector, handler) {
  element.addEventListener(event, e => {
    const target = e.target.closest(selector);
    if (target) handler(e, target);
  });
}