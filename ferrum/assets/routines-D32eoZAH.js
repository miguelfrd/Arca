import{d as l,e as c,g as m,t as g,i as x,b as k,c as S}from"./index-bOvUM1Ia.js";import{openExercisePicker as h}from"./train-B6CGqEgj.js";import{u as b,D as $}from"./types-E-ayykTU.js";import"./stats-LK8w3XMM.js";let y=new Map;async function I(){const i=await l.all("exercises");y=new Map(i.map(s=>[s.id,s]))}const R=i=>y.get(i)?.nameEs??i.replace(/^desconocido:/,"");async function f(i,s){await I();const o=s.get("id");if(o==="new"||o){M(i,o==="new"?null:o);return}const a=await l.all("routines"),r=await l.all("folders");new Map(r.map(e=>[e.id,e.name]));const u=a.filter(e=>!e.folderId),p=r.map(e=>({f:e,rs:a.filter(d=>d.folderId===e.id)}));let t=`<div class="row">
      <button class="btn" id="r-new">＋ Nueva rutina</button>
      <button class="btn secondary" id="r-folder">＋ Carpeta</button>
    </div>`;const n=e=>`
    <div class="card" style="padding:9px 12px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div><strong>${c(e.name)}</strong>
          <div class="muted small">${e.exercises.length} ejercicios${e.dayOfWeek!==null&&e.dayOfWeek!==void 0?" · "+$[e.dayOfWeek]:""}</div></div>
        <div class="row" style="flex:0 0 auto">
          <button class="icon-btn small" data-dup="${e.id}" title="Duplicar">⧉</button>
          <button class="icon-btn small" data-edit="${e.id}" title="Editar">✎</button>
          <button class="icon-btn small" data-del="${e.id}" title="Eliminar">✕</button>
        </div>
      </div></div>`;for(const{f:e,rs:d}of p)t+=`<div class="sec-title">📁 ${c(e.name)}</div>`,t+=d.length?d.map(n).join(""):'<div class="empty">Vacía.</div>';u.length&&(t+='<div class="sec-title">Sin carpeta</div>'+u.map(n).join("")),a.length||(t+='<div class="empty">Sin rutinas. Crea la primera para entrenar con un plan.</div>'),i.innerHTML=t,document.getElementById("r-new")?.addEventListener("click",()=>m("/routines?id=new")),document.getElementById("r-folder")?.addEventListener("click",async()=>{const e=window.prompt("Nombre de la carpeta:");e?.trim()&&(await l.put("folders",{id:b(),name:e.trim()}),f(i,s))}),i.querySelectorAll("[data-edit]").forEach(e=>e.addEventListener("click",()=>m(`/routines?id=${e.dataset.edit}`))),i.querySelectorAll("[data-dup]").forEach(e=>e.addEventListener("click",async()=>{const d=await l.get("routines",e.dataset.dup);d&&(await l.put("routines",{...d,id:b(),name:d.name+" (copia)",updatedAt:Date.now()}),g("Rutina duplicada"),f(i,s))})),i.querySelectorAll("[data-del]").forEach(e=>e.addEventListener("click",async()=>{await x("¿Eliminar esta rutina?")&&(await l.del("routines",e.dataset.del),f(i,s))}))}async function M(i,s){const o=await l.all("folders");let a=s?await l.get("routines",s)??E():E();const r=()=>{i.innerHTML=`
    <button class="linklike" id="ed-back">← Volver</button>
    <div class="sec-title">${s?"Editar rutina":"Nueva rutina"}</div>
    <div class="card">
      <label class="f">Nombre</label>
      <input type="text" id="ed-name" value="${c(a.name)}" />
      <div class="row">
        <div><label class="f">Carpeta</label>
          <select id="ed-folder">
            <option value="">Sin carpeta</option>
            ${o.map(t=>`<option value="${t.id}" ${a.folderId===t.id?"selected":""}>${c(t.name)}</option>`).join("")}
          </select></div>
        <div><label class="f">Día de la semana</label>
          <select id="ed-dow">
            <option value="">Sin asignar</option>
            ${$.map((t,n)=>`<option value="${n}" ${a.dayOfWeek===n?"selected":""}>${t}</option>`).join("")}
          </select></div>
      </div>
    </div>
    <div class="sec-title">Ejercicios (${a.exercises.length})</div>
    <div id="ed-list"></div>
    <button class="btn secondary" id="ed-add">＋ Añadir ejercicio</button>
    <button class="btn" id="ed-save" style="margin-top:10px">Guardar rutina</button>`;const u=document.getElementById("ed-list");u.innerHTML=a.exercises.map((t,n)=>{const e=y.get(t.exerciseId);return`<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <strong>${c(R(t.exerciseId))}</strong>
          <button class="icon-btn small" data-rm="${n}">✕</button>
        </div>
        <div class="muted small">${c(e?.primaryMuscle??"")} · ${c(e?.equipment??"")}</div>
        <div class="row" style="margin-top:8px">
          <div><label class="f">Series</label><input type="number" data-f="${n}:targetSets" value="${t.targetSets}" min="1" /></div>
          <div><label class="f">Peso (kg)</label><input type="number" data-f="${n}:targetWeightKg" value="${t.targetWeightKg??""}" inputmode="decimal" /></div>
        </div>
        <div class="row">
          <div><label class="f">Reps mín</label><input type="number" data-f="${n}:targetRepsMin" value="${t.targetRepsMin??""}" /></div>
          <div><label class="f">Reps máx</label><input type="number" data-f="${n}:targetRepsMax" value="${t.targetRepsMax??""}" /></div>
          <div><label class="f">Descanso (s)</label><input type="number" data-f="${n}:restSeconds" value="${t.restSeconds}" /></div>
        </div>
        <label class="f">Notas</label>
        <input type="text" data-f="${n}:notes" value="${c(t.notes)}" placeholder="Recordatorio de técnica…" />
      </div>`}).join("");const p=()=>{a.name=document.getElementById("ed-name").value.trim()||"Rutina sin nombre";const t=document.getElementById("ed-folder").value;a.folderId=t||null;const n=document.getElementById("ed-dow").value;a.dayOfWeek=n===""?null:+n,i.querySelectorAll("[data-f]").forEach(e=>{const[d,w]=e.dataset.f.split(":"),v=e.value;a.exercises[+d][w]=w==="notes"?v:v===""?null:Number(v)})};document.getElementById("ed-back")?.addEventListener("click",()=>m("/routines")),document.getElementById("ed-add")?.addEventListener("click",()=>{p(),h(t=>{(async()=>{const n=await k(t),e=await S();a.exercises.push({exerciseId:t,targetSets:3,targetWeightKg:null,targetRepsMin:8,targetRepsMax:12,targetDurationSeconds:null,restSeconds:n??e.defaultRestSeconds,notes:""}),r()})()})}),u.querySelectorAll("[data-rm]").forEach(t=>t.addEventListener("click",()=>{p(),a.exercises.splice(+t.dataset.rm,1),r()})),document.getElementById("ed-save")?.addEventListener("click",async()=>{if(p(),!a.exercises.length){g("Añade al menos un ejercicio");return}a.updatedAt=Date.now(),await l.put("routines",a),g("Rutina guardada"),m("/routines")})};r()}function E(){return{id:b(),name:"",folderId:null,dayOfWeek:null,exercises:[],updatedAt:Date.now()}}export{f as renderRoutines};
