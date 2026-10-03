import{d as v,e as i,g as u,t as b,b as k,a as L,p as B,f as j,c as q,h as C}from"./index-D-amyAZ-.js";import{M as h,E as M,a as $,u as T}from"./types-CEDv8i23.js";const w=n=>n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),S=(n,t)=>n.img?`<img class="${t}" src="./${n.img}" alt="" loading="lazy" />`:`<span class="${t} none"></span>`;async function N(n,t){const e=t.get("id");if(e==="new"||e){z(n,e==="new"?null:e);return}const a=t.get("detail");if(a){D(n,a);return}const r=await v.all("exercises");let d="",m="",p="",o=!1;const E=()=>r.filter(s=>(!o||s.isCustom)&&(!m||s.primaryMuscle===m||s.secondaryMuscles.includes(m))&&(!p||s.equipment===p)&&(!d||w(s.nameEs).includes(w(d)))).sort((s,c)=>s.nameEs.localeCompare(c.nameEs,"es")),y=s=>`
      ${s.slice(0,120).map(c=>`
        <button class="ex-item" data-detail="${c.id}">
          ${S(c,"ex-thumb")}
          <span><span class="nm">${i(c.nameEs)}${c.isCustom?' <span class="muted">✎</span>':""}</span><br>
          <span class="meta">${i(c.primaryMuscle)} · ${i(c.equipment)}</span></span>
          <span class="tag">${i($[c.type])}</span>
        </button>`).join("")||'<div class="empty">Sin resultados.</div>'}
      ${s.length>120?`<div class="muted small" style="text-align:center">…y ${s.length-120} más (afina la búsqueda)</div>`:""}`,l=()=>{const s=E(),c=document.getElementById("ex-count");c&&(c.textContent=`${s.length} ejercicios`);const x=document.getElementById("ex-list");x&&(x.innerHTML=y(s),x.querySelectorAll("[data-detail]").forEach(f=>f.addEventListener("click",()=>u(`/exercises?detail=${f.dataset.detail}`))))};n.innerHTML=`
    <div class="screen-head"><h1>Ejercicios</h1></div><div class="row">
      <input type="text" id="ex-q" placeholder="Buscar ejercicio…" value="${i(d)}" autocomplete="off" />
      <button class="btn small" id="ex-new" style="flex:0 0 auto">＋</button>
    </div>
    <div class="row">
      <select id="ex-muscle" style="flex:1;min-width:0" aria-label="Filtrar por músculo">
        <option value="">Todos los músculos</option>
        ${h.map(s=>`<option ${m===s?"selected":""}>${s}</option>`).join("")}
      </select>
      <select id="ex-equip" style="flex:1;min-width:0" aria-label="Filtrar por material">
        <option value="">Todo el material</option>
        ${M.map(s=>`<option ${p===s?"selected":""}>${s}</option>`).join("")}
      </select>
    </div>
    <div class="row" style="align-items:center;margin-top:8px">
      <label class="small muted" style="display:flex;gap:6px;align-items:center;white-space:nowrap">
        <input type="checkbox" id="ex-custom" ${o?"checked":""} /> Míos
      </label>
    </div>
    <div class="sec-title" id="ex-count"></div>
    <div id="ex-list"></div>`;const g=document.getElementById("ex-q");g.addEventListener("input",()=>{d=g.value,l()}),document.getElementById("ex-new")?.addEventListener("click",()=>u("/exercises?id=new")),document.getElementById("ex-muscle")?.addEventListener("change",s=>{m=s.target.value,l()}),document.getElementById("ex-equip")?.addEventListener("change",s=>{p=s.target.value,l()}),document.getElementById("ex-custom")?.addEventListener("change",s=>{o=s.target.checked,l()}),l()}async function D(n,t){const e=await v.get("exercises",t);if(!e){u("/exercises");return}const a=await v.workoutsDesc(50),r=[];for(const o of[...a].reverse()){const E=o.exercises.find(l=>l.exerciseId===t);if(!E)continue;const y=E.sets.filter(l=>l.done&&l.setType!=="warmup").reduce((l,g)=>l+(g.weightKg??0)*(g.reps??0),0);y>0&&r.push({date:o.startTime,vol:y})}const d=r[r.length-1],m=await k(t),p=await L();n.innerHTML=`
    <button class="linklike" id="d-back">← Ejercicios</button>
    <div class="sec-title">${i(e.equipment)} · ${i($[e.type])}</div>
    <h2 style="margin:0 0 4px">${i(e.nameEs)}${e.isCustom?' <span class="muted small">✎ personalizado</span>':""}</h2>
    ${e.img?`<img class="ex-hero" src="./${e.img}" alt="${i(e.nameEs)}" />`:""}
    <div class="chips">
      <span class="chip on">${i(e.primaryMuscle)}</span>
      ${e.secondaryMuscles.map(o=>`<span class="chip">${i(o)}</span>`).join("")}
    </div>
    <div class="card"><h3>Cómo hacerlo</h3><p style="margin:0">${i(e.instructionsEs)}</p></div>
    ${e.img||e.media?"":'<div class="card muted small">Ilustración pendiente para este ejercicio.</div>'}
    <div class="card">
      <h3>Descanso por defecto</h3>
      <div class="muted small" style="margin-bottom:6px">Se usa al añadirlo a una sesión (global: ${p.defaultRestSeconds} s).</div>
      <div class="row" style="align-items:end">
        <div><label class="f">Segundos (vacío = global)</label><input type="text" id="d-rest" value="${m??""}" placeholder="${p.defaultRestSeconds}" inputmode="numeric" /></div>
        <div><button class="btn secondary" id="d-rest-save">Guardar</button></div>
      </div>
    </div>
    <div class="card">
      <h3>Tu historial</h3>
      ${r.length?`<div class="small">Última sesión: <strong class="num">${d.vol.toFixed(0)} kg</strong> · ${new Date(d.date).toLocaleDateString("es-ES")}</div>
           <div class="small muted">${r.length} sesiones registradas</div>`:'<div class="muted small">Aún no lo has registrado.</div>'}
    </div>
    ${e.isCustom?`<div class="row">
      <button class="btn secondary" id="d-edit">Editar</button>
      <button class="btn danger" id="d-del">Eliminar</button>
    </div>`:'<div class="row"><button class="btn danger" id="d-del">Eliminar de mi biblioteca</button></div>'}`,document.getElementById("d-back")?.addEventListener("click",()=>u("/exercises")),document.getElementById("d-edit")?.addEventListener("click",()=>u(`/exercises?id=${t}`)),document.getElementById("d-rest-save")?.addEventListener("click",async()=>{const o=B(document.getElementById("d-rest").value);await j(t,o===null?null:Math.max(0,Math.round(o))),b("Descanso guardado")}),document.getElementById("d-del")?.addEventListener("click",async()=>{await q(e.isCustom?"¿Eliminar este ejercicio personalizado?":"¿Eliminar este ejercicio de tu biblioteca? No volverá a aparecer en actualizaciones.")&&(e.isCustom||await C(t),await v.del("exercises",t),b("Ejercicio eliminado"),u("/exercises"))})}async function z(n,t){const e=t?await v.get("exercises",t)??I():I();n.innerHTML=`
    <button class="linklike" id="e-back">← Volver</button>
    <div class="sec-title">${t?"Editar ejercicio":"Nuevo ejercicio personalizado"}</div>
    <div class="card">
      <label class="f">Nombre</label>
      <input type="text" id="e-name" value="${i(e.nameEs)}" placeholder="p. ej. Press inclinado con mancuernas" />
      <div class="row">
        <div><label class="f">Músculo principal</label>
          <select id="e-muscle">${h.map(a=>`<option ${e.primaryMuscle===a?"selected":""}>${a}</option>`).join("")}</select></div>
        <div><label class="f">Material</label>
          <select id="e-equip">${M.map(a=>`<option ${e.equipment===a?"selected":""}>${a}</option>`).join("")}</select></div>
      </div>
      <label class="f">Músculos secundarios (separados por comas)</label>
      <input type="text" id="e-sec" value="${i(e.secondaryMuscles.join(", "))}" placeholder="Hombro, Tríceps" />
      <label class="f">Tipo</label>
      <select id="e-type">${Object.keys($).map(a=>`<option value="${a}" ${e.type===a?"selected":""}>${$[a]}</option>`).join("")}</select>
      <label class="f">Instrucciones</label>
      <textarea id="e-inst" placeholder="Colocación, ejecución y claves técnicas…">${i(e.instructionsEs)}</textarea>
    </div>
    <button class="btn" id="e-save">Guardar</button>`,document.getElementById("e-back")?.addEventListener("click",()=>u("/exercises")),document.getElementById("e-save")?.addEventListener("click",async()=>{const a=document.getElementById("e-name").value.trim();if(!a){b("Ponle un nombre");return}const r=document.getElementById("e-sec").value.split(",").map(d=>d.trim()).filter(Boolean).filter(d=>h.includes(d));e.nameEs=a,e.primaryMuscle=document.getElementById("e-muscle").value,e.equipment=document.getElementById("e-equip").value,e.secondaryMuscles=r,e.type=document.getElementById("e-type").value,e.instructionsEs=document.getElementById("e-inst").value.trim(),e.isCustom=!0,e.media=null,e.img=e.img??null,await v.put("exercises",e),b("Ejercicio guardado"),u(`/exercises?detail=${e.id}`)})}function I(){return{id:T(),nameEs:"",primaryMuscle:"Pecho",secondaryMuscles:[],equipment:"Mancuerna",type:"weight_reps",instructionsEs:"",media:null,img:null,isCustom:!0}}export{N as renderExercises};
