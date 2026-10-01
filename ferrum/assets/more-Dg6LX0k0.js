const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./programs-CafXnqks.js","./index-DPm309OK.js","./index-DExAkZHP.css","./programs-DWfNA4vV.js","./types-E-ayykTU.js"])))=>i.map(i=>d[i]);
import{d as u,e as f,t as p,_ as E,g as P,k as x,m as $,i as k,c as A,n as B,p as L,f as D}from"./index-DPm309OK.js";import{P as R}from"./programs-DWfNA4vV.js";import{t as _}from"./types-E-ayykTU.js";const T=["title","start_time","end_time","description","exercise_title","superset_id","exercise_notes","set_index","set_type","weight_kg","reps","distance_km","duration_seconds","rpe"];function m(r){const t=r==null?"":String(r);return/[",\n]/.test(t)?`"${t.replace(/"/g,'""')}"`:t}function C(r){return new Date(r).toISOString()}function j(r,t){const a=[T.join(",")];for(const e of r)for(const s of e.exercises??[]){const n=t.get(s.exerciseId);for(const i of s.sets??[])i.done&&a.push([m(e.title),m(C(e.startTime)),m(e.endTime?C(e.endTime):""),m(e.description),m(n?.nameEs??s.exerciseId),m(i.supersetId??""),m(s.notes),m(i.setIndex),m(i.setType),m(i.weightKg??""),m(i.reps??""),m(i.distanceKm??""),m(i.durationSeconds??""),m(i.rpe??"")].join(","))}return a.join(`
`)}function N(r){r.charCodeAt(0)===65279&&(r=r.slice(1));const t=[];let a="",e=!1,s=!1,n=[];const i=()=>{n.push({v:a,q:s}),a="",s=!1},o=()=>{t.push(n),n=[]};for(let c=0;c<r.length;c++){const d=r[c];e?d==='"'?r[c+1]==='"'?(a+='"',c++):e=!1:a+=d:d==='"'?(e=!0,s=!0):d===","?i():d===`
`?(i(),o()):d==="\r"||(a+=d)}(a!==""||n.length)&&(i(),o());const l=(t.shift()??[]).map(c=>c.v.trim());return t.filter(c=>c.some(d=>d.v.trim()!=="")).map(c=>{const d={};return l.forEach((h,g)=>{d[h]=c[g]?.q?c[g].v:(c[g]?.v??"").trim()}),d})}function O(r,t){const a=new Map;for(const o of t.values())a.set(o.nameEs.toLowerCase(),o.id);const e=new Map;for(const o of r){const l=`${o.title??""}||${o.start_time??""}`;e.has(l)||e.set(l,[]),e.get(l).push(o)}const s=[],n=new Set;let i=0;for(const[,o]of e){const l=o[0],c=Date.parse(l.start_time??"");if(Number.isNaN(c))continue;const d=l.end_time??"",h={id:crypto.randomUUID(),title:l.title||"Sesión importada",startTime:c,endTime:d?Date.parse(d):null,description:l.description??"",exercises:[]},g=new Map;for(const y of o){const b=`${y.exercise_title??""}||${y.superset_id??""}`;g.has(b)||g.set(b,[]),g.get(b).push(y)}for(const[,y]of g){const b=y[0].exercise_title??"",I=a.get(b.toLowerCase());I?i++:n.add(b),h.exercises.push({exerciseId:I??`desconocido:${b}`,notes:y[0].exercise_notes??"",restSeconds:90,sets:y.map(v=>({setIndex:parseInt(v.set_index??"0",10)||0,setType:["warmup","normal","failure","dropset"].includes(v.set_type??"")?v.set_type:"normal",weightKg:w(v.weight_kg),reps:w(v.reps),distanceKm:w(v.distance_km),durationSeconds:w(v.duration_seconds),rpe:w(v.rpe),supersetId:v.superset_id||null,done:!0}))})}s.push(h)}return{workouts:s,matched:i,unmatched:[...n]}}function w(r){if(r===void 0||r==="")return null;const t=Number(r.replace(",","."));return Number.isNaN(t)?null:t}function M(r){const a=[["date","weight_kg","body_fat_pct","neck_cm","shoulders_cm","chest_cm","biceps_cm","forearms_cm","abdomen_cm","hips_cm","thighs_cm","calves_cm"].join(",")];for(const e of[...r].sort((s,n)=>s.date.localeCompare(n.date)))a.push([e.date,e.weightKg,e.bodyFatPct,e.neckCm,e.shouldersCm,e.chestCm,e.bicepsCm,e.forearmsCm,e.abdomenCm,e.hipsCm,e.thighsCm,e.calvesCm].map(s=>m(s??"")).join(","));return a.join(`
`)}async function J(r,t){const a=t.get("tab")??"programs";r.innerHTML=`
    <div class="chips">
      <button class="chip ${a==="programs"?"on":""}" data-tab="programs">Programas</button>
      <button class="chip ${a==="backup"?"on":""}" data-tab="backup">Copia de seguridad</button>
      <button class="chip ${a==="settings"?"on":""}" data-tab="settings">Ajustes</button>
    </div>
    <div id="more-body"></div>`;const e=document.getElementById("more-body"),s=async n=>{n==="programs"?await S(e):n==="backup"?V(e):U(e)};r.querySelectorAll("[data-tab]").forEach(n=>n.addEventListener("click",()=>{const i=n.dataset.tab;r.querySelectorAll("[data-tab]").forEach(o=>o.classList.toggle("on",o===n)),s(i)})),await s(a)}async function S(r){const t=await u.all("programState"),a=await u.all("exercises"),e=new Map(a.map(s=>[s.id,s]));r.innerHTML=R.map(s=>{const n=t.find(o=>o.programId===s.id),i=s.days[(n?.currentDayIndex??0)%s.days.length];return`<div class="card">
      <h3>${f(s.nameEs)}</h3>
      <div class="small muted">${f(s.level)} · ${s.daysPerWeek} días/semana</div>
      <p class="small" style="margin:8px 0">${f(s.descriptionEs)}</p>
      <div class="small"><strong>Progresión:</strong> ${f(s.progressionEs)}</div>
      <div class="sec-title">Días</div>
      ${s.days.map((o,l)=>`
        <div class="small" style="padding:5px 0;border-top:1px solid var(--border)">
          <strong>${f(o.name)}</strong> <span class="muted">· ${o.exercises.length} ejercicios</span>
          <div class="muted">${o.exercises.map(c=>f(e.get(c.exerciseId)?.nameEs??c.exerciseId)).join(" · ")}</div>
        </div>`).join("")}
      <div class="row" style="margin-top:10px">
        ${n?.active?`<button class="btn" data-start-day="${s.id}">Empezar: ${f(i.routineName)}</button>
             <button class="btn secondary" data-stop="${s.id}">Pausar programa</button>`:`<button class="btn secondary" data-activate="${s.id}">Activar programa</button>`}
      </div>
      ${n?.active?`<div class="small muted" style="margin-top:6px">Día actual: ${f(i.name)} · cargas sugeridas guardadas</div>`:""}
    </div>`}).join(""),r.querySelectorAll("[data-activate]").forEach(s=>s.addEventListener("click",async()=>{const n=s.dataset.activate;for(const i of t)i.active=!1,await u.put("programState",i);await u.put("programState",{programId:n,active:!0,currentDayIndex:0,loads:{},startedAt:Date.now()}),p("Programa activado"),S(r)})),r.querySelectorAll("[data-stop]").forEach(s=>s.addEventListener("click",async()=>{const n=t.find(i=>i.programId===s.dataset.stop);n&&(n.active=!1,await u.put("programState",n)),S(r)})),r.querySelectorAll("[data-start-day]").forEach(s=>s.addEventListener("click",async()=>{const n=s.dataset.startDay,{buildProgramDayWorkout:i}=await E(async()=>{const{buildProgramDayWorkout:c}=await import("./programs-CafXnqks.js");return{buildProgramDayWorkout:c}},__vite__mapDeps([0,1,2,3,4]),import.meta.url),o=await i(n);if(!o){p("El programa ya no está activo");return}const{saveActiveWorkout:l}=await E(async()=>{const{saveActiveWorkout:c}=await import("./index-DPm309OK.js").then(d=>d.o);return{saveActiveWorkout:c}},__vite__mapDeps([1,2]),import.meta.url);l(o),p("Carga sugerida aplicada donde había"),P("/train/active")}))}function V(r){r.innerHTML=`
    <div class="sec-title">Copia completa (JSON)</div>
    <div class="card">
      <p class="small muted" style="margin-top:0">Incluye entrenamientos, rutinas, ejercicios personalizados, medidas y ajustes. Las fotos no viajan en el JSON (expórtalas aparte si las necesitas).</p>
      <div class="row">
        <button class="btn" id="bk-export">Exportar JSON</button>
        <button class="btn secondary" id="bk-import">Importar JSON</button>
      </div>
    </div>
    <div class="sec-title">CSV compatible con Hevy</div>
    <div class="card">
      <p class="small muted" style="margin-top:0">Mismas columnas que Hevy: sirve para llevar tus datos a Hevy o traerlos desde allí.</p>
      <button class="btn secondary" id="bk-csv-w">Exportar entrenamientos (CSV)</button>
      <button class="btn secondary" id="bk-csv-m" style="margin-top:8px">Exportar medidas (CSV)</button>
      <button class="btn secondary" id="bk-csv-in" style="margin-top:8px">Importar CSV de Hevy</button>
      <div class="small muted" id="bk-msg" style="margin-top:8px"></div>
    </div>
    <div class="sec-title">Zona de peligro</div>
    <div class="card">
      <button class="btn danger" id="bk-wipe">Borrar todos los datos</button>
    </div>`,document.getElementById("bk-export")?.addEventListener("click",async()=>{const t={app:"ferrum",version:1,exportedAt:new Date().toISOString()};for(const a of["exercises","routines","folders","workouts","measurements","programState","kv","aliases"])t[a]=await u.all(a);t.progressPhotos=await Promise.all((await u.all("progressPhotos")).map(async a=>({date:a.date,dataUrl:await q(a.blob)}))),x(new Blob([JSON.stringify(t)],{type:"application/json"}),`ferrum-backup-${_()}.json`),p("Copia exportada")}),document.getElementById("bk-import")?.addEventListener("click",async()=>{const t=await $("application/json,.json");if(t&&await k("¿Importar la copia? Se reemplazarán los datos actuales."))try{const a=JSON.parse(await t.text());if(a.app!=="ferrum")throw new Error("No es una copia de Ferrum");for(const o of["routines","folders","workouts","measurements","programState","kv","aliases"]){await u.clear(o);const l=a[o];Array.isArray(l)&&await u.bulkPut(o,l)}await u.clear("progressPhotos");const e=a.progressPhotos;Array.isArray(e)&&await u.bulkPut("progressPhotos",await Promise.all(e.map(async o=>({date:o.date,blob:await H(o.dataUrl)}))));const s=(await u.all("exercises")).filter(o=>o.isCustom);await u.clear("exercises");const{EXERCISE_LIBRARY:n}=await E(async()=>{const{EXERCISE_LIBRARY:o}=await import("./exercises-CO3hLbW8.js");return{EXERCISE_LIBRARY:o}},[],import.meta.url);await u.bulkPut("exercises",[...n,...s,...(a.exercises??[]).filter(o=>o.isCustom&&!s.some(l=>l.id===o.id))]);const{saveActiveWorkout:i}=await E(async()=>{const{saveActiveWorkout:o}=await import("./index-DPm309OK.js").then(l=>l.o);return{saveActiveWorkout:o}},__vite__mapDeps([1,2]),import.meta.url);i(null),p("Copia importada")}catch(a){console.error(a),p("No se pudo importar la copia")}}),document.getElementById("bk-csv-w")?.addEventListener("click",async()=>{const t=new Map((await u.all("exercises")).map(e=>[e.id,e])),a=j(await u.workoutsDesc(),t);x(new Blob([a],{type:"text/csv"}),`ferrum-workouts-${_()}.csv`),p("CSV exportado")}),document.getElementById("bk-csv-m")?.addEventListener("click",async()=>{const t=M(await u.all("measurements"));x(new Blob([t],{type:"text/csv"}),`ferrum-measurements-${_()}.csv`),p("CSV exportado")}),document.getElementById("bk-csv-in")?.addEventListener("click",async()=>{const t=await $("text/csv,.csv");if(!t)return;const a=document.getElementById("bk-msg");try{const e=N(await t.text()),s=new Map((await u.all("exercises")).map(d=>[d.id,d])),{workouts:n,matched:i,unmatched:o}=O(e,s);if(!n.length){a.textContent="No se encontraron sesiones en el CSV.";return}if(!await k(`Importar ${n.length} sesiones? (${i} ejercicios enlazados)`))return;const l=new Set((await u.all("workouts")).map(d=>`${d.title}||${d.startTime}`)),c=n.filter(d=>!l.has(`${d.title}||${d.startTime}`));c.forEach(d=>l.add(`${d.title}||${d.startTime}`)),await u.bulkPut("workouts",c),a.textContent=`${c.length} sesiones importadas.`+(n.length-c.length?` (${n.length-c.length} ya existían, omitidas)`:"")+(o.length?` Sin coincidencia: ${o.slice(0,5).join(", ")}${o.length>5?"…":""}`:""),p("Importación completada")}catch(e){console.error(e),a.textContent="No se pudo leer el CSV."}}),document.getElementById("bk-wipe")?.addEventListener("click",async()=>{if(await k("¿BORRAR TODO? Entrenamientos, rutinas, medidas y fotos. Esta acción no se puede deshacer.")&&await k("Última confirmación: ¿borrar todos los datos de Ferrum?")){for(const t of["routines","folders","workouts","measurements","progressPhotos","programState","aliases"])await u.clear(t);localStorage.removeItem("mg-active-workout"),p("Datos borrados")}})}function q(r){return new Promise((t,a)=>{const e=new FileReader;e.onload=()=>t(e.result),e.onerror=()=>a(e.error),e.readAsDataURL(r)})}async function H(r){return(await fetch(r)).blob()}function U(r){A().then(t=>{r.innerHTML=`
    <div class="sec-title">Ajustes</div>
    <div class="card">
      <div class="row" style="align-items:center">
        <div><strong>RPE por serie</strong><div class="small muted">Esfuerzo percibido (1-10)</div></div>
        <input type="checkbox" id="s-rpe" ${t.rpeEnabled?"checked":""} style="width:auto;flex:0 0 auto" />
      </div><hr class="divider" />
      <div class="row" style="align-items:center">
        <div><strong>Sonido del temporizador</strong></div>
        <input type="checkbox" id="s-sound" ${t.soundEnabled?"checked":""} style="width:auto;flex:0 0 auto" />
      </div><hr class="divider" />
      <label class="f">Descanso por defecto (segundos)</label>
      <input type="text" id="s-rest" value="${t.defaultRestSeconds}" inputmode="numeric" />
      <div class="small muted" style="margin-top:12px">Unidades: kilogramos · Idioma: español · Tema: arriba a la derecha (◐)</div>
    </div>
    <div class="sec-title">Privacidad</div>
    <div class="card">
      <div class="row" style="align-items:center">
        <div><strong>Bloquear ahora</strong><div class="small muted">Pide el PIN al volver a abrir</div></div>
        <button class="btn secondary" id="s-lock" style="flex:0 0 auto">Bloquear</button>
      </div>
    </div>
    <div class="sec-title">Acerca de</div>
    <div class="card small muted">
      Ferrum v1.0 — tus datos viven solo en este móvil (IndexedDB), sin cuentas ni servidores.
      Haz copias de seguridad desde la pestaña «Copia de seguridad».
    </div>`;const a=async()=>{t.rpeEnabled=document.getElementById("s-rpe").checked,t.soundEnabled=document.getElementById("s-sound").checked;const e=L(document.getElementById("s-rest").value);t.defaultRestSeconds=Math.max(0,e===null?90:Math.round(e)),await D(t),p("Ajustes guardados")};["s-rpe","s-sound","s-rest"].forEach(e=>document.getElementById(e)?.addEventListener("change",a)),document.getElementById("s-lock")?.addEventListener("click",()=>{B(),location.reload()})})}export{J as renderMore};
