import{d as g,e as i,g as m,t as y,a as k,b as I,p as M,f as j,c as B,h as L}from"./index-C-o03r8i.js";import{M as $,E as f,a as b,u as q}from"./types-CEDv8i23.js";const x=n=>n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),C=(n,t)=>n.img?`<img class="${t}" src="./${n.img}" alt="" loading="lazy" />`:`<span class="${t} none"></span>`;async function z(n,t){const e=t.get("id");if(e==="new"||e){T(n,e==="new"?null:e);return}const a=t.get("detail");if(a){S(n,a);return}const d=await g.all("exercises");let l="",r="",p="",c=!1;const u=()=>{const v=d.filter(s=>(!c||s.isCustom)&&(!r||s.primaryMuscle===r||s.secondaryMuscles.includes(r))&&(!p||s.equipment===p)&&(!l||x(s.nameEs).includes(x(l)))).sort((s,w)=>s.nameEs.localeCompare(w.nameEs,"es"));n.innerHTML=`
    <div class="screen-head"><h1>Ejercicios</h1></div><div class="row">
      <input type="text" id="ex-q" placeholder="Buscar ejercicio…" value="${i(l)}" autocomplete="off" />
      <button class="btn small" id="ex-new" style="flex:0 0 auto">＋</button>
    </div>
    <div class="chips" id="ex-muscles">
      ${$.map(s=>`<button class="chip ${r===s?"on":""}" data-m="${s}">${s}</button>`).join("")}
    </div>
    <div class="row" style="align-items:center">
      <select id="ex-equip" style="flex:1">
        <option value="">Todo el material</option>
        ${f.map(s=>`<option ${p===s?"selected":""}>${s}</option>`).join("")}
      </select>
      <label class="small muted" style="display:flex;gap:6px;align-items:center;white-space:nowrap">
        <input type="checkbox" id="ex-custom" ${c?"checked":""} /> Míos
      </label>
    </div>
    <div class="sec-title">${v.length} ejercicios</div>
    <div id="ex-list">
      ${v.slice(0,120).map(s=>`
        <button class="ex-item" data-detail="${s.id}">
          ${C(s,"ex-thumb")}
          <span><span class="nm">${i(s.nameEs)}${s.isCustom?' <span class="muted">✎</span>':""}</span><br>
          <span class="meta">${i(s.primaryMuscle)} · ${i(s.equipment)}</span></span>
          <span class="tag">${i(b[s.type])}</span>
        </button>`).join("")||'<div class="empty">Sin resultados.</div>'}
      ${v.length>120?`<div class="muted small" style="text-align:center">…y ${v.length-120} más (afina la búsqueda)</div>`:""}
    </div>`;const o=document.getElementById("ex-q");o.addEventListener("input",()=>{l=o.value,u(),E()});const E=()=>{const s=document.getElementById("ex-q");s.focus(),s.setSelectionRange(s.value.length,s.value.length)};document.getElementById("ex-new")?.addEventListener("click",()=>m("/exercises?id=new")),n.querySelectorAll("#ex-muscles .chip").forEach(s=>s.addEventListener("click",()=>{r=r===s.dataset.m?"":s.dataset.m,u()})),document.getElementById("ex-equip")?.addEventListener("change",s=>{p=s.target.value,u()}),document.getElementById("ex-custom")?.addEventListener("change",s=>{c=s.target.checked,u()}),n.querySelectorAll("[data-detail]").forEach(s=>s.addEventListener("click",()=>m(`/exercises?detail=${s.dataset.detail}`)))};u()}async function S(n,t){const e=await g.get("exercises",t);if(!e){m("/exercises");return}const a=await g.workoutsDesc(50),d=[];for(const c of[...a].reverse()){const u=c.exercises.find(o=>o.exerciseId===t);if(!u)continue;const v=u.sets.filter(o=>o.done&&o.setType!=="warmup").reduce((o,E)=>o+(E.weightKg??0)*(E.reps??0),0);v>0&&d.push({date:c.startTime,vol:v})}const l=d[d.length-1],r=await k(t),p=await I();n.innerHTML=`
    <button class="linklike" id="d-back">← Ejercicios</button>
    <div class="sec-title">${i(e.equipment)} · ${i(b[e.type])}</div>
    <h2 style="margin:0 0 4px">${i(e.nameEs)}${e.isCustom?' <span class="muted small">✎ personalizado</span>':""}</h2>
    ${e.img?`<img class="ex-hero" src="./${e.img}" alt="${i(e.nameEs)}" />`:""}
    <div class="chips">
      <span class="chip on">${i(e.primaryMuscle)}</span>
      ${e.secondaryMuscles.map(c=>`<span class="chip">${i(c)}</span>`).join("")}
    </div>
    <div class="card"><h3>Cómo hacerlo</h3><p style="margin:0">${i(e.instructionsEs)}</p></div>
    ${e.img||e.media?"":'<div class="card muted small">Ilustración pendiente para este ejercicio.</div>'}
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
      ${d.length?`<div class="small">Última sesión: <strong class="num">${l.vol.toFixed(0)} kg</strong> · ${new Date(l.date).toLocaleDateString("es-ES")}</div>
           <div class="small muted">${d.length} sesiones registradas</div>`:'<div class="muted small">Aún no lo has registrado.</div>'}
    </div>
    ${e.isCustom?`<div class="row">
      <button class="btn secondary" id="d-edit">Editar</button>
      <button class="btn danger" id="d-del">Eliminar</button>
    </div>`:'<div class="row"><button class="btn danger" id="d-del">Eliminar de mi biblioteca</button></div>'}`,document.getElementById("d-back")?.addEventListener("click",()=>m("/exercises")),document.getElementById("d-edit")?.addEventListener("click",()=>m(`/exercises?id=${t}`)),document.getElementById("d-rest-save")?.addEventListener("click",async()=>{const c=M(document.getElementById("d-rest").value);await j(t,c===null?null:Math.max(0,Math.round(c))),y("Descanso guardado")}),document.getElementById("d-del")?.addEventListener("click",async()=>{await B(e.isCustom?"¿Eliminar este ejercicio personalizado?":"¿Eliminar este ejercicio de tu biblioteca? No volverá a aparecer en actualizaciones.")&&(e.isCustom||await L(t),await g.del("exercises",t),y("Ejercicio eliminado"),m("/exercises"))})}async function T(n,t){const e=t?await g.get("exercises",t)??h():h();n.innerHTML=`
    <button class="linklike" id="e-back">← Volver</button>
    <div class="sec-title">${t?"Editar ejercicio":"Nuevo ejercicio personalizado"}</div>
    <div class="card">
      <label class="f">Nombre</label>
      <input type="text" id="e-name" value="${i(e.nameEs)}" placeholder="p. ej. Press inclinado con mancuernas" />
      <div class="row">
        <div><label class="f">Músculo principal</label>
          <select id="e-muscle">${$.map(a=>`<option ${e.primaryMuscle===a?"selected":""}>${a}</option>`).join("")}</select></div>
        <div><label class="f">Material</label>
          <select id="e-equip">${f.map(a=>`<option ${e.equipment===a?"selected":""}>${a}</option>`).join("")}</select></div>
      </div>
      <label class="f">Músculos secundarios (separados por comas)</label>
      <input type="text" id="e-sec" value="${i(e.secondaryMuscles.join(", "))}" placeholder="Hombro, Tríceps" />
      <label class="f">Tipo</label>
      <select id="e-type">${Object.keys(b).map(a=>`<option value="${a}" ${e.type===a?"selected":""}>${b[a]}</option>`).join("")}</select>
      <label class="f">Instrucciones</label>
      <textarea id="e-inst" placeholder="Colocación, ejecución y claves técnicas…">${i(e.instructionsEs)}</textarea>
    </div>
    <button class="btn" id="e-save">Guardar</button>`,document.getElementById("e-back")?.addEventListener("click",()=>m("/exercises")),document.getElementById("e-save")?.addEventListener("click",async()=>{const a=document.getElementById("e-name").value.trim();if(!a){y("Ponle un nombre");return}const d=document.getElementById("e-sec").value.split(",").map(l=>l.trim()).filter(Boolean).filter(l=>$.includes(l));e.nameEs=a,e.primaryMuscle=document.getElementById("e-muscle").value,e.equipment=document.getElementById("e-equip").value,e.secondaryMuscles=d,e.type=document.getElementById("e-type").value,e.instructionsEs=document.getElementById("e-inst").value.trim(),e.isCustom=!0,e.media=null,e.img=e.img??null,await g.put("exercises",e),y("Ejercicio guardado"),m(`/exercises?detail=${e.id}`)})}function h(){return{id:q(),nameEs:"",primaryMuscle:"Pecho",secondaryMuscles:[],equipment:"Mancuerna",type:"weight_reps",instructionsEs:"",media:null,img:null,isCustom:!0}}export{z as renderExercises};
