// Ferrum Command · movimiento. Inspirado en el lenguaje de GSAP: salidas
// «expo.out», rebotes «back.out» y elásticos, entradas escalonadas, títulos
// que suben palabra a palabra, trazos en degradado que giran y destellos de
// color (verde GSAP #0ae448→#abff84 y la paleta de sus cinco disciplinas).
//
// Solo presentación: escucha lo que pasa en la página (toques, series que se
// marcan, cambios de ruta, el temporizador de descanso) y anima una capa
// fija por encima, sin tocar la lógica de la app. Todo va en try/catch: un
// fallo aquí nunca debe llegar al diagnóstico de arranque.
(() => {
  const root = document.documentElement;
  if (root.dataset.fuiSkin !== 'command') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const off = () => reduced.matches || typeof Element.prototype.animate !== 'function';

  const EXPO = 'cubic-bezier(.16, 1, .3, 1)';
  const BACK = 'cubic-bezier(.34, 1.56, .64, 1)';
  // Muelle (como elastic.out suave) muestreado para CSS linear(); sin
  // soporte, back.out.
  const SPRING = (() => {
    try {
      const pts = [];
      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        pts.push(+(1 - Math.exp(-6.2 * t) * Math.cos(10.5 * t)).toFixed(4));
      }
      const v = `linear(${pts.join(', ')})`;
      return CSS.supports('transition-timing-function', v) ? v : BACK;
    } catch { return BACK; }
  })();
  root.style.setProperty('--m-spring', SPRING);
  const GREEN = ['#0ae448', '#abff84', '#59d499', '#e9ffd9'];
  const GSAP = ['#0ae448', '#abff84', '#ff8709', '#fec5fb', '#9d95ff', '#00bae2'];

  // Colores de la paleta activa (Grafito / Rosa), definidos en el CSS.
  const cssList = (name, fb) => {
    try {
      const v = getComputedStyle(root).getPropertyValue(name).trim();
      return v ? v.split(',').map((x) => x.trim()).filter(Boolean) : fb;
    } catch { return fb; }
  };
  const cssVar = (name, fb) => { try { return getComputedStyle(root).getPropertyValue(name).trim() || fb; } catch { return fb; } };
  const safe = (fn) => (...a) => { try { return fn(...a); } catch { /* nunca romper la app */ } };
  const anim = (el, frames, opts) => { try { return el.animate(frames, opts); } catch { return null; } };
  const dark = () => root.dataset.theme !== 'light';

  // Capa fija donde viven los efectos (no altera el layout de nadie).
  let layer = null;
  const fxLayer = () => {
    if (layer?.isConnected) return layer;
    layer = document.createElement('div');
    layer.className = 'fx-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    return layer;
  };
  const box = (rect, radius) => {
    const b = document.createElement('div');
    b.className = 'fx-box';
    Object.assign(b.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: radius || '0px' });
    fxLayer().appendChild(b);
    return b;
  };
  const done = (a, el) => { if (a) a.onfinish = () => el.remove(); else setTimeout(() => el.remove(), 900); };

  const lum = (color) => {
    const m = color.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).map(Number);
    if (a < .35) return null;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  };

  // --- 1. Brillo al pulsar, desde el punto exacto del dedo ---------------
  const PRESSABLE = 'button:not(:disabled), a[href], summary, [role="button"], .card[data-act], .mcal-day';
  // El brillo vive en la capa fija, así que debe seguir al botón y
  // desaparecer en cuanto el toque se convierte en scroll: si no, se queda
  // flotando en la pantalla mientras el botón se desplaza.
  let live = null; // { el, b, a, raf }
  const killGlow = (fast = true) => {
    const g = live; live = null;
    if (!g) return;
    cancelAnimationFrame(g.raf);
    if (!fast) return;
    try { g.a?.cancel(); } catch { /* noop */ }
    const out = anim(g.b, [{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'ease-out', fill: 'forwards' });
    done(out, g.b);
  };
  const glowAt = safe((el, x, y, tint0) => {
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    const cs = getComputedStyle(el);
    const l = lum(cs.backgroundColor);
    const lightBg = l == null ? !dark() : l > .6;
    const b = box(r, cs.borderRadius);
    b.style.overflow = 'hidden';
    const g = document.createElement('span');
    g.className = 'fx-glow';
    const size = Math.max(r.width, r.height) * 2.2;
    const tint = tint0 || (el.closest('nav.tabbar') ? 'var(--fx-tab-glow, rgba(255, 99, 99, .32))' : lightBg ? 'rgba(17, 18, 20, .16)' : 'rgba(255, 255, 255, .22)');
    Object.assign(g.style, { left: `${x - r.left - size / 2}px`, top: `${y - r.top - size / 2}px`, width: `${size}px`, height: `${size}px`, background: `radial-gradient(circle, ${tint} 0%, transparent 62%)` });
    b.appendChild(g);
    const a = anim(g, [{ transform: 'scale(.08)', opacity: 1 }, { transform: 'scale(1)', opacity: 0 }], { duration: 640, easing: EXPO, fill: 'forwards' });
    const entry = { el, b, a, raf: 0, x, y };
    // pegado al botón mientras dura (por si la página se mueve un poco)
    const follow = () => {
      if (live !== entry) return;
      if (!el.isConnected) { killGlow(); return; }
      const q = el.getBoundingClientRect();
      b.style.left = `${q.left}px`; b.style.top = `${q.top}px`;
      entry.raf = requestAnimationFrame(follow);
    };
    killGlow();
    live = entry;
    entry.raf = requestAnimationFrame(follow);
    if (a) a.onfinish = () => { if (live === entry) { live = null; cancelAnimationFrame(entry.raf); } b.remove(); };
    else setTimeout(() => b.remove(), 900);
  });
  // Un toque se confirma tras 70 ms sin moverse: así un gesto de scroll que
  // empieza encima de un botón no llega a pintar nada.
  let pending = null;
  const cancelPending = () => { if (pending) { clearTimeout(pending.t); pending = null; } };
  document.addEventListener('pointerdown', (e) => {
    if (off() || e.button > 0) return;
    const el = e.target.closest?.(PRESSABLE);
    if (!el || el.closest('.fx-layer')) return;
    cancelPending();
    const p = { x: e.clientX, y: e.clientY, el, t: 0 };
    p.t = setTimeout(() => { if (pending === p) { pending = null; glowAt(el, p.x, p.y); } }, 70);
    pending = p;
  }, { passive: true });
  document.addEventListener('pointermove', (e) => {
    const p = pending;
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 8) cancelPending();
    if (live && e.buttons && Math.hypot(e.clientX - live.x, e.clientY - live.y) > 10) killGlow();
  }, { passive: true });
  // pointerup antes de 70 ms (toque rápido): el brillo sale igualmente
  document.addEventListener('pointerup', () => { const p = pending; if (p) { cancelPending(); glowAt(p.el, p.x, p.y); } }, { passive: true });
  document.addEventListener('pointercancel', () => { cancelPending(); killGlow(); }, { passive: true });
  document.addEventListener('scroll', () => { cancelPending(); killGlow(); }, { passive: true, capture: true });
  window.addEventListener('blur', () => { cancelPending(); killGlow(); });

  // --- 2. Serie hecha: rebote, onda expansiva y chispas verdes -------------
  const sparks = safe((cx, cy, colors, n = 12, dist = [26, 58], size = [4, 7]) => {
    const L = fxLayer();
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      s.className = 'fx-spark';
      const d = size[0] + Math.random() * (size[1] - size[0]);
      const c = colors[i % colors.length];
      Object.assign(s.style, { left: `${cx - d / 2}px`, top: `${cy - d / 2}px`, width: `${d}px`, height: `${d}px`, background: c, boxShadow: `0 0 10px ${c}` });
      L.appendChild(s);
      const ang = (Math.PI * 2 * i) / n + Math.random() * .5;
      const r = dist[0] + Math.random() * (dist[1] - dist[0]);
      done(anim(s, [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(ang) * r}px, ${Math.sin(ang) * r}px) scale(.2)`, opacity: 0 },
      ], { duration: 620 + Math.random() * 260, easing: EXPO, fill: 'forwards' }), s);
    }
  });
  const shockwave = safe((rect, radius, color) => {
    const b = box(rect, radius);
    b.classList.add('fx-ring');
    b.style.setProperty('--fx-ring', color);
    done(anim(b, [{ transform: 'scale(1)', opacity: .9 }, { transform: 'scale(1.9)', opacity: 0 }], { duration: 640, easing: EXPO, fill: 'forwards' }), b);
  });
  const sheen = safe((rect) => {
    const b = box(rect, '10px');
    b.style.overflow = 'hidden';
    const s = document.createElement('span');
    s.className = 'fx-sheen';
    b.appendChild(s);
    done(anim(s, [{ transform: 'translateX(-120%) skewX(-18deg)' }, { transform: 'translateX(320%) skewX(-18deg)' }], { duration: 760, easing: EXPO, fill: 'forwards' }), b);
  });
  const strokeGlow = safe((el) => {
    const r = el.getBoundingClientRect();
    const radius = getComputedStyle(el).borderRadius;
    const frames = [{ opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: 1, offset: .7 }, { opacity: 0 }];
    for (const cls of ['fx-halo', 'fx-stroke']) {
      const b = box(r, radius);
      b.classList.add(cls);
      done(anim(b, frames, { duration: 1700, easing: 'ease-out', fill: 'forwards' }), b);
    }
  });

  const celebrateSet = safe((btn) => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    anim(btn, [{ transform: 'scale(.62)' }, { transform: 'scale(1.16)', offset: .45 }, { transform: 'scale(1)' }], { duration: 560, easing: 'cubic-bezier(.2, .9, .3, 1)' });
    shockwave(r, getComputedStyle(btn).borderRadius, cssVar('--fx-done-a', '#59d499'));
    sparks(cx, cy, cssList('--fx-sparks', GREEN), 12);
    const row = btn.closest('.set-wrap, tr');
    if (row) sheen(row.getBoundingClientRect());
    try { navigator.vibrate?.(14); } catch { /* noop */ }
    const card = btn.closest('.ex-card');
    if (card && ![...card.querySelectorAll('.check-btn')].some((c) => !c.classList.contains('done'))) {
      setTimeout(() => {
        strokeGlow(card);
        const cr = card.getBoundingClientRect();
        sparks(cr.left + cr.width / 2, Math.max(40, cr.top + 40), cssList('--fx-confetti', GSAP), 22, [50, 130], [5, 9]);
      }, 160);
    }
  });
  const undoSet = safe((btn) => {
    anim(btn, [{ transform: 'scale(.9) rotate(-6deg)' }, { transform: 'scale(1.04) rotate(3deg)', offset: .5 }, { transform: 'none' }], { duration: 420, easing: BACK });
  });
  document.addEventListener('click', (e) => {
    const t = e.target.closest?.('[data-check]');
    if (!t || off()) return;
    const id = t.getAttribute('data-check');
    // El bundle redibuja la tabla en el mismo clic: animamos el botón nuevo.
    requestAnimationFrame(safe(() => {
      const btn = document.querySelector(`[data-check="${CSS.escape(id)}"]`);
      if (!btn) return;
      if (btn.classList.contains('done')) celebrateSet(btn); else undoSet(btn);
    }));
  });

  // --- 3. Cambio de pestaña: entrada escalonada + títulos palabra a palabra
  const splitWords = safe((el, delay = 0) => {
    if (!el || el.dataset.fxSplit) return;
    if (el.children.length || !el.textContent.trim()) return;
    el.dataset.fxSplit = '1';
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const o = document.createElement('span'); o.className = 'fx-w';
      const n = document.createElement('span'); n.className = 'fx-wi'; n.textContent = w;
      o.appendChild(n); el.appendChild(o);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      anim(n, [{ transform: 'translateY(108%) rotate(4deg)' }, { transform: 'none' }], { duration: 900, delay: delay + i * 70, easing: EXPO, fill: 'backwards' });
    });
  });
  const enterRoute = safe(() => {
    if (off()) return;
    const view = document.getElementById('view');
    if (!view) return;
    const kids = [...view.children].filter((k) => k.offsetParent !== null).slice(0, 7);
    kids.forEach((k, i) => {
      anim(k, [{ opacity: 0, transform: 'translateY(22px) scale(.985)', filter: 'blur(5px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
        { duration: 760, delay: 40 + i * 55, easing: EXPO, fill: 'backwards' });
    });
    splitWords(view.querySelector('.screen-head h1'), 60);
    splitWords(view.querySelector('.fui-routine-hero h2'), 220);
    const icon = document.querySelector('nav.tabbar a.active svg');
    if (icon) anim(icon, [{ transform: 'scale(.55) translateY(4px)' }, { transform: 'scale(1.18) translateY(-2px)', offset: .5 }, { transform: 'none' }], { duration: 620, easing: 'cubic-bezier(.2, .9, .3, 1)' });
  });
  let lastRoute = '';
  let routeTimer = 0;
  const onRoute = () => {
    const route = location.hash.split('?')[0];
    if (route === lastRoute) return;
    lastRoute = route;
    clearTimeout(routeTimer);
    // La app pinta la vista nueva un par de frames después del cambio.
    routeTimer = setTimeout(() => requestAnimationFrame(enterRoute), 90);
  };
  window.addEventListener('hashchange', onRoute);

  // --- 4. Descanso: entrada con muelle, borde vivo, progreso y segundos ----
  let restStart = 0, restEnd = 0, restToken = '', raf = 0;
  window.addEventListener('ferrum:rest-start', (e) => {
    const d = e.detail || {};
    if (d.token !== restToken) { restToken = d.token; restStart = Date.now(); }
    restEnd = d.endsAt || 0;
  });
  const tickProgress = () => {
    const el = document.getElementById('rest-timer');
    if (!el) { raf = 0; return; }
    const total = Math.max(1, restEnd - restStart);
    const p = Math.min(1, Math.max(0, (Date.now() - restStart) / total));
    el.style.setProperty('--fx-p', p.toFixed(4));
    const left = (restEnd - Date.now()) / 1000;
    el.classList.toggle('fx-final', left > 0 && left <= 3.2);
    raf = requestAnimationFrame(tickProgress);
  };
  const wireRest = safe((el) => {
    if (el.dataset.fxWired) return;
    el.dataset.fxWired = '1';
    if (!off()) anim(el, [{ opacity: 0, transform: 'translate(-50%, 46px) scale(.92)', filter: 'blur(6px)' }, { opacity: 1, transform: 'translate(-50%, 0) scale(1)', filter: 'blur(0)' }], { duration: 760, easing: SPRING === BACK ? BACK : SPRING });
    if (!raf) raf = requestAnimationFrame(tickProgress);
    const t = el.querySelector('#rest-t');
    if (t) {
      let prev = t.textContent;
      new MutationObserver(safe(() => {
        const now = t.textContent;
        if (now === prev) return;
        prev = now;
        if (off()) return;
        if (now === '¡Listo!' || now === 'Done!' || now === 'Ready!') {
          const r = el.getBoundingClientRect();
          anim(el, [{ transform: 'translate(-50%, 0) scale(1)' }, { transform: 'translate(-50%, 0) scale(1.06)', offset: .35 }, { transform: 'translate(-50%, 0) scale(1)' }], { duration: 640, easing: BACK });
          shockwave(r, getComputedStyle(el).borderRadius, cssVar('--fx-done-a', '#0ae448'));
          sparks(r.left + r.width * .3, r.top + r.height / 2, cssList('--fx-sparks', GREEN), 16, [30, 90]);
          return;
        }
        anim(t, [{ transform: 'translateY(-38%)', opacity: .25, filter: 'blur(2px)' }, { transform: 'none', opacity: 1, filter: 'blur(0)' }], { duration: 300, easing: EXPO });
      })).observe(t, { childList: true, characterData: true, subtree: true });
    }
  });

  // --- 5. Modales, avisos y fin de entrenamiento --------------------------
  const countUp = safe((el) => {
    const txt = el.textContent.trim();
    if (!/^\d[\d.,]*$/.test(txt) || /[.,]\d{1,2}$/.test(txt)) return;
    const target = Number(txt.replace(/[.,]/g, ''));
    if (!Number.isFinite(target) || target <= 0) return;
    const fmt = new Intl.NumberFormat(root.lang === 'en' ? 'en-GB' : 'es-ES', { useGrouping: 'always' });
    const t0 = performance.now(), dur = 1100;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(2, -10 * k);
      el.textContent = fmt.format(Math.round(target * e));
      if (k < 1) requestAnimationFrame(step); else el.textContent = txt;
    };
    requestAnimationFrame(step);
  });
  const confetti = safe(() => {
    const L = fxLayer();
    const W = innerWidth;
    const palette = cssList('--fx-confetti', GSAP);
    for (let i = 0; i < 70; i++) {
      const c = document.createElement('i');
      c.className = 'fx-confetti';
      const col = palette[i % palette.length];
      const w = 6 + Math.random() * 6, h = w * (Math.random() < .5 ? .45 : 1);
      Object.assign(c.style, { left: `${W / 2}px`, top: `${innerHeight * .32}px`, width: `${w}px`, height: `${h}px`, background: col, borderRadius: Math.random() < .35 ? '50%' : '2px' });
      L.appendChild(c);
      const ang = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.25;
      const v = 160 + Math.random() * 260;
      const dx = Math.cos(ang) * v, dy = Math.sin(ang) * v;
      done(anim(c, [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: .45 },
        { transform: `translate(${dx * 1.25}px, ${dy + innerHeight * .55}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ], { duration: 1700 + Math.random() * 900, easing: 'cubic-bezier(.2, .7, .4, 1)', fill: 'forwards' }), c);
    }
  });
  const wireModal = safe((ov) => {
    if (ov.dataset.fxWired || off()) return;
    ov.dataset.fxWired = '1';
    const modal = ov.querySelector('.modal');
    anim(ov, [{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
    if (modal) anim(modal, [{ transform: 'translateY(60px)', opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: 720, easing: SPRING === BACK ? EXPO : SPRING });
    const title = modal?.querySelector('h3');
    if (title && /completada|complete/i.test(title.textContent)) {
      setTimeout(confetti, 180);
      modal.querySelectorAll('.kpi').forEach((k, i) => {
        anim(k, [{ opacity: 0, transform: 'translateY(16px) scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 200 + i * 80, easing: BACK, fill: 'backwards' });
        const v = k.querySelector('.kpi-val');
        if (v && !v.querySelector('input')) setTimeout(() => countUp(v), 220 + i * 80);
      });
      modal.querySelectorAll('.pr').forEach((p, i) => anim(p, [{ opacity: 0, transform: 'translateX(-14px)' }, { opacity: 1, transform: 'none' }], { duration: 640, delay: 520 + i * 90, easing: EXPO, fill: 'backwards' }));
    }
  });

  // --- 6. Observador único ---------------------------------------------------
  const scan = safe((node) => {
    if (!(node instanceof Element)) return;
    if (node.id === 'rest-timer') wireRest(node);
    if (node.classList.contains('modal-overlay')) wireModal(node);
  });
  const start = safe(() => {
    new MutationObserver((list) => {
      for (const m of list) for (const n of m.addedNodes) scan(n);
    }).observe(document.body, { childList: true });
    const rt = document.getElementById('rest-timer');
    if (rt) wireRest(rt);
    // tema → color de la barra de estado
    const meta = document.querySelector('meta[name="theme-color"]');
    const paint = () => meta?.setAttribute('content', cssVar('--k-canvas', dark() ? '#17181b' : '#f3f3f4'));
    paint();
    new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-fui-palette'] });
    onRoute();
  });
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
