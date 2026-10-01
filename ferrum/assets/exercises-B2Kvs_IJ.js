import{d as E,e as i,g as m,t as g,b as w,c as k,p as M,j,i as I,a as L}from"./index-CAlgwbyX.js";import{M as $,E as h,a as b,u as B}from"./types-E-ayykTU.js";async function D(c,a){const s=a.get("id");if(s==="new"||s){C(c,s==="new"?null:s);return}const t=a.get("detail");if(t){q(c,t);return}const d=await E.all("exercises");let n="",r="",p="",l=!1;const u=()=>{const v=d.filter(e=>(!l||e.isCustom)&&(!r||e.primaryMuscle===r||e.secondaryMuscles.includes(r))&&(!p||e.equipment===p)&&(!n||e.nameEs.toLowerCase().includes(n.toLowerCase()))).sort((e,f)=>e.nameEs.localeCompare(f.nameEs,"es"));c.innerHTML=`
    <div class="screen-head"><h1>Ejercicios</h1></div><div class="row">
      <input type="text" id="ex-q" placeholder="Buscar ejercicio…" value="${i(n)}" autocomplete="off" />
      <button class="btn small" id="ex-new" style="flex:0 0 auto">＋</button>
    </div>
    <div class="chips" id="ex-muscles">
      ${$.map(e=>`<button class="chip ${r===e?"on":""}" data-m="${e}">${e}</button>`).join("")}
    </div>
    <div class="row" style="align-items:center">
      <select id="ex-equip" style="flex:1">
        <option value="">Todo el material</option>
        ${h.map(e=>`<option ${p===e?"selected":""}>${e}</option>`).join("")}
      </select>
      <label class="small muted" style="display:flex;gap:6px;align-items:center;white-space:nowrap">
        <input type="checkbox" id="ex-custom" ${l?"checked":""} /> Míos
      </label>
    </div>
    <div class="sec-title">${v.length} ejercicios</div>
    <div id="ex-list">
      ${v.slice(0,120).map(e=>`
        <button class="ex-item" data-detail="${e.id}">
          <span><span class="nm">${i(e.nameEs)}${e.isCustom?' <span class="muted">✎</span>':""}</span><br>
          <span class="meta">${i(e.primaryMuscle)} · ${i(e.equipment)}</span></span>
          <span class="tag">${i(b[e.type])}</span>
        </button>`).join("")||'<div class="empty">Sin resultados.</div>'}
      ${v.length>120?`<div class="muted small" style="text-align:center">…y ${v.length-120} más (afina la búsqueda)</div>`:""}
    </div>`;const o=document.getElementById("ex-q");o.addEventListener("input",()=>{n=o.value,u(),y()});const y=()=>{const e=document.getElementById("ex-q");e.focus(),e.setSelectionRange(e.value.length,e.value.length)};document.getElementById("ex-new")?.addEventListener("click",()=>m("/exercises?id=new")),c.querySelectorAll("#ex-muscles .chip").forEach(e=>e.addEventListener("click",()=>{r=r===e.dataset.m?"":e.dataset.m,u()})),document.getElementById("ex-equip")?.addEventListener("change",e=>{p=e.target.value,u()}),document.getElementById("ex-custom")?.addEventListener("change",e=>{l=e.target.checked,u()}),c.querySelectorAll("[data-detail]").forEach(e=>e.addEventListener("click",()=>m(`/exercises?detail=${e.dataset.detail}`)))};u()}async function q(c,a){const s=await E.get("exercises",a);if(!s){m("/exercises");return}const t=await E.workoutsDesc(50),d=[];for(const l of[...t].reverse()){const u=l.exercises.find(o=>o.exerciseId===a);if(!u)continue;const v=u.sets.filter(o=>o.done&&o.setType!=="warmup").reduce((o,y)=>o+(y.weightKg??0)*(y.reps??0),0);v>0&&d.push({date:l.startTime,vol:v})}const n=d[d.length-1],r=await w(a),p=await k();c.innerHTML=`
    <button class="linklike" id="d-back">← Ejercicios</button>
    <div class="sec-title">${i(s.equipment)} · ${i(b[s.type])}</div>
    <h2 style="margin:0 0 4px">${i(s.nameEs)}${s.isCustom?' <span class="muted small">✎ personalizado</span>':""}</h2>
    <div class="chips">
      <span class="chip on">${i(s.primaryMuscle)}</span>
      ${s.secondaryMuscles.map(l=>`<span class="chip">${i(l)}</span>`).join("")}
    </div>
    <div class="card"><h3>Cómo hacerlo</h3><p style="margin:0">${i(s.instructionsEs)}</p></div>
    ${s.media?"":'<div class="card muted small">Animación pendiente: este ejercicio aún no tiene vídeo. Se añadirá más adelante.</div>'}
    <div class="card">
      <h3>Descanso por defecto</h3>
      <div class="muted small" style="margin-bottom:6px">Se usa al añadirlo a una sesión (global: ${p.defaultRestSeconds} s).</div>
      <div class="row" style="align-items:end">
        <div><label class="f">Segundos (vacío = global)</label><input type="text" id="d-rest" value="${r??""}" placeholder="${p.defaultRestSeconds}" inputmode="numeric" /></div>
        <div><button class="btn secondary" id="d-rest-save">Guardar</button></div>
      </div>
    </div>
    <div class="card">
      <h3>Tu historial</h3>
      ${d.length?`<div class="small">Última sesión: <strong class="num">${n.vol.toFixed(0)} kg</strong> · ${new Date(n.date).toLocaleDateString("es-ES")}</div>
           <div class="small muted">${d.length} sesiones registradas</div>`:'<div class="muted small">Aún no lo has registrado.</div>'}
    </div>
    ${s.isCustom?`<div class="row">
      <button class="btn secondary" id="d-edit">Editar</button>
      <button class="btn danger" id="d-del">Eliminar</button>
    </div>`:'<div class="row"><button class="btn danger" id="d-del">Eliminar de mi biblioteca</button></div>'}`,document.getElementById("d-back")?.addEventListener("click",()=>m("/exercises")),document.getElementById("d-edit")?.addEventListener("click",()=>m(`/exercises?id=${a}`)),document.getElementById("d-rest-save")?.addEventListener("click",async()=>{const l=M(document.getElementById("d-rest").value);await j(a,l===null?null:Math.max(0,Math.round(l))),g("Descanso guardado")}),document.getElementById("d-del")?.addEventListener("click",async()=>{await I(s.isCustom?"¿Eliminar este ejercicio personalizado?":"¿Eliminar este ejercicio de tu biblioteca? No volverá a aparecer en actualizaciones.")&&(s.isCustom||await L(a),await E.del("exercises",a),g("Ejercicio eliminado"),m("/exercises"))})}async function C(c,a){const s=a?await E.get("exercises",a)??x():x();c.innerHTML=`
    <button class="linklike" id="e-back">← Volver</button>
    <div class="sec-title">${a?"Editar ejercicio":"Nuevo ejercicio personalizado"}</div>
    <div class="card">
      <label class="f">Nombre</label>
      <input type="text" id="e-name" value="${i(s.nameEs)}" placeholder="p. ej. Press inclinado con mancuernas" />
      <div class="row">
        <div><label class="f">Músculo principal</label>
          <select id="e-muscle">${$.map(t=>`<option ${s.primaryMuscle===t?"selected":""}>${t}</option>`).join("")}</select></div>
        <div><label class="f">Material</label>
          <select id="e-equip">${h.map(t=>`<option ${s.equipment===t?"selected":""}>${t}</option>`).join("")}</select></div>
      </div>
      <label class="f">Músculos secundarios (separados por comas)</label>
      <input type="text" id="e-sec" value="${i(s.secondaryMuscles.join(", "))}" placeholder="Hombro, Tríceps" />
      <label class="f">Tipo</label>
      <select id="e-type">${Object.keys(b).map(t=>`<option value="${t}" ${s.type===t?"selected":""}>${b[t]}</option>`).join("")}</select>
      <label class="f">Instrucciones</label>
      <textarea id="e-inst" placeholder="Colocación, ejecución y claves técnicas…">${i(s.instructionsEs)}</textarea>
    </div>
    <button class="btn" id="e-save">Guardar</button>`,document.getElementById("e-back")?.addEventListener("click",()=>m("/exercises")),document.getElementById("e-save")?.addEventListener("click",async()=>{const t=document.getElementById("e-name").value.trim();if(!t){g("Ponle un nombre");return}const d=document.getElementById("e-sec").value.split(",").map(n=>n.trim()).filter(Boolean).filter(n=>$.includes(n));s.nameEs=t,s.primaryMuscle=document.getElementById("e-muscle").value,s.equipment=document.getElementById("e-equip").value,s.secondaryMuscles=d,s.type=document.getElementById("e-type").value,s.instructionsEs=document.getElementById("e-inst").value.trim(),s.isCustom=!0,s.media=null,await E.put("exercises",s),g("Ejercicio guardado"),m(`/exercises?detail=${s.id}`)})}function x(){return{id:B(),nameEs:"",primaryMuscle:"Pecho",secondaryMuscles:[],equipment:"Mancuerna",type:"weight_reps",instructionsEs:"",media:null,isCustom:!0}}export{D as renderExercises};
