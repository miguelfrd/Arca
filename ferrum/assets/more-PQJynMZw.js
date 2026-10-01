const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./programs-uNVfOg-R.js","./index-CAlgwbyX.js","./index-Z7fleywS.css","./programs-DWfNA4vV.js","./types-E-ayykTU.js"])))=>i.map(i=>d[i]);
import{d as u,e as h,t as p,_ as E,g as A,k as x,m as C,i as k,c as L,f as _,n as B,o as T,p as D}from"./index-CAlgwbyX.js";import{P as R}from"./programs-DWfNA4vV.js";import{t as S}from"./types-E-ayykTU.js";const N=["title","start_time","end_time","description","exercise_title","superset_id","exercise_notes","set_index","set_type","weight_kg","reps","distance_km","duration_seconds","rpe"];function m(n){const e=n==null?"":String(n);return/[",\n]/.test(e)?`"${e.replace(/"/g,'""')}"`:e}function P(n){return new Date(n).toISOString()}function j(n,e){const a=[N.join(",")];for(const t of n)for(const s of t.exercises??[]){const r=e.get(s.exerciseId);for(const c of s.sets??[])c.done&&a.push([m(t.title),m(P(t.startTime)),m(t.endTime?P(t.endTime):""),m(t.description),m(r?.nameEs??s.exerciseId),m(c.supersetId??""),m(s.notes),m(c.setIndex),m(c.setType),m(c.weightKg??""),m(c.reps??""),m(c.distanceKm??""),m(c.durationSeconds??""),m(c.rpe??"")].join(","))}return a.join(`
`)}function O(n){n.charCodeAt(0)===65279&&(n=n.slice(1));const e=[];let a="",t=!1,s=!1,r=[];const c=()=>{r.push({v:a,q:s}),a="",s=!1},o=()=>{e.push(r),r=[]};for(let d=0;d<n.length;d++){const l=n[d];t?l==='"'?n[d+1]==='"'?(a+='"',d++):t=!1:a+=l:l==='"'?(t=!0,s=!0):l===","?c():l===`
`?(c(),o()):l==="\r"||(a+=l)}(a!==""||r.length)&&(c(),o());const i=(e.shift()??[]).map(d=>d.v.trim());return e.filter(d=>d.some(l=>l.v.trim()!=="")).map(d=>{const l={};return i.forEach((w,g)=>{l[w]=d[g]?.q?d[g].v:(d[g]?.v??"").trim()}),l})}function V(n,e){const a=new Map;for(const o of e.values())a.set(o.nameEs.toLowerCase(),o.id);const t=new Map;for(const o of n){const i=`${o.title??""}||${o.start_time??""}`;t.has(i)||t.set(i,[]),t.get(i).push(o)}const s=[],r=new Set;let c=0;for(const[,o]of t){const i=o[0],d=Date.parse(i.start_time??"");if(Number.isNaN(d))continue;const l=i.end_time??"",w={id:crypto.randomUUID(),title:i.title||"Sesión importada",startTime:d,endTime:l?Date.parse(l):null,description:i.description??"",exercises:[]},g=new Map;for(const f of o){const y=`${f.exercise_title??""}||${f.superset_id??""}`;g.has(y)||g.set(y,[]),g.get(y).push(f)}for(const[,f]of g){const y=f[0].exercise_title??"",$=a.get(y.toLowerCase());$?c++:r.add(y),w.exercises.push({exerciseId:$??`desconocido:${y}`,notes:f[0].exercise_notes??"",restSeconds:90,sets:f.map(v=>({setIndex:parseInt(v.set_index??"0",10)||0,setType:["warmup","normal","failure","dropset"].includes(v.set_type??"")?v.set_type:"normal",weightKg:b(v.weight_kg),reps:b(v.reps),distanceKm:b(v.distance_km),durationSeconds:b(v.duration_seconds),rpe:b(v.rpe),supersetId:v.superset_id||null,done:!0}))})}s.push(w)}return{workouts:s,matched:c,unmatched:[...r]}}function b(n){if(n===void 0||n==="")return null;const e=Number(n.replace(",","."));return Number.isNaN(e)?null:e}function M(n){const a=[["date","weight_kg","body_fat_pct","neck_cm","shoulders_cm","chest_cm","biceps_cm","forearms_cm","abdomen_cm","hips_cm","thighs_cm","calves_cm"].join(",")];for(const t of[...n].sort((s,r)=>s.date.localeCompare(r.date)))a.push([t.date,t.weightKg,t.bodyFatPct,t.neckCm,t.shouldersCm,t.chestCm,t.bicepsCm,t.forearmsCm,t.abdomenCm,t.hipsCm,t.thighsCm,t.calvesCm].map(s=>m(s??"")).join(","));return a.join(`
`)}async function K(n,e){const a=e.get("tab")??"programs";n.innerHTML=`
    <div class="screen-head"><h1>Más</h1></div><div class="chips">
      <button class="chip ${a==="programs"?"on":""}" data-tab="programs">Programas</button>
      <button class="chip ${a==="backup"?"on":""}" data-tab="backup">Copia de seguridad</button>
      <button class="chip ${a==="settings"?"on":""}" data-tab="settings">Ajustes</button>
    </div>
    <div id="more-body"></div>`;const t=document.getElementById("more-body"),s=async r=>{r==="programs"?await I(t):r==="backup"?q(t):U(t)};n.querySelectorAll("[data-tab]").forEach(r=>r.addEventListener("click",()=>{const c=r.dataset.tab;n.querySelectorAll("[data-tab]").forEach(o=>o.classList.toggle("on",o===r)),s(c)})),await s(a)}async function I(n){const e=await u.all("programState"),a=await u.all("exercises"),t=new Map(a.map(s=>[s.id,s]));n.innerHTML=R.map(s=>{const r=e.find(o=>o.programId===s.id),c=s.days[(r?.currentDayIndex??0)%s.days.length];return`<div class="card">
      <h3>${h(s.nameEs)}</h3>
      <div class="small muted">${h(s.level)} · ${s.daysPerWeek} días/semana</div>
      <p class="small" style="margin:8px 0">${h(s.descriptionEs)}</p>
      <div class="small"><strong>Progresión:</strong> ${h(s.progressionEs)}</div>
      <div class="sec-title">Días</div>
      ${s.days.map((o,i)=>`
        <div class="small" style="padding:5px 0;border-top:1px solid var(--border)">
          <strong>${h(o.name)}</strong> <span class="muted">· ${o.exercises.length} ejercicios</span>
          <div class="muted">${o.exercises.map(d=>h(t.get(d.exerciseId)?.nameEs??d.exerciseId)).join(" · ")}</div>
        </div>`).join("")}
      <div class="row" style="margin-top:10px">
        ${r?.active?`<button class="btn" data-start-day="${s.id}">Empezar: ${h(c.routineName)}</button>
             <button class="btn secondary" data-stop="${s.id}">Pausar programa</button>`:`<button class="btn secondary" data-activate="${s.id}">Activar programa</button>`}
      </div>
      ${r?.active?`<div class="small muted" style="margin-top:6px">Día actual: ${h(c.name)} · cargas sugeridas guardadas</div>`:""}
    </div>`}).join(""),n.querySelectorAll("[data-activate]").forEach(s=>s.addEventListener("click",async()=>{const r=s.dataset.activate;for(const c of e)c.active=!1,await u.put("programState",c);await u.put("programState",{programId:r,active:!0,currentDayIndex:0,loads:{},startedAt:Date.now()}),p("Programa activado"),I(n)})),n.querySelectorAll("[data-stop]").forEach(s=>s.addEventListener("click",async()=>{const r=e.find(c=>c.programId===s.dataset.stop);r&&(r.active=!1,await u.put("programState",r)),I(n)})),n.querySelectorAll("[data-start-day]").forEach(s=>s.addEventListener("click",async()=>{const r=s.dataset.startDay,{buildProgramDayWorkout:c}=await E(async()=>{const{buildProgramDayWorkout:d}=await import("./programs-uNVfOg-R.js");return{buildProgramDayWorkout:d}},__vite__mapDeps([0,1,2,3,4]),import.meta.url),o=await c(r);if(!o){p("El programa ya no está activo");return}const{saveActiveWorkout:i}=await E(async()=>{const{saveActiveWorkout:d}=await import("./index-CAlgwbyX.js").then(l=>l.q);return{saveActiveWorkout:d}},__vite__mapDeps([1,2]),import.meta.url);i(o),p("Carga sugerida aplicada donde había"),A("/train/active")}))}function q(n){n.innerHTML=`
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
    </div>`,document.getElementById("bk-export")?.addEventListener("click",async()=>{const e={app:"ferrum",version:1,exportedAt:new Date().toISOString()};for(const a of["exercises","routines","folders","workouts","measurements","programState","kv","aliases"])e[a]=await u.all(a);e.progressPhotos=await Promise.all((await u.all("progressPhotos")).map(async a=>({date:a.date,dataUrl:await H(a.blob)}))),x(new Blob([JSON.stringify(e)],{type:"application/json"}),`ferrum-backup-${S()}.json`),p("Copia exportada")}),document.getElementById("bk-import")?.addEventListener("click",async()=>{const e=await C("application/json,.json");if(e&&await k("¿Importar la copia? Se reemplazarán los datos actuales."))try{const a=JSON.parse(await e.text());if(a.app!=="ferrum")throw new Error("No es una copia de Ferrum");for(const o of["routines","folders","workouts","measurements","programState","kv","aliases"]){await u.clear(o);const i=a[o];Array.isArray(i)&&await u.bulkPut(o,i)}await u.clear("progressPhotos");const t=a.progressPhotos;Array.isArray(t)&&await u.bulkPut("progressPhotos",await Promise.all(t.map(async o=>({date:o.date,blob:await z(o.dataUrl)}))));const s=(await u.all("exercises")).filter(o=>o.isCustom);await u.clear("exercises");const{EXERCISE_LIBRARY:r}=await E(async()=>{const{EXERCISE_LIBRARY:o}=await import("./exercises-CO3hLbW8.js");return{EXERCISE_LIBRARY:o}},[],import.meta.url);await u.bulkPut("exercises",[...r,...s,...(a.exercises??[]).filter(o=>o.isCustom&&!s.some(i=>i.id===o.id))]);const{saveActiveWorkout:c}=await E(async()=>{const{saveActiveWorkout:o}=await import("./index-CAlgwbyX.js").then(i=>i.q);return{saveActiveWorkout:o}},__vite__mapDeps([1,2]),import.meta.url);c(null),p("Copia importada")}catch(a){console.error(a),p("No se pudo importar la copia")}}),document.getElementById("bk-csv-w")?.addEventListener("click",async()=>{const e=new Map((await u.all("exercises")).map(t=>[t.id,t])),a=j(await u.workoutsDesc(),e);x(new Blob([a],{type:"text/csv"}),`ferrum-workouts-${S()}.csv`),p("CSV exportado")}),document.getElementById("bk-csv-m")?.addEventListener("click",async()=>{const e=M(await u.all("measurements"));x(new Blob([e],{type:"text/csv"}),`ferrum-measurements-${S()}.csv`),p("CSV exportado")}),document.getElementById("bk-csv-in")?.addEventListener("click",async()=>{const e=await C("text/csv,.csv");if(!e)return;const a=document.getElementById("bk-msg");try{const t=O(await e.text()),s=new Map((await u.all("exercises")).map(l=>[l.id,l])),{workouts:r,matched:c,unmatched:o}=V(t,s);if(!r.length){a.textContent="No se encontraron sesiones en el CSV.";return}if(!await k(`Importar ${r.length} sesiones? (${c} ejercicios enlazados)`))return;const i=new Set((await u.all("workouts")).map(l=>`${l.title}||${l.startTime}`)),d=r.filter(l=>!i.has(`${l.title}||${l.startTime}`));d.forEach(l=>i.add(`${l.title}||${l.startTime}`)),await u.bulkPut("workouts",d),a.textContent=`${d.length} sesiones importadas.`+(r.length-d.length?` (${r.length-d.length} ya existían, omitidas)`:"")+(o.length?` Sin coincidencia: ${o.slice(0,5).join(", ")}${o.length>5?"…":""}`:""),p("Importación completada")}catch(t){console.error(t),a.textContent="No se pudo leer el CSV."}}),document.getElementById("bk-wipe")?.addEventListener("click",async()=>{if(await k("¿BORRAR TODO? Entrenamientos, rutinas, medidas y fotos. Esta acción no se puede deshacer.")&&await k("Última confirmación: ¿borrar todos los datos de Ferrum?")){for(const e of["routines","folders","workouts","measurements","progressPhotos","programState","aliases"])await u.clear(e);localStorage.removeItem("mg-active-workout"),p("Datos borrados")}})}function H(n){return new Promise((e,a)=>{const t=new FileReader;t.onload=()=>e(t.result),t.onerror=()=>a(t.error),t.readAsDataURL(n)})}async function z(n){return(await fetch(n)).blob()}function U(n){L().then(e=>{const a=typeof e.hue=="number"?e.hue:262;n.innerHTML=`
    <div class="sec-title">Personalización</div>
    <div class="card">
      <label class="f" style="margin-top:0">Tema</label>
      <div class="seg" id="s-theme">
        <button data-theme-val="light" class="${e.theme==="light"?"on":""}">Claro</button>
        <button data-theme-val="dark" class="${e.theme==="dark"?"on":""}">Oscuro</button>
      </div>
      <label class="f">Color de fondo</label>
      <div class="hue-row">
        <span class="hue-swatch" id="hue-swatch" style="background:hsl(${a},32%,88%)"></span>
        <input type="range" class="hue" id="hue-range" min="0" max="360" step="1" value="${a}" aria-label="Tono del fondo" />
        <span class="hue-deg" id="hue-deg">${a}°</span>
      </div>
    </div>
    <div class="sec-title">Ajustes</div>
    <div class="card">
      <div class="row" style="align-items:center">
        <div><strong>RPE por serie</strong><div class="small muted">Esfuerzo percibido (1-10)</div></div>
        <input type="checkbox" id="s-rpe" ${e.rpeEnabled?"checked":""} style="width:auto;flex:0 0 auto" />
      </div><hr class="divider" />
      <div class="row" style="align-items:center">
        <div><strong>Sonido del temporizador</strong></div>
        <input type="checkbox" id="s-sound" ${e.soundEnabled?"checked":""} style="width:auto;flex:0 0 auto" />
      </div><hr class="divider" />
      <label class="f">Descanso por defecto (segundos)</label>
      <input type="text" id="s-rest" value="${e.defaultRestSeconds}" inputmode="numeric" />
      <div class="small muted" style="margin-top:12px">Unidades: kilogramos · Idioma: español</div>
    </div>
    <div class="sec-title">Privacidad</div>
    <div class="card">
      <div class="rowline">
        <div><strong>Bloquear ahora</strong><div class="small muted">Pide el PIN al volver a abrir</div></div>
        <button class="btn secondary small" id="s-lock" style="flex:0 0 auto">Bloquear</button>
      </div>
    </div>
    <div class="sec-title">Acerca de</div>
    <div class="card small muted">
      Ferrum v1.0 — tus datos viven solo en este móvil (IndexedDB), sin cuentas ni servidores.
      Haz copias de seguridad desde la pestaña «Copia de seguridad».
    </div>`,document.querySelectorAll("#s-theme button").forEach(i=>i.addEventListener("click",async()=>{e.theme=i.dataset.themeVal,await _(e),await B(),document.querySelectorAll("#s-theme button").forEach(d=>d.classList.toggle("on",d.dataset.themeVal===e.theme))}));const t=document.getElementById("hue-range"),s=document.getElementById("hue-swatch"),r=document.getElementById("hue-deg"),c=i=>{document.documentElement.style.setProperty("--bgh",String(i)),s.style.background=`hsl(${i},32%,88%)`,r.textContent=`${i}°`};t.addEventListener("input",()=>c(Number(t.value))),t.addEventListener("change",async()=>{e.hue=Number(t.value),await _(e),p("Tono guardado")});const o=async()=>{e.rpeEnabled=document.getElementById("s-rpe").checked,e.soundEnabled=document.getElementById("s-sound").checked;const i=D(document.getElementById("s-rest").value);e.defaultRestSeconds=Math.max(0,i===null?90:Math.round(i)),await _(e),p("Ajustes guardados")};["s-rpe","s-sound","s-rest"].forEach(i=>document.getElementById(i)?.addEventListener("change",o)),document.getElementById("s-lock")?.addEventListener("click",()=>{T(),location.reload()})})}export{K as renderMore};
