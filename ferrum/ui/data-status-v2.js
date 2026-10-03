import { db, toast } from './platform-v2.js';
import { socialStore } from './social-store-v2.js';
import { cloudSnapshot, subscribeCloud, synchronizeCloud, recoveryCode, markRecoverySaved, reconnectKey, resolveCloudConflict, restorePreviousLocal, cloudHistory, restoreCloudVersion } from './cloud-v2.js';

let cleanup;
export function stopDataStatus() { cleanup?.(); cleanup = null; }
export async function renderDataStatus(view) {
  stopDataStatus();
  if (view.querySelector('.fui-data-status')) return;
  const [workouts, routines, photos, previous] = await Promise.all([
    db.all('workouts'), db.all('routines'), db.all('workoutPhotos'), socialStore.get('cloud-before-restore')
  ]);
  if (!view.isConnected || !location.hash.startsWith('#/yo')) return;
  const card = document.createElement('section'); card.className = 'card fui-data-status';
  card.setAttribute('aria-labelledby', 'fui-data-heading');
  card.innerHTML = `<span class="fui-step">TUS DATOS</span><h2 id="fui-data-heading">Tu copia privada</h2><div class="fui-data-counts"><span><strong>${workouts.length}</strong> sesiones</span><span><strong>${routines.length}</strong> rutinas</span><span><strong>${photos.length}</strong> fotos de sesiones</span></div><div class="fui-backup-pending" role="status"><strong data-cloud-title></strong><span data-cloud-detail></span></div><div class="fui-cloud-actions"><button class="btn secondary" data-cloud-sync>Comprobar copia</button><button class="btn secondary" data-cloud-history hidden>Historial de copias</button><button class="btn secondary" data-cloud-code hidden>Guardar código de recuperación</button><button class="btn secondary" data-cloud-key hidden>Conectar con mi código</button></div><div data-cloud-conflict hidden><p>Hay versiones distintas. La copia del servidor y tus cambios de este móvil se conservan. Elige cuál quieres continuar usando.</p><button class="btn secondary" data-keep-local>Guardar este móvil</button><button class="btn secondary" data-use-cloud>Usar copia de la nube</button></div>${previous ? '<button class="btn secondary" data-restore-local>Recuperar copia local anterior</button>' : ''}<p>La copia privada incluye rutinas, pesos, valoraciones, fotos y sesiones en curso. Amigos solo muestra la actividad que compartes con amistades aceptadas.</p><a class="btn secondary" href="#/more">Ajustes y exportación manual</a>`;
  view.append(card);
  function paint(info) {
    if (!card.isConnected) return;
    const titles = { unavailable: 'Copia en la nube pendiente de activar', syncing: 'Guardando copia cifrada…', ready: 'Guardado en la nube', pending: 'Cambios pendientes de subir', offline: 'Sin conexión · copia en este móvil', error: 'Copia pendiente · datos en este móvil', conflict: 'Revisa las copias de tus móviles', 'needs-code': 'Introduce tu código de recuperación' };
    card.querySelector('[data-cloud-title]').textContent = titles[info.status] || 'Guardado en este móvil';
    const at = info.lastSync ? new Date(info.lastSync).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
    card.querySelector('[data-cloud-detail]').textContent = info.error || (info.status === 'unavailable' ? 'El servidor aún necesita la actualización de cuentas y copias privadas. Todavía no puedes recuperar todos tus datos al cambiar de móvil.' : info.status === 'ready' ? `Última comprobación: ${at}. ${info.recoverySaved ? 'Código de recuperación copiado: consérvalo fuera de Ferrum.' : 'Guarda tu código de recuperación fuera de Ferrum para poder cambiar de móvil.'}` : 'Puedes seguir entrenando. Los cambios permanecen en este móvil hasta que el servidor confirme la copia.');
    card.querySelector('[data-cloud-code]').hidden = ['unavailable','needs-code'].includes(info.status) || !info.revision;
    card.querySelector('[data-cloud-history]').hidden = !info.revision || info.status === 'unavailable';
    card.querySelector('[data-cloud-key]').hidden = info.status !== 'needs-code';
    card.querySelector('[data-cloud-conflict]').hidden = info.status !== 'conflict';
  }
  card.querySelector('[data-cloud-sync]').addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true; try { await synchronizeCloud(); } finally { if (button.isConnected) button.disabled = false; }
  });
  card.querySelector('[data-cloud-code]').addEventListener('click', async () => {
    const code = await recoveryCode(); if (!code) return toast('La cuenta aún no tiene código de recuperación');
    const dialog = document.createElement('dialog'); dialog.className = 'fui-profile-dialog';
    dialog.innerHTML = `<div class="fui-dialog-head"><h2>Guarda este código</h2><button class="icon-btn ghost" data-close aria-label="Cerrar">×</button></div><p>Es la llave de tu cuenta y de tu copia privada. Guárdalo en tu gestor de contraseñas. Quien lo tenga podrá acceder a tus datos.</p><textarea readonly rows="4" aria-label="Código de recuperación" spellcheck="false"></textarea><button class="btn" data-copy>Copiar código</button><p class="small muted">No se puede recuperar este código desde el servidor si lo pierdes.</p>`;
    dialog.querySelector('textarea').value = code; document.body.append(dialog); dialog.showModal();
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => dialog.remove(), { once: true });
    dialog.querySelector('[data-copy]').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(code); await markRecoverySaved(); toast('Código copiado. Guárdalo fuera de Ferrum.'); }
      catch { dialog.querySelector('textarea').select(); toast('Selecciona y copia el código'); }
    });
  });
  card.querySelector('[data-cloud-history]').addEventListener('click', async event => {
    const button = event.currentTarget; button.disabled = true;
    try {
      const versions = await cloudHistory(), dialog = document.createElement('dialog'); dialog.className = 'fui-profile-dialog';
      dialog.innerHTML = '<div class="fui-dialog-head"><h2>Historial de copias</h2><button class="icon-btn ghost" data-close aria-label="Cerrar">×</button></div><p>Puedes recuperar una versión anterior. Antes guardaremos una copia de los datos actuales de este móvil.</p><div class="fui-cloud-history"></div><p class="fui-form-error" role="alert"></p>';
      for (const version of versions) {
        const item = document.createElement('button'); item.className = 'btn secondary';
        item.textContent = new Date(version.updatedAt).toLocaleString('es-ES') + ' · Copia ' + version.revision;
        item.addEventListener('click', async () => {
          if (!confirm('¿Recuperar esta copia anterior? La versión actual se conservará en este móvil.')) return;
          dialog.querySelectorAll('button').forEach(node => { node.disabled = true; });
          try { await restoreCloudVersion(version.revision); dialog.close(); toast('Copia recuperada'); }
          catch (error) { dialog.querySelector('[role="alert"]').textContent = error.message; dialog.querySelectorAll('button').forEach(node => { node.disabled = false; }); }
        });
        dialog.querySelector('.fui-cloud-history').append(item);
      }
      document.body.append(dialog); dialog.showModal();
      dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
      dialog.addEventListener('close', () => dialog.remove(), { once: true });
    } catch (error) { toast(error.message); } finally { if (button.isConnected) button.disabled = false; }
  });
  card.querySelector('[data-cloud-key]').addEventListener('click', () => {
    const dialog = document.createElement('dialog'); dialog.className = 'fui-profile-dialog';
    dialog.innerHTML = '<div class="fui-dialog-head"><h2>Conectar mi copia privada</h2><button class="icon-btn ghost" data-close aria-label="Cerrar">×</button></div><p>Introduce el código de recuperación de esta cuenta. Tus datos locales se conservarán.</p><form><label class="f" for="fui-connect-code">Código de recuperación</label><textarea id="fui-connect-code" name="code" required rows="4" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea><p class="fui-form-error" role="alert"></p><button class="btn" type="submit">Conectar copia</button></form>';
    document.body.append(dialog); dialog.showModal();
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => dialog.remove(), { once: true });
    dialog.querySelector('form').addEventListener('submit', async event => {
      event.preventDefault(); const form = event.currentTarget, button = form.querySelector('[type="submit"]'); button.disabled = true;
      try { await reconnectKey(form.elements.code.value); dialog.close(); }
      catch (error) { form.querySelector('[role="alert"]').textContent = error.message; }
      finally { button.disabled = false; }
    });
  });
  for (const [selector, keepLocal] of [['[data-keep-local]',true],['[data-use-cloud]',false]]) {
    card.querySelector(selector).addEventListener('click', async event => {
      if (!confirm(keepLocal ? '¿Guardar los datos de este móvil como nueva versión? La versión anterior seguirá en el historial privado.' : '¿Usar la copia de la nube? Guardaremos antes una copia local de tus cambios pendientes.')) return;
      const button = event.currentTarget; button.disabled = true;
      try { await resolveCloudConflict(keepLocal); } catch (error) { toast(error.message); }
      finally { if (button.isConnected) button.disabled = false; }
    });
  }
  card.querySelector('[data-restore-local]')?.addEventListener('click', async () => {
    if (!confirm('¿Recuperar la copia local anterior? Primero se conservará la versión actual de este móvil.')) return;
    try { await restorePreviousLocal(); } catch (error) { toast(error.message); }
  });
  cleanup = subscribeCloud(paint); paint(cloudSnapshot());
}
