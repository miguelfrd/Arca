import{i as E,t as y,j as $,c as k,d as h,k as T,b as A,A as N,m as x,n as D,o as M,r as j,q as R,p as V,u as H}from"./index-ghZyYm5z.js";import{buildBackupDump as O,importBackupDump as z,saveBackupConfig as F,runAutoBackup as _,getBackupConfig as I,restoreLatestBackup as q,clearBackupConfig as G,lastBackupStatus as J}from"./backup-BQk9JEUJ.js";import{t as C}from"./types-CEDv8i23.js";import{checkAccess as K}from"./social-BpVr9vDk.js";import"./stats-CJKsKY2L.js";const U=["title","start_time","end_time","description","exercise_title","superset_id","exercise_notes","set_index","set_type","weight_kg","reps","distance_km","duration_seconds","rpe"];function v(i){const a=i==null?"":String(i);return/[",\n]/.test(a)?`"${a.replace(/"/g,'""')}"`:a}function P(i){return new Date(i).toISOString()}function W(i,a){const o=[U.join(",")];for(const s of i)for(const u of s.exercises??[]){const p=a.get(u.exerciseId);for(const c of u.sets??[])c.done&&o.push([v(s.title),v(P(s.startTime)),v(s.endTime?P(s.endTime):""),v(s.description),v(p?.nameEs??u.exerciseId),v(c.supersetId??""),v(u.notes),v(c.setIndex),v(c.setType),v(c.weightKg??""),v(c.reps??""),v(c.distanceKm??""),v(c.durationSeconds??""),v(c.rpe??"")].join(","))}return o.join(`
`)}function Q(i){i.charCodeAt(0)===65279&&(i=i.slice(1));const a=[];let o="",s=!1,u=!1,p=[];const c=()=>{p.push({v:o,q:u}),o="",u=!1},e=()=>{a.push(p),p=[]};for(let n=0;n<i.length;n++){const r=i[n];s?r==='"'?i[n+1]==='"'?(o+='"',n++):s=!1:o+=r:r==='"'?(s=!0,u=!0):r===","?c():r===`
`?(c(),e()):r==="\r"||(o+=r)}(o!==""||p.length)&&(c(),e());const t=(a.shift()??[]).map(n=>n.v.trim());return a.filter(n=>n.some(r=>r.v.trim()!=="")).map(n=>{const r={};return t.forEach((b,f)=>{r[b]=n[f]?.q?n[f].v:(n[f]?.v??"").trim()}),r})}function Z(i,a){const o=new Map;for(const e of a.values())o.set(e.nameEs.toLowerCase(),e.id);const s=new Map;for(const e of i){const t=`${e.title??""}||${e.start_time??""}`;s.has(t)||s.set(t,[]),s.get(t).push(e)}const u=[],p=new Set;let c=0;for(const[,e]of s){const t=e[0],n=Date.parse(t.start_time??"");if(Number.isNaN(n))continue;const r=t.end_time??"",b={id:crypto.randomUUID(),title:t.title||"Sesión importada",startTime:n,endTime:r&&!Number.isNaN(Date.parse(r))?Date.parse(r):null,description:t.description??"",exercises:[]},f=new Map;for(const m of e){const g=`${m.exercise_title??""}||${m.superset_id??""}`;f.has(g)||f.set(g,[]),f.get(g).push(m)}for(const[,m]of f){const g=m[0].exercise_title??"",l=o.get(g.toLowerCase());l?c++:p.add(g),b.exercises.push({exerciseId:l??`desconocido:${g}`,notes:m[0].exercise_notes??"",restSeconds:90,sets:m.map(d=>({setIndex:parseInt(d.set_index??"0",10)||0,setType:["warmup","normal","failure","dropset"].includes(d.set_type??"")?d.set_type:"normal",weightKg:w(d.weight_kg),reps:w(d.reps),distanceKm:w(d.distance_km),durationSeconds:w(d.duration_seconds),rpe:w(d.rpe),supersetId:d.superset_id||null,done:!0}))})}u.push(b)}return{workouts:u,matched:c,unmatched:[...p]}}function w(i){if(i===void 0||i==="")return null;const a=Number(i.replace(",","."));return Number.isNaN(a)?null:a}function X(i){const o=[["date","weight_kg","body_fat_pct","neck_cm","shoulders_cm","chest_cm","biceps_cm","forearms_cm","abdomen_cm","hips_cm","thighs_cm","calves_cm"].join(",")];for(const s of[...i].sort((u,p)=>u.date.localeCompare(p.date)))o.push([s.date,s.weightKg,s.bodyFatPct,s.neckCm,s.shouldersCm,s.chestCm,s.bicepsCm,s.forearmsCm,s.abdomenCm,s.hipsCm,s.thighsCm,s.calvesCm].map(u=>v(u??"")).join(","));return o.join(`
`)}async function ie(i,a){i.innerHTML=`
    <div class="screen-head"><h1>Ajustes</h1></div>
    <div id="more-body"></div>`;const o=document.getElementById("more-body");Y(o);const s=document.createElement("div");o.appendChild(s),ee(s)}function Y(i){i.innerHTML=`
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
    </div>`,document.getElementById("bk-export")?.addEventListener("click",async()=>{try{const e=await O();E(new Blob([JSON.stringify(e)],{type:"application/json"}),`ferrum-backup-${C()}.json`),y("Copia exportada")}catch{y("No se pudo generar la copia")}}),document.getElementById("bk-import")?.addEventListener("click",async()=>{const e=await $("application/json,.json");if(e&&await k("¿Importar la copia? Se reemplazarán los datos actuales."))try{const t=JSON.parse(await e.text());await z(t),y("Copia importada")}catch(t){console.error(t),y(t instanceof Error&&t.message.startsWith("Copia inválida")?t.message:"No se pudo importar la copia")}});const a=document.getElementById("bk-auto-status"),o=document.getElementById("bk-auto-msg"),s=document.getElementById("bk-auto-token"),u=document.getElementById("bk-auto-repo"),p=e=>{const t=Math.round((Date.now()-e)/6e4);if(t<1)return"ahora mismo";if(t<60)return`hace ${t} min`;const n=Math.round(t/60);if(n<24)return`hace ${n} h`;const r=Math.round(n/24);return`hace ${r} ${r===1?"día":"días"}`},c=()=>{const e=I(),t=J();a.innerHTML=e?t?t.ok?`Última copia: <strong>${p(t.at)}</strong>`:`<span style="color:var(--red)">Último intento fallido (${p(t.at)})</span>`:'<span class="muted">Configurado, sin copias aún.</span>':'<span class="muted">Sin configurar.</span>',s.value=e?.token??"",e?.repo&&(u.value=e.repo)};c(),document.getElementById("bk-auto-save")?.addEventListener("click",async()=>{const e=s.value.trim(),t=u.value.trim();if(o.textContent="",!e||!/^[^/]+\/[^/]+$/.test(t)){o.textContent='Revisa el token y el repo ("propietario/nombre").';return}const n=document.getElementById("bk-auto-save");n.setAttribute("disabled","");try{await K({token:e,repo:t}),F({token:e,repo:t}),o.textContent="Guardado. Haciendo la primera copia…";const r=await _();o.textContent=r?"Primera copia guardada.":"No se pudo hacer la copia (¿sin conexión?). Se reintentará sola.",c()}catch{o.textContent="El token no accede a ese repo."}finally{n.removeAttribute("disabled")}}),document.getElementById("bk-auto-now")?.addEventListener("click",async()=>{if(!I()){o.textContent="Configura primero el token y el repo.";return}const e=document.getElementById("bk-auto-now");e.setAttribute("disabled","");try{const t=await _();y(t?"Copia guardada":"No se pudo hacer la copia"),c()}finally{e.removeAttribute("disabled")}}),document.getElementById("bk-auto-restore")?.addEventListener("click",async()=>{const e=I();if(!e){o.textContent="Configura primero el token y el repo.";return}if(!await k("¿Restaurar la última copia? Se reemplazarán los datos actuales."))return;const t=document.getElementById("bk-auto-restore");t.setAttribute("disabled",""),o.textContent="Descargando copia…";try{const n=await q(e);o.textContent="",y(`Copia restaurada (${n})`)}catch(n){o.textContent=n instanceof Error?n.message:"No se pudo restaurar"}finally{t.removeAttribute("disabled")}}),document.getElementById("bk-auto-off")?.addEventListener("click",async()=>{await k("¿Desconectar la copia automática en este móvil? Las copias ya guardadas siguen en el repo.")&&(G(),c(),o.textContent="Desconectado.")}),document.getElementById("bk-csv-w")?.addEventListener("click",async()=>{const e=new Map((await h.all("exercises")).map(n=>[n.id,n])),t=W(await h.workoutsDesc(),e);E(new Blob([t],{type:"text/csv"}),`ferrum-workouts-${C()}.csv`),y("CSV exportado")}),document.getElementById("bk-csv-m")?.addEventListener("click",async()=>{const e=X(await h.all("measurements"));E(new Blob([e],{type:"text/csv"}),`ferrum-measurements-${C()}.csv`),y("CSV exportado")}),document.getElementById("bk-csv-in")?.addEventListener("click",async()=>{const e=await $("text/csv,.csv");if(!e)return;const t=document.getElementById("bk-msg");try{const n=Q(await e.text()),r=new Map((await h.all("exercises")).map(d=>[d.id,d])),{workouts:b,matched:f,unmatched:m}=Z(n,r);if(!b.length){t.textContent="No se encontraron sesiones en el CSV.";return}if(!await k(`Importar ${b.length} sesiones? (${f} ejercicios enlazados)`))return;const g=new Set((await h.all("workouts")).map(d=>`${d.title}||${d.startTime}`)),l=b.filter(d=>!g.has(`${d.title}||${d.startTime}`));l.forEach(d=>g.add(`${d.title}||${d.startTime}`)),await h.bulkPut("workouts",l),t.textContent=`${l.length} sesiones importadas.`+(b.length-l.length?` (${b.length-l.length} ya existían, omitidas)`:"")+(m.length?` Sin coincidencia: ${m.slice(0,5).join(", ")}${m.length>5?"…":""}`:""),y("Importación completada")}catch(n){console.error(n),t.textContent="No se pudo leer el CSV."}}),document.getElementById("ck-upd")?.addEventListener("click",async()=>{const e=document.getElementById("ck-upd");e.disabled=!0;try{await T(!0)}finally{e.disabled=!1}}),document.getElementById("bk-wipe")?.addEventListener("click",async()=>{if(await k("¿BORRAR TODO? Entrenamientos, rutinas, medidas y fotos. Esta acción no se puede deshacer.")&&await k("Última confirmación: ¿borrar todos los datos de Ferrum?")){for(const e of["routines","folders","workouts","measurements","progressPhotos","workoutPhotos","programState","aliases"])await h.clear(e);localStorage.removeItem("mg-active-workout"),y("Datos borrados")}})}function ee(i){A().then(a=>{const o=typeof a.hue=="number"?a.hue:262;i.innerHTML=`
    <div class="sec-title">Personalización</div>
    <div class="card">
      <label class="f" style="margin-top:0">Tema</label>
      <select id="s-theme">
        <option value="light" ${a.theme==="light"?"selected":""}>Claro</option>
        <option value="dark" ${a.theme==="dark"?"selected":""}>Oscuro</option>
      </select>
      <label class="f">Color de fondo</label>
      <div class="hue-row">
        <span class="hue-swatch" id="hue-swatch" style="background:hsl(${o},32%,88%)"></span>
        <input type="range" class="hue" id="hue-range" min="0" max="360" step="1" value="${o}" aria-label="Tono del fondo" />
        <span class="hue-deg" id="hue-deg">${o}°</span>
      </div>
    </div>
    <div class="sec-title">Ajustes</div>
    <div class="card">
      <div class="row" style="align-items:center">
        <div><strong>RPE por serie</strong><div class="small muted">Esfuerzo percibido (1-10)</div></div>
        <input type="checkbox" id="s-rpe" ${a.rpeEnabled?"checked":""} style="width:auto;flex:0 0 auto" />
      </div><hr class="divider" />
      <div class="row" style="align-items:center">
        <div><strong>Sonido del temporizador</strong></div>
        <input type="checkbox" id="s-sound" ${a.soundEnabled?"checked":""} style="width:auto;flex:0 0 auto" />
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
        <div class="small muted">Versión ${N}</div>
        <button class="btn small secondary" id="ck-upd" type="button">Buscar actualizaciones</button>
      </div>
    </div>
    <div class="sec-title">Acerca de</div>
    <div class="card small muted">
      Ferrum ${N} — tus datos viven solo en este móvil (IndexedDB), sin cuentas ni servidores.
      Haz copias de seguridad desde el apartado «Copia de seguridad» de esta misma pantalla.
    </div>`,document.getElementById("s-theme")?.addEventListener("change",async l=>{a.theme=l.target.value,await x(a),await D()});const s=document.getElementById("hue-range"),u=document.getElementById("hue-swatch"),p=document.getElementById("hue-deg"),c=l=>{document.documentElement.style.setProperty("--bgh",String(l)),u.style.background=`hsl(${l},32%,88%)`,p.textContent=`${l}°`};s.addEventListener("input",()=>c(Number(s.value))),s.addEventListener("change",async()=>{a.hue=Number(s.value),await x(a),y("Tono guardado")});const e=async()=>{a.rpeEnabled=document.getElementById("s-rpe").checked,a.soundEnabled=document.getElementById("s-sound").checked;const l=V(document.getElementById("s-rest").value);a.defaultRestSeconds=Math.max(0,l===null?90:Math.round(l)),await x(a),y("Ajustes guardados")};["s-rpe","s-sound","s-rest"].forEach(l=>document.getElementById(l)?.addEventListener("change",e)),document.getElementById("s-lock")?.addEventListener("click",()=>{M(),location.reload()});const t=document.getElementById("pin-form"),n=document.getElementById("pin-msg"),r=document.getElementById("pin-hint"),b=document.getElementById("pin-change-fields"),f=document.getElementById("pin-reset-fields");let m="change";const g=()=>{b.hidden=m!=="change",f.hidden=m!=="reset",document.getElementById("pin-save").textContent=m==="change"?"Guardar":"Restablecer",r.textContent=H()?"Personalizado":"El de siempre"};g(),document.getElementById("s-pin-change")?.addEventListener("click",()=>{m="change",n.textContent="",g(),t.hidden=!t.hidden}),document.getElementById("pin-cancel")?.addEventListener("click",()=>{t.hidden=!0,n.textContent=""}),document.getElementById("pin-reset")?.addEventListener("click",()=>{m=m==="change"?"reset":"change",n.textContent="",g()}),document.getElementById("pin-save")?.addEventListener("click",async()=>{n.textContent="";const l=document.getElementById("pin-save");l.setAttribute("disabled","");try{if(m==="reset"){const d=document.getElementById("pin-orig").value.trim();await j(d)?(n.textContent="PIN original restablecido.",t.hidden=!0):n.textContent="Ese no es el PIN original."}else{const d=document.getElementById("pin-cur").value.trim(),B=document.getElementById("pin-new").value.trim(),L=document.getElementById("pin-new2").value.trim();if(B!==L){n.textContent="El nuevo PIN no coincide.";return}const S=await R(d,B);S==="ok"?(n.textContent="PIN cambiado.",t.hidden=!0):S==="bad-current"?n.textContent="El PIN actual no es correcto.":n.textContent="El nuevo PIN debe tener 4 dígitos."}}finally{l.removeAttribute("disabled"),g()}})})}export{ie as renderMore};
