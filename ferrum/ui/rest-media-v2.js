// Reproductor de descanso: la cuenta atrás como si fuera una pista de audio.
//
// iOS congela el JS de la app al bloquear el móvil o salir de ella, así que
// un setTimeout no puede hacer sonar la sirena. Pero un <audio> que se está
// reproduciendo sigue sonando (como un vídeo de Safari en segundo plano). Por
// eso, al empezar un descanso generamos un WAV con N segundos de silencio y la
// sirena al final, y lo reproducimos: la sirena va dentro del archivo y suena
// a su hora aunque el JS esté dormido. Con Media Session, la pantalla de
// bloqueo y el Centro de control muestran «Descanso» con la barra de progreso
// y el tiempo restante.
//
// El bundle de entrenamiento habla con este módulo por eventos de window:
//   ferrum:rest-start {endsAt, token, sound}  empieza o reprograma (+15s)
//   ferrum:rest-stop  {token}                  descanso cancelado
//   ferrum:rest-end   {token, handled}         fin con la app abierta; si la
//                                              sirena ya va en el audio,
//                                              marcamos handled y el bundle
//                                              no la duplica.

const RATE = 8000;
const MAX_SECONDS = 15 * 60; // tope de tamaño del WAV (~14 MB)

let audio = null;
let blobUrl = '';
let current = ''; // token del descanso que suena
let gen = 0; // cada start() invalida los play() pendientes del anterior
let siren = null;

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
  return new Date(ms).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function setupSession(endsAt, duration) {
  const ms = navigator.mediaSession;
  if (!ms) return;
  try {
    const icon = (s) => ({ src: new URL(`../icons/icon-${s}.png`, import.meta.url).href, sizes: `${s}x${s}`, type: 'image/png' });
    ms.metadata = new window.MediaMetadata({
      title: 'Descanso',
      artist: 'Ferrum',
      album: `Termina a las ${clock(endsAt)}`,
      artwork: [icon(192), icon(512)],
    });
  } catch { /* MediaMetadata no disponible */ }
  try { ms.playbackState = 'playing'; } catch { /* noop */ }
  try { ms.setPositionState?.({ duration, playbackRate: 1, position: 0 }); } catch { /* noop */ }
  const handlers = {
    play: () => { audio?.play().catch(() => {}); try { ms.playbackState = 'playing'; } catch { /* noop */ } },
    pause: () => { audio?.pause(); try { ms.playbackState = 'paused'; } catch { /* noop */ } },
    seekbackward: null, seekforward: null, seekto: null, previoustrack: null, nexttrack: null,
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

function start({ endsAt, token, sound }) {
  if (!sound || !token) { release(); return; }
  const secs = (endsAt - Date.now()) / 1000;
  if (!(secs > 0) || secs > MAX_SECONDS) { release(); return; }
  try {
    const { blob, duration } = buildWav(secs);
    if (!audio) {
      audio = new Audio();
      audio.preload = 'auto';
      audio.addEventListener('ended', () => release());
    }
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = URL.createObjectURL(blob);
    current = token;
    const mine = ++gen;
    audio.src = blobUrl;
    // play() dentro del toque que marca la serie: iOS lo exige la primera vez.
    audio.play().then(() => { if (mine === gen) setupSession(endsAt, duration); }).catch(() => { if (mine === gen) release(); });
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
