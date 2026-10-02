const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = 'cubic-bezier(.22,1,.36,1)';
let activeAnimation, pressedElement, pressPosition;
const pressTimers = new Map();
const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
export async function exitView(view, animate) {
  activeAnimation?.cancel(); activeAnimation = null;
  if (!animate || reduced() || typeof view.animate !== 'function' || !view.children.length || view.style.opacity === '0') return;
  const animation = view.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 85, easing: 'ease-out' });
  activeAnimation = animation;
  await animation.finished.catch(() => {});
  view.style.opacity = '0'; animation.cancel();
}
export async function enterView(view, animate) {
  await frame();
  await frame(); // presentation DOM reconciliation finishes before the first visible frame
  activeAnimation?.cancel(); activeAnimation = null;
  view.classList.remove('screen-in');
  if (!animate || reduced() || typeof view.animate !== 'function') { view.style.removeProperty('opacity'); return; }
  const animation = view.animate([{ opacity: 0, transform: 'translateY(7px)' }, { opacity: 1, transform: 'none' }],
    { duration: 250, easing: ease, fill: 'none' });
  activeAnimation = animation; view.style.removeProperty('opacity');
  await animation.finished.catch(() => {});
  animation.cancel(); if (activeAnimation === animation) activeAnimation = null;
}
export function resetView(view) { activeAnimation?.cancel(); activeAnimation = null; view.style.removeProperty('opacity'); }
export function installInteractionMotion() {
  const selector = 'button:not(:disabled),a[href],summary,[role="button"]';
  const keyAttributes = ['id', 'data-act', 'data-check', 'data-add-set', 'data-del-set', 'data-stype', 'data-select', 'data-menu', 'data-note', 'data-plate', 'data-rest'];
  const keyFor = element => {
    const attribute = keyAttributes.find(name => element.hasAttribute(name));
    return attribute ? [attribute, element.getAttribute(attribute)] : null;
  };
  function clearPress(element) {
    clearTimeout(pressTimers.get(element)?.timer); pressTimers.delete(element);
    element.classList.remove('fui-pressed');
  }
  function finishPress(element, at, key = keyFor(element), route = location.hash) {
    const timer = setTimeout(() => clearPress(element), Math.max(16, at - Date.now()));
    pressTimers.set(element, { timer, at, key, route });
  }
  function release(immediate = false) {
    const element = pressedElement; pressedElement = null;
    if (!element) return;
    clearTimeout(pressTimers.get(element)?.timer);
    if (immediate) clearPress(element);
    else finishPress(element, Date.now() + 70);
  }
  document.addEventListener('pointerdown', event => {
    release(); const element = event.target.closest(selector); if (!element || event.button > 0) return;
    clearTimeout(pressTimers.get(element)?.timer); pressTimers.delete(element);
    pressPosition = [event.clientX, event.clientY];
    pressedElement = element; element.classList.add('fui-pressed');
  }, { passive: true });
  document.addEventListener('pointerup', () => release(), { passive: true });
  for (const event of ['pointercancel', 'dragstart']) document.addEventListener(event, () => release(true), { passive: true });
  document.addEventListener('pointermove', event => {
    if (pressedElement && Math.hypot(event.clientX - pressPosition[0], event.clientY - pressPosition[1]) > 12) release(true);
  }, { passive: true });
  window.addEventListener('blur', () => release(true));
  document.addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key) || event.repeat) return;
    release(true);
    const element = event.target.closest(selector); if (element) { clearTimeout(pressTimers.get(element)?.timer); pressedElement = element; element.classList.add('fui-pressed'); }
  });
  document.addEventListener('keyup', () => release());
  // Native workout handlers redraw their table. Carry the release to the same
  // new control before paint instead of letting it jump straight back to 100%.
  new MutationObserver(() => {
    for (const [old, pending] of pressTimers) {
      if (old.isConnected) continue;
      clearPress(old);
      if (!pending.key || pending.route !== location.hash || pending.at <= Date.now()) continue;
      const [attribute, value] = pending.key;
      const replacement = [...document.querySelectorAll(selector)].find(element => element.getAttribute(attribute) === value);
      if (!replacement) continue;
      replacement.classList.add('fui-pressed'); finishPress(replacement, pending.at, pending.key, pending.route);
    }
  }).observe(document.body, { childList: true, subtree: true });
  // Native scrolling stays available. Pinch/double-tap do not zoom the app viewport.
  document.documentElement.style.touchAction = 'pan-x pan-y';
  for (const type of ['gesturestart', 'gesturechange']) document.addEventListener(type, event => event.preventDefault(), { passive: false });
  document.addEventListener('touchmove', event => { if (event.touches.length > 1) event.preventDefault(); }, { passive: false });
}
