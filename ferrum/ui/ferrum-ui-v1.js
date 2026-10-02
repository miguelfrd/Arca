/* Ferrum Atelier v1.0. Presentation only: no database, storage or domain imports. */
(() => {
  "use strict";
  const root = document.documentElement;
  if (root.dataset.fuiLoaded === "1") return;
  root.dataset.fuiLoaded = "1";
  root.dataset.ferrumUi = "atelier";
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const svg = (content, viewBox = "0 0 24 24") =>
    `<svg viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${content}</svg>`;
  const mark = svg('<path d="M7 4h10v4H7zM4 8h16v8H4zM7 16h10v4H7z"/>');
  const emptyIcon = svg('<rect x="4" y="5" width="16" height="15" rx="4"/><path d="M8 3v4m8-4v4M4 10h16m-11 5h6"/>');
  const art = svg('<g transform="rotate(-24 60 60)"><rect x="38" y="50" width="44" height="20" rx="5"/><rect x="24" y="31" width="14" height="58" rx="5"/><rect x="12" y="41" width="12" height="38" rx="4"/><rect x="82" y="31" width="14" height="58" rx="5"/><rect x="96" y="41" width="12" height="38" rx="4"/></g><circle cx="94" cy="15" r="3"/><path d="M18 102h12m-6-6v12"/>', "0 0 120 120");
  const descriptions = {
    train: "Tu espacio para entrenar, a tu ritmo.",
    routines: "Una buena sesión empieza con un plan.",
    yo: "Todo lo que construyes, en un solo lugar.",
    stats: "Cada sesión cuenta. Mira tu evolución.",
    exercises: "Encuentra tu próximo movimiento.",
    measures: "Tu progreso va más allá del peso.",
    more: "Haz que Ferrum se sienta tuyo."
  };
  const captions = {
    "#/stats": "Evolución, récords y actividad",
    "#/exercises": "Tu biblioteca de movimientos",
    "#/measures": "Medidas y fotos de progreso",
    "#/more": "Personaliza tu experiencia"
  };
  let queued = false;
  let currentRoute = "";
  let previousTab = 0;
  const tabOrder = { train: 0, routines: 1, yo: 2, stats: 2, exercises: 2, measures: 2, more: 2 };
  function route() {
    const path = (location.hash || "#/train").slice(1).split("?")[0];
    return path === "/train/active" ? "active" : (path.split("/")[1] || "train");
  }
  function create(className, html) {
    const element = document.createElement("div");
    element.className = className;
    if (html) element.innerHTML = html;
    return element;
  }
  function updateThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    const color = root.dataset.theme === "dark" ? "#141713" : "#f6f4ef";
    if (meta && meta.content !== color) meta.content = color;
  }
  function reconcile() {
    queued = false;
    const view = document.getElementById("view");
    if (!view) return;
    const section = route();
    root.dataset.fuiRoute = section;
    updateThemeColor();
    const head = view.querySelector(".screen-head, .am-head");
    if (head && !head.querySelector(".fui-brand")) {
      const brand = create("fui-brand", mark);
      const name = document.createElement("span");
      name.textContent = "FERRUM";
      brand.append(name);
      const date = document.createElement("span");
      date.className = "fui-date";
      date.textContent = new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric", month: "short" }).format(new Date());
      brand.append(date);
      head.prepend(brand);
      if (!head.querySelector("p") && descriptions[section]) {
        const subtitle = document.createElement("p");
        subtitle.textContent = descriptions[section];
        head.append(subtitle);
      }
    }
    const free = section === "train" && view.querySelector('[data-act="free"]');
    if (free && !free.closest(".fui-session-hero")) {
      const hero = create("fui-session-hero", `<div class="fui-hero-art" aria-hidden="true">${art}</div><div class="fui-hero-eyebrow">UN MOMENTO PARA TI</div><div class="fui-hero-title">Un paso más<br>fuerte.</div><p class="fui-hero-copy">Empieza una sesión libre.<br>El resto lo marcas tú.</p>`);
      free.before(hero);
      hero.append(free); // Existing button and its listeners are retained.
    }
    for (const empty of view.querySelectorAll(".empty:not(.small)")) {
      if (!empty.querySelector(".fui-empty-icon")) {
        empty.classList.add("fui-empty");
        const icon = create("fui-empty-icon", emptyIcon);
        icon.setAttribute("aria-hidden", "true");
        empty.prepend(icon);
      }
    }
    const cal = view.querySelector("#cal-home");
    if (cal) {
      const today = new Date();
      const month = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(today);
      const heading = cal.querySelector(".mcal-head strong")?.textContent.toLowerCase() || "";
      for (const day of cal.querySelectorAll(".mcal-day")) {
        const isToday = heading.includes(month) && heading.includes(String(today.getFullYear())) && day.textContent.trim() === String(today.getDate());
        day.classList.toggle("fui-today", isToday);
      }
    }
    for (const item of view.querySelectorAll(".yo-btn")) {
      const label = item.querySelector(".yo-label");
      if (!label || item.querySelector(".fui-yo-copy")) continue;
      const copy = create("fui-yo-copy");
      label.before(copy);
      copy.append(label);
      const caption = document.createElement("span");
      caption.className = "fui-yo-caption";
      caption.textContent = captions[item.getAttribute("href")] || "";
      copy.append(caption);
    }
    const nav = document.querySelector("nav.tabbar");
    if (nav) {
      for (const link of nav.querySelectorAll("a")) {
        if (!link.querySelector(".fui-nav-label")) {
          const label = document.createElement("span");
          label.className = "fui-nav-label";
          label.textContent = link.getAttribute("aria-label") || "";
          label.setAttribute("aria-hidden", "true");
          link.append(label);
        }
        if (link.classList.contains("active")) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      }
    }
    if (!motion.matches) {
      const cards = view.querySelectorAll(".card, .yo-btn, .fui-session-hero, .fui-empty");
      for (let index = 0; index < Math.min(cards.length, 8); index++) {
        const card = cards[index];
        if (card.dataset.fuiSeen) continue;
        card.dataset.fuiSeen = "1";
        card.style.setProperty("--fui-delay", `${Math.min(index * 28, 112)}ms`);
        card.classList.add("fui-reveal");
      }
    }
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(reconcile);
  }
  function trackRoute() {
    const next = route();
    const tab = tabOrder[next] ?? previousTab;
    if (next !== currentRoute) {
      root.style.setProperty("--fui-direction", tab < previousTab ? "-1" : "1");
      previousTab = tab;
      currentRoute = next;
    }
    schedule();
  }
  function start() {
    trackRoute();
    const app = document.getElementById("app");
    if (app) new MutationObserver(schedule).observe(app, { childList: true, subtree: true });
    new MutationObserver(updateThemeColor).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("hashchange", trackRoute);
    window.addEventListener("pageshow", schedule);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) schedule(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
