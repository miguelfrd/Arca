const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./backup-C1StRYeB.js","./index-BNLHgOCt.js","./index-i90h2Rv9.css","./types-CEDv8i23.js"])))=>i.map(i=>d[i]);
import{d as y,s as L,I as M,e as h,t as T,_ as se,g as D,c as j,l as z,b as X,a as ae,p as I}from"./index-BNLHgOCt.js";import{d as ne,w as H,a as W,f as q,b as S}from"./stats-CJKsKY2L.js";import{c as ie}from"./photo-B4nAdfpw.js";import{D as J,u as Y,S as oe}from"./types-CEDv8i23.js";const ce=[25,20,15,10,5,2.5,1.25];function le(e,t=20,c=ce){const r=Math.max(0,(e-t)/2),d=[...c].sort((s,i)=>i-s),u=[];let o=r;for(const s of d){if(s<=0)continue;const i=Math.floor(o/s+1e-9);i>0&&(u.push({kg:s,count:i}),o=Math.round((o-i*s)*1e3)/1e3)}const n=u.reduce((s,i)=>s+i.kg*i.count,0),a=Math.round((t+n*2)*100)/100;return{perSideKg:Math.round(r*100)/100,platesPerSide:u,barKg:t,achievedKg:a,exact:Math.abs(a-e)<.001}}let A=new Map,x;async function R(){const e=await y.all("exercises");A=new Map(e.map(t=>[t.id,t])),x=await X()}function B(e){return e?A.get(e)?.nameEs??e.replace(/^desconocido:/,""):"Ejercicio"}async function re(e){await R();const t=z(),c=await y.all("routines"),r=await y.all("folders"),d=new Map(r.map(i=>[i.id,i.name])),u=new Date().getDay(),o=c.filter(i=>i.dayOfWeek===u);let n='<div class="screen-head"><h1>Entrenamiento</h1></div>';if(t&&(n+=`<div class="card" style="border-color:var(--blue)">
      <h3>Sesión en curso</h3>
      <div class="muted small">${h(t.title)} · ${t.exercises.length} ejercicios</div>
      <div class="row" style="margin-top:10px">
        <button class="btn" data-act="continue">Continuar</button>
        <button class="btn danger" data-act="discard">Descartar</button>
      </div></div>`),n+='<button class="btn" data-act="free">＋ Sesión libre</button>',n+='<div id="cal-home"></div>',o.length){n+=`<div class="sec-title">Hoy (${J[u]})</div>`;for(const i of o)n+=V(i,d.get(i.folderId??"")??"")}if(c.length){n+='<div class="sec-title">Rutinas</div>';for(const i of c.filter(l=>l.dayOfWeek!==u))n+=V(i,d.get(i.folderId??"")??"")}else o.length||(n+='<div class="empty">Sin rutinas todavía.<br>Crea una en la pestaña Rutinas o empieza una sesión libre.</div>');n+='<div class="sec-title">Historial</div>';const a=await y.workoutsDesc(8);a.length||(n+='<div class="empty">Aún no hay entrenamientos registrados.</div>');for(const i of a){const l=new Date(i.startTime);n+=`<div class="card" style="padding:9px 12px">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <strong>${h(i.title)}</strong>
        <span class="muted small num">${l.toLocaleDateString("es-ES",l.getFullYear()===new Date().getFullYear()?{day:"numeric",month:"short"}:{day:"numeric",month:"short",year:"numeric"})}</span>
      </div>
      <div class="muted small num">${S(H(i))} kg · ${W(i)} series · ${i.endTime?q(i.endTime-i.startTime):"—"}</div>
    </div>`}e.innerHTML=n;const s=e.querySelector("#cal-home");s&&de(s),e.querySelectorAll("[data-act]").forEach(i=>i.addEventListener("click",async()=>{const l=i.dataset.act;if(l==="free")ue();else if(l==="continue")D("/train/active");else if(l==="discard")await j("¿Descartar la sesión en curso? Se perderá lo registrado.")&&(L(null),re(e));else if(l.startsWith("routine:")){const m=c.find(b=>b.id===l.slice(8));m&&ve(m)}}))}let $=0,E=0,w=null;async function de(e){const t=new Date;$||($=t.getFullYear(),E=t.getMonth());const c=await y.all("workouts"),r=new Map;for(const s of c){const i=new Date(s.startTime),l=i.getFullYear()+"-"+i.getMonth()+"-"+i.getDate(),m=r.get(l);m?m.push(s):r.set(l,[s])}const d=s=>$+"-"+E+"-"+s,u=new Map;async function o(s){for(const[,l]of u)URL.revokeObjectURL(l);u.clear();const i=r.get(d(s))??[];for(const l of i)try{const m=await y.get("workoutPhotos",l.id);m?.blob&&u.set(l.id,URL.createObjectURL(m.blob))}catch{}}const n=s=>{const i=(s.sets??[]).filter(l=>l.done&&l.setType!=="warmup");return i.length?i.map(l=>{const m=l.weightKg!=null&&l.weightKg>0?S(l.weightKg)+"×":"",b=l.reps??l.durationSeconds??l.distanceKm??"–";return m+b}).join(" · "):"—"},a=()=>{const s=new Date($,E,1).toLocaleDateString("es-ES",{month:"long",year:"numeric"}),i=(new Date($,E,1).getDay()+6)%7,l=new Date($,E+1,0).getDate();let m="";for(let v=0;v<i;v++)m+="<span></span>";let b=0;for(let v=1;v<=l;v++){const g=r.has(d(v));g&&b++,m+=`<button class="mcal-day${g?" has":""}${w===v?" sel":""}" data-day="${v}"${g?"":" disabled"}>${v}</button>`}let p="";if(w!=null&&r.has(d(w))){const v=[...r.get(d(w))].sort((f,k)=>f.startTime-k.startTime);p=`<div class="sec-title">${w+" de "+new Date($,E,1).toLocaleDateString("es-ES",{month:"long"})}</div>`+v.map(f=>{const k=new Date(f.startTime).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}),_=f.endTime?q(f.endTime-f.startTime):"—",te=(f.exercises??[]).map(K=>`<div class="mcal-ex"><span>${h(B(K.exerciseId))}</span><span class="num muted">${h(n(K))}</span></div>`).join(""),G=u.get(f.id),C=[];return f.fatigue!=null&&C.push(`Cansancio <b class="num">${f.fatigue}</b>/5`),f.satisfaction!=null&&C.push(`Satisfacción <b class="num">${f.satisfaction}</b>/5`),`<div class="card" style="padding:9px 12px;margin-bottom:8px">
          ${G?`<img class="mcal-photo" src="${G}" alt="Foto del entreno">`:""}
          <div style="display:flex;justify-content:space-between;gap:8px">
            <strong>${h(f.title)}</strong><span class="muted small num">${k}</span>
          </div>
          <div class="muted small num" style="margin-bottom:6px">${_} · ${S(H(f))} kg · ${W(f)} series</div>
          ${C.length?`<div class="mcal-feel">${C.map(K=>`<span class="chip-feel">${K}</span>`).join("")}</div>`:""}
          ${te}
          <div style="margin-top:8px;text-align:right"><button class="linklike small" data-delw="${f.id}" style="color:var(--danger,#e5484d)">Eliminar entreno</button></div></div>`}).join("")}e.innerHTML=`<div class="sec-title">Calendario</div>
      <div class="card" style="padding:10px 12px">
        <div class="mcal-head">
          <button class="linklike" data-cal="prev" aria-label="Mes anterior">‹</button>
          <strong style="text-transform:capitalize">${h(s)}</strong>
          <button class="linklike" data-cal="next" aria-label="Mes siguiente">›</button>
        </div>
        <div class="mcal-grid">
          ${["L","M","X","J","V","S","D"].map(v=>`<span class="mcal-dow">${v}</span>`).join("")}
          ${m}
        </div>
        <div class="muted small" style="margin-top:8px"><span class="num">${b}</span> día${b===1?"":"s"} este mes</div>
      </div>
      ${p}`,e.querySelectorAll("[data-cal]").forEach(v=>v.addEventListener("click",()=>{const g=v.dataset.cal==="prev"?-1:1,f=new Date($,E+g,1);$=f.getFullYear(),E=f.getMonth(),w=null,a()})),e.querySelectorAll("[data-day]").forEach(v=>v.addEventListener("click",()=>{const g=Number(v.dataset.day),f=w!==g;w=f?g:null,f?o(g).then(a):a()})),e.querySelectorAll("[data-delw]").forEach(v=>v.addEventListener("click",()=>{const g=v.dataset.delw,f=c.find(k=>k.id===g);(async()=>{if(!await j(`¿Eliminar el entreno «${f?.title??""}»? Esta acción no se puede deshacer.`))return;await y.del("workouts",g),await y.del("workoutPhotos",g).catch(()=>{});const k=c.findIndex(_=>_.id===g);k>=0&&c.splice(k,1),u.delete(g),T("Entreno eliminado"),a()})()}))};a()}function V(e,t){return`<div class="card" style="padding:9px 12px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div><strong>${h(e.name)}</strong>
        <div class="muted small">${(e.exercises??[]).length} ejercicios${t?" · "+h(t):""}${e.dayOfWeek!==null?" · "+J[e.dayOfWeek]:""}</div>
      </div>
      <button class="btn small" data-act="routine:${e.id}">Empezar</button>
    </div></div>`}function ue(){(async()=>await Z()&&(await pe(),D("/train/active")))()}async function Z(){const e=z();if(!e)return!0;const t=e.exercises.reduce((c,r)=>c+r.sets.filter(d=>d.done).length,0);return!t&&!e.exercises.length?!0:j(`Ya tienes «${e.title}» en curso con ${t} series registradas. ¿Descartarla y empezar de nuevo?`)}async function pe(){await R();const e={id:Y(),title:"Sesión libre",startTime:Date.now(),endTime:null,description:"",exercises:[]};return L(e),e}async function me(e){return await R(),{id:Y(),title:e.name,startTime:Date.now(),endTime:null,description:"",exercises:(e.exercises??[]).map(c=>({exerciseId:c.exerciseId,notes:c.notes||"",restSeconds:c.restSeconds??x.defaultRestSeconds,targetRepsMax:c.targetRepsMax??c.targetRepsMin??null,sets:Array.from({length:Math.min(Math.max(0,Math.floor(c.targetSets??0)),100)},(r,d)=>({setIndex:d,setType:"normal",weightKg:c.targetWeightKg,reps:c.targetRepsMax??c.targetRepsMin,distanceKm:null,durationSeconds:c.targetDurationSeconds,rpe:null,supersetId:null,done:!1}))}))}}async function ve(e){if(!await Z())return;const t=await me(e);L(t),D("/train/active")}let P=null,F=0;async function De(e){await R();const t=await y.workoutsDesc(60),c=z();if(!c){D("/train");return}const r=new Map;for(const n of t)if(n.id!==c.id)for(const a of n.exercises??[]){if(r.has(a.exerciseId))continue;const s=(a.sets??[]).filter(l=>l.done&&l.setType!=="warmup");if(!s.length)continue;const i=s.reduce((l,m)=>(m.weightKg??0)*(m.reps??0)>(l.weightKg??0)*(l.reps??0)?m:l);r.set(a.exerciseId,fe(i))}he(e,c,r);const u=setInterval(()=>{const n=document.getElementById("sess-clock");n&&(n.textContent=q(Date.now()-c.startTime))},1e3),o=new MutationObserver(()=>{document.contains(e)||(clearInterval(u),o.disconnect())});o.observe(document.body,{childList:!0,subtree:!0})}function fe(e){const t=[];return e.weightKg&&t.push(S(e.weightKg)),e.reps&&t.push(`×${e.reps}`),e.durationSeconds&&t.push(`${e.durationSeconds}s`),e.distanceKm&&t.push(`${e.distanceKm}km`),t.join(" ")||"—"}function ge(e){switch(e?.type){case"bodyweight_reps":return[{key:"reps",label:"REPS"}];case"weighted_bodyweight":return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}];case"assisted_bodyweight":return[{key:"weightKg",label:"AYUDA"},{key:"reps",label:"REPS"}];case"duration":return[{key:"durationSeconds",label:"SEG"}];case"distance_duration":return[{key:"distanceKm",label:"KM"},{key:"durationSeconds",label:"SEG"}];case"weight_distance":return[{key:"weightKg",label:"KG"},{key:"distanceKm",label:"KM"}];default:return[{key:"weightKg",label:"KG"},{key:"reps",label:"REPS"}]}}function he(e,t,c){const r=new Set,d=()=>{L(t);const u=r.size;let o=`
    <div class="card w-head">
      <div class="w-head-row">
        <div class="w-head-main">
          <input type="text" id="w-title" class="w-title" value="${h(t.title)}" aria-label="Título de la sesión" />
          <div class="muted small" style="margin-top:4px"><span id="sess-clock" class="num">${q(Date.now()-t.startTime)}</span> · Volumen: <span class="num">${S(H(t))} kg</span></div>
        </div>
        ${u>0?`
        <div class="w-sel">
          <div class="small muted" id="w-sel-count">${u===1?"1 ejercicio seleccionado":`${u} ejercicios seleccionados`}</div>
          <div class="w-sel-btns">
            <button class="btn small" id="w-sel-group">Agrupar</button>
            <button class="linklike" id="w-sel-clear">Limpiar</button>
          </div>
        </div>`:""}
      </div>
    </div>`;t.exercises.forEach((n,a)=>{const s=A.get(n.exerciseId),i=ge(s),l=n.sets.find(p=>p.supersetId)?.supersetId,m=[s?.equipment,s?.primaryMuscle].filter(Boolean).join(" · "),b=r.has(a);o+=`<div class="card ex-card" data-ex="${a}">
        <div class="ex-top">
          ${s?.img?`<img class="ex-thumb ex-thumb--lg" src="./${s.img}" alt="" loading="lazy" />`:`<span class="ex-thumb ex-thumb--lg ex-thumb--ph" aria-hidden="true">${M.train}</span>`}
          <div class="ex-meta"><strong>${h(B(n.exerciseId))}</strong>
          <div class="muted small">${h(m)}${l?' · <span style="color:var(--blue)">superset</span>':""}</div></div>
          <button class="icon-btn ghost" data-menu="${a}" title="Opciones" aria-label="Opciones del ejercicio">⋮</button>
        </div>
        <div class="ex-actions">
          <button class="action-seg action-icon${b?" on":""}" data-select="${a}" title="Seleccionar" aria-label="Seleccionar ejercicio">${M.select}</button>
          <button class="action-seg action-icon" data-plate="${a}" title="Calculadora de discos" aria-label="Calculadora de discos">◎</button>
          <button class="action-seg action-icon" data-note="${a}" title="Editar nota" aria-label="Editar nota del ejercicio">${M.pencil}</button>
        </div>
        ${n.notes?`<div class="small muted ex-note">✎ ${h(n.notes)}</div>`:""}
        <table class="set-table roomy">
          <thead><tr><th>SERIE</th>${i.map(p=>`<th>${p.label}</th>`).join("")}${x.rpeEnabled?"<th>RPE</th>":""}<th>HECHA</th></tr></thead>
          <tbody>
          ${n.sets.map((p,v)=>`
            <tr class="${p.done?"set-done":""}">
              <td class="set-serie">
                <button class="set-num" data-stype="${a}:${v}" title="Tipo de serie">${p.setIndex+1}</button>
                <span class="set-type-pill ${p.setType}">${h(oe[p.setType])}</span>
                <div class="set-prev">Anterior: ${h(c.get(n.exerciseId)??"—")}</div>
              </td>
              ${i.map(g=>`<td><input type="text" inputmode="decimal" data-inp="${a}:${v}:${g.key}" value="${p[g.key]??""}" placeholder="–" ${p.done?"disabled":""}/></td>`).join("")}
              ${x.rpeEnabled?`<td><input type="text" inputmode="numeric" min="1" max="10" data-inp="${a}:${v}:rpe" value="${p.rpe??""}" placeholder="–" style="max-width:56px"/></td>`:""}
              <td><button class="check-btn ${p.done?"done":""}" data-check="${a}:${v}" aria-label="Marcar serie hecha">✓</button></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <button class="rest-row" data-rest="${a}"><span><span class="inl-ic">${M.clock}</span>Descanso: ${n.restSeconds} s</span><span class="chev" aria-hidden="true">›</span></button>
        <button class="btn add-set" data-add-set="${a}">+ Añadir serie</button>
      </div>`}),o+=`
    <div class="w-foot">
      <button class="btn secondary w-foot-btn" id="w-add-ex">＋ Añadir ejercicio</button>
      <button class="btn w-foot-btn" id="w-finish">Terminar</button>
    </div>`,e.innerHTML=o,ye(e,t,c,d,r)};d()}function ye(e,t,c,r,d){document.getElementById("w-title")?.addEventListener("change",o=>{t.title=o.target.value.trim()||"Sesión libre",L(t)}),document.getElementById("w-add-ex")?.addEventListener("click",()=>ke(o=>{(async()=>{const n=await ae(o);t.exercises.push({exerciseId:o,notes:"",sets:[Q(0)],restSeconds:n??x.defaultRestSeconds}),r()})()},{duplicateName:o=>t.exercises.some(n=>n.exerciseId===o)?B(o):null})),document.getElementById("w-finish")?.addEventListener("click",()=>Se(t)),document.getElementById("w-sel-group")?.addEventListener("click",()=>{for(const n of[...d])t.exercises[n]||d.delete(n);if(d.size<2){T("Selecciona al menos 2 ejercicios");return}const o=Y();d.forEach(n=>t.exercises[n].sets.forEach(a=>{a.supersetId=o})),d.clear(),T("Superset creado"),r()}),document.getElementById("w-sel-clear")?.addEventListener("click",()=>{d.clear(),r()}),e.querySelectorAll("[data-select]").forEach(o=>{o.addEventListener("click",()=>{const n=+o.dataset.select;d.has(n)?d.delete(n):d.add(n),r()})}),e.querySelectorAll("[data-menu]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const a=+o.dataset.menu;be(o,a,t,r,d)})}),e.querySelectorAll("[data-inp]").forEach(o=>{o.addEventListener("change",()=>{const[n,a,s]=o.dataset.inp.split(":"),i=o.value;t.exercises[+n].sets[+a][s]=I(i),L(t)})});const u=["warmup","normal","failure","dropset"];e.querySelectorAll("[data-stype]").forEach(o=>{o.addEventListener("click",()=>{const[n,a]=o.dataset.stype.split(":").map(Number),s=t.exercises[n].sets[a];s.setType=u[(u.indexOf(s.setType)+1)%u.length],r()})}),e.querySelectorAll("[data-check]").forEach(o=>{o.addEventListener("click",()=>{const[n,a]=o.dataset.check.split(":").map(Number),s=t.exercises[n],i=s.sets[a];i.done=!i.done,L(t),i.done&&s.restSeconds>0&&$e(s.restSeconds),r()})}),e.querySelectorAll("[data-add-set]").forEach(o=>{o.addEventListener("click",()=>{const n=+o.dataset.addSet,a=t.exercises[n],s=a.sets[a.sets.length-1],i=Q(a.sets.length);s&&(i.weightKg=s.weightKg,i.reps=s.reps,i.durationSeconds=s.durationSeconds,i.distanceKm=s.distanceKm),a.sets.push(i),r()})}),e.querySelectorAll("[data-note]").forEach(o=>{o.addEventListener("click",()=>{const n=+o.dataset.note,a=t.exercises[n].notes,s=window.prompt("Nota del ejercicio:",a);s!==null&&(t.exercises[n].notes=s,r())})}),e.querySelectorAll("[data-rest]").forEach(o=>{o.addEventListener("click",()=>{const n=+o.dataset.rest,a=window.prompt("Descanso (segundos):",String(t.exercises[n].restSeconds)),s=a!==null?parseInt(a,10):NaN;!Number.isNaN(s)&&s>=0&&(t.exercises[n].restSeconds=s,r())})}),e.querySelectorAll("[data-plate]").forEach(o=>{o.addEventListener("click",()=>ee(+o.dataset.plate))})}function be(e,t,c,r,d){N();const u=document.createElement("div");u.className="ex-menu",u.id="ex-menu-pop";const o=[{label:"Ver ejercicio",fn:()=>D(`/exercises?detail=${c.exercises[t].exerciseId}`)},{label:"Nota",fn:()=>{const a=window.prompt("Nota del ejercicio:",c.exercises[t].notes);a!==null&&(c.exercises[t].notes=a,r())}},{label:"Calculadora de discos",fn:()=>ee()},...c.exercises[t].sets.some(a=>a.supersetId)?[{label:"Disolver superset",fn:()=>{const a=c.exercises[t].sets.find(s=>s.supersetId)?.supersetId;for(const s of c.exercises)for(const i of s.sets)i.supersetId===a&&(i.supersetId=null);T("Superset disuelto"),r()}}]:[],{label:"Quitar ejercicio",fn:()=>{(async()=>await j("¿Quitar este ejercicio de la sesión?")&&(c.exercises.splice(t,1),d?.clear(),r()))()}}];u.innerHTML=o.map((a,s)=>`<button data-mi="${s}">${h(a.label)}</button>`).join(""),document.body.appendChild(u);const n=e.getBoundingClientRect();u.style.top=`${n.bottom+window.scrollY+6}px`,u.style.left=`${Math.max(8,n.right+window.scrollX-210)}px`,u.querySelectorAll("[data-mi]").forEach(a=>a.addEventListener("click",()=>{const s=o[+a.dataset.mi].fn;N(),s()})),setTimeout(()=>{document.addEventListener("click",N,{once:!0}),document.addEventListener("keydown",a=>{a.key==="Escape"&&N()},{once:!0})},0)}function N(){document.getElementById("ex-menu-pop")?.remove()}function Q(e){return{setIndex:e,setType:"normal",weightKg:null,reps:null,distanceKm:null,durationSeconds:null,rpe:null,supersetId:null,done:!1}}function ke(e,t={}){const c=document.createElement("div");c.className="modal-overlay",c.innerHTML=`<div class="modal">
    <h3>Añadir ejercicio</h3>
    <input type="text" id="pk-q" placeholder="Buscar…" autocomplete="off" />
    <select id="pk-muscle" style="margin-top:8px" aria-label="Filtrar por músculo"></select>
    <div id="pk-list" style="margin-top:8px"></div>
    <button class="btn secondary" id="pk-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(c);const r=c.querySelector("#pk-q"),d=c.querySelector("#pk-list"),u=c.querySelector("#pk-muscle");let o="";const n=()=>{const s=[...new Set([...A.values()].map(i=>i.primaryMuscle))].sort();u.innerHTML='<option value="">Todos los músculos</option>'+s.map(i=>`<option value="${h(i)}" ${i===o?"selected":""}>${h(i)}</option>`).join("")};u.addEventListener("change",()=>{o=u.value,a()});const a=()=>{const s=r.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),i=[...A.values()].filter(l=>(!o||l.primaryMuscle===o)&&(!s||l.nameEs.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(s))).sort((l,m)=>l.nameEs.localeCompare(m.nameEs,"es")).slice(0,60);d.innerHTML=i.length?i.map(l=>`<button class="ex-item" data-pick="${l.id}">
          ${l.img?`<img class="ex-thumb" src="./${l.img}" alt="" loading="lazy" />`:""}
          <span><span class="nm">${h(l.nameEs)}</span><br><span class="meta">${h(l.primaryMuscle)} · ${h(l.equipment)}</span></span>
          <span class="tag">${h(l.type==="duration"?"Tiempo":l.type==="bodyweight_reps"?"Corporal":"Peso")}</span>
        </button>`).join(""):'<div class="empty">Sin resultados.</div>',d.querySelectorAll("[data-pick]").forEach(l=>l.addEventListener("click",()=>{const m=l.dataset.pick,b=t.duplicateName?.(m);if(b){(async()=>await j(`«${b}» ya está añadido. ¿Añadirlo de todas formas?`)&&(c.isConnected&&document.body.removeChild(c),e(m)))();return}document.body.removeChild(c),e(m)}))};r.addEventListener("input",a),c.querySelector("#pk-close")?.addEventListener("click",()=>document.body.removeChild(c)),c.addEventListener("click",s=>{s.target===c&&document.body.removeChild(c)}),R().then(()=>{n(),a()}),setTimeout(()=>r.focus(),50)}function ee(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal">
    <h3>Calculadora de discos</h3>
    <div class="row">
      <div><label class="f">Carga objetivo (kg)</label><input type="text" id="pl-target" inputmode="decimal" /></div>
      <div><label class="f">Barra (kg)</label><input type="text" id="pl-bar" value="${x.barKg}" inputmode="decimal" /></div>
    </div>
    <label class="f">Discos disponibles (kg, separados por comas)</label>
    <input type="text" id="pl-avail" value="${x.platesKg.join(", ")}" />
    <div id="pl-out" style="margin-top:10px"></div>
    <button class="btn secondary" id="pl-close" style="margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(t);const c=t.querySelector("#pl-target"),r=t.querySelector("#pl-bar"),d=t.querySelector("#pl-avail"),u=t.querySelector("#pl-out"),o=()=>{const n=I(c.value);if(!n||n<=0){u.innerHTML="";return}const a=d.value.trim(),s=I(a),i=s!==null?[s]:a.split(",").map(m=>I(m)).filter(m=>m!==null&&m>0),l=le(n,I(r.value)||20,i.length?i:void 0);u.innerHTML=`<div class="card">
      <div class="small muted">Por lado: <strong class="num">${S(l.perSideKg)} kg</strong></div>
      <div style="margin-top:6px">${l.platesPerSide.map(m=>`<div class="num">• ${m.count} × ${S(m.kg)} kg</div>`).join("")||'<span class="muted">Solo la barra</span>'}</div>
      <div class="small" style="margin-top:6px">Total: <strong class="num">${S(l.achievedKg)} kg</strong>${l.exact?"":' <span class="muted">(aprox.)</span>'}</div>
    </div>`};[c,r,d].forEach(n=>n.addEventListener("input",o)),t.querySelector("#pl-close")?.addEventListener("click",()=>document.body.removeChild(t)),t.addEventListener("click",n=>{n.target===t&&document.body.removeChild(t)}),setTimeout(()=>c.focus(),50)}function xe(){if(x?.soundEnabled){try{const e=new AudioContext;[0,.25,.5].forEach((t,c)=>{const r=e.createOscillator(),d=e.createGain();r.connect(d),d.connect(e.destination),r.frequency.value=c===2?880:660,r.start(e.currentTime+t),r.stop(e.currentTime+t+.18)}),setTimeout(()=>e.close(),1200)}catch{}try{navigator.vibrate?.(400)}catch{}}}function $e(e){x||X().then(d=>{x=d}),O(),F=Date.now()+e*1e3;const t=document.createElement("div");t.className="timer-overlay",t.id="rest-timer",t.innerHTML=`<div class="timer-card">
    <div class="muted small">DESCANSO</div>
    <div class="t num" id="rest-t">--</div>
    <div class="row">
      <button class="btn secondary small" id="rest-plus">+15s</button>
      <button class="btn small" id="rest-done">Listo</button>
    </div></div>`,document.body.appendChild(t);const c=t.querySelector("#rest-t"),r=()=>{const d=Math.max(0,Math.ceil((F-Date.now())/1e3));c.textContent=`${Math.floor(d/60)}:${String(d%60).padStart(2,"0")}`,d<=0&&(xe(),O(),T("¡Descanso terminado!"))};P=setInterval(r,250),r(),t.querySelector("#rest-plus")?.addEventListener("click",()=>{F+=15e3,r()}),t.querySelector("#rest-done")?.addEventListener("click",O)}function O(){P&&clearInterval(P),P=null,document.getElementById("rest-timer")?.remove()}let U=!1;async function Se(e){if(U)return;U=!0,document.getElementById("w-finish")?.setAttribute("disabled","");const t=window.prompt("Descripción de la sesión (opcional):",e.description)??e.description;e.description=t,e.endTime=Date.now();const c=await y.workoutsDesc(200),r=ne(e,c.filter(p=>p.id!==e.id));await y.put("workouts",e),L(null),await Ee(e);const d=H(e),u=W(e),o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`<div class="modal">
    <h3>¡Sesión completada!</h3>
    <div class="kpis">
      <div class="kpi"><div class="kpi-val num">${q(e.endTime-e.startTime)}</div><div class="kpi-lab">Duración</div></div>
      <div class="kpi"><div class="kpi-val num">${S(d)}</div><div class="kpi-lab">Volumen kg</div></div>
      <div class="kpi"><div class="kpi-val num">${u}</div><div class="kpi-lab">Series</div></div>
      <div class="kpi"><div class="kpi-val num">${e.exercises.length}</div><div class="kpi-lab">Ejercicios</div></div>
    </div>
    ${r.length?'<div class="sec-title">Récords personales</div>'+r.map(p=>`<div class="pr"><span class="medal">★</span><span><strong>${h(B(p.exerciseId))}</strong> — ${h(p.kind)}: <span class="num">${h(p.value)}</span></span></div>`).join(""):'<div class="muted small">Sin nuevos récords esta vez. ¡A por la próxima!</div>'}
    <div class="sec-title" style="margin-top:14px">Foto y sensaciones <span class="muted small">(opcional)</span></div>
    <div class="fin-photo" id="fin-photo">
      <button class="btn small" id="fin-photo-btn" type="button"><span class="inl-ic">${M.camera}</span>Subir foto</button>
      <input type="file" id="fin-photo-input" accept="image/*" hidden>
    </div>
    <div class="fin-seg">
      <div class="fin-seg-head"><span>Cansancio</span></div>
      <div class="seg" id="fin-fatigue-seg" role="radiogroup" aria-label="Cansancio de 1 a 5">
        ${[1,2,3,4,5].map(p=>`<button type="button" data-v="${p}" role="radio" aria-label="${p}">${p}</button>`).join("")}
      </div>
      <div class="fin-seg-scale"><span>Nada</span><span>Reventado</span></div>
    </div>
    <div class="fin-seg">
      <div class="fin-seg-head"><span>Satisfacción</span></div>
      <div class="seg" id="fin-satisfaction-seg" role="radiogroup" aria-label="Satisfacción de 1 a 5">
        ${[1,2,3,4,5].map(p=>`<button type="button" data-v="${p}" role="radio" aria-label="${p}">${p}</button>`).join("")}
      </div>
      <div class="fin-seg-scale"><span>Fatal</span><span>Brutal</span></div>
    </div>
    <button class="btn" id="fin-ok" style="margin-top:12px">Hecho</button>
  </div>`,document.body.appendChild(o);let n=null,a=null;const s=o.querySelector("#fin-photo"),i=o.querySelector("#fin-photo-input");o.querySelector("#fin-photo-btn")?.addEventListener("click",()=>i.click()),i.addEventListener("change",async()=>{const p=i.files?.[0];if(i.value="",!!p)try{n=await ie(p),a&&URL.revokeObjectURL(a),a=URL.createObjectURL(n),s.innerHTML=`<img class="fin-photo-prev" src="${a}" alt="Foto del entreno"><div><button class="linklike small" id="fin-photo-del" type="button">Quitar foto</button></div>`,s.querySelector("#fin-photo-del")?.addEventListener("click",()=>{n=null,a&&(URL.revokeObjectURL(a),a=null),s.innerHTML=`<button class="btn small" id="fin-photo-btn2" type="button"><span class="inl-ic">${M.camera}</span>Subir foto</button>`,s.querySelector("#fin-photo-btn2")?.addEventListener("click",()=>i.click())})}catch{T("No se pudo procesar la foto")}});const l=p=>{const v=o.querySelector(p);let g=null;return v.querySelectorAll("button").forEach(f=>{f.addEventListener("click",()=>{g=Number(f.dataset.v),v.querySelectorAll("button").forEach(k=>k.classList.toggle("on",k===f))})}),()=>g},m=l("#fin-fatigue-seg"),b=l("#fin-satisfaction-seg");o.querySelector("#fin-ok")?.addEventListener("click",async()=>{try{const p=m(),v=b();if(p!==null&&(e.fatigue=p),v!==null&&(e.satisfaction=v),await y.put("workouts",e),n){const g={workoutId:e.id,blob:n,createdAt:Date.now()};await y.put("workoutPhotos",g)}try{const{autoBackup:g}=await se(async()=>{const{autoBackup:f}=await import("./backup-C1StRYeB.js");return{autoBackup:f}},__vite__mapDeps([0,1,2,3]),import.meta.url);g()}catch{}}catch{}a&&URL.revokeObjectURL(a),o.remove(),U=!1,D("/train")})}async function Ee(e){try{const c=(await y.all("programState")).find(d=>d.active);if(!c)return;let r=!1;for(const d of e.exercises){const u=d.sets.filter(s=>s.done&&s.setType!=="warmup"&&s.weightKg&&s.reps);if(u.length<2)continue;const o=d.targetRepsMax??8,n=u.every(s=>(s.reps??0)>=o),a=c.loads[d.exerciseId]??Math.max(...u.map(s=>s.weightKg??0));n?(c.loads[d.exerciseId]=Math.round((a+2.5)*10)/10,r=!0):d.exerciseId in c.loads||(c.loads[d.exerciseId]=a)}r&&(c.currentDayIndex+=1,await y.put("programState",c),T("Progresión del programa actualizada"))}catch{}}export{M as ICONS,Se as finishWorkout,ke as openExercisePicker,De as renderActiveWorkout,re as renderTrainHome,pe as startFreeWorkout,$e as startRestTimer,O as stopRestTimer,me as workoutFromRoutine};
