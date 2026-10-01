const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-CeAX9hAb.js","./index-DOfP6aYA.css"])))=>i.map(i=>d[i]);
import{d as u,i as k,t as v,j as I,c as b,_ as S,b as B,k as E,m as $,n as T,p as L}from"./index-CeAX9hAb.js";import{t as x}from"./types-CEDv8i23.js";const P=["title","start_time","end_time","description","exercise_title","superset_id","exercise_notes","set_index","set_type","weight_kg","reps","distance_km","duration_seconds","rpe"];function m(o){const t=o==null?"":String(o);return/[",\n]/.test(t)?`"${t.replace(/"/g,'""')}"`:t}function C(o){return new Date(o).toISOString()}function R(o,t){const s=[P.join(",")];for(const e of o)for(const i of e.exercises??[]){const l=t.get(i.exerciseId);for(const c of i.sets??[])c.done&&s.push([m(e.title),m(C(e.startTime)),m(e.endTime?C(e.endTime):""),m(e.description),m(l?.nameEs??i.exerciseId),m(c.supersetId??""),m(i.notes),m(c.setIndex),m(c.setType),m(c.weightKg??""),m(c.reps??""),m(c.distanceKm??""),m(c.durationSeconds??""),m(c.rpe??"")].join(","))}return s.join(`
`)}function N(o){o.charCodeAt(0)===65279&&(o=o.slice(1));const t=[];let s="",e=!1,i=!1,l=[];const c=()=>{l.push({v:s,q:i}),s="",i=!1},a=()=>{t.push(l),l=[]};for(let d=0;d<o.length;d++){const r=o[d];e?r==='"'?o[d+1]==='"'?(s+='"',d++):e=!1:s+=r:r==='"'?(e=!0,i=!0):r===","?c():r===`
`?(c(),a()):r==="\r"||(s+=r)}(s!==""||l.length)&&(c(),a());const n=(t.shift()??[]).map(d=>d.v.trim());return t.filter(d=>d.some(r=>r.v.trim()!=="")).map(d=>{const r={};return n.forEach((w,h)=>{r[w]=d[h]?.q?d[h].v:(d[h]?.v??"").trim()}),r})}function j(o,t){const s=new Map;for(const a of t.values())s.set(a.nameEs.toLowerCase(),a.id);const e=new Map;for(const a of o){const n=`${a.title??""}||${a.start_time??""}`;e.has(n)||e.set(n,[]),e.get(n).push(a)}const i=[],l=new Set;let c=0;for(const[,a]of e){const n=a[0],d=Date.parse(n.start_time??"");if(Number.isNaN(d))continue;const r=n.end_time??"",w={id:crypto.randomUUID(),title:n.title||"Sesión importada",startTime:d,endTime:r?Date.parse(r):null,description:n.description??"",exercises:[]},h=new Map;for(const g of a){const f=`${g.exercise_title??""}||${g.superset_id??""}`;h.has(f)||h.set(f,[]),h.get(f).push(g)}for(const[,g]of h){const f=g[0].exercise_title??"",_=s.get(f.toLowerCase());_?c++:l.add(f),w.exercises.push({exerciseId:_??`desconocido:${f}`,notes:g[0].exercise_notes??"",restSeconds:90,sets:g.map(p=>({setIndex:parseInt(p.set_index??"0",10)||0,setType:["warmup","normal","failure","dropset"].includes(p.set_type??"")?p.set_type:"normal",weightKg:y(p.weight_kg),reps:y(p.reps),distanceKm:y(p.distance_km),durationSeconds:y(p.duration_seconds),rpe:y(p.rpe),supersetId:p.superset_id||null,done:!0}))})}i.push(w)}return{workouts:i,matched:c,unmatched:[...l]}}function y(o){if(o===void 0||o==="")return null;const t=Number(o.replace(",","."));return Number.isNaN(t)?null:t}function A(o){const s=[["date","weight_kg","body_fat_pct","neck_cm","shoulders_cm","chest_cm","biceps_cm","forearms_cm","abdomen_cm","hips_cm","thighs_cm","calves_cm"].join(",")];for(const e of[...o].sort((i,l)=>i.date.localeCompare(l.date)))s.push([e.date,e.weightKg,e.bodyFatPct,e.neckCm,e.shouldersCm,e.chestCm,e.bicepsCm,e.forearmsCm,e.abdomenCm,e.hipsCm,e.thighsCm,e.calvesCm].map(i=>m(i??"")).join(","));return s.join(`
`)}async function z(o,t){o.innerHTML=`
    <div class="screen-head"><h1>Ajustes</h1></div>
    <div id="more-body"></div>`;const s=document.getElementById("more-body");D(s);const e=document.createElement("div");s.appendChild(e),M(e)}function D(o){o.innerHTML=`
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
    </div>`,document.getElementById("bk-export")?.addEventListener("click",async()=>{const t={app:"ferrum",version:1,exportedAt:new Date().toISOString()};for(const s of["exercises","routines","folders","workouts","measurements","programState","kv","aliases"])t[s]=await u.all(s);t.progressPhotos=await Promise.all((await u.all("progressPhotos")).map(async s=>({date:s.date,dataUrl:await O(s.blob)}))),k(new Blob([JSON.stringify(t)],{type:"application/json"}),`ferrum-backup-${x()}.json`),v("Copia exportada")}),document.getElementById("bk-import")?.addEventListener("click",async()=>{const t=await I("application/json,.json");if(t&&await b("¿Importar la copia? Se reemplazarán los datos actuales."))try{const s=JSON.parse(await t.text());if(s.app!=="ferrum")throw new Error("No es una copia de Ferrum");for(const a of["routines","folders","workouts","measurements","programState","kv","aliases"]){await u.clear(a);const n=s[a];Array.isArray(n)&&await u.bulkPut(a,n)}await u.clear("progressPhotos");const e=s.progressPhotos;Array.isArray(e)&&await u.bulkPut("progressPhotos",await Promise.all(e.map(async a=>({date:a.date,blob:await V(a.dataUrl)}))));const i=(await u.all("exercises")).filter(a=>a.isCustom);await u.clear("exercises");const{EXERCISE_LIBRARY:l}=await S(async()=>{const{EXERCISE_LIBRARY:a}=await import("./exercises-DhYM_COh.js");return{EXERCISE_LIBRARY:a}},[],import.meta.url);await u.bulkPut("exercises",[...l,...i,...(s.exercises??[]).filter(a=>a.isCustom&&!i.some(n=>n.id===a.id))]);const{saveActiveWorkout:c}=await S(async()=>{const{saveActiveWorkout:a}=await import("./index-CeAX9hAb.js").then(n=>n.o);return{saveActiveWorkout:a}},__vite__mapDeps([0,1]),import.meta.url);c(null),v("Copia importada")}catch(s){console.error(s),v("No se pudo importar la copia")}}),document.getElementById("bk-csv-w")?.addEventListener("click",async()=>{const t=new Map((await u.all("exercises")).map(e=>[e.id,e])),s=R(await u.workoutsDesc(),t);k(new Blob([s],{type:"text/csv"}),`ferrum-workouts-${x()}.csv`),v("CSV exportado")}),document.getElementById("bk-csv-m")?.addEventListener("click",async()=>{const t=A(await u.all("measurements"));k(new Blob([t],{type:"text/csv"}),`ferrum-measurements-${x()}.csv`),v("CSV exportado")}),document.getElementById("bk-csv-in")?.addEventListener("click",async()=>{const t=await I("text/csv,.csv");if(!t)return;const s=document.getElementById("bk-msg");try{const e=N(await t.text()),i=new Map((await u.all("exercises")).map(r=>[r.id,r])),{workouts:l,matched:c,unmatched:a}=j(e,i);if(!l.length){s.textContent="No se encontraron sesiones en el CSV.";return}if(!await b(`Importar ${l.length} sesiones? (${c} ejercicios enlazados)`))return;const n=new Set((await u.all("workouts")).map(r=>`${r.title}||${r.startTime}`)),d=l.filter(r=>!n.has(`${r.title}||${r.startTime}`));d.forEach(r=>n.add(`${r.title}||${r.startTime}`)),await u.bulkPut("workouts",d),s.textContent=`${d.length} sesiones importadas.`+(l.length-d.length?` (${l.length-d.length} ya existían, omitidas)`:"")+(a.length?` Sin coincidencia: ${a.slice(0,5).join(", ")}${a.length>5?"…":""}`:""),v("Importación completada")}catch(e){console.error(e),s.textContent="No se pudo leer el CSV."}}),document.getElementById("bk-wipe")?.addEventListener("click",async()=>{if(await b("¿BORRAR TODO? Entrenamientos, rutinas, medidas y fotos. Esta acción no se puede deshacer.")&&await b("Última confirmación: ¿borrar todos los datos de Ferrum?")){for(const t of["routines","folders","workouts","measurements","progressPhotos","programState","aliases"])await u.clear(t);localStorage.removeItem("mg-active-workout"),v("Datos borrados")}})}function O(o){return new Promise((t,s)=>{const e=new FileReader;e.onload=()=>t(e.result),e.onerror=()=>s(e.error),e.readAsDataURL(o)})}async function V(o){return(await fetch(o)).blob()}function M(o){B().then(t=>{const s=typeof t.hue=="number"?t.hue:262;o.innerHTML=`
    <div class="sec-title">Personalización</div>
    <div class="card">
      <label class="f" style="margin-top:0">Tema</label>
      <select id="s-theme">
        <option value="light" ${t.theme==="light"?"selected":""}>Claro</option>
        <option value="dark" ${t.theme==="dark"?"selected":""}>Oscuro</option>
      </select>
      <label class="f">Color de fondo</label>
      <div class="hue-row">
        <span class="hue-swatch" id="hue-swatch" style="background:hsl(${s},32%,88%)"></span>
        <input type="range" class="hue" id="hue-range" min="0" max="360" step="1" value="${s}" aria-label="Tono del fondo" />
        <span class="hue-deg" id="hue-deg">${s}°</span>
      </div>
    </div>
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
      Haz copias de seguridad desde el apartado «Copia de seguridad» de esta misma pantalla.
    </div>`,document.getElementById("s-theme")?.addEventListener("change",async n=>{t.theme=n.target.value,await E(t),await $()});const e=document.getElementById("hue-range"),i=document.getElementById("hue-swatch"),l=document.getElementById("hue-deg"),c=n=>{document.documentElement.style.setProperty("--bgh",String(n)),i.style.background=`hsl(${n},32%,88%)`,l.textContent=`${n}°`};e.addEventListener("input",()=>c(Number(e.value))),e.addEventListener("change",async()=>{t.hue=Number(e.value),await E(t),v("Tono guardado")});const a=async()=>{t.rpeEnabled=document.getElementById("s-rpe").checked,t.soundEnabled=document.getElementById("s-sound").checked;const n=L(document.getElementById("s-rest").value);t.defaultRestSeconds=Math.max(0,n===null?90:Math.round(n)),await E(t),v("Ajustes guardados")};["s-rpe","s-sound","s-rest"].forEach(n=>document.getElementById(n)?.addEventListener("change",a)),document.getElementById("s-lock")?.addEventListener("click",()=>{T(),location.reload()})})}export{z as renderMore};
