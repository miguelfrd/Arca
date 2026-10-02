import { db, toast, confirmDlg, workoutVolume, workoutSets } from './platform-v2.js';
import { initialize, snapshot, subscribe, synchronize, join, action, photoUrl, loadMore, previewInvitation } from './social-v2.js';
import { takePendingInvite } from './invite-v2.js';
import { postCard, escapeHtml as esc, showPhoto } from './feed-v2.js';

const peopleIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2"/></svg>';
let cleanup, activePanel = 'feed';
export function stopFriendView() { cleanup?.(); cleanup = null; }
function messageEmpty(text) { return `<div class="fui-social-empty">${peopleIcon}<p>${text}</p></div>`; }
function linkFor(state, id) { return state.relationships.find(link => link.person.id === id); }
function personRow(person, relationship, mode = 'directory') {
  let controls = '';
  if (mode === 'incoming') controls = `<button class="btn small" data-friend-action="accept" data-link="${esc(relationship.id)}">Aceptar</button><button class="icon-btn" data-friend-action="decline" data-link="${esc(relationship.id)}" aria-label="Rechazar solicitud de ${esc(person.nickname)}">×</button>`;
  else if (relationship?.state === 'accepted') controls = `<span class="fui-friend-status">Amigos</span><button class="icon-btn ghost" data-friend-action="remove" data-link="${esc(relationship.id)}" aria-label="Dejar de compartir con ${esc(person.nickname)}">⋯</button>`;
  else if (relationship?.state === 'pending' && relationship.incoming) controls = `<button class="btn small" data-friend-action="accept" data-link="${esc(relationship.id)}">Aceptar</button>`;
  else if (relationship?.state === 'pending') controls = `<button class="btn secondary small" data-friend-action="cancel" data-link="${esc(relationship.id)}">Enviada</button>`;
  else controls = `<button class="btn secondary small" data-friend-action="request" data-person="${esc(person.id)}">Añadir</button>`;
  const label = mode === 'incoming' ? 'Quiere compartir su actividad contigo' : relationship?.state === 'accepted' ? 'Compartís entrenamientos y fotos' : relationship?.state === 'pending' ? (relationship.incoming ? 'Te ha enviado una solicitud' : 'Pendiente de su aceptación') : 'Forma parte de tu círculo';
  return `<div class="fui-person" data-person-row="${esc(person.id)}"><span class="fui-avatar" aria-hidden="true">${esc(person.nickname.slice(0, 1).toUpperCase())}</span><div class="fui-person-copy"><strong>${esc(person.nickname)}</strong><small>${label}</small></div><div class="fui-person-actions">${controls}</div></div>`;
}
function popup(title, contents) {
  const dialog = document.createElement('dialog'); dialog.className = 'fui-profile-dialog';
  dialog.innerHTML = `<div class="fui-dialog-handle" aria-hidden="true"></div><div class="fui-dialog-head"><h2>${esc(title)}</h2><button class="icon-btn ghost" data-close-dialog aria-label="Cerrar">×</button></div>${contents}`;
  document.body.append(dialog);
  dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => dialog.remove(), { once: true });
  dialog.showModal(); return dialog;
}
async function inviteDialog() {
  const result = await action('/invites', {});
  const url = location.origin + location.pathname + '#/friends?invite=' + result.invite;
  const dialog = popup('Entrenad juntos', `<p class="muted">Comparte este enlace. Tu amigo elige su nombre y recibirás su solicitud para aceptarla.</p><label class="f" for="fui-invite-url">Tu invitación</label><input id="fui-invite-url" type="text" readonly/><div class="fui-dialog-actions"><button class="btn" data-copy-invite>Copiar enlace</button>${navigator.share ? '<button class="btn secondary" data-share-invite>Compartir</button>' : ''}</div><p class="small muted">Válida durante 7 días.</p>`);
  const input = dialog.querySelector('input'); input.value = url;
  dialog.querySelector('[data-copy-invite]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); toast('Invitación copiada'); }
    catch { input.focus(); input.select(); toast('Selecciona y copia el enlace'); }
  });
  dialog.querySelector('[data-share-invite]')?.addEventListener('click', async () => {
    try { await navigator.share({ title: 'Entrena conmigo en Ferrum', text: 'Únete a mi círculo de entrenamiento.', url }); }
    catch (error) { if (error.name !== 'AbortError') toast('No se pudo abrir Compartir. Puedes copiar el enlace.'); }
  });
}
function profileDialog() {
  const state = snapshot().state;
  const dialog = popup('Tu perfil', `<form><label class="f" for="fui-profile-name">Tu nombre</label><input id="fui-profile-name" name="nickname" type="text" required minlength="2" maxlength="40" autocomplete="nickname"/><label class="fui-consent"><input type="checkbox" name="sharing"/><span>Compartir entrenamientos y fotos con mis amigos aceptados</span></label><p class="small muted">Al pausarlo, tu actividad deja de aparecer a tus amigos. Tus entrenamientos siguen guardados en este móvil.</p><p class="fui-form-error" role="alert"></p><button class="btn" type="submit">Guardar cambios</button></form>`);
  const form = dialog.querySelector('form'); form.elements.nickname.value = state.profile.nickname;
  form.elements.sharing.checked = state.profile.sharing;
  form.addEventListener('submit', async event => {
    event.preventDefault(); const button = form.querySelector('[type="submit"]'); button.disabled = true;
    try { await action('/profile', { nickname: form.elements.nickname.value.trim(), sharing: form.elements.sharing.checked }); dialog.close(); toast('Perfil actualizado'); }
    catch (error) { form.querySelector('[role="alert"]').textContent = error.message; }
    finally { button.disabled = false; }
  });
}
export async function renderFriends(view, params = new URLSearchParams()) {
  stopFriendView();
  await initialize(db, { workoutVolume, workoutSets });
  const controller = new AbortController(); let unsubscribe, alive = true, contentSignature = '', currentMode = '';
  // La invitación puede venir en la URL (conservada durante el PIN) o del
  // almacenamiento temporal; se consume una sola vez para no reprocesarla.
  const stashedInvite = takePendingInvite();
  const invite = params.get('invite') || stashedInvite; let invitationName = '';
  cleanup = () => { alive = false; unsubscribe?.(); controller.abort(); };
  view.innerHTML = `<div class="screen-head"><h1>Amigos</h1><p>La fuerza también se comparte.</p></div><div id="fui-friends-body"></div>`;
  const body = view.querySelector('#fui-friends-body');
  function statusLine(info) {
    const status = body.querySelector('.fui-sync-status'); if (!status) return;
    if (info.syncing) status.textContent = 'Actualizando…';
    else if (info.error) status.textContent = info.error;
    else status.textContent = info.lastSync ? 'Actualizado ' + new Date(info.lastSync).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Listo para compartir';
    status.classList.toggle('has-error', Boolean(info.error));
  }
  function paint(info) {
    if (!alive || !view.isConnected) return;
    const mode = !info.configured ? 'disconnected' : info.identity?.registered && info.state ? 'member' : 'join';
    if (currentMode !== mode) { contentSignature = ''; currentMode = mode; }
    if (mode === 'disconnected') {
      body.innerHTML = `<div class="card fui-social-welcome">${peopleIcon}<h2>Tu círculo, aquí.</h2><p>Amigos aún no está conectado.</p><p class="muted small">Cuando esté disponible, podrás invitar, aceptar solicitudes y compartir vuestra actividad.</p></div>`;
      return;
    }
    if (mode === 'join') {
      if (body.querySelector('#fui-join')) return;
      body.innerHTML = `<div class="card fui-social-welcome">${peopleIcon}<h2>Entrena con los tuyos.</h2><p>${invitationName ? `${esc(invitationName)} te ha invitado a su círculo.` : 'Elige tu nombre y entra en el círculo.'}</p><form id="fui-join"><label class="f" for="fui-join-name">Tu nombre</label><input id="fui-join-name" name="nickname" type="text" minlength="2" maxlength="40" autocomplete="nickname" placeholder="¿Cómo te llamas?" required/>${invite ? '' : '<label class="f" for="fui-circle-code">Código del círculo</label><input id="fui-circle-code" name="code" type="password" autocomplete="off" placeholder="Código que compartió tu amigo" required/>'}<label class="fui-consent"><input type="checkbox" name="sharing" checked/><span>Compartir mi historial, entrenamientos y fotos con los amigos que acepte</span></label><p class="fui-form-error" role="alert"></p><button class="btn" type="submit">${invite ? 'Aceptar invitación' : 'Entrar en el círculo'}</button></form><p class="small muted">Cada amistad necesita una solicitud y una aceptación. Solo entonces compartís actividad.</p></div>`;
      body.querySelector('form').addEventListener('submit', async event => {
        event.preventDefault(); const form = event.currentTarget, button = form.querySelector('[type="submit"]'); button.disabled = true;
        try {
          await join({ nickname: form.elements.nickname.value.trim(), code: form.elements.code?.value || '', invite: invite || undefined, sharing: form.elements.sharing.checked });
          if (invite) { history.replaceState(null, '', '#/friends'); toast('Solicitud enviada. Tu amigo debe aceptarla.'); }
        } catch (error) { form.querySelector('[role="alert"]').textContent = error.message; }
        finally { if (button.isConnected) button.disabled = false; }
      });
      return;
    }
    const state = info.state, received = state.relationships.filter(link => link.state === 'pending' && link.incoming);
    if (!body.querySelector('.fui-social-panels')) {
      body.innerHTML = `<div class="fui-circle-head"><button class="fui-profile-button" data-open-profile><span class="fui-avatar" aria-hidden="true"></span><span><strong></strong><small>Tu círculo privado</small></span></button><button class="btn secondary small" data-invite-friend>Invitar ＋</button></div><div class="fui-social-tabs" role="tablist" aria-label="Amigos"><button role="tab" id="fui-tab-feed" data-social-panel="feed" aria-controls="fui-panel-feed">Actividad</button><button role="tab" id="fui-tab-people" data-social-panel="people" aria-controls="fui-panel-people">Personas</button><button role="tab" id="fui-tab-requests" data-social-panel="requests" aria-controls="fui-panel-requests">Solicitudes <span class="fui-inline-badge"></span></button></div><div class="fui-sync-row"><p class="fui-sync-status" role="status"></p><button class="icon-btn ghost" data-refresh-friends aria-label="Actualizar Amigos">↻</button></div><div class="fui-social-panels"><section id="fui-panel-feed" role="tabpanel" aria-labelledby="fui-tab-feed"><div class="fui-shared-feed"></div><button class="btn secondary" data-more-feed>Ver más actividad</button></section><section id="fui-panel-people" role="tabpanel" aria-labelledby="fui-tab-people"><label class="fui-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar en tu círculo" aria-label="Buscar personas"/></label><div class="fui-people-list"></div></section><section id="fui-panel-requests" role="tabpanel" aria-labelledby="fui-tab-requests"><div class="fui-incoming-list"></div><div class="fui-outgoing-list"></div></section></div>`;
      body.querySelector('[data-open-profile]').addEventListener('click', profileDialog);
      body.querySelector('[data-invite-friend]').addEventListener('click', async event => {
        const button = event.currentTarget; button.disabled = true;
        try { await inviteDialog(); } catch (error) { toast(error.message); } finally { button.disabled = false; }
      });
      body.querySelector('[data-refresh-friends]').addEventListener('click', () => synchronize());
      body.querySelector('[data-more-feed]').addEventListener('click', async event => {
        const button = event.currentTarget; button.disabled = true;
        try { await loadMore(snapshot().state.nextCursor); } catch (error) { toast(error.message); } finally { button.disabled = false; }
      });
      body.querySelector('input[type="search"]').addEventListener('input', filterPeople);
      body.querySelector('.fui-social-tabs').addEventListener('click', event => {
        const button = event.target.closest('[data-social-panel]'); if (!button) return;
        activePanel = button.dataset.socialPanel; selectPanel();
      });
      body.querySelector('.fui-social-tabs').addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault(); const tabs = [...body.querySelectorAll('[data-social-panel]')];
        const at = tabs.findIndex(button => button.dataset.socialPanel === activePanel);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (at + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
        activePanel = tabs[next].dataset.socialPanel; selectPanel(); tabs[next].focus();
      });
      body.addEventListener('click', async event => {
        const button = event.target.closest('[data-friend-action]'); if (!button) return;
        const verb = button.dataset.friendAction;
        if (verb === 'remove' && !await confirmDlg('¿Dejar de compartir actividad con esta persona?')) return;
        button.disabled = true;
        try {
          await action(verb === 'request' ? '/requests' : '/requests/' + button.dataset.link + '/' + verb,
            verb === 'request' ? { personId: button.dataset.person } : {});
          toast({ request: 'Solicitud enviada', accept: 'Ya sois amigos', decline: 'Solicitud rechazada', cancel: 'Solicitud cancelada', remove: 'Habéis dejado de compartir actividad' }[verb]);
        } catch (error) { toast(error.message); } finally { if (button.isConnected) button.disabled = false; }
      });
    }
    const profile = body.querySelector('.fui-profile-button');
    profile.querySelector('.fui-avatar').textContent = state.profile.nickname.slice(0, 1).toUpperCase();
    profile.querySelector('strong').textContent = state.profile.nickname;
    const badge = body.querySelector('.fui-inline-badge'); badge.textContent = received.length || ''; badge.hidden = !received.length;
    statusLine(info);
    const nextSignature = JSON.stringify([state.members, state.relationships, state.posts, state.nextCursor, state.profile.sharing]);
    if (contentSignature !== nextSignature) {
      contentSignature = nextSignature;
      body.querySelector('.fui-shared-feed').innerHTML = state.posts.length ? state.posts.map(post => postCard(post)).join('') : messageEmpty(state.profile.sharing ? 'La próxima sesión de tus amigos aparecerá aquí.<br>Añade a alguien de tu círculo para empezar.' : 'Has pausado la actividad compartida.<br>Puedes volver a activarla en tu perfil.');
      for (const post of state.posts) if (post.hasPhoto) {
        const image = [...body.querySelectorAll('[data-post-photo]')].find(item => item.dataset.postPhoto === post.id);
        photoUrl(post, controller.signal).then(url => { if (alive && image?.isConnected) showPhoto(image, url); }).catch(() => { if (image?.isConnected) image.closest('figure').classList.add('photo-unavailable'); });
      }
      body.querySelector('[data-more-feed]').hidden = !state.nextCursor;
      const people = state.members.filter(person => person.id !== state.profile.id);
      body.querySelector('.fui-people-list').innerHTML = people.length ? people.map(person => personRow(person, linkFor(state, person.id))).join('') : messageEmpty('Tu círculo está empezando.<br>Comparte una invitación para entrenar juntos.');
      body.querySelector('.fui-incoming-list').innerHTML = '<div class="fui-section-head"><h2>Recibidas</h2></div>' + (received.length ? received.map(link => personRow(link.person, link, 'incoming')).join('') : messageEmpty('No tienes solicitudes pendientes.'));
      const sent = state.relationships.filter(link => link.state === 'pending' && !link.incoming);
      body.querySelector('.fui-outgoing-list').innerHTML = sent.length ? '<div class="fui-section-head"><h2>Enviadas</h2></div>' + sent.map(link => personRow(link.person, link)).join('') : '';
      filterPeople();
    }
    selectPanel();
  }
  function filterPeople() {
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-ES');
    const query = normalize(body.querySelector('input[type="search"]')?.value.trim() || '');
    for (const row of body.querySelectorAll('[data-person-row]')) {
      if (!row.closest('.fui-people-list')) continue;
      row.hidden = !normalize(row.querySelector('strong').textContent).includes(query);
    }
    let none = body.querySelector('.fui-no-search');
    if (!none) { none = document.createElement('p'); none.className = 'fui-no-search muted small'; none.textContent = 'No hay personas con ese nombre.'; body.querySelector('.fui-people-list')?.append(none); }
    none.hidden = !query || Boolean([...body.querySelectorAll('.fui-people-list [data-person-row]')].some(row => !row.hidden));
  }
  function selectPanel() {
    for (const button of body.querySelectorAll('[data-social-panel]')) {
      const selected = button.dataset.socialPanel === activePanel;
      button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
      body.querySelector('#fui-panel-' + button.dataset.socialPanel).hidden = !selected;
    }
  }
  if (invite && !snapshot().identity?.registered) {
    try { invitationName = (await previewInvitation(invite)).nickname; } catch (error) { toast(error.message); }
  }
  unsubscribe = subscribe(paint); paint(snapshot());
  if (invite && snapshot().identity?.registered) {
    try { await action('/invites/redeem', { invite }); history.replaceState(null, '', '#/friends'); toast('Solicitud preparada. La otra persona debe aceptarla.'); }
    catch (error) { toast(error.message); }
  }
  synchronize();
}
