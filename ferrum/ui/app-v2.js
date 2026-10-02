import { db, workoutVolume, workoutSets } from './platform-v2.js';
import { initialize, subscribe, snapshot } from './social-v2.js';
import { enhanceHome, clearOwnPhotos } from './home-v2.js';
import { stopFriendView } from './friends-v2.js';
import { installInteractionMotion } from './motion-v2.js';

let installed = false;
export function enhanceWorkout(view) {
  for (const card of view.querySelectorAll('.ex-card')) {
    const tools = card.querySelector('.ex-top .ex-tools');
    if (!tools || card.querySelector('.fui-ex-toolbar')) continue;
    const buttons = [...tools.querySelectorAll('[data-select],[data-plate],[data-note]')];
    if (!buttons.length) continue;
    const bar = document.createElement('div'); bar.className = 'fui-ex-toolbar';
    bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Acciones del ejercicio');
    for (const button of buttons) bar.append(button);
    card.querySelector('.ex-top').after(bar);
  }
}
export function updateFriendsBadge() {
  const link = document.querySelector('nav.tabbar a[href="#/friends"]'); if (!link) return;
  const count = snapshot().state?.relationships.filter(item => item.state === 'pending' && item.incoming).length || 0;
  let badge = link.querySelector('.fui-nav-badge');
  if (!badge) { badge = document.createElement('span'); badge.className = 'fui-nav-badge'; link.append(badge); }
  badge.textContent = count > 9 ? '9+' : String(count); badge.hidden = !count;
  link.setAttribute('aria-label', count ? `Amigos, ${count} solicitudes pendientes` : 'Amigos');
  const label = link.querySelector('.fui-nav-label'); if (label) label.textContent = 'Amigos';
}
export async function afterRoute(view, path) {
  if (!installed) {
    installed = true; installInteractionMotion();
    await initialize(db, { workoutVolume, workoutSets });
    subscribe(updateFriendsBadge);
    new MutationObserver(() => {
      if (location.hash.startsWith('#/train/active')) enhanceWorkout(view);
      else if ((location.hash || '#/train').split('?')[0] === '#/train')
        enhanceHome(view).catch(() => {});
    })
      .observe(view, { childList: true });
  }
  clearOwnPhotos();
  if (path !== '/friends') stopFriendView();
  if (path === '/train') await enhanceHome(view);
  if (path === '/train/active') enhanceWorkout(view);
  updateFriendsBadge();
}
