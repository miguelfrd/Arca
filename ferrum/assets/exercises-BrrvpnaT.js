import{d as y,I as g,e as i,M as w,E as C,g as b,r as k,t as f,i as T,h as D,f as S,k as N,x as R,c as H,y as z,u as A,b as P}from"./index-BYZdti1q.js";const B=p=>p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");async function O(p,n){const e=n.get("id");if(e==="new"||e){_(p,e==="new"?null:e);return}const a=n.get("detail");if(a){F(p,a);return}const v=await y.all("exercises");let c="",d="",o="",l=!1;const $=()=>v.filter(s=>(!l||s.isCustom)&&(!d||s.primaryMuscle===d||s.secondaryMuscles.includes(d))&&(!o||s.equipment===o)&&(!c||B(s.nameEs).includes(B(c)))).sort((s,t)=>s.nameEs.localeCompare(t.nameEs,"es")),h=s=>`
      ${s.slice(0,120).map(t=>`
        <button class="pk-row ex-item" type="button" data-detail="${t.id}">
          ${P(t.img,52)}
          <span class="pk-t"><span class="nm">${i(S(t.nameEs))}${t.isCustom?' <span class="muted">✎</span>':""}</span>
          <span class="mt">${i(t.equipment)} · ${i(t.primaryMuscle)}</span></span>
          <span class="chev">${g.chevR}</span>
        </button>`).join("")||'<div class="empty">Sin resultados.</div>'}
      ${s.length>120?`<div class="muted small" style="text-align:center">…y ${s.length-120} más (afina la búsqueda)</div>`:""}`,r=()=>{const s=$(),t=document.getElementById("ex-count");t&&(t.textContent=`${s.length} ejercicios`);const u=document.getElementById("ex-list");u&&(u.innerHTML=h(s),u.querySelectorAll("[data-detail]").forEach(m=>m.addEventListener("click",()=>b(`/exercises?detail=${m.dataset.detail}`))))},E=(s,t,u,m)=>`<button type="button" class="chip${m?" on":""}" data-chip="${s}" data-v="${i(t)}" aria-pressed="${m}">${i(u)}</button>`;p.innerHTML=`
    <div class="screen-head head-act stats-head"><a class="nav-back" href="#/yo">${g.chevL}Yo</a><h1>Ejercicios</h1><button class="round dark" id="ex-new" type="button" aria-label="Nuevo ejercicio">${g.plus}</button></div>
    <label class="search"><span class="inl-ic" aria-hidden="true">${g.search}</span><input type="text" id="ex-q" placeholder="Buscar ejercicio" value="${i(c)}" autocomplete="off" /></label>
    <div class="chips" id="ex-chips" role="group" aria-label="Filtrar">
      ${E("all","","Todos",!0)}${E("mine","","Míos",!1)}
      ${w.map(s=>E("muscle",s,s,!1)).join("")}
      ${C.map(s=>E("equip",s,s,!1)).join("")}
    </div>
    <div class="lst-h num" id="ex-count"></div>
    <div class="group" id="ex-list"></div>`;const I=document.getElementById("ex-q");I.addEventListener("input",()=>{c=I.value,r()}),document.getElementById("ex-new")?.addEventListener("click",()=>b("/exercises?id=new"));const L=document.getElementById("ex-chips");L.addEventListener("click",s=>{const t=s.target.closest("[data-chip]");if(!t)return;const u=t.dataset.v??"";t.dataset.chip==="all"?(d="",o="",l=!1):t.dataset.chip==="mine"?l=!l:t.dataset.chip==="muscle"?d=d===u?"":u:o=o===u?"":u,L.querySelectorAll("[data-chip]").forEach(m=>{const x=m.dataset.chip,M=m.dataset.v??"",j=x==="all"?!d&&!o&&!l:x==="mine"?l:x==="muscle"?d===M:o===M;m.classList.toggle("on",j),m.setAttribute("aria-pressed",String(j))}),r()}),r()}async function F(p,n){const e=await y.get("exercises",n);if(!e){b("/exercises");return}const a=await y.workoutsDesc(50),v=[];for(const l of[...a].reverse()){const $=l.exercises.find(r=>r.exerciseId===n);if(!$)continue;const h=$.sets.filter(r=>r.done&&r.setType!=="warmup").reduce((r,E)=>r+(E.weightKg??0)*(E.reps??0),0);h>0&&v.push({date:l.startTime,vol:h})}const c=v[v.length-1],d=await T(n),o=await D();p.innerHTML=`
    <button class="linklike nav-back" id="d-back" type="button">${g.chevL}Ejercicios</button>
    ${e.img?`<div class="ex-hero-wrap"><img class="ex-hero" src="./${e.img}" alt="${i(e.nameEs)}" /></div>`:""}
    <h1 class="d-title">${i(S(e.nameEs))}${e.isCustom?' <span class="muted small">✎ personalizado</span>':""}</h1>
    <p class="d-sub">${i(e.equipment)} · ${[e.primaryMuscle,...e.secondaryMuscles].map(i).join(", ")} · ${i(k[e.type])}</p>
    <div class="sec-title">Cómo hacerlo</div>
    <p class="d-text">${i(e.instructionsEs)}</p>
    ${e.img||e.media?"":'<div class="card muted small">Ilustración pendiente para este ejercicio.</div>'}
    <div class="card">
      <h3>Descanso por defecto</h3>
      <div class="muted small" style="margin-bottom:6px">Se usa al añadirlo a una sesión (global: ${o.defaultRestSeconds} s).</div>
      <div class="row" style="align-items:end">
        <div><label class="f">Segundos (vacío = global)</label><input type="text" id="d-rest" value="${d??""}" placeholder="${o.defaultRestSeconds}" inputmode="numeric" /></div>
        <div><button class="btn secondary" id="d-rest-save">Guardar</button></div>
      </div>
    </div>
    <div class="card">
      <h3>Tu historial</h3>
      ${v.length?`<div class="small">Última sesión: <strong class="num">${c.vol.toFixed(0)} kg</strong> · ${new Date(c.date).toLocaleDateString("es-ES")}</div>
           <div class="small muted">${v.length} sesiones registradas</div>`:'<div class="muted small">Aún no lo has registrado.</div>'}
    </div>
    ${e.isCustom?`<div class="row">
      <button class="btn secondary" id="d-edit">Editar</button>
      <button class="btn danger" id="d-del">Eliminar</button>
    </div>`:'<div class="row"><button class="btn danger" id="d-del">Eliminar de mi biblioteca</button></div>'}`,document.getElementById("d-back")?.addEventListener("click",()=>b("/exercises")),document.getElementById("d-edit")?.addEventListener("click",()=>b(`/exercises?id=${n}`)),document.getElementById("d-rest-save")?.addEventListener("click",async()=>{const l=N(document.getElementById("d-rest").value);await R(n,l===null?null:Math.max(0,Math.round(l))),f("Descanso guardado")}),document.getElementById("d-del")?.addEventListener("click",async()=>{await H(e.isCustom?"¿Eliminar este ejercicio personalizado?":"¿Eliminar este ejercicio de tu biblioteca? No volverá a aparecer en actualizaciones.")&&(e.isCustom||await z(n),await y.del("exercises",n),f("Ejercicio eliminado"),b("/exercises"))})}async function _(p,n){const e=n?await y.get("exercises",n)??q():q();p.innerHTML=`
    <button class="linklike nav-back" id="e-back" type="button">${g.chevL}Volver</button>
    <div class="sec-title">${n?"Editar ejercicio":"Nuevo ejercicio personalizado"}</div>
    <div class="card">
      <label class="f">Nombre</label>
      <input type="text" id="e-name" value="${i(e.nameEs)}" placeholder="p. ej. Press inclinado con mancuernas" />
      <div class="row">
        <div><label class="f">Músculo principal</label>
          <select id="e-muscle">${w.map(a=>`<option ${e.primaryMuscle===a?"selected":""}>${a}</option>`).join("")}</select></div>
        <div><label class="f">Material</label>
          <select id="e-equip">${C.map(a=>`<option ${e.equipment===a?"selected":""}>${a}</option>`).join("")}</select></div>
      </div>
      <label class="f">Músculos secundarios (separados por comas)</label>
      <input type="text" id="e-sec" value="${i(e.secondaryMuscles.join(", "))}" placeholder="Hombro, Tríceps" />
      <label class="f">Tipo</label>
      <select id="e-type">${Object.keys(k).map(a=>`<option value="${a}" ${e.type===a?"selected":""}>${k[a]}</option>`).join("")}</select>
      <label class="f">Instrucciones</label>
      <textarea id="e-inst" placeholder="Colocación, ejecución y claves técnicas…">${i(e.instructionsEs)}</textarea>
    </div>
    <button class="btn" id="e-save">Guardar</button>`,document.getElementById("e-back")?.addEventListener("click",()=>b("/exercises")),document.getElementById("e-save")?.addEventListener("click",async()=>{const a=document.getElementById("e-name").value.trim();if(!a){f("Ponle un nombre");return}const v=document.getElementById("e-sec").value.split(",").map(c=>c.trim()).filter(Boolean).filter(c=>w.includes(c));e.nameEs=a,e.primaryMuscle=document.getElementById("e-muscle").value,e.equipment=document.getElementById("e-equip").value,e.secondaryMuscles=v,e.type=document.getElementById("e-type").value,e.instructionsEs=document.getElementById("e-inst").value.trim(),e.isCustom=!0,e.media=null,e.img=e.img??null,await y.put("exercises",e),f("Ejercicio guardado"),b(`/exercises?detail=${e.id}`)})}function q(){return{id:A(),nameEs:"",primaryMuscle:"Pecho",secondaryMuscles:[],equipment:"Mancuerna",type:"weight_reps",instructionsEs:"",media:null,img:null,isCustom:!0}}export{O as renderExercises};
