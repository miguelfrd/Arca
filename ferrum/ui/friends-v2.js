import { db, toast, confirmDlg, workoutVolume, workoutSets } from './platform-v2.js';
import { initialize, snapshot, subscribe, synchronize, join, action, photoUrl, loadMore, previewInvitation, saveSelection, prepareSelection, completeOnboarding, bootstrapOwner } from './social-v2.js';
import { openRecovery } from './account-recovery-v2.js';
import { takePendingInvite, clearPendingInvite, validInvite } from './invite-v2.js';
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
  if (!validInvite(result.invite)) throw new Error('El servidor no devolvió una invitación válida. Vuelve a intentarlo.');
  const url = location.origin + location.pathname + '#/friends?invite=' + result.invite;
  const dialog = popup('Entrenad juntos', `<p class="muted">Comparte este enlace. Tu amigo elige su nombre y a quién quiere enviar solicitudes.</p><label class="f" for="fui-invite-url">Tu invitación</label><input id="fui-invite-url" type="text" readonly/><div class="fui-dialog-actions"><button class="btn" data-copy-invite>Copiar enlace</button>${navigator.share ? '<button class="btn secondary" data-share-invite>Compartir</button>' : ''}</div><p class="small muted">El enlace incluye el código de invitación.</p>`);
  const input = dialog.querySelector('input'); input.value = url;
  const expires = new Date(result.expiresAt);
  dialog.querySelector('.small.muted').textContent = 'Invitación de un solo uso.' +
    (result.expiresAt && Number.isFinite(expires.getTime()) ? ' Caduca el ' + expires.toLocaleString('es-ES') + '.' : ' Su validez se comprueba al abrir el enlace.');
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
  const dialog = popup('Tu perfil', `<form><label class="f" for="fui-profile-name">Tu nombre</label><input id="fui-profile-name" name="nickname" type="text" required minlength="2" maxlength="40" autocomplete="nickname"/><label class="fui-consent"><input type="checkbox" name="sharing"/><span>Compartir entrenamientos y fotos con mis amigos aceptados</span></label><p class="small muted">Al pausarlo, tu actividad deja de aparecer a tus amigos. Pausarlo no borra tus entrenamientos ni modifica tu copia privada.</p><p class="fui-form-error" role="alert"></p><button class="btn" type="submit">Guardar cambios</button></form>`);
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
  const invite = params.get('invite') || stashedInvite; let invitationReady = false, invitationError = '', selectionPrepared = false, preparingSelection = false, selectionBusy = false, selectionWrites = Promise.resolve();
  cleanup = () => { alive = false; unsubscribe?.(); controller.abort(); };
  view.innerHTML = `<div class="screen-head"><h1>Amigos</h1><p>La fuerza también se comparte.</p></div><div id="fui-friends-body"></div>`;
  const body = view.querySelector('#fui-friends-body');
  function statusLine(info) {
    const status = body.querySelector('.fui-sync-status'); if (!status) return;
    if (info.syncing) status.textContent = 'Actualizando…';
    else if (info.error) status.textContent = info.error;
    else status.textContent = info.lastSync ? 'Actividad actualizada ' + new Date(info.lastSync).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Listo para compartir';
    status.classList.toggle('has-error', Boolean(info.error));
  }
  function paint(info) {
    if (!alive || !view.isConnected) return;
    const mode = !info.configured ? 'disconnected' : info.identity?.registered && info.state ? 'member' : 'join';
    document.documentElement.classList.toggle('fui-enrolling', Boolean(info.onboarding) || (mode === 'join' && invitationReady));
    if (currentMode !== mode) { contentSignature = ''; currentMode = mode; }
    if (mode === 'disconnected') {
      body.innerHTML = `<div class="card fui-social-welcome">${peopleIcon}<h2>Tu círculo, aquí.</h2><p>Amigos aún no está conectado.</p><p class="muted small">Cuando esté disponible, podrás invitar, aceptar solicitudes y compartir vuestra actividad.</p></div>`;
      return;
    }
    if (mode === 'join') {
      if (body.querySelector('#fui-join')) return;
      if (!validInvite(invite) || !invitationReady) {
        body.innerHTML = `<div class="card fui-social-welcome">${peopleIcon}<h2>Entra por invitación.</h2><p>${invitationError ? esc(invitationError) : 'Pide a Miguel un enlace con tu código único para crear tu cuenta.'}</p><p class="muted small">Si ya tenías una cuenta y has cambiado de móvil, usa tu código de recuperación. Crear otra cuenta no recupera tu historial.</p>${validInvite(invite) ? '<button class="btn secondary" data-retry-invite>Comprobar de nuevo</button>' : ''}</div>`;
        body.querySelector('[data-retry-invite]')?.addEventListener('click', async event => {
          event.currentTarget.disabled = true;
          await checkInvitation(); paint(snapshot());
        });
        const recover = document.createElement('button'); recover.className = 'btn secondary'; recover.textContent = 'Ya tenía una cuenta';
        recover.addEventListener('click', () => openRecovery()); body.querySelector('.card').append(recover);
        // Administrative bootstrap is available only behind the original local PIN.
        if (localStorage.getItem('arca-unlocked') === '1') {
          const owner = document.createElement('button'); owner.className = 'btn secondary'; owner.textContent = 'Conectar cuenta de Miguel';
          owner.addEventListener('click', () => {
            const dialog = popup('Conectar cuenta de Miguel', '<p>Solo para la cuenta inicial de Miguel. El código del círculo configura el propietario; las demás personas entran por invitación.</p><form><label class="f">Tu nombre<input name="nickname" value="Miguel" required minlength="2" maxlength="40"/></label><label class="f">Código de administración<input type="password" name="code" required autocomplete="off"/></label><p class="fui-form-error" role="alert"></p><button class="btn" type="submit">Conectar</button></form>');
            dialog.querySelector('form').addEventListener('submit', async event => {
              event.preventDefault(); const form = event.currentTarget, button = form.querySelector('[type="submit"]'); button.disabled = true;
              try { await bootstrapOwner(form.elements.code.value, form.elements.nickname.value.trim()); dialog.close(); }
              catch (error) { form.querySelector('[role="alert"]').textContent = error.message; }
              finally { button.disabled = false; }
            });
          });
          body.querySelector('.card').append(owner);
        }
        return;
      }
      body.innerHTML = `<div class="card fui-social-welcome"><span class="fui-step">PASO 1 DE 2</span>${peopleIcon}<h2>¿Cómo te llamas?</h2><p>Este nombre aparecerá en la lista de tu círculo privado.</p><form id="fui-join"><label class="f" for="fui-join-name">Tu nombre</label><input id="fui-join-name" name="nickname" type="text" minlength="2" maxlength="40" autocomplete="nickname" placeholder="Escribe tu nombre" required/><p class="fui-form-error" role="alert"></p><button class="btn" type="submit">Continuar</button></form><p class="small muted">A continuación eliges a quién añadir. No se acepta ninguna amistad automáticamente.</p></div>`;
      body.querySelector('form').addEventListener('submit', async event => {
        event.preventDefault(); const form = event.currentTarget, button = form.querySelector('[type="submit"]'); button.disabled = true;
        try {
          await join({ nickname: form.elements.nickname.value.trim(), invite });
          clearPendingInvite(); history.replaceState(null, '', '#/friends');
        } catch (error) { if (form.isConnected) form.querySelector('[role="alert"]').textContent = error.message; }
        finally { if (button.isConnected) button.disabled = false; }
      });
      return;
    }
    if (info.onboarding) { paintSelection(info); return; }
    const state = info.state, received = state.relationships.filter(link => link.state === 'pending' && link.incoming);
    if (!body.querySelector('.fui-social-panels')) {
      body.innerHTML = `<div class="fui-circle-head"><button class="fui-profile-button" data-open-profile><span class="fui-avatar" aria-hidden="true"></span><span><strong></strong><small>Tu círculo privado</small></span></button><button class="btn secondary small" data-invite-friend>Invitar ＋</button></div><div class="fui-social-tabs" role="tablist" aria-label="Amigos"><button role="tab" id="fui-tab-feed" data-social-panel="feed" aria-controls="fui-panel-feed">Actividad</button><button role="tab" id="fui-tab-people" data-social-panel="people" aria-controls="fui-panel-people">Lista de personas</button></div><div class="fui-sync-row"><p class="fui-sync-status" role="status"></p><button class="icon-btn ghost" data-refresh-friends aria-label="Actualizar Amigos">↻</button></div><div class="fui-social-panels"><section id="fui-panel-feed" role="tabpanel" aria-labelledby="fui-tab-feed"><div class="fui-shared-feed"></div><button class="btn secondary" data-more-feed>Ver más actividad</button></section><section id="fui-panel-people" role="tabpanel" aria-labelledby="fui-tab-people"><div class="fui-incoming-list"></div><div class="fui-section-head"><h2>Lista de personas</h2><span class="fui-inline-badge" hidden></span></div><p class="small muted">Envía una solicitud. La otra persona decide si acepta.</p><label class="fui-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar en tu círculo" aria-label="Buscar personas"/></label><div class="fui-people-list"></div></section></div>`;
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
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (at + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
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
    body.querySelector('[data-invite-friend]').hidden = !(state.profile.canInvite === true || state.profile.role === 'admin');
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
      body.querySelector('.fui-incoming-list').innerHTML = received.length ? '<div class="fui-section-head"><h2>Solicitudes pendientes</h2></div>' + received.map(link => personRow(link.person, link, 'incoming')).join('') : '';

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
  async function checkInvitation() {
    invitationReady = false; invitationError = '';
    try { await previewInvitation(invite); invitationReady = true; }
    catch (error) { invitationError = error.message; }
  }
  function paintSelection(info) {
    const state = info.state;
    if (!body.querySelector('#fui-pick-people')) {
      contentSignature = '';
      body.innerHTML = `<div class="card fui-social-welcome"><span class="fui-step">PASO 2 DE 2</span><h2>Elige a tus amigos.</h2><p>Hola, <strong>${esc(state.profile.nickname)}</strong>. Marca a quienes quieras enviar una solicitud. También puedes hacerlo más adelante.</p><form id="fui-pick-people"><div class="fui-pick-list"></div><p class="small muted">Solo los amigos que aceptes podrán ver la actividad que compartas. Tu selección queda guardada en este móvil.</p><p class="fui-form-error" role="alert"></p><button class="btn" type="submit" disabled>Preparando la lista…</button><button class="btn secondary" type="button" data-retry-selection hidden>Reintentar</button></form></div>`;
      const form = body.querySelector('form');
      form.addEventListener('change', () => {
        const ids = [...form.querySelectorAll('input:checked')].map(input => input.value);
        // A synchronous draft also survives a reload before IndexedDB finishes its commit.
        try { localStorage.setItem('ferrum-onboarding-selection:' + state.profile.id, JSON.stringify(ids)); } catch {}
        selectionWrites = selectionWrites.catch(() => {}).then(() => saveSelection(ids));
        form.querySelector('[type="submit"]').textContent = ids.length ? 'Enviar solicitudes y entrar' : 'Continuar';
        selectionWrites.catch(() => { if (form.isConnected) form.querySelector('[role="alert"]').textContent = 'No se pudo guardar la selección. Vuelve a marcarla antes de continuar.'; });
      });
      form.addEventListener('submit', async event => {
        event.preventDefault(); if (selectionBusy || !selectionPrepared) return;
        selectionBusy = true; form.querySelectorAll('button,input').forEach(item => { item.disabled = true; });
        form.querySelector('[role="alert"]').textContent = '';
        try {
          await selectionWrites;
          await saveSelection([...form.querySelectorAll('input:checked')].map(input => input.value));
          await completeOnboarding();
          clearPendingInvite(); location.hash = '#/train'; toast('Tu cuenta está lista');
        } catch (error) { if (form.isConnected) form.querySelector('[role="alert"]').textContent = error.message + ' Tu cuenta y tu selección se conservan. Puedes reintentar.'; }
        finally { selectionBusy = false; if (form.isConnected) form.querySelectorAll('button,input').forEach(item => { item.disabled = false; }); }
      });
      form.querySelector('[data-retry-selection]').addEventListener('click', () => preparePeople());
    }
    const signature = JSON.stringify([state.members, state.relationships, info.onboarding.removeAutomaticRequests]);
    if (contentSignature !== signature && !selectionBusy) {
      contentSignature = signature;
      let selectedIds = info.onboarding.selected || [];
      try {
        const draft = JSON.parse(localStorage.getItem('ferrum-onboarding-selection:' + state.profile.id));
        if (Array.isArray(draft) && draft.every(id => typeof id === 'string')) selectedIds = draft;
      } catch {}
      const selected = new Set(selectedIds);
      const people = state.members.filter(person => person.id !== state.profile.id);
      body.querySelector('.fui-pick-list').innerHTML = people.length ? people.map(person => `<label class="fui-person fui-pick-person"><span class="fui-avatar" aria-hidden="true">${esc(person.nickname.slice(0, 1).toUpperCase())}</span><span class="fui-person-copy"><strong>${esc(person.nickname)}</strong><small>Enviar solicitud de amistad</small></span><input type="checkbox" value="${esc(person.id)}" ${selected.has(person.id) ? 'checked' : ''}/></label>`).join('') : messageEmpty('Todavía no hay otras personas. Puedes continuar.');
    }
    if (!selectionPrepared && !preparingSelection) preparePeople();
  }
  async function preparePeople() {
    if (preparingSelection || !alive) return;
    preparingSelection = true;
    const form = body.querySelector('#fui-pick-people');
    const button = form?.querySelector('[type="submit"]');
    if (!button) { preparingSelection = false; return; }
    form.querySelector('[data-retry-selection]').hidden = true;
    try {
      await prepareSelection(); selectionPrepared = true;
      button.disabled = false; button.textContent = 'Enviar solicitudes y entrar';
      if (!form.querySelector('input:checked')) button.textContent = 'Continuar';
      form.querySelector('[role="alert"]').textContent = '';
    } catch (error) {
      button.textContent = 'Continuar'; button.disabled = true;
      form.querySelector('[role="alert"]').textContent = error.message;
      form.querySelector('[data-retry-selection]').hidden = false;
    } finally { preparingSelection = false; }
  }
  if (validInvite(invite) && !snapshot().identity?.registered) await checkInvitation();
  unsubscribe = subscribe(paint); paint(snapshot());
  // Opening an invitation on an existing account never creates a friendship request.
  synchronize();
}
