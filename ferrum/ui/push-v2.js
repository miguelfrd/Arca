// Avisos de fin de descanso con el móvil bloqueado (Web Push).
//
// El temporizador vive en el bundle (train.ts): al pasar la app a segundo
// plano con un descanso en curso emite «ferrum:rest-schedule» y al volver
// «ferrum:rest-cancel». Este módulo los traduce a la API de Amigos: el
// servidor guarda la cita (Durable Object con alarma) y envía la
// notificación a la hora exacta, aunque la app esté cerrada.
// Requiere cuenta de Amigos: la suscripción push va ligada al usuario.
import { api, snapshot } from './social-v2.js';

const VAPID_PUBLIC = 'BAxEY02NdpqWrU7YHo7YN1jHjGyI5WZFLjsWz3Ns2gsK5ANnrzq6QsdIYIZt5CHPNP6CVWhTnipcVVJUdaLSgl0';
const STORE_KEY = 'ferrum-push-sub-v1';
let wired = false;

function urlB64ToUint8(text) {
  const pad = '='.repeat((4 - (text.length % 4)) % 4);
  const raw = atob((text + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export function pushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

async function registration() {
  try { return await navigator.serviceWorker.ready; } catch { return null; }
}

export async function restAlertsState() {
  if (!pushSupported()) return { supported: false, permission: 'unsupported', subscribed: false };
  const permission = Notification.permission;
  let subscribed = false;
  if (permission === 'granted') {
    const reg = await registration();
    const sub = reg ? await reg.pushManager.getSubscription().catch(() => null) : null;
    subscribed = !!sub;
  }
  return { supported: true, permission, subscribed };
}

async function sendSubscription(sub) {
  const json = sub.toJSON();
  const fingerprint = JSON.stringify(json);
  let last = null;
  try { last = localStorage.getItem(STORE_KEY); } catch { /* noop */ }
  if (last === fingerprint) return;
  await api('/push/subscribe', { method: 'POST', body: { subscription: json } });
  try { localStorage.setItem(STORE_KEY, fingerprint); } catch { /* noop */ }
}

// Con el permiso ya concedido, asegura la suscripción en este dispositivo
// y la registra en el servidor si ha cambiado. Sin permiso no hace nada.
export async function ensureRestAlerts() {
  if (!pushSupported() || Notification.permission !== 'granted') return false;
  if (!snapshot().identity?.registered) return false;
  const reg = await registration();
  if (!reg) return false;
  try {
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8(VAPID_PUBLIC) });
    await sendSubscription(sub);
    return true;
  } catch { return false; }
}

// Debe llamarse desde un gesto del usuario (el botón del perfil).
export async function enableRestAlerts() {
  if (!pushSupported()) throw new Error('Este móvil no admite avisos push en la webapp.');
  if (!snapshot().identity?.registered) throw new Error('Primero entra en tu cuenta de Amigos.');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Permiso no concedido: actívalo en Ajustes del iPhone para Ferrum.');
  if (!await ensureRestAlerts()) throw new Error('No se pudo activar el aviso. Inténtalo de nuevo.');
  return true;
}

export async function disableRestAlerts() {
  const reg = await registration();
  const sub = reg ? await reg.pushManager.getSubscription().catch(() => null) : null;
  if (sub) {
    try { await api('/push/unsubscribe', { method: 'POST', body: { endpoint: sub.endpoint } }); } catch { /* noop */ }
    await sub.unsubscribe().catch(() => false);
  }
  try { localStorage.removeItem(STORE_KEY); } catch { /* noop */ }
}

function wire() {
  if (wired) return;
  wired = true;
  window.addEventListener('ferrum:rest-schedule', (event) => {
    const d = event.detail || {};
    if (!d.token || !d.endsAt) return;
    if (!snapshot().identity?.registered) return;
    void api('/rest/remind', { method: 'POST', body: { endsAt: d.endsAt, token: d.token } }).catch(() => {});
  });
  window.addEventListener('ferrum:rest-cancel', (event) => {
    const d = event.detail || {};
    if (!d.token) return;
    if (!snapshot().identity?.registered) return;
    void api('/rest/cancel', { method: 'POST', body: { token: d.token } }).catch(() => {});
  });
  void ensureRestAlerts(); // permiso ya concedido: renueva la suscripción en silencio
}
wire();
