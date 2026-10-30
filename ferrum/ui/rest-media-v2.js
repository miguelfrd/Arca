// Reproductor de descanso: la cuenta atrás como si fuera una pista de audio.
//
// iOS congela el JS de la app al bloquear el móvil o salir de ella, así que
// un setTimeout no puede hacer sonar la sirena. Pero un <audio> que se está
// reproduciendo sigue sonando (como un vídeo de Safari en segundo plano). Por
// eso, al empezar un descanso generamos un WAV con el descanso en silencio y
// la sirena al final, y lo reproducimos: la sirena va dentro del archivo y
// suena a su hora aunque el JS esté dormido.
//
// El reproductor de la pantalla de bloqueo hace de «Live Activity» al estilo
// Hevy (las de verdad son solo para apps nativas):
//   título    → ejercicio de la siguiente serie
//   subtítulo → «Siguiente: serie 2 de 3 (27 kg × 8 reps)»
//   carátula  → ilustración del ejercicio con la serie dibujada encima
//   barra     → progreso del descanso, con transcurrido y restante
//   botones   → ⟲ −10 s · ⏸ omitir descanso · ⟳ +10 s (iOS pinta «10» en
//               los botones de salto sea cual sea el intervalo, así que
//               usamos 10 s para que el botón no mienta)
//
// Solo con «Tarjeta de descanso en la pantalla de bloqueo» activada en
// Ajustes: en iOS el reproductor de la pantalla de bloqueo exige quedarse con
// el audio en exclusiva y pausa la música de otras apps (Spotify, Apple
// Music…). Por defecto (modo compatible con música) no reproducimos nada: la
// sesión de audio queda en «ambient» para que la sirena de la app se mezcle
// con la música, y con el móvil bloqueado avisa la notificación push.
//
// El bundle de entrenamiento habla con este módulo por eventos de window:
//   ferrum:rest-start  {endsAt, token, sound, card, info}  empieza o reprograma
//   ferrum:rest-stop   {token}                        descanso cancelado
//   ferrum:rest-end    {token, handled}               fin con la app abierta;
//                      si la sirena ya va en el audio, marcamos handled y el
//                      bundle no la duplica
//   ferrum:rest-remote {action:'add', seconds} | {action:'skip'}
//                      (lo emitimos nosotros: botones de la pantalla de
//                      bloqueo; el bundle ajusta su temporizador y el push)

const RATE = 8000;
const MAX_SECONDS = 15 * 60; // tope de tamaño del WAV (~14 MB)
const REMOTE_STEP = 10;

let audio = null;
let blobUrl = '';
let current = ''; // token del descanso que suena
let startedAt = 0; // inicio del descanso actual (la barra cuenta desde aquí)
let gen = 0; // cada start() invalida los play() pendientes del anterior
let siren = null;
let artKey = '', artUrl = '';

// Misma sirena que la del bundle (sierra 520↔980 Hz, 1,4 s, paso bajo
// 2,4 kHz), sintetizada por armónicos para no generar aliasing a 8 kHz.
function sirenSamples() {
  if (siren) return siren;
  const dur = 1.4, gap = 0.25, reps = 2;
  const one = Math.round(dur * RATE), pause = Math.round(gap * RATE);
  const out = new Float32Array(reps * one + (reps - 1) * pause);
  const freqAt = (t) => {
    const seg = Math.min(3, Math.floor(t / 0.35)), f = (t - seg * 0.35) / 0.35;
    const up = seg % 2 === 0;
    return up ? 520 + 460 * f : 980 - 460 * f;
  };
  const tone = new Float32Array(one);
  let phase = 0, peak = 0;
  for (let i = 0; i < one; i++) {
    const t = i / RATE, fr = freqAt(t);
    phase += 2 * Math.PI * fr / RATE;
    let s = 0;
    for (let k = 1; k * fr < RATE / 2 - 200; k++) s += Math.sin(k * phase) / k / Math.sqrt(1 + (k * fr / 2400) ** 2);
    const env = Math.min(1, t / 0.05, (dur - t) / 0.08);
    tone[i] = s * env;
    peak = Math.max(peak, Math.abs(tone[i]));
  }
  for (let r = 0; r < reps; r++) {
    const off = r * (one + pause);
    for (let i = 0; i < one; i++) out[off + i] = tone[i] / peak * 0.85;
  }
  siren = out;
  return out;
}

function buildWav(silenceSec) {
  const tail = sirenSamples();
  const lead = Math.max(0, Math.round(silenceSec * RATE));
  const n = lead + tail.length;
  const buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVE');
  str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, RATE, true); v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, n * 2, true);
  const pcm = new Int16Array(buf, 44); // el silencio ya son ceros
  for (let i = 0; i < tail.length; i++) pcm[lead + i] = Math.round(tail[i] * 32767);
  return { blob: new Blob([buf], { type: 'audio/wav' }), duration: n / RATE };
}

function clock(ms) {
  return new Date(ms).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

const iconArt = (s) => ({ src: new URL(`../icons/icon-${s}.png`, import.meta.url).href, sizes: `${s}x${s}`, type: 'image/png' });

// Carátula: la ilustración del ejercicio con la siguiente serie encima, en
// letra grande para que se lea también en la miniatura de la pantalla de
// bloqueo. Se dibuja en canvas y va como PNG (la carátula no admite webp en
// todos los iOS).
function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) { resolve(null); return; }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = new URL(src, document.baseURI).href;
  });
}

async function renderArt(info) {
  const key = JSON.stringify([info.img, info.big, info.small]);
  if (key === artKey) return artUrl;
  const S = 512, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  if (!g) return '';
  g.fillStyle = '#0b0b0d';
  g.fillRect(0, 0, S, S);
  const img = await loadImage(info.img);
  if (img) g.drawImage(img, 0, 0, S, S);
  const grad = g.createLinearGradient(0, S * 0.42, 0, S);
  grad.addColorStop(0, 'rgba(11,11,13,0)');
  grad.addColorStop(0.45, 'rgba(11,11,13,.86)');
  grad.addColorStop(1, 'rgba(11,11,13,.96)');
  g.fillStyle = grad;
  g.fillRect(0, S * 0.42, S, S * 0.58);
  const font = (w, px) => `${w} ${px}px -apple-system, system-ui, "Helvetica Neue", sans-serif`;
  const fit = (text, w, max, min) => {
    let px = max;
    g.font = font(w, px);
    while (px > min && g.measureText(text).width > S - 56) { px -= 2; g.font = font(w, px); }
  };
  g.textAlign = 'center';
  g.fillStyle = '#ffffff';
  if (info.big) { fit(info.big, 800, 96, 40); g.fillText(info.big, S / 2, S - 92); }
  if (info.small) { g.fillStyle = '#f0a37c'; fit(info.small, 700, 40, 22); g.fillText(info.small, S / 2, S - 38); }
  g.textAlign = 'left';
  g.fillStyle = 'rgba(255,255,255,.75)';
  g.font = font(800, 26);
  g.fillText('FERRUM', 26, 46);
  try {
    artUrl = c.toDataURL('image/png');
    artKey = key;
  } catch { return ''; }
  return artUrl;
}

// Textos en el idioma elegido (ui/ferrum-i18n-v1.js); sin él, tal cual.
const tr = (x) => { try { return window.__ferrumI18n?.t ? window.__ferrumI18n.t(x) : x; } catch { return x; } };
const translated = (info) => info && ({ ...info, title: tr(info.title), sub: tr(info.sub), big: tr(info.big), small: tr(info.small) });

function remote(detail) {
  try { window.dispatchEvent(new CustomEvent('ferrum:rest-remote', { detail })); } catch { /* noop */ }
}

function setupSession(endsAt, duration, position, info, mine) {
  const ms = navigator.mediaSession;
  if (!ms) return;
  const meta = (art) => {
    try {
      ms.metadata = new window.MediaMetadata({
        title: info?.title || tr('Descanso'),
        artist: info?.sub || 'Ferrum',
        album: tr(`Descanso · termina a las ${clock(endsAt)}`),
        artwork: art ? [{ src: art, sizes: '512x512', type: 'image/png' }] : [iconArt(192), iconArt(512)],
      });
    } catch { /* MediaMetadata no disponible */ }
  };
  meta(info && artKey === JSON.stringify([info.img, info.big, info.small]) ? artUrl : '');
  if (info) renderArt(info).then((art) => { if (art && mine === gen) meta(art); }).catch(() => {});
  try { ms.playbackState = 'playing'; } catch { /* noop */ }
  try { ms.setPositionState?.({ duration, playbackRate: 1, position: Math.min(position, duration) }); } catch { /* noop */ }
  const step = (sign) => (d) => remote({ action: 'add', seconds: sign * REMOTE_STEP });
  const skip = () => remote({ action: 'skip' });
  const handlers = {
    seekbackward: step(-1),
    seekforward: step(1),
    pause: skip,
    stop: skip,
    play: () => { audio?.play().catch(() => {}); },
    seekto: null, previoustrack: null, nexttrack: null,
  };
  for (const [k, fn] of Object.entries(handlers)) {
    try { ms.setActionHandler(k, fn); } catch { /* acción no soportada */ }
  }
}

function release() {
  current = '';
  gen++;
  if (audio) {
    try { audio.pause(); audio.removeAttribute('src'); audio.load(); } catch { /* noop */ }
  }
  if (blobUrl) { URL.revokeObjectURL(blobUrl); blobUrl = ''; }
  const ms = navigator.mediaSession;
  if (ms) {
    try { ms.metadata = null; ms.playbackState = 'none'; } catch { /* noop */ }
  }
}

// Tipo de sesión de audio de la página (Safari 16.4+): «ambient» se mezcla
// con la música de otras apps; «auto» deja que el <audio> tome el control.
function audioSessionType(type) {
  try { if (navigator.audioSession && navigator.audioSession.type !== type) navigator.audioSession.type = type; } catch { /* noop */ }
}

function start({ endsAt, token, sound, card, info: rawInfo }) {
  const info = translated(rawInfo);
  if (!card) { release(); audioSessionType('ambient'); return; }
  if (!sound || !token) { release(); return; }
  audioSessionType('auto');
  const now = Date.now();
  const same = token === current;
  // Reprogramar (±tiempo) un descanso que ya suena conserva su inicio, para
  // que la barra siga mostrando lo transcurrido.
  const begin = same ? startedAt : now;
  const end = Math.max(endsAt, now);
  if (!same && endsAt <= now) { release(); return; }
  if ((end - begin) / 1000 > MAX_SECONDS) { release(); return; }
  try {
    const { blob, duration } = buildWav((end - begin) / 1000);
    if (!audio) {
      audio = new Audio();
      audio.preload = 'auto';
      audio.addEventListener('ended', () => release());
    }
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = URL.createObjectURL(blob);
    current = token;
    startedAt = begin;
    const mine = ++gen;
    const at = () => Math.max(0, (Date.now() - begin) / 1000);
    audio.src = blobUrl;
    audio.addEventListener('loadedmetadata', () => {
      if (mine !== gen) return;
      try { audio.currentTime = at(); } catch { /* noop */ }
    }, { once: true });
    // play() dentro del toque que marca la serie: iOS lo exige la primera vez.
    audio.play()
      .then(() => { if (mine === gen) setupSession(end, duration, at(), info, mine); })
      .catch(() => { if (mine === gen) release(); });
  } catch {
    release();
  }
}

window.addEventListener('ferrum:rest-start', (e) => start(e.detail || {}));
window.addEventListener('ferrum:rest-stop', () => release());
window.addEventListener('ferrum:rest-end', (e) => {
  const d = e.detail;
  if (!d || !audio || current !== d.token || audio.paused) return;
  d.handled = true; // la sirena ya está sonando desde el audio
  try { navigator.vibrate?.([300, 150, 300]); } catch { /* noop */ }
});
