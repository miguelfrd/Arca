import{I as T,F as N,A as _,t as h,G as A,c as I,d as E,H as M,h as j,J as V,K as L,L as O,N as z,O as F,P as H,k as G,Q as K}from"./index-BGuJks7g.js";import{buildBackupDump as q,importBackupDump as J,checkAccess as U,saveBackupConfig as W,runAutoBackup as R,getBackupConfig as $,restoreLatestBackup as Q,clearBackupConfig as X,lastBackupStatus as Y}from"./backup-BSZ99QE_.js";const Z=["title","start_time","end_time","description","exercise_title","superset_id","exercise_notes","set_index","set_type","weight_kg","reps","distance_km","duration_seconds","rpe"];function v(i){const a=i==null?"":String(i);return/[",\n]/.test(a)?`"${a.replace(/"/g,'""')}"`:a}function D(i){return new Date(i).toISOString()}function ee(i,a){const c=[Z.join(",")];for(const n of i)for(const r of n.exercises??[]){const p=a.get(r.exerciseId);for(const d of r.sets??[])d.done&&c.push([v(n.title),v(D(n.startTime)),v(n.endTime?D(n.endTime):""),v(n.description),v(p?.nameEs??r.exerciseId),v(d.supersetId??""),v(r.notes),v(d.setIndex),v(d.setType),v(d.weightKg??""),v(d.reps??""),v(d.distanceKm??""),v(d.durationSeconds??""),v(d.rpe??"")].join(","))}return c.join(`
`)}function te(i){i.charCodeAt(0)===65279&&(i=i.slice(1));const a=[];let c="",n=!1,r=!1,p=[];const d=()=>{p.push({v:c,q:r}),c="",r=!1},g=()=>{a.push(p),p=[]};for(let o=0;o<i.length;o++){const l=i[o];n?l==='"'?i[o+1]==='"'?(c+='"',o++):n=!1:c+=l:l==='"'?(n=!0,r=!0):l===","?d():l===`
`?(d(),g()):l==="\r"||(c+=l)}(c!==""||p.length)&&(d(),g());const m=(a.shift()??[]).map(o=>o.v.trim());return a.filter(o=>o.some(l=>l.v.trim()!=="")).map(o=>{const l={};return m.forEach((k,b)=>{l[k]=o[b]?.q?o[b].v:(o[b]?.v??"").trim()}),l})}function ne(i,a){const c=new Map;for(const g of a.values())c.set(g.nameEs.toLowerCase(),g.id);const n=new Map;for(const g of i){const m=`${g.title??""}||${g.start_time??""}`;n.has(m)||n.set(m,[]),n.get(m).push(g)}const r=[],p=new Set;let d=0;for(const[,g]of n){const m=g[0],o=Date.parse(m.start_time??"");if(Number.isNaN(o))continue;const l=m.end_time??"",k={id:crypto.randomUUID(),title:m.title||"Sesión importada",startTime:o,endTime:l&&!Number.isNaN(Date.parse(l))?Date.parse(l):null,description:m.description??"",exercises:[]},b=new Map;for(const u of g){const e=`${u.exercise_title??""}||${u.superset_id??""}`;b.has(e)||b.set(e,[]),b.get(e).push(u)}for(const[,u]of b){const e=u[0].exercise_title??"",t=c.get(e.toLowerCase());t?d++:p.add(e),k.exercises.push({exerciseId:t??`desconocido:${e}`,notes:u[0].exercise_notes??"",restSeconds:90,sets:u.map(s=>({setIndex:parseInt(s.set_index??"0",10)||0,setType:["warmup","normal","failure","dropset"].includes(s.set_type??"")?s.set_type:"normal",weightKg:C(s.weight_kg),reps:C(s.reps),distanceKm:C(s.distance_km),durationSeconds:C(s.duration_seconds),rpe:C(s.rpe),supersetId:s.superset_id||null,done:!0}))})}r.push(k)}return{workouts:r,matched:d,unmatched:[...p]}}function C(i){if(i===void 0||i==="")return null;const a=Number(i.replace(",","."));return Number.isNaN(a)?null:a}function se(i){const c=[["date","weight_kg","body_fat_pct","neck_cm","shoulders_cm","chest_cm","biceps_cm","forearms_cm","abdomen_cm","hips_cm","thighs_cm","calves_cm"].join(",")];for(const n of[...i].sort((r,p)=>r.date.localeCompare(p.date)))c.push([n.date,n.weightKg,n.bodyFatPct,n.neckCm,n.shouldersCm,n.chestCm,n.bicepsCm,n.forearmsCm,n.abdomenCm,n.hipsCm,n.thighsCm,n.calvesCm].map(r=>v(r??"")).join(","));return c.join(`
`)}async function re(i,a){i.innerHTML=`
    <div class="screen-head"><h1>Ajustes</h1></div>
    <div id="more-body"></div>`;const c=document.getElementById("more-body");ae(c);const n=document.createElement("div");c.appendChild(n),oe(n)}function ae(i){const a=(e,t,s="",f="")=>`
    <button type="button" class="list-row ${f}" id="${e}">
      <span class="list-t"><span class="nm">${t}</span>${s?`<span class="mt">${s}</span>`:""}</span>
      ${f?"":`<span class="chev">${T.chevR}</span>`}
    </button>`;i.innerHTML=`
    <div class="card bk-page">
      <div class="bk-isle">
        <div class="bk-state">
          <span class="tick" id="bk-auto-tick">${T.check}</span>
          <span><span class="nm" id="bk-auto-title"></span><span class="mt" id="bk-auto-status"></span></span>
        </div>
        <p class="bk-note">Se guarda sola en un repositorio privado tuyo, distinto del de Amigos, al terminar cada entreno y una vez al día. Se conservan 30 días.</p>
        <button class="btn" id="bk-auto-now" type="button">Copiar ahora</button>
      </div>
      <div class="sec-title">Conexión</div>
      <div class="group">
        <label class="kv kv-in"><span>Repositorio</span><span class="kv-v"><input type="text" id="bk-auto-repo" autocomplete="off" spellcheck="false" value="miguelfrd/ferrum-backup"></span></label>
        <label class="kv kv-in"><span>Token</span><span class="kv-v"><input type="password" id="bk-auto-token" autocomplete="off" spellcheck="false"></span></label>
      </div>
      <button class="btn" id="bk-auto-save" type="button">Guardar</button>
      <div class="bk-msg" id="bk-auto-msg"></div>
      <div class="group" id="bk-auto-actions">
        ${a("bk-auto-restore","Restaurar la última copia","","plain")}
        ${a("bk-auto-off","Desconectar","","plain is-red")}
      </div>
      <div class="sec-title">Exportar e importar</div>
      <div class="group">
        ${a("bk-export","Exportar copia completa","JSON con todo, fotos incluidas")}
        ${a("bk-import","Importar copia completa","Reemplaza los datos actuales")}
        ${a("bk-csv-w","Exportar entrenamientos","CSV compatible con Hevy")}
        ${a("bk-csv-m","Exportar medidas","CSV")}
        ${a("bk-csv-in","Importar desde Hevy","CSV de entrenamientos")}
      </div>
      <div class="bk-msg" id="bk-msg"></div>
      <div class="group bk-wipe">${a("bk-wipe","Borrar todos los datos","","plain is-red")}</div>
    </div>`,document.getElementById("bk-export")?.addEventListener("click",async()=>{try{const e=await q();N(new Blob([JSON.stringify(e)],{type:"application/json"}),`ferrum-backup-${_()}.json`),h("Copia exportada")}catch{h("No se pudo generar la copia")}}),document.getElementById("bk-import")?.addEventListener("click",async()=>{const e=await A("application/json,.json");if(e&&await I("¿Importar la copia? Se reemplazarán los datos actuales."))try{const t=JSON.parse(await e.text());await J(t),h("Copia importada")}catch(t){console.error(t),h(t instanceof Error&&t.message.startsWith("Copia inválida")?t.message:"No se pudo importar la copia")}});const c=document.getElementById("bk-auto-status"),n=document.getElementById("bk-auto-msg"),r=document.getElementById("bk-auto-token"),p=document.getElementById("bk-auto-repo"),d=e=>{const t=Math.round((Date.now()-e)/6e4);if(t<1)return"ahora mismo";if(t<60)return`hace ${t} min`;const s=Math.round(t/60);if(s<24)return`hace ${s} h`;const f=Math.round(s/24);return`hace ${f} ${f===1?"día":"días"}`},g=document.getElementById("bk-auto-tick"),m=document.getElementById("bk-auto-title"),o=document.getElementById("bk-auto-now"),l=document.getElementById("bk-auto-save"),k=document.getElementById("bk-auto-actions"),b=()=>{const e=$();l.hidden=!!e&&r.value.trim()===e.token&&p.value.trim()===e.repo},u=()=>{const e=$(),t=Y(),s=!!e&&!!t&&!t.ok;g.hidden=!e||s,m.classList.toggle("is-red",s),m.textContent=e?s?"Falló el último intento":"Copia automática activa":"Copia automática sin configurar",c.textContent=e?t?`${s?"Último intento":"Última copia"} ${d(t.at)}`:"Configurada, sin copias aún.":"Añade el repositorio y el token.",o.hidden=!e,k.hidden=!e,r.value=e?.token??"",e?.repo&&(p.value=e.repo),b()};r.addEventListener("input",b),p.addEventListener("input",b),u(),document.getElementById("bk-auto-save")?.addEventListener("click",async()=>{const e=r.value.trim(),t=p.value.trim();if(n.textContent="",!e||!/^[^/]+\/[^/]+$/.test(t)){n.textContent='Revisa el token y el repo ("propietario/nombre").';return}const s=document.getElementById("bk-auto-save");s.setAttribute("disabled","");try{await U({token:e,repo:t}),W({token:e,repo:t}),n.textContent="Guardado. Haciendo la primera copia…";const f=await R();n.textContent=f?"Primera copia guardada.":"No se pudo hacer la copia (¿sin conexión?). Se reintentará sola.",u()}catch{n.textContent="El token no accede a ese repo."}finally{s.removeAttribute("disabled")}}),document.getElementById("bk-auto-now")?.addEventListener("click",async()=>{if(!$()){n.textContent="Configura primero el token y el repo.";return}const e=document.getElementById("bk-auto-now");e.setAttribute("disabled","");try{const t=await R();h(t?"Copia guardada":"No se pudo hacer la copia"),u()}finally{e.removeAttribute("disabled")}}),document.getElementById("bk-auto-restore")?.addEventListener("click",async()=>{const e=$();if(!e){n.textContent="Configura primero el token y el repo.";return}if(!await I("¿Restaurar la última copia? Se reemplazarán los datos actuales."))return;const t=document.getElementById("bk-auto-restore");t.setAttribute("disabled",""),n.textContent="Descargando copia…";try{const s=await Q(e);n.textContent="",h(`Copia restaurada (${s})`)}catch(s){n.textContent=s instanceof Error?s.message:"No se pudo restaurar"}finally{t.removeAttribute("disabled")}}),document.getElementById("bk-auto-off")?.addEventListener("click",async()=>{await I("¿Desconectar la copia automática en este móvil? Las copias ya guardadas siguen en el repo.")&&(X(),u(),n.textContent="Desconectado.")}),document.getElementById("bk-csv-w")?.addEventListener("click",async()=>{const e=new Map((await E.all("exercises")).map(s=>[s.id,s])),t=ee(await E.workoutsDesc(),e);N(new Blob([t],{type:"text/csv"}),`ferrum-workouts-${_()}.csv`),h("CSV exportado")}),document.getElementById("bk-csv-m")?.addEventListener("click",async()=>{const e=se(await E.all("measurements"));N(new Blob([e],{type:"text/csv"}),`ferrum-measurements-${_()}.csv`),h("CSV exportado")}),document.getElementById("bk-csv-in")?.addEventListener("click",async()=>{const e=await A("text/csv,.csv");if(!e)return;const t=document.getElementById("bk-msg");try{const s=te(await e.text()),f=new Map((await E.all("exercises")).map(y=>[y.id,y])),{workouts:w,matched:B,unmatched:S}=ne(s,f);if(!w.length){t.textContent="No se encontraron sesiones en el CSV.";return}if(!await I(`Importar ${w.length} sesiones? (${B} ejercicios enlazados)`))return;const P=new Set((await E.all("workouts")).map(y=>`${y.title}||${y.startTime}`)),x=w.filter(y=>!P.has(`${y.title}||${y.startTime}`));x.forEach(y=>P.add(`${y.title}||${y.startTime}`)),await E.bulkPut("workouts",x),t.textContent=`${x.length} sesiones importadas.`+(w.length-x.length?` (${w.length-x.length} ya existían, omitidas)`:"")+(S.length?` Sin coincidencia: ${S.slice(0,5).join(", ")}${S.length>5?"…":""}`:""),h("Importación completada")}catch(s){console.error(s),t.textContent="No se pudo leer el CSV."}}),document.getElementById("ck-upd")?.addEventListener("click",async()=>{const e=document.getElementById("ck-upd");e.disabled=!0;try{await M(!0)}finally{e.disabled=!1}}),document.getElementById("bk-wipe")?.addEventListener("click",async()=>{if(await I("¿BORRAR TODO? Entrenamientos, rutinas, medidas y fotos. Esta acción no se puede deshacer.")&&await I("Última confirmación: ¿borrar todos los datos de Ferrum?")){for(const e of["routines","folders","workouts","measurements","progressPhotos","workoutPhotos","programState","aliases"])await E.clear(e);localStorage.removeItem("mg-active-workout"),h("Datos borrados")}})}function oe(i){j().then(a=>{const c=typeof a.hue=="number"?a.hue:262;i.innerHTML=`
    <div class="sec-title">Personalización</div>
    <div class="card">
      <label class="f" style="margin-top:0">Tema</label>
      <select id="s-theme">
        <option value="light" ${a.theme==="light"?"selected":""}>Claro</option>
        <option value="dark" ${a.theme==="dark"?"selected":""}>Oscuro</option>
      </select>
      <label class="f">Color de fondo</label>
      <div class="hue-row">
        <span class="hue-swatch" id="hue-swatch" style="background:hsl(${c},32%,88%)"></span>
        <input type="range" class="hue" id="hue-range" min="0" max="360" step="1" value="${c}" aria-label="Tono del fondo" />
        <span class="hue-deg" id="hue-deg">${c}°</span>
      </div>
    </div>
    <div class="sec-title">Ajustes</div>
    <div class="card">
      <div class="row" style="align-items:center">
        <div><strong>RPE por serie</strong><div class="small muted">Esfuerzo percibido (1-10)</div></div>
        <input type="checkbox" id="s-rpe" ${a.rpeEnabled?"checked":""} style="width:auto;flex:0 0 auto" />
      </div><hr class="divider" />
      <label class="f">Descanso por defecto (segundos)</label>
      <input type="text" id="s-rest" value="${a.defaultRestSeconds}" inputmode="numeric" />
      <div class="small muted" style="margin-top:12px">Unidades: kilogramos · Idioma: español</div>
    </div>
    <div class="sec-title">Privacidad</div>
    <div class="card">
      <div class="rowline">
        <div><strong>Bloquear ahora</strong><div class="small muted">Pide el PIN al volver a abrir</div></div>
        <button class="btn secondary small" id="s-lock" style="flex:0 0 auto">Bloquear</button>
      </div>
      <div class="rowline" style="margin-top:10px">
        <div><strong>Cambiar PIN</strong><div class="small muted" id="pin-hint">El de siempre</div></div>
        <button class="btn secondary small" id="s-pin-change" style="flex:0 0 auto">Cambiar</button>
      </div>
      <div id="pin-form" hidden style="margin-top:10px">
        <div id="pin-change-fields">
          <label class="f" for="pin-cur" style="margin-top:0">PIN actual</label>
          <input type="password" id="pin-cur" inputmode="numeric" maxlength="4" autocomplete="off">
          <label class="f" for="pin-new">PIN nuevo (4 dígitos)</label>
          <input type="password" id="pin-new" inputmode="numeric" maxlength="4" autocomplete="off">
          <label class="f" for="pin-new2">Repite el nuevo</label>
          <input type="password" id="pin-new2" inputmode="numeric" maxlength="4" autocomplete="off">
        </div>
        <div id="pin-reset-fields" hidden>
          <label class="f" for="pin-orig" style="margin-top:0">PIN original</label>
          <input type="password" id="pin-orig" inputmode="numeric" maxlength="4" autocomplete="off">
          <p class="small muted">Si olvidaste tu PIN personalizado, el original lo restablece.</p>
        </div>
        <div class="row" style="margin-top:10px">
          <button class="btn" id="pin-save">Guardar</button>
          <button class="btn secondary" id="pin-cancel">Cancelar</button>
        </div>
        <button class="linklike small" id="pin-reset" type="button">Volver al PIN original</button>
        <div class="small" id="pin-msg" style="margin-top:6px;min-height:18px"></div>
      </div>
    </div>
    <div class="sec-title">Aplicación</div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div class="small muted">Versión ${V}</div>
        <button class="btn small secondary" id="ck-upd" type="button">Buscar actualizaciones</button>
      </div>
    </div>
    <div class="sec-title">Acerca de</div>
    <div class="card small muted">
      Tus datos viven en este móvil.
    </div>`,document.getElementById("s-theme")?.addEventListener("change",async t=>{a.theme=t.target.value,await L(a),await O()});const n=document.getElementById("hue-range"),r=document.getElementById("hue-swatch"),p=document.getElementById("hue-deg"),d=t=>{document.documentElement.style.setProperty("--bgh",String(t)),r.style.background=`hsl(${t},32%,88%)`,p.textContent=`${t}°`};n.addEventListener("input",()=>d(Number(n.value))),n.addEventListener("change",async()=>{a.hue=Number(n.value),await L(a),h("Tono guardado")});const g=async()=>{a.rpeEnabled=document.getElementById("s-rpe").checked;const t=G(document.getElementById("s-rest").value);a.defaultRestSeconds=Math.max(0,t===null?90:Math.round(t)),await L(a),h("Ajustes guardados")};["s-rpe","s-rest"].forEach(t=>document.getElementById(t)?.addEventListener("change",g)),document.getElementById("s-lock")?.addEventListener("click",()=>{z(),location.reload()});const m=document.getElementById("pin-form"),o=document.getElementById("pin-msg"),l=document.getElementById("pin-hint"),k=document.getElementById("pin-change-fields"),b=document.getElementById("pin-reset-fields");let u="change";const e=()=>{k.hidden=u!=="change",b.hidden=u!=="reset",document.getElementById("pin-save").textContent=u==="change"?"Guardar":"Restablecer",l.textContent=K()?"Personalizado":"El de siempre"};e(),document.getElementById("s-pin-change")?.addEventListener("click",()=>{u="change",o.textContent="",e(),m.hidden=!m.hidden}),document.getElementById("pin-cancel")?.addEventListener("click",()=>{m.hidden=!0,o.textContent=""}),document.getElementById("pin-reset")?.addEventListener("click",()=>{u=u==="change"?"reset":"change",o.textContent="",e()}),document.getElementById("pin-save")?.addEventListener("click",async()=>{o.textContent="";const t=document.getElementById("pin-save");t.setAttribute("disabled","");try{if(u==="reset"){const s=document.getElementById("pin-orig").value.trim();await F(s)?(o.textContent="PIN original restablecido.",m.hidden=!0):o.textContent="Ese no es el PIN original."}else{const s=document.getElementById("pin-cur").value.trim(),f=document.getElementById("pin-new").value.trim(),w=document.getElementById("pin-new2").value.trim();if(f!==w){o.textContent="El nuevo PIN no coincide.";return}const B=await H(s,f);B==="ok"?(o.textContent="PIN cambiado.",m.hidden=!0):B==="bad-current"?o.textContent="El PIN actual no es correcto.":o.textContent="El nuevo PIN debe tener 4 dígitos."}}finally{t.removeAttribute("disabled"),e()}})})}export{re as renderMore};
