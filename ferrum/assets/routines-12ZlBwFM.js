import{d as l,I as w,e as c,g as m,t as f,c as h,a as k,b as S,p as I}from"./index-CeAX9hAb.js";import{openExercisePicker as R}from"./train-D39etkUF.js";import{u as g,D as E}from"./types-CEDv8i23.js";import"./stats-Cz7THz2Z.js";import"./photo-B4nAdfpw.js";let y=new Map;async function M(){const n=await l.all("exercises");y=new Map(n.map(s=>[s.id,s]))}const A=n=>y.get(n)?.nameEs??n.replace(/^desconocido:/,"");async function v(n,s){await M();const o=s.get("id");if(o==="new"||o){L(n,o==="new"?null:o);return}const a=await l.all("routines"),r=await l.all("folders");new Map(r.map(e=>[e.id,e.name]));const u=a.filter(e=>!e.folderId),p=r.map(e=>({f:e,rs:a.filter(d=>d.folderId===e.id)}));let t=`<div class="screen-head"><h1>Rutinas</h1></div><div class="row">
      <button class="btn" id="r-new">＋ Nueva rutina</button>
      <button class="btn secondary" id="r-folder">＋ Carpeta</button>
    </div>`;const i=e=>`
    <div class="card" style="padding:9px 12px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div><strong>${c(e.name)}</strong>
          <div class="muted small">${e.exercises.length} ejercicios${e.dayOfWeek!==null&&e.dayOfWeek!==void 0?" · "+E[e.dayOfWeek]:""}</div></div>
        <div class="row" style="flex:0 0 auto">
          <button class="icon-btn small" data-dup="${e.id}" title="Duplicar">⧉</button>
          <button class="icon-btn small" data-edit="${e.id}" title="Editar">✎</button>
          <button class="icon-btn small" data-del="${e.id}" title="Eliminar">✕</button>
        </div>
      </div></div>`;for(const{f:e,rs:d}of p)t+=`<div class="sec-title"><span class="inl-ic">${w.folder}</span>${c(e.name)}</div>`,t+=d.length?d.map(i).join(""):'<div class="empty">Vacía.</div>';u.length&&(t+='<div class="sec-title">Sin carpeta</div>'+u.map(i).join("")),a.length||(t+='<div class="empty">Sin rutinas. Crea la primera para entrenar con un plan.</div>'),n.innerHTML=t,document.getElementById("r-new")?.addEventListener("click",()=>m("/routines?id=new")),document.getElementById("r-folder")?.addEventListener("click",async()=>{const e=window.prompt("Nombre de la carpeta:");e?.trim()&&(await l.put("folders",{id:g(),name:e.trim()}),v(n,s))}),n.querySelectorAll("[data-edit]").forEach(e=>e.addEventListener("click",()=>m(`/routines?id=${e.dataset.edit}`))),n.querySelectorAll("[data-dup]").forEach(e=>e.addEventListener("click",async()=>{const d=await l.get("routines",e.dataset.dup);d&&(await l.put("routines",{...d,id:g(),name:d.name+" (copia)",updatedAt:Date.now()}),f("Rutina duplicada"),v(n,s))})),n.querySelectorAll("[data-del]").forEach(e=>e.addEventListener("click",async()=>{await h("¿Eliminar esta rutina?")&&(await l.del("routines",e.dataset.del),v(n,s))}))}async function L(n,s){const o=await l.all("folders");let a=s?await l.get("routines",s)??$():$();const r=()=>{n.innerHTML=`
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
            ${E.map((t,i)=>`<option value="${i}" ${a.dayOfWeek===i?"selected":""}>${t}</option>`).join("")}
          </select></div>
      </div>
    </div>
    <div class="sec-title">Ejercicios (${a.exercises.length})</div>
    <div id="ed-list"></div>
    <button class="btn secondary" id="ed-add">＋ Añadir ejercicio</button>
    <button class="btn" id="ed-save" style="margin-top:10px">Guardar rutina</button>`;const u=document.getElementById("ed-list");u.innerHTML=a.exercises.map((t,i)=>{const e=y.get(t.exerciseId);return`<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
            ${e?.img?`<img class="ex-thumb" src="./${e.img}" alt="" loading="lazy" />`:`<span class="ex-thumb ex-thumb--ph" aria-hidden="true">${w.train}</span>`}
            <strong>${c(A(t.exerciseId))}</strong>
          </div>
          <button class="icon-btn small" data-rm="${i}">✕</button>
        </div>
        <div class="muted small">${c(e?.primaryMuscle??"")} · ${c(e?.equipment??"")}</div>
        <div class="row" style="margin-top:8px">
          <div><label class="f">Series</label><input type="text" inputmode="numeric" data-f="${i}:targetSets" value="${t.targetSets}" /></div>
          <div><label class="f">Peso (kg)</label><input type="text" data-f="${i}:targetWeightKg" value="${t.targetWeightKg??""}" inputmode="decimal" /></div>
        </div>
        <div class="row">
          <div><label class="f">Reps mín</label><input type="text" inputmode="numeric" data-f="${i}:targetRepsMin" value="${t.targetRepsMin??""}" /></div>
          <div><label class="f">Reps máx</label><input type="text" inputmode="numeric" data-f="${i}:targetRepsMax" value="${t.targetRepsMax??""}" /></div>
          <div><label class="f">Descanso (s)</label><input type="text" inputmode="numeric" data-f="${i}:restSeconds" value="${t.restSeconds}" /></div>
        </div>
        <label class="f">Notas</label>
        <input type="text" data-f="${i}:notes" value="${c(t.notes)}" placeholder="Recordatorio de técnica…" />
      </div>`}).join("");const p=()=>{a.name=document.getElementById("ed-name").value.trim()||"Rutina sin nombre";const t=document.getElementById("ed-folder").value;a.folderId=t||null;const i=document.getElementById("ed-dow").value;a.dayOfWeek=i===""?null:+i,n.querySelectorAll("[data-f]").forEach(e=>{const[d,b]=e.dataset.f.split(":"),x=e.value;a.exercises[+d][b]=b==="notes"?x:I(x)})};document.getElementById("ed-back")?.addEventListener("click",()=>m("/routines")),document.getElementById("ed-add")?.addEventListener("click",()=>{p(),R(t=>{(async()=>{const i=await k(t),e=await S();a.exercises.push({exerciseId:t,targetSets:3,targetWeightKg:null,targetRepsMin:8,targetRepsMax:12,targetDurationSeconds:null,restSeconds:i??e.defaultRestSeconds,notes:""}),r()})()})}),u.querySelectorAll("[data-rm]").forEach(t=>t.addEventListener("click",()=>{p(),a.exercises.splice(+t.dataset.rm,1),r()})),document.getElementById("ed-save")?.addEventListener("click",async()=>{if(p(),!a.exercises.length){f("Añade al menos un ejercicio");return}a.updatedAt=Date.now(),await l.put("routines",a),f("Rutina guardada"),m("/routines")})};r()}function $(){return{id:g(),name:"",folderId:null,dayOfWeek:null,exercises:[],updatedAt:Date.now()}}export{v as renderRoutines};
