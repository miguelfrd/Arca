import { recoverAccount } from './cloud-v2.js';

export function openRecovery(onSuccess = () => location.reload()) {
  const dialog = document.createElement('dialog'); dialog.className = 'fui-profile-dialog';
  dialog.innerHTML = `<div class="fui-dialog-head"><h2>Recuperar mi cuenta</h2><button class="icon-btn ghost" data-close aria-label="Cerrar">×</button></div><p>Usa el código que guardaste en Yo. Se recuperan tu cuenta y la última copia privada de tus entrenamientos y fotos.</p><p class="small muted">Este móvil debe estar vacío. No se mezclan datos de dos personas.</p><form><label class="f" for="fui-recovery-input">Código de recuperación</label><textarea id="fui-recovery-input" name="code" required rows="4" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Pega tu código completo"></textarea><p class="fui-form-error" role="alert"></p><button class="btn" type="submit">Recuperar cuenta y datos</button></form><p class="small muted">Sin este código no se puede descifrar la copia privada.</p>`;
  document.body.append(dialog); dialog.showModal();
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => dialog.remove(), { once: true });
  dialog.querySelector('form').addEventListener('submit', async event => {
    event.preventDefault(); const form = event.currentTarget, button = form.querySelector('[type="submit"]');
    button.disabled = true; button.textContent = 'Recuperando…';
    try { await recoverAccount(form.elements.code.value); dialog.close(); onSuccess(); }
    catch (error) { form.querySelector('[role="alert"]').textContent = error.message; }
    finally { button.disabled = false; button.textContent = 'Recuperar cuenta y datos'; }
  });
}
export function attachRecovery(gate, onSuccess) {
  if (gate.querySelector('[data-recover-account]')) return;
  const button = document.createElement('button'); button.className = 'btn secondary fui-pin-recovery';
  button.dataset.recoverAccount = ''; button.textContent = 'Recuperar mi cuenta';
  button.addEventListener('click', () => openRecovery(onSuccess));
  gate.querySelector('.pin-box').append(button);
}
