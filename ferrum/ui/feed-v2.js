export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]));
const finiteNumber = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const compactNumber = value => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(finiteNumber(value));
const rating = value => { const n = finiteNumber(value); return n >= 1 && n <= 5 ? n : null; };
const duration = post => { const minutes = Math.max(0, Math.round(finiteNumber(post.endTime - post.startTime) / 60000)); return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`; };
export function postCard(post, { own = false } = {}) {
  const person = post.author?.nickname || 'Tú';
  const end = new Date(post.endTime), validDate = Number.isFinite(end.getTime());
  const date = validDate ? end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Fecha no disponible';
  const satisfaction = rating(post.satisfaction), fatigue = rating(post.fatigue);
  return `<article class="card fui-feed-card" data-post="${escapeHtml(post.id)}">
    <div class="fui-feed-head"><span class="fui-avatar" aria-hidden="true">${escapeHtml(person.slice(0, 1).toUpperCase())}</span>
      <div><strong>${escapeHtml(person)}</strong><time datetime="${validDate ? end.toISOString() : ''}">${escapeHtml(date)}</time></div>
      ${own ? `<button class="icon-btn ghost fui-feed-delete" data-remove-workout="${escapeHtml(post.localId)}" aria-label="Eliminar entrenamiento ${escapeHtml(post.title)}">⋯</button>` : '<span class="fui-private-pill">Amigos</span>'}
    </div><h3>${escapeHtml(post.title)}</h3>
    ${post.hasPhoto ? `<figure class="fui-feed-photo"><img data-post-photo="${escapeHtml(post.id)}" alt="Foto del entrenamiento de ${escapeHtml(person)}" loading="lazy"/><span class="fui-photo-placeholder" aria-hidden="true">FERRUM</span></figure>` : ''}
    ${post.description ? `<p class="fui-feed-description">${escapeHtml(post.description)}</p>` : ''}
    <div class="fui-feed-metrics">${[[duration(post), 'Duración'], [compactNumber(post.setCount), 'Series'], [compactNumber(post.volumeKg) + ' kg', 'Volumen']].map(([v, l]) => `<div><strong>${escapeHtml(v)}</strong><span>${l}</span></div>`).join('')}</div>
    ${satisfaction || fatigue ? `<div class="fui-feelings">${satisfaction ? `<span>Satisfacción <b>${satisfaction}/5</b></span>` : ''}${fatigue ? `<span>Fatiga <b>${fatigue}/5</b></span>` : ''}</div>` : ''}
    ${post.exercises?.length ? `<details class="fui-workout-details"><summary>Ver entrenamiento <span aria-hidden="true">⌄</span></summary><div>${post.exercises.map(exercise => `<div class="fui-exercise-summary"><strong>${escapeHtml(exercise.name)}</strong><p>${(exercise.sets || []).filter(set => set.done).map(set => escapeHtml([set.weightKg != null ? compactNumber(set.weightKg) + ' kg' : '', set.reps != null ? set.reps + ' rep' : '', set.distanceKm != null ? compactNumber(set.distanceKm) + ' km' : '', set.durationSeconds != null ? set.durationSeconds + ' s' : ''].filter(Boolean).join(' · '))).join('<br>') || 'Sin series completadas'}</p></div>`).join('')}</div></details>` : ''}
  </article>`;
}
export function showPhoto(image, url) {
  image.onload = () => { image.classList.add('is-loaded'); image.closest('figure')?.classList.add('is-loaded'); };
  image.src = url;
}
