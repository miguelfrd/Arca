// Ferrum · Ajustes reorganizados (estilo Ajustes de iOS) y conexión con Salud.
//
// La pantalla de Ajustes la pinta el bundle (#/more). Este módulo, al verla,
// reordena sus piezas en grupos: lo que más se toca arriba (Apariencia,
// Entrenamiento), luego Salud, Privacidad, y lo avanzado un nivel más abajo
// (Datos y copias en una subpantalla). Mueve los nodos originales, así que
// sus listeners y el guardado siguen siendo los del bundle.
//
// Salud de Apple: una web no puede escribir en HealthKit; se hace con un
// atajo de la app Atajos que recibe el entrenamiento como texto
// (shortcuts://run-shortcut) y usa «Registrar entrenamiento».
(() => {
  const root = document.documentElement;
  const I = () => window.__ferrumI18n || {};
  const en = () => (I().lang || root.lang) === 'en';
  const t = (es, enText) => (en() ? enText : es);
  const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* noop */ } };
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  // --- Salud ------------------------------------------------------------------
  const SHORTCUT = { strength: 'Ferrum Salud', flex: 'Ferrum Flex' };
  const health = {
    enabled: (kind) => read(kind === 'flex' ? 'ferrum-health-flex' : 'ferrum-health') === '1',
    set: (kind, on) => write(kind === 'flex' ? 'ferrum-health-flex' : 'ferrum-health', on ? '1' : '0'),
    // Abre el atajo con los datos. Debe llamarse desde un toque del usuario.
    log({ kind = 'strength', minutes, start, name }) {
      const d = new Date(start || Date.now() - minutes * 60000);
      const pad = (n) => String(n).padStart(2, '0');
      const inicio = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      const payload = JSON.stringify({ minutos: Math.max(1, Math.round(minutes)), inicio, nombre: name || 'Ferrum' });
      location.href = `shortcuts://run-shortcut?name=${encodeURIComponent(SHORTCUT[kind] || SHORTCUT.strength)}&input=text&text=${encodeURIComponent(payload)}`;
    },
  };
  window.__ferrumHealth = health;

  async function db() {
    const src = document.querySelector('script[type="module"][src*="assets/index-"]')?.src;
    return src ? (await import(src)).d : null;
  }

  // Botón en el resumen de fin de entrenamiento
  function wireFinish(ov) {
    if (ov.dataset.healthWired || !health.enabled('strength')) return;
    const modal = ov.querySelector('.modal');
    const title = modal?.querySelector('h3');
    if (!title || !/completada|complete/i.test(title.textContent)) return;
    ov.dataset.healthWired = '1';
    const btn = el('button', 'btn secondary fx-health-btn', `<span class="fx-heart" aria-hidden="true">♥</span> ${t('Guardar en Salud', 'Save to Health')}`);
    btn.type = 'button';
    btn.addEventListener('click', async () => {
      const h = Number(modal.querySelector('#fin-dur-h')?.value) || 0;
      const m = Number(modal.querySelector('#fin-dur-m')?.value) || 0;
      let start, name;
      try { const w = (await (await db())?.workoutsDesc(1))?.[0]; start = w?.startTime; name = w?.title; } catch { /* noop */ }
      health.log({ kind: 'strength', minutes: h * 60 + m || 1, start, name });
      btn.innerHTML = `<span class="fx-heart" aria-hidden="true">♥</span> ${t('Enviado a Salud', 'Sent to Health')}`;
    });
    const done = [...modal.querySelectorAll('button.btn')].pop();
    if (done?.parentElement) done.parentElement.insertBefore(btn, done); else modal.appendChild(btn);
  }

  // --- Piezas reutilizables -------------------------------------------------
  function segmented(options, value, onChange) {
    const wrap = el('div', 'st-seg');
    wrap.setAttribute('role', 'radiogroup');
    for (const [v, label] of options) {
      const b = el('button', 'st-seg-btn', label);
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(v === value));
      if (v === value) b.classList.add('on');
      b.addEventListener('click', () => {
        wrap.querySelectorAll('.st-seg-btn').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', String(x === b)); });
        onChange(v);
      });
      wrap.appendChild(b);
    }
    return wrap;
  }
  function row(label, control, sub) {
    const r = el('div', 'st-row');
    const l = el('div', 'st-label', `<span>${label}</span>${sub ? `<small>${sub}</small>` : ''}`);
    r.append(l);
    if (control) r.append(control);
    return r;
  }
  function linkRow(icon, label, value, onOpen) {
    const r = el('button', 'st-row st-link', `<span class="st-ic">${icon}</span><span class="st-label"><span>${label}</span></span><span class="st-value">${value || ''}</span><span class="st-chev" aria-hidden="true">›</span>`);
    r.type = 'button';
    r.addEventListener('click', onOpen);
    return r;
  }
  function group(title, ...children) {
    const g = el('section', 'st-group');
    if (title) g.append(el('h2', 'st-head', title));
    const card = el('div', 'st-card');
    for (const c of children) if (c) card.append(c);
    g.append(card);
    return g;
  }
  function switchify(input) { if (input) { input.classList.add('st-switch'); input.setAttribute('role', 'switch'); } return input; }

  // --- Subpantallas (entran por la derecha y salen por el mismo camino) -------
  function openPage(title, build) {
    const page = el('div', 'st-page');
    page.setAttribute('role', 'dialog');
    page.setAttribute('aria-label', title);
    const bar = el('div', 'st-page-bar');
    const back = el('button', 'st-back', `<span aria-hidden="true">‹</span> ${t('Ajustes', 'Settings')}`);
    back.type = 'button';
    bar.append(back);
    const body = el('div', 'st-page-body');
    body.append(el('h1', 'st-page-title', title));
    page.append(bar, body);
    const restore = build(body) || (() => {});
    document.body.appendChild(page);
    requestAnimationFrame(() => page.classList.add('in'));
    let closed = false;
    const close = () => {
      if (closed) return; closed = true;
      page.classList.remove('in');
      page.classList.add('out');
      const end = () => { restore(); page.remove(); };
      page.addEventListener('transitionend', end, { once: true });
      setTimeout(end, 520);
      window.removeEventListener('hashchange', close);
    };
    back.addEventListener('click', close);
    window.addEventListener('hashchange', close);
    return close;
  }

  // --- Color: muestras + selector de tono -----------------------------------
  const SWATCHES = [
    ['grafito', '#2a2b2f', t('Grafito', 'Graphite')],
    ['rosa', '#f0478f', t('Rosa', 'Pink')],
    ['azul', 'oklch(.62 .19 255)', t('Azul', 'Blue')],
    ['rojo', 'oklch(.62 .21 25)', t('Rojo', 'Red')],
    ['verde', 'oklch(.66 .17 152)', t('Verde', 'Green')],
    ['violeta', 'oklch(.6 .2 295)', t('Violeta', 'Violet')],
    ['custom', 'conic-gradient(from 0deg, oklch(.7 .18 0), oklch(.7 .18 60), oklch(.7 .18 120), oklch(.7 .18 180), oklch(.7 .18 240), oklch(.7 .18 300), oklch(.7 .18 360))', t('Personalizado', 'Custom')],
  ];
  function colorPicker() {
    const box = el('div', 'st-color');
    const sw = el('div', 'st-swatches');
    sw.setAttribute('role', 'radiogroup');
    sw.setAttribute('aria-label', t('Color', 'Color'));
    const hueWrap = el('div', 'st-hue');
    const hueInput = el('input');
    hueInput.type = 'range'; hueInput.min = '0'; hueInput.max = '360'; hueInput.step = '1';
    hueInput.value = String(I().hue ? I().hue() : 255);
    hueInput.setAttribute('aria-label', t('Tono', 'Hue'));
    const hueVal = el('span', 'st-hue-val', `${hueInput.value}°`);
    hueWrap.append(hueInput, hueVal);
    const name = el('div', 'st-color-name');
    const sync = () => {
      const cur = root.dataset.fuiPalette || 'grafito';
      sw.querySelectorAll('button').forEach((b) => { const on = b.dataset.v === cur; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); });
      hueWrap.hidden = cur !== 'custom';
      name.textContent = SWATCHES.find((s) => s[0] === cur)?.[2] || '';
    };
    for (const [v, bg, label] of SWATCHES) {
      const b = el('button', 'st-swatch');
      b.type = 'button'; b.dataset.v = v;
      b.setAttribute('role', 'radio'); b.setAttribute('aria-label', label);
      b.style.setProperty('--sw', bg);
      b.addEventListener('click', () => { I().setPalette?.(v); sync(); });
      sw.appendChild(b);
    }
    hueInput.addEventListener('input', () => {
      hueVal.textContent = `${hueInput.value}°`;
      if (root.dataset.fuiPalette !== 'custom') I().setPalette?.('custom');
      I().setHue?.(hueInput.value);
      sync();
    });
    box.append(sw, name, hueWrap);
    sync();
    return box;
  }

  // --- Reorganización -------------------------------------------------------
  function organize() {
    const body = document.getElementById('more-body');
    if (!body || body.dataset.stDone || !document.getElementById('s-theme')) return;
    body.dataset.stDone = '1';
    const $ = (id) => document.getElementById(id);
    const sectionOf = (anchor) => anchor?.closest('.card');
    const titleBefore = (card) => (card?.previousElementSibling?.classList.contains('sec-title') ? card.previousElementSibling : null);
    const take = (card) => { const tt = titleBefore(card); return { title: tt, card }; };

    // Tarjetas originales
    const cJson = sectionOf($('bk-export'));
    const cAuto = sectionOf($('bk-auto-token'));
    const cCsv = sectionOf($('bk-csv-w'));
    const cWipe = sectionOf($('bk-wipe'));
    const cPriv = sectionOf($('s-lock'));
    const cApp = sectionOf($('ck-upd'));
    const cAbout = [...body.querySelectorAll('.card')].find((c) => /IndexedDB/.test(c.textContent));
    const theme = $('s-theme');
    const rowOf = (input) => input?.closest('.row');

    const out = el('div', 'st-root');

    // Apariencia
    const themeSeg = segmented([['light', t('Claro', 'Light')], ['dark', t('Oscuro', 'Dark')]], theme.value, (v) => {
      theme.value = v; theme.dispatchEvent(new Event('change', { bubbles: true }));
    });
    const langSeg = segmented([['es', 'Español'], ['en', 'English']], I().lang || 'es', (v) => I().setLang?.(v));
    const colorRow = row(t('Color', 'Color'), null);
    colorRow.classList.add('st-col');
    colorRow.append(colorPicker());
    out.append(group(t('Apariencia', 'Appearance'), row(t('Tema', 'Theme'), themeSeg), colorRow, row(t('Idioma', 'Language'), langSeg)));

    // Entrenamiento
    const rest = $('s-rest');
    const restCtl = el('div', 'st-inline');
    if (rest) { rest.classList.add('st-num'); restCtl.append(rest, el('span', 'st-unit', 's')); }
    const train = [row(t('Descanso por defecto', 'Default rest'), restCtl)];
    for (const id of ['s-sound', 's-lockcard', 's-rpe']) {
      const r = rowOf($(id));
      if (r) { switchify($(id)); r.className = 'st-row st-legacy'; train.push(r); }
    }
    out.append(group(t('Entrenamiento', 'Training'), ...train));

    // Salud
    const healthState = () => (health.enabled('strength') || health.enabled('flex') ? t('Activado', 'On') : t('No', 'Off'));
    const healthRow = linkRow('<span class="st-ic-heart">♥</span>', t('Salud de Apple', 'Apple Health'), healthState(), () => openPage(t('Salud de Apple', 'Apple Health'), (pb) => {
      pb.append(el('p', 'st-lead', t(
        'Ferrum puede guardar cada entrenamiento y cada sesión de estiramientos en Salud. Lo hace con un atajo de la app Atajos que creas una sola vez.',
        'Ferrum can save each workout and stretching session to Health, through a shortcut you create once in the Shortcuts app.')));
      const sw = (kind) => {
        const i = el('input'); i.type = 'checkbox'; i.checked = health.enabled(kind); switchify(i);
        i.addEventListener('change', () => { health.set(kind, i.checked); healthRow.querySelector('.st-value').textContent = healthState(); });
        return i;
      };
      pb.append(group(null,
        row(t('Entrenamientos de fuerza', 'Strength workouts'), sw('strength'), t(`Al terminar, botón «Guardar en Salud» (atajo «${SHORTCUT.strength}»)`, `When you finish, a “Save to Health” button (shortcut “${SHORTCUT.strength}”)`)),
        row(t('Estiramientos', 'Stretching'), sw('flex'), t(`Como flexibilidad (atajo «${SHORTCUT.flex}»)`, `As flexibility (shortcut “${SHORTCUT.flex}”)`))));
      const steps = en() ? [
        `Open Shortcuts and create a new shortcut named <b>${SHORTCUT.strength}</b>.`,
        'Add <b>Get Dictionary from</b> → Shortcut Input.',
        'Add <b>Get Dictionary Value</b> with key <b>minutos</b>.',
        'Add <b>Log Workout</b>: type <b>Traditional Strength Training</b>, duration = Dictionary Value (minutes).',
        `For stretching, duplicate it, name it <b>${SHORTCUT.flex}</b> and change the type to <b>Flexibility</b>.`,
        'The first time, iPhone asks permission to write to Health: allow it.',
      ] : [
        `Abre Atajos y crea un atajo nuevo llamado <b>${SHORTCUT.strength}</b>.`,
        'Añade <b>Obtener diccionario de</b> → Entrada del atajo.',
        'Añade <b>Obtener valor del diccionario</b> con la clave <b>minutos</b>.',
        'Añade <b>Registrar entrenamiento</b>: tipo <b>Fuerza tradicional</b>, duración = Valor del diccionario (minutos).',
        `Para los estiramientos, duplícalo, llámalo <b>${SHORTCUT.flex}</b> y cambia el tipo a <b>Flexibilidad</b>.`,
        'La primera vez, el iPhone pide permiso para escribir en Salud: acéptalo.',
      ];
      const g = group(t('Configúralo una vez', 'Set it up once'));
      const ol = el('ol', 'st-steps');
      for (const s of steps) ol.append(el('li', null, s));
      g.querySelector('.st-card').append(ol);
      const open = el('button', 'btn', t('Abrir Atajos', 'Open Shortcuts'));
      open.type = 'button';
      open.addEventListener('click', () => { location.href = 'shortcuts://'; });
      g.querySelector('.st-card').append(open);
      pb.append(g);
      pb.append(el('p', 'st-foot', t(
        'Ferrum no lee nada de Salud: solo envía al atajo la duración, la hora de inicio y el nombre del entrenamiento cuando tú lo pides.',
        'Ferrum never reads your Health data: it only sends the duration, start time and workout name to the shortcut when you ask.')));
    }));
    out.append(group(t('Salud', 'Health'), healthRow));

    // Privacidad (la tarjeta original, entera)
    if (cPriv) { const g = group(t('Privacidad', 'Privacy')); g.querySelector('.st-card').append(...cPriv.childNodes); g.querySelector('.st-card').classList.add('st-legacy-card'); out.append(g); titleBefore(cPriv)?.remove(); cPriv.remove(); }

    // Datos y copias → subpantalla
    const dataParts = [cJson, cAuto, cCsv, cWipe].filter(Boolean).map(take);
    const holder = el('div', 'st-hold'); holder.hidden = true;
    for (const p of dataParts) { if (p.title) holder.append(p.title); holder.append(p.card); }
    out.append(group(t('Datos', 'Data'), linkRow('<span class="st-ic-data">⇅</span>', t('Copias y exportación', 'Backups & export'), '', () => openPage(t('Copias y exportación', 'Backups & export'), (pb) => {
      pb.append(...holder.childNodes);
      return () => holder.append(...pb.querySelectorAll(':scope > .sec-title, :scope > .card'));
    }))));
    out.append(holder);

    // Aplicación + Acerca de
    const appCard = group(t('Aplicación', 'App'));
    if (cApp) { appCard.querySelector('.st-card').append(...cApp.childNodes); titleBefore(cApp)?.remove(); cApp.remove(); }
    if (cAbout) { const p = el('p', 'st-foot'); p.append(...cAbout.childNodes); appCard.append(p); titleBefore(cAbout)?.remove(); cAbout.remove(); }
    out.append(appCard);

    // Ocultar lo que ya no se usa y colocar la nueva estructura arriba
    theme.closest('.card')?.setAttribute('hidden', '');
    const persTitle = titleBefore(theme.closest('.card')); if (persTitle) persTitle.hidden = true;
    const ajCard = sectionOf($('s-sound')) || sectionOf(rest);
    for (const c of body.querySelectorAll('.card')) {
      if (c.closest('.st-root, .st-hold')) continue;
      if (c === ajCard || /Unidades: kilogramos|Units: kilograms/.test(c.textContent)) { c.hidden = true; const tt = titleBefore(c); if (tt) tt.hidden = true; }
    }
    body.prepend(out);
  }

  // --- Observador -------------------------------------------------------------
  const scan = () => { try { organize(); } catch (e) { /* nunca romper Ajustes */ } };
  const start = () => {
    new MutationObserver((list) => {
      for (const m of list) for (const n of m.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (n.id === 'more-body' || n.querySelector?.('#s-theme') || n.id === 's-theme') scan();
        if (n.classList?.contains('modal-overlay')) setTimeout(() => { try { wireFinish(n); } catch { /* noop */ } }, 60);
      }
    }).observe(document.body, { childList: true, subtree: true });
    scan();
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
