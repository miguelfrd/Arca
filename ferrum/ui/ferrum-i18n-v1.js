// Ferrum · idioma y estilo. Se carga síncrono en el <head>, antes que la app:
//  1. aplica el idioma y la paleta guardados antes del primer pintado;
//  2. añade a Ajustes los selectores «Estilo» (Grafito / Rosa) e «Idioma»;
//  3. en inglés, traduce la interfaz en vivo: textos y atributos visibles
//     (MutationObserver), confirm/prompt/alert, y fechas/números (los
//     formateadores «es-ES» pasan a «en-GB»).
// El diccionario vive en ui/ferrum-i18n-en-v1.js (window.__FERRUM_EN). La
// traducción es por coincidencia exacta, por segmentos «a · b» y por reglas;
// los fragmentos de plantilla («Anterior: …») se sustituyen dentro del texto.
// Los datos del usuario (nombres de rutinas, notas…) no se tocan salvo que
// coincidan exactamente con un texto de la app.
(() => {
  const root = document.documentElement;
  const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const lang = read('ferrum-lang') === 'en' ? 'en' : 'es';
  const PALETTES = ['cobre', 'grafito', 'rosa', 'azul', 'rojo', 'verde', 'violeta', 'custom'];
  const palette = PALETTES.includes(read('ferrum-palette')) ? read('ferrum-palette') : 'cobre';
  const hue = Math.max(0, Math.min(360, Number(read('ferrum-hue')) || 255));
  // Filtro de las ilustraciones para el color Personalizado: valores calculados
  // cada 30° de tono (hue-rotate, saturate, brightness) e interpolados entre sí.
  // Ver docs/2026-10-31__recolor-ilustraciones.md.
  const ICON_TABLE = [[290, 1.76, 1.05], [321, 2.0, 1.06], [346, 2.32, 1.07], [7, 2.32, 1.1], [33, 1.8, 1.13], [81, 1.6, 1.12], [121, 2.44, 1.09], [140, 3.0, 1.07], [161, 2.4, 1.09], [188, 1.92, 1.1], [220, 1.64, 1.09], [255, 1.6, 1.07]];
  const iconFilter = (h) => {
    const x = ((Number(h) % 360) + 360) % 360 / 30, i = Math.floor(x) % 12, f = x - Math.floor(x);
    const a = ICON_TABLE[i], b = ICON_TABLE[(i + 1) % 12];
    let dh = b[0] - a[0];
    if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
    return `sepia(1) hue-rotate(${((a[0] + dh * f) + 360) % 360}deg) saturate(${(a[1] + (b[1] - a[1]) * f).toFixed(2)}) brightness(${(a[2] + (b[2] - a[2]) * f).toFixed(2)})`;
  };
  const applyCustom = (h) => { root.style.setProperty('--p-h', String(h)); root.style.setProperty('--icon-filter', iconFilter(h)); };
  root.dataset.fuiPalette = palette;
  if (palette === 'custom') applyCustom(hue);
  root.lang = lang;

  // El service worker traduce el aviso push de fin de descanso.
  try { caches.open('prefs-ferrum').then((c) => c.put('./__lang', new Response(lang))).catch(() => {}); } catch { /* noop */ }

  const EN = lang === 'en' ? (window.__FERRUM_EN || {}) : {};
  const exact = new Map();
  const add = (obj) => { for (const [k, v] of Object.entries(obj || {})) if (v && typeof v === 'string' && v !== k) exact.set(k, v); };
  add(EN.ui); add(EN.names); add(EN.instructions); add(EN.muscles); add(EN.equipment); add(EN.extra);

  // Reglas para textos que la app compone con datos.
  const RULES = lang === 'en' ? [
    [/^Siguiente: serie (\d+) de (\d+)(.*)$/, (m, a, b, rest) => `Next: set ${a} of ${b}${tr(rest)}`],
    [/^Serie (\d+) de (\d+)$/, (m, a, b) => `Set ${a} of ${b}`],
    [/^Descanso · termina a las (.+)$/, (m, a) => `Rest · ends at ${a}`],
    [/^Descanso: (\d+) s$/, (m, a) => `Rest: ${a} s`],
    [/^(\d+) ejercicios?$/, (m, a) => `${a} exercise${a === '1' ? '' : 's'}`],
    [/^(\d+) series$/, (m, a) => `${a} sets`],
    [/^(\d+) serie$/, (m, a) => `${a} set`],
    [/^(\d+) días?$/, (m, a) => `${a} day${a === '1' ? '' : 's'}`],
    [/^(\d+) semanas?$/, (m, a) => `${a} week${a === '1' ? '' : 's'}`],
    [/^(\d+) entrenamientos?$/, (m, a) => `${a} workout${a === '1' ? '' : 's'}`],
    [/^hace (\d+) (min|h|d)$/i, (m, a, u) => `${a} ${u} ago`],
    [/^(Última copia|Último intento) (ahora mismo|hace (\d+) (min|h|días?))$/, (m, w, r, n, u) => `${w === 'Última copia' ? 'Last backup' : 'Last attempt'} ${n ? `${n} ${u.startsWith('d') ? (n === '1' ? 'day' : 'days') : u} ago` : 'just now'}`],
    [/^Marcar serie (\d+) como hecha$/, (m, a) => `Mark set ${a} as done`],
    [/^(KG|REPS) serie (\d+)$/, (m, a, b) => `${a} set ${b}`],
    [/^Demasiados intentos\. Espera (\d+) s…$/, (m, a) => `Too many attempts. Wait ${a} s…`],
    [/^Eliminar entrenamiento (.+)$/, (m, a) => `Delete workout ${a}`],
    [/^Quitar serie (\d+)$/, (m, a) => `Remove set ${a}`],
    [/^Desmarcar serie (\d+) como hecha$/, (m, a) => `Unmark set ${a} as done`],
    [/^Tipo de serie: (.+)\. Toca para cambiar\.$/, (m, a) => `Set type: ${tr(a)}. Tap to change.`],
    [/^Versión (v\d+)$/, (m, a) => `Version ${a}`],
    [/^Descanso (\d+:\d+)$/, (m, a) => `Rest ${a}`],
    [/^Hace (\d+) días$/, (m, a) => `${a} days ago`],
    [/^(\d+) de (\d+) series$/, (m, a, b) => `${a} of ${b} sets`],
    [/^(\d+) resultados?$/, (m, a) => `${a} result${a === '1' ? '' : 's'}`],
    [/^(\d+) días? este mes$/, (m, a) => `${a} day${a === '1' ? '' : 's'} this month`],
    [/^Empezar (.+)$/, (m, a) => `Start ${a}`],
    [/^Añadir (\d+) ejercicios?$/, (m, a) => `Add ${a} exercise${a === '1' ? '' : 's'}`],
    [/^Ver las (\d+) rutinas$/, (m, a) => `See all ${a} routines`],
    [/^Sesiones en (.+)$/, (m, a) => `Sessions in ${a}`],
    [/^Últimas 16 semanas · (\d+) días? con entreno$/, (m, a) => `Last 16 weeks · ${a} training day${a === '1' ? '' : 's'}`],
    [/^(\d+) sesi(?:ón valorada|ones valoradas) · escala de 1 a 5$/, (m, a) => `${a} rated session${a === '1' ? '' : 's'} · scale of 1 to 5`],
    [/^(.+) \((cm|kg|%|s|km)\)$/, (m, a, u) => { const t = translate(a); return t === a ? m : `${t} (${u})`; }],
    [/^Ferrum (v\d+) — tus datos viven solo en este móvil \(IndexedDB\), sin cuentas ni servidores\. Haz copias de seguridad desde el apartado «Copia de seguridad» de esta misma pantalla\.$/,
      (m, a) => `Ferrum ${a} — your data lives only on this phone (IndexedDB), no accounts or servers. Make backups from the «Backup» section on this same screen.`],
  ] : [];

  // Fragmentos de plantilla: se sustituyen dentro del texto, del más largo
  // al más corto, solo si no están pegados a otras letras.
  let fragRe = null;
  const fragMap = new Map();
  if (lang === 'en') {
    for (const f of EN.fragments || []) {
      const v = exact.get(f);
      if (v && /[^\p{L}]/u.test(f)) fragMap.set(f, v); // solo con espacio o signos: nunca una palabra suelta
    }
    const keys = [...fragMap.keys()].sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    try { if (keys.length) fragRe = new RegExp(`(?<![\\p{L}])(?:${keys.join('|')})(?![\\p{L}])`, 'gu'); } catch { fragRe = null; }
  }

  const cache = new Map();
  function tr(text) {
    if (lang !== 'en' || !text) return text;
    const key = text.trim().replace(/\s+/g, ' ');
    if (!key || !/\p{L}/u.test(key)) return text;
    let out = cache.get(key);
    if (out === undefined) {
      out = translate(key);
      if (cache.size > 4000) cache.clear();
      cache.set(key, out);
    }
    if (out === key) return text;
    const lead = text.match(/^\s*/)[0], tail = text.match(/\s*$/)[0];
    return lead + out + tail;
  }
  function translate(key) {
    const hit = exact.get(key);
    if (hit) return hit;
    for (const [re, fn] of RULES) { const m = key.match(re); if (m) return fn(...m); }
    if (key.includes(' · ')) {
      const parts = key.split(' · ');
      const done = parts.map((p) => translate(p.trim()));
      if (done.some((d, i) => d !== parts[i].trim())) return done.join(' · ');
    }
    const colon = key.match(/^([^:]{2,40}):\s(.+)$/);
    if (colon && exact.has(colon[1] + ':')) return `${exact.get(colon[1] + ':')} ${translate(colon[2])}`;
    if (colon && exact.has(colon[1])) return `${exact.get(colon[1])}: ${translate(colon[2])}`;
    if (fragRe) {
      const replaced = key.replace(fragRe, (m) => fragMap.get(m) || m);
      if (replaced !== key) return replaced;
    }
    return key;
  }

  const api = {
    lang, palette, t: tr,
    setLang(next) {
      try { localStorage.setItem('ferrum-lang', next === 'en' ? 'en' : 'es'); } catch { /* noop */ }
      langOut(() => location.reload());
    },
    palettes: PALETTES,
    hue: () => Math.max(0, Math.min(360, Number(read('ferrum-hue')) || 255)),
    setPalette(next) {
      const p = PALETTES.includes(next) ? next : 'cobre';
      try { localStorage.setItem('ferrum-palette', p); } catch { /* noop */ }
      root.dataset.fuiPalette = p;
      if (p === 'custom') applyCustom(api.hue());
      else { root.style.removeProperty('--p-h'); root.style.removeProperty('--icon-filter'); }
    },
    setHue(h) {
      const v = Math.round(Math.max(0, Math.min(360, Number(h) || 0)));
      try { localStorage.setItem('ferrum-hue', String(v)); } catch { /* noop */ }
      applyCustom(v);
    },
  };
  window.__ferrumI18n = api;

  // --- Animación al cambiar de idioma (v88) ----------------------------------
  // Cambiar de idioma recarga la app. Antes de recargar, los textos visibles se
  // «codifican»: sus letras pasan a signos al azar, de arriba abajo. Al volver
  // a cargar salen codificados y se descifran letra a letra en el idioma nuevo.
  // Solo cambia el texto de los nodos (nunca la estructura) y respeta «reducir
  // movimiento».
  const FX_KEY = 'ferrum-lang-fx';
  const held = new WeakSet(); // nodos en animación: el traductor no los toca
  const reduceMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
  const UP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', LO = 'abcdefghijklmnopqrstuvwxyz', DG = '0123456789', SY = '#%&*+=/<>$@';
  const pick = (set) => set[(Math.random() * set.length) | 0];
  const isGlyph = (c) => /[\p{L}\p{N}]/u.test(c);
  const noiseOf = (c) => {
    if (!isGlyph(c)) return c; // espacios y signos se quedan: se ven las palabras
    if (Math.random() < 0.16) return pick(SY);
    if (/\p{N}/u.test(c)) return pick(DG);
    return c === c.toLowerCase() ? pick(LO) : pick(UP);
  };
  function visibleTexts(max = 180) {
    const out = [];
    const H = innerHeight, W = innerWidth, range = document.createRange();
    const it = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = it.nextNode(); n && out.length < max; n = it.nextNode()) {
      const p = n.parentElement;
      if (!p || !/[\p{L}\p{N}]/u.test(n.data) || SKIP.has(p.tagName) || p.closest('svg, select, option, [data-lang-fx-skip]')) continue;
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue;
      const cs = getComputedStyle(p);
      if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
      out.push({ node: n, y: r.top });
    }
    return out;
  }
  // mode 'out': texto → signos. mode 'in': signos → texto (el texto actual).
  function scramble(items, mode, total, onEnd) {
    const H = innerHeight || 1;
    const jobs = items.map(({ node, y }) => {
      const chars = [...node.data];
      const wave = Math.max(0, Math.min(1, y / H)) * total * 0.32; // de arriba abajo
      const span = total * (mode === 'out' ? 0.34 : 0.46);
      const at = chars.map((c, i) => wave + (i / Math.max(1, chars.length)) * span + Math.random() * total * 0.14);
      held.add(node);
      return { node, chars, at, noise: chars.map(noiseOf), last: null, dead: false };
    });
    const t0 = performance.now();
    let n = 0, ended = false;
    const end = () => {
      if (ended) return; ended = true;
      if (mode === 'in') for (const j of jobs) if (!j.dead) { j.node.data = j.chars.join(''); held.delete(j.node); }
      onEnd?.();
    };
    const frame = (now) => {
      if (ended) return;
      const t = (now || performance.now()) - t0;
      const refresh = n++ % 2 === 0; // los signos cambian cada ~33 ms
      for (const j of jobs) {
        if (j.dead) continue;
        if (j.last !== null && j.node.data !== j.last) { j.dead = true; held.delete(j.node); continue; } // la app lo cambió
        if (refresh) j.noise = j.chars.map(noiseOf);
        let s = '';
        for (let i = 0; i < j.chars.length; i++) s += (mode === 'out' ? t >= j.at[i] : t < j.at[i]) ? j.noise[i] : j.chars[i];
        if (s !== j.node.data) j.node.data = s;
        j.last = j.node.data;
      }
      if (t < total) requestAnimationFrame(frame); else end();
    };
    frame(t0);
    setTimeout(end, total + 600); // por si el navegador frena los fotogramas
  }
  function langOut(reload) {
    try { sessionStorage.setItem(FX_KEY, String(Date.now())); } catch { /* noop */ }
    let items = [];
    try { if (!reduceMotion() && document.body && document.visibilityState === 'visible') items = visibleTexts(); } catch { items = []; }
    if (!items.length) { reload(); return; }
    scramble(items, 'out', 225, reload);
  }
  // Al volver a cargar: el texto espera transparente hasta que la vista está
  // lista, sale en signos y se descifra.
  (() => {
    let at = 0;
    try { at = Number(sessionStorage.getItem(FX_KEY)) || 0; sessionStorage.removeItem(FX_KEY); } catch { /* noop */ }
    if (!at || Date.now() - at > 10000) return;
    window.__ferrumLangSwitched = true; // recarga por idioma: no es «abrir la app»
    if (reduceMotion()) return;
    const st = document.createElement('style');
    st.textContent = 'html.lx-pending body, html.lx-pending body * { color: transparent !important; -webkit-text-fill-color: transparent !important; }';
    (document.head || root).appendChild(st);
    root.classList.add('lx-pending');
    const release = () => { root.classList.remove('lx-pending'); st.remove(); };
    const ready = () => window.__ferrumBooted && document.querySelector('#view > *') && (!/^#\/more/.test(location.hash) || document.querySelector('.st-root'));
    const t0 = Date.now();
    const poll = () => {
      if (document.getElementById('pin-gate')) { release(); return; }
      if (!ready()) { if (Date.now() - t0 < 4000) setTimeout(poll, 40); else release(); return; }
      requestAnimationFrame(() => {
        let items = [];
        try { items = visibleTexts(); } catch { items = []; }
        try { scramble(items, 'in', 550); } catch { /* el texto queda como está */ }
        release(); // el primer fotograma ya está en signos
      });
    };
    setTimeout(poll, 40);
  })();

  // Los controles de idioma y estilo viven en ui/ferrum-settings-v1.js.
  function injectSettings() { /* ver ferrum-settings-v1.js */ }

  // --- Traducción en vivo (solo en inglés) -----------------------------------
  const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'NOSCRIPT']);
  const skipEl = (el) => !el || SKIP.has(el.tagName) || el.isContentEditable || el.closest?.('[data-i18n-skip], .fx-layer');
  // Cabecera del calendario: letras de los días (L M X J V S D).
  const DOW = { L: 'M', M: 'T', X: 'W', J: 'T', V: 'F', S: 'S', D: 'S' };
  const dowDone = new WeakSet();
  function doText(node) {
    if (held.has(node)) return;
    const p = node.parentElement;
    if (skipEl(p)) return;
    const v = node.data;
    if (p.classList?.contains('mcal-dow')) { const k = v.trim(); if (!dowDone.has(node)) { dowDone.add(node); if (DOW[k] && DOW[k] !== k) node.data = DOW[k]; } return; }
    const next = tr(v);
    if (next !== v) node.data = next;
  }
  function doAttrs(el) {
    for (const a of ATTRS) {
      const v = el.getAttribute?.(a);
      if (v) { const n = tr(v); if (n !== v) el.setAttribute(a, n); }
    }
  }
  function walk(node) {
    if (node.nodeType === 3) { doText(node); return; }
    if (node.nodeType !== 1 || skipEl(node)) return;
    doAttrs(node);
    const it = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n = it.nextNode();
    while (n) {
      if (n.nodeType === 3) doText(n);
      else if (skipEl(n)) { /* el walker sigue; doText comprueba el padre */ }
      else doAttrs(n);
      n = it.nextNode();
    }
  }
  function observe() {
    const mo = new MutationObserver((list) => {
      for (const m of list) {
        if (m.type === 'childList') {
          for (const n of m.addedNodes) {
            if (lang === 'en') walk(n);
            if (n.nodeType === 1 && (n.id === 's-theme' || n.querySelector?.('#s-theme'))) injectSettings();
          }
        } else if (lang === 'en' && m.type === 'characterData') doText(m.target);
        else if (lang === 'en' && m.type === 'attributes') {
          const v = m.target.getAttribute(m.attributeName);
          if (v) { const n = tr(v); if (n !== v) m.target.setAttribute(m.attributeName, n); }
        }
      }
    });
    mo.observe(root, lang === 'en'
      ? { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS }
      : { childList: true, subtree: true });
    if (document.body) { if (lang === 'en') walk(document.body); injectSettings(); }
  }

  if (lang === 'en') {
    // Diálogos nativos
    for (const name of ['alert', 'confirm']) {
      const orig = window[name];
      if (typeof orig === 'function') window[name] = function (msg) { return orig.call(window, tr(String(msg ?? ''))); };
    }
    const prompt0 = window.prompt;
    if (typeof prompt0 === 'function') window.prompt = function (msg, def) { return prompt0.call(window, tr(String(msg ?? '')), def); };
    // Fechas y números: «es-ES» → «en-GB»
    const loc = (l) => (l === undefined ? 'en-GB' : typeof l === 'string' ? (/^es\b/i.test(l) ? 'en-GB' : l) : Array.isArray(l) ? l.map(loc) : l);
    const wrapProto = (proto, name) => {
      const orig = proto[name];
      if (typeof orig === 'function') proto[name] = function (l, o) { return orig.call(this, loc(l), o); };
    };
    wrapProto(Date.prototype, 'toLocaleDateString');
    wrapProto(Date.prototype, 'toLocaleTimeString');
    wrapProto(Date.prototype, 'toLocaleString');
    wrapProto(Number.prototype, 'toLocaleString');
    for (const name of ['DateTimeFormat', 'NumberFormat', 'RelativeTimeFormat', 'PluralRules', 'ListFormat']) {
      const C = Intl[name];
      if (typeof C !== 'function') continue;
      const W = function (l, o) { return new C(loc(l), o); };
      W.prototype = C.prototype;
      W.supportedLocalesOf = C.supportedLocalesOf?.bind(C);
      try { Intl[name] = W; } catch { /* noop */ }
    }
    try { document.title = tr(document.title); } catch { /* noop */ }
  }

  // Se observa ya desde el <head>: el parser y la app insertan después el
  // body y la vista, y todo pasa por el observador.
  try { observe(); } catch { /* nunca bloquear el arranque */ }
  document.addEventListener('DOMContentLoaded', () => { try { if (lang === 'en') walk(document.body); injectSettings(); } catch { /* noop */ } }, { once: true });
})();
