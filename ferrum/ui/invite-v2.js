/* Invitaciones de Amigos: NUNCA se saltan el PIN de entrada.
   Si la URL trae ?invite=, el token se conserva en sessionStorage y la
   función devuelve false para que el arranque siga el flujo normal del PIN.
   Después de desbloquear, la pestaña Amigos (friends-v2.js) lee la invitación
   de la URL o del almacenamiento y la procesa: vista previa si no hay perfil,
   canje (prepara solicitud, sin aceptar) si ya lo hay. */
const STASH_KEY = 'ferrum-pending-invite';
export function stashPendingInvite(invite) {
  try {
    if (/^[a-f0-9]{64}$/.test(invite || '')) sessionStorage.setItem(STASH_KEY, invite);
  } catch {}
}
export function takePendingInvite() {
  try {
    const v = sessionStorage.getItem(STASH_KEY);
    if (v) sessionStorage.removeItem(STASH_KEY);
    return /^[a-f0-9]{64}$/.test(v || '') ? v : null;
  } catch { return null; }
}
export async function invitationAllowsEntry() {
  const [path, query] = (location.hash || '').slice(1).split('?');
  if (path !== '/friends') return false;
  const invite = new URLSearchParams(query).get('invite');
  if (!invite) return false;
  stashPendingInvite(invite);
  return false;
}
