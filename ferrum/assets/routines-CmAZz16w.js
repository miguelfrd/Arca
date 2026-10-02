import{d as o,I as R,e as g,g as E,t as b,c as A,a as W,b as C,p as B}from"./index-CmabyFyE.js";import{openExercisePicker as z}from"./train-emm6LbhH.js";import{e as q,M as K}from"./muscle-load-BL7lTJEv.js";import{u as j,D as O}from"./types-CEDv8i23.js";import"./stats-CJKsKY2L.js";import"./photo-B4nAdfpw.js";const u='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',p="</svg>",T={pecho:u+'<path d="M7 4h10v4c0 4.5-2.2 7.6-5 9-2.8-1.4-5-4.5-5-9V4z"/><path d="M12 4v13"/>'+p,espalda:u+'<path d="M6 4c2 1.5 3 2.5 3 5v9c0 1 6 1 6 0v-9c0-2.5 1-3.5 3-5"/><path d="M12 8v9"/>'+p,dorsal:u+'<path d="M12 4C8.5 5.5 5.5 9 4.5 15.5c3.5-1.5 5.8-3.3 7.5-5.5 1.7 2.2 4 4 7.5 5.5C18.5 9 15.5 5.5 12 4z"/>'+p,trapecio:u+'<path d="M12 3l6 6-6 6-6-6 6-6z"/><path d="M12 3v12"/>'+p,hombro:u+'<path d="M4 10c0-4 3.5-7 8-7s8 3 8 7"/><path d="M12 3v3"/><path d="M7 10l-1.2 8M17 10l1.2 8"/>'+p,biceps:u+'<path d="M3 17h18"/><path d="M8 17c0-4 2-7 5-7-2 2-2 5 0 7"/>'+p,triceps:u+'<path d="M3 7h18"/><path d="M8 7c0 4 2 7 5 7-2-2-2-5 0-7"/>'+p,antebrazo:u+'<path d="M3 10.5h9.5v4H3z"/><circle cx="16.2" cy="12.5" r="2.8"/>'+p,core:u+'<rect x="8" y="3.5" width="8" height="17" rx="2"/><path d="M8 9h8M8 15h8M12 3.5v17"/>'+p,cuadriceps:u+'<path d="M9 3h6v9c0 4.5-1.3 7.5-3 9-1.7-1.5-3-4.5-3-9V3z"/><path d="M12 8c1.8 0 2.8 1.6 2.8 3.2 0 1.8-1.2 2.8-2.8 2.8s-2.8-1-2.8-2.8C9.2 9.6 10.2 8 12 8z"/>'+p,isquio:u+'<path d="M9 3v9c0 4.5 3 7 7.5 7.5"/><path d="M13 3v7"/>'+p,gluteo:u+'<circle cx="8.8" cy="13.5" r="4.2"/><circle cx="15.2" cy="13.5" r="4.2"/><path d="M6 9.5C8 7.5 16 7.5 18 9.5"/>'+p,gemelo:u+'<path d="M12 3c2.8 2.8 4 5.8 4 9s-1.2 6.2-4 9c-2.8-2.8-4-5.8-4-9s1.2-6.2 4-9z"/><path d="M12 7v10"/>'+p,aductor:u+'<path d="M8 3.5c.8 6 1.8 11 4 17 2.2-6 3.2-11 4-17"/><path d="M4.5 5.5c1 5 2 9.5 4 14M19.5 5.5c-1 5-2 9.5-4 14"/>'+p};let M=new Map;async function H(){const i=await o.all("exercises");M=new Map(i.map(t=>[t.id,t]))}const k=i=>i?M.get(i)?.nameEs??i.replace(/^desconocido:/,""):"Ejercicio",D=i=>K.find(t=>t.id===i)?.label??i;function J(i){const t=new Map;for(const c of i.exercises??[])for(const a of q(c.exerciseId,M.get(c.exerciseId)))t.set(a.zone,(t.get(a.zone)??0)+a.pct);return[...t.entries()].sort((c,a)=>a[1]-c[1]).slice(0,2).map(([c])=>c)}async function w(i,t){await H();const c=t.get("id");if(c==="new"||c){V(i,c==="new"?null:c);return}const a=await o.all("routines"),m=await o.all("folders"),I=new Map(m.map(e=>[e.id,e.name])),h=a.filter(e=>!e.folderId||!I.has(e.folderId)),x=m.map(e=>({f:e,rs:a.filter(r=>r.folderId===e.id)}));let v=`<div class="screen-head"><h1>Rutinas</h1></div><div class="row">
      <button class="btn" id="r-new">＋ Nueva rutina</button>
      <button class="btn secondary" id="r-folder">＋ Carpeta</button>
    </div>`;const y=e=>{const r=J(e),d=(e.exercises??[]).map(s=>{const n=M.get(s.exerciseId)?.img;return`<div class="rt-cell">
        ${n?`<img src="./${n}" alt="" loading="lazy" />`:`<span class="rt-cell-ph"><span class="inl-ic">${R.train}</span></span>`}
        <span class="rt-cell-name">${g(k(s.exerciseId))}</span>
      </div>`}).join("");return`
    <div class="card rt-card">
      <div class="rt-head">
        <div class="rt-titlewrap">
          <div class="rt-name">${g(e.name)}</div>
          <div class="muted small rt-meta">${(e.exercises??[]).length} ejercicio${(e.exercises??[]).length===1?"":"s"}${e.dayOfWeek!==null&&e.dayOfWeek!==void 0?" · "+O[e.dayOfWeek]:""}</div>
        </div>
        ${r.length?`<div class="rt-zones">${r.map(s=>`<span class="rt-zone" title="${D(s)}" aria-label="${D(s)}">${T[s]}</span>`).join("")}</div>`:""}
      </div>
      ${d?`<div class="rt-grid">${d}</div>`:'<div class="empty small">Sin ejercicios.</div>'}
      <div class="rt-actions">
        <button type="button" data-dup="${e.id}" title="Duplicar" aria-label="Duplicar rutina">⧉</button>
        <button type="button" data-edit="${e.id}" title="Editar" aria-label="Editar rutina">✎</button>
        <button type="button" data-del="${e.id}" title="Eliminar" aria-label="Eliminar rutina">✕</button>
      </div>
    </div>`};for(const{f:e,rs:r}of x)v+=`<div class="sec-title"><span class="inl-ic">${R.folder}</span><span style="flex:1">${g(e.name)}</span><button class="icon-btn small" data-fren="${e.id}" title="Renombrar carpeta" aria-label="Renombrar carpeta">✎</button><button class="icon-btn small" data-fdel="${e.id}" title="Eliminar carpeta" aria-label="Eliminar carpeta">✕</button></div>`,v+=r.length?r.map(y).join(""):'<div class="empty">Vacía.</div>';h.length&&(v+='<div class="sec-title">Sin carpeta</div>'+h.map(y).join("")),a.length||(v+='<div class="empty">Sin rutinas. Crea la primera para entrenar con un plan.</div>'),i.innerHTML=v,document.getElementById("r-new")?.addEventListener("click",()=>E("/routines?id=new")),document.getElementById("r-folder")?.addEventListener("click",async()=>{const e=window.prompt("Nombre de la carpeta:");e?.trim()&&(await o.put("folders",{id:j(),name:e.trim()}),w(i,t))}),i.querySelectorAll("[data-fren]").forEach(e=>e.addEventListener("click",async()=>{const r=e.dataset.fren,d=await o.get("folders",r);if(!d)return;const s=window.prompt("Nombre de la carpeta:",d.name);if(s===null)return;const n=s.trim();if(!n){b("El nombre no puede estar vacío");return}await o.put("folders",{...d,name:n}),b("Carpeta renombrada"),w(i,t)})),i.querySelectorAll("[data-fdel]").forEach(e=>e.addEventListener("click",async()=>{const r=e.dataset.fdel,d=await o.get("folders",r);if(d&&await A(`¿Eliminar la carpeta «${d.name}»? Sus rutinas pasarán a "Sin carpeta".`)){for(const s of await o.all("routines"))s.folderId===r&&await o.put("routines",{...s,folderId:null,updatedAt:Date.now()});await o.del("folders",r),b("Carpeta eliminada"),w(i,t)}})),i.querySelectorAll("[data-edit]").forEach(e=>e.addEventListener("click",()=>E(`/routines?id=${e.dataset.edit}`))),i.querySelectorAll("[data-dup]").forEach(e=>e.addEventListener("click",async()=>{const r=e;if(!r.disabled){r.disabled=!0;try{const d=await o.get("routines",r.dataset.dup);d&&(await o.put("routines",{...d,id:j(),name:d.name+" (copia)",updatedAt:Date.now()}),b("Rutina duplicada"),w(i,t))}finally{r.disabled=!1}}})),i.querySelectorAll("[data-del]").forEach(e=>e.addEventListener("click",async()=>{await A("¿Eliminar esta rutina?")&&(await o.del("routines",e.dataset.del),w(i,t))}))}async function V(i,t){const c=await o.all("folders");if(t&&t!=="new"&&!await o.get("routines",t)){b("Rutina no encontrada"),E("/routines");return}let a=t&&t!=="new"?await o.get("routines",t)??L():L();Array.isArray(a.exercises)||(a.exercises=[]),(typeof a.dayOfWeek!="number"||a.dayOfWeek<0||a.dayOfWeek>6)&&(a.dayOfWeek=null);const m="mg-routine-draft:"+(t??"new"),I=()=>{try{const d=localStorage.getItem(m);if(!d)return null;const s=JSON.parse(d);return!s?.routine||!Array.isArray(s.routine.exercises)||typeof s.savedAt!="number"?null:s}catch{return null}},h=()=>{try{localStorage.removeItem(m)}catch{}},x=I();x&&(t==="new"||x.savedAt>(a.updatedAt??0))&&(a=x.routine,setTimeout(()=>b("Borrador recuperado"),50));let v=null,y=null;const e=()=>{v&&clearTimeout(v),v=setTimeout(()=>{try{if(!document.getElementById("ed-name")||!y)return;y(),localStorage.setItem(m,JSON.stringify({savedAt:Date.now(),routine:a}))}catch{}},600)},r=()=>{i.innerHTML=`
    <button class="linklike" id="ed-back">← Volver</button>
    <div class="sec-title">${t?"Editar rutina":"Nueva rutina"}</div>
    <div class="card">
      <label class="f">Nombre</label>
      <input type="text" id="ed-name" value="${g(a.name)}" />
      <div class="row">
        <div><label class="f">Carpeta</label>
          <select id="ed-folder">
            <option value="">Sin carpeta</option>
            ${c.map(n=>`<option value="${n.id}" ${a.folderId===n.id?"selected":""}>${g(n.name)}</option>`).join("")}
          </select></div>
        <div><label class="f">Día de la semana</label>
          <select id="ed-dow">
            <option value="">Sin asignar</option>
            ${O.map((n,l)=>`<option value="${l}" ${a.dayOfWeek===l?"selected":""}>${n}</option>`).join("")}
          </select></div>
      </div>
    </div>
    <div class="sec-title">Ejercicios (${a.exercises.length})</div>
    <div id="ed-list"></div>
    <button class="btn secondary" id="ed-add">＋ Añadir ejercicio</button>
    <button class="btn" id="ed-save" style="margin-top:10px">Guardar rutina</button>`;const d=document.getElementById("ed-list");d.innerHTML=a.exercises.map((n,l)=>{const f=M.get(n.exerciseId);return`<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
            ${f?.img?`<img class="ex-thumb" src="./${f.img}" alt="" loading="lazy" />`:`<span class="ex-thumb ex-thumb--ph" aria-hidden="true">${R.train}</span>`}
            <strong>${g(k(n.exerciseId))}</strong>
          </div>
          <span style="display:flex;gap:2px">
            <button class="icon-btn small" data-mv="${l}:-1" title="Subir" aria-label="Subir ejercicio" ${l===0?"disabled":""}>↑</button>
            <button class="icon-btn small" data-mv="${l}:1" title="Bajar" aria-label="Bajar ejercicio">↓</button>
            <button class="icon-btn small" data-rm="${l}" title="Quitar" aria-label="Quitar ejercicio">✕</button>
          </span>
        </div>
        <div class="muted small">${g(f?.primaryMuscle??"")} · ${g(f?.equipment??"")}</div>
        <div class="row" style="margin-top:8px">
          <div><label class="f">Series</label><input type="text" inputmode="numeric" data-f="${l}:targetSets" value="${n.targetSets??""}" /></div>
          <div><label class="f">Peso (kg)</label><input type="text" data-f="${l}:targetWeightKg" value="${n.targetWeightKg??""}" inputmode="decimal" /></div>
        </div>
        <div class="row">
          <div><label class="f">Reps mín</label><input type="text" inputmode="numeric" data-f="${l}:targetRepsMin" value="${n.targetRepsMin??""}" /></div>
          <div><label class="f">Reps máx</label><input type="text" inputmode="numeric" data-f="${l}:targetRepsMax" value="${n.targetRepsMax??""}" /></div>
          <div><label class="f">Descanso (s)</label><input type="text" inputmode="numeric" data-f="${l}:restSeconds" value="${n.restSeconds??""}" /></div>
        </div>
        <label class="f">Notas</label>
        <input type="text" data-f="${l}:notes" value="${g(n.notes)}" placeholder="Recordatorio de técnica…" />
      </div>`}).join("");const s=()=>{a.name=document.getElementById("ed-name").value.trim()||"Rutina sin nombre";const n=document.getElementById("ed-folder").value;a.folderId=n||null;const l=document.getElementById("ed-dow").value;a.dayOfWeek=l===""?null:+l,i.querySelectorAll("[data-f]").forEach(f=>{const[$,S]=f.dataset.f.split(":"),N=f.value;a.exercises[+$][S]=S==="notes"?N:B(N)})};y=s,document.getElementById("ed-back")?.addEventListener("click",async()=>{const n=JSON.stringify(a);if(s(),JSON.stringify(a)!==n){if(!await A("Tienes cambios sin guardar. ¿Salir sin guardar?"))return;h()}E("/routines")}),document.getElementById("ed-add")?.addEventListener("click",()=>{s(),z(n=>{(async()=>{const l=await W(n),f=await C();a.exercises.push({exerciseId:n,targetSets:3,targetWeightKg:null,targetRepsMin:8,targetRepsMax:12,targetDurationSeconds:null,restSeconds:l??f.defaultRestSeconds,notes:""}),r()})()},{duplicateName:n=>a.exercises.some(l=>l.exerciseId===n)?k(n):null})}),d.querySelectorAll("[data-rm]").forEach(n=>n.addEventListener("click",()=>{s(),a.exercises.splice(+n.dataset.rm,1),r()})),d.querySelectorAll("[data-mv]").forEach(n=>{n.disabled||n.addEventListener("click",()=>{s();const[l,f]=n.dataset.mv.split(":").map(Number),$=l+f;if($<0||$>=a.exercises.length)return;const[S]=a.exercises.splice(l,1);a.exercises.splice($,0,S),r()})}),document.getElementById("ed-save")?.addEventListener("click",async()=>{if(s(),!a.exercises.length){b("Añade al menos un ejercicio");return}const n=F(a);if(n){b(n);return}a.updatedAt=Date.now(),await o.put("routines",a),h(),b("Rutina guardada"),E("/routines")}),i.querySelectorAll("#ed-list input, #ed-name, #ed-folder, #ed-dow").forEach(n=>n.addEventListener("input",()=>e()))};r()}function F(i){for(const t of i.exercises??[]){const c=k(t.exerciseId);if(!Number.isInteger(t.targetSets)||t.targetSets<1||t.targetSets>100)return`Series inválidas en ${c} (1–100)`;if(t.targetWeightKg!==null&&t.targetWeightKg!==void 0&&!(t.targetWeightKg>=0&&t.targetWeightKg<=1e3))return`Peso inválido en ${c} (0–1000 kg)`;for(const[a,m]of[["Reps mín",t.targetRepsMin],["Reps máx",t.targetRepsMax]])if(m!=null&&!(Number.isInteger(m)&&m>=1&&m<=1e3))return`${a} inválidas en ${c} (1–1000)`;if(t.targetRepsMin!=null&&t.targetRepsMax!=null&&t.targetRepsMin>t.targetRepsMax)return`Reps mín > máx en ${c}`;if(!Number.isInteger(t.restSeconds)||t.restSeconds<0||t.restSeconds>3600)return`Descanso inválido en ${c} (0–3600 s)`}return null}function L(){return{id:j(),name:"",folderId:null,dayOfWeek:null,exercises:[],updatedAt:Date.now()}}export{w as renderRoutines};
