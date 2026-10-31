// Ferrum · descanso con el temporizador del iPhone (v87).
//
// El descanso entre series es el temporizador del Reloj del iPhone, lanzado
// por el atajo «Ferrum descanso» (una acción: Iniciar temporizador de
// [Entrada de atajo] segundos). Es la única vía: sigue sonando con la música
// puesta, con el móvil bloqueado y con Ferrum cerrado, y la cuenta atrás sale
// en la pantalla de bloqueo y en la Isla Dinámica. Sin el atajo enlazado no
// hay temporizador entre series (src/ui/train.ts → startRestTimer).
//
// Dos formas de lanzarlo:
//   «auto»  al marcar la serie Ferrum abre shortcuts://run-shortcut con los
//           segundos; se vuelve con «◀ Ferrum» arriba a la izquierda.
//   «tap»   Ferrum copia los segundos y el usuario da dos toques en la parte
//           trasera del iPhone (Tocar atrás), sin salir de Ferrum; el atajo
//           los lee con «Si no hay datos de entrada: Obtener portapapeles».
//
// Una web no puede saber si el atajo existe: «enlazado» significa que en este
// móvil se completó la guía. Si no lo está, se avisa al abrir la app (y en la
// ventana de novedades de esta versión) y al marcar una serie.
// Usa las piezas de ui/ferrum-settings-v1.js (window.__ferrumSettingsKit).
(() => {
  const root = document.documentElement;
  const en = () => (window.__ferrumI18n?.lang || root.lang) === 'en';
  const t = (es, enText) => (en() ? enText : es);
  const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* noop */ } };
  const kit = () => window.__ferrumSettingsKit || {};
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  const NAME = 'Ferrum descanso'; // con la mayúscula solo al principio, como lo escribe el iPhone
  const K = { linked: 'ferrum-timer-setup', mode: 'ferrum-timer-mode', announced: 'ferrum-timer-announced', tapHints: 'ferrum-timer-tap-hints' };
  const icon = (body) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const TIMER = icon('<circle cx="12" cy="13.5" r="7"/><path d="M12 9.5v4.2l2.6 1.6M9.5 3.5h5M18.5 6.5l1.4-1.4"/>');
  const CHECK = icon('<path d="m5 12.5 4.5 4.5L19 7.5"/>');
  const TAP = icon('<rect x="7" y="2.8" width="10" height="18.4" rx="2.4"/><path d="M12 9.5v.01M12 13v.01"/>');

  const linked = () => read(K.linked) === '1';
  const mode = () => (read(K.mode) === 'tap' ? 'tap' : 'auto');
  const toast = (msg) => {
    let n = document.querySelector('.tm-toast');
    if (!n) { n = el('div', 'tm-toast'); n.setAttribute('role', 'status'); document.body.appendChild(n); }
    n.textContent = msg;
    n.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => n.classList.remove('show'), 2600);
  };

  // --- Lanzar el temporizador (dentro del toque que marca la serie) ---------
  function start(seconds) {
    const s = String(Math.max(1, Math.round(Number(seconds) || 0)));
    if (mode() === 'tap') {
      try { navigator.clipboard.writeText(s).catch(() => toast(t('No se pudo copiar el descanso', 'Could not copy the rest time'))); } catch { /* sin portapapeles */ }
      const shown = Number(read(K.tapHints)) || 0;
      if (shown < 3) { write(K.tapHints, String(shown + 1)); toast(t('Da dos toques en la parte de atrás del iPhone', 'Double-tap the back of your iPhone')); }
      return;
    }
    location.href = `shortcuts://run-shortcut?name=${encodeURIComponent(NAME)}&input=text&text=${s}`;
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
            : t('Con el modo automático no hace falta nada más. Si algún día prefieres no salir de Ferrum, cámbialo en Ajustes → Temporizador del iPhone.', 'With automatic mode there is nothing else to do. If you ever prefer to stay in Ferrum, change it in Settings → iPhone timer.');
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
        extra: () => { const b = el('button', 'btn hw-try', `${TIMER} ${t('Probar ahora', 'Try now')}`); b.type = 'button'; b.addEventListener('click', () => { write(K.linked, '1'); start(10); }); return [b]; },
      },
    ];
  }
  function openWizard(onDone) {
    const k = kit();
    if (!k.runWizard) return;
    k.runWizard(steps(), {
      label: t('Temporizador del iPhone', 'iPhone timer'),
      onFinish: () => { write(K.linked, '1'); write(K.announced, '1'); },
    }, onDone);
  }

  // --- Página de Ajustes -------------------------------------------------------
  function stateLabel() { return linked() ? (mode() === 'tap' ? t('Doble toque', 'Back tap') : t('Activado', 'On')) : t('No', 'Off'); }
  function openPage(onChange) {
    const k = kit();
    if (!k.openPage) return;
    k.openPage(t('Temporizador del iPhone', 'iPhone timer'), (pb) => {
      const head = el('div', 'hw-hero tm-hero');
      head.innerHTML = `<span class="hw-heart tm-ic">${TIMER}</span><div><b>${t('El descanso, en el reloj del iPhone', 'Your rest, on the iPhone clock')}</b><small class="hw-status"></small></div>`;
      pb.append(head);
      const paint = () => {
        head.querySelector('.hw-status').textContent = linked() ? t(`Enlazado con el atajo «${NAME}»`, `Linked to the “${NAME}” shortcut`) : t('Sin enlazar: no hay temporizador entre series', 'Not linked: no timer between sets');
        head.classList.toggle('ok', linked());
        onChange?.();
      };
      paint();
      pb.append(el('p', 'st-lead', t(
        'Al marcar una serie, el temporizador del iPhone lleva la cuenta del descanso: sigue sonando tu música, la cuenta atrás sale en la pantalla de bloqueo y en la Isla Dinámica, y suena aunque bloquees el móvil o cierres Ferrum.',
        'When you tick a set, the iPhone timer counts your rest: your music keeps playing, the countdown shows on the Lock Screen and in the Dynamic Island, and it rings even if you lock the phone or close Ferrum.')));
      const guide = el('button', 'btn hw-start', linked() ? t('Ver la guía otra vez', 'See the guide again') : t('Configurar paso a paso', 'Set it up step by step'));
      guide.type = 'button';
      guide.addEventListener('click', () => openWizard(() => { paint(); seg.querySelectorAll('.st-seg-btn').forEach((b, i) => b.classList.toggle('on', (i === 0) === (mode() === 'auto'))); }));
      pb.append(guide);
      const seg = k.segmented([['auto', t('Automático', 'Automatic')], ['tap', t('Doble toque atrás', 'Back tap')]], mode(), (v) => { write(K.mode, v); paint(); });
      seg.classList.add('tm-seg');
      const modeRow = k.row(t('Modo', 'Mode'), seg);
      modeRow.classList.add('tm-mode-row');
      pb.append(k.group(t('Cómo se lanza', 'How it starts'), modeRow));
      pb.append(el('p', 'st-foot', t('Automático abre Atajos un instante y vuelves con «◀ Ferrum». Doble toque atrás no sale de Ferrum, pero necesita dos ajustes más (están en la guía).', 'Automatic opens Shortcuts for a moment and you come back with “◀ Ferrum”. Back tap stays in Ferrum, but needs two more settings (they are in the guide).')));
      if (linked()) {
        const tryB = el('button', 'btn secondary hw-start', `${TIMER} ${t('Probar ahora (10 s)', 'Try now (10 s)')}`);
        tryB.type = 'button';
        tryB.addEventListener('click', () => start(10));
        const off = el('button', 'btn danger hw-start', t('Desenlazar', 'Unlink'));
        off.type = 'button';
        off.addEventListener('click', () => { write(K.linked, '0'); paint(); off.remove(); tryB.remove(); });
        pb.append(tryB, off);
      }
      const help = el('details', 'hw-help');
      help.innerHTML = `<summary>${t('¿No funciona?', 'Not working?')}</summary><ul>
        <li>${t(`«No se encuentra el atajo»: tiene que llamarse <b>${NAME}</b>, sin espacios de más.`, `“Shortcut not found”: it must be named <b>${NAME}</b>, no extra spaces.`)}</li>
        <li>${t('El temporizador sale con 0 s o con otra duración: en «Iniciar temporizador», el número tiene que ser la variable <b>Entrada de atajo</b> y la unidad <b>segundos</b>.', 'The timer shows 0 s or another length: in “Start Timer”, the number must be the <b>Shortcut Input</b> variable and the unit <b>seconds</b>.')}</li>
        <li>${t('Doble toque atrás no hace nada: revisa Ajustes del iPhone → Accesibilidad → Tocar → Tocar atrás, y que en el atajo «Si no hay datos de entrada» sea <b>Obtener portapapeles</b>.', 'Back tap does nothing: check iPhone Settings → Accessibility → Touch → Back Tap, and that the shortcut’s “If there is no input” is <b>Get Clipboard</b>.')}</li>
        <li>${t('Pruébalo siempre desde Ferrum, no con el ▶ de Atajos: desde Atajos el atajo no recibe los segundos.', 'Always test it from Ferrum, not with ▶ in Shortcuts: from there the shortcut gets no seconds.')}</li></ul>`;
      pb.append(help);
      pb.append(el('p', 'st-foot', t('Ferrum no puede comprobar si el atajo existe: «enlazado» quiere decir que en este móvil completaste la guía.', 'Ferrum cannot check whether the shortcut exists: “linked” means you completed the guide on this phone.')));
    });
  }

  // --- Aviso: al abrir la app, en las novedades y al marcar una serie ---------
  let promptedThisLoad = false;
  function prompt(kind) {
    if (linked() || promptedThisLoad || document.querySelector('.tm-prompt, .hw-page')) return;
    promptedThisLoad = true;
    const first = read(K.announced) !== '1';
    const ov = el('div', 'modal-overlay tm-prompt');
    ov.dataset.i18nSkip = '1';
    const bullets = [
      t('Tu música sigue sonando durante el descanso', 'Your music keeps playing during the rest'),
      t('Cuenta atrás en la pantalla de bloqueo y en la Isla Dinámica', 'Countdown on the Lock Screen and in the Dynamic Island'),
      t('Suena aunque bloquees el móvil o cierres Ferrum', 'It rings even if you lock the phone or close Ferrum'),
    ];
    ov.innerHTML = `<div class="modal tm-modal" role="dialog" aria-label="${t('Temporizador del iPhone', 'iPhone timer')}">
      <span class="tm-badge">${TIMER}</span>
      <h3>${first ? t('Nuevo: el descanso, en el temporizador del iPhone', 'New: your rest, on the iPhone timer') : t('El temporizador entre series no está configurado', 'The timer between sets is not set up')}</h3>
      ${first ? `<ul class="tm-list">${bullets.map((b) => `<li>${CHECK}<span>${b}</span></li>`).join('')}</ul>` : ''}
      <p class="tm-note">${kind === 'set' ? t('Has marcado una serie, pero sin el atajo Ferrum no tiene temporizador entre series.', 'You ticked a set, but without the shortcut Ferrum has no timer between sets.') : t('Se configura una vez, en unos 2 minutos. Sin configurarlo, Ferrum no tiene temporizador entre series.', 'You set it up once, in about 2 minutes. Without it, Ferrum has no timer between sets.')}</p>
      <button class="btn tm-go" type="button">${t('Configurar ahora · 2 min', 'Set it up now · 2 min')}</button>
      <button class="btn secondary tm-later" type="button">${t('Ahora no', 'Not now')}</button>
    </div>`;
    document.body.appendChild(ov);
    const close = () => { ov.remove(); write(K.announced, '1'); };
    ov.querySelector('.tm-later').addEventListener('click', close);
    ov.querySelector('.tm-go').addEventListener('click', () => { close(); openWizard(); });
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
  }
  // Ventana de novedades de esta versión: lleva directamente el botón de la guía.
  function enrichWhatsNew(modal) {
    if (!modal || linked() || modal.querySelector('.tm-inline')) return;
    promptedThisLoad = true;
    const box = el('div', 'tm-inline');
    box.dataset.i18nSkip = '1';
    box.innerHTML = `<span class="tm-badge">${TIMER}</span><div><b>${t('Configura el temporizador del iPhone', 'Set up the iPhone timer')}</b><small>${t('Sin él, Ferrum no tiene temporizador entre series.', 'Without it, Ferrum has no timer between sets.')}</small></div>`;
    const go = el('button', 'btn tm-go', t('Empezar la guía · 2 min', 'Start the guide · 2 min'));
    go.type = 'button';
    go.addEventListener('click', () => { modal.closest('.modal-overlay')?.remove(); write(K.announced, '1'); openWizard(); });
    const ok = modal.querySelector('#wn-ok');
    if (ok) { ok.classList.add('secondary'); ok.textContent = t('Más tarde', 'Later'); modal.insertBefore(box, ok); modal.insertBefore(go, ok); }
    else modal.append(box, go);
  }
  window.addEventListener('ferrum:whats-new', (e) => enrichWhatsNew(e.detail?.modal));
  // Por si la ventana salió antes de cargar este módulo.
  enrichWhatsNew(document.querySelector('#wn-ok')?.closest('.modal'));
  // Al abrir la app (tras la puerta del PIN), si no está enlazado.
  function whenBooted(fn) {
    const ready = () => window.__ferrumBooted && !document.getElementById('pin-gate') && document.querySelector('#view > *');
    let n = 0;
    const tick = () => {
      if (ready()) { setTimeout(fn, 900); return; }
      if (++n < 600) setTimeout(tick, 500);
    };
    tick();
  }
  const missing = {};
  whenBooted(() => {
    if (linked() || document.querySelector('.modal-overlay')) {
      // La ventana de novedades ya lleva el botón; si hay otra ventana abierta, se espera a que cierre.
      if (!linked() && !promptedThisLoad) {
        const mo = new MutationObserver(() => { if (!document.querySelector('.modal-overlay')) { mo.disconnect(); prompt('open'); } });
        mo.observe(document.body, { childList: true });
      }
      return;
    }
    prompt('open');
  });

  window.__ferrumTimer = {
    linked, mode, start, stateLabel, openPage, openWizard,
    // Al marcar una serie sin atajo: la ventana una vez; después, un aviso breve.
    missing: () => {
      if (!promptedThisLoad) { prompt('set'); return; }
      if (!missing.hinted) { missing.hinted = true; toast(t('Sin temporizador: configúralo en Ajustes → Temporizador del iPhone', 'No timer: set it up in Settings → iPhone timer')); }
    },
  };
})();
