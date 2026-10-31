import { db, toast, confirmDlg, workoutVolume, workoutSets, renderTrainHome, esc } from './platform-v2.js';
import { postCard, showPhoto } from './feed-v2.js';
import { serializeWorkout } from './social-v2.js';

const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5.5 12.500 4.300 4.300 8.700-9.300"/></svg>';
const PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const VISIBLE = 3;

let ownPhotos = [], pageNumber = 0;
export function clearOwnPhotos() { for (const url of ownPhotos) URL.revokeObjectURL(url); ownPhotos = []; pageNumber++; }

const whenDone = (ts) => {
  if (!ts) return 'Sin hacer todavía';
  const days = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(ts).setHours(0, 0, 0, 0)) / 864e5);
  return days <= 0 ? 'Hoy' : days === 1 ? 'Ayer' : `Hace ${days} días`;
};

/** «¿Qué toca hoy?»: se elige entre las rutinas y un solo botón empieza la marcada. */
async function fillRoutinePicker(hero, starts, isCurrent) {
  const [routines, exercises, workouts] = await Promise.all([db.all('routines'), db.all('exercises'), db.workoutsDesc(200)]);
  if (!isCurrent()) return;
  const imgOf = new Map(exercises.map((e) => [e.id, e.img]));
  const lastDone = new Map();
  for (const w of workouts) if (w.routineId && w.endTime && !lastDone.has(w.routineId)) lastDone.set(w.routineId, w.startTime);
  const today = new Date().getDay();
  // Primero la asignada a hoy; después, la que lleva más tiempo sin hacerse.
  const ordered = [...routines].sort((a, b) =>
    Number(b.dayOfWeek === today) - Number(a.dayOfWeek === today) || (lastDone.get(a.id) ?? 0) - (lastDone.get(b.id) ?? 0));
  const list = hero.querySelector('.fui-routine-list');
  const go = hero.querySelector('[data-go]');
  let selected = ordered[0]?.id, showAll = false;

  const paint = () => {
    const shown = showAll ? ordered : ordered.slice(0, VISIBLE);
    list.innerHTML = shown.map((r) => {
      const on = r.id === selected, n = (r.exercises ?? []).length;
      const imgs = (r.exercises ?? []).map((e) => imgOf.get(e.exerciseId)).filter(Boolean);
      return `<button type="button" class="rt-opt${on ? ' on' : ''}" data-rt="${esc(r.id)}" aria-pressed="${on}">
        <span class="rt-top"><span class="rt-t"><span class="rn">${esc(r.name)}</span><span class="rm">${n} ${n === 1 ? 'ejercicio' : 'ejercicios'} · ${whenDone(lastDone.get(r.id))}</span></span><span class="rd${on ? ' on' : ''}" aria-hidden="true">${CHECK}</span></span>
        ${on && imgs.length ? `<span class="strip">${imgs.slice(0, imgs.length > 5 ? 4 : 5).map((src) => `<span class="th" style="--s:48px"><img src="./${esc(src)}" alt="" /></span>`).join('')}${imgs.length > 5 ? `<span class="strip-more">+${imgs.length - 4}</span>` : ''}</span>` : ''}
      </button>`;
    }).join('') + (ordered.length > VISIBLE ? `<button type="button" class="rt-all" data-all>${showAll ? 'Ver menos' : `Ver las ${ordered.length} rutinas`}</button>` : '');
    const name = ordered.find((r) => r.id === selected)?.name ?? '';
    go.textContent = `Empezar ${name}`;
  };

  list.addEventListener('click', (event) => {
    if (event.target.closest('[data-all]')) { showAll = !showAll; paint(); return; }
    const row = event.target.closest('[data-rt]');
    if (row) { selected = row.dataset.rt; paint(); }
  });
  go.addEventListener('click', () => starts.find((b) => b.dataset.act === `routine:${selected}`)?.click());
  paint();
}

export async function enhanceHome(view) {
  const free = view.querySelector('[data-act="free"]');
  if (!free || view.querySelector('.fui-routine-hero')) return;
  clearOwnPhotos();
  const ticket = ++pageNumber;
  const isCurrent = () => ticket === pageNumber && view.contains(hero);
  const starts = [...view.querySelectorAll('[data-act^="routine:"]')];
  const hero = document.createElement('section'); hero.className = 'fui-routine-hero';
  hero.innerHTML = starts.length
    ? `<h2>¿Qué toca hoy?</h2><div class="fui-routine-list"></div><button class="btn fui-routine-go" data-go type="button">Empezar</button>`
    : `<h2>¿Qué toca hoy?</h2><p>Crea tu primera rutina o entrena sobre la marcha.</p><a class="fui-create-routine" href="#/routines?id=new">Crear rutina</a>`;
  const oldHero = free.closest('.fui-session-hero');
  (oldHero || free).before(hero);
  // Los botones originales siguen vivos, ocultos: son los que arrancan la sesión.
  const hold = document.createElement('div'); hold.hidden = true; hold.className = 'fui-start-hold';
  for (const button of starts) hold.append(button.closest('.card'));
  hero.append(hold);
  free.classList.add('fui-free'); free.innerHTML = `<span class="inl-ic" aria-hidden="true">${PLUS}</span>Sesión libre`;
  hero.append(free); oldHero?.remove();
  for (const item of view.querySelectorAll(':scope > [data-sec="today"], :scope > [data-sec="routines"], :scope > [data-sec="none"]')) item.remove();
  const historyTitle = view.querySelector(':scope > [data-sec="history"]');
  if (historyTitle) { let next; while ((next = historyTitle.nextSibling)) next.remove(); historyTitle.remove(); }
  const feed = document.createElement('section'); feed.className = 'fui-own-feed';
  feed.innerHTML = '<div class="fui-section-head"><h2>Tu actividad</h2><button class="linklike" data-history-toggle>Ver todo</button></div><div class="fui-own-feed-list"></div>';
  const calendar = view.querySelector('#cal-home');
  calendar ? calendar.after(feed) : view.append(feed);
  if (starts.length) fillRoutinePicker(hero, starts, isCurrent).catch(() => toast('No se pudieron cargar las rutinas.'));
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
    if (!workout || !await confirmDlg(`¿Eliminar el entrenamiento «${workout.title}»? No se puede deshacer.`, { yes: 'Eliminar' })) return;
    await db.del('workouts', workout.id); await db.del('workoutPhotos', workout.id);
    clearOwnPhotos(); await renderTrainHome(view); await enhanceHome(view);
  });
  await renderFeed();
}
