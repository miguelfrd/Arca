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
    configured: () => read('ferrum-health-setup') === '1',
    // Abre el atajo pasándole solo los minutos: el atajo resta esos minutos a
    // la hora actual para la fecha de inicio y registra el entrenamiento.
    // Debe llamarse desde un toque del usuario.
    log({ kind = 'strength', minutes }) {
      const payload = String(Math.max(1, Math.round(minutes)));
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
      let minutes = h * 60 + m;
      if (!minutes) { try { const w = (await (await db())?.workoutsDesc(1))?.[0]; minutes = w?.endTime ? (w.endTime - w.startTime) / 60000 : 1; } catch { minutes = 1; } }
      health.log({ kind: 'strength', minutes });
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

  // --- Salud: página y guía paso a paso -------------------------------------
  const copyBtn = (text) => {
    const b = el('button', 'hw-copy', `<span aria-hidden="true">⧉</span> ${t('Copiar', 'Copy')} «${text}»`);
    b.type = 'button';
    b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(text); } catch { /* sin portapapeles */ }
      b.innerHTML = `✓ ${t('Copiado', 'Copied')}`;
      setTimeout(() => { b.innerHTML = `<span aria-hidden="true">⧉</span> ${t('Copiar', 'Copy')} «${text}»`; }, 1600);
    });
    return b;
  };
  const openShortcuts = (label) => {
    const b = el('button', 'btn secondary hw-open', label || t('Abrir Atajos', 'Open Shortcuts'));
    b.type = 'button';
    b.addEventListener('click', () => { location.href = 'shortcuts://'; });
    return b;
  };
  // Dibujos del editor de Atajos (simplificados) para cada paso.
  const tok = (txt, hot) => `<span class="hw-tok${hot ? ' hot' : ''}">${txt}</span>`;
  const action = (icon, color, body, hot) => `<div class="hw-act${hot ? ' hot' : ''}"><span class="hw-aic" style="background:${color}">${icon}</span><div class="hw-abody">${body}</div></div>`;
  const N = () => ({
    sc: t('Atajos', 'Shortcuts'), input: t('Entrada del atajo', 'Shortcut Input'), now: t('Fecha actual', 'Current Date'),
    adj: t('Fecha ajustada', 'Adjusted Date'), adjust: t('Ajustar fecha', 'Adjust Date'), log: t('Registrar entrenamiento', 'Log Workout'),
    sub: t('Restar', 'Subtract'), min: t('minutos', 'minutes'), strength: t('Fuerza tradicional', 'Traditional Strength Training'),
    flex: t('Flexibilidad', 'Flexibility'), start: t('Fecha de inicio', 'Start Date'), dur: t('Duración', 'Duration'), search: t('Buscar acciones', 'Search for actions'),
  });
  function steps() {
    const n = N();
    const adjustBlock = (hot) => action('📅', '#ff9f0a', `<b>${n.adjust}</b><div class="hw-line">${tok(n.sub, hot)} ${tok(n.input, hot)} ${tok(n.min, hot)}</div><div class="hw-line">${t('de', 'from')} ${tok(n.now, hot)}</div>`, hot);
    const logBlock = (type, hot) => action('♥', '#ff2d55', `<b>${n.log}</b><div class="hw-line">${t('Tipo', 'Type')} ${tok(type, hot)}</div><div class="hw-line">${n.start} ${tok(n.adj, hot)}</div><div class="hw-line">${n.dur} ${tok(n.input, hot)} ${tok('min', hot)}</div>`, hot);
    return [
      {
        title: t('Abre Atajos y crea uno nuevo', 'Open Shortcuts and make a new one'),
        text: t('Atajos es una app de Apple que ya viene en el iPhone (icono de dos cuadrados de colores). Ábrela y toca <b>+</b>, arriba a la derecha.', 'Shortcuts is an Apple app that comes with your iPhone (two colourful squares icon). Open it and tap <b>+</b> at the top right.'),
        mock: `<div class="hw-top"><span class="hw-big">${n.sc}</span><span class="hw-plus hot">+</span></div><div class="hw-tiles"><span></span><span></span><span></span><span></span></div>`,
        extra: () => [openShortcuts()],
      },
      {
        title: t('Ponle este nombre', 'Give it this name'),
        text: t('Toca el nombre de arriba («Nuevo atajo»), elige <b>Cambiar nombre</b> y escribe exactamente <b>Ferrum Salud</b>. Ferrum lo busca por ese nombre.', 'Tap the name at the top (“New Shortcut”), choose <b>Rename</b> and type exactly <b>Ferrum Salud</b>. Ferrum looks for it by that name.'),
        mock: `<div class="hw-name hot">Ferrum Salud <span>▾</span></div><div class="hw-search">🔍 ${n.search}</div>`,
        extra: () => [copyBtn('Ferrum Salud')],
      },
      {
        title: t('1.ª acción: la hora de inicio', '1st action: the start time'),
        text: t(`Toca <b>${n.search}</b>, escribe <b>fecha</b> y elige <b>${n.adjust}</b>. Déjala como en el dibujo: toca el primer hueco y elige <b>${n.sub}</b>; en el número elige la variable <b>${n.input}</b>; unidad <b>${n.min}</b>; y en la fecha, <b>${n.now}</b>.`,
          `Tap <b>${n.search}</b>, type <b>date</b> and choose <b>${n.adjust}</b>. Make it look like the drawing: tap the first blank and pick <b>${n.sub}</b>; for the number pick the variable <b>${n.input}</b>; unit <b>${n.min}</b>; and for the date, <b>${n.now}</b>.`),
        mock: adjustBlock(true),
        tip: t('Las variables (en azul) salen al tocar un hueco: aparece una fila de sugerencias sobre el teclado o el botón «Seleccionar variable».', 'Variables (in blue) appear when you tap a blank: a row of suggestions above the keyboard or the “Select Variable” button.'),
      },
      {
        title: t('2.ª acción: el entrenamiento', '2nd action: the workout'),
        text: t(`Busca <b>entrenamiento</b> y elige <b>${n.log}</b>. Tipo: <b>${n.strength}</b>. ${n.start}: <b>${n.adj}</b> (la de la acción anterior). ${n.dur}: <b>${n.input}</b>, en minutos. Toca <b>OK</b> y ya está.`,
          `Search for <b>workout</b> and choose <b>${n.log}</b>. Type: <b>${n.strength}</b>. ${n.start}: <b>${n.adj}</b> (from the previous action). ${n.dur}: <b>${n.input}</b>, in minutes. Tap <b>Done</b> and that's it.`),
        mock: adjustBlock(false) + logBlock(n.strength, true),
      },
      {
        title: t('Para los estiramientos (opcional)', 'For stretching (optional)'),
        text: t(`En la lista de atajos, mantén pulsado <b>Ferrum Salud</b> → <b>Duplicar</b>. Llama a la copia <b>Ferrum Flex</b> y cambia el tipo a <b>${n.flex}</b>.`, `In your shortcuts list, long-press <b>Ferrum Salud</b> → <b>Duplicate</b>. Name the copy <b>Ferrum Flex</b> and change the type to <b>${n.flex}</b>.`),
        mock: `<div class="hw-menu"><div class="hw-tile">Ferrum Salud</div><div class="hw-pop"><span>${t('Cambiar nombre', 'Rename')}</span><span class="hot">${t('Duplicar', 'Duplicate')}</span><span>${t('Eliminar', 'Delete')}</span></div></div>` + logBlock(n.flex, true),
        extra: () => [copyBtn('Ferrum Flex')],
      },
      {
        title: t('Pruébalo', 'Try it'),
        text: t('Toca <b>Probar ahora</b>: Ferrum abrirá el atajo y guardará un entrenamiento de 1 minuto (puedes borrarlo luego en Salud). La primera vez el iPhone pedirá permiso para escribir en Salud: toca <b>Permitir</b>. Después vuelve a Ferrum.',
          'Tap <b>Try now</b>: Ferrum opens the shortcut and saves a 1-minute workout (you can delete it later in Health). The first time, iPhone asks permission to write to Health: tap <b>Allow</b>. Then come back to Ferrum.'),
        mock: `<div class="hw-alert"><b>${t('«Atajos» quiere guardar datos en Salud', '“Shortcuts” would like to save data to Health')}</b><span class="hw-alert-btns"><span>${t('No permitir', 'Don\'t Allow')}</span><span class="hot">${t('Permitir', 'Allow')}</span></span></div>`,
        extra: () => { const b = el('button', 'btn hw-try', `♥ ${t('Probar ahora', 'Try now')}`); b.type = 'button'; b.addEventListener('click', () => { write('ferrum-health-setup', '1'); health.log({ kind: 'strength', minutes: 1 }); }); return [b]; },
      },
    ];
  }
  function openWizard(onDone) {
    const list = steps();
    const page = el('div', 'hw-page');
    page.setAttribute('role', 'dialog');
    page.setAttribute('aria-label', t('Conectar con Salud', 'Connect to Health'));
    page.innerHTML = `<div class="hw-bar"><button class="hw-x" type="button">${t('Cerrar', 'Close')}</button><div class="hw-dots"></div><span class="hw-n"></span></div><div class="hw-body"></div><div class="hw-nav"><button class="btn secondary hw-prev" type="button">${t('Atrás', 'Back')}</button><button class="btn hw-next" type="button"></button></div>`;
    document.body.appendChild(page);
    const body = page.querySelector('.hw-body'), dots = page.querySelector('.hw-dots');
    list.forEach(() => dots.append(el('span')));
    let i = 0;
    const render = (dir = 1) => {
      const st = list[i];
      body.innerHTML = '';
      const card = el('div', 'hw-step');
      card.style.setProperty('--hw-dir', String(dir));
      card.append(el('div', 'hw-phone', st.mock), el('h2', 'hw-title', st.title), el('p', 'hw-text', st.text));
      if (st.tip) card.append(el('p', 'hw-tip', st.tip));
      const ex = st.extra?.() || [];
      if (ex.length) { const box = el('div', 'hw-extra'); box.append(...ex); card.append(box); }
      body.append(card);
      dots.querySelectorAll('span').forEach((d, k) => d.classList.toggle('on', k === i));
      page.querySelector('.hw-n').textContent = `${i + 1}/${list.length}`;
      page.querySelector('.hw-prev').style.visibility = i ? 'visible' : 'hidden';
      page.querySelector('.hw-next').textContent = i === list.length - 1 ? t('Listo', 'Done') : t('Siguiente', 'Next');
      body.scrollTop = 0;
    };
    const close = (finished) => {
      page.classList.remove('in');
      setTimeout(() => page.remove(), 420);
      if (finished) { write('ferrum-health-setup', '1'); if (!health.enabled('strength')) health.set('strength', true); }
      onDone?.(finished);
    };
    page.querySelector('.hw-x').addEventListener('click', () => close(false));
    page.querySelector('.hw-prev').addEventListener('click', () => { if (i) { i--; render(-1); } });
    page.querySelector('.hw-next').addEventListener('click', () => { if (i < list.length - 1) { i++; render(1); } else close(true); });
    render();
    requestAnimationFrame(() => page.classList.add('in'));
  }
  function openHealthPage(onChange) {
    openPage(t('Salud de Apple', 'Apple Health'), (pb) => {
      const head = el('div', 'hw-hero');
      const status = () => (health.configured() ? t('Conectado con el atajo «Ferrum Salud»', 'Connected through the “Ferrum Salud” shortcut') : t('Sin conectar todavía', 'Not connected yet'));
      head.innerHTML = `<span class="hw-heart">♥</span><div><b>${t('Tus entrenos, también en Salud', 'Your workouts, in Health too')}</b><small class="hw-status"></small></div>`;
      pb.append(head);
      const paint = () => { head.querySelector('.hw-status').textContent = status(); head.classList.toggle('ok', health.configured()); onChange?.(); };
      paint();
      pb.append(el('p', 'st-lead', t(
        'El iPhone no deja que una web escriba en Salud, así que Ferrum lo hace a través de un atajo de la app Atajos. Se configura una vez, en unos 2 minutos, y luego basta con tocar «Guardar en Salud» al terminar.',
        'iPhone does not let websites write to Health, so Ferrum does it through a shortcut in the Shortcuts app. You set it up once, in about 2 minutes, and then just tap “Save to Health” when you finish.')));
      const guide = el('button', 'btn hw-start', health.configured() ? t('Ver la guía otra vez', 'See the guide again') : t('Conectar paso a paso', 'Connect step by step'));
      guide.type = 'button';
      guide.addEventListener('click', () => openWizard(() => { paint(); swS.checked = health.enabled('strength'); }));
      pb.append(guide);
      const sw = (kind) => {
        const i = el('input'); i.type = 'checkbox'; i.checked = health.enabled(kind); switchify(i);
        i.addEventListener('change', () => {
          health.set(kind, i.checked); onChange?.();
          if (i.checked && !health.configured()) openWizard(() => { paint(); });
        });
        return i;
      };
      const swS = sw('strength');
      pb.append(group(t('Qué se guarda', 'What gets saved'),
        row(t('Entrenamientos', 'Workouts'), swS, t('Botón «Guardar en Salud» al terminar (fuerza tradicional)', '“Save to Health” button when you finish (strength training)')),
        row(t('Estiramientos', 'Stretching'), sw('flex'), t('Al terminar una sesión (flexibilidad, atajo «Ferrum Flex»)', 'When a session ends (flexibility, “Ferrum Flex” shortcut)'))));
      const help = el('details', 'hw-help');
      help.innerHTML = `<summary>${t('¿No funciona?', 'Not working?')}</summary><ul>
        <li>${t('El atajo tiene que llamarse exactamente <b>Ferrum Salud</b> (y <b>Ferrum Flex</b> para estirar), con mayúsculas y sin espacios de más.', 'The shortcut must be named exactly <b>Ferrum Salud</b> (and <b>Ferrum Flex</b> for stretching), same capitals, no extra spaces.')}</li>
        <li>${t('Si no te pidió permiso o lo denegaste: app Salud → tu foto (arriba) → <b>Apps</b> → <b>Atajos</b> → activa <b>Entrenamientos</b>.', 'If it never asked or you denied it: Health app → your picture (top) → <b>Apps</b> → <b>Shortcuts</b> → turn on <b>Workouts</b>.')}</li>
        <li>${t('Si el iPhone está en inglés, las acciones se llaman <b>Adjust Date</b> y <b>Log Workout</b>, y la variable <b>Shortcut Input</b>.', 'If your iPhone is in Spanish, the actions are <b>Ajustar fecha</b> and <b>Registrar entrenamiento</b>, and the variable <b>Entrada del atajo</b>.')}</li>
        <li>${t('Si el entreno sale con 0 minutos, revisa que en «Duración» esté la variable <b>Entrada del atajo</b> y la unidad en minutos.', 'If the workout shows 0 minutes, check that “Duration” uses the <b>Shortcut Input</b> variable and the unit is minutes.')}</li></ul>`;
      pb.append(help);
      pb.append(el('p', 'st-foot', t(
        'Ferrum no lee nada de Salud: solo le pasa al atajo cuántos minutos ha durado, cuando tú lo pides.',
        'Ferrum never reads your Health data: it only tells the shortcut how many minutes it lasted, when you ask.')));
    });
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
    const healthRow = linkRow('<span class="st-ic-heart">♥</span>', t('Salud de Apple', 'Apple Health'), healthState(), () => openHealthPage(() => { healthRow.querySelector('.st-value').textContent = healthState(); }));
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
