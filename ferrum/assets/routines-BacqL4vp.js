import{d as p,I as M,e as m,g as y,t as b,c as R,a as O,b as j,p as L}from"./index-BL9MLBT4.js";import{openExercisePicker as N}from"./train-Dyjr59b2.js";import{e as A,M as C}from"./muscle-load-BL7lTJEv.js";import{u as w,D as W}from"./types-CEDv8i23.js";import"./stats-CJKsKY2L.js";import"./photo-B4nAdfpw.js";const r='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',c="</svg>",z={pecho:r+'<path d="M7 4h10v4c0 4.5-2.2 7.6-5 9-2.8-1.4-5-4.5-5-9V4z"/><path d="M12 4v13"/>'+c,espalda:r+'<path d="M6 4c2 1.5 3 2.5 3 5v9c0 1 6 1 6 0v-9c0-2.5 1-3.5 3-5"/><path d="M12 8v9"/>'+c,dorsal:r+'<path d="M12 4C8.5 5.5 5.5 9 4.5 15.5c3.5-1.5 5.8-3.3 7.5-5.5 1.7 2.2 4 4 7.5 5.5C18.5 9 15.5 5.5 12 4z"/>'+c,trapecio:r+'<path d="M12 3l6 6-6 6-6-6 6-6z"/><path d="M12 3v12"/>'+c,hombro:r+'<path d="M4 10c0-4 3.5-7 8-7s8 3 8 7"/><path d="M12 3v3"/><path d="M7 10l-1.2 8M17 10l1.2 8"/>'+c,biceps:r+'<path d="M3 17h18"/><path d="M8 17c0-4 2-7 5-7-2 2-2 5 0 7"/>'+c,triceps:r+'<path d="M3 7h18"/><path d="M8 7c0 4 2 7 5 7-2-2-2-5 0-7"/>'+c,antebrazo:r+'<path d="M3 10.5h9.5v4H3z"/><circle cx="16.2" cy="12.5" r="2.8"/>'+c,core:r+'<rect x="8" y="3.5" width="8" height="17" rx="2"/><path d="M8 9h8M8 15h8M12 3.5v17"/>'+c,cuadriceps:r+'<path d="M9 3h6v9c0 4.5-1.3 7.5-3 9-1.7-1.5-3-4.5-3-9V3z"/><path d="M12 8c1.8 0 2.8 1.6 2.8 3.2 0 1.8-1.2 2.8-2.8 2.8s-2.8-1-2.8-2.8C9.2 9.6 10.2 8 12 8z"/>'+c,isquio:r+'<path d="M9 3v9c0 4.5 3 7 7.5 7.5"/><path d="M13 3v7"/>'+c,gluteo:r+'<circle cx="8.8" cy="13.5" r="4.2"/><circle cx="15.2" cy="13.5" r="4.2"/><path d="M6 9.5C8 7.5 16 7.5 18 9.5"/>'+c,gemelo:r+'<path d="M12 3c2.8 2.8 4 5.8 4 9s-1.2 6.2-4 9c-2.8-2.8-4-5.8-4-9s1.2-6.2 4-9z"/><path d="M12 7v10"/>'+c,aductor:r+'<path d="M8 3.5c.8 6 1.8 11 4 17 2.2-6 3.2-11 4-17"/><path d="M4.5 5.5c1 5 2 9.5 4 14M19.5 5.5c-1 5-2 9.5-4 14"/>'+c};let x=new Map;async function D(){const n=await p.all("exercises");x=new Map(n.map(e=>[e.id,e]))}const E=n=>n?x.get(n)?.nameEs??n.replace(/^desconocido:/,""):"Ejercicio",k=n=>C.find(e=>e.id===n)?.label??n;function B(n){const e=new Map;for(const d of n.exercises??[])for(const a of A(d.exerciseId,x.get(d.exerciseId)))e.set(a.zone,(e.get(a.zone)??0)+a.pct);return[...e.entries()].sort((d,a)=>a[1]-d[1]).slice(0,2).map(([d])=>d)}async function $(n,e){await D();const d=e.get("id");if(d==="new"||d){q(n,d==="new"?null:d);return}const a=await p.all("routines"),o=await p.all("folders"),h=new Map(o.map(t=>[t.id,t.name])),f=a.filter(t=>!t.folderId||!h.has(t.folderId)),i=o.map(t=>({f:t,rs:a.filter(l=>l.folderId===t.id)}));let s=`<div class="screen-head"><h1>Rutinas</h1></div><div class="row">
      <button class="btn" id="r-new">＋ Nueva rutina</button>
      <button class="btn secondary" id="r-folder">＋ Carpeta</button>
    </div>`;const u=t=>{const l=B(t),v=(t.exercises??[]).map(g=>{const S=x.get(g.exerciseId)?.img;return`<div class="rt-cell">
        ${S?`<img src="./${S}" alt="" loading="lazy" />`:`<span class="rt-cell-ph"><span class="inl-ic">${M.train}</span></span>`}
        <span class="rt-cell-name">${m(E(g.exerciseId))}</span>
      </div>`}).join("");return`
    <div class="card rt-card">
      <div class="rt-head">
        <div class="rt-titlewrap">
          <div class="rt-name">${m(t.name)}</div>
          <div class="muted small rt-meta">${(t.exercises??[]).length} ejercicio${(t.exercises??[]).length===1?"":"s"}${t.dayOfWeek!==null&&t.dayOfWeek!==void 0?" · "+W[t.dayOfWeek]:""}</div>
        </div>
        ${l.length?`<div class="rt-zones">${l.map(g=>`<span class="rt-zone" title="${k(g)}" aria-label="${k(g)}">${z[g]}</span>`).join("")}</div>`:""}
      </div>
      ${v?`<div class="rt-grid">${v}</div>`:'<div class="empty small">Sin ejercicios.</div>'}
      <div class="rt-actions">
        <button type="button" data-dup="${t.id}" title="Duplicar" aria-label="Duplicar rutina">⧉</button>
        <button type="button" data-edit="${t.id}" title="Editar" aria-label="Editar rutina">✎</button>
        <button type="button" data-del="${t.id}" title="Eliminar" aria-label="Eliminar rutina">✕</button>
      </div>
    </div>`};for(const{f:t,rs:l}of i)s+=`<div class="sec-title"><span class="inl-ic">${M.folder}</span>${m(t.name)}</div>`,s+=l.length?l.map(u).join(""):'<div class="empty">Vacía.</div>';f.length&&(s+='<div class="sec-title">Sin carpeta</div>'+f.map(u).join("")),a.length||(s+='<div class="empty">Sin rutinas. Crea la primera para entrenar con un plan.</div>'),n.innerHTML=s,document.getElementById("r-new")?.addEventListener("click",()=>y("/routines?id=new")),document.getElementById("r-folder")?.addEventListener("click",async()=>{const t=window.prompt("Nombre de la carpeta:");t?.trim()&&(await p.put("folders",{id:w(),name:t.trim()}),$(n,e))}),n.querySelectorAll("[data-edit]").forEach(t=>t.addEventListener("click",()=>y(`/routines?id=${t.dataset.edit}`))),n.querySelectorAll("[data-dup]").forEach(t=>t.addEventListener("click",async()=>{const l=t;if(!l.disabled){l.disabled=!0;try{const v=await p.get("routines",l.dataset.dup);v&&(await p.put("routines",{...v,id:w(),name:v.name+" (copia)",updatedAt:Date.now()}),b("Rutina duplicada"),$(n,e))}finally{l.disabled=!1}}})),n.querySelectorAll("[data-del]").forEach(t=>t.addEventListener("click",async()=>{await R("¿Eliminar esta rutina?")&&(await p.del("routines",t.dataset.del),$(n,e))}))}async function q(n,e){const d=await p.all("folders");if(e&&e!=="new"&&!await p.get("routines",e)){b("Rutina no encontrada"),y("/routines");return}let a=e&&e!=="new"?await p.get("routines",e)??I():I();Array.isArray(a.exercises)||(a.exercises=[]),(typeof a.dayOfWeek!="number"||a.dayOfWeek<0||a.dayOfWeek>6)&&(a.dayOfWeek=null);const o=()=>{n.innerHTML=`
    <button class="linklike" id="ed-back">← Volver</button>
    <div class="sec-title">${e?"Editar rutina":"Nueva rutina"}</div>
    <div class="card">
      <label class="f">Nombre</label>
      <input type="text" id="ed-name" value="${m(a.name)}" />
      <div class="row">
        <div><label class="f">Carpeta</label>
          <select id="ed-folder">
            <option value="">Sin carpeta</option>
            ${d.map(i=>`<option value="${i.id}" ${a.folderId===i.id?"selected":""}>${m(i.name)}</option>`).join("")}
          </select></div>
        <div><label class="f">Día de la semana</label>
          <select id="ed-dow">
            <option value="">Sin asignar</option>
            ${W.map((i,s)=>`<option value="${s}" ${a.dayOfWeek===s?"selected":""}>${i}</option>`).join("")}
          </select></div>
      </div>
    </div>
    <div class="sec-title">Ejercicios (${a.exercises.length})</div>
    <div id="ed-list"></div>
    <button class="btn secondary" id="ed-add">＋ Añadir ejercicio</button>
    <button class="btn" id="ed-save" style="margin-top:10px">Guardar rutina</button>`;const h=document.getElementById("ed-list");h.innerHTML=a.exercises.map((i,s)=>{const u=x.get(i.exerciseId);return`<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
            ${u?.img?`<img class="ex-thumb" src="./${u.img}" alt="" loading="lazy" />`:`<span class="ex-thumb ex-thumb--ph" aria-hidden="true">${M.train}</span>`}
            <strong>${m(E(i.exerciseId))}</strong>
          </div>
          <button class="icon-btn small" data-rm="${s}">✕</button>
        </div>
        <div class="muted small">${m(u?.primaryMuscle??"")} · ${m(u?.equipment??"")}</div>
        <div class="row" style="margin-top:8px">
          <div><label class="f">Series</label><input type="text" inputmode="numeric" data-f="${s}:targetSets" value="${i.targetSets??""}" /></div>
          <div><label class="f">Peso (kg)</label><input type="text" data-f="${s}:targetWeightKg" value="${i.targetWeightKg??""}" inputmode="decimal" /></div>
        </div>
        <div class="row">
          <div><label class="f">Reps mín</label><input type="text" inputmode="numeric" data-f="${s}:targetRepsMin" value="${i.targetRepsMin??""}" /></div>
          <div><label class="f">Reps máx</label><input type="text" inputmode="numeric" data-f="${s}:targetRepsMax" value="${i.targetRepsMax??""}" /></div>
          <div><label class="f">Descanso (s)</label><input type="text" inputmode="numeric" data-f="${s}:restSeconds" value="${i.restSeconds??""}" /></div>
        </div>
        <label class="f">Notas</label>
        <input type="text" data-f="${s}:notes" value="${m(i.notes)}" placeholder="Recordatorio de técnica…" />
      </div>`}).join("");const f=()=>{a.name=document.getElementById("ed-name").value.trim()||"Rutina sin nombre";const i=document.getElementById("ed-folder").value;a.folderId=i||null;const s=document.getElementById("ed-dow").value;a.dayOfWeek=s===""?null:+s,n.querySelectorAll("[data-f]").forEach(u=>{const[t,l]=u.dataset.f.split(":"),v=u.value;a.exercises[+t][l]=l==="notes"?v:L(v)})};document.getElementById("ed-back")?.addEventListener("click",async()=>{const i=JSON.stringify(a);f(),!(JSON.stringify(a)!==i&&!await R("Tienes cambios sin guardar. ¿Salir sin guardar?"))&&y("/routines")}),document.getElementById("ed-add")?.addEventListener("click",()=>{f(),N(i=>{(async()=>{const s=await O(i),u=await j();a.exercises.push({exerciseId:i,targetSets:3,targetWeightKg:null,targetRepsMin:8,targetRepsMax:12,targetDurationSeconds:null,restSeconds:s??u.defaultRestSeconds,notes:""}),o()})()})}),h.querySelectorAll("[data-rm]").forEach(i=>i.addEventListener("click",()=>{f(),a.exercises.splice(+i.dataset.rm,1),o()})),document.getElementById("ed-save")?.addEventListener("click",async()=>{if(f(),!a.exercises.length){b("Añade al menos un ejercicio");return}const i=K(a);if(i){b(i);return}a.updatedAt=Date.now(),await p.put("routines",a),b("Rutina guardada"),y("/routines")})};o()}function K(n){for(const e of n.exercises??[]){const d=E(e.exerciseId);if(!Number.isInteger(e.targetSets)||e.targetSets<1||e.targetSets>100)return`Series inválidas en ${d} (1–100)`;if(e.targetWeightKg!==null&&e.targetWeightKg!==void 0&&!(e.targetWeightKg>=0&&e.targetWeightKg<=1e3))return`Peso inválido en ${d} (0–1000 kg)`;for(const[a,o]of[["Reps mín",e.targetRepsMin],["Reps máx",e.targetRepsMax]])if(o!=null&&!(Number.isInteger(o)&&o>=1&&o<=1e3))return`${a} inválidas en ${d} (1–1000)`;if(e.targetRepsMin!=null&&e.targetRepsMax!=null&&e.targetRepsMin>e.targetRepsMax)return`Reps mín > máx en ${d}`;if(!Number.isInteger(e.restSeconds)||e.restSeconds<0||e.restSeconds>3600)return`Descanso inválido en ${d} (0–3600 s)`}return null}function I(){return{id:w(),name:"",folderId:null,dayOfWeek:null,exercises:[],updatedAt:Date.now()}}export{$ as renderRoutines};
