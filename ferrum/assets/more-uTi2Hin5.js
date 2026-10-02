import{i as E,t as p,j as B,c as k,d as h,k as N,b as L,A as S,m as x,n as T,o as A,p as D}from"./index-Dm-Kw1PY.js";import{buildBackupDump as j,importBackupDump as M,saveBackupConfig as R,runAutoBackup as $,getBackupConfig as C,restoreLatestBackup as V,clearBackupConfig as O,lastBackupStatus as P}from"./backup-M_6d5RGP.js";import{t as I}from"./types-CEDv8i23.js";import{checkAccess as H}from"./social-CiSbvSqf.js";import"./stats-CJKsKY2L.js";const z=["title","start_time","end_time","description","exercise_title","superset_id","exercise_notes","set_index","set_type","weight_kg","reps","distance_km","duration_seconds","rpe"];function m(i){const o=i==null?"":String(i);return/[",\n]/.test(o)?`"${o.replace(/"/g,'""')}"`:o}function _(i){return new Date(i).toISOString()}function q(i,o){const n=[z.join(",")];for(const s of i)for(const l of s.exercises??[]){const u=o.get(l.exerciseId);for(const r of l.sets??[])r.done&&n.push([m(s.title),m(_(s.startTime)),m(s.endTime?_(s.endTime):""),m(s.description),m(u?.nameEs??l.exerciseId),m(r.supersetId??""),m(l.notes),m(r.setIndex),m(r.setType),m(r.weightKg??""),m(r.reps??""),m(r.distanceKm??""),m(r.durationSeconds??""),m(r.rpe??"")].join(","))}return n.join(`
`)}function F(i){i.charCodeAt(0)===65279&&(i=i.slice(1));const o=[];let n="",s=!1,l=!1,u=[];const r=()=>{u.push({v:n,q:l}),n="",l=!1},t=()=>{o.push(u),u=[]};for(let a=0;a<i.length;a++){const c=i[a];s?c==='"'?i[a+1]==='"'?(n+='"',a++):s=!1:n+=c:c==='"'?(s=!0,l=!0):c===","?r():c===`
`?(r(),t()):c==="\r"||(n+=c)}(n!==""||u.length)&&(r(),t());const e=(o.shift()??[]).map(a=>a.v.trim());return o.filter(a=>a.some(c=>c.v.trim()!=="")).map(a=>{const c={};return e.forEach((g,b)=>{c[g]=a[b]?.q?a[b].v:(a[b]?.v??"").trim()}),c})}function J(i,o){const n=new Map;for(const t of o.values())n.set(t.nameEs.toLowerCase(),t.id);const s=new Map;for(const t of i){const e=`${t.title??""}||${t.start_time??""}`;s.has(e)||s.set(e,[]),s.get(e).push(t)}const l=[],u=new Set;let r=0;for(const[,t]of s){const e=t[0],a=Date.parse(e.start_time??"");if(Number.isNaN(a))continue;const c=e.end_time??"",g={id:crypto.randomUUID(),title:e.title||"Sesión importada",startTime:a,endTime:c&&!Number.isNaN(Date.parse(c))?Date.parse(c):null,description:e.description??"",exercises:[]},b=new Map;for(const v of t){const f=`${v.exercise_title??""}||${v.superset_id??""}`;b.has(f)||b.set(f,[]),b.get(f).push(v)}for(const[,v]of b){const f=v[0].exercise_title??"",y=n.get(f.toLowerCase());y?r++:u.add(f),g.exercises.push({exerciseId:y??`desconocido:${f}`,notes:v[0].exercise_notes??"",restSeconds:90,sets:v.map(d=>({setIndex:parseInt(d.set_index??"0",10)||0,setType:["warmup","normal","failure","dropset"].includes(d.set_type??"")?d.set_type:"normal",weightKg:w(d.weight_kg),reps:w(d.reps),distanceKm:w(d.distance_km),durationSeconds:w(d.duration_seconds),rpe:w(d.rpe),supersetId:d.superset_id||null,done:!0}))})}l.push(g)}return{workouts:l,matched:r,unmatched:[...u]}}function w(i){if(i===void 0||i==="")return null;const o=Number(i.replace(",","."));return Number.isNaN(o)?null:o}function K(i){const n=[["date","weight_kg","body_fat_pct","neck_cm","shoulders_cm","chest_cm","biceps_cm","forearms_cm","abdomen_cm","hips_cm","thighs_cm","calves_cm"].join(",")];for(const s of[...i].sort((l,u)=>l.date.localeCompare(u.date)))n.push([s.date,s.weightKg,s.bodyFatPct,s.neckCm,s.shouldersCm,s.chestCm,s.bicepsCm,s.forearmsCm,s.abdomenCm,s.hipsCm,s.thighsCm,s.calvesCm].map(l=>m(l??"")).join(","));return n.join(`
`)}async function ee(i,o){i.innerHTML=`
    <div class="screen-head"><h1>Ajustes</h1></div>
    <div id="more-body"></div>`;const n=document.getElementById("more-body");G(n);const s=document.createElement("div");n.appendChild(s),U(s)}function G(i){i.innerHTML=`
    <div class="sec-title">Copia completa (JSON)</div>
    <div class="card">
      <p class="small muted" style="margin-top:0">Incluye entrenamientos, rutinas, ejercicios personalizados, medidas, ajustes y fotos.</p>
      <div class="row">
        <button class="btn" id="bk-export">Exportar JSON</button>
        <button class="btn secondary" id="bk-import">Importar JSON</button>
      </div>
    </div>
    <div class="sec-title">Copia automática</div>
    <div class="card">
      <p class="small muted" style="margin-top:0">Guarda sola tu base de datos en un repo privado <strong>solo tuyo</strong> (distinto del de Amigos): al terminar cada entreno y una vez al día al abrir la app. Se conservan 30 días.</p>
      <div class="small" id="bk-auto-status" style="margin:0 0 8px"></div>
      <label class="f" for="bk-auto-token">Token <span class="muted">(solo acceso al repo de copias)</span></label>
      <input type="password" id="bk-auto-token" autocomplete="off" spellcheck="false" style="margin-bottom:8px">
      <label class="f" for="bk-auto-repo">Repo privado</label>
      <input type="text" id="bk-auto-repo" autocomplete="off" spellcheck="false" value="miguelfrd/ferrum-backup">
      <div class="row" style="margin-top:10px">
        <button class="btn" id="bk-auto-save">Guardar</button>
        <button class="btn secondary" id="bk-auto-now">Copiar ahora</button>
      </div>
      <div class="row" style="margin-top:8px">
        <button class="btn secondary" id="bk-auto-restore">Restaurar última</button>
        <button class="btn danger" id="bk-auto-off">Desconectar</button>
      </div>
      <div class="small" id="bk-auto-msg" style="margin-top:8px"></div>
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
    </div>`,document.getElementById("bk-export")?.addEventListener("click",async()=>{try{const t=await j();E(new Blob([JSON.stringify(t)],{type:"application/json"}),`ferrum-backup-${I()}.json`),p("Copia exportada")}catch{p("No se pudo generar la copia")}}),document.getElementById("bk-import")?.addEventListener("click",async()=>{const t=await B("application/json,.json");if(t&&await k("¿Importar la copia? Se reemplazarán los datos actuales."))try{const e=JSON.parse(await t.text());await M(e),p("Copia importada")}catch(e){console.error(e),p(e instanceof Error&&e.message.startsWith("Copia inválida")?e.message:"No se pudo importar la copia")}});const o=document.getElementById("bk-auto-status"),n=document.getElementById("bk-auto-msg"),s=document.getElementById("bk-auto-token"),l=document.getElementById("bk-auto-repo"),u=t=>{const e=Math.round((Date.now()-t)/6e4);if(e<1)return"ahora mismo";if(e<60)return`hace ${e} min`;const a=Math.round(e/60);if(a<24)return`hace ${a} h`;const c=Math.round(a/24);return`hace ${c} ${c===1?"día":"días"}`},r=()=>{const t=C(),e=P();o.innerHTML=t?e?e.ok?`Última copia: <strong>${u(e.at)}</strong>`:`<span style="color:var(--red)">Último intento fallido (${u(e.at)})</span>`:'<span class="muted">Configurado, sin copias aún.</span>':'<span class="muted">Sin configurar.</span>',s.value=t?.token??"",t?.repo&&(l.value=t.repo)};r(),document.getElementById("bk-auto-save")?.addEventListener("click",async()=>{const t=s.value.trim(),e=l.value.trim();if(n.textContent="",!t||!/^[^/]+\/[^/]+$/.test(e)){n.textContent='Revisa el token y el repo ("propietario/nombre").';return}const a=document.getElementById("bk-auto-save");a.setAttribute("disabled","");try{await H({token:t,repo:e}),R({token:t,repo:e}),n.textContent="Guardado. Haciendo la primera copia…";const c=await $();n.textContent=c?"Primera copia guardada.":"No se pudo hacer la copia (¿sin conexión?). Se reintentará sola.",r()}catch{n.textContent="El token no accede a ese repo."}finally{a.removeAttribute("disabled")}}),document.getElementById("bk-auto-now")?.addEventListener("click",async()=>{if(!C()){n.textContent="Configura primero el token y el repo.";return}const t=document.getElementById("bk-auto-now");t.setAttribute("disabled","");try{const e=await $();p(e?"Copia guardada":"No se pudo hacer la copia"),r()}finally{t.removeAttribute("disabled")}}),document.getElementById("bk-auto-restore")?.addEventListener("click",async()=>{const t=C();if(!t){n.textContent="Configura primero el token y el repo.";return}if(!await k("¿Restaurar la última copia? Se reemplazarán los datos actuales."))return;const e=document.getElementById("bk-auto-restore");e.setAttribute("disabled",""),n.textContent="Descargando copia…";try{const a=await V(t);n.textContent="",p(`Copia restaurada (${a})`)}catch(a){n.textContent=a instanceof Error?a.message:"No se pudo restaurar"}finally{e.removeAttribute("disabled")}}),document.getElementById("bk-auto-off")?.addEventListener("click",async()=>{await k("¿Desconectar la copia automática en este móvil? Las copias ya guardadas siguen en el repo.")&&(O(),r(),n.textContent="Desconectado.")}),document.getElementById("bk-csv-w")?.addEventListener("click",async()=>{const t=new Map((await h.all("exercises")).map(a=>[a.id,a])),e=q(await h.workoutsDesc(),t);E(new Blob([e],{type:"text/csv"}),`ferrum-workouts-${I()}.csv`),p("CSV exportado")}),document.getElementById("bk-csv-m")?.addEventListener("click",async()=>{const t=K(await h.all("measurements"));E(new Blob([t],{type:"text/csv"}),`ferrum-measurements-${I()}.csv`),p("CSV exportado")}),document.getElementById("bk-csv-in")?.addEventListener("click",async()=>{const t=await B("text/csv,.csv");if(!t)return;const e=document.getElementById("bk-msg");try{const a=F(await t.text()),c=new Map((await h.all("exercises")).map(d=>[d.id,d])),{workouts:g,matched:b,unmatched:v}=J(a,c);if(!g.length){e.textContent="No se encontraron sesiones en el CSV.";return}if(!await k(`Importar ${g.length} sesiones? (${b} ejercicios enlazados)`))return;const f=new Set((await h.all("workouts")).map(d=>`${d.title}||${d.startTime}`)),y=g.filter(d=>!f.has(`${d.title}||${d.startTime}`));y.forEach(d=>f.add(`${d.title}||${d.startTime}`)),await h.bulkPut("workouts",y),e.textContent=`${y.length} sesiones importadas.`+(g.length-y.length?` (${g.length-y.length} ya existían, omitidas)`:"")+(v.length?` Sin coincidencia: ${v.slice(0,5).join(", ")}${v.length>5?"…":""}`:""),p("Importación completada")}catch(a){console.error(a),e.textContent="No se pudo leer el CSV."}}),document.getElementById("ck-upd")?.addEventListener("click",async()=>{const t=document.getElementById("ck-upd");t.disabled=!0;try{await N(!0)}finally{t.disabled=!1}}),document.getElementById("bk-wipe")?.addEventListener("click",async()=>{if(await k("¿BORRAR TODO? Entrenamientos, rutinas, medidas y fotos. Esta acción no se puede deshacer.")&&await k("Última confirmación: ¿borrar todos los datos de Ferrum?")){for(const t of["routines","folders","workouts","measurements","progressPhotos","workoutPhotos","programState","aliases"])await h.clear(t);localStorage.removeItem("mg-active-workout"),p("Datos borrados")}})}function U(i){L().then(o=>{const n=typeof o.hue=="number"?o.hue:262;i.innerHTML=`
    <div class="sec-title">Personalización</div>
    <div class="card">
      <label class="f" style="margin-top:0">Tema</label>
      <select id="s-theme">
        <option value="light" ${o.theme==="light"?"selected":""}>Claro</option>
        <option value="dark" ${o.theme==="dark"?"selected":""}>Oscuro</option>
      </select>
      <label class="f">Color de fondo</label>
      <div class="hue-row">
        <span class="hue-swatch" id="hue-swatch" style="background:hsl(${n},32%,88%)"></span>
        <input type="range" class="hue" id="hue-range" min="0" max="360" step="1" value="${n}" aria-label="Tono del fondo" />
        <span class="hue-deg" id="hue-deg">${n}°</span>
      </div>
    </div>
    <div class="sec-title">Ajustes</div>
    <div class="card">
      <div class="row" style="align-items:center">
        <div><strong>RPE por serie</strong><div class="small muted">Esfuerzo percibido (1-10)</div></div>
        <input type="checkbox" id="s-rpe" ${o.rpeEnabled?"checked":""} style="width:auto;flex:0 0 auto" />
      </div><hr class="divider" />
      <div class="row" style="align-items:center">
        <div><strong>Sonido del temporizador</strong></div>
        <input type="checkbox" id="s-sound" ${o.soundEnabled?"checked":""} style="width:auto;flex:0 0 auto" />
      </div><hr class="divider" />
      <label class="f">Descanso por defecto (segundos)</label>
      <input type="text" id="s-rest" value="${o.defaultRestSeconds}" inputmode="numeric" />
      <div class="small muted" style="margin-top:12px">Unidades: kilogramos · Idioma: español</div>
    </div>
    <div class="sec-title">Privacidad</div>
    <div class="card">
      <div class="rowline">
        <div><strong>Bloquear ahora</strong><div class="small muted">Pide el PIN al volver a abrir</div></div>
        <button class="btn secondary small" id="s-lock" style="flex:0 0 auto">Bloquear</button>
      </div>
    </div>
    <div class="sec-title">Aplicación</div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div class="small muted">Versión ${S}</div>
        <button class="btn small secondary" id="ck-upd" type="button">Buscar actualizaciones</button>
      </div>
    </div>
    <div class="sec-title">Acerca de</div>
    <div class="card small muted">
      Ferrum ${S} — tus datos viven solo en este móvil (IndexedDB), sin cuentas ni servidores.
      Haz copias de seguridad desde el apartado «Copia de seguridad» de esta misma pantalla.
    </div>`,document.getElementById("s-theme")?.addEventListener("change",async e=>{o.theme=e.target.value,await x(o),await T()});const s=document.getElementById("hue-range"),l=document.getElementById("hue-swatch"),u=document.getElementById("hue-deg"),r=e=>{document.documentElement.style.setProperty("--bgh",String(e)),l.style.background=`hsl(${e},32%,88%)`,u.textContent=`${e}°`};s.addEventListener("input",()=>r(Number(s.value))),s.addEventListener("change",async()=>{o.hue=Number(s.value),await x(o),p("Tono guardado")});const t=async()=>{o.rpeEnabled=document.getElementById("s-rpe").checked,o.soundEnabled=document.getElementById("s-sound").checked;const e=D(document.getElementById("s-rest").value);o.defaultRestSeconds=Math.max(0,e===null?90:Math.round(e)),await x(o),p("Ajustes guardados")};["s-rpe","s-sound","s-rest"].forEach(e=>document.getElementById(e)?.addEventListener("change",t)),document.getElementById("s-lock")?.addEventListener("click",()=>{A(),location.reload()})})}export{ee as renderMore};
