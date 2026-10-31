// Ferrum · estiramientos guiados.
//
// Pantallas (hojas a pantalla completa que entran por la derecha):
//   Inicio      sesiones rápidas, «Crear una sesión», mis sesiones, biblioteca
//   Asistente   tiempo · zona · ¿te duele algo? · nivel (+ más opciones)
//   Vista previa lista de estiramientos, quitar/añadir, empezar o guardar
//   Reproductor cuenta atrás con dibujo animado, cambio de lado, voz y pitidos
// Entradas: tarjeta en Rutinas y «Estirar ahora» al terminar un entreno.
// Datos: biblioteca en ui/ferrum-stretch-data-v1.js; sesiones guardadas,
// preferencias e historial en el almacén «kv» de la app (entra en las copias).
(() => {
  const root = document.documentElement;
  const LIB = () => window.__FERRUM_STRETCHES || [];
  const FIG = () => window.__ferrumStretchFigure;
  const en = () => (window.__ferrumI18n?.lang || root.lang) === 'en';
  const t = (es, enText) => (en() ? enText : es);
  const loc = (s) => (en() ? s.en : s.es) || s.es;
  const byId = (id) => LIB().find((s) => s.id === id);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmtMin = (sec) => `${Math.max(1, Math.round(sec / 60))} min`;
  const fmtClock = (sec) => { const s = Math.max(0, Math.ceil(sec)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

  // --- Zonas ------------------------------------------------------------------
  const AREAS = {
    cuello: ['Cuello', 'Neck'], hombros: ['Hombros', 'Shoulders'], pecho: ['Pecho', 'Chest'], 'espalda-alta': ['Espalda alta', 'Upper back'],
    lumbar: ['Zona lumbar', 'Lower back'], cadera: ['Cadera', 'Hip flexors'], gluteos: ['Glúteos', 'Glutes'], isquios: ['Isquios', 'Hamstrings'],
    cuadriceps: ['Cuádriceps', 'Quads'], gemelos: ['Gemelos', 'Calves'], aductores: ['Aductores', 'Adductors'], munecas: ['Muñecas', 'Wrists'], tobillos: ['Tobillos', 'Ankles'],
  };
  const areaName = (a) => (AREAS[a] ? (en() ? AREAS[a][1] : AREAS[a][0]) : a);
  const FOCUS = {
    todo: { label: ['Todo el cuerpo', 'Full body'], areas: null },
    superior: { label: ['Tren superior', 'Upper body'], areas: ['cuello', 'hombros', 'pecho', 'espalda-alta', 'munecas'] },
    inferior: { label: ['Tren inferior', 'Lower body'], areas: ['cadera', 'gluteos', 'isquios', 'cuadriceps', 'gemelos', 'aductores', 'tobillos'] },
    espalda: { label: ['Espalda', 'Back'], areas: ['espalda-alta', 'lumbar', 'gluteos', 'cuello'] },
  };
  const MUSCLE_AREAS = {
    Pecho: ['pecho', 'hombros'], Espalda: ['espalda-alta', 'lumbar'], Dorsal: ['espalda-alta', 'hombros'], Trapecio: ['cuello', 'espalda-alta'],
    Hombro: ['hombros', 'pecho'], 'Bíceps': ['pecho', 'munecas'], 'Tríceps': ['hombros'], Antebrazo: ['munecas'],
    'Cuádriceps': ['cuadriceps', 'cadera'], Isquio: ['isquios'], 'Glúteo': ['gluteos', 'cadera'], Gemelo: ['gemelos', 'tobillos'],
    Abdominal: ['lumbar', 'cadera'], Oblicuo: ['lumbar'], Lumbar: ['lumbar', 'isquios'], Aductor: ['aductores'], Abductor: ['gluteos'],
  };
  const POS_ORDER = { pie: 0, sentado: 1, suelo: 2 };

  // --- Almacén (kv de la app; respaldo en localStorage) ---------------------
  const DEF = { routines: [], history: [], prefs: { gap: 10, voice: true, beep: true, intensity: 'normal', level: 1 } };
  let dbp = null;
  const appDb = () => (dbp ||= (async () => {
    const src = document.querySelector('script[type="module"][src*="assets/index-"]')?.src;
    return src ? (await import(src)).d : null;
  })().catch(() => null));
  async function loadStore() {
    try { const d = await appDb(); const r = d && await d.get('kv', 'stretch'); if (r?.value) return { ...DEF, ...r.value, prefs: { ...DEF.prefs, ...r.value.prefs } }; } catch { /* noop */ }
    try { const v = JSON.parse(localStorage.getItem('ferrum-stretch') || 'null'); if (v) return { ...DEF, ...v, prefs: { ...DEF.prefs, ...v.prefs } }; } catch { /* noop */ }
    return structuredClone(DEF);
  }
  async function saveStore(v) {
    try { localStorage.setItem('ferrum-stretch', JSON.stringify(v)); } catch { /* noop */ }
    try { const d = await appDb(); if (d) await d.put('kv', { key: 'stretch', value: v }); } catch { /* noop */ }
  }

  // --- Constructor de sesiones ------------------------------------------------
  const HOLD_MUL = { suave: 0.75, normal: 1, profunda: 1.4 };
  const itemSeconds = (it, gap) => { const s = byId(it.id); if (!s) return 0; return it.hold * s.sides + gap + (s.sides === 2 ? 4 : 0); };
  const sessionSeconds = (items, gap) => items.reduce((a, it) => a + itemSeconds(it, gap), 0);
  function rng(seed) { let x = seed >>> 0 || 1; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function build({ minutes = 10, areas = null, level = 1, pain = false, intensity = 'normal', gap = 10, seed = Date.now() }) {
    const rand = rng(seed);
    const mul = pain ? HOLD_MUL.suave : (HOLD_MUL[intensity] || 1);
    const focus = areas && areas.length ? areas : null;
    const fits = (s, lv, gentle) => s.level <= lv && (!gentle || s.gentle) && (!focus || s.areas.some((a) => focus.includes(a)));
    let pool = LIB().filter((s) => fits(s, pain ? 1 : level, pain));
    if (pool.length < 3) pool = LIB().filter((s) => fits(s, pain ? 2 : 3, pain));
    if (pool.length < 2) pool = LIB().filter((s) => fits(s, 3, false));
    const score = (s) => (focus ? (focus.includes(s.areas[0]) ? 2 : 0) + s.areas.filter((a) => focus.includes(a)).length : 1) + rand() * 1.5;
    // reparto por zonas: se van alternando para cubrirlas todas
    const keys = focus || [...new Set(pool.map((s) => s.areas[0]))];
    const buckets = new Map(keys.map((k) => [k, pool.filter((s) => s.areas.includes(k)).sort((a, b) => score(b) - score(a))]));
    const order = keys.slice().sort(() => rand() - 0.5);
    const chosen = [], used = new Set(), target = minutes * 60;
    let total = 0, guard = 0;
    while (total < target && guard++ < 200) {
      let added = false;
      for (const k of order) {
        const s = buckets.get(k)?.find((x) => !used.has(x.id));
        if (!s) continue;
        const it = { id: s.id, hold: Math.round(s.hold * mul / 5) * 5 || 20 };
        const sec = itemSeconds(it, gap);
        if (total + sec > target + sec / 2 && chosen.length) { total = target; break; }
        chosen.push(it); used.add(s.id); total += sec; added = true;
        if (total >= target) break;
      }
      if (!added) break;
    }
    // si faltan estiramientos para llenar el tiempo, se alargan las posturas
    if (chosen.length && total < target * 0.85) {
      const k = Math.min(1.8, (target - chosen.length * gap) / Math.max(1, chosen.reduce((a, it) => a + it.hold * (byId(it.id)?.sides || 1), 0)));
      for (const it of chosen) it.hold = Math.max(15, Math.round(it.hold * k / 5) * 5);
    }
    chosen.sort((a, b) => (POS_ORDER[byId(a.id)?.position] ?? 1) - (POS_ORDER[byId(b.id)?.position] ?? 1));
    return chosen;
  }
  const PRESETS = () => [
    { key: 'post', title: t('Después de entrenar', 'After your workout'), minutes: 5, dynamic: true },
    { key: 'todo10', title: t('Cuerpo entero', 'Full body'), minutes: 10, areas: null },
    { key: 'inf10', title: t('Tren inferior', 'Lower body'), minutes: 10, areas: FOCUS.inferior.areas },
    { key: 'sup10', title: t('Tren superior', 'Upper body'), minutes: 10, areas: FOCUS.superior.areas },
    { key: 'lumbar8', title: t('Espalda baja', 'Lower back'), minutes: 8, areas: ['lumbar', 'gluteos', 'isquios', 'cadera'], pain: true },
    { key: 'cuello5', title: t('Cuello y hombros', 'Neck & shoulders'), minutes: 5, areas: ['cuello', 'hombros', 'espalda-alta'] },
  ];
  async function postWorkoutAreas() {
    try {
      const d = await appDb();
      const w = (await d.workoutsDesc(1))?.[0];
      if (!w || Date.now() - (w.endTime || w.startTime) > 36 * 3600e3) return null;
      const set = new Set();
      for (const ex of w.exercises || []) {
        const e = await d.get('exercises', ex.exerciseId);
        for (const a of MUSCLE_AREAS[e?.primaryMuscle] || []) set.add(a);
      }
      return set.size ? [...set] : null;
    } catch { return null; }
  }

  // --- Hojas (entran por la derecha y salen por el mismo camino) ----------------
  const stack = [];
  function sheet(title, { back = t('Atrás', 'Back'), large = true, cls = '' } = {}) {
    const page = el('div', `sx-page ${cls}`);
    page.dataset.i18nSkip = '1';
    page.setAttribute('role', 'dialog');
    page.setAttribute('aria-label', title);
    const bar = el('div', 'sx-bar');
    const b = el('button', 'sx-back', `<span aria-hidden="true">‹</span> ${esc(back)}`);
    b.type = 'button';
    bar.append(b);
    const body = el('div', 'sx-body');
    if (large && title) body.append(el('h1', 'sx-title', esc(title)));
    page.append(bar, body);
    document.body.appendChild(page);
    requestAnimationFrame(() => page.classList.add('in'));
    const close = () => {
      if (page.dataset.closed) return; page.dataset.closed = '1';
      page.classList.remove('in'); page.classList.add('out');
      const idx = stack.indexOf(close); if (idx >= 0) stack.splice(idx, 1);
      const end = () => { page.remove(); page.dispatchEvent(new Event('sx-closed')); };
      setTimeout(end, 480);
      page._onClose?.();
    };
    b.addEventListener('click', () => (page._beforeClose ? page._beforeClose(close) : close()));
    stack.push(close);
    return { page, body, bar, close };
  }
  window.addEventListener('hashchange', () => { while (stack.length) stack[stack.length - 1](); });

  // Iconos propios: los caracteres ⏮ ⏸ ⏭ ▶ salen como emoji en iOS.
  const STROKE = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  const icon = (body, attrs = 'fill="currentColor"') => `<svg class="ic" viewBox="0 0 24 24" ${attrs} aria-hidden="true">${body}</svg>`;
  const IC = {
    prev: icon('<rect x="4.5" y="5.5" width="2.8" height="13" rx="1.4"/><path d="M19.5 7v10a1.2 1.2 0 0 1-1.9 1L10 13a1.2 1.2 0 0 1 0-2l7.6-5a1.2 1.2 0 0 1 1.9 1z"/>'),
    next: icon('<rect x="16.7" y="5.5" width="2.8" height="13" rx="1.4"/><path d="M4.5 7v10a1.2 1.2 0 0 0 1.9 1L14 13a1.2 1.2 0 0 0 0-2L6.4 6a1.2 1.2 0 0 0-1.9 1z"/>'),
    pause: icon('<rect x="6" y="4.5" width="4.4" height="15" rx="1.6"/><rect x="13.6" y="4.5" width="4.4" height="15" rx="1.6"/>'),
    play: icon('<path d="M7.5 5.6v12.8a1.3 1.3 0 0 0 2 1.1l10-6.4a1.3 1.3 0 0 0 0-2.2l-10-6.4a1.3 1.3 0 0 0-2 1.1z"/>'),
    x: icon('<path d="M6 6l12 12M18 6L6 18"/>', STROKE),
    check: icon('<path d="m5 12.5 4.5 4.5L19 7.5"/>', STROKE),
    heart: icon('<path d="M12 20.4s-7.9-4.7-9.5-9.4C1.4 7.6 3.5 4.6 6.7 4.6c2 0 3.8 1 5.3 3 1.5-2 3.3-3 5.3-3 3.2 0 5.3 3 4.2 6.4-1.6 4.7-9.5 9.4-9.5 9.4z"/>'),
    spark: icon('<path d="M12 3c.6 4.9 3.4 8 9 9-5.6 1-8.4 4.1-9 9-.6-4.9-3.4-8-9-9 5.6-1 8.4-4.1 9-9z"/>'),
  };

  const thumb = (s, size = 56) => `<span class="sx-thumb" style="width:${size}px;height:${size}px">${FIG()?.svg(s.pose, null) || ''}</span>`;
  const chips = (options, value, multi, onChange) => {
    const wrap = el('div', 'sx-chips');
    let cur = multi ? new Set(value || []) : value;
    for (const [v, label] of options) {
      const c = el('button', 'sx-chip', esc(label));
      c.type = 'button';
      const on = () => (multi ? cur.has(v) : cur === v);
      c.classList.toggle('on', on());
      c.setAttribute('aria-pressed', String(on()));
      c.addEventListener('click', () => {
        if (multi) { cur.has(v) ? cur.delete(v) : cur.add(v); } else cur = v;
        wrap.querySelectorAll('.sx-chip').forEach((x, i) => { const vv = options[i][0]; const o = multi ? cur.has(vv) : cur === vv; x.classList.toggle('on', o); x.setAttribute('aria-pressed', String(o)); });
        onChange(multi ? [...cur] : cur);
      });
      wrap.append(c);
    }
    return wrap;
  };
  const section = (title, ...kids) => { const s = el('section', 'sx-sec'); if (title) s.append(el('h2', 'sx-h', esc(title))); s.append(...kids.filter(Boolean)); return s; };

  // --- Inicio -------------------------------------------------------------------
  async function openHome() {
    const store = await loadStore();
    const { body } = sheet(t('Estiramientos', 'Stretching'));
    body.append(el('p', 'sx-lead', esc(t('Sesiones guiadas con temporizador y dibujos. Elige una rápida o crea la tuya según tu tiempo y lo que quieras estirar.',
      'Guided sessions with a timer and drawings. Pick a quick one or build your own around your time and what you want to stretch.'))));
    const create = el('button', 'btn sx-create', `${IC.spark}${esc(t('Crear una sesión', 'Build a session'))}`);
    create.type = 'button';
    create.addEventListener('click', () => openAssistant(store));
    body.append(create);

    const quick = el('div', 'sx-quick');
    for (const p of PRESETS()) {
      const card = el('button', 'sx-qcard');
      card.type = 'button';
      const items = p.dynamic ? null : build({ minutes: p.minutes, areas: p.areas, level: store.prefs.level, pain: p.pain, intensity: store.prefs.intensity, gap: store.prefs.gap, seed: p.key.length * 7919 });
      const first = byId((items || build({ minutes: 5, areas: null, level: 1, seed: 3 }))[0]?.id);
      card.innerHTML = `${first ? thumb(first, 64) : ''}<span class="sx-qtitle">${esc(p.title)}</span><span class="sx-qmeta">${p.minutes} min${items ? ` · ${items.length} ${esc(t('estiramientos', 'stretches'))}` : ''}</span>`;
      card.addEventListener('click', async () => {
        let list = items, title = `${p.title} · ${p.minutes} min`;
        if (p.dynamic) {
          const areas = await postWorkoutAreas();
          list = build({ minutes: p.minutes, areas, level: store.prefs.level, intensity: store.prefs.intensity, gap: store.prefs.gap });
          if (!areas) title = `${t('Cuerpo entero', 'Full body')} · ${p.minutes} min`;
        }
        openPreview(store, { name: title, items: list, pain: !!p.pain });
      });
      quick.append(card);
    }
    body.append(section(t('Empieza rápido', 'Quick start'), quick));

    const mine = el('div', 'sx-list');
    const renderMine = () => {
      mine.innerHTML = '';
      if (!store.routines.length) { mine.append(el('p', 'sx-empty', esc(t('Aún no has guardado ninguna. Crea una sesión y pulsa «Guardar».', 'You have none saved yet. Build a session and tap “Save”.')))); return; }
      for (const r of store.routines) {
        const s = byId(r.items[0]?.id);
        const row = el('button', 'sx-row', `${s ? thumb(s, 44) : ''}<span class="sx-rtext"><span>${esc(r.name)}</span><small>${fmtMin(sessionSeconds(r.items, store.prefs.gap))} · ${r.items.length} ${esc(t('estiramientos', 'stretches'))}</small></span><span class="sx-chev" aria-hidden="true">›</span>`);
        row.type = 'button';
        row.addEventListener('click', () => openPreview(store, r, renderMine));
        mine.append(row);
      }
    };
    renderMine();
    body.append(section(t('Mis sesiones', 'My sessions'), mine));

    const libRow = el('button', 'sx-row sx-librow', `<span class="sx-ic">≡</span><span class="sx-rtext"><span>${esc(t('Biblioteca de estiramientos', 'Stretch library'))}</span><small>${LIB().length} ${esc(t('estiramientos por zona y nivel', 'stretches by zone and level'))}</small></span><span class="sx-chev" aria-hidden="true">›</span>`);
    libRow.type = 'button';
    libRow.addEventListener('click', () => openLibrary(store));
    const libList = el('div', 'sx-list');
    libList.append(libRow);
    body.append(section(null, libList));
  }

  // --- Asistente ------------------------------------------------------------------
  function openAssistant(store) {
    const { body } = sheet(t('Crear una sesión', 'Build a session'));
    const st = { minutes: 10, focus: 'todo', areas: [], pain: false, painAreas: [], level: store.prefs.level || 1, intensity: store.prefs.intensity || 'normal', gap: store.prefs.gap || 10 };
    body.append(section(t('¿Cuánto tiempo tienes?', 'How much time do you have?'),
      chips([[5, '5 min'], [10, '10 min'], [15, '15 min'], [20, '20 min'], [30, '30 min']], st.minutes, false, (v) => { st.minutes = v; })));
    const zones = el('div');
    const specific = chips(Object.keys(AREAS).map((a) => [a, areaName(a)]), st.areas, true, (v) => { st.areas = v; });
    specific.classList.add('sx-sub'); specific.hidden = true;
    zones.append(chips([...Object.entries(FOCUS).map(([k, f]) => [k, en() ? f.label[1] : f.label[0]]), ['zona', t('Zonas concretas…', 'Specific areas…')]], st.focus, false, (v) => { st.focus = v; specific.hidden = v !== 'zona'; }), specific);
    body.append(section(t('¿Qué quieres estirar?', 'What do you want to stretch?'), zones));
    const painBox = el('div');
    const painAreas = chips(Object.keys(AREAS).map((a) => [a, areaName(a)]), [], true, (v) => { st.painAreas = v; });
    painAreas.classList.add('sx-sub'); painAreas.hidden = true;
    const painNote = el('p', 'sx-note', esc(t('Usaremos solo estiramientos suaves y posturas más cortas. Si el dolor es fuerte, va a más o notas hormigueo, para y consulta a un profesional.',
      'We will use only gentle stretches and shorter holds. If the pain is strong, gets worse or you feel tingling, stop and see a professional.')));
    painNote.hidden = true;
    painBox.append(chips([[false, t('No', 'No')], [true, t('Sí, me duele algo', 'Yes, something hurts')]], false, false, (v) => { st.pain = v; painAreas.hidden = !v; painNote.hidden = !v; }), painAreas, painNote);
    body.append(section(t('¿Te duele algo?', 'Does anything hurt?'), painBox));
    body.append(section(t('Nivel', 'Level'), chips([[1, t('Fácil', 'Easy')], [2, t('Medio', 'Medium')], [3, t('Avanzado', 'Advanced')]], st.level, false, (v) => { st.level = v; })));
    const more = el('details', 'sx-more');
    more.append(el('summary', null, esc(t('Más opciones', 'More options'))));
    more.append(section(t('Intensidad', 'Intensity'), chips([['suave', t('Suave', 'Gentle')], ['normal', t('Normal', 'Normal')], ['profunda', t('Profunda', 'Deep')]], st.intensity, false, (v) => { st.intensity = v; })));
    more.append(section(t('Pausa entre estiramientos', 'Pause between stretches'), chips([[5, '5 s'], [10, '10 s'], [15, '15 s']], st.gap, false, (v) => { st.gap = v; })));
    body.append(more);
    const go = el('button', 'btn sx-cta', esc(t('Ver la sesión', 'See the session')));
    go.type = 'button';
    go.addEventListener('click', () => {
      const areas = st.pain ? (st.painAreas.length ? st.painAreas : null) : st.focus === 'zona' ? (st.areas.length ? st.areas : null) : FOCUS[st.focus]?.areas || null;
      const items = build({ minutes: st.minutes, areas, level: st.level, pain: st.pain, intensity: st.intensity, gap: st.gap });
      store.prefs = { ...store.prefs, level: st.level, intensity: st.intensity, gap: st.gap };
      saveStore(store);
      const what = st.pain ? t('Alivio suave', 'Gentle relief') : st.focus === 'zona' ? (areas || []).map(areaName).slice(0, 2).join(' + ') || t('Cuerpo entero', 'Full body') : (en() ? FOCUS[st.focus].label[1] : FOCUS[st.focus].label[0]);
      openPreview(store, { name: `${what} · ${st.minutes} min`, items, pain: st.pain });
    });
    body.append(go);
  }

  // --- Vista previa -------------------------------------------------------------
  function openPreview(store, routine, onChange) {
    const saved = store.routines.includes(routine);
    const r = { name: routine.name, items: routine.items.map((x) => ({ ...x })), pain: routine.pain };
    const { body } = sheet(r.name, { back: t('Atrás', 'Back') });
    const meta = el('div', 'sx-meta');
    const list = el('div', 'sx-list sx-plist');
    const render = () => {
      meta.innerHTML = `<span>${fmtMin(sessionSeconds(r.items, store.prefs.gap))}</span><span>${r.items.length} ${esc(t('estiramientos', 'stretches'))}</span>`;
      list.innerHTML = '';
      r.items.forEach((it, i) => {
        const s = byId(it.id); if (!s) return;
        const row = el('div', 'sx-row', `${thumb(s, 52)}<span class="sx-rtext"><span>${esc(loc(s).name)}</span><small>${it.hold} s${s.sides === 2 ? ` × 2 ${esc(t('lados', 'sides'))}` : ''} · ${esc(areaName(s.areas[0]))}</small></span>`);
        const rm = el('button', 'sx-rm', IC.x);
        rm.type = 'button';
        rm.setAttribute('aria-label', t('Quitar', 'Remove'));
        rm.addEventListener('click', () => { r.items.splice(i, 1); render(); });
        row.append(rm);
        row.querySelector('.sx-thumb').addEventListener('click', () => openDetail(s));
        list.append(row);
      });
    };
    body.append(meta);
    if (r.pain) body.append(el('p', 'sx-note', esc(t('Solo estiramientos suaves. Si el dolor va a más, para.', 'Gentle stretches only. If the pain gets worse, stop.'))));
    body.append(list);
    const add = el('button', 'sx-add', `＋ ${esc(t('Añadir estiramiento', 'Add a stretch'))}`);
    add.type = 'button';
    add.addEventListener('click', () => openLibrary(store, (s) => { r.items.push({ id: s.id, hold: s.hold }); render(); }));
    body.append(add);
    render();
    const actions = el('div', 'sx-actions');
    const start = el('button', 'btn sx-cta', `${IC.play}${esc(t('Empezar', 'Start'))}`);
    start.type = 'button';
    start.addEventListener('click', () => { if (r.items.length) play(store, r); });
    const save = el('button', 'btn secondary', esc(saved ? t('Guardar cambios', 'Save changes') : t('Guardar', 'Save')));
    save.type = 'button';
    save.addEventListener('click', async () => {
      const name = window.prompt(t('Nombre de la sesión', 'Session name'), r.name);
      if (name == null) return;
      if (saved) Object.assign(routine, { name: name.trim() || r.name, items: r.items });
      else store.routines.unshift({ name: name.trim() || r.name, items: r.items, createdAt: Date.now() });
      await saveStore(store);
      save.textContent = t('Guardada', 'Saved');
      onChange?.();
    });
    actions.append(start, save);
    if (saved) {
      const del = el('button', 'btn danger', esc(t('Eliminar', 'Delete')));
      del.type = 'button';
      del.addEventListener('click', async () => {
        if (!window.confirm(t(`¿Eliminar «${routine.name}»?`, `Delete “${routine.name}”?`))) return;
        store.routines.splice(store.routines.indexOf(routine), 1);
        await saveStore(store);
        onChange?.();
        stack[stack.length - 1]?.();
      });
      actions.append(del);
    }
    body.append(actions);
  }

  // --- Biblioteca y detalle ---------------------------------------------------------
  function openLibrary(store, pick) {
    const { body, close } = sheet(pick ? t('Añadir estiramiento', 'Add a stretch') : t('Biblioteca', 'Library'));
    let area = null;
    const list = el('div', 'sx-grid');
    const render = () => {
      list.innerHTML = '';
      for (const s of LIB().filter((x) => !area || x.areas.includes(area)).sort((a, b) => a.level - b.level)) {
        const card = el('button', 'sx-gcard', `${thumb(s, 999)}<span class="sx-gname">${esc(loc(s).name)}</span><span class="sx-gmeta">${'●'.repeat(s.level)}${'○'.repeat(3 - s.level)} · ${esc(areaName(s.areas[0]))}</span>`);
        card.type = 'button';
        card.addEventListener('click', () => (pick ? (pick(s), close()) : openDetail(s)));
        list.append(card);
      }
    };
    body.append(chips([[null, t('Todas', 'All')], ...Object.keys(AREAS).map((a) => [a, areaName(a)])], null, false, (v) => { area = v; render(); }));
    body.append(list);
    render();
  }
  function openDetail(s) {
    const { body } = sheet(loc(s).name);
    const fig = el('div', 'sx-bigfig', FIG()?.svg(s.pose, s.pose2) || '');
    body.append(fig);
    body.append(el('div', 'sx-meta', `<span>${['', t('Fácil', 'Easy'), t('Medio', 'Medium'), t('Avanzado', 'Advanced')][s.level]}</span><span>${s.hold} s${s.sides === 2 ? ` × 2 ${esc(t('lados', 'sides'))}` : ''}</span><span>${s.areas.map(areaName).map(esc).join(' · ')}</span>`));
    const ol = el('ul', 'sx-cues');
    for (const c of loc(s).cues || []) ol.append(el('li', null, esc(c)));
    body.append(ol);
  }

  // --- Reproductor --------------------------------------------------------------------
  let audioCtx = null;
  function beep(freq = 880, dur = 0.12, vol = 0.25) {
    try {
      audioCtx ||= new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain(), n = audioCtx.currentTime;
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, n); g.gain.exponentialRampToValueAtTime(vol, n + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, n + dur);
      o.connect(g); g.connect(audioCtx.destination); o.start(n); o.stop(n + dur + 0.05);
    } catch { /* noop */ }
  }
  function say(text, on) {
    if (!on || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = en() ? 'en-GB' : 'es-ES'; u.rate = 1; u.volume = 1;
      speechSynthesis.speak(u);
    } catch { /* noop */ }
  }

  function play(store, routine) {
    const prefs = store.prefs;
    // Pasos: preparación → (lado 1) → [cambio → lado 2]
    const steps = [];
    routine.items.forEach((it, i) => {
      const s = byId(it.id); if (!s) return;
      steps.push({ kind: 'prep', s, i, dur: i === 0 ? 5 : prefs.gap });
      if (s.sides === 2) {
        steps.push({ kind: 'hold', s, i, side: 1, dur: it.hold });
        steps.push({ kind: 'switch', s, i, dur: 4 });
        steps.push({ kind: 'hold', s, i, side: 2, dur: it.hold });
      } else steps.push({ kind: 'hold', s, i, dur: it.hold });
    });
    const totalSec = steps.reduce((a, x) => a + x.dur, 0);
    const n = routine.items.length;
    const { page, body, bar, close } = sheet('', { back: t('Salir', 'End'), large: false, cls: 'sx-player' });
    const prog = el('div', 'sx-prog');
    for (let i = 0; i < n; i++) prog.append(el('span'));
    bar.append(prog, el('span', 'sx-count'));
    const stage = el('div', 'sx-stage');
    const fig = el('div', 'sx-bigfig');
    const label = el('div', 'sx-phase');
    const name = el('h1', 'sx-pname');
    const side = el('div', 'sx-side');
    const ring = el('div', 'sx-ring', '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" class="sx-ring-bg"/><circle cx="60" cy="60" r="54" class="sx-ring-fg"/></svg><span class="sx-time"></span>');
    const cues = el('ul', 'sx-cues');
    const next = el('div', 'sx-next');
    stage.append(fig, label, name, side, ring, cues, next);
    const ctrls = el('div', 'sx-ctrls');
    const mk = (txt, aria, cls = '') => { const b = el('button', `sx-cbtn ${cls}`, txt); b.type = 'button'; b.setAttribute('aria-label', aria); ctrls.append(b); return b; };
    const prevB = mk(IC.prev, t('Anterior', 'Previous'));
    const pauseB = mk(IC.pause, t('Pausa', 'Pause'), 'sx-main');
    const nextB = mk(IC.next, t('Siguiente', 'Next'));
    const remain = el('div', 'sx-remain');
    body.append(stage, ctrls, remain);

    let idx = 0, stepStart = performance.now(), pausedAt = 0, raf = 0, lastWhole = -1, figKey = '';
    let wake = null;
    const lockScreen = async () => { try { wake = await navigator.wakeLock?.request('screen'); } catch { /* noop */ } };
    lockScreen();
    const onVis = () => { if (document.visibilityState === 'visible' && !wake) lockScreen(); };
    document.addEventListener('visibilitychange', onVis);
    const fgCircle = ring.querySelector('.sx-ring-fg');
    const C = 2 * Math.PI * 54;
    fgCircle.style.strokeDasharray = String(C);

    const showStep = () => {
      const st = steps[idx];
      const s = st.s;
      page.dataset.phase = st.kind;
      const key = `${s.id}`;
      if (key !== figKey) { fig.innerHTML = FIG()?.svg(s.pose, s.pose2) || ''; figKey = key; }
      fig.classList.toggle('flip', st.kind !== 'prep' && st.side === 2);
      label.textContent = st.kind === 'prep' ? t('Prepárate', 'Get ready') : st.kind === 'switch' ? t('Cambia de lado', 'Switch sides') : t('Mantén', 'Hold');
      name.textContent = loc(s).name;
      side.textContent = s.sides === 2 ? (st.kind === 'prep' ? t('Empieza por el lado derecho', 'Start with your right side') : st.side === 2 || st.kind === 'switch' ? t('Lado izquierdo', 'Left side') : t('Lado derecho', 'Right side')) : '';
      cues.innerHTML = '';
      for (const c of (loc(s).cues || []).slice(0, 2)) cues.append(el('li', null, esc(c)));
      const nx = steps.slice(idx + 1).find((x) => x.kind === 'prep');
      next.textContent = nx ? `${t('Después', 'Next')}: ${loc(nx.s).name}` : t('Último estiramiento', 'Last stretch');
      prog.querySelectorAll('span').forEach((sp, i) => { sp.className = i < st.i ? 'done' : i === st.i ? 'cur' : ''; });
      bar.querySelector('.sx-count').textContent = `${st.i + 1}/${n}`;
      lastWhole = -1;
      if (st.kind === 'prep') say(`${idx === 0 ? '' : t('Siguiente: ', 'Next: ')}${loc(s).name}`, prefs.voice);
      if (st.kind === 'switch') say(t('Cambia de lado', 'Switch sides'), prefs.voice);
      if (st.kind === 'hold' && prefs.beep) beep(1046, 0.16, 0.3);
    };
    const finish = async () => {
      cancelAnimationFrame(raf);
      try { wake?.release(); } catch { /* noop */ }
      wake = null;
      say(t('¡Sesión completada!', 'Session complete!'), prefs.voice);
      if (prefs.beep) { beep(784, 0.14); setTimeout(() => beep(1046, 0.2), 160); }
      store.history.unshift({ at: Date.now(), seconds: Math.round(totalSec), name: routine.name, n });
      store.history = store.history.slice(0, 200);
      saveStore(store);
      page.dataset.phase = 'done';
      stage.innerHTML = `<div class="sx-done"><div class="sx-done-mark">${IC.check}</div><h1>${esc(t('¡Sesión completada!', 'Session complete!'))}</h1><p>${fmtMin(totalSec)} · ${n} ${esc(t('estiramientos', 'stretches'))}</p></div>`;
      ctrls.innerHTML = ''; remain.textContent = '';
      const acts = el('div', 'sx-actions');
      if (window.__ferrumHealth?.enabled('flex')) {
        const h = el('button', 'btn secondary', `<span class="fx-heart">${IC.heart}</span> ${esc(t('Guardar en Salud', 'Save to Health'))}`);
        h.type = 'button';
        h.addEventListener('click', () => { window.__ferrumHealth.log({ kind: 'flex', minutes: totalSec / 60, start: Date.now() - totalSec * 1000, name: routine.name }); h.textContent = t('Enviado a Salud', 'Sent to Health'); });
        acts.append(h);
      }
      const ok = el('button', 'btn', esc(t('Hecho', 'Done')));
      ok.type = 'button';
      ok.addEventListener('click', close);
      acts.append(ok);
      stage.append(acts);
    };
    const tick = (now) => {
      if (pausedAt) { raf = requestAnimationFrame(tick); return; }
      const st = steps[idx];
      const left = st.dur - (now - stepStart) / 1000;
      ring.querySelector('.sx-time').textContent = fmtClock(left);
      fgCircle.style.strokeDashoffset = String(C * (1 - Math.max(0, left) / st.dur));
      const whole = Math.ceil(left);
      if (whole !== lastWhole) {
        lastWhole = whole;
        if (prefs.beep && whole <= 3 && whole >= 1 && st.kind !== 'switch') beep(660, 0.09, 0.18);
      }
      const done = steps.slice(idx).reduce((a, x, k) => a + (k === 0 ? Math.max(0, left) : x.dur), 0);
      remain.textContent = `${t('Quedan', 'Remaining')} ${fmtClock(done)}`;
      if (left <= 0) {
        if (idx >= steps.length - 1) { finish(); return; }
        idx++; stepStart = now; showStep();
      }
      raf = requestAnimationFrame(tick);
    };
    const jumpTo = (i) => { idx = Math.max(0, Math.min(steps.length - 1, i)); stepStart = performance.now(); if (pausedAt) pausedAt = stepStart; showStep(); };
    prevB.addEventListener('click', () => {
      const cur = steps[idx].i;
      const firstOfCur = steps.findIndex((x) => x.i === cur);
      const target = performance.now() - stepStart > 3000 || idx === firstOfCur ? (idx === firstOfCur ? steps.findIndex((x) => x.i === cur - 1) : firstOfCur) : firstOfCur;
      jumpTo(target < 0 ? 0 : target);
    });
    nextB.addEventListener('click', () => {
      const cur = steps[idx].i;
      const nx = steps.findIndex((x) => x.i === cur + 1);
      if (nx < 0) finish(); else jumpTo(nx);
    });
    pauseB.addEventListener('click', () => {
      if (pausedAt) { stepStart += performance.now() - pausedAt; pausedAt = 0; pauseB.innerHTML = IC.pause; pauseB.setAttribute('aria-label', t('Pausa', 'Pause')); page.classList.remove('paused'); }
      else { pausedAt = performance.now(); pauseB.innerHTML = IC.play; pauseB.setAttribute('aria-label', t('Seguir', 'Resume')); page.classList.add('paused'); try { speechSynthesis.cancel(); } catch { /* noop */ } }
    });
    page._beforeClose = (doClose) => {
      if (page.dataset.phase !== 'done' && !window.confirm(t('¿Terminar la sesión de estiramientos?', 'End the stretching session?'))) return;
      doClose();
    };
    page._onClose = () => { cancelAnimationFrame(raf); try { wake?.release(); } catch { /* noop */ } document.removeEventListener('visibilitychange', onVis); try { speechSynthesis.cancel(); } catch { /* noop */ } };
    if (prefs.beep) beep(1, 0.01, 0.0001); // desbloquea el audio con el toque de «Empezar»
    showStep();
    raf = requestAnimationFrame(tick);
  }

  // --- Entradas -------------------------------------------------------------------
  function injectRoutines() {
    if (!/^#\/routines/.test(location.hash) || /[?&]id=/.test(location.hash)) return;
    const view = document.getElementById('view');
    const head = view?.querySelector('.screen-head');
    if (!head || view.querySelector('.sx-entry')) return;
    const card = el('button', 'card sx-entry', `<span class="sx-entry-fig">${LIB()[0] ? FIG()?.svg(LIB()[0].pose, LIB()[0].pose2) : ''}</span><span class="sx-entry-text"><strong>${esc(t('Estiramientos', 'Stretching'))}</strong><small>${esc(t('Guiados con temporizador. Rápidos o a tu medida.', 'Guided with a timer. Quick or made to measure.'))}</small></span><span class="sx-chev" aria-hidden="true">›</span>`);
    card.type = 'button';
    card.dataset.i18nSkip = '1';
    card.addEventListener('click', () => openHome());
    const anchor = head.nextElementSibling?.classList.contains('row') ? head.nextElementSibling : head;
    anchor.insertAdjacentElement('afterend', card);
  }
  function wireFinish(ov) {
    if (ov.dataset.sxWired) return;
    const modal = ov.querySelector('.modal');
    const title = modal?.querySelector('h3');
    if (!title || !/completada|complete/i.test(title.textContent)) return;
    ov.dataset.sxWired = '1';
    const btn = el('button', 'btn secondary sx-finish-btn', `${IC.spark}${esc(t('Estirar ahora · 5 min', 'Stretch now · 5 min'))}`);
    btn.type = 'button';
    btn.dataset.i18nSkip = '1';
    btn.addEventListener('click', async () => {
      const store = await loadStore();
      const areas = await postWorkoutAreas();
      const items = build({ minutes: 5, areas, level: store.prefs.level, intensity: store.prefs.intensity, gap: store.prefs.gap });
      play(store, { name: t('Después de entrenar', 'After your workout'), items });
    });
    const done = [...modal.querySelectorAll('button.btn')].filter((b) => !b.classList.contains('fx-health-btn')).pop();
    if (done?.parentElement) done.parentElement.insertBefore(btn, done); else modal.appendChild(btn);
  }
  const start = () => {
    new MutationObserver((list) => {
      for (const m of list) for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.classList?.contains('modal-overlay')) setTimeout(() => { try { wireFinish(node); } catch { /* noop */ } }, 80);
      }
      try { injectRoutines(); } catch { /* noop */ }
    }).observe(document.getElementById('view') || document.body, { childList: true, subtree: false });
    new MutationObserver((list) => {
      for (const m of list) for (const node of m.addedNodes) if (node.nodeType === 1 && node.classList?.contains('modal-overlay')) setTimeout(() => { try { wireFinish(node); } catch { /* noop */ } }, 80);
    }).observe(document.body, { childList: true });
    window.addEventListener('hashchange', () => setTimeout(() => { try { injectRoutines(); } catch { /* noop */ } }, 120));
    try { injectRoutines(); } catch { /* noop */ }
  };
  window.__ferrumStretch = { open: () => openHome(), build };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
