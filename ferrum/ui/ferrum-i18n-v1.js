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
  const palette = read('ferrum-palette') === 'rosa' ? 'rosa' : 'grafito';
  root.dataset.fuiPalette = palette;
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
    [/^Marcar serie (\d+) como hecha$/, (m, a) => `Mark set ${a} as done`],
    [/^(KG|REPS) serie (\d+)$/, (m, a, b) => `${a} set ${b}`],
    [/^Demasiados intentos\. Espera (\d+) s…$/, (m, a) => `Too many attempts. Wait ${a} s…`],
    [/^Eliminar entrenamiento (.+)$/, (m, a) => `Delete workout ${a}`],
    [/^Quitar serie (\d+)$/, (m, a) => `Remove set ${a}`],
    [/^Desmarcar serie (\d+) como hecha$/, (m, a) => `Unmark set ${a} as done`],
    [/^Tipo de serie: (.+)\. Toca para cambiar\.$/, (m, a) => `Set type: ${tr(a)}. Tap to change.`],
    [/^Versión (v\d+)$/, (m, a) => `Version ${a}`],
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
    setLang(next) { try { localStorage.setItem('ferrum-lang', next === 'en' ? 'en' : 'es'); } catch { /* noop */ } location.reload(); },
    setPalette(next) {
      const p = next === 'rosa' ? 'rosa' : 'grafito';
      try { localStorage.setItem('ferrum-palette', p); } catch { /* noop */ }
      root.dataset.fuiPalette = p;
    },
  };
  window.__ferrumI18n = api;

  // --- Ajustes: Estilo e Idioma ---------------------------------------------
  const L = lang === 'en'
    ? { style: 'Style', grafito: 'Graphite', rosa: 'Pink', language: 'Language', units: 'Units: kilograms' }
    : { style: 'Estilo', grafito: 'Grafito', rosa: 'Rosa', language: 'Idioma', units: 'Unidades: kilogramos' };
  function injectSettings() {
    const theme = document.getElementById('s-theme');
    if (!theme || document.getElementById('s-palette')) return;
    const wrap = document.createElement('div');
    wrap.dataset.i18nSkip = '1';
    wrap.innerHTML = `
      <label class="f" for="s-palette">${L.style}</label>
      <select id="s-palette">
        <option value="grafito"${palette === 'grafito' ? ' selected' : ''}>${L.grafito}</option>
        <option value="rosa"${root.dataset.fuiPalette === 'rosa' ? ' selected' : ''}>${L.rosa}</option>
      </select>
      <label class="f" for="s-lang">${L.language}</label>
      <select id="s-lang">
        <option value="es"${lang === 'es' ? ' selected' : ''}>Español</option>
        <option value="en"${lang === 'en' ? ' selected' : ''}>English</option>
      </select>`;
    theme.insertAdjacentElement('afterend', wrap);
    wrap.querySelector('#s-palette').value = root.dataset.fuiPalette;
    wrap.querySelector('#s-palette').addEventListener('change', (e) => api.setPalette(e.target.value));
    wrap.querySelector('#s-lang').addEventListener('change', (e) => api.setLang(e.target.value));
    // El tono de fondo no se usa con este diseño: se oculta su control.
    if (root.dataset.fuiSkin === 'command') {
      const hue = document.querySelector('.hue-row');
      if (hue) {
        hue.style.display = 'none';
        const lbl = hue.previousElementSibling;
        if (lbl?.matches('label.f')) lbl.style.display = 'none';
      }
    }
    for (const el of document.querySelectorAll('#view .small.muted')) {
      if (/^(Unidades: kilogramos|Units: kilograms)/.test(el.textContent.trim())) el.textContent = L.units;
    }
  }

  // --- Traducción en vivo (solo en inglés) -----------------------------------
  const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'NOSCRIPT']);
  const skipEl = (el) => !el || SKIP.has(el.tagName) || el.isContentEditable || el.closest?.('[data-i18n-skip], .fx-layer');
  // Cabecera del calendario: letras de los días (L M X J V S D).
  const DOW = { L: 'M', M: 'T', X: 'W', J: 'T', V: 'F', S: 'S', D: 'S' };
  function doText(node) {
    const p = node.parentElement;
    if (skipEl(p)) return;
    const v = node.data;
    if (p.classList?.contains('mcal-dow')) { const k = v.trim(); if (DOW[k] && DOW[k] !== k) node.data = DOW[k]; return; }
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
