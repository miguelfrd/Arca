import{e as o,t as l,c as $}from"./index-ghZyYm5z.js";import{b as C}from"./stats-CJKsKY2L.js";import{loadFeed as P,getSocialConfig as A,incomingRequests as q,getBlobUrl as D,checkAccess as E,saveSocialConfig as T,publishProfile as R,clearSocialConfig as I,listProfiles as U,myFriendIds as j,outgoingRequestIds as F,acceptRequest as k,sendRequest as G,cancelRequest as z,declineRequest as M,removeFriend as K}from"./social-BpVr9vDk.js";import"./types-CEDv8i23.js";let b="people",p=null,L=0;const y=[];function H(){for(;y.length;){const e=y.pop();try{URL.revokeObjectURL(e)}catch{}}}async function m(e){const t=A();if(!t){B(e);return}e.innerHTML=`<div class="screen">
    <div class="fr-head">
      <h2>Amigos</h2>
      <button class="linklike small" id="fr-settings" type="button">Mi acceso</button>
    </div>
    <div class="fr-tabs" role="tablist">
      <button type="button" data-t="people" class="${b==="people"?"on":""}">Personas</button>
      <button type="button" data-t="requests" id="fr-req-tab" class="${b==="requests"?"on":""}">Solicitudes</button>
    </div>
    <div id="fr-body"><div class="muted" style="padding:24px;text-align:center">Cargando…</div></div>
  </div>`,e.querySelector("#fr-settings")?.addEventListener("click",()=>O(e,t)),e.querySelectorAll(".fr-tabs button").forEach(a=>{a.addEventListener("click",()=>{b=a.dataset.t,m(e)})});const n=e.querySelector("#fr-body");try{b==="people"?await N(n,t):await w(n,t),await h()}catch(a){n.innerHTML=`<div class="fr-error">No se pudo cargar.<br><span class="muted small">${o(a.message??"")}</span><br><button class="btn small" id="fr-retry" type="button" style="margin-top:10px">Reintentar</button></div>`,n.querySelector("#fr-retry")?.addEventListener("click",()=>void m(e))}}function B(e){e.innerHTML=`<div class="screen">
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
  </div>`;const t=e.querySelector("#fr-setup-err");e.querySelector("#fr-connect")?.addEventListener("click",async()=>{const n=e.querySelector("#fr-name").value.trim(),a=e.querySelector("#fr-token").value.trim(),s=e.querySelector("#fr-repo").value.trim();if(t.textContent="",!n){t.textContent="Pon tu nombre.";return}if(!a){t.textContent="Pega el token.";return}if(!/^[^/]+\/[^/]+$/.test(s)){t.textContent='El repo tiene que ser "propietario/nombre".';return}const r=e.querySelector("#fr-connect");r.setAttribute("disabled",""),r.textContent="Comprobando…";try{const i={token:a,userId:crypto.randomUUID(),userName:n,repo:s};await E(i),T(i),await R(i),l("Conectado"),await m(e)}catch(i){const c=i.status;t.textContent=c===401||c===403?"El token no es válido o no tiene acceso al repo.":c===404?"Ese repo no existe o el token no puede verlo.":"Sin conexión o error de GitHub. Prueba de nuevo.",r.removeAttribute("disabled"),r.textContent="Conectar"}})}function O(e,t){e.innerHTML=`<div class="screen">
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
  </div>`;const n=e.querySelector("#fr-err");e.querySelector("#fr-back")?.addEventListener("click",()=>void m(e)),e.querySelector("#fr-disconnect")?.addEventListener("click",async()=>{await $("¿Desconectar Amigos en este móvil?")&&(I(),H(),p=null,await m(e))}),e.querySelector("#fr-save")?.addEventListener("click",async()=>{const a=e.querySelector("#fr-name").value.trim(),s=e.querySelector("#fr-token").value.trim(),r=e.querySelector("#fr-repo").value.trim();if(n.textContent="",!a||!s||!/^[^/]+\/[^/]+$/.test(r)){n.textContent="Revisa los tres campos.";return}const i={...t,userName:a,token:s,repo:r};try{await E(i),T(i),await R(i),l("Guardado"),await m(e)}catch{n.textContent="El token no accede a ese repo."}})}async function _(e,t,n={}){(!p||Date.now()-L>300*1e3)&&(H(),e.innerHTML='<div class="muted" style="padding:16px;text-align:center">Cargando…</div>',p=await P(t),L=Date.now());const a=p.slice(0,n.limit??30);if(!a.length){e.innerHTML=`<div class="fr-empty">
      <p><strong>Nada por aquí todavía.</strong></p>
      <p class="muted small">Cuando tus amigos terminen un entreno, aparecerá aquí.<br>
      Añade amigos en la pestaña <strong>Amigos → Personas</strong>.</p>
    </div>`;return}e.innerHTML=a.map(W).join(""),V(e,t)}function V(e,t){const n=new IntersectionObserver(a=>{for(const s of a){if(!s.isIntersecting)continue;const r=s.target;n.unobserve(r),(async()=>{const i=await D(t,r.dataset.photo);i?(y.push(i),r.isConnected?r.innerHTML=`<img src="${i}" alt="Foto del entreno" loading="lazy">`:(URL.revokeObjectURL(i),y.pop())):r.remove()})()}},{rootMargin:"200px"});e.querySelectorAll(".feed-photo[data-photo]").forEach(a=>n.observe(a))}function W(e){const t=e.workout,n=e.profile?.name??t.userName,a=new Date(t.startTime),s=a.toLocaleDateString("es-ES",{weekday:"short",day:"numeric",month:"short"}),r=a.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),i=t.exercises.map(c=>`${o(c.name)} <span class="num">${c.sets}×${c.topKg>0?` · ${C(c.topKg)}`:""}</span>`).join(" · ");return`<article class="feed-card">
    <header>
      ${S(n,e.profile?.id??t.userId)}
      <div>
        <div class="feed-name">${o(n)}</div>
        <div class="muted small">${o(t.title)}</div>
      </div>
      ${t.satisfaction!=null?`<span class="feed-sat" title="Satisfacción"><span class="num">${t.satisfaction}</span>/5</span>`:""}
    </header>
    ${t.hasPhoto?`<div class="feed-photo" data-photo="feed/${o(t.userId)}/${o(t.fileBase)}.jpg"></div>`:""}
    ${t.description?`<p class="feed-desc">${o(t.description)}</p>`:""}
    <div class="feed-meta small muted"><span class="num">${o(s)} · ${o(r)}</span> · <strong class="num">${t.durationMin} min</strong></div>
    <div class="feed-kpis">
      <span><strong class="num">${C(t.volumeKg)}</strong> vol.</span>
      <span><strong class="num">${t.sets}</strong> series</span>
      ${t.fatigue!=null?`<span>Cansancio <strong class="num">${t.fatigue}/5</strong></span>`:""}
    </div>
    <div class="feed-ex small">${i}</div>
  </article>`}async function N(e,t){const[n,a,s,r]=await Promise.all([U(t),j(t),q(t),F(t)]),i=new Set(s.map(d=>d.from)),c=n.filter(d=>d.id!==t.userId);if(!c.length){e.innerHTML=`<div class="fr-empty"><p class="muted">Aún no hay nadie más en el círculo.<br>
    Cuando alguien conecte la app con el mismo token, aparecerá aquí.</p></div>`;return}e.innerHTML=c.map(d=>J(d,a,i,r)).join(""),e.querySelectorAll("[data-act]").forEach(d=>{d.addEventListener("click",async()=>{const f=d.dataset.act,u=d.dataset.uid,x=d;x.setAttribute("disabled","");try{if(f==="add")i.has(u)?await k(t,u):await G(t,u),l(i.has(u)?"Amistad creada":"Solicitud enviada");else if(f==="cancel")await z(t,u),l("Solicitud cancelada");else if(f==="accept")await k(t,u),l("Amistad creada");else if(f==="decline"){const v=s.find(g=>g.from===u);if(v&&!await $(`¿Rechazar la solicitud de ${v.fromName}?`))return;await M(t,u),l("Solicitud rechazada")}else if(f==="unfriend"){const v=c.find(g=>g.id===u);if(!await $(`¿Dejar de ver los entrenos de ${v?.name??"esta persona"}?`))return;await K(t,u),l("Eliminado de tus amigos")}p=null,await N(e,t),await h()}catch{l("No se pudo completar la acción"),x.removeAttribute("disabled")}})})}function J(e,t,n,a){let s;return t.has(e.id)?s=`<button class="btn xs ok" data-act="unfriend" data-uid="${o(e.id)}" type="button">Amigos</button>`:n.has(e.id)?s=`<span class="fr-duo"><button class="btn xs" data-act="accept" data-uid="${o(e.id)}" type="button">Aceptar</button><button class="btn xs ghost" data-act="decline" data-uid="${o(e.id)}" type="button">No</button></span>`:a.has(e.id)?s=`<button class="btn xs ghost" data-act="cancel" data-uid="${o(e.id)}" type="button">Enviada</button>`:s=`<button class="btn xs" data-act="add" data-uid="${o(e.id)}" type="button">Añadir</button>`,`<div class="person-row">
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
    </div>`).join(""),e.querySelectorAll("[data-acc]").forEach(a=>a.addEventListener("click",async()=>{try{await k(t,a.dataset.acc),l("Amistad creada"),p=null,await w(e,t),await h()}catch{l("No se pudo aceptar")}})),e.querySelectorAll("[data-dec]").forEach(a=>a.addEventListener("click",async()=>{try{await M(t,a.dataset.dec),await w(e,t),await h()}catch{l("No se pudo rechazar")}}))}function S(e,t){let n=0;for(let r=0;r<t.length;r++)n=n*31+t.charCodeAt(r)>>>0;const a=n%360,s=(e.trim()[0]??"?").toUpperCase();return`<span class="avatar" style="background:hsl(${a},45%,42%)" aria-hidden="true">${o(s)}</span>`}function h(){const e=A();e&&(async()=>{try{const t=await q(e),n=document.querySelector('nav.tabbar a[href="#/friends"]');if(!n)return;let a=n.querySelector(".tabdot");t.length&&!a?(a=document.createElement("span"),a.className="tabdot",n.appendChild(a)):!t.length&&a&&a.remove();const s=document.querySelector("#fr-req-tab");s&&(s.textContent=`Solicitudes${t.length?` (${t.length})`:""}`)}catch{}})()}export{_ as renderFeedList,m as renderFriends,h as updateFriendsBadge};
