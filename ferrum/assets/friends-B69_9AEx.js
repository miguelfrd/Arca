import{e as o,t as d,c as $}from"./index-Dm-Kw1PY.js";import{b as C}from"./stats-CJKsKY2L.js";import{getSocialConfig as L,incomingRequests as q,checkAccess as E,saveSocialConfig as M,publishProfile as T,clearSocialConfig as D,loadFeed as I,getBlobUrl as U,listProfiles as j,myFriendIds as F,outgoingRequestIds as z,acceptRequest as k,sendRequest as G,cancelRequest as K,declineRequest as R,removeFriend as B}from"./social-CiSbvSqf.js";import"./types-CEDv8i23.js";let p="feed",m=null,A=0;const h=[];function H(){for(;h.length;){const e=h.pop();try{URL.revokeObjectURL(e)}catch{}}}async function f(e){const t=L();if(!t){O(e);return}e.innerHTML=`<div class="screen">
    <div class="fr-head">
      <h2>Amigos</h2>
      <button class="linklike small" id="fr-settings" type="button">Mi acceso</button>
    </div>
    <div class="fr-tabs" role="tablist">
      <button type="button" data-t="feed" class="${p==="feed"?"on":""}">Entrenos</button>
      <button type="button" data-t="people" class="${p==="people"?"on":""}">Personas</button>
      <button type="button" data-t="requests" id="fr-req-tab" class="${p==="requests"?"on":""}">Solicitudes</button>
    </div>
    <div id="fr-body"><div class="muted" style="padding:24px;text-align:center">Cargando…</div></div>
  </div>`,e.querySelector("#fr-settings")?.addEventListener("click",()=>V(e,t)),e.querySelectorAll(".fr-tabs button").forEach(a=>{a.addEventListener("click",()=>{p=a.dataset.t,f(e)})});const n=e.querySelector("#fr-body");try{p==="feed"?await N(n,t,!1):p==="people"?await P(n,t):await w(n,t),await y()}catch(a){n.innerHTML=`<div class="fr-error">No se pudo cargar.<br><span class="muted small">${o(a.message??"")}</span><br><button class="btn small" id="fr-retry" type="button" style="margin-top:10px">Reintentar</button></div>`,n.querySelector("#fr-retry")?.addEventListener("click",()=>void f(e))}}function O(e){e.innerHTML=`<div class="screen">
    <h2>Amigos</h2>
    <p class="muted">Comparte tus entrenos con tu círculo. Sin servidores: los datos
    viven en un <strong>repo privado de GitHub</strong> al que solo accede quien tenga el token.</p>
    <div class="fr-setup">
      <label>Tu nombre
        <input id="fr-name" type="text" autocomplete="off" maxlength="40" placeholder="Cómo te verán los demás">
      </label>
      <label>Token de acceso
        <input id="fr-token" type="password" autocomplete="off" spellcheck="false" placeholder="Pégalo aquí">
      </label>
      <label>Repo <span class="muted small">(privado)</span>
        <input id="fr-repo" type="text" autocomplete="off" spellcheck="false" value="miguelfrd/ferrum-feed">
      </label>
      <button class="btn" id="fr-connect" type="button">Conectar</button>
      <p class="muted small" id="fr-setup-err"></p>
      <p class="muted small">El token lo crea el dueño del repo (Ajustes de GitHub → Developer
      settings → Personal access tokens → Fine-grained, con permiso de <em>Contents</em>
      solo sobre ese repo) y se comparte por WhatsApp. Guárdalo: no se muestra de nuevo.</p>
    </div>
  </div>`;const t=e.querySelector("#fr-setup-err");e.querySelector("#fr-connect")?.addEventListener("click",async()=>{const n=e.querySelector("#fr-name").value.trim(),a=e.querySelector("#fr-token").value.trim(),s=e.querySelector("#fr-repo").value.trim();if(t.textContent="",!n){t.textContent="Pon tu nombre.";return}if(!a){t.textContent="Pega el token.";return}if(!/^[^/]+\/[^/]+$/.test(s)){t.textContent='El repo tiene que ser "propietario/nombre".';return}const r=e.querySelector("#fr-connect");r.setAttribute("disabled",""),r.textContent="Comprobando…";try{const i={token:a,userId:crypto.randomUUID(),userName:n,repo:s};await E(i),M(i),await T(i),d("Conectado"),p="people",await f(e)}catch(i){const c=i.status;t.textContent=c===401||c===403?"El token no es válido o no tiene acceso al repo.":c===404?"Ese repo no existe o el token no puede verlo.":"Sin conexión o error de GitHub. Prueba de nuevo.",r.removeAttribute("disabled"),r.textContent="Conectar"}})}function V(e,t){e.innerHTML=`<div class="screen">
    <h2>Mi acceso</h2>
    <div class="fr-setup">
      <label>Tu nombre
        <input id="fr-name" type="text" maxlength="40" value="${o(t.userName)}">
      </label>
      <label>Token de acceso
        <input id="fr-token" type="password" autocomplete="off" spellcheck="false" value="${o(t.token)}">
      </label>
      <label>Repo <span class="muted small">(privado)</span>
        <input id="fr-repo" type="text" autocomplete="off" spellcheck="false" value="${o(t.repo)}">
      </label>
      <button class="btn" id="fr-save" type="button">Guardar</button>
      <button class="btn danger" id="fr-disconnect" type="button">Desconectar</button>
      <button class="linklike" id="fr-back" type="button">Volver</button>
      <p class="muted small" id="fr-err"></p>
      <p class="muted small">Desconectar borra el token de este móvil. Tus entrenos ya
      compartidos siguen en el repo.</p>
    </div>
  </div>`;const n=e.querySelector("#fr-err");e.querySelector("#fr-back")?.addEventListener("click",()=>void f(e)),e.querySelector("#fr-disconnect")?.addEventListener("click",async()=>{await $("¿Desconectar Amigos en este móvil?")&&(D(),H(),m=null,await f(e))}),e.querySelector("#fr-save")?.addEventListener("click",async()=>{const a=e.querySelector("#fr-name").value.trim(),s=e.querySelector("#fr-token").value.trim(),r=e.querySelector("#fr-repo").value.trim();if(n.textContent="",!a||!s||!/^[^/]+\/[^/]+$/.test(r)){n.textContent="Revisa los tres campos.";return}const i={...t,userName:a,token:s,repo:r};try{await E(i),M(i),await T(i),d("Guardado"),await f(e)}catch{n.textContent="El token no accede a ese repo."}})}async function N(e,t,n){(!m||n||Date.now()-A>300*1e3)&&(H(),e.innerHTML='<div class="muted" style="padding:24px;text-align:center">Cargando…</div>',m=await I(t),A=Date.now());const a=m;if(!a.length){e.innerHTML=`<div class="fr-empty">
      <p><strong>Nada por aquí todavía.</strong></p>
      <p class="muted small">Cuando tus amigos terminen un entreno, aparecerá aquí.<br>
      Añade amigos en la pestaña <strong>Personas</strong>.</p>
    </div>`;return}e.innerHTML='<div class="fr-refresh"><button class="linklike small" id="fr-upd" type="button">Actualizar</button></div>'+a.map(W).join(""),e.querySelector("#fr-upd")?.addEventListener("click",async()=>{await N(e,t,!0)});const s=new IntersectionObserver(r=>{for(const i of r){if(!i.isIntersecting)continue;const c=i.target;s.unobserve(c),(async()=>{const l=await U(t,c.dataset.photo);l?(h.push(l),c.isConnected?c.innerHTML=`<img src="${l}" alt="Foto del entreno" loading="lazy">`:(URL.revokeObjectURL(l),h.pop())):c.remove()})()}},{rootMargin:"200px"});e.querySelectorAll(".feed-photo[data-photo]").forEach(r=>s.observe(r))}function W(e){const t=e.workout,n=e.profile?.name??t.userName,a=t.exercises.map(s=>`${o(s.name)} <span class="num">${s.sets}×${s.topKg>0?` · ${C(s.topKg)}`:""}</span>`).join(" · ");return`<article class="feed-card">
    <header>
      ${S(n,e.profile?.id??t.userId)}
      <div>
        <div class="feed-name">${o(n)}</div>
        <div class="muted small">${o(Q(t.startTime))} · ${o(t.title)}</div>
      </div>
    </header>
    ${t.description?`<p class="feed-desc">${o(t.description)}</p>`:""}
    <div class="feed-kpis">
      <span><strong class="num">${t.durationMin}</strong> min</span>
      <span><strong class="num">${C(t.volumeKg)}</strong> vol.</span>
      <span><strong class="num">${t.sets}</strong> series</span>
    </div>
    <div class="feed-ex small">${a}</div>
    ${t.fatigue!=null||t.satisfaction!=null?`<div class="feed-feel small">${t.fatigue!=null?`Cansancio <strong class="num">${t.fatigue}/5</strong>`:""}${t.fatigue!=null&&t.satisfaction!=null?" · ":""}${t.satisfaction!=null?`Satisfacción <strong class="num">${t.satisfaction}/5</strong>`:""}</div>`:""}
    ${t.hasPhoto?`<div class="feed-photo" data-photo="feed/${o(t.userId)}/${o(t.fileBase)}.jpg"></div>`:""}
  </article>`}async function P(e,t){const[n,a,s,r]=await Promise.all([j(t),F(t),q(t),z(t)]),i=new Set(s.map(l=>l.from)),c=n.filter(l=>l.id!==t.userId);if(!c.length){e.innerHTML=`<div class="fr-empty"><p class="muted">Aún no hay nadie más en el círculo.<br>
    Cuando alguien conecte la app con el mismo token, aparecerá aquí.</p></div>`;return}e.innerHTML=c.map(l=>J(l,a,i,r)).join(""),e.querySelectorAll("[data-act]").forEach(l=>{l.addEventListener("click",async()=>{const v=l.dataset.act,u=l.dataset.uid,x=l;x.setAttribute("disabled","");try{if(v==="add")i.has(u)?await k(t,u):await G(t,u),d(i.has(u)?"Amistad creada":"Solicitud enviada");else if(v==="cancel")await K(t,u),d("Solicitud cancelada");else if(v==="accept")await k(t,u),d("Amistad creada");else if(v==="decline"){const b=s.find(g=>g.from===u);if(b&&!await $(`¿Rechazar la solicitud de ${b.fromName}?`))return;await R(t,u),d("Solicitud rechazada")}else if(v==="unfriend"){const b=c.find(g=>g.id===u);if(!await $(`¿Dejar de ver los entrenos de ${b?.name??"esta persona"}?`))return;await B(t,u),d("Eliminado de tus amigos")}m=null,await P(e,t),await y()}catch{d("No se pudo completar la acción"),x.removeAttribute("disabled")}})})}function J(e,t,n,a){let s;return t.has(e.id)?s=`<button class="btn xs ok" data-act="unfriend" data-uid="${o(e.id)}" type="button">Amigos</button>`:n.has(e.id)?s=`<span class="fr-duo"><button class="btn xs" data-act="accept" data-uid="${o(e.id)}" type="button">Aceptar</button><button class="btn xs ghost" data-act="decline" data-uid="${o(e.id)}" type="button">No</button></span>`:a.has(e.id)?s=`<button class="btn xs ghost" data-act="cancel" data-uid="${o(e.id)}" type="button">Enviada</button>`:s=`<button class="btn xs" data-act="add" data-uid="${o(e.id)}" type="button">Añadir</button>`,`<div class="person-row">
    ${S(e.name,e.id)}
    <div class="person-name">${o(e.name)}</div>
    ${s}
  </div>`}async function w(e,t){const n=await q(t);if(!n.length){e.innerHTML='<div class="fr-empty"><p class="muted">Sin solicitudes pendientes.</p></div>';return}e.innerHTML=n.map(a=>`<div class="person-row">
      ${S(a.fromName,a.from)}
      <div class="person-name">${o(a.fromName)}<div class="muted small">quiere ser tu amigo</div></div>
      <span class="fr-duo">
        <button class="btn xs" data-acc="${o(a.from)}" type="button">Aceptar</button>
        <button class="btn xs ghost" data-dec="${o(a.from)}" type="button">Rechazar</button>
      </span>
    </div>`).join(""),e.querySelectorAll("[data-acc]").forEach(a=>a.addEventListener("click",async()=>{try{await k(t,a.dataset.acc),d("Amistad creada"),m=null,await w(e,t),await y()}catch{d("No se pudo aceptar")}})),e.querySelectorAll("[data-dec]").forEach(a=>a.addEventListener("click",async()=>{try{await R(t,a.dataset.dec),await w(e,t),await y()}catch{d("No se pudo rechazar")}}))}function S(e,t){let n=0;for(let r=0;r<t.length;r++)n=n*31+t.charCodeAt(r)>>>0;const a=n%360,s=(e.trim()[0]??"?").toUpperCase();return`<span class="avatar" style="background:hsl(${a},45%,42%)" aria-hidden="true">${o(s)}</span>`}function Q(e){const t=Math.max(1,Math.round((Date.now()-e)/1e3));if(t<60)return"ahora mismo";const n=Math.round(t/60);if(n<60)return`hace ${n} min`;const a=Math.round(n/60);if(a<24)return`hace ${a} h`;const s=Math.round(a/24);return s<7?`hace ${s} ${s===1?"día":"días"}`:new Date(e).toLocaleDateString("es-ES",{day:"numeric",month:"short"})}function y(){const e=L();e&&(async()=>{try{const t=await q(e),n=document.querySelector('nav.tabbar a[href="#/friends"]');if(!n)return;let a=n.querySelector(".tabdot");t.length&&!a?(a=document.createElement("span"),a.className="tabdot",n.appendChild(a)):!t.length&&a&&a.remove();const s=document.querySelector("#fr-req-tab");s&&(s.textContent=`Solicitudes${t.length?` (${t.length})`:""}`)}catch{}})()}export{f as renderFriends,y as updateFriendsBadge};
