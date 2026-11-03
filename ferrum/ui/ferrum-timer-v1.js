// Ferrum · aviso de fin de descanso (v87, v90).
//
// Al marcar una serie, Ferrum avisa cuando acaba el descanso de una de estas
// dos formas (Ajustes → Aviso de descanso):
//  «push» (v90, recomendado): el servidor de Amigos manda una notificación a
//         la hora exacta. Suena con el móvil bloqueado o con Ferrum cerrada, y
//         la música solo baja un momento. El texto («Siguiente: ejercicio ·
//         peso × reps») se guarda aquí, en Cache Storage, y lo pone sw.js al
//         llegar el push: el servidor solo sabe la hora. Usa window.__ferrumPush
//         (ui/push-v2.js).
//  «shortcut» (v87): el temporizador del Reloj del iPhone, lanzado por el atajo
//         «Ferrum descanso» (una acción: Iniciar temporizador de [Entrada de
//         atajo] segundos), de forma automática (abre Atajos un instante) o con
//         doble toque atrás (Ferrum copia los segundos y el atajo los lee con
//         «Si no hay datos de entrada: Obtener portapapeles»).
// Sin ninguna activada no hay aviso: se ofrece al abrir la app, en las novedades
// y al marcar una serie (src/ui/train.ts → startRestTimer).
// Una web no puede saber si el atajo existe: «enlazado» significa que en este
// móvil se completó la guía.
// Usa las piezas de ui/ferrum-settings-v1.js (window.__ferrumSettingsKit).
(() => {
  const root = document.documentElement;
  const en = () => (window.__ferrumI18n?.lang || root.lang) === 'en';
  const t = (es, enText) => (en() ? enText : es);
  const tr = (s) => (window.__ferrumI18n?.t ? window.__ferrumI18n.t(s) : s);
  const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* noop */ } };
  const kit = () => window.__ferrumSettingsKit || {};
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  const NAME = 'Ferrum descanso'; // con la mayúscula solo al principio, como lo escribe el iPhone
  const K = {
    linked: 'ferrum-timer-setup', mode: 'ferrum-timer-mode', announced: 'ferrum-timer-announced', tapHints: 'ferrum-timer-tap-hints',
    method: 'ferrum-rest-method', pushOn: 'ferrum-push-on', pushAnnounced: 'ferrum-push-announced',
  };
  const icon = (body) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const TIMER = icon('<circle cx="12" cy="13.5" r="7"/><path d="M12 9.5v4.2l2.6 1.6M9.5 3.5h5M18.5 6.5l1.4-1.4"/>');
  const CHECK = icon('<path d="m5 12.5 4.5 4.5L19 7.5"/>');
  const TAP = icon('<rect x="7" y="2.8" width="10" height="18.4" rx="2.4"/><path d="M12 9.5v.01M12 13v.01"/>');
  const BELL = icon('<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.6 2.1H4.4z"/><path d="M10 20.6a2.2 2.2 0 0 0 4 0"/>');

  const P = () => window.__ferrumPush;
  const linked = () => read(K.linked) === '1';
  const mode = () => (read(K.mode) === 'tap' ? 'tap' : 'auto');
  const pushOn = () => read(K.pushOn) === '1' && typeof Notification !== 'undefined' && Notification.permission === 'granted' && (P()?.registered ? P().registered() : true);
  const method = () => { const m = read(K.method); return m === 'push' || m === 'shortcut' ? m : (linked() ? 'shortcut' : 'push'); };
  const ready = () => (method() === 'push' ? pushOn() : linked());
  const toast = (msg) => {
    let n = document.querySelector('.tm-toast');
    if (!n) { n = el('div', 'tm-toast'); n.setAttribute('role', 'status'); document.body.appendChild(n); }
    n.textContent = msg;
    n.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => n.classList.remove('show'), 2800);
  };

  // --- Aviso por notificación ---------------------------------------------------
  const num = (n) => { const v = Math.round(Number(n) * 100) / 100; return en() ? String(v) : String(v).replace('.', ','); };
  function restText(info) {
    const title = t('Descanso terminado', 'Rest finished');
    if (!info) return { title, body: t('¡A por la siguiente serie!', 'Time for your next set!') };
    if (info.last) return { title, body: t('Era la última serie. ¡Buen trabajo!', 'That was your last set. Great job!') };
    let load = '';
    if (info.kg > 0 && info.reps != null) load = `${num(info.kg)} kg × ${info.reps}`;
    else if (info.kg > 0) load = `${num(info.kg)} kg`;
    else if (info.reps != null) load = `${info.reps} reps`;
    else if (info.dur != null) load = `${info.dur} s`;
    else if (info.km != null) load = `${num(info.km)} km`;
    return { title, body: `${t('Siguiente', 'Next')}: ${tr(info.name)}${load ? ` · ${load}` : ''}` };
  }
  async function stash(entry) {
    try {
      const c = await caches.open('prefs-ferrum');
      await c.put('./__rest', new Response(JSON.stringify(entry), { headers: { 'Content-Type': 'application/json' } }));
    } catch { /* sin caché: el aviso sale con el texto genérico */ }
  }
  let pending = null; // { token, endsAt } del aviso programado
  function schedulePush(seconds, text, url) {
    const endsAt = Date.now() + seconds * 1000;
    const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    pending = { token, endsAt };
    void stash({ token, endsAt, url, ...text });
    const attempt = (n) => {
      const p = P();
      const run = p?.remind ? p.remind(endsAt, token) : Promise.reject(new Error('push'));
      run.catch(() => {
        if (pending?.token !== token) return;
        if (n < 2 && Date.now() < endsAt - 3000) { setTimeout(() => attempt(n + 1), 2000 * (n + 1)); return; }
        toast(t('Sin conexión: este descanso no tendrá aviso', 'Offline: this rest will have no alert'));
      });
    };
    attempt(0);
  }
  function stop() {
    const p = pending;
    pending = null;
    if (!p || Date.now() > p.endsAt - 500) return;
    try { P()?.cancel?.(p.token)?.catch?.(() => {}); } catch { /* noop */ }
  }
  function testPush() {
    schedulePush(10, { title: t('Descanso terminado', 'Rest finished'), body: t('Aviso de prueba: así sonará al acabar cada descanso.', 'Test alert: this is how every rest will end.') }, './#/more');
    toast(t('Bloquea el móvil: el aviso llega en 10 segundos', 'Lock your phone: the alert arrives in 10 seconds'));
  }
  // Al volver a Ferrum se quitan los avisos ya vistos de la pantalla de bloqueo.
  async function clearDelivered() {
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      for (const n of (await reg?.getNotifications()) || []) if (n.data?.kind === 'rest' || n.tag === 'rest-timer') n.close();
    } catch { /* noop */ }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !(pending && Date.now() < pending.endsAt)) void clearDelivered();
  });
  // Activar: pide el permiso dentro del toque (enable() lo hace antes de esperar nada).
  function activate(btn, errEl, onOk) {
    const p = P();
    if (!p?.enable) { errEl.textContent = t('Los avisos aún se están cargando. Prueba otra vez en unos segundos.', 'Alerts are still loading. Try again in a few seconds.'); return; }
    const label = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = t('Activando…', 'Turning on…');
    errEl.textContent = '';
    p.enable().then(() => {
      write(K.pushOn, '1'); write(K.method, 'push'); write(K.pushAnnounced, '1');
      onOk?.();
    }).catch((e) => {
      errEl.textContent = tr(e?.message || 'No se pudo activar el aviso. Inténtalo de nuevo.');
      btn.disabled = false;
      btn.innerHTML = label;
    });
  }

  // --- Temporizador del iPhone (dentro del toque que marca la serie) ------------
  function startShortcut(seconds) {
    const s = String(Math.max(1, Math.round(Number(seconds) || 0)));
    if (mode() === 'tap') {
      try { navigator.clipboard.writeText(s).catch(() => toast(t('No se pudo copiar el descanso', 'Could not copy the rest time'))); } catch { /* sin portapapeles */ }
      const shown = Number(read(K.tapHints)) || 0;
      if (shown < 3) { write(K.tapHints, String(shown + 1)); toast(t('Da dos toques en la parte de atrás del iPhone', 'Double-tap the back of your iPhone')); }
      return;
    }
    location.href = `shortcuts://run-shortcut?name=${encodeURIComponent(NAME)}&input=text&text=${s}`;
  }
  function start(seconds, info) {
    const s = Math.max(1, Math.round(Number(seconds) || 0));
    if (method() === 'push') { schedulePush(s, restText(info), './#/train/active'); return; }
    startShortcut(s);
  }

  // --- La guía ------------------------------------------------------------------
  function steps() {
    const k = kit();
    const tok = k.tok, action = k.action;
    const N = {
      input: t('Entrada de atajo', 'Shortcut Input'), sec: t('segundos', 'seconds'), start: t('Iniciar temporizador', 'Start Timer'),
      search: t('Buscar acciones', 'Search for actions'), clip: t('Obtener portapapeles', 'Get Clipboard'),
    };
    const recv = (hot) => `<div class="hw-act${hot ? ' hot' : ' hw-recv'}"><span class="hw-aic" style="background:#0a84ff">⇣</span><div class="hw-abody">${t('Recibir', 'Receive')} ${tok(t('Apps y 18 más', 'Apps and 18 more'))} ${t('de', 'from')} ${tok(t('Ninguna parte', 'Nowhere'))}${hot ? `<div class="hw-fields"><div>${t('Si no hay datos de entrada:', 'If there is no input:')} ${tok(N.clip, true)}</div></div>` : ''}</div></div>`;
    const timerBlock = (hot) => action(TIMER, '#ff9f0a', `<div class="hw-line hw-l0">${t('Iniciar temporizador de', 'Start timer for')} ${tok(N.input, hot)} ${tok(N.sec, hot)}</div>`, hot);
    let chosen = mode();
    return [
      {
        title: t('Abre Atajos y crea uno nuevo', 'Open Shortcuts and make a new one'),
        text: t('Atajos es una app de Apple que ya viene en el iPhone (icono de dos cuadrados de colores). Ábrela y toca <b>+</b>, arriba a la derecha.', 'Shortcuts is an Apple app that comes with your iPhone (two colourful squares icon). Open it and tap <b>+</b> at the top right.'),
        mock: `<div class="hw-top"><span class="hw-big">${t('Atajos', 'Shortcuts')}</span><span class="hw-plus hot">+</span></div><div class="hw-tiles"><span></span><span></span><span></span><span></span></div>`,
        extra: () => [k.openShortcuts()],
      },
      {
        title: t('Ponle este nombre', 'Give it this name'),
        text: t(`Toca el nombre de arriba («Nuevo atajo») → <b>Cambiar nombre</b> y escribe <b>${NAME}</b>. Ferrum lo busca por ese nombre, así que tiene que coincidir.`, `Tap the name at the top (“New Shortcut”) → <b>Rename</b> and type <b>${NAME}</b>. Ferrum looks for it by that name, so it has to match.`),
        mock: `<div class="hw-name hot">${TIMER} ${NAME} <span>⌄</span></div><div class="hw-search">${k.SEARCH || ''} ${N.search}</div>`,
        extra: () => [k.copyBtn(NAME)],
      },
      {
        title: t('La acción: el temporizador', 'The action: the timer'),
        text: t(`Toca <b>${N.search}</b>, escribe <b>temporizador</b> y elige <b>${N.start}</b>. Luego toca el número y elige la variable <b>${N.input}</b>, y toca la unidad y elige <b>${N.sec}</b>. Toca <b>OK</b> (o ✓) arriba para guardar.`,
          `Tap <b>${N.search}</b>, type <b>timer</b> and choose <b>${N.start}</b>. Then tap the number and pick the variable <b>${N.input}</b>, and tap the unit and pick <b>${N.sec}</b>. Tap <b>Done</b> (or ✓) at the top to save.`),
        mock: recv(false) + timerBlock(true),
        tip: t(`«${N.input}» sale al tocar el número: elige «Seleccionar variable» o la fila de sugerencias sobre el teclado. El bloque «Recibir… de Ninguna parte» aparece solo arriba: es normal.`,
          `“${N.input}” shows up when you tap the number: choose “Select Variable” or the suggestions above the keyboard. The “Receive… from Nowhere” block appears on top by itself: that's normal.`),
      },
      {
        title: t('¿Cómo quieres lanzarlo?', 'How do you want to start it?'),
        text: t('<b>Automático:</b> al marcar una serie, Ferrum abre el atajo un instante y el temporizador arranca solo. Vuelves con «◀ Ferrum», arriba a la izquierda.<br><b>Doble toque atrás:</b> no sales de Ferrum. Al marcar la serie das dos toques en la parte trasera del iPhone. Necesita dos ajustes más (siguiente paso).',
          '<b>Automatic:</b> when you tick a set, Ferrum opens the shortcut for a moment and the timer starts by itself. Come back with “◀ Ferrum” at the top left.<br><b>Back tap:</b> you never leave Ferrum. After ticking the set, double-tap the back of your iPhone. It needs two more settings (next step).'),
        mock: `<div class="tm-modes"><div class="tm-mode${chosen === 'auto' ? ' hot' : ''}">${TIMER}<b>${t('Automático', 'Automatic')}</b><span>${t('Recomendado', 'Recommended')}</span></div><div class="tm-mode${chosen === 'tap' ? ' hot' : ''}">${TAP}<b>${t('Doble toque atrás', 'Back tap')}</b><span>${t('Sin salir de Ferrum', 'Stay in Ferrum')}</span></div></div>`,
        extra: () => {
          const seg = k.segmented([['auto', t('Automático', 'Automatic')], ['tap', t('Doble toque atrás', 'Back tap')]], chosen, (v) => {
            chosen = v; write(K.mode, v);
            document.querySelectorAll('.hw-page .tm-mode').forEach((m, i) => m.classList.toggle('hot', (i === 0) === (v === 'auto')));
          });
          seg.classList.add('tm-seg');
          return [seg];
        },
      },
      {
        get title() { return chosen === 'tap' ? t('Doble toque atrás: dos ajustes', 'Back tap: two settings') : t('Nada más que configurar', 'Nothing else to set up'); },
        get text() {
          return chosen === 'tap'
            ? t(`1. En el atajo, toca el bloque <b>Recibir…</b> de arriba y en <b>Si no hay datos de entrada</b> elige <b>${N.clip}</b>.<br>2. En la app <b>Ajustes</b> del iPhone: <b>Accesibilidad</b> → <b>Tocar</b> → <b>Tocar atrás</b> → <b>Doble toque</b> → elige <b>${NAME}</b>.`,
              `1. In the shortcut, tap the <b>Receive…</b> block at the top and under <b>If there is no input</b> choose <b>${N.clip}</b>.<br>2. In the iPhone <b>Settings</b> app: <b>Accessibility</b> → <b>Touch</b> → <b>Back Tap</b> → <b>Double Tap</b> → choose <b>${NAME}</b>.`)
            : t('Con el modo automático no hace falta nada más. Si algún día prefieres no salir de Ferrum, cámbialo en Ajustes → Aviso de descanso.', 'With automatic mode there is nothing else to do. If you ever prefer to stay in Ferrum, change it in Settings → Rest alert.');
        },
        get mock() { return chosen === 'tap' ? recv(true) + timerBlock(false) : timerBlock(false); },
        get tip() { return chosen === 'tap' ? t('La primera vez, el iPhone puede preguntar si el atajo puede usar el portapapeles: elige «Permitir siempre».', 'The first time, iPhone may ask whether the shortcut can use the clipboard: choose “Always Allow”.') : ''; },
      },
      {
        title: t('Pruébalo', 'Try it'),
        get text() {
          return mode() === 'tap'
            ? t('Toca <b>Probar ahora</b>: Ferrum copia 10 segundos. Después da <b>dos toques</b> en la parte de atrás del iPhone: debe arrancar un temporizador de 10 s.', 'Tap <b>Try now</b>: Ferrum copies 10 seconds. Then <b>double-tap</b> the back of your iPhone: a 10 s timer should start.')
            : t('Toca <b>Probar ahora</b>: Ferrum abre el atajo y arranca un temporizador de 10 segundos. Lo verás en la pantalla de bloqueo y en la Isla Dinámica. Vuelve con <b>«◀ Ferrum»</b>.', 'Tap <b>Try now</b>: Ferrum opens the shortcut and starts a 10-second timer. You will see it on the Lock Screen and in the Dynamic Island. Come back with <b>“◀ Ferrum”</b>.');
        },
        mock: `<div class="tm-live"><span class="tm-live-ic">${TIMER}</span><b>${t('Temporizador', 'Timer')}</b><span class="tm-live-t">0:10</span></div>`,
        extra: () => { const b = el('button', 'btn hw-try', `${TIMER} ${t('Probar ahora', 'Try now')}`); b.type = 'button'; b.addEventListener('click', () => { write(K.linked, '1'); write(K.method, 'shortcut'); startShortcut(10); }); return [b]; },
      },
    ];
  }
  function openWizard(onDone) {
    const k = kit();
    if (!k.runWizard) return;
    k.runWizard(steps(), {
      label: t('Temporizador del iPhone', 'iPhone timer'),
      onFinish: () => { write(K.linked, '1'); write(K.announced, '1'); write(K.method, 'shortcut'); },
    }, onDone);
  }

  // --- Página de Ajustes -------------------------------------------------------
  function stateLabel() {
    if (method() === 'push') return pushOn() ? t('Notificación', 'Notification') : t('No', 'Off');
    return linked() ? t('Reloj del iPhone', 'iPhone Clock') : t('No', 'Off');
  }
  function renderPush(box, paint) {
    box.append(el('p', 'st-lead', t(
      'Al marcar una serie, Ferrum te manda una notificación cuando acaba el descanso, con el siguiente ejercicio, el peso y las repeticiones. Suena aunque bloquees el móvil o cierres Ferrum, y tu música solo baja un momento.',
      'When you tick a set, Ferrum sends you a notification when the rest ends, with the next exercise, weight and reps. It sounds even if you lock the phone or close Ferrum, and your music only dips for a moment.')));
    const err = el('p', 'tm-err');
    err.setAttribute('role', 'alert');
    const again = () => { box.innerHTML = ''; renderPush(box, paint); paint(); };
    if (!pushOn()) {
      const on = el('button', 'btn hw-start', `${BELL} ${t('Activar aviso', 'Turn on alert')}`);
      on.type = 'button';
      on.addEventListener('click', () => activate(on, err, () => { toast(t('Aviso activado', 'Alert on')); again(); }));
      box.append(on, err);
    } else {
      const tryB = el('button', 'btn hw-start', `${BELL} ${t('Probar aviso (10 s)', 'Test alert (10 s)')}`);
      tryB.type = 'button';
      tryB.addEventListener('click', testPush);
      const off = el('button', 'btn danger hw-start', t('Desactivar aviso', 'Turn off alert'));
      off.type = 'button';
      off.addEventListener('click', () => { write(K.pushOn, '0'); again(); });
      box.append(tryB, el('p', 'st-foot tm-tryhint', t('Toca «Probar», bloquea el móvil y espera 10 segundos.', 'Tap “Test”, lock your phone and wait 10 seconds.')), off, err);
    }
    const help = el('details', 'hw-help');
    help.innerHTML = `<summary>${t('¿No suena?', 'No sound?')}</summary><ul>
      <li>${t('Con el iPhone en <b>silencio</b>, el aviso solo vibra. Quita el silencio para oírlo.', 'With your iPhone on <b>silent</b>, the alert only vibrates. Turn silent off to hear it.')}</li>
      <li>${t('Si usas un modo <b>Concentración</b> («No molestar», «Fitness»…), permite a Ferrum en ese modo: Ajustes del iPhone → Concentración → el modo → Apps.', 'If you use a <b>Focus</b> (Do Not Disturb, Fitness…), allow Ferrum in it: iPhone Settings → Focus → that Focus → Apps.')}</li>
      <li>${t('Si no llega nada: Ajustes del iPhone → Notificaciones → Ferrum → activa <b>Permitir notificaciones</b> y <b>Sonidos</b>.', 'If nothing arrives: iPhone Settings → Notifications → Ferrum → turn on <b>Allow Notifications</b> and <b>Sounds</b>.')}</li>
      <li>${t('Necesita tu cuenta de Amigos y conexión a internet al marcar la serie.', 'It needs your Friends account and an internet connection when you tick the set.')}</li>
      <li>${t('El sonido es el de avisos del iPhone: Ferrum no puede cambiarlo ni subir su volumen.', 'The sound is the iPhone notification sound: Ferrum cannot change it or make it louder.')}</li></ul>`;
    box.append(help);
    box.append(el('p', 'st-foot', t('El servidor solo recibe a qué hora acaba el descanso. El ejercicio, el peso y las repeticiones se quedan en tu móvil.', 'The server only gets the time your rest ends. The exercise, weight and reps stay on your phone.')));
  }
  function renderShortcut(box, paint) {
    const k = kit();
    box.append(el('p', 'st-lead', t(
      'Al marcar una serie, el temporizador del Reloj del iPhone lleva la cuenta del descanso: la cuenta atrás sale en la pantalla de bloqueo y en la Isla Dinámica, y suena aunque bloquees el móvil, incluso en silencio. Necesita un atajo, que se configura una vez.',
      'When you tick a set, the iPhone Clock timer counts your rest: the countdown shows on the Lock Screen and in the Dynamic Island, and it rings even if you lock the phone, even on silent. It needs a shortcut you set up once.')));
    const again = () => { box.innerHTML = ''; renderShortcut(box, paint); paint(); };
    const guide = el('button', 'btn hw-start', linked() ? t('Ver la guía otra vez', 'See the guide again') : t('Configurar paso a paso', 'Set it up step by step'));
    guide.type = 'button';
    guide.addEventListener('click', () => openWizard(again));
    box.append(guide);
    const seg = k.segmented([['auto', t('Automático', 'Automatic')], ['tap', t('Doble toque atrás', 'Back tap')]], mode(), (v) => { write(K.mode, v); paint(); });
    seg.classList.add('tm-seg');
    const modeRow = k.row(t('Modo', 'Mode'), seg);
    modeRow.classList.add('tm-mode-row');
    box.append(k.group(t('Cómo se lanza', 'How it starts'), modeRow));
    box.append(el('p', 'st-foot', t('Automático abre Atajos un instante y vuelves con «◀ Ferrum». Doble toque atrás no sale de Ferrum, pero necesita dos ajustes más (están en la guía).', 'Automatic opens Shortcuts for a moment and you come back with “◀ Ferrum”. Back tap stays in Ferrum, but needs two more settings (they are in the guide).')));
    if (linked()) {
      const tryB = el('button', 'btn secondary hw-start', `${TIMER} ${t('Probar ahora (10 s)', 'Try now (10 s)')}`);
      tryB.type = 'button';
      tryB.addEventListener('click', () => startShortcut(10));
      const off = el('button', 'btn danger hw-start', t('Desenlazar', 'Unlink'));
      off.type = 'button';
      off.addEventListener('click', () => { write(K.linked, '0'); again(); });
      box.append(tryB, off);
    }
    const help = el('details', 'hw-help');
    help.innerHTML = `<summary>${t('¿No funciona?', 'Not working?')}</summary><ul>
      <li>${t(`«No se encuentra el atajo»: tiene que llamarse <b>${NAME}</b>, sin espacios de más.`, `“Shortcut not found”: it must be named <b>${NAME}</b>, no extra spaces.`)}</li>
      <li>${t('El temporizador sale con 0 s o con otra duración: en «Iniciar temporizador», el número tiene que ser la variable <b>Entrada de atajo</b> y la unidad <b>segundos</b>.', 'The timer shows 0 s or another length: in “Start Timer”, the number must be the <b>Shortcut Input</b> variable and the unit <b>seconds</b>.')}</li>
      <li>${t('Doble toque atrás no hace nada: revisa Ajustes del iPhone → Accesibilidad → Tocar → Tocar atrás, y que en el atajo «Si no hay datos de entrada» sea <b>Obtener portapapeles</b>.', 'Back tap does nothing: check iPhone Settings → Accessibility → Touch → Back Tap, and that the shortcut’s “If there is no input” is <b>Get Clipboard</b>.')}</li>
      <li>${t('Pruébalo siempre desde Ferrum, no con el ▶ de Atajos: desde Atajos el atajo no recibe los segundos.', 'Always test it from Ferrum, not with ▶ in Shortcuts: from there the shortcut gets no seconds.')}</li></ul>`;
    box.append(help);
    box.append(el('p', 'st-foot', t('Ferrum no puede comprobar si el atajo existe: «enlazado» quiere decir que en este móvil completaste la guía.', 'Ferrum cannot check whether the shortcut exists: “linked” means you completed the guide on this phone.')));
  }
  function openPage(onChange) {
    const k = kit();
    if (!k.openPage) return;
    k.openPage(t('Aviso de descanso', 'Rest alert'), (pb) => {
      const head = el('div', 'hw-hero tm-hero');
      head.innerHTML = `<span class="hw-heart tm-ic">${BELL}</span><div><b>${t('Te avisa al acabar cada descanso', 'Alerts you when each rest ends')}</b><small class="hw-status"></small></div>`;
      const box = el('div', 'tm-method');
      const paint = () => {
        const on = ready();
        head.querySelector('.hw-status').textContent = on
          ? (method() === 'push' ? t('Activado: notificación', 'On: notification') : t(`Activado: atajo «${NAME}»`, `On: “${NAME}” shortcut`))
          : t('Sin activar: Ferrum no te avisa al acabar el descanso', 'Off: Ferrum will not alert you when a rest ends');
        head.classList.toggle('ok', on);
        onChange?.();
      };
      const render = () => { box.innerHTML = ''; if (method() === 'push') renderPush(box, paint); else renderShortcut(box, paint); paint(); };
      const seg = k.segmented([['push', t('Notificación', 'Notification')], ['shortcut', t('Reloj del iPhone', 'iPhone Clock')]], method(), (v) => { write(K.method, v); render(); });
      seg.classList.add('tm-seg');
      const methodRow = k.row(t('Cómo te avisa', 'How it alerts you'), seg);
      methodRow.classList.add('tm-mode-row');
      pb.append(head, k.group(t('Método', 'Method'), methodRow), box);
      render();
    });
  }

  // --- Aviso: al abrir la app, en las novedades y al marcar una serie ---------
  let promptedThisLoad = false;
  function showDone(modal, close) {
    modal.innerHTML = `<span class="tm-badge ok">${CHECK}</span>
      <h3>${t('Aviso activado', 'Alert on')}</h3>
      <p class="tm-note">${t('Pruébalo: toca «Probar», bloquea el móvil y espera 10 segundos.', 'Try it: tap “Test”, lock your phone and wait 10 seconds.')}</p>
      <button class="btn tm-test" type="button">${BELL} ${t('Probar aviso (10 s)', 'Test alert (10 s)')}</button>
      <button class="btn secondary tm-ok" type="button">${t('Listo', 'Done')}</button>`;
    modal.classList.add('tm-modal');
    modal.querySelector('.tm-test').addEventListener('click', testPush);
    modal.querySelector('.tm-ok').addEventListener('click', close);
  }
  function prompt(kind) {
    if (ready() || promptedThisLoad || document.querySelector('.tm-prompt, .hw-page')) return;
    promptedThisLoad = true;
    const first = read(K.pushAnnounced) !== '1';
    const ov = el('div', 'modal-overlay tm-prompt');
    ov.dataset.i18nSkip = '1';
    const bullets = [
      t('Suena aunque bloquees el móvil o cierres Ferrum', 'It sounds even if you lock the phone or close Ferrum'),
      t('Tu música solo baja un momento, no se para', 'Your music only dips for a moment, it never stops'),
      t('Te dice el siguiente ejercicio, el peso y las repeticiones', 'It tells you the next exercise, weight and reps'),
    ];
    ov.innerHTML = `<div class="modal tm-modal" role="dialog" aria-label="${t('Aviso de descanso', 'Rest alert')}">
      <span class="tm-badge">${BELL}</span>
      <h3>${first ? t('Nuevo: aviso al terminar el descanso', 'New: an alert when your rest ends') : t('El aviso de descanso no está activado', 'The rest alert is off')}</h3>
      ${first ? `<ul class="tm-list">${bullets.map((b) => `<li>${CHECK}<span>${b}</span></li>`).join('')}</ul>` : ''}
      <p class="tm-note">${kind === 'set' ? t('Has marcado una serie, pero sin el aviso Ferrum no te avisa al acabar el descanso.', 'You ticked a set, but without the alert Ferrum will not tell you when the rest ends.') : t('Se activa con un toque. Sin él, Ferrum no te avisa al acabar el descanso.', 'One tap turns it on. Without it, Ferrum will not tell you when a rest ends.')}</p>
      <p class="tm-err" role="alert"></p>
      <button class="btn tm-go" type="button">${BELL} ${t('Activar aviso', 'Turn on alert')}</button>
      <button class="btn secondary tm-later" type="button">${t('Ahora no', 'Not now')}</button>
      <button class="tm-alt" type="button">${t('Prefiero el temporizador del iPhone', 'I prefer the iPhone timer')}</button>
    </div>`;
    document.body.appendChild(ov);
    const close = () => { ov.remove(); write(K.pushAnnounced, '1'); };
    ov.querySelector('.tm-later').addEventListener('click', close);
    ov.querySelector('.tm-alt').addEventListener('click', () => { close(); write(K.method, 'shortcut'); openWizard(); });
    const go = ov.querySelector('.tm-go');
    go.addEventListener('click', () => activate(go, ov.querySelector('.tm-err'), () => showDone(ov.querySelector('.modal'), close)));
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
  }
  // Ventana de novedades: lleva directamente el botón para activar el aviso.
  function enrichWhatsNew(modal) {
    if (!modal || (method() === 'push' && pushOn()) || modal.querySelector('.tm-inline')) return;
    promptedThisLoad = true;
    const box = el('div', 'tm-inline');
    box.dataset.i18nSkip = '1';
    box.innerHTML = `<span class="tm-badge">${BELL}</span><div><b>${t('Activa el aviso de descanso', 'Turn on the rest alert')}</b><small>${t('Suena al acabar cada descanso, con el móvil bloqueado y sin parar tu música.', 'It sounds when each rest ends, with the phone locked and without stopping your music.')}</small></div>`;
    const err = el('p', 'tm-err');
    err.setAttribute('role', 'alert');
    const go = el('button', 'btn tm-go', `${BELL} ${t('Activar aviso', 'Turn on alert')}`);
    go.type = 'button';
    go.addEventListener('click', () => activate(go, err, () => showDone(modal, () => modal.closest('.modal-overlay')?.remove())));
    const ok = modal.querySelector('#wn-ok');
    if (ok) { ok.classList.add('secondary'); ok.textContent = t('Más tarde', 'Later'); modal.insertBefore(box, ok); modal.insertBefore(err, ok); modal.insertBefore(go, ok); }
    else modal.append(box, err, go);
  }
  window.addEventListener('ferrum:whats-new', (e) => enrichWhatsNew(e.detail?.modal));
  // Por si la ventana salió antes de cargar este módulo.
  enrichWhatsNew(document.querySelector('#wn-ok')?.closest('.modal'));
  // Al abrir la app (tras la puerta del PIN), si no hay aviso.
  function whenBooted(fn) {
    const isReady = () => window.__ferrumBooted && !document.getElementById('pin-gate') && document.querySelector('#view > *');
    let n = 0;
    const tick = () => {
      if (isReady()) { setTimeout(fn, 1200); return; } // da tiempo a cargar ui/push-v2.js
      if (++n < 600) setTimeout(tick, 500);
    };
    tick();
  }
  const missing = {};
  whenBooted(() => {
    if (window.__ferrumLangSwitched) return; // recarga por cambio de idioma
    if (ready()) return;
    if (document.querySelector('.modal-overlay')) {
      // La ventana de novedades ya lleva el botón; si hay otra ventana abierta, se espera a que cierre.
      if (!promptedThisLoad) {
        const mo = new MutationObserver(() => { if (!document.querySelector('.modal-overlay')) { mo.disconnect(); prompt('open'); } });
        mo.observe(document.body, { childList: true });
      }
      return;
    }
    prompt('open');
  });

  window.__ferrumTimer = {
    ready, linked, method, mode, start, stop, stateLabel, openPage, openWizard, testPush,
    // Al marcar una serie sin aviso: la ventana una vez; después, un aviso breve.
    missing: () => {
      if (!promptedThisLoad) { prompt('set'); return; }
      if (!missing.hinted) { missing.hinted = true; toast(t('Sin aviso de descanso: actívalo en Ajustes → Aviso de descanso', 'No rest alert: turn it on in Settings → Rest alert')); }
    },
  };
})();
