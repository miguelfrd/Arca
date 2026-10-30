// Ferrum · figura de estiramientos. Dibuja una postura como un pictograma
// SVG con el estilo de las ilustraciones de ejercicios (figura salmón sobre
// fondo oscuro, brazo y pierna lejanos más oscuros). Si la postura trae una
// segunda posición, la figura se mueve despacio entre las dos para enseñar
// el movimiento.
//
// Coordenadas en una caja de 100×100, suelo en y=90, figura de perfil.
// Postura:
//   head [x,y]           centro de la cabeza (radio 6.5)
//   sh   [x,y]           hombros (base del cuello)
//   hip  [x,y]           cadera
//   aN, aF [[codo],[mano]]          brazo cercano / lejano (salen de sh)
//   lN, lF [[rodilla],[pie],[punta]] pierna cercana / lejana (salen de hip);
//                                    la punta del pie es opcional
//   props [{t:'wall'|'box'|'mat', x, y, w, h}]  apoyos opcionales
// Medidas orientativas: cuello 11, torso 25, brazo 13+12, muslo 18, pierna 18.
(() => {
  const NEAR = 'var(--fx-fig, #f0a37c)';
  const FAR = 'var(--fx-fig-far, #a8664c)';
  const BG = 'var(--fx-fig-bg, #16171a)';
  const PROP = 'var(--fx-fig-prop, #3a3b40)';
  const W = { neck: 6, torso: 12, upper: 6.4, fore: 5.2, thigh: 8.6, shin: 6.8, foot: 4.6 };

  const seg = (a, b, w, color) => ({ a, b, w, color });
  function segments(p) {
    const out = [];
    const foot = (knee, f, toe) => toe || [f[0] + (f[0] >= knee[0] ? 4.5 : -4.5), f[1]];
    const leg = (l, color) => {
      if (!l) return;
      out.push(seg(p.hip, l[0], W.thigh, color), seg(l[0], l[1], W.shin, color), seg(l[1], foot(l[0], l[1], l[2]), W.foot, color));
    };
    const arm = (a, color) => { if (a) out.push(seg(p.sh, a[0], W.upper, color), seg(a[0], a[1], W.fore, color)); };
    leg(p.lF, FAR);
    arm(p.aF, FAR);
    out.push(seg(p.sh, p.hip, W.torso, NEAR), seg(p.sh, p.head, W.neck, NEAR));
    leg(p.lN, NEAR);
    arm(p.aN, NEAR);
    return out;
  }
  const f = (n) => Math.round(n * 10) / 10;
  const anim = (attr, a, b, dur) => `<animate attributeName="${attr}" values="${f(a)};${f(b)};${f(a)}" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/>`;

  function props(p) {
    return (p.props || []).map((q) => {
      if (q.t === 'wall') return `<rect x="${q.x}" y="6" width="${q.w || 5}" height="84" rx="1.5" fill="${PROP}"/>`;
      if (q.t === 'mat') return `<rect x="${q.x ?? 8}" y="89" width="${q.w ?? 84}" height="2.4" rx="1.2" fill="${PROP}"/>`;
      return `<rect x="${q.x}" y="${q.y}" width="${q.w}" height="${q.h}" rx="2" fill="${PROP}"/>`;
    }).join('');
  }

  // pose: postura principal; pose2: segunda posición (opcional, misma forma)
  function svg(pose, pose2, opts = {}) {
    const dur = opts.dur || 5;
    const A = segments(pose), B = pose2 ? segments(pose2) : null;
    let body = '';
    A.forEach((s, i) => {
      const t = B?.[i];
      const moving = t && (t.a[0] !== s.a[0] || t.a[1] !== s.a[1] || t.b[0] !== s.b[0] || t.b[1] !== s.b[1]);
      body += `<line x1="${f(s.a[0])}" y1="${f(s.a[1])}" x2="${f(s.b[0])}" y2="${f(s.b[1])}" stroke="${s.color}" stroke-width="${s.w}" stroke-linecap="round">`
        + (moving ? anim('x1', s.a[0], t.a[0], dur) + anim('y1', s.a[1], t.a[1], dur) + anim('x2', s.b[0], t.b[0], dur) + anim('y2', s.b[1], t.b[1], dur) : '')
        + '</line>';
    });
    const h2 = pose2?.head;
    const moveHead = h2 && (h2[0] !== pose.head[0] || h2[1] !== pose.head[1]);
    body += `<circle cx="${f(pose.head[0])}" cy="${f(pose.head[1])}" r="6.6" fill="${NEAR}">`
      + (moveHead ? anim('cx', pose.head[0], h2[0], dur) + anim('cy', pose.head[1], h2[1], dur) : '') + '</circle>';
    const floor = pose.noFloor ? '' : `<line x1="6" y1="91.5" x2="94" y2="91.5" stroke="${PROP}" stroke-width="1.2" stroke-linecap="round"/>`;
    const flip = pose.flip ? ' transform="translate(100 0) scale(-1 1)"' : '';
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">`
      + `<rect width="100" height="100" rx="16" fill="${BG}"/>${floor}<g${flip}>${props(pose)}${body}</g></svg>`;
  }

  window.__ferrumStretchFigure = { svg };
})();
