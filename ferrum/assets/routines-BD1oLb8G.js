import{d as o,I as x,e as u,g as b,t as $,c as R,a as L,b as j,p as C}from"./index-BW0ufMRY.js";import{openExercisePicker as z}from"./train-Cr8vz_dA.js";import{e as A,M as D}from"./muscle-load-BL7lTJEv.js";import{u as M,D as S}from"./types-CEDv8i23.js";import"./stats-Cz7THz2Z.js";import"./photo-B4nAdfpw.js";const d='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',l="</svg>",B={pecho:d+'<path d="M7 4h10v4c0 4.5-2.2 7.6-5 9-2.8-1.4-5-4.5-5-9V4z"/><path d="M12 4v13"/>'+l,espalda:d+'<path d="M6 4c2 1.5 3 2.5 3 5v9c0 1 6 1 6 0v-9c0-2.5 1-3.5 3-5"/><path d="M12 8v9"/>'+l,dorsal:d+'<path d="M12 4C8.5 5.5 5.5 9 4.5 15.5c3.5-1.5 5.8-3.3 7.5-5.5 1.7 2.2 4 4 7.5 5.5C18.5 9 15.5 5.5 12 4z"/>'+l,trapecio:d+'<path d="M12 3l6 6-6 6-6-6 6-6z"/><path d="M12 3v12"/>'+l,hombro:d+'<path d="M4 10c0-4 3.5-7 8-7s8 3 8 7"/><path d="M12 3v3"/><path d="M7 10l-1.2 8M17 10l1.2 8"/>'+l,biceps:d+'<path d="M3 17h18"/><path d="M8 17c0-4 2-7 5-7-2 2-2 5 0 7"/>'+l,triceps:d+'<path d="M3 7h18"/><path d="M8 7c0 4 2 7 5 7-2-2-2-5 0-7"/>'+l,antebrazo:d+'<path d="M3 10.5h9.5v4H3z"/><circle cx="16.2" cy="12.5" r="2.8"/>'+l,core:d+'<rect x="8" y="3.5" width="8" height="17" rx="2"/><path d="M8 9h8M8 15h8M12 3.5v17"/>'+l,cuadriceps:d+'<path d="M9 3h6v9c0 4.5-1.3 7.5-3 9-1.7-1.5-3-4.5-3-9V3z"/><path d="M12 8c1.8 0 2.8 1.6 2.8 3.2 0 1.8-1.2 2.8-2.8 2.8s-2.8-1-2.8-2.8C9.2 9.6 10.2 8 12 8z"/>'+l,isquio:d+'<path d="M9 3v9c0 4.5 3 7 7.5 7.5"/><path d="M13 3v7"/>'+l,gluteo:d+'<circle cx="8.8" cy="13.5" r="4.2"/><circle cx="15.2" cy="13.5" r="4.2"/><path d="M6 9.5C8 7.5 16 7.5 18 9.5"/>'+l,gemelo:d+'<path d="M12 3c2.8 2.8 4 5.8 4 9s-1.2 6.2-4 9c-2.8-2.8-4-5.8-4-9s1.2-6.2 4-9z"/><path d="M12 7v10"/>'+l,aductor:d+'<path d="M8 3.5c.8 6 1.8 11 4 17 2.2-6 3.2-11 4-17"/><path d="M4.5 5.5c1 5 2 9.5 4 14M19.5 5.5c-1 5-2 9.5-4 14"/>'+l};let h=new Map;async function N(){const i=await o.all("exercises");h=new Map(i.map(n=>[n.id,n]))}const I=i=>h.get(i)?.nameEs??i.replace(/^desconocido:/,""),E=i=>D.find(n=>n.id===i)?.label??i;function O(i){const n=new Map;for(const c of i.exercises)for(const a of A(c.exerciseId,h.get(c.exerciseId)))n.set(a.zone,(n.get(a.zone)??0)+a.pct);return[...n.entries()].sort((c,a)=>a[1]-c[1]).slice(0,2).map(([c])=>c)}async function y(i,n){await N();const c=n.get("id");if(c==="new"||c){W(i,c==="new"?null:c);return}const a=await o.all("routines"),v=await o.all("folders");new Map(v.map(e=>[e.id,e.name]));const m=a.filter(e=>!e.folderId),g=v.map(e=>({f:e,rs:a.filter(r=>r.folderId===e.id)}));let t=`<div class="screen-head"><h1>Rutinas</h1></div><div class="row">
      <button class="btn" id="r-new">＋ Nueva rutina</button>
      <button class="btn secondary" id="r-folder">＋ Carpeta</button>
    </div>`;const s=e=>{const r=O(e),f=e.exercises.map(p=>{const w=h.get(p.exerciseId)?.img;return`<div class="rt-cell">
        ${w?`<img src="./${w}" alt="" loading="lazy" />`:`<span class="rt-cell-ph"><span class="inl-ic">${x.train}</span></span>`}
        <span class="rt-cell-name">${u(I(p.exerciseId))}</span>
      </div>`}).join("");return`
    <div class="card rt-card">
      <div class="rt-head">
        <div class="rt-titlewrap">
          <div class="rt-name">${u(e.name)}</div>
          <div class="muted small rt-meta">${e.exercises.length} ejercicio${e.exercises.length===1?"":"s"}${e.dayOfWeek!==null&&e.dayOfWeek!==void 0?" · "+S[e.dayOfWeek]:""}</div>
        </div>
        ${r.length?`<div class="rt-zones">${r.map(p=>`<span class="rt-zone" title="${E(p)}" aria-label="${E(p)}">${B[p]}</span>`).join("")}</div>`:""}
      </div>
      ${f?`<div class="rt-grid">${f}</div>`:'<div class="empty small">Sin ejercicios.</div>'}
      <div class="rt-actions">
        <button type="button" data-dup="${e.id}" title="Duplicar" aria-label="Duplicar rutina">⧉</button>
        <button type="button" data-edit="${e.id}" title="Editar" aria-label="Editar rutina">✎</button>
        <button type="button" data-del="${e.id}" title="Eliminar" aria-label="Eliminar rutina">✕</button>
      </div>
    </div>`};for(const{f:e,rs:r}of g)t+=`<div class="sec-title"><span class="inl-ic">${x.folder}</span>${u(e.name)}</div>`,t+=r.length?r.map(s).join(""):'<div class="empty">Vacía.</div>';m.length&&(t+='<div class="sec-title">Sin carpeta</div>'+m.map(s).join("")),a.length||(t+='<div class="empty">Sin rutinas. Crea la primera para entrenar con un plan.</div>'),i.innerHTML=t,document.getElementById("r-new")?.addEventListener("click",()=>b("/routines?id=new")),document.getElementById("r-folder")?.addEventListener("click",async()=>{const e=window.prompt("Nombre de la carpeta:");e?.trim()&&(await o.put("folders",{id:M(),name:e.trim()}),y(i,n))}),i.querySelectorAll("[data-edit]").forEach(e=>e.addEventListener("click",()=>b(`/routines?id=${e.dataset.edit}`))),i.querySelectorAll("[data-dup]").forEach(e=>e.addEventListener("click",async()=>{const r=await o.get("routines",e.dataset.dup);r&&(await o.put("routines",{...r,id:M(),name:r.name+" (copia)",updatedAt:Date.now()}),$("Rutina duplicada"),y(i,n))})),i.querySelectorAll("[data-del]").forEach(e=>e.addEventListener("click",async()=>{await R("¿Eliminar esta rutina?")&&(await o.del("routines",e.dataset.del),y(i,n))}))}async function W(i,n){const c=await o.all("folders");let a=n?await o.get("routines",n)??k():k();const v=()=>{i.innerHTML=`
    <button class="linklike" id="ed-back">← Volver</button>
    <div class="sec-title">${n?"Editar rutina":"Nueva rutina"}</div>
    <div class="card">
      <label class="f">Nombre</label>
      <input type="text" id="ed-name" value="${u(a.name)}" />
      <div class="row">
        <div><label class="f">Carpeta</label>
          <select id="ed-folder">
            <option value="">Sin carpeta</option>
            ${c.map(t=>`<option value="${t.id}" ${a.folderId===t.id?"selected":""}>${u(t.name)}</option>`).join("")}
          </select></div>
        <div><label class="f">Día de la semana</label>
          <select id="ed-dow">
            <option value="">Sin asignar</option>
            ${S.map((t,s)=>`<option value="${s}" ${a.dayOfWeek===s?"selected":""}>${t}</option>`).join("")}
          </select></div>
      </div>
    </div>
    <div class="sec-title">Ejercicios (${a.exercises.length})</div>
    <div id="ed-list"></div>
    <button class="btn secondary" id="ed-add">＋ Añadir ejercicio</button>
    <button class="btn" id="ed-save" style="margin-top:10px">Guardar rutina</button>`;const m=document.getElementById("ed-list");m.innerHTML=a.exercises.map((t,s)=>{const e=h.get(t.exerciseId);return`<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
            ${e?.img?`<img class="ex-thumb" src="./${e.img}" alt="" loading="lazy" />`:`<span class="ex-thumb ex-thumb--ph" aria-hidden="true">${x.train}</span>`}
            <strong>${u(I(t.exerciseId))}</strong>
          </div>
          <button class="icon-btn small" data-rm="${s}">✕</button>
        </div>
        <div class="muted small">${u(e?.primaryMuscle??"")} · ${u(e?.equipment??"")}</div>
        <div class="row" style="margin-top:8px">
          <div><label class="f">Series</label><input type="text" inputmode="numeric" data-f="${s}:targetSets" value="${t.targetSets}" /></div>
          <div><label class="f">Peso (kg)</label><input type="text" data-f="${s}:targetWeightKg" value="${t.targetWeightKg??""}" inputmode="decimal" /></div>
        </div>
        <div class="row">
          <div><label class="f">Reps mín</label><input type="text" inputmode="numeric" data-f="${s}:targetRepsMin" value="${t.targetRepsMin??""}" /></div>
          <div><label class="f">Reps máx</label><input type="text" inputmode="numeric" data-f="${s}:targetRepsMax" value="${t.targetRepsMax??""}" /></div>
          <div><label class="f">Descanso (s)</label><input type="text" inputmode="numeric" data-f="${s}:restSeconds" value="${t.restSeconds}" /></div>
        </div>
        <label class="f">Notas</label>
        <input type="text" data-f="${s}:notes" value="${u(t.notes)}" placeholder="Recordatorio de técnica…" />
      </div>`}).join("");const g=()=>{a.name=document.getElementById("ed-name").value.trim()||"Rutina sin nombre";const t=document.getElementById("ed-folder").value;a.folderId=t||null;const s=document.getElementById("ed-dow").value;a.dayOfWeek=s===""?null:+s,i.querySelectorAll("[data-f]").forEach(e=>{const[r,f]=e.dataset.f.split(":"),p=e.value;a.exercises[+r][f]=f==="notes"?p:C(p)})};document.getElementById("ed-back")?.addEventListener("click",()=>b("/routines")),document.getElementById("ed-add")?.addEventListener("click",()=>{g(),z(t=>{(async()=>{const s=await L(t),e=await j();a.exercises.push({exerciseId:t,targetSets:3,targetWeightKg:null,targetRepsMin:8,targetRepsMax:12,targetDurationSeconds:null,restSeconds:s??e.defaultRestSeconds,notes:""}),v()})()})}),m.querySelectorAll("[data-rm]").forEach(t=>t.addEventListener("click",()=>{g(),a.exercises.splice(+t.dataset.rm,1),v()})),document.getElementById("ed-save")?.addEventListener("click",async()=>{if(g(),!a.exercises.length){$("Añade al menos un ejercicio");return}a.updatedAt=Date.now(),await o.put("routines",a),$("Rutina guardada"),b("/routines")})};v()}function k(){return{id:M(),name:"",folderId:null,dayOfWeek:null,exercises:[],updatedAt:Date.now()}}export{y as renderRoutines};
