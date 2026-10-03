import { db, toast, confirmDlg, workoutVolume, workoutSets, renderTrainHome } from './platform-v2.js';
import { postCard, showPhoto } from './feed-v2.js';
import { serializeWorkout } from './social-v2.js';

let ownPhotos = [], pageNumber = 0;
export function clearOwnPhotos() { for (const url of ownPhotos) URL.revokeObjectURL(url); ownPhotos = []; pageNumber++; }
export async function enhanceHome(view) {
  const free = view.querySelector('[data-act="free"]');
  if (!free || view.querySelector('.fui-routine-hero')) return;
  clearOwnPhotos();
  const ticket = ++pageNumber;
  const routineCards = [...view.querySelectorAll('[data-act^="routine:"]')].map(button => button.closest('.card'));
  const hero = document.createElement('section'); hero.className = 'fui-routine-hero';
  hero.innerHTML = `<div class="fui-hero-eyebrow">TU PLAN, A TU RITMO</div><h2>¿Qué toca hoy?</h2><p>Elige una rutina y empieza.</p><div class="fui-routine-list"></div>`;
  const oldHero = free.closest('.fui-session-hero');
  (oldHero || free).before(hero);
  const list = hero.querySelector('.fui-routine-list');
  for (const card of routineCards) {
    card.classList.add('fui-quick-routine'); card.removeAttribute('style');
    const start = card.querySelector('[data-act^="routine:"]'); start.classList.add('fui-routine-start');
    list.append(card);
  }
  if (!routineCards.length) list.innerHTML = `<a class="fui-create-routine" href="#/routines">Crear mi primera rutina <span aria-hidden="true">＋</span></a>`;
  const secondary = document.createElement('div'); secondary.className = 'fui-home-secondary';
  free.classList.add('secondary', 'small'); free.textContent = '+ Sesión libre';
  secondary.append(free); hero.append(secondary); oldHero?.remove();
  for (const title of [...view.querySelectorAll(':scope > .sec-title')]) if (/^(Hoy\s*\(|Rutinas$)/.test(title.textContent.trim())) title.remove();
  for (const empty of [...view.querySelectorAll(':scope > .empty')]) if (empty.textContent.includes('Sin rutinas')) empty.remove();
  const historyTitle = [...view.querySelectorAll(':scope > .sec-title')].find(title => title.textContent.trim() === 'Historial');
  if (historyTitle) { let next; while ((next = historyTitle.nextSibling)) next.remove(); historyTitle.remove(); }
  const feed = document.createElement('section'); feed.className = 'fui-own-feed';
  feed.innerHTML = '<div class="fui-section-head"><h2>Tu actividad</h2><button class="linklike" data-history-toggle>Ver todo</button></div><div class="fui-own-feed-list"></div>';
  const calendar = view.querySelector('#cal-home');
  calendar ? calendar.after(feed) : view.append(feed);
  let full = false, feedRender = 0;
  const historyButton = feed.querySelector('[data-history-toggle]');
  async function renderFeed() {
    const revision = ++feedRender, showAll = full;
    const current = () => ticket === pageNumber && revision === feedRender && feed.isConnected;
    const workouts = (await db.workoutsDesc()).filter(workout => workout.endTime);
    if (!current()) return;
    const records = showAll ? workouts : workouts.slice(0, 3);
    const map = new Map((await db.all('exercises')).map(exercise => [exercise.id, exercise]));
    const photos = await Promise.all(records.map(workout => db.get('workoutPhotos', workout.id)));
    if (!current()) return;
    for (const url of ownPhotos) URL.revokeObjectURL(url); ownPhotos = [];
    const posts = records.map((workout, index) => ({ ...serializeWorkout(workout, map, { workoutVolume, workoutSets, renderTrainHome }),
      id: workout.id, author: { nickname: 'Tú' }, hasPhoto: Boolean(photos[index]?.blob) }));
    feed.querySelector('.fui-own-feed-list').innerHTML = posts.length ? posts.map(post => postCard(post, { own: true })).join('')
      : '<div class="empty fui-empty">Tu próximo entrenamiento empieza aquí.<br>Al terminar, verás su foto y tus sensaciones.</div>';
    historyButton.hidden = workouts.length <= 3; historyButton.textContent = showAll ? 'Ver menos' : 'Ver todo';
    posts.forEach((post, index) => {
      if (!photos[index]?.blob) return;
      const url = URL.createObjectURL(photos[index].blob); ownPhotos.push(url);
      const image = [...feed.querySelectorAll('[data-post-photo]')].find(item => item.dataset.postPhoto === post.id);
      if (image) showPhoto(image, url);
    });
  }
  historyButton.addEventListener('click', () => { full = !full; renderFeed().catch(() => toast('No se pudo cargar la actividad.')); });
  feed.addEventListener('click', async event => {
    const button = event.target.closest('[data-remove-workout]'); if (!button) return;
    const workout = await db.get('workouts', button.dataset.removeWorkout);
    if (!workout || !await confirmDlg(`¿Eliminar el entrenamiento «${workout.title}»? No se puede deshacer.`)) return;
    await db.del('workouts', workout.id); await db.del('workoutPhotos', workout.id);
    clearOwnPhotos(); await renderTrainHome(view); await enhanceHome(view);
  });
  await renderFeed();
}
